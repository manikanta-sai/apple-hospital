import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Clock3,
  GripVertical,
  Maximize2,
  Megaphone,
  Minimize2,
  MonitorPlay,
  Search,
  SkipForward,
  Stethoscope,
  Ticket,
  Users,
  X,
  Printer,
  Smartphone,
  Sparkles,
  RefreshCw,
  AlertCircle,
  UserPlus,
  Building2,
  Calendar,
  ChevronRight,
  Filter,
  Volume2,
  VolumeX,
  Activity,
  ShieldCheck,
} from "lucide-react";

const STORAGE_KEY = "get-well-op-tokens-v1";
const PATIENTS_STORAGE_KEY = "get-well-op-patients-v1";

const DOCTORS = [
  { id: "rao", name: "Dr. Ananya Rao", degree: "MBBS, MD, DM", specialty: "Cardiology", experience: "16 years", room: "204", floor: "2nd Floor - Wing A", color: "#0d9488", status: "In Room" },
  { id: "mehta", name: "Dr. Vikram Mehta", degree: "MBBS, MS, MCh", specialty: "Orthopedics", experience: "12 years", room: "108", floor: "1st Floor - Wing B", color: "#f97316", status: "Available" },
  { id: "mani", name: "Dr. Priya Mani", degree: "MBBS, MD, DCH", specialty: "Pediatrics", experience: "10 years", room: "302", floor: "3rd Floor - Pediatric Block", color: "#3b82f6", status: "In Room" },
  { id: "shah", name: "Dr. Nikhil Shah", degree: "MBBS, MD, DM", specialty: "Neurology", experience: "14 years", room: "215", floor: "2nd Floor - Neuro Wing", color: "#eab308", status: "Available" },
  { id: "iyer", name: "Dr. Kavitha Iyer", degree: "MBBS, MD, DGO", specialty: "Gynecology", experience: "18 years", room: "116", floor: "1st Floor - Women Care", color: "#10b981", status: "Available" },
  { id: "verma", name: "Dr. Rajesh Verma", degree: "MBBS, MD", specialty: "General Medicine", experience: "20 years", room: "102", floor: "Ground Floor - OPD Main", color: "#6366f1", status: "Available" },
];

const INITIAL_PATIENTS = [
  { id: "p-1001", name: "Aarav Sharma", mobile: "9876543210", umr: "UMR-240018", age: 42, gender: "Male", priority: "Standard" },
  { id: "p-1002", name: "Meera Nair", mobile: "9845012345", umr: "UMR-240026", age: 35, gender: "Female", priority: "Standard" },
  { id: "p-1003", name: "Ishaan Kapoor", mobile: "9900123456", umr: "UMR-240041", age: 8, gender: "Male", priority: "Pediatric" },
  { id: "p-1004", name: "Fatima Khan", mobile: "9988776655", umr: "UMR-240055", age: 68, gender: "Female", priority: "Senior Citizen" },
  { id: "p-1005", name: "Rohan Das", mobile: "9811122233", umr: "UMR-240062", age: 53, gender: "Male", priority: "Standard" },
  { id: "p-1006", name: "Sunita Reddy", mobile: "9701123456", umr: "UMR-240071", age: 72, gender: "Female", priority: "Senior Citizen" },
  { id: "p-1007", name: "Kiran Patel", mobile: "9650098765", umr: "UMR-240089", age: 29, gender: "Male", priority: "Wheelchair Assist" },
];

const INITIAL_TOKENS = [
  { id: "demo-1", number: "GW-041", patientId: "p-1001", doctorId: "rao", status: "Waiting", priority: "Standard", visitType: "Consultation", createdAt: "09:18 AM" },
  { id: "demo-2", number: "GW-042", patientId: "p-1002", doctorId: "rao", status: "Announced", priority: "Standard", visitType: "Follow-up", createdAt: "09:24 AM", announcedAt: Date.now() - 30000 },
  { id: "demo-3", number: "GW-043", patientId: "p-1004", doctorId: "mehta", status: "Checked in", priority: "Senior Citizen", visitType: "Consultation", createdAt: "09:31 AM" },
  { id: "demo-4", number: "GW-044", patientId: "p-1003", doctorId: "mani", status: "Waiting", priority: "Pediatric", visitType: "Consultation", createdAt: "09:36 AM" },
  { id: "demo-5", number: "GW-045", patientId: "p-1005", doctorId: "shah", status: "Waiting", priority: "Standard", visitType: "Report Review", createdAt: "09:41 AM" },
];

const statusStyles = {
  Waiting: { bg: "#fef3c7", text: "#92400e", border: "#fde68a" },
  Announced: { bg: "#e0f2fe", text: "#0369a1", border: "#bae6fd" },
  "Checked in": { bg: "#dcfce7", text: "#15803d", border: "#bbf7d0" },
  Completed: { bg: "#f1f5f9", text: "#475569", border: "#e2e8f0" },
  Skipped: { bg: "#ffe4e6", text: "#be123c", border: "#fecdd3" },
};

const priorityBadges = {
  Standard: { label: "Standard OPD", bg: "#f1f5f9", text: "#475569", border: "#e2e8f0" },
  "Senior Citizen": { label: "Senior Citizen (60+)", bg: "#fef9c3", text: "#854d0e", border: "#fef08a" },
  Pediatric: { label: "Pediatric (<12y)", bg: "#e0f2fe", text: "#0369a1", border: "#bae6fd" },
  "Wheelchair Assist": { label: "Wheelchair Assist", bg: "#f3e8ff", text: "#6b21a8", border: "#e9d5ff" },
  Emergency: { label: "Emergency / Priority", bg: "#fee2e2", text: "#991b1b", border: "#fecaca" },
};

function getStoredTokens() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_TOKENS;
  } catch {
    return INITIAL_TOKENS;
  }
}

function getStoredPatients() {
  try {
    const saved = window.localStorage.getItem(PATIENTS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  } catch {
    return INITIAL_PATIENTS;
  }
}

function playAnnouncementBell() {
  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) return;

  try {
    const context = new AudioContextConstructor();
    if (context.state === "suspended") context.resume().catch(() => {});
    const startTime = context.currentTime;
    [880, 1174].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const toneStart = startTime + index * 0.16;
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, toneStart);
      gain.gain.setValueAtTime(0.0001, toneStart);
      gain.gain.exponentialRampToValueAtTime(0.18, toneStart + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, toneStart + 0.55);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(toneStart);
      oscillator.stop(toneStart + 0.56);
    });
    window.setTimeout(() => context.close(), 900);
  } catch {
    // audio context silenced or not supported
  }
}

