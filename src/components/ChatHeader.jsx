import { Minus, X, Stethoscope } from "lucide-react";

/**
 * ChatHeader
 * ----------
 * Brand strip + window controls. Also acts as the tap target to
 * restore the widget when it's minimized (see ChatWidget).
 */
export default function ChatHeader({ onMinimize, onClose, isMinimized, onExpand }) {
  return (
    <div
      onClick={isMinimized ? onExpand : undefined}
      className={[
        "flex items-center justify-between bg-clinical-900 px-4 py-3 text-white",
        isMinimized ? "cursor-pointer" : "",
      ].join(" ")}
    >
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-clinical-700">
          <Stethoscope size={18} />
        </div>
        <div>
          <p className="font-display text-sm font-bold leading-tight">MediAssist</p>
          <p className="flex items-center gap-1 text-[11px] text-clinical-100/80">
            <span className="h-1.5 w-1.5 rounded-full bg-status-available" />
            Online now
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
          onClick={(e) => {
            e.stopPropagation();
            isMinimized ? onExpand() : onMinimize();
          }}
          className="rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <Minus size={16} />
        </button>
        <button
          type="button"
          aria-label="Close chat"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
