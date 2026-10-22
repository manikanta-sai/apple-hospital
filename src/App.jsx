import { Suspense, lazy, useEffect, useState } from "react";
import { ArrowRight, BarChart3, Bot, FileText, Headphones, Link2, Megaphone, Mic, Search, Ticket, Video, Stethoscope } from "lucide-react";
import ErrorBoundary from "./components/ErrorBoundary";
import InsightsDashboard from "./components/InsightsDashboard";
import TokenDesk from "./components/TokenDesk";
import SpeechToText from "./components/SpeechToText";
import HealthcareUrlGenerator from "./components/url-generator/HealthcareUrlGenerator";
import OpdQueueScreen from "./components/queue/OpdQueueScreen";
import OpdConsultationWorkspace from "./components/consultation/OpdConsultationWorkspace";

const ChatWidget = lazy(() => import("./components/ChatWidget"));

const DEPARTMENTS_WITH_TRIGGERS = ["cardiology", "orthopedics", "pediatrics"];

const TRY_MESSAGES = [
  { text: "Book a cardiologist", result: "Shows the doctor-list cards" },
  { text: "I need to see a doctor", result: "Shows the doctor-list cards" },
  { text: "heart checkup", result: "Shows the doctor-list cards" },
  { text: "I want to see Dr. Mani", result: "Shows the fallback/alternates cards" },
  { text: 'Any message containing "mani"', result: "Shows the fallback/alternates cards" },
];

/** Per-product design tokens — white/light glass UI */
const PRODUCTS = [
  {
    name: "OPD Consultation & Queue",
    description: "Multi-lane triage queue, live doctor desk spotlight, and digital prescriptions.",
    icon: Stethoscope,
    available: true,
    featured: true,
    href: "/opd",
    glow: "rgba(13,148,136,0.08)",
    iconBg: "rgba(13,148,136,0.12)",
    iconBorder: "rgba(13,148,136,0.25)",
    iconColor: "#0d9488",
    tagColor: "rgba(13,148,136,0.08)",
    tagText: "#0f766e",
    linkColor: "#0d9488",
    tags: ["Live Queue", "Multi-Lane Triage", "Rx Desk"],
  },
  {
    name: "Chatbot",
    description: "Answer patient questions, find doctors, and help book appointments.",
    icon: Bot,
    available: true,
    featured: true,
    href: "/chatbot",
    glow: "rgba(99,102,241,0.08)",
    iconBg: "rgba(99,102,241,0.10)",
    iconBorder: "rgba(99,102,241,0.20)",
    iconColor: "#6366f1",
    tagColor: "rgba(99,102,241,0.08)",
    tagText: "#4f46e5",
    linkColor: "#6366f1",
    tags: ["NLP Powered", "Multi-lingual", "Slot Booking"],
  },
  {
    name: "Call Center",
    description: "Review call recordings, monitor agent performance, and find coaching opportunities.",
    icon: BarChart3,
    available: true,
    href: "/insights",
    glow: "rgba(139,92,246,0.07)",
    iconBg: "rgba(139,92,246,0.10)",
    iconBorder: "rgba(139,92,246,0.20)",
    iconColor: "#7c3aed",
    tagColor: "rgba(139,92,246,0.08)",
    tagText: "#6d28d9",
    linkColor: "#7c3aed",
    tags: ["Live Monitoring", "Recordings"],
  },
  {
    name: "Speech to Text",
    description: "Turn spoken conversations into editable text.",
    icon: Mic,
    available: true,
    href: "/speech-to-text",
    glow: "rgba(14,165,233,0.07)",
    iconBg: "rgba(14,165,233,0.10)",
    iconBorder: "rgba(14,165,233,0.20)",
    iconColor: "#0284c7",
    tagColor: "rgba(14,165,233,0.08)",
    tagText: "#0369a1",
    linkColor: "#0284c7",
    tags: ["Real-time", "Multi-lang"],
  },
  {
    name: "OP Token Generator",
    description: "Generate and manage outpatient queue tokens with smart waiting-room display.",
    icon: Ticket,
    available: true,
    href: "/tokens",
    glow: "rgba(13,148,136,0.07)",
    iconBg: "rgba(13,148,136,0.10)",
    iconBorder: "rgba(13,148,136,0.20)",
    iconColor: "#0d9488",
    tagColor: "rgba(13,148,136,0.08)",
    tagText: "#0f766e",
    linkColor: "#0d9488",
    tags: ["Queue Mgmt", "Display Board"],
  },
  {
    name: "Token Number Announcer",
    description: "Announce token numbers via audio and display to keep waiting rooms informed.",
    icon: Megaphone,
    available: true,
    href: "/announcer",
    glow: "rgba(234,88,12,0.07)",
    iconBg: "rgba(234,88,12,0.10)",
    iconBorder: "rgba(234,88,12,0.20)",
    iconColor: "#ea580c",
    tagColor: "rgba(234,88,12,0.08)",
    tagText: "#c2410c",
    linkColor: "#ea580c",
    tags: ["Audio TTS", "Live Display"],
  },
  {
    name: "URL Generator",
    description: "Create smart links for lab reports, telehealth sessions, feedback forms, and surveys.",
    icon: Link2,
    available: true,
    href: "/url-generator",
    glow: "rgba(5,150,105,0.07)",
    iconBg: "rgba(5,150,105,0.10)",
    iconBorder: "rgba(5,150,105,0.20)",
    iconColor: "#059669",
    tagColor: "rgba(5,150,105,0.08)",
    tagText: "#047857",
    linkColor: "#059669",
    tags: ["Short URLs", "QR Codes"],
  },
  {
    name: "Audio File to Text",
    description: "Transcribe audio recordings into searchable, structured clinical text.",
    icon: Headphones,
    available: false,
    glow: "rgba(217,119,6,0.05)",
    iconBg: "rgba(217,119,6,0.08)",
    iconBorder: "rgba(217,119,6,0.15)",
    iconColor: "#b45309",
    tags: ["Batch Upload", "Export"],
  },
  {
    name: "Video Library",
    description: "Browse helpful hospital and patient education videos in a curated library.",
    icon: Video,
    available: false,
    glow: "rgba(99,102,241,0.05)",
    iconBg: "rgba(99,102,241,0.08)",
    iconBorder: "rgba(99,102,241,0.15)",
    iconColor: "#4f46e5",
    tags: ["Curated", "Searchable"],
  },
  {
    name: "PDF to Form Auto Fill",
    description: "Extract document details and use AI to auto-populate digital forms.",
    icon: FileText,
    available: false,
    glow: "rgba(225,29,72,0.05)",
    iconBg: "rgba(225,29,72,0.08)",
    iconBorder: "rgba(225,29,72,0.15)",
    iconColor: "#be123c",
    tags: ["AI Extract", "Smart Fill"],
  },
];

