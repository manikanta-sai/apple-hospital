import { useState, useRef, useCallback } from "react";
import { Send, Mic, MicOff } from "lucide-react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { useLanguage } from "../i18n/LanguageContext";

/**
 * ChatInput
 * ---------
 * Text composer + voice dictation. Speech recognition streams interim
 * transcripts directly into the input's live text state so the user
 * sees words appear as they speak, then can edit before sending -
 * dictation replaces typing, it never auto-sends.
 */
export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);
  const { t, speechLang } = useLanguage();

  // Snapshot of the input value at the moment dictation starts, so
  // interim results append after whatever the user had already typed
  // rather than overwriting it.
  const baseTextRef = useRef("");

  const handleSpeechResult = useCallback((transcript, isFinal) => {
    setValue((baseTextRef.current + " " + transcript).trim());
    if (isFinal) {
      // Lock in the finalized transcript as the new base so a second
      // dictation burst (continuous=false restarts) appends correctly.
      baseTextRef.current = (baseTextRef.current + " " + transcript).trim();
    }
  }, []);

  const { isSupported: micSupported, isListening, start, stop } = useSpeechRecognition({
    lang: speechLang,
    onResult: handleSpeechResult,
  });

  const toggleMic = () => {
    if (isListening) {
      stop();
    } else {
      baseTextRef.current = value; // start appending from current text
      start();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    if (isListening) stop();
    onSend(value);
    setValue("");
    baseTextRef.current = "";
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 border-t border-clinical-100 bg-white px-3 py-3"
    >
      {/* Voice-to-text - hidden entirely on unsupported browsers (e.g.
          Firefox) rather than rendering a dead button. */}
      {micSupported && (
        <button
          type="button"
          onClick={toggleMic}
          aria-label={isListening ? "Stop dictation" : "Start voice dictation"}
          className={[
            "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-colors",
            isListening
              ? "animate-pulse bg-coral-600 text-white"
              : "bg-clinical-50 text-clinical-700 hover:bg-clinical-100",
          ].join(" ")}
        >
          {isListening ? <MicOff size={16} /> : <Mic size={16} />}
        </button>
      )}

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          baseTextRef.current = e.target.value;
        }}
        placeholder={isListening ? t("listening") : t("inputPlaceholder")}
        disabled={disabled}
        className="flex-1 rounded-full border border-clinical-100 bg-clinical-50 px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-300 outline-none transition-shadow focus:border-clinical-500 focus:ring-2 focus:ring-clinical-500/20 disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-clinical-700 text-white transition-colors hover:bg-clinical-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Send size={16} />
      </button>
    </form>
  );
}
