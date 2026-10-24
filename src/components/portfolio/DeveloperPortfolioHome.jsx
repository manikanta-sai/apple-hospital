import React, { useState } from "react";
import ScrollReveal from "../common/ScrollReveal.jsx";
import ScrollToTopButton from "../common/ScrollToTopButton.jsx";
import {
  Briefcase,
  FolderGit2,
  Cpu,
  Mail,
  Linkedin,
  Award,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Layers,
  ArrowUpRight,
  Code2,
  Stethoscope,
  BarChart3,
  Bot,
  Ticket,
  Link2,
  Copy,
  Check,
  Search,
  Building2,
  Smartphone,
  Globe,
  Database,
  Cloud,
  CheckCircle2,
  Share2,
} from "lucide-react";

export default function DeveloperPortfolioHome({ navigateTo }) {
  const [activeProjectTab, setActiveProjectTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedText, setCopiedText] = useState(null);

  const copyToClipboard = (text, label) => {
    navigator.clipboard?.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const liveInteractiveApps = [
    {
      id: "opd-consultation",
      title: "OPD Consultation & AI Digital Rx",
      tagline: "NABH digital prescription with Telugu translation, drug safety CDSS & queue routing.",
      path: "/opd-queue",
      badge: "Flagship Suite",
      badgeColor: "bg-teal-500 text-white",
      tags: ["Lobby Queue Desk", "NABH Rx", "Drug CDSS"],
      renderBanner: () => (
        <div className="relative w-full h-30 bg-gradient-to-br from-teal-800 via-teal-900 to-slate-950 p-4 flex flex-col justify-between overflow-hidden text-white rounded-t-2xl">
          <div className="flex items-center justify-between z-10 hidden">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/30">
              Dr. Rajesh Sharma, MD
            </span>
            <span className="text-[10px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full shadow-xs">
              Live Room 104
            </span>
          </div>

          <div className="z-10 flex items-end justify-between gap-2">
            <div className="space-y-0.5">
              <span className="text-2xl font-serif font-black italic text-teal-300 drop-shadow-sm leading-none block">
                ℞ Digital Pad
              </span>
              <span className="text-[11px] font-bold text-white block">
                Doxylamine + Pyridoxine
              </span>
              <span className="text-[9px] text-teal-200 block font-medium">
                1-0-1 • భోజనం తర్వాత (NABH Rx)
              </span>
            </div>

            {/* Attractive 3D Product Objects: Prescription Pad, Stethoscope & Pharma Capsules */}
            <div className="relative shrink-0">
              <svg viewBox="0 0 130 90" className="w-28 h-20 drop-shadow-xl overflow-visible">
                <defs>
                  <linearGradient id="clipGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#e2e8f0" />
                  </linearGradient>
                  <linearGradient id="stethGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#2dd4bf" />
                    <stop offset="100%" stopColor="#0f766e" />
                  </linearGradient>
                  <linearGradient id="pillGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#dc2626" />
                  </linearGradient>
                </defs>
                {/* Prescription Pad Base */}
                <rect x="14" y="6" width="56" height="72" rx="6" fill="#334155" />
                <rect x="18" y="14" width="48" height="60" rx="3" fill="url(#clipGrad)" />
                {/* Metal Clip Top */}
                <rect x="32" y="3" width="20" height="8" rx="2" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="0.5" />
                {/* Rx Header */}
                <text x="24" y="27" fill="#0d9488" fontSize="11" fontWeight="900" fontStyle="italic">℞</text>
                <line x1="34" y1="24" x2="58" y2="24" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                {/* Prescription Text Lines */}
                <line x1="24" y1="34" x2="58" y2="34" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="24" y1="41" x2="52" y2="41" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="24" y1="48" x2="56" y2="48" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="24" y1="55" x2="46" y2="55" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
                {/* NABH Verified Check Stamp */}
                <circle cx="52" cy="62" r="6" fill="#10b981" fillOpacity="0.25" stroke="#10b981" strokeWidth="1.2" />
                <path d="M49 62 l2 2 l4 -4" stroke="#10b981" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                {/* 3D Stethoscope looping around */}
                <path d="M78 26 C98 26 106 46 96 64 C86 80 72 70 70 54" fill="none" stroke="url(#stethGrad)" strokeWidth="3.5" strokeLinecap="round" />
                {/* Chrome Chestpiece */}
                <ellipse cx="70" cy="52" rx="8" ry="8" fill="#94a3b8" stroke="#e2e8f0" strokeWidth="1.5" />
                <circle cx="70" cy="52" r="4.5" fill="#0d9488" />
                {/* 3D Floating Capsule Pill */}
                <g transform="translate(86, 18) rotate(35)">
                  <rect x="0" y="0" width="10" height="18" rx="5" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="0.5" />
                  <path d="M0 9 h10 v4 a5 5 0 0 1 -10 0 z" fill="url(#pillGrad)" />
                  <line x1="2" y1="3" x2="2" y2="12" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                </g>
                {/* Floating Cyan Tablet */}
                <circle cx="108" cy="46" r="5.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.2" />
                <line x1="105" y1="46" x2="111" y2="46" stroke="#ffffff" strokeWidth="0.8" opacity="0.9" />
              </svg>
            </div>
          </div>

          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-emerald-400/20 rounded-full blur-xl pointer-events-none" />
        </div>
      ),
    },
    {
      id: "chatbot",
      title: "AI Patient Service & Clinical Chatbot",
      tagline: "Conversational AI assistant with smart doctor booking & medical FAQs.",
      path: "/chatbot",
      badge: "Conversational AI",
      badgeColor: "bg-fuchsia-600 text-white",
      tags: ["Natural Language", "Smart Scheduling", "Doctor Matching"],
      renderBanner: () => (
        <div className="relative w-full h-30 bg-gradient-to-br from-fuchsia-800 via-purple-900 to-slate-950 p-4 flex flex-col justify-between overflow-hidden text-white rounded-t-2xl">
          <div className="flex items-center justify-between z-10 hidden">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/30">
              AI Copilot
            </span>
            <span className="text-[10px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full shadow-xs">
              24/7 Available
            </span>
          </div>

          <div className="z-10 flex items-end justify-between gap-2 mt-auto">
            <div className="space-y-1">
              <div className="bg-white/15 backdrop-blur-xs px-2.5 py-1 rounded-xl rounded-bl-xs text-[10px] text-fuchsia-100 max-w-[170px]">
                "Book doctor Dr. Rajesh"
              </div>
              <div className="bg-purple-600/90 px-2.5 py-1 rounded-xl rounded-br-xs text-[10px] text-white font-medium max-w-[170px]">
                ✓ Confirmed today at 10 AM
              </div>
            </div>

            {/* Attractive 3D Product Objects: AI Medical Doctor Bot & Multi-Lingual Speech Bubbles */}
            <div className="relative shrink-0">
              <svg viewBox="0 0 130 90" className="w-28 h-20 drop-shadow-xl overflow-visible">
                <defs>
                  <linearGradient id="botGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#e0e7ff" />
                  </linearGradient>
                  <linearGradient id="visorGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#0284c7" />
                  </linearGradient>
                </defs>
                {/* 3D AI Medical Doctor Bot Head */}
                <g transform="translate(14, 14)">
                  <rect x="14" y="38" width="32" height="24" rx="8" fill="#4338ca" />
                  <path d="M22 44 C22 56 38 56 38 44" fill="none" stroke="#22d3ee" strokeWidth="2" />
                  <circle cx="30" cy="55" r="3" fill="#e0e7ff" stroke="#22d3ee" strokeWidth="1" />
                  <rect x="10" y="8" width="40" height="30" rx="10" fill="url(#botGrad)" stroke="#c7d2fe" strokeWidth="1" />
                  <rect x="15" y="14" width="30" height="15" rx="6" fill="url(#visorGrad)" />
                  <circle cx="24" cy="21" r="2.5" fill="#ffffff" />
                  <circle cx="36" cy="21" r="2.5" fill="#ffffff" />
                  <line x1="30" y1="8" x2="30" y2="2" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="30" cy="2" r="2.5" fill="#ec4899" />
                  <path d="M8 20 C6 20 6 26 8 26" fill="none" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" />
                </g>
                {/* Multi-Lingual Speech Bubbles (Telugu & English) */}
                <g transform="translate(68, 6)">
                  <rect x="4" y="4" width="54" height="20" rx="6" fill="#ffffff" stroke="#c084fc" strokeWidth="1" />
                  <text x="10" y="14" fill="#7e22ce" fontSize="6.5" fontWeight="bold">నమస్కారం! (Hello)</text>
                  <text x="10" y="21" fill="#64748b" fontSize="5.5">AI Triage Active</text>
                  <rect x="0" y="28" width="58" height="20" rx="6" fill="#7c3aed" />
                  <text x="6" y="38" fill="#ffffff" fontSize="6.5" fontWeight="bold">✓ Dr. Rajesh Booked</text>
                  <text x="6" y="45" fill="#e9d5ff" fontSize="5.5">10:00 AM Confirmed</text>
                  {/* Typing Indicator */}
                  <rect x="20" y="52" width="28" height="12" rx="6" fill="#f43f5e" />
                  <circle cx="28" cy="58" r="1.5" fill="#ffffff" />
                  <circle cx="34" cy="58" r="1.5" fill="#ffffff" />
                  <circle cx="40" cy="58" r="1.5" fill="#ffffff" />
                </g>
              </svg>
            </div>
          </div>

          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-fuchsia-500/20 rounded-full blur-xl pointer-events-none" />
        </div>
      ),
    },
    {
      id: "hospital-stats",
      title: "Hospital Stats & Floor Telemetry",
      tagline: "Interactive 3D isometric floors with real-time bed census & staffing ratios.",
      path: "/hospital-stats",
      badge: "Operations Analytics",
      badgeColor: "bg-purple-600 text-white",
      tags: ["3D Floors", "Bed Census", "Staffing"],
      renderBanner: () => (
        <div className="relative w-full h-30 bg-gradient-to-br from-purple-800 via-indigo-900 to-slate-950 p-4 flex flex-col justify-between overflow-hidden text-white rounded-t-2xl">
          <div className="flex items-center justify-between z-10 hidden">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/30">
              Floor Telemetry
            </span>
            <span className="text-[10px] font-bold bg-[#d8225e] text-white px-2 py-0.5 rounded-full shadow-xs">
              2nd Floor CONGESTED
            </span>
          </div>

          <div className="z-10 flex items-end justify-between gap-2 mt-auto">
            <div className="space-y-0.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-purple-200 leading-none">253</span>
                <span className="text-[10px] text-purple-300 font-medium">Admitted</span>
              </div>
              <span className="text-[10px] text-slate-300 block">
                678 Total Beds • 154 Doctors
              </span>
              <span className="text-[9px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Floor Census
              </span>
            </div>

            {/* Attractive 3D Product Objects: Isometric Hospital Floor Layers & Telemetry Hologram */}
            <div className="relative shrink-0">
              <svg viewBox="0 0 130 90" className="w-28 h-20 drop-shadow-xl overflow-visible">
                <defs>
                  <linearGradient id="floorGradSVG1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#0f766e" />
                  </linearGradient>
                  <linearGradient id="floorGradSVG2" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#e11d48" />
                    <stop offset="100%" stopColor="#9f1239" />
                  </linearGradient>
                  <linearGradient id="floorGradSVG3" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#0284c7" />
                  </linearGradient>
                </defs>
                {/* Isometric Stacked Hospital Layers */}
                <polygon points="55,68 90,54 65,44 30,58" fill="url(#floorGradSVG1)" stroke="#5eead4" strokeWidth="1" />
                <polygon points="55,54 90,40 65,30 30,44" fill="url(#floorGradSVG2)" stroke="#fda4af" strokeWidth="1.2" />
                <polygon points="55,40 90,26 65,16 30,30" fill="url(#floorGradSVG3)" stroke="#bae6fd" strokeWidth="1" />
                <polygon points="55,26 90,12 65,2 30,16" fill="#a855f7" stroke="#e9d5ff" strokeWidth="1" />
                {/* Glowing Hospital Cross Beacon on Top */}
                <g transform="translate(60, -2)">
                  <circle cx="5" cy="5" r="7" fill="#ffffff" stroke="#c084fc" strokeWidth="1.2" />
                  <path d="M3 5 h4 M5 3 v4" stroke="#a855f7" strokeWidth="1.8" strokeLinecap="round" />
                </g>
                {/* Holographic Telemetry Data Bars */}
                <g transform="translate(94, 26)">
                  <rect x="0" y="24" width="5" height="24" rx="2" fill="#38bdf8" opacity="0.85" />
                  <rect x="8" y="14" width="5" height="34" rx="2" fill="#818cf8" opacity="0.95" />
                  <rect x="16" y="6" width="5" height="42" rx="2" fill="#c084fc" />
                  <rect x="24" y="18" width="5" height="30" rx="2" fill="#34d399" opacity="0.9" />
                  <path d="M2 24 L10 14 L18 6 L26 18" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                </g>
              </svg>
            </div>
          </div>

          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-purple-500/20 rounded-full blur-xl pointer-events-none" />
        </div>
      ),
    },
    {
      id: "call-center",
      title: "Call Center & AI Agent Coaching Analytics",
      tagline: "Automated telephony call recording QA, quality scoring, and patient sentiment analytics.",
      path: "/insights",
      badge: "Telephony CRM",
      badgeColor: "bg-violet-700 text-white",
      tags: ["TATA / Exotel CRM", "Audio QA", "Sentiment AI"],
      renderBanner: () => (
        <div className="relative w-full h-30 bg-gradient-to-br from-violet-800 via-indigo-900 to-slate-950 p-4 flex flex-col justify-between overflow-hidden text-white rounded-t-2xl">
          <div className="flex items-center justify-between z-10 hidden">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/30">
              Telephony QA
            </span>
            <span className="text-[10px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full shadow-xs">
              Live Monitoring
            </span>
          </div>

          <div className="z-10 flex items-end justify-between gap-2 mt-auto">
            <div className="space-y-0.5">
              <span className="text-xl font-black text-violet-200 block">
                94% QA Score
              </span>
              <span className="text-[10px] text-slate-300 block">
                Agent Call Recording & Coaching
              </span>
              <span className="text-[9px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live PBX Connected
              </span>
            </div>

            {/* Attractive 3D Product Objects: Agent Headset, Telephony Audio Equalizer & QA Card */}
            <div className="relative shrink-0">
              <svg viewBox="0 0 130 90" className="w-28 h-20 drop-shadow-xl overflow-visible">
                <defs>
                  <linearGradient id="headsetGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#c084fc" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
                {/* 3D Agent Headset */}
                <g transform="translate(10, 10)">
                  <path d="M12 36 A20 20 0 0 1 52 36" fill="none" stroke="url(#headsetGrad)" strokeWidth="4" strokeLinecap="round" />
                  <rect x="8" y="30" width="8" height="18" rx="4" fill="#581c87" stroke="#e9d5ff" strokeWidth="1" />
                  <rect x="48" y="30" width="8" height="18" rx="4" fill="#581c87" stroke="#e9d5ff" strokeWidth="1" />
                  <path d="M12 44 Q20 54 34 52" fill="none" stroke="#e9d5ff" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="36" cy="52" r="3.5" fill="#ec4899" stroke="#ffffff" strokeWidth="1" />
                </g>
                {/* Telephony Sound Waveform & QA Card */}
                <g transform="translate(64, 8)">
                  <rect x="0" y="0" width="58" height="42" rx="6" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="1" />
                  <text x="6" y="10" fill="#a78bfa" fontSize="5" fontWeight="bold">TELEPHONY QA</text>
                  <text x="6" y="21" fill="#34d399" fontSize="10.5" fontWeight="900" fontFamily="monospace">94% POS</text>
                  <text x="6" y="29" fill="#cbd5e1" fontSize="5">Sentiment: High Empathy</text>
                  {/* Equalizer sound bars */}
                  <g transform="translate(6, 32)">
                    <line x1="2" y1="5" x2="2" y2="1" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="7" y1="5" x2="7" y2="-2" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="12" y1="5" x2="12" y2="3" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="17" y1="5" x2="17" y2="-3" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="22" y1="5" x2="22" y2="2" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="27" y1="5" x2="27" y2="-1" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="32" y1="5" x2="32" y2="3" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="37" y1="5" x2="37" y2="-2" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="42" y1="5" x2="42" y2="1" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
                  </g>
                </g>
                {/* Call In Progress Badge */}
                <g transform="translate(18, 62)">
                  <rect x="0" y="0" width="84" height="15" rx="7.5" fill="#047857" stroke="#10b981" strokeWidth="0.8" />
                  <circle cx="8" cy="7.5" r="2.5" fill="#ffffff" />
                  <text x="14" y="10.5" fill="#ffffff" fontSize="6" fontWeight="bold">04:18 • Recording Monitored</text>
                </g>
              </svg>
            </div>
          </div>

          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-purple-500/20 rounded-full blur-xl pointer-events-none" />
        </div>
      ),
    },
    {
      id: "omnichannel-crm",
      title: "Omnichannel CRM & Unified Inbox",
      tagline: "Intercom & WhatsApp Business inbox across 7 channels with patient 360° profile, internal notes & SLA desk.",
      path: "/crm",
      badge: "Flagship CRM",
      badgeColor: "bg-teal-600 text-white",
      tags: ["WhatsApp Business", "7-Channel Inbox", "Patient 360°", "SLA Desk"],
      renderBanner: () => (
        <div className="relative w-full h-30 bg-gradient-to-br from-slate-900 via-teal-950 to-slate-950 p-4 flex flex-col justify-between overflow-hidden text-white rounded-t-2xl">
          <div className="flex items-center justify-between z-10 hidden">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              7 Channels Live
            </span>
            <span className="text-[10px] font-bold bg-teal-500 text-white px-2 py-0.5 rounded-full shadow-xs">
              Intercom / WhatsApp
            </span>
          </div>

          <div className="z-10 flex items-end justify-between gap-2 mt-auto">
            <div className="space-y-0.5">
              <span className="text-xl font-black text-teal-200 block">
                ABCD CRM Pro
              </span>
              <span className="text-[10px] text-slate-300 block">
                WhatsApp • Meta • Email • Chat
              </span>
              <span className="text-[9px] text-emerald-400 font-semibold flex items-center gap-1">
                <span>★ 4.92 CSAT</span>
                <span>•</span>
                <span>&lt; 2m First Response SLA</span>
              </span>
            </div>

            {/* Attractive 3D Product Objects: Omnichannel Chat Stream, Yellow Note Sticky & Channel Badges */}
            <div className="relative shrink-0">
              <svg viewBox="0 0 130 90" className="w-28 h-20 drop-shadow-xl overflow-visible">
                <defs>
                  <linearGradient id="waGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#25D366" />
                    <stop offset="100%" stopColor="#128C7E" />
                  </linearGradient>
                  <linearGradient id="crmPanelGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="100%" stopColor="#0f172a" />
                  </linearGradient>
                </defs>
                {/* 3-Panel Mini Preview Window */}
                <rect x="6" y="6" width="118" height="74" rx="8" fill="url(#crmPanelGrad)" stroke="#334155" strokeWidth="1" />
                {/* Window Top Controls */}
                <circle cx="14" cy="13" r="2" fill="#ef4444" />
                <circle cx="20" cy="13" r="2" fill="#f59e0b" />
                <circle cx="26" cy="13" r="2" fill="#10b981" />
                <line x1="6" y1="19" x2="124" y2="19" stroke="#334155" strokeWidth="0.8" />
                {/* Left Mini Rail */}
                <rect x="9" y="23" width="26" height="52" rx="3" fill="#0f172a" />
                <rect x="12" y="27" width="20" height="4" rx="1.5" fill="#38bdf8" />
                <rect x="12" y="34" width="20" height="7" rx="2" fill="#1e293b" />
                <rect x="12" y="44" width="20" height="7" rx="2" fill="#1e293b" />
                <rect x="12" y="54" width="20" height="7" rx="2" fill="#1e293b" />
                {/* Center Chat Bubble (Patient Incoming) */}
                <rect x="39" y="24" width="46" height="14" rx="4" fill="#334155" />
                <text x="43" y="33" fill="#cbd5e1" fontSize="4.5">Can I reschedule OPD?</text>
                {/* Internal Yellow Note Card (Mockup Signature!) */}
                <rect x="39" y="41" width="48" height="16" rx="4" fill="#fef3c7" stroke="#fcd34d" strokeWidth="0.8" />
                <text x="43" y="49" fill="#92400e" fontSize="4" fontWeight="bold">NOTE: Dr. Rao in OT</text>
                <text x="43" y="54" fill="#b45309" fontSize="3.5">Suggest 4 PM slot</text>
                {/* Agent Reply Bubble with WhatsApp Green accent */}
                <rect x="49" y="60" width="38" height="14" rx="4" fill="url(#waGrad)" />
                <text x="53" y="68" fill="#ffffff" fontSize="4" fontWeight="bold">Confirmed for 4 PM ✓✓</text>
                {/* Right 360 Profile Mini Card */}
                <rect x="90" y="23" width="31" height="52" rx="3" fill="#1e293b" />
                <circle cx="105" cy="32" r="5" fill="#0d9488" />
                <rect x="95" y="40" width="21" height="3" rx="1" fill="#94a3b8" />
                <rect x="95" y="46" width="16" height="2.5" rx="1" fill="#64748b" />
                <rect x="94" y="52" width="23" height="7" rx="2" fill="#0d9488" />
                <text x="96" y="57" fill="#ffffff" fontSize="3.5" fontWeight="bold">BOOK OPD</text>
                <rect x="94" y="62" width="23" height="7" rx="2" fill="#3b82f6" />
                <text x="96" y="67" fill="#ffffff" fontSize="3.5" fontWeight="bold">PAY LINK</text>
              </svg>
            </div>
          </div>

          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-teal-500/20 rounded-full blur-xl pointer-events-none" />
        </div>
      ),
    },
    {
      id: "url-generator",
      title: "Healthcare Smart URL & QR Generator",
      tagline: "Encrypted short links & dynamic QR codes for lab reports & patient portals.",
      path: "/url-generator",
      badge: "Utility Suite",
      badgeColor: "bg-emerald-600 text-white",
      tags: ["Dynamic QR", "Secure Short URLs", "Lab Reports"],
      renderBanner: () => (
        <div className="relative w-full h-30 bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-950 p-4 flex flex-col justify-between overflow-hidden text-white rounded-t-2xl">
          <div className="flex items-center justify-between z-10 hidden">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/30">
              HIPAA Compliant
            </span>
            <span className="text-[10px] font-bold bg-teal-500 text-white px-2 py-0.5 rounded-full shadow-xs">
              Instant QR
            </span>
          </div>

          <div className="z-10 flex items-end justify-between gap-2 mt-auto">
            <div className="space-y-0.5">
              <span className="text-xs font-mono font-bold text-emerald-300 block">
                abcd.health/s/rx-104
              </span>
              <span className="text-[10px] text-slate-300 block">
                Digital Lab Report & WhatsApp
              </span>
              <span className="text-[9px] text-emerald-400 font-semibold">
                🔒 256-bit Encrypted Token
              </span>
            </div>

            {/* Attractive 3D Product Objects: Clinical Lab Test Tube, Dynamic QR Code & Encrypted Padlock */}
            <div className="relative shrink-0">
              <svg viewBox="0 0 130 90" className="w-28 h-20 drop-shadow-xl overflow-visible">
                <defs>
                  <linearGradient id="tubeLiquid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2dd4bf" />
                    <stop offset="100%" stopColor="#0f766e" />
                  </linearGradient>
                </defs>
                {/* 3D Clinical Lab Test Tube */}
                <g transform="translate(14, 10) rotate(18)">
                  <rect x="10" y="10" width="16" height="52" rx="8" fill="rgba(255,255,255,0.2)" stroke="#99f6e4" strokeWidth="1.2" />
                  <path d="M11 30 Q18 28 25 30 L25 54 A7 7 0 0 1 11 54 Z" fill="url(#tubeLiquid)" />
                  <rect x="8" y="6" width="20" height="6" rx="2" fill="#0d9488" stroke="#14b8a6" strokeWidth="1" />
                  <line x1="21" y1="36" x2="25" y2="36" stroke="#ffffff" strokeWidth="1" />
                  <line x1="19" y1="42" x2="25" y2="42" stroke="#ffffff" strokeWidth="1" />
                  <line x1="21" y1="48" x2="25" y2="48" stroke="#ffffff" strokeWidth="1" />
                  <circle cx="18" cy="40" r="1.5" fill="#ffffff" opacity="0.7" />
                </g>
                {/* 3D Dynamic QR Code Plate with Laser Scan Line */}
                <g transform="translate(60, 8)">
                  <rect x="0" y="0" width="52" height="52" rx="8" fill="#ffffff" stroke="#14b8a6" strokeWidth="1.5" />
                  <rect x="6" y="6" width="12" height="12" fill="#0f172a" />
                  <rect x="8" y="8" width="8" height="8" fill="#ffffff" />
                  <rect x="10" y="10" width="4" height="4" fill="#0d9488" />

                  <rect x="34" y="6" width="12" height="12" fill="#0f172a" />
                  <rect x="36" y="8" width="8" height="8" fill="#ffffff" />
                  <rect x="38" y="10" width="4" height="4" fill="#0d9488" />

                  <rect x="6" y="34" width="12" height="12" fill="#0f172a" />
                  <rect x="8" y="36" width="8" height="8" fill="#ffffff" />
                  <rect x="10" y="38" width="4" height="4" fill="#0d9488" />

                  <rect x="22" y="10" width="4" height="4" fill="#0f172a" />
                  <rect x="22" y="22" width="8" height="8" fill="#0d9488" />
                  <rect x="34" y="24" width="6" height="4" fill="#0f172a" />
                  <rect x="22" y="36" width="4" height="6" fill="#0f172a" />
                  <rect x="36" y="36" width="8" height="8" fill="#0d9488" />
                  {/* Laser Scan Line */}
                  <line x1="-2" y1="26" x2="54" y2="26" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
                </g>
                {/* 3D Encrypted Golden Padlock */}
                <g transform="translate(86, 50)">
                  <rect x="6" y="10" width="18" height="14" rx="3" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
                  <path d="M10 10 V6 A5 5 0 0 1 20 6 V10" fill="none" stroke="#eab308" strokeWidth="2" />
                  <circle cx="15" cy="16" r="2" fill="#713f12" />
                </g>
              </svg>
            </div>
          </div>

          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-emerald-500/20 rounded-full blur-xl pointer-events-none" />
        </div>
      ),
    },
    {
      id: "tokens",
      title: "OP Token Desk & Waiting Room",
      tagline: "Automated token generation, audio announcer, and waiting pool routing.",
      path: "/tokens",
      badge: "Queue Automation",
      badgeColor: "bg-amber-600 text-white",
      tags: ["Audio Chimes", "Queue Pools", "Display Board"],
      renderBanner: () => (
        <div className="relative w-full h-30 bg-gradient-to-br from-amber-700 via-orange-800 to-slate-950 p-4 flex flex-col justify-between overflow-hidden text-white rounded-t-2xl">
          <div className="flex items-center justify-between z-10 hidden">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/30">
              Lobby Display
            </span>
            <span className="text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full shadow-xs">
              Now Calling
            </span>
          </div>

          <div className="z-10 flex items-end justify-between gap-2 mt-auto">
            <div className="space-y-0.5">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-mono font-black text-amber-200">#W-04</span>
                <span className="text-xs text-white font-bold">Room 104</span>
              </div>
              <span className="text-[10px] text-amber-100 block">
                Next: #W-05 • Waiting: 6
              </span>
              <span className="text-[9px] text-amber-300 font-semibold">
                🔔 Voice TTS Enabled
              </span>
            </div>

            {/* Attractive 3D Product Objects: Touchscreen Token Dispenser Kiosk, Golden Chime Bell & Printed Ticket */}
            <div className="relative shrink-0">
              <svg viewBox="0 0 130 90" className="w-28 h-20 drop-shadow-xl overflow-visible">
                <defs>
                  <linearGradient id="kioskGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="100%" stopColor="#0f172a" />
                  </linearGradient>
                  <linearGradient id="bellGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="50%" stopColor="#eab308" />
                    <stop offset="100%" stopColor="#a16207" />
                  </linearGradient>
                </defs>
                {/* 3D Touchscreen Kiosk */}
                <g transform="translate(10, 6)">
                  <rect x="6" y="4" width="38" height="68" rx="6" fill="url(#kioskGrad)" stroke="#f59e0b" strokeWidth="1" />
                  <rect x="10" y="8" width="30" height="24" rx="3" fill="#0284c7" />
                  <text x="14" y="18" fill="#ffffff" fontSize="5.5" fontWeight="bold">TOUCH TO PRINT</text>
                  <rect x="14" y="22" width="22" height="6" rx="2" fill="#38bdf8" />
                  <text x="16" y="27" fill="#082f49" fontSize="5" fontWeight="900">NEW TOKEN</text>
                  <rect x="14" y="38" width="22" height="3" rx="1.5" fill="#475569" />
                  {/* Printed Ticket #W-04 */}
                  <g transform="translate(16, 39)">
                    <path d="M0 0 L18 0 L18 24 L14 22 L10 24 L6 22 L0 24 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
                    <text x="3" y="8" fill="#0f172a" fontSize="5" fontWeight="bold">CITY OPD</text>
                    <text x="2" y="16" fill="#ea580c" fontSize="8" fontWeight="900" fontFamily="monospace">#W-04</text>
                    <line x1="3" y1="19" x2="3" y2="21" stroke="#000000" strokeWidth="0.8" />
                    <line x1="5" y1="19" x2="5" y2="21" stroke="#000000" strokeWidth="1.2" />
                    <line x1="8" y1="19" x2="8" y2="21" stroke="#000000" strokeWidth="0.6" />
                    <line x1="11" y1="19" x2="11" y2="21" stroke="#000000" strokeWidth="1" />
                    <line x1="14" y1="19" x2="14" y2="21" stroke="#000000" strokeWidth="0.8" />
                  </g>
                </g>
                {/* 3D Golden Concierge Reception Bell with Chime Waves */}
                <g transform="translate(68, 18)">
                  <rect x="22" y="4" width="4" height="6" rx="1" fill="url(#bellGrad)" />
                  <path d="M8 22 C8 10 40 10 40 22 Z" fill="url(#bellGrad)" stroke="#78350f" strokeWidth="0.8" />
                  <path d="M14 16 C16 13 28 12 32 14" stroke="#ffffff" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.8" />
                  <rect x="4" y="22" width="40" height="5" rx="2" fill="#78350f" stroke="#451a03" strokeWidth="0.8" />
                  <path d="M44 8 C48 12 48 18 44 22" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M48 4 C54 10 54 20 48 26" fill="none" stroke="#fbbf24" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
                </g>
                {/* Digital Wall LED Counter */}
                <g transform="translate(66, 52)">
                  <rect x="0" y="0" width="54" height="18" rx="4" fill="#000000" stroke="#f59e0b" strokeWidth="1" />
                  <text x="6" y="8" fill="#94a3b8" fontSize="5" fontWeight="bold">NEXT CALL</text>
                  <text x="6" y="15" fill="#facc15" fontSize="7.5" fontWeight="bold" fontFamily="monospace">TOKEN #W-05</text>
                </g>
              </svg>
            </div>
          </div>

          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-amber-500/20 rounded-full blur-xl pointer-events-none" />
        </div>
      ),
    },
    {
      id: "speech-to-text",
      title: "Speech to Text & Clinical Voice Dictation",
      tagline: "Real-time doctor voice dictation for prescriptions with Telugu/Hindi/English recognition.",
      path: "/speech-to-text",
      badge: "Voice AI",
      badgeColor: "bg-sky-600 text-white",
      tags: ["Real-Time Mic", "Telugu/Hindi/Eng", "EHR Dictation"],
      renderBanner: () => (
        <div className="relative w-full h-30 bg-gradient-to-br from-sky-800 via-blue-900 to-slate-950 p-4 flex flex-col justify-between overflow-hidden text-white rounded-t-2xl">
          <div className="flex items-center justify-between z-10 hidden">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/30">
              Voice Dictation
            </span>
            <span className="text-[10px] font-bold bg-sky-500 text-white px-2 py-0.5 rounded-full shadow-xs">
              Live Mic Active
            </span>
          </div>

          <div className="z-10 flex items-end justify-between gap-2 mt-auto">
            <div className="space-y-0.5">
              <span className="text-xl font-black text-sky-200 block">
                AI Voice to EHR
              </span>
              <span className="text-[10px] text-slate-300 block">
                Telugu • English • Hindi
              </span>
              <span className="text-[9px] text-sky-300 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                Clinical Speech Model
              </span>
            </div>

            {/* Attractive 3D Product Objects: Clinical Studio Mic, Sound Waves & Transcription Pad */}
            <div className="relative shrink-0">
              <svg viewBox="0 0 130 90" className="w-28 h-20 drop-shadow-xl overflow-visible">
                <defs>
                  <linearGradient id="micGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#0284c7" />
                  </linearGradient>
                </defs>
                {/* 3D Clinical Studio Mic */}
                <g transform="translate(14, 8)">
                  <path d="M4 22 C0 28 0 34 4 40" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
                  <path d="M40 22 C44 28 44 34 40 40" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
                  <rect x="14" y="12" width="16" height="28" rx="8" fill="url(#micGrad)" stroke="#ffffff" strokeWidth="1.2" />
                  <line x1="14" y1="20" x2="30" y2="20" stroke="#0369a1" strokeWidth="1" />
                  <line x1="14" y1="26" x2="30" y2="26" stroke="#0369a1" strokeWidth="1" />
                  <line x1="14" y1="32" x2="30" y2="32" stroke="#0369a1" strokeWidth="1" />
                  <path d="M8 28 C8 42 36 42 36 28" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="22" y1="42" x2="22" y2="54" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
                  <ellipse cx="22" cy="54" rx="10" ry="3" fill="#64748b" />
                </g>
                {/* Live Speech-to-Text Document */}
                <g transform="translate(68, 6)">
                  <rect x="0" y="0" width="54" height="60" rx="6" fill="#ffffff" stroke="#38bdf8" strokeWidth="1.2" />
                  <rect x="6" y="8" width="22" height="4" rx="2" fill="#0284c7" />
                  <line x1="6" y1="18" x2="48" y2="18" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="6" y1="24" x2="42" y2="24" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="6" y1="30" x2="46" y2="30" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="6" y1="36" x2="38" y2="36" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M6 46 Q14 42 22 46 T38 46 T48 46" fill="none" stroke="#ef4444" strokeWidth="1.5" />
                  <circle cx="48" cy="46" r="2" fill="#ef4444" className="animate-ping" />
                </g>
                {/* Language Pill */}
                <g transform="translate(48, 64)">
                  <rect x="0" y="0" width="60" height="14" rx="7" fill="#0369a1" stroke="#38bdf8" strokeWidth="0.8" />
                  <text x="6" y="10" fill="#ffffff" fontSize="6" fontWeight="bold">తెలుగు • Eng • हिन्दी</text>
                </g>
              </svg>
            </div>
          </div>

          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-sky-500/20 rounded-full blur-xl pointer-events-none" />
        </div>
      ),
    }
  ];

  const experienceList = [
    {
      role: "Senior UI Developer - CRM",
      company: "Apex Cura Healthcare IT Solutions Pvt Ltd.",
      period: "Apr 2024 — Jul 2026",
      duration: "2 yrs 4 mos",
      location: "Hyderabad, India",
      summary:
        "Architected and engineered an AI-first, multi-tenant Healthcare CRM and Patient Engagement SaaS platform serving multiple hospitals, automating lead acquisition, omnichannel patient communication, and AI call coaching.",
      achievements: [
        "Architected multi-tenant CRM enabling patient acquisition, omnichannel communication, call recording management, and automated appointment scheduling.",
        "Built Omnichannel Lead Management integrating hospital websites, AI web chatbots, WhatsApp Business API, Facebook Messenger, Instagram, and Meta Lead Ads.",
        "Engineered an AI-powered Call Analytics engine with telephony integrations (TATA SmartFlo, Exotel, ConVox) generating automated call transcripts, quality scores, sentiment analysis, and agent coaching metrics.",
        "Constructed an intelligent Lead Assignment Engine distributing leads based on hospital branch geolocation, agent availability, and workload balancing algorithms.",
        "Automated WhatsApp patient feedback workflows for Inpatient (IP) and Outpatient (OP) departments, centralizing NPS reports for quality audits.",
        "Prepared and annotated healthcare conversational datasets to fine-tune AI chatbots and clinical intake models.",
      ],
      technologies: [
        "React.js (v16.8+)",
        "Next.js",
        "Redux",
        "TypeScript",
        "Node.js",
        "Tailwind CSS",
        "Meta Business API",
        "Telephony APIs",
        "AWS S3/RDS",
        "Webhooks",
      ],
    },
    {
      role: "Software Engineer - EHR",
      company: "Aurora e-Labs Pvt Ltd.",
      period: "May 2019 — Mar 2024",
      duration: "4 yrs 10 mos",
      location: "Hyderabad, India",
      summary:
        "Spearheaded development of comprehensive Electronic Health Record (EHR) modules and remote patient telemetry for major hospital chains including K**S Hospitals.",
      achievements: [
        "Engineered core EHR clinical modules including IP Discharge Summary, Nursing Clinical Forms, Drug Charts, Intake/Output (I/O) Records, Vitals, and Diagnostic Lab Reports.",
        "Integrated Dozee Remote Patient Monitoring (RPM) IoT contactless sensors to stream real-time patient vitals into the EHR, enabling early warning clinical alerts.",
        "Developed doctor-facing React Native mobile application for continuous inpatient (IP) and outpatient (OP) tracking from handheld devices.",
        "Implemented role-based security workflows (RBAC) ensuring granular access control for Chief Medical Officers, duty doctors, nurses, and billing admins.",
        "Refactored state management and component libraries into reusable packages, reducing frontend bundle size by 35% and improving render times.",
      ],
      technologies: [
        "React.js",
        "React Native",
        "Redux",
        "Node.js",
        "PostgreSQL",
        "Dozee RPM IoT",
        "UI Kitten",
        "REST APIs",
        "Socket.IO",
      ],
    },
    {
      role: "UI Developer - Web Pages",
      company: "LPtechlog Pvt Ltd.",
      period: "Jul 2018 — Jan 2019",
      duration: "7 mos",
      location: "Hyderabad, India",
      summary:
        "Designed and converted UI mockups into responsive, high-performance web applications with semantic HTML5, CSS3, JavaScript, and Bootstrap.",
      achievements: [
        "Delivered pixel-perfect responsive layouts ensuring full visual fidelity and cross-browser consistency across mobile, tablet, and desktop viewports.",
        "Authored modular, maintainable stylesheets and reusable client components, accelerating sprint delivery cycles.",
        "Profiled browser rendering performance and eliminated layout thrashing to guarantee fluid 60fps user interactions.",
      ],
      technologies: ["JavaScript (ES6)", "HTML5", "CSS3", "Bootstrap", "jQuery", "Git"],
    },
  ];

  const projectsList = [
    {
      title: "Customer Relationship Management (CRM) - Web Application",
      client: "Apex Cura Healthcare",
      period: "Apr 2024 – Jul 2026",
      teamSize: "15 members",
      category: "crm",
      isFeatured: true,
      description:
        "AI-powered, multi-tenant Healthcare CRM supporting patient acquisition, omnichannel chat routing, telephony call intelligence, automated appointment lifecycles, and IP/OP patient satisfaction feedback.",
      highlights: [
        "Omnichannel lead ingestion from Meta Ads, WhatsApp, Webhooks, and web chatbots",
        "AI Call Analytics with automatic transcription, quality scoring, and sentiment tagging",
        "Workload-balanced lead routing engine factoring branch location and agent load",
        "Automated WhatsApp appointment reminders and multi-step rescheduling flows",
      ],
      stack: ["React.js", "Redux", "Node.js", "PostgreSQL", "AWS S3/EC2", "Telephony APIs", "Meta API"],
    },
    {
      title: "Electronic Health Record (EHR) - Web Application",
      client: "K**S Hospitals",
      period: "Mar 2021 – Mar 2024",
      teamSize: "5 members",
      category: "ehr",
      isFeatured: true,
      description:
        "Enterprise hospital EHR platform digitizing medical records for clinical administrators, senior consultants, and duty nurses across inpatient and outpatient departments.",
      highlights: [
        "Interactive Nursing Notes, Drug Charts, Intake/Output (I/O), and Discharge Summaries",
        "Real-time vital signs synchronization with Dozee contactless remote patient monitoring",
        "Role-based clinical workflows adhering to healthcare compliance and data privacy",
        "Integrated laboratory test ordering and diagnostic result visualization",
      ],
      stack: ["React.js", "Node.js", "PostgreSQL", "REST APIs", "Socket.IO", "Highcharts"],
    },
    {
      title: "Electronic Health Record (EHR) - Mobile Application",
      client: "K**S Hospitals",
      period: "Mar 2021 – Mar 2024",
      teamSize: "5 members",
      category: "mobile",
      description:
        "Doctor companion mobile application enabling physicians to round on inpatients, review test results, verify drug charts, and acknowledge critical alerts on-the-go.",
      highlights: [
        "Native Android and iOS mobile app with offline-capable clinical notes cache",
        "Firebase push notifications for critical vitals threshold breaches",
        "Fast patient search by UHID, IP number, and bed location",
      ],
      stack: ["React Native", "UI Kitten", "React Native Paper", "Firebase", "REST APIs"],
    },
    {
      title: "Hospital Queue Management System",
      client: "K**S Hospitals",
      period: "Jan 2021 – Mar 2021",
      teamSize: "5 members",
      category: "ehr",
      description:
        "Intelligent outpatient queue sequencing system handling appointment check-ins, token generation, triage prioritization, and waiting lobby digital signage.",
      highlights: [
        "Priority-based queue ordering for elderly, emergency, and pregnant patients",
        "Real-time WebSocket token display board with audio chime announcements",
        "Historical queue wait-time metrics for hospital administrative reporting",
      ],
      stack: ["Node.js", "PostgreSQL", "Socket.IO", "React.js", "Tailwind CSS"],
    },
    {
      title: "Hospital Financial Management & Counselling System",
      client: "K**S Hospitals",
      period: "Mar 2020 – Jan 2021",
      teamSize: "5 members",
      category: "crm",
      description:
        "Patient financial counseling application managing treatment cost estimation, insurance pre-authorization, KYC verification, and billing reconciliations.",
      highlights: [
        "Automated surgical procedure cost estimator with package itemization",
        "Insurance vs. cash payment split management and KYC document storage",
        "Consolidated revenue reports with multi-criteria date-range filters",
      ],
      stack: ["React.js", "Node.js", "PostgreSQL", "Express.js", "Chart.js"],
    },
    {
      title: "Medical Consultation - Mobile Application",
      client: "Second Aid",
      period: "Aug 2019 – Jun 2020",
      teamSize: "3 members",
      category: "mobile",
      description:
        "Tele-health mobile consultation platform facilitating secure doctor-patient messaging, medical record sharing, electronic prescriptions, and in-app payments.",
      highlights: [
        "Stream Chat and Firebase integration for real-time consultation messaging",
        "Dual payment gateway integration with Stripe and Paytm",
        "Encrypted medical report uploads and digital prescriptions sharing",
      ],
      stack: ["React Native (Expo)", "Redux", "Firebase", "Stream Chat", "Stripe API", "Paytm"],
    },
    {
      title: "Smart Learning - Mobile Application",
      client: "Kaizen Kids",
      period: "Jun 2020 – Jan 2021",
      teamSize: "3 members",
      category: "mobile",
      description:
        "Interactive educational app for worksheets, camera-based homework submissions, teacher grading workflows, and real-time student evaluation cards.",
      highlights: [
        "Camera and gallery image submission pipelines with client-side compression",
        "Dual parent and student portal with progress milestone tracking",
        "Deployed to both Google Play Store and Apple App Store",
      ],
      stack: ["React Native", "Expo", "Redux", "Node.js", "REST APIs"],
    },
  ];

  const skillCategories = [
    {
      name: "Frontend Architecture",
      skills: [
        "React.js (v16.8+)",
        "React Native",
        "Next.js",
        "TypeScript",
        "JavaScript (ES6+)",
        "Redux Toolkit",
        "Tailwind CSS",
        "Bootstrap 4/5",
        "Material UI",
        "Chakra UI",
        "Ant Design",
        "UI-Kitten",
        "Highcharts",
        "Chart.js",
      ],
    },
    {
      name: "Backend & APIs",
      skills: [
        "Node.js",
        "Express.js",
        "REST APIs",
        "Socket.IO (WebSockets)",
        "Webhooks Architecture",
        "Redis Caching",
        "JWT Authentication",
        "Swagger / OpenAPI",
        "PM2 Process Manager",
        "Multer",
        "Nodemailer",
      ],
    },
    {
      name: "Databases & Storage",
      skills: [
        "PostgreSQL",
        "MongoDB",
        "Firebase Realtime DB",
        "AWS S3 Bucket",
        "Redis In-Memory",
        "SQL Query Optimization",
      ],
    },
    {
      name: "Cloud, Telecom & Integrations",
      skills: [
        "AWS (EC2, S3, RDS, IAM, CloudWatch)",
        "Meta Business API (WhatsApp, Instagram, Ads)",
        "Telephony APIs (TATA SmartFlo, Exotel, ConVox)",
        "HIMS Integration (Suvarna, Practo)",
        "Dozee Remote Patient Monitoring (RPM)",
        "Stripe & Paytm Payment Gateways",
      ],
    },
    {
      name: "DevOps & Engineering Tools",
      skills: [
        "GitHub Actions (CI/CD)",
        "Git & Bitbucket",
        "Docker basics",
        "Figma UI/UX",
        "Postman API Testing",
        "DBeaver SQL Client",
        "Webpack & Vite",
        "NPM / Yarn",
        "VS Code",
      ],
    },
  ];

  const filteredProjects = projectsList.filter((p) => {
    const matchesTab =
      activeProjectTab === "all" ? true : p.category === activeProjectTab;
    const matchesSearch =
      searchQuery === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.stack.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-800 font-sans selection:bg-purple-100 selection:text-purple-900 pb-20">
      {/* ── TOP STICKY NAVBAR ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-purple-100/80 px-4 sm:px-8 py-3.5 shadow-sm transition-all">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand / Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-teal-500 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-purple-500/20">
              MS
            </div>
            <div>
              <span className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight block leading-tight">
                Manikanta Sai Tanguturi
              </span>
              <span className="text-[11px] text-purple-700 font-semibold tracking-wide block leading-none">
                Senior Software Engineer
              </span>
            </div>
          </div>

          {/* Quick Nav Anchors */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#about" className="hover:text-purple-700 transition-colors">
              About
            </a>
            <a href="#live-apps" className="hover:text-purple-700 transition-colors flex items-center gap-1 text-purple-700 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
              Live Hospital Apps
            </a>
            <a href="#experience" className="hover:text-purple-700 transition-colors">
              Experience
            </a>
            <a href="#projects" className="hover:text-purple-700 transition-colors">
              Projects
            </a>
            <a href="#skills" className="hover:text-purple-700 transition-colors">
              Skills
            </a>
          </nav>

          {/* Contact / Resume CTA */}
          <div className="flex items-center gap-2.5">
            <a
              href="mailto:tanguturi.mani@gmail.com"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Let's Connect</span>
            </a>
          </div>
        </div>
      </header>

      {/* ── MAIN PORTFOLIO BODY (Full Width) ── */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 space-y-8">
        {/* ── 1. HERO SECTION (Mirroring Reference Layout) ── */}
        <section
          id="about"
          className="rounded-3xl border border-purple-100/90 bg-white p-6 sm:p-10 shadow-sm relative overflow-hidden"
        >
          {/* Subtle Ambient Background Gradient */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-purple-100/50 via-indigo-50/40 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-gradient-to-tr from-teal-50/60 to-transparent rounded-full blur-2xl pointer-events-none -ml-16 -mb-16" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
            {/* Left: Avatar & Social Links */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-purple-800 via-indigo-700 to-purple-600 p-1 shadow-xl shadow-purple-500/15">
                <div className="w-full h-full rounded-[22px] bg-slate-900 flex flex-col items-center justify-center text-white p-3 text-center">
                  <Code2 className="w-9 h-9 text-purple-300 mb-1" />
                  <span className="text-[11px] font-mono font-bold tracking-wider text-purple-200">
                    7+ YRS EXP
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium">FULL STACK</span>
                </div>
              </div>

              {/* Social badges below avatar */}
              <div className="flex items-center gap-2 mt-3.5">
                <a
                  href="https://linkedin.com/in/manikanta-sai"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-purple-50 border border-purple-200/80 text-purple-700 hover:bg-purple-100 flex items-center justify-center transition-colors"
                  title="LinkedIn: manikanta-sai"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => copyToClipboard("tanguturi.mani@gmail.com", "Email")}
                  className="w-8 h-8 rounded-full bg-purple-50 border border-purple-200/80 text-purple-700 hover:bg-purple-100 flex items-center justify-center transition-colors relative"
                  title="Copy Email"
                >
                  <Mail className="w-4 h-4" />
                  {copiedText === "Email" && (
                    <span className="absolute -top-7 text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded shadow whitespace-nowrap">
                      Copied!
                    </span>
                  )}
                </button>
                <a
                  href="https://www.credly.com/users/manikanta-sai.14d35454"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-purple-50 border border-purple-200/80 text-purple-700 hover:bg-purple-100 flex items-center justify-center transition-colors"
                  title="Credly Verified Badge"
                >
                  <Award className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right: Bio & Profile */}
            <div className="flex-1 text-center md:text-left space-y-3.5">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Manikanta Sai Tanguturi
                </h1>
                <p className="text-sm sm:text-base font-semibold text-purple-700 mt-1">
                  Senior Software Engineer • Healthcare SaaS, CRM, EHR & AI Platforms
                </p>
                <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center justify-center md:justify-start gap-2">
                  <span>📍 Hyderabad, India</span>
                  <span>•</span>
                  <span>✉ tanguturi.mani@gmail.com</span>
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Senior Software Engineer with <strong>7+ years of experience</strong> building scalable{" "}
                <span className="text-slate-900 font-semibold">Healthcare SaaS, CRM, EHR, OTM, and AI-enabled platforms</span>.
                Specialized in multi-tenant architectures, automating mission-critical healthcare workflows,
                integrating enterprise telephony and EHR/HIMS systems, and translating complex clinical requirements
                into intuitive, reliable software products.
              </p>

              {/* Key Domains Pills */}
              <div className="flex flex-wrap gap-1.5 justify-center md:justify-start pt-1">
                {[
                  "Healthcare SaaS & EHR",
                  "Multi-Tenant CRM",
                  "AI Call Analytics",
                  "Dozee RPM IoT",
                  "Omnichannel WhatsApp & Meta",
                  "React Native Mobile Apps",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-semibold bg-purple-50 text-purple-800 border border-purple-200/70 px-2.5 py-0.5 rounded-lg"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Call to Actions */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                <a
                  href="#live-apps"
                  className="inline-flex items-center gap-2 text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white px-5 py-2.5 rounded-xl shadow-md shadow-purple-500/15 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-200" />
                  <span>Explore Live Hospital Apps</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <a
                  href="#projects"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2.5 rounded-xl border border-slate-200/80 transition-colors"
                >
                  <FolderGit2 className="w-3.5 h-3.5 text-slate-600" />
                  <span>View Resume Projects ({projectsList.length})</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. FEATURED LIVE HOSPITAL PRODUCT SUITE ── */}
        <ScrollReveal delay={80}>
          <section
            id="live-apps"
            className="rounded-3xl border border-purple-100/90 bg-white p-6 sm:p-8 shadow-sm space-y-6"
          >
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  <Sparkles size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-none">
                      Interactive Healthcare Product Suite
                    </h2>
                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200">
                      ● Live Workspaces
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Click any live interactive module below to test real clinical workflows in this environment
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {liveInteractiveApps.map((app) => {
                return (
                  <div
                    key={app.id}
                    onClick={() => navigateTo(app.path)}
                    className="group bg-white rounded-2xl border border-slate-200/90 hover:border-purple-300 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden hover:-translate-y-1.5"
                  >
                    {/* Top Colorful Image Banner */}
                    <div>
                      {app.renderBanner()}

                      {/* Card Body with High Readability */}
                      <div className="p-4 sm:p-5 space-y-3">
                        {/* <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${app.badgeColor}`}
                          >
                            {app.badge}
                          </span>
                        </div> */}

                        <div>
                          <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-purple-700 transition-colors leading-snug">
                            {app.title}
                          </h3>
                          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-normal">
                            {app.tagline}
                          </p>
                        </div>

                        {/* Feature Badges */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {app.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-medium bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-mono"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="px-4 sm:px-5 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700 group-hover:text-purple-900">
                      <span className="flex items-center gap-1">
                        Launch Interactive Demo
                      </span>
                      <div className="w-6 h-6 rounded-full bg-purple-50 group-hover:bg-purple-700 text-purple-700 group-hover:text-white flex items-center justify-center transition-colors">
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </ScrollReveal>

        {/* ── 3. PROFESSIONAL EXPERIENCE (Timeline Design) ── */}
        <ScrollReveal delay={100}>
          <section
            id="experience"
          className="rounded-3xl border border-purple-100/90 bg-white p-6 sm:p-8 shadow-sm space-y-6"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                <Briefcase size={16} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-none">
                  Professional Experience
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Career journey in building enterprise Healthcare SaaS, CRM, EHR & AI platforms
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-purple-800 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              7+ Years Total Experience
            </span>
          </div>

          {/* Vertical Timeline Track */}
          <div className="relative pl-6 sm:pl-8 ml-2 sm:ml-4 border-l-2 border-purple-200 space-y-8 py-2">
            {experienceList.map((exp, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline Node Marker */}
                <div className="absolute -left-[37px] sm:-left-[45px] top-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border-2 border-purple-600 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:border-purple-700 group-hover:bg-purple-600 transition-all">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      idx === 0
                        ? "bg-purple-600 group-hover:bg-white animate-pulse"
                        : "bg-purple-400 group-hover:bg-white"
                    }`}
                  />
                </div>

                {/* Timeline Card */}
                <div className="bg-slate-50/70 hover:bg-white border border-slate-200/80 hover:border-purple-300 rounded-2xl p-5 sm:p-6 shadow-2xs hover:shadow-md transition-all space-y-3">
                  {/* Header: Role, Company & Period Pill */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-purple-900 transition-colors">
                        {exp.role}
                      </h3>
                      <span className="text-sm font-semibold text-purple-700 flex items-center gap-1.5 mt-0.5">
                        <Building2 size={13} className="text-purple-600" />
                        <span>{exp.company}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap sm:text-right">
                      <span className="text-xs font-mono font-bold text-purple-800 bg-purple-100/80 px-2.5 py-1 rounded-lg border border-purple-200">
                        {exp.period}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium font-mono">
                        ({exp.duration}) • {exp.location}
                      </span>
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {exp.summary}
                  </p>

                  {/* Key Achievements */}
                  <div className="pt-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Key Contributions & Engineering Impact:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {exp.achievements.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle2 size={13} className="text-purple-600 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="pt-3 border-t border-slate-200/60 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                      Tech:
                    </span>
                    {exp.technologies.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-semibold bg-white text-purple-900 border border-purple-200/90 rounded-md px-2 py-0.5 font-mono shadow-2xs"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* ── 4. SPOTLIGHT FEATURED HIGHLIGHT (Purple Box matching Reference UX) ── */}
      <ScrollReveal delay={80}>
        <section className="rounded-3xl border border-purple-200 bg-gradient-to-r from-purple-50/80 via-indigo-50/60 to-purple-50/80 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-600 text-white px-2.5 py-0.5 rounded-full">
              FEATURED ARCHITECTURE
            </span>
            <span className="text-xs text-purple-800 font-bold">Apex Cura Healthcare CRM</span>
          </div>

          <h3 className="text-lg sm:text-xl font-extrabold text-purple-950 mt-1">
            Omnichannel Patient Ingestion, AI Telephony & Automated Lead Engine
          </h3>

          <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed">
            Constructed a unified patient intake hub aggregating real-time patient requests across web chatbots,
            WhatsApp Business API, telephony inbound/outbound calls, Facebook Messenger, and Meta Lead Ads.
            Integrated automated call transcription and sentiment scoring to monitor doctor and agent communication quality,
            reducing lead response latency by over 60% across hospital branches.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-center">
            <div className="bg-white/80 rounded-xl p-2.5 border border-purple-100 shadow-xs">
              <span className="text-base font-extrabold text-purple-900 block">7+ Yrs</span>
              <span className="text-[10px] text-slate-500 font-medium">Healthcare Engineering</span>
            </div>
            <div className="bg-white/80 rounded-xl p-2.5 border border-purple-100 shadow-xs">
              <span className="text-base font-extrabold text-purple-900 block">15+</span>
              <span className="text-[10px] text-slate-500 font-medium">Enterprise Integrations</span>
            </div>
            <div className="bg-white/80 rounded-xl p-2.5 border border-purple-100 shadow-xs">
              <span className="text-base font-extrabold text-purple-900 block">&lt; 15 min</span>
              <span className="text-[10px] text-slate-500 font-medium">Lead Routing SLA</span>
            </div>
            <div className="bg-white/80 rounded-xl p-2.5 border border-purple-100 shadow-xs">
              <span className="text-base font-extrabold text-purple-900 block">100%</span>
              <span className="text-[10px] text-slate-500 font-medium">EHR / NABH Aligned</span>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ── 5. PROJECTS SECTION (All Resume Projects) ── */}
      <ScrollReveal delay={100}>
        <section
          id="projects"
          className="rounded-3xl border border-purple-100/90 bg-white p-6 sm:p-8 shadow-sm space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <FolderGit2 className="w-5 h-5 text-purple-700" />
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Portfolio Projects
                </h2>
                <p className="text-xs text-slate-500">
                  Comprehensive systems built across Healthcare SaaS, EHR, and Mobile
                </p>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects or stack..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide text-xs">
            {[
              { id: "all", label: "All Projects" },
              { id: "crm", label: "Healthcare CRM" },
              { id: "ehr", label: "Clinical EHR" },
              { id: "mobile", label: "Mobile Apps" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveProjectTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                  activeProjectTab === tab.id
                    ? "bg-purple-700 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Projects List */}
          <div className="space-y-4">
            {filteredProjects.map((proj, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-slate-100 hover:border-purple-200 bg-slate-50/50 hover:bg-white transition-all space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-purple-700 font-semibold">
                      Client: {proj.client} • Team: {proj.teamSize} • ({proj.period})
                    </p>
                  </div>
                  {proj.isFeatured && (
                    <span className="self-start sm:self-auto text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-md">
                      Featured
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {proj.description}
                </p>

                <div className="space-y-1 pt-1">
                  {proj.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                      <span className="text-purple-600 font-bold leading-none mt-0.5">✓</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {proj.stack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-semibold bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {filteredProjects.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-400">
                No projects matched your search criteria.
              </div>
            )}
          </div>
        </section>
      </ScrollReveal>

      {/* ── 6. SKILLS SECTION (Categorized Chips matching Reference UX) ── */}
      <ScrollReveal delay={100}>
        <section
          id="skills"
          className="rounded-3xl border border-purple-100/90 bg-white p-6 sm:p-8 shadow-sm space-y-6"
        >
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
            <Cpu className="w-5 h-5 text-purple-700" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Technical Skills & Tech Stack
            </h2>
          </div>

          <div className="space-y-4">
            {skillCategories.map((cat, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {cat.name}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs font-semibold bg-slate-50 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 border border-slate-200/80 text-slate-700 px-3 py-1 rounded-lg transition-colors cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

        {/* ── 7. BOTTOM CONTACT CALLOUT (Matching Reference UX) ── */}
        <section className="text-center py-6 space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Interested in discussing modern healthcare architecture, full-stack development, or exploring opportunities?
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="mailto:tanguturi.mani@gmail.com"
              className="inline-flex items-center gap-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 px-6 py-2.5 rounded-xl shadow-md shadow-purple-500/15 transition-all"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Let's Connect ✉</span>
            </a>

            <a
              href="https://linkedin.com/in/manikanta-sai"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-5 py-2.5 rounded-xl shadow-xs transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5 text-purple-600" />
              <span>LinkedIn Profile</span>
            </a>
          </div>

          {/* Social Icons Strip */}
          <div className="flex items-center justify-center gap-4 pt-4 text-slate-400">
            <a
              href="https://linkedin.com/in/manikanta-sai"
              target="_blank"
              rel="noreferrer"
              className="hover:text-purple-700 transition-colors"
              title="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="mailto:tanguturi.mani@gmail.com"
              className="hover:text-purple-700 transition-colors"
              title="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a
              href="https://www.credly.com/users/manikanta-sai.14d35454"
              target="_blank"
              rel="noreferrer"
              className="hover:text-purple-700 transition-colors"
              title="Credly"
            >
              <Award className="w-4 h-4" />
            </a>
          </div>

          <div className="text-[11px] text-slate-400 pt-2">
            © {new Date().getFullYear()} Manikanta Sai Tanguturi. Built with React & Tailwind CSS.
          </div>
        </section>
      </main>

      {/* Floating Scroll to Top button */}
      <ScrollToTopButton />
    </div>
  );
}
