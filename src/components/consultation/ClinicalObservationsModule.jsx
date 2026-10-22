import React from "react";
import { Stethoscope, FileText, Sparkles, Check } from "lucide-react";

const NORMAL_TEMPLATE =
  "Patient conscious, oriented, and afebrile. No pallor, icterus, cyanosis, clubbing, lymphadenopathy, or pedal edema.\n\n" +
  "• CVS: S1 S2 heard normally. No murmurs or gallops.\n" +
  "• Respiratory: Bilateral normal vesicular breath sounds. Chest clear, no wheezing or added crepitations.\n" +
  "• Abdomen: Soft, non-tender, non-distended. Bowel sounds normal. No palpable organomegaly or guarding.\n" +
  "• CNS: Conscious and oriented to time, place, and person. No focal neurological deficit.";

const QUICK_FINDINGS = [
  { label: "Normal Chest Clear", text: "Bilateral vesicular breath sounds, no added sounds." },
  { label: "Bilateral Wheezing", text: "Bilateral expiratory wheezing present on auscultation." },
  { label: "Inferior Turbinate Edema", text: "Bilateral inferior turbinates are edematous, boggy and pale with clear discharge." },
  { label: "Epigastric Tenderness", text: "Mild epigastric tenderness on deep palpation. No guarding or rigidity." },
  { label: "Knee Crepitus", text: "Bilateral knee crepitus with mild joint line tenderness, ROM intact." },
];

/**
 * ClinicalObservationsModule
 * --------------------------
 * Systemic physical examination and clinical observations editor.
 */
export default function ClinicalObservationsModule({
  observations = "",
  onChange = () => {},
  hideHeader = false,
}) {
  const handleInsertNormal = () => {
    if (observations.trim()) {
      onChange(observations + "\n\n" + NORMAL_TEMPLATE);
    } else {
      onChange(NORMAL_TEMPLATE);
    }
  };

  const handleAppendFinding = (findingText) => {
    if (observations.includes(findingText)) return;
    const updated = observations.trim()
      ? `${observations.trim()}\n• ${findingText}`
      : `• ${findingText}`;
    onChange(updated);
  };

  return (
    <div className={hideHeader ? "space-y-3.5" : "p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3.5"}>
      {/* Section Header */}
      {!hideHeader ? (
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Clinical Observations</h3>
              <p className="text-[11px] text-slate-500">Systemic physical examination findings</p>
            </div>
          </div>

          {/* Quick Normal Template Button */}
          <button
            type="button"
            onClick={handleInsertNormal}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Sparkles size={12} className="text-emerald-600" />
            <span>Insert Normal Template</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between pb-1">
          <span className="text-xs text-slate-500">Document physical, systemic, and general examination findings</span>
          <button
            type="button"
            onClick={handleInsertNormal}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Sparkles size={12} className="text-sky-600" />
            <span>Insert Normal Template</span>
          </button>
        </div>
      )}

      {/* Quick Common Findings Chips */}
      <div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
          Quick Findings:
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {QUICK_FINDINGS.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleAppendFinding(item.text)}
              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-900 border border-slate-200 hover:border-indigo-200 transition-colors cursor-pointer"
            >
              + {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Examination Findings Textarea */}
      <textarea
        rows={4}
        value={observations}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter systemic clinical examination findings (General, CVS, Resp, GI, CNS)..."
        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 text-slate-900 text-xs leading-relaxed font-sans placeholder:text-slate-400"
      />
    </div>
  );
}
