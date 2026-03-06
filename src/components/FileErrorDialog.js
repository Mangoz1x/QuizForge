"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui";

// --- Animated visuals for each error type ---

function FileTooLargeVisual() {
  return (
    <div className="flex items-center justify-center h-44">
      <div className="relative">
        {/* Oversized file icon */}
        <div className="w-20 h-24 border-2 border-slate-200 rounded-lg bg-white flex items-center justify-center relative">
          <div className="absolute -top-2 -right-2 w-7 h-7 bg-red-100 border-2 border-red-200 rounded-full flex items-center justify-center">
            <span className="text-red-500 text-xs font-bold">!</span>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-300">MB</div>
          </div>
        </div>
        {/* Scale/weight bar */}
        <div className="mt-3 flex items-end justify-center gap-1">
          <div className="w-6 h-2 bg-slate-200 rounded-full" />
          <div className="w-6 h-3 bg-slate-200 rounded-full" />
          <div className="w-6 h-5 bg-slate-300 rounded-full" />
          <div className="w-6 h-8 bg-red-200 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function UnsupportedTypeVisual({ ext }) {
  const label = ext ? ext.toUpperCase() : "???";

  return (
    <div className="flex items-center justify-center h-44">
      <div className="relative w-64 h-36">
        {/* Drop zone */}
        <div className="absolute inset-x-8 bottom-2 top-2 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-1.5">
            {["PDF", "JPG", "PNG", "TXT"].map((t) => (
              <span key={t} className="text-[9px] font-bold text-slate-300 bg-slate-100 px-1.5 py-0.5 rounded">
                {t}
              </span>
            ))}
          </div>
          <span className="text-[10px] text-slate-300">Supported formats</span>

          {/* Rejection X — centered inside drop zone */}
          <div className="file-drag-reject absolute left-1/2 top-1/2">
            <div className="w-10 h-10 bg-red-100 border-2 border-red-200 rounded-full flex items-center justify-center">
              <X size={18} className="text-red-400" />
            </div>
          </div>
        </div>

        {/* Animated cursor + file */}
        <div className="file-drag-cursor absolute">
          {/* File being dragged */}
          <div className="w-12 h-14 border-2 border-red-200 rounded-lg bg-red-50 flex items-center justify-center relative">
            <span className="text-[10px] font-bold text-red-400">.{label}</span>
            {/* Corner fold */}
            <div className="absolute top-0 right-0 w-3 h-3 bg-red-100 rounded-bl" />
          </div>
          {/* Cursor */}
          <svg
            width="16"
            height="20"
            viewBox="0 0 16 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute -bottom-2 -right-1"
          >
            <path
              d="M1.5 1L1.5 15L5.5 11L9 18.5L11.5 17.5L8 10.5L13 10.5L1.5 1Z"
              fill="white"
              stroke="#1e293b"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function TooManyFilesVisual() {
  return (
    <div className="flex items-center justify-center h-44">
      <div className="relative">
        {/* Stack of files */}
        <div className="relative w-24 h-20">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="absolute border-2 border-slate-200 rounded bg-white w-16 h-10 flex items-center justify-center"
              style={{
                left: i * 4,
                top: i * 3,
                zIndex: 5 - i,
              }}
            >
              {i === 0 && (
                <div className="flex flex-col gap-0.5">
                  <div className="w-8 h-1 bg-slate-200 rounded-full" />
                  <div className="w-6 h-1 bg-slate-200 rounded-full" />
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Overflow indicator */}
        <div className="mt-3 flex items-center justify-center gap-1.5">
          <div className="text-xs font-bold text-slate-400">10</div>
          <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="w-full h-full bg-red-300 rounded-full" />
          </div>
          <div className="text-xs font-bold text-red-400">max</div>
        </div>
      </div>
    </div>
  );
}

function GenericErrorVisual() {
  return (
    <div className="flex items-center justify-center h-44">
      <div className="relative">
        <div className="w-20 h-24 border-2 border-slate-200 rounded-lg bg-white flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-slate-200 rounded-full flex items-center justify-center">
            <span className="text-slate-300 text-lg font-bold">?</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Error type definitions ---

const ERROR_TYPES = {
  FILE_TOO_LARGE: {
    title: "That file is a bit too heavy",
    Visual: FileTooLargeVisual,
    cta: "Got it",
  },
  UNSUPPORTED_TYPE: {
    title: "We can\u2019t read that file type",
    Visual: UnsupportedTypeVisual,
    cta: "Got it",
  },
  PARTIAL_UNSUPPORTED: {
    title: "Some files couldn\u2019t be added",
    Visual: UnsupportedTypeVisual,
    cta: "Got it",
  },
  PARTIAL_TOO_LARGE: {
    title: "Some files couldn\u2019t be added",
    Visual: FileTooLargeVisual,
    cta: "Got it",
  },
  PARTIAL_DUPLICATE: {
    title: "Some files couldn\u2019t be added",
    Visual: GenericErrorVisual,
    cta: "Got it",
  },
  PARTIAL_GENERIC: {
    title: "Some files couldn\u2019t be added",
    Visual: GenericErrorVisual,
    cta: "Got it",
  },
  TOO_MANY_FILES: {
    title: "That\u2019s a lot of files",
    Visual: TooManyFilesVisual,
    cta: "Got it",
  },
  DUPLICATE: {
    title: "Duplicate file",
    Visual: GenericErrorVisual,
    cta: "Got it",
  },
  GENERIC: {
    title: "Something went wrong",
    Visual: GenericErrorVisual,
    cta: "OK",
  },
};

/**
 * Classify a single validation error string into a base error type key.
 */
export function classifyFileError(message) {
  if (!message) return "GENERIC";
  const lower = message.toLowerCase();
  if (lower.includes("too large") || lower.includes("maximum size")) return "FILE_TOO_LARGE";
  if (lower.includes("unsupported file type")) return "UNSUPPORTED_TYPE";
  if (lower.includes("maximum") && lower.includes("attachment")) return "TOO_MANY_FILES";
  if (lower.includes("more file")) return "TOO_MANY_FILES";
  if (lower.includes("already been attached")) return "DUPLICATE";
  return "GENERIC";
}

/**
 * Build the error dialog state from a list of successes and failures.
 * Returns { message, type, fileName } ready for FileErrorDialog, or null if no errors.
 *
 * Each failure: { name: string, error: string, type: string }
 */
export function buildFileErrorInfo(savedCount, failed) {
  if (failed.length === 0) return null;

  const firstFail = failed[0];
  const isPartial = savedCount > 0;

  // Pick the right dialog type
  let type;
  if (isPartial) {
    const baseType = firstFail.type;
    if (baseType === "UNSUPPORTED_TYPE") type = "PARTIAL_UNSUPPORTED";
    else if (baseType === "FILE_TOO_LARGE") type = "PARTIAL_TOO_LARGE";
    else if (baseType === "DUPLICATE") type = "PARTIAL_DUPLICATE";
    else type = "PARTIAL_GENERIC";
  } else {
    type = firstFail.type;
  }

  // Build the message
  let message;
  if (!isPartial) {
    // All failed
    if (failed.length === 1) {
      message = firstFail.error;
    } else {
      message = `None of your ${failed.length} files could be added. ${firstFail.error}`;
    }
  } else {
    // Partial — some succeeded, some failed
    const successLabel = savedCount === 1 ? "1 file was" : `${savedCount} files were`;
    if (failed.length === 1) {
      message = `${successLabel} attached successfully. ${failed[0].name} was skipped \u2014 ${firstFail.error.toLowerCase().replace(/\.$/, "")}.`;
    } else {
      const failedNames = failed.map((f) => f.name).join(", ");
      message = `${successLabel} attached successfully. ${failed.length} files were skipped (${failedNames}) \u2014 ${firstFail.error.toLowerCase().replace(/\.$/, "")}.`;
    }
  }

  return { message, type, fileName: firstFail.name };
}

/**
 * Extract file extension from a filename string.
 */
export function extractExtension(filename) {
  if (!filename) return null;
  const parts = filename.split(".");
  if (parts.length < 2) return null;
  return parts.pop().toLowerCase();
}

export default function FileErrorDialog({ open, errorType, message, fileName, onClose }) {
  if (!open) return null;

  const config = ERROR_TYPES[errorType] || ERROR_TYPES.GENERIC;
  const ext = extractExtension(fileName);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-slate-900/20 tutorial-backdrop-in"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-lg overflow-hidden tutorial-modal-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors z-10 cursor-pointer"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className="bg-slate-50 border-b border-slate-200">
          <config.Visual ext={ext} />
        </div>

        <div className="p-6">
          <h2 className="text-lg font-medium text-slate-900 mb-2">
            {config.title}
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            {message}
          </p>

          <div className="mt-6">
            <Button variant="primary" size="md" onClick={onClose} className="w-full">
              {config.cta}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
