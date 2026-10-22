import React, { useState, useEffect, useRef } from "react";
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
  GripHorizontal,
  Move,
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

  // Draggable window coordinates
  const [position, setPosition] = useState(() => {
    const defaultX = typeof window !== "undefined" ? Math.max(20, window.innerWidth - 390) : 800;
    return { x: defaultX, y: 90 };
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ startMouseX: 0, startMouseY: 0, initialPosX: 0, initialPosY: 0 });

  // Ticking call timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Draggable logic
  const handleMouseDown = (e) => {
    // Only drag when clicking the header, not interactive controls
    if (e.target.closest("button") || e.target.closest("input")) return;
    setIsDragging(true);
    dragStartRef.current = {
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      initialPosX: position.x,
      initialPosY: position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.startMouseX;
      const dy = e.clientY - dragStartRef.current.startMouseY;

      const maxX = window.innerWidth - (isDockMinimized ? 220 : 360);
      const maxY = window.innerHeight - (isDockMinimized ? 60 : 280);

      setPosition({
        x: Math.max(10, Math.min(maxX, dragStartRef.current.initialPosX + dx)),
        y: Math.max(10, Math.min(maxY, dragStartRef.current.initialPosY + dy)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isDockMinimized]);

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
    <div
      style={{
        position: "fixed",
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 55,
      }}
      className={`bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700/80 text-white flex flex-col transition-shadow ${
        isDragging ? "ring-2 ring-teal-400 select-none cursor-grabbing shadow-teal-500/20" : ""
      } ${isDockMinimized ? "w-64" : "w-[350px] sm:w-[370px]"}`}
    >
      {/* Draggable Dock Header */}
      <div
        onMouseDown={handleMouseDown}
        className="px-3.5 py-2.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between cursor-grab active:cursor-grabbing select-none"
        title="Click and drag to move video window"
      >
        <div className="flex items-center gap-2 min-w-0">
          <GripHorizontal size={14} className="text-slate-500 shrink-0" />
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="text-xs font-bold text-slate-200 tracking-tight flex items-center gap-1.5 truncate">
            <span>Tele-Consult</span>
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/60 font-mono shrink-0">
              {formatCallTime(callDuration)}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Signal Indicator */}
          <div className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800/80 text-[10px] text-slate-300 mr-1">
            <Signal className="w-3 h-3 text-emerald-400" />
            <span className="font-mono">1080p</span>
          </div>

          <button
            type="button"
            onClick={() => setIsDockMinimized(!isDockMinimized)}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={isDockMinimized ? "Expand Video" : "Minimize Video"}
          >
            {isDockMinimized ? (
              <Maximize2 className="w-3.5 h-3.5" />
            ) : (
              <Minimize2 className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            type="button"
            onClick={onEndCall}
            className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer ml-0.5"
            title="Close / End Video Dock"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Video Stream Stage (When not minimized) */}
      {!isDockMinimized && (
        <div className="relative bg-slate-950 h-44 sm:h-48 flex items-center justify-center overflow-hidden">
          {isVideoOn ? (
            /* Mock Patient Video Stream Visual */
            <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-800 to-slate-950">
              {/* Patient Avatar / Video Representation */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-teal-800/40 border-2 border-teal-500/60 flex items-center justify-center shadow-inner relative">
                  <span className="text-xl font-bold text-teal-200">
                    {patient.name?.charAt(0) || "P"}
                  </span>
                  {/* Subtle video glow ring */}
                  <span className="absolute inset-0 rounded-full border border-teal-400/40 animate-ping" />
                </div>
                <p className="mt-2 text-xs font-semibold text-slate-200">
                  {patient.name} ({patient.age}{patient.gender?.charAt(0)})
                </p>
                <p className="text-[10px] text-teal-400/80 font-mono">
                  Encrypted HD WebRTC Stream
                </p>
              </div>

              {/* PiP Self View (Doctor Preview) */}
              <div className="absolute top-2 right-2 w-20 h-14 bg-slate-800/90 rounded-lg border border-slate-700 shadow-md flex items-center justify-center overflow-hidden">
                <div className="text-[10px] text-slate-400 text-center font-semibold">
                  <div className="w-5 h-5 mx-auto rounded-full bg-slate-700 flex items-center justify-center text-[9px] text-slate-300 mb-0.5">
                    Dr
                  </div>
                  <span>Desk 104</span>
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
            className={`p-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isAudioMuted
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200"
            }`}
            title={isAudioMuted ? "Unmute Mic" : "Mute Mic"}
          >
            {isAudioMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          </button>

          {/* Camera Button */}
          <button
            type="button"
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`p-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              !isVideoOn
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200"
            }`}
            title={isVideoOn ? "Turn Camera Off" : "Turn Camera On"}
          >
            {isVideoOn ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
          </button>

          {/* Screen Share */}
          <button
            type="button"
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`p-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isScreenSharing
                ? "bg-blue-600 text-white shadow"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200"
            }`}
            title={isScreenSharing ? "Stop Sharing Screen" : "Share Rx Sheet to Patient"}
          >
            <ScreenShare className="w-3.5 h-3.5" />
          </button>

          {/* Invite Family / Attendant Modal Trigger */}
          <button
            type="button"
            onClick={() => setShowInviteModal(!showInviteModal)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
            title="Invite Attendant / Specialist to Video Room"
          >
            <UserPlus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* End Call Button */}
        <button
          type="button"
          onClick={onEndCall}
          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer"
          title="Disconnect Video Telehealth Call"
        >
          <PhoneOff className="w-3 h-3" />
          <span>End</span>
        </button>
      </div>

      {/* Invite Modal Overlay */}
      {showInviteModal && (
        <div className="p-3 bg-slate-900 border-t border-slate-800 text-xs space-y-2 animate-fade-in">
          <div className="flex items-center justify-between text-slate-300">
            <span className="font-bold flex items-center gap-1">
              <Share2 className="w-3.5 h-3.5 text-teal-400" />
              Invite Attendant / Attending Physician
            </span>
            <button
              type="button"
              onClick={() => setShowInviteModal(false)}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            Share this secure 256-bit encrypted room link:
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={inviteUrl}
              className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-[10px] text-slate-300 font-mono select-all focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-2.5 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded font-bold text-xs flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copiedLink ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
