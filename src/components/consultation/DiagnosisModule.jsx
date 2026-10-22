import React, { useState } from "react";
import { Stethoscope, Check, Search, Tag, Sparkles } from "lucide-react";

const COMMON_ICD10 = [
  { code: "J06.9", name: "Acute Upper Respiratory Infection (URI)" },
  { code: "J30.1", name: "Seasonal Allergic Rhinitis (Pollinosis)" },
  { code: "I10", name: "Essential (Primary) Hypertension" },
  { code: "E11.9", name: "Type 2 Diabetes Mellitus" },
  { code: "K21.9", name: "Gastro-Esophageal Reflux Disease (GERD)" },
  { code: "R50.9", name: "Acute Viral Pyrexia (Fever)" },
  { code: "M54.5", name: "Mechanical Low Back Pain" },
  { code: "J45.909", name: "Bronchial Asthma (Acute Exacerbation)" },
  { code: "K29.7", name: "Gastritis, Unspecified" },
];

/**
 * DiagnosisModule
 * ---------------
 * Provisional, Final Diagnosis and ICD-10 Coding Module.
 */
export default function DiagnosisModule({
  diagnosis = { provisional: "", final: "", icd10Code: "" },
  onChange = () => {},
}) {
  const [searchCode, setSearchCode] = useState("");

  const handleSelectCode = (item) => {
    onChange({
      provisional: diagnosis.provisional || item.name,
      final: item.name,
      icd10Code: item.code,
    });
  };

  const filteredCodes = searchCode.trim()
    ? COMMON_ICD10.filter(
        (c) =>
          c.code.toLowerCase().includes(searchCode.toLowerCase()) ||
          c.name.toLowerCase().includes(searchCode.toLowerCase())
      )
    : COMMON_ICD10.slice(0, 6);

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
          <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold text-xs">
            3
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">Diagnosis & ICD-10 Coding</h3>
            <p className="text-[11px] text-slate-500">Provisional, final assessment, and medical code</p>
          </div>
        </div>
        {diagnosis.icd10Code && (
          <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
            ICD-10: {diagnosis.icd10Code}
          </span>
        )}
      </div>

      {/* Quick ICD-10 Presets */}
      <div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
          Frequent OPD Diagnoses (ICD-10):
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {filteredCodes.map((item) => {
            const isSelected = diagnosis.icd10Code === item.code;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => handleSelectCode(item)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-teal-50 text-teal-800 border-teal-300 shadow-2xs"
                    : "bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-900 border-slate-200"
                }`}
              >
                <span className="font-mono text-[10px] text-teal-700 font-bold">{item.code}</span>
                <span className="truncate max-w-[150px]">{item.name}</span>
                {isSelected && <Check size={11} className="text-teal-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Provisional & Final Diagnosis Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            Provisional Diagnosis
          </label>
          <input
            type="text"
            value={diagnosis.provisional || ""}
            onChange={(e) => onChange({ ...diagnosis, provisional: e.target.value })}
            placeholder="e.g. Acute Viral Bronchitis"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 text-slate-900 font-medium"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            Final Diagnosis
          </label>
          <input
            type="text"
            value={diagnosis.final || ""}
            onChange={(e) => onChange({ ...diagnosis, final: e.target.value })}
            placeholder="e.g. Seasonal Allergic Rhinitis (Pollinosis)"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 text-slate-900 font-medium"
          />
        </div>
      </div>
    </div>
  );
}
