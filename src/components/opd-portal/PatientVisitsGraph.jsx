import React, { useState } from "react";
import { ChevronDown, TrendingUp, Users, Clock } from "lucide-react";

/**
 * PATIENT VISITS OVERVIEW DATASETS
 * By default: 'weekly' (Week). 'yesterday' and 'today' removed as requested.
 * 'avg' removed as requested.
 */
const PERIOD_DATA = {
  weekly: {
    periodLabel: "Weekly",
    summaryTotal: "3,610",
    benchmarkY: 55,
    benchmarkLabel: "Target Benchmark",
    columns: [
      { id: "w1", label: "Mon", valueDisplay: "860", subLabel: "High Rush", rawValue: 860, heightPct: 95 },
      { id: "w2", label: "Tue", valueDisplay: "320", subLabel: "Low Visits", rawValue: 320, heightPct: 36 },
      { id: "w3", label: "Wed", valueDisplay: "710", subLabel: "Midweek", rawValue: 710, heightPct: 78 },
      { id: "w4", label: "Thu", valueDisplay: "660", subLabel: "Normal", rawValue: 660, heightPct: 72 },
      { id: "w5", label: "Fri", valueDisplay: "540", subLabel: "Average", rawValue: 540, heightPct: 60 },
      { id: "w6", label: "Sat", valueDisplay: "520", subLabel: "Weekend Clinic", rawValue: 520, heightPct: 58 },
    ],
  },
  monthly: {
    periodLabel: "Monthly",
    summaryTotal: "28,547",
    benchmarkY: 58,
    benchmarkLabel: "Target 6k",
    columns: [
      { id: "m1", label: "Jan", valueDisplay: "9,532", subLabel: "Highest Traffic", rawValue: 9532, heightPct: 84 },
      { id: "m2", label: "Feb", valueDisplay: "7,520", subLabel: "Winter Peak", rawValue: 7520, heightPct: 62 },
      { id: "m3", label: "Mar", valueDisplay: "5,532", subLabel: "Optimal", rawValue: 5532, heightPct: 48 },
      { id: "m4", label: "Apr", valueDisplay: "3,450", subLabel: "Stabilized", rawValue: 3450, heightPct: 36 },
      { id: "m5", label: "May", valueDisplay: "2,513", subLabel: "Seasonal", rawValue: 2513, heightPct: 26 },
    ],
  },
  yearly: {
    periodLabel: "Yearly",
    summaryTotal: "114,200",
    benchmarkY: 62,
    benchmarkLabel: "Annual Target",
    columns: [
      { id: "y1", label: "2023", valueDisplay: "24,800", subLabel: "Expansion", rawValue: 24800, heightPct: 50 },
      { id: "y2", label: "2024", valueDisplay: "28,400", subLabel: "OPD Surge", rawValue: 28400, heightPct: 62 },
      { id: "y3", label: "2025", valueDisplay: "34,200", subLabel: "NABH Accreditation", rawValue: 34200, heightPct: 78 },
      { id: "y4", label: "2026", valueDisplay: "26,800", subLabel: "Current YTD", rawValue: 26800, heightPct: 58 },
    ],
  },
};

