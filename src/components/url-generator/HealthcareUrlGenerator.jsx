import { useEffect, useState } from "react";
import {
  ArrowLeft,
  FileText,
  HeartHandshake,
  LayoutDashboard,
  Link2,
  Menu,
  ShieldCheck,
  Stethoscope,
  Video,
  X,
  Plus,
  Sparkles,
  Lock,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { seedInitialDataIfEmpty, db, resetDatabase } from "../../db/database";
import DashboardView from "./DashboardView";
import FeedbackFormBuilder from "./FeedbackFormBuilder";
import FeedbackResultsView from "./FeedbackResultsView";
import FeedbackSubmitViewer from "./FeedbackSubmitViewer";
import LabReportForm from "./LabReportForm";
import ReportViewer from "./ReportViewer";
import ShortCodeResolver from "./ShortCodeResolver";
import SurveyForm from "./SurveyForm";
import TelehealthForm from "./TelehealthForm";
import TelehealthViewer from "./TelehealthViewer";

export default function HealthcareUrlGenerator({ navigateTo, initialPath = "/" }) {
  const [currentRoute, setCurrentRoute] = useState(initialPath);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [counts, setCounts] = useState({ lab: 0, telehealth: 0, feedback: 0, survey: 0 });
  const [toastMessage, setToastMessage] = useState("");
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    // Seed initial Dexie sample records if first run
    seedInitialDataIfEmpty()
      .then(() => fetchCounts())
      .catch((err) => console.error("Seed error", err));
  }, []);

  const fetchCounts = async () => {
    try {
      const [lab, tele, fb, sur] = await Promise.all([
        db.labReports.count(),
        db.telehealthMeetings.count(),
        db.feedbackForms.count(),
        db.surveys.count(),
      ]);
      setCounts({ lab, telehealth: tele, feedback: fb, survey: sur });
    } catch (e) {
      console.warn("Could not fetch counts", e);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleNavigate = (path) => {
    setCurrentRoute(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchCounts();
  };

  const handleResetDb = async () => {
    await resetDatabase();
    setShowResetConfirm(false);
    showToast("Clinical database reset with fresh sample records!");
    fetchCounts();
    if (currentRoute !== "/" && currentRoute !== "/dashboard") {
      handleNavigate("/");
    }
  };

  // Route parser
  let renderedView = null;

  if (currentRoute === "/" || currentRoute === "/dashboard") {
    renderedView = <DashboardView onNavigate={handleNavigate} showToast={showToast} />;
  } else if (currentRoute === "/lab-reports/new") {
    renderedView = <LabReportForm onNavigate={handleNavigate} />;
  } else if (currentRoute === "/telehealth/new") {
    renderedView = <TelehealthForm onNavigate={handleNavigate} />;
  } else if (currentRoute === "/feedback/new") {
    renderedView = <FeedbackFormBuilder onNavigate={handleNavigate} />;
  } else if (currentRoute === "/survey/new") {
    renderedView = <SurveyForm onNavigate={handleNavigate} />;
  } else if (currentRoute.startsWith("/reports/")) {
    const reportId = currentRoute.replace("/reports/", "");
    renderedView = (
      <ReportViewer
        reportId={reportId}
        onBack={() => handleNavigate("/")}
      />
    );
  } else if (currentRoute.startsWith("/meetings/")) {
    const meetingId = currentRoute.replace("/meetings/", "");
    renderedView = (
      <TelehealthViewer
        meetingId={meetingId}
        onBack={() => handleNavigate("/")}
      />
    );
  } else if (currentRoute.startsWith("/feedback/")) {
    const formId = currentRoute.replace("/feedback/", "");
    renderedView = (
      <FeedbackSubmitViewer
        formId={formId}
        onBack={() => handleNavigate("/")}
      />
    );
  } else if (currentRoute.startsWith("/feedback-results/")) {
    const formId = currentRoute.replace("/feedback-results/", "");
    renderedView = (
      <FeedbackResultsView
        formId={formId}
        onBack={() => handleNavigate("/")}
      />
    );
  } else if (currentRoute.startsWith("/s/")) {
    const code = currentRoute.replace("/s/", "");
    renderedView = (
      <ShortCodeResolver
        shortCode={code}
        onNavigate={handleNavigate}
        onBack={() => handleNavigate("/")}
      />
    );
  } else {
    renderedView = <DashboardView onNavigate={handleNavigate} showToast={showToast} />;
  }

  const navItems = [
    { path: "/", label: "Dashboard & Links", icon: LayoutDashboard, count: null },
    { path: "/lab-reports/new", label: "Lab Reports", icon: FileText, count: counts.lab },
    { path: "/telehealth/new", label: "Telehealth Sessions", icon: Video, count: counts.telehealth },
    { path: "/feedback/new", label: "Patient Feedback", icon: HeartHandshake, count: counts.feedback },
    { path: "/survey/new", label: "Survey Shortener", icon: Link2, count: counts.survey },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(145deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)",
        fontFamily: "'Inter', -apple-system, sans-serif",
        color: "#1e293b",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 24,
            zIndex: 9999,
            background: "#0f172a",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: 12,
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 13,
            fontWeight: 600,
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          <Sparkles size={16} color="#38bdf8" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER */}
      <header
        style={{
          background: "rgba(255, 255, 255, 0.88)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(226, 232, 240, 0.9)",
          position: "sticky",
          top: 0,
          zIndex: 40,
          boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
        }}
      >
        <div
          style={{
            maxWidth: 1540,
            margin: "0 auto",
            padding: "12px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 14,
          }}
        >
          {/* Left: Back + Hospital Branding */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button
              onClick={() => navigateTo("/")}
              aria-label="Back to dashboard"
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                background: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#475569",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f8fafc";
                e.currentTarget.style.borderColor = "#cbd5e1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#ffffff";
                e.currentTarget.style.borderColor = "#e2e8f0";
              }}
              title="Return to hospital product suite"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: "#059669",
                  }}
                >
                  ABCD Multispecialty Hospital
                </span>
                <span
                  style={{
                    fontSize: 11,
                    background: "#ecfdf5",
                    color: "#047857",
                    padding: "1px 8px",
                    borderRadius: 999,
                    fontWeight: 700,
                  }}
                >
                  Digital Patient Services
                </span>
              </div>
              <h1
                style={{
                  margin: "2px 0 0 0",
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#0f172a",
                  letterSpacing: "-0.02em",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                Healthcare Smart Link & Short URL Hub
              </h1>
            </div>
          </div>

          {/* Right Controls: Live status, Reset DB, New URL CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                padding: "6px 12px",
                borderRadius: 999,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#22c55e",
                  display: "inline-block",
                  boxShadow: "0 0 0 3px rgba(34, 197, 94, 0.2)",
                }}
              />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#166534" }}>Encrypted Local Storage</span>
              <span style={{ fontSize: 12, color: "#15803d", fontWeight: 500 }}>· HIPAA Private</span>
            </div>

            <button
              onClick={() => setShowResetConfirm(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 12px",
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                background: "#ffffff",
                color: "#475569",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
              title="Reset sample clinical records"
            >
              <RefreshCw size={13} />
              <span className="hidden sm:inline">Reset DB</span>
            </button>

            <button
              onClick={() => handleNavigate("/lab-reports/new")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "8px 16px",
                borderRadius: 10,
                background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                color: "#ffffff",
                border: "none",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(5, 150, 105, 0.28)",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
              }}
            >
              <span>Create Smart URL</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs with Dynamic Badge Counters */}
        <div
          style={{
            maxWidth: 1540,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            gap: 6,
            overflowX: "auto",
          }}
        >
          {navItems.map(({ path, label, icon: TabIcon, count }) => {
            const isActive = currentRoute === path || (path === "/" && currentRoute === "/dashboard");
            return (
              <button
                key={path}
                onClick={() => handleNavigate(path)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 18px",
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 600,
                  color: isActive ? "#059669" : "#64748b",
                  borderBottom: isActive ? "3px solid #059669" : "3px solid transparent",
                  background: "transparent",
                  borderLeft: "none",
                  borderRight: "none",
                  borderTop: "none",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                }}
              >
                <TabIcon size={16} color={isActive ? "#059669" : "#94a3b8"} />
                <span>{label}</span>
                {count !== null && count > 0 && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "2px 7px",
                      borderRadius: 999,
                      background: isActive ? "#ecfdf5" : "#f1f5f9",
                      color: isActive ? "#047857" : "#64748b",
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* MAIN WORKSPACE BODY */}
      <main style={{ maxWidth: 1540, width: "100%", margin: "0 auto", padding: "24px", flex: 1 }}>
        {renderedView}
      </main>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: "1px solid #e2e8f0",
          background: "rgba(255, 255, 255, 0.8)",
          padding: "14px 24px",
          marginTop: "auto",
        }}
      >
        <div
          style={{
            maxWidth: 1540,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            fontSize: 12,
            color: "#64748b",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <ShieldCheck size={15} color="#059669" />
            <span>ABCD Multispecialty Hospital · Patient Information & Smart Link Hub</span>
          </div>
          <span style={{ fontSize: 11, color: "#94a3b8" }}>
            Secure Clinical Storage · Cryptographic Collision-Free Short Codes
          </span>
        </div>
      </footer>

      {/* RESET CONFIRMATION MODAL */}
      {showResetConfirm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(15, 23, 42, 0.5)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: 20,
              width: "100%",
              maxWidth: 420,
              padding: 26,
              boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "#fef3c7",
                color: "#d97706",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <RefreshCw size={22} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 6px 0" }}>
              Reset Sample Data?
            </h3>
            <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5, margin: "0 0 20px 0" }}>
              This will clear all local records and restore the initial sample clinical lab reports,
              telehealth sessions, and feedback forms.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 10,
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#475569",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetDb}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 10,
                  border: "none",
                  background: "#059669",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Reset & Reload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
