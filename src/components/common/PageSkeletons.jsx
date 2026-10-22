import React from "react";

// Reusable Shimmer Bar component
function Shimmer({ className = "", style = {} }) {
  return (
    <div
      className={`relative overflow-hidden bg-slate-200/70 rounded-md ${className}`}
      style={style}
    >
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent"
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
        }}
      />
    </div>
  );
}

/**
 * 1. Insights & Call Center Dashboard Skeleton
 */
export function InsightsSkeleton() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans pb-16 animate-pulse">
      {/* Top Bar Skeleton */}
      <div className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shimmer className="w-8 h-8 rounded-lg" />
          <Shimmer className="w-48 h-4 rounded" />
          <Shimmer className="w-24 h-5 rounded-full" />
        </div>
        <div className="flex items-center gap-2">
          <Shimmer className="w-32 h-6 rounded-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 space-y-6">
        {/* Title area */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Shimmer className="w-64 h-8 rounded-lg" />
            <Shimmer className="w-96 h-4 rounded" />
          </div>
          <div className="flex gap-2">
            <Shimmer className="w-28 h-9 rounded-xl" />
            <Shimmer className="w-32 h-9 rounded-xl" />
          </div>
        </div>

        {/* 6 KPI Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <Shimmer className="w-16 h-3 rounded" />
                <Shimmer className="w-7 h-7 rounded-lg" />
              </div>
              <Shimmer className="w-20 h-7 rounded" />
              <Shimmer className="w-14 h-4 rounded-full" />
            </div>
          ))}
        </div>

        {/* Split Table & Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <Shimmer className="w-36 h-5 rounded" />
              <Shimmer className="w-24 h-4 rounded" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50">
                  <div className="flex items-center gap-3">
                    <Shimmer className="w-9 h-9 rounded-full" />
                    <div className="space-y-1.5">
                      <Shimmer className="w-28 h-4 rounded" />
                      <Shimmer className="w-20 h-3 rounded" />
                    </div>
                  </div>
                  <Shimmer className="w-24 h-4 rounded" />
                  <Shimmer className="w-12 h-6 rounded-full" />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 space-y-5">
            <div className="flex items-center gap-3">
              <Shimmer className="w-12 h-12 rounded-xl" />
              <div className="space-y-2 flex-1">
                <Shimmer className="w-40 h-5 rounded" />
                <Shimmer className="w-28 h-3 rounded" />
              </div>
            </div>
            <Shimmer className="w-full h-24 rounded-xl" />
            <div className="space-y-2">
              <Shimmer className="w-full h-4 rounded" />
              <Shimmer className="w-5/6 h-4 rounded" />
              <Shimmer className="w-4/6 h-4 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 2. Hospital Stats & Telemetry Dashboard Skeleton
 */
export function HospitalStatsSkeleton() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans pb-16 animate-pulse">
      {/* RouteTopBar Skeleton */}
      <div className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shimmer className="w-8 h-8 rounded-lg" />
          <Shimmer className="w-44 h-4 rounded" />
          <Shimmer className="w-28 h-5 rounded-full" />
        </div>
        <Shimmer className="w-36 h-6 rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 space-y-6">
        {/* Controls row */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-2">
            <Shimmer className="w-72 h-8 rounded-lg" />
            <Shimmer className="w-80 h-4 rounded" />
          </div>
          <div className="flex items-center gap-3">
            <Shimmer className="w-36 h-9 rounded-xl" />
            <Shimmer className="w-40 h-9 rounded-xl" />
          </div>
        </div>

        {/* 6 KPI Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <Shimmer className="w-16 h-3 rounded" />
                <Shimmer className="w-8 h-8 rounded-lg" />
              </div>
              <Shimmer className="w-16 h-6 rounded" />
              <div className="flex justify-between pt-1">
                <Shimmer className="w-12 h-3 rounded" />
                <Shimmer className="w-12 h-3 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Middle Charts & Occupancy Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Shimmer className="w-48 h-5 rounded" />
              <Shimmer className="w-24 h-4 rounded" />
            </div>
            <div className="h-60 flex items-end justify-between gap-4 pt-6">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <Shimmer className={`w-full rounded-t-lg`} style={{ height: `${35 + (i * 9) % 55}%` }} />
                  <Shimmer className="w-8 h-3 rounded" />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
            <Shimmer className="w-40 h-5 rounded" />
            <div className="space-y-3 pt-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-3.5 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                  <div className="flex justify-between">
                    <Shimmer className="w-24 h-4 rounded" />
                    <Shimmer className="w-14 h-4 rounded-full" />
                  </div>
                  <Shimmer className="w-full h-2 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 3. OPD Queue & Triage Desk Skeleton
 */
export function OpdPortalSkeleton() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-16 animate-pulse">
      {/* Top Header Skeleton */}
      <div className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Shimmer className="w-10 h-10 rounded-xl" />
          <div className="space-y-1.5">
            <Shimmer className="w-48 h-4 rounded" />
            <Shimmer className="w-32 h-3 rounded" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Shimmer className="w-36 h-9 rounded-xl" />
          <Shimmer className="w-10 h-10 rounded-full" />
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 pt-6 space-y-6">
        {/* KPI stat summary pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <Shimmer key={i} className="w-36 h-10 rounded-xl shrink-0" />
          ))}
        </div>

        {/* Multi-Lane Kanban Triage Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, col) => (
            <div key={col} className="bg-slate-200/60 rounded-2xl p-4 space-y-3 min-h-[500px]">
              <div className="flex items-center justify-between pb-1">
                <Shimmer className="w-24 h-4 rounded" />
                <Shimmer className="w-6 h-6 rounded-full" />
              </div>
              {Array.from({ length: 3 }).map((_, card) => (
                <div key={card} className="bg-white rounded-xl p-3.5 space-y-2.5 shadow-xs border border-slate-200">
                  <div className="flex justify-between">
                    <Shimmer className="w-14 h-4 rounded font-mono" />
                    <Shimmer className="w-12 h-4 rounded-full" />
                  </div>
                  <Shimmer className="w-32 h-4 rounded" />
                  <Shimmer className="w-full h-3 rounded" />
                  <div className="flex justify-between pt-1">
                    <Shimmer className="w-20 h-6 rounded-lg" />
                    <Shimmer className="w-16 h-6 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * 4. OPD Consultation Workspace Skeleton
 */
export function OpdConsultationSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16 animate-pulse">
      {/* Patient Header Banner */}
      <div className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Shimmer className="w-10 h-10 rounded-full" />
          <div className="space-y-1.5">
            <Shimmer className="w-56 h-4 rounded" />
            <Shimmer className="w-36 h-3 rounded" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Shimmer className="w-24 h-8 rounded-xl" />
          <Shimmer className="w-32 h-8 rounded-xl" />
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side (60%) Prescription Editor */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <Shimmer className="w-48 h-5 rounded" />
            <Shimmer className="w-full h-16 rounded-xl" />
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <Shimmer className="w-40 h-5 rounded" />
            <Shimmer className="w-full h-40 rounded-xl" />
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <Shimmer className="w-52 h-5 rounded" />
            <Shimmer className="w-full h-24 rounded-xl" />
          </div>
        </div>

        {/* Right Side (40%) Video & Body Map */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
            <Shimmer className="w-full h-44 rounded-xl" />
            <div className="flex justify-center gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Shimmer key={i} className="w-9 h-9 rounded-full" />
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
            <Shimmer className="w-44 h-5 rounded" />
            <Shimmer className="w-full h-56 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 5. Token Desk & Dispenser Skeleton
 */
export function TokenDeskSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16 animate-pulse">
      <div className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shimmer className="w-9 h-9 rounded-xl" />
          <Shimmer className="w-48 h-5 rounded" />
        </div>
        <Shimmer className="w-32 h-8 rounded-xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-8 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Shimmer key={i} className="h-24 rounded-2xl bg-white border border-slate-200" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Shimmer className="h-96 rounded-2xl bg-white border border-slate-200" />
          <Shimmer className="h-96 rounded-2xl bg-white border border-slate-200" />
        </div>
      </div>
    </div>
  );
}

/**
 * 6. Speech-To-Text / Medical Dictation Skeleton
 */
export function SpeechToTextSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16 animate-pulse">
      <div className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shimmer className="w-9 h-9 rounded-xl" />
          <Shimmer className="w-52 h-5 rounded" />
        </div>
        <Shimmer className="w-28 h-8 rounded-xl" />
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-10 space-y-6 text-center">
        <div className="flex justify-center">
          <Shimmer className="w-24 h-24 rounded-full" />
        </div>
        <Shimmer className="w-72 h-6 rounded mx-auto" />
        <Shimmer className="w-full h-32 rounded-2xl bg-white border border-slate-200" />
        <Shimmer className="w-full h-64 rounded-2xl bg-white border border-slate-200" />
      </div>
    </div>
  );
}

/**
 * 7. URL Generator Skeleton
 */
export function UrlGeneratorSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16 animate-pulse">
      <div className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
        <Shimmer className="w-48 h-5 rounded" />
        <Shimmer className="w-28 h-8 rounded-xl" />
      </div>
      <div className="max-w-4xl mx-auto px-6 pt-8 space-y-6">
        <Shimmer className="w-64 h-8 rounded" />
        <Shimmer className="h-80 rounded-2xl bg-white border border-slate-200" />
      </div>
    </div>
  );
}

