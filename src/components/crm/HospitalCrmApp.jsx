import React, { useState } from 'react';
import CrmUnifiedInbox from './CrmUnifiedInbox';
import CrmDashboardView from './CrmDashboardView';
import CrmLeadsView from './CrmLeadsView';
import CrmAppointmentsView from './CrmAppointmentsView';
import CrmAutomationView from './CrmAutomationView';
import CrmAnalyticsView from './CrmAnalyticsView';
import CrmSettingsView from './CrmSettingsView';
import CrmAgentSelfReportView from './CrmAgentSelfReportView';
import CrmChannelsReportView from './CrmChannelsReportView';
import CrmAgentProfileModal from './CrmAgentProfileModal';

export default function HospitalCrmApp() {
  const [currentView, setCurrentView] = useState('inbox'); // default to flagship 3-panel Unified Inbox
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [targetConversationId, setTargetConversationId] = useState(null);

  // Agent Profile State (Editable by user)
  const [agentProfile, setAgentProfile] = useState({
    name: "Priya Nair, MHA",
    role: "Lead Patient Care Coordinator & Omnichannel Specialist",
    agentId: "AGENT-704",
    department: "Patient Relations & Clinical Triage Desk",
    email: "priya.nair@applehospital.health",
    phone: "+91 98450 12345",
    status: "Available", // "Available" | "In Call" | "On Break" | "Busy / Triage" | "Offline"
    shift: "Morning Shift (08:00 AM - 04:30 PM)",
    deskNumber: "Desk 12 - Triage Wing",
    languages: "English, Telugu, Hindi",
    bio: "Specializing in patient triage, acute symptom escalation, and OPD slot coordination.",
    totalResolvedToday: 78,
    activeChatSessions: 4,
  });

  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [toastNotification, setToastNotification] = useState(null);

  const showToast = (msg) => {
    setToastNotification(msg);
    setTimeout(() => setToastNotification(null), 3500);
  };

  const handleSaveProfile = (updated) => {
    setAgentProfile(updated);
    showToast(`Profile updated successfully for ${updated.name}!`);
  };

  const NAV_ITEMS = [
    {
      id: 'inbox',
      label: 'Unified Inbox',
      badge: 10,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    {
      id: 'self_report',
      label: 'My Self Report',
      badge: '★ 4.9',
      badgeColor: 'bg-amber-500 text-white',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      id: 'channels_report',
      label: 'Channels Performance',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      )
    },
    {
      id: 'dashboard',
      label: 'Executive Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    },
    {
      id: 'leads',
      label: 'Leads & Patients',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'automation',
      label: 'Automations',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      id: 'analytics',
      label: 'Analytics & SLA',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  const handleOpenConversationFromChild = (convId) => {
    setTargetConversationId(convId);
    setCurrentView('inbox');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans text-slate-800">
      {/* Toast Notification */}
      {toastNotification && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-3">
          <span className="text-emerald-400">✓</span>
          <span>{toastNotification}</span>
        </div>
      )}

      {/* LEFT NAVIGATION SIDEBAR */}
      <aside
        className={`bg-slate-900 text-slate-300 flex flex-col justify-between transition-all duration-200 z-30 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        } hidden md:flex flex-shrink-0 select-none border-r border-slate-800`}
      >
        {/* Brand Header */}
        <div>
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-black text-sm shadow-md flex-shrink-0">
                  
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-white tracking-wide">
                    ABCD CRM
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">Omnichannel Hospital Inbox</div>
                </div>
              </div>
            )}

            {sidebarCollapsed && (
              <div className="w-8 h-8 mx-auto rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-black text-sm shadow-md">
                
              </div>
            )}

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <svg className={`w-4 h-4 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-2 space-y-1 mt-2">
            {NAV_ITEMS.map(item => {
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? 'bg-teal-600 text-white shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <span className={`${active ? 'text-white' : 'text-slate-400'}`}>
                    {item.icon}
                  </span>

                  {!sidebarCollapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}

                  {!sidebarCollapsed && item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor || 'bg-rose-500 text-white'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom AGENT PROFILE Card (Clickable to Edit) & Exit Link */}
        <div className="p-3 border-t border-slate-800/80 space-y-2">
          {/* Back to Hospital Dashboard */}
          <button
            onClick={() => {
              window.location.href = '/';
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            title="Return to Hospital Home"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {!sidebarCollapsed && <span className="truncate">Exit to Portal</span>}
          </button>

          {/* AGENT PROFILE CARD (Replaces Doctor on Duty) */}
          <div
            onClick={() => setShowEditProfileModal(true)}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 cursor-pointer transition-all group"
            title="Click to edit Agent Profile & Shift Status"
          >
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 text-slate-950 font-black flex items-center justify-center text-xs shadow-md">
                {agentProfile.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${
                agentProfile.status === 'Available' ? 'bg-emerald-500' :
                agentProfile.status === 'In Call' ? 'bg-amber-500' :
                agentProfile.status === 'On Break' ? 'bg-blue-500' :
                agentProfile.status === 'Busy / Triage' ? 'bg-purple-500' : 'bg-slate-500'
              }`} />
            </div>

            {!sidebarCollapsed && (
              <div className="truncate text-left flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white truncate group-hover:text-teal-300 transition-colors">
                    {agentProfile.name}
                  </span>
                  <span className="text-[10px] text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                    Edit ✎
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {agentProfile.role}
                </div>
                <div className="text-[9px] text-emerald-400 font-medium truncate mt-0.5 flex items-center gap-1">
                  <span>● {agentProfile.status}</span>
                  <span>•</span>
                  <span>{agentProfile.agentId}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-64 bg-slate-900 text-slate-300 flex flex-col justify-between p-4 shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="font-bold text-white text-sm flex items-center gap-2">
                  <span className="text-teal-400"></span> ABCD CRM
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <nav className="mt-4 space-y-1">
                {NAV_ITEMS.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium ${
                      currentView === item.id ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
            <button
              onClick={() => { window.location.href = '/'; }}
              className="w-full flex items-center gap-2 text-xs text-slate-400 hover:text-white p-2"
            >
              ← Back to Hospital Home
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Mobile Header Bar */}
        <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <button onClick={() => setMobileMenuOpen(true)} className="p-1 rounded text-slate-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="font-bold text-sm"> ABCD CRM</span>
          </div>
          <button
            onClick={() => setShowEditProfileModal(true)}
            className="text-xs text-teal-400 font-semibold flex items-center gap-1"
          >
            <span>{agentProfile.name.split(' ')[0]}</span>
            <span>✎</span>
          </button>
        </div>

        {/* View Switcher Container */}
        <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {currentView === 'inbox' && (
            <CrmUnifiedInbox
              targetConversationId={targetConversationId}
              agentProfile={agentProfile}
            />
          )}

          {currentView === 'self_report' && (
            <CrmAgentSelfReportView
              agentProfile={agentProfile}
              onNavigateToInbox={() => setCurrentView('inbox')}
            />
          )}

          {currentView === 'channels_report' && (
            <CrmChannelsReportView
              onOpenConversation={handleOpenConversationFromChild}
            />
          )}

          {currentView === 'dashboard' && (
            <CrmDashboardView onNavigateToInbox={() => setCurrentView('inbox')} />
          )}

          {currentView === 'leads' && (
            <CrmLeadsView onOpenConversation={handleOpenConversationFromChild} />
          )}

          {currentView === 'appointments' && (
            <CrmAppointmentsView onOpenConversation={handleOpenConversationFromChild} />
          )}

          {currentView === 'automation' && (
            <CrmAutomationView />
          )}

          {currentView === 'analytics' && (
            <CrmAnalyticsView />
          )}

          {currentView === 'settings' && (
            <CrmSettingsView />
          )}
        </main>
      </div>

      {/* Agent Profile Edit Modal */}
      {showEditProfileModal && (
        <CrmAgentProfileModal
          agentProfile={agentProfile}
          onSave={handleSaveProfile}
          onClose={() => setShowEditProfileModal(false)}
        />
      )}
    </div>
  );
}
