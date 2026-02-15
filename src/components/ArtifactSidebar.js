"use client";

import { useState, useRef, useEffect } from "react";
import { X, FileText, Copy, Check } from "lucide-react";

export default function ArtifactSidebar({ content, onClose, onContentChange }) {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);
  const charCount = content.length;
  const lineCount = content.split("\n").length;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [content]);

  function handleCopy() {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleChange(e) {
    onContentChange?.(e.target.value);
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/10 z-40"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white border-l border-slate-200 z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100">
              <FileText size={16} className="text-slate-500" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-900">Pasted Content</h3>
              <p className="text-xs text-slate-400">
                {charCount.toLocaleString()} chars · {lineCount.toLocaleString()} line{lineCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
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
        <div className="flex-1 overflow-y-auto p-5">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            className="w-full text-sm text-slate-700 leading-relaxed bg-transparent resize-none focus:outline-none"
            spellCheck={false}
          />
        </div>
      </div>
    </>
  );
}
