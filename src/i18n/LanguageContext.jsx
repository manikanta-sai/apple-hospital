import { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { UI_STRINGS, SUPPORTED_LANGUAGES } from "./translations";

const LanguageContext = createContext(null);

/**
 * LanguageProvider
 * -----------------
 * Wraps the widget's component tree so any component (or hook, since
 * hooks can call other hooks) can read/set the active language without
 * prop-drilling. Persists the choice in localStorage so it survives
 * refreshes, same as the session id and open/minimized state.
 */
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useLocalStorage("hc_widget_lang", "en");

  const t = useMemo(() => {
    const dict = UI_STRINGS[language] || UI_STRINGS.en;
    // Falls back to English, then to the raw key, so a missing
    // translation never renders blank.
    return (key) => dict[key] ?? UI_STRINGS.en[key] ?? key;
  }, [language]);

  const activeLanguageMeta = useMemo(
    () => SUPPORTED_LANGUAGES.find((l) => l.code === language) ?? SUPPORTED_LANGUAGES[0],
    [language]
  );

  const value = useMemo(
    () => ({
      language, // short code, e.g. "es" - used for translationProvider + backend targetLanguage
      speechLang: activeLanguageMeta.speechLang, // BCP-47 tag, e.g. "es-ES" - for Speech APIs
      setLanguage,
      t,
      languages: SUPPORTED_LANGUAGES,
    }),
    [language, activeLanguageMeta, setLanguage, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

/** Throws loudly if used outside the provider - fail fast in dev. */
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage() must be used within a <LanguageProvider>");
  return ctx;
}
