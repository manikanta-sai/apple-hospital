import { useState, useEffect, useCallback, useRef } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { useLanguage } from "../i18n/LanguageContext";
import { generateId } from "../utils/generateId";
import { fetchChatHistory, sendChatMessage, bookDoctorSlot } from "../services/chatApi";
import { translateText } from "../services/translationProvider";
import { playNotificationChime } from "./useOpenSound";
import {
  mockAllDoctorsSearch,
  mockCardiologySearch,
  mockOrthopedicsSearch,
  mockPediatricsSearch,
  mockUnavailableFallback,
  mockPlainTextReply,
  mockEnquiryReply,
  mockAddressReply,
  mockLiveAgentReply,
  mockBookingConfirmation,
  DEFAULT_SLOTS,
} from "../mock/mockResponses";

// Flip to false once a real backend is running - see README for the
// expected endpoints. Kept as an env flag so it's a one-line switch.
const MOCK_MODE = import.meta.env.VITE_CHAT_MOCK_MODE !== "false";

/**
 * useChatSession
 * --------------
 * Owns everything related to a single chat conversation: session id
 * lifecycle, history hydration, the booking-flow message chain, and -
 * new in this revision - language-aware output.
 *
 * Because this is a hook (not a component), it can call `useLanguage()`
 * itself to read the active language/translator straight from context,
 * so no `language`/`t` props need to be threaded in from ChatWidget.
 *
 * Two distinct localization paths:
 *  - Static, app-authored strings (form prompts, slot-picker prefix)
 *    use `t('key')` from UI_STRINGS - bundled with the app, no network.
 *  - Dynamic AI reply text is localized via `translateText()` in mock
 *    mode, or via the `targetLanguage` param sent to the real backend
 *    (see chatApi.sendChatMessage) - the backend should generate the
 *    reply natively in that language rather than relying on a
 *    client-side translation pass.
 */
