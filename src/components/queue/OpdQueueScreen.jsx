import React, { useState, useMemo, useEffect } from "react";
import {
  Users,
  Video,
  FlaskConical,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  BookOpen,
  Copy,
  Calendar,
  Clock,
  ArrowRight,
  Eye,
  PhoneCall,
  UserX,
  Stethoscope,
  GitPullRequest,
  Send,
  Inbox,
  Share2,
  FileText,
  Search,
  Filter,
  Check,
  ChevronDown,
  FileSearch,
  Download,
  X,
  Activity,
  Kanban,
  CalendarClock,
  LayoutGrid,
  Columns3,
  Flame,
  ArrowUpRight,
} from "lucide-react";
import { useHospitalData } from "../../hooks/useHospitalData";
import QueueKpiStats from "./QueueKpiStats";
import QuickPatientIntakeModal from "./QuickPatientIntakeModal";
import AdminConfigModal from "./AdminConfigModal";
import PrescriptionPreviewModal from "./PrescriptionPreviewModal";

// Initial realistic Referrals dataset with explicit date categories
const INITIAL_REFERRALS = {
  inbound: [
    {
      id: "ref_in_01",
      patientName: "Kavita Nair",
      age: 42,
      gender: "Female",
      uhid: "UHID-10612",
      phone: "+91 98450 11223",
      referringDoctor: "Dr. Arvind Swamy, MD (Cardiology)",
      department: "Cardiology",
      reason: "Hypertensive crisis with persistent chest tightness, rule out secondary endocrine etiology",
      urgency: "High",
      dateRange: "today",
      date: "Today, 10:15 AM",
      status: "Rx Ready",
      rxRequested: false,
      notes: "BP 170/105, ECG normal sinus with LVH. Referred for comprehensive medical workup and renal vascular check.",
      previousRx: [
        { drug: "Tab. Amlodipine 5mg", dosage: "1-0-0", duration: "14 Days", instructions: "Morning after food" },
        { drug: "Tab. Telmisartan 40mg", dosage: "0-0-1", duration: "14 Days", instructions: "Night before bed" },
      ],
      investigations: "12-Lead ECG: Sinus tachycardia with LV strain. Troponin-I: Negative (<0.01 ng/mL).",
    },
    {
      id: "ref_in_02",
      patientName: "Siddharth Jain",
      age: 49,
      gender: "Male",
      uhid: "UHID-10615",
      phone: "+91 98761 22334",
      referringDoctor: "Dr. Sameer Khan, MD (Emergency)",
      department: "Emergency Triage",
      reason: "Acute febrile illness with rigors x 3 days, mild jaundice (Total Bilirubin 2.4 mg/dL)",
      urgency: "High",
      dateRange: "today",
      date: "Today, 08:30 AM",
      status: "Rx Ready",
      rxRequested: false,
      notes: "High grade fever spikes (102.8°F). Rule out acute malaria or viral hepatitis.",
      previousRx: [
        { drug: "Tab. Paracetamol 650mg", dosage: "1-0-1 SOS", duration: "3 Days", instructions: "Post-meals" },
        { drug: "IV Normal Saline 500ml", dosage: "Stat", duration: "1 Dose", instructions: "Infused in ER" },
      ],
      investigations: "CBC: Hb 13.2, TLC 14,800, Platelets 1,20,000. LFT: Bilirubin 2.4 mg/dL, SGOT/SGPT elevated.",
    },
    {
      id: "ref_in_03",
      patientName: "Ramesh Gupta",
      age: 58,
      gender: "Male",
      uhid: "UHID-10618",
      phone: "+91 97110 44556",
      referringDoctor: "Dr. Meera Iyer, MS (Orthopedics)",
      department: "Orthopedics",
      reason: "Uncontrolled Fasting Blood Sugar 240 mg/dL prior to elective total knee replacement",
      urgency: "Routine",
      dateRange: "yesterday",
      date: "Yesterday, 04:30 PM",
      status: "Accepted",
      rxRequested: true,
      notes: "Requires glycemic optimization and insulin/OHA titration before surgical fitness clearance.",
      previousRx: [
        { drug: "Tab. Metformin 500mg", dosage: "1-0-1", duration: "30 Days", instructions: "With meals" },
        { drug: "Tab. Glimepiride 1mg", dosage: "1-0-0", duration: "30 Days", instructions: "Before breakfast" },
      ],
      investigations: "FBS: 242 mg/dL, PPBS: 310 mg/dL, HbA1c: 8.8%. Renal function normal.",
    },
    {
      id: "ref_in_04",
      patientName: "Fatima Sheikh",
      age: 31,
      gender: "Female",
      uhid: "UHID-10625",
      phone: "+91 99220 77889",
      referringDoctor: "Dr. Sunita Rao, MD (OB-GYN)",
      department: "Gynecology & OB",
      reason: "Gestational Diabetes Mellitus (GDM) screening & glycemic control at 24 weeks gestation",
      urgency: "High",
      dateRange: "this_week",
      date: "20 Oct 2026, 11:00 AM",
      status: "Completed",
      rxRequested: true,
      notes: "OGTT 2h: 182 mg/dL. Initiated dietary management and regular capillary blood glucose monitoring.",
      previousRx: [
        { drug: "Tab. Folvite 5mg", dosage: "1-0-0", duration: "60 Days", instructions: "Morning" },
        { drug: "Tab. Calcium + Vit D3", dosage: "0-1-0", duration: "60 Days", instructions: "Afternoon" },
      ],
      investigations: "OGTT 75g: Fasting 96, 1h 194, 2h 182 mg/dL.",
    },
    {
      id: "ref_in_05",
      patientName: "Deepak Verma",
      age: 51,
      gender: "Male",
      uhid: "UHID-10633",
      phone: "+91 98101 22334",
      referringDoctor: "Dr. Sameer Khan, MD (Emergency)",
      department: "Emergency Triage",
      reason: "Severe acute pyrexia (103.5°F) with thrombocytopenia (Platelets 68,000), dengue workup",
      urgency: "Emergency",
      dateRange: "this_week",
      date: "19 Oct 2026, 02:15 PM",
      status: "Admitted to Ward",
      rxRequested: true,
      notes: "NS1 antigen positive, managed with active IV crystalloids and inpatient fever monitoring.",
      previousRx: [
        { drug: "IV Paracetamol 1g", dosage: "TDS", duration: "2 Days", instructions: "Slow IV infusion" },
      ],
      investigations: "Platelets: 68,000 /mcL. Dengue NS1: Reactive.",
    },
  ],
  outbound: [
    {
      id: "ref_out_01",
      patientName: "Anita Verma",
      age: 28,
      gender: "Female",
      uhid: "UHID-10482",
      phone: "+91 98765 43210",
      referredToDoctor: "Dr. Sunita Rao, MD (OB-GYN)",
      department: "Gynecology & OB",
      reason: "Hyperemesis Gravidarum at 22w with ketonuria, urgent obstetric ultrasound & fetal assessment",
      urgency: "Priority",
      dateRange: "today",
      date: "Today, 09:45 AM",
      status: "Sent / Scheduled",
      notes: "Patient on Doxylamine + Pyridoxine, advised IV Ringer Lactate and high-resolution fetal scan.",
    },
    {
      id: "ref_out_02",
      patientName: "Manish Chawla",
      age: 56,
      gender: "Male",
      uhid: "UHID-10490",
      phone: "+91 98333 44556",
      referredToDoctor: "Dr. Arvind Swamy, MD (Cardiology)",
      department: "Cardiology",
      reason: "Exertional dyspnea NYHA Class II with new onset systolic murmur at aortic area",
      urgency: "High",
      dateRange: "today",
      date: "Today, 11:30 AM",
      status: "Awaiting ECHO",
      notes: "Advised 2D Echocardiography with color Doppler to rule out Aortic Stenosis / Sclerosis.",
    },
    {
      id: "ref_out_03",
      patientName: "Vikram Singh",
      age: 45,
      gender: "Male",
      uhid: "UHID-10483",
      phone: "+91 98123 45678",
      referredToDoctor: "Dr. Arvind Swamy, MD (Cardiology)",
      department: "Cardiology",
      reason: "Stage 2 Essential HTN with borderline LVH pattern on 12-lead ECG, 2D ECHO & Holter review",
      urgency: "Routine",
      dateRange: "yesterday",
      date: "Yesterday, 11:20 AM",
      status: "Completed",
      notes: "ECHO showed normal EF 62%, mild concentric LVH. Optimized on Telmisartan + Amlodipine.",
    },
    {
      id: "ref_out_04",
      patientName: "Sunita Devi",
      age: 62,
      gender: "Female",
      uhid: "UHID-10485",
      phone: "+91 98987 65432",
      referredToDoctor: "Dr. K. Saxena, MD, DM (Nephrology)",
      department: "Nephrology",
      reason: "Serum Creatinine 2.1 mg/dL, microalbuminuria, diabetic nephropathy staging",
      urgency: "Priority",
      dateRange: "this_week",
      date: "19 Oct 2026",
      status: "In Review",
      notes: "Advised renal ultrasound and urine protein-to-creatinine ratio (UPCR).",
    },
    {
      id: "ref_out_05",
      patientName: "Rahul Roy",
      age: 35,
      gender: "Male",
      uhid: "UHID-10486",
      phone: "+91 97654 32109",
      referredToDoctor: "Dr. V. K. Bansal, MS (General Surgery)",
      department: "General Surgery",
      reason: "Acute right iliac fossa tenderness with localized rebound, rule out acute appendicitis",
      urgency: "High",
      dateRange: "this_week",
      date: "18 Oct 2026",
      status: "Surgery Scheduled",
      notes: "USG abdomen revealed non-compressible inflamed appendix (8.4 mm). Surgical consult underway.",
    },
  ],
};

