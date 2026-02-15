"use client";

import { useState, useRef, useCallback } from "react";
import { SendHorizontal, Square, FileText, X } from "lucide-react";
import { useForm } from "@/lib/form-context";
import { sendChatMessage } from "@/lib/chat";
import ArtifactSidebar from "@/components/ArtifactSidebar";
import ArtifactTip from "@/components/ArtifactTip";

let attachmentCounter = Date.now();

export default function ChatBar() {
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [openAttachmentId, setOpenAttachmentId] = useState(null);
  const [tipDismissed, setTipDismissed] = useState(false);
  const textareaRef = useRef(null);
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

  const hasAttachments = attachments.length > 0;

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, []);

  const handlePaste = useCallback((e) => {
    const text = e.clipboardData.getData("text/plain");
    if (text.length > 500) {
      e.preventDefault();
      setAttachments((prev) => [
        ...prev,
        { id: ++attachmentCounter, content: text },
      ]);
    }
  }, []);

  const removeAttachment = useCallback((id) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
    setOpenAttachmentId((prev) => (prev === id ? null : prev));
  }, []);

  const updateAttachmentContent = useCallback((id, text) => {
    setAttachments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, content: text } : a))
    );
  }, []);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if ((!text && !hasAttachments) || streaming) return;

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

    // Snapshot the current form for modification detection
    baselineFormRef.current = structuredClone(form);

    setInput("");
    setAttachments([]);
    setOpenAttachmentId(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    addMessage({ role: "user", content: fullContent });
    pendingIdsRef.current = [];
    clearPending();
    setStreaming(true);
    setStreamingMessage("");
    setError(null);

    const abort = new AbortController();
    abortRef.current = abort;

    try {
      const result = await sendChatMessage({
        messages: [...messages, { role: "user", content: fullContent }],
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
  }, [input, attachments, hasAttachments, streaming, form, messages, addMessage, setForm, setStreaming, setStreamingMessage, setError, updateFormHeader, appendQuestion, highlightQuestions, clearHighlights, pushHistory, setPendingQuestions, clearPending]);

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
          {hasAttachments && (
            <div className="px-3 pt-2.5 flex flex-wrap gap-1.5">
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
            </div>
          )}

          <div className="flex items-end gap-2 p-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                adjustHeight();
              }}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder={hasAttachments ? "Describe what to do with this content..." : "Describe your quiz or ask for changes..."}
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
                disabled={!input.trim() && !hasAttachments}
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
    </>
  );
}
