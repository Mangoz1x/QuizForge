"use client";

import { useRef } from "react";
import { FileText, Image, Upload } from "lucide-react";
import { ALL_ACCEPTED_TYPES } from "@/lib/file-storage";

export default function EmptyState({ onFilesSelected }) {
  const fileInputRef = useRef(null);

  function handleClick() {
    fileInputRef.current?.click();
  }

  function handleChange(e) {
    const files = Array.from(e.target.files);
    if (files.length > 0 && onFilesSelected) {
      onFilesSelected(files);
    }
    e.target.value = "";
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="w-full max-w-md">
        {/* Drop zone visual — clickable */}
        <button
          type="button"
          onClick={handleClick}
          className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-8 mb-6 hover:border-slate-300 hover:bg-slate-50/50 transition-colors cursor-pointer"
        >
          <Upload size={24} className="text-slate-300 mx-auto mb-4" />
          <p className="text-sm font-medium text-slate-500 mb-1">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-slate-400 mb-5">
            Attach class notes, textbook pages, or study guides
          </p>

          {/* Supported file types */}
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-400">
              <FileText size={14} />
              <span className="text-xs">PDF</span>
            </div>
            <div className="w-px h-3 bg-slate-200" />
            <div className="flex items-center gap-1.5 text-slate-400">
              <Image size={14} aria-hidden="true" />
              <span className="text-xs">Images</span>
            </div>
            <div className="w-px h-3 bg-slate-200" />
            <div className="flex items-center gap-1.5 text-slate-400">
              <FileText size={14} />
              <span className="text-xs">Text</span>
            </div>
          </div>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ALL_ACCEPTED_TYPES.join(",")}
          onChange={handleChange}
          className="hidden"
        />

        {/* Prompt hint */}
        <p className="text-xs text-slate-400">
          Then describe your quiz in the chat bar below
        </p>
      </div>
    </div>
  );
}
