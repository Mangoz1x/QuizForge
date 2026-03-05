import { cookies } from "next/headers";
import { getTokensFromCookies, refreshAccessToken, buildTokenCookie } from "@/lib/google";
import { isChoiceType } from "@/lib/form-schema";

const FORMS_API = "https://forms.googleapis.com/v1/forms";
const DRIVE_API = "https://www.googleapis.com/drive/v3/files";
const FOLDER_NAME = process.env.NEXT_PUBLIC_APP_NAME;

async function getOrCreateFolder(accessToken) {
  // Search for existing folder
  const query = `name='${FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
  const searchRes = await fetch(
    `${DRIVE_API}?q=${encodeURIComponent(query)}&fields=files(id,name)&pageSize=1`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (searchRes.ok) {
    const data = await searchRes.json();
    if (data.files && data.files.length > 0) {
      return data.files[0].id;
    }
  }

  // Create folder
  const createRes = await fetch(DRIVE_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: FOLDER_NAME,
      mimeType: "application/vnd.google-apps.folder",
    }),
  });

  if (!createRes.ok) return null;

  const folder = await createRes.json();
  return folder.id;
}

async function moveToFolder(accessToken, fileId, folderId) {
  // Get current parents
  const getRes = await fetch(`${DRIVE_API}/${fileId}?fields=parents`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!getRes.ok) return;

  const fileData = await getRes.json();
  const previousParents = (fileData.parents || []).join(",");

  // Move to folder
  await fetch(
    `${DRIVE_API}/${fileId}?addParents=${folderId}&removeParents=${previousParents}`,
    {
      method: "PATCH",
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
}

function mapQuestionType(type) {
  switch (type) {
    case "multiple_choice":
      return { choiceType: "RADIO" };
    case "checkboxes":
      return { choiceType: "CHECKBOX" };
    case "dropdown":
      return { choiceType: "DROP_DOWN" };
    case "short_answer":
      return { paragraph: false };
    case "long_answer":
      return { paragraph: true };
    default:
      return { choiceType: "RADIO" };
  }
}

function buildBatchUpdateRequests(form) {
  const requests = [];

  // Update form info (description + quiz settings)
  requests.push({
    updateFormInfo: {
      info: {
        description: form.description || "",
      },
      updateMask: "description",
    },
  });

  requests.push({
    updateSettings: {
      settings: {
        quizSettings: {
          isQuiz: true,
        },
      },
      updateMask: "quizSettings.isQuiz",
    },
  });

  // Add questions
  form.questions.forEach((q, index) => {
    const isChoice = isChoiceType(q.type);
    const typeConfig = mapQuestionType(q.type);

    let questionItem;

    if (isChoice) {
      const options = (q.options || []).map((opt) => {
        const option = { value: opt.text };
        return option;
      });

      questionItem = {
        question: {
          required: q.required,
          grading: {
            pointValue: q.points,
            correctAnswers: {
              answers: (q.correctAnswers || []).map((answerId) => {
                const opt = (q.options || []).find((o) => o.id === answerId);
                return { value: opt ? opt.text : answerId };
              }),
            },
            whenRight: q.feedback?.correct
              ? { text: q.feedback.correct }
              : undefined,
            whenWrong: q.feedback?.incorrect
              ? { text: q.feedback.incorrect }
              : undefined,
          },
          choiceQuestion: {
            type: typeConfig.choiceType,
            options,
          },
        },
      };
    } else if (typeConfig.paragraph) {
      // Paragraph (long answer) — only generalFeedback supported, no correctAnswers
      const feedback = q.feedback?.correct || q.feedback?.incorrect;
      questionItem = {
        question: {
          required: q.required,
          ...(feedback && {
            grading: {
              pointValue: q.points,
              generalFeedback: { text: feedback },
            },
          }),
          textQuestion: { paragraph: true },
        },
      };
    } else {
      // Short answer — supports correctAnswers + generalFeedback (not whenRight/whenWrong)
      const hasAnswers = (q.correctAnswers || []).length > 0;
      const feedback = q.feedback?.correct || q.feedback?.incorrect;
      const grading = {};
      if (hasAnswers || feedback) {
        grading.pointValue = q.points;
        if (hasAnswers) {
          grading.correctAnswers = {
            answers: q.correctAnswers.map((answer) => ({
              value: answer,
            })),
          };
        }
        if (feedback) {
          grading.generalFeedback = { text: feedback };
        }
      }
      questionItem = {
        question: {
          required: q.required,
          ...(Object.keys(grading).length > 0 && { grading }),
          textQuestion: { paragraph: false },
        },
      };
    }

    requests.push({
      createItem: {
        item: {
          title: q.title,
          questionItem,
        },
        location: { index },
      },
    });
  });

  return requests;
}

async function getValidAccessToken(cookieStore) {
  let tokens = getTokensFromCookies(cookieStore);
  if (!tokens) return null;

  // Refresh if expired or expiring within 5 minutes
  if (tokens.expires_at < Date.now() + 5 * 60 * 1000) {
    try {
      tokens = await refreshAccessToken(tokens.refresh_token);
      const cookie = buildTokenCookie(tokens);
      const store = await cookies();
      store.set(cookie.name, cookie.value, {
        httpOnly: cookie.httpOnly,
        secure: cookie.secure,
        sameSite: cookie.sameSite,
        maxAge: cookie.maxAge,
        path: cookie.path,
      });
    } catch {
      return null;
    }
  }

  return tokens.access_token;
}

async function createForm(accessToken, form) {
  const title = form.title || "Untitled Quiz";

  // Step 1: Create empty form with title
  const createRes = await fetch(FORMS_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      info: { title, documentTitle: title },
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    if (createRes.status === 401) {
      throw { status: 401, message: "Google authentication expired" };
    }
    throw new Error(err.error?.message || "Failed to create form");
  }

  const createdForm = await createRes.json();
  const formId = createdForm.formId;

  // Step 2: Batch update to add questions, enable quiz mode, set grading
  const batchRequests = buildBatchUpdateRequests(form);

  const updateRes = await fetch(`${FORMS_API}/${formId}:batchUpdate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ requests: batchRequests }),
  });

  if (!updateRes.ok) {
    const err = await updateRes.json().catch(() => ({}));
    throw new Error(err.error?.message || "Failed to update form");
  }

  // Step 3: Move to QuizForge folder in Drive
  const folderId = await getOrCreateFolder(accessToken);
  if (folderId) {
    await moveToFolder(accessToken, formId, folderId);
  }

  return { url: `https://docs.google.com/forms/d/${formId}/edit`, formId };
}

