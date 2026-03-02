export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <p className="text-base text-slate-500 mb-5">
        Describe your quiz in the chat bar below
      </p>
      <div className="border border-slate-200 rounded-2xl bg-white p-5 w-full max-w-xl space-y-3">
        <p className="text-sm text-slate-400">Try something like...</p>
        <p className="text-sm text-slate-600">
          &ldquo;Create 10 multiple choice questions from my notes&rdquo;
        </p>
        <p className="text-sm text-slate-600">
          &ldquo;Make a quiz about photosynthesis&rdquo;
        </p>
        <p className="text-sm text-slate-600">
          &ldquo;Mix of short answer and multiple choice about chapter 4&rdquo;
        </p>
      </div>
    </div>
  );
}
