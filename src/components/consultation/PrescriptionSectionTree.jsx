import React, { useState } from "react";
import {
  FileText,
  HeartPulse,
  ShieldAlert,
  Activity,
  Stethoscope,
  Pill,
  FlaskConical,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  FolderTree,
  ShieldCheck,
  Lock,
  Unlock,
  PanelLeftClose,
  PanelLeftOpen,
  Filter,
  Sparkles,
  Utensils,
  Building2,
} from "lucide-react";
import { useHospitalData } from "../../hooks/useHospitalData.js";

/**
 * PrescriptionSectionTree
 * -----------------------
 * Left Overview Toggle Panel for Outpatient Consultation:
 * 1. Merged NABH Accreditation Quality Checklist & Progress Bar
 * 2. Real-time Scrollspy & Anchor Navigation
 * 3. Color-coded clinical section tree nodes
 * 4. Collapsible/Expandable Left Overview drawer
 */
export default function PrescriptionSectionTree({
  rxForm = {},
  patient = {},
  activeSection = "sec-complaints",
  onSelectSection = () => {},
  isOpen = true,
  onToggleOpen = () => {},
}) {
  const { adminConfig = {} } = useHospitalData();

  // Live Counts & Validation logic
  const complaintsCount = (rxForm.chiefComplaints || []).length;
  const vitalsText = rxForm.vitals?.bp ? `${rxForm.vitals.bp}` : patient?.vitals?.bp || null;
  const rawAllergies = rxForm.allergies || patient?.allergies || [];
  const allergiesCount = Array.isArray(rawAllergies) ? rawAllergies.length : 1;
  const isNkda =
    Array.isArray(rawAllergies) &&
    (rawAllergies.length === 0 ||
      rawAllergies.some(
        (a) =>
          (typeof a === "string" ? a : a.name || "")
            .toLowerCase()
            .includes("nkda") ||
          (typeof a === "string" ? a : a.name || "").toLowerCase() === "none"
      ));

  const hasObservations = !!(rxForm.clinicalObservations || "").trim();
  const diagnosisText = rxForm.diagnosis?.final || rxForm.diagnosis?.provisional || null;
  const medsCount = (rxForm.medications || []).length;
  const labsCount = (rxForm.investigationsOrdered || []).length;
  const followUpText = rxForm.followUp?.timeline || null;

  // Complete 8 Clinical Sections with NABH Mandatory definitions & theme colors
  const allNodes = [
    {
      id: "sec-complaints",
      title: "Chief Complaints",
      shortTitle: "Complaints",
      icon: FileText,
      isMandatory: adminConfig.chief_complaints?.isMandatory ?? true,
      isComplete: complaintsCount > 0,
      badge: complaintsCount > 0 ? `${complaintsCount} recorded` : "Required",
      detail: complaintsCount > 0 ? `${complaintsCount} symptom(s) logged` : "At least 1 complaint with duration",
      color: "teal",
      bgClass: "bg-teal-50 text-teal-800 border-teal-200",
      activeClass: "bg-teal-600 text-white shadow-teal-500/20",
      accentBorder: "border-teal-500",
      iconColor: "text-teal-600",
    },
    {
      id: "sec-vitals",
      title: "Vitals Monitoring",
      shortTitle: "Vitals",
      icon: HeartPulse,
      isMandatory: adminConfig.vitals?.isMandatory ?? true,
      isComplete: !!vitalsText,
      badge: vitalsText ? `BP ${vitalsText}` : "Required",
      detail: vitalsText ? `BP ${vitalsText}, HR ${rxForm.vitals?.pulse || "--"}` : "Blood pressure & pulse required",
      color: "rose",
      bgClass: "bg-rose-50 text-rose-800 border-rose-200",
      activeClass: "bg-rose-600 text-white shadow-rose-500/20",
      accentBorder: "border-rose-500",
      iconColor: "text-rose-600",
    },
    {
      id: "sec-allergies",
      title: "Allergies & ADR",
      shortTitle: "Allergies",
      icon: ShieldAlert,
      isMandatory: adminConfig.allergies?.isMandatory ?? true,
      isComplete: allergiesCount > 0,
      badge: isNkda ? "NKDA Confirmed" : `${allergiesCount} recorded`,
      detail: isNkda ? "No known drug allergies" : `${allergiesCount} ADR allergen(s) on file`,
      color: "amber",
      bgClass: "bg-amber-50 text-amber-800 border-amber-200",
      activeClass: "bg-amber-600 text-white shadow-amber-500/20",
      accentBorder: "border-amber-500",
      iconColor: "text-amber-600",
    },
    {
      id: "sec-observations",
      title: "Clinical Examination",
      shortTitle: "Observations",
      icon: Activity,
      isMandatory: adminConfig.clinical_observations?.isMandatory ?? false,
      isComplete: hasObservations,
      badge: hasObservations ? "Documented" : "Optional",
      detail: hasObservations ? "Clinical notes documented" : "General & systemic examination",
      color: "sky",
      bgClass: "bg-sky-50 text-sky-800 border-sky-200",
      activeClass: "bg-sky-600 text-white shadow-sky-500/20",
      accentBorder: "border-sky-500",
      iconColor: "text-sky-600",
    },
    {
      id: "sec-diagnosis",
      title: "Diagnosis (ICD-10)",
      shortTitle: "Diagnosis",
      icon: Stethoscope,
      isMandatory: adminConfig.diagnosis?.isMandatory ?? true,
      isComplete: !!diagnosisText,
      badge: diagnosisText ? diagnosisText.slice(0, 16) + (diagnosisText.length > 16 ? "..." : "") : "Required",
      detail: diagnosisText || "Provisional/Final diagnosis name",
      color: "purple",
      bgClass: "bg-purple-50 text-purple-800 border-purple-200",
      activeClass: "bg-purple-600 text-white shadow-purple-500/20",
      accentBorder: "border-purple-500",
      iconColor: "text-purple-600",
    },
    {
      id: "sec-medications",
      title: "Medications Prescribed (℞)",
      shortTitle: "Medications",
      icon: Pill,
      isMandatory: adminConfig.medications?.isMandatory ?? true,
      isComplete: medsCount > 0,
      badge: medsCount > 0 ? `${medsCount} prescribed` : "Required",
      detail: medsCount > 0 ? `${medsCount} pharmacopeia items` : "At least 1 medication required",
      color: "emerald",
      bgClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
      activeClass: "bg-emerald-600 text-white shadow-emerald-500/20",
      accentBorder: "border-emerald-500",
      iconColor: "text-emerald-600",
    },
    {
      id: "sec-investigations",
      title: "Lab & Diagnostics",
      shortTitle: "Labs",
      icon: FlaskConical,
      isMandatory: adminConfig.investigations?.isMandatory ?? false,
      isComplete: labsCount > 0,
      badge: labsCount > 0 ? `${labsCount} ordered` : "Optional",
      detail: labsCount > 0 ? `${labsCount} test(s) in requisition` : "Blood, radiology, and diagnostics",
      color: "indigo",
      bgClass: "bg-indigo-50 text-indigo-800 border-indigo-200",
      activeClass: "bg-indigo-600 text-white shadow-indigo-500/20",
      accentBorder: "border-indigo-500",
      iconColor: "text-indigo-600",
    },
    {
      id: "sec-dietary",
      title: "Dietary & Lifestyle Advice",
      shortTitle: "Dietary Advice",
      icon: Utensils,
      isMandatory: adminConfig.dietary_advice?.isMandatory ?? false,
      isComplete: !!(rxForm.dietaryAdvice || "").trim(),
      badge: (rxForm.dietaryAdvice || "").trim() ? "Documented" : "Optional",
      detail: (rxForm.dietaryAdvice || "").trim() ? "Diet guidelines recorded" : "Diet and hydration advice",
      color: "amber",
      bgClass: "bg-amber-50 text-amber-800 border-amber-200",
      activeClass: "bg-amber-600 text-white shadow-amber-500/20",
      accentBorder: "border-amber-500",
      iconColor: "text-amber-600",
    },
    {
      id: "sec-followup",
      title: "Follow-Up & Review Plan",
      shortTitle: "Follow-Up",
      icon: Calendar,
      isMandatory: adminConfig.follow_up?.isMandatory ?? true,
      isComplete: !!followUpText,
      badge: followUpText ? `Review ${followUpText}` : "Required",
      detail: followUpText ? `Follow-up in ${followUpText}` : "Follow-up schedule required",
      color: "fuchsia",
      bgClass: "bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200",
      activeClass: "bg-fuchsia-600 text-white shadow-fuchsia-500/20",
      accentBorder: "border-fuchsia-500",
      iconColor: "text-fuchsia-600",
    },
    {
      id: "sec-referrals",
      title: "Referrals & Hospital IPD",
      shortTitle: "Referral / IPD",
      icon: Building2,
      isMandatory: false,
      isComplete: !!(rxForm.referrals?.department || rxForm.isAdmitRecommended),
      badge: rxForm.isAdmitRecommended ? "IPD Recommended" : rxForm.referrals?.department ? rxForm.referrals.department : "None",
      detail: rxForm.isAdmitRecommended ? "IPD admission recommended" : rxForm.referrals?.department ? `Referred to ${rxForm.referrals.department}` : "Cross-consultation / admission",
      color: "blue",
      bgClass: "bg-blue-50 text-blue-800 border-blue-200",
      activeClass: "bg-blue-600 text-white shadow-blue-500/20",
      accentBorder: "border-blue-500",
      iconColor: "text-blue-600",
    },
  ];

  // NABH Compliance Calculations
  const mandatoryNodes = allNodes.filter((n) => n.isMandatory);
  const completedMandatoryCount = mandatoryNodes.filter((n) => n.isComplete).length;
  const nabhPercentage = Math.round(
    (completedMandatoryCount / Math.max(1, mandatoryNodes.length)) * 100
  );
  const isNabhCompliant = completedMandatoryCount === mandatoryNodes.length;

  const visibleNodes = allNodes;

  // If collapsed into slim rail
  if (!isOpen) {
    return (
      <div className="w-14 shrink-0 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl flex flex-col items-center py-3 gap-3 select-none transition-all duration-300 print:hidden z-20 shadow-sm max-h-[calc(100vh-2rem)] overflow-y-auto">
        <button
          type="button"
          onClick={onToggleOpen}
          className="w-10 h-10 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
          title="Expand Prescription Overview & NABH Checklist"
        >
          <PanelLeftOpen size={18} />
        </button>

        {/* Vertical status indicator */}
        <div
          onClick={onToggleOpen}
          className="flex-1 flex flex-col items-center gap-2 cursor-pointer pt-2 group"
          title={`NABH Progress: ${nabhPercentage}% - Click to open`}
        >
          <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-teal-50 flex items-center justify-center text-[10px] font-bold font-mono text-slate-700">
            {completedMandatoryCount}/{mandatoryNodes.length}
          </div>

          <div className="w-2.5 flex-1 bg-slate-100 rounded-full overflow-hidden p-0.5 my-1">
            <div
              className={`w-full rounded-full transition-all duration-500 ${
                isNabhCompliant ? "bg-emerald-500" : "bg-teal-500"
              }`}
              style={{ height: `${nabhPercentage}%` }}
            />
          </div>

          {/* Quick Node Icon Rail with Scrollspy indicators */}
          <div className="flex flex-col gap-1.5 pb-2">
            {allNodes.map((n) => {
              const Icon = n.icon;
              const isActive = activeSection === n.id;
              return (
                <button
                  key={n.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSection(n.id);
                  }}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                    isActive
                      ? `${n.activeClass} ring-2 ring-offset-1 ring-slate-400`
                      : n.isComplete
                      ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      : "bg-amber-50 hover:bg-amber-100 text-amber-700"
                  }`}
                  title={`${n.title} (${n.isComplete ? "Completed" : "Pending"})`}
                >
                  <Icon size={14} />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Expanded Left Overview Panel
  return (
    <aside className="w-72 sm:w-80 shrink-0 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl flex flex-col max-h-[calc(100vh-2rem)] select-none transition-all duration-300 print:hidden z-20 shadow-sm overflow-hidden">
      {/* STICKY TOP: Panel Header & Merged NABH Quality Checklist */}
      <div className="shrink-0 bg-white/95 backdrop-blur-md shadow-2xs border-b border-slate-200">
        {/* 1. Panel Header & Collapse Toggle */}
        <div className="p-2.5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-2xs">
              <FolderTree size={14} />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900 leading-none">
                Prescription Overview
              </h4>
              <p className="text-[9px] text-slate-500 mt-0.5">
                Live Scrollspy & Navigation
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleOpen}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer"
            title="Collapse Overview Panel"
          >
            <PanelLeftClose size={15} />
          </button>
        </div>

        {/* 2. COMPACT NABH QUALITY CHECKLIST */}
        <div className="px-3 py-2 bg-gradient-to-r from-teal-50/90 via-emerald-50/60 to-slate-50 border-b border-teal-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <ShieldCheck size={16} className={isNabhCompliant ? "text-emerald-600 shrink-0" : "text-teal-700 shrink-0"} />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800 leading-none">NABH Checklist</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                    isNabhCompliant
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : "bg-teal-100 text-teal-900 border border-teal-200"
                  }`}
                >
                  {completedMandatoryCount}/{mandatoryNodes.length} ({nabhPercentage}%)
                </span>
              </div>
              <div className="w-24 bg-slate-200 rounded-full h-1.5 mt-1 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isNabhCompliant ? "bg-emerald-500" : "bg-teal-600"
                  }`}
                  style={{ width: `${nabhPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Compact Status Lock/Unlock Badge */}
          <div
            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 shrink-0 ${
              isNabhCompliant
                ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                : "bg-amber-100 text-amber-900 border border-amber-300"
            }`}
            title={
              isNabhCompliant
                ? "All mandatory NABH criteria completed"
                : `${mandatoryNodes.length - completedMandatoryCount} mandatory field(s) pending`
            }
          >
            {isNabhCompliant ? (
              <Unlock size={11} className="text-emerald-700" />
            ) : (
              <Lock size={11} className="text-amber-700" />
            )}
            <span>{isNabhCompliant ? "Ready" : `${mandatoryNodes.length - completedMandatoryCount} Req`}</span>
          </div>
        </div>
      </div>

      {/* 3. SCROLLSPY & ANCHOR NAVIGATION TREE LIST */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
        <div className="px-1 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Sections ({visibleNodes.length})</span>
          <span className="text-[9px] text-slate-400 font-normal">Click to jump</span>
        </div>

        {visibleNodes.map((node, index) => {
          const isActive = activeSection === node.id;
          const Icon = node.icon;

          return (
            <div
              key={node.id}
              onClick={() => onSelectSection(node.id)}
              className={`group relative p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 ${
                isActive
                  ? `${node.activeClass} border-transparent ring-2 ring-teal-500/40 shadow-sm`
                  : node.isComplete
                  ? "bg-white hover:bg-slate-50 border-slate-200/90 text-slate-800"
                  : node.isMandatory
                  ? "bg-amber-50/40 hover:bg-amber-50 border-amber-200/80 text-slate-800"
                  : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
              }`}
            >
              {/* Top Row: Icon + Title + Mandatory Badge + Check/Alert */}
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : node.isComplete
                        ? `${node.bgClass}`
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <Icon size={13} />
                  </div>

                  <span
                    className={`text-xs font-bold truncate ${
                      isActive ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {index + 1}. {node.shortTitle}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {node.isMandatory && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
                        isActive
                          ? "bg-white/25 text-white"
                          : "bg-teal-50 text-teal-800 border border-teal-200"
                      }`}
                      title="Mandatory requirement for NABH Accreditation"
                    >
                      NABH
                    </span>
                  )}

                  {node.isComplete ? (
                    <CheckCircle2
                      size={14}
                      className={isActive ? "text-emerald-200" : "text-emerald-500"}
                    />
                  ) : node.isMandatory ? (
                    <AlertCircle
                      size={14}
                      className={isActive ? "text-amber-200" : "text-amber-500"}
                    />
                  ) : (
                    <span
                      className={`text-[9px] ${
                        isActive ? "text-white/60" : "text-slate-400"
                      }`}
                    >
                      opt
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Row: Detail snippet + Live status */}
              <div className="flex items-center justify-between text-[10px] pl-8">
                <span
                  className={`truncate pr-2 ${
                    isActive
                      ? "text-white/80"
                      : node.isComplete
                      ? "text-slate-500"
                      : node.isMandatory
                      ? "text-amber-700 font-medium"
                      : "text-slate-400"
                  }`}
                >
                  {node.detail}
                </span>

                <span
                  className={`font-mono text-[9.5px] px-1.5 py-0.2 rounded shrink-0 font-medium ${
                    isActive
                      ? "bg-white/20 text-white"
                      : node.isComplete
                      ? "bg-slate-100 text-slate-700"
                      : "bg-amber-100/60 text-amber-800"
                  }`}
                >
                  {node.badge}
                </span>
              </div>

              {/* Left active color indicator bar */}
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-white" />
              )}
            </div>
          );
        })}
      </div>

      {/* 4. Panel Footer: Quick Jump Summary */}
      <div className="p-2.5 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-1 font-semibold text-slate-700">
          <Sparkles size={12} className="text-teal-600" />
          <span>NABH Desk</span>
        </span>
        <span className="font-mono text-[10px]">
          {allNodes.filter((n) => n.isComplete).length}/{allNodes.length} Done
        </span>
      </div>
    </aside>
  );
}
