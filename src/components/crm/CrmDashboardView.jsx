import React from "react";
import {
  Users,
  MessageSquare,
  Clock,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import ChannelIcon from "./ChannelIcon";
import { CRM_METRICS } from "./crmMockData";

export default function CrmDashboardView({ onNavigateToInbox = () => {} }) {
  return (
    <div className="space-y-6 animate-slide-up">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Total Patient Leads</span>
            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
              <Users size={15} />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {CRM_METRICS.totalLeads}
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <TrendingUp size={12} className="mr-0.5" /> +14.2%
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Across all 7 omnichannel streams</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Active Inbound Chats</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <MessageSquare size={15} />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {CRM_METRICS.activeInboundConversations}
            </span>
            <span className="text-xs font-bold text-teal-600">Live now</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">5 unassigned awaiting intake</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Avg First Response Time</span>
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-700">
              <Clock size={15} />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {CRM_METRICS.avgFirstResponseTime}
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <TrendingUp size={12} className="mr-0.5" /> -32s SLA
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Industry standard is &lt; 5 mins</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Resolution & CSAT</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <CheckCircle2 size={15} />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {CRM_METRICS.resolutionRate}
            </span>
            <span className="text-xs font-bold text-amber-600">★ {CRM_METRICS.csatScore}</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">98.2% positive feedback</span>
        </div>
      </div>

      {/* Main Charts & Funnel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Channel Volume Breakdown (1 Column) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Omnichannel Traffic Distribution</h3>
              <p className="text-xs text-slate-400">Total conversation share by connected platform</p>
            </div>
          </div>

          <div className="space-y-3">
            {CRM_METRICS.channelBreakdown.map((ch) => (
              <div key={ch.channel} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-bold text-slate-800">
                    <ChannelIcon channel={ch.channel.toLowerCase()} size={13} />
                    <span>{ch.channel}</span>
                  </span>
                  <span className="font-mono text-slate-500 text-[11px]">
                    <strong>{ch.count}</strong> ({ch.percent}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${ch.percent}%`, backgroundColor: ch.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onNavigateToInbox}
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-black transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <span>Open Unified Inbox</span>
            <ArrowUpRight size={13} />
          </button>
        </div>

        {/* Lead Conversion Pipeline Funnel (2 Columns) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Hospital Patient Acquisition Funnel</h3>
              <p className="text-xs text-slate-400">Inbound social & chat inquiry to verified OPD check-in</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              55.1% Total Conversion
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {CRM_METRICS.leadFunnel.map((item, idx) => (
              <div key={item.stage} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold font-mono">
                    {idx + 1}
                  </span>
                  <div>
                    <strong className="text-xs font-bold text-slate-900 block">{item.stage}</strong>
                    <span className="text-[11px] text-slate-500">Milestone Stage {idx + 1}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-sm font-black font-mono text-slate-900">{item.count}</span>
                    <span className="text-[10px] text-slate-400 block font-medium">Patients</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md font-mono text-xs font-bold bg-white text-teal-800 border border-slate-200 shadow-2xs">
                    {item.rate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Automations & Security Compliance Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Zap size={15} className="text-amber-500" />
              <span>Active Omnichannel Automations</span>
            </h3>
            <span className="text-xs font-bold text-teal-700">4 Active</span>
          </div>

          <div className="space-y-2">
            {CRM_METRICS.recentAutomations.map((a) => (
              <div key={a.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>{a.trigger}</span>
                  <span className="text-[10px] font-mono font-bold text-teal-700">{a.hits} hits</span>
                </div>
                <p className="text-[11px] text-slate-500">{a.action}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white shadow-sm space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-teal-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck size={16} />
              <span>HIPAA & NABH Patient Privacy Certified</span>
            </div>
            <h3 className="text-base font-bold text-white">End-to-End Encrypted Omnichannel Architecture</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              All WhatsApp Business, Webchat, and Messenger patient interactions conform to digital healthcare PHI regulations. Automated redaction of Aadhaar/credit cards and role-based staff access are permanently enforced.
            </p>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
            <span>AES-256 Cloud Storage</span>
            <span className="text-emerald-400 font-bold">● Systems Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
}
