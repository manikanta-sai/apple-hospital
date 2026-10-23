import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  CalendarCheck2,
  CalendarClock,
  CalendarPlus,
  CalendarX2,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  Edit2,
  FileText,
  Filter,
  Globe,
  History,
  Maximize2,
  MessageCircle,
  MessageSquare,
  Minimize2,
  Minus,
  PhoneCall,
  PhoneIncoming,
  PhoneMissed,
  PhoneOff,
  Search,
  Send,
  Sparkles,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import AudioPlayer from "./AudioPlayer.jsx";
import RouteTopBar from "./common/RouteTopBar.jsx";
import AnimatedCounter from "./common/AnimatedCounter.jsx";
import { AnimatedKpiCard } from "./common/ChartAnimations.jsx";
import {
  getAllCallsFromDB,
  calculateCallMetrics,
  exportCallsToCSV,
  updateCallInDB,
  addCallToDB,
  SEED_CALLS,
  MULTILINGUAL_TRANSCRIPTS,
  getLocalDateString,
} from "../services/callCenterDb.js";

// ─── Shared helpers ───────────────────────────────────────────────────────────

const GLASS = {
  background: "rgba(255,255,255,0.85)",
  border: "1px solid rgba(0,0,0,0.07)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
};

function scoreColor(s) {
  if (!s && s !== 0) return "#94a3b8";
  return s >= 80 ? "#059669" : s >= 60 ? "#d97706" : "#dc2626";
}
function scoreBg(s) {
  if (!s && s !== 0) return "rgba(148,163,184,0.12)";
  return s >= 80
    ? "rgba(5,150,105,0.10)"
    : s >= 60
    ? "rgba(217,119,6,0.10)"
    : "rgba(220,38,38,0.09)";
}

function outcomeBadgeStyle(outcome) {
  if (outcome === "Interested")
    return {
      background: "rgba(5,150,105,0.10)",
      color: "#047857",
      border: "1px solid rgba(5,150,105,0.20)",
    };
  if (outcome === "Follow up")
    return {
      background: "rgba(217,119,6,0.10)",
      color: "#92400e",
      border: "1px solid rgba(217,119,6,0.20)",
    };
  if (outcome === "Missed Call")
    return {
      background: "rgba(220,38,38,0.10)",
      color: "#b91c1c",
      border: "1px solid rgba(220,38,38,0.22)",
    };
  return {
    background: "rgba(100,116,139,0.09)",
    color: "#475569",
    border: "1px solid rgba(100,116,139,0.18)",
  };
}

const AVATAR_PALETTES = [
  ["rgba(99,102,241,0.15)", "#4f46e5"],
  ["rgba(139,92,246,0.15)", "#6d28d9"],
  ["rgba(14,165,233,0.15)", "#0369a1"],
  ["rgba(20,184,166,0.15)", "#0f766e"],
];
function avatarColors(name = "") {
  return AVATAR_PALETTES[name.length % AVATAR_PALETTES.length];
}
function initials(name = "") {
  if (!name || name === "Unknown Caller") return "UC";
  return name
    .split(" ")
    .map((p) => p[0])
    .join("");
}

function parseDurationToSeconds(str) {
  if (!str) return 120;
  const parts = str.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 120;
}

function getDefaultActivityLogs(call) {
  if (call?.activityLog && Array.isArray(call.activityLog) && call.activityLog.length > 0) {
    return call.activityLog;
  }
  if (!call) return [];
  const time = call.time || "10:00 AM";
  const date = call.displayDate || call.date || "Today";
  const logs = [];

  if (call.appointment) {
    const isCancelled = call.appointment.status === "cancelled";
    const isRescheduled = call.appointment.status === "rescheduled";
    const refNum = call.appointment.refNumber || call.appointment.token || "APH-519284";
    logs.push({
      id: "log-appt-initial",
      action: isCancelled ? "Appointment Cancelled" : isRescheduled ? "Appointment Rescheduled" : "Appointment Booked",
      type: isCancelled ? "appointment_cancelled" : isRescheduled ? "appointment_rescheduled" : "appointment_booked",
      actor: call.agent || "Front Desk",
      timestamp: `${date}, ${call.appointment.bookedAt || time}`,
      details: isCancelled
        ? `Ref #${refNum}: Cancelled (${call.appointment.cancelRemarks || "Requested by patient"}). Slot returned to hospital pool.`
        : `Ref #${refNum}: ${call.appointment.doctor} on ${call.appointment.date} at ${call.appointment.time} (${call.appointment.mode}). Remarks: "${call.appointment.remarks || "Standard clinical booking"}"`,
      smsStatus: `WhatsApp & SMS confirmation sent to ${call.phone}`,
    });
  }

  logs.push({
    id: "log-initial-call",
    action: call.status === "missed" ? "Inbound Call Missed" : "Call Completed & Recorded",
    type: call.status === "missed" ? "missed" : "call",
    actor: call.status === "missed" ? "Telephony Gateway" : call.agent || "Triage Nurse",
    timestamp: `${date}, ${time}`,
    details: call.status === "missed"
      ? `Inbound call from ${call.phone} rang for 24s without answer. High-priority callback logged to nursing queue.`
      : `Answered by ${call.agent} (${call.duration}). Initial clinical triage score: ${call.score}/100.`,
  });

  return logs;
}

