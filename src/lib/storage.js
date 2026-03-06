const STORAGE_PREFIX = "quiz_";

function quizKey(id) {
  return `${STORAGE_PREFIX}${id}`;
}

export function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

export function getQuiz(id) {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(quizKey(id));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getAllQuizzes() {
  if (typeof window === "undefined") return [];
  const quizzes = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_PREFIX)) {
      try {
        const data = JSON.parse(localStorage.getItem(key));
        quizzes.push({
          id: data.id,
          title: data.form?.title || "Untitled Quiz",
          questionCount: data.form?.questions?.length || 0,
          updatedAt: data.updatedAt,
          createdAt: data.createdAt,
        });
      } catch {
        // skip corrupted entries
      }
    }
  }
  return quizzes.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

export function saveQuiz(id, { form, messages }) {
  if (typeof window === "undefined") return;
  const existing = getQuiz(id);
  const data = {
    id,
    form,
    messages,
    createdAt: existing?.createdAt || Date.now(),
    updatedAt: Date.now(),
  };
  localStorage.setItem(quizKey(id), JSON.stringify(data));
}

export async function deleteQuiz(id) {
  if (typeof window === "undefined") return;

  // Clean up any files stored in IndexedDB for this quiz
  const quiz = getQuiz(id);
  if (quiz?.messages) {
    const { deleteFile } = await import("@/lib/file-storage");
    const fileIds = quiz.messages
      .filter((m) => m.fileIds)
      .flatMap((m) => m.fileIds);
    for (const fileId of fileIds) {
      deleteFile(fileId).catch(() => {});
    }
  }

  localStorage.removeItem(quizKey(id));
}

export function createQuiz() {
  const id = generateId();
  saveQuiz(id, {
    form: { title: "Untitled Quiz", description: "", questions: [] },
    messages: [],
  });
  return id;
}

export function getQuizExport(id) {
  if (typeof window === "undefined") return null;
  const quiz = getQuiz(id);
  if (!quiz) return null;
  return quiz.exportedFormId
    ? { exportedFormId: quiz.exportedFormId, exportedFormUrl: quiz.exportedFormUrl }
    : null;
}

export function updateQuizExport(id, { exportedFormId, exportedFormUrl }) {
  if (typeof window === "undefined") return;
  const quiz = getQuiz(id);
  if (!quiz) return;
  const data = { ...quiz, exportedFormId, exportedFormUrl, updatedAt: Date.now() };
  localStorage.setItem(quizKey(id), JSON.stringify(data));
}
