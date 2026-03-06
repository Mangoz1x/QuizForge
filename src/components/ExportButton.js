"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useParams } from "next/navigation";
import {
  FileUp,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { useForm } from "@/lib/form-context";
import { Button, Callout } from "@/components/ui";
import ExportTutorialDialog, { EXPORT_TUTORIAL_STORAGE_KEY } from "@/components/ExportTutorialDialog";

const EXPORT_TIP_STORAGE_KEY = "quizforge_export_tip_seen";

export default function ExportButton() {
  const {
    form,
    streaming,
    googleConnected,
    setGoogleConnected,
    exportedFormId,
    exportedFormUrl,
    setExportInfo,
  } = useForm();
  const [exporting, setExporting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showExportTip, setShowExportTip] = useState(false);
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
      if (!localStorage.getItem(EXPORT_TIP_STORAGE_KEY)) {
        setShowExportTip(true);
      }
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

  function dismissExportTip() {
    setShowExportTip(false);
    localStorage.setItem(EXPORT_TIP_STORAGE_KEY, "1");
  }

  useEffect(() => {
    if (!showExportTip) return;
    const timer = setTimeout(dismissExportTip, 30000);
    return () => clearTimeout(timer);
  }, [showExportTip]);

  // Already exported — show open form link
  if (isExported) {
    return (
      <div className="relative">
        <a
          href={exportedFormUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-lg transition-colors"
        >
          Open Form
          <ExternalLink size={14} />
        </a>
        {showExportTip && (
          <div className="absolute left-0 top-full mt-2 w-64 z-20">
            <Callout onDismiss={dismissExportTip} arrowPosition="left" arrowDirection="up">
              <div className="pr-5">
                <p className="text-sm font-medium text-blue-900 mb-0.5">Your Google Form is ready</p>
                <p className="text-xs text-blue-700/70 leading-relaxed">
                  Click &ldquo;Open Form&rdquo; to view it in Google Forms. Any edits you make here will automatically sync.
                </p>
              </div>
            </Callout>
          </div>
        )}
      </div>
    );
  }

  // Not exported yet — show export button
  const disabled = !hasQuestions || exporting || streaming;
  const label = exporting ? "Exporting..." : "Export to Google Forms";

  return (
    <>
      <div className="relative flex items-center gap-2 group">
        {errorMsg && <span className="text-xs text-red-600">{errorMsg}</span>}
        <Button
          variant="secondary"
          size="sm"
          icon={exporting ? Loader2 : FileUp}
          iconClassName={exporting ? "animate-spin" : undefined}
          disabled={disabled}
          onClick={handleExport}
        >
          {label}
        </Button>
        {disabled && !exporting && (
          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1.5 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {streaming ? "Wait for quiz to finish generating" : "Add questions before exporting"}
          </div>
        )}
      </div>
      <ExportTutorialDialog
        open={showTutorial}
        onClose={handleTutorialClose}
      />
    </>
  );
}
