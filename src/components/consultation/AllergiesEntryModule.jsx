import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  ShieldAlert,
  Plus,
  Trash2,
  AlertTriangle,
  Check,
  ShieldCheck,
  X,
} from "lucide-react";
import { generateId } from "../../utils/generateId.js";

const COMMON_ALLERGEN_PRESETS = [
  { name: "Penicillin", type: "Drug", defaultReaction: "Anaphylaxis / Hives", severity: "Severe" },
  { name: "Sulfa Drugs", type: "Drug", defaultReaction: "Skin rash / Stevens-Johnson", severity: "Severe" },
  { name: "NSAIDs (Aspirin/Ibuprofen)", type: "Drug", defaultReaction: "Bronchospasm / Gastritis", severity: "Moderate" },
  { name: "Cephalosporins", type: "Drug", defaultReaction: "Cross-reactivity rash", severity: "Moderate" },
  { name: "Ciprofloxacin", type: "Drug", defaultReaction: "Tendonitis / Rash", severity: "Moderate" },
  { name: "Contrast Dye (Iodine)", type: "Drug", defaultReaction: "Severe urticaria", severity: "Severe" },
  { name: "Latex", type: "Environmental", defaultReaction: "Contact dermatitis", severity: "Moderate" },
  { name: "Peanuts", type: "Food", defaultReaction: "Anaphylaxis", severity: "Severe" },
];

