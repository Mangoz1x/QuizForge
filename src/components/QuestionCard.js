"use client";

import { Trash2, Check, X, MessageSquare } from "lucide-react";
import { useForm } from "@/lib/form-context";
import { QUESTION_TYPE_LABELS, QUESTION_TYPES, isChoiceType } from "@/lib/form-schema";
import { Select } from "@/components/ui";
import QuestionOptions from "@/components/QuestionOptions";

const typeOptions = Object.entries(QUESTION_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export default function QuestionCard({ question, index }) {
  const { updateQuestion, deleteQuestion, changeQuestionType, highlightedQuestions, pendingQuestions, streaming } = useForm();
  const isHighlighted = highlightedQuestions.includes(question.id);
  const isPending = pendingQuestions.includes(question.id);
  const isChoice = isChoiceType(question.type);

  return (
    <div
      id={`question-${question.id}`}
      className={`relative animate-fade-slide-in ${streaming ? "pointer-events-none" : ""}`}
      style={{ animationDelay: `${index * 75}ms` }}
    >
      {isHighlighted && (
        <div className="absolute -inset-[2px] rounded-[18px] gradient-ring" />
      )}
      {isPending && (
        <div className="absolute -inset-[2px] rounded-[18px] working-ring" />
      )}

      <div className={`relative bg-white border border-slate-200 rounded-2xl transition-opacity ${streaming ? "opacity-60" : ""}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
              {index + 1}
            </span>
            <Select
              value={question.type}
              onChange={(e) => changeQuestionType(question.id, e.target.value)}
              options={typeOptions}
              className="!w-auto !py-1 !px-2 text-xs !rounded-md"
            />
          </div>
          <button
            onClick={() => deleteQuestion(question.id)}
            className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
            aria-label="Delete question"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Question title */}
        <div className="px-5 pb-5">
          <input
            type="text"
            value={question.title}
            onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
            placeholder="Enter your question"
            className="w-full text-base font-medium text-slate-900 bg-transparent border-none outline-none placeholder:text-slate-300 focus:ring-0 p-0"
          />
        </div>

        {/* Answer area */}
        <div className="px-5 pb-5">
          {isChoice ? (
            <QuestionOptions question={question} />
          ) : (
            <div className="border border-dashed border-slate-200 rounded-lg px-4 py-4">
              <span className="text-sm text-slate-400">
                {question.type === QUESTION_TYPES.SHORT_ANSWER
                  ? "Short answer text"
                  : "Long answer text"}
              </span>
            </div>
          )}
        </div>

        {/* Settings bar */}
        <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-slate-500">Points</label>
            <input
              type="number"
              min={0}
              value={question.points}
              onChange={(e) =>
                updateQuestion(question.id, { points: Number(e.target.value) })
              }
              className="w-16 text-xs text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>

          <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer ml-auto">
            <input
              type="checkbox"
              checked={question.required}
              onChange={(e) =>
                updateQuestion(question.id, { required: e.target.checked })
              }
              className="rounded border-slate-300 text-slate-900 focus:ring-slate-400 cursor-pointer"
            />
            Required
          </label>
        </div>

        {/* Feedback */}
        <div className="px-5 py-4 border-t border-slate-100 flex flex-col gap-3">
          {isChoice ? (
            <>
              <div className="flex items-start gap-2.5">
                <Check size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                <input
                  type="text"
                  value={question.feedback?.correct || ""}
                  onChange={(e) =>
                    updateQuestion(question.id, {
                      feedback: { ...question.feedback, correct: e.target.value },
                    })
                  }
                  placeholder="Feedback for correct answer"
                  className="flex-1 text-sm text-slate-600 bg-transparent border-none outline-none placeholder:text-slate-300 focus:ring-0 p-0"
                />
              </div>
              <div className="flex items-start gap-2.5">
                <X size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                <input
                  type="text"
                  value={question.feedback?.incorrect || ""}
                  onChange={(e) =>
                    updateQuestion(question.id, {
                      feedback: { ...question.feedback, incorrect: e.target.value },
                    })
                  }
                  placeholder="Feedback for incorrect answer"
                  className="flex-1 text-sm text-slate-600 bg-transparent border-none outline-none placeholder:text-slate-300 focus:ring-0 p-0"
                />
              </div>
            </>
          ) : (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <MessageSquare size={12} className="text-slate-400" />
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                  Feedback shown to students
                </span>
              </div>
              <textarea
                value={question.feedback?.correct || ""}
                onChange={(e) =>
                  updateQuestion(question.id, {
                    feedback: { ...question.feedback, correct: e.target.value },
                  })
                }
                placeholder="Enter the answer key or feedback students will see after submitting..."
                rows={2}
                className="w-full text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 resize-none placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-400 leading-relaxed"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
