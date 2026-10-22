import React, { useState } from 'react';
import ChannelIcon from './ChannelIcon';

const CHANNELS_DATA = [
  {
    id: "whatsapp",
    name: "WhatsApp Business API",
    badge: "Primary Patient Channel",
    color: "#25D366",
    totalInbound: 684,
    totalCalls: 38,
    callsAnswered: 36,
    callsMissed: 2,
    callAnswerRate: "94.7%",
    conversionRatio: "67.4%",
    convertedBookings: 461,
    avgCsat: 4.95,
    peakHours: "09:30 AM – 11:30 AM & 06:30 PM – 08:30 PM",
    aht: "2m 15s",
    slaMetRate: "98.6%",
    topAgent: "Priya Nair (142 resolved)",
    tips: [
      "Enable WhatsApp Interactive Quick Reply buttons for doctor slot picker to reduce back-and-forth by 60%.",
      "Deploy AI auto-responder for lab report queries after 8 PM to maintain 100% first-response SLA."
    ]
  },
  {
    id: "webchat",
    name: "Website Live Chatbot & Desk",
    badge: "High Intent Web Visitors",
    color: "#0d9488",
    totalInbound: 242,
    totalCalls: 0,
    callsAnswered: 0,
    callsMissed: 0,
    callAnswerRate: "N/A (Chat Only)",
    conversionRatio: "52.1%",
    convertedBookings: 126,
    avgCsat: 4.88,
    peakHours: "10:00 AM – 01:00 PM & 03:00 PM – 05:00 PM",
    aht: "1m 48s",
    slaMetRate: "97.4%",
    topAgent: "Megan Chen (88 resolved)",
    tips: [
      "Trigger conversational proactive prompt after 15 seconds on the Cardiology & Maternity doctor pages.",
      "Show live estimated OPD token wait times directly inside the chat window."
    ]
  },
  {
    id: "instagram",
    name: "Instagram Direct (DMs & Stories)",
    badge: "Maternity & Cosmetic Inquiries",
    color: "#E1306C",
    totalInbound: 118,
    totalCalls: 12,
    callsAnswered: 10,
    callsMissed: 2,
    callAnswerRate: "83.3%",
    conversionRatio: "41.5%",
    convertedBookings: 49,
    avgCsat: 4.82,
    peakHours: "07:00 PM – 10:30 PM (Evening Surge)",
    aht: "3m 30s",
    slaMetRate: "92.8%",
    topAgent: "Priya Nair & Megan Chen",
    tips: [
      "78% of inquiries ask for Maternity and Cosmetic Dermatology packages — attach 1-click PDF download link in greeting.",
      "Shift standby agent coverage to 10 PM to capture evening mobile social browsing traffic."
    ]
  },
  {
    id: "messenger",
    name: "Meta Facebook Messenger",
    badge: "Community & Family Medicine",
    color: "#0084FF",
    totalInbound: 86,
    totalCalls: 6,
    callsAnswered: 6,
    callsMissed: 0,
    callAnswerRate: "100%",
    conversionRatio: "48.8%",
    convertedBookings: 42,
    avgCsat: 4.79,
    peakHours: "11:00 AM – 03:00 PM",
    aht: "2m 50s",
    slaMetRate: "95.1%",
    topAgent: "Vikram Mehta (34 resolved)",
    tips: [
      "Integrate Facebook Lead Ad automated webhook to inject inquiries instantly into Unified Inbox without polling delay.",
      "Provide Telugu/Hindi localized greeting templates."
    ]
  },
  {
    id: "email",
    name: "Care Email (IMAP/SMTP)",
    badge: "Corporate & Insurance TPA",
    color: "#6366f1",
    totalInbound: 62,
    totalCalls: 0,
    callsAnswered: 0,
    callsMissed: 0,
    callAnswerRate: "N/A (Email)",
    conversionRatio: "58.0%",
    convertedBookings: 36,
    avgCsat: 4.90,
    peakHours: "09:00 AM – 11:00 AM & 02:00 PM – 04:00 PM",
    aht: "8m 10s",
    slaMetRate: "96.5%",
    topAgent: "Vikram Mehta (28 resolved)",
    tips: [
      "Implement automated OCR parser for incoming cashless TPA claim pre-auth forms to save 5 minutes per email.",
      "Send auto-acknowledgment with estimated turnaround time (within 30 mins during OPD hours)."
    ]
  },
  {
    id: "linkedin",
    name: "LinkedIn Organization Page",
    badge: "B2B & Executive Health",
    color: "#0A66C2",
    totalInbound: 34,
    totalCalls: 0,
    callsAnswered: 0,
    callsMissed: 0,
    callAnswerRate: "N/A",
    conversionRatio: "70.5%",
    convertedBookings: 24,
    avgCsat: 4.96,
    peakHours: "02:00 PM – 05:00 PM (Business Hours)",
    aht: "4m 20s",
    slaMetRate: "99.0%",
    topAgent: "Vikram Mehta (18 resolved)",
    tips: [
      "Route corporate annual wellness & pre-employment checkup inquiries directly to Hospital B2B Outreach Head within 5 mins.",
      "Attach Corporate Health Benefit brochure automatically."
    ]
  },
  {
    id: "threads",
    name: "Threads Healthcare Community",
    badge: "Health Q&A Discussions",
    color: "#000000",
    totalInbound: 22,
    totalCalls: 0,
    callsAnswered: 0,
    callsMissed: 0,
    callAnswerRate: "N/A",
    conversionRatio: "36.4%",
    convertedBookings: 8,
    avgCsat: 4.75,
    peakHours: "08:00 PM – 11:00 PM",
    aht: "3m 05s",
    slaMetRate: "91.2%",
    topAgent: "Megan Chen (12 resolved)",
    tips: [
      "Publish weekly doctor Q&A snippets with Dr. Rajesh Sharma and link back to hospital appointment desk."
    ]
  }
];

