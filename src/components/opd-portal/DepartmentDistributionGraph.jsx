import React, { useState } from "react";
import { Activity, Stethoscope, Clock, ChevronDown, CheckCircle2 } from "lucide-react";

export default function DepartmentDistributionGraph() {
  const [selectedFilter, setSelectedFilter] = useState("Today");
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeDept, setActiveDept] = useState(null);

  const departments = [
    {
      id: "gen-med",
      name: "General Medicine",
      patients: 118,
      percentage: 34,
      avgWait: "12 min",
      doctors: 4,
      color: "bg-teal-600",
      textColor: "text-teal-700",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200",
    },
    {
      id: "cardio",
      name: "Cardiology",
      patients: 76,
      percentage: 22,
      avgWait: "18 min",
      doctors: 3,
      color: "bg-rose-500",
      textColor: "text-rose-700",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200",
    },
    {
      id: "peds",
      name: "Pediatrics",
      patients: 62,
      percentage: 18,
      avgWait: "8 min",
      doctors: 3,
      color: "bg-amber-500",
      textColor: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    {
      id: "ortho",
      name: "Orthopedics",
      patients: 48,
      percentage: 14,
      avgWait: "15 min",
      doctors: 2,
      color: "bg-indigo-600",
      textColor: "text-indigo-700",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
    },
    {
      id: "ent",
      name: "ENT & Ophthalmology",
      patients: 28,
      percentage: 8,
      avgWait: "10 min",
      doctors: 2,
      color: "bg-purple-600",
      textColor: "text-purple-700",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      id: "gyn",
      name: "Gynecology & Obs",
      patients: 16,
      percentage: 4,
      avgWait: "9 min",
      doctors: 1,
      color: "bg-emerald-600",
      textColor: "text-emerald-700",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
  ];

  const totalPatients = departments.reduce((acc, d) => acc + d.patients, 0);

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
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse" />
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Department Patient Census
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Specialty distribution, active doctor staffing, and triage-to-consultation wait times
            </p>
          </div>

          {/* Time range selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs transition-colors cursor-pointer"
            >
              <span>{selectedFilter}</span>
              <ChevronDown size={13} className="text-slate-400" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-1.5 w-36 bg-white border border-slate-200 rounded-xl shadow-xl p-1 z-30 text-xs">
                {["Today", "This Week", "This Month"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setSelectedFilter(item);
                      setShowDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      selectedFilter === item
                        ? "bg-purple-50 text-purple-800 font-bold"
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

        {/* Multi-Segment Distribution Bar */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
            <span>Overall OPD Specialty Allocation</span>
            <span className="font-mono font-bold text-slate-900">{totalPatients} Patients Active</span>
          </div>

          <div className="h-4 w-full rounded-full bg-slate-100 flex overflow-hidden p-0.5 gap-0.5 shadow-inner">
            {departments.map((dept) => (
              <div
                key={dept.id}
                style={{ width: `${dept.percentage}%` }}
                onMouseEnter={() => setActiveDept(dept.id)}
                onMouseLeave={() => setActiveDept(null)}
                className={`${dept.color} h-full first:rounded-l-full last:rounded-r-full transition-all duration-300 hover:opacity-85 cursor-pointer relative group`}
                title={`${dept.name}: ${dept.patients} pts (${dept.percentage}%)`}
              />
            ))}
          </div>
        </div>

        {/* Department Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
          {departments.map((dept) => {
            const isSelected = activeDept === dept.id;
            return (
              <div
                key={dept.id}
                onMouseEnter={() => setActiveDept(dept.id)}
                onMouseLeave={() => setActiveDept(null)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? `${dept.bgColor} ${dept.borderColor} shadow-xs scale-102`
                    : "bg-slate-50/70 border-slate-100 hover:bg-white hover:border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`w-2.5 h-2.5 rounded-full ${dept.color}`} />
                  <span className="text-[11px] font-mono font-bold text-slate-400">
                    {dept.percentage}%
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 mt-2 truncate">
                  {dept.name}
                </h4>

                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-lg font-extrabold text-slate-800">
                    {dept.patients}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Wait: <strong className={dept.textColor}>{dept.avgWait}</strong>
                  </span>
                </div>

                <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                  {dept.doctors} Doctor{dept.doctors > 1 ? "s" : ""} on duty
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="text-[11px] font-medium text-slate-400">
          General Medicine & Cardiology represent 56% of total hospital outpatient throughput
        </span>
        <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
          Optimal Capacity
        </span>
      </div>
    </div>
  );
}
