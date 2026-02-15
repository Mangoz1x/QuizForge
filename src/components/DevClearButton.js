"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function DevClearButton() {
  const [confirming, setConfirming] = useState(false);

  if (process.env.NEXT_PUBLIC_IS_DEV !== "true") return null;

  function handleClick() {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }

    localStorage.clear();
    setConfirming(false);
    window.location.href = "/dashboard";
  }

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-4 left-4 z-50 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
        confirming
          ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
          : "bg-white border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300"
      }`}
    >
      <Trash2 size={12} />
      {confirming ? "Click again to confirm" : "Clear state"}
    </button>
  );
}
