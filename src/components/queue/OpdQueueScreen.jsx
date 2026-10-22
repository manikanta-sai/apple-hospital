import React, { useState, useMemo, useEffect } from "react";
import {
  Users,
  Video,
  FlaskConical,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  BookOpen,
  Copy,
} from "lucide-react";
import { useHospitalData } from "../../hooks/useHospitalData";
import QueueKpiStats from "./QueueKpiStats";
import ActiveDeskBanner from "./ActiveDeskBanner";
import QueueFilterBar from "./QueueFilterBar";
import PatientQueueCard from "./PatientQueueCard";
import QuickPatientIntakeModal from "./QuickPatientIntakeModal";
import AdminConfigModal from "./AdminConfigModal";
import PrescriptionPreviewModal from "./PrescriptionPreviewModal";

/**
 * OpdQueueScreen (Full-Width High-Capacity Kanban Board)
 * -----------------------------------------------------
 * Redesigned for maximum operational clarity:
 * - Edge-to-edge non-sticky top bar with single Apple Multispecialty Hospital brand
 * - Full-width spacious triage lanes with no cramped columns
 * - Renamed "Waiting (Walk-in & Online)" to "OPD Lobby (Waiting Pool)"
 * - Expandable Clinical Pharmacopeia bar
 * - Dedicated No-Show / Cancelled lane and filter
 * - Quick Walk-in Patient intake button directly in top header
 */
