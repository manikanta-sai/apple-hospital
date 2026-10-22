import React, { useState } from 'react';
import ChannelIcon from './ChannelIcon';

const INITIAL_RULES = [
  {
    id: 'rule-1',
    title: 'After-Hours Emergency & Triage AI Auto-Responder',
    description: 'Triggers outside OPD operating hours (8:00 PM – 8:00 AM) across WhatsApp, Instagram, Messenger, and Webchat. Verifies emergency red-flag symptoms and offers instant slot booking.',
    channels: ['whatsapp', 'messenger', 'instagram', 'webchat'],
    trigger: 'Incoming message outside 8 AM – 8 PM',
    action: 'Send Emergency Hotline + Clinical AI symptom check triage',
    active: true,
    executionsCount: 1420,
    lastFired: '18 minutes ago'
  },
  {
    id: 'rule-2',
    title: 'Automated 24-Hour WhatsApp Appointment Reminder',
    description: 'Sends automated WhatsApp message with location directions, fasting instructions, and interactive "Confirm" or "Reschedule" buttons 24 hours prior to appointment.',
    channels: ['whatsapp'],
    trigger: '24 hours prior to confirmed OPD slot',
    action: 'Send WhatsApp Interactive Template with Quick Actions',
    active: true,
    executionsCount: 894,
    lastFired: '32 minutes ago'
  },
  {
    id: 'rule-3',
    title: 'Automated Lab & Diagnostic Report Dispatch',
    description: 'When pathologist signs off CBC, LFT, or Radiology report in EHR/LIS, securely deliver password-protected PDF directly to patient WhatsApp and Email.',
    channels: ['whatsapp', 'email'],
    trigger: 'EHR/LIS status changed to "Verified & Signed"',
    action: 'Send secure encrypted PDF download link + SMS OTP verification',
    active: true,
    executionsCount: 651,
    lastFired: '2 hours ago'
  },
  {
    id: 'rule-4',
    title: 'Post-Discharge 48-Hour Recovery & CSAT Check-in',
    description: 'Automatically reach out to discharged IPD/Daycare patients 48 hours post-discharge to collect pain scores, medication compliance, and CSAT star rating.',
    channels: ['whatsapp'],
    trigger: '48 hours post-discharge IPD status',
    action: 'Send interactive 1-5 Star Survey + Nurse Callback Request',
    active: true,
    executionsCount: 312,
    lastFired: 'Yesterday'
  },
  {
    id: 'rule-5',
    title: 'Lead Auto-Assignment by Department Specialization',
    description: 'Route inquiries referencing "pregnancy / delivery" to Gynaecology team (Priya Nair), inquiries referencing "chest pain / ECG" to Cardiology triage (Dr. Rajesh Sharma).',
    channels: ['whatsapp', 'messenger', 'instagram', 'threads', 'linkedin', 'webchat', 'email'],
    trigger: 'Keyword classification or Patient chatbot selection',
    action: 'Auto-assign staff + notify in hospital team Slack/Teams',
    active: true,
    executionsCount: 2240,
    lastFired: '4 minutes ago'
  },
  {
    id: 'rule-6',
    title: 'LinkedIn Corporate Healthcare & Executive Health Inquiries',
    description: 'Direct corporate health checkup inquiries from LinkedIn to Hospital Head of Corporate Wellness within 5 minutes.',
    channels: ['linkedin'],
    trigger: 'Inbound message on Hospital LinkedIn Page',
    action: 'Send Corporate Wellness Deck + Notify Head of B2B',
    active: false,
    executionsCount: 88,
    lastFired: '3 days ago'
  }
];