const AGENT_CHANNEL_MATRIX = [
  { agentName: "Priya Nair, MHA", primaryChannel: "WhatsApp & Messenger", handled: 142, callsAnswered: 32, callsMissed: 1, conversion: "68.5%", csat: 4.95, aht: "2m 04s", status: "Top Performer" },
  { agentName: "Megan Chen, RN", primaryChannel: "Webchat & Instagram", handled: 128, callsAnswered: 14, callsMissed: 2, conversion: "54.2%", csat: 4.88, aht: "2m 18s", status: "SLA Compliant" },
  { agentName: "Vikram Mehta", primaryChannel: "Corporate Email & LinkedIn", handled: 96, callsAnswered: 8, callsMissed: 0, conversion: "72.0%", csat: 4.92, aht: "3m 40s", status: "B2B Specialist" },
  { agentName: "Dr. Rajesh Sharma (ER On-Call)", primaryChannel: "Cardiac Emergency Triage", handled: 48, callsAnswered: 18, callsMissed: 0, conversion: "95.8%", csat: 5.00, aht: "1m 30s", status: "Clinical Specialist" },
  { agentName: "Dr. Sunita Rao (OB/GYN)", primaryChannel: "Maternity Video Triage", handled: 36, callsAnswered: 12, callsMissed: 1, conversion: "88.9%", csat: 4.98, aht: "4m 15s", status: "Clinical Specialist" }
];

