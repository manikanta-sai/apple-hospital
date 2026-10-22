import React, { useState } from 'react';

export default function CrmAgentProfileModal({ agentProfile, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: agentProfile?.name || "Priya Nair, MHA",
    role: agentProfile?.role || "Senior Patient Care Coordinator & Omnichannel Lead",
    agentId: agentProfile?.agentId || "AGENT-704",
    department: agentProfile?.department || "Patient Relations & Triage Desk",
    email: agentProfile?.email || "priya.nair@applehospital.health",
    phone: agentProfile?.phone || "+91 98450 12345",
    status: agentProfile?.status || "Available",
    shift: agentProfile?.shift || "Morning Shift (08:00 AM - 04:30 PM)",
    deskNumber: agentProfile?.deskNumber || "Desk 12 - Cardiac & Gynaec Wing",
    languages: agentProfile?.languages || "English, Telugu, Hindi",
    bio: agentProfile?.bio || "Specializing in patient triage, acute symptom escalation, and OPD slot coordination."
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500 text-slate-950 font-bold flex items-center justify-center text-sm shadow-sm">
              {formData.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <h2 className="text-base font-bold">Edit Agent Profile</h2>
              <p className="text-xs text-slate-400">Apple Multispecialty Hospital CRM • {formData.agentId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          {/* Availability Status Selector */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Live Duty Status</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { status: "Available", bg: "bg-emerald-50 text-emerald-700 border-emerald-300" },
                { status: "In Call", bg: "bg-amber-50 text-amber-700 border-amber-300" },
                { status: "On Break", bg: "bg-blue-50 text-blue-700 border-blue-300" },
                { status: "Busy / Triage", bg: "bg-purple-50 text-purple-700 border-purple-300" },
                { status: "Offline", bg: "bg-slate-100 text-slate-700 border-slate-300" }
              ].map(st => (
                <button
                  type="button"
                  key={st.status}
                  onClick={() => setFormData({ ...formData, status: st.status })}
                  className={`py-1.5 px-2 rounded-lg border text-xs font-semibold text-center transition-all ${
                    formData.status === st.status ? `${st.bg} ring-2 ring-teal-500 ring-offset-1` : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  ● {st.status}
                </button>
              ))}
            </div>
          </div>

          {/* Name & Agent ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Agent Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Agent Staff ID</label>
              <input
                type="text"
                required
                value={formData.agentId}
                onChange={e => setFormData({ ...formData, agentId: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:bg-white font-mono"
              />
            </div>
          </div>

          {/* Role & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Designation / Role</label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Work Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Direct Extension / Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Shift & Desk Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Shift Hours</label>
              <input
                type="text"
                value={formData.shift}
                onChange={e => setFormData({ ...formData, shift: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Desk Location</label>
              <input
                type="text"
                value={formData.deskNumber}
                onChange={e => setFormData({ ...formData, deskNumber: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Languages */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Supported Languages</label>
            <input
              type="text"
              value={formData.languages}
              onChange={e => setFormData({ ...formData, languages: e.target.value })}
              placeholder="e.g. English, Telugu, Hindi, Kannada"
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:bg-white"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Triage Specialization / Bio</label>
            <textarea
              rows={2}
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:bg-white"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
