import { MessageCircle } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useChatSession } from "../hooks/useChatSession";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

// Quick-link id -> the canned message sent through the normal chat
// pipeline (reuses pickMockReply/sendChatMessage, same as free typing).
// "book" is handled separately since it starts a structured flow
// instead of a plain text round-trip.
const QUICK_LINK_MESSAGES = {
  timings: "Timings",
  enquiry: "Enquiry",
  address: "Address",
  agent: "Request Live Agent",
};

/**
 * ChatWidget
 * ----------
 * The single component a host app mounts, e.g.:
 *
 *   <ChatWidget tenantId="apollo-hospitals-chennai" />
 *
 * Responsibilities:
 *  - Persists isOpen/isMinimized to localStorage so the widget
 *    "remembers" itself across page transitions in the host SPA.
 *  - Mobile-first responsive layout - full screen below the `sm`
 *    breakpoint, floating card at `sm` and above.
 *  - Delegates conversation + booking-flow state to useChatSession and
 *    wires its actions into ChatMessages.
 */
export default function ChatWidget({ tenantId }) {
  // --- Persisted UI state ---
  const [isOpen, setIsOpen] = useLocalStorage("hc_widget_open", false);
  const [isMinimized, setIsMinimized] = useLocalStorage("hc_widget_minimized", false);

  const {
    messages,
    isLoadingHistory,
    isTyping,
    sendMessage,
    startBookingFlow,
    submitPatientForm,
    requestSlots,
    confirmBooking,
  } = useChatSession({ tenantId });

  // Routes a quick-link tap to either the structured booking flow or a
  // canned chat message, depending on which chip was pressed.
  const handleQuickLink = (id) => {
    if (id === "book") {
      startBookingFlow();
      return;
    }
    const text = QUICK_LINK_MESSAGES[id];
    if (text) sendMessage(text);
  };

  // --- Closed state: just the floating launcher button ---
  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        aria-label="Open chat with MediAssist"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-clinical-700 text-white shadow-lg transition-transform hover:scale-105 active:scale-95 animate-pulse-ring sm:bottom-6 sm:right-6"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div
      className={[
        // ---- Mobile-first base (default = full screen native-app feel) ----
        "fixed inset-0 z-50 flex flex-col bg-white",
        // ---- >= sm breakpoint: collapse into a floating desktop card ----
        "sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[640px] sm:w-[400px] sm:rounded-2xl sm:shadow-2xl sm:ring-1 sm:ring-black/5",
        // ---- Minimized: shrink to just the header strip ----
        isMinimized ? "sm:h-auto" : "",
        "animate-pop-in origin-bottom-right",
      ].join(" ")}
    >
      <ChatHeader
        isMinimized={isMinimized}
        onMinimize={() => setIsMinimized(true)}
        onExpand={() => setIsMinimized(false)}
        onClose={() => {
          setIsOpen(false);
          setIsMinimized(false);
        }}
      />

      {/* Body is unmounted while minimized so no layout height leaks
          through on desktop, but the header (and its persisted state)
          stays alive. */}
      {!isMinimized && (
        <>
          <ChatMessages
            messages={messages}
            isLoadingHistory={isLoadingHistory}
            isTyping={isTyping}
            onQuickLink={handleQuickLink}
            onBookSlot={requestSlots}
            onSubmitPatientForm={submitPatientForm}
            onSelectSlot={confirmBooking}
          />
          <ChatInput onSend={sendMessage} disabled={isTyping} />
        </>
      )}
    </div>
  );
}
