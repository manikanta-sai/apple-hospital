import React, { useState, useEffect } from "react";
import {
  HeartPulse,
  Activity,
  Thermometer,
  Wind,
  Weight,
  Ruler,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  Sparkles,
} from "lucide-react";

/**
 * Calculates BMI from weight (kg) and height (cm)
 */
function calculateBmi(weightKg, heightCm) {
  const w = parseFloat(weightKg);
  const h = parseFloat(heightCm);
  if (!w || !h || h <= 0) return "";
  const heightM = h / 100;
  const bmiVal = (w / (heightM * heightM)).toFixed(1);
  return bmiVal;
}

function getBmiCategory(bmi) {
  const val = parseFloat(bmi);
  if (!val) return null;
  if (val < 18.5) return { label: "Underweight", color: "text-amber-700 bg-amber-50 border-amber-200" };
  if (val < 25) return { label: "Normal (Healthy)", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
  if (val < 30) return { label: "Overweight", color: "text-orange-700 bg-orange-50 border-orange-200" };
  return { label: "Obese (High Risk)", color: "text-rose-700 bg-rose-50 border-rose-200" };
}

export default function VitalsEntryModule({
  vitals = {},
  onChange = () => {},
  patient = {},
  hideHeader = false,
}) {
  const [formData, setFormData] = useState({
    bp: vitals?.bp || patient?.vitals?.bp || "120/80",
    pulse: vitals?.pulse || patient?.vitals?.pulse || "76",
    temp: vitals?.temp || patient?.vitals?.temp || "98.6",
    spo2: vitals?.spo2 || patient?.vitals?.spo2 || "99",
    respiratoryRate: vitals?.respiratoryRate || patient?.vitals?.respiratoryRate || "18",
    height: vitals?.height || patient?.vitals?.height || "165",
    weight: vitals?.weight || patient?.vitals?.weight || "64",
    bmi: vitals?.bmi || patient?.vitals?.bmi || "23.5",
    bloodGlucose: vitals?.bloodGlucose || patient?.vitals?.bloodGlucose || "",
    notes: vitals?.notes || "",
  });

  // Keep in sync if prop changes
  useEffect(() => {
    if (vitals && Object.keys(vitals).length > 0) {
      setFormData((prev) => ({
        ...prev,
        ...vitals,
      }));
    }
  }, [vitals]);

  const updateField = (field, value) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };

      // Auto compute BMI if height or weight changed
      if (field === "height" || field === "weight") {
        const computed = calculateBmi(next.weight, next.height);
        if (computed) {
          next.bmi = computed;
        }
      }

      onChange(next);
      return next;
    });
  };

  const handleResetToTriage = () => {
    const triageVitals = {
      bp: patient?.vitals?.bp || "120/80",
      pulse: patient?.vitals?.pulse || "76",
      temp: patient?.vitals?.temp || "98.6",
      spo2: patient?.vitals?.spo2 || "99",
      respiratoryRate: "18",
      height: patient?.vitals?.height || "165",
      weight: patient?.vitals?.weight || "64",
      bmi: patient?.vitals?.bmi || "23.5",
      bloodGlucose: patient?.vitals?.bloodGlucose || "",
      notes: "Triage vitals restored",
    };
    setFormData(triageVitals);
    onChange(triageVitals);
  };

  // Evaluate BP safety
  const isHighBp = (() => {
    if (!formData.bp) return false;
    const parts = formData.bp.split("/");
    const sys = parseInt(parts[0], 10);
    const dia = parseInt(parts[1], 10);
    return sys >= 140 || dia >= 90;
  })();

  const isLowSpo2 = parseFloat(formData.spo2) < 95;
  const bmiBadge = getBmiCategory(formData.bmi);

  return (
    <div className={hideHeader ? "space-y-4" : "p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4"}>
      {/* Header (omitted if hideHeader=true to prevent duplication) */}
      {!hideHeader && (
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
              <HeartPulse size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                <span>Patient Vitals & Biometrics</span>
                {isHighBp && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    Hypertension Alert
                  </span>
                )}
                {isLowSpo2 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    Low SpO2
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500">
                Form to record and update clinical vitals for official prescription
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetToTriage}
            className="text-xs px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 font-semibold border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Reset back to triage intake values"
          >
            <RotateCcw size={12} />
            <span>Reset to Triage</span>
          </button>
        </div>
      )}

      {/* Grid of Vitals Inputs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {/* 1. Blood Pressure */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
          <label className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Activity size={12} className="text-rose-500" />
              Blood Pressure
            </span>
            <span className="text-[10px] text-slate-400 font-mono">mmHg</span>
          </label>
          <input
            type="text"
            value={formData.bp}
            onChange={(e) => updateField("bp", e.target.value)}
            placeholder="120/80"
            className={`w-full px-2.5 py-1.5 rounded-lg bg-white border text-sm font-bold font-mono focus:outline-none transition-colors ${
              isHighBp
                ? "border-rose-300 text-rose-900 focus:border-rose-500"
                : "border-slate-200 text-slate-900 focus:border-teal-500"
            }`}
          />
          <span className="text-[10px] text-slate-400 block">Standard: 120/80 mmHg</span>
        </div>

        {/* 2. Pulse / Heart Rate */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
          <label className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <HeartPulse size={12} className="text-red-500" />
              Heart Rate / Pulse
            </span>
            <span className="text-[10px] text-slate-400 font-mono">bpm</span>
          </label>
          <input
            type="number"
            value={formData.pulse}
            onChange={(e) => updateField("pulse", e.target.value)}
            placeholder="72"
            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-sm font-bold font-mono text-slate-900 focus:border-teal-500 focus:outline-none"
          />
          <span className="text-[10px] text-slate-400 block">Normal: 60–100 bpm</span>
        </div>

        {/* 3. SpO2 */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
          <label className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Wind size={12} className="text-sky-500" />
              Oxygen (SpO2)
            </span>
            <span className="text-[10px] text-slate-400 font-mono">%</span>
          </label>
          <input
            type="number"
            value={formData.spo2}
            onChange={(e) => updateField("spo2", e.target.value)}
            placeholder="99"
            className={`w-full px-2.5 py-1.5 rounded-lg bg-white border text-sm font-bold font-mono focus:outline-none ${
              isLowSpo2
                ? "border-amber-400 text-amber-900 focus:border-amber-500"
                : "border-slate-200 text-slate-900 focus:border-teal-500"
            }`}
          />
          <span className="text-[10px] text-slate-400 block">Normal: 95%–100%</span>
        </div>

        {/* 4. Temperature */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
          <label className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Thermometer size={12} className="text-amber-500" />
              Temperature
            </span>
            <span className="text-[10px] text-slate-400 font-mono">°F</span>
          </label>
          <input
            type="text"
            value={formData.temp}
            onChange={(e) => updateField("temp", e.target.value)}
            placeholder="98.6"
            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-sm font-bold font-mono text-slate-900 focus:border-teal-500 focus:outline-none"
          />
          <span className="text-[10px] text-slate-400 block">Afebrile: 98.6°F</span>
        </div>

        {/* 5. Weight */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
          <label className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Weight size={12} className="text-teal-600" />
              Body Weight
            </span>
            <span className="text-[10px] text-slate-400 font-mono">kg</span>
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.weight}
            onChange={(e) => updateField("weight", e.target.value)}
            placeholder="65"
            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-sm font-bold font-mono text-slate-900 focus:border-teal-500 focus:outline-none"
          />
          <span className="text-[10px] text-slate-400 block">Kilograms (kg)</span>
        </div>

        {/* 6. Height */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
          <label className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Ruler size={12} className="text-purple-600" />
              Height
            </span>
            <span className="text-[10px] text-slate-400 font-mono">cm</span>
          </label>
          <input
            type="number"
            value={formData.height}
            onChange={(e) => updateField("height", e.target.value)}
            placeholder="165"
            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-sm font-bold font-mono text-slate-900 focus:border-teal-500 focus:outline-none"
          />
          <span className="text-[10px] text-slate-400 block">Centimeters (cm)</span>
        </div>

        {/* 7. BMI (Auto-calculated) */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
          <label className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
            <span>Body Mass Index (BMI)</span>
            <span className="text-[10px] text-slate-400 font-mono">kg/m²</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={formData.bmi}
              className="w-20 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-sm font-bold font-mono text-slate-900 focus:outline-none"
            />
            {bmiBadge && (
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded-md border ${bmiBadge.color} truncate`}
              >
                {bmiBadge.label}
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 block">Auto-derived</span>
        </div>

        {/* 8. Blood Glucose (Optional) */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
          <label className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Droplets size={12} className="text-indigo-500" />
              Blood Glucose (RBS)
            </span>
            <span className="text-[10px] text-slate-400 font-mono">mg/dL</span>
          </label>
          <input
            type="number"
            value={formData.bloodGlucose}
            onChange={(e) => updateField("bloodGlucose", e.target.value)}
            placeholder="110"
            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-sm font-bold font-mono text-slate-900 focus:border-teal-500 focus:outline-none"
          />
          <span className="text-[10px] text-slate-400 block">Random blood sugar</span>
        </div>
      </div>

      {/* Clinical Vitals Remarks */}
      <div className="pt-2">
        <label className="text-[11px] font-bold text-slate-600 block mb-1">
          Vitals Clinical Remarks (Optional)
        </label>
        <input
          type="text"
          value={formData.notes}
          onChange={(e) => updateField("notes", e.target.value)}
          placeholder="e.g. Patient rested 10 mins before BP check, bilateral arms equal..."
          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
        />
      </div>
    </div>
  );
}
