import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  Clock,
  Stethoscope,
  FlaskConical,
  CheckCircle2,
  Building2,
  Calendar,
  Sparkles,
  ArrowLeft,
  Volume2,
  VolumeX,
  RotateCcw,
  Settings,
  ChevronDown,
  Check,
  UserPlus,
} from "lucide-react";

/**
 * Doctor duty status options matching real hospital operations:
 * ON DUTY, ON ROUNDS, IN SURGERY, OUT OF OFFICE, STANDBY
 */
export const DOCTOR_STATUS_OPTIONS = [
  { id: "ON DUTY", label: "ON DUTY", dot: "#22c55e", bg: "#dcfce7", text: "#15803d", border: "#bbf7d0", hint: "Available in Room 104" },
  { id: "ON ROUNDS", label: "ON ROUNDS", dot: "#0284c7", bg: "#e0f2fe", text: "#0369a1", border: "#bae6fd", hint: "Inpatient Ward Rounds" },
  { id: "IN SURGERY", label: "IN SURGERY", dot: "#a855f7", bg: "#f3e8ff", text: "#7e22ce", border: "#e9d5ff", hint: "Operating Theater" },
  { id: "OUT OF OFFICE", label: "OUT OF OFFICE", dot: "#94a3b8", bg: "#f1f5f9", text: "#475569", border: "#cbd5e1", hint: "Off Desk" },
  { id: "STANDBY", label: "STANDBY", dot: "#f59e0b", bg: "#fef3c7", text: "#b45309", border: "#fde68a", hint: "On Call / Triage Reserve" },
];

/**
 * Play a gentle hospital announcement chime via Web Audio API
 */
function playAnnouncementChime() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  try {
    const ctx = new AudioContextClass();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const t0 = ctx.currentTime;
    [659.25, 880].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = t0 + idx * 0.16;
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.14, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.46);
    });
    setTimeout(() => ctx.close(), 700);
  } catch {}
}

/**
 * QueueKpiStats
 * -------------
 * Full-width, non-sticky Top Bar matching /tokens route.
 * Features:
 * - Single hospital branding in eyebrow, clean h1 "OPD Queue & Triage Desk"
 * - Prominent "+ Quick Walk-in Patient" intake button
 * - Duty switcher (ON DUTY, ON ROUNDS, IN SURGERY, OUT OF OFFICE, STANDBY)
 * - Non-clickable clean informational metric cards
 */
