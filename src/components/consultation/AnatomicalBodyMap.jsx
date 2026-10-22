import React, { useState } from "react";
import {
  RotateCcw,
  Sparkles,
  AlertCircle,
  Plus,
  X,
  Activity,
  Flame,
  Check,
} from "lucide-react";
import { generateId } from "../../utils/generateId.js";

/**
 * Pre-defined Anatomical Regions with coordinates on the 200x420 SVG canvas
 */
const ANATOMICAL_HOTSPOTS = [
  // Front View Hotspots
  {
    id: "head",
    name: "Head / Cranium",
    view: "front",
    cx: 100,
    cy: 42,
    defaultSymptom: "Throbbing Headache",
    commonConditions: ["Migraine", "Tension Headache", "Vertigo / Dizziness"],
  },
  {
    id: "eyes",
    name: "Eyes / Orbital",
    view: "front",
    cx: 100,
    cy: 56,
    defaultSymptom: "Eye Strain & Blurring",
    commonConditions: ["Blurred Vision", "Conjunctival Redness", "Photophobia"],
  },
  {
    id: "throat",
    name: "Throat & Neck",
    view: "front",
    cx: 100,
    cy: 82,
    defaultSymptom: "Sore Throat / Pharyngitis",
    commonConditions: ["Dry Cough", "Dysphagia", "Cervical Tenderness"],
  },
  {
    id: "chest",
    name: "Chest / Precordial",
    view: "front",
    cx: 100,
    cy: 125,
    defaultSymptom: "Retrosternal Chest Pain",
    commonConditions: ["Chest Tightness", "Palpitations", "Bronchial Wheezing"],
  },
  {
    id: "epigastrium",
    name: "Epigastrium (Upper Abdomen)",
    view: "front",
    cx: 100,
    cy: 165,
    defaultSymptom: "Epigastric Burning & Acidity",
    commonConditions: ["GERD / Heartburn", "Severe Nausea", "Dyspepsia"],
  },
  {
    id: "lower-abdomen",
    name: "Lower Abdomen / Pelvis",
    view: "front",
    cx: 100,
    cy: 205,
    defaultSymptom: "Crampy Lower Abdominal Pain",
    commonConditions: ["Colicky Pain", "Dysmenorrhea", "Right Iliac Fossa Tenderness"],
  },
  {
    id: "left-arm",
    name: "Left Shoulder & Arm",
    view: "front",
    cx: 52,
    cy: 145,
    defaultSymptom: "Left Arm Radiating Pain",
    commonConditions: ["Musculoskeletal Strain", "Deltoid Pain", "Numbness"],
  },
  {
    id: "right-arm",
    name: "Right Shoulder & Arm",
    view: "front",
    cx: 148,
    cy: 145,
    defaultSymptom: "Right Shoulder Stiffness",
    commonConditions: ["Rotator Cuff Strain", "Brachialgia", "Weakness"],
  },
  {
    id: "left-knee",
    name: "Left Knee & Joint",
    view: "front",
    cx: 82,
    cy: 295,
    defaultSymptom: "Left Knee Joint Pain",
    commonConditions: ["Osteoarthritis", "Patellofemoral Pain", "Joint Swelling"],
  },
  {
    id: "right-knee",
    name: "Right Knee & Joint",
    view: "front",
    cx: 118,
    cy: 295,
    defaultSymptom: "Right Knee Joint Pain",
    commonConditions: ["Osteoarthritis", "Crepitus", "Ligamentous Sprain"],
  },
  {
    id: "feet",
    name: "Feet & Ankles",
    view: "front",
    cx: 100,
    cy: 388,
    defaultSymptom: "Bilateral Ankle Pain / Edema",
    commonConditions: ["Pedal Edema", "Plantar Fasciitis", "Ankle Sprain"],
  },

  // Back View Hotspots
  {
    id: "occiput",
    name: "Occipital / Posterior Head",
    view: "back",
    cx: 100,
    cy: 45,
    defaultSymptom: "Occipital Headache / Tension",
    commonConditions: ["Cervical Spondylosis", "Neck Muscle Spasm"],
  },
  {
    id: "upper-back",
    name: "Upper Back / Interscapular",
    view: "back",
    cx: 100,
    cy: 120,
    defaultSymptom: "Interscapular Muscular Ache",
    commonConditions: ["Postural Strain", "Trapezius Myalgia"],
  },
  {
    id: "lumbar",
    name: "Lumbar / Lower Back",
    view: "back",
    cx: 100,
    cy: 185,
    defaultSymptom: "Lower Back Lumbar Pain",
    commonConditions: ["Lumbago", "Sciatica Radiation", "Disc Strain"],
  },
  {
    id: "gluteal",
    name: "Gluteal / Sacroiliac",
    view: "back",
    cx: 100,
    cy: 220,
    defaultSymptom: "Sacroiliac Joint Pain",
    commonConditions: ["SI Joint Dysfunction", "Piriformis Syndrome"],
  },
  {
    id: "calves",
    name: "Calves / Achilles",
    view: "back",
    cx: 100,
    cy: 335,
    defaultSymptom: "Nocturnal Calf Muscle Cramps",
    commonConditions: ["Calf Spasm", "Achilles Tendonitis", "DVT Warning"],
  },
];

