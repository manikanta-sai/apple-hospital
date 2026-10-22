import React, { useState } from "react";
import {
  Bed,
  Activity,
  AlertTriangle,
  ChevronDown,
  Building,
  CheckCircle2,
  Calendar,
  Flame,
  ArrowUpRight,
} from "lucide-react";

const ADMISSIONS_DATA = {
  monthly: {
    periodLabel: "Past 30 Days",
    totalSeen: 220,
    admissionsRecommended: 24,
    admissionRate: "10.9%",
    categories: [
      { label: "General Medical Ward", count: 16, percentage: 67, color: "from-sky-500 to-sky-600", note: "Standard inpatient bed" },
      { label: "ICU / High Dependency (HDU)", count: 3, percentage: 12, color: "from-rose-500 to-rose-600", note: "Critical hemodynamic care" },
      { label: "Daycare Observation (6–8h)", count: 5, percentage: 21, color: "from-amber-500 to-amber-600", note: "IV Fluids & Monitored Rx" },
    ],
    topIndications: [
      { diagnosis: "Severe Bronchopneumonia (SpO2 < 92%)", count: 7, ward: "Ward" },
      { diagnosis: "Uncontrolled Pyrexia & Sepsis Workup", count: 6, ward: "Ward" },
      { diagnosis: "Acute Hypertensive Emergency with Chest Pain", count: 3, ward: "ICU/HDU" },
      { diagnosis: "Diabetic Ketoacidosis / Severe Hyperglycemia", count: 5, ward: "Ward" },
      { diagnosis: "Dehydration & Hyperemesis with Ketonuria", count: 3, ward: "Daycare" },
    ],
  },
  weekly: {
    periodLabel: "13 Oct – 19 Oct 2026",
    totalSeen: 58,
    admissionsRecommended: 6,
    admissionRate: "10.3%",
    categories: [
      { label: "General Medical Ward", count: 4, percentage: 67, color: "from-sky-500 to-sky-600", note: "Standard inpatient bed" },
      { label: "ICU / High Dependency (HDU)", count: 1, percentage: 16, color: "from-rose-500 to-rose-600", note: "Critical hemodynamic care" },
      { label: "Daycare Observation (6–8h)", count: 1, percentage: 17, color: "from-amber-500 to-amber-600", note: "IV Fluids & Monitored Rx" },
    ],
    topIndications: [
      { diagnosis: "Severe Bronchopneumonia (SpO2 < 92%)", count: 2, ward: "Ward" },
      { diagnosis: "Uncontrolled Pyrexia & Sepsis Workup", count: 2, ward: "Ward" },
      { diagnosis: "Acute Hypertensive Emergency with Chest Pain", count: 1, ward: "ICU/HDU" },
      { diagnosis: "Dehydration & Hyperemesis with Ketonuria", count: 1, ward: "Daycare" },
    ],
  },
};

export default function AdmissionRecommendedGraph() {
  const [period, setPeriod] = useState("monthly");
  const [showDropdown, setShowDropdown] = useState(false);

  const data = ADMISSIONS_DATA[period] || ADMISSIONS_DATA.monthly;

  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.96)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        borderRadius: 24,
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.04)",
      }}
      className="p-6 sm:p-7 flex flex-col justify-between h-full select-none"
    >
      {/* ── Header ── */}
      <div>
        <div className="flex items-center justify-between pb-5 border-b border-slate-100 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Admissions Recommended</span>
              </h3>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-[5px] bg-rose-50 text-rose-800 border border-rose-200">
                Inpatient Triage
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Doctor recommendations for Emergency & Inpatient Ward admission
            </p>
          </div>

          {/* Period Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl text-xs font-bold text-slate-700 shadow-2xs transition-all cursor-pointer"
            >
              <Calendar size={13} className="text-rose-600" />
              <span>{data.periodLabel}</span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl p-1.5 z-40 animate-fade-in-up">
                {[
                  { id: "weekly", label: "13 Oct – 19 Oct 2026" },
                  { id: "monthly", label: "Past 30 Days" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setPeriod(item.id);
                      setShowDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      period === item.id
                        ? "bg-rose-50 text-rose-800 font-bold"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>{item.label}</span>
                    {period === item.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Key Metrics Strip ── */}
        <div className="grid grid-cols-3 gap-3 my-5">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10.5px] uppercase font-bold text-slate-400 block tracking-wider">
              Total Admissions
            </span>
            <strong className="text-xl font-black text-slate-900 font-mono mt-0.5 block">
              {data.admissionsRecommended}
            </strong>
          </div>

          <div className="p-3 rounded-2xl bg-rose-50/50 border border-rose-100">
            <span className="text-[10.5px] uppercase font-bold text-rose-700 block tracking-wider flex items-center gap-1">
              <Activity size={11} />
              <span>Admission Rate</span>
            </span>
            <strong className="text-xl font-black text-rose-900 font-mono mt-0.5 block">
              {data.admissionRate}
            </strong>
          </div>

          <div className="p-3 rounded-2xl bg-teal-50/50 border border-teal-100">
            <span className="text-[10.5px] uppercase font-bold text-teal-700 block tracking-wider flex items-center gap-1">
              <CheckCircle2 size={11} />
              <span>OPD Managed</span>
            </span>
            <strong className="text-xl font-black text-teal-900 font-mono mt-0.5 block">
              {data.totalSeen - data.admissionsRecommended}
            </strong>
          </div>
        </div>

        {/* ── Breakdown by Admission Facility ── */}
        <div className="space-y-3 pt-2">
          {data.categories.map((cat, idx) => (
            <div key={cat.label} className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div>
                  <span className="font-bold text-slate-800">{cat.label}</span>
                  <span className="text-[11px] text-slate-400 block">{cat.note}</span>
                </div>
                <div className="text-right">
                  <strong className="font-mono font-bold text-slate-900 text-sm">
                    {cat.count}
                  </strong>
                  <span className="text-[10.5px] text-slate-400 ml-1">({cat.percentage}%)</span>
                </div>
              </div>

              {/* Progress bar with Scroll-Reveal Growth */}
              <div className="h-2.5 w-full bg-slate-200/80 rounded-full overflow-hidden">
                <div
                  style={{
                    width: `${cat.percentage}%`,
                    transitionDelay: `${idx * 100}ms`,
                  }}
                  className={`h-full rounded-full bg-gradient-to-r ${cat.color} chart-bar-h`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer Clinical Note ── */}
      <div className="pt-4 border-t border-slate-100 mt-5 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1 text-[11px]">
          <Bed size={13} className="text-rose-600" />
          <span>Bed Management: <strong>Direct IPD Desk Route</strong></span>
        </span>
        <span className="text-[11px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-[5px] border border-rose-200">
          NABH Standard Compliant
        </span>
      </div>
    </div>
  );
}
