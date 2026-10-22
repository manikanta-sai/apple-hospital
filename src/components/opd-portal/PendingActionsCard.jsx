import React from "react";
import {
  AlertCircle,
  FlaskConical,
  FileEdit,
  ShieldAlert,
  ArrowRight,
  Clock,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { AnimatedKpiCard } from "../common/ChartAnimations.jsx";

export default function PendingActionsCard({
  patients = [],
  onSelectPatient = () => {},
  onGoToAppointments = () => {},
}) {
  // Pending diagnostics: patients in 'draft_labs'
  const labPendingPatients = patients.filter((p) => p.queueStatus === "draft_labs");

  // In-consultation active drafts
  const inConsultationPatient = patients.find((p) => p.queueStatus === "in_consultation");

  // High risk patients (e.g. high BP or severe allergy)
  const highRiskPatients = patients.filter(
    (p) =>
      p.allergies?.some((a) => a.toLowerCase().includes("penicillin")) ||
      (p.vitals?.bp && parseInt(p.vitals.bp.split("/")[0], 10) >= 140)
  );

  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.96)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        borderRadius: 24,
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.04)",
      }}
      className="p-6 flex flex-col h-full select-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm border border-amber-200/80 shadow-2xs">
            <AlertCircle size={18} />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Pending Actions</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-mono">
                {labPendingPatients.length + (inConsultationPatient ? 1 : 0)} Action Items
              </span>
            </h4>
            <p className="text-xs text-slate-500">Requires doctor review or signature</p>
          </div>
        </div>

        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
          Urgent Attention
        </span>
      </div>

      {/* Action Items List */}
      <div className="py-3 space-y-3 flex-1 overflow-y-auto max-h-[360px] pr-1">
        {/* 1. Active In-Consultation Prescription */}
        {inConsultationPatient && (
          <AnimatedKpiCard index={0} staggerMs={70}>
            <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200/80 flex items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-xl bg-teal-100 text-teal-800 mt-0.5">
                  <FileEdit size={15} />
                </div>
                <div>
                  <strong className="text-xs font-bold text-teal-950 block">
                    Complete Active Consultation ({inConsultationPatient.name})
                  </strong>
                  <p className="text-[11px] text-teal-800 mt-0.5">
                    Token {inConsultationPatient.tokenNumber} • Prescription drafted. Awaiting doctor final review & sign.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectPatient(inConsultationPatient.id)}
                className="px-3 py-1.5 bg-teal-700 hover:bg-teal-600 text-white rounded-xl text-xs font-bold shrink-0 transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
              >
                <span>Resume Desk</span>
                <ChevronRight size={13} />
              </button>
            </div>
          </AnimatedKpiCard>
        )}

        {/* 2. Lab Results Awaiting Review */}
        {labPendingPatients.map((p, idx) => (
          <AnimatedKpiCard key={p.id} index={(inConsultationPatient ? 1 : 0) + idx} staggerMs={70}>
            <div
              className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 flex items-center justify-between gap-3"
            >
              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-100 text-indigo-800 mt-0.5">
                  <FlaskConical size={15} />
                </div>
                <div>
                  <strong className="text-xs font-bold text-indigo-950 block">
                    Lab Investigation Reports Ready ({p.name})
                  </strong>
                  <p className="text-[11px] text-indigo-800 mt-0.5">
                    Token {p.tokenNumber} • CBC, LFT & Ultrasound ready. Print locked until finalized.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectPatient(p.id)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shrink-0 transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
              >
                <span>Review Labs</span>
                <ChevronRight size={13} />
              </button>
            </div>
          </AnimatedKpiCard>
        ))}

        {/* 3. High Risk Clinical Advisory */}
        {highRiskPatients.slice(0, 1).map((p, idx) => (
          <AnimatedKpiCard key={p.id} index={(inConsultationPatient ? 1 : 0) + labPendingPatients.length + idx} staggerMs={70}>
            <div
              className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/80 flex items-center justify-between gap-3"
            >
              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-xl bg-rose-100 text-rose-800 mt-0.5">
                  <ShieldAlert size={15} />
                </div>
                <div>
                  <strong className="text-xs font-bold text-rose-950 block">
                    Critical Clinical Allergy Notice ({p.name})
                  </strong>
                  <p className="text-[11px] text-rose-800 mt-0.5">
                    Token {p.tokenNumber} has recorded Penicillin allergy. Beta-lactams contraindicated.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectPatient(p.id)}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shrink-0 transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
              >
                <span>Inspect</span>
                <ChevronRight size={13} />
              </button>
            </div>
          </AnimatedKpiCard>
        ))}

        {labPendingPatients.length === 0 && !inConsultationPatient && (
          <div className="py-8 text-center text-slate-400">
            <CheckCircle2 size={32} className="mx-auto text-emerald-500/60 mb-2" />
            <p className="font-semibold text-slate-700 text-xs">All clear!</p>
            <p className="text-[11px] text-slate-400">No pending lab reviews or unsigned prescriptions.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Auto-synced with hospital laboratory</span>
        <button
          type="button"
          onClick={onGoToAppointments}
          className="font-bold text-slate-700 hover:text-slate-900"
        >
          View Queue Board →
        </button>
      </div>
    </div>
  );
}
