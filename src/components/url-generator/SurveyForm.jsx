import { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Clock,
  ExternalLink,
  Globe,
  Link as LinkIcon,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { db } from "../../db/database";
import { createLinkRecord } from "../../services/shortUrlService";
import SuccessScreen from "./SuccessScreen";

const SURVEY_PRESETS = [
  {
    title: "Annual Outpatient Experience & Care Quality Survey",
    url: "https://docs.google.com/forms/d/e/1FAIpQLSc-hospital-opd-2026/viewform",
    desc: "Comprehensive annual quality and wait time assessment across all hospital outpatient departments.",
  },
  {
    title: "Hospital Cafeteria, Nutrition & Hygiene Audit",
    url: "https://forms.office.com/r/hospital-cafeteria-audit-2026",
    desc: "Patient and visitor satisfaction survey regarding dietary services, nutrition quality, and food hygiene.",
  },
  {
    title: "Post-Discharge 30-Day Recovery & PROM Study",
    url: "https://surveys.hospitalgroup.org/prom-30day-cardiac",
    desc: "Standardized Patient-Reported Outcome Measures (PROM) questionnaire following surgical discharge.",
  },
  {
    title: "Clinical Trial Eligibility & Intake Screening",
    url: "https://research.hospitalgroup.org/trials/intake-screener",
    desc: "Preliminary patient screening questionnaire for ongoing clinical trials and observational cohorts.",
  },
];

const QUICK_SCOPES = [
  "NABH Quality Assurance & Accreditation Audit",
  "Patient-Reported Outcomes Measure (PROM) Study",
  "Visitor & Inpatient Amenities Feedback",
  "Pharmacy & Medication Dispensing Evaluation",
];

export default function SurveyForm({ onNavigate }) {
  const [title, setTitle] = useState("");
  const [originalUrl, setOriginalUrl] = useState("");
  const [description, setDescription] = useState("");
  const [expiration, setExpiration] = useState("30 days");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdRecord, setCreatedRecord] = useState(null);

  const applyPreset = (preset) => {
    setTitle(preset.title);
    setOriginalUrl(preset.url);
    setDescription(preset.desc);
    setErrorMessage("");
  };

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
        {/* Card Header */}
        <div
          style={{
            padding: "24px 28px",
            borderBottom: "1px solid #e2e8f0",
            background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
          }}
        >
          <h2
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#0f172a",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Shorten Survey URL
          </h2>
          <p
            style={{
              fontSize: 13,
              color: "#64748b",
              margin: "6px 0 0 0",
              lineHeight: 1.5,
            }}
          >
            Map cumbersome external research links, Google Forms, Microsoft Forms, or accreditation audits into clean, branded short URLs with automatic redirection.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: "24px 28px" }}>
          {errorMessage && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 14px",
                borderRadius: 12,
                background: "#fff1f2",
                border: "1px solid #fecdd3",
                color: "#9f1239",
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 20,
              }}
            >
              <AlertCircle size={16} style={{ shrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Survey Identity & Destination URL */}
          <div
            style={{
              padding: "18px 20px",
              borderRadius: 14,
              border: "1px solid #e2e8f0",
              background: "#f8fafc",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: "#dbeafe",
                  color: "#1d4ed8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Globe size={15} />
              </div>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                  Destination URL & Survey Title
                </span>
                <span style={{ fontSize: 11, color: "#64748b", marginLeft: 8 }}>
                  Visitors will be instantly redirected to this target address
                </span>
              </div>
            </div>

            {/* Survey Title */}
            <div style={{ marginBottom: 14 }}>
              <label
                htmlFor="surveyTitle"
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#334155",
                  marginBottom: 5,
                }}
              >
                Survey Title <span style={{ color: "#e11d48" }}>*</span>
              </label>
              <input
                id="surveyTitle"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Annual Outpatient Patient Experience Survey 2026"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "9px 12px",
                  borderRadius: 10,
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  fontSize: 13,
                  color: "#0f172a",
                  outline: "none",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#2563eb";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.12)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#cbd5e1";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Destination URL */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 5,
                }}
              >
                <label
                  htmlFor="originalSurveyUrl"
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#334155",
                  }}
                >
                  Long Destination URL <span style={{ color: "#e11d48" }}>*</span>
                </label>
                <span style={{ fontSize: 11, color: "#64748b" }}>
                  Google Forms, MS Forms, Typeform, Qualtrics, etc.
                </span>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  id="originalSurveyUrl"
                  type="text"
                  required
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  placeholder="https://docs.google.com/forms/d/e/1FAIpQLSc.../viewform"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "9px 12px 9px 34px",
                    borderRadius: 10,
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    fontSize: 13,
                    fontFamily: "monospace",
                    color: "#0f172a",
                    outline: "none",
                    transition: "border-color 0.15s, box-shadow 0.15s",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#2563eb";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.12)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#cbd5e1";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                <ExternalLink
                  size={15}
                  style={{
                    position: "absolute",
                    left: 11,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                  }}
                />
              </div>

              {/* Supported platform tags */}
              <div style={{ display: "flex", gap: 6, marginTop: 6, alignItems: "center" }}>
                <span style={{ fontSize: 10, color: "#64748b", fontWeight: 600 }}>Supports:</span>
                {["Google Forms", "Microsoft Forms", "Typeform", "SurveyMonkey", "Custom Portal"].map((tool) => (
                  <span
                    key={tool}
                    style={{
                      padding: "2px 7px",
                      fontSize: 10,
                      fontWeight: 600,
                      borderRadius: 6,
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      color: "#64748b",
                    }}
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Clinical Description / Scope */}
          <div
            style={{
              padding: "18px 20px",
              borderRadius: 14,
              border: "1px solid #e2e8f0",
              background: "#f8fafc",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <label
                htmlFor="surveyDesc"
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#334155",
                }}
              >
                Survey Scope / Administrative Purpose (Optional)
              </label>
              <span style={{ fontSize: 11, color: "#94a3b8" }}>
                For internal tracking on dashboard
              </span>
            </div>
            <textarea
              id="surveyDesc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Internal hospital quality audit evaluating outpatient wait times and pharmacy queuing."
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "9px 12px",
                borderRadius: 10,
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                fontSize: 13,
                color: "#0f172a",
                lineHeight: 1.5,
                outline: "none",
                resize: "vertical",
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#2563eb";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.12)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#cbd5e1";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            <div style={{ display: "flex", gap: 5, marginTop: 6, flexWrap: "wrap" }}>
              {QUICK_SCOPES.map((scope, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setDescription(scope)}
                  style={{
                    padding: "3px 8px",
                    fontSize: 10,
                    borderRadius: 6,
                    border: "1px dashed #cbd5e1",
                    background: "#ffffff",
                    color: "#475569",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  + {scope}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Expiration Settings */}
          <div
            style={{
              padding: "16px 20px",
              borderRadius: 14,
              border: "1px solid #e2e8f0",
              background: "#ffffff",
              marginBottom: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "#f1f5f9",
                    color: "#475569",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Clock size={16} />
                </div>
                <div>
                  <label
                    htmlFor="surveyExpiry"
                    style={{
                      display: "block",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#0f172a",
                    }}
                  >
                    Short Link Expiration Period
                  </label>
                  <span style={{ fontSize: 11, color: "#64748b" }}>
                    Redirect link will safely expire after this duration
                  </span>
                </div>
              </div>

              <select
                id="surveyExpiry"
                value={expiration}
                onChange={(e) => setExpiration(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 10,
                  border: "1px solid #cbd5e1",
                  background: "#f8fafc",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#0f172a",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="1 day">1 day (Flash survey)</option>
                <option value="7 days">7 days (1-week audit)</option>
                <option value="30 days">30 days (Standard monthly survey)</option>
                <option value="90 days">90 days (Quarterly feedback)</option>
                <option value="Never expires">Never expires</option>
              </select>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 10,
              paddingTop: 12,
              borderTop: "1px solid #f1f5f9",
            }}
          >
            <button
              type="button"
              onClick={handleReset}
              style={{
                padding: "10px 18px",
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                background: "#ffffff",
                color: "#475569",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 24px",
                borderRadius: 10,
                border: "none",
                background: isSubmitting
                  ? "#94a3b8"
                  : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                color: "#ffffff",
                fontSize: 13,
                fontWeight: 700,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
                transition: "transform 0.1s, box-shadow 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(37,99,235,0.35)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(37,99,235,0.25)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <LinkIcon size={14} />
              {isSubmitting ? "Generating Link..." : "Generate Short URL"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