async function updateForm(accessToken, formId, form) {
  // Step 1: Get existing form to find current items
  const getRes = await fetch(`${FORMS_API}/${formId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!getRes.ok) {
    const err = await getRes.json().catch(() => ({}));
    if (getRes.status === 401) {
      throw { status: 401, message: "Google authentication expired" };
    }
    throw new Error(err.error?.message || "Failed to fetch existing form");
  }

  const existingForm = await getRes.json();
  const existingItems = existingForm.items || [];

  // Step 2: Delete all existing items (in reverse order to avoid index shifting)
  if (existingItems.length > 0) {
    const deleteRequests = [];
    for (let i = existingItems.length - 1; i >= 0; i--) {
      deleteRequests.push({ deleteItem: { location: { index: i } } });
    }

    const deleteRes = await fetch(`${FORMS_API}/${formId}:batchUpdate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requests: deleteRequests }),
    });

    if (!deleteRes.ok) {
      const err = await deleteRes.json().catch(() => ({}));
      throw new Error(err.error?.message || "Failed to clear existing form");
    }
  }

  // Step 3: Re-add all current questions + update form info
  const batchRequests = buildBatchUpdateRequests(form);

  // Also update the title
  batchRequests.unshift({
    updateFormInfo: {
      info: { title: form.title || "Untitled Quiz" },
      updateMask: "title",
    },
  });

  const updateRes = await fetch(`${FORMS_API}/${formId}:batchUpdate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ requests: batchRequests }),
  });

  if (!updateRes.ok) {
    const err = await updateRes.json().catch(() => ({}));
    throw new Error(err.error?.message || "Failed to update form");
  }

  return { url: `https://docs.google.com/forms/d/${formId}/edit`, formId };
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const accessToken = await getValidAccessToken(cookieStore);

    if (!accessToken) {
      return Response.json(
        { error: "Google authentication required" },
        { status: 401 }
      );
    }

    const { form, mode = "create", formId } = await request.json();

    if (!form || !form.questions || form.questions.length === 0) {
      return Response.json(
        { error: "Form must have at least one question" },
        { status: 400 }
      );
    }

    let result;

    if (mode === "update" && formId) {
      result = await updateForm(accessToken, formId, form);
    } else {
      result = await createForm(accessToken, form);
    }

    return Response.json(result);
  } catch (err) {
    if (err.status === 401) {
      return Response.json(
        { error: err.message || "Google authentication expired" },
        { status: 401 }
      );
    }
    return Response.json(
      { error: err.message || "Export failed" },
      { status: 500 }
    );
  }
}
