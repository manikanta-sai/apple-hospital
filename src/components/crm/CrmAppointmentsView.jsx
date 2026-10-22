import React, { useState, useMemo } from 'react';
import ChannelIcon from './ChannelIcon';
import { INITIAL_CONVERSATIONS, STAFF_MEMBERS } from './crmMockData';

const APPOINTMENTS_SAMPLE = [
  {
    id: 'apt-101',
    patientName: 'Anita Verma',
    phone: '+91 98765 43210',
    uhid: 'UHID-88392',
    channel: 'whatsapp',
    department: 'Obstetrics & Gynaecology',
    doctor: 'Dr. Sunita Rao, MD (OB/GYN)',
    date: '2026-10-23',
    time: '10:30 AM',
    room: 'Room 204 (OB/GYN Wing)',
    type: 'In-Person Consultation',
    status: 'confirmed',
    fee: '₹800',
    paid: true
  },
  {
    id: 'apt-102',
    patientName: 'Vikram Singh',
    phone: '+91 94231 87654',
    uhid: 'UHID-44129',
    channel: 'messenger',
    department: 'Cardiology',
    doctor: 'Dr. Rajesh Sharma, MD (Cardiology)',
    date: '2026-10-23',
    time: '11:15 AM',
    room: 'Room 104 (Cardiac OPD)',
    type: 'In-Person Consultation',
    status: 'in_room',
    fee: '₹1,200',
    paid: true
  },
  {
    id: 'apt-103',
    patientName: 'Rajesh Patel',
    phone: '+91 99887 66554',
    uhid: 'UHID-71029',
    channel: 'instagram',
    department: 'Cardiology',
    doctor: 'Dr. Rajesh Sharma, MD (Cardiology)',
    date: '2026-10-23',
    time: '02:00 PM',
    room: 'Telehealth Suite 1',
    type: 'HD Video Telehealth',
    status: 'checked_in',
    fee: '₹1,000',
    paid: true
  },
  {
    id: 'apt-104',
    patientName: 'Pooja Nair',
    phone: '+91 98112 33445',
    uhid: 'UHID-55910',
    channel: 'threads',
    department: 'Pediatrics',
    doctor: 'Dr. Kavita Joshi, MD (Pediatrics)',
    date: '2026-10-23',
    time: '03:30 PM',
    room: 'Room 108 (Pediatrics Wing)',
    type: 'Vaccination & Checkup',
    status: 'confirmed',
    fee: '₹600',
    paid: false
  },
  {
    id: 'apt-105',
    patientName: 'Amit Saxena',
    phone: '+91 97722 88190',
    uhid: 'UHID-31298',
    channel: 'email',
    department: 'Orthopedics',
    doctor: 'Dr. Vivek Anand, MS (Ortho)',
    date: '2026-10-24',
    time: '09:45 AM',
    room: 'Room 302 (Orthopedics)',
    type: 'MRI / Knee Consult',
    status: 'confirmed',
    fee: '₹1,500',
    paid: false
  },
  {
    id: 'apt-106',
    patientName: 'Dr. Aris Thorne',
    phone: '+1 415 889 0122',
    uhid: 'UHID-99201',
    channel: 'linkedin',
    department: 'Neurology',
    doctor: 'Dr. Anand Verma, DM (Neurology)',
    date: '2026-10-24',
    time: '04:00 PM',
    room: 'Executive Suite 4',
    type: 'Second Medical Opinion',
    status: 'confirmed',
    fee: '₹3,000',
    paid: true
  }
];

