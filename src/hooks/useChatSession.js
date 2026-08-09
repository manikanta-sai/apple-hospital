import { useState, useEffect, useCallback, useRef } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { generateId } from "../utils/generateId";
import { fetchChatHistory, sendChatMessage, bookDoctorSlot } from "../services/chatApi";
import {
  mockCardiologySearch,
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
 * Owns everything related to a single chat conversation:
 *  - Session id: generated/persisted in localStorage so the conversation
 *    survives refreshes and page navigation, then hydrates message
 *    history for that id from the backend on mount.
 *  - Normalizes whatever shape the backend returns into a flat
 *    `messages` array the UI can render generically by `type`.
 *  - Drives the full booking journey as a sequence of message types:
 *      quick-link tap
 *        -> "patient-form"   (name + mobile capture)
 *        -> "doctor-list"    (existing card rail)
 *        -> "slot-picker"    (time slot buttons, after "Book Slot")
 *        -> "booking-success"(confirmation card)
 */
export function useChatSession({ tenantId } = {}) {
  // --- Session id: created once, then persisted forever (per browser) ---
  const [sessionId] = useLocalStorage("hc_session_id", null);
  const sessionIdRef = useRef(sessionId ?? generateId("session"));
  const [, setSessionIdStorage] = useLocalStorage("hc_session_id", sessionIdRef.current);
  useEffect(() => {
    setSessionIdStorage(sessionIdRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [messages, setMessages] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

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
  }, []);

  /** Converts a raw backend `reply` object into a renderable message. */
  const toAssistantMessage = (reply) => ({
    id: generateId("msg"),
    role: "assistant",
    type: reply.type || "text", // 'text' | 'doctor-list' | 'fallback'
    text: reply.text,
    doctors: reply.doctors || null,
    timestamp: new Date().toISOString(),
  });

  // --- Hydrate history on mount ---
  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      setIsLoadingHistory(true);
      try {
        if (MOCK_MODE) {
          // Simulate an empty history for a "fresh" demo session so the
          // widget opens with just the greeting - swap this for a
          // canned array if you want to demo returning-user history.
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
        if (!cancelled) setIsLoadingHistory(false);
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
    if (lower.includes("cardio") || lower.includes("heart") || lower.includes("doctor")) {
      return mockCardiologySearch;
    }
    if (lower.includes("enquiry") || lower.includes("enquire")) return mockEnquiryReply;
    if (lower.includes("address") || lower.includes("location")) return mockAddressReply;
    if (lower.includes("agent") || lower.includes("human")) return mockLiveAgentReply;
    return mockPlainTextReply; // covers "timings" and anything unmatched
  }

  // --- Send a free-typed (or quick-link-triggered) user message ---
  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      pushMessages({ role: "user", type: "text", text: trimmed });
      setIsTyping(true);
      setError(null);

      try {
        let payload;
        if (MOCK_MODE) {
          await new Promise((r) => setTimeout(r, 700 + Math.random() * 500));
          payload = pickMockReply(trimmed);
        } else {
          payload = await sendChatMessage(sessionIdRef.current, trimmed, tenantId);
        }
        setMessages((prev) => [...prev, toAssistantMessage(payload.reply)]);
      } catch (err) {
        setError(err.message);
        pushMessages({
          role: "assistant",
          type: "text",
          text: "Sorry, something went wrong reaching our servers. Please try again in a moment.",
        });
      } finally {
        setIsTyping(false);
      }
    },
    [tenantId, pushMessages]
  );

  // --- Quick link: "Book Appointment" -> kick off patient registration ---
  const startBookingFlow = useCallback(() => {
    pushMessages(
      { role: "user", type: "text", text: "Book Appointment" },
      {
        role: "assistant",
        type: "patient-form",
        text: "Sure! Please share the patient's details so we can find the right doctor:",
        status: "pending", // becomes "submitted" once the form is filled
      }
    );
  }, [pushMessages]);

  // --- Patient registration form submitted ---
  const submitPatientForm = useCallback(
    async (messageId, formData) => {
      // Lock the form in place and show what was entered, like a WhatsApp
      // business-chat form freezing after submission.
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, status: "submitted", formData } : m))
      );
      setIsTyping(true);
      await new Promise((r) => setTimeout(r, 500));
      // Proceed straight into doctor search, same payload used for the
      // "find a doctor" chat intent, so the two entry points converge.
      const payload = MOCK_MODE ? mockCardiologySearch : mockCardiologySearch; // swap for a real POST if desired
      setMessages((prev) => [...prev, toAssistantMessage(payload.reply)]);
      setIsTyping(false);
    },
    []
  );

  // --- "Book Slot" tapped on a doctor card -> show time slot buttons ---
  const requestSlots = useCallback(
    (doctor) => {
      pushMessages({
        role: "assistant",
        type: "slot-picker",
        text: `Great choice! Pick a convenient time slot with ${doctor.name}:`,
        doctor,
        slots: doctor.slots?.length ? doctor.slots : DEFAULT_SLOTS,
        selectedSlot: null,
      });
    },
    [pushMessages]
  );

  // --- A time slot was tapped -> lock the picker, confirm the booking ---
  const confirmBooking = useCallback(
    async (slotMessageId, doctor, slot) => {
      // Freeze the slot-picker message so buttons become non-interactive
      // and the chosen slot stays visibly highlighted.
      setMessages((prev) =>
        prev.map((m) => (m.id === slotMessageId ? { ...m, selectedSlot: slot } : m))
      );
      setIsTyping(true);
      try {
        let confirmation;
        if (MOCK_MODE) {
          await new Promise((r) => setTimeout(r, 700));
          confirmation = mockBookingConfirmation;
        } else {
          confirmation = await bookDoctorSlot(sessionIdRef.current, doctor.id, slot, tenantId);
        }
        pushMessages({
          role: "assistant",
          type: "booking-success",
          text: confirmation.message,
          doctor,
          slot,
        });
      } catch (err) {
        pushMessages({
          role: "assistant",
          type: "text",
          text: `Couldn't confirm that slot with ${doctor.name}. Please pick another time.`,
        });
      } finally {
        setIsTyping(false);
      }
    },
    [tenantId, pushMessages]
  );

  return {
    sessionId: sessionIdRef.current,
    messages,
    isLoadingHistory,
    isTyping,
    error,
    sendMessage,
    startBookingFlow,
    submitPatientForm,
    requestSlots,
    confirmBooking,
  };
}
