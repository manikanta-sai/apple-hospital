import React, { useState, useMemo } from 'react';
import ChannelIcon from './ChannelIcon';
import { INITIAL_CONVERSATIONS, STAFF_MEMBERS } from './crmMockData';

const LEAD_STATUS_CONFIG = {
  new: { label: 'New Lead', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
  contacted: { label: 'Contacted', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  qualified: { label: 'Qualified Patient', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
  consultation_scheduled: { label: 'OPD Booked', bg: 'bg-teal-50 text-teal-700 border-teal-200' },
  admitted: { label: 'Admitted / IPD', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  lost: { label: 'Lost / Inactive', bg: 'bg-slate-100 text-slate-600 border-slate-200' }
};

const DEPARTMENTS = ['All Departments', 'Cardiology', 'Obstetrics & Gynaecology', 'Pediatrics', 'Neurology', 'Orthopedics', 'General Medicine'];
const CHANNELS = ['All Channels', 'whatsapp', 'messenger', 'instagram', 'threads', 'linkedin', 'webchat', 'email'];

export default function CrmLeadsView({ onOpenConversation }) {
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedChannel, setSelectedChannel] = useState('All Channels');
  const [statusFilter, setStatusFilter] = useState('all');
  const [leadsList, setLeadsList] = useState(() =>
    INITIAL_CONVERSATIONS.map(c => ({
      id: c.id,
      patientName: c.patientName,
      ageGender: c.ageGender,
      uhid: c.uhid,
      phone: c.phone,
      email: c.email,
      department: c.department,
      channel: c.channel,
      leadSource: c.leadSource,
      leadStatus: c.leadStatus || 'new',
      assignedTo: c.assignedTo,
      priority: c.priority,
      lastInteraction: c.lastActivity,
      estimatedValue: c.estimatedValue || '₹3,500',
      unread: c.unreadCount > 0
    }))
  );

  const [selectedLead, setSelectedLead] = useState(null);

  const filteredLeads = useMemo(() => {
    return leadsList.filter(lead => {
      if (statusFilter !== 'all' && lead.leadStatus !== statusFilter) return false;
      if (selectedDept !== 'All Departments' && lead.department !== selectedDept) return false;
      if (selectedChannel !== 'All Channels' && lead.channel !== selectedChannel) return false;
      if (search.trim()) {
        const query = search.toLowerCase();
        return (
          lead.patientName.toLowerCase().includes(query) ||
          lead.phone.includes(query) ||
          lead.email.toLowerCase().includes(query) ||
          lead.department.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [leadsList, statusFilter, selectedDept, selectedChannel, search]);

  const handleStatusChange = (leadId, newStatus) => {
    setLeadsList(prev =>
      prev.map(l => (l.id === leadId ? { ...l, leadStatus: newStatus } : l))
    );
  };

  const handleAssignChange = (leadId, staffId) => {
    const staff = STAFF_MEMBERS.find(s => s.id === staffId);
    setLeadsList(prev =>
      prev.map(l => (l.id === leadId ? { ...l, assignedTo: staff || l.assignedTo } : l))
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Patient Leads & Pipeline</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
              {filteredLeads.length} Leads
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Capture, qualify, and convert omnichannel hospital inquiries into OPD/IPD consultations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              const csvData = filteredLeads.map(l => `"${l.patientName}","${l.phone}","${l.department}","${l.channel}","${l.leadStatus}"`).join('\n');
              const blob = new Blob([`Name,Phone,Department,Channel,Status\n${csvData}`], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `hospital_crm_leads_${new Date().toISOString().split('T')[0]}.csv`;
              a.click();
            }}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
          <button
            onClick={() => {
              const name = prompt('Enter Patient / Lead Full Name:');
              if (!name) return;
              const phone = prompt('Enter Phone Number:', '+91 98');
              const dept = prompt('Department (Cardiology, Pediatrics, etc.):', 'General Medicine');
              const newLead = {
                id: `lead-${Date.now()}`,
                patientName: name,
                ageGender: '30Y / M',
                uhid: `UHID-${Math.floor(10000 + Math.random() * 90000)}`,
                phone: phone || '+91 98000 00000',
                email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
                department: dept || 'General Medicine',
                channel: 'whatsapp',
                leadSource: 'Manual Direct Walk-in / Reception',
                leadStatus: 'new',
                assignedTo: STAFF_MEMBERS[0],
                priority: 'normal',
                lastInteraction: 'Just now',
                estimatedValue: '₹2,500',
                unread: false
              };
              setLeadsList(prev => [newLead, ...prev]);
            }}
            className="px-4 py-2 text-xs font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Lead
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Search */}
          <div className="relative min-w-[240px]">
            <svg className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search leads by name, phone, dept..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:bg-white"
            />
          </div>

          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            {DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          {/* Channel Filter */}
          <select
            value={selectedChannel}
            onChange={e => setSelectedChannel(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 capitalize focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            {CHANNELS.map(ch => (
              <option key={ch} value={ch}>{ch === 'All Channels' ? 'All Channels' : ch.toUpperCase()}</option>
            ))}
          </select>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({leadsList.length})
          </button>
          {Object.entries(LEAD_STATUS_CONFIG).map(([stKey, stVal]) => {
            const count = leadsList.filter(l => l.leadStatus === stKey).length;
            const active = statusFilter === stKey;
            return (
              <button
                key={stKey}
                onClick={() => setStatusFilter(stKey)}
                className={`px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                  active ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {stVal.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Table Container */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Patient / Lead</th>
                  <th className="py-3 px-4">Channel & Source</th>
                  <th className="py-3 px-4">Clinical Department</th>
                  <th className="py-3 px-4">Pipeline Status</th>
                  <th className="py-3 px-4">Assigned Staff</th>
                  <th className="py-3 px-4">Est. Value</th>
                  <th className="py-3 px-4">Last Activity</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <svg className="w-12 h-12 mx-auto text-slate-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      No leads match the selected criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map(lead => {
                    const statusInfo = LEAD_STATUS_CONFIG[lead.leadStatus] || LEAD_STATUS_CONFIG.new;
                    return (
                      <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-white font-semibold flex items-center justify-center text-xs flex-shrink-0 shadow-sm">
                              {lead.patientName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900 flex items-center gap-2">
                                <span>{lead.patientName}</span>
                                {lead.priority === 'urgent' && (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">Urgent</span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                                <span>{lead.phone}</span>
                                <span>•</span>
                                <span>{lead.ageGender}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <ChannelIcon channel={lead.channel} size={18} />
                            <div>
                              <span className="font-medium text-slate-700 capitalize text-xs block">{lead.channel}</span>
                              <span className="text-[11px] text-slate-400 block truncate max-w-[140px]">{lead.leadSource}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-medium text-slate-800">
                          {lead.department}
                        </td>

                        <td className="py-3.5 px-4">
                          <select
                            value={lead.leadStatus}
                            onChange={e => handleStatusChange(lead.id, e.target.value)}
                            className={`text-[11px] font-semibold rounded-full px-2.5 py-1 border transition-colors cursor-pointer ${statusInfo.bg}`}
                          >
                            {Object.entries(LEAD_STATUS_CONFIG).map(([k, v]) => (
                              <option key={k} value={k}>{v.label}</option>
                            ))}
                          </select>
                        </td>

                        <td className="py-3.5 px-4">
                          <select
                            value={lead.assignedTo?.id || ''}
                            onChange={e => handleAssignChange(lead.id, e.target.value)}
                            className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                          >
                            {STAFF_MEMBERS.map(staff => (
                              <option key={staff.id} value={staff.id}>
                                {staff.name}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {lead.estimatedValue}
                        </td>

                        <td className="py-3.5 px-4 text-slate-500 text-xs">
                          {lead.lastInteraction}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                if (onOpenConversation) {
                                  onOpenConversation(lead.id);
                                }
                              }}
                              className="px-2.5 py-1 rounded bg-teal-50 text-teal-700 hover:bg-teal-100 text-xs font-medium border border-teal-200 transition-colors"
                              title="Open live chat"
                            >
                              Open Chat
                            </button>
                            <button
                              onClick={() => setSelectedLead(lead)}
                              className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                              title="Quick Preview"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Preview Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">{selectedLead.patientName}</h3>
                <p className="text-xs text-slate-400">{selectedLead.uhid} • {selectedLead.ageGender}</p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-medium block">Phone</span>
                  <span className="font-semibold text-slate-800 text-sm">{selectedLead.phone}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-medium block">Channel</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <ChannelIcon channel={selectedLead.channel} size={16} />
                    <span className="font-semibold text-slate-800 capitalize">{selectedLead.channel}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 text-[11px] block">Department</span>
                  <span className="font-semibold text-slate-800">{selectedLead.department}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Lead Source</span>
                  <span className="font-semibold text-slate-800">{selectedLead.leadSource}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 text-[11px] block">Assigned Staff</span>
                <span className="font-semibold text-slate-800">{selectedLead.assignedTo?.name} ({selectedLead.assignedTo?.role})</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  onClick={() => setSelectedLead(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const id = selectedLead.id;
                    setSelectedLead(null);
                    if (onOpenConversation) onOpenConversation(id);
                  }}
                  className="px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 font-medium transition-colors"
                >
                  Open in Unified Inbox
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
