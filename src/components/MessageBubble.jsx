import { Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

/**
 * MessageBubble
 * -------------
 * Plain-text chat bubble. Assistant bubbles get an optional speaker
 * icon that reads the message aloud via SpeechSynthesis - useful for
 * elderly patients or anyone typing one-handed on mobile.
 *
 * `speak`/`speakingId`/`isSupported` come from a SINGLE shared
 * useSpeechSynthesis() instance owned by ChatMessages (the browser
 * only plays one utterance at a time), passed down as props so every
 * bubble stays in sync about which one is currently playing.
 */
export default function MessageBubble({ message, onSpeak, speakingId, speechSupported }) {
  const isUser = message.role === "user";
  const { speechLang, t } = useLanguage();
  const isSpeaking = speakingId === message.id;

  return (
    <div className={`flex w-full items-end gap-1.5 ${isUser ? "justify-end" : "justify-start"} animate-fade-in-up`}>
      {!isUser && speechSupported && (
        <button
          type="button"
          onClick={() => onSpeak(message.id, message.text, speechLang)}
          aria-label={isSpeaking ? t("stopReading") : t("readAloud")}
          className={[
            "mb-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full transition-colors",
            isSpeaking ? "bg-clinical-700 text-white" : "text-clinical-700/60 hover:bg-clinical-100",
          ].join(" ")}
        >
          {isSpeaking ? <VolumeX size={13} /> : <Volume2 size={13} />}
        </button>
      )}

      <div
        className={[
          "max-w-[78%] whitespace-pre-wrap break-words px-4 py-2.5 text-[14.5px] leading-snug shadow-sm",
          isUser
            ? "rounded-bubble rounded-br-sm bg-clinical-700 text-white"
            : "rounded-bubble rounded-bl-sm bg-clinical-100 text-ink-900",
        ].join(" ")}
      >
        {message.text}
        <div className={`mt-1 text-[10px] ${isUser ? "text-white/60" : "text-ink-600/60"}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  );
}
