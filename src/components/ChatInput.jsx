import { useState, useRef } from "react";
import { Send } from "lucide-react";

/**
 * ChatInput
 * ---------
 * Auto-growing single-line input (native <input>, not <textarea>, to
 * keep the mobile keyboard's "send" affordance simple) with a disabled
 * state while a reply is in flight.
 */
export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue("");
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 border-t border-clinical-100 bg-white px-3 py-3"
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type your message..."
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
