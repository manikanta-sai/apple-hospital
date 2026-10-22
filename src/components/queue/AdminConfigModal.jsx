import React, { useState } from "react";
import {
  X,
  Settings,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Check,
  AlertCircle,
  Building2,
  Stethoscope,
  Sparkles,
  Command,
  Save,
  HelpCircle,
} from "lucide-react";
import { hospitalDb } from "../../db/hospitalDb.js";

const SPECIALTY_PRESETS = [
  {
    id: "general_medicine",
    name: "General Medicine (NABH Standard)",
    desc: "Complaints, Vitals, Allergies, Diagnosis, Rx, and Follow-up mandatory.",
    mandatoryKeys: [
      "chief_complaints",
      "vitals",
      "allergies",
      "diagnosis",
      "medications",
      "follow_up",
    ],
  },
  {
    id: "obstetrics",
    name: "Obstetrics & Gynecology",
    desc: "Includes strict pregnancy tracking, allergies, vitals, and Rx checks.",
    mandatoryKeys: [
      "chief_complaints",
      "vitals",
      "allergies",
      "diagnosis",
      "medications",
      "follow_up",
    ],
  },
  {
    id: "pediatrics",
    name: "Pediatrics & Child Health",
    desc: "Emphasizes mandatory weight-based vitals, complaints, and medications.",
    mandatoryKeys: [
      "chief_complaints",
      "vitals",
      "allergies",
      "diagnosis",
      "medications",
    ],
  },
  {
    id: "express_opd",
    name: "Express OPD / Walk-in Flu Clinic",
    desc: "Fast-track: Only Complaints, Diagnosis & Rx required for rapid consultations.",
    mandatoryKeys: ["chief_complaints", "diagnosis", "medications"],
  },
];

