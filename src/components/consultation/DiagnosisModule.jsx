import React, { useState, useRef, useEffect } from "react";
import { Stethoscope, Check, Search, Tag, Sparkles, ChevronDown, X } from "lucide-react";

const FREQUENT_DIAGNOSES = [
  { code: "J06.9", name: "Acute Upper Respiratory Infection (URI)" },
  { code: "J30.1", name: "Seasonal Allergic Rhinitis (Pollinosis)" },
  { code: "I10", name: "Essential (Primary) Hypertension" },
  { code: "E11.9", name: "Type 2 Diabetes Mellitus" },
  { code: "K21.9", name: "Gastro-Esophageal Reflux Disease (GERD)" },
  { code: "R50.9", name: "Acute Viral Pyrexia (Fever)" },
  { code: "M54.5", name: "Mechanical Low Back Pain (Lumbago)" },
  { code: "J45.909", name: "Bronchial Asthma (Acute Exacerbation)" },
  { code: "K29.7", name: "Acute Gastritis / Dyspepsia" },
  { code: "A09", name: "Infectious Gastroenteritis & Colitis" },
  { code: "N39.0", name: "Urinary Tract Infection (UTI)" },
  { code: "O21.0", name: "Hyperemesis Gravidarum (Early Pregnancy)" },
  { code: "G43.0", name: "Migraine without Aura" },
  { code: "M17.9", name: "Osteoarthritis of Knee Joint" },
  { code: "D50.9", name: "Iron Deficiency Anemia" },
  { code: "B34.9", name: "Viral Infection, Unspecified" },
];

