import React from "react";
import {
  Search,
  X,
  Users,
  Video,
  Globe,
  FlaskConical,
  Footprints,
  CheckCircle2,
  AlertTriangle,
  Tag,
  BookOpen,
} from "lucide-react";

/**
 * QueueFilterBar (Redesigned & Spacious)
 * --------------------------------------
 * - Replaced "Waiting (Walk-in & Online)" with "Waiting Pool (Lobby)"
 * - Expansive layout with no cramped scroll arrows
 * - Clean shortcut filter chips & prominent status pills
 */
export default function QueueFilterBar({
  searchQuery = "",
  onSearchChange = () => {},
  activeFilter = "all",
  onFilterChange = () => {},
  filterCounts = {},
  showDictionary = false,
  onToggleDictionary = () => {},
}) {
  const frequentSearches = [
    { label: "Anita (2nd Tri)", query: "Anita" },
    { label: "Walk-in (Vikram)", query: "Vikram" },
    { label: "Online (Rajesh)", query: "Rajesh" },
    { label: "Tele (Sunita)", query: "Sunita" },
    { label: "Lab Orders", query: "Rahul" },
  ];

  const filterPills = [
    {
      id: "all",
      label: "All Queue",
      icon: Users,
      count: filterCounts.all ?? 0,
    },
    {
      id: "waiting_in_person",
      label: "Waiting Pool (Lobby)",
      icon: Users,
      count: filterCounts.waiting_in_person ?? 0,
      badgeColor: "bg-teal-100 text-teal-900",
    },
    {
      id: "tele_consultation",
      label: "Tele-Consultations",
      icon: Video,
      count: filterCounts.tele_consultation ?? 0,
      badgeColor: "bg-purple-100 text-purple-900",
    },
    {
      id: "draft_labs",
      label: "Sent for Labs",
      icon: FlaskConical,
      count: filterCounts.draft_labs ?? 0,
      badgeColor: "bg-indigo-100 text-indigo-900",
    },
    {
      id: "completed",
      label: "Completed",
      icon: CheckCircle2,
      count: filterCounts.completed ?? 0,
      badgeColor: "bg-slate-200 text-slate-800",
    },
    {
      id: "no_show",
      label: "No-Show / Cancelled",
      icon: AlertTriangle,
      count: filterCounts.no_show ?? 0,
      alert: true,
      badgeColor: "bg-rose-100 text-rose-900",
    },
  ];

  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid #e2e8f0",
        borderRadius: 20,
        boxShadow: "0 2px 14px rgba(0,0,0,0.02)",
      }}
      className="p-4 sm:p-5 space-y-3.5"
    >
      {/* Row 1: Search & Shortcut Chips + Dictionary Toggle */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-xl">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by Patient Name, UHID (e.g. 10482), or Token (#W-04)..."
            className="w-full pl-9 pr-9 py-2.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 transition-all placeholder:text-slate-400 shadow-2xs font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Shortcut Chips & Clinical Dictionary Toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Tag className="w-3 h-3 text-slate-400" /> Filter:
            </span>
            {frequentSearches.map((chip) => (
              <button
                key={chip.label}
                onClick={() => onSearchChange(chip.query)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100/80 hover:bg-sky-50 hover:text-sky-900 hover:border-sky-200 text-slate-600 border border-slate-200/60 transition-all whitespace-nowrap cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>

          <div className="h-5 w-[1px] bg-slate-200 hidden sm:block" />

          {/* Clinical Dictionary Toggle */}
          <button
            onClick={onToggleDictionary}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
              showDictionary
                ? "bg-sky-50 text-sky-800 border-sky-300 shadow-xs"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
            title="Toggle Clinical Dictionary Shortcuts"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-600" />
            <span>Clinical Dictionary</span>
          </button>
        </div>
      </div>

      {/* Row 2: Status Filter Pills (Wrap cleanly without broken scrollbars) */}
      <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100">
        {filterPills.map((pill) => {
          const Icon = pill.icon;
          const isActive = activeFilter === pill.id;

          return (
            <button
              key={pill.id}
              onClick={() => onFilterChange(pill.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isActive
                  ? pill.alert
                    ? "bg-rose-900 text-white shadow-xs"
                    : "bg-slate-900 text-white shadow-xs"
                  : pill.alert
                  ? "bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200"
                  : "bg-slate-100/90 text-slate-700 hover:bg-slate-200/80 border border-slate-200/60"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{pill.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : pill.badgeColor || "bg-slate-200 text-slate-800"
                }`}
              >
                {pill.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
