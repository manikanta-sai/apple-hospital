import { Suspense, lazy, useEffect, useState } from "react";
import { ArrowRight, BarChart3, Bot, FileText, Headphones, Megaphone, Mic, Ticket } from "lucide-react";
import ErrorBoundary from "./components/ErrorBoundary";
import InsightsDashboard from "./components/InsightsDashboard";
import TokenDesk from "./components/TokenDesk";
import SpeechToText from "./components/SpeechToText";

const ChatWidget = lazy(() => import("./components/ChatWidget"));

const DEPARTMENTS_WITH_TRIGGERS = ["cardiology", "orthopedics", "pediatrics"];

const TRY_MESSAGES = [
  { text: "Book a cardiologist", result: "Shows the doctor-list cards" },
  { text: "I need to see a doctor", result: "Shows the doctor-list cards" },
  { text: "heart checkup", result: "Shows the doctor-list cards" },
  { text: "I want to see Dr. Mani", result: "Shows the fallback/alternates cards" },
  { text: 'Any message containing "mani"', result: "Shows the fallback/alternates cards" },
];

const PRODUCTS = [
  {
    name: "Chatbot",
    description: "Answer patient questions, find doctors, and help book appointments.",
    icon: Bot,
    available: true,
    accent: "bg-clinical-100 text-clinical-700",
  },
  {
    name: "Insights",
    description: "Track patient trends, operational metrics, and care performance at a glance.",
    icon: BarChart3,
    available: true,
    href: "/insights",
    accent: "bg-violet-100 text-violet-800",
  },
  {
    name: "Speech to Text",
    description: "Turn spoken conversations into editable text.",
    icon: Mic,
    available: true,
    href: "/speech-to-text",
    accent: "bg-sky-100 text-sky-800",
  },
  {
    name: "Audio File to Text",
    description: "Transcribe audio recordings into searchable text.",
    icon: Headphones,
    available: false,
    accent: "bg-amber-100 text-amber-800",
  },
  {
    name: "PDF to Form Auto Fill",
    description: "Extract document details and use them to fill forms.",
    icon: FileText,
    available: false,
    accent: "bg-rose-100 text-rose-800",
  },
  {
    name: "OP Token Generator",
    description: "Generate and manage outpatient queue tokens.",
    icon: Ticket,
    available: true,
    href: "/tokens",
    accent: "bg-clinical-100 text-clinical-700",
  },
  {
    name: "Token Number Announcer",
    description: "Announce token numbers to keep the waiting room informed.",
    icon: Megaphone,
    available: true,
    href: "/announcer",
    accent: "bg-orange-100 text-orange-800",
  },
];

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

  useEffect(() => {
    const syncRoute = () => {
      const validPaths = ["/", "/chatbot", "/insights", "/speech-to-text", "/tokens", "/waiting-pool", "/announcer"];
      const path = validPaths.includes(window.location.pathname) ? window.location.pathname : "/";
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
  const showTokenDesk = ["/tokens", "/waiting-pool", "/announcer"].includes(currentPath);

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

  if (showSpeechToText) {
    return <SpeechToText navigateTo={navigateTo} />;
  }

  if (showInsights) {
    return <InsightsDashboard navigateTo={navigateTo} />;
  }

  if (!showChatbot) {
    return (
      <div className="min-h-screen bg-clinical-50 font-sans text-ink-900">
        <header className="border-b border-clinical-100 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
            <div>
              <h1 className="font-display text-lg font-bold text-clinical-900">
                Get Well Multispecialty Hospital
              </h1>
              <p className="mt-1 text-xs text-ink-600">
                Digital tools for patient support and smoother hospital workflows.
              </p>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
          <section aria-label="Products" className="mt-9">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h3 className="font-display text-sm font-bold text-clinical-950">Product suite</h3>
              <p className="text-xs text-ink-600">5 available · 2 in development</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PRODUCTS.map((product) => {
                const ProductIcon = product.icon;
                const Tile = product.available ? "a" : "article";

                return (
                  <Tile
                    key={product.name}
                    href={product.available ? (product.href || "/chatbot") : undefined}
                    onClick={product.available ? (event) => {
                      event.preventDefault();
                      navigateTo(product.href || "/chatbot");
                    } : undefined}
                    className={`group flex min-h-52 w-full flex-col rounded-lg border bg-white p-5 text-left shadow-sm transition duration-200 ${
                      product.available
                        ? "cursor-pointer border-clinical-100 hover:-translate-y-1 hover:border-clinical-500 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clinical-500 focus-visible:ring-offset-2"
                        : "border-clinical-100/80"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className={`flex h-11 w-11 items-center justify-center rounded-lg ${product.accent}`}>
                        <ProductIcon size={22} strokeWidth={1.8} aria-hidden="true" />
                      </span>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        product.available
                          ? "bg-emerald-50 text-emerald-800"
                          : "bg-clinical-50 text-ink-600"
                      }`}>
                        {product.available ? "Available" : "Coming soon"}
                      </span>
                    </div>
                    <h4 className="mt-5 font-display text-base font-bold text-clinical-950">
                      {product.name}
                    </h4>
                    <p className="mt-2 text-sm leading-5 text-ink-600">{product.description}</p>
                    {product.available && (
                      <span className="mt-auto flex items-center gap-1.5 pt-4 text-xs font-semibold text-clinical-700">
                        Open product
                        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </span>
                    )}
                  </Tile>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-clinical-50">
      <header className="border-b border-clinical-100 bg-white px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-lg font-bold text-clinical-900">
              Get Well Multispecialty Hospital
            </h1>
            <p className="text-sm text-ink-600">Patient Portal</p>
          </div>
            <a
              href="/"
              onClick={(event) => {
                event.preventDefault();
                navigateTo("/");
              }}
            className="rounded-md border border-clinical-100 px-3 py-2 text-xs font-semibold text-clinical-700 transition-colors hover:bg-clinical-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clinical-500"
          >
            Back to dashboard
            </a>
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