export default function CrmChannelsReportView({ onOpenConversation }) {
  const [selectedChannelId, setSelectedChannelId] = useState("all");

  const filteredChannels = selectedChannelId === "all"
    ? CHANNELS_DATA
    : CHANNELS_DATA.filter(c => c.id === selectedChannelId);

  // Overall totals across channels
  const totalInbound = CHANNELS_DATA.reduce((acc, c) => acc + c.totalInbound, 0);
  const totalCalls = CHANNELS_DATA.reduce((acc, c) => acc + c.totalCalls, 0);
  const totalAnswered = CHANNELS_DATA.reduce((acc, c) => acc + c.callsAnswered, 0);
  const totalMissed = CHANNELS_DATA.reduce((acc, c) => acc + c.callsMissed, 0);
  const totalBookings = CHANNELS_DATA.reduce((acc, c) => acc + c.convertedBookings, 0);
  const overallConversion = ((totalBookings / totalInbound) * 100).toFixed(1) + "%";

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Omnichannel Channels & Agent Performance Report</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              7 Channels Analyzed
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare traffic volume, voice calls vs answered vs missed, conversion ratio, peak hours, and actionable improvement tips.
          </p>
        </div>

        {/* Channel Filter Pill Bar */}
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          <button
            onClick={() => setSelectedChannelId("all")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              selectedChannelId === "all" ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            All Channels ({totalInbound})
          </button>
          {CHANNELS_DATA.map(ch => (
            <button
              key={ch.id}
              onClick={() => setSelectedChannelId(ch.id)}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap border ${
                selectedChannelId === ch.id
                  ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <ChannelIcon channel={ch.id} size={14} />
              <span className="capitalize">{ch.id}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Report Body */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Overall Summary Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">Total Omnichannel Inquiries</span>
            <span className="text-2xl font-extrabold text-slate-900">{totalInbound.toLocaleString()}</span>
            <div className="text-[10px] text-teal-600 font-medium">Across all 7 connected channels</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-semibold text-emerald-700 block uppercase tracking-wider">Total Voice Calls Handled</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-emerald-600">{totalAnswered}</span>
              <span className="text-xs text-slate-500">/ {totalCalls} calls</span>
            </div>
            <div className="text-[10px] text-emerald-700 font-semibold">{((totalAnswered / (totalCalls || 1)) * 100).toFixed(1)}% Answered</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-semibold text-rose-600 block uppercase tracking-wider">Missed Calls (Voice/PBX)</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-rose-600">{totalMissed}</span>
              <span className="text-xs text-rose-600">({((totalMissed / (totalCalls || 1)) * 100).toFixed(1)}%)</span>
            </div>
            <div className="text-[10px] text-slate-500">Auto-SMS & Callbacks dispathed</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">Average Conversion Ratio</span>
            <span className="text-2xl font-extrabold text-teal-700">{overallConversion}</span>
            <div className="text-[10px] text-teal-600 font-medium">{totalBookings} Paid OPD Consults</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">Overall Quality CSAT</span>
            <span className="text-2xl font-extrabold text-amber-600">★ 4.91 / 5.0</span>
            <div className="text-[10px] text-slate-500">Based on 1,480 patient reviews</div>
          </div>
        </div>

        {/* Detailed Channel Performance Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Channel Breakdown: Volume, Voice Calls, Conversion & Peak Times
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredChannels.map(ch => (
              <div
                key={ch.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 hover:border-teal-300 transition-all"
              >
                {/* Channel Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 shadow-xs">
                      <ChannelIcon channel={ch.id} size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-sm">{ch.name}</h3>
                        <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                          {ch.badge}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Top Responder: <strong className="text-slate-800">{ch.topAgent}</strong>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    ★ {ch.avgCsat}
                  </span>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-3 gap-2.5 bg-slate-50/70 p-3 rounded-xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">Inbound Msgs</span>
                    <span className="font-extrabold text-slate-900 text-base">{ch.totalInbound}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">Calls Ans / Miss</span>
                    <div className="font-extrabold text-slate-900 text-sm">
                      {ch.totalCalls > 0 ? (
                        <span>
                          <span className="text-emerald-600">{ch.callsAnswered}</span> / <span className="text-rose-600">{ch.callsMissed}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 font-normal">N/A (Chat)</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">Conversion</span>
                    <span className="font-extrabold text-emerald-600 text-base">{ch.conversionRatio}</span>
                  </div>
                </div>

                {/* Peak Hours & Speed */}
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-500 w-24">Peak Traffic:</span>
                    <span className="font-mono text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {ch.peakHours}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-500 w-24">Avg Handling:</span>
                    <span className="font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded text-[11px]">
                      {ch.aht} (SLA Met: {ch.slaMetRate})
                    </span>
                  </div>
                </div>

                {/* Actionable Improvement Tips */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wide flex items-center gap-1.5">
                    <span>💡</span> Actionable Optimization Tips:
                  </span>
                  <div className="space-y-1.5">
                    {ch.tips.map((tip, idx) => (
                      <div key={idx} className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-start gap-2">
                        <span className="text-teal-600 font-bold">•</span>
                        <span className="leading-relaxed">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agents Performance Matrix */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Agents Performance Matrix by Channel Specialization</h2>
              <p className="text-xs text-slate-500">Cross-channel handling volume, telephony response rate, and patient conversion ratio</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/70">
                  <th className="py-2.5 px-3">Agent</th>
                  <th className="py-2.5 px-3">Primary Channel Desk</th>
                  <th className="py-2.5 px-3">Chats Handled</th>
                  <th className="py-2.5 px-3">Calls Answered / Missed</th>
                  <th className="py-2.5 px-3">Conversion Ratio</th>
                  <th className="py-2.5 px-3">CSAT Score</th>
                  <th className="py-2.5 px-3">Handling Time</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {AGENT_CHANNEL_MATRIX.map(row => (
                  <tr key={row.agentName} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {row.agentName}
                    </td>

                    <td className="py-3 px-3 font-medium text-slate-700">
                      {row.primaryChannel}
                    </td>

                    <td className="py-3 px-3 font-bold text-slate-900">
                      {row.handled}
                    </td>

                    <td className="py-3 px-3">
                      <span className="text-emerald-700 font-semibold">{row.callsAnswered} Ans</span>
                      {row.callsMissed > 0 && (
                        <span className="text-rose-600 font-medium ml-1">/ {row.callsMissed} Miss</span>
                      )}
                    </td>

                    <td className="py-3 px-3 font-extrabold text-emerald-600">
                      {row.conversion}
                    </td>

                    <td className="py-3 px-3">
                      <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-bold">
                        ★ {row.csat}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-600">
                      {row.aht}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