export default function OpdQueueScreen({
  onSelectPatient = () => {},
  onNavigateHome = () => {},
}) {
  // Dexie reactive data hook
  const {
    patients = [],
    prescriptions = [],
    adminConfigList = [],
    customDictionary = [],
    isLoading,
    callPatient,
    sendToLabs,
    finalizePrescription,
    cancelPatient,
    updatePatient,
    addPatient,
    updateAdminConfig,
    resetDemoData,
  } = useHospitalData();

  // Primary Workspace Tabs: 'live_queue' | 'referrals'
  const [activeTab, setActiveTab] = useState("live_queue");

  // Modern Multi-View Mode: 'kanban' | 'timeline' | 'cards'
  const [viewMode, setViewMode] = useState("kanban");

  // Category in Live Queue: 'lobby' (OPD Lobby Walk-in & In-Person) vs 'teleconsultations' (Video consults)
  const [queueCategory, setQueueCategory] = useState("lobby");

  // Category Filters: Status, Search, and Date Range (default: "today")
  const [queueStatusFilter, setQueueStatusFilter] = useState("all");
  const [queueSearchQuery, setQueueSearchQuery] = useState("");
  const [queueDateRange, setQueueDateRange] = useState("today"); // 'today' | 'yesterday' | 'this_week' | 'all'

  // Multiple select lanes to display (by default: waiting, tele-cont, inroom, completed)
  const [selectedLanes, setSelectedLanes] = useState(["waiting", "tele", "in_room", "completed"]);

  const toggleLane = (laneId) => {
    setSelectedLanes((prev) => {
      if (prev.includes(laneId)) {
        if (prev.length === 1) return prev; // keep at least one active
        return prev.filter((id) => id !== laneId);
      }
      return [...prev, laneId];
    });
  };

  const handleToggleAllLanes = () => {
    if (selectedLanes.length === 5) {
      setSelectedLanes(["waiting", "tele", "in_room", "completed"]);
    } else {
      setSelectedLanes(["waiting", "tele", "in_room", "completed", "no_show"]);
    }
  };

  // Referrals Desk State
  const [referralSubTab, setReferralSubTab] = useState("inbound");
  const [referralsData, setReferralsData] = useState(INITIAL_REFERRALS);
  const [referralSearch, setReferralSearch] = useState("");
  const [referralDateRange, setReferralDateRange] = useState("today"); // 'today' | 'yesterday' | 'this_week' | 'all'

  // Modal to preview requested full Rx / history
  const [rxRequestModalPatient, setRxRequestModalPatient] = useState(null);

  // Modals & previews
  const [previewPrescription, setPreviewPrescription] = useState(null);
  const [previewPatient, setPreviewPatient] = useState(null);
  const [isQuickIntakeOpen, setIsQuickIntakeOpen] = useState(false);
  const [isAdminConfigOpen, setIsAdminConfigOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showDictionary, setShowDictionary] = useState(false);

  // Doctor Duty Status
  const [doctorStatus, setDoctorStatus] = useState(() => {
    try {
      return localStorage.getItem("opd_doctor_duty_status") || "ON DUTY";
    } catch {
      return "ON DUTY";
    }
  });

  const handleDoctorStatusChange = (newStatus) => {
    setDoctorStatus(newStatus);
    try {
      localStorage.setItem("opd_doctor_duty_status", newStatus);
    } catch {}
    showToast(`Doctor duty status updated to: ${newStatus}`);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(""), 3500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleCopyDictionary = (shortcut, expansion) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(expansion);
      showToast(`Copied "${expansion}" (${shortcut}) to clipboard`);
    }
  };

  // Prescription lookup map by patientId
  const prescriptionMap = useMemo(() => {
    const map = {};
    for (const rx of prescriptions) {
      map[rx.patientId] = rx;
    }
    return map;
  }, [prescriptions]);

  // Overall KPI statistics with split waiting metrics (Walk-in vs Tele-Consult)
  const counts = useMemo(() => {
    const total = patients.length;
    const waiting = patients.filter((p) => p.queueStatus === "waiting").length;

    const waitingWalkIn = patients.filter(
      (p) =>
        p.queueStatus === "waiting" &&
        (p.consultationType === "walk_in" || p.consultationType === "online_booking")
    ).length;

    const waitingTele = patients.filter(
      (p) => p.queueStatus === "waiting" && p.consultationType === "tele_consultation"
    ).length;

    const inConsultation = patients.filter((p) => p.queueStatus === "in_consultation").length;
    const draftLabs = patients.filter((p) => p.queueStatus === "draft_labs").length;
    const completed = patients.filter((p) => p.queueStatus === "completed").length;
    const noShow = patients.filter(
      (p) => p.queueStatus === "cancelled" || p.queueStatus === "no_show"
    ).length;

    return {
      total,
      waiting,
      waitingWalkIn,
      waitingTele,
      inConsultation,
      draftLabs,
      completed,
      noShow,
    };
  }, [patients]);

  // Actions
  const handleStartConsultation = async (patientId) => {
    const p = patients.find((item) => item.id === patientId);
    await callPatient(patientId);
    showToast(`Called ${p ? p.name : "patient"} to Room 104`);
    onSelectPatient(patientId);
  };

  const handleResumeDraft = (patientId) => {
    const p = patients.find((item) => item.id === patientId);
    showToast(`Resumed draft for ${p ? p.name : "patient"}`);
    onSelectPatient(patientId);
  };

  const handleMarkNoShow = async (patientId) => {
    const p = patients.find((item) => item.id === patientId);
    await cancelPatient(patientId, "Marked as No-Show by triage desk");
    showToast(`Marked ${p ? p.name : "patient"} as No-Show`);
  };

  const handleReAdmit = async (patientId) => {
    const p = patients.find((item) => item.id === patientId);
    await updatePatient(patientId, { queueStatus: "waiting" });
    showToast(`Re-admitted ${p ? p.name : "patient"} to waiting queue`);
  };

  const handleResetDemoData = async () => {
    setIsResetting(true);
    try {
      await resetDemoData();
      showToast("Demo database reset to initial clinical seed state");
    } finally {
      setIsResetting(false);
    }
  };

  const handleRequestRx = (referral) => {
    setReferralsData((prev) => ({
      ...prev,
      inbound: prev.inbound.map((item) =>
        item.id === referral.id ? { ...item, rxRequested: true } : item
      ),
    }));
    setRxRequestModalPatient(referral);
    showToast(`Requested full clinical Rx & history from ${referral.referringDoctor}`);
  };

  // Helper to check if a patient date matches dateRange
  const matchesDateRange = (createdAt, range, isLiveDeskPatient = false) => {
    if (range === "all") return true;

    if (isLiveDeskPatient) {
      if (range === "today" || range === "this_week") return true;
      return false;
    }

    if (!createdAt) return range === "today" || range === "this_week";

    const d = new Date(createdAt);
    if (isNaN(d.getTime())) return range === "today";

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);
    const startOfWeek = new Date(startOfToday.getTime() - 7 * 24 * 60 * 60 * 1000);

    if (range === "today") {
      return d >= startOfToday;
    }
    if (range === "yesterday") {
      return d >= startOfYesterday && d < startOfToday;
    }
    if (range === "this_week") {
      return d >= startOfWeek;
    }
    return true;
  };

  // Base patients filtered by Date Range & Search Query
  const dateAndSearchFilteredPatients = useMemo(() => {
    const q = queueSearchQuery.trim().toLowerCase();

    return patients.filter((p) => {
      // 1. Date Range Filter
      const isLivePatient = !p.id.startsWith("pat_hist_");
      if (!matchesDateRange(p.createdAt, queueDateRange, isLivePatient)) {
        return false;
      }

      // 2. Search Query
      if (q) {
        const matchName = typeof p.name === "string" && p.name.toLowerCase().includes(q);
        const matchUhid = typeof p.uhid === "string" && p.uhid.toLowerCase().includes(q);
        const matchToken = typeof p.tokenNumber === "string" && p.tokenNumber.toLowerCase().includes(q);
        const matchPhone = typeof p.phone === "string" && p.phone.includes(q);
        const matchDiag = typeof p.diagnosis === "string" && p.diagnosis.toLowerCase().includes(q);
        if (!matchName && !matchUhid && !matchToken && !matchPhone && !matchDiag) {
          return false;
        }
      }

      return true;
    });
  }, [patients, queueSearchQuery, queueDateRange]);

  // Grouped patients for Kanban lanes (In-Room & Sent for Labs merged)
  const kanbanLanes = useMemo(() => {
    return {
      waiting: dateAndSearchFilteredPatients.filter(
        (p) => p.queueStatus === "waiting" && p.consultationType !== "tele_consultation"
      ),
      teleWaiting: dateAndSearchFilteredPatients.filter(
        (p) => p.queueStatus === "waiting" && p.consultationType === "tele_consultation"
      ),
      inRoomAndLabs: dateAndSearchFilteredPatients
        .filter(
          (p) => p.queueStatus === "in_consultation" || p.queueStatus === "draft_labs"
        )
        .sort((a, b) => (a.queueStatus === "in_consultation" ? -1 : 1)),
      completed: dateAndSearchFilteredPatients.filter((p) => p.queueStatus === "completed"),
      noShow: dateAndSearchFilteredPatients.filter(
        (p) => p.queueStatus === "cancelled" || p.queueStatus === "no_show"
      ),
    };
  }, [dateAndSearchFilteredPatients]);

  // Category patients filtered by selectedLanes for Timeline & Cards view
  const categoryPatients = useMemo(() => {
    return dateAndSearchFilteredPatients.filter((p) => {
      const isWaiting = p.queueStatus === "waiting" && p.consultationType !== "tele_consultation";
      const isTele = p.queueStatus === "waiting" && p.consultationType === "tele_consultation";
      const isInRoom = p.queueStatus === "in_consultation" || p.queueStatus === "draft_labs";
      const isCompleted = p.queueStatus === "completed";
      const isNoShow = p.queueStatus === "cancelled" || p.queueStatus === "no_show";

      if (isWaiting && !selectedLanes.includes("waiting")) return false;
      if (isTele && !selectedLanes.includes("tele")) return false;
      if (isInRoom && !selectedLanes.includes("in_room")) return false;
      if (isCompleted && !selectedLanes.includes("completed")) return false;
      if (isNoShow && !selectedLanes.includes("no_show")) return false;

      return true;
    });
  }, [dateAndSearchFilteredPatients, selectedLanes]);

  // Available lane display options for multi-select
  const laneOptions = useMemo(() => [
    { id: "waiting", label: "Waiting (Walk-in)", count: kanbanLanes.waiting.length },
    { id: "tele", label: "Tele-Consult", count: kanbanLanes.teleWaiting.length },
    { id: "in_room", label: "In Room & Labs", count: kanbanLanes.inRoomAndLabs.length },
    { id: "completed", label: "Completed", count: kanbanLanes.completed.length },
    { id: "no_show", label: "Cancelled / No-Show", count: kanbanLanes.noShow.length },
  ], [kanbanLanes]);

  // Chronological timeline appointments
  const timelinePatients = useMemo(() => {
    return [...categoryPatients].sort((a, b) => {
      const timeA = a.scheduledTime || a.createdAt || "";
      const timeB = b.scheduledTime || b.createdAt || "";
      return timeA.localeCompare(timeB);
    });
  }, [categoryPatients]);

  // Filtered Referrals
  const filteredReferrals = useMemo(() => {
    const list = referralSubTab === "inbound" ? referralsData.inbound : referralsData.outbound;
    const q = referralSearch.trim().toLowerCase();

    return list.filter((ref) => {
      if (referralDateRange !== "all") {
        if (referralDateRange === "today" && ref.dateRange !== "today") return false;
        if (referralDateRange === "yesterday" && ref.dateRange !== "yesterday") return false;
        if (
          referralDateRange === "this_week" &&
          ref.dateRange !== "today" &&
          ref.dateRange !== "yesterday" &&
          ref.dateRange !== "this_week"
        ) {
          return false;
        }
      }

      if (q) {
        const matchName = ref.patientName?.toLowerCase().includes(q);
        const matchUhid = ref.uhid?.toLowerCase().includes(q);
        const matchDoc = (ref.referringDoctor || ref.referredToDoctor)?.toLowerCase().includes(q);
        const matchDept = ref.department?.toLowerCase().includes(q);
        const matchReason = ref.reason?.toLowerCase().includes(q);
        return matchName || matchUhid || matchDoc || matchDept || matchReason;
      }

      return true;
    });
  }, [referralSubTab, referralsData, referralSearch, referralDateRange]);

  const lobbyCount = useMemo(() => {
    return patients.filter(
      (p) => p.consultationType === "walk_in" || p.consultationType === "online_booking"
    ).length;
  }, [patients]);

  const teleCount = useMemo(() => {
    return patients.filter((p) => p.consultationType === "tele_consultation").length;
  }, [patients]);


  // Helper to render patient action button
  const renderActionButton = (patient, compact = false) => {
    if (patient.queueStatus === "waiting") {
      return (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleStartConsultation(patient.id)}
            className={`bg-[#0f766e] hover:bg-[#115e59] text-white rounded-full font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
              compact ? "px-2.5 py-0.5 text-[11px]" : "px-3.5 py-1.5 text-xs"
            }`}
          >
            <PhoneCall size={compact ? 10 : 12} />
            <span>{patient.consultationType === "tele_consultation" ? "Start Video" : "Call to Room"}</span>
          </button>
          <button
            type="button"
            onClick={() => handleMarkNoShow(patient.id)}
            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
            title="Mark No-Show"
          >
            <UserX size={compact ? 11 : 13} />
          </button>
        </div>
      );
    }

    if (patient.queueStatus === "in_consultation") {
      return (
        <button
          type="button"
          onClick={() => onSelectPatient(patient.id)}
          className={`bg-[#0f766e] hover:bg-[#115e59] text-white rounded-full font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
            compact ? "px-2.5 py-0.5 text-[11px]" : "px-3.5 py-1.5 text-xs"
          }`}
        >
          <Stethoscope size={compact ? 11 : 13} />
          <span>Resume 104</span>
        </button>
      );
    }

    if (patient.queueStatus === "draft_labs") {
      return (
        <button
          type="button"
          onClick={() => handleResumeDraft(patient.id)}
          className={`bg-indigo-700 hover:bg-indigo-800 text-white rounded-full font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
            compact ? "px-2.5 py-0.5 text-[11px]" : "px-3.5 py-1.5 text-xs"
          }`}
        >
          <FlaskConical size={compact ? 10 : 12} />
          <span>Review Labs</span>
        </button>
      );
    }

    if (patient.queueStatus === "completed") {
      return (
        <button
          type="button"
          onClick={() => {
            setPreviewPatient(patient);
            setPreviewPrescription(prescriptionMap[patient.id]);
          }}
          className={`bg-emerald-700 hover:bg-emerald-800 text-white rounded-full font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
            compact ? "px-2.5 py-0.5 text-[11px]" : "px-3.5 py-1.5 text-xs"
          }`}
        >
          <Eye size={compact ? 10 : 12} />
          <span>View Rx</span>
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={() => handleReAdmit(patient.id)}
        className={`bg-slate-700 hover:bg-slate-800 text-white rounded-full font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
          compact ? "px-2.5 py-0.5 text-[11px]" : "px-3.5 py-1.5 text-xs"
        }`}
      >
        <RotateCcw size={compact ? 10 : 12} />
        <span>Re-admit</span>
      </button>
    );
  };

  return (
    <div
      style={{
        background: "linear-gradient(145deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)",
        minHeight: "100vh",
      }}
      className="text-slate-800 font-sans pb-16"
    >
      {/* 1. Header & Real-time KPI Bar with Split Waiting Metrics */}
      <QueueKpiStats
        counts={counts}
        activeFilter={queueStatusFilter}
        doctorStatus={doctorStatus}
        onDoctorStatusChange={handleDoctorStatusChange}
        onOpenQuickIntake={() => setIsQuickIntakeOpen(true)}
        onResetDemoData={handleResetDemoData}
        onOpenAdminConfig={() => setIsAdminConfigOpen(true)}
        onNavigateHome={onNavigateHome}
        isResetting={isResetting}
        onShowToast={showToast}
      />

      {/* 2. Main Operational Workspace */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 mt-6 space-y-6">
        {/* ── UNIFIED MASTER FILTER & TABS TOOLBAR (Single merged compact row) ── */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-2xs p-2 sm:px-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            {/* Left Group: Workspace Tabs + Search + Date */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Primary Tabs Toggle */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/80 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab("live_queue")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "live_queue"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Users size={13} className={activeTab === "live_queue" ? "text-teal-700" : "text-slate-500"} />
                  <span className="hidden sm:inline">Live Queue & Triage</span>
                  <span className="sm:hidden">Queue</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                      activeTab === "live_queue"
                        ? "bg-teal-100 text-teal-900 font-bold"
                        : "bg-slate-200/80 text-slate-600"
                    }`}
                  >
                    {categoryPatients.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("referrals")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "referrals"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <GitPullRequest size={13} className={activeTab === "referrals" ? "text-indigo-600" : "text-slate-500"} />
                  <span className="hidden sm:inline">Referrals Desk</span>
                  <span className="sm:hidden">Referrals</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                      activeTab === "referrals"
                        ? "bg-indigo-100 text-indigo-900 font-bold"
                        : "bg-slate-200/80 text-slate-600"
                    }`}
                  >
                    {referralsData.inbound.length + referralsData.outbound.length}
                  </span>
                </button>
              </div>

              {/* Sub-Category Pills for Referrals */}
              {activeTab === "referrals" && (
                <div className="flex items-center gap-1 bg-slate-50 p-0.5 rounded-xl border border-slate-200/70">
                  <button
                    type="button"
                    onClick={() => setReferralSubTab("inbound")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      referralSubTab === "inbound"
                        ? "bg-teal-700 text-white shadow-2xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <Inbox size={12} />
                    <span>Inbound</span>
                    <span className="text-[10px] px-1 py-0.2 rounded-full bg-white/20 font-mono">
                      {referralsData.inbound.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReferralSubTab("outbound")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      referralSubTab === "outbound"
                        ? "bg-teal-700 text-white shadow-2xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <Send size={12} />
                    <span>Outbound</span>
                    <span className="text-[10px] px-1 py-0.2 rounded-full bg-white/20 font-mono">
                      {referralsData.outbound.length}
                    </span>
                  </button>
                </div>
              )}

              {/* Compact Search Input */}
              <div className="relative w-44 sm:w-56 md:w-60 flex items-center px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200/90 shadow-2xs">
                <Search size={13} className="text-slate-400 mr-1.5 shrink-0" />
                <input
                  type="text"
                  value={activeTab === "live_queue" ? queueSearchQuery : referralSearch}
                  onChange={(e) =>
                    activeTab === "live_queue" ? setQueueSearchQuery(e.target.value) : setReferralSearch(e.target.value)
                  }
                  placeholder={activeTab === "live_queue" ? "Search patient, UHID..." : "Search referrals..."}
                  className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
                {(activeTab === "live_queue" ? queueSearchQuery : referralSearch) && (
                  <button
                    type="button"
                    onClick={() => (activeTab === "live_queue" ? setQueueSearchQuery("") : setReferralSearch(""))}
                    className="text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    <X size={11} />
                  </button>
                )}
              </div>

              {/* Date Dropdown */}
              <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-xl border border-slate-200/90 shadow-2xs text-xs shrink-0">
                <Calendar size={12} className="text-teal-700 shrink-0" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date:</span>
                <select
                  value={activeTab === "live_queue" ? queueDateRange : referralDateRange}
                  onChange={(e) =>
                    activeTab === "live_queue" ? setQueueDateRange(e.target.value) : setReferralDateRange(e.target.value)
                  }
                  className="bg-transparent font-bold text-slate-800 text-xs focus:outline-none cursor-pointer"
                >
                  <option value="today">Today (Live)</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="this_week">This Week</option>
                  <option value="all">All Dates</option>
                </select>
              </div>
            </div>

            {/* Center: Multi-Select Display Filter Pills (for Live Queue) */}
            {activeTab === "live_queue" && (
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1 hidden lg:inline">
                  Display:
                </span>
                {laneOptions.map((lane) => {
                  const isSelected = selectedLanes.includes(lane.id);
                  return (
                    <button
                      key={lane.id}
                      type="button"
                      onClick={() => toggleLane(lane.id)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                          : "bg-white hover:bg-slate-100 text-slate-600 border-slate-200/90 shadow-2xs"
                      }`}
                      title={`Toggle ${lane.label}`}
                    >
                      <span
                        className={`w-3 h-3 rounded flex items-center justify-center text-[9px] ${
                          isSelected ? "bg-teal-500 text-white" : "border border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check size={8} strokeWidth={3} />}
                      </span>
                      <span className="text-[11px]">{lane.label}</span>
                      <span
                        className={`px-1 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                          isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {lane.count}
                      </span>
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={handleToggleAllLanes}
                  className="text-[10px] font-bold text-teal-700 hover:text-teal-900 hover:underline px-1 py-0.5 cursor-pointer transition-colors"
                >
                  {selectedLanes.length === 5 ? "Reset Default" : "Select All"}
                </button>
              </div>
            )}

            {/* Right Group: View Switcher + Active Desk */}
            <div className="flex items-center gap-2 shrink-0">
              {activeTab === "live_queue" && (
                <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-xl border border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => setViewMode("kanban")}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      viewMode === "kanban"
                        ? "bg-white text-slate-900 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                    title="Kanban Board View"
                  >
                    <Columns3 size={12} className="text-teal-700" />
                    <span className="hidden sm:inline text-[11px]">Kanban</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode("timeline")}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      viewMode === "timeline"
                        ? "bg-white text-slate-900 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                    title="Timeline View"
                  >
                    <CalendarClock size={12} className="text-purple-600" />
                    <span className="hidden sm:inline text-[11px]">Timeline</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode("cards")}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      viewMode === "cards"
                        ? "bg-white text-slate-900 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                    title="Cards Grid View"
                  >
                    <LayoutGrid size={12} className="text-sky-600" />
                    <span className="hidden sm:inline text-[11px]">Cards</span>
                  </button>
                </div>
              )}

              <div className="hidden 2xl:flex items-center gap-1.5 pl-2 border-l border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">
                  Desk: <strong>Dr. Rajesh Sharma • Room 104</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── TAB CONTENT 1: Live Queue & Triage Desk ── */}
        {activeTab === "live_queue" && (
          <div className="space-y-5">

            {/* ── VIEW 1: MODERN VIBRANT MULTI-LANE KANBAN BOARD (Optimized 5–6 Cards Visibility, Fixed Header & Scrollable) ── */}
            {viewMode === "kanban" && (
              <div
                className={`grid gap-3.5 items-start ${
                  selectedLanes.length === 1
                    ? "grid-cols-1 max-w-xl mx-auto"
                    : selectedLanes.length === 2
                    ? "grid-cols-1 md:grid-cols-2"
                    : selectedLanes.length === 3
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : selectedLanes.length === 4
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
                }`}
              >
                {/* Lane 1: Waiting Pool (Walk-in / In-Person) */}
                {selectedLanes.includes("waiting") && (
                  <div className="kanban-lane group rounded-2xl border-2 border-orange-500/80 bg-orange-50/20 overflow-hidden flex flex-col h-[calc(100vh-200px)] min-h-[580px] max-h-[820px] shadow-sm">
                    {/* Fixed Top Header */}
                    <div className="flex items-center justify-between px-3 py-2 bg-[#ea580c] text-white shrink-0">
                      <div className="flex items-center gap-1.5">
                        <Users size={14} className="text-white" />
                        <h3 className="font-extrabold text-[11px] uppercase tracking-wider text-white">
                          Waiting (Walk-in)
                        </h3>
                      </div>
                      <span className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center text-[11px] font-mono font-black text-white">
                        {kanbanLanes.waiting.length}
                      </span>
                    </div>

                    {/* Independently Scrollable Patient List */}
                    <div className="p-2 space-y-1.5 flex-1 overflow-y-auto kanban-scrollbar">
                      {kanbanLanes.waiting.length > 0 ? (
                        kanbanLanes.waiting.map((pt) => (
                          <div
                            key={pt.id}
                            className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all space-y-1.5"
                          >
                            <div className="flex items-center justify-between gap-1.5 min-w-0">
                              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                <span className="px-1.5 py-0.5 rounded font-mono text-[10px] font-black bg-[#ea580c] text-white shadow-2xs shrink-0">
                                  {pt.tokenNumber || "—"}
                                </span>
                                <strong
                                  onClick={() => onSelectPatient(pt.id)}
                                  className="text-xs font-bold text-slate-900 truncate hover:text-orange-600 hover:underline cursor-pointer transition-colors"
                                  title="Click to open digital prescription workspace"
                                >
                                  {pt.name}
                                </strong>
                              </div>
                              <span className="text-[10px] text-amber-900 bg-amber-50 font-medium px-1.5 py-0.5 rounded border border-amber-200/80 flex items-center gap-1 shrink-0">
                                <Clock size={10} className="text-amber-600" />
                                <span>{pt.scheduledTime || "10:30 AM"}</span>
                              </span>
                            </div>

                            <div className="pt-1 border-t border-slate-100 flex items-center justify-between gap-1.5">
                              <span className="text-[11px] text-slate-500 font-medium truncate">
                                {pt.age}y, {pt.gender} • {pt.uhid}
                              </span>
                              <div className="shrink-0">
                                {renderActionButton(pt, true)}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="h-28 border-2 border-dashed border-orange-300/70 bg-orange-50/50 rounded-xl flex flex-col items-center justify-center text-center p-2.5 text-orange-700/70">
                          <Users className="w-5 h-5 mb-1 opacity-40 text-orange-600" />
                          <span className="text-xs font-bold text-orange-900">No waiting walk-ins</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Lane 2: Dedicated Tele-Consultations Lane */}
                {selectedLanes.includes("tele") && (
                  <div className="kanban-lane group rounded-2xl border-2 border-purple-500/80 bg-purple-50/20 overflow-hidden flex flex-col h-[calc(100vh-200px)] min-h-[580px] max-h-[820px] shadow-sm">
                    {/* Fixed Top Header */}
                    <div className="flex items-center justify-between px-3 py-2 bg-[#7c3aed] text-white shrink-0">
                      <div className="flex items-center gap-1.5">
                        <Video size={14} className="text-white" />
                        <h3 className="font-extrabold text-[11px] uppercase tracking-wider text-white">
                          Tele-Consult
                        </h3>
                      </div>
                      <span className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center text-[11px] font-mono font-black text-white">
                        {kanbanLanes.teleWaiting.length}
                      </span>
                    </div>

                    {/* Independently Scrollable Patient List */}
                    <div className="p-2 space-y-1.5 flex-1 overflow-y-auto kanban-scrollbar">
                      {kanbanLanes.teleWaiting.length > 0 ? (
                        kanbanLanes.teleWaiting.map((pt) => (
                          <div
                            key={pt.id}
                            className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all space-y-1.5"
                          >
                            <div className="flex items-center justify-between gap-1.5 min-w-0">
                              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                <span className="px-1.5 py-0.5 rounded font-mono text-[10px] font-black bg-[#7c3aed] text-white shadow-2xs flex items-center gap-1 shrink-0">
                                  <Video size={9} />
                                  <span>{pt.tokenNumber || "—"}</span>
                                </span>
                                <strong
                                  onClick={() => onSelectPatient(pt.id)}
                                  className="text-xs font-bold text-slate-900 truncate hover:text-purple-700 hover:underline cursor-pointer transition-colors"
                                  title="Click to open digital prescription workspace"
                                >
                                  {pt.name}
                                </strong>
                              </div>
                              <span className="text-[10px] text-purple-700 bg-purple-50 font-bold px-1.5 py-0.5 rounded-full border border-purple-200 shrink-0">
                                📹 Ready
                              </span>
                            </div>

                            <div className="pt-1 border-t border-slate-100 flex items-center justify-between gap-1.5">
                              <span className="text-[11px] text-slate-500 font-medium truncate">
                                {pt.age}y, {pt.gender} • {pt.uhid}
                              </span>
                              <div className="shrink-0">
                                {renderActionButton(pt, true)}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="h-28 border-2 border-dashed border-purple-300/70 bg-purple-50/50 rounded-xl flex flex-col items-center justify-center text-center p-2.5 text-purple-700/70">
                          <Video className="w-5 h-5 mb-1 opacity-40 text-purple-600" />
                          <span className="text-xs font-bold text-purple-900">No tele-consults waiting</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Lane 3: MERGED Lane (In Room 104 & Sent for Labs) */}
                {selectedLanes.includes("in_room") && (
                  <div className="kanban-lane group rounded-2xl border-2 border-teal-600/80 bg-teal-50/20 ring-1 ring-teal-200/60 overflow-hidden flex flex-col h-[calc(100vh-200px)] min-h-[580px] max-h-[820px] shadow-sm">
                    {/* Fixed Top Header */}
                    <div className="flex items-center justify-between px-3 py-2 bg-[#0f766e] text-white shrink-0">
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center -space-x-0.5">
                          <Stethoscope size={14} className="text-white" />
                          <FlaskConical size={13} className="text-teal-200" />
                        </div>
                        <h3 className="font-extrabold text-[11px] uppercase tracking-wider text-white">
                          In Room & Labs
                        </h3>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-white/20 text-white" title="In Room">
                          {kanbanLanes.inRoomAndLabs.filter((p) => p.queueStatus === "in_consultation").length} Rm
                        </span>
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-white/20 text-white" title="Sent for Labs">
                          {kanbanLanes.inRoomAndLabs.filter((p) => p.queueStatus === "draft_labs").length} Lab
                        </span>
                        <span className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center text-[11px] font-mono font-black text-white">
                          {kanbanLanes.inRoomAndLabs.length}
                        </span>
                      </div>
                    </div>

                    {/* Independently Scrollable Patient List */}
                    <div className="p-2 space-y-1.5 flex-1 overflow-y-auto kanban-scrollbar">
                      {kanbanLanes.inRoomAndLabs.length > 0 ? (
                        kanbanLanes.inRoomAndLabs.map((pt) => {
                          const isInRoom = pt.queueStatus === "in_consultation";
                          return (
                            <div
                              key={pt.id}
                              className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all space-y-1.5"
                            >
                              <div className="flex items-center justify-between gap-1.5 min-w-0">
                                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                  <span
                                    className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-black text-white shadow-2xs shrink-0 ${
                                      isInRoom ? "bg-[#0f766e]" : "bg-indigo-600"
                                    }`}
                                  >
                                    {pt.tokenNumber || "—"}
                                  </span>
                                  <strong
                                    onClick={() => onSelectPatient(pt.id)}
                                    className={`text-xs font-bold text-slate-900 truncate hover:underline cursor-pointer transition-colors ${
                                      isInRoom ? "hover:text-teal-800" : "hover:text-indigo-800"
                                    }`}
                                    title="Click to open digital prescription workspace"
                                  >
                                    {pt.name}
                                  </strong>
                                </div>
                                {isInRoom ? (
                                  <span className="text-[10px] font-bold text-white bg-teal-600 px-1.5 py-0.5 rounded-full shadow-xs flex items-center gap-1 shrink-0">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                                    <span>Room 104</span>
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded-full border border-indigo-200 flex items-center gap-1 shrink-0">
                                    <FlaskConical size={10} />
                                    <span>Labs</span>
                                  </span>
                                )}
                              </div>

                              <div className="pt-1 border-t border-slate-100 flex items-center justify-between gap-1.5">
                                <span className="text-[11px] text-slate-500 font-medium truncate">
                                  {pt.age}y, {pt.gender} • {pt.uhid}
                                </span>
                                <div className="shrink-0">
                                  {renderActionButton(pt, true)}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="h-28 border-2 border-dashed border-teal-300/80 bg-teal-50/50 rounded-xl flex flex-col items-center justify-center text-center p-2.5 text-teal-800">
                          <div className="flex items-center gap-1 mb-1 opacity-40 text-teal-600">
                            <Stethoscope className="w-5 h-5" />
                            <FlaskConical className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-bold text-teal-900">Room 104 & Labs Idle</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Lane 4: Completed & Signed */}
                {selectedLanes.includes("completed") && (
                  <div className="kanban-lane group rounded-2xl border-2 border-emerald-500/80 bg-emerald-50/20 overflow-hidden flex flex-col h-[calc(100vh-200px)] min-h-[580px] max-h-[820px] shadow-sm">
                    {/* Fixed Top Header */}
                    <div className="flex items-center justify-between px-3 py-2 bg-[#059669] text-white shrink-0">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-white" />
                        <h3 className="font-extrabold text-[11px] uppercase tracking-wider text-white">
                          Completed & Signed
                        </h3>
                      </div>
                      <span className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center text-[11px] font-mono font-black text-white">
                        {kanbanLanes.completed.length}
                      </span>
                    </div>

                    {/* Independently Scrollable Patient List */}
                    <div className="p-2 space-y-1.5 flex-1 overflow-y-auto kanban-scrollbar">
                      {kanbanLanes.completed.length > 0 ? (
                        kanbanLanes.completed.map((pt) => (
                          <div
                            key={pt.id}
                            className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all space-y-1.5"
                          >
                            <div className="flex items-center justify-between gap-1.5 min-w-0">
                              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                <span className="px-1.5 py-0.5 rounded font-mono text-[10px] font-black bg-[#059669] text-white shadow-2xs shrink-0">
                                  {pt.tokenNumber || "—"}
                                </span>
                                <strong
                                  onClick={() => onSelectPatient(pt.id)}
                                  className="text-xs font-bold text-slate-900 block truncate hover:text-emerald-800 hover:underline cursor-pointer transition-colors"
                                  title="Click to open digital prescription workspace"
                                >
                                  {pt.name}
                                </strong>
                              </div>
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200 shrink-0">
                                ✓ Signed
                              </span>
                            </div>

                            <div className="pt-1 border-t border-slate-100 flex items-center justify-between gap-1.5">
                              <span className="text-[11px] text-slate-500 font-medium truncate">
                                {pt.age}y, {pt.gender} • {pt.uhid}
                              </span>
                              <div className="shrink-0">
                                {renderActionButton(pt, true)}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="h-28 border-2 border-dashed border-emerald-300/70 bg-emerald-50/50 rounded-xl flex flex-col items-center justify-center text-center p-2.5 text-emerald-700/70">
                          <CheckCircle2 className="w-5 h-5 mb-1 opacity-40 text-emerald-600" />
                          <span className="text-xs font-bold text-emerald-900">No completed visits</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Lane 5: No-Show / Cancelled */}
                {selectedLanes.includes("no_show") && (
                  <div className="kanban-lane group rounded-2xl border-2 border-rose-500/80 bg-rose-50/20 overflow-hidden flex flex-col h-[calc(100vh-200px)] min-h-[580px] max-h-[820px] shadow-sm">
                    {/* Fixed Top Header */}
                    <div className="flex items-center justify-between px-3 py-2 bg-[#e11d48] text-white shrink-0">
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle size={14} className="text-white" />
                        <h3 className="font-extrabold text-[11px] uppercase tracking-wider text-white">
                          Cancelled / No-Show
                        </h3>
                      </div>
                      <span className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center text-[11px] font-mono font-black text-white">
                        {kanbanLanes.noShow.length}
                      </span>
                    </div>

                    {/* Independently Scrollable Patient List */}
                    <div className="p-2 space-y-1.5 flex-1 overflow-y-auto kanban-scrollbar">
                      {kanbanLanes.noShow.length > 0 ? (
                        kanbanLanes.noShow.map((pt) => (
                          <div
                            key={pt.id}
                            className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all space-y-1.5"
                          >
                            <div className="flex items-center justify-between gap-1.5 min-w-0">
                              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                <span className="px-1.5 py-0.5 rounded font-mono text-[10px] font-black bg-[#e11d48] text-white shadow-2xs shrink-0">
                                  {pt.tokenNumber || "—"}
                                </span>
                                <strong
                                  onClick={() => onSelectPatient(pt.id)}
                                  className="text-xs font-bold text-slate-900 block truncate hover:text-rose-800 hover:underline cursor-pointer transition-colors"
                                  title="Click to open digital prescription workspace"
                                >
                                  {pt.name}
                                </strong>
                              </div>
                              <span className="text-[10px] font-bold text-rose-800 bg-rose-50 px-1.5 py-0.5 rounded-full border border-rose-200 shrink-0">
                                ⚠ Cancelled
                              </span>
                            </div>

                            <div className="pt-1 border-t border-slate-100 flex items-center justify-between gap-1.5">
                              <span className="text-[11px] text-slate-500 font-medium truncate">
                                {pt.age}y, {pt.gender} • {pt.uhid}
                              </span>
                              <div className="shrink-0">
                                {renderActionButton(pt, true)}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="h-28 border-2 border-dashed border-rose-300/70 bg-rose-50/50 rounded-xl flex flex-col items-center justify-center text-center p-2.5 text-rose-700/70">
                          <AlertTriangle className="w-5 h-5 mb-1 opacity-40 text-rose-600" />
                          <span className="text-xs font-bold text-rose-900">No cancelled appointments</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}


            {/* ── VIEW 2: CHRONOLOGICAL TIMELINE SCHEDULE VIEW ── */}
            {viewMode === "timeline" && (
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  borderRadius: 22,
                  boxShadow: "0 4px 24px rgba(0, 0, 0, 0.04)",
                }}
                className="p-6 sm:p-8"
              >
                <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6 flex-wrap gap-2">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                      <CalendarClock size={18} className="text-purple-600" />
                      <span>Chronological OPD Consultation Journey</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Sequential patient schedule flow from 09:00 AM to 04:00 PM
                    </p>
                  </div>
                  <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                    {timelinePatients.length} Encounters Scheduled
                  </span>
                </div>

                <div className="space-y-4">
                  {timelinePatients.length > 0 ? (
                    timelinePatients.map((pt, index) => {
                      const isLiveInRoom = pt.queueStatus === "in_consultation";
                      const isWaiting = pt.queueStatus === "waiting";
                      const isDraftLabs = pt.queueStatus === "draft_labs";
                      const isCompleted = pt.queueStatus === "completed";
                      const isFirst = index === 0;
                      const isLast = index === timelinePatients.length - 1;

                      const nodeColor = isLiveInRoom
                        ? "bg-teal-600 ring-4 ring-teal-200"
                        : isWaiting
                        ? "bg-amber-500 ring-4 ring-amber-100"
                        : isDraftLabs
                        ? "bg-indigo-500 ring-4 ring-indigo-100"
                        : isCompleted
                        ? "bg-emerald-500 ring-4 ring-emerald-100"
                        : "bg-rose-500 ring-4 ring-rose-100";

                      const timeDisplay =
                        pt.scheduledTime ||
                        (pt.createdAt
                          ? new Date(pt.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "09:30 AM");

                      return (
                        <div key={pt.id} className="flex items-stretch gap-3 sm:gap-5 group">
                          {/* 1. Left Time Axis Column */}
                          <div className="w-16 sm:w-20 shrink-0 text-right pt-3">
                            <div className="font-mono text-xs sm:text-sm font-bold text-slate-800">
                              {timeDisplay}
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              {isLiveInRoom ? "Now Active" : `Slot #${index + 1}`}
                            </div>
                          </div>

                          {/* 2. Perfectly Centered Vertical Rail & Timeline Node */}
                          <div className="relative flex flex-col items-center shrink-0 w-6">
                            {/* Rail above dot */}
                            <div
                              className={`w-0.5 grow ${isFirst ? "opacity-0" : "bg-slate-200"}`}
                              style={{ minHeight: "14px", maxHeight: "14px" }}
                            />

                            {/* Centered Node Dot */}
                            <div
                              className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs shrink-0 transition-transform group-hover:scale-125 z-10 ${nodeColor}`}
                            >
                              {isLiveInRoom && (
                                <span className="block w-full h-full rounded-full bg-teal-400 animate-ping opacity-75" />
                              )}
                            </div>

                            {/* Rail below dot */}
                            <div
                              className={`w-0.5 grow ${isLast ? "opacity-0" : "bg-slate-200"}`}
                            />
                          </div>

                          {/* 3. Patient Card on Right */}
                          <div className="flex-1 pb-4">
                            <div
                              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                                isLiveInRoom
                                  ? "bg-teal-50/50 border-teal-300 shadow-md ring-1 ring-teal-200"
                                  : "bg-white border-slate-200/90 shadow-2xs hover:shadow-md"
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                  <span className="px-2.5 py-1 rounded-xl font-mono text-xs font-black bg-slate-900 text-white shadow-2xs">
                                    {pt.tokenNumber || `#${index + 1}`}
                                  </span>
                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <strong
                                        onClick={() => onSelectPatient(pt.id)}
                                        className="text-sm sm:text-base font-bold text-slate-900 hover:text-teal-700 hover:underline cursor-pointer transition-colors"
                                        title="Click to open digital prescription workspace"
                                      >
                                        {pt.name}
                                      </strong>
                                      <span className="text-xs text-slate-500 font-medium">
                                        ({pt.age}y, {pt.gender})
                                      </span>
                                    </div>
                                    <span className="text-[11px] font-mono text-slate-400">
                                      {pt.uhid} • Slot: {timeDisplay}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 flex-wrap">
                                  {isLiveInRoom ? (
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-700 text-white shadow-xs flex items-center gap-1.5">
                                      <span className="w-2 h-2 rounded-full bg-teal-300 animate-ping" />
                                      Live Inside Room 104
                                    </span>
                                  ) : isWaiting ? (
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                      Waiting in Queue
                                    </span>
                                  ) : isDraftLabs ? (
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
                                      🧪 At Lab
                                    </span>
                                  ) : isCompleted ? (
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                      ✓ Completed
                                    </span>
                                  ) : (
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
                                      Cancelled
                                    </span>
                                  )}

                                  {renderActionButton(pt)}
                                </div>
                              </div>

                              {pt.chiefComplaintSummary && (
                                <div className="pt-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                                  <div className="space-y-1.5">
                                    <span className="text-slate-700 block font-medium">
                                      Complaint: {pt.chiefComplaintSummary}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-12 text-center text-slate-400">
                      <CalendarClock className="w-10 h-10 mb-2 opacity-30 text-purple-400 mx-auto" />
                      <p className="text-sm font-bold text-slate-700">No scheduled patients on timeline</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── VIEW 3: CARDS GRID VIEW ── */}
            {viewMode === "cards" && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {categoryPatients.length > 0 ? (
                  categoryPatients.map((pt) => {
                    const isLiveInRoom = pt.queueStatus === "in_consultation";

                    return (
                      <div
                        key={pt.id}
                        style={{
                          background: "rgba(255, 255, 255, 0.95)",
                          backdropFilter: "blur(20px)",
                          border: isLiveInRoom ? "2px solid #0d9488" : "1px solid rgba(0, 0, 0, 0.08)",
                          borderRadius: 22,
                          boxShadow: isLiveInRoom
                            ? "0 4px 20px rgba(13, 148, 136, 0.12)"
                            : "0 4px 20px rgba(0, 0, 0, 0.03)",
                        }}
                        className="p-5 flex flex-col justify-between transition-all hover:shadow-md space-y-4"
                      >
                        <div>
                          {/* Card Header: Token & Status */}
                          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2.5 py-1 rounded-xl font-mono text-xs font-black ${
                                  isLiveInRoom
                                    ? "bg-teal-700 text-white"
                                    : "bg-slate-100 text-slate-900 border border-slate-200"
                                }`}
                              >
                                {pt.tokenNumber || "—"}
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono">
                                {pt.scheduledTime || "09:45 AM"}
                              </span>
                            </div>

                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                isLiveInRoom
                                  ? "bg-teal-700 text-white animate-pulse"
                                  : pt.queueStatus === "waiting"
                                  ? "bg-amber-50 text-amber-800 border border-amber-200"
                                  : pt.queueStatus === "draft_labs"
                                  ? "bg-indigo-50 text-indigo-800 border border-indigo-200"
                                  : pt.queueStatus === "completed"
                                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                  : "bg-rose-50 text-rose-800 border border-rose-200"
                              }`}
                            >
                              {isLiveInRoom
                                ? "● In Room 104"
                                : pt.queueStatus === "waiting"
                                ? "Waiting"
                                : pt.queueStatus === "draft_labs"
                                ? "Sent for Labs"
                                : pt.queueStatus === "completed"
                                ? "Signed & Ready"
                                : "Cancelled"}
                            </span>
                          </div>

                          {/* Patient Name & Bio */}
                          <div className="pt-3 flex items-start gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-700 to-sky-600 flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0">
                              {pt.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </div>

                            <div className="flex-1 min-w-0">
                              <strong
                                onClick={() => onSelectPatient(pt.id)}
                                className="text-base font-bold text-slate-900 block truncate hover:text-teal-700 hover:underline cursor-pointer transition-colors"
                                title="Click to open digital prescription workspace"
                              >
                                {pt.name}
                              </strong>
                              <span className="text-xs text-slate-500 block">
                                {pt.age}y, {pt.gender} • {pt.uhid}
                              </span>
                            </div>
                          </div>

                          {/* Complaint */}
                          {pt.chiefComplaintSummary && (
                            <div className="mt-3">
                              <p className="text-xs text-slate-600 line-clamp-2">
                                Complaint: {pt.chiefComplaintSummary}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Card Footer Actions */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-slate-400">
                            {pt.consultationType === "tele_consultation" ? "Virtual Consult" : "In-Person Lobby"}
                          </span>
                          {renderActionButton(pt)}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full py-12 text-center text-slate-400">
                    <LayoutGrid className="w-10 h-10 mb-2 opacity-30 text-sky-400 mx-auto" />
                    <p className="text-sm font-bold text-slate-700">No patients found in cards view</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── TAB CONTENT 2: Referrals Desk (Shared with Me & I Shared to Others) ── */}
        {activeTab === "referrals" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1 py-0.5">
              <span>
                {referralSubTab === "inbound"
                  ? "Referrals routed to General Medicine by other hospital departments"
                  : "Specialist consultations ordered by Dr. Rajesh Sharma"}
              </span>
              <span className="font-semibold text-slate-600">
                Showing {filteredReferrals.length} {referralSubTab === "inbound" ? "inbound" : "outbound"} referrals
              </span>
            </div>

            {/* Referrals Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredReferrals.length > 0 ? (
                filteredReferrals.map((ref) => {
                  const isHigh = ref.urgency === "High" || ref.urgency === "Emergency";

                  return (
                    <div
                      key={ref.id}
                      style={{
                        background: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(20px)",
                        border: isHigh ? "1px solid #fecdd3" : "1px solid rgba(0, 0, 0, 0.08)",
                        borderRadius: 20,
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
                      }}
                      className="p-5 flex flex-col justify-between transition-all hover:shadow-md"
                    >
                      <div>
                        {/* Header: Patient & Urgency Badge */}
                        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-base text-slate-900">
                                {ref.patientName}
                              </h3>
                              <span className="text-xs text-slate-500">
                                ({ref.age}y, {ref.gender})
                              </span>
                            </div>
                            <span className="text-[11px] font-mono text-slate-400">
                              {ref.uhid} • {ref.phone}
                            </span>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider ${
                                isHigh
                                  ? "bg-rose-100 text-rose-800 border border-rose-200"
                                  : "bg-slate-100 text-slate-700 border border-slate-200"
                              }`}
                            >
                              {ref.urgency}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">{ref.date}</span>
                          </div>
                        </div>

                        {/* Referring Details */}
                        <div className="py-3 space-y-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-[10.5px] font-bold uppercase text-slate-400 block w-20 shrink-0">
                              {referralSubTab === "inbound" ? "From:" : "Referred To:"}
                            </span>
                            <strong className="text-slate-800">
                              {referralSubTab === "inbound"
                                ? `${ref.referringDoctor} (${ref.department})`
                                : `${ref.referredToDoctor} (${ref.department})`}
                            </strong>
                          </div>

                          <div className="flex items-start gap-2">
                            <span className="text-[10.5px] font-bold uppercase text-slate-400 block w-20 shrink-0 mt-0.5">
                              Reason:
                            </span>
                            <span className="text-slate-700 font-medium flex-1">
                              {ref.reason}
                            </span>
                          </div>

                          {ref.notes && (
                            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11.5px] text-slate-600">
                              <span className="font-semibold text-slate-700 block mb-0.5">
                                Clinical Findings:
                              </span>
                              {ref.notes}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer: Status & Actions (Admit to desk removed, Request Rx enabled) */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-2 flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200/80">
                          <CheckCircle2 size={12} className="text-teal-700" />
                          <span>{ref.rxRequested ? "Rx Unlocked" : ref.status}</span>
                        </span>

                        {referralSubTab === "inbound" ? (
                          <button
                            type="button"
                            onClick={() => handleRequestRx(ref)}
                            className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                          >
                            <FileSearch size={13} />
                            <span>{ref.rxRequested ? "View Full Rx / History" : "Request Rx"}</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              showToast(`Tracking status of referral to ${ref.referredToDoctor}`);
                            }}
                            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1"
                          >
                            <FileText size={12} />
                            <span>Track Report</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full py-12 text-center text-slate-400 bg-white/60 rounded-2xl border border-dashed border-slate-200">
                  <GitPullRequest className="w-10 h-10 mb-2 opacity-30 text-slate-400 mx-auto" />
                  <p className="text-sm font-bold text-slate-700">No referrals found for {referralDateRange}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Modal: Requested Full Rx & Clinical History Preview ── */}
      {rxRequestModalPatient && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-fade-in-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
                  <FileSearch size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Patient Clinical Rx & History Unlocked
                  </h3>
                  <p className="text-xs text-slate-500">
                    Shared by {rxRequestModalPatient.referringDoctor}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRxRequestModalPatient(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
              <div>
                <strong className="text-sm font-bold text-slate-900 block">
                  {rxRequestModalPatient.patientName} ({rxRequestModalPatient.age}y, {rxRequestModalPatient.gender})
                </strong>
                <span className="text-[11px] text-slate-500">
                  {rxRequestModalPatient.uhid} • {rxRequestModalPatient.phone}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
                Department: {rxRequestModalPatient.department}
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <span className="text-[10.5px] font-bold uppercase text-slate-400 tracking-wider block">
                Referring Clinical Notes & Diagnosis
              </span>
              <p className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 leading-relaxed font-medium">
                {rxRequestModalPatient.reason}. {rxRequestModalPatient.notes}
              </p>
            </div>

            {rxRequestModalPatient.investigations && (
              <div className="space-y-1.5 text-xs">
                <span className="text-[10.5px] font-bold uppercase text-slate-400 tracking-wider block">
                  Attached Diagnostic Investigations
                </span>
                <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-100 text-sky-900 font-mono text-[11.5px]">
                  {rxRequestModalPatient.investigations}
                </div>
              </div>
            )}

            {rxRequestModalPatient.previousRx && (
              <div className="space-y-2 text-xs">
                <span className="text-[10.5px] font-bold uppercase text-slate-400 tracking-wider block">
                  Active Medications Prescribed by Referring Specialist
                </span>
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                  {rxRequestModalPatient.previousRx.map((med, i) => (
                    <div key={i} className="p-2.5 flex items-center justify-between bg-white text-xs">
                      <div>
                        <strong className="text-slate-900 block">{med.drug}</strong>
                        <span className="text-[11px] text-slate-500">{med.instructions}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                          {med.dosage}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{med.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">Prescription unlocked for consultation</span>
              <button
                type="button"
                onClick={() => setRxRequestModalPatient(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Records
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Dark Pill Toast Feedback (#0f172a) */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: "#0f172a",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: 12,
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 13,
            fontWeight: 600,
            zIndex: 100,
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Quick Intake Registration Modal */}
      {isQuickIntakeOpen && (
        <QuickPatientIntakeModal
          isOpen={isQuickIntakeOpen}
          currentTotalPatients={patients.length}
          onClose={() => setIsQuickIntakeOpen(false)}
          onPatientAdded={(added) => {
            showToast(`Patient ${added.name} registered with token ${added.tokenNumber}`);
          }}
        />
      )}

      {/* Admin Config Modal */}
      {isAdminConfigOpen && (
        <AdminConfigModal
          isOpen={isAdminConfigOpen}
          adminConfigList={adminConfigList}
          onClose={() => setIsAdminConfigOpen(false)}
          onToggleField={async (sectionKey, field) => {
            const current = adminConfigList.find((s) => s.sectionKey === sectionKey);
            if (current) {
              await updateAdminConfig(sectionKey, { [field]: !current[field] });
              showToast(`Updated ${field} for ${sectionKey}`);
            }
          }}
        />
      )}

      {/* Prescription Preview Modal */}
      {previewPatient && (
        <PrescriptionPreviewModal
          isOpen={!!previewPatient}
          patient={previewPatient}
          prescription={previewPrescription || prescriptionMap[previewPatient.id] || {}}
          onClose={() => {
            setPreviewPatient(null);
            setPreviewPrescription(null);
          }}
        />
      )}
    </div>
  );
}
