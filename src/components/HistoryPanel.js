"use client";

import { useState, useRef, useEffect } from "react";
import { History, RotateCcw, ChevronDown } from "lucide-react";
import { useForm } from "@/lib/form-context";

function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default function HistoryPanel() {
  const { formHistory, restoreVersion } = useForm();
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  if (formHistory.length === 0) return null;

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
      >
        <History size={16} />
        <span className="hidden sm:inline">History</span>
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 w-64 bg-white border border-slate-200 rounded-lg overflow-hidden z-50 animate-fade-slide-in">
          <div className="px-3 py-2 border-b border-slate-100">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              {formHistory.length} version{formHistory.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {[...formHistory].reverse().map((entry, i) => {
              const realIndex = formHistory.length - 1 - i;
              return (
                <div
                  key={entry.timestamp}
                  className="flex items-center justify-between px-3 py-2.5 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm text-slate-700 truncate">{entry.label}</span>
                    <span className="text-xs text-slate-400">{formatTime(entry.timestamp)}</span>
                  </div>
                  <button
                    onClick={() => {
                      restoreVersion(realIndex);
                      setOpen(false);
                    }}
                    className="flex-shrink-0 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                    title="Restore this version"
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
