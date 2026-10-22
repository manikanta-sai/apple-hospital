import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Paperclip,
  BookOpen,
  Sparkles,
  Check,
  Plus,
  FileText,
  Pill,
  Calendar,
  Activity,
  Layers,
  FileCheck,
  X,
  Minimize2,
  Maximize2,
  Move,
  ChevronDown,
  ArrowDownRight,
  ArrowDownLeft,
  PanelLeft,
  PanelRight,
  Maximize,
  SlidersHorizontal,
} from "lucide-react";
import CustomDictionaryModal from "./CustomDictionaryModal.jsx";
import { generateId } from "../../utils/generateId.js";

const TEMPLATE_TRIGGERS = [
  {
    tag: "@vitals",
    label: "Triage Vitals Summary",
    section: "observations",
    icon: Activity,
  },
  {
    tag: "@rx-fever",
    label: "Acute Fever Order Set",
    section: "medications",
    icon: Pill,
  },
  {
    tag: "@rx-nausea",
    label: "Pregnancy Nausea Kit (Cat A)",
    section: "medications",
    icon: Pill,
  },
  {
    tag: "@diet-pregnancy",
    label: "Obstetric Diet & Hydration",
    section: "diet",
    icon: FileText,
  },
  {
    tag: "@diet-diabetic",
    label: "Diabetic Low Glycemic Diet",
    section: "diet",
    icon: FileText,
  },
  {
    tag: "@followup-5d",
    label: "5-Day Review / SOS",
    section: "followup",
    icon: Calendar,
  },
];

const LAYOUT_OPTIONS = [
  { id: "right corner", label: "Right Corner", desc: "Default floating bottom-right", icon: ArrowDownRight },
  { id: "left corner", label: "Left Corner", desc: "Floating bottom-left", icon: ArrowDownLeft },
  { id: "left", label: "Left Side Dock", desc: "Attached along left edge", icon: PanelLeft },
  { id: "right", label: "Right Side Dock", desc: "Attached along right edge", icon: PanelRight },
  { id: "center", label: "Center Floating", desc: "Centered overlay modal", icon: Move },
  { id: "full screen", label: "Full Screen", desc: "Maximized full workspace", icon: Maximize },
];

