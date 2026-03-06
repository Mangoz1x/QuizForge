"use client";

import { Loader2 } from "lucide-react";
import { useForm } from "@/lib/form-context";
import QuestionCard from "@/components/QuestionCard";
import EmptyState from "@/components/EmptyState";

export default function FormPreview({ onFilesSelected }) {
  const { form, streaming } = useForm();
  const hasQuestions = form.questions.length > 0;

  return (
    <div className="h-full overflow-y-auto px-4 py-6 pb-40">
      <div className="mx-auto max-w-2xl flex flex-col gap-4">
        {streaming && hasQuestions && (
          <div className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 border border-slate-200 rounded-lg">
            <Loader2 size={16} className="text-slate-400 animate-spin" />
            <span className="text-sm text-slate-500">AI is updating your quiz...</span>
          </div>
        )}

        {!hasQuestions ? (
          streaming ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 size={24} className="text-slate-400 animate-spin" />
              <span className="text-sm text-slate-500">Building your quiz...</span>
            </div>
          ) : (
            <EmptyState onFilesSelected={onFilesSelected} />
          )
        ) : (
          form.questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              index={index}
            />
          ))
        )}
      </div>
    </div>
  );
}
