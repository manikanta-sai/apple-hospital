import React from "react";
import {
  LayoutDashboard,
  CalendarDays,
  User,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  Clock,
  Sparkles,
} from "lucide-react";

export default function OpdSidebar({
  activeMenu = "dashboard",
  onSelectMenu = () => {},
  waitingCount = 0,
  isCollapsed = false,
  onToggleCollapse = () => {},
  onNavigateHome = () => {},
  doctorStatus = "ON DUTY",
}) {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      subtitle: "Doctor Overview & Metrics",
      icon: LayoutDashboard,
    },
    {
      id: "appointments",
      label: "Appointments",
      subtitle: "OPD Queue & Triage Desk",
      icon: CalendarDays,
      badge: waitingCount > 0 ? waitingCount : null,
      badgeColor: "bg-teal-100 text-teal-800",
    },
    {
      id: "profile",
      label: "Doctor Profile",
      subtitle: "Credentials & Clinic Timings",
      icon: User,
    },
  ];

  // Sync doctor profile name & avatar from localStorage with live reactive listener
  const [doctorProfile, setDoctorProfile] = React.useState(() => {
    try {
      const saved = localStorage.getItem("opd_doctor_profile_data");
      if (saved) return JSON.parse(saved);
    } catch {}
    return { name: "Dr. Rajesh Sharma, MD", avatarUrl: "" };
  });

  React.useEffect(() => {
    const handleProfileUpdate = () => {
      try {
        const saved = localStorage.getItem("opd_doctor_profile_data");
        if (saved) setDoctorProfile(JSON.parse(saved));
      } catch {}
    };

    window.addEventListener("doctor_profile_updated", handleProfileUpdate);
    window.addEventListener("storage", handleProfileUpdate);

    return () => {
      window.removeEventListener("doctor_profile_updated", handleProfileUpdate);
      window.removeEventListener("storage", handleProfileUpdate);
    };
  }, []);

  const doctorName = doctorProfile?.name || "Dr. Rajesh Sharma, MD";
  const doctorAvatar = doctorProfile?.avatarUrl || "";

  return (
    <aside
      style={{
        background: "rgba(255, 255, 255, 0.94)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(0, 0, 0, 0.08)",
      }}
      className={`h-screen sticky top-0 flex flex-col justify-between transition-all duration-300 z-40 select-none ${
        isCollapsed ? "w-20" : "w-64 sm:w-72"
      }`}
    >
      {/* ── Top Branding & Hospital Logo ── */}
      <div>
        <div
          className={`border-b border-slate-100 flex items-center transition-all ${
            isCollapsed ? "flex-col gap-2.5 p-3.5" : "p-4 sm:p-5 justify-between"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-700 to-sky-600 flex items-center justify-center text-white font-black text-lg shadow-sm shrink-0">
              <Stethoscope size={20} />
            </div>

            {!isCollapsed && (
              <div className="min-w-0">
                <h1 className="font-bold text-sm text-slate-900 leading-tight truncate">
                  ABCD Multispecialty
                </h1>
                <p className="text-[11px] font-semibold text-teal-700 leading-none mt-0.5">
                  OPD Doctor Suite
                </p>
              </div>
            )}
          </div>

          {/* Prominent High-Contrast Collapse / Expand Toggle Button */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className={`transition-all cursor-pointer flex items-center justify-center ${
              isCollapsed
                ? "w-full py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl border border-teal-200/90 shadow-2xs"
                : "p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            }`}
            title={isCollapsed ? "Expand Menu" : "Collapse Menu"}
            aria-label={isCollapsed ? "Expand menu" : "Collapse menu"}
          >
            {isCollapsed ? (
              <ChevronRight size={18} className="stroke-[2.5] text-teal-700" />
            ) : (
              <ChevronLeft size={16} />
            )}
          </button>
        </div>

        {/* ── Navigation Menu Items (Properly Centered in Minimized State) ── */}
        <nav className={`space-y-1.5 ${isCollapsed ? "p-2.5" : "p-3 sm:p-4"}`}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectMenu(item.id)}
                className={`w-full flex items-center rounded-2xl transition-all cursor-pointer group ${
                  isCollapsed ? "justify-center p-2.5" : "gap-3.5 p-3 text-left"
                } ${
                  isActive
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/10 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-semibold"
                }`}
                title={item.label}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? "bg-white/15 text-white"
                      : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                  }`}
                >
                  <Icon size={18} />
                </div>

                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm tracking-tight truncate block">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isActive
                              ? "bg-teal-400 text-slate-950"
                              : item.badgeColor
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[10.5px] truncate block font-normal mt-0.5 ${
                        isActive ? "text-slate-300" : "text-slate-400"
                      }`}
                    >
                      {item.subtitle}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Bottom Section: Doctor Duty Status & Back Link ── */}
      <div className={`border-t border-slate-100 space-y-3 ${isCollapsed ? "p-2.5" : "p-3 sm:p-4"}`}>
        {/* Doctor Live Status Pill */}
        <div
          className={`p-2 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center ${
            isCollapsed ? "justify-center" : "gap-2.5 p-2.5"
          }`}
          title={`${doctorName} (${doctorStatus})`}
        >
          {doctorAvatar ? (
            <div className="relative shrink-0">
              <img
                src={doctorAvatar}
                alt={doctorName}
                className="w-7 h-7 rounded-xl object-cover border border-slate-200"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
          ) : (
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          )}
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Doctor {doctorStatus}
              </span>
              <strong className="text-xs font-bold text-slate-900 truncate block">
                {doctorName}
              </strong>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
