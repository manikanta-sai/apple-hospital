import React, { useState, useRef, useEffect } from "react";
import {
  Stethoscope,
  Clock,
  Sparkles,
  BookOpen,
  Copy,
  ChevronDown,
  Check,
  Building2,
} from "lucide-react";
import { DOCTOR_STATUS_OPTIONS } from "./QueueKpiStats";

/**
 * OpdContextSidebar (Clean Clinical Workspace)
 * --------------------------------------------
 * Right Contextual Sidebar (35-40% width) for Apple Multispecialty Hospital.
 * Displays:
 * 1. Doctor Desk Live Status (Room 104, Dr. Rajesh Sharma, MD)
 *    - Interactive duty status switcher (ON DUTY, ON ROUNDS, IN SURGERY, OUT OF OFFICE, STANDBY)
 *    - Current room occupant
 *    - Daily OPD load capacity bar
 * 2. Clinical Pharmacopeia & Autocomplete Shortcuts (1-click click-to-copy)
 * (Live Activity Stream removed as per specification)
 */
export default function OpdContextSidebar({
  activePatient = null,
  allPatients = [],
  customDictionary = [],
  doctorStatus = "ON DUTY",
  onDoctorStatusChange = () => {},
  onCallPatient = () => {},
  onSendToLabs = () => {},
  onCompletePatient = () => {},
  onShowToast = () => {},
}) {
  const [showDutyDropdown, setShowDutyDropdown] = useState(false);
  const dutyDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dutyDropdownRef.current && !dutyDropdownRef.current.contains(event.target)) {
        setShowDutyDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopyShortcut = (shortcut, expansion) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(expansion);
      onShowToast(`Copied "${expansion}" (${shortcut}) to clipboard`);
    }
  };

  const currentDuty =
    DOCTOR_STATUS_OPTIONS.find((s) => s.id === doctorStatus) || DOCTOR_STATUS_OPTIONS[0];

  return (
    <div className="space-y-4">
      {/* 1. Doctor Desk Live Status Card */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.88)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid #e2e8f0",
          borderRadius: 20,
          boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
        }}
        className="p-5"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-sm font-bold text-slate-900">Dr. Rajesh Sharma, MD</h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-sky-100 text-sky-800">
                  NMC-48291
                </span>
              </div>
              <p className="text-xs text-slate-500">Apple Multispecialty • General Medicine (Room 104)</p>
            </div>
          </div>

          {/* Interactive Duty Switcher */}
          <div className="relative" ref={dutyDropdownRef}>
            <button
              onClick={() => setShowDutyDropdown(!showDutyDropdown)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "4px 10px",
                borderRadius: 999,
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.04em",
                background: currentDuty.bg,
                color: currentDuty.text,
                border: `1px solid ${currentDuty.border}`,
                cursor: "pointer",
              }}
              title="Change Duty Status"
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: currentDuty.dot,
                }}
                className={currentDuty.id === "ON DUTY" ? "animate-pulse" : ""}
              />
              <span>{currentDuty.label}</span>
              <ChevronDown size={11} className="opacity-70" />
            </button>

            {showDutyDropdown && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "100%",
                  marginTop: 6,
                  width: 200,
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 12,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  padding: "4px 0",
                  zIndex: 30,
                }}
              >
                <div
                  style={{
                    padding: "4px 10px",
                    fontSize: 9,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#94a3b8",
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  Doctor Duty Status
                </div>
                {DOCTOR_STATUS_OPTIONS.map((opt) => {
                  const isSelected = opt.id === doctorStatus;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        onDoctorStatusChange(opt.id);
                        setShowDutyDropdown(false);
                        onShowToast(`Doctor status set to ${opt.label}`);
                      }}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "6px 10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: isSelected ? "#f8fafc" : "transparent",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: opt.dot,
                          }}
                        />
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: isSelected ? "#0f172a" : "#334155",
                          }}
                        >
                          {opt.label}
                        </span>
                      </div>
                      {isSelected && <Check size={12} color="#0284c7" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Current Room Occupant */}
        <div className="mt-3.5 p-3 rounded-16 bg-slate-50/80 border border-slate-200/80">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-500 font-medium">Current Room Occupant</span>
            {activePatient ? (
              <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                Desk [{activePatient.tokenNumber?.replace("#", "")}]
              </span>
            ) : (
              <span className="text-slate-400">Desk Vacant</span>
            )}
          </div>

          {activePatient ? (
            <div>
              <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <span>Active: {activePatient.name}</span>
                <span className="text-xs font-normal text-slate-500">
                  ({activePatient.age}y / {activePatient.gender})
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-600 flex-wrap">
                <span>
                  Blood Pressure:{" "}
                  <strong className="text-slate-900">{activePatient.vitals?.bp || "--"}</strong>
                </span>
                <span>•</span>
                <span>
                  SpO2: <strong className="text-slate-900">{activePatient.vitals?.spo2 || "--"}%</strong>
                </span>
                <span>•</span>
                <span>
                  Pulse: <strong className="text-slate-900">{activePatient.vitals?.pulse || "--"} bpm</strong>
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic mt-0.5">
              Doctor desk is ready. Call the next patient from queue.
            </p>
          )}
        </div>

        {/* Desk Capacity / Load Bar */}
        <div className="mt-3.5 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>OPD Daily Load</span>
            <span className="font-semibold text-slate-700">6 / 25 Max Slots</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full w-[24%]" />
          </div>
        </div>
      </div>

      {/* 2. Clinical Dictionary Autocomplete Chips */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.88)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid #e2e8f0",
          borderRadius: 20,
          boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
        }}
        className="p-5"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm font-bold text-slate-900">Clinical Dictionary</h3>
          </div>
          <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
            1-Click Copy
          </span>
        </div>

        <p className="text-[11px] text-slate-500 mt-2">
          Click any frequent phrase to copy full clinical expansion into your clipboard.
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {customDictionary.slice(0, 10).map((dict) => (
            <button
              key={dict.id}
              onClick={() => handleCopyShortcut(dict.shortcut, dict.expansion)}
              className="group inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-900 border border-slate-200/80 hover:border-sky-300 transition-all cursor-pointer"
              title={`Click to copy: "${dict.expansion}"`}
            >
              <span className="font-mono font-bold text-[10px] text-sky-700 bg-sky-100/70 px-1 py-0.2 rounded">
                {dict.shortcut}
              </span>
              <span className="truncate max-w-[130px] text-[11px]">{dict.expansion}</span>
              <Copy className="w-3 h-3 text-slate-400 group-hover:text-sky-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
