import { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  File,
  FileText,
  Image as ImageIcon,
  Plus,
  Sparkles,
  Trash2,
  UploadCloud,
  X,
  Clock,
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

const COMMON_PRESETS = [
  "Complete Blood Count (CBC)",
  "Lipid Profile & Cholesterol",
  "HbA1c & Fasting Blood Glucose",
  "Comprehensive Metabolic Panel (CMP)",
  "Liver Function Test (LFT)",
  "Thyroid Profile (T3, T4, TSH)",
];

const QUICK_REMARKS = [
  "All parameters are within normal biological reference ranges.",
  "Borderline values observed. Routine physician review recommended.",
  "Critical alert: Immediate specialist consultation advised.",
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
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (filesList) => {
    setErrorMessage("");
    const files = Array.from(filesList || []);
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
  };

  const handleFileChange = (e) => {
    handleFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer && e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!title.trim()) {
      setErrorMessage("Please enter a Report Title.");
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
      setErrorMessage("An unexpected error occurred while saving the report.");
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
    <div
      style={{
        width: "70%",
        minWidth: 320,
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      {/* Back button link */}
      <div style={{ marginBottom: 14 }}>
        <button
          type="button"
          onClick={() => onNavigate("/")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "none",
            color: "#64748b",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            padding: "4px 0",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#0d9488")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
        >
          <ArrowLeft size={14} /> Back to Links Dashboard
        </button>
      </div>

      {/* Main Glassmorphic Form Card */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: 20,
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 24px rgba(0,0,0,0.03)",
          overflow: "hidden",
        }}
      >
        {/* Card Header (Clean: badges removed) */}
        <div
          style={{
            padding: "24px 28px",
            borderBottom: "1px solid #e2e8f0",
            background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
          }}
        >
          <h2
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#0f172a",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Generate Lab Report Link
          </h2>
          <p style={{ fontSize: 13, color: "#64748b", margin: "6px 0 0 0", lineHeight: 1.5 }}>
            Upload pathology or radiology diagnostic reports with secure instant patient access and customizable link expiration.
          </p>
        </div>

        {/* Form Body: Side-by-Side 2-Column Grid */}
        <form onSubmit={handleSubmit} style={{ padding: "26px 28px", display: "flex", flexDirection: "column", gap: 24 }}>
          {errorMessage && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                borderRadius: 12,
                background: "#fee2e2",
                border: "1px solid #fecaca",
                padding: "10px 14px",
                fontSize: 12,
                color: "#991b1b",
                fontWeight: 600,
              }}
            >
              <AlertCircle size={16} color="#dc2626" style={{ shrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Side-by-Side 2-Column Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))",
              gap: 26,
              alignItems: "start",
            }}
          >
            {/* LEFT COLUMN: Report Title, Presets, Remarks, Expiration */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Report Title */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <label htmlFor="reportTitle" style={{ fontSize: 12, fontWeight: 700, color: "#1e293b" }}>
                    Report Title <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>e.g. Test Name - Patient Name</span>
                </div>

                <input
                  id="reportTitle"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Complete Blood Count & Lipid Profile - Aarav Sharma"
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: 12,
                    border: "1.5px solid #cbd5e1",
                    fontSize: 13,
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.15s, box-shadow 0.15s",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#0d9488";
                    e.target.style.boxShadow = "0 0 0 3px rgba(13, 148, 136, 0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#cbd5e1";
                    e.target.style.boxShadow = "none";
                  }}
                />

                {/* Quick Test Presets */}
                <div style={{ marginTop: 10 }}>
                  <span style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>
                    Common Test Templates:
                  </span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {COMMON_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          setTitle(title ? `${preset} - ${title.split(" - ").pop()}` : `${preset} - Patient Name`);
                        }}
                        style={{
                          padding: "4px 10px",
                          borderRadius: 999,
                          border: "1px solid #e2e8f0",
                          background: "#f8fafc",
                          color: "#475569",
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#0d9488";
                          e.currentTarget.style.color = "#0d9488";
                          e.currentTarget.style.background = "#f0fdfa";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#e2e8f0";
                          e.currentTarget.style.color = "#475569";
                          e.currentTarget.style.background = "#f8fafc";
                        }}
                      >
                        + {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Diagnostic Attachments Drag & Drop Zone + Uploaded List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#1e293b" }}>
                  Diagnostic Attachments (PDF / Images) <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <span style={{ fontSize: 11, color: "#64748b" }}>
                  {attachments.length}/{MAX_ATTACHMENTS} files (max 15 MB each)
                </span>
              </div>

              <label
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 14,
                  border: isDragging ? "2px dashed #0d9488" : "2px dashed #cbd5e1",
                  background: isDragging ? "#f0fdfa" : "#f8fafc",
                  padding: "36px 20px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!isDragging) e.currentTarget.style.borderColor = "#0d9488";
                }}
                onMouseLeave={(e) => {
                  if (!isDragging) e.currentTarget.style.borderColor = "#cbd5e1";
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: "#e6fffa",
                    color: "#0d9488",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 10,
                  }}
                >
                  <UploadCloud size={26} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                  Click to browse or drag & drop report files
                </span>
                <span style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
                  Supports PDF, JPEG, PNG, or WEBP (up to 15 MB)
                </span>
                <input
                  type="file"
                  multiple
                  accept=".pdf,image/png,image/jpeg,image/webp"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </label>

              {/* Selected Attachments List */}
              {attachments.length > 0 && (
                <div style={{ marginTop: 4, display: "flex", flexDirection: "column", gap: 8 }}>
                  {attachments.map((file, idx) => (
                    <div
                      key={`${file.name}-${idx}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 14px",
                        borderRadius: 10,
                        border: "1px solid #e2e8f0",
                        background: "#ffffff",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: file.type.includes("pdf") ? "#fee2e2" : "#e0f2fe",
                            color: file.type.includes("pdf") ? "#dc2626" : "#0284c7",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            shrink: 0,
                          }}
                        >
                          {file.type.includes("pdf") ? <FileText size={16} /> : <ImageIcon size={16} />}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {file.name}
                          </div>
                          <div style={{ fontSize: 11, color: "#64748b" }}>
                            {formatBytes(file.size)} · {file.type || "Document"}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeAttachment(idx)}
                        title="Remove file"
                        style={{
                          background: "none",
                          border: "none",
                          color: "#94a3b8",
                          cursor: "pointer",
                          padding: 4,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 6,
                          transition: "color 0.15s, background 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#dc2626";
                          e.currentTarget.style.background = "#fee2e2";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "#94a3b8";
                          e.currentTarget.style.background = "none";
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Link Expiration Window Card (Matching Telehealth & user screenshot) */}
          <div
            style={{
              marginTop: 20,
              marginBottom: 20,
              padding: "16px 20px",
              borderRadius: 14,
              border: "1px solid #e2e8f0",
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: "#f1f5f9",
                  color: "#334155",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Clock size={18} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                  Link Expiration Window
                </div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                  Standard telehealth sessions automatically expire post-consultation
                </div>
              </div>
            </div>

            <select
              id="expiration"
              value={expiration}
              onChange={(e) => setExpiration(e.target.value)}
              style={{
                minWidth: 260,
                padding: "8px 14px",
                borderRadius: 10,
                border: "1.5px solid #cbd5e1",
                background: "#f8fafc",
                fontSize: 13,
                fontWeight: 600,
                color: "#0f172a",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="1 day">1 day (Urgent / Acute Care)</option>
              <option value="7 days">7 days (Standard consultation window)</option>
              <option value="30 days">30 days (Routine Outpatient Review)</option>
              <option value="90 days">90 days (Long-Term Patient Record)</option>
              <option value="Never expires">Never expires (Permanent Record)</option>
            </select>
          </div>

          {/* Actions Footer */}
          <div
            style={{
              paddingTop: 18,
              borderTop: "1px solid #f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <button
              type="button"
              onClick={handleReset}
              style={{
                padding: "10px 18px",
                borderRadius: 10,
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                fontSize: 13,
                fontWeight: 600,
                color: "#475569",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
            >
              Reset Form
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "11px 24px",
                borderRadius: 12,
                border: "none",
                background: isSubmitting
                  ? "#94a3b8"
                  : "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
                color: "#ffffff",
                fontSize: 13,
                fontWeight: 800,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                boxShadow: isSubmitting ? "none" : "0 4px 16px rgba(13, 148, 136, 0.3)",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) e.currentTarget.style.transform = "";
              }}
            >
              <FileText size={16} />
              <span>{isSubmitting ? "Generating Report Link..." : "Generate Lab Report Link"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
