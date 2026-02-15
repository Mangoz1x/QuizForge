"use client";

import { Loader2, Check, AlertCircle, RefreshCw } from "lucide-react";
import { useForm } from "@/lib/form-context";

export default function SyncIndicator() {
  const { form, exportedFormId, syncStatus, setSyncStatus } = useForm();

  if (!exportedFormId) return null;

  function handleRetry() {
    const hasQuestions = form.questions?.length > 0;
    if (!hasQuestions) return;

    setSyncStatus("syncing");

    fetch("/api/google/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        form,
        mode: "update",
        formId: exportedFormId,
      }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Sync failed");
        setSyncStatus("synced");
      })
      .catch(() => {
        setSyncStatus("error");
      });
  }

  if (syncStatus === "syncing") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-slate-400">
        <Loader2 size={12} className="animate-spin" />
        Syncing...
      </span>
    );
  }

  if (syncStatus === "synced") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-slate-400">
        <Check size={12} className="text-green-600" />
        Synced
      </span>
    );
  }

  if (syncStatus === "error") {
    return (
      <button
        onClick={handleRetry}
        className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 transition-colors cursor-pointer"
      >
        <AlertCircle size={12} />
        Sync failed
        <RefreshCw size={10} />
      </button>
    );
  }

  return null;
}