export default function OpdQueueScreen({
  onSelectPatient = () => {},
  onNavigateHome = () => {},
}) {
  // Dexie reactive data hook
  const {
    patients = [],
    prescriptions = [],
    adminConfigList = [],
    customDictionary = [],
    isLoading,
    callPatient,
    sendToLabs,
    finalizePrescription,
    cancelPatient,
    updatePatient,
    addPatient,
    updateAdminConfig,
    resetDemoData,
  } = useHospitalData();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showDictionary, setShowDictionary] = useState(false);

  // Doctor Duty Status
  const [doctorStatus, setDoctorStatus] = useState(() => {
    try {
      return localStorage.getItem("opd_doctor_duty_status") || "ON DUTY";
    } catch {
      return "ON DUTY";
    }
  });

  const handleDoctorStatusChange = (newStatus) => {
    setDoctorStatus(newStatus);
    try {
      localStorage.setItem("opd_doctor_duty_status", newStatus);
    } catch {}
    showToast(`Doctor duty status updated to: ${newStatus}`);
  };

  // Modals
  const [isQuickIntakeOpen, setIsQuickIntakeOpen] = useState(false);
  const [isAdminConfigOpen, setIsAdminConfigOpen] = useState(false);
  const [previewPrescription, setPreviewPrescription] = useState(null);
  const [previewPatient, setPreviewPatient] = useState(null);

  // Loading & Resetting states
  const [isResetting, setIsResetting] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(""), 3500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleCopyDictionary = (shortcut, expansion) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(expansion);
      showToast(`Copied "${expansion}" (${shortcut}) to clipboard`);
    }
  };

  // Prescription lookup map by patientId
  const prescriptionMap = useMemo(() => {
    const map = {};
    for (const rx of prescriptions) {
      map[rx.patientId] = rx;
    }
    return map;
  }, [prescriptions]);

  // Handle Search Filtering
  const filteredPatients = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return patients;

    return patients.filter((p) => {
      const matchName = p.name?.toLowerCase().includes(q);
      const matchUhid = p.uhid?.toLowerCase().includes(q);
      const matchToken = p.tokenNumber?.toLowerCase().includes(q);
      const matchPhone = p.phone?.includes(q);
      return matchName || matchUhid || matchToken || matchPhone;
    });
  }, [patients, searchQuery]);

  // Merged Lanes:
  // Lane 1: OPD Lobby (Waiting Pool) [Walk-in & Online Arrivals]
  const laneLobby = useMemo(
    () =>
      filteredPatients.filter(
        (p) =>
          p.queueStatus === "waiting" &&
          (p.consultationType === "walk_in" || p.consultationType === "online_booking")
      ),
    [filteredPatients]
  );

  // Lane 2: Tele-Consultations (Waiting)
  const laneTeleConsults = useMemo(
    () =>
      filteredPatients.filter(
        (p) => p.queueStatus === "waiting" && p.consultationType === "tele_consultation"
      ),
    [filteredPatients]
  );

  // Lane 3: Sent for Labs (Drafts)
  const laneDraftLabs = useMemo(
    () => filteredPatients.filter((p) => p.queueStatus === "draft_labs"),
    [filteredPatients]
  );

  // Lane 4: Completed & Finalized
  const laneCompleted = useMemo(
    () => filteredPatients.filter((p) => p.queueStatus === "completed"),
    [filteredPatients]
  );

  // Lane 5: No-Show / Cancelled
  const laneNoShow = useMemo(
    () =>
      filteredPatients.filter(
        (p) => p.queueStatus === "cancelled" || p.queueStatus === "no_show"
      ),
    [filteredPatients]
  );

  // Counts for filter pills
  const filterCounts = useMemo(() => {
    return {
      all: patients.length,
      waiting_in_person: patients.filter(
        (p) =>
          p.queueStatus === "waiting" &&
          (p.consultationType === "walk_in" || p.consultationType === "online_booking")
      ).length,
      tele_consultation: patients.filter(
        (p) => p.consultationType === "tele_consultation" && p.queueStatus === "waiting"
      ).length,
      draft_labs: patients.filter((p) => p.queueStatus === "draft_labs").length,
      completed: patients.filter((p) => p.queueStatus === "completed").length,
      no_show: patients.filter(
        (p) => p.queueStatus === "cancelled" || p.queueStatus === "no_show"
      ).length,
    };
  }, [patients]);

  // Overall KPI statistics
  const counts = useMemo(() => {
    const total = patients.length;
    const waiting = patients.filter((p) => p.queueStatus === "waiting").length;
    const inConsultation = patients.filter((p) => p.queueStatus === "in_consultation").length;
    const draftLabs = patients.filter((p) => p.queueStatus === "draft_labs").length;
    const completed = patients.filter((p) => p.queueStatus === "completed").length;
    const noShow = patients.filter(
      (p) => p.queueStatus === "cancelled" || p.queueStatus === "no_show"
    ).length;

    return { total, waiting, inConsultation, draftLabs, completed, noShow };
  }, [patients]);

  // Active on-going consultation patient
  const inConsultationPatient = useMemo(
    () => patients.find((p) => p.queueStatus === "in_consultation") || null,
    [patients]
  );

  // Actions
  const handleStartConsultation = async (patientId) => {
    const p = patients.find((item) => item.id === patientId);
    await callPatient(patientId);
    showToast(`Called ${p ? p.name : "patient"} to Room 104`);
    onSelectPatient(patientId);
  };

  const handleResumeDraft = (patientId) => {
    const p = patients.find((item) => item.id === patientId);
    showToast(`Resumed draft for ${p ? p.name : "patient"}`);
    onSelectPatient(patientId);
  };

  const handleSendToLabs = async (patientId) => {
    const p = patients.find((item) => item.id === patientId);
    await sendToLabs(patientId);
    showToast(`Sent ${p ? p.name : "patient"} to Labs (Draft locked)`);
  };

  const handleCompleteConsultation = async (patientId) => {
    const p = patients.find((item) => item.id === patientId);
    await finalizePrescription(patientId);
    showToast(`Finalized & signed Rx for ${p ? p.name : "patient"}`);
  };

  const handleStatusChange = async (patientId, newStatus) => {
    const p = patients.find((item) => item.id === patientId);
    if (newStatus === "in_consultation") {
      await handleStartConsultation(patientId);
    } else if (newStatus === "draft_labs") {
      await handleSendToLabs(patientId);
    } else if (newStatus === "completed") {
      await handleCompleteConsultation(patientId);
    } else if (newStatus === "cancelled" || newStatus === "no_show") {
      await cancelPatient(patientId, "Marked as No-Show / Cancelled from queue");
      showToast(`Marked ${p ? p.name : "patient"} as No-Show`);
    } else if (newStatus === "waiting") {
      await updatePatient(patientId, { queueStatus: "waiting" });
      showToast(`Re-admitted ${p ? p.name : "patient"} to waiting queue`);
    } else {
      await updatePatient(patientId, { queueStatus: newStatus });
      showToast(`Updated status to ${newStatus}`);
    }
  };

  const handleResetDemoData = async () => {
    setIsResetting(true);
    try {
      await resetDemoData();
      showToast("Demo database reset to initial clinical seed state");
    } finally {
      setIsResetting(false);
    }
  };

  const handleCallNextWaiting = async () => {
    const nextPatient =
      laneLobby.find((p) => p.priority === "urgent") ||
      laneLobby[0] ||
      laneTeleConsults[0];

    if (nextPatient) {
      await handleStartConsultation(nextPatient.id);
    } else {
      showToast("No patients currently waiting in queue");
    }
  };

  // Determine lane visibility if a filter pill is active
  const isLaneVisible = (laneId) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "waiting_in_person" && laneId === "waiting_in_person") return true;
    if (activeFilter === "tele_consultation" && laneId === "tele_consultation") return true;
    if (activeFilter === "draft_labs" && laneId === "draft_labs") return true;
    if (activeFilter === "completed" && laneId === "completed") return true;
    if (activeFilter === "no_show" && laneId === "no_show") return true;
    return false;
  };

  const getColSpanClass = () => {
    if (activeFilter !== "all") {
      return "grid-cols-1 max-w-2xl mx-auto";
    }
    return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
  };

  return (
    <div
      style={{
        background: "linear-gradient(145deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)",
        minHeight: "100vh",
      }}
      className="text-slate-800 font-sans pb-12"
    >
      {/* 1. Header & Real-time KPI Bar (Full Width, Not Sticky, Edge-to-Edge) */}
      <QueueKpiStats
        counts={counts}
        activeFilter={activeFilter}
        doctorStatus={doctorStatus}
        onDoctorStatusChange={handleDoctorStatusChange}
        onOpenQuickIntake={() => setIsQuickIntakeOpen(true)}
        onResetDemoData={handleResetDemoData}
        onOpenAdminConfig={() => setIsAdminConfigOpen(true)}
        onNavigateHome={onNavigateHome}
        isResetting={isResetting}
        onShowToast={showToast}
      />

      {/* 2. Main Full-Width Operational Workspace */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 mt-6 space-y-6">
        {/* Active Desk Spotlight Banner */}
        <ActiveDeskBanner
          patient={inConsultationPatient}
          onResumeConsultation={(id) => onSelectPatient(id)}
          onSendToLabs={handleSendToLabs}
          onCompleteConsultation={handleCompleteConsultation}
          onCallNext={handleCallNextWaiting}
        />

        {/* Spacious Search & Filter Bar */}
        <QueueFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          filterCounts={filterCounts}
          showDictionary={showDictionary}
          onToggleDictionary={() => setShowDictionary(!showDictionary)}
        />

        {/* Expandable Clinical Dictionary Reference Strip */}
        {showDictionary && (
          <div
            style={{
              background: "rgba(255, 255, 255, 0.94)",
              backdropFilter: "blur(16px)",
              border: "1px solid #bae6fd",
              borderRadius: 20,
              boxShadow: "0 4px 20px rgba(2, 132, 199, 0.06)",
            }}
            className="p-5 animate-fade-in-up"
          >
            <div className="flex items-center justify-between pb-3 border-b border-sky-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Clinical Dictionary & Fast Autocomplete Shortcuts
                </h3>
              </div>
              <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                1-Click Copy
              </span>
            </div>

            <p className="text-[11px] text-slate-500 mt-2">
              Click any abbreviation to copy standard clinical phrases or drug prescriptions to clipboard:
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {customDictionary.map((dict) => (
                <button
                  key={dict.id}
                  onClick={() => handleCopyDictionary(dict.shortcut, dict.expansion)}
                  className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-900 border border-slate-200 hover:border-sky-300 transition-all cursor-pointer shadow-2xs"
                  title={`Click to copy: "${dict.expansion}"`}
                >
                  <span className="font-mono font-bold text-[10px] text-sky-700 bg-sky-100/70 px-1.5 py-0.2 rounded">
                    {dict.shortcut}
                  </span>
                  <span className="truncate max-w-[200px] text-[11px] font-medium">
                    {dict.expansion}
                  </span>
                  <Copy className="w-3 h-3 text-slate-400 group-hover:text-sky-600 opacity-60 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. Full-Width Spacious Triage Lanes (No Squishing) */}
        <div className={`grid gap-4.5 items-start ${getColSpanClass()}`}>
          {/* Lane 1: OPD Lobby (Waiting Pool) [Walk-in & Online Merged] */}
          {isLaneVisible("waiting_in_person") && (
            <div
              style={{
                background: "rgba(255, 255, 255, 0.75)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: "1px solid #e2e8f0",
                borderRadius: 20,
                boxShadow: "0 2px 14px rgba(0,0,0,0.02)",
              }}
              className="p-4 flex flex-col gap-3 min-h-[420px]"
            >
              {/* Lane Header */}
              <div className="flex items-center justify-between px-1 py-1 border-b border-slate-200/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/80 shadow-2xs">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wide">
                      OPD Lobby (Waiting Pool)
                    </h3>
                    <p className="text-[10px] text-slate-400">Walk-in & Online Arrivals</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-900 font-mono">
                  {laneLobby.length}
                </span>
              </div>

              {/* Lane Cards */}
              <div className="space-y-3 flex-1">
                {laneLobby.length > 0 ? (
                  laneLobby.map((patient) => (
                    <PatientQueueCard
                      key={patient.id}
                      patient={patient}
                      prescription={prescriptionMap[patient.id]}
                      onStartConsultation={handleStartConsultation}
                      onStatusChange={handleStatusChange}
                    />
                  ))
                ) : (
                  <div className="h-48 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-4 text-slate-400">
                    <Users className="w-8 h-8 mb-2 opacity-30 text-slate-400" />
                    <p className="text-xs font-semibold text-slate-500">Lobby is clear</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">No in-person arrivals waiting</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Lane 2: Tele-Consultation (Waiting) */}
          {isLaneVisible("tele_consultation") && (
            <div
              style={{
                background: "rgba(255, 255, 255, 0.75)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: "1px solid #e2e8f0",
                borderRadius: 20,
                boxShadow: "0 2px 14px rgba(0,0,0,0.02)",
              }}
              className="p-4 flex flex-col gap-3 min-h-[420px]"
            >
              {/* Lane Header */}
              <div className="flex items-center justify-between px-1 py-1 border-b border-slate-200/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200/80 shadow-2xs">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wide">
                      Tele-Consult (Waiting)
                    </h3>
                    <p className="text-[10px] text-slate-400">Virtual Room Ready</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-900 font-mono">
                  {laneTeleConsults.length}
                </span>
              </div>

              {/* Lane Cards */}
              <div className="space-y-3 flex-1">
                {laneTeleConsults.length > 0 ? (
                  laneTeleConsults.map((patient) => (
                    <PatientQueueCard
                      key={patient.id}
                      patient={patient}
                      prescription={prescriptionMap[patient.id]}
                      onStartConsultation={handleStartConsultation}
                      onStatusChange={handleStatusChange}
                    />
                  ))
                ) : (
                  <div className="h-48 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-4 text-slate-400">
                    <Video className="w-8 h-8 mb-2 opacity-30 text-purple-400" />
                    <p className="text-xs font-semibold text-slate-500">Virtual Room Idle</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">No video consults queued</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Lane 3: Sent for Labs (Drafts) */}
          {isLaneVisible("draft_labs") && (
            <div
              style={{
                background: "rgba(255, 255, 255, 0.75)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: "1px solid #e2e8f0",
                borderRadius: 20,
                boxShadow: "0 2px 14px rgba(0,0,0,0.02)",
              }}
              className="p-4 flex flex-col gap-3 min-h-[420px]"
            >
              {/* Lane Header */}
              <div className="flex items-center justify-between px-1 py-1 border-b border-slate-200/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs">
                    <FlaskConical className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wide">
                      Sent for Labs (Draft)
                    </h3>
                    <p className="text-[10px] text-slate-400">Awaiting Reports</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-900 font-mono">
                  {laneDraftLabs.length}
                </span>
              </div>

              {/* Lane Cards */}
              <div className="space-y-3 flex-1">
                {laneDraftLabs.length > 0 ? (
                  laneDraftLabs.map((patient) => (
                    <PatientQueueCard
                      key={patient.id}
                      patient={patient}
                      prescription={prescriptionMap[patient.id]}
                      onResumeDraft={handleResumeDraft}
                      onStatusChange={handleStatusChange}
                    />
                  ))
                ) : (
                  <div className="h-48 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-4 text-slate-400">
                    <FlaskConical className="w-8 h-8 mb-2 opacity-30 text-indigo-400" />
                    <p className="text-xs font-semibold text-slate-500">No lab drafts pending</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">All test reviews cleared</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Lane 4: Completed & Finalized */}
          {isLaneVisible("completed") && (
            <div
              style={{
                background: "rgba(255, 255, 255, 0.75)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: "1px solid #e2e8f0",
                borderRadius: 20,
                boxShadow: "0 2px 14px rgba(0,0,0,0.02)",
              }}
              className="p-4 flex flex-col gap-3 min-h-[420px]"
            >
              {/* Lane Header */}
              <div className="flex items-center justify-between px-1 py-1 border-b border-slate-200/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200/80 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wide">
                      Completed & Finalized
                    </h3>
                    <p className="text-[10px] text-slate-400">Rx Signed & Ready</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-800 font-mono">
                  {laneCompleted.length}
                </span>
              </div>

              {/* Lane Cards */}
              <div className="space-y-3 flex-1">
                {laneCompleted.length > 0 ? (
                  laneCompleted.map((patient) => (
                    <PatientQueueCard
                      key={patient.id}
                      patient={patient}
                      prescription={prescriptionMap[patient.id]}
                      onViewPrescription={(pt, rx) => {
                        setPreviewPatient(pt);
                        setPreviewPrescription(rx);
                      }}
                      onStatusChange={handleStatusChange}
                    />
                  ))
                ) : (
                  <div className="h-48 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-4 text-slate-400">
                    <CheckCircle2 className="w-8 h-8 mb-2 opacity-30 text-slate-400" />
                    <p className="text-xs font-semibold text-slate-500">No completed visits</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Signed encounters appear here</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Lane 5: No-Show / Cancelled */}
          {isLaneVisible("no_show") && (
            <div
              style={{
                background: "rgba(255, 255, 255, 0.75)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: "1px solid #fecdd3",
                borderRadius: 20,
                boxShadow: "0 2px 14px rgba(0,0,0,0.02)",
              }}
              className="p-4 flex flex-col gap-3 min-h-[420px]"
            >
              {/* Lane Header */}
              <div className="flex items-center justify-between px-1 py-1 border-b border-rose-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200/80 shadow-2xs">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-rose-900 uppercase tracking-wide">
                      No-Show / Cancelled
                    </h3>
                    <p className="text-[10px] text-rose-400">Did Not Report</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-900 font-mono">
                  {laneNoShow.length}
                </span>
              </div>

              {/* Lane Cards */}
              <div className="space-y-3 flex-1">
                {laneNoShow.length > 0 ? (
                  laneNoShow.map((patient) => (
                    <PatientQueueCard
                      key={patient.id}
                      patient={patient}
                      prescription={prescriptionMap[patient.id]}
                      onStatusChange={handleStatusChange}
                    />
                  ))
                ) : (
                  <div className="h-48 border-2 border-dashed border-rose-200/80 rounded-2xl flex flex-col items-center justify-center text-center p-4 text-slate-400">
                    <AlertTriangle className="w-8 h-8 mb-2 opacity-30 text-rose-400" />
                    <p className="text-xs font-semibold text-slate-500">Zero No-Shows</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">No cancelled records</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Dark Pill Toast Feedback (#0f172a) */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
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
            zIndex: 100,
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Quick Intake Registration Modal */}
      {isQuickIntakeOpen && (
        <QuickPatientIntakeModal
          isOpen={isQuickIntakeOpen}
          currentTotalPatients={patients.length}
          onClose={() => setIsQuickIntakeOpen(false)}
          onPatientAdded={(added) => {
            showToast(`Patient ${added.name} registered with token ${added.tokenNumber}`);
          }}
        />
      )}

      {/* Admin Config Modal */}
      {isAdminConfigOpen && (
        <AdminConfigModal
          isOpen={isAdminConfigOpen}
          adminConfigList={adminConfigList}
          onClose={() => setIsAdminConfigOpen(false)}
          onToggleField={async (sectionKey, field) => {
            const current = adminConfigList.find((s) => s.sectionKey === sectionKey);
            if (current) {
              await updateAdminConfig(sectionKey, { [field]: !current[field] });
              showToast(`Updated ${field} for ${sectionKey}`);
            }
          }}
        />
      )}

      {/* Prescription Preview Modal */}
      {previewPatient && (
        <PrescriptionPreviewModal
          isOpen={!!previewPatient}
          patient={previewPatient}
          prescription={previewPrescription || prescriptionMap[previewPatient.id] || {}}
          onClose={() => {
            setPreviewPatient(null);
            setPreviewPrescription(null);
          }}
        />
      )}
    </div>
  );
}
