import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Layers,
  PlusSquare,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  Calendar,
  X,
  Users,
  UserCheck,
  HeartPulse,
  Bed,
  Package,
  Ambulance,
  Activity,
  Sparkles,
} from "lucide-react";
import RouteTopBar from "../common/RouteTopBar.jsx";
import AnimatedCounter from "../common/AnimatedCounter.jsx";
import ScrollReveal from "../common/ScrollReveal.jsx";
import { AnimatedKpiCard } from "../common/ChartAnimations.jsx";
import { getHospitalStatsFromDb } from "../../services/hospitalStatsService.js";

export default function HospitalStatsDashboard({ navigateTo }) {
  const [timeRange, setTimeRange] = useState("Today");
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState("2nd Floor");
  const [showFloorDropdown, setShowFloorDropdown] = useState(false);
  const [showAllNursesModal, setShowAllNursesModal] = useState(false);
  const [statsData, setStatsData] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  // Load telemetry stats from IndexedDB whenever timeRange changes
  useEffect(() => {
    let isMounted = true;
    setIsLoadingStats(true);
    getHospitalStatsFromDb(timeRange)
      .then((data) => {
        if (isMounted && data) {
          setStatsData(data);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoadingStats(false);
      });

    return () => {
      isMounted = false;
    };
  }, [timeRange]);

  // Fallback defaults while loading or on initial render
  const defaultFloorData = {
    "4th Floor": {
      cases: 198,
      status: "LOW LOAD",
      statusColor: "bg-blue-600 text-white",
      badgeBorder: "border-blue-300",
      generalTotal: 30,
      generalAvail: 22,
      privateTotal: 18,
      privateAvail: 15,
    },
    "3rd Floor": {
      cases: 312,
      status: "OPTIMAL",
      statusColor: "bg-teal-600 text-white",
      badgeBorder: "border-teal-300",
      generalTotal: 36,
      generalAvail: 15,
      privateTotal: 24,
      privateAvail: 8,
    },
    "2nd Floor": {
      cases: 543,
      status: "CONGESTED",
      statusColor: "bg-rose-600 text-white",
      badgeBorder: "border-rose-300",
      generalTotal: 47,
      generalAvail: 10,
      privateTotal: 28,
      privateAvail: 13,
    },
    "1st Floor": {
      cases: 489,
      status: "STABLE",
      statusColor: "bg-emerald-600 text-white",
      badgeBorder: "border-emerald-300",
      generalTotal: 40,
      generalAvail: 18,
      privateTotal: 20,
      privateAvail: 12,
    },
  };

  const currentFloors = statsData?.floors || defaultFloorData;
  const activeFloorStats = currentFloors[selectedFloor] || currentFloors["2nd Floor"];

  const currentPatients = statsData?.patients || {
    total: 253,
    regular: 143,
    critical: 11,
    trend: "+19%",
    trendDirection: "up",
  };

  const currentDoctors = statsData?.doctors || {
    total: 154,
    available: 143,
    unavailable: 11,
    trend: "-7%",
    trendDirection: "down",
  };

  const currentNurses = statsData?.nurses || {
    total: 265,
    available: 203,
    unavailable: 62,
    trend: "+6%",
    trendDirection: "up",
  };

  const currentBeds = statsData?.beds || {
    total: 678,
    available: 298,
    unavailable: 380,
    trend: "+11%",
    trendDirection: "up",
  };

  const currentSupplies = statsData?.medicalSupplies || {
    capacityPct: 68,
    availablePct: 73,
    usedPct: 27,
    trend: "+4%",
    trendDirection: "up",
  };

  const currentAmbulances = statsData?.ambulances || {
    total: 65,
    available: 59,
    out: 6,
    trend: "0%",
    trendDirection: "neutral",
  };

  const nursesList = statsData?.nursesOnDuty || [
    { id: 1, initials: "BC", name: "Beatriz Catita", dept: "Emergency", shift: "4:00 AM - 01:00 PM", color: "rose" },
    { id: 2, initials: "BM", name: "Bruno Madeira", dept: "Emergency", shift: "4:00 AM - 01:00 PM", color: "rose" },
    { id: 3, initials: "CA", name: "Cristiana Araújo", dept: "Pediatric", shift: "5:00 AM - 01:30 PM", color: "teal" },
    { id: 4, initials: "JK", name: "Jakob Kenter", dept: "Pediatric", shift: "6:00 AM - 02:30 PM", color: "teal" },
    { id: 5, initials: "LB", name: "Lincoln Bergson", dept: "Emergency", shift: "6:00 AM - 02:30 PM", color: "amber" },
    { id: 6, initials: "MM", name: "Marília Martins", dept: "Critical Care (ICU)", shift: "7:00 AM - 03:30 PM", color: "purple" },
  ];

  const getDeptBadgeClass = (dept) => {
    if (dept.includes("Emergency")) return "bg-rose-50 text-rose-700 border-rose-200";
    if (dept.includes("Pediatric")) return "bg-teal-50 text-teal-700 border-teal-200";
    if (dept.includes("ICU") || dept.includes("Critical")) return "bg-purple-50 text-purple-700 border-purple-200";
    return "bg-sky-50 text-sky-700 border-sky-200";
  };

  const getAvatarBgClass = (initials, idx) => {
    const colors = [
      "bg-gradient-to-br from-teal-500 to-emerald-600 text-white",
      "bg-gradient-to-br from-sky-500 to-blue-600 text-white",
      "bg-gradient-to-br from-indigo-500 to-purple-600 text-white",
      "bg-gradient-to-br from-rose-500 to-pink-600 text-white",
      "bg-gradient-to-br from-amber-500 to-orange-600 text-white",
      "bg-gradient-to-br from-emerald-500 to-teal-700 text-white",
    ];
    return colors[idx % colors.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/20 to-teal-50/30 text-slate-800 font-sans pb-20 animate-slide-up">
      {/* ── Universal Top Bar matching reference design ── */}
      <RouteTopBar
        onBack={() => navigateTo("/")}
        backLabel="Back to Home"
        hospitalName="APPLE MULTISPECIALTY HOSPITAL"
        badge="TELEMETRY & OPERATIONS"
        badgeBg="#e0f2fe"
        badgeColor="#0369a1"
        title="Hospital Telemetry & Capacity Analytics"
        rightControls={
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              IndexedDB Connected
            </span>

            {/* Time Filter Dropdown (Clickable from DB) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{timeRange}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showTimeDropdown && (
                <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 text-xs">
                  {["Today", "Yesterday", "This Week", "This Month"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setTimeRange(t);
                        setShowTimeDropdown(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 transition-colors flex items-center justify-between ${
                        timeRange === t ? "text-teal-700 font-bold bg-teal-50/60" : "text-slate-700 font-medium"
                      }`}
                    >
                      <span>{t}</span>
                      {timeRange === t && <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        }
      />

      {/* Main Content Dashboard Container */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* ── TOP SECTION: COLORFUL HOSPITAL STATS CARDS ── */}
        <ScrollReveal delay={50}>
          <section className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs transition-all">
            {/* Card Header Line */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-600 flex items-center justify-center font-bold text-xs shadow-2xs">
                  <Activity className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    Hospital Operational KPI Metrics
                  </h2>
                  <p className="text-xs text-slate-400">Real-time bed, staff, and patient load census</p>
                </div>
              </div>

              <div className="text-xs font-semibold text-slate-500 hidden sm:flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Live Telemetry Window: <strong>{timeRange}</strong></span>
              </div>
            </div>

            {/* 6 Top Metric Cards Grid - Colorful, Modern SaaS Card Styling */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
              {/* Card 1: Patients (Vibrant Indigo/Sky theme) */}
              <AnimatedKpiCard index={0} staggerMs={60}>
                <div className="relative overflow-hidden rounded-2xl p-5 border border-sky-100 bg-gradient-to-br from-white via-sky-50/40 to-indigo-50/40 shadow-xs hover:shadow-md hover:border-sky-200 transition-all duration-200 group h-full">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-sky-400/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center border border-sky-500/20 shadow-2xs">
                          <Users className="w-4 h-4" />
                        </span>
                        <h3 className="text-sm font-bold text-slate-800">Patients</h3>
                      </div>
                      <div className="mt-3.5 space-y-1.5 text-xs">
                        <div className="flex items-center gap-2 text-slate-600">
                          <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
                          <span>
                            <strong className="text-slate-800 font-bold">
                              <AnimatedCounter value={currentPatients.regular} />
                            </strong>{" "}
                            Regular
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <span className="w-2 h-2 rounded-full bg-rose-500 inline-block animate-pulse" />
                          <span>
                            <strong className="text-rose-600 font-bold">
                              <AnimatedCounter value={currentPatients.critical} />
                            </strong>{" "}
                            Critical
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">
                        <AnimatedCounter value={currentPatients.total} />
                      </span>
                      <span className="text-xs text-slate-400 font-semibold mt-1">Admitted Total</span>
                      <span className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                        {currentPatients.trend} <TrendingUp className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </AnimatedKpiCard>

              {/* Card 2: Doctors (Vibrant Teal/Emerald theme) */}
              <AnimatedKpiCard index={1} staggerMs={60}>
                <div className="relative overflow-hidden rounded-2xl p-5 border border-teal-100 bg-gradient-to-br from-white via-teal-50/40 to-emerald-50/40 shadow-xs hover:shadow-md hover:border-teal-200 transition-all duration-200 group h-full">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-700 flex items-center justify-center border border-teal-500/20 shadow-2xs">
                          <UserCheck className="w-4 h-4" />
                        </span>
                        <h3 className="text-sm font-bold text-slate-800">Doctors</h3>
                      </div>
                      <div className="mt-3.5 space-y-1.5 text-xs">
                        <div className="flex items-center gap-2 text-slate-600">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                          <span>
                            <strong className="text-emerald-700 font-bold">
                              <AnimatedCounter value={currentDoctors.available} />
                            </strong>{" "}
                            Available
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                          <span>
                            <strong className="text-rose-600 font-bold">
                              <AnimatedCounter value={currentDoctors.unavailable} />
                            </strong>{" "}
                            Unavailable
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">
                        <AnimatedCounter value={currentDoctors.total} />
                      </span>
                      <span className="text-xs text-slate-400 font-semibold mt-1">On-Duty Roster</span>
                      <span
                        className={`mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs ${
                          currentDoctors.trendDirection === "down"
                            ? "text-rose-600 bg-rose-50 border border-rose-200"
                            : "text-emerald-700 bg-emerald-50 border border-emerald-200"
                        }`}
                      >
                        {currentDoctors.trend}{" "}
                        {currentDoctors.trendDirection === "down" ? (
                          <TrendingDown className="w-3 h-3" />
                        ) : (
                          <TrendingUp className="w-3 h-3" />
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </AnimatedKpiCard>

              {/* Card 3: Nurses (Vibrant Violet/Purple theme) */}
              <AnimatedKpiCard index={2} staggerMs={60}>
                <div className="relative overflow-hidden rounded-2xl p-5 border border-purple-100 bg-gradient-to-br from-white via-purple-50/40 to-fuchsia-50/40 shadow-xs hover:shadow-md hover:border-purple-200 transition-all duration-200 group h-full">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-400/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-700 flex items-center justify-center border border-purple-500/20 shadow-2xs">
                          <HeartPulse className="w-4 h-4" />
                        </span>
                        <h3 className="text-sm font-bold text-slate-800">Nurses</h3>
                      </div>
                      <div className="mt-3.5 space-y-1.5 text-xs">
                        <div className="flex items-center gap-2 text-slate-600">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                          <span>
                            <strong className="text-emerald-700 font-bold">
                              <AnimatedCounter value={currentNurses.available} />
                            </strong>{" "}
                            Active Floor
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                          <span>
                            <strong className="text-rose-600 font-bold">
                              <AnimatedCounter value={currentNurses.unavailable} />
                            </strong>{" "}
                            Off-Shift
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">
                        <AnimatedCounter value={currentNurses.total} />
                      </span>
                      <span className="text-xs text-slate-400 font-semibold mt-1">Total Nursing</span>
                      <span className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                        {currentNurses.trend} <TrendingUp className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </AnimatedKpiCard>

              {/* Card 4: Beds (Vibrant Amber/Orange theme) */}
              <AnimatedKpiCard index={3} staggerMs={60}>
                <div className="relative overflow-hidden rounded-2xl p-5 border border-amber-100 bg-gradient-to-br from-white via-amber-50/40 to-orange-50/40 shadow-xs hover:shadow-md hover:border-amber-200 transition-all duration-200 group h-full">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center border border-amber-500/20 shadow-2xs">
                          <Bed className="w-4 h-4" />
                        </span>
                        <h3 className="text-sm font-bold text-slate-800">Inpatient Beds</h3>
                      </div>
                      <div className="mt-3.5 space-y-1.5 text-xs">
                        <div className="flex items-center gap-2 text-slate-600">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                          <span>
                            <strong className="text-emerald-700 font-bold">
                              <AnimatedCounter value={currentBeds.available} />
                            </strong>{" "}
                            Vacant Beds
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                          <span>
                            <strong className="text-rose-600 font-bold">
                              <AnimatedCounter value={currentBeds.unavailable} />
                            </strong>{" "}
                            Occupied
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">
                        <AnimatedCounter value={currentBeds.total} />
                      </span>
                      <span className="text-xs text-slate-400 font-semibold mt-1">Bed Capacity</span>
                      <span className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                        {currentBeds.trend} <TrendingUp className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </AnimatedKpiCard>

              {/* Card 5: Medical Supplies (Vibrant Rose/Pink theme) */}
              <AnimatedKpiCard index={4} staggerMs={60}>
                <div className="relative overflow-hidden rounded-2xl p-5 border border-rose-100 bg-gradient-to-br from-white via-rose-50/40 to-pink-50/40 shadow-xs hover:shadow-md hover:border-rose-200 transition-all duration-200 group h-full">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-rose-400/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-700 flex items-center justify-center border border-rose-500/20 shadow-2xs">
                          <Package className="w-4 h-4" />
                        </span>
                        <h3 className="text-sm font-bold text-slate-800">Medical Supplies</h3>
                      </div>
                      <div className="mt-3.5 space-y-1.5 text-xs">
                        <div className="flex items-center gap-2 text-slate-600">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                          <span>
                            <strong className="text-emerald-700 font-bold">
                              <AnimatedCounter value={currentSupplies.availablePct} suffix="%" />
                            </strong>{" "}
                            Stock In-Store
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                          <span>
                            <strong className="text-amber-700 font-bold">
                              <AnimatedCounter value={currentSupplies.usedPct} suffix="%" />
                            </strong>{" "}
                            Dispensed
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">
                        <AnimatedCounter value={currentSupplies.capacityPct} suffix="%" />
                      </span>
                      <span className="text-xs text-slate-400 font-semibold mt-1">Buffer Reserve</span>
                      <span className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                        {currentSupplies.trend} <TrendingUp className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </AnimatedKpiCard>

              {/* Card 6: Ambulances (Vibrant Blue/Sky theme) */}
              <AnimatedKpiCard index={5} staggerMs={60}>
                <div className="relative overflow-hidden rounded-2xl p-5 border border-blue-100 bg-gradient-to-br from-white via-blue-50/40 to-cyan-50/40 shadow-xs hover:shadow-md hover:border-blue-200 transition-all duration-200 group h-full">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center border border-blue-500/20 shadow-2xs">
                          <Ambulance className="w-4 h-4" />
                        </span>
                        <h3 className="text-sm font-bold text-slate-800">Ambulances</h3>
                      </div>
                      <div className="mt-3.5 space-y-1.5 text-xs">
                        <div className="flex items-center gap-2 text-slate-600">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                          <span>
                            <strong className="text-emerald-700 font-bold">
                              <AnimatedCounter value={currentAmbulances.available} />
                            </strong>{" "}
                            Station Ready
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                          <span>
                            <strong className="text-rose-600 font-bold">
                              <AnimatedCounter value={currentAmbulances.out} />
                            </strong>{" "}
                            Dispatched Out
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">
                        <AnimatedCounter value={currentAmbulances.total} />
                      </span>
                      <span className="text-xs text-slate-400 font-semibold mt-1">Fleet Total</span>
                      <span className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                        {currentAmbulances.trend} <Minus className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </AnimatedKpiCard>
            </div>
          </section>
        </ScrollReveal>

        {/* ── LOWER SECTION: FLOORS OVERVIEW & NURSES ON-DUTY (Wrapped with ScrollReveal) ── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* LEFT: Floors Overview Card (3D Isometric Stack & Dynamic Floor Stats) */}
          <ScrollReveal delay={100} className="h-full">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between h-full">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-700 flex items-center justify-center font-bold text-xs shadow-2xs">
                      <Layers className="w-4 h-4 text-teal-700" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                        Floors Overview
                      </h3>
                      <p className="text-xs text-slate-400">Interactive 3D isometric building stack</p>
                    </div>
                  </div>

                  {/* Floor selector dropdown (Clickable) */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowFloorDropdown(!showFloorDropdown)}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs"
                    >
                      <span>{selectedFloor}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                    </button>

                    {showFloorDropdown && (
                      <div className="absolute right-0 mt-1.5 w-40 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-40 text-xs">
                        {["4th Floor", "3rd Floor", "2nd Floor", "1st Floor"].map((f) => (
                          <button
                            key={f}
                            type="button"
                            onClick={() => {
                              setSelectedFloor(f);
                              setShowFloorDropdown(false);
                            }}
                            className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 transition-colors flex items-center justify-between ${
                              selectedFloor === f
                                ? "text-teal-700 font-bold bg-teal-50/60"
                                : "text-slate-700 font-medium"
                            }`}
                          >
                            <span>{f}</span>
                            {selectedFloor === f && <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Sub-header: Successful cases with AnimatedCounter */}
                <div className="mt-4 flex items-center justify-between">
                  <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <AnimatedCounter value={activeFloorStats.cases} />
                    <span className="text-slate-500 font-medium text-base">successful cases</span>
                  </h4>
                  <span className="text-xs font-semibold text-slate-400">Click any floor layer</span>
                </div>
              </div>

              {/* 3D Isometric Stack & Right Numbers Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center mt-6 pt-2">
                {/* Isometric Floating Diamond Planes (Left 7 cols) */}
                <div className="sm:col-span-7 flex flex-col items-center justify-center relative min-h-[350px] py-2 select-none">
                  <svg
                    viewBox="0 0 380 370"
                    className="w-full max-w-[340px] overflow-visible"
                  >
                    <defs>
                      {/* Soft shadow for non-selected floating floors */}
                      <filter id="shadow-inactive" x="-15%" y="-15%" width="130%" height="135%">
                        <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#0f172a" floodOpacity="0.09" />
                      </filter>
                      {/* Vibrant glowing teal shadow for selected floor */}
                      <filter id="shadow-active" x="-25%" y="-25%" width="150%" height="155%">
                        <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#0d9488" floodOpacity="0.38" />
                        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0d9488" floodOpacity="0.25" />
                      </filter>

                      {/* Floor Gradients */}
                      <linearGradient id="floorGrad4" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#76b1a3" />
                        <stop offset="100%" stopColor="#5c9588" />
                      </linearGradient>

                      <linearGradient id="floorGrad3" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#c5e6dd" />
                        <stop offset="100%" stopColor="#aed5ca" />
                      </linearGradient>

                      <linearGradient id="floorGrad2" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#0f766e" />
                        <stop offset="100%" stopColor="#08544e" />
                      </linearGradient>

                      <linearGradient id="floorGrad1" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#52a393" />
                        <stop offset="100%" stopColor="#3d8576" />
                      </linearGradient>

                      {/* Active Floor Glowing Gradient */}
                      <linearGradient id="floorGradActive" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#14b8a6" />
                        <stop offset="100%" stopColor="#0d9488" />
                      </linearGradient>
                    </defs>

                    {/* ── 4th Floor Plane ── */}
                    {(() => {
                      const isSelected = selectedFloor === "4th Floor";
                      const topY = 32;
                      return (
                        <g
                          className="cursor-pointer"
                          style={{
                            transform: isSelected ? "translate(14px, -10px)" : "translate(0px, 0px)",
                            transition: "transform 350ms cubic-bezier(0.16, 1, 0.3, 1), filter 350ms ease",
                          }}
                          filter={isSelected ? "url(#shadow-active)" : "url(#shadow-inactive)"}
                          onClick={() => setSelectedFloor("4th Floor")}
                        >
                          <polygon
                            points={`180,${topY} 320,${topY + 60} 180,${topY + 120} 40,${topY + 60}`}
                            fill={isSelected ? "url(#floorGradActive)" : "url(#floorGrad4)"}
                            stroke={isSelected ? "#5eead4" : "rgba(255, 255, 255, 0.85)"}
                            strokeWidth={isSelected ? "2.5" : "1.5"}
                            strokeLinejoin="round"
                          />
                          <rect
                            x="136"
                            y={topY + 34}
                            width="88"
                            height="26"
                            rx="13"
                            fill="#0f172a"
                            stroke={isSelected ? "#5eead4" : "rgba(255,255,255,0.4)"}
                            strokeWidth={isSelected ? "2" : "1"}
                            className="drop-shadow-sm"
                          />
                          <text
                            x="180"
                            y={topY + 51}
                            fill="#ffffff"
                            fontSize="11"
                            fontWeight="bold"
                            textAnchor="middle"
                            letterSpacing="0.5"
                          >
                            4TH Floor
                          </text>
                        </g>
                      );
                    })()}

                    {/* ── 3rd Floor Plane (Light mint) ── */}
                    {(() => {
                      const isSelected = selectedFloor === "3rd Floor";
                      const topY = 88;
                      return (
                        <g
                          className="cursor-pointer"
                          style={{
                            transform: isSelected ? "translate(14px, -10px)" : "translate(0px, 0px)",
                            transition: "transform 350ms cubic-bezier(0.16, 1, 0.3, 1), filter 350ms ease",
                          }}
                          filter={isSelected ? "url(#shadow-active)" : "url(#shadow-inactive)"}
                          onClick={() => setSelectedFloor("3rd Floor")}
                        >
                          <polygon
                            points={`180,${topY} 320,${topY + 60} 180,${topY + 120} 40,${topY + 60}`}
                            fill={isSelected ? "url(#floorGradActive)" : "url(#floorGrad3)"}
                            stroke={isSelected ? "#5eead4" : "rgba(255, 255, 255, 0.85)"}
                            strokeWidth={isSelected ? "2.5" : "1.5"}
                            strokeLinejoin="round"
                          />
                          <rect
                            x="136"
                            y={topY + 34}
                            width="88"
                            height="26"
                            rx="13"
                            fill="#0f172a"
                            stroke={isSelected ? "#5eead4" : "rgba(255,255,255,0.4)"}
                            strokeWidth={isSelected ? "2" : "1"}
                            className="drop-shadow-sm"
                          />
                          <text
                            x="180"
                            y={topY + 51}
                            fill="#ffffff"
                            fontSize="11"
                            fontWeight="bold"
                            textAnchor="middle"
                            letterSpacing="0.5"
                          >
                            3RD Floor
                          </text>
                        </g>
                      );
                    })()}

                    {/* ── 2nd Floor Plane (Dark Rich Teal - Default highlighted) ── */}
                    {(() => {
                      const isSelected = selectedFloor === "2nd Floor";
                      const topY = 144;
                      return (
                        <g
                          className="cursor-pointer"
                          style={{
                            transform: isSelected ? "translate(14px, -10px)" : "translate(0px, 0px)",
                            transition: "transform 350ms cubic-bezier(0.16, 1, 0.3, 1), filter 350ms ease",
                          }}
                          filter={isSelected ? "url(#shadow-active)" : "url(#shadow-inactive)"}
                          onClick={() => setSelectedFloor("2nd Floor")}
                        >
                          <polygon
                            points={`180,${topY} 320,${topY + 60} 180,${topY + 120} 40,${topY + 60}`}
                            fill={isSelected ? "url(#floorGradActive)" : "url(#floorGrad2)"}
                            stroke={isSelected ? "#5eead4" : "rgba(255, 255, 255, 0.85)"}
                            strokeWidth={isSelected ? "2.5" : "1.5"}
                            strokeLinejoin="round"
                          />
                          <rect
                            x="136"
                            y={topY + 34}
                            width="88"
                            height="26"
                            rx="13"
                            fill="#0f172a"
                            stroke={isSelected ? "#5eead4" : "rgba(255,255,255,0.4)"}
                            strokeWidth={isSelected ? "2" : "1"}
                            className="drop-shadow-sm"
                          />
                          <text
                            x="180"
                            y={topY + 51}
                            fill="#ffffff"
                            fontSize="11"
                            fontWeight="bold"
                            textAnchor="middle"
                            letterSpacing="0.5"
                          >
                            2ND Floor
                          </text>
                        </g>
                      );
                    })()}

                    {/* ── 1st Floor Plane (Medium Teal) ── */}
                    {(() => {
                      const isSelected = selectedFloor === "1st Floor";
                      const topY = 200;
                      return (
                        <g
                          className="cursor-pointer"
                          style={{
                            transform: isSelected ? "translate(14px, -10px)" : "translate(0px, 0px)",
                            transition: "transform 350ms cubic-bezier(0.16, 1, 0.3, 1), filter 350ms ease",
                          }}
                          filter={isSelected ? "url(#shadow-active)" : "url(#shadow-inactive)"}
                          onClick={() => setSelectedFloor("1st Floor")}
                        >
                          <polygon
                            points={`180,${topY} 320,${topY + 60} 180,${topY + 120} 40,${topY + 60}`}
                            fill={isSelected ? "url(#floorGradActive)" : "url(#floorGrad1)"}
                            stroke={isSelected ? "#5eead4" : "rgba(255, 255, 255, 0.85)"}
                            strokeWidth={isSelected ? "2.5" : "1.5"}
                            strokeLinejoin="round"
                          />
                          <rect
                            x="136"
                            y={topY + 34}
                            width="88"
                            height="26"
                            rx="13"
                            fill="#0f172a"
                            stroke={isSelected ? "#5eead4" : "rgba(255,255,255,0.4)"}
                            strokeWidth={isSelected ? "2" : "1"}
                            className="drop-shadow-sm"
                          />
                          <text
                            x="180"
                            y={topY + 51}
                            fill="#ffffff"
                            fontSize="11"
                            fontWeight="bold"
                            textAnchor="middle"
                            letterSpacing="0.5"
                          >
                            1ST Floor
                          </text>
                        </g>
                      );
                    })()}
                  </svg>
                </div>

                {/* Floor Stats Data (Right 5 cols) */}
                <div className="sm:col-span-5 flex flex-col justify-center pl-2 space-y-6">
                  <div>
                    <span
                      className={`inline-block text-xs font-black tracking-wider px-3.5 py-1.5 rounded-xl uppercase shadow-xs ${activeFloorStats.statusColor}`}
                    >
                      {activeFloorStats.status}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100">
                    <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none block">
                      <AnimatedCounter value={activeFloorStats.generalTotal} />
                    </span>
                    <span className="text-sm font-semibold text-slate-600 block mt-1.5">
                      General Ward Rooms
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                      <span>
                        <strong className="text-emerald-700 font-bold">
                          <AnimatedCounter value={activeFloorStats.generalAvail} />
                        </strong>{" "}
                        Available
                      </span>
                    </div>
                    {/* Animated Availability Bar */}
                    <div className="h-2 w-full bg-slate-200/80 rounded-full overflow-hidden mt-3">
                      <div
                        style={{
                          width: `${Math.min(100, Math.round((activeFloorStats.generalAvail / Math.max(activeFloorStats.generalTotal, 1)) * 100))}%`,
                        }}
                        className="h-full rounded-full bg-emerald-500 chart-bar-h shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100">
                    <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none block">
                      <AnimatedCounter value={activeFloorStats.privateTotal} />
                    </span>
                    <span className="text-sm font-semibold text-slate-600 block mt-1.5">
                      Private & VIP Suites
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                      <span>
                        <strong className="text-emerald-700 font-bold">
                          <AnimatedCounter value={activeFloorStats.privateAvail} />
                        </strong>{" "}
                        Available
                      </span>
                    </div>
                    {/* Animated Availability Bar */}
                    <div className="h-2 w-full bg-slate-200/80 rounded-full overflow-hidden mt-3">
                      <div
                        style={{
                          width: `${Math.min(100, Math.round((activeFloorStats.privateAvail / Math.max(activeFloorStats.privateTotal, 1)) * 100))}%`,
                        }}
                        className="h-full rounded-full bg-teal-500 chart-bar-h shadow-2xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* RIGHT: Nurses On-Duty Card */}
          <ScrollReveal delay={200} className="h-full">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between h-full">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-700 flex items-center justify-center font-bold text-xs shadow-2xs">
                      <HeartPulse className="w-4 h-4 text-purple-700" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                        Nursing Staff On-Duty
                      </h3>
                      <p className="text-xs text-slate-400">Shift allocations and active department stations</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAllNursesModal(true)}
                    className="text-xs sm:text-sm font-bold text-teal-700 hover:text-teal-900 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200/80 transition-colors cursor-pointer"
                  >
                    View All ({nursesList.length})
                  </button>
                </div>

                {/* Sub-header labels */}
                <div className="flex items-center justify-between pt-4 pb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>Nurse Name & Dept</span>
                  <span>Active Shift</span>
                </div>

                {/* Nurses List with Colorful Avatars and Department Badges */}
                <div className="divide-y divide-slate-100">
                  {nursesList.slice(0, 6).map((nurse, idx) => (
                    <div
                      key={nurse.id}
                      className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50/80 px-2 rounded-xl transition-colors"
                    >
                      {/* Left: Avatar + Name + Dept */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl font-black text-xs flex items-center justify-center flex-shrink-0 shadow-2xs ${getAvatarBgClass(
                            nurse.initials,
                            idx
                          )}`}
                        >
                          {nurse.initials}
                        </div>
                        <div>
                          <h5 className="text-sm font-bold text-slate-800 leading-snug">
                            {nurse.name}
                          </h5>
                          <span
                            className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border mt-0.5 ${getDeptBadgeClass(
                              nurse.dept
                            )}`}
                          >
                            {nurse.dept}
                          </span>
                        </div>
                      </div>

                      {/* Right: Shift Pill */}
                      <div className="flex-shrink-0">
                        <span className="inline-block text-xs font-mono text-slate-700 font-semibold bg-slate-50 border border-slate-200/80 rounded-full px-3 py-1 shadow-2xs">
                          {nurse.shift}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  All 6 shifts on schedule
                </span>
                <span className="font-semibold text-slate-700">Next handover at 01:00 PM</span>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>

      {/* Nurses View All Modal */}
      {showAllNursesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-scale">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                All On-Duty Nursing Staff ({timeRange})
              </h3>
              <button
                onClick={() => setShowAllNursesModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto mt-2">
              {nursesList.map((nurse, idx) => (
                <div key={nurse.id} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shadow-2xs ${getAvatarBgClass(
                        nurse.initials,
                        idx
                      )}`}
                    >
                      {nurse.initials}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{nurse.name}</p>
                      <p className="text-xs text-slate-400">{nurse.dept}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-600 bg-slate-50 border border-slate-200 rounded-full px-3 py-1">
                    {nurse.shift}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-right">
              <button
                onClick={() => setShowAllNursesModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
