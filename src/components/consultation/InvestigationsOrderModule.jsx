import React, { useState, useRef, useEffect } from "react";
import {
  FlaskConical,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  ChevronDown,
  Search,
} from "lucide-react";

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
  { testName: "Serum Ferritin & Iron Studies", category: "Blood" },
  { testName: "Vitamin D3 (25-OH) & B12", category: "Blood" },
  { testName: "Dengue NS1 Antigen & IgM/IgG", category: "Blood" },
  { testName: "Widal Slide Agglutination Test", category: "Blood" },
  { testName: "High-Resolution CT (HRCT) Chest", category: "Radiology" },
  { testName: "2D Echocardiography with Doppler", category: "Cardiology" },
];

const CATEGORIES = ["Blood", "Radiology", "Urine", "Cardiology", "Pathology", "Other"];

export default function InvestigationsOrderModule({
  investigations = [],
  onChange = () => {},
  hideHeader = false,
}) {
  const [testName, setTestName] = useState("");
  const [category, setCategory] = useState("Blood");
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

  const handleAddTest = (nameToAdd, catToAdd) => {
    const finalName = (nameToAdd || testName).trim();
    const finalCat = catToAdd || category;

    if (!finalName) return;

    // Check if duplicate
    const exists = investigations.some(
      (item) => item.testName.toLowerCase() === finalName.toLowerCase()
    );
    if (exists) {
      setTestName("");
      setShowSuggestions(false);
      return;
    }

    const newTest = {
      testName: finalName,
      category: finalCat,
      status: "ordered",
      orderedAt: new Date().toISOString(),
    };

    onChange([...investigations, newTest]);
    setTestName("");
    setShowSuggestions(false);
  };

  const handleSelectSuggestion = (preset) => {
    setTestName(preset.testName);
    setCategory(preset.category);
    setShowSuggestions(false);
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

  const query = testName.trim().toLowerCase();
  const filteredSuggestions = query
    ? TEST_PRESETS.filter(
        (p) =>
          p.testName.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      )
    : TEST_PRESETS;

  return (
    <div className={hideHeader ? "space-y-4" : "bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4"}>
      {/* Header (omitted if hideHeader=true to prevent duplication) */}
      {!hideHeader && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200/60 flex items-center justify-center text-indigo-600">
              <FlaskConical className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Lab & Diagnostic Investigations</h3>
              <p className="text-[11px] text-slate-500">
                Order blood tests, imaging scans, and urine analytics for OPD/Lab draft with live suggestions
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {investigations.length} Ordered
          </span>
        </div>
      )}

      {/* Preset Chips */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Frequent Hospital OPD Panels (Quick Add):</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TEST_PRESETS.slice(0, 8).map((preset) => {
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
                    : "bg-white text-slate-700 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 hover:text-indigo-700 shadow-2xs cursor-pointer"
                }`}
              >
                {isAdded ? "✓ " : "+ "}
                {preset.testName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Input Form with Searchable Autocomplete Dropdown */}
      <div className="space-y-1.5 pt-2 border-t border-slate-100">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
          Frequent Hospital OPD Panels (Search or Type Free Text):
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
          <div ref={dropdownRef} className="relative sm:col-span-7">
            <div className="relative flex items-center">
              <input
                type="text"
                value={testName}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  setTestName(e.target.value);
                  setShowSuggestions(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTest();
                  }
                }}
                placeholder="Search hospital panel or type custom test..."
                className="w-full text-xs px-3 py-2 pr-8 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="absolute right-2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <ChevronDown size={14} />
              </button>
            </div>

            {/* Dropdown suggestions */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 max-h-56 overflow-y-auto divide-y divide-slate-100 animate-fade-in">
                <div className="p-1.5 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider sticky top-0 flex items-center justify-between">
                  <span>Suggested Hospital OPD Panels ({filteredSuggestions.length}):</span>
                  <span className="text-[9px] text-indigo-700 lowercase font-normal">click to pick</span>
                </div>
                {filteredSuggestions.map((preset) => {
                  const isAlreadyAdded = investigations.some(
                    (item) => item.testName.toLowerCase() === preset.testName.toLowerCase()
                  );
                  return (
                    <button
                      key={preset.testName}
                      type="button"
                      onClick={() => handleSelectSuggestion(preset)}
                      className="w-full text-left p-2.5 hover:bg-indigo-50/70 transition-colors flex items-center justify-between gap-2 text-xs cursor-pointer group"
                    >
                      <span className="font-semibold text-slate-800 group-hover:text-indigo-900">
                        {preset.testName}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getCategoryColor(
                            preset.category
                          )}`}
                        >
                          {preset.category}
                        </span>
                        {isAlreadyAdded && (
                          <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1 rounded">
                            Added
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
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
              className="w-full h-full min-h-[34px] px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
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
