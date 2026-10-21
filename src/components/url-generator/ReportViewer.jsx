import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileText,
  Image as ImageIcon,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { db } from "../../db/database";

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ReportViewer({ reportId, onBack }) {
  const [report, setReport] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [blobUrls, setBlobUrls] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const urlsToRevoke = [];

    async function loadReport() {
      try {
        setLoading(true);
        const rep = await db.labReports.get(Number(reportId));
        if (!rep) {
          setError("Lab report record not found or was deleted.");
          return;
        }

        const attachs = await db.labReportAttachments.where("reportId").equals(Number(reportId)).toArray();

        const urlMap = {};
        for (const item of attachs) {
          if (item.fileBlob) {
            const url = URL.createObjectURL(item.fileBlob);
            urlMap[item.id] = url;
            urlsToRevoke.push(url);
          }
        }

        if (active) {
          setReport(rep);
          setAttachments(attachs);
          setBlobUrls(urlMap);
        }
      } catch (err) {
        console.error("Error loading report:", err);
        if (active) setError("Could not load report from IndexedDB.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadReport();

    return () => {
      active = false;
      urlsToRevoke.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [reportId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-xl p-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-clinical-700 border-r-transparent"></div>
        <p className="mt-3 text-xs text-ink-600">Retrieving report from IndexedDB...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-rose-200 bg-white p-6 sm:p-8 text-center shadow-sm">
        <AlertCircle size={32} className="mx-auto text-rose-600 mb-2" />
        <h3 className="font-display text-base font-bold text-clinical-950">
          Report Not Available
        </h3>
        <p className="text-xs text-ink-600 mt-1">{error || "Record not found."}</p>
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

  return (
    <div className="mx-auto max-w-2xl animate-fade-in-up">
      <div className="rounded-2xl border border-clinical-100 bg-white shadow-sm overflow-hidden">
        {/* Header Branding */}
        <div className="border-b border-clinical-100 bg-clinical-50/50 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-800">
              <ShieldCheck size={14} /> Official Medical Laboratory Result
            </span>
            <span className="text-[11px] text-ink-600">
              Apple Multispecialty Hospital
            </span>
          </div>

          <h2 className="font-display text-xl sm:text-2xl font-bold text-clinical-950">
            {report.title}
          </h2>

          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-ink-600">
            <span className="flex items-center gap-1">
              <Calendar size={13} className="text-teal-600" />
              {new Date(report.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={13} className="text-teal-600" />
              {new Date(report.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
            <span className="flex items-center gap-1">
              <FileText size={13} className="text-teal-600" />
              {attachments.length} Document{attachments.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Pathologist Remarks */}
          {report.remarks && (
            <div className="rounded-xl border border-clinical-200 bg-clinical-50/40 p-4">
              <h3 className="font-display text-xs font-bold text-clinical-950 flex items-center gap-1.5 mb-1.5">
                <Stethoscope size={14} className="text-teal-600" /> Pathologist & Doctor Remarks
              </h3>
              <p className="text-xs text-clinical-900 leading-relaxed">
                {report.remarks}
              </p>
            </div>
          )}

          {/* Attachments Section */}
          <div>
            <h3 className="font-display text-sm font-bold text-clinical-950 mb-3 flex items-center gap-2">
              <FileText size={16} className="text-teal-600" /> Attached Test Reports
            </h3>

            {attachments.length === 0 ? (
              <p className="text-xs text-ink-600">No attachments found for this report.</p>
            ) : (
              <div className="divide-y divide-clinical-100 rounded-xl border border-clinical-100 bg-white">
                {attachments.map((item) => {
                  const url = blobUrls[item.id];
                  const isPdf = item.mimeType.includes("pdf");

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                          {isPdf ? <FileText size={20} /> : <ImageIcon size={20} />}
                        </div>
                        <div className="truncate">
                          <p className="truncate font-semibold text-xs text-clinical-950">
                            {item.originalFilename}
                          </p>
                          <p className="text-[11px] text-ink-600">
                            {formatBytes(item.fileSize)} · {item.mimeType}
                          </p>
                        </div>
                      </div>

                      {url && (
                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-clinical-200 px-3 py-1.5 text-xs font-semibold text-clinical-800 hover:bg-clinical-50 transition"
                          >
                            <Eye size={13} /> View
                          </a>
                          <a
                            href={url}
                            download={item.originalFilename}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-clinical-700 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-clinical-900 transition shadow-sm"
                          >
                            <Download size={13} /> Download
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Privacy Note */}
          <div className="rounded-xl border border-clinical-100 bg-clinical-50/20 p-3 text-[11px] text-ink-600 flex items-center justify-between">
            <span>Client-side IndexedDB storage (prototype mode)</span>
            <span className="font-medium text-teal-800">NABH Hygiene Standards</span>
          </div>

          {/* Back button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 rounded-xl border border-clinical-200 px-4 py-2 text-xs font-semibold text-clinical-800 hover:bg-clinical-50 transition"
            >
              <ArrowLeft size={14} /> Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
