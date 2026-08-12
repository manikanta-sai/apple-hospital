import { useRef, useCallback, useEffect } from "react";
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
export default function ChatInput({ onSend, onValueChange, value = "", disabled, hasAttachments, onListeningChange, addButton }) {
  const inputRef = useRef(null);
  const { t, speechLang } = useLanguage();

  // Snapshot of the input value at the moment dictation starts, so
  // interim results append after whatever the user had already typed
  // rather than overwriting it.
  const baseTextRef = useRef("");

  const handleSpeechResult = useCallback(
    (transcript, isFinal) => {
      const nextValue = (baseTextRef.current + " " + transcript).trim();
      onValueChange?.(nextValue);
      if (isFinal) {
        baseTextRef.current = nextValue;
      }
    },
    [onValueChange]
  );

  const { isSupported: micSupported, isListening, start, stop } = useSpeechRecognition({
    lang: speechLang,
    onResult: handleSpeechResult,
  });

  useEffect(() => {
    onListeningChange?.(isListening);
  }, [isListening, onListeningChange]);

  // --- Controls Disabled State Calculation ---
  // `disabled` represents bot loading / typing / API request in progress
  const isBotBusy = disabled;

  // 1. Text input disabled when bot is busy OR speech-to-text is actively listening
  const isInputDisabled = isBotBusy || isListening;

  // 2. Submit button disabled when bot is busy OR speech-to-text is listening OR input is empty (unless attachments are present)
  const isSubmitDisabled = isBotBusy || isListening || (!value.trim() && !hasAttachments);

  // 3. Mic control disabled ONLY when bot is busy
  //    (remains enabled while listening so user can tap to stop dictation)
  const isMicDisabled = isBotBusy;

  const prevInputDisabledRef = useRef(isInputDisabled);

  // Automatically handle state transitions:
  // 1. Stop voice dictation if bot becomes busy while listening.
  // 2. Re-focus text input when it transitions from disabled to enabled.
  useEffect(() => {
    onListeningChange?.(isListening);
    if (isBotBusy && isListening) {
      stop();
    }
    if (prevInputDisabledRef.current && !isInputDisabled) {
      inputRef.current?.focus();
    }
    prevInputDisabledRef.current = isInputDisabled;
  }, [isBotBusy, isListening, isInputDisabled, onListeningChange, stop]);

  const toggleMic = () => {
    if (isMicDisabled) return;
    if (isListening) {
      stop();
    } else {
      baseTextRef.current = value; // start appending from current text
      start();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitDisabled) return;
    if (isListening) stop();
    onSend(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 border-t border-clinical-100 bg-white px-3 py-3"
    >
      {/* Voice-to-text button - disabled while bot is busy, enabled while listening to allow stopping */}
      {micSupported && (
        <button
          type="button"
          onClick={toggleMic}
          disabled={isMicDisabled}
          aria-label={isListening ? "Stop dictation" : "Start voice dictation"}
          className={[
            "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-colors",
            isListening
              ? "animate-pulse bg-coral-600 text-white"
              : "bg-clinical-50 text-clinical-700 hover:bg-clinical-100",
            "disabled:cursor-not-allowed disabled:opacity-40",
          ].join(" ")}
        >
          {isListening ? <MicOff size={16} /> : <Mic size={16} />}
        </button>
      )}

      {addButton}

      {/* Text input field - disabled while bot is busy OR while speech-to-text is listening */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => {
          onValueChange?.(e.target.value);
          baseTextRef.current = e.target.value;
        }}
        placeholder={isListening ? t("listening") : t("inputPlaceholder")}
        disabled={isInputDisabled}
        className="flex-1 rounded-full border border-clinical-100 bg-clinical-50 px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-300 outline-none transition-shadow focus:border-clinical-500 focus:ring-2 focus:ring-clinical-500/20 disabled:cursor-not-allowed disabled:opacity-60"
      />

      {/* Submit button - disabled while bot is busy, listening, or if value is empty */}
      <button
        type="submit"
        disabled={isSubmitDisabled}
        aria-label="Send message"
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-clinical-700 text-white transition-colors hover:bg-clinical-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Send size={16} />
      </button>
    </form>
  );
}
