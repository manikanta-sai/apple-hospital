import { useEffect, useRef, useState, useCallback } from "react";

/**
 * useSpeechRecognition
 * ---------------------
 * Thin wrapper around the browser's native SpeechRecognition API
 * (Chrome/Edge/Safari as `webkitSpeechRecognition`; unprefixed in some
 * newer browsers). No polyfill is bundled — if unsupported (e.g.
 * Firefox), `isSupported` is false and the caller should hide the mic
 * button rather than render a dead control.
 *
 * @param {string} lang        BCP-47 tag, e.g. "en-US", "hi-IN"
 * @param {function} onResult  ({ finalTranscript, interimTranscript }) => void
 * @param {boolean} continuous Keep the recognition service open for continuous speech.
 * @param {boolean} restartOnEnd Restart when the browser ends a recognition session.
 */
export function useSpeechRecognition({ lang = "en-US", onResult, continuous = false, restartOnEnd = false } = {}) {
  const [isListening, setIsListening] = useState(false);
  const [recognitionError, setRecognitionError] = useState("");
  const [isSupported] = useState(
    () => typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  );
  const recognitionRef = useRef(null);
  const shouldListenRef = useRef(false);
  const restartTimerRef = useRef(null);
  // Keep the latest callback in a ref so we don't have to tear down and
  // rebuild the recognition instance every time the parent re-renders
  // with a new inline function.
  const onResultRef = useRef(onResult);
  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    if (!isSupported) return undefined;

    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = continuous;
    recognition.interimResults = true; // stream partial words as the user speaks
    recognition.lang = lang;

    let restartAttempts = 0;
    const scheduleRestart = () => {
      if (!shouldListenRef.current) return;
      window.clearTimeout(restartTimerRef.current);
      restartTimerRef.current = window.setTimeout(() => {
        restartTimerRef.current = null;
        if (!shouldListenRef.current) return;
        try {
          recognition.start();
          restartAttempts = 0;
        } catch {
          restartAttempts += 1;
          if (restartAttempts < 4) {
            scheduleRestart();
          } else {
            shouldListenRef.current = false;
            setRecognitionError("restart-failed");
            setIsListening(false);
          }
        }
      }, 250);
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript || interimTranscript) setRecognitionError("");
      onResultRef.current?.({ finalTranscript, interimTranscript });
    };
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => {
      if (restartOnEnd && shouldListenRef.current) {
        scheduleRestart();
      } else {
        setIsListening(false);
      }
    };
    recognition.onerror = (event) => {
      if (event.error !== "aborted" && shouldListenRef.current) {
        setRecognitionError(event.error);
      }
      if (["not-allowed", "service-not-allowed", "audio-capture", "language-not-supported"].includes(event.error)) {
        shouldListenRef.current = false;
        window.clearTimeout(restartTimerRef.current);
        restartTimerRef.current = null;
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;
    return () => {
      shouldListenRef.current = false;
      window.clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
      recognition.onresult = null;
      recognition.onstart = null;
      recognition.onend = null;
      recognition.onerror = null;
      try {
        recognition.stop();
      } catch {
        // The browser can reject stop() when recognition has already ended.
      }
    };
  }, [continuous, lang, isSupported, restartOnEnd]);

  const start = useCallback(() => {
    if (!recognitionRef.current || shouldListenRef.current) return;
    shouldListenRef.current = true;
    setRecognitionError("");
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (error) {
      setRecognitionError(error.name || "start-failed");
      shouldListenRef.current = error.name === "InvalidStateError";
      setIsListening(error.name === "InvalidStateError");
    }
  }, []);

  const stop = useCallback(() => {
    shouldListenRef.current = false;
    setRecognitionError("");
    window.clearTimeout(restartTimerRef.current);
    restartTimerRef.current = null;
    try {
      recognitionRef.current?.stop();
    } catch {
      // The browser can reject stop() when recognition has already ended.
    }
    setIsListening(false);
  }, []);

  const toggle = useCallback(() => {
    isListening ? stop() : start();
  }, [isListening, start, stop]);

  return { isSupported, isListening, recognitionError, start, stop, toggle };
}
