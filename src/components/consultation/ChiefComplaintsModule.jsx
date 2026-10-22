import React, { useState, useRef, useEffect } from "react";
import {
  AlertCircle,
  Plus,
  Trash2,
  Tag,
  Clock,
  Activity,
  Flame,
  Check,
  Search,
  ChevronDown,
} from "lucide-react";
import { generateId } from "../../utils/generateId.js";

const FREQUENT_COMPLAINTS = [
  { text: "Acute High Fever with Chills", duration: 3, unit: "Days", severity: "Moderate", bodyPart: "General" },
  { text: "Dry Persistent Paroxysmal Cough", duration: 5, unit: "Days", severity: "Moderate", bodyPart: "Respiratory" },
  { text: "Productive Cough with Mucopurulent Sputum", duration: 4, unit: "Days", severity: "Moderate", bodyPart: "Respiratory" },
  { text: "Severe Morning Nausea & Epigastric Burning", duration: 4, unit: "Days", severity: "Moderate", bodyPart: "Gastrointestinal" },
  { text: "Bilateral Itchy Watery Eyes & Sneezing", duration: 5, unit: "Days", severity: "Moderate", bodyPart: "ENT" },
  { text: "Throbbing Holocranial Headache", duration: 2, unit: "Days", severity: "Severe", bodyPart: "Neurology" },
  { text: "Bilateral Knee Joint Pain on Walking", duration: 3, unit: "Months", severity: "Mild", bodyPart: "Musculoskeletal" },
  { text: "General Body Malaise & Fatigue", duration: 1, unit: "Weeks", severity: "Mild", bodyPart: "General" },
  { text: "Shortness of Breath on Exertion (Dyspnea)", duration: 3, unit: "Days", severity: "Severe", bodyPart: "Cardiovascular" },
  { text: "Sore Throat & Pain on Swallowing", duration: 2, unit: "Days", severity: "Moderate", bodyPart: "ENT" },
  { text: "Loose Watery Stools & Abdominal Cramps", duration: 2, unit: "Days", severity: "Moderate", bodyPart: "Gastrointestinal" },
  { text: "Burning Micturition & Urinary Frequency", duration: 3, unit: "Days", severity: "Moderate", bodyPart: "Urology" },
  { text: "Pruritic Erythematous Skin Rash", duration: 4, unit: "Days", severity: "Mild", bodyPart: "Dermatology" },
  { text: "Acute Upper Epigastric Pain after Food", duration: 1, unit: "Days", severity: "Severe", bodyPart: "Gastrointestinal" },
];

const BODY_PARTS = [
  "General",
  "ENT",
  "Respiratory",
  "Cardiovascular",
  "Gastrointestinal",
  "Musculoskeletal",
  "Dermatology",
  "Neurology",
  "Urology",
];

