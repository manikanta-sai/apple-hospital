import React, { useState } from 'react';
import ChannelIcon from './ChannelIcon';
import { STAFF_MEMBERS } from './crmMockData';

export default function CrmAnalyticsView() {
  const [timeRange, setTimeRange] = useState('7d');

  const AGENT_PERFORMANCE = [
    { staff: STAFF_MEMBERS[0], resolvedCount: 142, avgResponse: '1m 12s', csat: 4.95, slaMet: '98.6%' },
    { staff: STAFF_MEMBERS[1], resolvedCount: 128, avgResponse: '1m 45s', csat: 4.88, slaMet: '96.2%' },
    { staff: STAFF_MEMBERS[2], resolvedCount: 96, avgResponse: '2m 10s', csat: 4.79, slaMet: '94.0%' },
    { staff: STAFF_MEMBERS[3], resolvedCount: 84, avgResponse: '2m 30s', csat: 4.82, slaMet: '93.5%' },
    { staff: STAFF_MEMBERS[4], resolvedCount: 71, avgResponse: '1m 55s', csat: 4.91, slaMet: '97.1%' }
  ];

  const HOURLY_DISTRIBUTION = [
    { hour: '8 AM', inquiries: 24 },
    { hour: '9 AM', inquiries: 68 },
    { hour: '10 AM', inquiries: 112 },
    { hour: '11 AM', inquiries: 135 },
    { hour: '12 PM', inquiries: 88 },
    { hour: '1 PM', inquiries: 54 },
    { hour: '2 PM', inquiries: 72 },
    { hour: '3 PM', inquiries: 95 },
    { hour: '4 PM', inquiries: 108 },
    { hour: '5 PM', inquiries: 82 },
    { hour: '6 PM', inquiries: 46 },
    { hour: '7 PM', inquiries: 30 }
  ];

  const maxInquiries = Math.max(...HOURLY_DISTRIBUTION.map(h => h.inquiries));

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Omnichannel Healthcare Analytics & SLAs</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor response speeds, patient CSAT, resolution efficiency, and clinical staff leaderboards.
          </p>
        </div>

        {/* Time Filter */}
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5">
          {['24h', '7d', '30d', '90d'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                timeRange === range ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics Content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Median First Response</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900">1m 34s</span>
              <span className="text-xs font-semibold text-emerald-600">↓ 18% faster</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Target: &lt; 2 minutes</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Overall Patient CSAT</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900">4.92 / 5.0</span>
              <span className="text-xs font-semibold text-emerald-600">★ 98.4%</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Based on 1,480 reviews</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">SLA Met Compliance</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-teal-700">97.8%</span>
              <span className="text-xs font-semibold text-emerald-600">↑ 1.2%</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Hospital NABH target: 95%</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">AI Deflection Rate</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-purple-700">41.2%</span>
              <span className="text-xs font-semibold text-purple-600">AI triage</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Resolved without staff handoff</p>
          </div>
        </div>

        {/* Hourly Volume Distribution Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Peak Inquiry Hourly Distribution</h2>
              <p className="text-xs text-slate-500">Omnichannel patient messages arriving per hour throughout the day</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200">
              Peak: 10:00 AM – 11:30 AM
            </span>
          </div>

          <div className="flex items-end gap-2 h-44 pt-6 px-2">
            {HOURLY_DISTRIBUTION.map(slot => {
              const heightPct = Math.round((slot.inquiries / maxInquiries) * 100);
              return (
                <div key={slot.hour} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="text-[10px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    {slot.inquiries}
                  </span>
                  <div className="w-full bg-slate-100 rounded-t-lg relative flex items-end h-32 overflow-hidden">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full bg-gradient-to-t from-teal-600 to-teal-400 rounded-t group-hover:from-teal-700 group-hover:to-teal-500 transition-all duration-300"
                    />
                  </div>
                  <span className="text-[10px] font-medium text-slate-500 whitespace-nowrap">{slot.hour}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Staff & Doctor Leaderboard */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Staff Response & Resolution Leaderboard</h2>
              <p className="text-xs text-slate-500">Speed, resolution count, and patient satisfaction ratings</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Team Member</th>
                  <th className="py-2.5 px-3">Conversations Resolved</th>
                  <th className="py-2.5 px-3">Average First Response</th>
                  <th className="py-2.5 px-3">CSAT Rating</th>
                  <th className="py-2.5 px-3">SLA Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {AGENT_PERFORMANCE.map(row => (
                  <tr key={row.staff.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-[10px]">
                          {row.staff.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{row.staff.name}</div>
                          <div className="text-[11px] text-slate-500">{row.staff.role}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-semibold text-slate-800">
                      {row.resolvedCount} inquiries
                    </td>

                    <td className="py-3 px-3 font-mono font-medium text-teal-700">
                      {row.avgResponse}
                    </td>

                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        ★ {row.csat}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-semibold text-emerald-700">
                      {row.slaMet}
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
