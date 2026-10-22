import React, { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  ArrowRight,
  CheckCircle2,
  Video,
  AlertCircle,
  FlaskConical,
  Stethoscope,
  ChevronRight,
} from "lucide-react";

export default function TodayAppointmentsCard({
  patients = [],
  onSelectPatient = () => {},
  onGoToAppointments = () => {},
}) {
  const [filter, setFilter] = useState("all");

  const filteredPatients = patients.filter((p) => {
    if (filter === "waiting") return p.queueStatus === "waiting";
    if (filter === "in_consultation") return p.queueStatus === "in_consultation";
    if (filter === "draft_labs") return p.queueStatus === "draft_labs";
    if (filter === "completed") return p.queueStatus === "completed";
    return true;
  });

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
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm border border-teal-200/80 shadow-2xs">
            <Calendar size={18} />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Today's Appointments</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono">
                {patients.length} Total
              </span>
            </h4>
            <p className="text-xs text-slate-500">Live queue & consultation schedule</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onGoToAppointments}
          className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 hover:underline cursor-pointer"
        >
          <span>Open Full Queue</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 py-3 overflow-x-auto text-xs scrollbar-none">
        {[
          { id: "all", label: "All" },
          { id: "waiting", label: "Waiting" },
          { id: "in_consultation", label: "In Consultation" },
          { id: "draft_labs", label: "At Lab" },
          { id: "completed", label: "Completed" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filter === tab.id
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Appointment Rows List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 divide-y divide-slate-100 max-h-[360px]">
        {filteredPatients.map((p) => {
          const isLive = p.queueStatus === "in_consultation";
          const isAtLab = p.queueStatus === "draft_labs";
          const isDone = p.queueStatus === "completed";
          const isWaiting = p.queueStatus === "waiting";

          return (
            <div
              key={p.id}
              className="pt-2.5 flex items-center justify-between gap-3 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors group"
            >
              {/* Left: Token & Demographics */}
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`w-11 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-2xs ${
                    isLive
                      ? "bg-teal-700 text-white animate-pulse"
                      : isAtLab
                      ? "bg-indigo-100 text-indigo-900"
                      : isDone
                      ? "bg-slate-200 text-slate-700"
                      : "bg-slate-100 text-slate-800"
                  }`}
                >
                  {p.tokenNumber}
                </span>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <strong className="text-xs font-bold text-slate-900 truncate">
                      {p.name}
                    </strong>
                    <span className="text-[11px] text-slate-400">
                      ({p.age}{p.gender?.charAt(0)})
                    </span>

                    {p.isPregnant && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-pink-100 text-pink-700">
                        Pregnant
                      </span>
                    )}
                    {p.allergies?.length > 0 && !p.allergies.includes("NKDA") && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-700">
                        Allergy
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {p.consultationType === "tele_consultation"
                      ? "📹 Video Tele-Consult"
                      : p.consultationType === "online_booking"
                      ? "🌐 Online Booking"
                      : "🚶 Walk-in Arrival"}{" "}
                    • Slot: {p.scheduledTime || "10:00 AM"}
                  </p>
                </div>
              </div>

              {/* Right: Status & Action Button */}
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full ${
                    isLive
                      ? "bg-emerald-100 text-emerald-800"
                      : isAtLab
                      ? "bg-indigo-100 text-indigo-800"
                      : isDone
                      ? "bg-slate-100 text-slate-600"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {isLive
                    ? "In Room"
                    : isAtLab
                    ? "Sent to Lab"
                    : isDone
                    ? "Completed"
                    : "Waiting"}
                </span>

                <button
                  type="button"
                  onClick={() => onSelectPatient(p.id)}
                  className={`p-1.5 sm:px-2.5 sm:py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    isLive
                      ? "bg-teal-700 hover:bg-teal-600 text-white shadow-xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  <span className="hidden sm:inline">
                    {isLive ? "Resume" : isDone ? "View" : "Open"}
                  </span>
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
