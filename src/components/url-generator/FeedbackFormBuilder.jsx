import { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Clock,
  HeartHandshake,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { db } from "../../db/database";
import { createLinkRecord } from "../../services/shortUrlService";
import SuccessScreen from "./SuccessScreen";

const FEEDBACK_PRESETS = [
  {
    title: "Inpatient Nursing & Medical Care Experience",
    badge: "Inpatient / Wards",
  },
  {
    title: "Outpatient Pharmacy, Labs & Billing Review",
    badge: "OPD Services",
  },
  {
    title: "Emergency Triage & Casualty Department",
    badge: "Emergency Care",
  },
  {
    title: "Post-Discharge 14-Day Recovery Feedback",
    badge: "Post-Care Review",
  },
  {
    title: "Maternity & Neonatal Care Assessment",
    badge: "Specialty Wards",
  },
];

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
            Create Patient Feedback Form Link
          </h2>
          <p
            style={{
              fontSize: 13,
              color: "#64748b",
              margin: "6px 0 0 0",
              lineHeight: 1.5,
            }}
          >
            Generate mobile-optimized 1–5 star patient satisfaction survey links. Discharged patients can submit feedback instantly without app downloads.
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

          {/* Section 1: Feedback Form Title */}
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
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: "#ede9fe",
                  color: "#6d28d9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <HeartHandshake size={15} />
              </div>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                  Feedback Form Title
                </span>
                <span style={{ fontSize: 11, color: "#64748b", marginLeft: 8 }}>
                  Displayed at the top of the mobile questionnaire
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="fbTitle"
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#334155",
                  marginBottom: 6,
                }}
              >
                Form Header / Scope <span style={{ color: "#e11d48" }}>*</span>
              </label>
              <input
                id="fbTitle"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Cardiology Department Discharge Feedback"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  fontSize: 13,
                  color: "#0f172a",
                  fontWeight: 600,
                  outline: "none",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#7c3aed";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.12)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#cbd5e1";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          {/* Section 2: Form Structure Preview Card */}
          <div
            style={{
              padding: "18px 20px",
              borderRadius: 14,
              border: "1px solid #e2e8f0",
              background: "#ffffff",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "#fef3c7",
                    color: "#b45309",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Sparkles size={15} />
                </div>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                    Standard Patient Rating Questions Preview
                  </span>
                </div>
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#475569",
                  background: "#f1f5f9",
                  border: "1px solid #e2e8f0",
                  padding: "3px 8px",
                  borderRadius: 6,
                }}
              >
                Pre-configured 1–5 Stars
              </span>
            </div>

            <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 12px 0" }}>
              Discharged patients will respond to these 3 interactive rating questions plus an open improvement comment box:
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {/* Question 1 */}
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: "1px solid #f1f5f9",
                  background: "#f8fafc",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#1e293b" }}>
                    1. Rate the hospital nursing & attending staff
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#e11d48",
                      background: "#fff1f2",
                      padding: "2px 6px",
                      borderRadius: 4,
                    }}
                  >
                    Required
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 6, color: "#f59e0b" }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={15} fill="currentColor" />
                  ))}
                  <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 8 }}>
                    (1 = Very Poor · 5 = Outstanding)
                  </span>
                </div>
              </div>

              {/* Question 2 */}
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: "1px solid #f1f5f9",
                  background: "#f8fafc",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#1e293b" }}>
                    2. Rate the doctor's clinical consultation & care
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#e11d48",
                      background: "#fff1f2",
                      padding: "2px 6px",
                      borderRadius: 4,
                    }}
                  >
                    Required
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 6, color: "#f59e0b" }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={15} fill="currentColor" />
                  ))}
                  <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 8 }}>
                    (1 = Very Poor · 5 = Outstanding)
                  </span>
                </div>
              </div>

              {/* Question 3 */}
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: "1px solid #f1f5f9",
                  background: "#f8fafc",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#1e293b" }}>
                    3. Rate the overall hospital facility & cleanliness
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#e11d48",
                      background: "#fff1f2",
                      padding: "2px 6px",
                      borderRadius: 4,
                    }}
                  >
                    Required
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 6, color: "#f59e0b" }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={15} fill="currentColor" />
                  ))}
                  <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 8 }}>
                    (1 = Very Poor · 5 = Outstanding)
                  </span>
                </div>
              </div>

              {/* Question 4 */}
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: "1px solid #f1f5f9",
                  background: "#f8fafc",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#1e293b" }}>
                    4. Patient Suggestions & Constructive Comments
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: "#64748b",
                      background: "#f1f5f9",
                      padding: "2px 6px",
                      borderRadius: 4,
                    }}
                  >
                    Optional Textarea
                  </span>
                </div>
                <p style={{ fontSize: 11, color: "#64748b", fontStyle: "italic", margin: "6px 0 0 0" }}>
                  "Tell us what we did exceptionally well or how our hospital can improve your experience."
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Expiration Period */}
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
                    htmlFor="fbExpiry"
                    style={{
                      display: "block",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#0f172a",
                    }}
                  >
                    Feedback Link Expiration
                  </label>
                  <span style={{ fontSize: 11, color: "#64748b" }}>
                    Post-discharge feedback links typically remain valid for 14 to 30 days
                  </span>
                </div>
              </div>

              <select
                id="fbExpiry"
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
                <option value="1 day">1 day (Immediate discharge survey)</option>
                <option value="7 days">7 days (1-week follow-up)</option>
                <option value="30 days">30 days (Standard monthly review)</option>
                <option value="90 days">90 days (Quarterly feedback drive)</option>
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
                  : "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                color: "#ffffff",
                fontSize: 13,
                fontWeight: 700,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                boxShadow: "0 2px 8px rgba(124,58,237,0.25)",
                transition: "transform 0.1s, box-shadow 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(124,58,237,0.35)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(124,58,237,0.25)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <HeartHandshake size={14} />
              {isSubmitting ? "Generating Feedback Link..." : "Create Feedback Form Link"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
