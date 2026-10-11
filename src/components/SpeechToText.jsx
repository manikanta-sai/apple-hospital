import { useEffect, useState } from "react";
import { ArrowLeft, Check, Copy, Mic, RotateCcw, Square } from "lucide-react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";

const LANGUAGES = [
  { code: "en-IN", label: "English (India)" },
  { code: "en-US", label: "English (US)" },
  { code: "en-GB", label: "English (UK)" },
  { code: "hi-IN", label: "Hindi" },
  { code: "ta-IN", label: "Tamil" },
  { code: "te-IN", label: "Telugu" },
  { code: "ml-IN", label: "Malayalam" },
];
const MAX_LISTENING_DURATION_MS = 2 * 60 * 1000;

function appendText(current, next) {
  const trimmed = next.trim();
  if (!trimmed) return current;
  return current ? `${current.trimEnd()} ${trimmed}` : trimmed;
}

export default function SpeechToText({ navigateTo }) {
  const [language, setLanguage] = useState("en-IN");
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [copied, setCopied] = useState(false);
  const [limitReached, setLimitReached] = useState(false);

  const { isSupported, isListening, recognitionError, start, stop } = useSpeechRecognition({
    lang: language,
    continuous: true,
    restartOnEnd: true,
    onResult: ({ finalTranscript, interimTranscript }) => {
      if (finalTranscript) {
        setTranscript((current) => appendText(current, finalTranscript));
      }
      setInterim(interimTranscript);
    },
  });

  const displayedTranscript = interim ? appendText(transcript, interim) : transcript;

  useEffect(() => {
    if (!isListening) return undefined;
    const timeout = window.setTimeout(() => {
      setLimitReached(true);
      stop();
    }, MAX_LISTENING_DURATION_MS);
    return () => window.clearTimeout(timeout);
  }, [isListening, stop]);

  const copyTranscript = async () => {
    if (!displayedTranscript) return;
    try {
      await navigator.clipboard.writeText(displayedTranscript);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const clearTranscript = () => {
    setTranscript("");
    setInterim("");
    setCopied(false);
  };

  const startListening = () => {
    setLimitReached(false);
    start();
  };
  const stopListening = () => stop();

  const statusTitle = !isSupported
    ? "Speech recognition unavailable"
    : recognitionError
      ? "Speech recognition issue"
      : limitReached
        ? "Two-minute listening limit reached"
      : isListening
      ? "Listening"
      : "Ready to listen";
  const errorMessages = {
    "no-speech": "No speech was recognized. Check microphone access and speak clearly.",
    network: "The speech service could not be reached. Check your internet connection and try again.",
    "not-allowed": "Microphone or speech access was denied. Allow access in your browser settings.",
    "service-not-allowed": "The browser speech service denied access. Check browser settings or try another browser.",
    "audio-capture": "No microphone input is available. Check your microphone connection and permissions.",
    "language-not-supported": "This browser does not support the selected recognition language.",
    "restart-failed": "Listening could not reconnect. Press Start to try again.",
  };
  const statusDescription = !isSupported
    ? "Try a browser that supports speech recognition, such as Chrome or Edge."
    : recognitionError
      ? errorMessages[recognitionError] || "Speech recognition stopped unexpectedly. Press Start to try again."
      : limitReached
        ? "Listening stopped automatically. Press Start to continue."
      : isListening
      ? "Transcribing into your draft. Click Stop when you finish speaking. Listening stops automatically after 2 minutes."
      : "Press Start to let your browser microphone listen.";

  return (
    <div className="min-h-screen bg-clinical-50 text-ink-900">
      <header className="border-b border-clinical-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div>
            <h1 className="font-display text-lg font-bold text-clinical-900">
              Get Well Multispecialty Hospital
            </h1>
            <p className="mt-1 text-xs text-ink-600">Speech tools</p>
          </div>
          <button
            type="button"
            onClick={() => navigateTo("/")}
            className="inline-flex items-center gap-2 rounded-md border border-clinical-100 px-3 py-2 text-xs font-semibold text-clinical-700 transition-colors hover:bg-clinical-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clinical-500"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Dashboard
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-7 sm:px-8 sm:py-10">
        <section aria-label="Speech transcription">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-clinical-950">Dictate directly into an editable draft.</p>
              <p className="mt-1 max-w-xl text-xs leading-5 text-ink-600">
                Browser recognition uses the selected language. Mixed English, Hindi, and Telugu may be transcribed inaccurately.
              </p>
            </div>
            <label className="flex items-center gap-2 text-xs font-semibold text-ink-600">
              Language
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                disabled={isListening}
                className="min-h-10 rounded-md border border-clinical-200 bg-white px-3 text-sm font-medium text-clinical-900 outline-none transition focus:border-clinical-500 focus:ring-2 focus:ring-clinical-100 disabled:cursor-not-allowed disabled:bg-clinical-50"
              >
                {LANGUAGES.map((item) => (
                  <option key={item.code} value={item.code}>{item.label}</option>
                ))}
              </select>
            </label>
          </div>

          <div className={`mb-5 flex flex-col gap-4 rounded-md p-4 text-white transition-colors sm:flex-row sm:items-center sm:justify-between sm:px-5 ${isListening ? "bg-clinical-900" : "bg-clinical-950"}`}>
            <div aria-live="polite" aria-atomic="true" className="flex items-start gap-3">
              <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${isListening ? "animate-pulse bg-coral-500" : isSupported ? "bg-emerald-400" : "bg-rose-400"}`} />
              <div>
                <div className="flex min-h-5 items-center gap-2">
                  <p className="text-sm font-bold">{statusTitle}</p>
                  {isListening && (
                    <span className="speech-wave" aria-hidden="true">
                      {Array.from({ length: 7 }, (_, barIndex) => (
                        <span
                          key={barIndex}
                          className="speech-wave-bar"
                          style={{
                            animationDelay: `${barIndex * 90}ms`,
                            height: `${8 + (barIndex % 3) * 4}px`,
                          }}
                        />
                      ))}
                    </span>
                  )}
                </div>
                <p className="mt-1 max-w-md text-xs leading-5 text-white/75">{statusDescription}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
              {!isListening ? (
                <button
                  type="button"
                  onClick={startListening}
                  disabled={!isSupported}
                  className="inline-flex min-h-11 items-center gap-2 rounded-md bg-white px-4 text-xs font-bold text-clinical-950 transition-colors hover:bg-clinical-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-clinical-950 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Mic size={15} aria-hidden="true" />
                  Start
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopListening}
                  className="inline-flex min-h-11 items-center gap-2 rounded-md border border-rose-300/60 px-4 text-xs font-semibold text-rose-100 transition-colors hover:bg-rose-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200"
                >
                  <Square size={13} aria-hidden="true" />
                  Stop
                </button>
              )}
            </div>
          </div>

          <label htmlFor="speech-transcript" className="sr-only">Transcript text</label>
          <textarea
            id="speech-transcript"
            value={displayedTranscript}
            onChange={(event) => {
              setTranscript(event.target.value);
              setInterim("");
            }}
            placeholder="Your transcription will appear here. You can also type or edit the text."
            className="min-h-48 w-full resize-y rounded-md border border-clinical-200 bg-white p-5 text-sm leading-7 text-ink-900 shadow-sm outline-none transition placeholder:text-ink-300 focus:border-clinical-500 focus:ring-2 focus:ring-clinical-100 sm:min-h-64"
          />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-ink-600">
              {displayedTranscript.trim() ? `${displayedTranscript.trim().split(/\s+/).length} words` : "Editable draft"}
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={clearTranscript}
                disabled={!displayedTranscript && !interim}
                className="inline-flex min-h-10 items-center gap-2 rounded-md border border-clinical-200 bg-white px-3 text-xs font-semibold text-clinical-700 transition-colors hover:bg-clinical-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RotateCcw size={14} aria-hidden="true" />
                Clear
              </button>
              <button
                type="button"
                onClick={copyTranscript}
                disabled={!displayedTranscript}
                className="inline-flex min-h-10 items-center gap-2 rounded-md border border-clinical-200 bg-white px-3 text-xs font-semibold text-clinical-700 transition-colors hover:bg-clinical-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                {copied ? "Copied" : "Copy text"}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}