import React, { useState, useEffect } from "react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  ScreenShare,
  UserPlus,
  PhoneOff,
  Maximize2,
  Minimize2,
  ShieldCheck,
  Signal,
  Copy,
  Check,
  X,
  Share2,
} from "lucide-react";

export default function TelehealthVideoDock({
  patient,
  onEndCall = () => {},
}) {
  const [isDockMinimized, setIsDockMinimized] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [callDuration, setCallDuration] = useState(145); // seconds

  // Ticking call timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCallTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const inviteUrl = `https://telehealth.citygeneral.hospital/room/${patient?.uhid || "rx-10482"}?token=sec_78932`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!patient) return null;

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-800 text-white flex flex-col transition-all">
      {/* Dock Header */}
      <div className="px-3.5 py-2 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-200 tracking-tight flex items-center gap-1.5">
            <span>Tele-Consult Room</span>
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/60">
              Live {formatCallTime(callDuration)}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Signal Indicator */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/80 text-[10px] text-slate-300 mr-1">
            <Signal className="w-3 h-3 text-emerald-400" />
            <span className="font-mono">1080p HD</span>
          </div>

          <button
            type="button"
            onClick={() => setIsDockMinimized(!isDockMinimized)}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isDockMinimized ? "Expand Video" : "Minimize Video"}
          >
            {isDockMinimized ? (
              <Maximize2 className="w-3.5 h-3.5" />
            ) : (
              <Minimize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Video Stream Stage (When not minimized) */}
      {!isDockMinimized && (
        <div className="relative bg-slate-950 h-44 sm:h-48 flex items-center justify-center overflow-hidden">
          {isVideoOn ? (
            /* Mock Patient Video Stream Visual */
            <div className="relative w-full h-full flex items-center justify-center bg-radial from-slate-800 to-slate-950">
              {/* Patient Avatar / Video Representation */}
              <div className="text-center">
                <div className="w-18 h-18 mx-auto rounded-full bg-teal-800/40 border-2 border-teal-500/60 flex items-center justify-center shadow-inner relative">
                  <span className="text-xl font-bold text-teal-200">
                    {patient.name?.charAt(0) || "P"}
                  </span>
                  {/* Subtle video glow ring */}
                  <span className="absolute inset-0 rounded-full border border-teal-400/40 animate-ping" />
                </div>
                <p className="mt-2 text-xs font-semibold text-slate-200">
                  {patient.name} ({patient.age}{patient.gender?.charAt(0)})
                </p>
                <p className="text-[10px] text-teal-400/80">
                  Remote Audio & Video Connected
                </p>
              </div>

              {/* PiP Self View (Doctor Preview) */}
              <div className="absolute top-2 right-2 w-20 h-14 bg-slate-800 rounded-lg border border-slate-700 shadow-md flex items-center justify-center overflow-hidden">
                <div className="text-[10px] text-slate-400 text-center font-semibold">
                  <div className="w-5 h-5 mx-auto rounded-full bg-slate-700 flex items-center justify-center text-[9px] text-slate-300 mb-0.5">
                    Dr
                  </div>
                  <span>You (Desk)</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-4 text-slate-500">
              <VideoOff className="w-8 h-8 mx-auto mb-1 text-slate-600" />
              <p className="text-xs font-semibold">Camera is paused</p>
            </div>
          )}

          {/* Screen Share Active Banner */}
          {isScreenSharing && (
            <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-blue-600/90 text-white rounded text-[10.5px] font-semibold flex items-center gap-1 shadow">
              <ScreenShare className="w-3 h-3" />
              <span>Prescription Screen Shared to Patient</span>
            </div>
          )}
        </div>
      )}

      {/* In-Call Controls Bar */}
      <div className="px-3 py-2 bg-slate-950 flex items-center justify-between border-t border-slate-800/80">
        <div className="flex items-center gap-1.5">
          {/* Mic Button */}
          <button
            type="button"
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className={`p-2 rounded-xl text-xs font-semibold transition-all ${
              isAudioMuted
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200"
            }`}
            title={isAudioMuted ? "Unmute Mic" : "Mute Mic"}
          >
            {isAudioMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Video Button */}
          <button
            type="button"
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`p-2 rounded-xl text-xs font-semibold transition-all ${
              !isVideoOn
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200"
            }`}
            title={isVideoOn ? "Turn Camera Off" : "Turn Camera On"}
          >
            {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
          </button>

          {/* Screen Share */}
          <button
            type="button"
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`p-2 rounded-xl text-xs font-semibold transition-all ${
              isScreenSharing
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
            title="Share Screen with Patient"
          >
            <ScreenShare className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Invite Multiple / Attendant */}
          <button
            type="button"
            onClick={() => setShowInviteModal(true)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700/60"
          >
            <UserPlus className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Invite</span>
          </button>

          {/* End Call Button */}
          <button
            type="button"
            onClick={onEndCall}
            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-sm"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span>End Call</span>
          </button>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Invite Participants</h4>
                  <p className="text-xs text-slate-400">
                    Add family members or medical translators to this call
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Secure Consultation Link
                </label>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-2">
                  <input
                    type="text"
                    readOnly
                    value={inviteUrl}
                    className="bg-transparent text-xs text-slate-300 font-mono flex-1 focus:outline-none select-all"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    {copiedLink ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedLink ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs text-slate-400 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p>
                  This room is end-to-end encrypted under NABH tele-consultation protocols. Maximum 4 participants allowed.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
