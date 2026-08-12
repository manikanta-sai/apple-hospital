import { useMemo } from "react";
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

  const html = useMemo(() => parseMarkdown(message.text), [message.text]);

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
        className={[
          "max-w-[78%] rounded-bubble px-4 py-3 text-[14.5px] leading-snug shadow-sm",
          isUser
            ? "rounded-br-sm bg-clinical-700 text-white"
            : "rounded-bl-sm bg-clinical-100 text-ink-900",
        ].join(" ")}
      >
        <div className="chat-markdown min-h-[1.25rem]">
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
        <div className={`mt-2 text-[10px] ${isUser ? "text-white/60" : "text-ink-600/60"}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  );
}
