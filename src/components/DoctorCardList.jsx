import DoctorCard from "./DoctorCard";

/**
 * DoctorCardList
 * ---------------
 * Renders the assistant's lead-in text (e.g. "I found 3 cardiologists...")
 * followed by a horizontally scrollable, snap-aligned rail of doctor
 * cards. `fallback`-type messages reuse this exact component with
 * alternate-doctor data, just with a tinted lead-in bubble.
 */
export default function DoctorCardList({ message, onBookSlot }) {
  const isFallback = message.type === "fallback";

  return (
    <div className="flex w-full flex-col items-start gap-2 animate-fade-in-up">
      {/* Lead-in text bubble - fallback messages get a subtle amber tint
          so patients register that this is an alternative suggestion,
          not exactly what they asked for. */}
      <div
        className={[
          "max-w-[90%] rounded-bubble rounded-bl-sm px-4 py-2.5 text-[14.5px] leading-snug shadow-sm",
          isFallback ? "bg-coral-100 text-ink-900" : "bg-clinical-100 text-ink-900",
        ].join(" ")}
      >
        {message.text}
      </div>

      {/* Scrollable card rail */}
      <div className="w-full overflow-x-auto scrollbar-hide snap-x-mandatory">
        <div className="flex gap-3 pb-1 pl-0.5 pr-4">
          {message.doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} onBookSlot={onBookSlot} />
          ))}
        </div>
      </div>
    </div>
  );
}