export default function AiCopilotPanel({
  patient,
  rxForm,
  onApplyTemplate = () => {},
}) {
  // Layout Options: 'left' | 'right' | 'left corner' | 'right corner' (default) | 'center' | 'full screen'
  const [placement, setPlacement] = useState(() => {
    try {
      return localStorage.getItem("opd_copilot_layout") || "right corner";
    } catch {
      return "right corner";
    }
  });

  const [isMinimized, setIsMinimized] = useState(() => {
    try {
      return localStorage.getItem("opd_copilot_is_minimized") === "true";
    } catch {
      return false;
    }
  });

  const [showLayoutMenu, setShowLayoutMenu] = useState(false);

  const handleSetPlacement = (newPos) => {
    setPlacement(newPos);
    try {
      localStorage.setItem("opd_copilot_layout", newPos);
    } catch {}
    setShowLayoutMenu(false);
  };

  const handleToggleMinimize = () => {
    setIsMinimized((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("opd_copilot_is_minimized", String(next));
      } catch {}
      return next;
    });
  };

  const [messages, setMessages] = useState([
    {
      id: "m-1",
      sender: "ai",
      text: `Hello Doctor. I am your Clinical Copilot for **${patient?.name || "Patient"}**. I can auto-draft sections, check drug safety, and inject standard clinical templates. Try typing \`@rx\`, \`@diet\`, or use the mic.`,
      timestamp: "Just now",
    },
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [showDictionaryModal, setShowDictionaryModal] = useState(false);
  const [showTagMenu, setShowTagMenu] = useState(false);
  const [uploadedDoc, setUploadedDoc] = useState(null);

  const messagesEndRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    if (!isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isMinimized]);

  // Voice recording timer simulation
  useEffect(() => {
    let interval = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputQuery(val);
    if (val.endsWith("@") || val.includes("@")) {
      setShowTagMenu(true);
    } else {
      setShowTagMenu(false);
    }
  };

  const handleExecuteTemplate = (template) => {
    setShowTagMenu(false);
    setInputQuery("");

    let actionLabel = "";
    if (template.tag === "@vitals") {
      const v = rxForm?.vitals || patient?.vitals || {};
      const vitalsText = `Vitals Recorded: BP: ${v.bp || "120/80"} mmHg, Pulse: ${
        v.pulse || "78"
      } bpm, SpO2: ${v.spo2 || "99"}%, Temp: ${v.temp || "98.6"}°F, Weight: ${
        v.weight || "65"
      } kg.`;
      onApplyTemplate("observations", vitalsText);
      actionLabel = "Injected vitals into Clinical Observations.";
    } else if (template.tag === "@rx-fever") {
      const feverMeds = [
        {
          id: generateId("med"),
          drugName: "Dolo 650",
          genericName: "Paracetamol 650mg",
          form: "Tablet",
          dosage: "1 Tab",
          frequency: "1-0-1",
          timing: "After Food",
          durationDays: 3,
          totalQuantity: 6,
          instructions: "Take with warm water if body temp exceeds 99.5°F",
        },
        {
          id: generateId("med"),
          drugName: "Pan 40",
          genericName: "Pantoprazole 40mg",
          form: "Tablet",
          dosage: "1 Tab",
          frequency: "1-0-0",
          timing: "Empty Stomach",
          durationDays: 3,
          totalQuantity: 3,
          instructions: "Take 30 mins before breakfast",
        },
      ];
      onApplyTemplate("medications", feverMeds);
      actionLabel = "Injected Paracetamol 650mg + Pantoprazole 40mg into Rx table.";
    } else if (template.tag === "@rx-nausea") {
      const nauseaMeds = [
        {
          id: generateId("med"),
          drugName: "Doxinate",
          genericName: "Doxylamine (10mg) + Pyridoxine (10mg)",
          form: "Tablet",
          dosage: "1 Tab",
          frequency: "1-0-1",
          timing: "Before Food",
          durationDays: 5,
          totalQuantity: 10,
          instructions: "FDA Pregnancy Category A. Take before bedtime and early morning.",
        },
      ];
      onApplyTemplate("medications", nauseaMeds);
      actionLabel = "Injected Doxylamine + Vitamin B6 (Category A) into Rx Table.";
    } else if (template.tag === "@diet-pregnancy") {
      const diet =
        "Consume small, frequent dry meals every 2 hours. Morning dry toast or plain crackers before getting out of bed. Sip electrolyte fluids or ginger tea throughout the day. Avoid fried, greasy, and highly spiced foods.";
      onApplyTemplate("diet", diet);
      actionLabel = "Injected Pregnancy Hyperemesis Nutrition Protocol into Dietary Advice.";
    } else if (template.tag === "@diet-diabetic") {
      const diet =
        "Low Glycemic Index diet. Strict avoidance of refined sugars, sweets, and carbonated beverages. Include high-fiber vegetables (spinach, beans), whole grains, and lean proteins. Daily 30-min brisk walk recommended.";
      onApplyTemplate("diet", diet);
      actionLabel = "Injected Diabetic Nutrition & Lifestyle Protocol.";
    } else if (template.tag === "@followup-5d") {
      const fUp = {
        timeline: "5 Days",
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        notes: "Review with repeat blood routine or SOS if vomiting/fever persists.",
      };
      onApplyTemplate("followup", fUp);
      actionLabel = "Updated Follow-up timeline to 5 Days (SOS).";
    }

    setMessages((prev) => [
      ...prev,
      {
        id: generateId("msg"),
        sender: "user",
        text: template.tag,
        timestamp: "Just now",
      },
      {
        id: generateId("msg"),
        sender: "ai",
        text: `⚡ **${template.label} Applied**: ${actionLabel}`,
        timestamp: "Just now",
      },
    ]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const query = inputQuery.trim();
    if (!query) return;

    const userMsg = {
      id: generateId("msg"),
      sender: "user",
      text: query,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");

    // Simulate smart AI response
    setTimeout(() => {
      let replyText = `I have noted: "${query}". Based on ${patient?.name || "patient"}'s record, this has been registered. You can use @ triggers to inject standard orders.`;

      const qLower = query.toLowerCase();
      if (qLower.includes("fever") || qLower.includes("temp")) {
        replyText = `Patient has fever symptoms. Recommended order set: **Paracetamol 650mg TDS** with hydration advice. Click below to inject.`;
      } else if (qLower.includes("nausea") || qLower.includes("vomit")) {
        replyText = `Patient is in 2nd Trimester. Recommended safe antiemetic: **Tab. Doxylamine + Pyridoxine 10mg** (FDA Category A). Avoid Ondansetron without evaluation.`;
      } else if (qLower.includes("bp") || qLower.includes("hypertension")) {
        replyText = `Recorded BP is ${rxForm?.vitals?.bp || patient?.vitals?.bp || "120/80"}. Recommended: Low-sodium DASH diet advice, Serum Electrolytes check, and 1-week review.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: generateId("msg"),
          sender: "ai",
          text: replyText,
          timestamp: "Just now",
        },
      ]);
    }, 600);
  };

  const handleToggleMic = () => {
    if (!isRecording) {
      setIsRecording(true);
    } else {
      setIsRecording(false);
      const dictationSamples = [
        "Patient complains of severe throbbing headache since 2 days, aggravated in bright light.",
        "Chest examination reveals bilateral clear vesicular breath sounds, no ronchi or wheezing.",
        "Advised plenty of warm fluids, steam inhalation twice daily, and strict 5-day bed rest.",
      ];
      const randomText =
        dictationSamples[Math.floor(Math.random() * dictationSamples.length)];

      setInputQuery(randomText);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedDoc({
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
    });

    setMessages((prev) => [
      ...prev,
      {
        id: generateId("msg"),
        sender: "user",
        text: `📎 Attached report: ${file.name}`,
        timestamp: "Just now",
      },
      {
        id: generateId("msg"),
        sender: "ai",
        text: `📑 **Lab Report Extracted (${file.name})**:
• Hemoglobin: 11.4 g/dL (Normal)
• Platelet Count: 210,000 /mcL (Normal)
• Urine Ketones: Negative
Findings are consistent with mild physiological anemia of pregnancy.`,
        timestamp: "Just now",
      },
    ]);
  };

  // Compute CSS container classes for the 6 Layout Options:
  // 'left' | 'right' | 'left corner' | 'right corner' | 'center' | 'full screen'
  const getLayoutClasses = () => {
    // 1. Minimized Mode (sleek floating pill)
    if (isMinimized) {
      if (placement === "left" || placement === "left corner") {
        return "fixed bottom-5 left-5 z-50 w-auto max-w-sm";
      }
      return "fixed bottom-5 right-5 z-50 w-auto max-w-sm";
    }

    // 2. Full Screen
    if (placement === "full screen") {
      return "fixed inset-3 sm:inset-6 z-50 w-auto h-auto max-w-none max-h-none flex flex-col";
    }

    // 3. Center
    if (placement === "center") {
      return "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[580px] max-w-[92vw] h-[640px] max-h-[86vh] flex flex-col";
    }

    // 4. Left Dock (attached to left side)
    if (placement === "left") {
      return "fixed top-16 left-0 bottom-0 z-40 w-[450px] max-w-[90vw] h-auto rounded-none sm:rounded-r-2xl border-l-0 flex flex-col shadow-2xl";
    }

    // 5. Right Dock (attached to right side)
    if (placement === "right") {
      return "fixed top-16 right-0 bottom-0 z-40 w-[450px] max-w-[90vw] h-auto rounded-none sm:rounded-l-2xl border-r-0 flex flex-col shadow-2xl";
    }

    // 6. Left Corner
    if (placement === "left corner") {
      return "fixed bottom-5 left-5 z-40 w-[430px] max-w-[calc(100vw-30px)] h-[560px] max-h-[82vh] flex flex-col";
    }

    // 7. Right Corner (DEFAULT)
    return "fixed bottom-5 right-5 z-40 w-[430px] max-w-[calc(100vw-30px)] h-[560px] max-h-[82vh] flex flex-col";
  };

  // IF MINIMIZED: Render compact interactive pill (NO doctor avatar / details)
  if (isMinimized) {
    return (
      <div className={getLayoutClasses()}>
        <div className="bg-slate-900/95 backdrop-blur-md text-white px-3 py-2 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-3 animate-fade-in-up">
          <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <Bot className="w-4 h-4" />
          </div>

          <div className="min-w-0 pr-1 cursor-pointer" onClick={handleToggleMinimize}>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white truncate">AI Medical Copilot</span>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
            </div>
            <span className="text-[10px] text-slate-300 block truncate">
              Click to open ({placement})
            </span>
          </div>

          <div className="flex items-center gap-1 border-l border-slate-700 pl-2">
            <button
              type="button"
              onClick={handleToggleMinimize}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Expand Copilot"
            >
              <Maximize2 size={13} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isModalOverlay = placement === "center" || placement === "full screen";

  return (
    <>
      {/* Backdrop for Center / Full Screen modes */}
      {isModalOverlay && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 transition-opacity"
          onClick={() => handleSetPlacement("right corner")}
        />
      )}

      <div
        className={`${getLayoutClasses()} bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-300/80 shadow-2xl overflow-hidden transition-all`}
      >
        {/* Header Bar: Clean AI branding (NO doctor avatar, NO doctor details) */}
        <div className="px-3.5 py-2.5 bg-slate-50/95 border-b border-slate-200 flex items-center justify-between gap-2 shrink-0 select-none">
          {/* Left: AI Bot Icon & Name */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Bot className="w-4.5 h-4.5" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  AI Medical Copilot
                </h4>
                <span className="text-[10px] font-bold text-teal-800 bg-teal-100/80 px-1.5 py-0.2 rounded-full">
                  Active
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                Clinical Decision Support & Prescription Copilot
              </p>
            </div>
          </div>

          {/* Right: Layout Switcher & Window Controls */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Layout Options Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowLayoutMenu(!showLayoutMenu)}
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-slate-200/80 bg-white shadow-2xs"
                title={`Layout: ${placement} (Click to switch)`}
              >
                <SlidersHorizontal size={12} className="text-teal-700" />
                <span className="hidden sm:inline capitalize text-[11px] font-bold">
                  {placement}
                </span>
                <ChevronDown size={11} />
              </button>

              {/* Layout Dropdown Menu */}
              {showLayoutMenu && (
                <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl shadow-2xl border border-slate-200 p-1.5 z-50 text-xs animate-fade-in">
                  <div className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1 tracking-wider border-b border-slate-100 mb-1">
                    Select Layout Position:
                  </div>
                  {LAYOUT_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const isActive = placement === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSetPlacement(opt.id)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-2.5 cursor-pointer transition-colors ${
                          isActive
                            ? "bg-teal-50 text-teal-900 font-bold border border-teal-200/60"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <Icon size={14} className={isActive ? "text-teal-700" : "text-slate-400"} />
                        <div className="min-w-0">
                          <span className="block text-xs">{opt.label}</span>
                          <span className="block text-[10px] text-slate-400 font-normal">
                            {opt.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Dictionary Trigger */}
            <button
              type="button"
              onClick={() => setShowDictionaryModal(true)}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer"
              title="Open Medical Dictionary"
            >
              <BookOpen size={13} />
            </button>

            {/* Minimize Button */}
            <button
              type="button"
              onClick={handleToggleMinimize}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer"
              title="Minimize Copilot Window"
            >
              <Minimize2 size={13} />
            </button>

            {/* Quick Full Screen / Restore Button */}
            <button
              type="button"
              onClick={() =>
                handleSetPlacement(placement === "full screen" ? "right corner" : "full screen")
              }
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                placement === "full screen"
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/70"
              }`}
              title={placement === "full screen" ? "Restore to Corner" : "Full Screen"}
            >
              <Maximize2 size={13} />
            </button>
          </div>
        </div>

        {/* Quick Trigger Pills Carousel */}
        <div className="px-3 py-1.5 bg-slate-50/70 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs shrink-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-teal-600" />
            Inject:
          </span>
          {TEMPLATE_TRIGGERS.map((t) => (
            <button
              key={t.tag}
              type="button"
              onClick={() => handleExecuteTemplate(t)}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 font-semibold text-[11px] whitespace-nowrap transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
            >
              <span className="text-teal-600 font-bold">{t.tag}</span>
              <span className="text-slate-500 font-normal">({t.label.split(" ")[0]})</span>
            </button>
          ))}
        </div>

        {/* Chat Messages Stream */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs bg-slate-50/40">
          {messages.map((m) => {
            const isUser = m.sender === "user";

            return (
              <div
                key={m.id}
                className={`flex items-start gap-2.5 ${
                  isUser ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {isUser ? (
                    <div className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center text-[10px] font-black shadow-2xs">
                      DR
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-2xs ${
                    isUser
                      ? "bg-slate-900 text-white rounded-tr-xs"
                      : "bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs"
                  }`}
                >
                  <div
                    className="whitespace-pre-line"
                    dangerouslySetInnerHTML={{
                      __html: m.text
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        .replace(
                          /`(.*?)`/g,
                          "<code class='bg-slate-100 text-teal-700 px-1 py-0.5 rounded font-bold'>$1</code>"
                        ),
                    }}
                  />
                  <span
                    className={`block text-[9.5px] mt-1 ${
                      isUser ? "text-slate-400" : "text-slate-400"
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Autocomplete Template Dropdown Menu */}
        {showTagMenu && (
          <div className="p-2 bg-slate-900 text-white border-t border-slate-800 shadow-xl space-y-1 shrink-0">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 px-2 uppercase tracking-wider">
              <span>Select Template to Inject:</span>
              <button
                type="button"
                onClick={() => setShowTagMenu(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1 max-h-36 overflow-y-auto">
              {TEMPLATE_TRIGGERS.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.tag}
                    type="button"
                    onClick={() => handleExecuteTemplate(t)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-teal-700 text-left flex items-center gap-2 transition-colors text-xs cursor-pointer"
                  >
                    <Icon className="w-3.5 h-3.5 text-teal-400" />
                    <div className="min-w-0">
                      <span className="font-bold text-teal-200 block text-[11px]">
                        {t.tag}
                      </span>
                      <span className="text-[10px] text-slate-300 truncate block">
                        {t.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Voice Dictation Active Bar */}
        {isRecording && (
          <div className="px-3 py-1.5 bg-rose-50 border-t border-rose-200 flex items-center justify-between text-xs text-rose-800 animate-pulse shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
              <span className="font-bold">
                Listening & Transcribing Consultation Audio... ({recordingSeconds}s)
              </span>
            </div>
            <button
              type="button"
              onClick={handleToggleMic}
              className="px-2.5 py-0.5 bg-rose-600 text-white rounded-md text-[11px] font-bold cursor-pointer"
            >
              Stop & Insert
            </button>
          </div>
        )}

        {/* Multi-Modal Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-1.5 shrink-0"
        >
          <label className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors">
            <Paperclip className="w-4 h-4" />
            <input
              type="file"
              accept=".pdf,image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          <button
            type="button"
            onClick={handleToggleMic}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isRecording
                ? "bg-rose-600 text-white shadow-xs"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            }`}
            title="Dictate with Medical Speech-to-Text"
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputQuery}
            onChange={handleInputChange}
            placeholder="Type @section (e.g. @rx, @diet) or clinical query..."
            className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
          />

          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="p-2 bg-teal-700 hover:bg-teal-600 disabled:opacity-40 text-white rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Custom Dictionary Modal */}
        <CustomDictionaryModal
          isOpen={showDictionaryModal}
          onClose={() => setShowDictionaryModal(false)}
        />
      </div>
    </>
  );
}
