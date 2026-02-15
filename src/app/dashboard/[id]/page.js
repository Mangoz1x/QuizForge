"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { FileQuestion, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getQuiz } from "@/lib/storage";
import { FormProvider } from "@/lib/form-context";
import FormBuilder from "@/components/FormBuilder";

export default function QuizEditorPage() {
  const { id } = useParams();

  const { quiz, notFound } = useMemo(() => {
    if (typeof window === "undefined") return { quiz: null, notFound: false };
    const data = getQuiz(id);
    return data ? { quiz: data, notFound: false } : { quiz: null, notFound: true };
  }, [id]);

  if (!quiz && !notFound) return null;

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <FileQuestion size={40} className="text-slate-300 mb-4" />
        <h1 className="text-xl font-semibold text-slate-900 mb-1">Quiz not found</h1>
        <p className="text-sm text-slate-500 mb-6">
          This quiz doesn&apos;t exist or may have been deleted.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to quizzes
        </Link>
      </div>
    );
  }

  return (
    <FormProvider quizId={id} initialData={quiz}>
      <FormBuilder />
    </FormProvider>
  );
}
