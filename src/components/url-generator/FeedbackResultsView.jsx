import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Clock,
  HeartHandshake,
  MessageSquare,
  Sparkles,
  Star,
  User,
  Users,
} from "lucide-react";
import { db } from "../../db/database";

export default function FeedbackResultsView({ formId, onBack }) {
  const [formConfig, setFormConfig] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const form = await db.feedbackForms.get(Number(formId));
        if (!form) {
          setError("Feedback form not found.");
          return;
        }

        const resps = await db.feedbackResponses
          .where("feedbackFormId")
          .equals(Number(formId))
          .reverse()
          .sortBy("submittedAt");

        setFormConfig(form);
        setResponses(resps);
      } catch (err) {
        console.error("Failed to load feedback results:", err);
        setError("Error loading feedback submissions from IndexedDB.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [formId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-xl p-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-clinical-700 border-r-transparent"></div>
        <p className="mt-3 text-xs text-ink-600">Calculating feedback analytics...</p>
      </div>
    );
  }

  if (error || !formConfig) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-rose-200 bg-white p-6 sm:p-8 text-center shadow-sm">
        <AlertCircle size={32} className="mx-auto text-rose-600 mb-2" />
        <h3 className="font-display text-base font-bold text-clinical-950">
          Results Unavailable
        </h3>
        <p className="text-xs text-ink-600 mt-1">{error || "Form not found."}</p>
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

  const total = responses.length;
  const avgStaff = total
    ? (responses.reduce((sum, r) => sum + r.hospitalStaffRating, 0) / total).toFixed(1)
    : "0.0";
  const avgDoctor = total
    ? (responses.reduce((sum, r) => sum + r.doctorTreatmentRating, 0) / total).toFixed(1)
    : "0.0";
  const avgOverall = total
    ? (responses.reduce((sum, r) => sum + r.overallHospitalRating, 0) / total).toFixed(1)
    : "0.0";

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-in-up">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-clinical-100 pb-4">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-clinical-700 hover:text-clinical-900 mb-2"
          >
            <ArrowLeft size={14} /> Back to Links Directory
          </button>
          <h2 className="font-display text-xl font-bold text-clinical-950">
            Feedback Analytics: {formConfig.title}
          </h2>
          <p className="text-xs text-ink-600 mt-0.5">
            Aggregated patient ratings and suggestions stored locally in IndexedDB.
          </p>
        </div>

        <span className="rounded-full bg-teal-50 border border-teal-200 px-3 py-1 text-xs font-semibold text-teal-800 self-start sm:self-auto">
          {total} Total Response{total === 1 ? "" : "s"}
        </span>
      </div>

      {/* KPI Average Rating Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-clinical-100 bg-white p-5 shadow-sm">
          <span className="text-xs font-semibold text-ink-600">Hospital Staff Care</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-clinical-950">{avgStaff}</span>
            <span className="text-xs text-ink-600">/ 5.0</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-amber-400">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={14}
                className={s <= Math.round(Number(avgStaff)) ? "fill-amber-400" : "text-ink-300"}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-clinical-100 bg-white p-5 shadow-sm">
          <span className="text-xs font-semibold text-ink-600">Doctor's Treatment</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-clinical-950">{avgDoctor}</span>
            <span className="text-xs text-ink-600">/ 5.0</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-amber-400">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={14}
                className={s <= Math.round(Number(avgDoctor)) ? "fill-amber-400" : "text-ink-300"}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-clinical-100 bg-white p-5 shadow-sm">
          <span className="text-xs font-semibold text-ink-600">Overall Experience</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-clinical-950">{avgOverall}</span>
            <span className="text-xs text-ink-600">/ 5.0</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-amber-400">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={14}
                className={s <= Math.round(Number(avgOverall)) ? "fill-amber-400" : "text-ink-300"}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Individual Submissions Feed */}
      <div className="rounded-2xl border border-clinical-100 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-clinical-100 p-5">
          <h3 className="font-display text-sm font-bold text-clinical-950 flex items-center gap-2">
            <MessageSquare size={16} className="text-teal-600" /> Patient Submissions ({total})
          </h3>
        </div>

        {total === 0 ? (
          <div className="p-8 text-center text-xs text-ink-600">
            No patient feedback submissions recorded yet. Share your short link to collect responses.
          </div>
        ) : (
          <div className="divide-y divide-clinical-100">
            {responses.map((r, index) => (
              <div key={r.id || index} className="p-5 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-semibold text-clinical-950">
                      Patient #{total - index}
                    </span>
                    <span className="text-ink-600 flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(r.submittedAt).toLocaleDateString()} at{" "}
                      {new Date(r.submittedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="bg-clinical-50 px-2 py-0.5 rounded text-[11px] text-clinical-800 border border-clinical-100">
                      Staff: <strong>{r.hospitalStaffRating}★</strong>
                    </span>
                    <span className="bg-clinical-50 px-2 py-0.5 rounded text-[11px] text-clinical-800 border border-clinical-100">
                      Doctor: <strong>{r.doctorTreatmentRating}★</strong>
                    </span>
                    <span className="bg-clinical-50 px-2 py-0.5 rounded text-[11px] text-clinical-800 border border-clinical-100">
                      Overall: <strong>{r.overallHospitalRating}★</strong>
                    </span>
                  </div>
                </div>

                {r.suggestions ? (
                  <p className="text-xs text-clinical-900 bg-clinical-50/40 p-3 rounded-xl border border-clinical-100/60 leading-relaxed italic">
                    "{r.suggestions}"
                  </p>
                ) : (
                  <p className="text-[11px] text-ink-300 italic">No additional suggestions provided.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
