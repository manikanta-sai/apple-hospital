import React, { useState } from "react";
import { ChevronDown, Clock, Sparkles, Flame, Calendar } from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// 9:00 AM to 4:00 PM OPD Working Consultation Slots
const TIME_SLOTS = [
  { id: "9am", label: "09:00 AM" },
  { id: "10am", label: "10:00 AM" },
  { id: "11am", label: "11:00 AM" },
  { id: "12pm", label: "12:00 PM" },
  { id: "1pm", label: "01:00 PM" },
  { id: "2pm", label: "02:00 PM" },
  { id: "3pm", label: "03:00 PM" },
  { id: "4pm", label: "04:00 PM" },
];

/**
 * Heatmap Intensity Density Matrix (0: None, 1: Light, 2: Moderate, 3: Heavy, 4: Peak)
 * Focused on core OPD hours (9:00 AM – 4:00 PM)
 * Every Tuesday: Low visits (intensity 1). Friday: Average (intensity 2).
 */
const WEEKS_HEATMAP_DATA = {
  week_13_19_oct: {
    weekLabel: "13 Oct – 19 Oct 2026",
    totalAppointments: 368,
    peakSlot: "Mon, 10:00 AM – 11:00 AM (22 Pts)",
    // 8 slots (9am - 4pm) x 7 days (Sun, Mon, Tue, Wed, Thu, Fri, Sat)
    // Tue (idx 2) is low visits (level 1), Fri (idx 5) is average (level 2)
    density: [
      // 09:00 AM (Morning rush starts)
      [1, 4, 1, 3, 3, 2, 2],
      // 10:00 AM (Peak Rush)
      [2, 4, 1, 4, 4, 2, 3],
      // 11:00 AM (Peak Rush)
      [2, 4, 1, 4, 3, 2, 3],
      // 12:00 PM (Pre-lunch consultations)
      [1, 3, 1, 3, 2, 2, 2],
      // 01:00 PM (Shift handover & lunch)
      [1, 2, 0, 2, 1, 2, 1],
      // 02:00 PM (Afternoon clinic resumes)
      [1, 3, 1, 3, 2, 2, 2],
      // 03:00 PM (Follow-up reviews & reports)
      [1, 3, 1, 3, 2, 2, 2],
      // 04:00 PM (Evening closing rush)
      [1, 4, 1, 3, 3, 2, 2],
    ],
  },
  week_06_12_oct: {
    weekLabel: "06 Oct – 12 Oct 2026",
    totalAppointments: 392,
    peakSlot: "Wed, 10:00 AM – 11:00 AM (23 Pts)",
    density: [
      // 09:00 AM
      [1, 3, 1, 4, 3, 2, 2],
      // 10:00 AM
      [2, 4, 1, 4, 4, 2, 3],
      // 11:00 AM
      [2, 4, 1, 4, 3, 2, 3],
      // 12:00 PM
      [1, 3, 1, 3, 2, 2, 2],
      // 01:00 PM
      [1, 1, 0, 2, 1, 2, 1],
      // 02:00 PM
      [1, 3, 1, 3, 2, 2, 2],
      // 03:00 PM
      [1, 2, 1, 3, 2, 2, 2],
      // 04:00 PM
      [1, 3, 1, 3, 2, 2, 1],
    ],
  },
  week_29sep_05oct: {
    weekLabel: "29 Sep – 05 Oct 2026",
    totalAppointments: 354,
    peakSlot: "Mon, 11:00 AM – 12:00 PM (20 Pts)",
    density: [
      // 09:00 AM
      [1, 3, 1, 3, 3, 2, 2],
      // 10:00 AM
      [2, 4, 1, 3, 3, 2, 2],
      // 11:00 AM
      [2, 4, 1, 4, 3, 2, 3],
      // 12:00 PM
      [1, 3, 1, 3, 2, 2, 2],
      // 01:00 PM
      [0, 1, 0, 1, 1, 2, 1],
      // 02:00 PM
      [1, 2, 1, 2, 2, 2, 1],
      // 03:00 PM
      [1, 2, 1, 2, 1, 2, 1],
      // 04:00 PM
      [1, 3, 1, 3, 2, 2, 1],
    ],
  },
};

// Purple Heatmap Intensity Colors
const INTENSITY_COLORS = [
  "bg-purple-50/50 border-purple-100/60", // Level 0: Minimal
  "bg-purple-100 border-purple-200/70", // Level 1: Low
  "bg-purple-300 border-purple-400/80", // Level 2: Moderate
  "bg-purple-500 border-purple-600/90 text-white", // Level 3: Heavy
  "bg-purple-700 border-purple-800 shadow-xs text-white", // Level 4: Peak Rush
];

const ESTIMATED_COUNTS = [
  "0–2 pts",
  "3–6 pts",
  "7–11 pts",
  "12–16 pts",
  "17–24 pts (Peak)",
];

