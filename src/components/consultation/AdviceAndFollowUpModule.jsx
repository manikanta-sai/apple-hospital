import React from "react";
import { Utensils, Calendar, UserCheck, AlertTriangle, Sparkles, Building2, Check } from "lucide-react";

const DIET_PRESETS = [
  "Low sodium, low fat diet. Regular 30-min walking daily. Avoid deep-fried and oily food.",
  "Diabetic diet: Avoid refined sugars, juices & high GI carbs. Consume small, frequent high-fiber meals.",
  "Bland high-protein diet with plenty of oral fluids and tender coconut water. Avoid spicy condiments.",
  "Drink 3-4 liters of boiled water daily. Increase intake of green leafy vegetables and fresh seasonal fruits.",
  "Elevate head of bed during sleep. Avoid lying down immediately after meals. Restrict caffeine and citrus.",
];

const FOLLOW_UP_OPTIONS = [
  { label: "3 Days", days: 3 },
  { label: "5 Days", days: 5 },
  { label: "1 Week", days: 7 },
  { label: "2 Weeks", days: 14 },
  { label: "1 Month", days: 30 },
  { label: "SOS", days: 0 },
];

const DEPARTMENTS = [
  "Cardiology",
  "Orthopedics",
  "Obstetrics & Gynecology",
  "General Surgery",
  "Pediatrics",
  "Neurology",
  "Pulmonology",
  "ENT",
  "Dermatology",
  "Gastroenterology",
  "Nephrology",
];

/**
 * 1. Dedicated Dietary Advice Component (Section 8)
 */
export function DietaryAdviceModule({
  dietaryAdvice = "",
  onChange = () => {},
}) {
  const handleDietPresetClick = (preset) => {
    const updated = dietaryAdvice ? `${dietaryAdvice}\n${preset}` : preset;
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {/* Presets */}
      <div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
          Quick Dietary Presets:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {DIET_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleDietPresetClick(preset)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 hover:border-teal-300 font-medium transition-colors text-left cursor-pointer"
            >
              + {preset.length > 45 ? `${preset.substring(0, 45)}…` : preset}
            </button>
          ))}
        </div>
      </div>

      <textarea
        rows={3}
        value={dietaryAdvice}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter dietary guidelines, hydration instructions, physical activity restrictions..."
        className="w-full text-xs p-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
      />
    </div>
  );
}

/**
 * 2. Dedicated Follow-Up Review Component (Section 9)
 */
