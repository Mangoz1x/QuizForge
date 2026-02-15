"use client";

import { useState } from "react";
import {
  FolderOpen,
  RefreshCw,
  ExternalLink,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui";

const STORAGE_KEY = "quizforge_export_tutorial_seen";

// Visual: folder with form inside + sync arrows
function ExportVisual() {
  return (
    <div className="flex items-center justify-center h-44">
      <div className="flex flex-col items-center gap-3">
        {/* Folder */}
        <div className="relative tutorial-msg-1">
          <div className="w-52 border-2 border-slate-200 rounded-lg bg-white">
            {/* Folder tab */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-100">
              <FolderOpen size={14} className="text-slate-400" />
              <span className="text-xs font-medium text-slate-600">QuizForge</span>
            </div>
            {/* Form inside folder */}
            <div className="p-2.5 space-y-1.5">
              <div className="flex items-center gap-2 px-2 py-1.5 bg-slate-50 rounded-md tutorial-msg-2">
                <div className="w-4 h-5 border border-slate-300 rounded-sm bg-white flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-1.5 w-24 bg-slate-200 rounded-full" />
                </div>
                <Check size={10} className="text-green-500 flex-shrink-0" />
              </div>
            </div>
          </div>
        </div>

        {/* Sync indicator */}
        <div className="flex items-center gap-2 tutorial-msg-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 border border-slate-200 rounded-md bg-white">
            <RefreshCw size={10} className="text-slate-400" />
            <span className="text-[10px] text-slate-500">Auto-sync enabled</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <span>App</span>
            <span className="text-slate-300">&rarr;</span>
            <span>Google Forms</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExportTutorialDialog({ open, onClose }) {
  if (!open) return null;

  function handleClose() {
    localStorage.setItem(STORAGE_KEY, "1");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-slate-900/20 tutorial-backdrop-in"
        onClick={handleClose}
      />
      <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-lg overflow-hidden tutorial-modal-in">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors z-10 cursor-pointer"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className="bg-slate-50 border-b border-slate-200">
          <ExportVisual />
        </div>

        <div className="p-6">
          <h2 className="text-lg font-medium text-slate-900 mb-2">
            Export to Google Drive
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-3">
            Your quiz will be saved to the <span className="font-medium text-slate-800">QuizForge</span> folder in your Google Drive as a Google Form.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Any changes you make after exporting — including AI edits — will automatically sync to your Google Form. No need to re-export.
          </p>

          <div className="flex items-center justify-end mt-6">
            <Button
              variant="primary"
              size="sm"
              onClick={handleClose}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { STORAGE_KEY as EXPORT_TUTORIAL_STORAGE_KEY };