export default function TokenDesk({ currentPath, navigateTo }) {
  const announcerBoardRef = useRef(null);
  const [tokens, setTokens] = useState(getStoredTokens);
  const [patients, setPatients] = useState(getStoredPatients);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Search & Wizard State
  const [patientQuery, setPatientQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [doctorQuery, setDoctorQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState("Standard");
  const [selectedVisitType, setSelectedVisitType] = useState("First Consultation");
  const [consultationRemarks, setConsultationRemarks] = useState("");

  // Quick Walk-in Registration Modal / Drawer
  const [isWalkinOpen, setIsWalkinOpen] = useState(false);
  const [walkinForm, setWalkinForm] = useState({
    name: "",
    mobile: "",
    age: "",
    gender: "Male",
    priority: "Standard",
  });

  // Print Slip Modal State
  const [printedToken, setPrintedToken] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [now, setNow] = useState(Date.now());
  const [draggedTokenId, setDraggedTokenId] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [isAnnouncerFullscreen, setIsAnnouncerFullscreen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
  }, [tokens]);

  useEffect(() => {
    window.localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(patients));
  }, [patients]);

  // Sync cross tabs
  useEffect(() => {
    const syncStorage = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setTokens(parsed);
        } catch {}
      }
      if (e.key === PATIENTS_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setPatients(parsed);
        } catch {}
      }
    };
    window.addEventListener("storage", syncStorage);
    return () => window.removeEventListener("storage", syncStorage);
  }, []);

  // Clock tick & skip timers
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setTokens((current) => {
      let changed = false;
      const updated = current.map((token) => {
        if (token.status === "Skipped" && (!token.skipUntil || token.skipUntil <= now)) {
          changed = true;
          return { ...token, status: "Waiting", skipUntil: null };
        }
        return token;
      });
      return changed ? updated : current;
    });
  }, [now]);

  // Handle Fullscreen state
  useEffect(() => {
    const syncFullscreenState = () => {
      setIsAnnouncerFullscreen(document.fullscreenElement === announcerBoardRef.current);
    };
    document.addEventListener("fullscreenchange", syncFullscreenState);
    return () => document.removeEventListener("fullscreenchange", syncFullscreenState);
  }, []);

  const toggleAnnouncerFullscreen = async () => {
    const board = announcerBoardRef.current;
    if (!board) return;
    try {
      if (document.fullscreenElement === board) {
        await document.exitFullscreen();
      } else if (board.requestFullscreen) {
        await board.requestFullscreen();
      }
    } catch {
      setIsAnnouncerFullscreen(document.fullscreenElement === board);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Status updates
  const updateStatus = (tokenId, status) => {
    setTokens((current) =>
      current.map((token) => {
        if (token.id !== tokenId) return token;
        if (status === "Skipped") return { ...token, status, skipUntil: Date.now() + 60_000 };
        if (status === "Announced") {
          if (soundEnabled) playAnnouncementBell();
          return { ...token, status, announcedAt: Date.now() };
        }
        return { ...token, status, ...(status === "Checked in" ? { announcedAt: null } : {}) };
      })
    );
    showToast(`Token status updated to "${status}"`);
  };

  // Reordering
  const reorderWithinDoctor = (sourceToken, targetToken, position) => {
    if (!sourceToken || sourceToken.id === targetToken.id || sourceToken.doctorId !== targetToken.doctorId) return;
    setTokens((current) => {
      const doctorQueue = current
        .filter((token) => token.doctorId === sourceToken.doctorId)
        .sort((a, b) => (a.queueOrder ?? Number(a.number.split("-")[1])) - (b.queueOrder ?? Number(b.number.split("-")[1])));
      const fromIndex = doctorQueue.findIndex((token) => token.id === sourceToken.id);
      const toIndex = doctorQueue.findIndex((token) => token.id === targetToken.id);
      if (fromIndex < 0 || toIndex < 0) return current;
      const [movedToken] = doctorQueue.splice(fromIndex, 1);
      const insertionIndex = toIndex + (position === "after" ? 1 : 0);
      doctorQueue.splice(insertionIndex > fromIndex ? insertionIndex - 1 : insertionIndex, 0, movedToken);
      const orderById = new Map(doctorQueue.map((token, index) => [token.id, index]));
      return current.map((token) => (orderById.has(token.id) ? { ...token, queueOrder: orderById.get(token.id) } : token));
    });
  };

  // Quick Walkin Register
  const handleSaveWalkin = (e) => {
    e.preventDefault();
    if (!walkinForm.name.trim() || !walkinForm.mobile.trim()) {
      alert("Please provide patient name and mobile number.");
      return;
    }
    const nextUmrNum = 240000 + patients.length + 12;
    const newPatient = {
      id: `p-${Date.now()}`,
      name: walkinForm.name.trim(),
      mobile: walkinForm.mobile.trim(),
      umr: `UMR-${nextUmrNum}`,
      age: Number(walkinForm.age) || 30,
      gender: walkinForm.gender,
      priority: walkinForm.priority || "Standard",
    };
    setPatients((prev) => [newPatient, ...prev]);
    setSelectedPatient(newPatient);
    setSelectedPriority(newPatient.priority);
    setIsWalkinOpen(false);
    setWalkinForm({ name: "", mobile: "", age: "", gender: "Male", priority: "Standard" });
    showToast(`Patient ${newPatient.name} registered (${newPatient.umr})`);
  };

  // Generate Token
  const handleGenerateToken = () => {
    if (!selectedPatient || !selectedDoctor) return;
    const nextNumber = Math.max(0, ...tokens.map((t) => Number(t.number.split("-")[1]) || 0)) + 1;
    const nowTimeStr = new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit" }).format(new Date());

    const newToken = {
      id: `token-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      number: `GW-${String(nextNumber).padStart(3, "0")}`,
      patientId: selectedPatient.id,
      doctorId: selectedDoctor.id,
      status: "Waiting",
      priority: selectedPriority || selectedPatient.priority || "Standard",
      visitType: selectedVisitType,
      remarks: consultationRemarks,
      createdAt: nowTimeStr,
    };

    setTokens((prev) => [newToken, ...prev]);
    setPrintedToken({ token: newToken, patient: selectedPatient, doctor: selectedDoctor });

    // Reset form
    setSelectedPatient(null);
    setSelectedDoctor(null);
    setPatientQuery("");
    setDoctorQuery("");
    setConsultationRemarks("");
    showToast(`Token ${newToken.number} generated & SMS dispatched!`);
  };

  // Filtered patients
  const patientMatches = useMemo(() => {
    const q = patientQuery.trim().toLowerCase();
    if (!q) return [];
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.mobile.includes(q) ||
        p.umr.toLowerCase().includes(q)
    );
  }, [patientQuery, patients]);

  // Filtered doctors
  const departments = useMemo(() => {
    const depts = new Set(DOCTORS.map((d) => d.specialty));
    return ["All", ...Array.from(depts)];
  }, []);

  const matchingDoctors = useMemo(() => {
    const q = doctorQuery.trim().toLowerCase();
    return DOCTORS.filter((doc) => {
      const matchesDept = selectedDepartment === "All" || doc.specialty === selectedDepartment;
      const matchesQuery = !q || doc.name.toLowerCase().includes(q) || doc.specialty.toLowerCase().includes(q) || doc.room.includes(q);
      return matchesDept && matchesQuery;
    });
  }, [doctorQuery, selectedDepartment]);

  // Metrics
  const waitingCount = tokens.filter((t) => t.status === "Waiting").length;
  const announcedCount = tokens.filter((t) => t.status === "Announced").length;
  const inConsultCount = tokens.filter((t) => t.status === "Checked in").length;
  const completedCount = tokens.filter((t) => t.status === "Completed").length;
  const totalTokensToday = tokens.length + 38; // realistic OPD scale

  // Wizard Step
  const wizardStep = !selectedPatient ? 1 : !selectedDoctor ? 2 : 3;

  const selectedView = currentPath === "/waiting-pool" ? "pool" : currentPath === "/announcer" ? "tv" : "generator";

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(145deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)", fontFamily: "'Inter', -apple-system, sans-serif", color: "#1e293b", position: "relative" }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 24,
            zIndex: 9999,
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
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          <Sparkles size={16} color="#38bdf8" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER */}
      <header
        style={{
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(226, 232, 240, 0.9)",
          position: "sticky",
          top: 0,
          zIndex: 40,
          boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
        }}
      >
        <div style={{ maxWidth: 1540, margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
          {/* Logo & Hospital Title */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button
              onClick={() => navigateTo("/")}
              aria-label="Back to dashboard"
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
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#cbd5e1"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.14em", color: "#0284c7" }}>
                  Apple Multispecialty Hospital
                </span>
                <span style={{ fontSize: 11, background: "#e0f2fe", color: "#0369a1", padding: "1px 8px", borderRadius: 999, fontWeight: 700 }}>
                  OPD Floor 1 & 2
                </span>
              </div>
              <h1 style={{ margin: "2px 0 0 0", fontSize: 20, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: 8 }}>
                Smart OPD Token Desk
              </h1>
            </div>
          </div>

          {/* Right Controls: Live status, Audio Chime toggle, Quick Walkin */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "6px 12px", borderRadius: 999 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 0 3px rgba(34, 197, 94, 0.2)" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#166534" }}>Live Queue Active</span>
              <span style={{ fontSize: 12, color: "#15803d", fontWeight: 500 }}>· {waitingCount + announcedCount} in waiting area</span>
            </div>

            {/* Sound notification toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                showToast(soundEnabled ? "Announcement audio muted" : "Announcement audio unmuted");
              }}
              title={soundEnabled ? "Audio chime enabled" : "Audio muted"}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 12px",
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                background: soundEnabled ? "#ffffff" : "#f1f5f9",
                color: soundEnabled ? "#0284c7" : "#64748b",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
              <span style={{ display: "none" }}>Audio</span>
            </button>

            {/* Quick Walkin Registration */}
            <button
              onClick={() => setIsWalkinOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "8px 16px",
                borderRadius: 10,
                background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                color: "#ffffff",
                border: "none",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(2, 132, 199, 0.28)",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }}
            >
              <UserPlus size={16} />
              <span>+ Quick Walk-in Patient</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ maxWidth: 1540, margin: "0 auto", padding: "0 24px", display: "flex", gap: 6, overflowX: "auto" }}>
          {[
            { path: "/tokens", label: "Generate & Dispense Token", icon: Ticket, count: null },
            { path: "/waiting-pool", label: "OPD Waiting Pool", icon: Users, count: waitingCount + announcedCount },
            { path: "/announcer", label: "Smart TV Call Board", icon: MonitorPlay, count: announcedCount > 0 ? `${announcedCount} Calling` : null },
          ].map(({ path, label, icon: TabIcon, count }) => {
            const isActive = currentPath === path;
            return (
              <button
                key={path}
                onClick={() => navigateTo(path)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 18px",
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 600,
                  color: isActive ? "#0284c7" : "#64748b",
                  borderBottom: isActive ? "3px solid #0284c7" : "3px solid transparent",
                  background: "transparent",
                  borderLeft: "none",
                  borderRight: "none",
                  borderTop: "none",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                }}
              >
                <TabIcon size={16} color={isActive ? "#0284c7" : "#94a3b8"} />
                <span>{label}</span>
                {count !== null && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "2px 7px",
                      borderRadius: 999,
                      background: isActive ? "#e0f2fe" : "#f1f5f9",
                      color: isActive ? "#0369a1" : "#64748b",
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main style={{ maxWidth: 1540, margin: "0 auto", padding: "24px" }}>
        {/* KPI OVERVIEW METRICS (Shown across all views) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>
          {[
            { label: "Total Issued Today", value: totalTokensToday, sub: "OPD General & Special", icon: Ticket, color: "#0284c7", bg: "#e0f2fe" },
            { label: "Currently Waiting", value: waitingCount, sub: "Average wait ~12 min", icon: Clock, color: "#d97706", bg: "#fef3c7" },
            { label: "Announced & Calling", value: announcedCount, sub: "Direct to doctor room", icon: Megaphone, color: "#0284c7", bg: "#e0f2fe" },
            { label: "In Consultation", value: inConsultCount, sub: "Doctors actively with patients", icon: Stethoscope, color: "#16a34a", bg: "#dcfce7" },
            { label: "Completed Visits", value: completedCount + 28, sub: "Consultations closed today", icon: CheckCircle2, color: "#475569", bg: "#f1f5f9" },
          ].map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.label}
                style={{
                  background: "#ffffff",
                  borderRadius: 16,
                  border: "1px solid #e2e8f0",
                  padding: "16px 18px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>{kpi.label}</span>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginTop: 4 }}>{kpi.value}</div>
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>{kpi.sub}</span>
                </div>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: kpi.bg, display: "flex", alignItems: "center", justifyContent: "center", color: kpi.color }}>
                  <Icon size={20} />
                </div>
              </div>
            );
          })}
        </div>

        {/* VIEW 1: TOKEN GENERATOR & DISPENSER (/tokens) */}
        {selectedView === "generator" && (
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.65fr) minmax(360px, 1fr)", gap: 24, alignItems: "start" }}>
            {/* LEFT: 3-STEP WIZARD */}
            <div style={{ background: "#ffffff", borderRadius: 20, border: "1px solid #e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", overflow: "hidden" }}>
              {/* Stepper Header */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
                {[
                  { step: 1, title: "Patient Details", desc: "Search or Register", icon: Search },
                  { step: 2, title: "Specialist & Room", desc: "Select Doctor", icon: Stethoscope },
                  { step: 3, title: "Review & Dispense", desc: "Print Token Slip", icon: Ticket },
                ].map(({ step, title, desc, icon: StepIcon }) => {
                  const isActive = wizardStep === step;
                  const isDone = wizardStep > step;
                  return (
                    <button
                      key={step}
                      type="button"
                      onClick={() => {
                        if (step === 1) { setSelectedPatient(null); setSelectedDoctor(null); }
                        if (step === 2 && selectedPatient) { setSelectedDoctor(null); }
                      }}
                      style={{
                        padding: "16px 18px",
                        textAlign: "left",
                        background: isActive ? "#ffffff" : "transparent",
                        borderBottom: isActive ? "3px solid #0284c7" : "3px solid transparent",
                        borderLeft: "none",
                        borderRight: "none",
                        borderTop: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        cursor: wizardStep >= step ? "pointer" : "not-allowed",
                        opacity: wizardStep >= step ? 1 : 0.5,
                        transition: "all 0.15s",
                      }}
                    >
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: "50%",
                          background: isDone ? "#dcfce7" : isActive ? "#0284c7" : "#e2e8f0",
                          color: isDone ? "#15803d" : isActive ? "#ffffff" : "#64748b",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: 13,
                        }}
                      >
                        {isDone ? <Check size={16} /> : <StepIcon size={16} />}
                      </div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: isActive ? "#0284c7" : "#64748b" }}>
                          Step 0{step}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{title}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Step Content */}
              <div style={{ padding: "26px" }}>
                {/* STEP 1: PATIENT SEARCH / SELECT */}
                {!selectedPatient && (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                      <div>
                        <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#0284c7", letterSpacing: "0.08em" }}>
                          Step 01 · Patient Identification
                        </span>
                        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "4px 0 0 0" }}>
                          Who is this OPD consultation for?
                        </h2>
                        <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0 0" }}>
                          Search by patient name, mobile phone number, or Hospital UMR ID.
                        </p>
                      </div>
                      <button
                        onClick={() => setIsWalkinOpen(true)}
                        style={{
                          padding: "8px 14px",
                          borderRadius: 8,
                          border: "1px dashed #0284c7",
                          background: "#f0f9ff",
                          color: "#0284c7",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <UserPlus size={14} />
                        <span>New Walk-in? Register</span>
                      </button>
                    </div>

                    {/* Search Input */}
                    <div style={{ position: "relative", marginBottom: 16 }}>
                      <Search size={18} color="#94a3b8" style={{ position: "absolute", left: 14, top: 14 }} />
                      <input
                        type="text"
                        autoFocus
                        value={patientQuery}
                        onChange={(e) => setPatientQuery(e.target.value)}
                        placeholder="Search by Name, Mobile Number, or UMR (e.g. Aarav, 9876543210, UMR-240018)..."
                        style={{
                          width: "100%",
                          padding: "13px 14px 13px 44px",
                          borderRadius: 12,
                          border: "1.5px solid #cbd5e1",
                          fontSize: 14,
                          outline: "none",
                          boxSizing: "border-box",
                          transition: "border-color 0.15s, box-shadow 0.15s",
                        }}
                        onFocus={(e) => { e.target.style.borderColor = "#0284c7"; e.target.style.boxShadow = "0 0 0 3px rgba(2, 132, 199, 0.15)"; }}
                        onBlur={(e) => { e.target.style.borderColor = "#cbd5e1"; e.target.style.boxShadow = "none"; }}
                      />
                    </div>

                    {/* Matches List or Quick Recents */}
                    {patientQuery.trim().length > 0 ? (
                      <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", maxHeight: 360, overflowY: "auto" }}>
                        {patientMatches.length > 0 ? (
                          patientMatches.map((patient) => {
                            const badge = priorityBadges[patient.priority] || priorityBadges.Standard;
                            return (
                              <button
                                key={patient.id}
                                onClick={() => {
                                  setSelectedPatient(patient);
                                  setSelectedPriority(patient.priority || "Standard");
                                }}
                                style={{
                                  width: "100%",
                                  padding: "14px 16px",
                                  borderBottom: "1px solid #f1f5f9",
                                  background: "#ffffff",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  cursor: "pointer",
                                  textAlign: "left",
                                  transition: "background 0.15s",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#e0f2fe", color: "#0284c7", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>
                                    {patient.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                                  </div>
                                  <div>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: 8 }}>
                                      <span>{patient.name}</span>
                                      <span style={{ fontSize: 10, padding: "1px 7px", borderRadius: 999, background: badge.bg, color: badge.text, border: `1px solid ${badge.border}`, fontWeight: 600 }}>
                                        {badge.label}
                                      </span>
                                    </div>
                                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                                      📱 {patient.mobile} · 🆔 {patient.umr} · {patient.age} yrs, {patient.gender}
                                    </div>
                                  </div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#0284c7", fontWeight: 700, fontSize: 12 }}>
                                  <span>Select</span>
                                  <ArrowRight size={14} />
                                </div>
                              </button>
                            );
                          })
                        ) : (
                          <div style={{ padding: "28px", textAlign: "center", background: "#f8fafc" }}>
                            <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
                              No registered patient found matching "<strong>{patientQuery}</strong>"
                            </p>
                            <button
                              onClick={() => {
                                setWalkinForm((prev) => ({ ...prev, name: isNaN(patientQuery) ? patientQuery : "", mobile: !isNaN(patientQuery) ? patientQuery : "" }));
                                setIsWalkinOpen(true);
                              }}
                              style={{
                                marginTop: 12,
                                padding: "8px 16px",
                                borderRadius: 8,
                                background: "#0284c7",
                                color: "#ffffff",
                                border: "none",
                                fontSize: 12,
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                            >
                              + Register "{patientQuery}" as New Patient
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Quick Recent Patients for fast 1-click select */
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#94a3b8", letterSpacing: "0.06em", marginBottom: 8 }}>
                          Recently Registered / Frequent Walk-ins
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                          {patients.slice(0, 4).map((p) => (
                            <button
                              key={p.id}
                              onClick={() => {
                                setSelectedPatient(p);
                                setSelectedPriority(p.priority || "Standard");
                              }}
                              style={{
                                padding: "12px",
                                borderRadius: 10,
                                border: "1px solid #e2e8f0",
                                background: "#f8fafc",
                                textAlign: "left",
                                cursor: "pointer",
                                transition: "all 0.15s",
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0284c7"; e.currentTarget.style.background = "#ffffff"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc"; }}
                            >
                              <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{p.name}</div>
                              <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{p.mobile} · {p.age}y, {p.gender}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 2: DOCTOR & SPECIALTY SELECTION */}
                {selectedPatient && !selectedDoctor && (
                  <div>
                    {/* Selected Patient Banner */}
                    <div
                      style={{
                        background: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                        borderRadius: 12,
                        padding: "12px 16px",
                        marginBottom: 20,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#22c55e", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                          ✓
                        </div>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#166534" }}>Patient Selected</div>
                          <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>
                            {selectedPatient.name} · {selectedPatient.mobile} ({selectedPatient.umr})
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedPatient(null)}
                        style={{ background: "none", border: "none", color: "#0284c7", fontWeight: 700, fontSize: 12, cursor: "pointer", textDecoration: "underline" }}
                      >
                        Change Patient
                      </button>
                    </div>

                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#0284c7", letterSpacing: "0.08em" }}>
                        Step 02 · Specialist & OPD Room
                      </span>
                      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "4px 0 0 0" }}>
                        Select Consulting Doctor
                      </h2>
                      <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 14px 0" }}>
                        Filter by clinical department or search doctor by name/room.
                      </p>
                    </div>

                    {/* Department Filter Pills */}
                    <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 10, marginBottom: 12 }}>
                      {departments.map((dept) => (
                        <button
                          key={dept}
                          onClick={() => setSelectedDepartment(dept)}
                          style={{
                            padding: "6px 14px",
                            borderRadius: 999,
                            fontSize: 12,
                            fontWeight: selectedDepartment === dept ? 700 : 500,
                            background: selectedDepartment === dept ? "#0284c7" : "#f1f5f9",
                            color: selectedDepartment === dept ? "#ffffff" : "#475569",
                            border: "none",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            transition: "all 0.15s",
                          }}
                        >
                          {dept}
                        </button>
                      ))}
                    </div>

                    {/* Doctor Search input */}
                    <div style={{ position: "relative", marginBottom: 14 }}>
                      <Search size={16} color="#94a3b8" style={{ position: "absolute", left: 12, top: 12 }} />
                      <input
                        type="text"
                        value={doctorQuery}
                        onChange={(e) => setDoctorQuery(e.target.value)}
                        placeholder="Search doctor or room number..."
                        style={{
                          width: "100%",
                          padding: "10px 12px 10px 38px",
                          borderRadius: 10,
                          border: "1px solid #cbd5e1",
                          fontSize: 13,
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    {/* Doctor Cards Grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, maxHeight: 380, overflowY: "auto" }}>
                      {matchingDoctors.map((doc) => {
                        const waitingForDoc = tokens.filter((t) => t.doctorId === doc.id && !["Completed", "Skipped"].includes(t.status)).length;
                        return (
                          <div
                            key={doc.id}
                            onClick={() => setSelectedDoctor(doc)}
                            style={{
                              padding: "14px",
                              borderRadius: 12,
                              border: "1.5px solid #e2e8f0",
                              background: "#ffffff",
                              cursor: "pointer",
                              transition: "all 0.15s",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0284c7"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(2, 132, 199, 0.1)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }}
                          >
                            <div style={{ display: "flex", alignItems: "start", gap: 10 }}>
                              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${doc.color}15`, color: doc.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, shrink: 0 }}>
                                {doc.name.split(" ").slice(1).map((p) => p[0]).join("")}
                              </div>
                              <div style={{ minWidth: 0, flex: 1 }}>
                                <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{doc.name}</div>
                                <div style={{ fontSize: 12, fontWeight: 600, color: "#0284c7" }}>{doc.specialty}</div>
                                <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{doc.degree} · {doc.experience}</div>
                              </div>
                            </div>

                            <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <span style={{ fontSize: 11, fontWeight: 700, color: "#334155", background: "#f8fafc", padding: "2px 8px", borderRadius: 6 }}>
                                🚪 Room {doc.room}
                              </span>
                              <span style={{ fontSize: 11, fontWeight: 600, color: waitingForDoc > 2 ? "#d97706" : "#16a34a" }}>
                                {waitingForDoc === 0 ? "🟢 No wait" : `🟡 ${waitingForDoc} waiting (~${waitingForDoc * 10}m)`}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedPatient(null)}
                      style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
                    >
                      <ArrowLeft size={14} /> Back to Patient Search
                    </button>
                  </div>
                )}

                {/* STEP 3: CONFIRMATION & TICKET DISPENSE */}
                {selectedPatient && selectedDoctor && (
                  <div>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#0284c7", letterSpacing: "0.08em" }}>
                        Step 03 · Review & Generate Token
                      </span>
                      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "4px 0 0 0" }}>
                        Ready to Dispense OPD Token
                      </h2>
                      <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 16px 0" }}>
                        Confirm visit category and print or send digital token slip to the patient.
                      </p>
                    </div>

                    {/* Summary Cards */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
                      {/* Patient Summary */}
                      <div style={{ padding: "14px", borderRadius: 12, border: "1px solid #e2e8f0", background: "#f8fafc" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#64748b" }}>Patient</span>
                          <button onClick={() => setSelectedPatient(null)} style={{ fontSize: 11, color: "#0284c7", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Change</button>
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>{selectedPatient.name}</div>
                        <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>{selectedPatient.mobile} · {selectedPatient.umr}</div>
                        <div style={{ fontSize: 12, color: "#64748b" }}>{selectedPatient.age} yrs · {selectedPatient.gender}</div>
                      </div>

                      {/* Doctor Summary */}
                      <div style={{ padding: "14px", borderRadius: 12, border: "1px solid #e2e8f0", background: "#f8fafc" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#64748b" }}>Consulting Specialist</span>
                          <button onClick={() => setSelectedDoctor(null)} style={{ fontSize: 11, color: "#0284c7", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Change</button>
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>{selectedDoctor.name}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#0284c7", marginTop: 2 }}>{selectedDoctor.specialty} · Room {selectedDoctor.room}</div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>{selectedDoctor.floor}</div>
                      </div>
                    </div>

                    {/* Triage / Priority & Visit Type */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                      <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                          Patient Category / Priority
                        </label>
                        <select
                          value={selectedPriority}
                          onChange={(e) => setSelectedPriority(e.target.value)}
                          style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #cbd5e1", fontSize: 13, background: "#ffffff", outline: "none" }}
                        >
                          <option value="Standard">Standard OPD</option>
                          <option value="Senior Citizen">Senior Citizen (60+ years)</option>
                          <option value="Pediatric">Pediatric (Under 12)</option>
                          <option value="Wheelchair Assist">Wheelchair / Physical Assist</option>
                          <option value="Emergency">Emergency / Fast-Track</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                          Consultation Type
                        </label>
                        <select
                          value={selectedVisitType}
                          onChange={(e) => setSelectedVisitType(e.target.value)}
                          style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #cbd5e1", fontSize: 13, background: "#ffffff", outline: "none" }}
                        >
                          <option value="First Consultation">First Consultation</option>
                          <option value="Follow-up">Follow-up Visit</option>
                          <option value="Report Review">Lab Report Review</option>
                          <option value="Prescription Refill">Prescription Refill</option>
                        </select>
                      </div>
                    </div>

                    {/* Optional Remarks */}
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                        Front-Desk Remarks (Optional)
                      </label>
                      <input
                        type="text"
                        value={consultationRemarks}
                        onChange={(e) => setConsultationRemarks(e.target.value)}
                        placeholder="e.g. Needs vitals taken first, brought previous MRI scans..."
                        style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #cbd5e1", fontSize: 13, outline: "none", boxSizing: "border-box" }}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14, borderTop: "1px solid #f1f5f9" }}>
                      <button
                        type="button"
                        onClick={() => setSelectedDoctor(null)}
                        style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 10, border: "1px solid #cbd5e1", background: "#ffffff", color: "#475569", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
                      >
                        <ArrowLeft size={15} /> Back
                      </button>

                      <button
                        type="button"
                        onClick={handleGenerateToken}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "12px 24px",
                          borderRadius: 12,
                          background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                          color: "#ffffff",
                          border: "none",
                          fontSize: 14,
                          fontWeight: 800,
                          cursor: "pointer",
                          boxShadow: "0 6px 20px rgba(2, 132, 199, 0.35)",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }}
                      >
                        <Ticket size={18} />
                        <span>⚡ Generate & Dispense Token</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT SIDEBAR: LIVE DOCTOR QUEUE LOAD & RECENT TOKENS */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Card 1: Live OPD Room Occupancy */}
              <div style={{ background: "#ffffff", borderRadius: 18, border: "1px solid #e2e8f0", padding: "18px", boxShadow: "0 4px 16px rgba(0,0,0,0.02)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Activity size={16} color="#0284c7" />
                    <h3 style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", margin: 0 }}>OPD Room Status</h3>
                  </div>
                  <span style={{ fontSize: 11, color: "#64748b" }}>Live Desk Sync</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {DOCTORS.map((doc) => {
                    const docTokens = tokens.filter((t) => t.doctorId === doc.id && !["Completed", "Skipped"].includes(t.status));
                    const isSelected = selectedDoctor?.id === doc.id;
                    return (
                      <div
                        key={doc.id}
                        onClick={() => {
                          if (selectedPatient) setSelectedDoctor(doc);
                        }}
                        style={{
                          padding: "10px 12px",
                          borderRadius: 10,
                          border: isSelected ? "1.5px solid #0284c7" : "1px solid #f1f5f9",
                          background: isSelected ? "#f0f9ff" : "#f8fafc",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          cursor: selectedPatient ? "pointer" : "default",
                          transition: "all 0.15s",
                        }}
                      >
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: 6 }}>
                            <span>{doc.name}</span>
                            <span style={{ fontSize: 10, color: "#64748b", background: "#e2e8f0", padding: "1px 6px", borderRadius: 4 }}>
                              R-{doc.room}
                            </span>
                          </div>
                          <div style={{ fontSize: 11, color: "#64748b" }}>{doc.specialty}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontSize: 12, fontWeight: 800, color: docTokens.length > 2 ? "#d97706" : "#0284c7" }}>
                            {docTokens.length} active
                          </span>
                          <span style={{ display: "block", fontSize: 10, color: "#94a3b8" }}>
                            {docTokens.length === 0 ? "Ready" : `~${docTokens.length * 10}m wait`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card 2: Recent Tokens Feed */}
              <div style={{ background: "#ffffff", borderRadius: 18, border: "1px solid #e2e8f0", padding: "18px", boxShadow: "0 4px 16px rgba(0,0,0,0.02)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Clock3 size={16} color="#0284c7" />
                    <h3 style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", margin: 0 }}>Recent Tokens Dispensed</h3>
                  </div>
                  <button
                    onClick={() => navigateTo("/waiting-pool")}
                    style={{ fontSize: 11, color: "#0284c7", background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}
                  >
                    View All →
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {tokens.slice(0, 5).map((tok) => {
                    const pat = patients.find((p) => p.id === tok.patientId);
                    const doc = DOCTORS.find((d) => d.id === tok.doctorId);
                    const st = statusStyles[tok.status] || statusStyles.Waiting;

                    return (
                      <div
                        key={tok.id}
                        style={{
                          padding: "12px",
                          borderRadius: 12,
                          border: "1px solid #e2e8f0",
                          background: "#ffffff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 10,
                        }}
                      >
                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 13, fontWeight: 900, color: "#0284c7", fontFamily: "monospace" }}>
                              {tok.number}
                            </span>
                            <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 999, background: st.bg, color: st.text, border: `1px solid ${st.border}` }}>
                              {tok.status}
                            </span>
                          </div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", marginTop: 2, truncate: true }}>
                            {pat?.name || "Patient Record"}
                          </div>
                          <div style={{ fontSize: 11, color: "#64748b" }}>
                            {doc?.name} (Room {doc?.room}) · {tok.createdAt}
                          </div>
                        </div>

                        {/* Quick actions: Print & Announce */}
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <button
                            title="Reprint Token Slip"
                            onClick={() => setPrintedToken({ token: tok, patient: pat, doctor: doc })}
                            style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#475569", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                          >
                            <Printer size={14} />
                          </button>
                          {tok.status === "Waiting" && (
                            <button
                              title="Announce Immediately"
                              onClick={() => updateStatus(tok.id, "Announced")}
                              style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "#0284c7", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                            >
                              <Megaphone size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: OPD WAITING POOL (/waiting-pool) */}
        {selectedView === "pool" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: 0 }}>
                  OPD Waiting Pool & Room Queue Management
                </h2>
                <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0 0" }}>
                  Monitor rooms, drag & drop to reorder patients, announce next in queue, and manage check-ins.
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button
                  onClick={() => navigateTo("/tokens")}
                  style={{
                    padding: "9px 16px",
                    borderRadius: 10,
                    background: "#0284c7",
                    color: "#ffffff",
                    border: "none",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Ticket size={16} />
                  <span>+ Generate New Token</span>
                </button>
                <button
                  onClick={() => navigateTo("/announcer")}
                  style={{
                    padding: "9px 16px",
                    borderRadius: 10,
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    color: "#0f172a",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <MonitorPlay size={16} color="#0284c7" />
                  <span>Open TV Display Board</span>
                </button>
              </div>
            </div>

            {/* Doctor Room Columns (Kanban Style) */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: 18 }}>
              {DOCTORS.map((doc) => {
                const doctorTokens = tokens
                  .filter((t) => t.doctorId === doc.id)
                  .sort((a, b) => (a.queueOrder ?? Number(a.number.split("-")[1])) - (b.queueOrder ?? Number(b.number.split("-")[1])));
                const activeCount = doctorTokens.filter((t) => !["Completed", "Skipped"].includes(t.status)).length;
                const nextWaiting = doctorTokens.find((t) => t.status === "Waiting");

                return (
                  <div
                    key={doc.id}
                    style={{
                      background: "#ffffff",
                      borderRadius: 18,
                      border: "1px solid #e2e8f0",
                      padding: "18px",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Room Header */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 14, borderBottom: "1px solid #f1f5f9", marginBottom: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: `${doc.color}15`, color: doc.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
                          {doc.name.split(" ").slice(1).map((p) => p[0]).join("")}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>{doc.name}</div>
                          <div style={{ fontSize: 11, color: "#64748b" }}>{doc.specialty} · {doc.floor}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#64748b", display: "block" }}>Room</span>
                        <span style={{ fontSize: 15, fontWeight: 900, color: "#0f172a", fontFamily: "monospace" }}>{doc.room}</span>
                      </div>
                    </div>

                    {/* Room Subheader with Call Next quick button */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>
                        {activeCount} active in queue
                      </span>
                      {nextWaiting && (
                        <button
                          onClick={() => updateStatus(nextWaiting.id, "Announced")}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "4px 10px",
                            borderRadius: 8,
                            background: "#0284c7",
                            color: "#ffffff",
                            border: "none",
                            fontSize: 11,
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          <Megaphone size={12} />
                          <span>Call Next ({nextWaiting.number})</span>
                        </button>
                      )}
                    </div>

                    {/* Patient Token Cards List */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 180 }} onDragOver={(e) => e.preventDefault()}>
                      {doctorTokens.length > 0 ? (
                        doctorTokens.map((token) => {
                          const patient = patients.find((p) => p.id === token.patientId);
                          const st = statusStyles[token.status] || statusStyles.Waiting;
                          const priorityBadge = priorityBadges[token.priority] || priorityBadges.Standard;
                          const skipRemaining = token.status === "Skipped" ? Math.min(60, Math.max(0, Math.ceil((token.skipUntil - now) / 1000))) : 0;
                          const isDraggable = token.status === "Waiting" || token.status === "Announced";

                          return (
                            <div
                              key={token.id}
                              draggable={isDraggable}
                              onDragStart={(e) => {
                                setDraggedTokenId(token.id);
                                e.dataTransfer.setData("text/plain", token.id);
                              }}
                              onDragOver={(e) => {
                                e.preventDefault();
                                const bounds = e.currentTarget.getBoundingClientRect();
                                const pos = e.clientY < bounds.top + bounds.height / 2 ? "before" : "after";
                                setDropTarget({ tokenId: token.id, position: pos });
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                const draggedId = e.dataTransfer.getData("text/plain") || draggedTokenId;
                                const draggedToken = tokens.find((t) => t.id === draggedId);
                                const bounds = e.currentTarget.getBoundingClientRect();
                                const pos = dropTarget?.tokenId === token.id ? dropTarget.position : e.clientY < bounds.top + bounds.height / 2 ? "before" : "after";
                                reorderWithinDoctor(draggedToken, token, pos);
                                setDraggedTokenId(null);
                                setDropTarget(null);
                              }}
                              style={{
                                padding: "12px 14px",
                                borderRadius: 12,
                                border: dropTarget?.tokenId === token.id ? "2px solid #0284c7" : "1px solid #e2e8f0",
                                background: token.status === "Announced" ? "#f0f9ff" : token.status === "Checked in" ? "#f0fdf4" : "#ffffff",
                                cursor: isDraggable ? "grab" : "default",
                                transition: "all 0.15s",
                                position: "relative",
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", gap: 10 }}>
                                <div style={{ display: "flex", alignItems: "start", gap: 8 }}>
                                  {isDraggable && <GripVertical size={16} color="#94a3b8" style={{ marginTop: 2 }} />}
                                  <div>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
                                      {patient?.name || "Patient Record"}
                                    </div>
                                    <div style={{ fontSize: 11, color: "#64748b" }}>
                                      {patient?.mobile} · {patient?.umr}
                                    </div>
                                  </div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                  <span style={{ fontSize: 14, fontWeight: 900, color: "#0284c7", fontFamily: "monospace", display: "block" }}>
                                    {token.number}
                                  </span>
                                  <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 999, background: st.bg, color: st.text, border: `1px solid ${st.border}`, fontWeight: 700 }}>
                                    {token.status === "Skipped" ? `Hold ${skipRemaining}s` : token.status}
                                  </span>
                                </div>
                              </div>

                              {/* Priority & Visit type pills */}
                              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                                {token.priority && token.priority !== "Standard" && (
                                  <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 4, background: priorityBadge.bg, color: priorityBadge.text, border: `1px solid ${priorityBadge.border}` }}>
                                    {priorityBadge.label}
                                  </span>
                                )}
                                <span style={{ fontSize: 10, color: "#64748b" }}>
                                  Issued {token.createdAt} · {token.visitType || "Consultation"}
                                </span>
                              </div>

                              {/* Action Row */}
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10, paddingTop: 8, borderTop: "1px solid #f1f5f9" }}>
                                <button
                                  onClick={() => setPrintedToken({ token, patient, doctor: doc })}
                                  style={{ background: "none", border: "none", color: "#64748b", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                                >
                                  <Printer size={12} /> Print Slip
                                </button>

                                <div style={{ display: "flex", gap: 6 }}>
                                  {token.status === "Waiting" && (
                                    <button
                                      onClick={() => updateStatus(token.id, "Announced")}
                                      style={{ padding: "4px 8px", borderRadius: 6, background: "#0284c7", color: "#ffffff", border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                                    >
                                      <Megaphone size={12} /> Announce
                                    </button>
                                  )}
                                  {token.status === "Announced" && (
                                    <>
                                      <button
                                        onClick={() => updateStatus(token.id, "Checked in")}
                                        style={{ padding: "4px 8px", borderRadius: 6, background: "#16a34a", color: "#ffffff", border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                                      >
                                        <ClipboardCheck size={12} /> Check In
                                      </button>
                                      <button
                                        onClick={() => updateStatus(token.id, "Announced")}
                                        style={{ padding: "4px 8px", borderRadius: 6, background: "#e0f2fe", color: "#0369a1", border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                                      >
                                        Recall 📢
                                      </button>
                                    </>
                                  )}
                                  {token.status === "Checked in" && (
                                    <button
                                      onClick={() => updateStatus(token.id, "Completed")}
                                      style={{ padding: "4px 8px", borderRadius: 6, background: "#475569", color: "#ffffff", border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                                    >
                                      <Check size={12} /> Check Out
                                    </button>
                                  )}
                                  {["Waiting", "Announced"].includes(token.status) && (
                                    <button
                                      onClick={() => updateStatus(token.id, "Skipped")}
                                      style={{ padding: "4px 8px", borderRadius: 6, background: "#fee2e2", color: "#991b1b", border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                                    >
                                      Skip
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div style={{ padding: "30px", textAlign: "center", border: "1px dashed #cbd5e1", borderRadius: 12, color: "#94a3b8", fontSize: 12 }}>
                          No patients currently in this room's queue
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 3: SMART TV CALL BOARD (/announcer) */}
        {selectedView === "tv" && (
          <div ref={announcerBoardRef} style={{ background: "#ffffff", borderRadius: 20, border: "1px solid #cbd5e1", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.06)" }}>
            {/* TV Header */}
            <div style={{ padding: "20px 28px", borderBottom: "1px solid #e2e8f0", background: "linear-gradient(90deg, #0f172a 0%, #1e293b 100%)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Megaphone size={22} color="#38bdf8" />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.14em", color: "#38bdf8" }}>
                    Apple Multispecialty Hospital · Outpatient Department
                  </div>
                  <h2 style={{ fontSize: 24, fontWeight: 800, margin: "2px 0 0 0", letterSpacing: "-0.02em" }}>
                    Patient Calling & Room Display Board
                  </h2>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8" }}>Real-time OPD Broadcast</div>
                  <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "monospace", color: "#ffffff" }}>
                    {new Intl.DateTimeFormat("en", { weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date())}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={toggleAnnouncerFullscreen}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 14px",
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "#ffffff",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {isAnnouncerFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  <span>{isAnnouncerFullscreen ? "Exit Fullscreen" : "Fullscreen TV Mode"}</span>
                </button>
              </div>
            </div>

            {/* Display Board Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 1, background: "#e2e8f0" }}>
              {DOCTORS.map((doc) => {
                const doctorTokens = tokens
                  .filter((t) => t.doctorId === doc.id && !["Completed", "Skipped"].includes(t.status))
                  .sort((a, b) => (a.queueOrder ?? Number(a.number.split("-")[1])) - (b.queueOrder ?? Number(b.number.split("-")[1])));
                const announced = doctorTokens.find((t) => t.status === "Announced");
                const inRoom = doctorTokens.find((t) => t.status === "Checked in");
                const nextWaiting = doctorTokens.find((t) => t.status === "Waiting");

                const current = announced || inRoom || nextWaiting;
                const patient = patients.find((p) => p.id === current?.patientId);
                const isAnnouncing = Boolean(announced);

                return (
                  <div
                    key={doc.id}
                    style={{
                      background: isAnnouncing ? "#f0fdf4" : inRoom ? "#f8fafc" : "#ffffff",
                      padding: "24px",
                      position: "relative",
                      transition: "all 0.3s",
                      boxShadow: isAnnouncing ? "inset 0 0 0 3px #22c55e" : "none",
                    }}
                  >
                    {/* Doctor Info */}
                    <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", marginBottom: 20 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 46, height: 46, borderRadius: 12, background: `${doc.color}20`, color: doc.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16 }}>
                          {doc.name.split(" ").slice(1).map((p) => p[0]).join("")}
                        </div>
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>{doc.name}</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#0284c7" }}>{doc.specialty}</div>
                          <div style={{ fontSize: 11, color: "#64748b" }}>{doc.floor}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right", background: "#0f172a", color: "#ffffff", padding: "6px 12px", borderRadius: 8 }}>
                        <span style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#38bdf8", display: "block" }}>ROOM</span>
                        <span style={{ fontSize: 16, fontWeight: 900, fontFamily: "monospace" }}>{doc.room}</span>
                      </div>
                    </div>

                    {/* Calling Token Banner */}
                    <div style={{ marginTop: 10, padding: "16px", borderRadius: 14, background: isAnnouncing ? "#dcfce7" : inRoom ? "#e0f2fe" : "#f1f5f9", textAlign: "center" }}>
                      <span
                        style={{
                          display: "inline-block",
                          fontSize: 11,
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          padding: "2px 10px",
                          borderRadius: 999,
                          background: isAnnouncing ? "#22c55e" : inRoom ? "#0284c7" : "#64748b",
                          color: "#ffffff",
                          marginBottom: 8,
                        }}
                      >
                        {isAnnouncing ? "📢 NOW CALLING" : inRoom ? "IN CONSULTATION" : current ? "UP NEXT" : "STANDBY"}
                      </span>

                      <div style={{ fontSize: 44, fontWeight: 900, fontFamily: "monospace", letterSpacing: "0.04em", color: isAnnouncing ? "#15803d" : inRoom ? "#0369a1" : "#334155" }}>
                        {current?.number || "--"}
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginTop: 4 }}>
                        {patient?.name || "No Patient in Queue"}
                      </div>
                    </div>

                    {/* Footer wait count */}
                    <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12, color: "#64748b" }}>
                      <span>{doctorTokens.filter((t) => t.status === "Waiting").length} waiting in this room</span>
                      {isAnnouncing && <span style={{ color: "#16a34a", fontWeight: 700 }}>● Please proceed to Room {doc.room}</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Board Footer */}
            <div style={{ padding: "14px 28px", background: "#f8fafc", borderTop: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12, color: "#64748b" }}>
              <span style={{ fontWeight: 600 }}>Apple Multispecialty Hospital · Patient Information Display System</span>
              <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#0284c7", fontWeight: 700 }}>
                <Clock3 size={14} /> Screen Refreshes Automatically in Real-Time
              </span>
            </div>
          </div>
        )}
      </main>

      {/* QUICK WALKIN REGISTRATION MODAL */}
      {isWalkinOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(15, 23, 42, 0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#ffffff", borderRadius: 20, width: "100%", maxWidth: 480, padding: 24, boxShadow: "0 20px 50px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <UserPlus size={18} color="#0284c7" />
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", margin: 0 }}>Quick Walk-in Patient Registration</h3>
              </div>
              <button onClick={() => setIsWalkinOpen(false)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveWalkin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>Patient Full Name *</label>
                <input
                  type="text"
                  required
                  value={walkinForm.name}
                  onChange={(e) => setWalkinForm({ ...walkinForm, name: e.target.value })}
                  placeholder="e.g. Suresh Kumar"
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #cbd5e1", fontSize: 13, outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={walkinForm.mobile}
                  onChange={(e) => setWalkinForm({ ...walkinForm, mobile: e.target.value })}
                  placeholder="e.g. 9876543210"
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #cbd5e1", fontSize: 13, outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>Age (Years)</label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={walkinForm.age}
                    onChange={(e) => setWalkinForm({ ...walkinForm, age: e.target.value })}
                    placeholder="e.g. 45"
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #cbd5e1", fontSize: 13, outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>Gender</label>
                  <select
                    value={walkinForm.gender}
                    onChange={(e) => setWalkinForm({ ...walkinForm, gender: e.target.value })}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #cbd5e1", fontSize: 13, background: "#ffffff", outline: "none" }}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>Triage / Priority</label>
                <select
                  value={walkinForm.priority}
                  onChange={(e) => setWalkinForm({ ...walkinForm, priority: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #cbd5e1", fontSize: 13, background: "#ffffff", outline: "none" }}
                >
                  <option value="Standard">Standard OPD</option>
                  <option value="Senior Citizen">Senior Citizen (60+ years)</option>
                  <option value="Pediatric">Pediatric (Under 12)</option>
                  <option value="Wheelchair Assist">Wheelchair / Physical Assist</option>
                  <option value="Emergency">Emergency / Fast-Track</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setIsWalkinOpen(false)}
                  style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1px solid #cbd5e1", background: "#ffffff", color: "#64748b", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", background: "#0284c7", color: "#ffffff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
                >
                  Register & Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIGITAL THERMAL TOKEN SLIP MODAL */}
      {printedToken && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#ffffff", borderRadius: 20, width: "100%", maxWidth: 420, padding: "26px", boxShadow: "0 25px 60px rgba(0,0,0,0.3)", position: "relative" }}>
            <button
              onClick={() => setPrintedToken(null)}
              style={{ position: "absolute", top: 18, right: 18, background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
            >
              <X size={20} />
            </button>

            {/* Thermal Ticket Design */}
            <div className="printable-thermal-ticket" style={{ border: "2px dashed #cbd5e1", borderRadius: 16, padding: "20px", background: "#fcfdfe", textAlign: "center" }}>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "#0284c7" }}>
                Apple Multispecialty Hospital
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#334155", marginTop: 2 }}>Outpatient Department Token</div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>Main OPD Wing · 1st & 2nd Floor</div>

              <div style={{ margin: "16px 0", padding: "14px", background: "#0f172a", borderRadius: 12, color: "#ffffff" }}>
                <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.14em", color: "#38bdf8" }}>YOUR TOKEN NUMBER</span>
                <div style={{ fontSize: 46, fontWeight: 900, fontFamily: "monospace", letterSpacing: "0.04em", color: "#ffffff", marginTop: 4 }}>
                  {printedToken.token.number}
                </div>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>Issued: {printedToken.token.createdAt}</span>
              </div>

              <div style={{ textAlign: "left", fontSize: 13, display: "flex", flexDirection: "column", gap: 6, borderBottom: "1px dashed #cbd5e1", paddingBottom: 12, marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748b" }}>Patient:</span>
                  <strong style={{ color: "#0f172a" }}>{printedToken.patient?.name}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748b" }}>UMR / Mobile:</span>
                  <span style={{ color: "#334155" }}>{printedToken.patient?.umr} · {printedToken.patient?.mobile}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748b" }}>Doctor:</span>
                  <strong style={{ color: "#0284c7" }}>{printedToken.doctor?.name}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748b" }}>Specialty & Room:</span>
                  <span style={{ fontWeight: 700, color: "#0f172a" }}>{printedToken.doctor?.specialty} · Room {printedToken.doctor?.room}</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 12, color: "#16a34a", fontWeight: 700, background: "#f0fdf4", padding: "6px", borderRadius: 8 }}>
                <Smartphone size={14} />
                <span>SMS & WhatsApp Confirmation Dispatched</span>
              </div>
            </div>

            {/* Actions */}
            <div className="no-print" style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <button
                type="button"
                onClick={() => {
                  window.print();
                  showToast("Sending to thermal receipt printer...");
                }}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "11px",
                  borderRadius: 10,
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#0f172a",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                <Printer size={15} />
                <span>Print Receipt</span>
              </button>

              <button
                type="button"
                onClick={() => setPrintedToken(null)}
                style={{
                  flex: 1,
                  padding: "11px",
                  borderRadius: 10,
                  border: "none",
                  background: "#0284c7",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
      {/* PRINT STYLES FOR THERMAL RECEIPT */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          .printable-thermal-ticket, .printable-thermal-ticket * {
            visibility: visible !important;
          }
          .printable-thermal-ticket {
            position: fixed !important;
            left: 50% !important;
            top: 20px !important;
            transform: translateX(-50%) !important;
            width: 80mm !important;
            max-width: 80mm !important;
            padding: 12px !important;
            border: 1px dashed #000 !important;
            background: #ffffff !important;
            color: #000000 !important;
            box-shadow: none !important;
            z-index: 999999 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
