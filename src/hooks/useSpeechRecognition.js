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
 * @param {function} onResult  (transcript: string, isFinal: boolean) => void
 */
export function useSpeechRecognition({ lang = "en-US", onResult } = {}) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported] = useState(
    () => typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  );
  const recognitionRef = useRef(null);
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
    recognition.continuous = false; // stop automatically after a pause
    recognition.interimResults = true; // stream partial words as the user speaks
    recognition.lang = lang;

    recognition.onresult = (event) => {
      let transcript = "";
      let isFinal = false;
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
        if (event.results[i].isFinal) isFinal = true;
      }
      onResultRef.current?.(transcript, isFinal);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    return () => {
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
      recognition.stop();
    };
  }, [lang, isSupported]);

  const start = useCallback(() => {
    if (!recognitionRef.current || isListening) return;
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch {
      // Calling start() while already active throws in some browsers -
      // safe to ignore, state will resync via onend/onerror.
    }
  }, [isListening]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const toggle = useCallback(() => {
    isListening ? stop() : start();
  }, [isListening, start, stop]);

  return { isSupported, isListening, start, stop, toggle };
}
