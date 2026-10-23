import React from "react";
import { Lock } from "lucide-react";

/**
 * BlackoutOverlay
 * Production-grade pitch-black security overlay.
 * Exact compliance with enterprise healthcare security policy.
 */
export default function BlackoutOverlay({
  isBlackedOut,
  title = "For security reasons this content is protected",
  reason = "Printing, screenshots and switching tabs are restricted while viewing this content.",
  onDismiss,
}) {
  if (!isBlackedOut) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed inset-0 z-[9999999] bg-black text-white flex flex-col items-center justify-center p-6 select-none cursor-default animate-fadeIn"
      style={{ backgroundColor: "#000000" }}
      onClick={onDismiss}
    >
      <div className="max-w-md w-full flex flex-col items-center text-center space-y-5">
        {/* Minimalist Lock Symbol */}
        <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 shadow-2xl">
          <Lock className="w-7 h-7 text-neutral-300 stroke-[1.75]" />
        </div>

        {/* Clean Security Notice with User's Exact Copy */}
        <div className="space-y-2">
          <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-white font-sans">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans max-w-sm mx-auto">
            {reason}
          </p>
        </div>

        {/* Action / Dismiss */}
        {onDismiss && (
          <div className="pt-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDismiss();
              }}
              className="px-4 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-700 text-neutral-300 text-xs font-medium tracking-wide transition border border-neutral-800 hover:border-neutral-700 focus:outline-none"
            >
              Tap or click to return
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