export function FollowUpPlanModule({
  followUp = { timeline: "1 Week", date: "", notes: "" },
  onChange = () => {},
}) {
  const calculateFollowUpDate = (days) => {
    if (days === 0) return new Date().toISOString().split("T")[0];
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0];
  };

  const handleTimelineSelect = (timeline, days) => {
    const computedDate = calculateFollowUpDate(days);
    onChange({
      ...followUp,
      timeline,
      date: computedDate,
    });
  };

  return (
    <div className="space-y-3.5">
      <div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
          Select Review Schedule:
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {FOLLOW_UP_OPTIONS.map((opt) => {
            const isSelected = followUp.timeline === opt.label;
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => handleTimelineSelect(opt.label, opt.days)}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-bold border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div>
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">
            Follow-Up Target Date
          </label>
          <input
            type="date"
            value={followUp.date || ""}
            onChange={(e) => onChange({ ...followUp, date: e.target.value })}
            className="w-full text-xs px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">
            Special Review Instructions & Warning Signs
          </label>
          <input
            type="text"
            value={followUp.notes || ""}
            onChange={(e) => onChange({ ...followUp, notes: e.target.value })}
            placeholder="e.g. Review with CBC report, or seek emergency SOS if fever spikes"
            className="w-full text-xs px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * 3. Dedicated Referrals & Hospital IPD Component (Section 10)
 */
export function ReferralsAndIpdModule({
  referrals = { department: "", doctorName: "", reason: "" },
  isAdmitRecommended = false,
  admitDetails = { priority: "Urgent", reason: "", ward: "General Ward" },
  onChange = () => {},
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Referral */}
      <div className="space-y-2.5 p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/90">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-indigo-600" />
          <h4 className="text-xs font-bold text-slate-900">Inter-Department Specialist Referral</h4>
        </div>
        <div className="space-y-2">
          <select
            value={referrals.department || ""}
            onChange={(e) =>
              onChange({
                referrals: { ...referrals, department: e.target.value },
                isAdmitRecommended,
                admitDetails,
              })
            }
            className="w-full text-xs px-2.5 py-1.5 bg-white rounded-lg border border-slate-200 text-slate-700 font-medium"
          >
            <option value="">-- No Department Referral --</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          {referrals.department && (
            <>
              <input
                type="text"
                value={referrals.doctorName || ""}
                onChange={(e) =>
                  onChange({
                    referrals: { ...referrals, doctorName: e.target.value },
                    isAdmitRecommended,
                    admitDetails,
                  })
                }
                placeholder="Doctor Name (Optional)"
                className="w-full text-xs px-2.5 py-1.5 bg-white rounded-lg border border-slate-200"
              />
              <input
                type="text"
                value={referrals.reason || ""}
                onChange={(e) =>
                  onChange({
                    referrals: { ...referrals, reason: e.target.value },
                    isAdmitRecommended,
                    admitDetails,
                  })
                }
                placeholder="Clinical reason for cross-consultation..."
                className="w-full text-xs px-2.5 py-1.5 bg-white rounded-lg border border-slate-200"
              />
            </>
          )}
        </div>
      </div>

      {/* Hospital IPD Admission Recommendation */}
      <div
        className={`space-y-2.5 p-3.5 rounded-xl border transition-all ${
          isAdmitRecommended
            ? "bg-rose-50/70 border-rose-200"
            : "bg-slate-50/80 border-slate-200/90"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle
              className={`w-4 h-4 ${
                isAdmitRecommended ? "text-rose-600" : "text-slate-400"
              }`}
            />
            <h4 className="text-xs font-bold text-slate-900">Hospital IPD Admission</h4>
          </div>

          <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer text-slate-700 select-none">
            <input
              type="checkbox"
              checked={isAdmitRecommended}
              onChange={(e) =>
                onChange({
                  referrals,
                  isAdmitRecommended: e.target.checked,
                  admitDetails,
                })
              }
              className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
            />
            <span>Recommend Admit</span>
          </label>
        </div>

        {isAdmitRecommended ? (
          <div className="space-y-2 pt-1 animate-fade-in text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Priority</label>
                <select
                  value={admitDetails.priority || "Urgent"}
                  onChange={(e) =>
                    onChange({
                      referrals,
                      isAdmitRecommended,
                      admitDetails: { ...admitDetails, priority: e.target.value },
                    })
                  }
                  className="w-full text-xs px-2 py-1.5 bg-white rounded-lg border border-slate-200 font-semibold"
                >
                  <option value="Routine">Routine</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Emergency (ICU)">Emergency (ICU)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Ward / Facility</label>
                <select
                  value={admitDetails.ward || "General Ward"}
                  onChange={(e) =>
                    onChange({
                      referrals,
                      isAdmitRecommended,
                      admitDetails: { ...admitDetails, ward: e.target.value },
                    })
                  }
                  className="w-full text-xs px-2 py-1.5 bg-white rounded-lg border border-slate-200 font-semibold"
                >
                  <option value="General Ward">General Ward</option>
                  <option value="Semi-Private">Semi-Private</option>
                  <option value="Private Deluxe">Private Deluxe</option>
                  <option value="ICU / HDU">ICU / HDU</option>
                </select>
              </div>
            </div>

            <input
              type="text"
              value={admitDetails.reason || ""}
              onChange={(e) =>
                onChange({
                  referrals,
                  isAdmitRecommended,
                  admitDetails: { ...admitDetails, reason: e.target.value },
                })
              }
              placeholder="Clinical indication for inpatient admission..."
              className="w-full text-xs px-2.5 py-1.5 bg-white rounded-lg border border-slate-200"
            />
          </div>
        ) : (
          <p className="text-[11px] text-slate-500">
            Patient will be discharged home on outpatient medical therapy.
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Backward-compatible Combined Component
 */
export default function AdviceAndFollowUpModule({
  dietaryAdvice = "",
  referrals = { department: "", doctorName: "", reason: "" },
  isAdmitRecommended = false,
  admitDetails = { priority: "Urgent", reason: "", ward: "General Ward" },
  followUp = { timeline: "1 Week", date: "", notes: "" },
  onChange = () => {},
  hideHeader = false,
}) {
  return (
    <div className={hideHeader ? "space-y-5" : "bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5"}>
      <DietaryAdviceModule
        dietaryAdvice={dietaryAdvice}
        onChange={(updatedDiet) =>
          onChange({
            dietaryAdvice: updatedDiet,
            referrals,
            isAdmitRecommended,
            admitDetails,
            followUp,
          })
        }
      />
      <FollowUpPlanModule
        followUp={followUp}
        onChange={(updatedFollowUp) =>
          onChange({
            dietaryAdvice,
            referrals,
            isAdmitRecommended,
            admitDetails,
            followUp: updatedFollowUp,
          })
        }
      />
      <ReferralsAndIpdModule
        referrals={referrals}
        isAdmitRecommended={isAdmitRecommended}
        admitDetails={admitDetails}
        onChange={(updatedRefAdmit) =>
          onChange({
            dietaryAdvice,
            followUp,
            ...updatedRefAdmit,
          })
        }
      />
    </div>
  );
}
