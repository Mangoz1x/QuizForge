"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useForm } from "@/lib/form-context";
import FormPreview from "@/components/FormPreview";
import ChatBar from "@/components/ChatBar";
import ExportButton from "@/components/ExportButton";

import EditorTutorialDialog from "@/components/EditorTutorialDialog";
import SyncIndicator from "@/components/SyncIndicator";

function EditableTitle() {
  const { form, updateFormHeader } = useForm();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(form.title);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  function startEditing() {
    setValue(form.title);
    setEditing(true);
  }

  function commit() {
    const trimmed = value.trim();
    if (trimmed && trimmed !== form.title) {
      updateFormHeader({ title: trimmed });
    }
    setEditing(false);
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") {
            setValue(form.title);
            setEditing(false);
          }
        }}
        className="text-lg font-medium text-slate-900 bg-transparent border-b border-slate-300 outline-none w-full py-0 px-0 leading-snug"
      />
    );
  }

  return (
    <h1
      onClick={startEditing}
      className="text-lg font-medium text-slate-900 truncate cursor-text rounded px-1 -mx-1 hover:bg-slate-50 transition-colors"
      title="Click to rename"
    >
      {form.title}
    </h1>
  );
}

export default function FormBuilder() {
  const { form, error } = useForm();

  return (
    <div className="flex flex-col h-screen">
      <EditorTutorialDialog />
      <div className="flex-shrink-0 border-b border-slate-200 bg-white px-4 py-3">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="flex-shrink-0 p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
              aria-label="Back to quizzes"
            >
              <ChevronLeft size={20} />
            </Link>
            <div className="min-w-0 flex-1">
              <EditableTitle />
              {form.description && (
                <p className="text-sm text-slate-500 truncate">{form.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 ml-8">
            <Suspense fallback={null}>
              <ExportButton />
            </Suspense>
            <SyncIndicator />
          </div>
        </div>
      </div>

      {error && (
        <div className="flex-shrink-0 bg-red-50 border-b border-red-100 px-4 py-2">
          <p className="mx-auto max-w-2xl text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="relative flex-1 min-h-0">
        <FormPreview />
        <div className="absolute bottom-4 left-0 right-0 px-4 pointer-events-none z-10">
          <div className="mx-auto max-w-xl pointer-events-auto">
            <ChatBar />
          </div>
        </div>
      </div>
    </div>
  );
}
