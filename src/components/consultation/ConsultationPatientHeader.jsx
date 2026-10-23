import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Clock,
  HeartPulse,
  Baby,
  ShieldAlert,
  Accessibility,
  Stethoscope,
  User,
  Save,
  CheckCircle2,
  Calendar,
  Lock,
  Settings,
  Video,
} from "lucide-react";
import AdminConfigModal from "../queue/AdminConfigModal.jsx";
import { useHospitalData } from "../../hooks/useHospitalData.js";

/**
 * Formats seconds into mm:ss
 */
function formatTimer(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * ConsultationPatientHeader
 * -------------------------
 * Active Patient banner for the Doctor's Consultation Workspace:
 * - Patient Demographics & Token
 * - Real-time ticking consultation timer
 * - Vital signs strip (BP, Pulse, SpO2, Temp, Weight, Height, BMI)
 * - Clinical risk flags (Pregnancy trimester, Allergies, Mobility)
 * - Dynamic NABH Mandatory Progress Checklist
 * - Doctor details & Back to Queue action
 */
export default function ConsultationPatientHeader({
  patient,
  rxForm = {},
  prescriptionStatus = "draft",
  leftPanelStep = "prescription",
  setLeftPanelStep = () => {},
  onBackToQueue = () => {},
  onSaveDraft = () => {},
  onFinalize,
  isMandatoryComplete = false,
  showVideoDock = false,
  onToggleVideoDock = () => {},
  onJumpToSection = () => {},
  isSaving = false,
}) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const { adminConfigList = [], toggleAdminConfig } = useHospitalData();

  useEffect(() => {
    if (!patient) return;
    const startTimestamp = patient.consultationStartTime
      ? new Date(patient.consultationStartTime).getTime()
      : Date.now() - 5 * 60 * 1000;

    const timer = setInterval(() => {
      const diff = Math.max(0, Math.floor((Date.now() - startTimestamp) / 1000));
      setElapsedSeconds(diff);
    }, 1000);

    return () => clearInterval(timer);
  }, [patient?.id, patient?.consultationStartTime]);

  if (!patient) {
    return (
      <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
        <button
          onClick={onBackToQueue}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          <span>Back to OPD Queue</span>
        </button>
        <span className="text-xs text-slate-400">No active patient in consultation</span>
      </div>
    );
  }

  const {
    name,
    age,
    gender,
    uhid,
    tokenNumber,
    isPregnant,
    pregnancyDetails,
    allergies = [],
    isHandicapped,
    vitals = {},
    consultationType,
  } = patient;

  const isHighBp =
    vitals.bp &&
    (() => {
      const parts = vitals.bp.split("/");
      const sys = parseInt(parts[0], 10);
      const dia = parseInt(parts[1], 10);
      return sys >= 140 || dia >= 90;
    })();

  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid #e2e8f0",
      }}
      className="px-4 sm:px-6 py-3.5 shadow-2xs"
    >
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
        {/* Left: Back button + Patient Demographics */}
        <div className="flex items-center gap-3.5 flex-wrap">
          <button
            onClick={onBackToQueue}
            aria-label="Back to Queue"
            className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-all shadow-2xs cursor-pointer shrink-0"
            title="Return to OPD Queue"
          >
            <ArrowLeft size={18} />
          </button>

          {/* Token & Patient Name */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.14em", color: "#0284c7" }}>
                ABCD Multispecialty Hospital
              </span>
              <span style={{ fontSize: 10, background: "#e0f2fe", color: "#0369a1", padding: "1px 7px", borderRadius: 999, fontWeight: 700 }}>
                OPD Consultation & AI Rx Desk
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-lg font-mono font-bold text-xs bg-slate-900 text-white shadow-2xs">
                {tokenNumber}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {name}
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                ({age}y / {gender})
              </span>
              <span className="font-mono text-xs text-slate-400 font-semibold">
                UHID: {uhid}
              </span>

              {/* Consultation Type Badge / Video Dock Toggle */}
              {consultationType === "tele_consultation" || tokenNumber?.startsWith("TC") ? (
                <button
                  type="button"
                  onClick={() => onToggleVideoDock(!showVideoDock)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer shadow-2xs ${
                    showVideoDock
                      ? "bg-teal-900 text-teal-100 border-teal-700"
                      : "bg-teal-50 hover:bg-teal-100 text-teal-800 border-teal-300"
                  }`}
                  title="Toggle Draggable Video Window"
                >
                  <Video size={12} className={showVideoDock ? "text-teal-400 animate-pulse" : "text-teal-600"} />
                  <span>{showVideoDock ? "● Video Live" : "Open Video"}</span>
                </button>
              ) : (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-sky-50 text-sky-800 border border-sky-200 uppercase tracking-wider">
                  {consultationType === "online_booking" ? "Online Booking" : "Walk-in"}
                </span>
              )}

              {/* Rx Status */}
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  prescriptionStatus === "finalized"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : prescriptionStatus === "awaiting_labs"
                    ? "bg-indigo-50 text-indigo-800 border-indigo-200"
                    : "bg-amber-50 text-amber-800 border-amber-200"
                }`}
              >
                {prescriptionStatus === "finalized"
                  ? "Signed Rx"
                  : prescriptionStatus === "awaiting_labs"
                  ? "Awaiting Labs"
                  : "Draft in Progress"}
              </span>
            </div>

            {/* Clinical Risk Badges */}
            <div className="flex items-center gap-2 mt-1 flex-wrap text-xs">
              {isPregnant && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-pink-50 text-pink-700 border border-pink-200">
                  <Baby size={12} />
                  <span>
                    Pregnant ({pregnancyDetails?.trimester || "2nd"} Tri · {pregnancyDetails?.gestationalWeeks || 22}w)
                  </span>
                </span>
              )}

              {allergies && allergies.length > 0 && !allergies.includes("NKDA") && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  <ShieldAlert size={12} />
                  <span>Allergy: {allergies.join(", ")}</span>
                </span>
              )}

              {isHandicapped && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                  <Accessibility size={12} />
                  <span>Mobility Assisted</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center: Clean 3-Step Consultation Switcher matching user mockup design */}
        <div className="inline-flex items-center p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 text-xs shadow-2xs self-center gap-1">
          <button
            type="button"
            onClick={() => setLeftPanelStep("prescription")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer select-none ${
              leftPanelStep === "prescription"
                ? "bg-white text-slate-800 shadow-xs border border-slate-200/70"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                leftPanelStep === "prescription" ? "bg-teal-600" : "bg-slate-300"
              }`}
            />
            <span>1 Prescription</span>
          </button>

          {/* AI Copilot step hidden for now per user request */}
          {/* <button
            type="button"
            onClick={() => setLeftPanelStep("copilot")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer select-none ${
              leftPanelStep === "copilot"
                ? "bg-white text-slate-800 shadow-xs border border-slate-200/70"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                leftPanelStep === "copilot" ? "bg-teal-600" : "bg-slate-300"
              }`}
            />
            <span>2 AI Copilot</span>
          </button> */}

          <button
            type="button"
            onClick={() => setLeftPanelStep("preview")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer select-none ${
              leftPanelStep === "preview"
                ? "bg-white text-slate-800 shadow-xs border border-slate-200/70"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                leftPanelStep === "preview" ? "bg-teal-600" : "bg-slate-300"
              }`}
            />
            <span>2 Print Preview</span>
          </button>
        </div>

        {/* Right: Save Draft & Finalize Rx (Timer removed per user request) */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Save Draft Action Button */}
          <button
            onClick={onSaveDraft}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer disabled:opacity-50"
            title="Save draft changes across all sections to database (Ctrl+S)"
          >
            <Save size={13} className={isSaving ? "animate-spin text-teal-600" : "text-slate-500"} />
            <span>{isSaving ? "Autosaving..." : "Save Draft"}</span>
          </button>

          {/* Finalize Full Prescription Button - Only shown after required fields entered */}
          {onFinalize && isMandatoryComplete && (
            <button
              onClick={onFinalize}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer disabled:opacity-50 animate-fade-in"
              title="Finalize, digitally sign & complete full OPD prescription"
            >
              <CheckCircle2 size={13} />
              <span>Finalize Rx</span>
            </button>
          )}

          {/* Admin Template Configurator Trigger */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
            title="Configure Mandatory Rules & Specialty Presets"
          >
            <Settings size={15} />
          </button>
        </div>
      </div>

      {/* Admin Config Modal */}
      {isAdminOpen && (
        <AdminConfigModal
          isOpen={isAdminOpen}
          adminConfigList={adminConfigList}
          onClose={() => setIsAdminOpen(false)}
          onToggleField={toggleAdminConfig}
        />
      )}
    </div>
  );
}