export default function PeakHoursHeatmap() {
  const [selectedWeek, setSelectedWeek] = useState("week_13_19_oct");
  const [showDropdown, setShowDropdown] = useState(false);
  const [hoveredCell, setHoveredCell] = useState(null);

  const activeWeekData = WEEKS_HEATMAP_DATA[selectedWeek] || WEEKS_HEATMAP_DATA.week_13_19_oct;

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
      className="p-6 sm:p-7 relative select-none flex flex-col justify-between h-full"
    >
      {/* ── Header: Title & Weekly Filter ── */}
      <div>
        <div className="flex items-center justify-between pb-5 border-b border-slate-100 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Peak Consultation Hours
              </h3>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-[5px] bg-purple-50 text-purple-700 border border-purple-200">
                09:00 AM – 04:00 PM
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Hourly patient arrival rush & OPD desk density (Core consultation hours)
            </p>
          </div>

          {/* Weekly Filter Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl text-xs font-bold text-slate-700 shadow-2xs transition-all cursor-pointer"
            >
              <Calendar size={13} className="text-purple-600" />
              <span>{activeWeekData.weekLabel}</span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl p-1.5 z-40 animate-fade-in-up">
                {[
                  { id: "week_13_19_oct", label: "13 Oct – 19 Oct 2026" },
                  { id: "week_06_12_oct", label: "06 Oct – 12 Oct 2026" },
                  { id: "week_29sep_05oct", label: "29 Sep – 05 Oct 2026" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedWeek(item.id);
                      setShowDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      selectedWeek === item.id
                        ? "bg-purple-50 text-purple-800 font-bold"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>{item.label}</span>
                    {selectedWeek === item.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Main Heatmap Grid: 9:00 AM to 4:00 PM ── */}
        <div className="mt-5 flex items-start gap-3 relative">
          {/* Y-Axis: Exact Time Labels for each row */}
          <div className="w-18 shrink-0 flex flex-col space-y-1.5 sm:space-y-2 select-none text-right font-mono text-[11px] font-semibold text-slate-400 pt-7">
            {TIME_SLOTS.map((slot) => (
              <div
                key={slot.id}
                className="h-6 sm:h-7 flex items-center justify-end pr-1 text-slate-500"
              >
                {slot.label}
              </div>
            ))}
          </div>

          {/* Days & Heatmap Blocks */}
          <div className="flex-1 min-w-0">
            {/* Day of Week Columns Header */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-2 text-center">
              {DAYS.map((day) => (
                <span
                  key={day}
                  className="text-xs sm:text-sm font-bold text-slate-700 tracking-tight"
                >
                  {day}
                </span>
              ))}
            </div>

            {/* Heatmap Blocks Matrix (9:00 AM to 4:00 PM) */}
            <div className="space-y-1.5 sm:space-y-2">
              {TIME_SLOTS.map((slot, rowIndex) => (
                <div key={slot.id} className="grid grid-cols-7 gap-1.5 sm:gap-2">
                  {DAYS.map((day, colIndex) => {
                    const level = activeWeekData.density[rowIndex]?.[colIndex] ?? 0;
                    const colorClass = INTENSITY_COLORS[level];
                    const isHovered =
                      hoveredCell?.row === rowIndex && hoveredCell?.col === colIndex;

                    return (
                      <div
                        key={day}
                        style={{
                          transitionDelay: `${(rowIndex * 7 + colIndex) * 18}ms`,
                        }}
                        onMouseEnter={() =>
                          setHoveredCell({
                            row: rowIndex,
                            col: colIndex,
                            day,
                            time: slot.label,
                            level,
                            count: ESTIMATED_COUNTS[level],
                          })
                        }
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`h-6 sm:h-7 rounded-[5px] border transition-all duration-150 cursor-pointer relative flex items-center justify-center heatmap-cell-anim ${colorClass} ${
                          isHovered
                            ? "ring-2 ring-purple-600 scale-105 z-20 shadow-md"
                            : "hover:brightness-95"
                        }`}
                      >
                        {level === 4 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Hover Tooltip Float */}
          {hoveredCell && (
            <div className="absolute top-2 right-4 z-40 bg-slate-900 text-white rounded-xl py-2 px-3 shadow-2xl text-center pointer-events-none animate-fade-in-up border border-slate-800 text-xs">
              <div className="font-bold text-purple-300">
                {hoveredCell.day} • {hoveredCell.time}
              </div>
              <div className="text-[11px] text-slate-300 mt-0.5">
                Arrival Density: <strong>{hoveredCell.count}</strong>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Footer Legend & Peak Insight ── */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Flame size={14} className="text-purple-600" />
          <span className="font-semibold text-slate-700">
            Peak Slot:{" "}
            <strong className="text-purple-900 font-bold">{activeWeekData.peakSlot}</strong>
          </span>
        </div>

        {/* Color Gradient Legend */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <span>Light</span>
          <div className="flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded-[5px] bg-purple-50 border border-purple-200" />
            <span className="w-3.5 h-3.5 rounded-[5px] bg-purple-100 border border-purple-200" />
            <span className="w-3.5 h-3.5 rounded-[5px] bg-purple-300 border border-purple-400" />
            <span className="w-3.5 h-3.5 rounded-[5px] bg-purple-500" />
            <span className="w-3.5 h-3.5 rounded-[5px] bg-purple-700" />
          </div>
          <span>Peak Rush</span>
        </div>
      </div>
    </div>
  );
}
