import { useState } from "react";
import ChatWidget from "./components/ChatWidget";

const DEPARTMENTS_WITH_TRIGGERS = ["cardiology", "orthopedics", "pediatrics"];

const TRY_MESSAGES = [
  { text: "Book a cardiologist", result: "Shows the doctor-list cards" },
  { text: "I need to see a doctor", result: "Shows the doctor-list cards" },
  { text: "heart checkup", result: "Shows the doctor-list cards" },
  { text: "I want to see Dr. Mani", result: "Shows the fallback/alternates cards" },
  { text: 'Any message containing "mani"', result: "Shows the fallback/alternates cards" },
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
  const [activeDepartment, setActiveDepartment] = useState(null);

  // Simulates what a real department page would do: mark itself with
  // data-hospital-department so useBehavioralTrigger can detect it.
  // useBehavioralTrigger's MutationObserver picks up the attribute
  // change automatically - no page reload needed.
  const simulateDepartmentPage = (dept) => {
    document.body.setAttribute("data-hospital-department", dept);
    setActiveDepartment(dept);
  };

  const clearDepartmentPage = () => {
    document.body.removeAttribute("data-hospital-department");
    setActiveDepartment(null);
  };

  return (
    <div className="min-h-screen bg-clinical-50">
      <header className="border-b border-clinical-100 bg-white px-6 py-4">
        <h1 className="font-display text-lg font-bold text-clinical-900">
          Sunrise Multispecialty Hospital
        </h1>
        <p className="text-sm text-ink-600">Patient Portal</p>
      </header>

      <main className="mx-auto max-w-xl px-6 py-10 text-ink-600">
        <p className="text-sm">
          This is a placeholder host page. The chat launcher is fixed to the
          bottom-right corner — try it on a narrow viewport to see the
          full-screen mobile layout, and refresh the page to confirm the
          session and open/minimized state persist.
        </p>

        <div className="mt-8 rounded-2xl border border-clinical-100 bg-white p-5 shadow-sm">
          <h2 className="font-display text-sm font-bold text-clinical-900">
            Demo: context-aware trigger
          </h2>
          <p className="mt-1 text-xs text-ink-600">
            Simulates landing on a real department page (sets{" "}
            <code className="rounded bg-clinical-50 px-1 py-0.5">data-hospital-department</code> on
            &lt;body&gt;). Stay on one for 30s without dismissing and a proactive bubble appears
            above the launcher.
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
      <ChatWidget tenantId="sunrise-hospital-main" />
    </div>
  );
}
