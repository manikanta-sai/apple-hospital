import { CalendarPlus, Clock, HelpCircle, MapPin, Headset } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

/**
 * QuickLinks
 * ----------
 * Shortcut chips shown alongside the greeting. Labels come from the
 * shared LanguageContext (`t()`), so they re-render in the selected
 * language automatically - no props needed for translation.
 */
export default function QuickLinks({ onSelect }) {
  const { t } = useLanguage();

  const LINKS = [
    { id: "book", label: t("quickBook"), icon: CalendarPlus },
    { id: "timings", label: t("quickTimings"), icon: Clock },
    { id: "enquiry", label: t("quickEnquiry"), icon: HelpCircle },
    { id: "address", label: t("quickAddress"), icon: MapPin },
    { id: "agent", label: t("quickAgent"), icon: Headset },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2 px-4">
      {LINKS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onSelect(id)}
          className="flex items-center gap-1.5 rounded-full border border-clinical-100 bg-white px-3 py-1.5 text-xs font-medium text-clinical-700 shadow-sm transition-colors hover:bg-clinical-700 hover:text-white active:scale-95"
        >
          <Icon size={13} />
          {label}
        </button>
      ))}
    </div>
  );
}
