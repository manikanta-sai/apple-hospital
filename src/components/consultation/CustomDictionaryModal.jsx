import React, { useState } from "react";
import {
  BookOpen,
  Plus,
  Trash2,
  X,
  Search,
  Check,
  Tag,
  Sparkles,
} from "lucide-react";
import { useHospitalData } from "../../hooks/useHospitalData.js";

const CATEGORIES = ["Medication", "Diagnosis", "Instructions", "Diet", "General"];

export default function CustomDictionaryModal({
  isOpen,
  onClose = () => {},
}) {
  const { customDictionary = [], addDictionaryItem, deleteDictionaryItem } =
    useHospitalData();

  const [searchQuery, setSearchQuery] = useState("");
  const [newShortcut, setNewShortcut] = useState("");
  const [newExpansion, setNewExpansion] = useState("");
  const [newCategory, setNewCategory] = useState("Medication");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const filteredDictionary = customDictionary.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.shortcut?.toLowerCase().includes(q) ||
      item.expansion?.toLowerCase().includes(q) ||
      item.category?.toLowerCase().includes(q)
    );
  });

  const handleAddWord = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const shortcutTrimmed = newShortcut.trim().toLowerCase();
    const expansionTrimmed = newExpansion.trim();

    if (!shortcutTrimmed || !expansionTrimmed) {
      setErrorMsg("Please fill both shortcut and full expansion.");
      return;
    }

    try {
      await addDictionaryItem({
        shortcut: shortcutTrimmed,
        expansion: expansionTrimmed,
        category: newCategory,
      });

      setNewShortcut("");
      setNewExpansion("");
    } catch (err) {
      console.error("Failed to add dictionary item:", err);
      setErrorMsg("Error saving dictionary item.");
    }
  };

  const handleDeleteWord = async (id) => {
    try {
      await deleteDictionaryItem(id);
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-slate-200 flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Doctor's Custom Medical Dictionary
              </h3>
              <p className="text-xs text-slate-500">
                Register personal shorthand for rapid prescription typing
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Add New Word Form */}
        <form
          onSubmit={handleAddWord}
          className="my-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5 text-xs"
        >
          <div className="flex items-center justify-between font-bold text-slate-700 text-xs">
            <span className="flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-teal-600" />
              <span>Add New Shorthand / Abbreviation</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="text-[10.5px] font-semibold text-slate-500 block mb-0.5">
                Shortcut (e.g. pcm)
              </label>
              <input
                type="text"
                value={newShortcut}
                onChange={(e) => setNewShortcut(e.target.value)}
                placeholder="pcm"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[10.5px] font-semibold text-slate-500 block mb-0.5">
                Full Medical Expansion
              </label>
              <input
                type="text"
                value={newExpansion}
                onChange={(e) => setNewExpansion(e.target.value)}
                placeholder="Tab. Paracetamol 650mg"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10.5px] font-semibold text-slate-500">
                Category:
              </span>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="px-2 py-1 bg-white border border-slate-200 rounded-md text-[11px] font-semibold focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="px-3 py-1.5 bg-teal-700 hover:bg-teal-600 text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Save Shortcut</span>
            </button>
          </div>

          {errorMsg && (
            <p className="text-[11px] text-rose-600 font-semibold">{errorMsg}</p>
          )}
        </form>

        {/* Search Bar */}
        <div className="relative mb-2">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search custom medical dictionary..."
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        {/* Dictionary Word List */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-100">
          {filteredDictionary.length > 0 ? (
            filteredDictionary.map((item) => (
              <div
                key={item.id}
                className="pt-2 flex items-center justify-between text-xs hover:bg-slate-50 p-2 rounded-lg transition-colors group"
              >
                <div className="min-w-0 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60 text-xs">
                      {item.shortcut}
                    </span>
                    <span className="text-[10px] text-slate-500 px-1.5 py-0.2 rounded bg-slate-100 font-semibold">
                      {item.category}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-800 text-xs mt-1 truncate">
                    {item.expansion}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteWord(item.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                  title="Delete shortcut"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs">
              <Sparkles className="w-5 h-5 mx-auto mb-1 opacity-50" />
              <span>No custom shortcuts found.</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{customDictionary.length} Total Saved Terms</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
