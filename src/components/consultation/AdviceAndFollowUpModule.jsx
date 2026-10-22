import React from "react";
import { Utensils, Calendar, UserCheck, AlertTriangle, Sparkles, Building2 } from "lucide-react";

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

export default function AdviceAndFollowUpModule({
  dietaryAdvice = "",
  referrals = { department: "", doctorName: "", reason: "" },
  isAdmitRecommended = false,
  admitDetails = { priority: "Urgent", reason: "", ward: "General Ward" },
  followUp = { timeline: "1 Week", date: "", notes: "" },
  onChange = () => {},
}) {
  const calculateFollowUpDate = (days) => {
    if (days === 0) return new Date().toISOString().split("T")[0];
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0];
  };

  const handleFollowUpTimelineSelect = (timeline, days) => {
    const computedDate = calculateFollowUpDate(days);
    onChange({
      dietaryAdvice,
      referrals,
      isAdmitRecommended,
      admitDetails,
      followUp: {
        ...followUp,
        timeline,
        date: computedDate,
      },
    });
  };

  const handleDietPresetClick = (preset) => {
    const updated = dietaryAdvice ? `${dietaryAdvice}\n${preset}` : preset;
    onChange({
      dietaryAdvice: updated,
      referrals,
      isAdmitRecommended,
      admitDetails,
      followUp,
    });
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-5">
      {/* 1. Dietary & Lifestyle Advice */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-700">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Dietary & Lifestyle Advice</h3>
              <p className="text-[11px] text-slate-500">Patient care instructions and dietary restrictions</p>
            </div>
          </div>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap gap-1.5">
          {DIET_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleDietPresetClick(preset)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 hover:border-teal-300 font-medium transition-colors text-left"
            >
              + {preset.length > 45 ? `${preset.substring(0, 45)}…` : preset}
            </button>
          ))}
        </div>

        <textarea
          rows={3}
          value={dietaryAdvice}
          onChange={(e) =>
            onChange({
              dietaryAdvice: e.target.value,
              referrals,
              isAdmitRecommended,
              admitDetails,
              followUp,
            })
          }
          placeholder="Enter dietary guidelines, hydration instructions, physical activity restrictions..."
          className="w-full text-xs p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
        />
      </div>

      {/* 2. Follow-Up Plan */}
      <div className="space-y-2.5 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-700">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Follow-Up & Review Plan</h3>
            <p className="text-[11px] text-slate-500">Scheduled next visit timeline or emergency warning SOS</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {FOLLOW_UP_OPTIONS.map((opt) => {
            const isSelected = followUp.timeline === opt.label;
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => handleFollowUpTimelineSelect(opt.label, opt.days)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold border transition-all ${
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">
              Follow-Up Date
            </label>
            <input
              type="date"
              value={followUp.date || ""}
              onChange={(e) =>
                onChange({
                  dietaryAdvice,
                  referrals,
                  isAdmitRecommended,
                  admitDetails,
                  followUp: { ...followUp, date: e.target.value },
                })
              }
              className="w-full text-xs px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">
              Instructions for Follow-Up
            </label>
            <input
              type="text"
              value={followUp.notes || ""}
              onChange={(e) =>
                onChange({
                  dietaryAdvice,
                  referrals,
                  isAdmitRecommended,
                  admitDetails,
                  followUp: { ...followUp, notes: e.target.value },
                })
              }
              placeholder="e.g. Review with CBC report, or seek emergency if fever spikes"
              className="w-full text-xs px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* 3. Department Referral & IPD Admission */}
      <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Referral */}
        <div className="space-y-2 p-3.5 rounded-xl bg-slate-50/70 border border-slate-200">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs font-bold text-slate-900">Inter-Department Referral</h4>
          </div>
          <div className="space-y-2">
            <select
              value={referrals.department || ""}
              onChange={(e) =>
                onChange({
                  dietaryAdvice,
                  referrals: { ...referrals, department: e.target.value },
                  isAdmitRecommended,
                  admitDetails,
                  followUp,
                })
              }
              className="w-full text-xs px-2.5 py-1.5 bg-white rounded-lg border border-slate-200 text-slate-700"
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
                      dietaryAdvice,
                      referrals: { ...referrals, doctorName: e.target.value },
                      isAdmitRecommended,
                      admitDetails,
                      followUp,
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
                      dietaryAdvice,
                      referrals: { ...referrals, reason: e.target.value },
                      isAdmitRecommended,
                      admitDetails,
                      followUp,
                    })
                  }
                  placeholder="Reason for referral..."
                  className="w-full text-xs px-2.5 py-1.5 bg-white rounded-lg border border-slate-200"
                />
              </>
            )}
          </div>
        </div>

        {/* IPD Admission */}
        <div
          className={`space-y-2 p-3.5 rounded-xl border transition-colors ${
            isAdmitRecommended
              ? "bg-rose-50/60 border-rose-300"
              : "bg-slate-50/70 border-slate-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle
                className={`w-4 h-4 ${isAdmitRecommended ? "text-rose-600" : "text-slate-400"}`}
              />
              <h4 className="text-xs font-bold text-slate-900">Hospital IPD Admission</h4>
            </div>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isAdmitRecommended}
                onChange={(e) =>
                  onChange({
                    dietaryAdvice,
                    referrals,
                    isAdmitRecommended: e.target.checked,
                    admitDetails,
                    followUp,
                  })
                }
                className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
              />
              <span className="text-xs font-semibold text-slate-700">Recommend Admit</span>
            </label>
          </div>

          {isAdmitRecommended ? (
            <div className="space-y-2 pt-1 animate-fade-in">
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={admitDetails.priority || "Urgent"}
                  onChange={(e) =>
                    onChange({
                      dietaryAdvice,
                      referrals,
                      isAdmitRecommended,
                      admitDetails: { ...admitDetails, priority: e.target.value },
                      followUp,
                    })
                  }
                  className="w-full text-xs px-2.5 py-1.5 bg-white rounded-lg border border-rose-200 text-slate-800"
                >
                  <option value="Urgent">Urgent Admission</option>
                  <option value="Emergency ICU">Emergency ICU</option>
                  <option value="Elective">Elective Planned</option>
                </select>
                <select
                  value={admitDetails.ward || "General Ward"}
                  onChange={(e) =>
                    onChange({
                      dietaryAdvice,
                      referrals,
                      isAdmitRecommended,
                      admitDetails: { ...admitDetails, ward: e.target.value },
                      followUp,
                    })
                  }
                  className="w-full text-xs px-2.5 py-1.5 bg-white rounded-lg border border-rose-200 text-slate-800"
                >
                  <option value="General Ward">General Ward</option>
                  <option value="Semi-Private">Semi-Private</option>
                  <option value="Deluxe Private">Deluxe Private</option>
                  <option value="ICU / HDU">ICU / HDU</option>
                </select>
              </div>
              <input
                type="text"
                value={admitDetails.reason || ""}
                onChange={(e) =>
                  onChange({
                    dietaryAdvice,
                    referrals,
                    isAdmitRecommended,
                    admitDetails: { ...admitDetails, reason: e.target.value },
                    followUp,
                  })
                }
                placeholder="Indication for admission (e.g. Unstable vitals, IV antibiotics needed)..."
                className="w-full text-xs px-2.5 py-1.5 bg-white rounded-lg border border-rose-200 text-slate-800"
              />
            </div>
          ) : (
            <p className="text-[11px] text-slate-400">
              Patient will be discharged home on outpatient medical therapy.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
