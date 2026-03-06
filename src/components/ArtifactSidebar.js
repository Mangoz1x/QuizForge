"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { X, FileText, Copy, Check, Image, FileIcon, Loader2 } from "lucide-react";
import { getFile, SUPPORTED_TYPES } from "@/lib/file-storage";

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function HeaderIcon({ type, isPastedText }) {
  if (isPastedText) return <FileText size={16} className="text-slate-500" />;
  if (SUPPORTED_TYPES.images.includes(type)) return <Image size={16} className="text-slate-500" />;
  if (SUPPORTED_TYPES.pdfs.includes(type)) return <FileIcon size={16} className="text-slate-500" />;
  return <FileText size={16} className="text-slate-500" />;
}

// --- Pasted text content viewer ---

function PastedTextViewer({ content, onContentChange }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [content]);

  return (
    <textarea
      ref={textareaRef}
      value={content}
      onChange={(e) => onContentChange?.(e.target.value)}
      className="w-full text-sm text-slate-700 leading-relaxed bg-transparent resize-none focus:outline-none"
      spellCheck={false}
    />
  );
}

// --- Image viewer ---

function ImageViewer({ data, type, name }) {
  return (
    <div className="flex items-center justify-center">
      <img
        src={`data:${type};base64,${data}`}
        alt={name}
        className="max-w-full rounded-lg border border-slate-200"
      />
    </div>
  );
}

// --- PDF viewer ---

function PdfViewer({ data }) {
  const blobUrl = useMemo(() => {
    const bytes = atob(data);
    const arr = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
    const blob = new Blob([arr], { type: "application/pdf" });
    return URL.createObjectURL(blob);
  }, [data]);

  useEffect(() => {
    return () => URL.revokeObjectURL(blobUrl);
  }, [blobUrl]);

  return (
    <iframe
      src={blobUrl}
      className="w-full h-full border-0"
      title="PDF preview"
    />
  );
}

// --- Text file viewer ---

function TextFileViewer({ data }) {
  const text = atob(data);
  return (
    <pre className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap break-words font-mono">
      {text}
    </pre>
  );
}

export default function ArtifactSidebar({ content, onClose, onContentChange, file }) {
  const [copied, setCopied] = useState(false);
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(!!file);

  const isPastedText = !file;

  // Load full file data from IndexedDB when opening a file
  useEffect(() => {
    if (!file) return;
    let cancelled = false;
    getFile(file.id).then((record) => {
      if (!cancelled) {
        setFileData(record);
        setLoading(false);
      }
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [file]);

  function handleCopy() {
    let textToCopy;
    if (isPastedText) {
      textToCopy = content;
    } else if (fileData) {
      if (SUPPORTED_TYPES.text.includes(file.type)) {
        textToCopy = atob(fileData.data);
      } else {
        // For images/PDFs, copy the file name
        textToCopy = file.name;
      }
    }
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  // Header info
  const title = isPastedText ? "Pasted Content" : file.name;
  const subtitle = isPastedText
    ? `${content.length.toLocaleString()} chars · ${content.split("\n").length.toLocaleString()} line${content.split("\n").length !== 1 ? "s" : ""}`
    : formatFileSize(file.size);

  const isPdf = file && SUPPORTED_TYPES.pdfs.includes(file.type);

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/10 z-40"
        onClick={onClose}
      />
      <div className={`fixed top-0 right-0 bottom-0 w-full bg-white border-l border-slate-200 z-50 flex flex-col animate-slide-in-right ${isPdf ? "max-w-2xl" : "max-w-md"}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100">
              <HeaderIcon type={file?.type} isPastedText={isPastedText} />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-slate-900 truncate">{title}</h3>
              <p className="text-xs text-slate-400">{subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={handleCopy}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
              aria-label="Copy content"
            >
              {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
              aria-label="Close sidebar"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={`flex-1 min-h-0 ${isPdf ? "overflow-hidden" : "overflow-y-auto p-5"}`}>
          {isPastedText ? (
            <PastedTextViewer content={content} onContentChange={onContentChange} />
          ) : loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 size={20} className="text-slate-400 animate-spin" />
            </div>
          ) : fileData ? (
            SUPPORTED_TYPES.images.includes(file.type) ? (
              <ImageViewer data={fileData.data} type={file.type} name={file.name} />
            ) : SUPPORTED_TYPES.pdfs.includes(file.type) ? (
              <PdfViewer data={fileData.data} />
            ) : SUPPORTED_TYPES.text.includes(file.type) ? (
              <TextFileViewer data={fileData.data} />
            ) : (
              <p className="text-sm text-slate-500">Preview not available for this file type.</p>
            )
          ) : (
            <p className="text-sm text-slate-500">Could not load file.</p>
          )}
        </div>
      </div>
    </>
  );
}
