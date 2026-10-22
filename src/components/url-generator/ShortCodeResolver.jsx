import { useEffect, useState } from "react";
import { AlertCircle, ArrowLeft, ExternalLink, Link2, ShieldCheck } from "lucide-react";
import { db } from "../../db/database";
import { getLinkStatus, isLinkExpired } from "../../services/shortUrlService";
import ExpiredOrInactive from "./ExpiredOrInactive";
import FeedbackSubmitViewer from "./FeedbackSubmitViewer";
import ReportViewer from "./ReportViewer";
import TelehealthViewer from "./TelehealthViewer";

export default function ShortCodeResolver({ shortCode, onNavigate, onBack }) {
  const [linkRecord, setLinkRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function resolve() {
      if (!shortCode) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const link = await db.links.where("shortCode").equals(shortCode.trim()).first();
        if (!link) {
          setNotFound(true);
        } else {
          setLinkRecord(link);
        }
      } catch (err) {
        console.error("Resolution failed:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    resolve();
  }, [shortCode]);

  if (loading) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-clinical-700 border-r-transparent"></div>
        <p className="mt-3 text-xs text-ink-600">Resolving healthcare short code...</p>
      </div>
    );
  }

  if (notFound || !linkRecord) {
    return (
      <div className="mx-auto max-w-md py-12 text-center animate-fade-in-up">
        <div className="rounded-2xl border border-clinical-100 bg-white p-8 shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-4 shadow-sm">
            <AlertCircle size={28} />
          </div>
          <h2 className="font-display text-xl font-bold text-clinical-950">
            Link Code Not Found
          </h2>
          <p className="mt-2 text-xs text-ink-600 leading-relaxed">
            The code <code className="font-bold text-clinical-950">"{shortCode}"</code> was not found in the hospital records directory.
          </p>
          <div className="mt-6 pt-4 border-t border-clinical-100">
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

  const status = getLinkStatus(linkRecord);
  if (status !== "Active") {
    return (
      <ExpiredOrInactive
        status={status}
        shortCode={shortCode}
        onBack={onBack}
      />
    );
  }

  // Active module routing
  if (linkRecord.moduleType === "lab-reports") {
    return (
      <ReportViewer
        reportId={linkRecord.destinationId}
        onBack={onBack}
      />
    );
  }

  if (linkRecord.moduleType === "telehealth") {
    return (
      <TelehealthViewer
        meetingId={linkRecord.destinationId}
        onBack={onBack}
      />
    );
  }

  if (linkRecord.moduleType === "feedback") {
    return (
      <FeedbackSubmitViewer
        formId={linkRecord.destinationId}
        onBack={onBack}
      />
    );
  }

  if (linkRecord.moduleType === "survey") {
    return (
      <div className="mx-auto max-w-md py-12 text-center animate-fade-in-up">
        <div className="rounded-2xl border border-teal-200 bg-white p-8 shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-700 mb-4 shadow-sm">
            <Link2 size={28} />
          </div>
          <h2 className="font-display text-xl font-bold text-clinical-950">
            Redirecting to Survey
          </h2>
          <p className="mt-1 font-semibold text-xs text-teal-800">
            {linkRecord.title}
          </p>
          <p className="mt-2 text-xs text-ink-600 max-w-xs mx-auto">
            Click below to open the external survey securely in a new window.
          </p>

          <div className="mt-6">
            <a
              href={linkRecord.destinationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-clinical-700 px-6 py-2.5 text-xs font-semibold text-white hover:bg-clinical-900 transition shadow-sm"
            >
              Open External Survey <ExternalLink size={14} />
            </a>
          </div>

          <div className="mt-6 pt-4 border-t border-clinical-100">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-clinical-700 hover:text-clinical-900"
            >
              <ArrowLeft size={13} /> Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <p className="text-xs text-ink-600">Unrecognized module type.</p>
    </div>
  );
}
