# Form Builder

## What It Does

A chat-based interface that lets teachers describe a quiz in natural language and have an AI build/modify a Google Forms quiz in real-time. Teachers see an editable form preview that updates as the AI responds.

## Flow

1. Teacher lands on `/dashboard` and sees an empty state with a chat bar at the bottom
2. Teacher types a message describing the quiz they want (e.g., "Create a 5-question quiz about photosynthesis")
3. The message is sent to `/api/chat`, which calls Claude with the current form state and chat history
4. Claude returns a structured JSON response containing the complete updated form and a chat message
5. The form preview updates with the new questions, animated in with a slide-up effect
6. Teacher can edit any question inline (title, options, points, type, feedback)
7. Teacher can send follow-up messages to modify the quiz (e.g., "Change question 3 to short answer")
8. When satisfied, teacher clicks Export to create a real Google Form

## Data Model

```js
{
  title: "Untitled Quiz",
  description: "",
  questions: [{
    id: "q_1",                    // Unique ID
    type: "multiple_choice",      // multiple_choice | checkboxes | dropdown | short_answer | long_answer
    title: "Question text",
    required: true,
    options: [                    // Only for choice types
      { id: "o_1_1", text: "Option A" },
      { id: "o_1_2", text: "Option B" },
    ],
    correctAnswers: ["o_1_1"],    // Option IDs (choice) or answer strings (text)
    points: 1,
    feedback: {
      correct: "Correct feedback",
      incorrect: "Incorrect feedback",
    },
  }]
}
```

## Question Types

| Type | Description | Options Array | Correct Answers |
|------|-------------|---------------|-----------------|
| `multiple_choice` | Single-select radio buttons | Yes | Option IDs |
| `checkboxes` | Multi-select checkboxes | Yes | Option IDs |
| `dropdown` | Single-select dropdown | Yes | Option IDs |
| `short_answer` | Single-line text input | No | Answer strings |
| `long_answer` | Multi-line text input | No | Answer strings |

## State Management

React Context + `useReducer` in `src/lib/form-context.js`.

**Actions:**
- `SET_FORM` — Replace entire form (after AI response)
- `UPDATE_FORM_HEADER` — Update title/description
- `UPDATE_QUESTION` — Update a single question by ID
- `DELETE_QUESTION` — Remove a question by ID
- `ADD_MESSAGE` — Append a chat message (capped at 20)
- `SET_STREAMING` — Toggle streaming indicator
- `SET_ERROR` — Set/clear error message
- `SET_GOOGLE_CONNECTED` — Track Google OAuth status

## AI Integration

- **Endpoint**: `POST /api/chat`
- **Input**: `{ messages, form }` — chat history + current form state
- **Model**: Claude Sonnet 4.5 with structured output (`output_config.format`)
- **Output**: SSE stream → final JSON `{ message, form }`
- **Behavior**: AI returns the complete updated form (not diffs). This is simpler and avoids merge conflicts.

Chat history is sent to Claude for context. Assistant messages include the full JSON response so Claude can reason about its previous output. History is capped at 20 messages.

## Files

| File | Purpose |
|------|---------|
| `src/lib/form-schema.js` | Question type constants, structured output JSON schema |
| `src/lib/form-context.js` | React Context + useReducer for form/chat state |
| `src/lib/chat.js` | Client-side helper to POST to `/api/chat` and read SSE stream |
| `src/app/api/chat/route.js` | API route: calls Claude, returns SSE |
| `src/app/dashboard/layout.js` | Wraps page in FormProvider |
| `src/app/dashboard/page.js` | Renders FormBuilder |
| `src/components/FormBuilder.js` | Main layout: top bar + preview + chat bar |
| `src/components/FormPreview.js` | Scrollable form preview area |
| `src/components/FormHeader.js` | Editable form title and description |
| `src/components/QuestionCard.js` | Single question with inline editing |
| `src/components/QuestionOptions.js` | Option rows for choice-type questions |
| `src/components/ChatBar.js` | Bottom chat input with streaming indicator |
| `src/components/EmptyState.js` | Empty state prompt |
| `src/components/ui/Badge.js` | Small label for question type |
| `src/components/ui/Select.js` | Dropdown select for question type picker |
