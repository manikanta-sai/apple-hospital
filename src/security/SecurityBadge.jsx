import React, { useState } from "react";
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Copy,
  Printer,
  Sparkles,
  X,
  Play,
} from "lucide-react";

/**
 * SecurityBadge
 * Discreet floating status HUD with an interactive control sheet for testing defenses.
 * Disabled by default in production.
 */
export default function SecurityBadge({
  isShieldActive,
  onToggleShield,
  onSimulateCapture,
  incidentCount,
  lastIncident,
  config,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Trigger Pill (Fixed Bottom-Left) */}
      <div className="fixed bottom-4 left-4 z-[99990] font-sans">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg border transition-all duration-200 text-xs font-medium ${
            isShieldActive
              ? "bg-slate-900/90 text-emerald-400 border-emerald-500/40 hover:bg-slate-900 hover:border-emerald-400"
              : "bg-rose-950/90 text-rose-300 border-rose-500/40 hover:bg-rose-950"
          }`}
          title="Click to view Security Status"
        >
          <span className="relative flex h-2 w-2">
            {isShieldActive && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isShieldActive ? "bg-emerald-500" : "bg-rose-500"
              }`}
            />
          </span>

          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="font-mono tracking-tight font-semibold">
            {isShieldActive ? "SECURITY ACTIVE" : "SECURITY PAUSED"}
          </span>

          {incidentCount > 0 && (
            <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
              {incidentCount} blocked
            </span>
          )}
        </button>
      </div>

      {/* Control Drawer / Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[99995] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-md bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 p-6 space-y-5 animate-scaleIn font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    Security & Privacy Guard
                  </h3>
                  <p className="text-xs text-slate-400">
                    Content protection & anti-capture shield
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Protection Layers List */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <div className="flex items-center gap-2.5">
                  <EyeOff className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-medium text-slate-200 block">
                      Screen Blackout On Capture
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Turns pitch-black on Snipping Tool, Win+Shift+S, or PrintScreen
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  ACTIVE
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <div className="flex items-center gap-2.5">
                  <Copy className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-medium text-slate-200 block">
                      Anti-Copy & Right-Click Shield
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Text selection, clipboard copy, and inspect menus blocked
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  ACTIVE
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-medium text-slate-200 block">
                      Forensic Dynamic Watermark
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Live session ID & timestamp tiled across viewport
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  ACTIVE
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <div className="flex items-center gap-2.5">
                  <Printer className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-medium text-slate-200 block">
                      Print-to-PDF Blocker
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Prints and PDF exports produce a blank canvas
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  ACTIVE
                </span>
              </div>
            </div>

            {/* Telemetry Log */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1.5 font-mono">
              <div className="flex items-center justify-between text-slate-400">
                <span>Interceptions Blocked:</span>
                <span className="text-emerald-400 font-bold">{incidentCount}</span>
              </div>
              {lastIncident && (
                <div className="pt-1 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <span className="text-slate-500">Last Blocked:</span>{" "}
                  <span className="text-slate-300 font-medium">{lastIncident.type}</span>{" "}
                  <span className="text-slate-500">({lastIncident.timestamp})</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  onSimulateCapture();
                  setIsOpen(false);
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-medium text-xs shadow-lg shadow-emerald-900/30 transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Test Screen Protection</span>
              </button>

              <button
                type="button"
                onClick={onToggleShield}
                className={`px-4 py-2.5 rounded-xl font-medium text-xs transition border ${
                  isShieldActive
                    ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                }`}
              >
                {isShieldActive ? "Pause Shield" : "Resume Shield"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
