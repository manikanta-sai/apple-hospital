import { useState } from "react";
import {
  AlertCircle,
  File,
  FileText,
  Image as ImageIcon,
  Plus,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { db } from "../../db/database";
import { createLinkRecord } from "../../services/shortUrlService";
import SuccessScreen from "./SuccessScreen";

const MAX_ATTACHMENTS = 5;
const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function LabReportForm({ onNavigate }) {
  const [title, setTitle] = useState("");
  const [remarks, setRemarks] = useState("");
  const [expiration, setExpiration] = useState("7 days");
  const [attachments, setAttachments] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdRecord, setCreatedRecord] = useState(null);

  const handleFileChange = (e) => {
    setErrorMessage("");
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (attachments.length + files.length > MAX_ATTACHMENTS) {
      setErrorMessage(`You can upload a maximum of ${MAX_ATTACHMENTS} attachments.`);
      return;
    }

    const validNewFiles = [];
    for (const file of files) {
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        setErrorMessage(`"${file.name}" has an unsupported format. Please upload PDF, PNG, or JPEG.`);
        return;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setErrorMessage(`"${file.name}" exceeds the 15 MB file size limit.`);
        return;
      }
      validNewFiles.push(file);
    }

    setAttachments((prev) => [...prev, ...validNewFiles]);
    e.target.value = "";
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!title.trim()) {
      setErrorMessage("Report Title is required.");
      return;
    }

    if (attachments.length === 0) {
      setErrorMessage("At least one lab report attachment (PDF or image) is required.");
      return;
    }

    try {
      setIsSubmitting(true);

      // 1. Save lab report metadata
      const reportId = await db.labReports.add({
        title: title.trim(),
        remarks: remarks.trim(),
        createdAt: Date.now(),
      });

      // 2. Save binary attachments as Blobs in IndexedDB
      for (const file of attachments) {
        const fileBlob = new Blob([await file.arrayBuffer()], { type: file.type });
        await db.labReportAttachments.add({
          reportId,
          originalFilename: file.name,
          mimeType: file.type,
          fileSize: file.size,
          fileBlob,
        });
      }

      // 3. Generate short link record
      const linkResult = await createLinkRecord({
        moduleType: "lab-reports",
        title: title.trim(),
        destinationId: reportId,
        expirationOption: expiration,
      });

      setCreatedRecord({
        title: title.trim(),
        reportId,
        shortCode: linkResult.shortCode,
        expiresAt: linkResult.expiresAt,
      });
    } catch (err) {
      console.error("Failed to generate lab report link:", err);
      setErrorMessage("An unexpected error occurred while saving the report to IndexedDB.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setTitle("");
    setRemarks("");
    setExpiration("7 days");
    setAttachments([]);
    setErrorMessage("");
    setCreatedRecord(null);
  };

  if (createdRecord) {
    return (
      <SuccessScreen
        title={createdRecord.title}
        shortCode={createdRecord.shortCode}
        moduleType="lab-reports"
        expiresAt={createdRecord.expiresAt}
        onReset={handleReset}
        onPreview={() => onNavigate(`/reports/${createdRecord.reportId}`)}
      />
    );
  }

  return (
    <div className="mx-auto">
      <div className="rounded-2xl border border-clinical-100 bg-white p-6 sm:p-8 shadow-sm">
        <div className="border-b border-clinical-100 pb-4 mb-6">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-700">
            Module 1 · Laboratory Medicine
          </span>
          <h2 className="font-display text-xl font-bold text-clinical-950 mt-1">
            Generate Lab Report Link
          </h2>
          <p className="text-xs text-ink-600 mt-1">
            Securely upload test reports, pathology PDFs, or diagnostic scans. Attachments are saved directly as Blobs in local IndexedDB.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
            <AlertCircle size={16} className="shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Report Title */}
          <div>
            <label htmlFor="reportTitle" className="block text-xs font-semibold text-clinical-900 mb-1">
              Report Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="reportTitle"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Complete Blood Count & Lipid Profile - Aarav Sharma"
              className="w-full rounded-xl border border-clinical-100 bg-clinical-50/40 px-3.5 py-2.5 text-xs text-clinical-950 placeholder:text-ink-300 focus:border-clinical-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-clinical-500/20"
            />
          </div>

          {/* Attachments Section */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-clinical-900">
                Attachments (PDF or Images) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-ink-600">
                {attachments.length}/{MAX_ATTACHMENTS} files (max 15 MB each)
              </span>
            </div>

            <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-clinical-200 bg-clinical-50/40 p-6 text-center cursor-pointer transition hover:bg-clinical-50 hover:border-clinical-400">
              <UploadCloud size={28} className="text-teal-600 mb-2" />
              <span className="text-xs font-semibold text-clinical-950">
                Click to browse or drop lab reports
              </span>
              <span className="text-[10px] text-ink-600 mt-0.5">
                Supports PDF, JPEG, PNG, WEBP files
              </span>
              <input
                type="file"
                multiple
                accept=".pdf,image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* Selected Attachments List */}
            {attachments.length > 0 && (
              <div className="mt-3 divide-y divide-clinical-100 rounded-xl border border-clinical-100 bg-clinical-50/20">
                {attachments.map((file, idx) => (
                  <div
                    key={`${file.name}-${idx}`}
                    className="flex items-center justify-between p-2.5 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                        {file.type.includes("pdf") ? (
                          <FileText size={16} />
                        ) : (
                          <ImageIcon size={16} />
                        )}
                      </div>
                      <div className="truncate">
                        <p className="truncate font-medium text-clinical-950">
                          {file.name}
                        </p>
                        <p className="text-[10px] text-ink-600">
                          {formatBytes(file.size)} · {file.type || "Document"}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(idx)}
                      className="rounded p-1 text-ink-300 hover:text-rose-600 transition"
                      title="Remove attachment"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Remarks */}
          <div>
            <label htmlFor="reportRemarks" className="block text-xs font-semibold text-clinical-900 mb-1">
              Pathologist / Doctor Remarks (Optional)
            </label>
            <textarea
              id="reportRemarks"
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Fasting sugar slightly elevated. Doctor review advised within 3 days."
              className="w-full rounded-xl border border-clinical-100 bg-clinical-50/40 px-3.5 py-2.5 text-xs text-clinical-950 placeholder:text-ink-300 focus:border-clinical-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-clinical-500/20"
            />
          </div>

          {/* Expiration Options */}
          <div>
            <label htmlFor="expiration" className="block text-xs font-semibold text-clinical-900 mb-1">
              Expiration Period <span className="text-rose-500">*</span>
            </label>
            <select
              id="expiration"
              value={expiration}
              onChange={(e) => setExpiration(e.target.value)}
              className="w-full rounded-xl border border-clinical-100 bg-clinical-50/40 px-3.5 py-2.5 text-xs text-clinical-950 focus:border-clinical-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-clinical-500/20"
            >
              <option value="1 day">1 day (Urgent report)</option>
              <option value="7 days">7 days (Standard hospital policy)</option>
              <option value="30 days">30 days (Routine checkup)</option>
              <option value="90 days">90 days (Long-term record)</option>
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
              {isSubmitting ? "Saving to IndexedDB..." : "Generate Short URL"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