export default function DiagnosisModule({
  diagnosis = { provisional: "", final: "", icd10Code: "" },
  onChange = () => {},
  hideHeader = false,
}) {
  const [showProvisionalDropdown, setShowProvisionalDropdown] = useState(false);
  const [showFinalDropdown, setShowFinalDropdown] = useState(false);

  const provRef = useRef(null);
  const finalRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleOutside = (e) => {
      if (provRef.current && !provRef.current.contains(e.target)) {
        setShowProvisionalDropdown(false);
      }
      if (finalRef.current && !finalRef.current.contains(e.target)) {
        setShowFinalDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleSelectCode = (item, isFinal = true) => {
    if (isFinal) {
      onChange({
        ...diagnosis,
        final: item.name,
        icd10Code: item.code,
        provisional: diagnosis.provisional || item.name,
      });
      setShowFinalDropdown(false);
    } else {
      onChange({
        ...diagnosis,
        provisional: item.name,
        icd10Code: diagnosis.icd10Code || item.code,
      });
      setShowProvisionalDropdown(false);
    }
  };

  const provQuery = (diagnosis.provisional || "").trim().toLowerCase();
  const filteredProv = provQuery
    ? FREQUENT_DIAGNOSES.filter(
        (d) =>
          d.name.toLowerCase().includes(provQuery) ||
          d.code.toLowerCase().includes(provQuery)
      )
    : FREQUENT_DIAGNOSES;

  const finalQuery = (diagnosis.final || "").trim().toLowerCase();
  const filteredFinal = finalQuery
    ? FREQUENT_DIAGNOSES.filter(
        (d) =>
          d.name.toLowerCase().includes(finalQuery) ||
          d.code.toLowerCase().includes(finalQuery)
      )
    : FREQUENT_DIAGNOSES;

  return (
    <div className={hideHeader ? "space-y-4" : "p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4"}>
      {/* Section Header */}
      {!hideHeader && (
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold text-xs">
              5
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Diagnosis & ICD-10 Coding</h3>
              <p className="text-[11px] text-slate-500">Provisional, final assessment, and medical code</p>
            </div>
          </div>
          {diagnosis.icd10Code && (
            <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 shadow-2xs">
              ICD-10: <strong>{diagnosis.icd10Code}</strong>
            </span>
          )}
        </div>
      )}

      {/* Provisional & Final Diagnosis Inputs with Live Searchable Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Provisional Diagnosis Searchable Dropdown */}
        <div ref={provRef} className={`relative ${showProvisionalDropdown ? "z-30" : "z-10"}`}>
          <label className="block text-slate-700 font-bold mb-1">
            Provisional Diagnosis (Type or Search)
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={diagnosis.provisional || ""}
              onFocus={() => setShowProvisionalDropdown(true)}
              onChange={(e) => {
                onChange({ ...diagnosis, provisional: e.target.value });
                setShowProvisionalDropdown(true);
              }}
              placeholder="Type or search diagnosis (e.g. Acute Viral Bronchitis)..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900 font-medium pr-8"
            />
            <button
              type="button"
              onClick={() => setShowProvisionalDropdown(!showProvisionalDropdown)}
              className="absolute right-2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
            >
              <ChevronDown size={14} />
            </button>
          </div>

          {/* Dropdown Suggestions */}
          {showProvisionalDropdown && filteredProv.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 max-h-56 overflow-y-auto divide-y divide-slate-100 animate-fade-in">
              <div className="p-1.5 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider sticky top-0 flex items-center justify-between">
                <span>Frequent OPD Diagnoses ({filteredProv.length}):</span>
                <span className="text-[9px] text-teal-700 font-normal">click to pick</span>
              </div>
              {filteredProv.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleSelectCode(item, false)}
                  className="w-full text-left p-2.5 hover:bg-teal-50 transition-colors flex items-center justify-between gap-2 text-xs cursor-pointer group"
                >
                  <span className="font-semibold text-slate-800 group-hover:text-teal-900 truncate">
                    {item.name}
                  </span>
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 shrink-0">
                    {item.code}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Final Diagnosis Searchable Dropdown */}
        <div ref={finalRef} className={`relative ${showFinalDropdown ? "z-30" : "z-10"}`}>
          <label className="block text-slate-700 font-bold mb-1">
            Final Diagnosis (Type or Search)
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={diagnosis.final || ""}
              onFocus={() => setShowFinalDropdown(true)}
              onChange={(e) => {
                onChange({ ...diagnosis, final: e.target.value });
                setShowFinalDropdown(true);
              }}
              placeholder="Type or search diagnosis (e.g. Essential Hypertension)..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900 font-medium pr-8"
            />
            <button
              type="button"
              onClick={() => setShowFinalDropdown(!showFinalDropdown)}
              className="absolute right-2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
            >
              <ChevronDown size={14} />
            </button>
          </div>

          {/* Dropdown Suggestions */}
          {showFinalDropdown && filteredFinal.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 max-h-56 overflow-y-auto divide-y divide-slate-100 animate-fade-in">
              <div className="p-1.5 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider sticky top-0 flex items-center justify-between">
                <span>Frequent OPD Diagnoses (ICD-10):</span>
                <span className="text-[9px] text-teal-700 font-normal">click to pick</span>
              </div>
              {filteredFinal.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleSelectCode(item, true)}
                  className="w-full text-left p-2.5 hover:bg-teal-50 transition-colors flex items-center justify-between gap-2 text-xs cursor-pointer group"
                >
                  <span className="font-semibold text-slate-800 group-hover:text-teal-900 truncate">
                    {item.name}
                  </span>
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 shrink-0">
                    {item.code}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Manual ICD-10 Code Input override */}
      <div className="pt-1">
        <label className="block text-[11px] font-bold text-slate-500 mb-1">
          ICD-10 Code Override (Optional)
        </label>
        <input
          type="text"
          value={diagnosis.icd10Code || ""}
          onChange={(e) => onChange({ ...diagnosis, icd10Code: e.target.value.toUpperCase() })}
          placeholder="e.g. I10, J06.9, E11.9..."
          className="w-48 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 text-xs font-mono font-bold text-teal-900"
        />
      </div>
    </div>
  );
}