const STATUS_MAP = {
  confirmed: { label: 'Confirmed', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  checked_in: { label: 'Checked In', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
  in_room: { label: 'In Room', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
  completed: { label: 'Completed', bg: 'bg-slate-100 text-slate-700 border-slate-200' },
  cancelled: { label: 'Cancelled', bg: 'bg-rose-50 text-rose-700 border-rose-200' }
};

export default function CrmAppointmentsView({ onOpenConversation }) {
  const [appointments, setAppointments] = useState(APPOINTMENTS_SAMPLE);
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState('2026-10-23');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'
  const [actionNotice, setActionNotice] = useState(null);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      if (statusFilter !== 'all' && apt.status !== statusFilter) return false;
      if (selectedDate && apt.date !== selectedDate && viewMode === 'list') return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          apt.patientName.toLowerCase().includes(q) ||
          apt.doctor.toLowerCase().includes(q) ||
          apt.department.toLowerCase().includes(q) ||
          apt.phone.includes(q)
        );
      }
      return true;
    });
  }, [appointments, statusFilter, selectedDate, search, viewMode]);

  const showNotification = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleStatusChange = (id, newStatus) => {
    setAppointments(prev =>
      prev.map(a => (a.id === id ? { ...a, status: newStatus } : a))
    );
    showNotification(`Appointment status updated to ${STATUS_MAP[newStatus]?.label || newStatus}`);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Toast Notification */}
      {actionNotice && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-medium flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-3">
          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {actionNotice}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Hospital Appointments & Schedules</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              {filteredAppointments.length} Bookings
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time omnichannel booking sync across WhatsApp, Website Chatbot, Instagram, and Reception.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'calendar' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Calendar Schedule
            </button>
          </div>

          <button
            onClick={() => {
              const name = prompt('Patient Name:');
              if (!name) return;
              const dept = prompt('Department:', 'Cardiology');
              const time = prompt('Time slot (e.g. 11:30 AM):', '11:30 AM');
              const newApt = {
                id: `apt-${Date.now()}`,
                patientName: name,
                phone: '+91 98000 00000',
                uhid: `UHID-${Math.floor(10000 + Math.random() * 90000)}`,
                channel: 'whatsapp',
                department: dept || 'Cardiology',
                doctor: 'Dr. Rajesh Sharma, MD',
                date: selectedDate || '2026-10-23',
                time: time || '11:30 AM',
                room: 'Room 104',
                type: 'In-Person Consultation',
                status: 'confirmed',
                fee: '₹1,000',
                paid: false
              };
              setAppointments(prev => [newApt, ...prev]);
              showNotification(`Booked appointment for ${name}`);
            }}
            className="px-3.5 py-2 text-xs font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Book New Slot
          </button>
        </div>
      </div>

      {/* Toolbar Filter */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date Picker */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs">
            <span className="text-slate-500 font-medium">Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="bg-transparent text-slate-800 text-xs focus:outline-none cursor-pointer"
            />
          </div>

          {/* Quick Date buttons */}
          <button
            onClick={() => setSelectedDate('2026-10-23')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
              selectedDate === '2026-10-23' ? 'bg-teal-50 text-teal-700 border-teal-300' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setSelectedDate('2026-10-24')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
              selectedDate === '2026-10-24' ? 'bg-teal-50 text-teal-700 border-teal-300' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Tomorrow
          </button>
          <button
            onClick={() => setSelectedDate('')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
              !selectedDate ? 'bg-teal-50 text-teal-700 border-teal-300' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Dates
          </button>

          {/* Search */}
          <div className="relative min-w-[200px]">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter by patient or doctor..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <svg className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded-full ${
              statusFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {Object.entries(STATUS_MAP).map(([sKey, sVal]) => (
            <button
              key={sKey}
              onClick={() => setStatusFilter(sKey)}
              className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                statusFilter === sKey ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sVal.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-6">
        {viewMode === 'list' ? (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Time & Slot</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Doctor & Department</th>
                  <th className="py-3 px-4">Channel Origin</th>
                  <th className="py-3 px-4">Type & Room</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      No appointments found for the selected date and filters.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map(apt => {
                    const st = STATUS_MAP[apt.status] || STATUS_MAP.confirmed;
                    return (
                      <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-800 text-sm">
                          {apt.time}
                          <span className="block text-[11px] font-normal font-sans text-slate-400">{apt.date}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900">{apt.patientName}</div>
                          <div className="text-[11px] text-slate-500">{apt.phone} • {apt.uhid}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-800">{apt.doctor}</div>
                          <div className="text-[11px] text-teal-700">{apt.department}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <ChannelIcon channel={apt.channel} size={16} />
                            <span className="capitalize font-medium text-slate-700 text-xs">{apt.channel}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="text-slate-800 font-medium">{apt.type}</div>
                          <div className="text-[11px] text-slate-500">{apt.room}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <select
                            value={apt.status}
                            onChange={e => handleStatusChange(apt.id, e.target.value)}
                            className={`text-[11px] font-semibold rounded-full px-2.5 py-1 border transition-colors cursor-pointer ${st.bg}`}
                          >
                            {Object.entries(STATUS_MAP).map(([k, v]) => (
                              <option key={k} value={k}>{v.label}</option>
                            ))}
                          </select>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                            apt.paid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {apt.fee} {apt.paid ? '(Paid)' : '(Unpaid)'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                showNotification(`WhatsApp reminder sent to ${apt.patientName} (${apt.phone})`);
                              }}
                              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
                              title="Send Reminder via WhatsApp"
                            >
                              Remind
                            </button>
                            <button
                              onClick={() => {
                                if (onOpenConversation) {
                                  onOpenConversation(apt.id.replace('apt-10', 'conv-'));
                                }
                              }}
                              className="px-2.5 py-1 rounded bg-teal-50 hover:bg-teal-100 text-teal-700 font-medium text-xs border border-teal-200 transition-colors"
                            >
                              Chat
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
        ) : (
          /* Calendar Schedule View */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Morning Slots (09:00 AM - 12:00 PM)', 'Afternoon Slots (12:00 PM - 04:00 PM)', 'Evening Slots (04:00 PM - 08:00 PM)'].map((slotGroup, idx) => {
              const groupSlots = filteredAppointments.filter((_, i) => i % 3 === idx);
              return (
                <div key={slotGroup} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">{slotGroup}</h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {groupSlots.length}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {groupSlots.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400">No appointments booked</div>
                    ) : (
                      groupSlots.map(apt => (
                        <div key={apt.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:border-teal-300 hover:bg-teal-50/30 transition-all">
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                              {apt.time}
                            </span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_MAP[apt.status]?.bg}`}>
                              {STATUS_MAP[apt.status]?.label}
                            </span>
                          </div>

                          <div className="mt-2">
                            <h4 className="font-bold text-slate-900 text-xs">{apt.patientName}</h4>
                            <p className="text-[11px] text-slate-500">{apt.department} • {apt.doctor}</p>
                          </div>

                          <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1 text-slate-500">
                              <ChannelIcon channel={apt.channel} size={14} />
                              <span className="capitalize">{apt.channel}</span>
                            </div>
                            <button
                              onClick={() => showNotification(`Calling ${apt.patientName} to ${apt.room}`)}
                              className="text-teal-700 font-semibold hover:underline"
                            >
                              Call to Desk
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