export default function PatientVisitsGraph() {
  // BY DEFAULT: 'weekly' as requested
  const [selectedPeriod, setSelectedPeriod] = useState("weekly");
  const [hoveredCol, setHoveredCol] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const activeData = PERIOD_DATA[selectedPeriod] || PERIOD_DATA.weekly;

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
      className="p-6 sm:p-7 relative select-none"
    >
      {/* ── Graph Header: Title & Date Range Dropdown ── */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100 flex-wrap gap-3">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Patient Visits Overview
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Doctor consultation throughput & patient volume distribution
          </p>
        </div>

        {/* Date Rate Dropdown (Default: Weekly, Yesterday & Today removed) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl text-xs font-bold text-slate-700 shadow-2xs transition-all cursor-pointer"
          >
            <span>{activeData.periodLabel}</span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl p-1.5 z-40 animate-fade-in-up">
              {[
                { id: "weekly", label: "Weekly (Default)" },
                { id: "monthly", label: "Monthly" },
                { id: "yearly", label: "Yearly" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelectedPeriod(item.id);
                    setShowDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                    selectedPeriod === item.id
                      ? "bg-blue-50 text-blue-800 font-bold"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span>{item.label}</span>
                  {selectedPeriod === item.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Main Chart Canvas Area ── */}
      <div className="mt-8 flex items-stretch gap-4 relative min-h-[320px]">
        {/* Y-Axis Numerical Scale */}
        <div className="w-10 sm:w-12 shrink-0 flex flex-col justify-between text-right text-[11px] font-semibold text-slate-400 select-none pb-8 pr-1 font-mono">
          <span>10k</span>
          <span>8k</span>
          <span>6k</span>
          <span>5k</span>
          <span>4k</span>
          <span>2k</span>
          <span>0</span>
        </div>

        {/* Chart Drawing Area */}
        <div className="flex-1 relative flex items-end justify-between border-b border-slate-200 pb-2 gap-2 sm:gap-6">
          {/* Subtle Horizontal Reference Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
            <div className="border-b border-slate-100 w-full" />
            <div className="border-b border-slate-100 w-full" />
            <div className="border-b border-slate-100 w-full" />
            <div className="border-b border-slate-100 w-full" />
            <div className="border-b border-slate-100 w-full" />
            <div className="border-b border-slate-100 w-full" />
            <div className="border-b border-transparent w-full" />
          </div>

          {/* Benchmark Target Line */}
          <div
            className="absolute left-0 right-0 border-b border-slate-300 pointer-events-none z-10 flex items-center justify-end pr-2"
            style={{ bottom: `${activeData.benchmarkY}%` }}
          >
            <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wider -translate-y-2 bg-white/80 px-1 rounded-[5px]">
              {activeData.benchmarkLabel}
            </span>
          </div>

          {/* Columns */}
          {activeData.columns.map((col, index) => {
            const isHovered = hoveredCol === col.id;

            return (
              <div
                key={col.id}
                onMouseEnter={() => setHoveredCol(col.id)}
                onMouseLeave={() => setHoveredCol(null)}
                className="flex-1 h-full flex flex-col justify-end items-center relative group cursor-pointer"
              >
                {/* 1. Top Indicator Metric Pill & Total Count (Avg removed as requested) */}
                <div
                  className="mb-3 text-center transition-transform duration-200 group-hover:-translate-y-1"
                  style={{ position: "relative", zIndex: 20 }}
                >
                  <p className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                    Total Patients
                  </p>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-base sm:text-xl font-black text-slate-900 tracking-tight font-sans">
                      {col.valueDisplay}
                    </span>
                  </div>

                  {/* Horizontal pill marker */}
                  <div className="w-8 sm:w-12 h-1.5 rounded-[5px] bg-blue-400/50 mx-auto mt-1 transition-all group-hover:w-14 group-hover:bg-blue-600" />
                </div>

                {/* 2. Diagonal Striped Bar Column with Depth Extrusion */}
                <div
                  className="w-full relative transition-all duration-300 ease-out chart-bar-v"
                  style={{
                    height: `${col.heightPct}%`,
                    maxHeight: "220px",
                    transitionDelay: `${index * 85}ms`,
                  }}
                >
                  <svg
                    viewBox="0 0 100 200"
                    preserveAspectRatio="none"
                    className="w-full h-full drop-shadow-md overflow-visible"
                  >
                    <defs>
                      <pattern
                        id={`diagonal-stripes-col-${index}`}
                        patternUnits="userSpaceOnUse"
                        width="10"
                        height="10"
                        patternTransform="rotate(45)"
                      >
                        <line
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="10"
                          stroke="rgba(255, 255, 255, 0.45)"
                          strokeWidth="3.5"
                        />
                      </pattern>

                      <linearGradient
                        id={`frontGrad-col-${index}`}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="60%" stopColor="#60a5fa" />
                        <stop offset="100%" stopColor="#93c5fd" />
                      </linearGradient>

                      <linearGradient
                        id={`sideGrad-col-${index}`}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="#1e40af" stopOpacity="0.95" />
                      </linearGradient>
                    </defs>

                    {/* Right Side Depth */}
                    <polygon
                      points="86,10 100,0 100,190 86,200"
                      fill={`url(#sideGrad-col-${index})`}
                      opacity={isHovered ? 1 : 0.8}
                    />

                    {/* Top Cap */}
                    <polygon
                      points="0,10 14,0 100,0 86,10"
                      fill="#bfdbfe"
                      opacity="0.9"
                    />

                    {/* Front Face */}
                    <rect
                      x="0"
                      y="10"
                      width="86"
                      height="190"
                      rx="3"
                      fill={`url(#frontGrad-col-${index})`}
                    />

                    {/* Front Face Stripes Overlay */}
                    <rect
                      x="0"
                      y="10"
                      width="86"
                      height="190"
                      rx="3"
                      fill={`url(#diagonal-stripes-col-${index})`}
                    />
                  </svg>
                </div>

                {/* 3. X-Axis Label */}
                <div className="mt-3 text-center">
                  <span className="text-xs sm:text-sm font-bold text-slate-700 tracking-tight block">
                    {col.label}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium block">
                    {col.subLabel}
                  </span>
                </div>

                {/* 4. Interactive Hover Tooltip */}
                {isHovered && (
                  <div className="absolute -top-14 z-30 bg-slate-900 text-white rounded-xl py-1.5 px-3 shadow-xl text-center pointer-events-none animate-fade-in-up border border-slate-800 text-xs min-w-[110px]">
                    <div className="font-bold text-blue-300">
                      {col.valueDisplay} Patients
                    </div>
                    <div className="text-[10px] text-slate-300">
                      {col.label} • {col.subLabel}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Summary Stats Footer ── */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-semibold text-slate-700">
            <Users size={14} className="text-blue-600" />
            <span>Total Patients: <strong className="text-slate-900 font-bold">{activeData.summaryTotal}</strong></span>
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-[5px] border border-emerald-200">
          <TrendingUp size={13} />
          <span>Optimal Clinical Capacity • 94% Completion</span>
        </div>
      </div>
    </div>
  );
}
