import { useState, useCallback, useEffect } from "react";

/**
 * useSpeechSynthesis
 * -------------------
 * Wraps window.speechSynthesis. Instantiate this ONCE at a shared
 * ancestor (ChatMessages, not each MessageBubble) because the browser
 * only supports a single active utterance at a time — a single shared
 * `speakingId` lets every bubble know whether *it* is the one currently
 * playing, so only one speaker icon shows the "playing" state.
 */
export function useSpeechSynthesis() {
  const [speakingId, setSpeakingId] = useState(null);
  const [isSupported] = useState(() => typeof window !== "undefined" && "speechSynthesis" in window);

  const speak = useCallback(
    (id, text, lang = "en-US") => {
      if (!isSupported || !text) return;

      // Toggle off if this bubble is already speaking.
      if (speakingId === id) {
        window.speechSynthesis.cancel();
        setSpeakingId(null);
        return;
      }

      window.speechSynthesis.cancel(); // only one utterance at a time
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.98; // marginally slower - easier to follow for elderly users
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);

      setSpeakingId(id);
      window.speechSynthesis.speak(utterance);
    },
    [isSupported, speakingId]
  );

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeakingId(null);
  }, []);

  // Stop any in-flight speech if the widget unmounts (e.g. widget closed).
  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  return { isSupported, speakingId, speak, stop };
}
