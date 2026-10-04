import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Check,
  CheckCircle2,
  ClipboardCheck,
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
} from "lucide-react";

const STORAGE_KEY = "get-well-op-tokens-v1";

const DOCTORS = [
  { id: "rao", name: "Dr. Ananya Rao", degree: "MBBS, MD, DM", specialty: "Cardiology", experience: "16 years", room: "204", color: "teal" },
  { id: "mehta", name: "Dr. Vikram Mehta", degree: "MBBS, MS, MCh", specialty: "Orthopedics", experience: "12 years", room: "108", color: "coral" },
  { id: "mani", name: "Dr. Priya Mani", degree: "MBBS, MD, DCH", specialty: "Pediatrics", experience: "10 years", room: "302", color: "blue" },
  { id: "shah", name: "Dr. Nikhil Shah", degree: "MBBS, MD, DM", specialty: "Neurology", experience: "14 years", room: "215", color: "gold" },
  { id: "iyer", name: "Dr. Kavitha Iyer", degree: "MBBS, MD, DGO", specialty: "Gynecology", experience: "18 years", room: "116", color: "green" },
];

const PATIENTS = [
  { id: "p-1001", name: "Aarav Sharma", mobile: "9876543210", umr: "UMR-240018", age: 42, gender: "Male" },
  { id: "p-1002", name: "Meera Nair", mobile: "9845012345", umr: "UMR-240026", age: 35, gender: "Female" },
  { id: "p-1003", name: "Ishaan Kapoor", mobile: "9900123456", umr: "UMR-240041", age: 8, gender: "Male" },
  { id: "p-1004", name: "Fatima Khan", mobile: "9988776655", umr: "UMR-240055", age: 61, gender: "Female" },
  { id: "p-1005", name: "Rohan Das", mobile: "9811122233", umr: "UMR-240062", age: 53, gender: "Male" },
];

const INITIAL_TOKENS = [
  { id: "demo-1", number: "GW-041", patientId: "p-1001", doctorId: "rao", status: "Waiting", createdAt: "09:18 AM" },
  { id: "demo-2", number: "GW-042", patientId: "p-1002", doctorId: "rao", status: "Announced", createdAt: "09:24 AM" },
  { id: "demo-3", number: "GW-043", patientId: "p-1004", doctorId: "mehta", status: "Checked in", createdAt: "09:31 AM" },
  { id: "demo-4", number: "GW-044", patientId: "p-1003", doctorId: "mani", status: "Waiting", createdAt: "09:36 AM" },
  { id: "demo-5", number: "GW-045", patientId: "p-1005", doctorId: "shah", status: "Waiting", createdAt: "09:41 AM" },
];

const statusStyles = {
  Waiting: "bg-amber-50 text-amber-800",
  Announced: "bg-sky-50 text-sky-800",
  "Checked in": "bg-emerald-50 text-emerald-800",
  Completed: "bg-clinical-100 text-clinical-700",
  Skipped: "bg-rose-50 text-rose-700",
};

function getStoredTokens() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_TOKENS;
  } catch {
    return INITIAL_TOKENS;
  }
}

