export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 self-start rounded-bubble rounded-bl-sm bg-clinical-100 px-4 py-3 animate-fade-in-up">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 rounded-full bg-clinical-700/60 animate-bounce-dot"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}
