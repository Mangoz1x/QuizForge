"use client";

import { useForm } from "@/lib/form-context";
import { Circle, Square, ChevronDown, Check } from "lucide-react";

const TYPE_ICONS = {
  multiple_choice: Circle,
  checkboxes: Square,
  dropdown: ChevronDown,
};

export default function QuestionOptions({ question }) {
  const { updateQuestion } = useForm();

  if (!question.options || question.options.length === 0) return null;

  const Icon = TYPE_ICONS[question.type] || Circle;

  function handleOptionTextChange(optionId, text) {
    const options = question.options.map((o) =>
      o.id === optionId ? { ...o, text } : o
    );
    updateQuestion(question.id, { options });
  }

  function handleCorrectToggle(optionId) {
    const isCorrect = question.correctAnswers?.includes(optionId);
    let correctAnswers;

    if (question.type === "multiple_choice" || question.type === "dropdown") {
      correctAnswers = isCorrect ? [] : [optionId];
    } else {
      correctAnswers = isCorrect
        ? question.correctAnswers.filter((id) => id !== optionId)
        : [...(question.correctAnswers || []), optionId];
    }

    updateQuestion(question.id, { correctAnswers });
  }

  return (
    <div className="flex flex-col gap-2">
      {question.options.map((option) => {
        const isCorrect = question.correctAnswers?.includes(option.id);
        return (
          <div
            key={option.id}
            className={`flex items-center gap-3 px-3.5 py-3 rounded-lg border transition-colors ${
              isCorrect
                ? "bg-green-50/60 border-green-200"
                : "bg-slate-50/50 border-slate-100 hover:border-slate-200"
            }`}
          >
            <button
              type="button"
              onClick={() => handleCorrectToggle(option.id)}
              className={`flex-shrink-0 transition-colors cursor-pointer ${
                isCorrect
                  ? "text-green-500"
                  : "text-slate-300 hover:text-slate-400"
              }`}
              title={isCorrect ? "Marked as correct" : "Mark as correct"}
            >
              <Icon size={18} />
            </button>
            <input
              type="text"
              value={option.text}
              onChange={(e) =>
                handleOptionTextChange(option.id, e.target.value)
              }
              className={`flex-1 text-sm bg-transparent border-none outline-none placeholder:text-slate-300 focus:ring-0 p-0 ${
                isCorrect ? "text-green-800 font-medium" : "text-slate-700"
              }`}
              placeholder="Option text"
            />
            {isCorrect && (
              <Check size={15} className="text-green-500 flex-shrink-0" />
            )}
          </div>
        );
      })}
    </div>
  );
}
