/**
 * Attempt to repair and parse partial JSON by closing open strings,
 * brackets, and braces. Returns the parsed object or null.
 */
function repairAndParse(partial) {
  let inString = false;
  let escape = false;
  const stack = [];

  for (let i = 0; i < partial.length; i++) {
    const ch = partial[i];
    if (escape) { escape = false; continue; }
    if (ch === "\\" && inString) { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === "{") stack.push("{");
    else if (ch === "[") stack.push("[");
    else if (ch === "}" || ch === "]") stack.pop();
  }

  let repaired = partial;
  if (inString) repaired += '"';
  while (stack.length > 0) {
    const open = stack.pop();
    repaired += open === "{" ? "}" : "]";
  }

  try { return JSON.parse(repaired); }
  catch { return null; }
}

/**
 * Check if a question object has all required fields to display.
 */
function isQuestionComplete(q) {
  return (
    q != null &&
    q.id != null &&
    q.type != null &&
    q.title != null &&
    q.required != null &&
    Array.isArray(q.correctAnswers) &&
    q.points != null &&
    q.feedback != null &&
    q.feedback.correct != null &&
    q.feedback.incorrect != null
  );
}

/**
 * Unescape a JSON string value (handles \n, \t, \", \\).
 */
function unescapeJsonString(str) {
  try {
    return JSON.parse('"' + str + '"');
  } catch {
    return str
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "\t")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\");
  }
}

/**
 * Send a chat message and stream the response incrementally.
 *
 * Callbacks:
 *   onTextUpdate(messageText)  — called as the AI message text builds up
 *   onFormMeta({ title, description }) — called when form title/description are parsed
 *   onQuestion(question) — called when a complete question is parsed
 *
 * Returns the final { message, form } result.
 */
export async function sendChatMessage({
  messages,
  form,
  signal,
  onTextUpdate,
  onFormMeta,
  onQuestion,
  onQuestionModified,
}) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, form }),
    signal,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed (${res.status})`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let lineBuffer = "";
  let accumulated = "";
  let result = null;
  let lastMessageText = "";
  let formMetaSent = false;
  const sentQuestionIds = new Set();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    lineBuffer += decoder.decode(value, { stream: true });
    const lines = lineBuffer.split("\n");
    lineBuffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const raw = line.slice(6);
      if (raw === "[DONE]") continue;

      let event;
      try { event = JSON.parse(raw); }
      catch { continue; }

      if (event.type === "delta") {
        accumulated += event.data;

        // Extract message text via regex (fast, runs on every delta for smooth streaming)
        const fullMatch = accumulated.match(/"message"\s*:\s*"((?:[^"\\]|\\.)*)"/);
        if (fullMatch) {
          const text = unescapeJsonString(fullMatch[1]);
          if (text !== lastMessageText) {
            lastMessageText = text;
            onTextUpdate?.(text);
          }
        } else {
          const partialMatch = accumulated.match(/"message"\s*:\s*"((?:[^"\\]|\\.)*)/);
          if (partialMatch) {
            const text = unescapeJsonString(partialMatch[1]);
            if (text !== lastMessageText) {
              lastMessageText = text;
              onTextUpdate?.(text);
            }
          }
        }

        // Try repair-parse for form data only when we see a closing brace
        if (event.data.includes("}")) {
          const parsed = repairAndParse(accumulated);
          if (parsed?.form) {
            if (!formMetaSent && parsed.form.title) {
              onFormMeta?.({
                title: parsed.form.title,
                description: parsed.form.description || "",
              });
              formMetaSent = true;
            }

            if (parsed.form.questions) {
              for (const q of parsed.form.questions) {
                if (isQuestionComplete(q) && !sentQuestionIds.has(q.id)) {
                  // Check if this is a modified existing question
                  const existing = form.questions?.find((eq) => eq.id === q.id);
                  if (existing && JSON.stringify(existing) !== JSON.stringify(q)) {
                    onQuestionModified?.(q.id);
                  }
                  onQuestion?.(q);
                  sentQuestionIds.add(q.id);
                }
              }
            }
          }
        }
      } else if (event.type === "done") {
        result = event.data;
      } else if (event.type === "error") {
        throw new Error(event.data);
      }
    }
  }

  if (!result) {
    throw new Error("No response received");
  }

  return result;
}