export default function AdminConfigModal({
  isOpen = false,
  onClose = () => {},
  adminConfigList = [],
  onToggleField = () => {},
}) {
  const [activeTab, setActiveTab] = useState("sections"); // 'sections' | 'presets' | 'shortcuts'
  const [selectedPreset, setSelectedPreset] = useState("general_medicine");
  const [toastMsg, setToastMsg] = useState(null);

  if (!isOpen) return null;

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Apply clinical preset across all config items in Dexie
  const handleApplyPreset = async (preset) => {
    setSelectedPreset(preset.id);
    try {
      for (const section of adminConfigList) {
        const shouldBeMandatory = preset.mandatoryKeys.includes(
          section.sectionKey
        );
        await hospitalDb.adminConfig.update(section.sectionKey, {
          isMandatory: shouldBeMandatory,
          isEnabled: true,
        });
      }
      showToast(`Applied preset: ${preset.name}`);
    } catch (err) {
      console.error("Failed to apply preset:", err);
      showToast("Error updating preset.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-400/30">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                Hospital OPD & Admin Template Configurator
              </h3>
              <p className="text-[11px] text-slate-300">
                Configure prescription validation rules and clinical presets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 pt-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("sections")}
            className={`pb-2.5 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "sections"
                ? "border-teal-600 text-teal-800"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Section Validation</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("presets")}
            className={`pb-2.5 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "presets"
                ? "border-teal-600 text-teal-800"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Specialty Presets</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("shortcuts")}
            className={`pb-2.5 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "shortcuts"
                ? "border-teal-600 text-teal-800"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Command className="w-3.5 h-3.5" />
            <span>Doctor Shortcuts</span>
          </button>
        </div>

        {/* Tab 1: Section Validation Rules */}
        {activeTab === "sections" && (
          <div className="p-5 overflow-y-auto space-y-2.5 divide-y divide-slate-100 flex-1">
            <div className="pb-1 text-xs text-slate-500 flex items-center justify-between">
              <span>
                Toggle <strong>Mandatory</strong> (blocks Print until completed) vs <strong>Optional</strong>:
              </span>
            </div>

            {adminConfigList.map((section) => (
              <div
                key={section.sectionKey}
                className="pt-2.5 pb-1 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">
                    {section.label}
                  </h4>
                  <span className="font-mono text-[10px] text-slate-400">
                    {section.sectionKey}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Mandatory Toggle */}
                  <button
                    onClick={() =>
                      onToggleField(section.sectionKey, "isMandatory")
                    }
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 border transition-all ${
                      section.isMandatory
                        ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 shadow-2xs"
                        : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200/70"
                    }`}
                    title="Toggle mandatory requirement for final print"
                  >
                    <ShieldCheck className="w-3 h-3" />
                    <span>{section.isMandatory ? "Mandatory" : "Optional"}</span>
                  </button>

                  {/* Enabled Toggle */}
                  <button
                    onClick={() =>
                      onToggleField(section.sectionKey, "isEnabled")
                    }
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                      section.isEnabled
                        ? "bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100"
                        : "bg-slate-100 text-slate-400 border border-slate-200"
                    }`}
                    title="Toggle section visibility"
                  >
                    {section.isEnabled ? "Enabled" : "Disabled"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Clinical Specialty Presets */}
        {activeTab === "presets" && (
          <div className="p-5 overflow-y-auto space-y-3 flex-1">
            <p className="text-xs text-slate-500">
              Select a clinical preset to reconfigure all mandatory prescription sections in 1 click:
            </p>

            {SPECIALTY_PRESETS.map((preset) => {
              const isSelected = selectedPreset === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-teal-50/70 border-teal-400 shadow-xs"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <span>{preset.name}</span>
                      {isSelected && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-teal-600 text-white font-bold">
                          Active Preset
                        </span>
                      )}
                    </h4>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-100/70 px-2 py-0.5 rounded-md">
                      {preset.mandatoryKeys.length} Mandatory Sections
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    {preset.desc}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Doctor Ergonomics & Keyboard Shortcuts */}
        {activeTab === "shortcuts" && (
          <div className="p-5 overflow-y-auto space-y-2.5 flex-1 text-xs">
            <p className="text-xs text-slate-500 mb-2">
              Fast-track keyboard controls designed for minimal mouse interaction:
            </p>

            <div className="space-y-2 divide-y divide-slate-100">
              <div className="pt-2 flex items-center justify-between">
                <div>
                  <strong className="text-slate-800 block text-xs">
                    Quick Save Working Draft
                  </strong>
                  <span className="text-[11px] text-slate-500">
                    Saves current state to IndexedDB immediately
                  </span>
                </div>
                <kbd className="px-2.5 py-1 bg-slate-100 border border-slate-300 rounded-lg font-mono font-bold text-[11px] shadow-2xs">
                  Ctrl + S
                </kbd>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div>
                  <strong className="text-slate-800 block text-xs">
                    Print / Finalize Trigger
                  </strong>
                  <span className="text-[11px] text-slate-500">
                    Opens print preview (unlocked after 100% checklist)
                  </span>
                </div>
                <kbd className="px-2.5 py-1 bg-slate-100 border border-slate-300 rounded-lg font-mono font-bold text-[11px] shadow-2xs">
                  Ctrl + P
                </kbd>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div>
                  <strong className="text-slate-800 block text-xs">
                    Trigger Copilot Section Template
                  </strong>
                  <span className="text-[11px] text-slate-500">
                    In Copilot chat, type @ to choose @vitals, @rx, @diet
                  </span>
                </div>
                <kbd className="px-2.5 py-1 bg-slate-100 border border-slate-300 rounded-lg font-mono font-bold text-[11px] shadow-2xs">
                  @
                </kbd>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div>
                  <strong className="text-slate-800 block text-xs">
                    Close Modals / Dismiss
                  </strong>
                  <span className="text-[11px] text-slate-500">
                    Closes active preview, dictionary, or video invite
                  </span>
                </div>
                <kbd className="px-2.5 py-1 bg-slate-100 border border-slate-300 rounded-lg font-mono font-bold text-[11px] shadow-2xs">
                  Esc
                </kbd>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>
            {toastMsg ? (
              <span className="text-teal-700 font-bold">{toastMsg}</span>
            ) : (
              "Settings sync live with Dexie.js (IndexedDB)"
            )}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
