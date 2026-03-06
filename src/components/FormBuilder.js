"use client";

import { Suspense, useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, Upload } from "lucide-react";
import { useForm } from "@/lib/form-context";
import { validateFile, saveFile, hashFileContent, findByHash, MAX_FILES } from "@/lib/file-storage";
import FileErrorDialog, { classifyFileError, buildFileErrorInfo } from "@/components/FileErrorDialog";
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
  const [isDragging, setIsDragging] = useState(false);
  const [dropError, setDropError] = useState(null); // { message, type }
  const dragCountRef = useRef(0);
  const addFilesRef = useRef(null);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCountRef.current++;
    if (dragCountRef.current === 1) {
      // Only show overlay if dragging files
      if (e.dataTransfer.types.includes("Files")) {
        setIsDragging(true);
        setDropError(null);
      }
    }
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCountRef.current--;
    if (dragCountRef.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const processAndAddFiles = useCallback(async (fileList) => {
    const saved = [];
    const failed = [];

    const batchHashes = new Set();

    for (const file of fileList.slice(0, MAX_FILES)) {
      const validation = validateFile(file);
      if (!validation.valid) {
        failed.push({ name: file.name, error: validation.error, type: classifyFileError(validation.error) });
        continue;
      }
      try {
        const hash = await hashFileContent(file);

        // Check against other files in this batch
        const existingInBatch = batchHashes.has(hash);
        // Check against files already in IndexedDB (attached via ChatBar)
        const existingInDB = !existingInBatch ? await findByHash(hash) : null;

        if (existingInBatch || existingInDB) {
          failed.push({ name: file.name, error: "This file has already been attached.", type: "DUPLICATE" });
          continue;
        }

        batchHashes.add(hash);
        const record = await saveFile(file);
        saved.push({
          id: record.id,
          name: record.name,
          type: record.type,
          size: record.size,
          hash: record.hash,
          preview: record.preview,
        });
      } catch {
        failed.push({ name: file.name, error: "Failed to process file.", type: "GENERIC" });
      }
    }

    if (saved.length > 0 && addFilesRef.current) {
      addFilesRef.current(saved);
    }

    const errorInfo = buildFileErrorInfo(saved.length, failed);
    if (errorInfo) {
      setDropError(errorInfo);
    }
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCountRef.current = 0;
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    processAndAddFiles(files);
  }, [processAndAddFiles]);

  return (
    <div
      className="flex flex-col h-screen"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <EditorTutorialDialog />

      {/* Drag-and-drop overlay */}
      {isDragging && (
        <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center gap-3 p-8 border-2 border-dashed border-slate-300 rounded-2xl">
            <Upload size={32} className="text-slate-400" />
            <div className="text-center">
              <p className="text-sm font-medium text-slate-700">Drop files here</p>
              <p className="text-xs text-slate-400 mt-1">PDF, images, or text files</p>
            </div>
          </div>
        </div>
      )}

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
        <FormPreview onFilesSelected={processAndAddFiles} />
        <div className="absolute bottom-4 left-0 right-0 px-4 pointer-events-none z-10">
          <div className="mx-auto max-w-xl pointer-events-auto">
            <ChatBar addFilesRef={addFilesRef} />
          </div>
        </div>
      </div>

      <FileErrorDialog
        open={!!dropError}
        errorType={dropError?.type}
        message={dropError?.message}
        fileName={dropError?.fileName}
        onClose={() => setDropError(null)}
      />
    </div>
  );
}
