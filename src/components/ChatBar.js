"use client";

import { useState, useRef, useCallback } from "react";
import { SendHorizontal, Square, FileText, X, Image, FileIcon, Paperclip } from "lucide-react";
import { useForm } from "@/lib/form-context";
import { sendChatMessage } from "@/lib/chat";
import { validateFile, saveFile, deleteFile, hashFileContent, findByHash, MAX_FILES, ALL_ACCEPTED_TYPES, SUPPORTED_TYPES } from "@/lib/file-storage";
import ArtifactSidebar from "@/components/ArtifactSidebar";
import ArtifactTip from "@/components/ArtifactTip";
import FileErrorDialog, { classifyFileError, buildFileErrorInfo } from "@/components/FileErrorDialog";

let attachmentCounter = Date.now();

function getFileIcon(type) {
  if (SUPPORTED_TYPES.images.includes(type)) return Image;
  return FileText;
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ChatBar({ addFilesRef }) {
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState([]); // text attachments (pasted)
  const [fileAttachments, setFileAttachments] = useState([]); // file attachments { id, name, type, size, preview }
  const [fileError, setFileError] = useState(null); // { message, type } for dialog
  const [openAttachmentId, setOpenAttachmentId] = useState(null);
  const [tipDismissed, setTipDismissed] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const abortRef = useRef(null);
  const baselineFormRef = useRef(null);
  const pendingIdsRef = useRef([]);
  const {
    form,
    messages,
    streaming,
    streamingMessage,
    addMessage,
    setForm,
    setStreaming,
    setStreamingMessage,
    setError,
    updateFormHeader,
    appendQuestion,
    highlightQuestions,
    clearHighlights,
    pushHistory,
    setPendingQuestions,
    clearPending,
  } = useForm();

  // Allow parent (FormBuilder) to add files via drag-and-drop
  const addFiles = useCallback((files) => {
    setFileAttachments((prev) => {
      const remaining = MAX_FILES - prev.length - attachments.length;
      return [...prev, ...files.slice(0, Math.max(0, remaining))];
    });
  }, [attachments.length]);

  // Register the addFiles function on the ref so FormBuilder can call it
  if (addFilesRef) addFilesRef.current = addFiles;

  const hasAttachments = attachments.length > 0;
  const hasFileAttachments = fileAttachments.length > 0;
  const hasAnyAttachments = hasAttachments || hasFileAttachments;
  const totalAttachmentCount = attachments.length + fileAttachments.length;

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, []);

  const handlePaste = useCallback((e) => {
    // Check for pasted files (e.g. screenshots)
    const files = Array.from(e.clipboardData.files);
    if (files.length > 0) {
      e.preventDefault();
      processFiles(files);
      return;
    }

    const text = e.clipboardData.getData("text/plain");
    if (text.length > 500) {
      e.preventDefault();
      setAttachments((prev) => [
        ...prev,
        { id: ++attachmentCounter, content: text },
      ]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeAttachment = useCallback((id) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
    setOpenAttachmentId((prev) => (prev === id ? null : prev));
  }, []);

  const removeFileAttachment = useCallback((id) => {
    setFileAttachments((prev) => prev.filter((f) => f.id !== id));
    deleteFile(id).catch(() => {}); // User explicitly removed before sending
  }, []);

  const updateAttachmentContent = useCallback((id, text) => {
    setAttachments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, content: text } : a))
    );
  }, []);

  const showFileError = useCallback((message, fileName = null) => {
    setFileError({ message, type: classifyFileError(message), fileName });
  }, []);

  const processFiles = useCallback(async (files) => {
    setFileError(null);
    const remaining = MAX_FILES - totalAttachmentCount;
    if (remaining <= 0) {
      showFileError(`You can attach up to ${MAX_FILES} files per message. Remove some attachments to add more.`);
      return;
    }

    const filesToProcess = files.slice(0, remaining);
    const saved = [];
    const failed = []; // { name, error, type (classifyFileError key) }

    if (files.length > remaining) {
      const skipped = files.slice(remaining);
      for (const f of skipped) {
        failed.push({ name: f.name, error: "Too many files", type: "TOO_MANY_FILES" });
      }
    }

    const batchHashes = new Set();

    for (const file of filesToProcess) {
      const validation = validateFile(file);
      if (!validation.valid) {
        failed.push({ name: file.name, error: validation.error, type: classifyFileError(validation.error) });
        continue;
      }

      try {
        const hash = await hashFileContent(file);

        // Check against already-attached files
        const existingInAttachments = fileAttachments.some((f) => f.hash === hash);
        // Check against other files in this batch
        const existingInBatch = batchHashes.has(hash);
        // Check against files in IndexedDB (from other sources like drag-drop)
        const existingInDB = !existingInAttachments && !existingInBatch ? await findByHash(hash) : null;

        if (existingInAttachments || existingInBatch || existingInDB) {
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

    if (saved.length > 0) {
      setFileAttachments((prev) => [...prev, ...saved]);
    }

    const errorInfo = buildFileErrorInfo(saved.length, failed);
    if (errorInfo) {
      setFileError(errorInfo);
    }
  }, [totalAttachmentCount, fileAttachments, showFileError]);

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) processFiles(files);
    // Reset input so same file can be selected again
    e.target.value = "";
  }, [processFiles]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if ((!text && !hasAnyAttachments) || streaming) return;

    // Build the display content for the user message
    let fullContent = text;
    if (hasAttachments) {
      const attachmentTexts = attachments
        .map((a, i) =>
          attachments.length === 1
            ? `---\nContent provided:\n${a.content}`
            : `---\nContent ${i + 1}:\n${a.content}`
        )
        .join("\n\n");
      fullContent = `${text}\n\n${attachmentTexts}`;
    }

    // Collect file IDs to send to the API
    const fileIds = fileAttachments.map((f) => f.id);

    // Snapshot the current form for modification detection
    baselineFormRef.current = structuredClone(form);

    setInput("");
    setAttachments([]);
    setFileAttachments([]);

    setFileError(null);
    setOpenAttachmentId(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Build display message (include file names for context)
    let displayContent = fullContent;
    if (fileIds.length > 0) {
      const fileNames = fileAttachments.map((f) => f.name).join(", ");
      const fileLabel = fileIds.length === 1 ? `Attached: ${fileNames}` : `Attached ${fileIds.length} files: ${fileNames}`;
      displayContent = displayContent ? `${displayContent}\n\n${fileLabel}` : fileLabel;
    }

    addMessage({ role: "user", content: displayContent, fileIds: fileIds.length > 0 ? fileIds : undefined });
    pendingIdsRef.current = [];
    clearPending();
    setStreaming(true);
    setStreamingMessage("");
    setError(null);

    const abort = new AbortController();
    abortRef.current = abort;

    try {
      const result = await sendChatMessage({
        messages: [...messages, { role: "user", content: fullContent, fileIds: fileIds.length > 0 ? fileIds : undefined }],
        form,
        signal: abort.signal,
        onTextUpdate: (msg) => {
          if (!abort.signal.aborted) setStreamingMessage(msg);
        },
        onFormMeta: ({ title, description }) => {
          if (!abort.signal.aborted) updateFormHeader({ title, description });
        },
        onQuestion: (question) => {
          if (!abort.signal.aborted) appendQuestion(question);
        },
        onQuestionModified: (questionId) => {
          if (!abort.signal.aborted && !pendingIdsRef.current.includes(questionId)) {
            pendingIdsRef.current = [...pendingIdsRef.current, questionId];
            setPendingQuestions(pendingIdsRef.current);
            setTimeout(() => {
              const el = document.getElementById(`question-${questionId}`);
              el?.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 50);
          }
        },
      });

      if (!abort.signal.aborted) {
        pushHistory("Before AI update");
        setForm(result.form);

        // Detect modified questions by comparing to pre-send baseline
        const baseline = baselineFormRef.current;
        if (baseline) {
          const modifiedIds = result.form.questions
            .filter((newQ) => {
              const oldQ = baseline.questions.find((q) => q.id === newQ.id);
              return oldQ && JSON.stringify(oldQ) !== JSON.stringify(newQ);
            })
            .map((q) => q.id);

          if (modifiedIds.length > 0) {
            highlightQuestions(modifiedIds);
            setTimeout(() => {
              const el = document.getElementById(`question-${modifiedIds[0]}`);
              el?.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 50);
            setTimeout(() => clearHighlights(), 1100);
          }
        }

        addMessage({ role: "assistant", content: result.completionMessage || result.message, form: result.form });
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Something went wrong");
        addMessage({ role: "assistant", content: "Sorry, something went wrong. Please try again." });
      }
    } finally {
      setStreaming(false);
      setStreamingMessage("");
      clearPending();
      abortRef.current = null;
    }
  }, [input, attachments, fileAttachments, hasAttachments, hasAnyAttachments, streaming, form, messages, addMessage, setForm, setStreaming, setStreamingMessage, setError, updateFormHeader, appendQuestion, highlightQuestions, clearHighlights, pushHistory, setPendingQuestions, clearPending]);

  const handleStop = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const lastAssistantMessage = messages.filter((m) => m.role === "assistant" && m.form).pop();
  const displayMessage = streaming ? streamingMessage : lastAssistantMessage?.content;
  const hasResponse = displayMessage || (streaming && !streamingMessage);
  const openAttachment = attachments.find((a) => a.id === openAttachmentId);

  return (
    <>
      <div className="relative">
        {hasAttachments && !tipDismissed && (
          <ArtifactTip
            onOpenArtifact={() => { setTipDismissed(true); setOpenAttachmentId(attachments[0].id); }}
            onDismiss={() => setTipDismissed(true)}
          />
        )}
        <div className="rounded-2xl shadow-lg overflow-hidden border border-slate-200">
        {/* AI response area */}
        {hasResponse && (
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
            {displayMessage ? (
              <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{displayMessage}</p>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="streaming-dot" />
                <span className="streaming-dot" style={{ animationDelay: "150ms" }} />
                <span className="streaming-dot" style={{ animationDelay: "300ms" }} />
                <span className="ml-0.5">Thinking...</span>
              </div>
            )}
          </div>
        )}

        {/* Input area */}
        <div className="bg-white">
          {/* Attachment chips */}
          {hasAnyAttachments && (
            <div className="px-3 pt-2.5 flex flex-wrap gap-1.5">
              {/* Text attachments */}
              {attachments.map((att, i) => (
                <button
                  key={att.id}
                  type="button"
                  onClick={() => { setTipDismissed(true); setOpenAttachmentId(att.id); }}
                  className="group inline-flex items-center gap-1.5 pl-2 pr-1 py-1 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 hover:bg-slate-100/70 transition-colors cursor-pointer text-left"
                >
                  <FileText size={13} className="text-slate-400 flex-shrink-0" />
                  <span className="text-xs text-slate-600 truncate max-w-40">
                    {attachments.length > 1 ? `Content ${i + 1}` : "Pasted content"}
                    <span className="text-slate-400 ml-1">
                      {att.content.length.toLocaleString()}
                    </span>
                  </span>
                  <span
                    role="button"
                    onClick={(e) => { e.stopPropagation(); removeAttachment(att.id); }}
                    className="p-0.5 text-slate-300 hover:text-slate-500 rounded transition-colors flex-shrink-0"
                    aria-label="Remove attachment"
                  >
                    <X size={12} />
                  </span>
                </button>
              ))}

              {/* File attachments */}
              {fileAttachments.map((file) => {
                const Icon = getFileIcon(file.type);
                const isImage = SUPPORTED_TYPES.images.includes(file.type);
                return (
                  <div
                    key={file.id}
                    className="group inline-flex items-center gap-1.5 pl-1.5 pr-1 py-1 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 hover:bg-slate-100/70 transition-colors text-left"
                  >
                    {isImage && file.preview ? (
                      <img
                        src={`data:${file.type};base64,${file.preview}`}
                        alt=""
                        className="w-5 h-5 rounded object-cover flex-shrink-0"
                      />
                    ) : (
                      <Icon size={13} className="text-slate-400 flex-shrink-0 ml-0.5" />
                    )}
                    <span className="text-xs text-slate-600 truncate max-w-32">
                      {file.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {formatFileSize(file.size)}
                    </span>
                    <span
                      role="button"
                      onClick={() => removeFileAttachment(file.id)}
                      className="p-0.5 text-slate-300 hover:text-slate-500 rounded transition-colors flex-shrink-0 cursor-pointer"
                      aria-label="Remove file"
                    >
                      <X size={12} />
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex items-end gap-2 p-2">
            {/* File upload button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={streaming || totalAttachmentCount >= MAX_FILES}
              className="flex-shrink-0 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Attach file"
              title="Attach PDF, image, or text file"
            >
              <Paperclip size={16} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={ALL_ACCEPTED_TYPES.join(",")}
              onChange={handleFileSelect}
              className="hidden"
            />

            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                adjustHeight();
              }}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder={hasAnyAttachments ? "Describe what to do with this content..." : "Describe your quiz or ask for changes..."}
              rows={1}
              disabled={streaming}
              className="flex-1 resize-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 disabled:opacity-50 focus:outline-none py-2 px-2 leading-relaxed"
            />
            {streaming ? (
              <button
                onClick={handleStop}
                className="flex-shrink-0 p-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Stop generating"
              >
                <Square size={16} />
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!input.trim() && !hasAnyAttachments}
                className="flex-shrink-0 p-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <SendHorizontal size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
      </div>

      {openAttachment && (
        <ArtifactSidebar
          content={openAttachment.content}
          onClose={() => setOpenAttachmentId(null)}
          onContentChange={(text) => updateAttachmentContent(openAttachment.id, text)}
        />
      )}

      <FileErrorDialog
        open={!!fileError}
        errorType={fileError?.type}
        message={fileError?.message}
        fileName={fileError?.fileName}
        onClose={() => setFileError(null)}
      />
    </>
  );
}
