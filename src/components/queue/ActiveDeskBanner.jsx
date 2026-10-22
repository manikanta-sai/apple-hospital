import React, { useState, useEffect } from "react";
import {
  Stethoscope,
  FlaskConical,
  CheckCircle2,
  Clock,
  AlertTriangle,
  HeartPulse,
  UserCheck,
  ShieldAlert,
  Baby,
  Activity,
  ArrowRight,
  Sparkles,
} from "lucide-react";

/**
 * Formats elapsed seconds into mm:ss
 */
function formatElapsed(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")} mins`;
}

/**
 * ActiveDeskBanner (Redesigned)
 * -----------------------------
 * Apple Multispecialty Hospital clinical glassmorphic spotlight banner
 * for the live on-going consultation desk (Room 104).
 */
export default function ActiveDeskBanner({
  patient = null,
  onResumeConsultation = () => {},
  onSendToLabs = () => {},
  onCompleteConsultation = () => {},
  onCallNext = () => {},
}) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Real-time ticking stopwatch
  useEffect(() => {
    if (!patient || !patient.consultationStartTime) {
      setElapsedSeconds(0);
      return;
    }

    const startTime = new Date(patient.consultationStartTime).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diffSec = Math.max(0, Math.floor((now - startTime) / 1000));
      setElapsedSeconds(diffSec);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [patient?.id, patient?.consultationStartTime]);

  if (!patient) {
    return (
      <div
        style={{
          background: "rgba(255, 255, 255, 0.88)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid #e2e8f0",
          borderRadius: 20,
          boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
        }}
        className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center font-bold">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <h3 className="text-sm font-bold text-slate-800">
                Doctor's Desk Idle • Room 104 Ready for Consultation
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              No patient is currently inside the consultation room. Call the next patient from the waiting queue.
            </p>
          </div>
        </div>

        <button
          onClick={onCallNext}
          className="px-4 py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-sky-500/20 transition-all self-stretch sm:self-auto justify-center"
        >
          <UserCheck className="w-4 h-4" />
          <span>Call Next Waiting Patient</span>
        </button>
      </div>
    );
  }

  const { vitals = {}, pregnancyDetails, allergies = [] } = patient;
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
        background: "rgba(255, 255, 255, 0.94)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: "1px solid #cbd5e1",
        borderRadius: 20,
        boxShadow: "0 6px 25px rgba(2, 132, 199, 0.06), 0 2px 8px rgba(0,0,0,0.03)",
      }}
      className="p-5 sm:p-6 relative overflow-hidden"
    >
      {/* Top clinical status accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-emerald-500 to-indigo-600" />

      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
        {/* Left: Patient Spotlight & Clinical Badges */}
        <div className="space-y-3 flex-1 min-w-0">
          {/* Status Header Bar */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Live Consultation in Progress</span>
            </span>

            {/* Stopwatch Timer */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-800">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              <span>⏱️ {formatElapsed(elapsedSeconds)}</span>
            </div>

            <span className="text-xs text-slate-500 font-medium">
              Consulting Desk: Room 104 • Dr. Rajesh Sharma
            </span>
          </div>

          {/* Patient Main Identity Line */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-3 py-1 bg-sky-100 text-sky-900 border border-sky-300 font-mono font-bold text-sm rounded-lg shadow-2xs">
              {patient.tokenNumber}
            </span>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {patient.name}
            </h2>

            <span className="text-xs sm:text-sm font-semibold text-slate-600">
              ({patient.age}y / {patient.gender}{patient.bloodGroup ? ` • ${patient.bloodGroup}` : ""})
            </span>

            <span className="text-xs font-mono text-slate-600 px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200">
              UHID: {patient.uhid}
            </span>
          </div>

          {/* Vitals & Clinical Risk Badges */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* Vitals summary */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium">
              <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
              <span>BP: <strong className={isHighBp ? "text-amber-700 font-bold" : "text-slate-900 font-bold"}>{vitals.bp || "--"}</strong></span>
              <span className="text-slate-300">|</span>
              <span>Pulse: <strong className="text-slate-900 font-bold">{vitals.pulse || "--"} bpm</strong></span>
              <span className="text-slate-300">|</span>
              <span>SpO2: <strong className="text-slate-900 font-bold">{vitals.spo2 || "--"}%</strong></span>
              {vitals.temp && (
                <>
                  <span className="text-slate-300">|</span>
                  <span>Temp: <strong className="text-slate-900 font-bold">{vitals.temp}°F</strong></span>
                </>
              )}
            </div>

            {/* Pregnancy Pill */}
            {patient.isPregnant && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 font-semibold shadow-2xs">
                <Baby className="w-3.5 h-3.5 text-purple-600" />
                <span>
                  🤰 {pregnancyDetails?.trimester || "2nd"} Trimester ({pregnancyDetails?.gestationalWeeks || 22}w)
                </span>
              </span>
            )}

            {/* Allergy Pills */}
            {allergies.length > 0 && allergies[0] !== "NKDA" ? (
              allergies.map((allergy, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 font-bold shadow-2xs"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  <span>⚠️ {allergy}</span>
                </span>
              ))
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600 border border-slate-200 text-[11px] font-medium">
                NKDA (No Known Allergies)
              </span>
            )}

            {/* High BP Warning */}
            {isHighBp && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 font-bold shadow-2xs">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>High BP Alert</span>
              </span>
            )}
          </div>

          {/* Chief Complaint Preview */}
          {patient.chiefComplaintSummary && (
            <p className="text-xs text-slate-700 bg-sky-50/60 p-2.5 rounded-xl border border-sky-100/80 italic">
              <strong className="text-sky-900 not-italic font-bold">Chief Complaint:</strong> "{patient.chiefComplaintSummary}"
            </p>
          )}
        </div>

        {/* Right: Explicit Action CTAs */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 xl:flex-col xl:items-stretch xl:justify-center">
          {/* Main Action: Resume Consultation Room */}
          <button
            onClick={() => onResumeConsultation(patient.id)}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-sky-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Resume Consultation Room</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Send to Lab Action */}
          <button
            onClick={() => onSendToLabs(patient.id)}
            className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            title="Mark prescription draft and order lab investigations"
          >
            <FlaskConical className="w-4 h-4 text-amber-700" />
            <span>Mark Draft - Send to Lab</span>
          </button>

          {/* Complete & Sign */}
          <button
            onClick={() => onCompleteConsultation(patient.id)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Complete & Sign</span>
          </button>
        </div>
      </div>
    </div>
  );
}
