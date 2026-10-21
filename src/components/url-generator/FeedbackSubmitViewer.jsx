import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  HeartHandshake,
  MessageSquare,
  Sparkles,
  Star,
} from "lucide-react";
import { db } from "../../db/database";
import { isLinkExpired } from "../../services/shortUrlService";

const RATING_LABELS = {
  1: "1 — Very Poor",
  2: "2 — Poor",
  3: "3 — Average",
  4: "4 — Good",
  5: "5 — Excellent",
};

export default function FeedbackSubmitViewer({ formId, onBack }) {
  const [formConfig, setFormConfig] = useState(null);
  const [staffRating, setStaffRating] = useState(0);
  const [doctorRating, setDoctorRating] = useState(0);
  const [overallRating, setOverallRating] = useState(0);
  const [suggestions, setSuggestions] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadForm() {
      try {
        setLoading(true);
        const data = await db.feedbackForms.get(Number(formId));
        if (!data) {
          setErrorMessage("Feedback form not found or has been removed.");
        } else if (!data.isActive) {
          setErrorMessage("This feedback form has been deactivated by hospital administration.");
        } else {
          setFormConfig(data);
        }
      } catch (err) {
        console.error("Failed to load feedback form:", err);
        setErrorMessage("Could not load feedback form from IndexedDB.");
      } finally {
        setLoading(false);
      }
    }

    loadForm();
  }, [formId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!staffRating || !doctorRating || !overallRating) {
      setErrorMessage("Please complete all three rating questions before submitting.");
      return;
    }

    try {
      setIsSubmitting(true);
      await db.feedbackResponses.add({
        feedbackFormId: Number(formId),
        hospitalStaffRating: staffRating,
        doctorTreatmentRating: doctorRating,
        overallHospitalRating: overallRating,
        suggestions: suggestions.trim(),
        submittedAt: Date.now(),
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit feedback response:", err);
      setErrorMessage("Could not save your feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-xl p-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-clinical-700 border-r-transparent"></div>
        <p className="mt-3 text-xs text-ink-600">Loading patient survey form...</p>
      </div>
    );
  }

  if (errorMessage && !formConfig) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-rose-200 bg-white p-6 sm:p-8 text-center shadow-sm">
        <AlertCircle size={32} className="mx-auto text-rose-600 mb-2" />
        <h3 className="font-display text-base font-bold text-clinical-950">
          Form Unavailable
        </h3>
        <p className="text-xs text-ink-600 mt-1">{errorMessage}</p>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-clinical-200 px-4 py-2 text-xs font-semibold text-clinical-800 hover:bg-clinical-50"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl animate-fade-in-up">
        <div className="rounded-2xl border border-teal-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-teal-800 mb-4 shadow-sm">
            <CheckCircle2 size={36} />
          </div>
          <h2 className="font-display text-xl font-bold text-clinical-950">
            Thank You for Your Feedback!
          </h2>
          <p className="mt-2 text-xs text-ink-600 max-w-md mx-auto leading-relaxed">
            Your valuable ratings and comments help Apple Multispecialty Hospital continuously improve our clinical care and patient experience.
          </p>

          <div className="mt-6 pt-6 border-t border-clinical-100 flex justify-center">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-xl bg-clinical-700 px-5 py-2.5 text-xs font-semibold text-white hover:bg-clinical-900 transition"
            >
              <ArrowLeft size={14} /> Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl animate-fade-in-up">
      <div className="rounded-2xl border border-clinical-100 bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <div className="border-b border-clinical-100 bg-clinical-50/50 p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-800">
              <HeartHandshake size={14} /> Patient Experience Survey
            </span>
            <span className="text-[11px] text-ink-600">
              Apple Multispecialty Hospital
            </span>
          </div>

          <h2 className="font-display text-xl sm:text-2xl font-bold text-clinical-950">
            {formConfig.title}
          </h2>
          <p className="mt-1 text-xs text-ink-600">
            Please share your honest ratings to help us serve you and your family better.
          </p>
        </div>

        {/* Rating Form */}
        <div className="p-6 sm:p-8 space-y-6">
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
              <AlertCircle size={16} className="shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question 1: Hospital Staff */}
            <div className="rounded-xl border border-clinical-100 bg-clinical-50/20 p-4">
              <label className="block text-xs font-bold text-clinical-950 mb-2">
                1. Rate the hospital staff (nursing, front desk, and care coordinators) <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setStaffRating(star)}
                    className="p-1 transition hover:scale-110 focus:outline-none"
                    aria-label={`Rate staff ${star} stars`}
                  >
                    <Star
                      size={28}
                      className={
                        star <= staffRating
                          ? "fill-amber-400 text-amber-400"
                          : "text-ink-300 hover:text-amber-200"
                      }
                    />
                  </button>
                ))}
                {staffRating > 0 && (
                  <span className="ml-2 text-xs font-semibold text-teal-800">
                    {RATING_LABELS[staffRating]}
                  </span>
                )}
              </div>
            </div>

            {/* Question 2: Doctor Treatment */}
            <div className="rounded-xl border border-clinical-100 bg-clinical-50/20 p-4">
              <label className="block text-xs font-bold text-clinical-950 mb-2">
                2. Rate the doctor's treatment, explanations, and medical care <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setDoctorRating(star)}
                    className="p-1 transition hover:scale-110 focus:outline-none"
                    aria-label={`Rate doctor ${star} stars`}
                  >
                    <Star
                      size={28}
                      className={
                        star <= doctorRating
                          ? "fill-amber-400 text-amber-400"
                          : "text-ink-300 hover:text-amber-200"
                      }
                    />
                  </button>
                ))}
                {doctorRating > 0 && (
                  <span className="ml-2 text-xs font-semibold text-teal-800">
                    {RATING_LABELS[doctorRating]}
                  </span>
                )}
              </div>
            </div>

            {/* Question 3: Overall Hospital Experience */}
            <div className="rounded-xl border border-clinical-100 bg-clinical-50/20 p-4">
              <label className="block text-xs font-bold text-clinical-950 mb-2">
                3. Rate the overall hospital experience (cleanliness, room comfort, wait times) <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setOverallRating(star)}
                    className="p-1 transition hover:scale-110 focus:outline-none"
                    aria-label={`Rate overall ${star} stars`}
                  >
                    <Star
                      size={28}
                      className={
                        star <= overallRating
                          ? "fill-amber-400 text-amber-400"
                          : "text-ink-300 hover:text-amber-200"
                      }
                    />
                  </button>
                ))}
                {overallRating > 0 && (
                  <span className="ml-2 text-xs font-semibold text-teal-800">
                    {RATING_LABELS[overallRating]}
                  </span>
                )}
              </div>
            </div>

            {/* Suggestions Box */}
            <div>
              <label htmlFor="patientSuggestions" className="block text-xs font-semibold text-clinical-900 mb-1">
                Your Suggestions or Praises (Optional)
              </label>
              <textarea
                id="patientSuggestions"
                rows={3}
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
                placeholder="What did our staff do well? Where can we improve?"
                className="w-full rounded-xl border border-clinical-100 bg-clinical-50/40 px-3.5 py-2.5 text-xs text-clinical-950 placeholder:text-ink-300 focus:border-clinical-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-clinical-500/20"
              />
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={onBack}
                className="rounded-xl border border-clinical-200 px-4 py-2 text-xs font-semibold text-clinical-800 hover:bg-clinical-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-clinical-700 px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-clinical-900 transition disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
