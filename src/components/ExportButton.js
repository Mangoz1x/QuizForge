"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useParams } from "next/navigation";
import {
  FileUp,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { useForm } from "@/lib/form-context";
import { Button } from "@/components/ui";
import ExportTutorialDialog, { EXPORT_TUTORIAL_STORAGE_KEY } from "@/components/ExportTutorialDialog";

export default function ExportButton() {
  const {
    form,
    googleConnected,
    setGoogleConnected,
    exportedFormId,
    exportedFormUrl,
    setExportInfo,
  } = useForm();
  const [exporting, setExporting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const searchParams = useSearchParams();
  const params = useParams();
  const autoExportRef = useRef(false);

  const hasQuestions = form.questions.length > 0;
  const isExported = !!exportedFormId;

  useEffect(() => {
    if (searchParams.get("google") === "connected") {
      setGoogleConnected(true);
      if (!autoExportRef.current && hasQuestions) {
        autoExportRef.current = true;
        doExport();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, setGoogleConnected, hasQuestions]);

  async function doExport() {
    setExporting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/google/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          setGoogleConnected(false);
          window.location.href = `/api/google/auth?quizId=${params.id || ""}`;
          return;
        }
        throw new Error(data.error || "Export failed");
      }

      setExportInfo({
        exportedFormId: data.formId,
        exportedFormUrl: data.url,
      });
      setExporting(false);
    } catch (err) {
      setErrorMsg(err.message);
      setExporting(false);
    }
  }

  function handleExport() {
    if (!hasQuestions) return;

    // Show tutorial on first-ever export before proceeding
    if (!localStorage.getItem(EXPORT_TUTORIAL_STORAGE_KEY)) {
      setShowTutorial(true);
      return;
    }

    if (!googleConnected) {
      window.location.href = `/api/google/auth?quizId=${params.id || ""}`;
      return;
    }

    doExport();
  }

  function handleTutorialClose() {
    setShowTutorial(false);

    // Now proceed with the actual export
    if (!googleConnected) {
      window.location.href = `/api/google/auth?quizId=${params.id || ""}`;
      return;
    }

    doExport();
  }

  // Already exported — show open form link
  if (isExported) {
    return (
      <a
        href={exportedFormUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-lg transition-colors"
      >
        Open Form
        <ExternalLink size={14} />
      </a>
    );
  }

  // Not exported yet — show export button
  return (
    <>
      <div className="flex items-center gap-2">
        {errorMsg && <span className="text-xs text-red-600">{errorMsg}</span>}
        <Button
          variant="secondary"
          size="sm"
          icon={exporting ? Loader2 : FileUp}
          disabled={!hasQuestions || exporting}
          onClick={handleExport}
        >
          {exporting ? "Exporting..." : "Export"}
        </Button>
      </div>
      <ExportTutorialDialog
        open={showTutorial}
        onClose={handleTutorialClose}
      />
    </>
  );
}
