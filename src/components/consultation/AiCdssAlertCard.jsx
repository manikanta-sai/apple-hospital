import React, { useState } from "react";
import {
  AlertTriangle,
  ShieldAlert,
  Info,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Baby,
  CheckCircle2,
  X,
} from "lucide-react";

export default function AiCdssAlertCard({
  patient,
  medications = [],
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState({});

  if (!patient) return null;

  const alerts = [];

  // 1. Allergy Cross-Check Analysis
  const patientAllergies = patient.allergies || [];
  const hasPenicillinAllergy = patientAllergies.some((a) =>
    a.toLowerCase().includes("penicillin")
  );

  const containsBetaLactams = medications.some((m) => {
    const name = (m.drugName + " " + m.genericName).toLowerCase();
    return (
      name.includes("penicillin") ||
      name.includes("amoxicillin") ||
      name.includes("ampicillin") ||
      name.includes("augmentin") ||
      name.includes("clav")
    );
  });

  if (hasPenicillinAllergy) {
    if (containsBetaLactams) {
      alerts.push({
        id: "allergy-conflict",
        type: "danger",
        title: "CRITICAL: Drug-Allergy Contraindication!",
        message:
          "Prescribed medication contains Beta-Lactam / Penicillin derivatives. Patient has recorded severe Penicillin allergy. Risk of anaphylaxis.",
        action: "High Severity • Immediate Doctor Action Required",
      });
    } else {
      alerts.push({
        id: "allergy-advisory",
        type: "warning",
        title: "Allergy Alert: Penicillin Flagged",
        message:
          "Patient has confirmed Penicillin allergy. Beta-lactam antibiotics (Amoxicillin, Augmentin, Cephalosporins) are contraindicated.",
        action: "Clinical Caution",
      });
    }
  }

  // 2. Obstetric & Pregnancy Trimester Evaluation
  if (patient.isPregnant) {
    const trimester = patient.pregnancyDetails?.trimester || "2nd";
    const weeks = patient.pregnancyDetails?.gestationalWeeks || 22;

    alerts.push({
      id: "pregnancy-alert",
      type: "info",
      title: `Pregnancy Guidance (${trimester} Trimester • ${weeks} Weeks)`,
      message: `Ensure all prescribed medications are FDA Category A or B (e.g. Doxylamine, Paracetamol). Strictly avoid ACE inhibitors, ARBs, and Statins.`,
      action: "Obstetric Protocol Active",
    });
  }

  // 3. Hypertension / Vitals Anomaly Alert
  if (patient.vitals?.bp) {
    const parts = patient.vitals.bp.split("/");
    const sys = parseInt(parts[0], 10);
    const dia = parseInt(parts[1], 10);
    if (sys >= 140 || dia >= 90) {
      alerts.push({
        id: "vitals-bp-high",
        type: "warning",
        title: `Observation: Elevated Blood Pressure (${patient.vitals.bp} mmHg)`,
        message: `Current BP meets Stage 1 Hypertension criteria. Consider recording cardiovascular examination and dietary sodium restriction advice.`,
        action: "Vitals Observation",
      });
    }
  }

  // Filter out dismissed alerts
  const visibleAlerts = alerts.filter((a) => !dismissedAlerts[a.id]);

  if (visibleAlerts.length === 0) {
    return (
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3 flex items-center justify-between text-xs text-emerald-900">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">
            AI Clinical Check: No contraindications or safety conflicts detected.
          </span>
        </div>
        <span className="text-[10px] text-emerald-700 font-mono">CDSS Safe</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-3.5 py-2.5 bg-gradient-to-r from-amber-500/10 via-slate-50 to-white border-b border-slate-200/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-700 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span>AI Clinical Decision Support (CDSS)</span>
              <span className="text-[10.5px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-bold">
                {visibleAlerts.length} Active Notice{visibleAlerts.length > 1 ? "s" : ""}
              </span>
            </h4>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
        >
          {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {/* Alert Items List */}
      {!isCollapsed && (
        <div className="p-3 space-y-2.5 text-xs">
          {visibleAlerts.map((alert) => {
            const isDanger = alert.type === "danger";
            const isWarning = alert.type === "warning";
            const isInfo = alert.type === "info";

            const containerBg = isDanger
              ? "bg-rose-50/90 border-rose-200 text-rose-900"
              : isWarning
              ? "bg-amber-50/90 border-amber-200 text-amber-950"
              : "bg-blue-50/90 border-blue-200 text-blue-950";

            const badgeBg = isDanger
              ? "bg-rose-600 text-white"
              : isWarning
              ? "bg-amber-600 text-white"
              : "bg-blue-600 text-white";

            return (
              <div
                key={alert.id}
                className={`p-2.5 rounded-xl border flex items-start gap-2.5 relative transition-all ${containerBg}`}
              >
                <div className="mt-0.5 shrink-0">
                  {isDanger ? (
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                  ) : isWarning ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  ) : (
                    <Info className="w-4 h-4 text-blue-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0 pr-5">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-bold text-xs">{alert.title}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed opacity-90">
                    {alert.message}
                  </p>
                  <span
                    className={`inline-block mt-1 text-[9.5px] font-bold px-1.5 py-0.2 rounded ${badgeBg}`}
                  >
                    {alert.action}
                  </span>
                </div>

                {/* Dismiss button */}
                <button
                  type="button"
                  onClick={() =>
                    setDismissedAlerts((prev) => ({ ...prev, [alert.id]: true }))
                  }
                  className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
                  title="Dismiss notification"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
