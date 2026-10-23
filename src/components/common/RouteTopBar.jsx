import React from "react";
import { ArrowLeft } from "lucide-react";

/**
 * RouteTopBar
 * Universal top bar header matching the design system in media_1792684589468_a556e91a.png:
 * - Square rounded back button (38x38, border, subtle hover state)
 * - Subtitle: Upper brand label (e.g. ABCD Multispecialty Hospital) + department/feature badge
 * - Title: Bold primary route header
 * - Right Controls: status indicators, action buttons, filters
 */
export default function RouteTopBar({
  onBack,
  backLabel = "Back to home",
  hospitalName = "ABCD Multispecialty Hospital",
  badge,
  badgeBg = "#e0f2fe",
  badgeColor = "#0369a1",
  title,
  subDescription,
  rightControls,
  sticky = true,
  maxWidth = 1600,
  className = "",
  style = {},
}) {
  return (
    <header
      className={`w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs ${
        sticky ? "sticky top-0 z-40" : "relative z-30"
      } ${className}`}
      style={{
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        ...style,
      }}
    >
      <div
        className="mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between flex-wrap gap-4"
        style={{ maxWidth }}
      >
        {/* Left Side: Back button + Title Stack */}
        <div className="flex items-center gap-3.5">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label={backLabel}
              title={backLabel}
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                background: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#475569",
                cursor: "pointer",
                transition: "all 0.15s ease",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f8fafc";
                e.currentTarget.style.borderColor = "#cbd5e1";
                e.currentTarget.style.color = "#0f172a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#ffffff";
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.color = "#475569";
              }}
            >
              <ArrowLeft size={18} strokeWidth={2.2} />
            </button>
          )}

          <div>
            {/* Top Subtitle Row */}
            <div className="flex items-center gap-2 flex-wrap">
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: "#0284c7",
                }}
              >
                {hospitalName}
              </span>
              {badge && (
                <span
                  style={{
                    fontSize: 11,
                    background: badgeBg,
                    color: badgeColor,
                    padding: "1px 8px",
                    borderRadius: 999,
                    fontWeight: 700,
                    letterSpacing: "0.01em",
                  }}
                >
                  {badge}
                </span>
              )}
            </div>

            {/* Bottom Title Row */}
            <h1
              style={{
                margin: "2px 0 0 0",
                fontSize: 20,
                fontWeight: 800,
                color: "#0f172a",
                letterSpacing: "-0.02em",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
              className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight"
            >
              {title}
            </h1>

            {subDescription && (
              <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                {subDescription}
              </div>
            )}
          </div>
        </div>

        {/* Right Controls Slot */}
        {rightControls && (
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            {rightControls}
          </div>
        )}
      </div>
    </header>
  );
}
