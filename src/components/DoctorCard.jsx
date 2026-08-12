import { useState } from "react";
import { Star, CalendarCheck, Clock3, Bell, Check } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

/**
 * DoctorCard
 * ----------
 * A single rich-media card for one doctor.
 * - Available doctors: shows "Book Slot" button (opens slot picker).
 * - Busy doctors: shows active "Notify Me" button (subscribes to notifications).
 *
 * @param {object} doctor  { id, name, department, image, availability, nextSlot, rating, slots }
 * @param {function} onBookSlot  called with the doctor object when tapped
 */
export default function DoctorCard({ doctor, onBookSlot }) {
  const isAvailable = doctor.availability === "available";
  const [notified, setNotified] = useState(false);
  const { t } = useLanguage();

  const handleAction = () => {
    if (isAvailable) {
      onBookSlot(doctor);
    } else {
      setNotified(true);
    }
  };

  return (
    <div className="snap-start flex w-[210px] flex-shrink-0 flex-col overflow-hidden rounded-2xl border border-clinical-100 bg-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md">
      {/* Photo + availability badge overlay */}
      <div className="relative h-28 w-full bg-clinical-50">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={(e) => {
            // Graceful fallback if CDN image fails to load
            e.currentTarget.src =
              "https://api.dicebear.com/7.x/initials/svg?seed=" + encodeURIComponent(doctor.name);
          }}
        />
        <span
          className={[
            "absolute right-2 top-2 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white shadow",
            isAvailable ? "bg-status-available" : "bg-status-busy",
          ].join(" ")}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
          {isAvailable ? t("availableBadge") : t("busyBadge")}
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h4 className="truncate font-display text-sm font-bold text-ink-900">{doctor.name}</h4>
        <p className="text-xs font-medium text-clinical-700">{doctor.department}</p>

        <div className="mt-1 flex items-center gap-1 text-[11px] text-ink-600">
          <Star size={12} className="fill-coral-500 text-coral-500" />
          {doctor.rating?.toFixed(1) ?? "—"}
          <span className="mx-1 text-ink-300">•</span>
          <Clock3 size={12} />
          <span className="truncate">{doctor.nextSlot}</span>
        </div>

        {/* CTA Button: "Book Slot" for available doctors, active "Notify Me" for busy doctors */}
        <button
          type="button"
          onClick={handleAction}
          className={[
            "mt-2.5 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-all active:scale-[0.98]",
            isAvailable
              ? "bg-coral-600 text-white hover:bg-coral-500"
              : notified
              ? "bg-clinical-100 text-clinical-800 border border-clinical-200"
              : "border border-clinical-700 bg-white text-clinical-700 hover:bg-clinical-50",
          ].join(" ")}
        >
          {isAvailable ? (
            <>
              <CalendarCheck size={14} />
              {t("bookSlotBtn")}
            </>
          ) : notified ? (
            <>
              <Check size={14} className="text-clinical-700" />
              Notified ✓
            </>
          ) : (
            <>
              <Bell size={14} />
              {t("notifyMeBtn")}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
