import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  Video,
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
      id: "waiting_walkin",
      label: "Walk-in Waiting",
      value: counts.waitingWalkIn ?? counts.waiting ?? 0,
      subtext: "Lobby arrivals",
      icon: Users,
      color: "#d97706",
      bg: "#fef3c7",
      border: "border-amber-200/80",
    },
    {
      id: "waiting_tele",
      label: "Tele-Consult Waiting",
      value: counts.waitingTele ?? 0,
      subtext: "Virtual room queue",
      icon: Video,
      color: "#7e22ce",
      bg: "#f3e8ff",
      border: "border-purple-200/80",
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
          {/* Left: Hospital Title & OPD Header */}
          <div className="flex items-center gap-3.5">
            {onNavigateHome && (
              <button
                type="button"
                onClick={onNavigateHome}
                aria-label="Back to home"
                title="Back to home"
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
                  transition: "all 0.15s ease",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f8fafc";
                  e.currentTarget.style.borderColor = "#cbd5e1";
                  e.currentTarget.style.color = "#0f172a";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#ffffff";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.color = "#475569";
                }}
              >
                <ArrowLeft size={18} strokeWidth={2.2} />
              </button>
            )}
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

          {/* Right Controls: Duty Switcher, + Quick Walk-in, Utilities */}
          <div className="flex items-center gap-2.5 flex-wrap">
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
    </div>
  );
}
