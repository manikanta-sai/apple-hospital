import React, { useState } from 'react';
import ChannelIcon from './ChannelIcon';
import { CONNECTED_CHANNELS_STATUS } from './crmMockData';

export default function CrmSettingsView() {
  const [activeTab, setActiveTab] = useState('channels'); // 'channels' | 'compliance' | 'team' | 'canned'
  const [channels, setChannels] = useState(CONNECTED_CHANNELS_STATUS);
  const [notification, setNotification] = useState(null);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleChannel = (id) => {
    setChannels(prev =>
      prev.map(c => {
        if (c.id === id) {
          const nextState = !c.connected;
          showToast(`${c.name} integration ${nextState ? 'Connected' : 'Disconnected'}`);
          return { ...c, connected: nextState };
        }
        return c;
      })
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-medium flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-3">
          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {notification}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">CRM & Omnichannel Channel Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure messaging webhooks, WhatsApp Cloud API tokens, HIPAA privacy controls, and staff permissions.
          </p>
        </div>

        {/* Tab switch */}
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5">
          {[
            { id: 'channels', label: 'Connected Channels' },
            { id: 'compliance', label: 'HIPAA & Privacy' },
            { id: 'team', label: 'Team Roles' },
            { id: 'canned', label: 'Canned Replies' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'channels' && (
          <div className="space-y-4 max-w-4xl">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h2 className="text-sm font-bold text-slate-900 mb-1">Omnichannel Inbound Webhooks & APIs</h2>
              <p className="text-xs text-slate-500 mb-4">
                Connect your hospital’s official social, messaging, and email accounts to centralize all conversations in the Unified Inbox.
              </p>

              <div className="space-y-3">
                {channels.map(ch => (
                  <div key={ch.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-4 hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white shadow-sm border border-slate-200">
                        <ChannelIcon channel={ch.id} size={22} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-bold text-slate-900">{ch.name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            ch.connected ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {ch.connected ? 'Connected' : 'Disconnected'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                          Account: {ch.account} • {ch.dailyVolume} msgs/day
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => showToast(`Configuring ${ch.name} webhook endpoints...`)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        Configure
                      </button>
                      <button
                        onClick={() => toggleChannel(ch.id)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                          ch.connected ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200' : 'bg-teal-600 text-white hover:bg-teal-700'
                        }`}
                      >
                        {ch.connected ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Webchat Widget Embed Code */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Website Chatbot Embed Code</h3>
              <p className="text-xs text-slate-500 mt-1 mb-3">
                Paste this script snippet before the closing &lt;/body&gt; tag of your hospital website to enable the live chatbot.
              </p>
              <div className="bg-slate-900 text-slate-200 p-3.5 rounded-xl font-mono text-[11px] overflow-x-auto relative group">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('<script src="https://hospital-widget.cdn.health/v1/inbox.js" data-hospital-id="HOSP-4920" async></script>');
                    showToast('Embed script copied to clipboard!');
                  }}
                  className="absolute right-3 top-3 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded transition-colors"
                >
                  Copy Snippet
                </button>
                <code>
                  {`<script src="https://hospital-widget.cdn.health/v1/inbox.js" data-hospital-id="HOSP-4920" async></script>`}
                </code>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="max-w-4xl space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-lg border border-teal-200">
                  🛡️
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">HIPAA & NABH Patient Privacy Safeguards</h2>
                  <p className="text-xs text-slate-500">Security configurations active across all messaging channels</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {[
                  {
                    title: 'End-to-End Encryption',
                    desc: 'AES-256 for data at rest, TLS 1.3 for data in transit across all WhatsApp and Webchat connections.',
                    status: 'Enabled (Enforced)'
                  },
                  {
                    title: 'PHI / PII Redaction',
                    desc: 'Automatic masking of national IDs, credit card numbers, and raw lab values in staff preview screens.',
                    status: 'Enabled'
                  },
                  {
                    title: 'Role-Based Access Control (RBAC)',
                    desc: 'Only authorized clinical personnel can view medical prescriptions and clinical diagnostics.',
                    status: 'Active (Tier 3)'
                  },
                  {
                    title: 'Comprehensive Audit Logs',
                    desc: 'Every message view, export, and note edit is logged with timestamp, user ID, and IP address for 7 years.',
                    status: 'Active'
                  }
                ].map(item => (
                  <div key={item.title} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-900">{item.title}</h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-900 mb-1">Hospital Staff & Department Assignment</h2>
            <p className="text-xs text-slate-500 mb-4">
              Manage clinical responders, OPD receptionists, and tele-consultation coordinators.
            </p>

            <div className="space-y-3">
              {[
                { name: 'Dr. Rajesh Sharma, MD', role: 'Head of Cardiology', status: 'Available', email: 'rajesh.sharma@hospital.org' },
                { name: 'Priya Nair, MHA', role: 'Patient Relations Lead', status: 'Available', email: 'priya.nair@hospital.org' },
                { name: 'Dr. Sunita Rao, MD', role: 'Senior Obstetrician', status: 'In OPD Consultation', email: 'sunita.rao@hospital.org' },
                { name: 'Megan Chen, RN', role: 'Triage Nurse', status: 'On Break', email: 'megan.chen@hospital.org' },
                { name: 'Dr. Anand Verma, DM', role: 'Neurology Consultant', status: 'Available', email: 'anand.verma@hospital.org' }
              ].map(staff => (
                <div key={staff.name} className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-xs">
                      {staff.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{staff.name}</h3>
                      <p className="text-[11px] text-slate-500">{staff.role} • {staff.email}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    {staff.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'canned' && (
          <div className="max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-900 mb-1">Pre-Approved Clinical Quick Replies</h2>
            <p className="text-xs text-slate-500 mb-4">
              Standardized, doctor-verified message templates that agents can insert with one click or slash commands.
            </p>

            <div className="space-y-3">
              {[
                { label: 'Booking Confirmation', code: '/book', text: 'Your OPD appointment has been confirmed with Dr. {doctor} for {date} at {time}. Please arrive 15 minutes prior for vitals check.' },
                { label: 'Fasting Lab Instructions', code: '/fasting', text: 'For your scheduled blood profile (Fasting Blood Sugar & Lipid Panel), please observe 10 to 12 hours of overnight fasting. Plain water is permitted.' },
                { label: 'Telehealth Video Link', code: '/video', text: 'Here is your encrypted HD Tele-consultation video link: https://telehealth.hospital.org/room/{roomId}. Please ensure camera permissions are granted.' },
                { label: 'Emergency Notice', code: '/emergency', text: 'If you or the patient are experiencing severe acute chest pain, breathlessness, or loss of consciousness, please call 108 or proceed immediately to the Emergency Room.' }
              ].map(tpl => (
                <div key={tpl.label} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{tpl.label}</span>
                      <span className="font-mono text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                        {tpl.code}
                      </span>
                    </div>
                    <button
                      onClick={() => showToast(`Template "${tpl.label}" ready to use`)}
                      className="text-xs text-teal-700 font-semibold hover:underline"
                    >
                      Edit Template
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">{tpl.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
