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
} from "lucide-react";
import MandatoryProgressChecklist from "./MandatoryProgressChecklist.jsx";
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
  onBackToQueue = () => {},
  onSaveDraft = () => {},
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
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center gap-1.5 text-slate-700 transition-all shadow-2xs cursor-pointer text-xs font-bold"
            title="Return to OPD Queue"
          >
            <ArrowLeft size={16} />
            <span>Back to Queue</span>
          </button>

          {/* Token & Patient Name */}
          <div>
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

              {/* Consultation Type Badge */}
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-sky-50 text-sky-800 border border-sky-200 uppercase tracking-wider">
                {consultationType === "tele_consultation"
                  ? "Tele-Consult"
                  : consultationType === "online_booking"
                  ? "Online Booking"
                  : "Walk-in"}
              </span>

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

        {/* Center / Right: Vitals Strip & Timer */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Vitals Summary Pill */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/90 text-xs text-slate-700 flex-wrap">
            <HeartPulse size={14} className="text-rose-500 shrink-0" />
            <span className="text-[11px]">
              BP:{" "}
              <strong className={isHighBp ? "text-amber-800 font-bold" : "text-slate-900"}>
                {vitals.bp || "--"}
              </strong>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-[11px]">
              Pulse: <strong className="text-slate-900">{vitals.pulse || "--"} bpm</strong>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-[11px]">
              SpO2: <strong className="text-slate-900">{vitals.spo2 || "--"}%</strong>
            </span>
            {vitals.weight && (
              <>
                <span className="text-slate-300">|</span>
                <span className="text-[11px]">
                  Wt: <strong className="text-slate-900">{vitals.weight} kg</strong>
                </span>
              </>
            )}
            {vitals.bmi && (
              <>
                <span className="text-slate-300">|</span>
                <span className="text-[11px]">
                  BMI: <strong className="text-slate-900">{vitals.bmi}</strong>
                </span>
              </>
            )}
          </div>

          {/* Consultation Elapsed Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold font-mono shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <Clock size={13} className="text-emerald-700" />
            <span>⏱️ {formatTimer(elapsedSeconds)}</span>
          </div>

          {/* NABH Mandatory Progress Bar & Dropdown Checklist */}
          <MandatoryProgressChecklist
            patient={patient}
            rxForm={rxForm}
            onJumpToSection={onJumpToSection}
          />

          {/* Save Draft Action Button */}
          <button
            onClick={onSaveDraft}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer disabled:opacity-50"
            title="Save draft changes to database (Ctrl+S)"
          >
            <Save size={13} className={isSaving ? "animate-spin text-teal-600" : "text-slate-500"} />
            <span>{isSaving ? "Autosaving..." : "Save Draft"}</span>
          </button>

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
