import { useState } from "react";
import { User, Phone, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

/**
 * PatientRegistrationForm
 * ------------------------
 * Renders inline in the message stream when the "Book Appointment"
 * quick link is tapped. Validates locally, then hands the values up to
 * `onSubmit(messageId, formData)` which freezes this message (see
 * useChatSession.submitPatientForm) and continues the booking flow.
 */
export default function PatientRegistrationForm({ message, onSubmit }) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [errors, setErrors] = useState({});
  const { t } = useLanguage();

  const isSubmitted = message.status === "submitted";

  const validate = () => {
    const next = {};
    if (!name.trim()) next.name = "Enter the patient's name";
    if (!/^\d{10}$/.test(mobile.trim())) next.mobile = "Enter a valid 10-digit mobile number";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(message.id, { name: name.trim(), mobile: mobile.trim() });
  };

  return (
    <div className="flex w-full flex-col items-start gap-2 animate-fade-in-up">
      <div className="max-w-[90%] rounded-bubble rounded-bl-sm bg-clinical-100 px-4 py-2.5 text-[14.5px] leading-snug text-ink-900 shadow-sm">
        {message.text}
      </div>

      <div className="w-full max-w-[90%] rounded-2xl border border-clinical-100 bg-white p-4 shadow-sm">
        {isSubmitted ? (
          // Frozen "receipt" view once submitted - no longer editable.
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-status-available/10 text-status-available">
              <CheckCircle2 size={16} />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-ink-900">{message.formData?.name}</p>
              <p className="text-ink-600">{message.formData?.mobile}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
            <div>
              <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-ink-600">
                <User size={13} /> {t("patientNameLabel")}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("namePlaceholder")}
                className="w-full rounded-lg border border-clinical-100 bg-clinical-50 px-3 py-2 text-sm text-ink-900 outline-none focus:border-clinical-500 focus:ring-2 focus:ring-clinical-500/20"
              />
              {errors.name && <p className="mt-1 text-[11px] text-coral-600">{errors.name}</p>}
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-ink-600">
                <Phone size={13} /> {t("mobileLabel")}
              </label>
              <input
                type="tel"
                inputMode="numeric"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder={t("mobilePlaceholder")}
                className="w-full rounded-lg border border-clinical-100 bg-clinical-50 px-3 py-2 text-sm text-ink-900 outline-none focus:border-clinical-500 focus:ring-2 focus:ring-clinical-500/20"
              />
              {errors.mobile && <p className="mt-1 text-[11px] text-coral-600">{errors.mobile}</p>}
            </div>

            <button
              type="submit"
              className="mt-1 rounded-xl bg-clinical-700 py-2 text-xs font-semibold text-white transition-colors hover:bg-clinical-500 active:scale-[0.98]"
            >
              {t("continueBtn")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