export default function QueueKpiStats({
  counts = { total: 0, waiting: 0, inConsultation: 0, draftLabs: 0, completed: 0 },
  activeFilter = "all",
  doctorStatus = "ON DUTY",
  onDoctorStatusChange = () => {},
  onOpenQuickIntake = () => {},
  onResetDemoData = () => {},
  onOpenAdminConfig = () => {},
  onNavigateHome = () => {},
  isResetting = false,
  onShowToast = () => {},
}) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showDutyMenu, setShowDutyMenu] = useState(false);
  const dutyMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dutyMenuRef.current && !dutyMenuRef.current.contains(event.target)) {
        setShowDutyMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) playAnnouncementChime();
    onShowToast(next ? "Audio chime unmuted" : "Audio chime muted");
  };

  const currentDuty =
    DOCTOR_STATUS_OPTIONS.find((s) => s.id === doctorStatus) || DOCTOR_STATUS_OPTIONS[0];

  const kpis = [
    {
      id: "all",
      label: "Total Today",
      value: counts.total,
      subtext: "Registered OPD",
      icon: Users,
      color: "#0284c7",
      bg: "#e0f2fe",
      border: "border-sky-200/80",
    },
    {
      id: "waiting",
      label: "In Waiting",
      value: counts.waiting,
      subtext: "Queued for doctor",
      icon: Clock,
      color: "#d97706",
      bg: "#fef3c7",
      border: "border-amber-200/80",
    },
    {
      id: "in_consultation",
      label: "Active Desk",
      value: counts.inConsultation,
      subtext: counts.inConsultation > 0 ? "1 Inside Room" : "Desk Idle",
      icon: Stethoscope,
      color: "#16a34a",
      bg: "#dcfce7",
      border: "border-emerald-200/80",
      isLive: true,
    },
    {
      id: "draft_labs",
      label: "At Lab (Drafts)",
      value: counts.draftLabs,
      subtext: "Awaiting test reports",
      icon: FlaskConical,
      color: "#6366f1",
      bg: "#ede9fe",
      border: "border-indigo-200/80",
    },
    {
      id: "completed",
      label: "Finished Visits",
      value: counts.completed,
      subtext: "Signed & printed",
      icon: CheckCircle2,
      color: "#0f172a",
      bg: "#f1f5f9",
      border: "border-slate-200/80",
    },
  ];

  return (
    <div className="space-y-4">
      {/* 1. TOP HEADER (Full Width, Edge-to-Edge, Not Sticky) */}
      <header
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(226, 232, 240, 0.9)",
          position: "relative",
          zIndex: 30,
          boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
        }}
        className="w-full"
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between flex-wrap gap-3.5">
          {/* Left: Back button & Hospital Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
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
              title="Return to Dashboard"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: "#0284c7",
                  }}
                >
                  Apple Multispecialty Hospital
                </span>
                <span
                  style={{
                    fontSize: 11,
                    background: "#e0f2fe",
                    color: "#0369a1",
                    padding: "1px 8px",
                    borderRadius: 999,
                    fontWeight: 700,
                  }}
                >
                  Dept: General Medicine • Room 104
                </span>
              </div>
              <h1
                style={{
                  margin: "1px 0 0 0",
                  fontSize: 19,
                  fontWeight: 800,
                  color: "#0f172a",
                  letterSpacing: "-0.02em",
                }}
              >
                OPD Queue & Triage Desk
              </h1>
              <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                <span>Doctor on Duty:</span>
                <strong className="text-slate-800 font-semibold">Dr. Rajesh Sharma, MD</strong>
                <span className="font-mono text-slate-400 text-[11px]">(NMC-48291)</span>
              </div>
            </div>
          </div>

          {/* Right Controls: Live status, Duty Switcher, + Quick Walk-in, Utilities */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Live Queue Active Pill */}
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
              <span style={{ fontSize: 12, fontWeight: 700, color: "#166534" }}>
                Live Queue Active
              </span>
              <span style={{ fontSize: 12, color: "#15803d", fontWeight: 500 }}>
                · {counts.waiting} queued on floor
              </span>
            </div>

            {/* Doctor Duty Status Dropdown (ON DUTY, round, surgery, out, stand by) */}
            <div className="relative" ref={dutyMenuRef}>
              <button
                onClick={() => setShowDutyMenu(!showDutyMenu)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  borderRadius: 999,
                  background: currentDuty.bg,
                  border: `1px solid ${currentDuty.border}`,
                  color: currentDuty.text,
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.03em",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                title="Change Doctor Duty Status"
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: currentDuty.dot,
                    display: "inline-block",
                  }}
                  className={currentDuty.id === "ON DUTY" ? "animate-pulse" : ""}
                />
                <span>{currentDuty.label}</span>
                <ChevronDown size={13} className="opacity-70" />
              </button>

              {showDutyMenu && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "100%",
                    marginTop: 6,
                    width: 220,
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 14,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                    padding: "6px 0",
                    zIndex: 50,
                  }}
                >
                  <div
                    style={{
                      padding: "6px 12px 4px",
                      fontSize: 10,
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "#94a3b8",
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >
                    Set Doctor Duty Status
                  </div>
                  {DOCTOR_STATUS_OPTIONS.map((opt) => {
                    const isSelected = opt.id === doctorStatus;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => {
                          onDoctorStatusChange(opt.id);
                          setShowDutyMenu(false);
                          onShowToast(`Doctor duty status set to ${opt.label}`);
                        }}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "8px 12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          background: isSelected ? "#f8fafc" : "transparent",
                          border: "none",
                          cursor: "pointer",
                          transition: "background 0.1s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = isSelected ? "#f8fafc" : "transparent")
                        }
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: opt.dot,
                              display: "inline-block",
                            }}
                          />
                          <div>
                            <div
                              style={{
                                fontSize: 12,
                                fontWeight: 700,
                                color: isSelected ? "#0f172a" : "#334155",
                              }}
                            >
                              {opt.label}
                            </div>
                            <div style={{ fontSize: 10, color: "#64748b" }}>{opt.hint}</div>
                          </div>
                        </div>
                        {isSelected && <Check size={14} color="#0284c7" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Walk-in Patient Intake Button */}
            <button
              onClick={onOpenQuickIntake}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-xs shadow-sm shadow-sky-500/20 transition-all cursor-pointer"
            >
              <UserPlus size={15} />
              <span>+ Quick Walk-in Intake</span>
            </button>

            {/* Sound notification toggle */}
            <button
              onClick={handleToggleSound}
              title={soundEnabled ? "Audio chime enabled" : "Audio muted"}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 11px",
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                background: soundEnabled ? "#ffffff" : "#f1f5f9",
                color: soundEnabled ? "#0284c7" : "#64748b",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            </button>

            {/* Reset Demo Data Button */}
            <button
              onClick={onResetDemoData}
              disabled={isResetting}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
              title="Reset to realistic demo queue cases"
            >
              <RotateCcw
                className={`w-3.5 h-3.5 text-slate-500 ${isResetting ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>

            {/* Admin Config Button */}
            <button
              onClick={onOpenAdminConfig}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              title="Prescription validation and section toggles"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span>Admin Config</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Top 5 KPI Metric Cards (Non-clickable clean informational cards) */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;

            return (
              <div
                key={kpi.id}
                style={{
                  background: "rgba(255, 255, 255, 0.90)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.02)",
                  cursor: "default",
                }}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between ${kpi.border} text-slate-900 select-none`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <span className="text-xs font-semibold text-slate-600">
                    {kpi.label}
                  </span>
                  <div
                    style={{
                      backgroundColor: kpi.bg,
                      color: kpi.color,
                    }}
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs"
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-2xl font-black tracking-tight text-slate-900">
                    {kpi.value}
                  </span>

                  {kpi.isLive && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      LIVE
                    </span>
                  )}
                </div>

                <div className="text-[11px] mt-1 truncate text-slate-500">
                  {kpi.subtext}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