export default function ChiefComplaintsModule({
  complaints = [],
  onChange = () => {},
  hideHeader = false,
}) {
  const [newText, setNewText] = useState("");
  const [newDuration, setNewDuration] = useState("3");
  const [newUnit, setNewUnit] = useState("Days");
  const [newSeverity, setNewSeverity] = useState("Moderate");
  const [newBodyPart, setNewBodyPart] = useState("General");
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

  const handleAddComplaint = (e) => {
    if (e) e.preventDefault();
    if (!newText.trim()) return;

    const newEntry = {
      id: generateId("cc"),
      complaint: newText.trim(),
      duration: parseInt(newDuration, 10) || 1,
      durationUnit: newUnit,
      severity: newSeverity,
      bodyPartId: newBodyPart,
    };

    onChange([...complaints, newEntry]);
    setNewText("");
    setShowSuggestions(false);
  };

  const handleSelectSuggestion = (item) => {
    setNewText(item.text);
    if (item.duration) setNewDuration(String(item.duration));
    if (item.unit) setNewUnit(item.unit);
    if (item.severity) setNewSeverity(item.severity);
    if (item.bodyPart) setNewBodyPart(item.bodyPart);
    setShowSuggestions(false);
  };

  const handleRemove = (id) => {
    onChange(complaints.filter((c) => c.id !== id));
  };

  const getSeverityStyle = (sev) => {
    switch (sev) {
      case "Severe":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "Mild":
        return "bg-teal-50 text-teal-700 border-teal-200";
      case "Moderate":
      default:
        return "bg-amber-50 text-amber-800 border-amber-200";
    }
  };

  // Filtered suggestions based on user input
  const query = newText.trim().toLowerCase();
  const filteredSuggestions = query
    ? FREQUENT_COMPLAINTS.filter(
        (c) =>
          c.text.toLowerCase().includes(query) ||
          c.bodyPart.toLowerCase().includes(query)
      )
    : FREQUENT_COMPLAINTS;

  return (
    <div className={hideHeader ? "space-y-4" : "p-4 sm:p-5 space-y-4 bg-white/95 rounded-2xl border border-slate-200 shadow-2xs"}>
      {/* Section Header (omitted if hideHeader=true to prevent duplication) */}
      {!hideHeader && (
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center font-bold text-xs">
              1
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Chief Complaints</h3>
              <p className="text-[11px] text-slate-500">Patient presenting symptoms & timeline</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono">
            {complaints.length} Recorded
          </span>
        </div>
      )}

      {/* Existing Complaints List */}
      {complaints.length > 0 && (
        <div className="space-y-2">
          {complaints.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50/90 border border-slate-200/80 group hover:border-slate-300 transition-all text-xs"
            >
              <div className="flex items-center gap-2.5 flex-wrap flex-1">
                <span className="font-bold text-slate-900">{item.complaint}</span>
                <span className="px-2 py-0.5 rounded-md font-mono text-[11px] bg-white border border-slate-200 text-slate-600">
                  ⏱️ {item.duration} {item.durationUnit}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md font-semibold text-[10px] uppercase border ${getSeverityStyle(
                    item.severity
                  )}`}
                >
                  {item.severity}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-200/70 text-slate-700">
                  {item.bodyPartId}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors cursor-pointer"
                title="Remove complaint"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Form: Searchable Dropdown with Free-Text Typing */}
      <form onSubmit={handleAddComplaint} className="space-y-3 pt-1">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-start">
          {/* Complaint Text Input with Live Dropdown Suggestions */}
          <div ref={dropdownRef} className="relative sm:col-span-6">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Frequent OPD Complaints (Search or Type Free Text):
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                required
                value={newText}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  setNewText(e.target.value);
                  setShowSuggestions(true);
                }}
                placeholder="Type or search complaint (e.g. Acute Fever, Cough, Headache)..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none transition-all pr-8"
              />
              <button
                type="button"
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="absolute right-2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <ChevronDown size={14} />
              </button>
            </div>

            {/* Suggestions Searchable Dropdown Menu */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 max-h-56 overflow-y-auto divide-y divide-slate-100 animate-fade-in">
                <div className="p-1.5 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider sticky top-0 flex items-center justify-between">
                  <span>Suggested OPD Complaints ({filteredSuggestions.length}):</span>
                  <span className="text-[9px] text-teal-700 lowercase font-normal">click to pick</span>
                </div>
                {filteredSuggestions.map((item) => (
                  <button
                    key={item.text}
                    type="button"
                    onClick={() => handleSelectSuggestion(item)}
                    className="w-full text-left p-2.5 hover:bg-teal-50/70 transition-colors flex items-center justify-between gap-2 text-xs cursor-pointer group"
                  >
                    <span className="font-semibold text-slate-800 group-hover:text-teal-900">
                      {item.text}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        {item.duration} {item.unit}
                      </span>
                      <span className="text-[9px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded">
                        {item.bodyPart}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Duration */}
          <div className="sm:col-span-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Duration
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="1"
                max="365"
                value={newDuration}
                onChange={(e) => setNewDuration(e.target.value)}
                className="w-14 px-2 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-center font-mono font-bold focus:bg-white focus:border-teal-500 focus:outline-none"
              />
              <select
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value)}
                className="flex-1 px-2 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:bg-white focus:border-teal-500 focus:outline-none"
              >
                <option value="Days">Days</option>
                <option value="Weeks">Weeks</option>
                <option value="Months">Months</option>
              </select>
            </div>
          </div>

          {/* Severity */}
          <div className="sm:col-span-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Severity
            </label>
            <select
              value={newSeverity}
              onChange={(e) => setNewSeverity(e.target.value)}
              className="w-full px-2 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:bg-white focus:border-teal-500 focus:outline-none"
            >
              <option value="Mild">Mild</option>
              <option value="Moderate">Moderate</option>
              <option value="Severe">Severe</option>
            </select>
          </div>

          {/* Body Part System */}
          <div className="sm:col-span-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              System / Part
            </label>
            <select
              value={newBodyPart}
              onChange={(e) => setNewBodyPart(e.target.value)}
              className="w-full px-2 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:bg-white focus:border-teal-500 focus:outline-none"
            >
              {BODY_PARTS.map((bp) => (
                <option key={bp} value={bp}>
                  {bp}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Complaint</span>
          </button>
        </div>
      </form>
    </div>
  );
}
