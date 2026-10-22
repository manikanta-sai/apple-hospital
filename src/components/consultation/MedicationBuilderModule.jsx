import React, { useState, useRef, useEffect } from "react";
import {
  Pill,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  Calculator,
  AlertCircle,
  FileText,
  Check,
  Search,
  ChevronDown,
} from "lucide-react";
import { generateId } from "../../utils/generateId.js";

const FREQUENT_MEDS = [
  {
    drugName: "Tab. Paracetamol 650mg",
    genericName: "Paracetamol 650mg",
    form: "Tablet",
    dosage: "650mg",
    frequency: "1-0-1",
    timing: "After Food",
    durationDays: 5,
    instructions: "Take with warm water after meals for fever/pain",
  },
  {
    drugName: "Cap. Amox-Clav 625mg",
    genericName: "Amoxicillin 500mg + Clavulanic Acid 125mg",
    form: "Capsule",
    dosage: "625mg",
    frequency: "1-0-1",
    timing: "After Food",
    durationDays: 5,
    instructions: "Complete full 5 days antibiotic course without skipping",
  },
  {
    drugName: "Tab. Azithromycin 500mg",
    genericName: "Azithromycin 500mg",
    form: "Tablet",
    dosage: "500mg",
    frequency: "1-0-0",
    timing: "Empty Stomach",
    durationDays: 3,
    instructions: "Take 1 hour before or 2 hours after meals once daily",
  },
  {
    drugName: "Tab. Pantoprazole 40mg",
    genericName: "Pantoprazole Sodium 40mg",
    form: "Tablet",
    dosage: "40mg",
    frequency: "1-0-0",
    timing: "Empty Stomach",
    durationDays: 7,
    instructions: "Take 30 minutes before breakfast",
  },
  {
    drugName: "Tab. Montelukast 10mg + Levocetirizine 5mg",
    genericName: "Montelukast 10mg + Levocetirizine 5mg",
    form: "Tablet",
    dosage: "10mg/5mg",
    frequency: "0-0-1",
    timing: "At Bedtime",
    durationDays: 10,
    instructions: "Take at night for allergic rhinitis and respiratory congestion",
  },
  {
    drugName: "Tab. Bilastine 20mg",
    genericName: "Bilastine 20mg",
    form: "Tablet",
    dosage: "20mg",
    frequency: "1-0-0",
    timing: "Empty Stomach",
    durationDays: 10,
    instructions: "Take 1 hour before breakfast or 2 hours after food",
  },
  {
    drugName: "Tab. Metformin 500mg",
    genericName: "Metformin Hydrochloride 500mg",
    form: "Tablet",
    dosage: "500mg",
    frequency: "1-0-1",
    timing: "After Food",
    durationDays: 30,
    instructions: "Take immediately after morning and night meals",
  },
  {
    drugName: "Tab. Telmisartan 40mg",
    genericName: "Telmisartan 40mg",
    form: "Tablet",
    dosage: "40mg",
    frequency: "1-0-0",
    timing: "Before Food",
    durationDays: 30,
    instructions: "Take every morning for blood pressure maintenance",
  },
  {
    drugName: "Tab. Aceclofenac 100mg + Paracetamol 325mg",
    genericName: "Aceclofenac 100mg + Paracetamol 325mg",
    form: "Tablet",
    dosage: "100/325mg",
    frequency: "1-0-1",
    timing: "After Food",
    durationDays: 5,
    instructions: "Take after food with antacid for joint/musculoskeletal pain",
  },
  {
    drugName: "Tab. Cefixime 200mg",
    genericName: "Cefixime 200mg",
    form: "Tablet",
    dosage: "200mg",
    frequency: "1-0-1",
    timing: "After Food",
    durationDays: 5,
    instructions: "Take twice daily after meals for bacterial infections",
  },
  {
    drugName: "Syp. Cough Relief (Ambroxol + Levosalbutamol)",
    genericName: "Ambroxol 30mg + Levosalbutamol 1mg",
    form: "Syrup",
    dosage: "10ml",
    frequency: "1-1-1",
    timing: "After Food",
    durationDays: 5,
    instructions: "Shake well before use, take 10ml thrice daily",
  },
  {
    drugName: "Fluticasone Nasal Spray",
    genericName: "Fluticasone Furoate 27.5mcg",
    form: "Drops",
    dosage: "1 spray/nostril",
    frequency: "1-0-1",
    timing: "Before Food",
    durationDays: 14,
    instructions: "1 spray in each nostril twice daily after blowing nose",
  },
];

