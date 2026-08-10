import { useState, useRef, useEffect } from "react";
import { Globe, Check } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

/**
 * LanguageSelector
 * -----------------
 * Small dropdown mounted in ChatHeader. Reads/writes the shared
 * LanguageContext directly - no props needed from the parent.
 */
export default function LanguageSelector() {
  const { language, setLanguage, languages } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = languages.find((l) => l.code === language) ?? languages[0];

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Change language"
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1 rounded-lg px-1.5 py-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
      >
        <Globe size={16} />
        <span className="text-xs">{current.flag}</span>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-9 z-10 w-40 overflow-hidden rounded-xl border border-clinical-100 bg-white py-1 shadow-lg animate-fade-in-up"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              role="option"
              aria-selected={lang.code === language}
              onClick={() => {
                setLanguage(lang.code);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between px-3 py-2 text-xs text-ink-900 transition-colors hover:bg-clinical-50"
            >
              <span className="flex items-center gap-2">
                <span>{lang.flag}</span>
                {lang.label}
              </span>
              {lang.code === language && <Check size={12} className="text-clinical-700" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
