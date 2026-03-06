"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, FileText, Trash2 } from "lucide-react";
import { getAllQuizzes, createQuiz, deleteQuiz } from "@/lib/storage";
import TutorialDialog from "@/components/TutorialDialog";

function formatDate(timestamp) {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function DashboardPage() {
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);

  const quizzes = useMemo(() => {
    if (typeof window === "undefined") return [];
    return getAllQuizzes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  function handleCreate() {
    const id = createQuiz();
    router.push(`/dashboard/${id}`);
  }

  async function handleDelete(e, id) {
    e.stopPropagation();
    await deleteQuiz(id);
    setRefreshKey((k) => k + 1);
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <TutorialDialog />
      <div className="mx-auto max-w-xl">
        {quizzes.length === 0 ? (
          <div className="flex items-center justify-center min-h-[70vh]">
            <div className="border border-slate-200 rounded-lg bg-white p-10 w-full max-w-md text-center">
              <FileText size={36} className="text-slate-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                No quizzes yet
              </h2>
              <p className="text-base text-slate-500 mb-8 leading-relaxed">
                Paste your class material, generate questions with AI, and
                export straight to Google Forms.
              </p>
              <button
                onClick={handleCreate}
                className="flex items-center justify-center gap-2 w-full px-5 py-3 text-base font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Plus size={18} />
                Create quiz
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-semibold text-slate-900">Your Quizzes</h1>
              <button
                onClick={handleCreate}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Plus size={16} />
                New Quiz
              </button>
            </div>
            {quizzes.map((quiz) => (
              <button
                key={quiz.id}
                onClick={() => router.push(`/dashboard/${quiz.id}`)}
                className="flex items-center gap-4 px-5 py-4 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors cursor-pointer text-left w-full group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {quiz.title}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {quiz.questionCount} question{quiz.questionCount !== 1 ? "s" : ""}
                    {quiz.updatedAt && <> &middot; {formatDate(quiz.updatedAt)}</>}
                  </p>
                </div>
                <span
                  onClick={(e) => handleDelete(e, quiz.id)}
                  className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                  role="button"
                  aria-label="Delete quiz"
                >
                  <Trash2 size={15} />
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
