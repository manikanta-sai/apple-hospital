import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import DoctorCardList from "./DoctorCardList";
import TypingIndicator from "./TypingIndicator";
import QuickLinks from "./QuickLinks";
import PatientRegistrationForm from "./PatientRegistrationForm";
import SlotPicker from "./SlotPicker";
import BookingConfirmation from "./BookingConfirmation";

// Stock hospital-building photo for the greeting header. Swap for your
// own hospital's exterior shot in production.
const HOSPITAL_IMAGE =
  "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=600&q=80";

/**
 * ChatMessages
 * ------------
 * The scrollable message stream. Chooses the right renderer per message
 * based on `type`, and shows the hospital image + quick-link chips above
 * the greeting text when the conversation hasn't started yet.
 */
export default function ChatMessages({
  messages,
  isLoadingHistory,
  isTyping,
  onQuickLink,
  onBookSlot,
  onSubmitPatientForm,
  onSelectSlot,
}) {
  const bottomRef = useRef(null);
  const [imageFailed, setImageFailed] = useState(false);

  // Always keep the newest message in view, mirroring native chat apps.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping]);

  return (
    <div className="scrollbar-thin flex-1 space-y-3 overflow-y-auto bg-clinical-50 px-4 py-4">
      {/* Empty-state greeting: hospital image -> quick links -> text,
          shown once history has loaded and no messages exist yet. */}
      {!isLoadingHistory && messages.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          {!imageFailed ? (
            <img
              src={HOSPITAL_IMAGE}
              alt="mani Multispecialty Hospital building"
              className="h-32 w-full max-w-[280px] rounded-2xl object-cover shadow-sm"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="flex h-32 w-full max-w-[280px] items-center justify-center rounded-2xl bg-clinical-100 text-clinical-700">
              <span className="font-display text-sm font-bold">Mani Hospital</span>
            </div>
          )}
          <p className="max-w-[240px] text-sm text-ink-600">
            Hi, I'm MediAssist. Ask me to find a doctor, check timings, or book an appointment.
          </p>
          <QuickLinks onSelect={onQuickLink} />
        </div>
      )}

      {isLoadingHistory && (
        <div className="flex justify-center py-8">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-clinical-300 border-t-clinical-700" />
        </div>
      )}

      {messages.map((message) => {
        switch (message.type) {
          case "doctor-list":
          case "fallback":
            return <DoctorCardList key={message.id} message={message} onBookSlot={onBookSlot} />;
          case "patient-form":
            return (
              <PatientRegistrationForm key={message.id} message={message} onSubmit={onSubmitPatientForm} />
            );
          case "slot-picker":
            return <SlotPicker key={message.id} message={message} onSelectSlot={onSelectSlot} />;
          case "booking-success":
            return <BookingConfirmation key={message.id} message={message} />;
          default:
            return <MessageBubble key={message.id} message={message} />;
        }
      })}

      {isTyping && <TypingIndicator />}

      {/* Scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
}