const DATE_RANGE_OPTIONS = [
  { id: "today", label: "Today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "7d", label: "Last 7 Days" },
  { id: "30d", label: "Last 30 Days" },
  { id: "90d", label: "Last 90 Days" },
  { id: "year", label: "This Year" },
  { id: "all", label: "All Time" },
];

const SCORE_FILTER_OPTIONS = [
  { id: "all", label: "All Scores" },
  { id: "0-20", label: "0–20 (Critical / Missed)" },
  { id: "21-40", label: "21–40 (Low)" },
  { id: "41-60", label: "41–60 (Fair)" },
  { id: "61-80", label: "61–80 (Good)" },
  { id: "81-100", label: "81–100 (Excellent)" },
];

const TRANSCRIPT_LANGUAGES = [
  { id: "original", label: "Original (Real Audio)", native: "Original" },
  { id: "eng", label: "English", native: "ENG" },
  { id: "tel", label: "Telugu", native: "తెలుగు" },
  { id: "hindi", label: "Hindi", native: "हिन्दी" },
  { id: "tamil", label: "Tamil", native: "தமிழ்" },
  { id: "marathi", label: "Marathi", native: "मराठी" },
];

const PAGE_SIZE = 12;

// Age formatting helpers for patient details (Years, Months, Days)
function formatPatientDisplayAge(call) {
  if (!call) return "";
  const parts = [];
  const y = call.ageYears !== undefined && call.ageYears !== "" ? call.ageYears : call.age;
  if (y !== "" && y !== undefined && Number(y) >= 0) parts.push(`${y} yrs`);
  if (call.ageMonths !== undefined && call.ageMonths !== "" && Number(call.ageMonths) > 0) parts.push(`${call.ageMonths} mos`);
  if (call.ageDays !== undefined && call.ageDays !== "" && Number(call.ageDays) > 0) parts.push(`${call.ageDays} days`);
  if (parts.length > 0) return parts.join(", ");
  return call.age ? `${call.age} yrs` : "";
}

function formatPatientTableAge(call) {
  if (!call) return "";
  const y = call.ageYears !== undefined && call.ageYears !== "" ? call.ageYears : call.age;
  const parts = [];
  if (y !== "" && y !== undefined && Number(y) >= 0) parts.push(`${y}y`);
  if (call.ageMonths !== undefined && call.ageMonths !== "" && Number(call.ageMonths) > 0) parts.push(`${call.ageMonths}m`);
  if (call.ageDays !== undefined && call.ageDays !== "" && Number(call.ageDays) > 0) parts.push(`${call.ageDays}d`);
  return parts.join(" ");
}

export default function InsightsDashboard({ navigateTo }) {
  const [calls, setCalls] = useState(SEED_CALLS);
  const [isDbLoaded, setIsDbLoaded] = useState(false);
  const [selectedCallId, setSelectedCallId] = useState(SEED_CALLS[0].id);
  const [activeCallTab, setActiveCallTab] = useState("summary");
  const [searchFilter, setSearchFilter] = useState("");
  // Default date range is TODAY
  const [dateRange, setDateRange] = useState("today");
  const [agentFilter, setAgentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'answered' | 'missed'
  const [scoreFilter, setScoreFilter] = useState("all"); // 'all' | '0-20' | '21-40' | '41-60' | '61-80' | '81-100'
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState("");

  // Multilingual transcript language state (default: English, with Original button placed first)
  const [transcriptLang, setTranscriptLang] = useState("eng");

  // Editable patient details state (Name, Age [Years, Months, Days], Gender - Phone is automatic from telephony line)
  const [isEditingPatient, setIsEditingPatient] = useState(false);
  const [patientFormData, setPatientFormData] = useState({
    name: "",
    ageYears: "",
    ageMonths: "",
    ageDays: "",
    gender: "",
  });

  // Dedicated Call Summary & Notes & Outcome state (available for all calls)
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesFormData, setNotesFormData] = useState("");
  const [outcomeFormData, setOutcomeFormData] = useState("Interested");

  // Appointment booking, reschedule & cancellation state
  const [appointmentModalMode, setAppointmentModalMode] = useState(null); // null | 'book' | 'reschedule' | 'cancel'
  const [appointmentForm, setAppointmentForm] = useState({
    doctor: "Dr. Sharma - Chief Cardiologist",
    date: "",
    time: "10:30 AM",
    mode: "In-Person OPD",
    remarks: "",
  });
  const [cancelRemarks, setCancelRemarks] = useState("");

  // Incoming Call Simulator state
  const [isSimulatingIncoming, setIsSimulatingIncoming] = useState(false);
  const [simulatedIncomingCall, setSimulatedIncomingCall] = useState(null);
  const [incomingWindowMode, setIncomingWindowMode] = useState("normal"); // 'normal' | 'minimized' | 'maximized'

  // Floating Mini Call Window state
  const [activeDialerCall, setActiveDialerCall] = useState(null);
  const [dialerState, setDialerState] = useState("connecting"); // 'connecting' | 'connected' | 'ended'
  const [dialerSeconds, setDialerSeconds] = useState(0);
  const [dialerWindowMode, setDialerWindowMode] = useState("normal"); // 'normal' | 'minimized' | 'maximized'

  // Drag and drop state for Mini Call Window
  const [dialerPos, setDialerPos] = useState({ x: null, y: null });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffsetRef = useRef({ offsetX: 0, offsetY: 0 });

  const dateMenuRef = useRef(null);
  const filterMenuRef = useRef(null);
  const detailPanelRef = useRef(null);
  const dialerTimerRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateMenuRef.current && !dateMenuRef.current.contains(event.target)) {
        setIsDateMenuOpen(false);
      }
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setIsFilterMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Window Dragging
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const newX = Math.max(10, Math.min(window.innerWidth - 320, e.clientX - dragOffsetRef.current.offsetX));
      const newY = Math.max(10, Math.min(window.innerHeight - 140, e.clientY - dragOffsetRef.current.offsetY));
      setDialerPos({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      if (isDragging) setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleDragStart = (e) => {
    // Don't drag if user clicked a button inside header
    if (e.target.closest("button")) return;
    setIsDragging(true);
    const windowEl = e.currentTarget.closest(".dialer-floating-window");
    const rect = windowEl ? windowEl.getBoundingClientRect() : { left: e.clientX - 200, top: e.clientY - 20 };
    dragOffsetRef.current = {
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    };
  };

  // Load call records from Browser IndexedDB Storage (3,000+ records)
  useEffect(() => {
    let isMounted = true;
    getAllCallsFromDB()
      .then((loadedCalls) => {
        if (isMounted && Array.isArray(loadedCalls) && loadedCalls.length > 0) {
          setCalls(loadedCalls);
          if (!loadedCalls.some((c) => c.id === selectedCallId)) {
            setSelectedCallId(loadedCalls[0].id);
          }
        }
        if (isMounted) setIsDbLoaded(true);
      })
      .catch((err) => {
        console.warn("IndexedDB load error:", err);
        if (isMounted) setIsDbLoaded(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchFilter, dateRange, agentFilter, statusFilter, scoreFilter]);

  // Unique agents in dataset
  const uniqueAgents = useMemo(() => {
    const set = new Set();
    calls.forEach((c) => {
      if (c.agent) set.add(c.agent);
    });
    return Array.from(set);
  }, [calls]);

  // Missed call count per phone number across dataset (multi-missed clusters: 5, 4, 3, 2, 1)
  const missedCountByPhone = useMemo(() => {
    const map = {};
    calls.forEach((c) => {
      if (c.status === "missed" && c.phone) {
        map[c.phone] = (map[c.phone] || 0) + 1;
      }
    });
    return map;
  }, [calls]);

  // Date boundaries for dynamic filtering using local calendar date (YYYY-MM-DD)
  const dateThresholds = useMemo(() => {
    const now = new Date();
    const todayIso = getLocalDateString(now);

    const dYesterday = new Date(now);
    dYesterday.setDate(now.getDate() - 1);
    const yesterdayIso = getLocalDateString(dYesterday);

    const d7 = new Date(now);
    d7.setDate(now.getDate() - 7);
    const d30 = new Date(now);
    d30.setDate(now.getDate() - 30);
    const d90 = new Date(now);
    d90.setDate(now.getDate() - 90);
    const dYear = new Date(now.getFullYear(), 0, 1);

    return {
      today: todayIso,
      yesterday: yesterdayIso,
      "7d": getLocalDateString(d7),
      "30d": getLocalDateString(d30),
      "90d": getLocalDateString(d90),
      year: getLocalDateString(dYear),
    };
  }, []);

  // Filter calls based on Search, Date Range, Agent, Status, and Score
  const filteredCalls = useMemo(() => {
    return calls.filter((c) => {
      // Search filter
      const q = searchFilter.toLowerCase().trim();
      if (q) {
        const matchesName = c.name?.toLowerCase().includes(q);
        const matchesAgent = c.agent?.toLowerCase().includes(q);
        const matchesPhone = c.phone?.toLowerCase().includes(q);
        const matchesSummary = c.summary?.toLowerCase().includes(q);
        if (!matchesName && !matchesAgent && !matchesPhone && !matchesSummary) {
          return false;
        }
      }

      // Agent filter
      if (agentFilter !== "all" && c.agent !== agentFilter) {
        return false;
      }

      // Status filter (Answered vs Missed)
      if (statusFilter !== "all" && c.status !== statusFilter) {
        return false;
      }

      // Score filter (0-20, 21-40, 41-60, 61-80, 81-100)
      if (scoreFilter === "0-20") {
        if (c.score > 20) return false;
      } else if (scoreFilter === "21-40") {
        if (c.score < 21 || c.score > 40) return false;
      } else if (scoreFilter === "41-60") {
        if (c.score < 41 || c.score > 60) return false;
      } else if (scoreFilter === "61-80") {
        if (c.score < 61 || c.score > 80) return false;
      } else if (scoreFilter === "81-100") {
        if (c.score < 81 || c.score > 100) return false;
      }

      // Date range filter (Default: today)
      if (dateRange === "today") {
        return c.date === dateThresholds.today;
      }
      if (dateRange === "yesterday") {
        return c.date === dateThresholds.yesterday;
      }
      if (dateRange !== "all" && dateThresholds[dateRange]) {
        return c.date >= dateThresholds[dateRange];
      }

      return true;
    });
  }, [calls, searchFilter, agentFilter, statusFilter, scoreFilter, dateRange, dateThresholds]);

  // Paginated calls for rendering
  const totalPages = Math.max(1, Math.ceil(filteredCalls.length / PAGE_SIZE));
  const paginatedCalls = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredCalls.slice(start, start + PAGE_SIZE);
  }, [filteredCalls, currentPage]);

  const selectedCall = useMemo(() => {
    const foundInFiltered = filteredCalls.find((call) => call.id === selectedCallId);
    if (foundInFiltered) return foundInFiltered;
    return filteredCalls[0] ?? calls[0];
  }, [filteredCalls, selectedCallId, calls]);

  // Synchronize edit forms when selectedCall changes
  // If unknown name, show editable patient form by default!
  useEffect(() => {
    if (!selectedCall) return;
    const isUnknown = selectedCall.name === "Unknown Caller" || selectedCall.name === "Unknown";
    setIsEditingPatient(isUnknown);
    const yrs = selectedCall.ageYears !== undefined ? selectedCall.ageYears : (selectedCall.age !== undefined ? selectedCall.age : "");
    const mos = selectedCall.ageMonths !== undefined ? selectedCall.ageMonths : "";
    const dys = selectedCall.ageDays !== undefined ? selectedCall.ageDays : "";
    setPatientFormData({
      name: isUnknown ? "" : selectedCall.name,
      ageYears: yrs !== null && yrs !== undefined ? String(yrs) : "",
      ageMonths: mos !== null && mos !== undefined ? String(mos) : "",
      ageDays: dys !== null && dys !== undefined ? String(dys) : "",
      gender: selectedCall.gender || "",
    });

    setIsEditingNotes(false);
    setNotesFormData(selectedCall.summary || "");
    setOutcomeFormData(selectedCall.outcome || "Interested");
    setAppointmentModalMode(null);
    setCancelRemarks("");
  }, [selectedCall?.id]);

  // Dynamically compute KPI metrics from filtered IndexedDB calls
  const metrics = useMemo(() => {
    return calculateCallMetrics(filteredCalls);
  }, [filteredCalls]);

  // 6 KPI Metric Cards
  const statCards = useMemo(() => [
    {
      label: "Total Calls",
      value: (metrics.totalCalls || 0).toLocaleString(),
      delta: dateRange === "today" ? "Today's Volume" : "Active Window",
      deltaColor: "#4f46e5",
      deltaBg: "rgba(99,102,241,0.10)",
      deltaLabel: null,
      glow: "rgba(99,102,241,0.10)",
      iconBg: "rgba(99,102,241,0.10)",
      iconBorder: "rgba(99,102,241,0.18)",
      iconColor: "#6366f1",
      icon: PhoneCall,
    },
    {
      label: "Answered Calls",
      value: (metrics.answeredCalls || 0).toLocaleString(),
      delta: `↑ ${metrics.totalCalls ? Math.round((metrics.answeredCalls / metrics.totalCalls) * 100) : 84}%`,
      deltaColor: "#059669",
      deltaBg: "rgba(5,150,105,0.10)",
      deltaLabel: "connection rate",
      glow: "rgba(16,185,129,0.10)",
      iconBg: "rgba(16,185,129,0.10)",
      iconBorder: "rgba(16,185,129,0.20)",
      iconColor: "#10b981",
      icon: PhoneIncoming,
    },
    {
      label: "Missed Calls",
      value: (metrics.missedCalls || 0).toLocaleString(),
      delta: `${metrics.totalCalls ? Math.round((metrics.missedCalls / metrics.totalCalls) * 100) : 16}%`,
      deltaColor: "#e11d48",
      deltaBg: "rgba(244,63,94,0.10)",
      deltaLabel: "unanswered",
      glow: "rgba(244,63,94,0.10)",
      iconBg: "rgba(244,63,94,0.10)",
      iconBorder: "rgba(244,63,94,0.20)",
      iconColor: "#e11d48",
      icon: PhoneMissed,
    },
    {
      label: "Average Score",
      value: String(metrics.avgScore || 78),
      valueSuffix: "/100",
      delta: "↑ 12%",
      deltaColor: "#059669",
      deltaBg: "rgba(5,150,105,0.10)",
      deltaLabel: "quality index",
      glow: "rgba(139,92,246,0.10)",
      iconBg: "rgba(139,92,246,0.10)",
      iconBorder: "rgba(139,92,246,0.18)",
      iconColor: "#7c3aed",
      icon: BarChart3,
    },
    {
      label: "Conversion Rate",
      value: String(metrics.conversionRate || 24),
      valueSuffix: "%",
      delta: "↑ 18%",
      deltaColor: "#059669",
      deltaBg: "rgba(5,150,105,0.10)",
      deltaLabel: "booked slots",
      glow: "rgba(14,165,233,0.10)",
      iconBg: "rgba(14,165,233,0.10)",
      iconBorder: "rgba(14,165,233,0.18)",
      iconColor: "#0284c7",
      icon: TrendingUp,
    },
    {
      label: "Coaching Opportunities",
      value: (metrics.coachingOpportunities || 0).toLocaleString(),
      delta: "AI Identified",
      deltaColor: "#6366f1",
      deltaBg: "rgba(99,102,241,0.09)",
      deltaLabel: null,
      glow: "rgba(245,158,11,0.08)",
      iconBg: "rgba(245,158,11,0.10)",
      iconBorder: "rgba(245,158,11,0.20)",
      iconColor: "#d97706",
      icon: Sparkles,
    },
  ], [metrics, dateRange]);

  const callTabs = [
    { id: "summary", label: "Summary", icon: FileText },
    { id: "notes", label: "Clinical Notes", icon: Edit2 },
    { id: "transcript", label: "Transcript", icon: MessageSquare },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "coaching", label: "Coaching", icon: Sparkles },
    { id: "log", label: "Activity Log", icon: History },
  ];

  const handleTabKeyDown = (event, currentIndex) => {
    const lastIndex = callTabs.length - 1;
    let nextIndex = currentIndex;
    if (event.key === "ArrowRight")
      nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
    else if (event.key === "ArrowLeft")
      nextIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = lastIndex;
    else return;
    event.preventDefault();
    setActiveCallTab(callTabs[nextIndex].id);
    event.currentTarget.parentElement.querySelectorAll('[role="tab"]')[nextIndex]?.focus();
  };

  // Export report handler
  const handleExport = () => {
    exportCallsToCSV(filteredCalls, "apple-hospital-calls-report.csv");
    setToastMessage(`Exported ${filteredCalls.length.toLocaleString()} calls from IndexedDB to CSV`);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Handle Call Now button -> Opens Animated Mini Dialer Window
  const handleCallNow = (call) => {
    setActiveDialerCall(call);
    setDialerState("connecting");
    setDialerSeconds(0);
    setDialerWindowMode("normal");
    setDialerPos({ x: null, y: null }); // Default bottom-right position

    clearTimeout(dialerTimerRef.current);
    dialerTimerRef.current = setTimeout(() => {
      setDialerState("connected");
    }, 2200);
  };

  // Active call timer
  useEffect(() => {
    let interval = null;
    if (activeDialerCall && dialerState === "connected") {
      interval = setInterval(() => {
        setDialerSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeDialerCall, dialerState]);

  // Hang up dialer (only way to end call - no close button!)
  const handleHangUp = () => {
    setDialerState("ended");
    clearTimeout(dialerTimerRef.current);
    dialerTimerRef.current = setTimeout(() => {
      setActiveDialerCall(null);
      setDialerSeconds(0);
      setDialerPos({ x: null, y: null });
    }, 1200);
  };

  // Save edited patient details (Name, Phone, Age [Years, Months, Days], Gender)
  const handleSavePatientDetails = () => {
    if (!selectedCall) return;
    const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const nowDate = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });

    const yNum = patientFormData.ageYears !== "" ? Number(patientFormData.ageYears) : "";

    const updated = {
      ...selectedCall,
      name: patientFormData.name.trim() || "Patient",
      phone: selectedCall.phone,
      age: yNum !== "" ? yNum : (selectedCall.age || ""),
      ageYears: patientFormData.ageYears,
      ageMonths: patientFormData.ageMonths,
      ageDays: patientFormData.ageDays,
      gender: patientFormData.gender || "",
    };

    const ageDesc = [
      patientFormData.ageYears !== "" ? `${patientFormData.ageYears}y` : "",
      patientFormData.ageMonths !== "" ? `${patientFormData.ageMonths}m` : "",
      patientFormData.ageDays !== "" ? `${patientFormData.ageDays}d` : "",
    ].filter(Boolean).join(" ") || "unspecified";

    const logEntry = {
      id: `log-${Date.now()}`,
      action: "Patient Details Updated",
      type: "patient_edit",
      actor: "Front Desk Staff",
      timestamp: `${nowDate}, ${nowTime}`,
      details: `Updated name to "${updated.name}", age to ${ageDesc}, gender to ${updated.gender || "unknown"} (Connected line: ${selectedCall.phone}).`,
    };

    const existingLogs = selectedCall.activityLog || getDefaultActivityLogs(selectedCall);
    updated.activityLog = [logEntry, ...existingLogs];

    setCalls((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    updateCallInDB(updated).catch(() => {});
    setIsEditingPatient(false);
    setToastMessage("✓ Patient details saved & logged to IndexedDB");
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Appointment action handlers (Book, Reschedule, Cancel)
  const handleOpenBooking = () => {
    setAppointmentForm({
      doctor: "Dr. Sharma - Chief Cardiologist",
      date: getLocalDateString(new Date(Date.now() + 86400000)),
      time: "10:30 AM",
      mode: "In-Person OPD",
      remarks: "Patient requested clinical consultation.",
    });
    setAppointmentModalMode("book");
  };

  const handleOpenReschedule = () => {
    const existing = selectedCall?.appointment;
    setAppointmentForm({
      doctor: existing?.doctor || "Dr. Sharma - Chief Cardiologist",
      date: existing?.date || getLocalDateString(new Date(Date.now() + 86400000)),
      time: existing?.time || "10:30 AM",
      mode: existing?.mode || "In-Person OPD",
      remarks: "Patient requested appointment time adjustment.",
    });
    setAppointmentModalMode("reschedule");
  };

  const handleOpenCancel = () => {
    setCancelRemarks("Patient unable to attend; requested cancellation.");
    setAppointmentModalMode("cancel");
  };

  // Confirm appointment booking for answered calls only
  const handleConfirmBooking = () => {
    if (!selectedCall) return;
    const refNumber = `APH-${Math.floor(100000 + Math.random() * 900000)}`;
    const apptDate = appointmentForm.date || "Tomorrow";
    const apptTime = appointmentForm.time;
    const remarks = appointmentForm.remarks.trim() || "Clinical consultation scheduled.";
    const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const nowDate = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });

    const apptInfo = {
      refNumber,
      doctor: appointmentForm.doctor,
      date: apptDate,
      time: apptTime,
      mode: appointmentForm.mode,
      remarks,
      status: "confirmed",
      bookedAt: nowTime,
      smsSent: true,
      whatsappSent: true,
    };

    const cleanSummary = (selectedCall.summary || "").replace(/\[Appointment.*?\]/g, "").trim();
    const updatedSummary = `${cleanSummary} [Appointment Booked: Ref #${refNumber} with ${appointmentForm.doctor.split(" - ")[0]} on ${apptDate} at ${apptTime} (${appointmentForm.mode}) - Remarks: ${remarks}].`;

    const logEntry = {
      id: `log-${Date.now()}`,
      action: "Appointment Booked",
      type: "appointment_booked",
      actor: selectedCall.agent || "Front Desk",
      timestamp: `${nowDate}, ${nowTime}`,
      details: `Ref #${refNumber} booked with ${appointmentForm.doctor} on ${apptDate} at ${apptTime} (${appointmentForm.mode}). Remarks: "${remarks}".`,
      smsStatus: `WhatsApp & SMS confirmation sent to ${selectedCall.phone}`,
    };

    const existingLogs = selectedCall.activityLog || getDefaultActivityLogs(selectedCall);
    const updated = {
      ...selectedCall,
      outcome: "Interested",
      appointment: apptInfo,
      summary: updatedSummary,
      activityLog: [logEntry, ...existingLogs],
    };

    setCalls((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    updateCallInDB(updated).catch(() => {});
    setAppointmentModalMode(null);
    setToastMessage(`✓ Appointment confirmed! WhatsApp & SMS sent to ${selectedCall.phone} (Ref #${refNumber})`);
    setTimeout(() => setToastMessage(""), 4500);
  };

  // Confirm appointment reschedule
  const handleConfirmReschedule = () => {
    if (!selectedCall || !selectedCall.appointment) return;
    const refNumber = selectedCall.appointment.refNumber || selectedCall.appointment.token || `APH-${Math.floor(100000 + Math.random() * 900000)}`;
    const apptDate = appointmentForm.date || selectedCall.appointment.date || "Tomorrow";
    const apptTime = appointmentForm.time;
    const remarks = appointmentForm.remarks.trim() || "Rescheduled per patient request.";
    const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const nowDate = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });

    const apptInfo = {
      ...selectedCall.appointment,
      refNumber,
      doctor: appointmentForm.doctor,
      date: apptDate,
      time: apptTime,
      mode: appointmentForm.mode,
      remarks,
      status: "rescheduled",
      rescheduledAt: nowTime,
      smsSent: true,
      whatsappSent: true,
    };

    const cleanSummary = (selectedCall.summary || "").replace(/\[Appointment.*?\]/g, "").trim();
    const updatedSummary = `${cleanSummary} [Appointment Rescheduled: Ref #${refNumber} to ${apptDate} at ${apptTime} with ${appointmentForm.doctor.split(" - ")[0]} (${appointmentForm.mode}) - Remarks: ${remarks}].`;

    const logEntry = {
      id: `log-${Date.now()}`,
      action: "Appointment Rescheduled",
      type: "appointment_rescheduled",
      actor: selectedCall.agent || "Front Desk",
      timestamp: `${nowDate}, ${nowTime}`,
      details: `Ref #${refNumber} rescheduled to ${apptDate} at ${apptTime} (${appointmentForm.mode}) with ${appointmentForm.doctor}. Remarks: "${remarks}".`,
      smsStatus: `WhatsApp & SMS reschedule notice sent to ${selectedCall.phone}`,
    };

    const existingLogs = selectedCall.activityLog || getDefaultActivityLogs(selectedCall);
    const updated = {
      ...selectedCall,
      appointment: apptInfo,
      summary: updatedSummary,
      activityLog: [logEntry, ...existingLogs],
    };

    setCalls((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    updateCallInDB(updated).catch(() => {});
    setAppointmentModalMode(null);
    setToastMessage(`✓ Appointment rescheduled! Updated WhatsApp & SMS sent to ${selectedCall.phone} (Ref #${refNumber})`);
    setTimeout(() => setToastMessage(""), 4500);
  };

  // Confirm appointment cancellation
  const handleConfirmCancel = () => {
    if (!selectedCall || !selectedCall.appointment) return;
    const refNumber = selectedCall.appointment.refNumber || selectedCall.appointment.token || `APH-${Math.floor(100000 + Math.random() * 900000)}`;
    const remarks = cancelRemarks.trim() || "Patient cancelled appointment via triage.";
    const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const nowDate = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });

    const apptInfo = {
      ...selectedCall.appointment,
      refNumber,
      status: "cancelled",
      cancelledAt: nowTime,
      cancelRemarks: remarks,
      smsSent: true,
      whatsappSent: true,
    };

    const cleanSummary = (selectedCall.summary || "").replace(/\[Appointment.*?\]/g, "").trim();
    const updatedSummary = `${cleanSummary} [Appointment Cancelled: Ref #${refNumber} - Reason: ${remarks}].`;

    const logEntry = {
      id: `log-${Date.now()}`,
      action: "Appointment Cancelled",
      type: "appointment_cancelled",
      actor: selectedCall.agent || "Front Desk",
      timestamp: `${nowDate}, ${nowTime}`,
      details: `Ref #${refNumber} cancelled. Reason: "${remarks}". WhatsApp & SMS notice delivered.`,
      smsStatus: `WhatsApp & SMS cancellation notice sent to ${selectedCall.phone}`,
    };

    const existingLogs = selectedCall.activityLog || getDefaultActivityLogs(selectedCall);
    const updated = {
      ...selectedCall,
      appointment: apptInfo,
      summary: updatedSummary,
      activityLog: [logEntry, ...existingLogs],
    };

    setCalls((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    updateCallInDB(updated).catch(() => {});
    setAppointmentModalMode(null);
    setToastMessage(`✓ Appointment Ref #${refNumber} cancelled. WhatsApp & SMS notice sent to ${selectedCall.phone}`);
    setTimeout(() => setToastMessage(""), 4500);
  };

  // Open Incoming Simulator (Simulating an Unknown Caller calling into triage)
  const handleOpenIncomingSimulator = () => {
    const randomArea = Math.floor(200 + Math.random() * 700);
    const randomMid = Math.floor(200 + Math.random() * 700);
    const randomLast = Math.floor(1000 + Math.random() * 9000);
    const phone = `+1 (${randomArea}) ${randomMid}-${randomLast}`;
    const depts = ["Emergency Triage", "Cardiology", "Neurology", "Pediatrics", "Orthopedics"];
    const dept = depts[Math.floor(Math.random() * depts.length)];

    setSimulatedIncomingCall({
      name: "Unknown Caller",
      phone,
      department: dept,
      complaint: "Inbound caller seeking clinical assessment and doctor availability.",
    });
    setIncomingWindowMode("normal");
    setIsSimulatingIncoming(true);
  };

  // Answer Incoming Call
  const handleAnswerIncoming = () => {
    if (!simulatedIncomingCall) return;
    const now = new Date();
    const isoDate = getLocalDateString(now);
    const displayDate = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const id = `call-${isoDate}-${Date.now().toString().slice(-4)}`;

    const newCall = {
      id,
      name: "Unknown Caller",
      phone: simulatedIncomingCall.phone,
      age: "",
      ageYears: "",
      ageMonths: "",
      ageDays: "",
      gender: "",
      agent: "Jennifer Davis",
      status: "answered",
      date: isoDate,
      displayDate,
      time: timeStr,
      duration: "00:01:25",
      durationSeconds: 85,
      score: 88,
      outcome: "Interested",
      sentiment: "Positive",
      tag: simulatedIncomingCall.department,
      audioUrl: "https://cdn.truefilesize.com/mp3/sample-64kbps.mp3",
      transcripts: MULTILINGUAL_TRANSCRIPTS.cardiology,
      summary: `Live answered triage call from Unknown Caller (${simulatedIncomingCall.phone}). Chief triage routing: ${simulatedIncomingCall.department}. Patient identity intake pending.`,
      highlights: [
        "Inbound call answered by Jennifer Davis.",
        `Triage routing initialized for ${simulatedIncomingCall.department}.`,
        "Patient identity & demographics intake form opened for front desk verification.",
      ],
      improvements: [
        "Capture patient full name, age (years, months, days), and gender.",
        "Verify emergency contact and prior medical records.",
      ],
    };

    setCalls((prev) => [newCall, ...prev]);
    addCallToDB(newCall).catch(() => {});
    setSelectedCallId(newCall.id);
    setIsSimulatingIncoming(false);
    setSimulatedIncomingCall(null);
    setToastMessage(`✓ Incoming call answered live! Identify caller in patient details.`);
    setTimeout(() => setToastMessage(""), 4500);
  };

  // Decline Incoming Call (turns into Missed Call from Unknown Caller)
  const handleDeclineIncoming = () => {
    if (!simulatedIncomingCall) return;
    const now = new Date();
    const isoDate = getLocalDateString(now);
    const displayDate = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const id = `call-${isoDate}-${Date.now().toString().slice(-4)}`;

    const newMissed = {
      id,
      name: "Unknown Caller",
      phone: simulatedIncomingCall.phone,
      age: "",
      ageYears: "",
      ageMonths: "",
      ageDays: "",
      gender: "",
      agent: "Unassigned Triage",
      status: "missed",
      date: isoDate,
      displayDate,
      time: timeStr,
      duration: "00:00:00",
      durationSeconds: 0,
      score: 10,
      outcome: "Missed Call",
      sentiment: "Neutral",
      tag: `${simulatedIncomingCall.department} (Missed)`,
      audioUrl: "",
      transcripts: MULTILINGUAL_TRANSCRIPTS.cardiology,
      summary: `Missed inbound call from Unknown Caller (${simulatedIncomingCall.phone}). Dropped before agent answer. Immediate nursing triage callback mandated.`,
      highlights: [
        "Inbound call dropped without agent answer.",
        "Telephony gateway logged caller number.",
        "High-priority callback queued for nursing triage desk.",
      ],
      improvements: [
        "Trigger immediate outbound callback via Call Now button.",
      ],
    };

    setCalls((prev) => [newMissed, ...prev]);
    addCallToDB(newMissed).catch(() => {});
    setSelectedCallId(newMissed.id);
    setIsSimulatingIncoming(false);
    setSimulatedIncomingCall(null);
    setToastMessage(`Incoming call declined · Added to Missed Calls triage queue`);
    setTimeout(() => setToastMessage(""), 4000);
  };

  // Save separate Call Summary / Clinical Notes & Outcome (for all calls)
  const handleSaveNotes = () => {
    if (!selectedCall) return;
    const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const nowDate = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });

    const updated = {
      ...selectedCall,
      summary: notesFormData.trim() || selectedCall.summary,
      outcome: outcomeFormData || selectedCall.outcome,
    };

    const logEntry = {
      id: `log-${Date.now()}`,
      action: "Clinical Notes & Outcome Updated",
      type: "notes_edit",
      actor: "Clinical Triage Nurse",
      timestamp: `${nowDate}, ${nowTime}`,
      details: `Outcome set to "${updated.outcome}". Clinical notes revised.`,
    };

    const existingLogs = selectedCall.activityLog || getDefaultActivityLogs(selectedCall);
    updated.activityLog = [logEntry, ...existingLogs];

    setCalls((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    updateCallInDB(updated).catch(() => {});
    setIsEditingNotes(false);
    setToastMessage("✓ Call clinical notes & outcome saved & logged to IndexedDB");
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleToggleEditNotes = () => {
    if (!isEditingNotes) {
      setNotesFormData(selectedCall?.summary || "");
      setOutcomeFormData(selectedCall?.outcome || "Interested");
      setIsEditingNotes(true);
    } else {
      setIsEditingNotes(false);
    }
  };

  // When clicking a row in the table, ensure right panel stays in viewport
  const handleSelectCall = (callId) => {
    setSelectedCallId(callId);
    setActiveCallTab("summary");
    if (detailPanelRef.current) {
      detailPanelRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  const [avBg, avFg] = avatarColors(selectedCall?.name || "");
  const activeDateLabel = DATE_RANGE_OPTIONS.find((d) => d.id === dateRange)?.label || "Today";
  const selectedMissedCount = selectedCall?.status === "missed" ? (missedCountByPhone[selectedCall.phone] || 1) : 0;

  // Selected multilingual transcript for active call (original mixed or translated)
  const activeTranscript = useMemo(() => {
    if (!selectedCall) return [];
    if (selectedCall.transcripts && selectedCall.transcripts[transcriptLang]) {
      return selectedCall.transcripts[transcriptLang];
    }
    const deptKey = selectedCall.tag?.toLowerCase().includes("pediatric") ? "pediatrics"
      : selectedCall.tag?.toLowerCase().includes("ortho") ? "orthopedics" : "cardiology";
    const bank = MULTILINGUAL_TRANSCRIPTS[deptKey] || MULTILINGUAL_TRANSCRIPTS.cardiology;
    return bank[transcriptLang] || (transcriptLang === "original" ? bank.original : bank.eng) || bank.eng;
  }, [selectedCall, transcriptLang]);

  return (
    <div
      className="animate-slide-up"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(145deg,#f0f4ff 0%,#faf5ff 45%,#f0fdf9 100%)",
        color: "#0f172a",
        fontFamily: "'Inter',sans-serif",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* ── Ambient orbs ── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 600, height: 600, top: -200, left: -150, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.09) 0%,transparent 65%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", width: 500, height: 500, bottom: -150, right: -100, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.07) 0%,transparent 65%)", filter: "blur(60px)" }} />
      </div>

      {/* ── Universal Header matching reference design ── */}
      <RouteTopBar
        onBack={() => navigateTo("/")}
        backLabel="Back to Home"
        hospitalName="ABCD Multispecialty Hospital"
        badge="CALL CENTER TELEPHONY & QA"
        badgeBg="#ede9fe"
        badgeColor="#6d28d9"
        title="Call Center Telephony & Agent Performance"
        rightControls={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 99, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.22)", color: "#047857", fontSize: 12, fontWeight: 600 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 6px rgba(16,185,129,0.6)" }} />
              IndexedDB ({calls.length.toLocaleString()} calls)
            </span>
          </div>
        }
      />

      {/* ── Main ── */}
      <main style={{ padding: "32px 24px 80px", position: "relative", zIndex: 1 }}>

        {/* 1. TOP HEADER + RIGHT ACTIONS (No 'Call Center Analytics' text, with LIVE BOARD indicator) */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
              <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "clamp(24px,3.5vw,34px)", fontWeight: 800, color: "#0f172a", lineHeight: 1.1 }}>
                Calls{" "}
                <span style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Performance
                </span>
              </h1>
              
              {/* LIVE BOARD INDICATOR */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 12px", borderRadius: 99, background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.30)", color: "#047857", fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                <span style={{ position: "relative", display: "flex", height: 8, width: 8 }}>
                  <span style={{ position: "absolute", display: "inline-flex", height: "100%", width: "100%", borderRadius: "50%", background: "#10b981", opacity: 0.75, animation: "livePulse 1.6s cubic-bezier(0, 0, 0.2, 1) infinite" }} />
                  <span style={{ position: "relative", display: "inline-flex", borderRadius: "50%", height: 8, width: 8, background: "#059669" }} />
                </span>
                Live Board
              </div>
            </div>

            <p style={{ marginTop: 6, fontSize: 14, color: "#64748b", maxWidth: 640, lineHeight: 1.5 }}>
              Review clinical recordings, monitor agent triage performance, and surface AI coaching opportunities in real time for{" "}
              <strong style={{ color: "#334155", fontWeight: 700 }}>{activeDateLabel}</strong>{" "}
              ({filteredCalls.length.toLocaleString()} calls).
            </p>
          </div>

          {/* Right Action Shelf */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", position: "relative" }}>
            {/* LIVE INCOMING CALL SIMULATOR BUTTON */}
            <button
              type="button"
              onClick={handleOpenIncomingSimulator}
              title="Simulate a live inbound patient call to test triage workflow"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "8px 14px",
                borderRadius: 10,
                background: "linear-gradient(135deg,rgba(16,185,129,0.12),rgba(5,150,105,0.06))",
                border: "1px solid rgba(16,185,129,0.32)",
                color: "#047857",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 1px 4px rgba(16,185,129,0.15)",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
            >
              <span style={{ position: "relative", display: "flex", height: 8, width: 8 }}>
                <span style={{ position: "absolute", display: "inline-flex", height: "100%", width: "100%", borderRadius: "50%", background: "#10b981", opacity: 0.8, animation: "livePulse 1.4s infinite" }} />
                <span style={{ position: "relative", display: "inline-flex", borderRadius: "50%", height: 8, width: 8, background: "#059669" }} />
              </span>
              <PhoneIncoming size={14} />
              <span>Simulate Incoming Call</span>
            </button>
            
            {/* Date range picker pill (Today by default, Yesterday, Last 7d, etc.) */}
            <div ref={dateMenuRef} style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => { setIsDateMenuOpen(!isDateMenuOpen); setIsFilterMenuOpen(false); }}
                style={{ ...GLASS, padding: "8px 14px", borderRadius: 12, display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 500, color: "#334155", cursor: "pointer", transition: "all 0.15s" }}
              >
                <Calendar size={14} color="#6366f1" />
                <span>{activeDateLabel}</span>
                <ChevronDown size={13} color="#94a3b8" />
              </button>

              {isDateMenuOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 6px)",
                    right: 0,
                    zIndex: 60,
                    background: "rgba(255,255,255,0.96)",
                    border: "1px solid rgba(0,0,0,0.08)",
                    borderRadius: 12,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                    backdropFilter: "blur(18px)",
                    padding: 6,
                    minWidth: 160,
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                  }}
                >
                  {DATE_RANGE_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => { setDateRange(opt.id); setIsDateMenuOpen(false); }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "7px 12px",
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: dateRange === opt.id ? 700 : 500,
                        color: dateRange === opt.id ? "#4f46e5" : "#334155",
                        background: dateRange === opt.id ? "rgba(99,102,241,0.08)" : "transparent",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      <span>{opt.label}</span>
                      {dateRange === opt.id && <Check size={13} color="#4f46e5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter Calls (Agents, Status, Quality Score filter with click outside support) */}
            <div ref={filterMenuRef} style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => { setIsFilterMenuOpen(!isFilterMenuOpen); setIsDateMenuOpen(false); }}
                style={{
                  ...GLASS,
                  padding: "8px 14px",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  fontSize: 13,
                  fontWeight: 600,
                  color: agentFilter !== "all" || statusFilter !== "all" || scoreFilter !== "all" ? "#4f46e5" : "#334155",
                  border: agentFilter !== "all" || statusFilter !== "all" || scoreFilter !== "all" ? "1px solid rgba(99,102,241,0.35)" : GLASS.border,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                <Filter size={13} color="#6366f1" />
                <span>
                  {agentFilter === "all" && statusFilter === "all" && scoreFilter === "all"
                    ? "Filter Calls"
                    : `${statusFilter !== "all" ? statusFilter : ""} ${scoreFilter !== "all" ? `[Score: ${scoreFilter}]` : ""}`}
                </span>
                <ChevronDown size={13} color="#94a3b8" />
              </button>

              {isFilterMenuOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 6px)",
                    right: 0,
                    zIndex: 60,
                    background: "rgba(255,255,255,0.96)",
                    border: "1px solid rgba(0,0,0,0.08)",
                    borderRadius: 14,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                    backdropFilter: "blur(18px)",
                    padding: 12,
                    minWidth: 240,
                  }}
                >
                  {/* Call Status */}
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                    Call Status
                  </p>
                  <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
                    {[
                      { id: "all", label: "All" },
                      { id: "answered", label: "Answered" },
                      { id: "missed", label: "Missed" },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setStatusFilter(s.id)}
                        style={{
                          flex: 1,
                          padding: "5px 8px",
                          borderRadius: 7,
                          fontSize: 11,
                          fontWeight: statusFilter === s.id ? 700 : 500,
                          background: statusFilter === s.id ? "#6366f1" : "rgba(0,0,0,0.04)",
                          color: statusFilter === s.id ? "#ffffff" : "#475569",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>

                  {/* Quality Score Filter (0-20, 21-40, 41-60, 61-80, 81-100) */}
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                    Quality Score Range
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 12, maxHeight: 130, overflowY: "auto" }}>
                    {SCORE_FILTER_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setScoreFilter(opt.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "5px 8px",
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: scoreFilter === opt.id ? 700 : 500,
                          color: scoreFilter === opt.id ? "#4f46e5" : "#334155",
                          background: scoreFilter === opt.id ? "rgba(99,102,241,0.08)" : "transparent",
                          border: "none",
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        <span>{opt.label}</span>
                        {scoreFilter === opt.id && <Check size={11} color="#4f46e5" />}
                      </button>
                    ))}
                  </div>

                  {/* Agent Filter */}
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                    Agent
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 3, maxHeight: 120, overflowY: "auto" }}>
                    <button
                      type="button"
                      onClick={() => { setAgentFilter("all"); setIsFilterMenuOpen(false); }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "5px 8px",
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: agentFilter === "all" ? 700 : 500,
                        color: agentFilter === "all" ? "#4f46e5" : "#334155",
                        background: agentFilter === "all" ? "rgba(99,102,241,0.08)" : "transparent",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      <span>All Agents</span>
                      {agentFilter === "all" && <Check size={11} color="#4f46e5" />}
                    </button>
                    {uniqueAgents.map((ag) => (
                      <button
                        key={ag}
                        type="button"
                        onClick={() => { setAgentFilter(ag); setIsFilterMenuOpen(false); }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "5px 8px",
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: agentFilter === ag ? 700 : 500,
                          color: agentFilter === ag ? "#4f46e5" : "#334155",
                          background: agentFilter === ag ? "rgba(99,102,241,0.08)" : "transparent",
                          border: "none",
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        <span>{ag}</span>
                        {agentFilter === ag && <Check size={11} color="#4f46e5" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Export Report from IndexedDB */}
            <button
              type="button"
              onClick={handleExport}
              style={{
                padding: "8px 16px",
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 600,
                color: "#ffffff",
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 7,
                boxShadow: "0 4px 14px rgba(99,102,241,0.28)",
                transition: "box-shadow 0.15s, transform 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(99,102,241,0.38)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(99,102,241,0.28)";
              }}
            >
              <Download size={13} />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* 2. FULL-WIDTH 6-COLUMN KPI CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 14,
            marginBottom: 26,
            width: "100%",
          }}
        >
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <AnimatedKpiCard key={card.label} index={idx} staggerMs={55}>
                <div
                  style={{ ...GLASS, borderRadius: 16, padding: "16px 18px", position: "relative", overflow: "hidden", transition: "transform 0.2s,box-shadow 0.2s", height: "100%" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.10)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = GLASS.boxShadow; }}
                >
                  {/* Glow orb */}
                  <div style={{ position: "absolute", top: -30, right: -30, width: 90, height: 90, borderRadius: "50%", background: `radial-gradient(circle,${card.glow},transparent 70%)`, pointerEvents: "none" }} />

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "#64748b" }}>{card.label}</span>
                    <span style={{ width: 32, height: 32, borderRadius: 9, background: card.iconBg, border: `1px solid ${card.iconBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={15} color={card.iconColor} aria-hidden="true" />
                    </span>
                  </div>

                  <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 24, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>
                    <AnimatedCounter value={card.value} />
                    {card.valueSuffix && <span style={{ fontSize: 13, fontWeight: 500, color: "#94a3b8" }}>{card.valueSuffix}</span>}
                  </p>

                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: card.deltaColor, background: card.deltaBg, padding: "2px 7px", borderRadius: 99 }}>{card.delta}</span>
                    {card.deltaLabel && <span style={{ fontSize: 11, color: "#94a3b8" }}>{card.deltaLabel}</span>}
                  </div>
                </div>
              </AnimatedKpiCard>
            );
          })}
        </div>

        {/* 3. MAIN SPLIT: TABLE (LEFT) + CALL INSPECTOR & AUDIO PLAYER (RIGHT) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 20, alignItems: "start" }}>

          {/* Calls table container */}
          <div style={{ ...GLASS, borderRadius: 20, overflow: "hidden", minWidth: 0, flex: "1 1 58%" }}>
            {/* Toolbar */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <PhoneCall size={15} color="#6366f1" aria-hidden="true" />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>IndexedDB Call Records</span>
                <span style={{ fontSize: 11, fontWeight: 500, color: "#94a3b8", background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 99, padding: "2px 9px" }}>
                  {filteredCalls.length.toLocaleString()} total
                </span>
              </div>

              {/* Search filter input */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 10, padding: "5px 10px" }}>
                <Search size={13} color="#94a3b8" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter contact..."
                  style={{ border: "none", outline: "none", background: "transparent", fontSize: 12, color: "#0f172a", width: 140 }}
                />
              </div>
            </div>

            {/* Table (No call-back button in the list) */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "rgba(0,0,0,0.025)" }}>
                    {["Contact", "Agent", "Duration", "Score", "Outcome"].map((h) => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#94a3b8", letterSpacing: "0.05em", textTransform: "uppercase", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedCalls.map((call) => {
                    const [cAvBg, cAvFg] = avatarColors(call.name);
                    const isSelected = call.id === selectedCall.id;
                    const isMissed = call.status === "missed";
                    const missedCount = isMissed ? (missedCountByPhone[call.phone] || 1) : 0;

                    return (
                      <tr
                        key={call.id}
                        onClick={() => handleSelectCall(call.id)}
                        style={{
                          cursor: "pointer",
                          background: isSelected ? "rgba(99,102,241,0.08)" : "transparent",
                          borderLeft: isSelected ? "3px solid #6366f1" : "3px solid transparent",
                          transition: "all 0.18s ease",
                        }}
                        onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "rgba(99,102,241,0.03)"; }}
                        onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                      >
                        <td style={{ padding: "14px 16px", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 34, height: 34, borderRadius: "50%", background: cAvBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: cAvFg, flexShrink: 0 }}>
                              {initials(call.name)}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: "#0f172a", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                                <span>{call.name}</span>
                                {isMissed && (
                                  <span style={{ fontSize: 9, fontWeight: 800, background: missedCount > 1 ? "rgba(225,29,72,0.14)" : "rgba(220,38,38,0.12)", color: missedCount > 1 ? "#9f1239" : "#b91c1c", padding: "1px 6px", borderRadius: 4 }}>
                                    {missedCount > 1 ? `${missedCount} Missed` : "Missed"}
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: 11, color: "#94a3b8" }}>
                                {call.phone}
                                {(formatPatientTableAge(call) || call.gender) && (
                                  <span style={{ marginLeft: 6, color: "#64748b" }}>
                                    · {formatPatientTableAge(call)} {call.gender ? `(${call.gender[0]})` : ""}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "14px 16px", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                          <div style={{ color: "#334155", fontWeight: 500 }}>{call.agent}</div>
                          <div style={{ fontSize: 11, color: "#94a3b8" }}>{call.displayDate || call.date}</div>
                        </td>
                        <td style={{ padding: "14px 16px", borderBottom: "1px solid rgba(0,0,0,0.04)", color: isMissed ? "#94a3b8" : "#64748b", fontFamily: "ui-monospace,monospace", fontSize: 12 }}>
                          {call.duration}
                        </td>
                        <td style={{ padding: "14px 16px", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                          {isMissed ? (
                            <span style={{ fontSize: 11, color: "#94a3b8" }}>—</span>
                          ) : (
                            <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: scoreBg(call.score), color: scoreColor(call.score) }}>
                              {call.score}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "14px 16px", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                          <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 99, ...outcomeBadgeStyle(call.outcome) }}>
                            {call.outcome}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div style={{ padding: "12px 20px", borderTop: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12, color: "#64748b" }}>
              <span>
                Showing {filteredCalls.length === 0 ? 0 : ((currentPage - 1) * PAGE_SIZE + 1).toLocaleString()}–{Math.min(currentPage * PAGE_SIZE, filteredCalls.length).toLocaleString()} of {filteredCalls.length.toLocaleString()} calls
              </span>

              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "5px 10px",
                    borderRadius: 8,
                    border: "1px solid rgba(0,0,0,0.08)",
                    background: currentPage === 1 ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.85)",
                    color: currentPage === 1 ? "#94a3b8" : "#334155",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  <ChevronLeft size={13} />
                  Prev
                </button>

                <span style={{ fontSize: 11, fontWeight: 700, padding: "0 6px", color: "#334155" }}>
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "5px 10px",
                    borderRadius: 8,
                    border: "1px solid rgba(0,0,0,0.08)",
                    background: currentPage >= totalPages ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.85)",
                    color: currentPage >= totalPages ? "#94a3b8" : "#334155",
                    cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  Next
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* ── Detail Panel & Modern Audio Player (Sticky & in viewport at all scroll positions) ── */}
          <aside
            ref={detailPanelRef}
            style={{
              ...GLASS,
              borderRadius: 20,
              overflow: "hidden",
              position: "sticky",
              top: 84,
              maxHeight: "calc(100vh - 104px)",
              overflowY: "auto",
              flex: "1 1 38%",
              minWidth: 320,
            }}
          >
            {/* Gradient top accent */}
            <div style={{ height: 3, background: "linear-gradient(90deg,#6366f1,#8b5cf6,#a855f7)" }} />

            <div
              key={selectedCall.id}
              style={{
                padding: 20,
                animation: "callDetailCardEnter 0.28s cubic-bezier(0.16, 1, 0.3, 1) both",
              }}
            >

              {/* Contact header with Edit button */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: avBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: avFg, flexShrink: 0 }}>
                    {initials(selectedCall.name)}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      <p style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{selectedCall.name}</p>
                      
                      {/* Edit Patient Contact button (Shows X / Cancel icon when open, Edit2 pencil when closed) */}
                      <button
                        type="button"
                        onClick={() => setIsEditingPatient(!isEditingPatient)}
                        title={isEditingPatient ? "Cancel Contact Edit" : "Edit Patient Details"}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "2px 7px",
                          borderRadius: 6,
                          background: isEditingPatient ? "rgba(239,68,68,0.10)" : "rgba(99,102,241,0.08)",
                          color: isEditingPatient ? "#dc2626" : "#4f46e5",
                          border: isEditingPatient ? "1px solid rgba(239,68,68,0.25)" : "none",
                          fontSize: 10,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        {isEditingPatient ? <X size={11} /> : <Edit2 size={11} />}
                        <span>{isEditingPatient ? "Cancel" : "Edit"}</span>
                      </button>

                      {selectedCall.status === "missed" && (
                        <span style={{ fontSize: 10, fontWeight: 800, background: selectedMissedCount > 1 ? "rgba(225,29,72,0.14)" : "rgba(220,38,38,0.12)", color: selectedMissedCount > 1 ? "#9f1239" : "#b91c1c", padding: "1px 6px", borderRadius: 4, textTransform: "uppercase" }}>
                          {selectedMissedCount > 1 ? `⚠️ ${selectedMissedCount} Missed Calls` : "MISSED"}
                        </span>
                      )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3, flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <PhoneCall size={11} color="#94a3b8" aria-hidden="true" />
                        <span style={{ fontSize: 12, color: "#94a3b8" }}>{selectedCall.phone}</span>
                      </div>
                      {(formatPatientDisplayAge(selectedCall) || selectedCall.gender) && (
                        <span style={{ fontSize: 11, color: "#475569", background: "rgba(99,102,241,0.08)", padding: "1px 7px", borderRadius: 6, fontWeight: 700 }}>
                          {formatPatientDisplayAge(selectedCall)}
                          {formatPatientDisplayAge(selectedCall) && selectedCall.gender ? " · " : ""}
                          {selectedCall.gender || ""}
                        </span>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                      <Clock3 size={11} color="#94a3b8" aria-hidden="true" />
                      <p style={{ fontSize: 12, color: "#94a3b8" }}>{selectedCall.displayDate || selectedCall.date}, {selectedCall.time}</p>
                    </div>
                  </div>
                </div>

                {/* Score badge / Missed status */}
                {selectedCall.status === "missed" ? (
                  <div style={{ textAlign: "center", background: "rgba(220,38,38,0.08)", borderRadius: 10, padding: "8px 12px", flexShrink: 0 }}>
                    <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 14, fontWeight: 800, color: "#dc2626", lineHeight: 1 }}>
                      MISSED
                    </p>
                    <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 3 }}>Unanswered</p>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", background: scoreBg(selectedCall.score), borderRadius: 10, padding: "8px 12px", flexShrink: 0 }}>
                    <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 18, fontWeight: 800, color: scoreColor(selectedCall.score), lineHeight: 1 }}>
                      {selectedCall.score}<span style={{ fontSize: 11, fontWeight: 500 }}>/100</span>
                    </p>
                    <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 3 }}>Call Score</p>
                  </div>
                )}
              </div>

              {/* ── EDITABLE PATIENT DETAILS FORM (Shown if unknown name or Edit clicked) ── */}
              {isEditingPatient && (
                <div style={{ background: "rgba(99,102,241,0.04)", border: "1px solid rgba(99,102,241,0.18)", borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 6 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#334155", display: "flex", alignItems: "center", gap: 6, margin: 0 }}>
                      <User size={14} color="#6366f1" />
                      {selectedCall.name === "Unknown Caller" ? "Identify Unknown Caller" : "Edit Patient Details"}
                    </p>
                    <span style={{ fontSize: 11, color: "#64748b", background: "rgba(0,0,0,0.04)", padding: "2px 8px", borderRadius: 6 }}>
                      Connected Line: <strong style={{ color: "#334155" }}>{selectedCall.phone}</strong>
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 10 }}>
                      <div>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#475569", marginBottom: 3 }}>Patient Full Name</label>
                        <input
                          type="text"
                          value={patientFormData.name}
                          onChange={(e) => setPatientFormData({ ...patientFormData, name: e.target.value })}
                          placeholder="Enter patient full name..."
                          style={{ width: "100%", padding: "7px 10px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.12)", fontSize: 12, background: "#ffffff", outline: "none", boxSizing: "border-box" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#475569", marginBottom: 3 }}>Gender</label>
                        <select
                          value={patientFormData.gender}
                          onChange={(e) => setPatientFormData({ ...patientFormData, gender: e.target.value })}
                          style={{ width: "100%", padding: "7px 10px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.12)", fontSize: 12, background: "#ffffff", outline: "none", boxSizing: "border-box" }}
                        >
                          <option value="">Unknown / Unspecified</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    {/* Patient Age: 3 separate inputs (Years, Months, Days) */}
                    <div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                        <label style={{ fontSize: 11, fontWeight: 600, color: "#475569" }}>
                          Patient Age (Years, Months, Days)
                        </label>
                        <span style={{ fontSize: 10, color: "#6366f1" }}>
                          {[
                            patientFormData.ageYears ? `${patientFormData.ageYears}y` : "",
                            patientFormData.ageMonths ? `${patientFormData.ageMonths}m` : "",
                            patientFormData.ageDays ? `${patientFormData.ageDays}d` : "",
                          ].filter(Boolean).join(" ") || "0y"}
                        </span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                        <div>
                          <input
                            type="number"
                            min="0"
                            max="120"
                            value={patientFormData.ageYears}
                            onChange={(e) => setPatientFormData({ ...patientFormData, ageYears: e.target.value })}
                            placeholder="Years"
                            style={{ width: "100%", padding: "7px 8px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.12)", fontSize: 12, background: "#ffffff", outline: "none", boxSizing: "border-box", textAlign: "center" }}
                          />
                          <span style={{ fontSize: 9, color: "#64748b", marginTop: 2, display: "block", textAlign: "center" }}>Years</span>
                        </div>
                        <div>
                          <input
                            type="number"
                            min="0"
                            max="11"
                            value={patientFormData.ageMonths}
                            onChange={(e) => setPatientFormData({ ...patientFormData, ageMonths: e.target.value })}
                            placeholder="Months"
                            style={{ width: "100%", padding: "7px 8px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.12)", fontSize: 12, background: "#ffffff", outline: "none", boxSizing: "border-box", textAlign: "center" }}
                          />
                          <span style={{ fontSize: 9, color: "#64748b", marginTop: 2, display: "block", textAlign: "center" }}>Months</span>
                        </div>
                        <div>
                          <input
                            type="number"
                            min="0"
                            max="30"
                            value={patientFormData.ageDays}
                            onChange={(e) => setPatientFormData({ ...patientFormData, ageDays: e.target.value })}
                            placeholder="Days"
                            style={{ width: "100%", padding: "7px 8px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.12)", fontSize: 12, background: "#ffffff", outline: "none", boxSizing: "border-box", textAlign: "center" }}
                          />
                          <span style={{ fontSize: 9, color: "#64748b", marginTop: 2, display: "block", textAlign: "center" }}>Days</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
                      <button
                        type="button"
                        onClick={() => setIsEditingPatient(false)}
                        style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.10)", background: "#ffffff", fontSize: 12, fontWeight: 600, color: "#475569", cursor: "pointer" }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSavePatientDetails}
                        style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", fontSize: 12, fontWeight: 700, color: "#ffffff", cursor: "pointer", boxShadow: "0 2px 8px rgba(99,102,241,0.25)" }}
                      >
                        Save Details
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Audio Player OR Missed Call Card with CALL NOW BUTTON ── */}
              {selectedCall.status === "missed" ? (
                <div style={{ marginBottom: 16 }}>
                  {/* Alert banner */}
                  <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.18)", borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(239,68,68,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <PhoneMissed size={18} color="#dc2626" />
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#991b1b", marginBottom: 2 }}>Inbound Call Missed</p>
                      <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.4 }}>No audio recording for unanswered calls. High-priority callback logged for triage desk.</p>
                    </div>
                  </div>

                  {/* CALL NOW BUTTON */}
                  <button
                    type="button"
                    onClick={() => handleCallNow(selectedCall)}
                    style={{
                      width: "100%",
                      padding: "12px 18px",
                      borderRadius: 12,
                      background: "linear-gradient(135deg,#059669,#10b981)",
                      color: "#ffffff",
                      border: "none",
                      fontSize: 14,
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      boxShadow: "0 4px 16px rgba(16,185,129,0.35)",
                      transition: "all 0.15s ease",
                      letterSpacing: "0.02em",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
                  >
                    <PhoneCall size={16} />
                    <span>Call Now ({selectedCall.phone})</span>
                  </button>
                </div>
              ) : (
                <div style={{ marginBottom: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                  <AudioPlayer
                    audioUrl={selectedCall.audioUrl}
                    callId={selectedCall.id}
                    score={selectedCall.score}
                    durationSeconds={parseDurationToSeconds(selectedCall.duration)}
                  />

                  {/* ── APPOINTMENT MANAGEMENT CARD (FOR ANSWERED CALLS ONLY) ── */}
                  {selectedCall.appointment && (
                    <div
                      style={{
                        background: selectedCall.appointment.status === "cancelled"
                          ? "rgba(239,68,68,0.06)"
                          : "rgba(16,185,129,0.06)",
                        border: selectedCall.appointment.status === "cancelled"
                          ? "1px solid rgba(239,68,68,0.24)"
                          : "1px solid rgba(16,185,129,0.24)",
                        borderRadius: 14,
                        padding: "14px 16px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 9,
                              background: selectedCall.appointment.status === "cancelled" ? "rgba(239,68,68,0.14)" : "rgba(16,185,129,0.14)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            {selectedCall.appointment.status === "cancelled" ? (
                              <CalendarX2 size={18} color="#dc2626" />
                            ) : (
                              <CalendarCheck2 size={18} color="#059669" />
                            )}
                          </div>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 800,
                                  background: selectedCall.appointment.status === "cancelled" ? "#dc2626" : "#059669",
                                  color: "#ffffff",
                                  padding: "2px 8px",
                                  borderRadius: 5,
                                  letterSpacing: "0.03em",
                                }}
                              >
                                Ref #{selectedCall.appointment.refNumber || selectedCall.appointment.token}
                              </span>
                              <span
                                style={{
                                  fontSize: 12,
                                  fontWeight: 800,
                                  color: selectedCall.appointment.status === "cancelled" ? "#991b1b" : "#065f46",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.02em",
                                }}
                              >
                                {selectedCall.appointment.status === "cancelled"
                                  ? "Appointment Cancelled"
                                  : selectedCall.appointment.status === "rescheduled"
                                  ? "Appointment Rescheduled"
                                  : "Appointment Confirmed"}
                              </span>
                            </div>

                            {/* Structured 5-Field Appointment Details Grid */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px", marginTop: 8, padding: "8px 12px", background: "rgba(255,255,255,0.75)", borderRadius: 8, border: "1px solid rgba(0,0,0,0.06)" }}>
                              <div>
                                <span style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", display: "block" }}>Doctor & Speciality</span>
                                <span style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{selectedCall.appointment.doctor}</span>
                              </div>
                              <div>
                                <span style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", display: "block" }}>Appointment Date</span>
                                <span style={{ fontSize: 12, fontWeight: 600, color: "#334155" }}>📅 {selectedCall.appointment.date}</span>
                              </div>
                              <div>
                                <span style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", display: "block" }}>Appointment Slots</span>
                                <span style={{ fontSize: 12, fontWeight: 600, color: "#334155" }}>⏰ {selectedCall.appointment.time}</span>
                              </div>
                              <div>
                                <span style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", display: "block" }}>Consultation Mode</span>
                                <span style={{ fontSize: 12, fontWeight: 600, color: "#334155" }}>🩺 {selectedCall.appointment.mode}</span>
                              </div>
                              <div style={{ gridColumn: "1 / -1", borderTop: "1px dashed rgba(0,0,0,0.07)", paddingTop: 5, marginTop: 2 }}>
                                <span style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", display: "block" }}>Remarks Capture</span>
                                <span style={{ fontSize: 12, color: selectedCall.appointment.status === "cancelled" ? "#b91c1c" : "#334155", fontStyle: selectedCall.appointment.status === "cancelled" ? "italic" : "normal" }}>
                                  {selectedCall.appointment.status === "cancelled"
                                    ? `Cancellation Reason: ${selectedCall.appointment.cancelRemarks || "Requested by patient"}`
                                    : (selectedCall.appointment.remarks || "Standard clinical intake remarks recorded.")}
                                </span>
                              </div>
                            </div>

                            {/* WhatsApp / SMS Confirmation Notice */}
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 6, background: "rgba(16,185,129,0.12)", padding: "2px 8px", borderRadius: 99 }}>
                              <MessageCircle size={11} color="#059669" />
                              <span style={{ fontSize: 10, fontWeight: 700, color: "#047857" }}>
                                WhatsApp & SMS notice dispatched to {selectedCall.phone}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons: Reschedule / Cancel or Rebook */}
                        {!appointmentModalMode && (
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                            {selectedCall.appointment.status !== "cancelled" ? (
                              <>
                                <button
                                  type="button"
                                  onClick={handleOpenReschedule}
                                  style={{
                                    padding: "5px 10px",
                                    borderRadius: 7,
                                    border: "1px solid rgba(16,185,129,0.35)",
                                    background: "#ffffff",
                                    color: "#047857",
                                    fontSize: 11,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                  }}
                                >
                                  <CalendarClock size={12} />
                                  <span>Reschedule</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={handleOpenCancel}
                                  style={{
                                    padding: "5px 10px",
                                    borderRadius: 7,
                                    border: "1px solid rgba(239,68,68,0.25)",
                                    background: "rgba(239,68,68,0.06)",
                                    color: "#dc2626",
                                    fontSize: 11,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                  }}
                                >
                                  <CalendarX2 size={12} />
                                  <span>Cancel</span>
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={handleOpenBooking}
                                style={{
                                  padding: "5px 12px",
                                  borderRadius: 7,
                                  border: "none",
                                  background: "linear-gradient(135deg,#059669,#10b981)",
                                  color: "#ffffff",
                                  fontSize: 11,
                                  fontWeight: 700,
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                }}
                              >
                                <CalendarPlus size={12} />
                                <span>Rebook Appointment</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* If no appointment booked yet, show clear intake card */}
                  {!selectedCall.appointment && !appointmentModalMode && (
                    <div style={{ background: "rgba(99,102,241,0.04)", border: "1px dashed rgba(99,102,241,0.3)", borderRadius: 14, padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, flexWrap: "wrap", gap: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <CalendarPlus size={15} color="#4f46e5" />
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#1e293b" }}>
                            Appointment Intake
                          </span>
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, background: "rgba(245,158,11,0.15)", color: "#b45309", padding: "1px 6px", borderRadius: 4 }}>
                          Pending Booking
                        </span>
                      </div>
                      <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 8px 0" }}>
                        No appointment scheduled yet for this interaction. Schedule consulting doctor, date, slot & mode:
                      </p>
                      <button
                        type="button"
                        onClick={handleOpenBooking}
                        style={{
                          width: "100%",
                          padding: "9px 14px",
                          borderRadius: 10,
                          background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                          color: "#ffffff",
                          border: "none",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                          boxShadow: "0 2px 8px rgba(99,102,241,0.25)",
                        }}
                      >
                        <CalendarPlus size={14} />
                        <span>Book Appointment</span>
                      </button>
                    </div>
                  )}

                  {/* ── APPOINTMENT BOOKING / RESCHEDULE FORM ── */}
                  {(appointmentModalMode === "book" || appointmentModalMode === "reschedule") && (
                    <div style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.22)", borderRadius: 14, padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {appointmentModalMode === "book" ? <CalendarPlus size={16} color="#4f46e5" /> : <CalendarClock size={16} color="#4f46e5" />}
                          <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", margin: 0 }}>
                            {appointmentModalMode === "book" ? `Book Appointment for ${selectedCall.name}` : `Reschedule Appointment (Ref #${selectedCall.appointment?.refNumber})`}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAppointmentModalMode(null)}
                          style={{ border: "none", background: "transparent", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center" }}
                        >
                          <X size={14} />
                        </button>
                      </div>

                      {/* 1. Doctor & Speciality */}
                      <div style={{ marginBottom: 10 }}>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#334155", marginBottom: 3 }}>
                          Doctor & Speciality
                        </label>
                        <select
                          value={appointmentForm.doctor}
                          onChange={(e) => setAppointmentForm({ ...appointmentForm, doctor: e.target.value })}
                          style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.12)", fontSize: 12, background: "#ffffff", outline: "none" }}
                        >
                          <option value="Dr. Sharma - Chief Cardiologist">Dr. Sharma - Chief Cardiologist</option>
                          <option value="Dr. Anita - Senior Pediatrician">Dr. Anita - Senior Pediatrician</option>
                          <option value="Dr. Jenkins - Orthopedic Specialist">Dr. Jenkins - Orthopedic Specialist</option>
                          <option value="Dr. Rajeshwar - Neurology Head">Dr. Rajeshwar - Neurology Head</option>
                          <option value="Dr. Priya - General Physician">Dr. Priya - General Physician</option>
                        </select>
                      </div>

                      {/* 2. Date */}
                      <div style={{ marginBottom: 10 }}>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#334155", marginBottom: 3 }}>
                          Appointment Date
                        </label>
                        <input
                          type="date"
                          value={appointmentForm.date}
                          onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                          style={{ width: "100%", padding: "7px 10px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.12)", fontSize: 12, background: "#ffffff", outline: "none", boxSizing: "border-box" }}
                        />
                      </div>

                      {/* 3. Slots (Button-like UI) */}
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                          <label style={{ fontSize: 11, fontWeight: 700, color: "#334155" }}>
                            Appointment Slots
                          </label>
                          <span style={{ fontSize: 10, color: "#6366f1", fontWeight: 700 }}>
                            Selected: {appointmentForm.time}
                          </span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                          {["09:30 AM", "10:30 AM", "11:45 AM", "02:30 PM", "04:15 PM", "05:30 PM"].map((slot) => {
                            const isSelected = appointmentForm.time === slot;
                            return (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => setAppointmentForm({ ...appointmentForm, time: slot })}
                                style={{
                                  padding: "8px 6px",
                                  borderRadius: 8,
                                  fontSize: 11,
                                  fontWeight: isSelected ? 800 : 500,
                                  border: isSelected ? "1.5px solid #6366f1" : "1px solid rgba(0,0,0,0.12)",
                                  background: isSelected ? "linear-gradient(135deg,#6366f1,#4f46e5)" : "#ffffff",
                                  color: isSelected ? "#ffffff" : "#334155",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: 5,
                                  boxShadow: isSelected ? "0 2px 8px rgba(99,102,241,0.28)" : "none",
                                  transition: "all 0.15s ease",
                                }}
                              >
                                {isSelected ? <Check size={12} /> : <Clock3 size={11} color="#94a3b8" />}
                                <span>{slot}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 4. Consultation Mode */}
                      <div style={{ marginBottom: 10 }}>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#334155", marginBottom: 3 }}>
                          Consultation Mode
                        </label>
                        <select
                          value={appointmentForm.mode}
                          onChange={(e) => setAppointmentForm({ ...appointmentForm, mode: e.target.value })}
                          style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.12)", fontSize: 12, background: "#ffffff", outline: "none" }}
                        >
                          <option value="In-Person OPD">In-Person Hospital OPD</option>
                          <option value="Tele-Consultation">Video Tele-Consultation</option>
                        </select>
                      </div>

                      {/* 5. Remarks / Clinical Notes */}
                      <div style={{ marginBottom: 14 }}>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#334155", marginBottom: 3 }}>
                          Remarks / Clinical Notes
                        </label>
                        <input
                          type="text"
                          value={appointmentForm.remarks}
                          onChange={(e) => setAppointmentForm({ ...appointmentForm, remarks: e.target.value })}
                          placeholder={appointmentModalMode === "reschedule" ? "Reason for reschedule..." : "Pre-consultation clinical remarks, fasting instructions, etc..."}
                          style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.12)", fontSize: 12, background: "#ffffff", outline: "none", boxSizing: "border-box" }}
                        />
                      </div>

                      <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
                        <button
                          type="button"
                          onClick={() => setAppointmentModalMode(null)}
                          style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.1)", background: "#ffffff", fontSize: 12, fontWeight: 600, color: "#475569", cursor: "pointer" }}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={appointmentModalMode === "book" ? handleConfirmBooking : handleConfirmReschedule}
                          style={{
                            padding: "6px 16px",
                            borderRadius: 8,
                            border: "none",
                            background: "linear-gradient(135deg,#059669,#10b981)",
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#ffffff",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            boxShadow: "0 2px 8px rgba(16,185,129,0.3)",
                          }}
                        >
                          <Check size={13} />
                          <span>{appointmentModalMode === "book" ? "Confirm & Send WhatsApp/SMS" : "Save Reschedule & Notify"}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── APPOINTMENT CANCELLATION FORM ── */}
                  {appointmentModalMode === "cancel" && (
                    <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 14, padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <CalendarX2 size={16} color="#dc2626" />
                          <p style={{ fontSize: 13, fontWeight: 700, color: "#991b1b", margin: 0 }}>
                            Cancel Appointment Ref #{selectedCall.appointment?.refNumber}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAppointmentModalMode(null)}
                          style={{ border: "none", background: "transparent", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center" }}
                        >
                          <X size={14} />
                        </button>
                      </div>

                      <p style={{ fontSize: 12, color: "#475569", marginBottom: 10, lineHeight: 1.4 }}>
                        This will cancel the booking with {selectedCall.appointment?.doctor} and dispatch a cancellation SMS & WhatsApp confirmation to {selectedCall.phone}.
                      </p>

                      <div style={{ marginBottom: 12 }}>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#7f1d1d", marginBottom: 3 }}>
                          Cancellation Reason & Remarks *
                        </label>
                        <input
                          type="text"
                          value={cancelRemarks}
                          onChange={(e) => setCancelRemarks(e.target.value)}
                          placeholder="e.g. Patient emergency / illness resolved / scheduling conflict..."
                          style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(239,68,68,0.3)", fontSize: 12, background: "#ffffff", outline: "none", boxSizing: "border-box" }}
                        />
                      </div>

                      <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
                        <button
                          type="button"
                          onClick={() => setAppointmentModalMode(null)}
                          style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.1)", background: "#ffffff", fontSize: 12, fontWeight: 600, color: "#475569", cursor: "pointer" }}
                        >
                          Keep Appointment
                        </button>
                        <button
                          type="button"
                          onClick={handleConfirmCancel}
                          style={{
                            padding: "6px 16px",
                            borderRadius: 8,
                            border: "none",
                            background: "linear-gradient(135deg,#dc2626,#ef4444)",
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#ffffff",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            boxShadow: "0 2px 8px rgba(220,38,38,0.3)",
                          }}
                        >
                          <CalendarX2 size={13} />
                          <span>Confirm Cancellation & Dispatch SMS</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tabs */}
              <div
                role="tablist"
                aria-label={`${selectedCall.name} call details`}
                style={{ display: "flex", gap: 2, borderBottom: "1px solid rgba(0,0,0,0.07)", marginBottom: 0 }}
              >
                {callTabs.map(({ id, label, icon: TabIcon }, index) => {
                  const isActive = activeCallTab === id;
                  return (
                    <button
                      key={id}
                      id={`${selectedCall.id}-${id}-tab`}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`${selectedCall.id}-tabpanel`}
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => setActiveCallTab(id)}
                      onKeyDown={(e) => handleTabKeyDown(e, index)}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        padding: "10px 11px", fontSize: 12, fontWeight: isActive ? 700 : 500,
                        cursor: "pointer", border: "none", borderBottom: isActive ? "2px solid #6366f1" : "2px solid transparent",
                        background: "transparent", color: isActive ? "#6366f1" : "#64748b",
                        transition: "all 0.18s", fontFamily: "'Inter',sans-serif",
                        outline: "none",
                      }}
                    >
                      <TabIcon size={13} aria-hidden="true" />
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Tab panels */}
              <section
                id={`${selectedCall.id}-tabpanel`}
                role="tabpanel"
                aria-labelledby={`${selectedCall.id}-${activeCallTab}-tab`}
                tabIndex={0}
                style={{ minHeight: 220, paddingTop: 16, outline: "none" }}
              >
                {/* ── Summary Tab (Clinical Highlights, Action Required, Coaching Required, Tips) ── */}
                {activeCallTab === "summary" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {/* Clinical Highlights */}
                    <div style={{ background: "rgba(99,102,241,0.04)", border: "1px solid rgba(99,102,241,0.14)", borderRadius: 12, padding: "14px 16px" }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#334155", letterSpacing: "0.02em", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                        <Check size={15} color="#059669" /> Clinical Highlights
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {(selectedCall.highlights || []).map((item) => (
                          <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "#475569", lineHeight: 1.5 }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", marginTop: 6, flexShrink: 0 }} />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Required (Agent missed appointment-related details, info & immediate clinical steps) */}
                    <div style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.22)", borderRadius: 12, padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 6 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#92400e", display: "flex", alignItems: "center", gap: 6, margin: 0 }}>
                          <Clock3 size={14} color="#d97706" /> Action Required (Agent Missed Items & Follow-up)
                        </p>
                        <span style={{ fontSize: 10, fontWeight: 800, background: "rgba(245,158,11,0.18)", color: "#b45309", padding: "1px 7px", borderRadius: 4 }}>
                          Attention Needed
                        </span>
                      </div>

                      {/* Appointment status for answered call */}
                      {selectedCall.status !== "missed" && (
                        selectedCall.appointment ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#065f46", background: "rgba(16,185,129,0.10)", padding: "9px 12px", borderRadius: 8, border: "1px solid rgba(16,185,129,0.25)", marginBottom: 10 }}>
                            <Check size={14} color="#059669" style={{ flexShrink: 0 }} />
                            <div>
                              <strong style={{ color: "#065f46" }}>Appointment Scheduled:</strong> {selectedCall.appointment.doctor} on {selectedCall.appointment.date} at {selectedCall.appointment.time} ({selectedCall.appointment.mode}) · Ref #{selectedCall.appointment.refNumber}
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, fontSize: 12, color: "#92400e", background: "#ffffff", padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(245,158,11,0.3)", marginBottom: 10 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ color: "#d97706", fontWeight: 800 }}>⚠</span>
                              <div>
                                <strong style={{ color: "#92400e" }}>Appointment Not Booked:</strong> Consultation was not scheduled during this call.
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={handleOpenBooking}
                              style={{
                                padding: "5px 12px",
                                borderRadius: 6,
                                border: "none",
                                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                                color: "#ffffff",
                                fontSize: 11,
                                fontWeight: 700,
                                cursor: "pointer",
                                flexShrink: 0,
                              }}
                            >
                              Book Appointment
                            </button>
                          </div>
                        )
                      )}

                      {/* If call is MISSED: Only show missed call callback protocol */}
                      {selectedCall.status === "missed" ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "#991b1b", background: "rgba(239,68,68,0.08)", padding: "10px 12px", borderRadius: 8 }}>
                            <PhoneMissed size={16} color="#dc2626" style={{ marginTop: 2, flexShrink: 0 }} />
                            <div>
                              <strong style={{ color: "#991b1b" }}>Inbound Call Dropped / Unanswered:</strong> Caller disconnected before triage pickup. No agent intake, medical consultation, or appointment booking occurred.
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "#78350f", lineHeight: 1.5 }}>
                            <span style={{ color: "#d97706", fontWeight: 800, marginTop: 1 }}>⚠</span>
                            <div>
                              <strong style={{ color: "#92400e" }}>Urgent Outreach Mandate:</strong> Patient requires an urgent priority callback within 2 hours to evaluate clinical acuity and chief complaint.
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "#065f46", lineHeight: 1.5 }}>
                            <span style={{ color: "#059669", fontWeight: 800, marginTop: 1 }}>✓</span>
                            <div>
                              <strong style={{ color: "#065f46" }}>Immediate Next Step:</strong> Click the "Call Now" button above to initiate instant nursing triage callback.
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "#78350f", lineHeight: 1.5 }}>
                          <span style={{ color: "#d97706", fontWeight: 800, marginTop: 1 }}>⚠</span>
                          <div>
                            <strong style={{ color: "#92400e" }}>Missed Appointment Prep:</strong> Agent did not clarify 12-hour fasting instructions or confirm whether patient requires wheelchair assistance upon arrival.
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "#78350f", lineHeight: 1.5 }}>
                          <span style={{ color: "#d97706", fontWeight: 800, marginTop: 1 }}>⚠</span>
                          <div>
                            <strong style={{ color: "#92400e" }}>Missing Clinical Info:</strong> Prior medication adherence history and emergency contact details were not captured during intake.
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "#78350f", lineHeight: 1.5 }}>
                          <span style={{ color: "#059669", fontWeight: 800, marginTop: 1 }}>✓</span>
                          <div>
                            <strong style={{ color: "#065f46" }}>Immediate Next Step:</strong> Dispatch pre-consultation digital intake questionnaire & preparation checklist via WhatsApp/SMS.
                          </div>
                        </div>
                      </div>
                      )}
                    </div>

                    {/* Coaching Required with REDIRECT LINK to Coaching Tab */}
                    <div style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.18)", borderRadius: 12, padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#3730a3", display: "flex", alignItems: "center", gap: 6, margin: 0 }}>
                          <Sparkles size={14} color="#6366f1" /> Coaching Required
                        </p>
                        <button
                          type="button"
                          onClick={() => setActiveCallTab("coaching")}
                          style={{
                            border: "none",
                            background: "transparent",
                            color: "#4f46e5",
                            fontSize: 11,
                            fontWeight: 700,
                            cursor: "pointer",
                            padding: 0,
                            textDecoration: "underline",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 3,
                          }}
                        >
                          <span>Open Coaching Tab →</span>
                        </button>
                      </div>
                      <p style={{ fontSize: 12, color: "#475569", lineHeight: 1.5, margin: "0 0 8px 0" }}>
                        AI has flagged 2 coaching opportunities for this call regarding clinical protocol adherence and appointment intake verification.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveCallTab("coaching")}
                        style={{
                          padding: "5px 12px",
                          borderRadius: 6,
                          background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                          color: "#ffffff",
                          border: "none",
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          boxShadow: "0 2px 6px rgba(99,102,241,0.25)",
                        }}
                      >
                        <Sparkles size={11} />
                        <span>View Coaching Opportunities & Action Plan</span>
                      </button>
                    </div>

                    {/* Clinical Triage Tips */}
                    <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.18)", borderRadius: 12, padding: "14px 16px" }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#065f46", display: "flex", alignItems: "center", gap: 6, margin: "0 0 8px 0" }}>
                        <Sparkles size={14} color="#059669" /> Triage Best Practice Tips
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "#047857", lineHeight: 1.5 }}>
                          <span style={{ fontWeight: 700 }}>💡</span>
                          <span><strong>Confirm Pre-Visit Fasting:</strong> Always confirm if OPD consultations involve diagnostic lab work before finalizing appointment time.</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "#047857", lineHeight: 1.5 }}>
                          <span style={{ fontWeight: 700 }}>💡</span>
                          <span><strong>Mobility Screening:</strong> Proactively inquire if elderly patients require wheelchair assistance or escort upon arrival at the hospital lobby.</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "#047857", lineHeight: 1.5 }}>
                          <span style={{ fontWeight: 700 }}>💡</span>
                          <span><strong>Closing Loop:</strong> Repeat the Reference Number and confirmed time slot before disconnecting to ensure patient certainty.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Call Summary & Clinical Notes Tab ── */}
                {activeCallTab === "notes" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.14)", borderRadius: 14, padding: "16px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <FileText size={16} color="#6366f1" aria-hidden="true" />
                          <p style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", margin: 0 }}>Call Summary & Clinical Notes</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleToggleEditNotes}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            padding: "4px 10px",
                            borderRadius: 6,
                            background: isEditingNotes ? "rgba(239,68,68,0.08)" : "rgba(99,102,241,0.08)",
                            color: isEditingNotes ? "#dc2626" : "#4f46e5",
                            border: isEditingNotes ? "1px solid rgba(239,68,68,0.2)" : "none",
                            fontSize: 11,
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          {isEditingNotes ? <X size={11} /> : <Edit2 size={11} />}
                          <span>{isEditingNotes ? "Cancel" : "Edit Notes & Outcome"}</span>
                        </button>
                      </div>

                      {isEditingNotes ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                          <div>
                            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#475569", marginBottom: 4 }}>
                              Call Outcome & Status
                            </label>
                            <select
                              value={outcomeFormData}
                              onChange={(e) => setOutcomeFormData(e.target.value)}
                              style={{
                                width: "100%",
                                padding: "7px 10px",
                                borderRadius: 8,
                                border: "1px solid rgba(99,102,241,0.25)",
                                fontSize: 12,
                                background: "#ffffff",
                                color: "#1e293b",
                                fontWeight: 600,
                                outline: "none",
                              }}
                            >
                              <option value="Interested">Interested (Appointment Scheduled / Consultation Confirmed)</option>
                              <option value="Follow up">Follow up (Follow-up Required / Pending Test)</option>
                              <option value="Callback Requested">Callback Requested (Front-desk Callback Pending)</option>
                              <option value="Escalated">Escalated (Senior Specialist Review Required)</option>
                              <option value="Not interested">Not interested (Inquiry Only / Declined Care)</option>
                              <option value="Missed Call">Missed Call (Unanswered Inbound Call)</option>
                            </select>
                          </div>

                          <div>
                            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#475569", marginBottom: 4 }}>
                              Clinical Intake Summary & Notes
                            </label>
                            <textarea
                              value={notesFormData}
                              onChange={(e) => setNotesFormData(e.target.value)}
                              rows={4}
                              placeholder="Enter clinical intake summary and triage notes..."
                              style={{
                                width: "100%",
                                padding: "8px 10px",
                                borderRadius: 8,
                                border: "1px solid rgba(99,102,241,0.25)",
                                fontSize: 12,
                                background: "#ffffff",
                                outline: "none",
                                resize: "vertical",
                                boxSizing: "border-box",
                              }}
                            />
                          </div>

                          <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
                            <button
                              type="button"
                              onClick={() => setIsEditingNotes(false)}
                              style={{
                                padding: "5px 12px",
                                borderRadius: 6,
                                border: "1px solid rgba(0,0,0,0.1)",
                                background: "#ffffff",
                                fontSize: 11,
                                fontWeight: 600,
                                color: "#475569",
                                cursor: "pointer",
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleSaveNotes}
                              style={{
                                padding: "5px 14px",
                                borderRadius: 6,
                                border: "none",
                                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                                fontSize: 11,
                                fontWeight: 700,
                                color: "#ffffff",
                                cursor: "pointer",
                                boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
                              }}
                            >
                              Save Notes & Outcome
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>Recorded Outcome:</span>
                            <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99, ...outcomeBadgeStyle(selectedCall.outcome) }}>
                              {selectedCall.outcome}
                            </span>
                          </div>
                          <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, margin: 0 }}>
                            {selectedCall.summary}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ── Transcript Tab (With Language Options: eng, tel, hindi, tamil, marathi) ── */}
                {activeCallTab === "transcript" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {/* Multilingual language switcher pills */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap", padding: "8px 12px", borderRadius: 10, background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.12)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Globe size={13} color="#6366f1" />
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#334155" }}>Transcript Language:</span>
                      </div>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {TRANSCRIPT_LANGUAGES.map((lang) => (
                          <button
                            key={lang.id}
                            type="button"
                            onClick={() => setTranscriptLang(lang.id)}
                            style={{
                              padding: "4px 8px",
                              borderRadius: 6,
                              fontSize: 11,
                              fontWeight: transcriptLang === lang.id ? 700 : 500,
                              background: transcriptLang === lang.id ? "#6366f1" : "rgba(255,255,255,0.85)",
                              color: transcriptLang === lang.id ? "#ffffff" : "#475569",
                              border: transcriptLang === lang.id ? "1px solid #4f46e5" : "1px solid rgba(0,0,0,0.08)",
                              cursor: "pointer",
                              transition: "all 0.12s",
                            }}
                          >
                            <span>{lang.native}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Original code-mixed audio transcript note */}
                    {transcriptLang === "original" && (
                      <div style={{ padding: "6px 10px", borderRadius: 8, background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.18)", display: "flex", alignItems: "center", gap: 6 }}>
                        <Sparkles size={12} color="#4f46e5" />
                        <span style={{ fontSize: 11, color: "#4338ca", fontWeight: 600 }}>
                          Original Audio Transcript: Natural conversational speech captured directly from call audio with code-mixed terms.
                        </span>
                      </div>
                    )}

                    {/* Dialogue turns in selected language */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {selectedCall.status === "missed" ? (
                        <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.16)", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
                          <p style={{ fontSize: 12, color: "#991b1b", fontWeight: 600 }}>
                            [No audio conversation recorded · Inbound call dropped after 6 unanswered rings]
                          </p>
                          <p style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
                            Automated voicemail recorded caller phone {selectedCall.phone}. Outbound callback pending.
                          </p>
                        </div>
                      ) : (
                        activeTranscript.map((turn, i) => {
                          const isAgent = turn.speaker === "Agent";
                          return (
                            <div
                              key={i}
                              style={{
                                background: isAgent ? "rgba(0,0,0,0.02)" : "rgba(99,102,241,0.04)",
                                border: isAgent ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(99,102,241,0.10)",
                                borderRadius: 10,
                                padding: "10px 12px",
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: isAgent ? "#6366f1" : "#0f172a" }}>
                                  {turn.speaker} ({isAgent ? selectedCall.agent : selectedCall.name})
                                </span>
                                <span style={{ fontSize: 10, color: "#94a3b8" }}>{turn.time}</span>
                              </div>
                              <p style={{ fontSize: 12, color: "#334155", lineHeight: 1.6 }}>{turn.text}</p>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}

                {/* ── Analytics Tab ── */}
                {activeCallTab === "analytics" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      { label: "Talk-to-Listen Ratio", val: selectedCall.status === "missed" ? "0% / 0%" : "42% / 58% (Balanced)", fill: selectedCall.status === "missed" ? 0 : 42 },
                      { label: "Clinical Terminology Clarity", val: selectedCall.status === "missed" ? "N/A" : "94% (High Clinical Precision)", fill: selectedCall.status === "missed" ? 0 : 94 },
                      { label: "Patient Sentiment", val: selectedCall.sentiment, fill: selectedCall.sentiment === "Positive" ? 85 : selectedCall.sentiment === "Negative" ? 30 : 60 },
                      { label: "Triage Empathy & Protocol Adherence", val: selectedCall.status === "missed" ? "0%" : "91% (Compassionate)", fill: selectedCall.status === "missed" ? 0 : 91 },
                    ].map((row, rIdx) => (
                      <div key={row.label} style={{ border: "1px solid rgba(0,0,0,0.06)", borderRadius: 10, padding: "10px 12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                          <span style={{ color: "#64748b" }}>{row.label}</span>
                          <span style={{ fontWeight: 600, color: "#0f172a" }}>{row.val}</span>
                        </div>
                        <div style={{ width: "100%", height: 6, background: "rgba(0,0,0,0.06)", borderRadius: 99, overflow: "hidden" }}>
                          <div
                            style={{
                              width: `${row.fill}%`,
                              height: "100%",
                              background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
                              borderRadius: 99,
                              transitionDelay: `${rIdx * 90}ms`,
                            }}
                            className="chart-bar-h"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ── Coaching Tab ── */}
                {activeCallTab === "coaching" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.14)", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <Sparkles size={15} color="#6366f1" style={{ flexShrink: 0, marginTop: 1 }} aria-hidden="true" />
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 3 }}>Clinical AI Coaching Focus</p>
                        <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>
                          {selectedCall.status === "missed"
                            ? "Missed inbound patient calls require prompt triage callback within 2 hours to avoid clinical care escalation."
                            : "Reinforce clinical terminology clarity, patient consent verification, and clear appointment preparation steps."}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {(selectedCall.improvements || []).map((item, index) => (
                        <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, border: "1px solid rgba(0,0,0,0.06)", borderRadius: 10, padding: "12px 14px" }}>
                          <span style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(99,102,241,0.10)", color: "#4f46e5", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {index + 1}
                          </span>
                          <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.5 }}>{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Activity Log Tab ── */}
                {activeCallTab === "log" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderRadius: 10, background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.12)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <History size={14} color="#6366f1" />
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#1e293b" }}>Call Activity & Audit Log</span>
                      </div>
                      <span style={{ fontSize: 10, color: "#64748b" }}>Audit trail of all actions</span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {getDefaultActivityLogs(selectedCall).map((entry, idx) => {
                        const isAppt = entry.type?.includes("appointment");
                        const isCancel = entry.type === "appointment_cancelled";
                        const isMissed = entry.type === "missed";
                        return (
                          <div
                            key={entry.id || idx}
                            style={{
                              border: isCancel ? "1px solid rgba(239,68,68,0.2)" : isAppt ? "1px solid rgba(16,185,129,0.2)" : "1px solid rgba(0,0,0,0.07)",
                              borderRadius: 10,
                              padding: "11px 13px",
                              background: isCancel ? "rgba(239,68,68,0.03)" : isAppt ? "rgba(16,185,129,0.03)" : "#ffffff",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5, flexWrap: "wrap", gap: 6 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span
                                  style={{
                                    fontSize: 10,
                                    fontWeight: 800,
                                    padding: "2px 7px",
                                    borderRadius: 4,
                                    background: isCancel ? "rgba(239,68,68,0.14)" : isAppt ? "rgba(16,185,129,0.14)" : isMissed ? "rgba(220,38,38,0.12)" : "rgba(99,102,241,0.10)",
                                    color: isCancel ? "#dc2626" : isAppt ? "#059669" : isMissed ? "#b91c1c" : "#4f46e5",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.02em",
                                  }}
                                >
                                  {entry.action}
                                </span>
                                <span style={{ fontSize: 11, fontWeight: 600, color: "#64748b" }}>
                                  by {entry.actor}
                                </span>
                              </div>
                              <span style={{ fontSize: 10, color: "#94a3b8" }}>{entry.timestamp}</span>
                            </div>
                            <p style={{ fontSize: 12, color: "#334155", lineHeight: 1.5, margin: "0 0 5px 0" }}>
                              {entry.details}
                            </p>
                            {entry.smsStatus && (
                              <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(16,185,129,0.10)", padding: "2px 7px", borderRadius: 4, marginTop: 2 }}>
                                <Send size={9} color="#059669" />
                                <span style={{ fontSize: 10, fontWeight: 700, color: "#047857" }}>{entry.smsStatus}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </section>
            </div>
          </aside>
        </div>
      </main>

      {/* ── FLOATING MINI CALL WINDOW (DRAG & DROP, MIN/MAX RULES, NO CLOSE BUTTON) ── */}
      {activeDialerCall && (
        <div
          className="dialer-floating-window"
          style={{
            position: "fixed",
            left: dialerPos.x !== null ? `${dialerPos.x}px` : "auto",
            top: dialerPos.y !== null ? `${dialerPos.y}px` : "auto",
            bottom: dialerPos.y === null ? "24px" : "auto",
            right: dialerPos.x === null ? "24px" : "auto",
            zIndex: 90,
            background: "rgba(255,255,255,0.96)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(99,102,241,0.24)",
            borderRadius: dialerWindowMode === "minimized" ? 99 : 20,
            boxShadow: "0 20px 50px rgba(15,23,42,0.25)",
            width: dialerWindowMode === "maximized" ? 480 : dialerWindowMode === "minimized" ? "auto" : 350,
            transition: isDragging ? "none" : "all 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
            overflow: "hidden",
            userSelect: "none",
          }}
        >
          {/* Top Window Bar (Draggable handle) */}
          <div
            onMouseDown={handleDragStart}
            style={{
              padding: dialerWindowMode === "minimized" ? "10px 16px" : "12px 16px",
              background: "linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.05))",
              borderBottom: dialerWindowMode === "minimized" ? "none" : "1px solid rgba(0,0,0,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              cursor: isDragging ? "grabbing" : "grab",
            }}
          >
            {/* Status indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, pointerEvents: "none" }}>
              <span style={{ position: "relative", display: "flex", height: 9, width: 9 }}>
                <span
                  style={{
                    position: "absolute",
                    display: "inline-flex",
                    height: "100%",
                    width: "100%",
                    borderRadius: "50%",
                    background: dialerState === "connected" ? "#10b981" : dialerState === "ended" ? "#ef4444" : "#f59e0b",
                    opacity: 0.75,
                    animation: dialerState !== "ended" ? "livePulse 1.4s infinite" : "none",
                  }}
                />
                <span
                  style={{
                    position: "relative",
                    display: "inline-flex",
                    borderRadius: "50%",
                    height: 9,
                    width: 9,
                    background: dialerState === "connected" ? "#059669" : dialerState === "ended" ? "#dc2626" : "#d97706",
                  }}
                />
              </span>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", lineHeight: 1 }}>
                  {dialerState === "connecting"
                    ? "Connecting..."
                    : dialerState === "connected"
                    ? `Call Connected (${String(Math.floor(dialerSeconds / 60)).padStart(2, "0")}:${String(dialerSeconds % 60).padStart(2, "0")})`
                    : "Call Ended"}
                </p>
                {dialerWindowMode === "minimized" && (
                  <p style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>{activeDialerCall.name}</p>
                )}
              </div>
            </div>

            {/* Window controls (NO CLOSE BUTTON - only Min/Max/Restore) */}
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {/* If maximized: show ONLY the minimize option! */}
              {dialerWindowMode === "maximized" ? (
                <button
                  type="button"
                  onClick={() => {
                    setDialerWindowMode("minimized");
                    setDialerPos({ x: null, y: null }); // Move to default bottom-right!
                  }}
                  title="Minimize to bottom-right"
                  style={{ width: 26, height: 26, borderRadius: 6, border: "none", background: "rgba(0,0,0,0.06)", color: "#475569", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <Minimize2 size={12} />
                </button>
              ) : dialerWindowMode === "minimized" ? (
                /* When minimized: click restore button */
                <button
                  type="button"
                  onClick={() => setDialerWindowMode("normal")}
                  title="Expand Window"
                  style={{ width: 26, height: 26, borderRadius: 6, border: "none", background: "rgba(0,0,0,0.06)", color: "#475569", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <Maximize2 size={11} />
                </button>
              ) : (
                /* In normal mode: show minimize button (moves to bottom-right) and maximize button */
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setDialerWindowMode("minimized");
                      setDialerPos({ x: null, y: null }); // Move to default bottom-right!
                    }}
                    title="Minimize to bottom-right"
                    style={{ width: 26, height: 26, borderRadius: 6, border: "none", background: "rgba(0,0,0,0.06)", color: "#475569", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <Minus size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDialerWindowMode("maximized")}
                    title="Maximize"
                    style={{ width: 26, height: 26, borderRadius: 6, border: "none", background: "rgba(0,0,0,0.06)", color: "#475569", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <Maximize2 size={11} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Window Body (When not minimized) */}
          {dialerWindowMode !== "minimized" && (
            <div style={{ padding: 20 }}>
              {/* Patient info */}
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontSize: 20, fontWeight: 800, boxShadow: "0 8px 20px rgba(99,102,241,0.35)", position: "relative" }}>
                  {initials(activeDialerCall.name)}
                  {/* Connecting radar waves */}
                  {dialerState === "connecting" && (
                    <span style={{ position: "absolute", inset: -6, borderRadius: "50%", border: "2px solid #6366f1", animation: "radarPulse 1.4s ease-out infinite", pointerEvents: "none" }} />
                  )}
                </div>

                <p style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>{activeDialerCall.name}</p>
                <p style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{activeDialerCall.phone}</p>
                <p style={{ fontSize: 11, color: "#4f46e5", fontWeight: 600, marginTop: 4 }}>
                  Assigned Agent: {activeDialerCall.agent} · {activeDialerCall.tag}
                </p>
              </div>

              {/* Connecting Wave Visualizer */}
              <div style={{ background: "rgba(0,0,0,0.03)", borderRadius: 12, padding: "12px 16px", marginBottom: 20, textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, height: 28, marginBottom: 6 }}>
                  {[12, 24, 18, 28, 16, 22, 14, 26, 20, 15, 25, 18].map((h, i) => (
                    <span
                      key={i}
                      style={{
                        width: 3,
                        height: dialerState === "connected" ? `${h}px` : "6px",
                        background: dialerState === "connected" ? "#10b981" : "#6366f1",
                        borderRadius: 99,
                        animation: dialerState !== "ended" ? `wavePulse 0.8s ease-in-out infinite alternate ${i * 0.08}s` : "none",
                        transition: "all 0.2s ease",
                      }}
                    />
                  ))}
                </div>
                <p style={{ fontSize: 11, color: "#64748b" }}>
                  {dialerState === "connecting"
                    ? "Dialing outbound triage line (SIP)..."
                    : dialerState === "connected"
                    ? "HD Clinical Call in Progress · Encrypted"
                    : "Call Disconnected"}
                </p>
              </div>

              {/* Action Buttons: ONLY Hang Up ends call */}
              <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                <button
                  type="button"
                  onClick={handleHangUp}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 24px",
                    borderRadius: 99,
                    background: "linear-gradient(135deg,#dc2626,#ef4444)",
                    color: "#ffffff",
                    border: "none",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 6px 18px rgba(220,38,38,0.35)",
                    transition: "transform 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
                >
                  <PhoneOff size={15} />
                  <span>Hang Up</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── INCOMING CALL MINI WINDOW (Matching Call Now Floating Window) ── */}
      {isSimulatingIncoming && simulatedIncomingCall && (
        <div
          role="dialog"
          aria-label="Incoming Patient Call"
          className="dialer-floating-window incoming-call-window"
          style={{
            position: "fixed",
            right: 24,
            bottom: activeDialerCall ? 390 : 24,
            zIndex: 95,
            background: "#ffffff",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(16,185,129,0.35)",
            borderRadius: incomingWindowMode === "minimized" ? 99 : 20,
            boxShadow: "0 20px 50px rgba(15,23,42,0.25), 0 0 30px rgba(16,185,129,0.18)",
            width: incomingWindowMode === "maximized" ? 480 : incomingWindowMode === "minimized" ? "auto" : 350,
            transition: "all 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
            overflow: "hidden",
            userSelect: "none",
            animation: "callDetailCardEnter 0.22s ease-out",
          }}
        >
          {/* Top Window Bar */}
          <div
            style={{
              padding: incomingWindowMode === "minimized" ? "10px 16px" : "12px 16px",
              background: "linear-gradient(135deg,rgba(16,185,129,0.12),rgba(5,150,105,0.06))",
              borderBottom: incomingWindowMode === "minimized" ? "none" : "1px solid rgba(16,185,129,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            {/* Status indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ position: "relative", display: "flex", height: 9, width: 9 }}>
                <span
                  style={{
                    position: "absolute",
                    display: "inline-flex",
                    height: "100%",
                    width: "100%",
                    borderRadius: "50%",
                    background: "#10b981",
                    opacity: 0.75,
                    animation: "livePulse 1.2s infinite",
                  }}
                />
                <span
                  style={{
                    position: "relative",
                    display: "inline-flex",
                    borderRadius: "50%",
                    height: 9,
                    width: 9,
                    background: "#059669",
                  }}
                />
              </span>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#065f46", lineHeight: 1, margin: 0 }}>
                  Incoming Call · Ringing...
                </p>
                {incomingWindowMode === "minimized" && (
                  <p style={{ fontSize: 10, color: "#64748b", marginTop: 2, margin: 0 }}>
                    Unknown Caller ({simulatedIncomingCall.phone})
                  </p>
                )}
              </div>
            </div>

            {/* Window controls (Min / Max) */}
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {incomingWindowMode === "maximized" ? (
                <button
                  type="button"
                  onClick={() => setIncomingWindowMode("minimized")}
                  title="Minimize"
                  style={{ width: 26, height: 26, borderRadius: 6, border: "none", background: "rgba(0,0,0,0.06)", color: "#475569", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <Minimize2 size={12} />
                </button>
              ) : incomingWindowMode === "minimized" ? (
                <button
                  type="button"
                  onClick={() => setIncomingWindowMode("normal")}
                  title="Expand Window"
                  style={{ width: 26, height: 26, borderRadius: 6, border: "none", background: "rgba(0,0,0,0.06)", color: "#475569", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <Maximize2 size={11} />
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIncomingWindowMode("minimized")}
                    title="Minimize"
                    style={{ width: 26, height: 26, borderRadius: 6, border: "none", background: "rgba(0,0,0,0.06)", color: "#475569", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <Minus size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIncomingWindowMode("maximized")}
                    title="Maximize"
                    style={{ width: 26, height: 26, borderRadius: 6, border: "none", background: "rgba(0,0,0,0.06)", color: "#475569", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <Maximize2 size={11} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Window Body (When not minimized) */}
          {incomingWindowMode !== "minimized" && (
            <div style={{ padding: 20 }}>
              {/* Unknown Caller info */}
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg,#059669,#10b981)", margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontSize: 22, fontWeight: 800, boxShadow: "0 8px 24px rgba(16,185,129,0.35)", position: "relative" }}>
                  <PhoneIncoming size={26} />
                  {/* Pulsing radar waves */}
                  <span style={{ position: "absolute", inset: -8, borderRadius: "50%", border: "2px solid #10b981", animation: "radarPulse 1.4s ease-out infinite", pointerEvents: "none" }} />
                </div>

                <p style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", margin: "0 0 2px 0" }}>
                  Unknown Caller
                </p>
                <p style={{ fontSize: 13, color: "#64748b", margin: 0, fontWeight: 500 }}>
                  {simulatedIncomingCall.phone}
                </p>
                <p style={{ fontSize: 11, color: "#059669", fontWeight: 700, margin: "4px 0 0 0" }}>
                  Inbound Hospital Triage Line
                </p>
              </div>

              {/* Connecting Wave Visualizer */}
              <div style={{ background: "rgba(16,185,129,0.05)", borderRadius: 12, padding: "10px 14px", marginBottom: 16, textAlign: "center", border: "1px solid rgba(16,185,129,0.14)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, height: 24, marginBottom: 5 }}>
                  {[12, 24, 18, 28, 16, 22, 14, 26, 20, 15, 25, 18].map((h, i) => (
                    <span
                      key={i}
                      style={{
                        width: 3,
                        height: `${h}px`,
                        background: "#10b981",
                        borderRadius: 99,
                        animation: `wavePulse 0.8s ease-in-out infinite alternate ${i * 0.08}s`,
                      }}
                    />
                  ))}
                </div>
                <p style={{ fontSize: 11, color: "#475569", margin: 0 }}>
                  Caller waiting on line · Telephony SIP routing active
                </p>
              </div>

              {/* Two Action Buttons: Decline & Answer */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <button
                  type="button"
                  onClick={handleDeclineIncoming}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 12,
                    border: "1px solid rgba(239,68,68,0.25)",
                    background: "rgba(239,68,68,0.06)",
                    color: "#dc2626",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.12)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.06)")}
                >
                  <PhoneOff size={15} />
                  <span>Decline</span>
                </button>

                <button
                  type="button"
                  onClick={handleAnswerIncoming}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 12,
                    border: "none",
                    background: "linear-gradient(135deg,#059669,#10b981)",
                    color: "#ffffff",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    boxShadow: "0 4px 14px rgba(16,185,129,0.35)",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
                >
                  <PhoneCall size={15} />
                  <span>Answer</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Toast notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: activeDialerCall ? 88 : 24,
            right: 24,
            zIndex: 100,
            background: "#0f172a",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: 12,
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            fontSize: 13,
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Check size={16} color="#10b981" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage("")}
            style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", marginLeft: 8 }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      <style>{`
        @keyframes callDetailCardEnter {
          0% {
            opacity: 0;
            transform: translateY(24px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes livePulse {
          0% {
            transform: scale(0.95);
            opacity: 0.9;
          }
          70% {
            transform: scale(2.2);
            opacity: 0;
          }
          100% {
            transform: scale(0.95);
            opacity: 0;
          }
        }
        @keyframes radarPulse {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }
        @keyframes wavePulse {
          0% {
            transform: scaleY(0.4);
          }
          100% {
            transform: scaleY(1.4);
          }
        }
      `}</style>
    </div>
  );
}
