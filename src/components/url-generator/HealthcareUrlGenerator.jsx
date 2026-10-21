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
} from "lucide-react";
import { seedInitialDataIfEmpty } from "../../db/database";
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

  useEffect(() => {
    // Seed initial Dexie sample records if first run
    seedInitialDataIfEmpty().catch((err) => console.error("Seed error", err));
  }, []);

  const handleNavigate = (path) => {
    setCurrentRoute(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Route parser
  let renderedView = null;

  if (currentRoute === "/" || currentRoute === "/dashboard") {
    renderedView = <DashboardView onNavigate={handleNavigate} />;
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
    renderedView = <DashboardView onNavigate={handleNavigate} />;
  }

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/lab-reports/new", label: "Lab Reports", icon: FileText },
    { path: "/telehealth/new", label: "Telehealth", icon: Video },
    { path: "/feedback/new", label: "Patient Feedback", icon: HeartHandshake },
    { path: "/survey/new", label: "Survey Shortener", icon: Link2 },
  ];

  return (
    <div className="min-h-screen bg-clinical-50 font-sans text-ink-900 flex flex-col">
      {/* Top Application Header */}
      <header className="border-b border-clinical-100 bg-white sticky top-0 z-30 shadow-sm">
        <div className="mx-auto flex items-center justify-between gap-4 px-4 py-3 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigateTo("/")}
              className="inline-flex items-center gap-1.5 rounded-xl border border-clinical-100 bg-white px-3 py-1.5 text-xs font-semibold text-clinical-700 transition hover:bg-clinical-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clinical-500"
              title="Return to hospital product suite"
            >
              <ArrowLeft size={14} /> Back to Suite
            </button>
            <div className="h-4 w-px bg-clinical-100 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <Link2 size={18} />
              </span>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-teal-800 hidden sm:block">
                  Healthcare URL Generator
                </span>
                <h1 className="font-display text-sm sm:text-base font-bold text-clinical-950">
                  Get Well Multispecialty Hospital
                </h1>
              </div>
            </div>
          </div>

          {/* Right Header Badges & Mobile Toggle */}
          <div className="flex items-center gap-2">
            <span className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-teal-50 border border-teal-200 px-3 py-1 text-xs font-medium text-teal-800">
              <ShieldCheck size={13} /> Browser IndexedDB Storage
            </span>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded-xl border border-clinical-100 p-2 text-clinical-800 hover:bg-clinical-50"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="border-t border-clinical-100 bg-white p-3 md:hidden space-y-1 animate-fade-in-up">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.path;
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleNavigate(item.path)}
                  className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                    isActive
                      ? "bg-clinical-700 text-white"
                      : "text-ink-600 hover:bg-clinical-50 hover:text-clinical-950"
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Layout Body with Desktop Sidebar */}
      <div className="mx-auto flex w-full flex-1 px-4 py-6 sm:px-8 sm:py-8 gap-8">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:flex w-56 flex-col shrink-0 space-y-6">
          <nav className="space-y-1.5 rounded-2xl border border-clinical-100 bg-white p-3 shadow-sm">
            <span className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-300 block">
              URL Generator Modules
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.path;
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleNavigate(item.path)}
                  className={`w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
                    isActive
                      ? "bg-clinical-700 text-white shadow-sm"
                      : "text-ink-600 hover:bg-clinical-50 hover:text-clinical-950"
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Context Card */}
          <div className="rounded-2xl border border-clinical-100 bg-white p-4 shadow-sm text-xs text-ink-600 space-y-2">
            <span className="font-bold text-clinical-950 block">Frontend-Only Mode</span>
            <p className="text-[11px] leading-relaxed">
              Records, binary PDF/image blobs, and ratings are saved locally in Dexie IndexedDB.
            </p>
          </div>
        </aside>

        {/* Dynamic Main Workspace Area */}
        <main className="flex-1 min-w-0">
          {renderedView}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-clinical-100 bg-white py-4 text-center text-xs text-ink-600 mt-auto">
        <div className="mx-auto  px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Healthcare URL Generator · Get Well Multispecialty Hospital</span>
          <span className="text-[11px] text-ink-600">
            Powered by React, Dexie.js, IndexedDB & Tailwind CSS
          </span>
        </div>
      </footer>
    </div>
  );
}
