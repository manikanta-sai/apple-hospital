import React, { useState } from "react";
import { FlaskConical, Plus, Trash2, CheckCircle2, Sparkles, AlertCircle } from "lucide-react";

const TEST_PRESETS = [
  { testName: "Complete Blood Count (CBC)", category: "Blood" },
  { testName: "Liver Function Test (LFT)", category: "Blood" },
  { testName: "Kidney Function Test (KFT)", category: "Blood" },
  { testName: "HbA1c & Fasting Blood Sugar", category: "Blood" },
  { testName: "Lipid Profile", category: "Blood" },
  { testName: "Thyroid Profile (T3, T4, TSH)", category: "Blood" },
  { testName: "Urine Routine & Microscopy", category: "Urine" },
  { testName: "Chest X-Ray (PA View)", category: "Radiology" },
  { testName: "USG Whole Abdomen & Pelvis", category: "Radiology" },
  { testName: "12-Lead ECG", category: "Cardiology" },
  { testName: "Serum Electrolytes (Na+, K+, Cl-)", category: "Blood" },
];

const CATEGORIES = ["Blood", "Radiology", "Urine", "Cardiology", "Pathology", "Other"];

export default function InvestigationsOrderModule({
  investigations = [],
  onChange = () => {},
}) {
  const [testName, setTestName] = useState("");
  const [category, setCategory] = useState("Blood");

  const handleAddTest = (nameToAdd, catToAdd) => {
    const finalName = (nameToAdd || testName).trim();
    const finalCat = catToAdd || category;

    if (!finalName) return;

    // Check if duplicate
    const exists = investigations.some(
      (item) => item.testName.toLowerCase() === finalName.toLowerCase()
    );
    if (exists) return;

    const newTest = {
      testName: finalName,
      category: finalCat,
      status: "ordered",
      orderedAt: new Date().toISOString(),
    };

    onChange([...investigations, newTest]);
    setTestName("");
  };

  const handleRemoveTest = (index) => {
    const updated = investigations.filter((_, i) => i !== index);
    onChange(updated);
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case "Blood":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "Radiology":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "Urine":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Cardiology":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200/60 flex items-center justify-center text-indigo-600">
            <FlaskConical className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Lab & Diagnostic Investigations</h3>
            <p className="text-[11px] text-slate-500">
              Order blood tests, imaging scans, and urine analytics for OPD/Lab draft
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          {investigations.length} Ordered
        </span>
      </div>

      {/* Preset Chips */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Frequent Hospital OPD Panels:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TEST_PRESETS.map((preset) => {
            const isAdded = investigations.some(
              (item) => item.testName.toLowerCase() === preset.testName.toLowerCase()
            );
            return (
              <button
                key={preset.testName}
                type="button"
                disabled={isAdded}
                onClick={() => handleAddTest(preset.testName, preset.category)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
                  isAdded
                    ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                    : "bg-white text-slate-700 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 hover:text-indigo-700 shadow-2xs"
                }`}
              >
                {isAdded ? "✓ " : "+ "}
                {preset.testName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Input Form */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-2 border-t border-slate-100">
        <div className="sm:col-span-7">
          <input
            type="text"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTest();
              }
            }}
            placeholder="Type investigation name (e.g. Troponin-I, CT Brain)..."
            className="w-full text-xs px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
        <div className="sm:col-span-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full text-xs px-2.5 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 font-medium"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <button
            type="button"
            onClick={() => handleAddTest()}
            disabled={!testName.trim()}
            className="w-full h-full min-h-[34px] px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Ordered Tests List */}
      {investigations.length > 0 ? (
        <div className="space-y-2 pt-2">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Requisition Queue:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {investigations.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/90 text-xs hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${getCategoryColor(
                      item.category
                    )}`}
                  >
                    {item.category}
                  </span>
                  <span className="font-semibold text-slate-800 truncate" title={item.testName}>
                    {item.testName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveTest(idx)}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
                  title="Remove test"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
          <p className="text-xs text-slate-400">
            No lab investigations ordered. Select from presets above or enter a custom test.
          </p>
        </div>
      )}
    </div>
  );
}
