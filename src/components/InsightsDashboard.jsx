import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Clock3,
  FileText,
  MessageSquare,
  PhoneCall,
  Sparkles,
  TrendingUp,
  XCircle,
  NotepadText,
  CircleCheck
} from "lucide-react";
import AudioPlayer from "./AudioPlayer.jsx";

const CALLS = [
  {
    id: "robert-smith",
    name: "Robert Smith",
    phone: "+1 (415) 555-1234",
    agent: "Robert Smith",
    date: "Sep 1, 2024",
    time: "10:24 AM",
    duration: "00:02:24",
    score: 92,
    outcome: "Interested",
    sentiment: "Positive",
    tag: "Qualified",
    audioUrl: "https://cdn.truefilesize.com/mp3/sample-64kbps.mp3",
    summary: "The prospect is interested in a multi-location rollout and asked follow-up questions about onboarding time.",
    highlights: [
      "Discussed budget and implementation timeline with clarity.",
      "Asked about onboarding support and migration options.",
      "Strong signal for a discovery call follow-up.",
    ],
    improvements: [
      "Confirm the decision timeline before wrapping up.",
      "Agree on a specific follow-up date with the prospect.",
    ],
  },
  {
    id: "jennifer-davis",
    name: "Jennifer Davis",
    phone: "+1 (415) 555-9876",
    agent: "Jennifer Davis",
    date: "Sep 2, 2024",
    time: "09:12 AM",
    duration: "00:01:57",
    score: 76,
    outcome: "Follow up",
    sentiment: "Neutral",
    tag: "Needs Nurture",
    audioUrl: "https://cdn.truefilesize.com/mp3/sample-500kb.mp3",
    summary: "The buyer is in research mode and has a few uncertainties on ROI, but the conversation stayed constructive.",
    highlights: [
      "Needed more clarity on ROI and implementation effort.",
      "Respected product value but requested additional references.",
      "Opportunity remains open for a later follow-up.",
    ],
    improvements: [
      "Explore the prospect's main concerns earlier in the conversation.",
      "Offer a clear next step before ending the call.",
    ],
  },
  {
    id: "michael-kim",
    name: "Michael Kim",
    phone: "+1 (213) 505-6769",
    agent: "Michael Kim",
    date: "Sep 2, 2024",
    time: "06:47 PM",
    duration: "00:02:16",
    score: 51,
    outcome: "Not interested",
    sentiment: "Negative",
    tag: "Low Fit",
    audioUrl: "https://cdn.truefilesize.com/mp3/sample-1mb.mp3",
    summary: "The buyer was not ready to commit and asked for a pause. The call contained several objections around timing.",
    highlights: [
      "Budget timing was not aligned for the quarter.",
      "Product fit questions were raised early in the call.",
      "Follow-up depends on a future strategic review.",
    ],
    improvements: [
      "Acknowledge objections and confirm they were understood.",
      "Ask permission before closing or scheduling another contact.",
    ],
  },
  {
    id: "sarah-lee",
    name: "Sarah Lee",
    phone: "+1 (408) 555-2124",
    agent: "Sarah Lee",
    date: "Sep 3, 2024",
    time: "11:17 AM",
    duration: "00:02:03",
    score: 81,
    outcome: "Interested",
    sentiment: "Positive",
    tag: "Very Warm",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    summary: "The call was strong and the decision-maker showed clear signs of openness to a live demo next week.",
    highlights: [
      "Confirmed the team’s urgency and decision timeline.",
      "Asked for a tailored product walkthrough.",
      "Promising sales path with near-term momentum.",
    ],
    improvements: [
      "Confirm who else will join the requested walkthrough.",
      "Summarize the agreed action items at the end of the call.",
    ],
  },
];

const statCards = [
  { label: "Total Calls", value: "482", delta: "+ 28%", tone: "bg-teal-50 text-teal-700", icon: PhoneCall },
  { label: "Average Score", value: "78/100", delta: "+ 12%", tone: "bg-indigo-50 text-indigo-700", icon: BarChart3 },
  { label: "Conversion Rate", value: "24%", delta: "+ 18%", tone: "bg-violet-50 text-violet-700", icon: TrendingUp },
  { label: "Coaching Opportunities", value: "136", delta: "Identified by AI", tone: "bg-rose-50 text-rose-700", icon: Sparkles },
];

