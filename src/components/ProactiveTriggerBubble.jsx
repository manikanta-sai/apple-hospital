import { X, MessageCircle } from "lucide-react";

/**
 * ProactiveTriggerBubble
 * ------------------------
 * Renders only when a department-dwell trigger has fired AND the chat
 * panel is closed. Deliberately a dismissible suggestion rather than
 * force-opening the widget — auto-opening chat windows is a common
 * dark pattern that erodes trust; a tappable callout respects user
 * choice while still being attention-grabbing (pop-in animation).
 */
export default function ProactiveTriggerBubble({ trigger, onAccept, onDismiss }) {
  if (!trigger) return null;

  return (
    <div className="fixed bottom-24 right-5 z-40 w-72 animate-pop-in rounded-2xl border border-clinical-100 bg-white p-4 pr-8 shadow-xl sm:bottom-24 sm:right-6">
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss suggestion"
        className="absolute right-2 top-2 rounded-full p-1 text-ink-300 transition-colors hover:bg-clinical-50 hover:text-ink-600"
      >
        <X size={14} />
      </button>

      <p className="text-sm leading-snug text-ink-900">{trigger.message}</p>

      <button
        type="button"
        onClick={onAccept}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-clinical-700 py-2 text-xs font-semibold text-white transition-colors hover:bg-clinical-500 active:scale-[0.98]"
      >
        <MessageCircle size={14} />
        Chat now
      </button>
    </div>
  );
}