function IconButton({ children, onClick, label, tone = "neutral", disabled = false }) {
  const tones = {
    neutral: "border-clinical-100 text-clinical-700 hover:bg-clinical-50",
    primary: "border-clinical-700 bg-clinical-700 text-white hover:bg-clinical-900",
    green: "border-emerald-200 text-emerald-800 hover:bg-emerald-50",
    red: "border-rose-200 text-rose-700 hover:bg-rose-50",
  };

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex min-h-9 items-center justify-center gap-1.5 rounded-md border px-2.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${tones[tone]}`}
    >
      {children}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function TokenRow({ token, patient, onStatusChange, onDragStart, onDragOver, onDrop, onDragEnd, isDragging, dropPosition, now }) {
  const skipRemaining = token.status === "Skipped" ? Math.min(60, Math.max(0, Math.ceil((token.skipUntil - now) / 1000))) : 0;
  const canAnnounceAgain = token.status === "Announced" && now - (token.announcedAt || 0) >= 60_000;
  const isLocked = token.status === "Skipped" && skipRemaining > 0;
  const isDraggable = !isLocked && ["Waiting", "Announced"].includes(token.status);

  return (
    <div
      draggable={isDraggable}
      onDragStart={(event) => onDragStart(event, token)}
      onDragOver={(event) => onDragOver(event, token)}
      onDrop={(event) => onDrop(event, token)}
      onDragEnd={() => onDragEnd?.()}
      data-drop-position={dropPosition || undefined}
      className={`group relative flex flex-col gap-3 border border-clinical-100 bg-white p-4 shadow-sm transition duration-200 ${isDraggable ? "cursor-grab active:cursor-grabbing hover:-translate-y-0.5 hover:border-clinical-300 hover:shadow-md" : ""} ${isDragging ? "opacity-40" : ""} ${isLocked ? "bg-rose-50/50" : ""} ${dropPosition ? "z-10 border-coral-500" : ""}`}
    >
      {dropPosition && <span role="status" aria-label={`Drop ${token.number} ${dropPosition} this patient`} className={`pointer-events-none absolute left-1/2 z-30 -translate-x-1/2 rounded-md bg-coral-600 p-1 text-white shadow-md ring-2 ring-white ${dropPosition === "before" ? "-top-3" : "-bottom-3"}`}>{dropPosition === "before" ? <ArrowUp size={18} strokeWidth={3} /> : <ArrowDown size={18} strokeWidth={3} />}</span>}
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2">
          {isDraggable && <GripVertical size={16} aria-label="Drag to reorder within this doctor's queue" className="mt-0.5 shrink-0 text-ink-300 transition-colors group-hover:text-clinical-500" />}
          <div className="min-w-0">
            <div className="break-words text-[15px] font-bold leading-5 text-clinical-950">{patient?.name ?? "Patient record unavailable"}</div>
            <div className="mt-1 break-words text-xs leading-4 text-ink-600">{patient?.mobile ?? "-"} <span className="px-1 text-ink-300">·</span> {patient?.umr ?? "-"}</div>
          </div>
        </div>
        <div className="shrink-0 rounded bg-clinical-50 px-2 py-1 font-mono text-xs font-bold tracking-wide text-clinical-900">{token.number}</div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-clinical-50 pt-2">
        <span className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[token.status] || statusStyles.Waiting}`}>{isLocked ? `Hold · ${skipRemaining}s` : token.status}</span>
        <div className="flex flex-wrap gap-1.5">
          {token.status === "Waiting" && <IconButton label="Announce" tone="primary" onClick={() => onStatusChange(token.id, "Announced")}><Megaphone size={14} /></IconButton>}
          {token.status === "Announced" && <>
            <IconButton label="Check in" tone="green" onClick={() => onStatusChange(token.id, "Checked in")}><ClipboardCheck size={14} /></IconButton>
            {canAnnounceAgain && <IconButton label="Announce again" tone="primary" onClick={() => onStatusChange(token.id, "Announced")}><Megaphone size={14} /></IconButton>}
          </>}
          {token.status === "Checked in" && <IconButton label="Check out" tone="green" onClick={() => onStatusChange(token.id, "Completed")}><Check size={14} /></IconButton>}
          {["Waiting", "Announced"].includes(token.status) && <IconButton label="Skip" tone="red" onClick={() => onStatusChange(token.id, "Skipped")}><SkipForward size={14} /></IconButton>}
          {isLocked && <span className="px-2 py-2 text-[11px] text-rose-700">Actions resume when hold ends</span>}
          {token.status === "Completed" && <span className="px-2 py-2 text-xs text-ink-600">Checked out</span>}
        </div>
      </div>
    </div>
  );
}

