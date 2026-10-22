import React, { useState } from "react";
import {
  AlertCircle,
  Plus,
  Trash2,
  Tag,
  Clock,
  Activity,
  Flame,
  Check,
} from "lucide-react";
import { generateId } from "../../utils/generateId.js";

const PRESET_COMPLAINTS = [
  { text: "Acute High Fever with Chills", duration: 3, unit: "Days", severity: "Moderate", bodyPart: "General" },
  { text: "Dry Persistent Paroxysmal Cough", duration: 5, unit: "Days", severity: "Moderate", bodyPart: "Respiratory" },
  { text: "Severe Morning Nausea & Epigastric Burning", duration: 4, unit: "Days", severity: "Moderate", bodyPart: "Gastrointestinal" },
  { text: "Bilateral Itchy Watery Eyes & Sneezing", duration: 5, unit: "Days", severity: "Moderate", bodyPart: "ENT" },
  { text: "Throbbing Holocranial Headache", duration: 2, unit: "Days", severity: "Severe", bodyPart: "Neurology" },
  { text: "Bilateral Knee Joint Pain on Walking", duration: 3, unit: "Months", severity: "Mild", bodyPart: "Musculoskeletal" },
  { text: "General Body Malaise & Fatigue", duration: 1, unit: "Weeks", severity: "Mild", bodyPart: "General" },
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

/**
 * ChiefComplaintsModule
 * ---------------------
 * Structured Chief Complaints editor with duration, severity, and anatomical body part.
 */
export default function ChiefComplaintsModule({
  complaints = [],
  onChange = () => {},
}) {
  const [newText, setNewText] = useState("");
  const [newDuration, setNewDuration] = useState("3");
  const [newUnit, setNewUnit] = useState("Days");
  const [newSeverity, setNewSeverity] = useState("Moderate");
  const [newBodyPart, setNewBodyPart] = useState("General");

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
  };

  const handleAddPreset = (preset) => {
    // Avoid exact duplicate
    if (complaints.some((c) => c.complaint.toLowerCase() === preset.text.toLowerCase())) return;

    const newEntry = {
      id: generateId("cc"),
      complaint: preset.text,
      duration: preset.duration,
      durationUnit: preset.unit,
      severity: preset.severity,
      bodyPartId: preset.bodyPart,
    };

    onChange([...complaints, newEntry]);
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

  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.90)",
        backdropFilter: "blur(14px)",
        border: "1px solid #e2e8f0",
        borderRadius: 18,
        boxShadow: "0 2px 12px rgba(0,0,0,0.02)",
      }}
      className="p-4 sm:p-5 space-y-4"
    >
      {/* Section Header */}
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

      {/* Preset Quick Chips */}
      <div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
          Frequent OPD Complaints:
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {PRESET_COMPLAINTS.map((preset) => {
            const isAdded = complaints.some(
              (c) => c.complaint.toLowerCase() === preset.text.toLowerCase()
            );
            return (
              <button
                key={preset.text}
                type="button"
                onClick={() => handleAddPreset(preset)}
                disabled={isAdded}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 border transition-all cursor-pointer ${
                  isAdded
                    ? "bg-slate-100 text-slate-400 border-slate-200 cursor-default opacity-60"
                    : "bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-900 border-slate-200 hover:border-sky-300"
                }`}
              >
                <span>{preset.text}</span>
                {isAdded ? <Check size={11} /> : <Plus size={11} className="text-slate-400" />}
              </button>
            );
          })}
        </div>
      </div>

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
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                  {item.bodyPartId || "General"}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Remove complaint"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Custom Complaint Row */}
      <form
        onSubmit={handleAddComplaint}
        className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-2.5"
      >
        <span className="text-[11px] font-bold text-slate-700 block">Add Custom Complaint:</span>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
          <div className="sm:col-span-5">
            <input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="e.g. Sharp epigastric burning pain"
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            />
          </div>

          <div className="sm:col-span-2 flex items-center gap-1">
            <input
              type="number"
              min="1"
              max="365"
              value={newDuration}
              onChange={(e) => setNewDuration(e.target.value)}
              className="w-14 px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-center font-mono"
            />
            <select
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
              className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900"
            >
              <option value="Days">Days</option>
              <option value="Weeks">Weeks</option>
              <option value="Months">Months</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={newSeverity}
              onChange={(e) => setNewSeverity(e.target.value)}
              className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900"
            >
              <option value="Mild">Mild</option>
              <option value="Moderate">Moderate</option>
              <option value="Severe">Severe</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={newBodyPart}
              onChange={(e) => setNewBodyPart(e.target.value)}
              className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900"
            >
              {BODY_PARTS.map((bp) => (
                <option key={bp} value={bp}>
                  {bp}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-1">
            <button
              type="submit"
              className="w-full h-full min-h-[32px] bg-slate-900 hover:bg-slate-800 text-white rounded-lg flex items-center justify-center font-bold text-xs shadow-xs transition-colors cursor-pointer"
              title="Add complaint"
            >
              <Plus size={15} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