export function useChatSession({ tenantId } = {}) {
  const { language, t } = useLanguage();

  // --- Session id: created once, then persisted forever (per browser) ---
  const [sessionId] = useLocalStorage("hc_session_id", null);
  const sessionIdRef = useRef(sessionId ?? generateId("session"));
  const [, setSessionIdStorage] = useLocalStorage("hc_session_id", sessionIdRef.current);
  useEffect(() => {
    setSessionIdStorage(sessionIdRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [messages, setMessagesRaw] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  // --- Sound-trigger bookkeeping --------------------------------
  //
  // `lastSoundedIdRef` holds the `id` of the most recent assistant
  // message for which we already played the chime.  By comparing
  // against the last assistant message in every *new* state snapshot
  // we guarantee:
  //   • exactly one chime per new assistant message (or batch)
  //   • no chime on re-renders, duplicate state updates, or history
  //     hydration (guarded by `hydratingRef`)
  //   • no chime when an existing message is mutated in-place
  //     (e.g. form status change / slot selection)
  const lastSoundedIdRef = useRef(null);
  const hydratingRef = useRef(true); // true while initial history loads

  /**
   * Wrapper around the raw setter. After updating the array it checks
   * whether the newest assistant message is one we haven't chimed for
   * yet.  If so, it plays the sound and records its id.
   */
  const setMessages = useCallback((updater) => {
    setMessagesRaw((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;

      // Only consider playing the chime when we're past the initial
      // history hydration and the array actually grew.
      if (!hydratingRef.current && next.length > prev.length) {
        // Find the last assistant message in the new snapshot.
        for (let i = next.length - 1; i >= 0; i--) {
          if (next[i].role === "assistant") {
            if (next[i].id !== lastSoundedIdRef.current) {
              lastSoundedIdRef.current = next[i].id;
              // Fire outside the render cycle to avoid React warnings.
              queueMicrotask(() => playNotificationChime());
            }
            break;
          }
        }
      }

      return next;
    });
  }, []);

  /** Appends one or more messages, stamping missing ids/timestamps. */
  const pushMessages = useCallback((...partials) => {
    setMessages((prev) => [
      ...prev,
      ...partials.map((m) => ({
        id: generateId("msg"),
        timestamp: new Date().toISOString(),
        ...m,
      })),
    ]);
  }, [setMessages]);

  /** Converts a raw backend `reply` object into a renderable message. */
  const toAssistantMessage = (reply) => ({
    id: generateId("msg"),
    role: "assistant",
    type: reply.type || "text",
    text: reply.text,
    doctors: reply.doctors || null,
    timestamp: new Date().toISOString(),
  });

  /**
   * Localizes a mock-mode reply's free text before it hits the UI.
   * Doctor names/departments are left untranslated (proper nouns /
   * clinical taxonomy the hospital controls), only the AI-authored
   * lead-in `text` is run through the translation provider.
   */
  const localizeMockReply = useCallback(
    async (reply) => {
      if (language === "en") return reply;
      const text = await translateText(reply.text, language);
      return { ...reply, text };
    },
    [language]
  );

  // --- Hydrate history on mount ---
  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      setIsLoadingHistory(true);
      try {
        if (MOCK_MODE) {
          await new Promise((r) => setTimeout(r, 300));
          if (!cancelled) setMessages([]);
        } else {
          const history = await fetchChatHistory(sessionIdRef.current, tenantId);
          if (!cancelled) {
            const normalized = (history.messages || []).map((m) =>
              m.role === "user"
                ? { id: m.id || generateId("msg"), role: "user", type: "text", text: m.text, timestamp: m.timestamp }
                : toAssistantMessage(m)
            );
            setMessages(normalized);
          }
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) {
          setIsLoadingHistory(false);
          hydratingRef.current = false;
        }
      }
    }

    loadHistory();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Picks a canned mock reply based on keywords - purely for the demo. */
  function pickMockReply(text) {
    const lower = text.toLowerCase();
    if (lower.includes("mani")) return mockUnavailableFallback;
    if (lower.includes("cardio") || lower.includes("heart")) return mockCardiologySearch;
    if (lower.includes("ortho") || lower.includes("bone") || lower.includes("joint")) return mockOrthopedicsSearch;
    if (lower.includes("pediatr") || lower.includes("child") || lower.includes("kid")) return mockPediatricsSearch;
    if (
      lower.includes("doctor") ||
      lower.includes("specialist") ||
      lower.includes("physician") ||
      lower.includes("see a doctor") ||
      lower.includes("all")
    ) {
      return mockAllDoctorsSearch;
    }
    if (lower.includes("enquiry") || lower.includes("enquire")) return mockEnquiryReply;
    if (lower.includes("address") || lower.includes("location")) return mockAddressReply;
    if (lower.includes("agent") || lower.includes("human")) return mockLiveAgentReply;
    return mockPlainTextReply; // covers "timings" and anything unmatched
  }

  // --- Send a free-typed (or quick-link-triggered) user message ---
  const sendMessage = useCallback(
    async (text, attachments = []) => {
      const trimmed = text.trim();
      if (!trimmed && attachments.length === 0) return false;

      pushMessages({ role: "user", type: "text", text: trimmed, attachments });
      setIsTyping(true);
      setError(null);

      let success = true;
      try {
        let reply;
        if (MOCK_MODE) {
          await new Promise((r) => setTimeout(r, 700 + Math.random() * 500));
          const payload = pickMockReply(trimmed || "");
          reply = await localizeMockReply(payload.reply);
        } else {
          const payload = await sendChatMessage(sessionIdRef.current, trimmed, tenantId, language, attachments);
          reply = payload.reply;
        }
        setMessages((prev) => [...prev, toAssistantMessage(reply)]);
      } catch (err) {
        setError(err.message);
        pushMessages({
          role: "assistant",
          type: "text",
          text: "Sorry, something went wrong reaching our servers. Please try again in a moment.",
        });
        success = false;
      } finally {
        setIsTyping(false);
      }

      return success;
    },
    [tenantId, language, localizeMockReply, pushMessages]
  );

  /**
   * Injects an assistant message directly (no round-trip), used by the
   * proactive behavioral trigger to post its contextual greeting the
   * instant the user accepts it.
   */
  const injectAssistantMessage = useCallback(
    (text) => {
      pushMessages({ role: "assistant", type: "text", text });
    },
    [pushMessages]
  );

  // --- Quick link: "Book Appointment" -> kick off patient registration ---
  const startBookingFlow = useCallback(() => {
    pushMessages(
      { role: "user", type: "text", text: t("quickBook") },
      { role: "assistant", type: "patient-form", text: t("patientFormPrompt"), status: "pending" }
    );
  }, [pushMessages, t]);

  // --- Patient registration form submitted ---
  const submitPatientForm = useCallback(
    async (messageId, formData) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, status: "submitted", formData } : m))
      );
      setIsTyping(true);
      try {
        await new Promise((r) => setTimeout(r, 500));
        const reply = await localizeMockReply(mockAllDoctorsSearch.reply);
        setMessages((prev) => [...prev, toAssistantMessage(reply)]);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsTyping(false);
      }
    },
    [localizeMockReply]
  );

  // --- "Book Slot" tapped on a doctor card -> show time slot buttons ---
  const requestSlots = useCallback(
    (doctor) => {
      pushMessages({
        role: "assistant",
        type: "slot-picker",
        text: `${t("slotPickerPrefix")} ${doctor.name}:`,
        doctor,
        slots: doctor.slots?.length ? doctor.slots : DEFAULT_SLOTS,
        selectedSlot: null,
      });
    },
    [pushMessages, t]
  );

  // --- A time slot was tapped -> lock the picker, confirm the booking ---
  const confirmBooking = useCallback(
    async (slotMessageId, doctor, slot) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === slotMessageId ? { ...m, selectedSlot: slot } : m))
      );
      setIsTyping(true);
      try {
        let confirmationText;
        if (MOCK_MODE) {
          await new Promise((r) => setTimeout(r, 700));
          confirmationText = await translateText(mockBookingConfirmation.message, language);
        } else {
          const confirmation = await bookDoctorSlot(sessionIdRef.current, doctor.id, slot, tenantId);
          confirmationText = confirmation.message;
        }
        pushMessages({ role: "assistant", type: "booking-success", text: confirmationText, doctor, slot });
      } catch {
        pushMessages({
          role: "assistant",
          type: "text",
          text: `Couldn't confirm that slot with ${doctor.name}. Please pick another time.`,
        });
      } finally {
        setIsTyping(false);
      }
    },
    [tenantId, language, pushMessages]
  );

  return {
    sessionId: sessionIdRef.current,
    messages,
    isLoadingHistory,
    isTyping,
    error,
    sendMessage,
    injectAssistantMessage,
    startBookingFlow,
    submitPatientForm,
    requestSlots,
    confirmBooking,
  };
}
