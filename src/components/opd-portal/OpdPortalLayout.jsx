import React, { useState } from "react";
import OpdSidebar from "./OpdSidebar.jsx";
import DoctorOpdDashboard from "./DoctorOpdDashboard.jsx";
import OpdQueueScreen from "../queue/OpdQueueScreen.jsx";
import DoctorProfileView from "./DoctorProfileView.jsx";
import RouteTopBar from "../common/RouteTopBar.jsx";
import { useHospitalData } from "../../hooks/useHospitalData.js";

export default function OpdPortalLayout({
  currentPath = "/opd",
  navigateTo = () => {},
  initialTab,
  onSelectPatient = () => {},
  onNavigateHome = () => {},
}) {
  const {
    patients = [],
    counts = {},
    waitingPatients = [],
    isLoading,
  } = useHospitalData();

  const getTabFromPath = (path) => {
    if (path === "/opd-queue" || path === "/opd/queue" || path === "/opd/appointments") {
      return "appointments";
    }
    if (path === "/opd/profile") {
      return "profile";
    }
    if (path === "/opd" || path === "/opd/dashboard") {
      return "dashboard";
    }
    return initialTab || "dashboard";
  };

  const [activeMenu, setActiveMenu] = useState(() => getTabFromPath(currentPath));
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Default closed/minimized
  const [doctorStatus, setDoctorStatus] = useState(() => {
    try {
      return localStorage.getItem("opd_doctor_duty_status") || "ON DUTY";
    } catch {
      return "ON DUTY";
    }
  });

  // Sync menu state when URL route changes externally
  React.useEffect(() => {
    const tab = getTabFromPath(currentPath);
    setActiveMenu(tab);
  }, [currentPath]);

  const handleSelectMenu = (menuId) => {
    setActiveMenu(menuId);
    if (menuId === "appointments") {
      navigateTo("/opd-queue");
    } else if (menuId === "profile") {
      navigateTo("/opd/profile");
    } else {
      navigateTo("/opd");
    }
  };

  const handleDoctorStatusChange = (newStatus) => {
    setDoctorStatus(newStatus);
    try {
      localStorage.setItem("opd_doctor_duty_status", newStatus);
    } catch (err) {
      console.warn("Storage warning:", err);
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(145deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)",
        minHeight: "100vh",
      }}
      className="flex text-slate-800 font-sans"
    >
      {/* ── Left Side Menu ── */}
      <OpdSidebar
        activeMenu={activeMenu}
        onSelectMenu={handleSelectMenu}
        waitingCount={waitingPatients.length}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onNavigateHome={onNavigateHome}
        doctorStatus={doctorStatus}
      />

      {/* ── Main View Container with animated tab slide-up ── */}
      <main className="flex-1 overflow-x-hidden min-w-0">
        {activeMenu === "dashboard" && (
          <div key="dashboard" className="animate-slide-up">
            <RouteTopBar
              onBack={onNavigateHome}
              backLabel="Back to Home"
              hospitalName="ABCD Multispecialty Hospital"
              badge="OPD CLINICAL PORTAL • ROOM 104"
              badgeBg="#e0f2fe"
              badgeColor="#0369a1"
              title="Doctor OPD Consultation Workspace & Analytics"
              rightControls={
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Doctor: {doctorStatus}
                  </span>
                  <button
                    onClick={() => handleSelectMenu("appointments")}
                    className="px-3.5 py-1.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                  >
                    Open Live Queue ({waitingPatients.length})
                  </button>
                </div>
              }
            />
            <div className="max-w-[1600px] mx-auto p-4 sm:p-7">
              <DoctorOpdDashboard
                patients={patients}
                counts={counts}
                doctorStatus={doctorStatus}
                onSelectPatient={onSelectPatient}
                onGoToAppointments={() => handleSelectMenu("appointments")}
              />
            </div>
          </div>
        )}

        {activeMenu === "appointments" && (
          <div key="appointments" className="animate-slide-up">
            <OpdQueueScreen
              onSelectPatient={onSelectPatient}
              onNavigateHome={onNavigateHome}
            />
          </div>
        )}

        {activeMenu === "profile" && (
          <div key="profile" className="animate-slide-up">
            <RouteTopBar
              onBack={onNavigateHome}
              backLabel="Back to Home"
              hospitalName="ABCD Multispecialty Hospital"
              badge="DOCTOR CREDENTIALS"
              badgeBg="#e0f2fe"
              badgeColor="#0369a1"
              title="Doctor Profile & OPD Credentials"
            />
            <div className="max-w-[1600px] mx-auto p-4 sm:p-7">
              <DoctorProfileView
                doctorStatus={doctorStatus}
                onDoctorStatusChange={handleDoctorStatusChange}
                onGoToAppointments={() => handleSelectMenu("appointments")}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
