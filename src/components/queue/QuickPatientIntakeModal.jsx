import React, { useState } from "react";
import {
  X,
  UserPlus,
  HeartPulse,
  Activity,
  Scale,
  Ruler,
  AlertTriangle,
  Stethoscope,
  Sparkles,
  Check,
} from "lucide-react";
import { hospitalDb } from "../../db/hospitalDb.js";
import { generateId } from "../../utils/generateId.js";

/**
 * QuickPatientIntakeModal
 * -----------------------
 * Modal to quickly register and queue a new walk-in patient.
 * Features:
 * - Removed blood group field as requested
 * - BP captured as 2 distinct fields: Systolic (sys) & Diastolic (dia)
 * - Captures Weight (kg), Height (cm), Pulse (bpm) with auto-calculated BMI
 */
export default function QuickPatientIntakeModal({
  isOpen = false,
  onClose = () => {},
  onPatientAdded = () => {},
  currentTotalPatients = 6,
}) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Female",
    phone: "+91 9",
    priority: "normal",
    isPregnant: false,
    isHandicapped: false,
    allergies: "NKDA",
    sys: "120",
    dia: "80",
    pulse: "76",
    weight: "65",
    height: "165",
    spo2: "99",
    temp: "98.4",
    chiefComplaint: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Auto-calculate BMI from weight (kg) and height (cm)
  const calculateBmi = (weightKg, heightCm) => {
    const w = parseFloat(weightKg);
    const h = parseFloat(heightCm) / 100;
    if (w > 0 && h > 0) {
      return parseFloat((w / (h * h)).toFixed(1));
    }
    return 22.5;
  };

  const currentBmi = calculateBmi(formData.weight, formData.height);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      const nextNum = currentTotalPatients + 1;
      const tokenNumber = `#W-${String(nextNum).padStart(2, "0")}`;
      const newId = generateId("pat");
      const uhid = `UHID-${20000 + Math.floor(Math.random() * 80000)}`;

      const sys = parseInt(formData.sys, 10) || 120;
      const dia = parseInt(formData.dia, 10) || 80;
      const weightNum = parseFloat(formData.weight) || 65;
      const heightNum = parseFloat(formData.height) || 165;
      const bmiNum = calculateBmi(weightNum, heightNum);

      const newPatient = {
        id: newId,
        uhid,
        tokenNumber,
        name: formData.name.trim(),
        age: parseInt(formData.age, 10) || 30,
        gender: formData.gender,
        phone: formData.phone.trim(),
        isPregnant: Boolean(formData.isPregnant),
        pregnancyDetails: formData.isPregnant
          ? { trimester: "2nd", gestationalWeeks: 20, edd: "2027-03-15" }
          : null,
        isHandicapped: Boolean(formData.isHandicapped),
        allergies: formData.allergies ? [formData.allergies.trim()] : ["NKDA"],
        vitals: {
          bp: `${sys}/${dia}`,
          pulse: parseInt(formData.pulse, 10) || 76,
          temp: parseFloat(formData.temp) || 98.4,
          spo2: parseInt(formData.spo2, 10) || 99,
          weight: weightNum,
          height: heightNum,
          bmi: bmiNum,
        },
        queueStatus: "waiting",
        consultationType: "walk_in",
        visitType: "new",
        priority: formData.priority,
        chiefComplaintSummary:
          formData.chiefComplaint.trim() || "General outpatient medical consultation",
        scheduledTime: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        consultationStartTime: null,
      };

      await hospitalDb.patients.add(newPatient);
      onPatientAdded(newPatient);
      onClose();
    } catch (err) {
      console.error("Failed to add walk-in patient:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-sky-700 via-sky-800 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 text-white shadow-inner">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Quick Walk-in Patient Intake</h3>
              <p className="text-xs text-sky-200">
                Register demographics & vitals to generate queue token
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-sky-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Patient Full Name */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1 text-xs">
              Patient Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Ramesh Kumar"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 text-slate-900 text-sm font-medium"
            />
          </div>

          {/* Age & Gender (Blood group removed) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Age (Years)</label>
              <input
                type="number"
                min="1"
                max="115"
                required
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="32"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Mobile & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Mobile Contact</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Triage Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
              >
                <option value="normal">Normal (Routine Lobby)</option>
                <option value="urgent">Urgent / Acute Priority</option>
                <option value="senior">Senior Citizen (60+)</option>
              </select>
            </div>
          </div>

          {/* Recorded Vitals Section */}
          <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
              <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-rose-500" />
                Vital Signs & Anthropometry
              </span>
              <span className="text-[11px] font-mono font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full">
                BMI: {currentBmi} kg/m²
              </span>
            </div>

            {/* Row 1: Blood Pressure (2 separate fields for Sys & Dia) */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Blood Pressure (mmHg)
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="number"
                      min="60"
                      max="250"
                      value={formData.sys}
                      onChange={(e) => setFormData({ ...formData, sys: e.target.value })}
                      placeholder="120"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono text-center font-bold"
                    />
                    <span className="absolute right-2 top-1.5 text-[10px] text-slate-400 font-sans">
                      SYS
                    </span>
                  </div>
                </div>
                <span className="text-slate-400 font-bold text-base">/</span>
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="number"
                      min="40"
                      max="150"
                      value={formData.dia}
                      onChange={(e) => setFormData({ ...formData, dia: e.target.value })}
                      placeholder="80"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono text-center font-bold"
                    />
                    <span className="absolute right-2 top-1.5 text-[10px] text-slate-400 font-sans">
                      DIA
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Weight, Height, Pulse (bpm) */}
            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Weight (kg)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="250"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="65"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                  <span className="absolute right-2 top-1.5 text-[10px] text-slate-400">kg</span>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Height (cm)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="40"
                    max="240"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    placeholder="165"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                  <span className="absolute right-2 top-1.5 text-[10px] text-slate-400">cm</span>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Pulse (BPM)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="30"
                    max="220"
                    value={formData.pulse}
                    onChange={(e) => setFormData({ ...formData, pulse: e.target.value })}
                    placeholder="76"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                  <span className="absolute right-2 top-1.5 text-[10px] text-slate-400">bpm</span>
                </div>
              </div>
            </div>

            {/* Row 3: SpO2, Temp */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  SpO2 (%)
                </label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={formData.spo2}
                  onChange={(e) => setFormData({ ...formData, spo2: e.target.value })}
                  placeholder="99"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Temp (°F)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="94"
                  max="108"
                  value={formData.temp}
                  onChange={(e) => setFormData({ ...formData, temp: e.target.value })}
                  placeholder="98.4"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Chief Complaint */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Chief Complaints / Reason for Visit
            </label>
            <textarea
              rows={2}
              value={formData.chiefComplaint}
              onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
              placeholder="e.g. Fever with chills x 3 days, body aches and dry cough"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 text-slate-900"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold flex items-center gap-1.5 shadow-md shadow-sky-500/20 transition-all cursor-pointer disabled:opacity-60"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isSubmitting ? "Dispensing Token..." : "Register & Dispense Token"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
