export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: "multiple_choice",
  CHECKBOXES: "checkboxes",
  DROPDOWN: "dropdown",
  SHORT_ANSWER: "short_answer",
  LONG_ANSWER: "long_answer",
};

export const QUESTION_TYPE_LABELS = {
  [QUESTION_TYPES.MULTIPLE_CHOICE]: "Multiple Choice",
  [QUESTION_TYPES.CHECKBOXES]: "Checkboxes",
  [QUESTION_TYPES.DROPDOWN]: "Dropdown",
  [QUESTION_TYPES.SHORT_ANSWER]: "Short Answer",
  [QUESTION_TYPES.LONG_ANSWER]: "Long Answer",
};

export const CHOICE_TYPES = [
  QUESTION_TYPES.MULTIPLE_CHOICE,
  QUESTION_TYPES.CHECKBOXES,
  QUESTION_TYPES.DROPDOWN,
];

export function isChoiceType(type) {
  return CHOICE_TYPES.includes(type);
}

export function createEmptyForm() {
  return {
    title: "Untitled Quiz",
    description: "",
    questions: [],
  };
}

// JSON Schema for Claude's structured output
export const FORM_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    message: {
      type: "string",
      description: "A concise present-tense message shown while changes are being applied (e.g. 'Swapping question 3 with a new one...')",
    },
    completionMessage: {
      type: "string",
      description: "A concise past-tense follow-up shown after changes are applied (e.g. 'Done! I\\'ve swapped question 3 with a new economics question.')",
    },
    form: {
      type: "object",
      properties: {
        title: { type: "string" },
        description: { type: "string" },
        questions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string", description: "Unique ID in q_N format" },
              type: {
                type: "string",
                enum: Object.values(QUESTION_TYPES),
              },
              title: { type: "string" },
              required: { type: "boolean" },
              options: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string", description: "Unique ID in o_N_M format" },
                    text: { type: "string" },
                  },
                  required: ["id", "text"],
                  additionalProperties: false,
                },
              },
              correctAnswers: {
                type: "array",
                items: { type: "string" },
                description: "For choice types: option IDs (e.g. ['o_1_2']). For short_answer/long_answer: the actual correct answer text (e.g. ['Photosynthesis is the process by which plants convert sunlight into energy']). Must be the factual answer, NOT feedback or praise.",
              },
              points: { type: "number" },
              feedback: {
                type: "object",
                properties: {
                  correct: { type: "string", description: "Feedback shown when the student answers correctly (e.g. 'Great job! That\\'s the right answer.')" },
                  incorrect: { type: "string", description: "Feedback shown when the student answers incorrectly (e.g. 'Not quite. The correct answer is...')" },
                },
                required: ["correct", "incorrect"],
                additionalProperties: false,
              },
            },
            required: ["id", "type", "title", "required", "correctAnswers", "points", "feedback"],
            additionalProperties: false,
          },
        },
      },
      required: ["title", "description", "questions"],
      additionalProperties: false,
    },
  },
  required: ["message", "completionMessage", "form"],
  additionalProperties: false,
};
