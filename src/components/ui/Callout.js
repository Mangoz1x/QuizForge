import { X } from "lucide-react";

export default function Callout({
  children,
  onDismiss,
  arrowPosition = "left",
  arrowDirection = "down",
  className = "",
}) {
  const arrowHorizontal =
    arrowPosition === "left"
      ? "left-4"
      : arrowPosition === "center"
      ? "left-1/2 -translate-x-1/2"
      : "right-4";

  const isDown = arrowDirection === "down";

  return (
    <div className={`relative callout-in ${className}`}>
      {/* Body */}
      <div className="relative bg-blue-50 border border-blue-200 rounded-lg p-3">
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute top-2 right-2 p-0.5 text-blue-400 hover:text-blue-600 transition-colors cursor-pointer"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        )}
        {children}
      </div>

      {/* Arrow — overlaps the body border so it blends seamlessly */}
      <span
        className={`absolute ${arrowHorizontal} w-3 h-3 rotate-45 bg-blue-50 z-10 ${
          isDown
            ? "-bottom-[6px] border-r border-b border-blue-200"
            : "-top-[6px] border-l border-t border-blue-200"
        }`}
      />
    </div>
  );
}