export default function CrmAutomationView() {
  const [rules, setRules] = useState(INITIAL_RULES);
  const [notification, setNotification] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newRuleTitle, setNewRuleTitle] = useState('');
  const [newRuleTrigger, setNewRuleTrigger] = useState('Patient misses appointment slot');
  const [newRuleAction, setNewRuleAction] = useState('Send WhatsApp "We missed you" rescheduling link');

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const toggleRule = (id) => {
    setRules(prev =>
      prev.map(r => {
        if (r.id === id) {
          const nextState = !r.active;
          showToast(`"${r.title}" is now ${nextState ? 'Active' : 'Paused'}`);
          return { ...r, active: nextState };
        }
        return r;
      })
    );
  };

  const handleCreateRule = (e) => {
    e.preventDefault();
    if (!newRuleTitle.trim()) return;
    const newRule = {
      id: `rule-${Date.now()}`,
      title: newRuleTitle,
      description: 'Custom configured automation rule for omnichannel patient engagement.',
      channels: ['whatsapp', 'webchat'],
      trigger: newRuleTrigger,
      action: newRuleAction,
      active: true,
      executionsCount: 0,
      lastFired: 'Never'
    };
    setRules(prev => [newRule, ...prev]);
    setShowNewModal(false);
    setNewRuleTitle('');
    showToast('New automation workflow rule created successfully!');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-medium flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-3">
          <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {notification}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Hospital Omnichannel Automations</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {rules.filter(r => r.active).length} Active Workflows
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Event-driven triggers, WhatsApp automated reminders, AI symptom triage, and post-discharge surveys.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2 text-xs font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Automation Workflow
        </button>
      </div>

      {/* Automation Cards Grid */}
      <div className="flex-1 overflow-auto p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rules.map(rule => (
            <div
              key={rule.id}
              className={`p-5 rounded-2xl border transition-all bg-white shadow-sm flex flex-col justify-between ${
                rule.active ? 'border-slate-200 hover:border-teal-300 hover:shadow-md' : 'border-slate-200 bg-slate-50/70 opacity-75'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                      rule.active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {rule.active ? '● Active' : '○ Paused'}
                    </span>
                    <div className="flex items-center gap-1">
                      {rule.channels.map(ch => (
                        <div key={ch} className="p-1 rounded bg-slate-100" title={ch}>
                          <ChannelIcon channel={ch} size={14} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rule.active}
                      onChange={() => toggleRule(rule.id)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mt-3 leading-snug">{rule.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{rule.description}</p>

                {/* Trigger -> Action pill */}
                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-500 text-[10px] uppercase tracking-wider w-14">Trigger:</span>
                    <span className="font-mono text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 truncate">
                      {rule.trigger}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-teal-700 text-[10px] uppercase tracking-wider w-14">Action:</span>
                    <span className="font-medium text-teal-900 truncate">
                      {rule.action}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-3">
                  <span><strong>{rule.executionsCount.toLocaleString()}</strong> triggers</span>
                  <span>•</span>
                  <span>Fired {rule.lastFired}</span>
                </div>
                <button
                  onClick={() => showToast(`Simulated test run sent for "${rule.title}"`)}
                  className="font-medium text-teal-700 hover:text-teal-800 hover:underline"
                >
                  Test Rule
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Rule Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">Create Omnichannel Automation Rule</h3>
              <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateRule} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Missed Appointment Rescheduling Follow-up"
                  value={newRuleTitle}
                  onChange={e => setNewRuleTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Trigger Event</label>
                <select
                  value={newRuleTrigger}
                  onChange={e => setNewRuleTrigger(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500"
                >
                  <option value="Patient misses appointment slot">Patient misses appointment slot (No-show)</option>
                  <option value="Lab test report ready">Lab test report finalized & signed</option>
                  <option value="New WhatsApp inquiry from unregistered number">New WhatsApp inquiry from unregistered number</option>
                  <option value="Billing pending after OPD consultation">Billing pending after OPD consultation</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Automated Action</label>
                <select
                  value={newRuleAction}
                  onChange={e => setNewRuleAction(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500"
                >
                  <option value="Send WhatsApp 'We missed you' rescheduling link">Send WhatsApp "We missed you" rescheduling link</option>
                  <option value="Send PDF report via WhatsApp + SMS notification">Send PDF report via WhatsApp + SMS notification</option>
                  <option value="Assign to On-Duty Medical Officer & send greeting">Assign to On-Duty Medical Officer & send greeting</option>
                  <option value="Send secure payment gateway link with invoice">Send secure payment gateway link with invoice</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700"
                >
                  Save & Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
