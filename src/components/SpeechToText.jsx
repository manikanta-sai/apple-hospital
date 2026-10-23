import { useEffect, useState } from "react";
import { Check, Copy, Download, Info, Mic, RotateCcw, Square } from "lucide-react";
import RouteTopBar from "./common/RouteTopBar.jsx";
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

// ─── Shared style tokens ─────────────────────────────────────────────────────

const GLASS = {
  background: "rgba(255,255,255,0.78)",
  border: "1px solid rgba(0,0,0,0.07)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  boxShadow: "0 2px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
};

export default function SpeechToText({ navigateTo }) {
  const [language, setLanguage]       = useState("en-IN");
  const [transcript, setTranscript]   = useState("");
  const [interim, setInterim]         = useState("");
  const [copied, setCopied]           = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [timerPct, setTimerPct]       = useState(0);

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

  // Auto-stop after 2 min + drive the progress bar
  useEffect(() => {
    if (!isListening) { setTimerPct(0); return undefined; }
    const startTime = Date.now();
    const tick = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      setTimerPct(Math.min((elapsed / MAX_LISTENING_DURATION_MS) * 100, 100));
      if (elapsed >= MAX_LISTENING_DURATION_MS) {
        setLimitReached(true);
        stop();
      }
    }, 500);
    return () => window.clearInterval(tick);
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

  const exportTranscript = () => {
    if (!displayedTranscript) return;
    const blob = new Blob([displayedTranscript], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = "transcript.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearTranscript = () => {
    setTranscript("");
    setInterim("");
    setCopied(false);
  };

  const startListening = () => { setLimitReached(false); start(); };
  const stopListening  = () => stop();

  // ── Status text ──────────────────────────────────────────────────────────
  const statusTitle = !isSupported
    ? "Speech recognition unavailable"
    : recognitionError
      ? "Speech recognition issue"
      : limitReached
        ? "Two-minute limit reached"
        : isListening
          ? "Listening"
          : "Ready to listen";

  const errorMessages = {
    "no-speech":             "No speech was recognised. Check microphone access and speak clearly.",
    network:                 "The speech service could not be reached. Check your internet connection.",
    "not-allowed":           "Microphone access was denied. Allow it in your browser settings.",
    "service-not-allowed":   "The browser speech service denied access. Try another browser.",
    "audio-capture":         "No microphone input available. Check your microphone connection.",
    "language-not-supported":"This browser does not support the selected recognition language.",
    "restart-failed":        "Listening could not reconnect. Press Start to try again.",
  };

  const statusDesc = !isSupported
    ? "Try a browser that supports speech recognition, such as Chrome or Edge."
    : recognitionError
      ? errorMessages[recognitionError] || "Speech recognition stopped unexpectedly. Press Start to try again."
      : limitReached
        ? "Listening stopped automatically after 2 minutes. Press Start to continue."
        : isListening
          ? "Transcribing into your draft. Click Stop when you finish speaking."
          : "Press the microphone to let your browser listen and transcribe in real-time.";

  const wordCount = displayedTranscript.trim()
    ? displayedTranscript.trim().split(/\s+/).length
    : 0;

  // ── Mic button colours ────────────────────────────────────────────────────
  const micBg    = isListening
    ? "linear-gradient(135deg,#ef4444,#f97316)"
    : "linear-gradient(135deg,#6366f1,#8b5cf6)";
  const dotColor = isListening ? "#6366f1"
    : recognitionError || !isSupported ? "#ef4444"
    : "#22c55e";

  return (
    <div
      className="animate-slide-up"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(145deg,#f0f4ff 0%,#faf5ff 45%,#f0fdf9 100%)",
        color: "#0f172a",
        fontFamily: "'Inter',sans-serif",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* ── Ambient orbs ── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 600, height: 600, top: -180, left: -120, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.09) 0%,transparent 65%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", width: 500, height: 500, bottom: -120, right: -100, borderRadius: "50%", background: "radial-gradient(circle,rgba(14,165,233,0.08) 0%,transparent 65%)", filter: "blur(60px)" }} />
      </div>

      {/* ── Universal Header matching reference design ── */}
      <RouteTopBar
        onBack={() => navigateTo("/")}
        backLabel="Back to Home"
        hospitalName="ABCD Multispecialty Hospital"
        badge="SPEECH RECOGNITION"
        badgeBg="#e0f2fe"
        badgeColor="#0284c7"
        title="Multilingual Medical Speech-to-Text"
        rightControls={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 99, background: "rgba(2,132,199,0.08)", border: "1px solid rgba(2,132,199,0.20)", color: "#0369a1", fontSize: 12, fontWeight: 600 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#0284c7" }} />
              Live Speech Engine
            </span>
          </div>
        }
      />

      {/* ── Main ── */}
      <main style={{ padding: "44px 24px 80px", position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto" }}>

        {/* Page title */}
        <div style={{ marginBottom: 36 }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: "#6366f1", textTransform: "uppercase", marginBottom: 8 }}>
            Speech Tools
          </p>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "clamp(24px,3.5vw,34px)", fontWeight: 800, color: "#0f172a", lineHeight: 1.1 }}>
            Speech to{" "}
            <span style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Text
            </span>
          </h1>
          <p style={{ marginTop: 8, fontSize: 14, color: "#64748b", maxWidth: 520, lineHeight: 1.6 }}>
            Dictate directly into an editable draft. Browser recognition uses the selected language.
          </p>
        </div>

        {/* ── Language pill selector ── */}
        <div style={{ ...GLASS, borderRadius: 16, padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />
            </svg>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>Language</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                disabled={isListening}
                onClick={() => setLanguage(lang.code)}
                style={{
                  fontSize: 12, fontWeight: language === lang.code ? 600 : 500,
                  padding: "6px 14px", borderRadius: 999,
                  border: language === lang.code ? "1px solid rgba(99,102,241,0.30)" : "1px solid rgba(0,0,0,0.08)",
                  background: language === lang.code ? "rgba(99,102,241,0.10)" : "transparent",
                  color: language === lang.code ? "#4f46e5" : "#64748b",
                  cursor: isListening ? "not-allowed" : "pointer",
                  opacity: isListening && language !== lang.code ? 0.5 : 1,
                  transition: "all 0.18s",
                  fontFamily: "'Inter',sans-serif",
                }}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Mic + Status card ── */}
        <div
          aria-label="Recording status"
          style={{ ...GLASS, borderRadius: 20, padding: 32, marginBottom: 20, position: "relative", overflow: "hidden" }}
        >
          {/* Top accent line */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#6366f1,#8b5cf6,#a855f7)", borderRadius: "20px 20px 0 0" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>

            {/* Big mic button */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, flexShrink: 0 }}>
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                disabled={!isSupported}
                aria-label={isListening ? "Stop listening" : "Start listening"}
                style={{
                  width: 80, height: 80, borderRadius: "50%",
                  background: isSupported ? micBg : "rgba(0,0,0,0.12)",
                  border: "none", cursor: isSupported ? "pointer" : "not-allowed",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: isListening
                    ? "0 0 0 0 rgba(99,102,241,0.4)"
                    : "0 8px 28px rgba(99,102,241,0.28)",
                  animation: isListening ? "sttMicRing 1.4s ease-out infinite" : "none",
                  transition: "background 0.3s, box-shadow 0.3s",
                }}
              >
                {isListening
                  ? <Square size={28} color="white" aria-hidden="true" />
                  : <Mic size={28} color="white" aria-hidden="true" />
                }
              </button>
              <span style={{ fontSize: 12, fontWeight: 600, color: isListening ? "#ef4444" : "#6366f1" }}>
                {isListening ? "Listening…" : "Tap to start"}
              </span>
            </div>

            {/* Status info */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span
                  style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: dotColor, flexShrink: 0,
                    animation: isListening ? "sttDotPulse 1.8s ease-in-out infinite" : "none",
                  }}
                />
                <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 17, fontWeight: 700, color: "#0f172a" }}>
                  {statusTitle}
                </span>
              </div>

              {/* Wave bars */}
              {isListening && (
                <div aria-hidden="true" style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 22, marginBottom: 8 }}>
                  {[8, 14, 10, 18, 12, 16, 9].map((h, i) => (
                    <span
                      key={i}
                      style={{
                        width: 3, height: h, borderRadius: 99,
                        background: "#6366f1", transformOrigin: "center",
                        animation: `sttWaveBar 0.85s ${i * 90}ms ease-in-out infinite`,
                      }}
                    />
                  ))}
                </div>
              )}

              <p aria-live="polite" style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, maxWidth: 440 }}>
                {statusDesc}
              </p>

              {/* Timer bar */}
              {isListening && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 500, color: "#94a3b8", whiteSpace: "nowrap" }}>Auto-stops at 2:00</span>
                  <div style={{ flex: 1, maxWidth: 200, height: 3, background: "rgba(0,0,0,0.08)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${timerPct}%`, background: "linear-gradient(90deg,#6366f1,#8b5cf6)", borderRadius: 99, transition: "width 0.5s linear" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Explicit Stop button when listening */}
            {isListening && (
              <button
                type="button"
                onClick={stopListening}
                style={{
                  padding: "12px 20px", borderRadius: 12, fontSize: 13, fontWeight: 600,
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "rgba(239,68,68,0.08)", color: "#dc2626",
                  border: "1px solid rgba(239,68,68,0.20)", cursor: "pointer",
                  transition: "background 0.18s", flexShrink: 0,
                  fontFamily: "'Inter',sans-serif",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.14)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
              >
                <Square size={13} aria-hidden="true" />
                Stop
              </button>
            )}
          </div>
        </div>

        {/* ── Transcript card ── */}
        <div style={{ ...GLASS, borderRadius: 20, overflow: "hidden", marginBottom: 12 }}>

          {/* Toolbar */}
          <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" />
              </svg>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>Transcript Draft</span>
              {/* Word count chip */}
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 500, color: "#64748b", background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 999, padding: "3px 10px" }}>
                {wordCount} {wordCount === 1 ? "word" : "words"}
              </span>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              {/* Clear */}
              <ToolbarBtn
                icon={<RotateCcw size={13} aria-hidden="true" />}
                label="Clear"
                disabled={!displayedTranscript && !interim}
                onClick={clearTranscript}
              />
              {/* Copy */}
              <ToolbarBtn
                icon={copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
                label={copied ? "Copied!" : "Copy text"}
                disabled={!displayedTranscript}
                onClick={copyTranscript}
              />
              {/* Export */}
              <button
                type="button"
                disabled={!displayedTranscript}
                onClick={exportTranscript}
                style={{
                  padding: "7px 14px", borderRadius: 9, fontSize: 12, fontWeight: 600,
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: displayedTranscript ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "rgba(0,0,0,0.06)",
                  color: displayedTranscript ? "white" : "#94a3b8",
                  border: "none", cursor: displayedTranscript ? "pointer" : "not-allowed",
                  boxShadow: displayedTranscript ? "0 4px 14px rgba(99,102,241,0.28)" : "none",
                  transition: "all 0.18s",
                  fontFamily: "'Inter',sans-serif",
                }}
              >
                <Download size={13} aria-hidden="true" />
                Export
              </button>
            </div>
          </div>

          {/* Textarea */}
          <label htmlFor="speech-transcript" className="sr-only">Transcript text</label>
          <textarea
            id="speech-transcript"
            value={displayedTranscript}
            onChange={(e) => { setTranscript(e.target.value); setInterim(""); }}
            placeholder="Your transcription will appear here. You can also type or edit the text freely…"
            style={{
              width: "100%", minHeight: 220, padding: 20,
              border: "none", background: "transparent",
              fontSize: 14, lineHeight: 1.8,
              fontFamily: "'Inter',sans-serif",
              color: "#0f172a", resize: "vertical",
              outline: "none",
            }}
          />
        </div>

        {/* Hint row */}
        <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "0 4px" }}>
          <Info size={13} color="#94a3b8" aria-hidden="true" />
          <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>
            Mixed languages (e.g. Hindi + English) may reduce accuracy. Listening auto-stops after 2 minutes.
          </p>
        </div>
      </main>

      {/* ── Keyframes injected once ── */}
      <style>{`
        @keyframes sttMicRing {
          0%   { box-shadow: 0 0 0 0 rgba(99,102,241,0.40); }
          70%  { box-shadow: 0 0 0 18px rgba(99,102,241,0); }
          100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); }
        }
        @keyframes sttDotPulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%     { opacity:.6; transform:scale(1.4); }
        }
        @keyframes sttWaveBar {
          0%,100% { transform:scaleY(0.30); opacity:.55; }
          50%     { transform:scaleY(1);    opacity:1;   }
        }
      `}</style>
    </div>
  );
}

// ── Small reusable toolbar button ──────────────────────────────────────────────
function ToolbarBtn({ icon, label, disabled, onClick }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{
        padding: "7px 14px", borderRadius: 9, fontSize: 12, fontWeight: 600,
        display: "inline-flex", alignItems: "center", gap: 6,
        background: "rgba(0,0,0,0.04)", color: disabled ? "#94a3b8" : "#475569",
        border: "1px solid rgba(0,0,0,0.07)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "background 0.18s",
        fontFamily: "'Inter',sans-serif",
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = "rgba(0,0,0,0.07)"; }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.background = "rgba(0,0,0,0.04)"; }}
    >
      {icon}
      {label}
    </button>
  );
}
