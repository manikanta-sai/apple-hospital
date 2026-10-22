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

export default function AiCopilotPanel({
  patient,
  rxForm,
  onApplyTemplate = () => {},
}) {
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      const v = patient?.vitals || {};
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

    // Add conversation history
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
        replyText = `Recorded BP is ${patient?.vitals?.bp || "120/80"}. Recommended: Low-sodium DASH diet advice, Serum Electrolytes check, and 1-week review.`;
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

  // Toggle Voice Recording
  const handleToggleMic = () => {
    if (!isRecording) {
      setIsRecording(true);
    } else {
      setIsRecording(false);
      // Mock dictation translation
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

  // Handle Mock Lab Report Attachment
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

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col h-[480px] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2.5 bg-slate-50/90 border-b border-slate-200/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span>AI Medical Copilot</span>
              <span className="text-[10px] font-semibold text-teal-700 bg-teal-100/70 px-1.5 py-0.2 rounded-full">
                Active
              </span>
            </h4>
            <p className="text-[10.5px] text-slate-500">
              Type <code className="text-teal-700 font-bold">@</code> to inject clinical sections
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowDictionaryModal(true)}
          className="px-2.5 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 transition-colors shadow-2xs"
          title="Open Custom Medical Dictionary"
        >
          <BookOpen className="w-3.5 h-3.5 text-teal-600" />
          <span className="hidden sm:inline">Dictionary</span>
        </button>
      </div>

      {/* Quick Trigger Pills Carousel */}
      <div className="px-3 py-1.5 bg-slate-50/50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-teal-600" />
          Presets:
        </span>
        {TEMPLATE_TRIGGERS.map((t) => (
          <button
            key={t.tag}
            type="button"
            onClick={() => handleExecuteTemplate(t)}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200/80 font-semibold text-[11px] whitespace-nowrap transition-colors flex items-center gap-1"
          >
            <span className="text-teal-600 font-bold">{t.tag}</span>
            <span className="text-slate-500 font-normal">({t.label.split(" ")[0]})</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs bg-slate-50/30">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2 ${
              m.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-lg shrink-0 flex items-center justify-center text-[10px] font-bold ${
                m.sender === "user"
                  ? "bg-slate-800 text-white"
                  : "bg-teal-600 text-white shadow-2xs"
              }`}
            >
              {m.sender === "user" ? "Dr" : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`max-w-[85%] rounded-2xl p-2.5 text-xs shadow-2xs leading-relaxed ${
                m.sender === "user"
                  ? "bg-slate-900 text-white rounded-tr-xs"
                  : "bg-white text-slate-800 border border-slate-200/70 rounded-tl-xs"
              }`}
            >
              <div
                className="whitespace-pre-line"
                dangerouslySetInnerHTML={{
                  __html: m.text
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/`(.*?)`/g, "<code class='bg-slate-100 text-teal-700 px-1 py-0.5 rounded font-bold'>$1</code>"),
                }}
              />
              <span
                className={`block text-[9.5px] mt-1 ${
                  m.sender === "user" ? "text-slate-400" : "text-slate-400"
                }`}
              >
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Autocomplete Template Dropdown Menu */}
      {showTagMenu && (
        <div className="p-2 bg-slate-900 text-white border-t border-slate-800 shadow-xl space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 px-2 uppercase tracking-wider">
            <span>Select Template to Inject:</span>
            <button
              type="button"
              onClick={() => setShowTagMenu(false)}
              className="text-slate-400 hover:text-white"
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
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-teal-700 text-left flex items-center gap-2 transition-colors text-xs"
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
        <div className="px-3 py-1.5 bg-rose-50 border-t border-rose-200 flex items-center justify-between text-xs text-rose-800 animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
            <span className="font-bold">
              Listening & Transcribing Consultation Audio... ({recordingSeconds}s)
            </span>
          </div>
          <button
            type="button"
            onClick={handleToggleMic}
            className="px-2.5 py-0.5 bg-rose-600 text-white rounded-md text-[11px] font-bold"
          >
            Stop & Insert
          </button>
        </div>
      )}

      {/* Multi-Modal Input Bar */}
      <form
        onSubmit={handleSendMessage}
        className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-1.5"
      >
        {/* Attachment Upload Button */}
        <label className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors">
          <Paperclip className="w-4 h-4" />
          <input
            type="file"
            accept=".pdf,image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>

        {/* Mic Dictation Button */}
        <button
          type="button"
          onClick={handleToggleMic}
          className={`p-2 rounded-xl transition-all ${
            isRecording
              ? "bg-rose-600 text-white shadow-xs"
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
          }`}
          title="Dictate with Medical Speech-to-Text"
        >
          {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={inputQuery}
          onChange={handleInputChange}
          placeholder="Type @section (e.g. @rx, @diet) or query..."
          className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!inputQuery.trim()}
          className="p-2 bg-teal-700 hover:bg-teal-600 disabled:opacity-40 text-white rounded-xl transition-colors shadow-xs"
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
  );
}
