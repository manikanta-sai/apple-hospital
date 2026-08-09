import ChatWidget from "./components/ChatWidget";

const TRY_MESSAGES = [
  { text: "Book a cardiologist", result: "Shows the doctor-list cards" },
  { text: "I need to see all doctors", result: "Shows the doctor-list cards" },
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
  return (
    <div className="min-h-screen bg-clinical-50">
      <header className="border-b border-clinical-100 bg-white px-6 py-4">
        <h1 className="font-display text-lg font-bold text-clinical-900">
          Mani Multispecialty Hospital
        </h1>
        <p className="text-sm text-ink-600">Patient Portal</p>
      </header>

      <main className="mx-auto max-w-xl px-6 py-10 text-ink-600">
        <p className="text-sm">
          The chat launcher is fixed to the
          bottom-right corner — try it on a narrow viewport to see the
          full-screen mobile layout, and refresh the page to confirm the
          session and open/minimized state persist.
        </p>

        <div className="mt-8 rounded-2xl border border-clinical-100 bg-white p-5 shadow-sm">
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
      <ChatWidget tenantId="mani-hospital-main" />
    </div>
  );
}