export default function AllergiesEntryModule({
  allergies = [],
  onChange = () => {},
  patient = {},
  hideHeader = false,
}) {
  // Normalize allergies into array of structured items or strings
  const [allergyList, setAllergyList] = useState(() => {
    const raw = allergies && allergies.length > 0 ? allergies : patient?.allergies || [];
    return raw.map((item) => {
      if (typeof item === "string") {
        return {
          id: generateId("alg"),
          name: item,
          category: "Drug",
          severity: item.toLowerCase().includes("penicillin") ? "Severe" : "Moderate",
          reaction: "Urticaria / Rash",
        };
      }
      return item;
    });
  });

  const [newAllergenName, setNewAllergenName] = useState("");
  const [newCategory, setNewCategory] = useState("Drug");
  const [newSeverity, setNewSeverity] = useState("Moderate");
  const [newReaction, setNewReaction] = useState("");
  const [isAddingCustom, setIsAddingCustom] = useState(false);

  // Sync back to parent
  const notifyChange = (updatedList) => {
    setAllergyList(updatedList);
    // Send both structured and string representations
    onChange(updatedList);
  };

  const handleSetNkda = () => {
    const nkdaItem = [
      {
        id: "nkda",
        name: "No Known Drug Allergies (NKDA)",
        category: "General",
        severity: "None",
        reaction: "Nil",
      },
    ];
    notifyChange(nkdaItem);
  };

  const handleAddPreset = (preset) => {
    // If NKDA is currently set, clear it first
    const filtered = allergyList.filter((a) => a.id !== "nkda" && a.name !== "NKDA" && a.name !== "None");
    if (filtered.some((a) => a.name.toLowerCase() === preset.name.toLowerCase())) {
      return; // Already exists
    }

    const newItem = {
      id: generateId("alg"),
      name: preset.name,
      category: preset.type,
      severity: preset.severity,
      reaction: preset.defaultReaction,
    };

    notifyChange([...filtered, newItem]);
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    const name = newAllergenName.trim();
    if (!name) return;

    const filtered = allergyList.filter((a) => a.id !== "nkda" && a.name !== "NKDA" && a.name !== "None");
    const newItem = {
      id: generateId("alg"),
      name,
      category: newCategory,
      severity: newSeverity,
      reaction: newReaction.trim() || "Clinical intolerance",
    };

    notifyChange([...filtered, newItem]);
    setNewAllergenName("");
    setNewReaction("");
    setIsAddingCustom(false);
  };

  const handleRemove = (id) => {
    const next = allergyList.filter((a) => a.id !== id);
    notifyChange(next);
  };

  const isNkda =
    allergyList.length === 1 &&
    (allergyList[0].name === "NKDA" ||
      allergyList[0].name === "No Known Drug Allergies (NKDA)" ||
      allergyList[0].id === "nkda");

  const hasActiveAllergies = allergyList.length > 0 && !isNkda;

  return (
    <div className={hideHeader ? "space-y-4" : "p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4"}>
      {/* Header (omitted if hideHeader=true to prevent duplication) */}
      {!hideHeader ? (
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
              <ShieldAlert size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                <span>Allergies & Adverse Drug Reactions (ADR)</span>
                {hasActiveAllergies && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                    {allergyList.length} Active {allergyList.length === 1 ? "Alert" : "Alerts"}
                  </span>
                )}
                {isNkda && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    ✓ Verified NKDA
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500">
                NABH required clinical safety documentation for prescription validation
              </p>
            </div>
          </div>

          {/* NKDA Button */}
          <button
            type="button"
            onClick={handleSetNkda}
            className={`text-xs px-3 py-1.5 rounded-xl font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
              isNkda
                ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200"
            }`}
            title="Mark patient as having No Known Drug Allergies"
          >
            <ShieldCheck size={14} />
            <span>Mark NKDA</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between pb-1">
          <span className="text-xs text-slate-500">
            Screen patient for drug, food, and environmental hypersensitivity
          </span>
          <button
            type="button"
            onClick={handleSetNkda}
            className={`text-xs px-3 py-1 rounded-lg font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
              isNkda
                ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200"
            }`}
            title="Mark patient as having No Known Drug Allergies"
          >
            <ShieldCheck size={13} />
            <span>{isNkda ? "✓ NKDA Active" : "Confirm NKDA"}</span>
          </button>
        </div>
      )}

      {/* Quick Add Presets Carousel */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-slate-600">Quick-Add Common Hospital Drug Allergies:</span>
          <button
            type="button"
            onClick={() => setIsAddingCustom(!isAddingCustom)}
            className="text-teal-700 hover:text-teal-800 font-bold flex items-center gap-1 cursor-pointer"
          >
            <Plus size={13} />
            <span>{isAddingCustom ? "Cancel Custom" : "Add Custom Allergen"}</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {COMMON_ALLERGEN_PRESETS.map((preset) => {
            const isAdded = allergyList.some(
              (a) => a.name?.toLowerCase() === preset.name.toLowerCase()
            );

            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleAddPreset(preset)}
                disabled={isAdded}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${
                  isAdded
                    ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                    : "bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-800 border-slate-200/90 hover:border-rose-200 shadow-2xs"
                }`}
              >
                {isAdded ? <Check size={11} className="text-teal-600" /> : <Plus size={11} />}
                <span>{preset.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Allergen Add Popup Modal - Mounted via Portal to prevent any section overlap */}
      {isAddingCustom &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setIsAddingCustom(false)}
          >
            <div
              className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden space-y-4 p-5 sm:p-6 animate-scale-up"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
                    <ShieldAlert size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Add Custom Allergen</h3>
                    <p className="text-xs text-slate-500">Record hypersensitivity or adverse drug reaction</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingCustom(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleAddCustom} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Allergen / Drug Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={newAllergenName}
                    onChange={(e) => setNewAllergenName(e.target.value)}
                    placeholder="e.g. Amoxicillin, Morphine, Ibuprofen, Peanuts, Contrast Dye..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-teal-500"
                    >
                      <option value="Drug">Medication / Drug</option>
                      <option value="Food">Food Product</option>
                      <option value="Environmental">Environmental</option>
                      <option value="Other">Other / Material</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Severity Level</label>
                    <select
                      value={newSeverity}
                      onChange={(e) => setNewSeverity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-teal-500"
                    >
                      <option value="Severe">Severe (Anaphylactic / High Risk)</option>
                      <option value="Moderate">Moderate (Urticaria, Rash, Angioedema)</option>
                      <option value="Mild">Mild (GI Upset / Localized Itch)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Clinical Reaction Symptoms
                  </label>
                  <input
                    type="text"
                    value={newReaction}
                    onChange={(e) => setNewReaction(e.target.value)}
                    placeholder="e.g. Lip swelling, wheezing, diffuse pruritus, facial edema..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingCustom(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs cursor-pointer transition-colors shadow-2xs"
                  >
                    Add Allergen to Record
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* Active Allergy Cards List */}
      <div className="space-y-2">
        {allergyList.length > 0 ? (
          allergyList.map((item) => {
            const isItemNkda =
              item.id === "nkda" || item.name === "NKDA" || item.name.includes("No Known Drug");
            const isSevere = item.severity === "Severe";

            return (
              <div
                key={item.id || item.name}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                  isItemNkda
                    ? "bg-emerald-50/50 border-emerald-200"
                    : isSevere
                    ? "bg-rose-50/60 border-rose-200 shadow-2xs"
                    : "bg-amber-50/50 border-amber-200"
                }`}
              >
                <div className="flex items-center gap-2.5 flex-wrap">
                  {isItemNkda ? (
                    <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
                  ) : (
                    <ShieldAlert
                      size={18}
                      className={isSevere ? "text-rose-600 shrink-0" : "text-amber-600 shrink-0"}
                    />
                  )}

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <strong className="text-xs sm:text-sm font-bold text-slate-900">
                        {item.name}
                      </strong>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                        {item.category || "Drug"}
                      </span>
                      {!isItemNkda && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isSevere
                              ? "bg-rose-100 text-rose-900 border border-rose-200"
                              : "bg-amber-100 text-amber-900 border border-amber-200"
                          }`}
                        >
                          {item.severity || "Moderate"}
                        </span>
                      )}
                    </div>
                    {item.reaction && !isItemNkda && (
                      <span className="text-xs text-slate-600 block mt-0.5">
                        Reaction: {item.reaction}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemove(item.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                  title="Remove this allergy entry"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })
        ) : (
          <div className="p-4 rounded-xl border-2 border-dashed border-slate-200 text-center text-slate-400 text-xs">
            No allergies recorded yet. Click <strong>Mark NKDA</strong> or add allergens above.
          </div>
        )}
      </div>
    </div>
  );
}