// ─── Shared style helpers ────────────────────────────────────────────────────

const CARD_BASE = {
  background: "rgba(255,255,255,0.72)",
  border: "1px solid rgba(0,0,0,0.07)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  borderRadius: 18,
  boxShadow: "0 2px 16px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
  transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
};

const CARD_HOVER = {
  background: "rgba(255,255,255,0.96)",
  border: "1px solid rgba(0,0,0,0.10)",
  transform: "translateY(-3px)",
  boxShadow: "0 12px 40px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)",
};

/**
 * App.jsx
 * -------
 * Stand-in host page so the widget can be previewed standalone. In a
 * real integration, drop <ChatWidget tenantId="..." /> once near the
 * root of your app (e.g. in a layout component) so it persists across
 * route changes - its own internal state handles the rest.
 */
export default function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);
  const [activeDepartment, setActiveDepartment] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const syncRoute = () => {
      const validPaths = ["/", "/chatbot", "/insights", "/speech-to-text", "/tokens", "/waiting-pool", "/announcer", "/url-generator", "/url-shortener", "/opd", "/opd-queue", "/opd-consultation"];
      const isDynamic =
        window.location.pathname.startsWith("/opd-consultation") ||
        window.location.pathname.startsWith("/s/") ||
        window.location.pathname.startsWith("/reports/") ||
        window.location.pathname.startsWith("/meetings/") ||
        window.location.pathname.startsWith("/feedback") ||
        window.location.pathname.startsWith("/lab-reports/") ||
        window.location.pathname.startsWith("/telehealth/") ||
        window.location.pathname.startsWith("/survey/");
      const path = isDynamic || validPaths.includes(window.location.pathname) ? window.location.pathname : "/";
      if (path !== window.location.pathname) {
        window.history.replaceState({}, "", path);
      }
      setCurrentPath(path);
    };

    window.addEventListener("popstate", syncRoute);
    syncRoute();
    return () => window.removeEventListener("popstate", syncRoute);
  }, []);

  const navigateTo = (path) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, "", path);
    }
    setCurrentPath(path);
  };

  const showChatbot = currentPath === "/chatbot";
  const showInsights = currentPath === "/insights";
  const showSpeechToText = currentPath === "/speech-to-text";
  const showOpd = currentPath === "/opd" || currentPath === "/opd-queue";
  const showOpdConsultation = currentPath.startsWith("/opd-consultation");
  const showTokenDesk = ["/tokens", "/waiting-pool", "/announcer"].includes(currentPath);
  const showUrlGenerator =
    currentPath.startsWith("/url-generator") ||
    currentPath === "/url-shortener" ||
    currentPath.startsWith("/s/") ||
    currentPath.startsWith("/reports/") ||
    currentPath.startsWith("/meetings/") ||
    currentPath.startsWith("/feedback") ||
    currentPath.startsWith("/lab-reports/") ||
    currentPath.startsWith("/telehealth/") ||
    currentPath.startsWith("/survey/");

  // Simulates what a real department page would do: mark itself with
  // data-hospital-department so useBehavioralTrigger can detect it.
  // useBehavioralTrigger's MutationObserver picks up the attribute
  // change automatically - no page reload needed.
  const simulateDepartmentPage = (dept) => {
    document.body.setAttribute("data-hospital-demo-trigger", "true");
    document.body.setAttribute("data-hospital-department", dept);
    setActiveDepartment(dept);
    window.dispatchEvent(new CustomEvent("hospital-demo-department-selected", { detail: { department: dept } }));
  };

  const clearDepartmentPage = () => {
    document.body.removeAttribute("data-hospital-department");
    document.body.removeAttribute("data-hospital-demo-trigger");
    setActiveDepartment(null);
  };

  if (showTokenDesk) {
    return <TokenDesk currentPath={currentPath} navigateTo={navigateTo} />;
  }

  if (showOpdConsultation) {
    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get("patientId") || "";
    return (
      <OpdConsultationWorkspace
        patientId={patientId}
        onBackToQueue={() => navigateTo("/opd")}
      />
    );
  }

  if (showOpd) {
    return (
      <OpdQueueScreen
        onSelectPatient={(patientId) => {
          navigateTo(`/opd-consultation?patientId=${patientId}`);
        }}
        onNavigateHome={() => navigateTo("/")}
      />
    );
  }

  if (showSpeechToText) {
    return <SpeechToText navigateTo={navigateTo} />;
  }

  if (showInsights) {
    return <InsightsDashboard navigateTo={navigateTo} />;
  }

  if (showUrlGenerator) {
    const generatorSubPath = currentPath.startsWith("/url-generator")
      ? currentPath.replace(/^\/url-generator/, "") || "/"
      : currentPath === "/url-shortener"
      ? "/"
      : currentPath;
    return <HealthcareUrlGenerator navigateTo={navigateTo} initialPath={generatorSubPath} />;
  }

  // ── Filtered products ──
  const q = searchQuery.toLowerCase().trim();
  const filteredGrid = q
    ? PRODUCTS.filter((p) => p.name.toLowerCase().includes(q) || p.tags?.some((t) => t.toLowerCase().includes(q)))
    : PRODUCTS;

  // ── Product Suite landing page ──────────────────────────────────────────────
  if (!showChatbot) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(145deg, #f0f4ff 0%, #faf5ff 40%, #f0fdf9 100%)",
          color: "#0f172a",
          fontFamily: "'Inter', sans-serif",
          position: "relative",
          overflowX: "hidden",
        }}
      >
        {/* ── Background ambient orbs ── */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          <div style={{ position: "absolute", width: 700, height: 700, top: -250, left: -150, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.10) 0%,transparent 65%)", filter: "blur(60px)" }} />
          <div style={{ position: "absolute", width: 600, height: 600, bottom: -150, right: -150, borderRadius: "50%", background: "radial-gradient(circle,rgba(20,184,166,0.09) 0%,transparent 65%)", filter: "blur(60px)" }} />
          <div style={{ position: "absolute", width: 500, height: 500, top: "35%", left: "45%", borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.06) 0%,transparent 65%)", filter: "blur(60px)" }} />
        </div>

        {/* ── Header ── */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            background: "rgba(255,255,255,0.80)",
            borderBottom: "1px solid rgba(0,0,0,0.07)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <div
            style={{
              padding: "0 24px",
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 4px 12px rgba(99,102,241,0.30)",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <div>
                <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 15, fontWeight: 700, color: "#0f172a", lineHeight: 1.2 }}>
                  Apple Hospital
                </p>
                <p style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1 }}>Digital Health Suite</p>
              </div>
            </div>

            {/* Search bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                borderRadius: 10,
                background: "rgba(0,0,0,0.04)",
                border: "1px solid rgba(0,0,0,0.08)",
                transition: "all 0.2s",
              }}
            >
              <Search size={14} color="#94a3b8" aria-hidden="true" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products…"
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  fontSize: 13,
                  color: "#0f172a",
                  width: 160,
                }}
              />
            </div>
          </div>
        </header>

        {/* ── Main ── */}
        <main style={{ padding: "44px 24px 80px", position: "relative", zIndex: 1 }}>

          {/* Hero heading + stats */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: "#6366f1", textTransform: "uppercase", marginBottom: 8 }}>
                  Product Suite · v2.0
                </p>
                <h1
                  style={{
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                    fontSize: "clamp(28px,4vw,38px)",
                    fontWeight: 800,
                    lineHeight: 1.1,
                    color: "#0f172a",
                  }}
                >
                  Your Digital Health{" "}
                  <span
                    style={{
                      background: "linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Workspace
                  </span>
                </h1>
                <p style={{ marginTop: 10, fontSize: 15, color: "#64748b", maxWidth: 480, lineHeight: 1.6 }}>
                  All-in-one AI tools for patient engagement, clinical workflows, and hospital operations.
                </p>
              </div>

              {/* Stats strip */}
              <div
                style={{
                  display: "flex",
                  gap: 28,
                  flexWrap: "wrap",
                  background: "rgba(255,255,255,0.72)",
                  border: "1px solid rgba(0,0,0,0.07)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  borderRadius: 16,
                  padding: "16px 24px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 26, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>
                    {PRODUCTS.filter((p) => p.available).length}
                  </p>
                  <p style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Products Live</p>
                </div>
                <div style={{ width: 1, background: "rgba(0,0,0,0.07)" }} />
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 26, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>
                    {PRODUCTS.filter((p) => !p.available).length}
                  </p>
                  <p style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>In Development</p>
                </div>
                <div style={{ width: 1, background: "rgba(0,0,0,0.07)" }} />
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 26, fontWeight: 800, color: "#059669", lineHeight: 1 }}>99.9%</p>
                  <p style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Uptime</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Product grid ── */}
          {filteredGrid.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
                gap: 16,
              }}
            >
              {filteredGrid.map((product) => (
                <ProductCard
                  key={product.name}
                  product={product}
                  isHovered={hoveredCard === product.name}
                  onMouseEnter={() => setHoveredCard(product.name)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={product.available ? () => navigateTo(product.href) : undefined}
                />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: "rgba(0,0,0,0.04)",
                  border: "1px solid rgba(0,0,0,0.07)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <Search size={24} color="#94a3b8" />
              </div>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#334155" }}>No products found</p>
              <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 6 }}>Try a different search term</p>
            </div>
          )}
        </main>

      </div>
    );
  }

  // ── Chatbot demo page ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-clinical-50">
      <header className="border-b border-clinical-100 bg-white px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <a
              href="/"
              onClick={(event) => {
                event.preventDefault();
                navigateTo("/");
              }}
              className="inline-flex items-center gap-1.5 rounded-md border border-clinical-100 px-3 py-2 text-xs font-semibold text-clinical-700 transition-colors hover:bg-clinical-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clinical-500"
            >
              <ArrowRight size={14} className="rotate-180" />
              Back to dashboard
            </a>
            <div className="h-5 w-px bg-clinical-100" />
            <div>
              <h1 className="font-display text-base font-bold text-clinical-900 leading-tight">
                Apple Multispecialty Hospital
              </h1>
              <p className="text-xs text-ink-600">Patient Portal</p>
            </div>
          </div>
          <span className="rounded-full bg-clinical-50 border border-clinical-100 px-3 py-1 text-xs font-medium text-clinical-700">
            AI Patient Service
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-6 py-10 text-ink-600">
        <div className="mt-8 rounded-2xl border border-clinical-100 bg-white p-5 shadow-sm">
          <h2 className="font-display text-sm font-bold text-clinical-900">
            Demo: context-aware trigger
          </h2>
          <p className="mt-1 text-xs text-ink-600">
            Simulates landing on a real department page (sets{" "}
            <code className="rounded bg-clinical-50 px-1 py-0.5">data-hospital-department</code> on
            &lt;body&gt;). Select a department to show its contextual suggestion above the launcher.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {DEPARTMENTS_WITH_TRIGGERS.map((dept) => (
              <button
                key={dept}
                onClick={() => simulateDepartmentPage(dept)}
                className={[
                  "rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                  activeDepartment === dept
                    ? "border-clinical-700 bg-clinical-700 text-white"
                    : "border-clinical-100 bg-white text-clinical-700 hover:bg-clinical-50",
                ].join(" ")}
              >
                {dept}
              </button>
            ))}
            <button
              onClick={clearDepartmentPage}
              className="rounded-full border border-clinical-100 bg-white px-3 py-1.5 text-xs font-medium text-ink-600 hover:bg-clinical-50"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-clinical-100 bg-white p-5 shadow-sm">
          <h2 className="font-display text-sm font-bold text-clinical-900">
            Try these messages in mock mode
          </h2>
          <p className="mt-1 text-xs text-ink-600">
            The quick-link chips (Timings, Enquiry, Address, Request Live
            Agent) work out of the box. To see the rich doctor cards and the
            full booking flow, either tap{" "}
            <span className="font-semibold text-clinical-700">Book Appointment</span>,
            or type one of these directly into the chat:
          </p>
          <ul className="mt-3 divide-y divide-clinical-100">
            {TRY_MESSAGES.map((item) => (
              <li key={item.text} className="flex items-center justify-between gap-3 py-2 text-xs">
                <code className="rounded-md bg-clinical-50 px-2 py-1 text-clinical-700">
                  {item.text}
                </code>
                <span className="text-right text-ink-600">{item.result}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>

      {/* tenantId identifies which hospital/branch this widget instance
          belongs to - forwarded to every API call for multi-tenant
          backend routing. */}
      <ErrorBoundary>
        <Suspense fallback={null}>
          <ChatWidget tenantId="sunrise-hospital-main" />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Animated pulse dot for "Live" badge */
function PulseDot() {
  return (
    <>
      <style>{`@keyframes pulseDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.7;transform:scale(1.35)}}`}</style>
      <span
        style={{
          display: "inline-block",
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#22c55e",
          animation: "pulseDot 2s ease-in-out infinite",
          flexShrink: 0,
        }}
      />
    </>
  );
}

/** Featured hero card — used for the Chatbot */
function FeaturedCard({ product, isHovered, onMouseEnter, onMouseLeave, onClick }) {
  const Icon = product.icon;

  return (
    <article
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        ...CARD_BASE,
        ...(isHovered ? CARD_HOVER : {}),
        borderRadius: 20,
        padding: "28px 32px",
        marginBottom: 24,
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle accent gradient strip on top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: "linear-gradient(90deg,#6366f1,#8b5cf6,#a855f7)",
          borderRadius: "20px 20px 0 0",
        }}
      />

      {/* Soft glow behind the card */}
      <div
        style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: `radial-gradient(circle,${product.glow},transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
          {/* Icon */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: product.iconBg,
              border: `1px solid ${product.iconBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon size={26} color={product.iconColor} strokeWidth={1.8} aria-hidden="true" />
          </div>

          <div>
            {/* Badges row */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#6366f1",
                  background: "rgba(99,102,241,0.08)",
                  padding: "2px 8px",
                  borderRadius: 5,
                }}
              >
                Featured
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: 999,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "rgba(34,197,94,0.10)",
                  color: "#15803d",
                  border: "1px solid rgba(34,197,94,0.25)",
                }}
              >
                <PulseDot /> Live
              </span>
            </div>

            <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, fontWeight: 800, color: "#0f172a" }}>
              AI Patient Chatbot
            </h2>
            <p style={{ marginTop: 6, fontSize: 14, color: "#64748b", maxWidth: 500, lineHeight: 1.6 }}>
              {product.description}
            </p>

            {/* Capability tags */}
            <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: 12,
                    padding: "4px 11px",
                    borderRadius: 7,
                    background: product.tagColor,
                    color: product.tagText,
                    fontWeight: 500,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CTA button */}
        <button
          style={{
            padding: "12px 24px",
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            border: "none",
            borderRadius: 12,
            color: "white",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            whiteSpace: "nowrap",
            boxShadow: isHovered
              ? "0 8px 32px rgba(99,102,241,0.45)"
              : "0 4px 16px rgba(99,102,241,0.28)",
            transition: "box-shadow 0.25s",
            alignSelf: "flex-start",
          }}
        >
          Open Chatbot
          <ArrowRight
            size={14}
            aria-hidden="true"
            style={{
              transition: "transform 0.2s",
              transform: isHovered ? "translateX(3px)" : "translateX(0)",
            }}
          />
        </button>
      </div>
    </article>
  );
}

