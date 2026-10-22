import React, { useState } from "react";
import {
  GitPullRequest,
  Users,
  ChevronDown,
  ArrowDownLeft,
  Building2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
} from "lucide-react";

/**
 * Referrals received by Dr. Rajesh Sharma (General Medicine)
 */
const REFERRALS_DATA = {
  monthly: {
    periodLabel: "Past 30 Days",
    totalReferrals: 48,
    pendingEvaluation: 9,
    completedEvaluation: 35,
    highPriority: 8,
    departments: [
      { name: "Cardiology", count: 14, doctor: "Dr. Arvind Swamy", color: "from-rose-500 to-rose-600", lightBg: "bg-rose-50", textColor: "text-rose-700" },
      { name: "Orthopedics", count: 11, doctor: "Dr. Meera Iyer", color: "from-blue-500 to-blue-600", lightBg: "bg-blue-50", textColor: "text-blue-700" },
      { name: "Gynecology & OB", count: 9, doctor: "Dr. Sunita Rao", color: "from-purple-500 to-purple-600", lightBg: "bg-purple-50", textColor: "text-purple-700" },
      { name: "General Surgery", count: 7, doctor: "Dr. V. K. Bansal", color: "from-amber-500 to-amber-600", lightBg: "bg-amber-50", textColor: "text-amber-700" },
      { name: "Emergency Triage", count: 5, doctor: "Dr. Sameer Khan", color: "from-emerald-500 to-emerald-600", lightBg: "bg-emerald-50", textColor: "text-emerald-700" },
      { name: "Oncology Daycare", count: 2, doctor: "Dr. Anita Desai", color: "from-indigo-500 to-indigo-600", lightBg: "bg-indigo-50", textColor: "text-indigo-700" },
    ],
  },
  weekly: {
    periodLabel: "13 Oct – 19 Oct 2026",
    totalReferrals: 12,
    pendingEvaluation: 3,
    completedEvaluation: 8,
    highPriority: 2,
    departments: [
      { name: "Cardiology", count: 4, doctor: "Dr. Arvind Swamy", color: "from-rose-500 to-rose-600", lightBg: "bg-rose-50", textColor: "text-rose-700" },
      { name: "Orthopedics", count: 3, doctor: "Dr. Meera Iyer", color: "from-blue-500 to-blue-600", lightBg: "bg-blue-50", textColor: "text-blue-700" },
      { name: "Gynecology & OB", count: 2, doctor: "Dr. Sunita Rao", color: "from-purple-500 to-purple-600", lightBg: "bg-purple-50", textColor: "text-purple-700" },
      { name: "General Surgery", count: 2, doctor: "Dr. V. K. Bansal", color: "from-amber-500 to-amber-600", lightBg: "bg-amber-50", textColor: "text-amber-700" },
      { name: "Emergency Triage", count: 1, doctor: "Dr. Sameer Khan", color: "from-emerald-500 to-emerald-600", lightBg: "bg-emerald-50", textColor: "text-emerald-700" },
    ],
  },
};

export default function ReferralsToMeGraph() {
  const [period, setPeriod] = useState("monthly");
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeDept, setActiveDept] = useState(null);

  const data = REFERRALS_DATA[period] || REFERRALS_DATA.monthly;
  const maxCount = Math.max(...data.departments.map((d) => d.count), 1);

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
                <span>Inbound Referrals to Me</span>
              </h3>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-[5px] bg-teal-50 text-teal-800 border border-teal-200">
                Cross-Dept
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Patients routed to General Medicine by other clinical departments
            </p>
          </div>

          {/* Period Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl text-xs font-bold text-slate-700 shadow-2xs transition-all cursor-pointer"
            >
              <Calendar size={13} className="text-teal-700" />
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
                        ? "bg-teal-50 text-teal-800 font-bold"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>{item.label}</span>
                    {period === item.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── KPI Badges ── */}
        <div className="grid grid-cols-3 gap-3 my-5">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10.5px] uppercase font-bold text-slate-400 block tracking-wider">
              Total Inbound
            </span>
            <strong className="text-xl font-black text-slate-900 font-mono mt-0.5 block">
              {data.totalReferrals}
            </strong>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50/50 border border-amber-100">
            <span className="text-[10.5px] uppercase font-bold text-amber-700 block tracking-wider flex items-center gap-1">
              <Clock size={11} />
              <span>Pending Review</span>
            </span>
            <strong className="text-xl font-black text-amber-900 font-mono mt-0.5 block">
              {data.pendingEvaluation}
            </strong>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100">
            <span className="text-[10.5px] uppercase font-bold text-emerald-700 block tracking-wider flex items-center gap-1">
              <CheckCircle2 size={11} />
              <span>Evaluated & Rx</span>
            </span>
            <strong className="text-xl font-black text-emerald-900 font-mono mt-0.5 block">
              {data.completedEvaluation}
            </strong>
          </div>
        </div>

        {/* ── Interactive Horizontal Department Referral Bars ── */}
        <div className="space-y-3 pt-2">
          {data.departments.map((dept, idx) => {
            const percentage = Math.round((dept.count / maxCount) * 100);
            const isHovered = activeDept === dept.name;

            return (
              <div
                key={dept.name}
                onMouseEnter={() => setActiveDept(dept.name)}
                onMouseLeave={() => setActiveDept(null)}
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  isHovered ? "bg-slate-50 ring-1 ring-teal-300" : "hover:bg-slate-50/60"
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{dept.name}</span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      via {dept.doctor}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <strong className="font-mono font-bold text-slate-900 text-sm">
                      {dept.count}
                    </strong>
                    <span className="text-[10.5px] text-slate-400">cases</span>
                  </div>
                </div>

                {/* Horizontal Bar with Scroll-Reveal Growth */}
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                  <div
                    style={{
                      width: `${percentage}%`,
                      transitionDelay: `${idx * 80}ms`,
                    }}
                    className={`h-full rounded-full bg-gradient-to-r ${dept.color} chart-bar-h shadow-2xs`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Footer Insight ── */}
      <div className="pt-4 border-t border-slate-100 mt-5 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1 text-[11px]">
          <Building2 size={13} className="text-teal-700" />
          <span>Top Referring Dept: <strong>Cardiology (HTN/Metabolic)</strong></span>
        </span>
        <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-[5px] border border-teal-200">
          Fast-Track OPD Active
        </span>
      </div>
    </div>
  );
}