export default function InsightsDashboard({ navigateTo }) {
  const [selectedCallId, setSelectedCallId] = useState(CALLS[0].id);
  const [activeCallTab, setActiveCallTab] = useState("summary");

  const selectedCall = useMemo(
    () => CALLS.find((call) => call.id === selectedCallId) ?? CALLS[0],
    [selectedCallId],
  );
  const callTabs = [
    { id: "summary", label: "Summary", icon: FileText },
    { id: "transcript", label: "Transcript", icon: MessageSquare },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "coaching", label: "Coaching", icon: Sparkles },
  ];
  const handleTabKeyDown = (event, currentIndex) => {
    const lastIndex = callTabs.length - 1;
    let nextIndex = currentIndex;
    if (event.key === "ArrowRight") nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
    else if (event.key === "ArrowLeft") nextIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = lastIndex;
    else return;

    event.preventDefault();
    setActiveCallTab(callTabs[nextIndex].id);
    event.currentTarget.parentElement.querySelectorAll('[role="tab"]')[nextIndex]?.focus();
  };

  return (
    <div className="min-h-screen bg-[#efefed] px-0 py-0 text-ink-900">
      <div className="mx-auto max-w-full">
        <div className="overflow-hidden border-b border-[#dfe4df] bg-[#f3f7f4] shadow-[0_8px_30px_rgba(20,30,24,0.04)]">
          <div className="flex items-center justify-between gap-4 border-b border-[#dfe4df] bg-[#f8faf8] px-4 py-3 md:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md border border-[#d8e7e3] bg-[#edf5f3] text-[#146d63]">
                <BarChart3 size={16} aria-hidden="true" />
              </div>
              <div className="font-semibold text-[#1d2e2b]">Calls Analysis</div>
            </div>
            <button
              type="button"
              onClick={() => navigateTo("/")}
              className="inline-flex min-h-10 items-center gap-2 rounded-md border border-[#dfe4df] bg-white px-3 py-2 text-xs font-semibold text-[#23574f] transition hover:bg-[#f9faf9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147cc1] focus-visible:ring-offset-2"
            >
              <ArrowLeft size={14} aria-hidden="true" />
              Back to dashboard
            </button>
          </div>

          <div className="grid gap-4 p-4 md:p-6">
            <div className="grid gap-3 md:grid-cols-4">
              {statCards.map(({ label, value, delta, tone, icon: Icon }) => (
                <div key={label} className="rounded-xl border border-[#e3eaec] bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="text-[12px] font-medium text-[#5b665f]">{label}</div>
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${tone}`}>
                      <Icon size={18} aria-hidden="true" />
                    </div>
                  </div>
                  <div className="flex items-end justify-between gap-2">
                    <div className="text-[1.8rem] font-bold tracking-[-0.04em] text-[#1b201f]">{value}</div>
                    <div className="text-[11px] font-semibold text-[#0f7d64]">{delta}</div>
                  </div>
                  <div className="text-[11px] text-[#6a7675]">vs. last month</div>
                </div>
              ))}
            </div>

            <div className="-mt-2 grid gap-4 xl:grid-cols-[1.7fr_0.9fr]">
              <div className="min-w-0 rounded-xl border border-[#e9ece9] bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <div className="font-semibold text-[#1d2a29]">Recent Calls</div>
                  <div className="flex items-center gap-2">
                    <button type="button" className="rounded-md border border-[#dfe4df] bg-[#f6faf9] px-2.5 py-1.5 text-[11px] font-semibold text-[#264b47]">
                      AI Agents
                    </button>
                    <button type="button" className="rounded-md border border-[#dfe4df] bg-[#f6faf9] px-2.5 py-1.5 text-[11px] font-semibold text-[#264b47]">
                      View All
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-[#edf1ef]">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-[#f8faf8] text-[11px] uppercase tracking-[0.06em] text-[#66716f]">
                      <tr>
                        <th className="px-3 py-3 font-medium">Contact</th>
                        <th className="px-3 py-3 font-medium">Agent</th>
                        <th className="px-3 py-3 font-medium">Date &amp; Time</th>
                        <th className="px-3 py-3 font-medium">Duration</th>
                        <th className="px-3 py-3 font-medium">Score</th>
                        <th className="px-3 py-3 font-medium">Outcome</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CALLS.map((call) => (
                        <tr
                          key={call.id}
                          className={`cursor-pointer border-t border-[#edf1ef] transition ${selectedCallId === call.id ? "bg-[#f4f8fe]" : "bg-white hover:bg-[#f9fbfb]"}`}
                          onClick={() => {
                            setSelectedCallId(call.id);
                            setActiveCallTab("summary");
                          }}
                        >
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#edf3f0] text-[11px] font-bold text-[#1f3b39]">
                                {call.name.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-medium text-[#1e2926]">{call.name}</div>
                                <div className="text-[11px] text-[#6a7675]">{call.phone}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-[#1e2926]">{call.agent}</td>
                          <td className="px-3 py-3 text-[#1e2926]">
                            <div>{call.date}</div>
                            <div className="text-[11px] text-[#6a7675]">{call.time}</div>
                          </td>
                          <td className="px-3 py-3 text-[#1e2926]">{call.duration}</td>
                          <td className="px-3 py-3">
                            <span className="rounded-full bg-[#ecf7f5] px-2 py-1 text-[11px] font-semibold text-[#146c61]">
                              {call.score}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <span
                              className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                                call.outcome === "Interested"
                                  ? "bg-[#eafaf3] text-[#1a7d5d]"
                                  : call.outcome === "Follow up"
                                    ? "bg-[#fff2d9] text-[#a36d00]"
                                    : "bg-[#fdeaea] text-[#b33d3d]"
                              }`}
                            >
                              {call.outcome}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <aside className="min-w-0 rounded-xl border border-[#e9ece9] bg-white p-4 shadow-sm">
                <div key={selectedCall.id} className="animate-[fadeSlideIn_0.35s_ease-out]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#edf5f5] text-sm font-bold text-[#246b70]">
                        {selectedCall.name.split(" ").map((part) => part[0]).join("")}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-[#1d2e2b]">{selectedCall.name}</div>
                        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#687774]">
                          <PhoneCall size={12} aria-hidden="true" />
                          {selectedCall.phone}
                        </div>
                        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[#687774]">
                          <Clock3 size={12} aria-hidden="true" />
                          {selectedCall.date}, {selectedCall.time}
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 rounded-lg bg-[#f0f7f7] px-3 py-2 text-center text-[#247c7a]">
                      <div className="text-lg font-bold leading-tight">{selectedCall.score}<span className="text-xs font-medium">/100</span></div>
                      <div className="mt-1 text-[10px] font-medium text-[#687774]">Call Score</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <AudioPlayer audioUrl={selectedCall.audioUrl} />
                  </div>

                  <div role="tablist" aria-label={`${selectedCall.name} call details`} className="mt-1 mb-2 flex items-center gap-1 border-b border-[#e8edeb]">
                    {callTabs.map(({ id, label, icon: TabIcon }, index) => (
                      <button
                        key={id}
                        id={`${selectedCall.id}-${id}-tab`}
                        type="button"
                        role="tab"
                        aria-selected={activeCallTab === id}
                        aria-controls={`${selectedCall.id}-tabpanel`}
                        tabIndex={activeCallTab === id ? 0 : -1}
                        onClick={() => setActiveCallTab(id)}
                        onKeyDown={(event) => handleTabKeyDown(event, index)}
                        style={activeCallTab === id ? {
                          color: "#147cc1",
                          borderBottomColor: "#147cc1",
                          borderBottomStyle: "solid",
                          borderBottomWidth: "2px",
                          backgroundColor: "#f3f9fd",
                        } : undefined}
                        className={`inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 border-b-2 px-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#147cc1] sm:flex-none sm:gap-2 sm:px-3.5 ${activeCallTab === id ? "border-[#147cc1] bg-[#f3f9fd] font-bold text-[#147cc1]" : "border-transparent text-[#71807c] hover:text-[#314d48]"}`}
                      >
                        <TabIcon size={14} aria-hidden="true" />
                        {label}
                      </button>
                    ))}
                  </div>

                  <section
                    id={`${selectedCall.id}-tabpanel`}
                    role="tabpanel"
                    aria-labelledby={`${selectedCall.id}-${activeCallTab}-tab`}
                    tabIndex={0}
                    className="min-h-[250px] pt-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#147cc1]"
                  >
                    {activeCallTab === "summary" && (
                      <div className="space-y-7">
                        <div className="flex items-start gap-3 mb-2">
                          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#edf5f3] text-[#146d63]"><FileText size={17} aria-hidden="true" /></span>
                          <div className="min-w-0">
                            <h3 className="text-sm font-bold text-[#1d2e2b] mt-2">Call Summary</h3>
                            <p className="mt-1.5 pb-4 text-[11px] leading-2 text-[#52635f]">{selectedCall.summary}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#edf5f3] text-[#146d63]"><NotepadText size={17} aria-hidden="true" /></span>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-bold text-[#1d2e2b] mt-1.5">Key Highlights</h3>
                            <ul className="mt-2.5 space-y-2.5">
                              {selectedCall.highlights.map((item) => <li key={item} className="flex items-start gap-2.5 text-[12px] leading-3 text-[#008000]"><CircleCheck size={17} className="mt-0.5 shrink-0 text-[#008000]" aria-hidden="true" /><span>{item}</span></li>)}
                              {selectedCall.improvements.map((item) => <li key={item} className="flex items-start gap-2.5 text-[12px] leading-3 text-[#52635f]"><XCircle size={17} className="mt-0.5 shrink-0 text-[#c76d65]" aria-hidden="true" /><span>{item}</span></li>)}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeCallTab === "transcript" && (
                      <div className="flex min-h-[210px] flex-col items-center justify-center rounded-xl border border-dashed border-[#d9e3df] bg-[#fbfcfb] px-5 py-8 text-center">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#edf5f3] text-[#146d63]"><MessageSquare size={19} aria-hidden="true" /></span>
                        <h3 className="mt-3 text-sm font-bold text-[#1d2e2b]">Transcript unavailable</h3>
                        <p className="mt-1.5 max-w-[260px] text-xs leading-5 text-[#687774]">A transcript hasn’t been added for this sample recording yet.</p>
                      </div>
                    )}

                    {activeCallTab === "analytics" && (
                      <div>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: "Call score", value: `${selectedCall.score}/100` },
                            { label: "Duration", value: selectedCall.duration },
                            { label: "Sentiment", value: selectedCall.sentiment },
                            { label: "Call outcome", value: selectedCall.outcome },
                          ].map((metric) => <div key={metric.label} className="rounded-lg border border-[#e8edeb] bg-[#fbfcfb] p-3"><div className="text-[11px] font-medium text-[#71807c]">{metric.label}</div><div className="mt-1.5 text-sm font-bold text-[#1d2e2b]">{metric.value}</div></div>)}
                        </div>
                        <div className="mt-4 rounded-lg bg-[#f2f7f6] p-3.5">
                          <div className="flex items-center justify-between gap-3 text-xs"><span className="font-semibold text-[#314d48]">Quality score</span><span className="font-bold tabular-nums text-[#146d63]">{selectedCall.score}%</span></div>
                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-[#16807e]" style={{ width: `${selectedCall.score}%` }} /></div>
                        </div>
                        <div className="mt-3 text-xs text-[#687774]">Call category: <span className="font-semibold text-[#314d48]">{selectedCall.tag}</span></div>
                      </div>
                    )}

                    {activeCallTab === "coaching" && (
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 rounded-lg bg-[#f2f7f6] p-3.5">
                          <Sparkles size={17} className="mt-0.5 shrink-0 text-[#146d63]" aria-hidden="true" />
                          <div><h3 className="text-sm font-bold text-[#1d2e2b]">Suggested coaching focus</h3><p className="mt-1 mb-2 text-xs leading-3 text-[#52635f]">Use these moments to reinforce clear discovery, confident responses, and a specific next step.</p></div>
                        </div>
                        <ul className="space-y-3">
                          {selectedCall.improvements.map((item, index) => <li key={item} className="flex items-start gap-3 rounded-lg border border-[#e8edeb] px-3.5 py-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#edf5f3] text-[11px] font-bold text-[#146d63]">{index + 1}</span><span className="pt-0.5 text-[13px] leading-2.5 text-[#52635f]">{item}</span></li>)}
                        </ul>
                      </div>
                    )}
                  </section>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
