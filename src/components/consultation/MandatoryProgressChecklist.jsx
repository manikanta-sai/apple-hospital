import React, { useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Lock,
  Unlock,
  Sparkles,
} from "lucide-react";
import { useHospitalData } from "../../hooks/useHospitalData.js";

export default function MandatoryProgressChecklist({
  patient = {},
  rxForm = {},
  onJumpToSection = () => {},
}) {
  const { adminConfig = {} } = useHospitalData();
  const [isOpen, setIsOpen] = useState(false);

  // Evaluate fields
  const checklistItems = [
    {
      id: "sec-complaints",
      key: "chief_complaints",
      label: "Chief Complaints",
      isMandatory: adminConfig.chief_complaints?.isMandatory ?? true,
      isCompleted: (rxForm.chiefComplaints || []).length > 0,
      detail: (rxForm.chiefComplaints || []).length > 0
        ? `${rxForm.chiefComplaints.length} complaint(s) recorded`
        : "At least 1 complaint with duration required",
    },
    {
      id: "sec-vitals",
      key: "vitals",
      label: "Vitals Monitoring",
      isMandatory: adminConfig.vitals?.isMandatory ?? true,
      isCompleted: !!(patient.vitals?.bp && patient.vitals?.pulse),
      detail: patient.vitals?.bp
        ? `BP: ${patient.vitals.bp}, HR: ${patient.vitals.pulse || "--"}`
        : "Blood Pressure & Pulse required",
    },
    {
      id: "sec-allergies",
      key: "allergies",
      label: "Allergy Status Verification",
      isMandatory: adminConfig.allergies?.isMandatory ?? true,
      isCompleted: (patient.allergies || []).length > 0,
      detail: (patient.allergies || []).length > 0
        ? patient.allergies.join(", ")
        : "Record allergy or confirm NKDA",
    },
    {
      id: "sec-diagnosis",
      key: "diagnosis",
      label: "Provisional / Final Diagnosis",
      isMandatory: adminConfig.diagnosis?.isMandatory ?? true,
      isCompleted: !!(
        rxForm.diagnosis?.provisional?.trim() ||
        rxForm.diagnosis?.final?.trim()
      ),
      detail: rxForm.diagnosis?.final || rxForm.diagnosis?.provisional
        ? rxForm.diagnosis?.final || rxForm.diagnosis?.provisional
        : "Diagnosis name or ICD-10 required",
    },
    {
      id: "sec-medications",
      key: "medications",
      label: "Medications Matrix (Rx)",
      isMandatory: adminConfig.medications?.isMandatory ?? true,
      isCompleted: (rxForm.medications || []).length > 0,
      detail: (rxForm.medications || []).length > 0
        ? `${rxForm.medications.length} drug(s) prescribed`
        : "At least 1 medication required",
    },
    {
      id: "sec-advice",
      key: "follow_up",
      label: "Follow-up / Review Timeline",
      isMandatory: adminConfig.follow_up?.isMandatory ?? true,
      isCompleted: !!(
        rxForm.followUp?.timeline ||
        rxForm.followUp?.date ||
        rxForm.followUp?.notes
      ),
      detail: rxForm.followUp?.timeline
        ? `Review in ${rxForm.followUp.timeline}`
        : "Follow-up schedule or SOS required",
    },
  ];

  // Calculate percentage
  const mandatoryItems = checklistItems.filter((item) => item.isMandatory);
  const completedMandatory = mandatoryItems.filter((item) => item.isCompleted);

  const percentage =
    mandatoryItems.length > 0
      ? Math.round((completedMandatory.length / mandatoryItems.length) * 100)
      : 100;

  const isAllMandatoryFilled = percentage === 100;
  const pendingCount = mandatoryItems.length - completedMandatory.length;

  return (
    <div className="relative text-xs">
      {/* Trigger Progress Pill */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all select-none"
      >
        <div className="flex items-center gap-1.5">
          {isAllMandatoryFilled ? (
            <Unlock className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <Lock className="w-3.5 h-3.5 text-amber-600" />
          )}
          <span className="font-bold text-slate-800 text-xs">
            NABH Checklist:
          </span>
        </div>

        {/* Progress Bar Visual */}
        <div className="w-24 sm:w-32 h-2 rounded-full bg-slate-200 overflow-hidden relative">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isAllMandatoryFilled
                ? "bg-emerald-500"
                : percentage >= 60
                ? "bg-teal-500"
                : "bg-amber-500"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Status Percentage Badge */}
        <span
          className={`font-mono font-bold text-xs ${
            isAllMandatoryFilled ? "text-emerald-700" : "text-amber-800"
          }`}
        >
          {percentage}%
        </span>

        {pendingCount > 0 ? (
          <span className="hidden sm:inline text-[10.5px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
            {pendingCount} Pending
          </span>
        ) : (
          <span className="hidden sm:inline text-[10.5px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
            Ready to Sign
          </span>
        )}

        {isOpen ? (
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        )}
      </div>

      {/* Popover Checklist Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-fade-in-up">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <div>
              <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <span>NABH Compliance Checklist</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    isAllMandatoryFilled
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {completedMandatory.length}/{mandatoryItems.length} Complete
                </span>
              </h4>
              <p className="text-[10.5px] text-slate-500">
                Click any pending item to jump directly to that section
              </p>
            </div>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {checklistItems.map((item) => (
              <div
                key={item.key}
                onClick={() => {
                  onJumpToSection(item.id);
                  setIsOpen(false);
                }}
                className={`p-2 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                  item.isCompleted
                    ? "bg-emerald-50/50 border-emerald-200/80 hover:bg-emerald-50"
                    : item.isMandatory
                    ? "bg-rose-50/60 border-rose-200/80 hover:bg-rose-100/60"
                    : "bg-slate-50 border-slate-200/70 hover:bg-slate-100"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {item.isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : item.isMandatory ? (
                    <AlertCircle className="w-4 h-4 text-rose-500 animate-pulse" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800 truncate">
                      {item.label}
                    </span>
                    {item.isMandatory && (
                      <span className="text-[9.5px] font-bold text-rose-700 bg-rose-100 px-1 py-0.2 rounded">
                        Mandatory
                      </span>
                    )}
                  </div>
                  <p className="text-[10.5px] text-slate-600 truncate mt-0.5">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>
              {isAllMandatoryFilled
                ? "All standards met. Print unlocked."
                : "Print & Download locked until 100% complete."}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
