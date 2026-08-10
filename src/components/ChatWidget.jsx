import { MessageCircle } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useChatSession } from "../hooks/useChatSession";
import { useBehavioralTrigger } from "../hooks/useBehavioralTrigger";
import { LanguageProvider } from "../i18n/LanguageContext";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import ProactiveTriggerBubble from "./ProactiveTriggerBubble";

// Quick-link id -> canned message sent through the normal chat pipeline.
// "book" is handled separately since it starts a structured flow
// instead of a plain text round-trip.
const QUICK_LINK_MESSAGES = {
  timings: "Timings",
  enquiry: "Enquiry",
  address: "Address",
  agent: "Request Live Agent",
};

/**
 * ChatWidgetInner
 * -----------------
 * Everything that needs `useLanguage()` (directly or via a hook that
 * calls it, like useChatSession) lives inside here, below the
 * <LanguageProvider> boundary set up by the default export.
 */
function ChatWidgetInner({ tenantId }) {
  const [isOpen, setIsOpen] = useLocalStorage("hc_widget_open", false);
  const [isMinimized, setIsMinimized] = useLocalStorage("hc_widget_minimized", false);

  const {
    messages,
    isLoadingHistory,
    isTyping,
    sendMessage,
    injectAssistantMessage,
    startBookingFlow,
    submitPatientForm,
    requestSlots,
    confirmBooking,
  } = useChatSession({ tenantId });

  // Feature 1: context-aware behavioral trigger. Disabled while the
  // panel is already open - no point suggesting a chat the user is
  // already having.
  const { trigger, dismiss, consume } = useBehavioralTrigger({ enabled: !isOpen });

  const handleQuickLink = (id) => {
    if (id === "book") {
      startBookingFlow();
      return;
    }
    const text = QUICK_LINK_MESSAGES[id];
    if (text) sendMessage(text);
  };

  // User tapped "Chat now" on the proactive bubble: open the panel,
  // drop the contextual greeting straight into the stream, then follow
  // up with the department's canned quick-action so doctor cards
  // appear immediately without the user needing to type anything.
  const handleAcceptTrigger = () => {
    const accepted = consume();
    setIsOpen(true);
    setIsMinimized(false);
    if (accepted) {
      injectAssistantMessage(accepted.message);
      sendMessage(accepted.quickAction);
    }
  };

  return (
    <>
      {/* Feature 1: proactive contextual greeting, only visible while closed */}
      {!isOpen && <ProactiveTriggerBubble trigger={trigger} onAccept={handleAcceptTrigger} onDismiss={dismiss} />}

      {!isOpen ? (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          aria-label="Open chat with MediAssist"
          className={[
            "fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-clinical-700 text-white shadow-lg transition-transform hover:scale-105 active:scale-95 sm:bottom-6 sm:right-6",
            trigger ? "animate-pulse-ring" : "",
          ].join(" ")}
        >
          <MessageCircle size={24} />
        </button>
      ) : (
        <div
          className={[
            "fixed inset-0 z-50 flex flex-col bg-white",
            "sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[640px] sm:w-[400px] sm:rounded-2xl sm:shadow-2xl sm:ring-1 sm:ring-black/5",
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
      )}
    </>
  );
}

/**
 * ChatWidget
 * ----------
 * Public entry point a host app mounts, e.g.:
 *
 *   <ChatWidget tenantId="apollo-hospitals-chennai" />
 *
 * Wraps everything in <LanguageProvider> so the widget is a fully
 * self-contained i18n boundary - the host app doesn't need to know or
 * care about the language context.
 */
export default function ChatWidget({ tenantId }) {
  return (
    <LanguageProvider>
      <ChatWidgetInner tenantId={tenantId} />
    </LanguageProvider>
  );
}
