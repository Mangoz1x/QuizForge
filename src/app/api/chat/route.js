import Anthropic from "@anthropic-ai/sdk";
import { FORM_RESPONSE_SCHEMA } from "@/lib/form-schema";

const client = new Anthropic();

function buildSystemPrompt(form) {
  return `You are a quiz-building assistant for teachers. You help create and modify Google Forms quizzes.

Current form state:
${JSON.stringify(form, null, 2)}

Instructions:
- Return the COMPLETE updated form with ALL questions (not just changes).
- When modifying existing questions, preserve their existing IDs.
- For new questions, generate IDs in "q_N" format (e.g., q_1, q_2, ...). Pick N so it doesn't collide with existing IDs.
- For new options, generate IDs in "o_N_M" format where N is the question number and M is the option number.
- Default settings for new questions: required=true, points=1, type="multiple_choice".
- Always provide correct answers and feedback (both correct and incorrect) for every question.
- Include the "options" array only for choice-type questions (multiple_choice, checkboxes, dropdown). Omit it for short_answer and long_answer.
- For short_answer and long_answer questions, leave correctAnswers as an empty array []. Instead, put the correct answer text in feedback.correct (e.g. "Photosynthesis is the process by which plants convert light energy into chemical energy"). Set feedback.incorrect to an empty string "". This matches how Google Forms handles answer keys for text questions.
- The "message" field is shown WHILE changes are being applied. Write it in present tense (e.g. "Swapping question 2 with a new one..." or "Creating a 5-question quiz about photosynthesis...").
- The "completionMessage" field is shown AFTER changes are done. Write it in past tense as a confirmation (e.g. "Done! I've swapped question 2 with a new question about cellular respiration." or "All set! Here's your 5-question quiz on photosynthesis.").
- If the teacher pastes content (notes, textbook material, etc.), generate quiz questions based on that content.
- If the teacher asks to modify specific questions, update only those while keeping the rest unchanged.`;
}

export async function POST(request) {
  try {
    const { messages, form } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "Messages are required" }, { status: 400 });
    }

    // Build Claude messages from chat history
    const claudeMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.role === "assistant" && msg.form
        ? JSON.stringify({ message: msg.content, form: msg.form })
        : msg.content,
    }));

    const stream = client.messages.stream({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 16384,
      system: buildSystemPrompt(form),
      messages: claudeMessages,
      output_config: {
        format: {
          type: "json_schema",
          schema: FORM_RESPONSE_SCHEMA,
        },
      },
    });

    // Create SSE response
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          stream.on("text", (delta) => {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: "delta", data: delta })}\n\n`)
            );
          });

          const finalMessage = await stream.finalMessage();
          const text = finalMessage.content[0].text;
          const parsed = JSON.parse(text);

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "done", data: parsed })}\n\n`
            )
          );
          controller.close();
        } catch (err) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "error", data: err.message })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    return Response.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
