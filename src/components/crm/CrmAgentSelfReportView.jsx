import React, { useState } from 'react';
import ChannelIcon from './ChannelIcon';

export default function CrmAgentSelfReportView({ agentProfile = null, onNavigateToInbox }) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('today'); // 'today' | 'week' | 'month'

  const agent = agentProfile || {
    name: "Priya Nair, MHA",
    role: "Senior Patient Care Coordinator & Omnichannel Lead",
    agentId: "AGENT-704",
    department: "Patient Relations & Triage Desk",
    email: "priya.nair@applehospital.health",
    phone: "+91 98450 12345",
    status: "Available",
    shift: "Morning Shift (08:00 AM - 04:30 PM)",
    deskNumber: "Desk 12 - Cardiac & Gynaec Wing",
  };

  // Agent Telephony & Chat Metrics
  const METRICS = {
    totalCalls: 54,
    answeredCalls: 51,
    missedCalls: 3,
    callAnswerRate: "94.4%",
    chatsHandled: 78,
    totalHoursSpent: "6h 45m",
    talkTime: "3h 12m",
    chatTime: "3h 08m",
    idleTime: "25m",
    avgFirstResponse: "1m 18s",
    slaMetRate: "98.2%",
    csatScore: "4.94 / 5.0",
    totalRatings: 46,
    conversionRatio: "68.5%", // Inquiry to booked OPD/IPD
    convertedBookings: 54
  };

  const POSITIVE_EVIDENCE = [
    {
      id: "ev-pos-1",
      ticketId: "#conv-2",
      patientName: "Vikram Singh",
      uhid: "UHID-44129",
      channel: "messenger",
      timestamp: "Today, 11:04 AM",
      category: "Critical ER Triage & Escalation",
      badge: "Life-Saving SOP Followed",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      transcript: "Patient complained of acute chest tightness and BP 160/100 after morning walk.",
      evidence: "Agent Priya escalated to Dr. Rajesh Sharma within 32 seconds, provided direct ambulance dispatch link, and notified Room 104 triage nurse. Patient arrived safely within 20 mins.",
      csat: "★★★★★ 5.0",
      patientQuote: "Sister Priya's calm and instant response gave my family confidence during an emergency."
    },
    {
      id: "ev-pos-2",
      ticketId: "#conv-1",
      patientName: "Anita Verma",
      uhid: "UHID-88392",
      channel: "whatsapp",
      timestamp: "Today, 09:22 AM",
      category: "Multi-Lingual Patient Communication",
      badge: "High Empathy Score",
      badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
      transcript: "Patient was anxious about fasting requirements for 22-week fetal anomaly scan.",
      evidence: "Agent explained Telugu fasting instructions (భోజనం తర్వాత) clearly and clarified that anomaly scan only needs moderate hydration, removing patient anxiety.",
      csat: "★★★★★ 5.0",
      patientQuote: "Very respectful and polite Telugu guidance. Explained everything so clearly."
    },
    {
      id: "ev-pos-3",
      ticketId: "#conv-5",
      patientName: "Amit Saxena",
      uhid: "UHID-31298",
      channel: "email",
      timestamp: "Today, 02:40 PM",
      category: "High Clinical Conversion",
      badge: "Lead Conversion 100%",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      transcript: "Inquiry on knee replacement second opinion & preventive health packages.",
      evidence: "Upsold Executive Platinum Health Checkup (₹4,999) + scheduled Dr. Vivek Anand second opinion OPD visit, verifying Star Health TPA cashless pre-auth.",
      csat: "★★★★★ 5.0",
      patientQuote: "Comprehensive breakdown of costs and insurance cashless counter details."
    }
  ];

  const NEGATIVE_EVIDENCE = [
    {
      id: "ev-neg-1",
      ticketId: "#conv-4",
      patientName: "Pooja Nair",
      uhid: "UHID-55910",
      channel: "instagram",
      timestamp: "Today, 01:25 PM",
      category: "SLA Response Delay (Breach)",
      severity: "Moderate",
      transcript: "Inquiry regarding pediatric 102°F fever paracetamol dosage.",
      evidence: "First response took 4m 32s (exceeded target SLA of 2m by 2m 32s). Root cause: Agent stepped away for lunch break handoff without toggling CRM status to 'On Break', delaying ticket dispatch.",
      impact: "Patient sent second anxious follow-up ping. Handled politely afterward with CSAT 4.0.",
      coachingAction: "Ensure agent toggles status to 'On Break' 5 minutes prior to meal handoffs so new inbound routes automatically."
    },
    {
      id: "ev-neg-2",
      ticketId: "#conv-8",
      patientName: "Anna Johnson",
      uhid: "UHID-10640",
      channel: "whatsapp",
      timestamp: "Today, 03:10 PM",
      category: "Documentation Omission",
      severity: "Minor",
      transcript: "Request for itemized IPD pharmacy bills for insurance tax reimbursement.",
      evidence: "Agent dispatched the bill PDF correctly via WhatsApp, but forgot to tag '#Cashless-TPA' in EHR audit notes. Required team supervisor to manually backfill the tag.",
      impact: "Internal documentation delay of 12 minutes.",
      coachingAction: "Use pre-set internal note macro '@insurance' which auto-attaches TPA audit tags."
    }
  ];

  const ACTIONABLE_TIPS = [
    {
      title: "Set 'On Break' Status 5 Mins Before Leaving Desk",
      area: "Response Speed & SLA",
      detail: "Avoid ticket queue buildup during shift transitions. Toggling 'On Break' allows ABCD CRM router to instantly divert inbound DMs to available colleagues Megan Chen or Vikram Mehta.",
      benefit: "Saves ~2.5 mins on queue dispatch time during lunch hours."
    },
    {
      title: "Leverage Pre-Approved Canned Replies (@fasting, @booking)",
      area: "Handling Time Optimization",
      detail: "Typing out diagnostic fasting rules repeatedly takes 90 seconds. Using slash command '@fasting' populates doctor-verified instructions in 1 second.",
      benefit: "Reduces Average Handling Time (AHT) from 4m 10s down to 2m 45s."
    },
    {
      title: "Review Pediatric Fever Dosage Red-Flag SOP",
      area: "Clinical Safety & Triage",
      detail: "Always verify child weight before suggesting syrup concentrations, and emphasize ER walk-in if febrile seizures occur.",
      benefit: "Maintains 100% adherence to hospital clinical triage protocols."
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Agent Self-Performance & Quality Report</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
              {agent.agentId}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Self-evaluation, telephony call statistics, positive commendations, and evidence-based coaching recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Timeframe Selector */}
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs font-medium">
            {['today', 'week', 'month'].map(tf => (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                className={`px-3 py-1.5 rounded-md transition-colors capitalize ${
                  selectedTimeframe === tf ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tf === 'today' ? 'Today (Shift)' : tf === 'week' ? 'This Week' : 'This Month'}
              </button>
            ))}
          </div>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Report
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Agent Info Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-2xl p-5 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-500 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg flex-shrink-0">
              {agent.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">{agent.name}</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500 text-white shadow-xs">
                  ● {agent.status}
                </span>
              </div>
              <p className="text-xs text-teal-300 font-medium mt-0.5">{agent.role}</p>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-300 mt-1.5 font-mono">
                <span>{agent.department}</span>
                <span>•</span>
                <span>{agent.shift}</span>
                <span>•</span>
                <span>{agent.deskNumber}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/15">
            <div className="text-center">
              <span className="text-[10px] text-teal-200 uppercase tracking-wider block">CSAT Score</span>
              <span className="text-xl font-extrabold text-white">★ 4.94</span>
              <span className="text-[10px] text-slate-300 block">46 Ratings</span>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <span className="text-[10px] text-teal-200 uppercase tracking-wider block">Conversion</span>
              <span className="text-xl font-extrabold text-emerald-400">68.5%</span>
              <span className="text-[10px] text-slate-300 block">54 OPD Booked</span>
            </div>
          </div>
        </div>

        {/* 1. KEY TELEPHONY & OMNICHANNEL METRICS */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            1. Call & Omnichannel Activity Breakdown
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {/* Total Calls */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 block">Total Calls</span>
              <span className="text-2xl font-bold text-slate-900">{METRICS.totalCalls}</span>
              <div className="text-[10px] text-slate-400">Inbound PBX Ring</div>
            </div>

            {/* Answered vs Missed */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] font-semibold text-emerald-700 block">Calls Answered</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-emerald-600">{METRICS.answeredCalls}</span>
                <span className="text-xs font-semibold text-emerald-600">({METRICS.callAnswerRate})</span>
              </div>
              <div className="text-[10px] text-rose-500 font-medium">Missed: {METRICS.missedCalls} calls (5.6%)</div>
            </div>

            {/* Chats Handled */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 block">Chats Handled</span>
              <span className="text-2xl font-bold text-teal-700">{METRICS.chatsHandled}</span>
              <div className="text-[10px] text-slate-400">Across 7 Channels</div>
            </div>

            {/* Total Hours Spent */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 block">Hours Active</span>
              <span className="text-2xl font-bold text-indigo-700">{METRICS.totalHoursSpent}</span>
              <div className="text-[10px] text-slate-500 truncate">Talk: {METRICS.talkTime} | Chat: {METRICS.chatTime}</div>
            </div>

            {/* First Response Speed */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 block">Median Response</span>
              <span className="text-2xl font-bold text-slate-900">{METRICS.avgFirstResponse}</span>
              <div className="text-[10px] text-emerald-600 font-medium">SLA Met: {METRICS.slaMetRate}</div>
            </div>

            {/* Conversion */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 block">Lead Conversion</span>
              <span className="text-2xl font-bold text-emerald-600">{METRICS.conversionRatio}</span>
              <div className="text-[10px] text-slate-500">{METRICS.convertedBookings} Patients Booked</div>
            </div>
          </div>
        </div>

        {/* 2. POSITIVE FEEDBACK & COMMENDATIONS WITH EVIDENCE */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌟</span>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Positive Feedback & Commendations (With Audit Evidence)</h2>
                <p className="text-xs text-slate-500">Verified patient interactions with recorded high empathy, speed, and positive outcomes</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              3 Highlights Today
            </span>
          </div>

          <div className="space-y-3.5">
            {POSITIVE_EVIDENCE.map(item => (
              <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-xs text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {item.ticketId}
                    </span>
                    <span className="font-bold text-slate-900 text-xs">{item.patientName}</span>
                    <span className="text-[11px] text-slate-500">({item.uhid})</span>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <ChannelIcon channel={item.channel} size={14} />
                      <span className="capitalize">{item.channel}</span>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {item.csat}
                  </span>
                </div>

                <div className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                  <div className="text-[11px] font-semibold text-slate-500">Recorded Evidence & Audit Trail:</div>
                  <p className="text-slate-800 leading-relaxed font-sans">{item.evidence}</p>
                </div>

                {item.patientQuote && (
                  <div className="text-xs italic text-teal-800 bg-teal-50/60 px-3 py-1.5 rounded-lg border border-teal-100 flex items-center gap-1.5">
                    <span>💬</span>
                    <span>Patient Quote: "{item.patientQuote}"</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 3. NEGATIVE FEEDBACK / IMPROVEMENT AREAS WITH EVIDENCE */}
        <div className="bg-white rounded-2xl border border-rose-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-rose-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Areas for Improvement & SLA Breaches (With Evidence)</h2>
                <p className="text-xs text-slate-500">Audit logs identifying delays or documentation gaps with root cause analysis</p>
              </div>
            </div>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              2 Audited Points
            </span>
          </div>

          <div className="space-y-3.5">
            {NEGATIVE_EVIDENCE.map(item => (
              <div key={item.id} className="p-4 rounded-xl border border-rose-200 bg-rose-50/20 hover:bg-rose-50/40 transition-colors space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-xs text-slate-900 bg-white px-2 py-0.5 rounded border border-rose-200">
                      {item.ticketId}
                    </span>
                    <span className="font-bold text-slate-900 text-xs">{item.patientName}</span>
                    <span className="text-[11px] text-slate-500">({item.uhid})</span>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <ChannelIcon channel={item.channel} size={14} />
                      <span className="capitalize">{item.channel}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                      {item.category}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{item.timestamp}</span>
                </div>

                <div className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                  <div className="text-[11px] font-semibold text-rose-700">Audit Trail & Root Cause:</div>
                  <p className="text-slate-800 leading-relaxed font-sans">{item.evidence}</p>
                </div>

                <div className="text-xs text-slate-700 bg-amber-50/80 p-2.5 rounded-lg border border-amber-200 flex items-start gap-2">
                  <span className="text-amber-600 font-bold">Actionable Coaching:</span>
                  <span className="text-amber-900 font-medium">{item.coachingAction}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. ACTIONABLE TIPS & IMPROVEMENT RECOMMENDATIONS */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="text-lg">💡</span>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Personalized AI Coaching & Improvement Tips</h2>
              <p className="text-xs text-slate-500">Concrete steps to enhance response velocity, clinical accuracy, and patient rapport</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ACTIONABLE_TIPS.map((tip, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:border-teal-300 transition-colors flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {tip.area}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-xs leading-snug">{tip.title}</h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-normal">{tip.detail}</p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                  <span>✓ Expected Gain:</span>
                  <span>{tip.benefit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
