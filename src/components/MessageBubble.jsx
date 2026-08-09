/**
 * MessageBubble
 * -------------
 * Renders a single plain-text chat bubble. User and assistant messages
 * are visually distinct: user bubbles are solid clinical-teal and
 * right-aligned; assistant bubbles are pale-tint and left-aligned,
 * mirroring familiar messaging-app conventions so patients immediately
 * understand who is "speaking".
 */
export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"} animate-fade-in-up`}>
      <div
        className={[
          "max-w-[80%] whitespace-pre-wrap break-words px-4 py-2.5 text-[14.5px] leading-snug shadow-sm",
          isUser
            ? "rounded-bubble rounded-br-sm bg-clinical-700 text-white"
            : "rounded-bubble rounded-bl-sm bg-clinical-100 text-ink-900",
        ].join(" ")}
      >
        {message.text}
        <div
          className={`mt-1 text-[10px] ${isUser ? "text-white/60" : "text-ink-600/60"}`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
