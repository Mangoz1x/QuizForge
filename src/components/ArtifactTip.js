"use client";

import { useEffect, useRef } from "react";
import { MousePointer2 } from "lucide-react";
import { Callout } from "@/components/ui";

const STORAGE_KEY = "quizforge_artifact_tip_seen";

export default function ArtifactTip({ onOpenArtifact, onDismiss }) {
  const checkedRef = useRef(false);

  useEffect(() => {
    // If already seen, dismiss immediately on mount
    if (!checkedRef.current) {
      checkedRef.current = true;
      const seen = localStorage.getItem(STORAGE_KEY);
      if (seen) {
        onDismiss?.();
      }
    }
  }, [onDismiss]);

  function handleDismiss() {
    localStorage.setItem(STORAGE_KEY, "1");
    onDismiss?.();
  }

  function handleOpen() {
    localStorage.setItem(STORAGE_KEY, "1");
    onOpenArtifact?.();
  }

  return (
    <div className="mb-2 w-72 z-20">
      <Callout onDismiss={handleDismiss} arrowPosition="left" arrowDirection="down">
        <div className="pr-5">
          <p className="text-sm font-medium text-blue-900 mb-0.5">Content saved as attachment</p>
          <p className="text-xs text-blue-700/70 leading-relaxed">
            Large pasted text is stored as an attachment so your chat stays clean. Click on it anytime to read through the full content.
          </p>
          <button
            onClick={handleOpen}
            className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-blue-700 hover:text-blue-900 transition-colors cursor-pointer"
          >
            <MousePointer2 size={12} />
            Open attachment
          </button>
        </div>
      </Callout>
    </div>
  );
}