const FORMS = ["Tablet", "Capsule", "Syrup", "Injection", "Drops", "Ointment", "Inhaler"];
const FREQUENCIES = [
  { id: "1-0-1", label: "1-0-1", desc: "Twice daily (Morn & Night)", perDay: 2 },
  { id: "1-0-0", label: "1-0-0", desc: "Once daily (Morning)", perDay: 1 },
  { id: "0-0-1", label: "0-0-1", desc: "Once daily (Night)", perDay: 1 },
  { id: "1-1-1", label: "1-1-1", desc: "Three times daily", perDay: 3 },
  { id: "SOS", label: "SOS", desc: "As needed during distress", perDay: 2 },
];
const TIMINGS = ["After Food", "Before Food", "Empty Stomach", "At Bedtime"];

/**
 * MedicationBuilderModule
 * -----------------------
 * Dynamic medication prescriber with auto-calculated total quantity, frequency matrix,
 * meal timing, and 1-click pharmacopeia templates.
 */
export default function MedicationBuilderModule({
  medications = [],
  onChange = () => {},
  hideHeader = false,
}) {
  const [drugName, setDrugName] = useState("");
  const [genericName, setGenericName] = useState("");
  const [form, setForm] = useState("Tablet");
  const [dosage, setDosage] = useState("500mg");
  const [frequency, setFrequency] = useState("1-0-1");
  const [timing, setTiming] = useState("After Food");
  const [durationDays, setDurationDays] = useState("5");
  const [instructions, setInstructions] = useState("Take after meals with water");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Calculate total units
  const calculateTotalQuantity = (freq, days) => {
    const d = parseInt(days, 10) || 1;
    const fObj = FREQUENCIES.find((f) => f.id === freq);
    const pillsPerDay = fObj ? fObj.perDay : 1;
    return d * pillsPerDay;
  };

  const handleAddMedication = (e) => {
    if (e) e.preventDefault();
    if (!drugName.trim()) return;

    const days = parseInt(durationDays, 10) || 5;
    const totalQty = calculateTotalQuantity(frequency, days);

    const newMed = {
      id: generateId("med"),
      drugName: drugName.trim(),
      genericName: genericName.trim() || drugName.trim(),
      form,
      dosage: dosage.trim() || "Standard",
      frequency,
      timing,
      durationDays: days,
      totalQuantity: totalQty,
      instructions: instructions.trim() || "Follow doctor instructions",
    };

    onChange([...medications, newMed]);

    // Reset fields
    setDrugName("");
    setGenericName("");
    setShowSuggestions(false);
  };

  const handleSelectSuggestion = (preset) => {
    setDrugName(preset.drugName);
    setGenericName(preset.genericName || preset.drugName);
    if (preset.form) setForm(preset.form);
    if (preset.dosage) setDosage(preset.dosage);
    if (preset.frequency) setFrequency(preset.frequency);
    if (preset.timing) setTiming(preset.timing);
    if (preset.durationDays) setDurationDays(String(preset.durationDays));
    if (preset.instructions) setInstructions(preset.instructions);
    setShowSuggestions(false);
  };

  const handleAddPresetDirect = (preset) => {
    const totalQty = calculateTotalQuantity(preset.frequency, preset.durationDays);
    const newMed = {
      id: generateId("med"),
      ...preset,
      totalQuantity: totalQty,
    };
    onChange([...medications, newMed]);
  };

  const handleRemove = (id) => {
    onChange(medications.filter((m) => m.id !== id));
  };

  const query = drugName.trim().toLowerCase();
  const filteredSuggestions = query
    ? FREQUENT_MEDS.filter(
        (m) =>
          m.drugName.toLowerCase().includes(query) ||
          m.genericName.toLowerCase().includes(query)
      )
    : FREQUENT_MEDS;

  return (
    <div className={hideHeader ? "space-y-4" : "p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4"}>
      {/* Section Header */}
      {!hideHeader && (
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-xs">
              4
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Medications Prescribed (℞)</h3>
              <p className="text-[11px] text-slate-500">Pharmacopeia dosing, timing, and quantity with search suggestion</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
            {medications.length} Prescribed
          </span>
        </div>
      )}

      {/* Quick Common Presets */}
      <div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
          Frequent OPD Prescriptions (Quick Add):
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {FREQUENT_MEDS.slice(0, 6).map((preset) => (
            <button
              key={preset.drugName}
              type="button"
              onClick={() => handleAddPresetDirect(preset)}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 hover:border-emerald-300 transition-colors cursor-pointer"
            >
              <span>{preset.drugName}</span>
              <Plus size={11} className="text-slate-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Existing Prescribed Medicines List */}
      {medications.length > 0 && (
        <div className="space-y-2">
          {medications.map((item, index) => (
            <div
              key={item.id || index}
              className="p-3 rounded-xl bg-slate-50/90 border border-slate-200/90 flex items-start justify-between gap-3 text-xs group hover:border-slate-300 transition-all"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">
                    {item.drugName}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white border border-slate-200 text-emerald-800">
                    {item.form}
                  </span>
                  <span className="px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-slate-900 text-white">
                    {item.frequency}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-sky-50 text-sky-800 border border-sky-200">
                    {item.timing}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    x {item.durationDays} days
                  </span>
                  <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-200/80 px-2 py-0.2 rounded-md">
                    Qty: {item.totalQuantity}
                  </span>
                </div>

                {item.instructions && (
                  <p className="text-[11px] text-slate-500 italic pl-1">
                    ↳ {item.instructions}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                title="Remove medicine"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Medication Entry Form */}
      <form
        onSubmit={handleAddMedication}
        className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/90 space-y-3 text-xs"
      >
        <span className="font-bold text-slate-800 block">Add New Medication:</span>

        {/* Drug Name & Dosage */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          {/* Drug Name with Dropdown Autocomplete */}
          <div ref={dropdownRef} className="relative sm:col-span-6">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Frequent OPD Prescriptions (Search or Type Free Text) <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                required
                value={drugName}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  setDrugName(e.target.value);
                  setShowSuggestions(true);
                }}
                placeholder="Search prescription or type free text..."
                className="w-full px-3 py-1.5 pr-8 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <button
                type="button"
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="absolute right-2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <ChevronDown size={14} />
              </button>
            </div>

            {/* Dropdown Suggestions */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 max-h-60 overflow-y-auto divide-y divide-slate-100 animate-fade-in">
                <div className="p-1.5 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider sticky top-0 flex items-center justify-between">
                  <span>Suggested OPD Prescriptions ({filteredSuggestions.length}):</span>
                  <span className="text-[9px] text-emerald-700 lowercase font-normal">click to auto-fill</span>
                </div>
                {filteredSuggestions.map((preset) => (
                  <button
                    key={preset.drugName}
                    type="button"
                    onClick={() => handleSelectSuggestion(preset)}
                    className="w-full text-left p-2.5 hover:bg-emerald-50/70 transition-colors flex items-center justify-between gap-2 text-xs cursor-pointer group"
                  >
                    <div>
                      <span className="font-semibold text-slate-800 group-hover:text-emerald-900 block">
                        {preset.drugName}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {preset.genericName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700">
                        {preset.frequency}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {preset.timing}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="sm:col-span-3">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Dosage</label>
            <input
              type="text"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="e.g. 500mg"
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Form</label>
            <select
              value={form}
              onChange={(e) => setForm(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium"
            >
              {FORMS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Frequency & Meal Timing */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          <div className="sm:col-span-6">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Frequency (Daily Dosing)
            </label>
            <div className="grid grid-cols-5 gap-1">
              {FREQUENCIES.map((freq) => (
                <button
                  key={freq.id}
                  type="button"
                  onClick={() => setFrequency(freq.id)}
                  className={`py-1 rounded-lg font-mono font-bold text-xs text-center border transition-all cursor-pointer ${
                    frequency === freq.id
                      ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                  title={freq.desc}
                >
                  {freq.label}
                </button>
              ))}
            </div>
          </div>

          <div className="sm:col-span-4">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Meal Timing
            </label>
            <select
              value={timing}
              onChange={(e) => setTiming(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium"
            >
              {TIMINGS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Days (Duration)
            </label>
            <input
              type="number"
              min="1"
              max="90"
              value={durationDays}
              onChange={(e) => setDurationDays(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono text-center font-bold"
            />
          </div>
        </div>

        {/* Special Instructions & Add Button */}
        <div className="flex items-center gap-2.5">
          <input
            type="text"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Special instructions (e.g. take with plenty of water)..."
            className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900"
          />

          <button
            type="submit"
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer shrink-0"
          >
            <Plus size={14} />
            <span>Add Medication</span>
          </button>
        </div>
      </form>
    </div>
  );
}
