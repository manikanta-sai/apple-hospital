import { MessageCircle, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useChatSession } from "../hooks/useChatSession";
import { useBehavioralTrigger } from "../hooks/useBehavioralTrigger";
import { playNotificationChime } from "../hooks/useOpenSound";
import { uploadChatAttachments } from "../services/chatApi";
import { LanguageProvider } from "../i18n/LanguageContext";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import AttachmentComposer from "./AttachmentComposer";
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
    sessionId,
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
  const [isUploading, setIsUploading] = useState(false);

  const [tooltipDismissed, setTooltipDismissed] = useLocalStorage("hc_tooltip_dismissed", false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [panelPosition, setPanelPosition] = useState(null);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(min-width: 640px)").matches : false
  );
  const [isClosing, setIsClosing] = useState(false);
  const panelRef = useRef(null);
  const dragRef = useRef({ active: false, startX: 0, startY: 0, originX: 0, originY: 0, width: 0, height: 0 });

  useEffect(() => {
    if (isOpen || tooltipDismissed) return undefined;

    const timeout = window.setTimeout(() => {
      setShowTooltip(true);
      playNotificationChime();
    }, 3000);

    return () => window.clearTimeout(timeout);
  }, [isOpen, tooltipDismissed]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const onChange = (event) => setIsDesktop(event.matches);
    setIsDesktop(mq.matches);
    if (mq.addEventListener) {
      mq.addEventListener("change", onChange);
    } else {
      mq.addListener(onChange);
    }
    return () => {
      if (mq.removeEventListener) {
        mq.removeEventListener("change", onChange);
      } else {
        mq.removeListener(onChange);
      }
    };
  }, []);

  useEffect(() => {
    if (!isDesktop) {
      setPanelPosition(null);
    }
  }, [isDesktop]);

  const handleMouseMove = useCallback((event) => {
    if (!dragRef.current.active) return;

    const deltaX = event.clientX - dragRef.current.startX;
    const deltaY = event.clientY - dragRef.current.startY;
    const maxX = window.innerWidth - dragRef.current.width - 10;
    const maxY = window.innerHeight - dragRef.current.height - 10;
    const nextX = Math.min(Math.max(10, dragRef.current.originX + deltaX), maxX);
    const nextY = Math.min(Math.max(10, dragRef.current.originY + deltaY), maxY);

    setPanelPosition({ x: nextX, y: nextY });
  }, []);

  const handleMouseUp = useCallback(() => {
    if (dragRef.current.active) {
      dragRef.current.active = false;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const handleDragStart = useCallback(
    (event) => {
      if (!isDesktop || isMinimized) return;
      const rect = panelRef.current?.getBoundingClientRect();
      if (!rect) return;
      dragRef.current = {
        active: true,
        startX: event.clientX,
        startY: event.clientY,
        originX: rect.left,
        originY: rect.top,
        width: rect.width,
        height: rect.height,
      };
      setPanelPosition({ x: rect.left, y: rect.top });
      event.preventDefault();
    },
    [isDesktop, isMinimized]
  );

  const handleClose = useCallback(() => {
    if (isMinimized) {
      setIsClosing(true);
      window.setTimeout(() => {
        setIsOpen(false);
        setIsMinimized(false);
        setPanelPosition(null);
        setIsClosing(false);
      }, 220);
    } else {
      setIsOpen(false);
      setIsMinimized(false);
      setPanelPosition(null);
    }
  }, [isMinimized]);

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

  const handleSendWithAttachments = useCallback(
    async (text, attachments, onProgress) => {
      if (isUploading) return false;
      setIsUploading(true);
      try {
        let uploadedAttachments = [];
        if (attachments.length > 0) {
          const uploadResults = await uploadChatAttachments(sessionId, attachments, tenantId, onProgress);
          uploadedAttachments = uploadResults.map((entry) => ({
            id: entry.id,
            name: entry.name,
            type: entry.type,
            size: entry.size,
            url: entry.url,
          }));
        }
        return await sendMessage(text, uploadedAttachments);
      } catch (err) {
        console.error(err);
        setError(err.message || "Upload failed. Please try again.");
        return false;
      } finally {
        setIsUploading(false);
      }
    },
    [isUploading, sendMessage, tenantId]
  );

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
        <>
          {showTooltip && !tooltipDismissed && (
            <div className="fixed bottom-24 right-5 z-50 w-72 rounded-2xl border border-clinical-100 bg-white p-4 shadow-xl sm:bottom-24 sm:right-6 animate-pop-in">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink-900">Hi! How can I help you?</p>
                  <p className="mt-1 text-xs text-ink-600">Tap to start a chat with our assistant.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTooltipDismissed(true);
                    setShowTooltip(false);
                  }}
                  aria-label="Close tooltip"
                  className="rounded-full p-1 text-ink-400 transition-colors hover:bg-clinical-100 hover:text-ink-700"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            aria-label="Open chat with MediAssist"
            className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-clinical-700 text-white shadow-lg transition-transform hover:scale-105 active:scale-95 sm:bottom-6 sm:right-6 animate-pulse-ring"
          >
            <MessageCircle size={24} />
          </button>
        </>
      ) : (
        <div
          ref={panelRef}
          style={
            panelPosition && isDesktop
              ? { top: panelPosition.y, left: panelPosition.x, right: "auto", bottom: "auto" }
              : undefined
          }
          className={[
            "fixed inset-0 z-50 flex flex-col bg-white",
            "sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[640px] sm:w-[400px] sm:rounded-2xl sm:shadow-2xl sm:ring-1 sm:ring-black/5",
            isMinimized ? "sm:h-auto" : "",
            isClosing ? "animate-pop-out" : "animate-pop-in",
            "origin-bottom-right",
          ].join(" ")}
        >
          <ChatHeader
            isMinimized={isMinimized}
            onMinimize={() => {
              setIsMinimized(true);
              setPanelPosition(null);
            }}
            onExpand={() => setIsMinimized(false)}
            onClose={handleClose}
            onDragStart={handleDragStart}
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
              <AttachmentComposer
                onSend={handleSendWithAttachments}
                disabled={isTyping || isLoadingHistory || isUploading}
                isBotBusy={isTyping || isLoadingHistory}
              />
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