export default function AnatomicalBodyMap({
  activeComplaints = [],
  onAddComplaint = () => {},
  onRemoveComplaint = () => {},
}) {
  const [view, setView] = useState("front"); // 'front' | 'back'
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [painLevel, setPainLevel] = useState(5);
  const [durationValue, setDurationValue] = useState("3");
  const [durationUnit, setDurationUnit] = useState("Days");
  const [customSymptom, setCustomSymptom] = useState("");

  const visibleHotspots = ANATOMICAL_HOTSPOTS.filter((h) => h.view === view);

  // Check if a hotspot is currently pinned in active complaints
  const isPinned = (hotspotId) =>
    activeComplaints.some(
      (c) =>
        c.bodyPartId === hotspotId ||
        c.complaint?.toLowerCase().includes(hotspotId.replace("-", " "))
    );

  const handleSelectHotspot = (hotspot) => {
    setSelectedHotspot(hotspot);
    setCustomSymptom(hotspot.defaultSymptom);
    setPainLevel(5);
  };

  const handlePinComplaint = () => {
    if (!selectedHotspot) return;

    let severity = "Moderate";
    if (painLevel <= 3) severity = "Mild";
    else if (painLevel >= 7) severity = "Severe";

    const newComplaint = {
      id: generateId("cc"),
      complaint: customSymptom || selectedHotspot.defaultSymptom,
      duration: durationValue || "3",
      durationUnit: durationUnit || "Days",
      severity,
      bodyPartId: selectedHotspot.id,
      vasScore: painLevel,
    };

    onAddComplaint(newComplaint);
    setSelectedHotspot(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex flex-col">
      {/* Header & View Toggle */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs border border-teal-200/60">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
              <span>Interactive Body Map</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-teal-100/70 text-teal-800">
                2D Vector
              </span>
            </h4>
            <p className="text-[10.5px] text-slate-500">
              Click body regions to pin complaints
            </p>
          </div>
        </div>

        {/* Front / Back Toggle Buttons */}
        <div className="flex items-center p-0.5 bg-slate-100 rounded-xl border border-slate-200/60 text-[11px]">
          <button
            type="button"
            onClick={() => {
              setView("front");
              setSelectedHotspot(null);
            }}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              view === "front"
                ? "bg-white text-teal-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Front View
          </button>
          <button
            type="button"
            onClick={() => {
              setView("back");
              setSelectedHotspot(null);
            }}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              view === "back"
                ? "bg-white text-teal-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Back View
          </button>
        </div>
      </div>

      {/* Main Body Map Canvas & Hotspot Selection */}
      <div className="flex flex-col sm:flex-row items-center gap-4 py-3">
        {/* SVG Human Figure */}
        <div className="relative w-44 h-84 shrink-0 flex items-center justify-center bg-radial from-slate-50 to-slate-100/80 rounded-2xl border border-slate-200/60 p-2">
          <svg
            viewBox="0 0 200 420"
            className="w-full h-full drop-shadow-xs select-none"
          >
            <defs>
              <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#94a3b8" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Stylized Human Silhouette */}
            {view === "front" ? (
              <g id="body-front" fill="url(#bodyGradient)" opacity="0.85">
                {/* Head */}
                <ellipse cx="100" cy="46" rx="22" ry="28" />
                {/* Neck */}
                <path d="M92 72 L108 72 L112 86 L88 86 Z" />
                {/* Torso & Shoulders */}
                <path d="M60 92 Q100 88 140 92 L148 135 L132 215 L68 215 L52 135 Z" />
                {/* Left Arm */}
                <path d="M52 96 L32 170 L26 230 L38 232 L46 175 L60 115 Z" />
                {/* Right Arm */}
                <path d="M148 96 L168 170 L174 230 L162 232 L154 175 L140 115 Z" />
                {/* Pelvis & Upper Legs */}
                <path d="M68 215 L132 215 L142 300 L115 300 L102 245 L98 245 L85 300 L58 300 Z" />
                {/* Lower Left Leg & Foot */}
                <path d="M66 300 L84 300 L80 380 L62 380 L56 395 L84 395 L90 380 L92 300 Z" />
                {/* Lower Right Leg & Foot */}
                <path d="M116 300 L134 300 L138 380 L144 395 L116 395 L110 380 L120 380 Z" />
              </g>
            ) : (
              <g id="body-back" fill="url(#bodyGradient)" opacity="0.85">
                {/* Head Back */}
                <ellipse cx="100" cy="46" rx="22" ry="28" />
                {/* Spine groove indication */}
                <line
                  x1="100"
                  y1="75"
                  x2="100"
                  y2="215"
                  stroke="#64748b"
                  strokeWidth="2"
                  strokeDasharray="2 3"
                />
                {/* Neck */}
                <path d="M92 72 L108 72 L112 86 L88 86 Z" />
                {/* Torso Back */}
                <path d="M60 92 Q100 86 140 92 L148 135 L132 215 L68 215 L52 135 Z" />
                {/* Arms */}
                <path d="M52 96 L32 170 L26 230 L38 232 L46 175 L60 115 Z" />
                <path d="M148 96 L168 170 L174 230 L162 232 L154 175 L140 115 Z" />
                {/* Pelvis & Legs */}
                <path d="M68 215 L132 215 L142 300 L115 300 L102 245 L98 245 L85 300 L58 300 Z" />
                <path d="M66 300 L84 300 L80 380 L62 380 L56 395 L84 395 L90 380 L92 300 Z" />
                <path d="M116 300 L134 300 L138 380 L144 395 L116 395 L110 380 L120 380 Z" />
              </g>
            )}

            {/* Clickable Hotspot Circles */}
            {visibleHotspots.map((hotspot) => {
              const pinned = isPinned(hotspot.id);
              const isSelected = selectedHotspot?.id === hotspot.id;

              return (
                <g
                  key={hotspot.id}
                  className="cursor-pointer transition-transform duration-150"
                  onClick={() => handleSelectHotspot(hotspot)}
                >
                  {/* Outer Pulsing Ping Ring if Pinned or Selected */}
                  {(pinned || isSelected) && (
                    <circle
                      cx={hotspot.cx}
                      cy={hotspot.cy}
                      r="12"
                      className="animate-ping"
                      fill={pinned ? "#ef4444" : "#0d9488"}
                      opacity="0.5"
                    />
                  )}

                  {/* Hotspot Touch Target */}
                  <circle
                    cx={hotspot.cx}
                    cy={hotspot.cy}
                    r="15"
                    fill="transparent"
                  />

                  {/* Solid Visual Hotspot Core */}
                  <circle
                    cx={hotspot.cx}
                    cy={hotspot.cy}
                    r={isSelected ? "8" : pinned ? "7" : "5.5"}
                    fill={
                      pinned
                        ? "#dc2626"
                        : isSelected
                        ? "#0f766e"
                        : "#ffffff"
                    }
                    stroke={
                      pinned
                        ? "#fee2e2"
                        : isSelected
                        ? "#ccfbf1"
                        : "#0d9488"
                    }
                    strokeWidth={isSelected ? "2.5" : "2"}
                    className="transition-all hover:scale-125"
                  />
                </g>
              );
            })}
          </svg>

          {/* Quick Front/Back Helper Badge */}
          <span className="absolute bottom-2 left-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest pointer-events-none">
            {view}
          </span>
        </div>

        {/* Hotspot Inspector & Complaint Form */}
        <div className="flex-1 w-full bg-slate-50/80 rounded-xl p-3 border border-slate-200/70 text-xs">
          {selectedHotspot ? (
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-100/60 px-2 py-0.5 rounded-full">
                    Selected Region
                  </span>
                  <h5 className="font-bold text-slate-800 text-sm mt-0.5">
                    {selectedHotspot.name}
                  </h5>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedHotspot(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Symptom Input */}
              <div>
                <label className="text-[11px] font-semibold text-slate-600 mb-1 block">
                  Complaint / Symptom Description
                </label>
                <input
                  type="text"
                  value={customSymptom}
                  onChange={(e) => setCustomSymptom(e.target.value)}
                  placeholder="e.g. Throbbing pain, Burning, Stiffness"
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
                />

                {/* Common Presets */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {selectedHotspot.commonConditions.map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => setCustomSymptom(cond)}
                      className="text-[10px] px-2 py-0.5 bg-white hover:bg-teal-50 text-slate-600 hover:text-teal-700 border border-slate-200/80 rounded-md transition-colors"
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pain Scale (VAS 1 to 10) */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-1">
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>Pain Severity (VAS Scale: 1–10)</span>
                  </span>
                  <span
                    className={`font-bold px-1.5 py-0.2 rounded text-[10.5px] ${
                      painLevel >= 7
                        ? "bg-red-100 text-red-700"
                        : painLevel >= 4
                        ? "bg-amber-100 text-amber-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    Score: {painLevel}/10 (
                    {painLevel >= 7
                      ? "Severe"
                      : painLevel >= 4
                      ? "Moderate"
                      : "Mild"}
                    )
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={painLevel}
                  onChange={(e) => setPainLevel(parseInt(e.target.value, 10))}
                  className="w-full accent-teal-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
              </div>

              {/* Duration Field */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-600 shrink-0">
                  Duration:
                </span>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={durationValue}
                  onChange={(e) => setDurationValue(e.target.value)}
                  className="w-14 px-2 py-1 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 text-center font-bold"
                />
                <select
                  value={durationUnit}
                  onChange={(e) => setDurationUnit(e.target.value)}
                  className="px-2 py-1 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 font-semibold"
                >
                  <option value="Hours">Hours</option>
                  <option value="Days">Days</option>
                  <option value="Weeks">Weeks</option>
                  <option value="Months">Months</option>
                </select>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handlePinComplaint}
                className="w-full py-2 bg-teal-700 hover:bg-teal-600 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Pin & Append to Complaints</span>
              </button>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400">
              <Sparkles className="w-6 h-6 mx-auto mb-2 text-teal-600/50" />
              <p className="font-semibold text-slate-700 text-xs">
                Select a Hotspot on Body
              </p>
              <p className="text-[11px] text-slate-500 mt-1 max-w-[200px] mx-auto">
                Click red/white dots on the head, chest, abdomen, or joints to pin findings.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pinned Symptoms List Footer */}
      {activeComplaints.length > 0 && (
        <div className="pt-2.5 mt-1 border-t border-slate-100">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 mb-1.5">
            <span>Active Anatomical Findings ({activeComplaints.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {activeComplaints.map((item) => (
              <span
                key={item.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-rose-50 border border-rose-200/80 text-rose-800"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                <span>{item.complaint}</span>
                <span className="text-[10px] text-rose-600 font-normal">
                  ({item.duration} {item.durationUnit})
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveComplaint(item.id)}
                  className="hover:text-rose-950 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
