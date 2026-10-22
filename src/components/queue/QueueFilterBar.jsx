import React from "react";
import {
  Search,
  X,
  Users,
  Video,
  FlaskConical,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Check,
  RotateCcw,
} from "lucide-react";

/**
 * QueueFilterBar (Styled like /insights route)
 * --------------------------------------------
 * - Removed frequent searches "Filter:" chips
 * - Multi-select support for all queue pools
 * - Glassmorphic design language with pill badges & check indicators
 */
export default function QueueFilterBar({
  searchQuery = "",
  onSearchChange = () => {},
  selectedFilters = ["all"], // Array of selected pool IDs (e.g. ['waiting_in_person', 'tele_consultation'])
  onToggleFilter = () => {},
  onSelectAll = () => {},
  filterCounts = {},
  showDictionary = false,
  onToggleDictionary = () => {},
}) {
  const isAllSelected =
    selectedFilters.includes("all") ||
    selectedFilters.length === 0;

  const filterOptions = [
    {
      id: "all",
      label: "All Queue",
      icon: Users,
      count: filterCounts.all ?? 0,
      isAllBtn: true,
    },
    {
      id: "waiting_in_person",
      label: "Waiting Pool (Lobby)",
      icon: Users,
      count: filterCounts.waiting_in_person ?? 0,
    },
    {
      id: "tele_consultation",
      label: "Tele-Consultations",
      icon: Video,
      count: filterCounts.tele_consultation ?? 0,
    },
    {
      id: "draft_labs",
      label: "Sent for Labs",
      icon: FlaskConical,
      count: filterCounts.draft_labs ?? 0,
    },
    {
      id: "completed",
      label: "Completed",
      icon: CheckCircle2,
      count: filterCounts.completed ?? 0,
    },
    {
      id: "no_show",
      label: "No-Show / Cancelled",
      icon: AlertTriangle,
      count: filterCounts.no_show ?? 0,
      alert: true,
    },
  ];

  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: "1px solid rgba(0, 0, 0, 0.07)",
        borderRadius: 18,
        boxShadow: "0 2px 20px rgba(0, 0, 0, 0.04)",
      }}
      className="p-4 sm:p-5 space-y-3.5"
    >
      {/* Row 1: Search Input & Utility Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input styled like /insights */}
        <div
          style={{
            background: "rgba(0, 0, 0, 0.03)",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            borderRadius: 12,
          }}
          className="relative flex-1 max-w-xl flex items-center px-3.5 py-2 transition-all focus-within:border-indigo-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/15"
        >
          <Search size={14} color="#94a3b8" className="shrink-0 pointer-events-none mr-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by Patient Name, UHID (e.g. 10482), or Token (#W-04)..."
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 12,
              color: "#0f172a",
              width: "100%",
            }}
            className="placeholder:text-slate-400 font-medium"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200/60 transition-colors ml-2"
              title="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Right Toolbar Action: Clinical Dictionary & Reset link */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {!isAllSelected && (
            <button
              type="button"
              onClick={onSelectAll}
              style={{
                background: "rgba(99, 102, 241, 0.08)",
                border: "1px solid rgba(99, 102, 241, 0.2)",
                color: "#4f46e5",
                borderRadius: 10,
                padding: "6px 12px",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                transition: "all 0.15s",
              }}
              title="Show all queue pools"
            >
              <RotateCcw size={11} />
              <span>Reset to All</span>
            </button>
          )}

          <button
            type="button"
            onClick={onToggleDictionary}
            style={{
              background: showDictionary ? "rgba(99, 102, 241, 0.08)" : "rgba(0, 0, 0, 0.03)",
              border: showDictionary ? "1px solid rgba(99, 102, 241, 0.35)" : "1px solid rgba(0, 0, 0, 0.07)",
              color: showDictionary ? "#4f46e5" : "#475569",
              borderRadius: 10,
              padding: "7px 13px",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              transition: "all 0.15s",
            }}
            title="Toggle Clinical Dictionary Shortcuts"
          >
            <BookOpen size={13} color={showDictionary ? "#4f46e5" : "#64748b"} />
            <span>Clinical Dictionary</span>
          </button>
        </div>
      </div>

      {/* Row 2: Multi-Select Queue Pool Pills (Insights-style pills) */}
      <div className="pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap">
        {filterOptions.map((opt) => {
          const Icon = opt.icon;
          const isSelected = opt.isAllBtn
            ? isAllSelected
            : selectedFilters.includes(opt.id) && !isAllSelected;

          const isAlert = opt.alert;

          const activeStyle = isAlert
            ? {
                background: "linear-gradient(135deg, rgba(244, 63, 94, 0.12), rgba(225, 29, 72, 0.08))",
                border: "1px solid rgba(244, 63, 94, 0.35)",
                color: "#e11d48",
                boxShadow: "0 2px 8px rgba(244, 63, 94, 0.10)",
              }
            : {
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(139, 92, 246, 0.08))",
                border: "1px solid rgba(99, 102, 241, 0.32)",
                color: "#4f46e5",
                boxShadow: "0 2px 8px rgba(99, 102, 241, 0.10)",
              };

          const inactiveStyle = {
            background: "rgba(0, 0, 0, 0.025)",
            border: "1px solid rgba(0, 0, 0, 0.06)",
            color: "#475569",
          };

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                if (opt.isAllBtn) {
                  onSelectAll();
                } else {
                  onToggleFilter(opt.id);
                }
              }}
              style={{
                ...(isSelected ? activeStyle : inactiveStyle),
                padding: "6px 12px",
                borderRadius: 10,
                fontSize: 12,
                fontWeight: isSelected ? 700 : 500,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              className="hover:scale-[1.01] active:scale-[0.98]"
            >
              {isSelected ? (
                <Check size={12} strokeWidth={2.6} color={isAlert ? "#e11d48" : "#4f46e5"} />
              ) : (
                <Icon size={12} color="#64748b" />
              )}
              <span>{opt.label}</span>
              <span
                style={{
                  background: isSelected
                    ? isAlert
                      ? "rgba(244, 63, 94, 0.18)"
                      : "rgba(99, 102, 241, 0.18)"
                    : "rgba(0, 0, 0, 0.05)",
                  color: isSelected ? (isAlert ? "#e11d48" : "#4f46e5") : "#64748b",
                  borderRadius: 999,
                  padding: "1px 7px",
                  fontSize: 10.5,
                  fontWeight: 700,
                  fontFamily: "monospace",
                }}
              >
                {opt.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
