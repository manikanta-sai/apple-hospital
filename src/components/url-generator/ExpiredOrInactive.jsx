import { AlertTriangle, ArrowLeft, Clock, ShieldAlert } from "lucide-react";

export default function ExpiredOrInactive({ status = "Expired", shortCode, onBack }) {
  const isDeactivated = status === "Deactivated";

  return (
    <div className="mx-auto max-w-md animate-fade-in-up py-12">
      <div className="rounded-2xl border border-clinical-100 bg-white p-6 sm:p-8 text-center shadow-sm">
        <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full mb-4 shadow-sm ${
          isDeactivated ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
        }`}>
          {isDeactivated ? <ShieldAlert size={28} /> : <Clock size={28} />}
        </div>

        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold mb-2 ${
          isDeactivated ? "bg-rose-50 text-rose-800 border border-rose-200" : "bg-amber-50 text-amber-800 border border-amber-200"
        }`}>
          {isDeactivated ? "Link Deactivated" : "Link Expired"}
        </span>

        <h2 className="font-display text-xl font-bold text-clinical-950">
          {isDeactivated
            ? "This healthcare link has been disabled"
            : "This healthcare link has expired"}
        </h2>

        <p className="mt-2 text-xs text-ink-600 leading-relaxed">
          {isDeactivated
            ? "Hospital staff have paused or deactivated access to this medical record or meeting room."
            : "In accordance with hospital privacy policies, this record's access timeframe has passed and is no longer viewable."}
        </p>

        {shortCode && (
          <div className="mt-4 rounded-xl bg-clinical-50/50 border border-clinical-100 py-2 font-mono text-xs text-ink-600">
            Ref Code: <span className="font-bold text-clinical-950">{shortCode}</span>
          </div>
        )}

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