/** Standard product card — available or coming-soon */
function ProductCard({ product, isHovered, onMouseEnter, onMouseLeave, onClick }) {
  const Icon = product.icon;
  const unavailable = !product.available;

  return (
    <article
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        ...CARD_BASE,
        ...(isHovered && !unavailable ? CARD_HOVER : {}),
        padding: 24,
        cursor: unavailable ? "not-allowed" : "pointer",
        position: "relative",
        overflow: "hidden",
        opacity: unavailable ? 0.55 : 1,
        pointerEvents: unavailable ? "none" : "auto",
      }}
    >
      {/* Per-card top accent line */}
      {!unavailable && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg,${product.iconColor},transparent)`,
            borderRadius: "18px 18px 0 0",
            opacity: isHovered ? 1 : 0.5,
            transition: "opacity 0.25s",
          }}
        />
      )}

      {/* Soft ambient glow */}
      <div
        style={{
          position: "absolute",
          top: -50,
          right: -50,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: `radial-gradient(circle,${product.glow},transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Icon + status row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 13,
            background: product.iconBg,
            border: `1px solid ${product.iconBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={22} color={product.iconColor} strokeWidth={1.8} aria-hidden="true" />
        </div>

        {product.available ? (
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: "3px 10px",
              borderRadius: 999,
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              background: "rgba(34,197,94,0.10)",
              color: "#15803d",
              border: "1px solid rgba(34,197,94,0.22)",
            }}
          >
            <PulseDot /> Live
          </span>
        ) : (
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              padding: "3px 10px",
              borderRadius: 999,
              background: "rgba(0,0,0,0.05)",
              color: "#94a3b8",
              border: "1px solid rgba(0,0,0,0.07)",
            }}
          >
            Coming Soon
          </span>
        )}
      </div>

      {/* Name + description */}
      <h3
        style={{
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          fontSize: 16,
          fontWeight: 700,
          color: unavailable ? "#94a3b8" : "#0f172a",
          marginBottom: 6,
        }}
      >
        {product.name}
      </h3>
      <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, marginBottom: 16 }}>
        {product.description}
      </p>

      {/* Capability tags */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: product.available ? 16 : 0 }}>
        {product.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontSize: 11,
              fontWeight: 500,
              padding: "3px 9px",
              borderRadius: 6,
              background: unavailable ? "rgba(0,0,0,0.04)" : product.tagColor,
              color: unavailable ? "#94a3b8" : product.tagText,
              border: unavailable ? "1px solid rgba(0,0,0,0.06)" : "none",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* "Open product" link */}
      {product.available && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            color: product.linkColor,
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Open product
          <ArrowRight
            size={13}
            aria-hidden="true"
            style={{
              transition: "transform 0.2s",
              transform: isHovered ? "translateX(3px)" : "translateX(0)",
            }}
          />
        </div>
      )}
    </article>
  );
}
