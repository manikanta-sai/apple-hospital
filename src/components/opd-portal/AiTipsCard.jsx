import React from "react";
import {
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Pill,
  Lightbulb,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { AnimatedKpiCard } from "../common/ChartAnimations.jsx";

export default function AiTipsCard() {
  const tips = [
    {
      id: "tip-1",
      category: "Peak Flow Prediction",
      icon: Clock,
      color: "blue",
      title: "Expected Queue Influx at 11:30 AM – 01:00 PM",
      desc: "Based on online appointment slots and typical walk-in velocity, expect 8–10 arrivals in this window. Consider pre-triaging routine follow-ups.",
      badge: "Predictive Analytics",
    },
    {
      id: "tip-2",
      category: "Antibiotic Stewardship",
      icon: Pill,
      color: "emerald",
      title: "Seasonal Viral Pharyngitis Protocol",
      desc: "72% of cough/fever presentations this week are viral. Recommend symptomatic hydration and steam inhalation before second-line antibiotics.",
      badge: "Clinical Protocol",
    },
    {
      id: "tip-3",
      category: "CDSS Safety Summary",
      icon: ShieldCheck,
      color: "rose",
      title: "Active Allergy Flags in Waiting Room",
      desc: "2 patients in today's pool have severe Penicillin allergies. AI CDSS will automatically block contraindications during prescription drafting.",
      badge: "Patient Safety",
    },
    {
      id: "tip-4",
      category: "Adherence Metric",
      icon: TrendingUp,
      color: "indigo",
      title: "88% Follow-Up Return Rate",
      desc: "Your outpatient prescription clarity score has increased follow-up compliance by +12% compared to the hospital department baseline.",
      badge: "Quality Metric",
    },
  ];

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
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-sm border border-purple-200/80 shadow-2xs">
            <Sparkles size={18} />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>AI Clinical Copilot Tips</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                Live Insights
              </span>
            </h4>
            <p className="text-xs text-slate-500">Proactive intelligence for your OPD shift</p>
          </div>
        </div>

        <span className="text-[11px] font-mono text-slate-400">
          Updated: {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      {/* Tips Stream */}
      <div className="py-3 space-y-3 flex-1 overflow-y-auto max-h-[360px] pr-1">
        {tips.map((tip, idx) => {
          const Icon = tip.icon;

          const colorClasses =
            tip.color === "rose"
              ? "bg-rose-50 border-rose-200/80 text-rose-950"
              : tip.color === "emerald"
              ? "bg-emerald-50 border-emerald-200/80 text-emerald-950"
              : tip.color === "indigo"
              ? "bg-indigo-50 border-indigo-200/80 text-indigo-950"
              : "bg-blue-50 border-blue-200/80 text-blue-950";

          const iconClasses =
            tip.color === "rose"
              ? "bg-rose-100 text-rose-700"
              : tip.color === "emerald"
              ? "bg-emerald-100 text-emerald-700"
              : tip.color === "indigo"
              ? "bg-indigo-100 text-indigo-700"
              : "bg-blue-100 text-blue-700";

          return (
            <AnimatedKpiCard key={tip.id} index={idx} staggerMs={70}>
              <div
                className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-all hover:scale-[1.01] ${colorClasses}`}
              >
                <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${iconClasses}`}>
                  <Icon size={15} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-xs">{tip.title}</span>
                    <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-white/70 shadow-2xs shrink-0">
                      {tip.badge}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed opacity-90">
                    {tip.desc}
                  </p>
                </div>
              </div>
            </AnimatedKpiCard>
          );
        })}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1 text-[11px]">
          <Lightbulb size={12} className="text-purple-600" />
          <span>NABH Evidence-Based Guidance Model</span>
        </span>
        <span className="font-semibold text-purple-700">Auto-Refreshed</span>
      </div>
    </div>
  );
}
