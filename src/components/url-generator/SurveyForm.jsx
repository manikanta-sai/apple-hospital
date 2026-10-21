import { useState } from "react";
import {
  AlertCircle,
  ExternalLink,
  Link,
  Plus,
  Share2,
} from "lucide-react";
import { db } from "../../db/database";
import { createLinkRecord } from "../../services/shortUrlService";
import SuccessScreen from "./SuccessScreen";

export default function SurveyForm({ onNavigate }) {
  const [title, setTitle] = useState("");
  const [originalUrl, setOriginalUrl] = useState("");
  const [description, setDescription] = useState("");
  const [expiration, setExpiration] = useState("30 days");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdRecord, setCreatedRecord] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!title.trim()) {
      setErrorMessage("Survey Title is required.");
      return;
    }

    let trimmedUrl = originalUrl.trim();
    if (!trimmedUrl) {
      setErrorMessage("Long Survey URL is required.");
      return;
    }

    if (!/^https?:\/\//i.test(trimmedUrl)) {
      trimmedUrl = `https://${trimmedUrl}`;
    }

    try {
      new URL(trimmedUrl);
    } catch {
      setErrorMessage("Please enter a valid HTTP or HTTPS survey URL.");
      return;
    }

    try {
      setIsSubmitting(true);

      const surveyId = await db.surveys.add({
        title: title.trim(),
        originalUrl: trimmedUrl,
        description: description.trim(),
        createdAt: Date.now(),
      });

      const linkResult = await createLinkRecord({
        moduleType: "survey",
        title: title.trim(),
        destinationId: surveyId,
        destinationUrl: trimmedUrl,
        expirationOption: expiration,
      });

      setCreatedRecord({
        title: title.trim(),
        surveyId,
        shortCode: linkResult.shortCode,
        originalUrl: trimmedUrl,
        expiresAt: linkResult.expiresAt,
      });
    } catch (err) {
      console.error("Failed to map survey URL:", err);
      setErrorMessage("An error occurred while saving the survey link in IndexedDB.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setTitle("");
    setOriginalUrl("");
    setDescription("");
    setExpiration("30 days");
    setErrorMessage("");
    setCreatedRecord(null);
  };

  if (createdRecord) {
    return (
      <SuccessScreen
        title={createdRecord.title}
        shortCode={createdRecord.shortCode}
        moduleType="survey"
        expiresAt={createdRecord.expiresAt}
        onReset={handleReset}
        onPreview={() => window.open(createdRecord.originalUrl, "_blank", "noopener,noreferrer")}
      />
    );
  }

  return (
    <div className="mx-auto">
      <div className="rounded-2xl border border-clinical-100 bg-white p-6 sm:p-8 shadow-sm">
        <div className="border-b border-clinical-100 pb-4 mb-6">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-700">
            Module 4 · Survey & Long URL Mapping
          </span>
          <h2 className="font-display text-xl font-bold text-clinical-950 mt-1">
            Shorten Survey URL
          </h2>
          <p className="text-xs text-ink-600 mt-1">
            Map cumbersome external research links, Google Forms, or accreditation audits into clean, branded short URLs with automatic redirection.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
            <AlertCircle size={16} className="shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Survey Title */}
          <div>
            <label htmlFor="surveyTitle" className="block text-xs font-semibold text-clinical-900 mb-1">
              Survey Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="surveyTitle"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Annual Outpatient Patient Experience Survey 2026"
              className="w-full rounded-xl border border-clinical-100 bg-clinical-50/40 px-3.5 py-2.5 text-xs text-clinical-950 placeholder:text-ink-300 focus:border-clinical-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-clinical-500/20"
            />
          </div>

          {/* Long Survey URL */}
          <div>
            <label htmlFor="originalSurveyUrl" className="block text-xs font-semibold text-clinical-900 mb-1">
              Long Survey URL <span className="text-rose-500">*</span>
            </label>
            <input
              id="originalSurveyUrl"
              type="text"
              required
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="https://docs.google.com/forms/d/e/1FAIpQLSc.../viewform"
              className="w-full rounded-xl border border-clinical-100 bg-clinical-50/40 px-3.5 py-2.5 text-xs text-clinical-950 placeholder:text-ink-300 focus:border-clinical-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-clinical-500/20"
            />
            <p className="mt-1 text-[11px] text-ink-600">
              Only HTTP and HTTPS URLs are accepted.
            </p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="surveyDesc" className="block text-xs font-semibold text-clinical-900 mb-1">
              Survey Description / Scope (Optional)
            </label>
            <textarea
              id="surveyDesc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Internal quality study to evaluate patient wait times and pharmacy queuing."
              className="w-full rounded-xl border border-clinical-100 bg-clinical-50/40 px-3.5 py-2.5 text-xs text-clinical-950 placeholder:text-ink-300 focus:border-clinical-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-clinical-500/20"
            />
          </div>

          {/* Expiration Settings */}
          <div>
            <label htmlFor="surveyExpiry" className="block text-xs font-semibold text-clinical-900 mb-1">
              Expiration Period <span className="text-rose-500">*</span>
            </label>
            <select
              id="surveyExpiry"
              value={expiration}
              onChange={(e) => setExpiration(e.target.value)}
              className="w-full rounded-xl border border-clinical-100 bg-clinical-50/40 px-3.5 py-2.5 text-xs text-clinical-950 focus:border-clinical-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-clinical-500/20"
            >
              <option value="1 day">1 day (Flash survey)</option>
              <option value="7 days">7 days (1-week audit)</option>
              <option value="30 days">30 days (Standard monthly survey)</option>
              <option value="90 days">90 days (Quarterly feedback)</option>
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
              {isSubmitting ? "Generating Link..." : "Generate Short URL"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
