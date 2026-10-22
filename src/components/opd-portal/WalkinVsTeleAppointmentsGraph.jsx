import React, { useState } from "react";
import { Users, Video, Calendar, ChevronDown, TrendingUp, Sparkles } from "lucide-react";

export default function WalkinVsTeleAppointmentsGraph() {
  const [selectedFilter, setSelectedFilter] = useState("Weekly");
  const [showDropdown, setShowDropdown] = useState(false);
  const [hoveredDay, setHoveredDay] = useState(null);

  // Data adhering to: Tuesday low visits, Friday average, Saturday included
  const weeklyData = [
    { day: "Mon", walkin: 640, tele: 220, total: 860, status: "Peak Rush" },
    { day: "Tue", walkin: 240, tele: 80, total: 320, status: "Low Visits" },
    { day: "Wed", walkin: 530, tele: 180, total: 710, status: "Midweek Steady" },
    { day: "Thu", walkin: 490, tele: 170, total: 660, status: "Normal" },
    { day: "Fri", walkin: 400, tele: 140, total: 540, status: "Average" },
    { day: "Sat", walkin: 380, tele: 140, total: 520, status: "Weekend Clinic" },
  ];

  const totalWalkin = weeklyData.reduce((acc, d) => acc + d.walkin, 0);
  const totalTele = weeklyData.reduce((acc, d) => acc + d.tele, 0);
  const totalCombined = totalWalkin + totalTele;
  const walkinPct = Math.round((totalWalkin / totalCombined) * 100);
  const telePct = 100 - walkinPct;

  const maxTotal = 900;

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
      className="p-6 sm:p-7 relative select-none h-full flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-100 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse" />
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Walk-In vs. Telehealth Consultations
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Consultation volume comparison by channel (In-Person OPD Lobby vs. Virtual Tele-Clinic)
            </p>
          </div>

          {/* Time range selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs transition-colors cursor-pointer"
            >
              <Calendar size={13} className="text-teal-700" />
              <span>{selectedFilter}</span>
              <ChevronDown size={13} className="text-slate-400" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-1.5 w-36 bg-white border border-slate-200 rounded-xl shadow-xl p-1 z-30 text-xs">
                {["Weekly", "Monthly", "Yearly"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setSelectedFilter(item);
                      setShowDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      selectedFilter === item
                        ? "bg-teal-50 text-teal-800 font-bold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Channel Summary Pills */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-teal-50/70 border border-teal-200/80 rounded-2xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                <Users size={16} />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-900 block">
                  Walk-In OPD
                </span>
                <span className="text-lg font-black text-teal-950 leading-tight">
                  {totalWalkin.toLocaleString()} ({walkinPct}%)
                </span>
              </div>
            </div>
            <span className="text-xs font-semibold text-teal-700 bg-white/80 px-2 py-0.5 rounded-[5px] border border-teal-200">
              Avg 14 min
            </span>
          </div>

          <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                <Video size={16} />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-900 block">
                  Tele-Consult
                </span>
                <span className="text-lg font-black text-indigo-950 leading-tight">
                  {totalTele.toLocaleString()} ({telePct}%)
                </span>
              </div>
            </div>
            <span className="text-xs font-semibold text-indigo-700 bg-white/80 px-2 py-0.5 rounded-[5px] border border-indigo-200">
              Avg 9 min
            </span>
          </div>
        </div>

        {/* Dual Bar Chart Comparison */}
        <div className="mt-6 pt-2">
          <div className="h-52 flex items-end justify-between gap-3 sm:gap-4 px-2">
            {weeklyData.map((item, idx) => {
              const walkinHeight = Math.round((item.walkin / maxTotal) * 100);
              const teleHeight = Math.round((item.tele / maxTotal) * 100);
              const isHovered = hoveredDay === item.day;

              return (
                <div
                  key={item.day}
                  onMouseEnter={() => setHoveredDay(item.day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                >
                  {/* Tooltip on Hover */}
                  {isHovered && (
                    <div className="absolute -top-16 bg-slate-900 text-white text-[11px] rounded-xl px-3 py-1.5 shadow-xl z-20 whitespace-nowrap pointer-events-none">
                      <div className="font-bold border-b border-slate-700 pb-0.5 mb-0.5 flex justify-between gap-2">
                        <span>{item.day} Total:</span>
                        <span className="text-teal-300 font-mono">{item.total} pts</span>
                      </div>
                      <div className="text-slate-300 text-[10px]">
                        Walk-in: <strong className="text-teal-400">{item.walkin}</strong> • Tele:{" "}
                        <strong className="text-indigo-300">{item.tele}</strong>
                      </div>
                    </div>
                  )}

                  {/* Dual Bars side-by-side with Scroll-Reveal Growth */}
                  <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-full pb-2">
                    {/* Walkin Bar (Teal) */}
                    <div
                      style={{
                        height: `${walkinHeight}%`,
                        transitionDelay: `${idx * 80}ms`,
                      }}
                      className="w-1/2 max-w-[20px] rounded-t-[5px] bg-gradient-to-t from-teal-800 to-teal-500 group-hover:brightness-110 shadow-xs relative chart-bar-v"
                    >
                      <span className="hidden sm:block text-[9px] font-mono text-white text-center font-bold pt-1">
                        {item.walkin}
                      </span>
                    </div>

                    {/* Tele Bar (Indigo) */}
                    <div
                      style={{
                        height: `${teleHeight}%`,
                        transitionDelay: `${idx * 80 + 40}ms`,
                      }}
                      className="w-1/2 max-w-[20px] rounded-t-[5px] bg-gradient-to-t from-indigo-700 to-indigo-400 group-hover:brightness-110 shadow-xs relative chart-bar-v"
                    >
                      <span className="hidden sm:block text-[9px] font-mono text-white text-center font-bold pt-1">
                        {item.tele}
                      </span>
                    </div>
                  </div>

                  {/* Day Label */}
                  <div className="text-center pt-1 border-t border-slate-200 w-full">
                    <span
                      className={`text-xs font-bold block ${
                        item.day === "Tue"
                          ? "text-rose-600 font-extrabold"
                          : item.day === "Fri"
                          ? "text-blue-700"
                          : "text-slate-700"
                      }`}
                    >
                      {item.day}
                    </span>
                    <span className="text-[9px] text-slate-400 block -mt-0.5">
                      {item.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Legend */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-3 h-3 rounded-[5px] bg-teal-600 inline-block" />
            <span>Walk-In (In-Person)</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-3 h-3 rounded-[5px] bg-indigo-500 inline-block" />
            <span>Telehealth Consultation</span>
          </div>
        </div>
        <span className="text-[11px] font-medium text-slate-400">
          Tuesday is Lowest Volume • Friday is Weekly Average
        </span>
      </div>
    </div>
  );
}
