import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  HeartHandshake,
  MessageSquare,
  Sparkles,
  Star,
} from "lucide-react";
import { db } from "../../db/database";
import { createLinkRecord } from "../../services/shortUrlService";
import SuccessScreen from "./SuccessScreen";

export default function FeedbackFormBuilder({ onNavigate }) {
  const [title, setTitle] = useState("Patient Inpatient & Outpatient Care Experience");
  const [expiration, setExpiration] = useState("30 days");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdRecord, setCreatedRecord] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!title.trim()) {
      setErrorMessage("Feedback Form Title is required.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Save form definition in IndexedDB
      const formId = await db.feedbackForms.add({
        title: title.trim(),
        createdAt: Date.now(),
        isActive: true,
      });

      // Generate short link record
      const linkResult = await createLinkRecord({
        moduleType: "feedback",
        title: title.trim(),
        destinationId: formId,
        expirationOption: expiration,
      });

      setCreatedRecord({
        title: title.trim(),
        formId,
        shortCode: linkResult.shortCode,
        expiresAt: linkResult.expiresAt,
      });
    } catch (err) {
      console.error("Failed to create feedback form:", err);
      setErrorMessage("An error occurred while saving the feedback form to IndexedDB.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setTitle("Patient Inpatient & Outpatient Care Experience");
    setExpiration("30 days");
    setErrorMessage("");
    setCreatedRecord(null);
  };

  if (createdRecord) {
    return (
      <SuccessScreen
        title={createdRecord.title}
        shortCode={createdRecord.shortCode}
        moduleType="feedback"
        expiresAt={createdRecord.expiresAt}
        onReset={handleReset}
        onPreview={() => onNavigate(`/feedback/${createdRecord.formId}`)}
      />
    );
  }

  return (
    <div className="mx-auto">
      <div className="rounded-2xl border border-clinical-100 bg-white p-6 sm:p-8 shadow-sm">
        <div className="border-b border-clinical-100 pb-4 mb-6">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-700">
            Module 3 · Quality & Patient Experience
          </span>
          <h2 className="font-display text-xl font-bold text-clinical-950 mt-1">
            Create Patient Feedback Form Link
          </h2>
          <p className="text-xs text-ink-600 mt-1">
            Generate mobile-ready 1–5 star rating survey links sent to discharged patients. Responses are aggregated in the Feedback Results view.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
            <AlertCircle size={16} className="shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Title */}
          <div>
            <label htmlFor="fbTitle" className="block text-xs font-semibold text-clinical-900 mb-1">
              Feedback Form Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="fbTitle"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cardiology Department Discharge Feedback"
              className="w-full rounded-xl border border-clinical-100 bg-clinical-50/40 px-3.5 py-2.5 text-xs text-clinical-950 placeholder:text-ink-300 focus:border-clinical-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-clinical-500/20"
            />
          </div>

          {/* Form Structure Preview Card */}
          <div className="rounded-xl border border-clinical-100 bg-clinical-50/40 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xs font-bold text-clinical-950 flex items-center gap-2">
                <Sparkles size={14} className="text-teal-600" /> Standard Hospital Rating Questions
              </h3>
              <span className="text-[10px] text-ink-600 bg-white border border-clinical-100 px-2 py-0.5 rounded">
                NABH Standards Compliant
              </span>
            </div>

            <p className="text-xs text-ink-600">
              Patients will be presented with these three interactive 1–5 star rating questions plus an open suggestion box:
            </p>

            <div className="space-y-3 pt-1">
              <div className="rounded-lg bg-white border border-clinical-100 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-clinical-950">
                    1. Rate the hospital staff.
                  </span>
                  <span className="text-[10px] font-semibold text-rose-600">Required</span>
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} fill="currentColor" />
                  ))}
                  <span className="text-[11px] text-ink-600 ml-2">(1 = Very Poor · 5 = Excellent)</span>
                </div>
              </div>

              <div className="rounded-lg bg-white border border-clinical-100 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-clinical-950">
                    2. Rate the doctor's treatment.
                  </span>
                  <span className="text-[10px] font-semibold text-rose-600">Required</span>
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} fill="currentColor" />
                  ))}
                  <span className="text-[11px] text-ink-600 ml-2">(1 = Very Poor · 5 = Excellent)</span>
                </div>
              </div>

              <div className="rounded-lg bg-white border border-clinical-100 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-clinical-950">
                    3. Rate the overall hospital experience.
                  </span>
                  <span className="text-[10px] font-semibold text-rose-600">Required</span>
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} fill="currentColor" />
                  ))}
                  <span className="text-[11px] text-ink-600 ml-2">(1 = Very Poor · 5 = Excellent)</span>
                </div>
              </div>

              <div className="rounded-lg bg-white border border-clinical-100 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-clinical-950">
                    4. Patient Suggestions & Comments
                  </span>
                  <span className="text-[10px] text-ink-600">Optional text box</span>
                </div>
                <p className="text-[11px] text-ink-600 mt-1 italic">
                  "Tell us what we did well or how we can improve our services."
                </p>
              </div>
            </div>
          </div>

          {/* Expiration Settings */}
          <div>
            <label htmlFor="fbExpiry" className="block text-xs font-semibold text-clinical-900 mb-1">
              Feedback Link Expiration <span className="text-rose-500">*</span>
            </label>
            <select
              id="fbExpiry"
              value={expiration}
              onChange={(e) => setExpiration(e.target.value)}
              className="w-full rounded-xl border border-clinical-100 bg-clinical-50/40 px-3.5 py-2.5 text-xs text-clinical-950 focus:border-clinical-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-clinical-500/20"
            >
              <option value="1 day">1 day (Immediate post-discharge)</option>
              <option value="7 days">7 days (Standard follow-up survey)</option>
              <option value="30 days">30 days (Monthly review)</option>
              <option value="90 days">90 days (Quarterly feedback drive)</option>
              <option value="Never expires">Never expires</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl border border-clinical-200 px-4 py-2.5 text-xs font-semibold text-clinical-800 hover:bg-clinical-50 transition"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-clinical-700 px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-clinical-900 transition disabled:opacity-50"
            >
              {isSubmitting ? "Creating Form..." : "Generate Short URL"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