/**
 * 8. Developer Portfolio & Home Skeleton
 */
export function PortfolioHomeSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16 animate-pulse">
      {/* Hero Skeleton */}
      <div className="max-w-6xl mx-auto px-6 pt-12 space-y-8">
        <div className="flex items-center gap-6">
          <Shimmer className="w-24 h-24 rounded-3xl shrink-0" />
          <div className="space-y-3 flex-1">
            <Shimmer className="w-64 h-8 rounded-lg" />
            <Shimmer className="w-96 h-4 rounded" />
            <div className="flex gap-2 pt-1">
              <Shimmer className="w-24 h-7 rounded-full" />
              <Shimmer className="w-28 h-7 rounded-full" />
              <Shimmer className="w-20 h-7 rounded-full" />
            </div>
          </div>
        </div>

        {/* Product Cards Grid Skeleton */}
        <div className="space-y-4 pt-6">
          <div className="flex justify-between items-center">
            <Shimmer className="w-48 h-6 rounded" />
            <Shimmer className="w-32 h-8 rounded-xl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-4">
                <Shimmer className="w-full h-40 rounded-none" />
                <div className="p-5 space-y-3">
                  <Shimmer className="w-40 h-5 rounded" />
                  <Shimmer className="w-full h-12 rounded" />
                  <div className="flex justify-between items-center pt-2">
                    <Shimmer className="w-20 h-5 rounded" />
                    <Shimmer className="w-24 h-8 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
