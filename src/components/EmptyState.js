import { MessageSquare, ClipboardPaste, Sparkles, PenLine } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 mb-3">
            <MessageSquare size={20} className="text-slate-400" />
          </div>
          <h2 className="text-lg font-medium text-slate-900 mb-1">
            Describe your quiz to get started
          </h2>
          <p className="text-sm text-slate-500">
            Use the chat bar below to tell the AI what you need.
          </p>
        </div>

        <div className="border border-slate-200 rounded-lg bg-white p-4 text-left space-y-3">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Try something like</p>
          <div className="flex items-start gap-3">
            <ClipboardPaste size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-slate-600">
              Paste your class notes and say <span className="font-medium text-slate-700">&ldquo;Create 10 multiple choice questions&rdquo;</span>
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Sparkles size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-slate-600">
              <span className="font-medium text-slate-700">&ldquo;Make a quiz about photosynthesis with 5 questions&rdquo;</span>
            </p>
          </div>
          <div className="flex items-start gap-3">
            <PenLine size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-slate-600">
              <span className="font-medium text-slate-700">&ldquo;Mix of short answer and multiple choice about chapter 4&rdquo;</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