export default function TokenDesk({ currentPath, navigateTo }) {
  const announcerBoardRef = useRef(null);
  const [tokens, setTokens] = useState(getStoredTokens);
  const knownAnnouncedTimestampsRef = useRef(new Map(
    tokens.filter((token) => token.status === "Announced").map((token) => [token.id, token.announcedAt ?? null]),
  ));
  const [query, setQuery] = useState("");
  const [doctorQuery, setDoctorQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [notice, setNotice] = useState("");
  const [now, setNow] = useState(Date.now());
  const [draggedTokenId, setDraggedTokenId] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [isAnnouncerFullscreen, setIsAnnouncerFullscreen] = useState(false);

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

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
  }, [tokens]);

  useEffect(() => {
    const syncTokens = (event) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      try {
        const updatedTokens = JSON.parse(event.newValue);
        if (Array.isArray(updatedTokens)) setTokens(updatedTokens);
      } catch {
        return;
      }
    };

    window.addEventListener("storage", syncTokens);
    return () => window.removeEventListener("storage", syncTokens);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
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

  const selectedView = currentPath === "/waiting-pool" ? "pool" : currentPath === "/announcer" ? "tv" : "generator";
  useEffect(() => {
    if (selectedView !== "tv") return;

    const announcedTokens = tokens.filter((token) => token.status === "Announced");
    const knownTimestamps = knownAnnouncedTimestampsRef.current;
    let hasNewAnnouncement = false;
    announcedTokens.forEach((token) => {
      const timestamp = token.announcedAt ?? null;
      const isNew = timestamp !== null && (!knownTimestamps.has(token.id) || knownTimestamps.get(token.id) !== timestamp);
      knownTimestamps.set(token.id, timestamp);
      if (isNew) hasNewAnnouncement = true;
    });

    if (hasNewAnnouncement) playAnnouncementBell();
  }, [selectedView, tokens]);

  const patientMatches = useMemo(() => {
    const normalized = query.trim().toLowerCase().replace(/\s/g, "");
    if (normalized.length < 4) return [];
    return PATIENTS.filter((patient) =>
      patient.mobile.includes(normalized) || patient.umr.toLowerCase().replace(/\s/g, "").includes(normalized),
    );
  }, [query]);
  const matchingDoctors = useMemo(() => {
    const normalized = doctorQuery.trim().toLowerCase();
    return DOCTORS.filter((doctor) =>
      !normalized || doctor.name.toLowerCase().includes(normalized) || doctor.specialty.toLowerCase().includes(normalized),
    );
  }, [doctorQuery]);
  const activeCount = tokens.filter((token) => !["Completed", "Skipped"].includes(token.status)).length;

  const updateStatus = (tokenId, status) => {
    setTokens((current) => current.map((token) => {
      if (token.id !== tokenId) return token;
      if (status === "Skipped") return { ...token, status, skipUntil: Date.now() + 60_000 };
      if (status === "Announced") return { ...token, status, announcedAt: Date.now() };
      return { ...token, status, ...(status === "Checked in" ? { announcedAt: null } : {}) };
    }));
  };

  const reorderWithinDoctor = (sourceToken, targetToken, position) => {
    if (!sourceToken || sourceToken.id === targetToken.id || sourceToken.doctorId !== targetToken.doctorId) return;
    setTokens((current) => {
      const doctorQueue = current
        .filter((token) => token.doctorId === sourceToken.doctorId)
        .sort((first, second) => (first.queueOrder ?? Number(first.number.split("-")[1])) - (second.queueOrder ?? Number(second.number.split("-")[1])));
      const fromIndex = doctorQueue.findIndex((token) => token.id === sourceToken.id);
      const toIndex = doctorQueue.findIndex((token) => token.id === targetToken.id);
      if (fromIndex < 0 || toIndex < 0) return current;
      const [movedToken] = doctorQueue.splice(fromIndex, 1);
      const insertionIndex = toIndex + (position === "after" ? 1 : 0);
      doctorQueue.splice(insertionIndex > fromIndex ? insertionIndex - 1 : insertionIndex, 0, movedToken);
      const orderById = new Map(doctorQueue.map((token, index) => [token.id, index]));
      return current.map((token) => orderById.has(token.id) ? { ...token, queueOrder: orderById.get(token.id) } : token);
    });
  };

  const generateToken = () => {
    if (!selectedPatient || !selectedDoctor) return;
    const nextNumber = Math.max(0, ...tokens.map((token) => Number(token.number.split("-")[1]) || 0)) + 1;
    const token = {
      id: `token-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      number: `GW-${String(nextNumber).padStart(3, "0")}`,
      patientId: selectedPatient.id,
      doctorId: selectedDoctor.id,
      status: "Waiting",
      createdAt: new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit" }).format(new Date()),
    };
    setTokens((current) => [...current, token]);
    setNotice(`${token.number} created for ${selectedPatient.name} with ${selectedDoctor.name}.`);
    setQuery("");
    setSelectedPatient(null);
    setSelectedDoctor(null);
    setDoctorQuery("");
  };

  const changeView = (path) => navigateTo(path);
  const wizardStep = !selectedPatient ? 1 : !selectedDoctor ? 2 : 3;
  const generatedTokenNumber = notice.match(/^GW-\d+/)?.[0];
  const generatedTokenDetails = generatedTokenNumber
    ? notice.slice(generatedTokenNumber.length).trim().replace(/^./, (character) => character.toUpperCase())
    : notice;

  return (
    <div className={`min-h-screen bg-[#f3f7f5] text-ink-900 ${selectedView === "tv" ? "tv-mode" : ""}`}>
      <header className="border-b border-clinical-100 bg-white">
        <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button onClick={() => navigateTo("/")} aria-label="Back to dashboard" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-clinical-100 text-clinical-700 hover:bg-clinical-50"><ArrowLeft size={17} /></button>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-clinical-500">Get Well Multispecialty Hospital</p>
              <h1 className="truncate font-display text-lg font-bold text-clinical-950">Outpatient token desk</h1>
            </div>
          </div>
          <div className="hidden items-center gap-2 text-xs font-medium text-ink-600 sm:flex"><span className="h-2 w-2 rounded-full bg-emerald-500" /> OPD desk active <span className="mx-1 text-ink-300">·</span>{activeCount} in queue</div>
        </div>
        <nav aria-label="Token tools" className="mx-auto flex max-w-[1480px] gap-1 overflow-x-auto px-5 sm:px-8">
          {[
            { path: "/tokens", label: "Generate token", icon: Ticket },
            { path: "/waiting-pool", label: "Waiting pool", icon: Users },
            { path: "/announcer", label: "TV announcer", icon: MonitorPlay },
          ].map(({ path, label, icon: TabIcon }) => (
            <button key={path} onClick={() => changeView(path)} className={`inline-flex min-h-11 shrink-0 items-center gap-2 border-b-2 px-3 text-xs font-semibold transition-colors ${currentPath === path ? "border-clinical-700 text-clinical-800" : "border-transparent text-ink-600 hover:text-clinical-700"}`}>
              <TabIcon size={15} />{label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-[1480px] px-5 py-7 sm:px-8 sm:py-9">
        {selectedView === "generator" && (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
            <section>
              <section className="overflow-hidden border border-clinical-100 bg-white shadow-sm">
                <div className="grid grid-cols-3 border-b border-clinical-100 bg-[#f8fbfa]">
                  {[
                    { number: 1, label: "Patient", icon: Search },
                    { number: 2, label: "Doctor", icon: Stethoscope },
                    { number: 3, label: "Confirm", icon: ClipboardCheck },
                  ].map(({ number, label, icon: StepIcon }) => {
                    const complete = wizardStep > number;
                    const active = wizardStep === number;
                    return <button key={number} type="button" disabled={wizardStep < number} onClick={() => {
                      if (number === 1) { setSelectedPatient(null); setSelectedDoctor(null); }
                      if (number === 2 && selectedPatient) setSelectedDoctor(null);
                    }} aria-current={active ? "step" : undefined} className={`relative flex min-h-[76px] items-center gap-2 border-b-[3px] px-3 py-3 text-left transition-colors sm:gap-3 sm:px-5 ${active ? "border-clinical-700 bg-white" : complete ? "border-emerald-500" : "border-transparent"} ${wizardStep >= number ? "cursor-pointer" : "cursor-not-allowed opacity-55"}`}>
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${complete ? "bg-emerald-100 text-emerald-800" : active ? "bg-clinical-700 text-white" : "bg-clinical-100 text-clinical-500"}`}>{complete ? <Check size={16} /> : <StepIcon size={15} />}</span>
                      <span className="min-w-0"><span className={`block text-[10px] font-bold uppercase tracking-[0.12em] ${active ? "text-clinical-600" : "text-ink-600"}`}>Step 0{number}</span><span className={`mt-0.5 block truncate text-xs font-bold sm:text-sm ${active ? "text-clinical-950" : "text-ink-600"}`}>{label}</span></span>
                    </button>;
                  })}
                </div>

                <div className="p-5 sm:p-7">
                  {!selectedPatient && <div className="animate-fade-in-up">
                    <div className="mb-6"><p className="text-xs font-bold uppercase tracking-[0.12em] text-coral-600">Step 01 / Patient</p><h3 className="mt-1 font-display text-xl font-bold text-clinical-950">Who is this visit for?</h3><p className="mt-1 text-sm text-ink-600">Search the patient registry using their mobile number or UMR.</p></div>
                    <label htmlFor="patient-search" className="mb-2 block text-xs font-semibold text-ink-900">Mobile number or UMR number</label>
                    <div className="relative"><Search size={17} className="absolute left-3.5 top-3.5 text-ink-300" /><input id="patient-search" autoFocus value={query} onChange={(event) => { setQuery(event.target.value); setSelectedPatient(null); setSelectedDoctor(null); }} placeholder="Enter mobile number or UMR" className="h-12 w-full rounded-md border border-clinical-200 bg-white pl-11 pr-3 text-sm outline-none transition focus:border-clinical-500 focus:ring-4 focus:ring-clinical-100" /></div>
                    {query.trim().length >= 4 && <div className="mt-3 divide-y divide-clinical-100 border border-clinical-100">
                      {patientMatches.length ? patientMatches.map((patient) => <button key={patient.id} onClick={() => { setSelectedPatient(patient); setSelectedDoctor(null); }} className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-clinical-50"><span><span className="block text-sm font-bold text-clinical-950">{patient.name}</span><span className="mt-1 block text-xs text-ink-600">{patient.mobile} <span className="px-1 text-ink-300">·</span>{patient.umr} <span className="px-1 text-ink-300">·</span>{patient.age} yrs, {patient.gender}</span></span><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-clinical-100 text-clinical-700"><ArrowRight size={15} /></span></button>) : <p className="px-4 py-4 text-sm text-ink-600">No patient matched that mobile or UMR number.</p>}
                    </div>}
                  </div>}

                  {selectedPatient && !selectedDoctor && <div className="animate-fade-in-up">
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-l-[3px] border-emerald-500 bg-emerald-50/70 px-4 py-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-800">Patient selected</p><p className="mt-1 text-sm font-bold text-clinical-950">{selectedPatient.name}</p><p className="mt-0.5 text-xs text-ink-600">{selectedPatient.mobile} <span className="px-1 text-ink-300">·</span>{selectedPatient.umr}</p></div><button type="button" onClick={() => { setSelectedPatient(null); setSelectedDoctor(null); }} className="text-xs font-bold text-clinical-700 underline underline-offset-2">Change</button></div>
                    <div className="mb-5"><p className="text-xs font-bold uppercase tracking-[0.12em] text-coral-600">Step 02 / Doctor</p><h3 className="mt-1 font-display text-xl font-bold text-clinical-950">Choose a specialist</h3><p className="mt-1 text-sm text-ink-600">Search by doctor name or department.</p></div>
                    <label htmlFor="doctor-search" className="sr-only">Search doctors or departments</label>
                    <div className="relative mb-4"><Search size={17} className="absolute left-3.5 top-3.5 text-ink-300" /><input id="doctor-search" value={doctorQuery} onChange={(event) => setDoctorQuery(event.target.value)} placeholder="Doctor name or department" className="h-11 w-full rounded-md border border-clinical-200 bg-white pl-11 pr-3 text-sm outline-none focus:border-clinical-500 focus:ring-4 focus:ring-clinical-100" /></div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {matchingDoctors.map((doctor) => <button key={doctor.id} onClick={() => setSelectedDoctor(doctor)} className="group flex min-w-0 items-center gap-3 border border-clinical-100 bg-white p-3 text-left transition duration-150 hover:border-clinical-500 hover:bg-clinical-50/70"><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${doctor.color === "coral" ? "bg-coral-100 text-coral-600" : "bg-clinical-100 text-clinical-700"}`}>{doctor.name.split(" ").slice(1).map((part) => part[0]).join("")}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-ink-900">{doctor.name}</span><span className="mt-0.5 block text-xs text-ink-600">{doctor.specialty} <span className="px-1 text-ink-300">·</span> Room {doctor.room}</span></span><ArrowRight size={15} className="shrink-0 text-clinical-500 transition-transform group-hover:translate-x-0.5" /></button>)}
                      {!matchingDoctors.length && <p className="col-span-full py-3 text-sm text-ink-600">No doctor or department matched your search.</p>}
                    </div>
                    <button type="button" onClick={() => { setSelectedPatient(null); setSelectedDoctor(null); }} className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-md border border-clinical-200 bg-white px-3.5 text-xs font-semibold text-clinical-700 shadow-sm transition hover:border-clinical-500 hover:bg-clinical-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clinical-500 focus-visible:ring-offset-2"><ArrowLeft size={14} /> Back to patient search</button>
                  </div>}

                  {selectedPatient && selectedDoctor && <div className="animate-fade-in-up">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-coral-600">Step 03 / Confirm</p><h3 className="mt-1 font-display text-xl font-bold text-clinical-950">Review visit details</h3><p className="mt-1 text-sm text-ink-600">Confirm the patient and doctor before creating the queue token.</p>
                    <div className="mt-6 divide-y divide-clinical-100 border-y border-clinical-100">
                      <div className="flex items-center gap-4 py-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">{selectedPatient.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><div className="min-w-0 flex-1"><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink-600">Patient</p><p className="mt-1 truncate text-sm font-bold text-clinical-950">{selectedPatient.name}</p><p className="mt-0.5 text-xs text-ink-600">{selectedPatient.mobile} <span className="px-1 text-ink-300">·</span>{selectedPatient.umr}</p></div><button type="button" aria-label="Change patient" onClick={() => setSelectedPatient(null)} className="text-xs font-semibold text-clinical-700 underline underline-offset-2">Change</button></div>
                      <div className="flex items-center gap-4 py-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-clinical-100 text-xs font-bold text-clinical-700">{selectedDoctor.name.split(" ").slice(1).map((part) => part[0]).join("")}</span><div className="min-w-0 flex-1"><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink-600">Doctor / room</p><p className="mt-1 truncate text-sm font-bold text-clinical-950">{selectedDoctor.name}</p><p className="mt-0.5 text-xs text-ink-600">{selectedDoctor.specialty} <span className="px-1 text-ink-300">·</span> Room {selectedDoctor.room}</p></div><button type="button" aria-label="Change doctor" onClick={() => setSelectedDoctor(null)} className="text-xs font-semibold text-clinical-700 underline underline-offset-2">Change</button></div>
                    </div>
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3"><button type="button" onClick={() => setSelectedDoctor(null)} className="inline-flex min-h-11 items-center gap-2 border border-clinical-200 px-4 text-sm font-semibold text-clinical-700 transition hover:bg-clinical-50"><ArrowLeft size={15} /> Back</button><button onClick={generateToken} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-clinical-700 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-clinical-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clinical-500 focus-visible:ring-offset-2"><Ticket size={17} /> Generate token</button></div>
                  </div>}
                </div>
              </section>
            </section>

            <aside className="h-fit border border-clinical-100 bg-white">
              <div className="flex items-center justify-between border-b border-clinical-100 px-4 py-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-clinical-500">Today · Outpatient</p><h3 className="mt-1 text-sm font-bold text-clinical-950">Live queue overview</h3></div><Clock3 size={17} className="text-clinical-500" /></div>
              <div className="grid grid-cols-2 divide-x divide-clinical-100 border-b border-clinical-100"><div className="px-4 py-4"><p className="text-xs text-ink-600">Waiting now</p><p className="mt-1 font-display text-2xl font-bold text-clinical-900">{tokens.filter((token) => token.status === "Waiting").length}</p></div><div className="px-4 py-4"><p className="text-xs text-ink-600">In consultation</p><p className="mt-1 font-display text-2xl font-bold text-clinical-900">{tokens.filter((token) => token.status === "Checked in").length}</p></div></div>
              <div className="divide-y divide-clinical-100">{DOCTORS.map((doctor) => { const doctorTokens = tokens.filter((token) => token.doctorId === doctor.id && !["Completed", "Skipped"].includes(token.status)); return <button key={doctor.id} onClick={() => changeView("/waiting-pool")} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-clinical-50"><span><span className="block text-xs font-semibold text-ink-900">{doctor.name}</span><span className="mt-1 block text-[11px] text-ink-600">{doctor.specialty}</span></span><span className="min-w-7 rounded-full bg-clinical-50 px-2 py-1 text-center text-xs font-bold text-clinical-700">{doctorTokens.length}</span></button>; })}</div>
              <button onClick={() => changeView("/waiting-pool")} className="flex min-h-11 w-full items-center justify-center gap-2 border-t border-clinical-100 text-xs font-bold text-clinical-700 hover:bg-clinical-50">Manage waiting pool <ArrowRight size={14} /></button>
            </aside>
          </div>
        )}

        {selectedView === "pool" && <section>
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Waiting", count: tokens.filter((token) => token.status === "Waiting").length, accent: "border-l-amber-400", icon: Clock3 },
              { label: "Announced", count: tokens.filter((token) => token.status === "Announced").length, accent: "border-l-sky-500", icon: Megaphone },
              { label: "Checked in", count: tokens.filter((token) => token.status === "Checked in").length, accent: "border-l-emerald-500", icon: ClipboardCheck },
              { label: "Checked out", count: tokens.filter((token) => token.status === "Completed").length, accent: "border-l-clinical-500", icon: CheckCircle2 },
            ].map(({ label, count, accent, icon: MetricIcon }) => (
              <div key={label} className={`flex items-center justify-between border border-clinical-100 border-l-[3px] ${accent} bg-white px-4 py-3 shadow-sm`}>
                <div><p className="text-xs font-medium text-ink-600">{label}</p><p className="mt-1 font-display text-2xl font-bold text-clinical-950">{count}</p></div>
                <MetricIcon size={18} className="text-clinical-500" />
              </div>
            ))}
          </div>
          <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            {DOCTORS.map((doctor) => {
              const doctorTokens = tokens
                .filter((token) => token.doctorId === doctor.id)
                .sort((first, second) => (first.queueOrder ?? Number(first.number.split("-")[1])) - (second.queueOrder ?? Number(second.number.split("-")[1])));
              const activeRoomCount = doctorTokens.filter((token) => !["Completed", "Skipped"].includes(token.status)).length;

              return (
                <section key={doctor.id} aria-label={`${doctor.name}, room ${doctor.room}`} className="flex min-w-0 flex-col border border-clinical-100 bg-[#edf4f1] p-3 shadow-sm sm:p-4">
                  <header className="mb-3 flex items-center justify-between gap-3 border-b border-clinical-200/80 px-1 pb-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-clinical-700 text-xs font-bold text-white shadow-sm">{doctor.name.split(" ").slice(1).map((part) => part[0]).join("")}</span>
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-clinical-950">{doctor.name}</h3>
                        <p className="mt-0.5 truncate text-xs text-ink-600">{doctor.specialty}</p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="block text-[10px] font-bold uppercase tracking-[0.1em] text-ink-600">Room</span>
                      <span className="font-mono text-sm font-bold text-clinical-900">{doctor.room}</span>
                    </div>
                  </header>
                  <div className="mb-3 flex items-center justify-between px-1 text-[11px] font-semibold text-ink-600">
                    <span>{activeRoomCount} active {activeRoomCount === 1 ? "patient" : "patients"}</span>
                    <span>Drag to reorder</span>
                  </div>
                  <div className="flex flex-1 flex-col gap-2.5" onDragOver={(event) => event.preventDefault()}>
                    {doctorTokens.length ? doctorTokens.map((token) => (
                      <div key={token.id} className="relative">
                        <TokenRow
                          token={token}
                          patient={PATIENTS.find((patient) => patient.id === token.patientId)}
                          onStatusChange={updateStatus}
                          now={now}
                          isDragging={draggedTokenId === token.id}
                          onDragStart={(event, draggedToken) => {
                            if (draggedToken.status === "Skipped") {
                              event.preventDefault();
                              return;
                            }
                            setDraggedTokenId(draggedToken.id);
                            setDropTarget(null);
                            event.dataTransfer.effectAllowed = "move";
                            event.dataTransfer.setData("text/plain", draggedToken.id);
                          }}
                          onDragOver={(event, targetToken) => {
                            event.preventDefault();
                            const draggedToken = tokens.find((item) => item.id === draggedTokenId);
                            if (!draggedToken || draggedToken.id === targetToken.id || draggedToken.doctorId !== targetToken.doctorId) {
                              setDropTarget(null);
                              return;
                            }
                            const bounds = event.currentTarget.getBoundingClientRect();
                            const position = event.clientY < bounds.top + bounds.height / 2 ? "before" : "after";
                            setDropTarget({ tokenId: targetToken.id, position });
                          }}
                          onDrop={(event, targetToken) => {
                            event.preventDefault();
                            const draggedId = event.dataTransfer.getData("text/plain") || draggedTokenId;
                            const draggedToken = tokens.find((item) => item.id === draggedId);
                            const bounds = event.currentTarget.getBoundingClientRect();
                            const position = dropTarget?.tokenId === targetToken.id
                              ? dropTarget.position
                              : event.clientY < bounds.top + bounds.height / 2 ? "before" : "after";
                            reorderWithinDoctor(draggedToken, targetToken, position);
                            setDraggedTokenId(null);
                            setDropTarget(null);
                          }}
                          onDragEnd={() => {
                            setDraggedTokenId(null);
                            setDropTarget(null);
                          }}
                          dropPosition={dropTarget?.tokenId === token.id ? dropTarget.position : null}
                        />
                      </div>
                    )) : <div className="flex min-h-24 flex-1 items-center justify-center border border-dashed border-clinical-300 bg-white/60 px-4 text-center text-xs text-ink-600">No tokens assigned to this room</div>}
                  </div>
                  <p className="mt-3 px-1 text-[10px] text-ink-600">Drag a patient card to change this room's queue order.</p>
                </section>
              );
            })}
          </div>
        </section>}

        {selectedView === "tv" && <section className="animate-fade-in-up">
          <div ref={announcerBoardRef} className="announcer-call-board overflow-hidden border border-clinical-100 bg-white text-ink-900 shadow-lg">
            <header className="flex flex-wrap items-center justify-between gap-4 border-b border-clinical-100 bg-white px-5 py-4 sm:px-7 sm:py-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-clinical-100 text-clinical-700"><Megaphone size={19} /></span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-clinical-600">Get Well Multispecialty Hospital</p>
                  <h3 className="mt-0.5 font-display text-lg font-bold text-clinical-950">Now calling patients</h3>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
                <div className="text-left sm:text-right">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-600">Outpatient department</p>
                  <p className="mt-1 font-mono text-sm font-semibold text-clinical-950">{new Intl.DateTimeFormat("en", { weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date())}</p>
                </div>
                <button type="button" onClick={toggleAnnouncerFullscreen} aria-label={isAnnouncerFullscreen ? "Exit full screen" : "Show call board full screen"} title={isAnnouncerFullscreen ? "Exit full screen" : "Show call board full screen"} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-clinical-200 bg-white px-3 text-xs font-semibold text-clinical-700 shadow-sm transition hover:border-clinical-500 hover:bg-clinical-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clinical-500 focus-visible:ring-offset-2">
                  {isAnnouncerFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                  <span>{isAnnouncerFullscreen ? "Exit full screen" : "Full screen"}</span>
                </button>
              </div>
            </header>

            <div className="announcer-room-grid grid gap-px bg-clinical-100 sm:grid-cols-2 xl:grid-cols-3">
              {DOCTORS.map((doctor) => {
                const doctorTokens = tokens
                  .filter((token) => token.doctorId === doctor.id && !["Completed", "Skipped"].includes(token.status))
                  .sort((first, second) => (first.queueOrder ?? Number(first.number.split("-")[1])) - (second.queueOrder ?? Number(second.number.split("-")[1])));
                const announced = doctorTokens
                  .filter((token) => token.status === "Announced")
                  .sort((first, second) => (second.announcedAt || 0) - (first.announcedAt || 0))[0];
                const checkedIn = doctorTokens.find((token) => token.status === "Checked in");
                const nextWaiting = doctorTokens.find((token) => token.status === "Waiting");
                const current = announced || checkedIn || nextWaiting;
                const patient = PATIENTS.find((record) => record.id === current?.patientId);
                const isAnnouncing = Boolean(announced);

                return (
                  <article key={doctor.id} className={`relative flex min-h-[250px] flex-col p-5 transition-colors sm:p-6 ${isAnnouncing ? "bg-emerald-50 ring-1 ring-inset ring-emerald-400" : "bg-white"}`}>
                    <div className="flex items-start gap-3">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${isAnnouncing ? "border-emerald-200 bg-emerald-100 text-emerald-900" : "border-clinical-100 bg-clinical-50 text-clinical-700"}`}>
                        {doctor.name.split(" ").slice(1).map((part) => part[0]).join("")}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-base font-bold text-clinical-950">{doctor.name}</h4>
                        <p className="mt-1 text-xs font-semibold text-clinical-700">{doctor.specialty}</p>
                        <p className="mt-1 text-[11px] text-ink-600">{doctor.degree} <span className="px-1">·</span>{doctor.experience}</p>
                      </div>
                      <div className="shrink-0 rounded-md border border-clinical-100 bg-clinical-50 px-2.5 py-1.5 text-right">
                        <span className="block text-[9px] font-bold uppercase tracking-[0.1em] text-ink-600">Room</span>
                        <span className="font-mono text-sm font-bold text-clinical-950">{doctor.room}</span>
                      </div>
                    </div>

                    <div className="mt-auto pt-6">
                      <div className="mb-2 flex min-h-6 items-center">
                        {isAnnouncing ? <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-200 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-emerald-950"><span className="announce-wave" aria-hidden="true"><span /><span /><span /><span /></span> Now announcing</span>
                          : checkedIn ? <span className="rounded-full bg-sky-100 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-sky-800">In consultation</span>
                            : current ? <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-amber-900">Up next</span>
                              : <span className="rounded-full bg-clinical-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-ink-600">Stand by</span>}
                      </div>
                      <div className="flex items-end justify-between gap-3 border-t border-clinical-100 pt-3">
                        <div className="min-w-0">
                          <p className={`font-mono text-4xl font-bold leading-none tracking-wide sm:text-5xl ${isAnnouncing ? "text-emerald-800" : "text-clinical-950"}`}>{current?.number || "--"}</p>
                          <p className="mt-2 truncate text-sm font-semibold text-ink-900">{patient?.name || "No patient in queue"}</p>
                        </div>
                        {isAnnouncing && <span className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800"><Megaphone size={18} /></span>}
                      </div>
                      <p className="mt-2 text-[10px] text-ink-600">{doctorTokens.filter((token) => token.status === "Waiting").length} waiting in this room</p>
                    </div>
                  </article>
                );
              })}
            </div>

            <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-clinical-100 bg-clinical-50 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-600 sm:px-7">
              <span>Outpatient patient display</span>
              <span className="flex items-center gap-1.5"><Clock3 size={12} /> Queue updates live</span>
            </footer>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-l-[3px] border-clinical-500 bg-white px-4 py-3 shadow-sm">
            <p className="text-sm text-ink-600">Announced patients are highlighted on the board by doctor and room.</p>
            <button onClick={() => changeView("/waiting-pool")} className="inline-flex items-center gap-1.5 text-xs font-bold text-clinical-700 hover:text-clinical-950">Manage queue <ArrowRight size={14} /></button>
          </div>
        </section>}
      </main>
      {selectedView === "tv" && <style>{`
        .announce-wave {
          display: inline-flex;
          height: 14px;
          align-items: center;
          gap: 2px;
        }
        .announce-wave > span {
          width: 2px;
          height: 5px;
          border-radius: 999px;
          background: currentColor;
          animation: announce-wave-motion 680ms ease-in-out infinite;
        }
        .announce-wave > span:nth-child(2) { animation-delay: 110ms; }
        .announce-wave > span:nth-child(3) { animation-delay: 220ms; }
        .announce-wave > span:nth-child(4) { animation-delay: 330ms; }
        @keyframes announce-wave-motion {
          0%, 100% { height: 4px; }
          50% { height: 13px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .announce-wave > span { animation: none; height: 8px; }
        }
        .announcer-call-board:fullscreen {
          width: 100vw;
          height: 100vh;
          max-width: none;
          overflow: auto;
          border: 0;
          display: flex;
          flex-direction: column;
        }
        .announcer-call-board:fullscreen > .announcer-room-grid {
          flex: 1;
          grid-auto-rows: minmax(250px, 1fr);
          align-content: stretch;
        }
        @media (min-width: 1280px) {
          .announcer-call-board:fullscreen > .announcer-room-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
      `}</style>}
      {notice && selectedView === "generator" && <div className="fixed inset-0 z-50 flex items-center justify-center bg-clinical-950/35 p-4 backdrop-blur-[2px]">
        <section role="dialog" aria-modal="true" aria-labelledby="token-success-title" className="w-full max-w-sm border border-clinical-100 bg-white p-6 shadow-2xl animate-fade-in-up">
          <div className="flex justify-end">
            <button type="button" onClick={() => setNotice("")} aria-label="Close token confirmation" className="flex h-8 w-8 items-center justify-center rounded-md text-ink-600 transition hover:bg-clinical-50 hover:text-clinical-900"><X size={17} /></button>
          </div>
          <h2 id="token-success-title" className="mt-1 font-display text-xl font-bold text-clinical-950">Token generated</h2>
          <div role="status" className="mt-4">
            {generatedTokenNumber && <div className="border border-clinical-900 bg-clinical-950 px-4 py-5 text-center text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-200">Your token number</p>
              <p className="mt-2 break-words font-mono text-4xl font-bold leading-none tracking-wide sm:text-5xl">{generatedTokenNumber}</p>
            </div>}
            <p className="mt-3 text-center text-sm leading-6 text-ink-600">{generatedTokenDetails}</p>
            <span className="sr-only">{notice}</span>
          </div>
          <button type="button" autoFocus onClick={() => setNotice("")} className="mt-6 inline-flex min-h-10 w-full items-center justify-center rounded-md bg-clinical-700 px-4 text-sm font-semibold text-white transition hover:bg-clinical-900">Done</button>
        </section>
      </div>}
      {selectedView === "tv" && <style>{`@media (min-width: 1280px) { .tv-mode main { max-width: 1800px; } .tv-mode article { min-height: 260px; } }`}</style>}
    </div>
  );
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
    return;
  }
}