import { Clock3 } from "lucide-react";

/**
 * SlotPicker
 * ----------
 * Renders the assistant's lead-in text plus a row of time-slot chips
 * for one doctor. Once a slot is tapped, `message.selectedSlot` is set
 * by useChatSession.confirmBooking - at that point every chip becomes
 * disabled and the chosen one stays visibly highlighted, so the step
 * reads as "answered" rather than still awaiting input.
 */
export default function SlotPicker({ message, onSelectSlot }) {
  const isLocked = Boolean(message.selectedSlot);

  return (
    <div className="flex w-full flex-col items-start gap-2 animate-fade-in-up">
      <div className="max-w-[90%] rounded-bubble rounded-bl-sm bg-clinical-100 px-4 py-2.5 text-[14.5px] leading-snug text-ink-900 shadow-sm">
        {message.text}
      </div>

      <div className="flex flex-wrap gap-2 pl-0.5">
        {message.slots.map((slot) => {
          const isSelected = message.selectedSlot === slot;
          return (
            <button
              key={slot}
              type="button"
              disabled={isLocked}
              onClick={() => onSelectSlot(message.id, message.doctor, slot)}
              className={[
                "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                isSelected
                  ? "border-clinical-700 bg-clinical-700 text-white"
                  : "border-clinical-100 bg-white text-clinical-700 hover:bg-clinical-700 hover:text-white",
                isLocked && !isSelected ? "opacity-40" : "",
                isLocked ? "cursor-not-allowed" : "",
              ].join(" ")}
            >
              <Clock3 size={12} />
              {slot}
            </button>
          );
        })}
      </div>
    </div>
  );
}
