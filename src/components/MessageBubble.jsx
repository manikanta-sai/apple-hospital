import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function inlineFormat(text) {
  return text
    .replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

function parseMarkdown(text) {
  const escaped = escapeHtml(text || "");
  const lines = escaped.split("\n");
  const html = [];
  let inCodeBlock = false;
  let codeLines = [];
  let listType = null;
  let listItems = [];

  const flushList = () => {
    if (!listType) return;
    const tag = listType === "ol" ? "ol" : "ul";
    html.push(`<${tag} class="chat-markdown-list">${listItems.join("")}</${tag}>`);
    listType = null;
    listItems = [];
  };

  const flushCode = () => {
    if (!inCodeBlock) return;
    html.push(
      `<pre class="chat-markdown-pre"><code>${codeLines.join("\n")}</code></pre>`
    );
    inCodeBlock = false;
    codeLines = [];
  };

  for (const line of lines) {
    if (line.startsWith("```") || line.startsWith("~~~")) {
      if (inCodeBlock) {
        flushCode();
      } else {
        flushList();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      flushList();
      const level = headingMatch[1].length;
      const content = inlineFormat(headingMatch[2]);
      html.push(`<h${level} class="chat-markdown-heading chat-markdown-heading-${level}">${content}</h${level}>`);
      continue;
    }

    const unorderedMatch = line.match(/^\s*[-*]\s+(.*)$/);
    if (unorderedMatch) {
      if (listType !== "ul") {
        flushList();
        listType = "ul";
      }
      listItems.push(`<li>${inlineFormat(unorderedMatch[1])}</li>`);
      continue;
    }

    const orderedMatch = line.match(/^\s*(\d+)\.\s+(.*)$/);
    if (orderedMatch) {
      if (listType !== "ol") {
        flushList();
        listType = "ol";
      }
      listItems.push(`<li>${inlineFormat(orderedMatch[2])}</li>`);
      continue;
    }

    if (line.trim() === "") {
      flushList();
      html.push("<br />");
      continue;
    }

    flushList();
    html.push(`<p>${inlineFormat(line)}</p>`);
  }

  flushCode();
  flushList();

  return html.join("");
}

export default function MessageBubble({ message, onSpeak, speakingId, speechSupported }) {
  const isUser = message.role === "user";
  const { speechLang, t } = useLanguage();
  const isSpeaking = speakingId === message.id;
  const isAssistant = message.role === "assistant";

  const [displayText, setDisplayText] = useState(isAssistant ? "" : message.text);
  const [isStreaming, setIsStreaming] = useState(isAssistant);
  const [reservedWidth, setReservedWidth] = useState(null);
  const bubbleWrapperRef = useRef(null);
  const measureRef = useRef(null);
  const typingRef = useRef(null);

  const fullHtml = useMemo(() => parseMarkdown(message.text), [message.text]);

  useLayoutEffect(() => {
    if (!isAssistant) {
      setReservedWidth(null);
      return;
    }

    const measureWidth = () => {
      if (!measureRef.current || !bubbleWrapperRef.current) return;
      const parentWidth = bubbleWrapperRef.current.parentElement?.getBoundingClientRect().width ?? 0;
      const maxReserve = parentWidth * 0.78;
      measureRef.current.style.maxWidth = `${maxReserve}px`;
      measureRef.current.style.boxSizing = "border-box";
      measureRef.current.style.padding = "0 1rem";
      measureRef.current.style.display = "inline-block";
      const measuredWidth = measureRef.current.getBoundingClientRect().width;
      setReservedWidth(Math.min(measuredWidth, maxReserve));
    };

    measureWidth();
    window.addEventListener("resize", measureWidth);
    return () => window.removeEventListener("resize", measureWidth);
  }, [fullHtml, isAssistant, message.text]);

  useEffect(() => {
    if (!isAssistant) {
      setDisplayText(message.text);
      setIsStreaming(false);
      return;
    }

    setDisplayText("");
    setIsStreaming(true);
    let index = 0;
    const speed = 18;

    typingRef.current = window.setInterval(() => {
      index = Math.min(index + 1, message.text.length);
      setDisplayText(message.text.slice(0, index));
      if (index >= message.text.length) {
        window.clearInterval(typingRef.current);
        setIsStreaming(false);
      }
    }, speed);

    return () => window.clearInterval(typingRef.current);
  }, [message.id, message.text, isAssistant]);

  const html = useMemo(() => parseMarkdown(displayText), [displayText]);

  return (
    <div className={`flex w-full items-end gap-1.5 ${isUser ? "justify-end" : "justify-start"}`}>
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
        ref={bubbleWrapperRef}
        style={reservedWidth ? { width: `${reservedWidth}px` } : undefined}
        className={[
          "max-w-[78%] rounded-bubble px-4 py-3 text-[14.5px] leading-snug shadow-sm",
          isUser
            ? "rounded-br-sm bg-clinical-700 text-white animate-fade-in-up"
            : "rounded-bl-sm bg-clinical-100 text-ink-900 animate-fade-in-up",
        ].join(" ")}
      >
        <div
          ref={measureRef}
          className="chat-markdown absolute left-[-9999px] top-0 opacity-0 pointer-events-none"
          style={{ whiteSpace: "pre-wrap" }}
          dangerouslySetInnerHTML={{ __html: fullHtml }}
        />
        <div className="chat-markdown min-h-[1.25rem]">
          <div dangerouslySetInnerHTML={{ __html: html }} />
          {isStreaming && <span className="typing-cursor" />}
        </div>
        <div className={`mt-2 text-[10px] ${isUser ? "text-white/60" : "text-ink-600/60"}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  );
}
