import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  Printer,
  Save,
  FlaskConical,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Stethoscope,
  Building2,
  Calendar,
  AlertTriangle,
  Lock,
  Unlock,
  FileCheck,
  Layers,
  Sparkles,
  PenTool,
  ChevronDown,
  Languages,
} from "lucide-react";
import InterimLabSlipModal from "./InterimLabSlipModal.jsx";

const PREVIEW_THEMES = [
  { id: "handwritten", label: "Handwritten", desc: "Human Handwriting Mode" },
  { id: "classic", label: "Classic", desc: "Standard Hospital EHR" },
  { id: "letterhead", label: "Letterhead", desc: "Corporate Institutional" },
  { id: "compact", label: "Compact", desc: "Dense 1-Page Summary" },
];

const RX_LANGUAGES = [
  { id: "te", label: "తెలుగు (Telugu - Default)", code: "te" },
  { id: "en", label: "English", code: "en" },
  { id: "hi", label: "हिन्दी (Hindi)", code: "hi" },
  { id: "ta", label: "தமிழ் (Tamil)", code: "ta" },
  { id: "kn", label: "ಕನ್ನಡ (Kannada)", code: "kn" },
];

function translateFrequency(freq, lang) {
  if (lang === "en" || !freq) return freq;
  const f = freq.trim();
  if (lang === "te") {
    if (f === "1-0-1") return "ఉదయం 1 - రాత్రి 1 (1-0-1)";
    if (f === "1-0-0") return "ఉదయం 1 (1-0-0)";
    if (f === "0-0-1") return "రాత్రి 1 (0-0-1)";
    if (f === "1-1-1") return "ఉదయం 1 - మధ్యాహ్నం 1 - రాత్రి 1 (1-1-1)";
    if (f === "0-1-0") return "మధ్యాహ్నం 1 (0-1-0)";
    if (f.toUpperCase().includes("SOS")) return "అవసరమైనప్పుడు మాత్రమే (SOS)";
    return f;
  }
  if (lang === "hi") {
    if (f === "1-0-1") return "सुबह 1 - रात 1 (1-0-1)";
    if (f === "1-0-0") return "सुबह 1 (1-0-0)";
    if (f === "0-0-1") return "रात 1 (0-0-1)";
    if (f === "1-1-1") return "सुबह 1 - दोपहर 1 - रात 1 (1-1-1)";
    if (f === "0-1-0") return "दोपहर 1 (0-1-0)";
    if (f.toUpperCase().includes("SOS")) return "ज़रूरत पड़ने पर (SOS)";
    return f;
  }
  if (lang === "ta") {
    if (f === "1-0-1") return "காலை 1 - இரவு 1 (1-0-1)";
    if (f === "1-0-0") return "காலை 1 (1-0-0)";
    if (f === "0-0-1") return "இரவு 1 (0-0-1)";
    if (f === "1-1-1") return "காலை 1 - மதியம் 1 - இரவு 1 (1-1-1)";
    return f;
  }
  if (lang === "kn") {
    if (f === "1-0-1") return "ಬೆಳಗ್ಗೆ 1 - ರಾತ್ರಿ 1 (1-0-1)";
    if (f === "1-0-0") return "ಬೆಳಗ್ಗೆ 1 (1-0-0)";
    if (f === "0-0-1") return "ರಾತ್ರಿ 1 (0-0-1)";
    if (f === "1-1-1") return "ಬೆಳಗ್ಗೆ 1 - ಮಧ್ಯಾಹ್ನ 1 - ರಾತ್ರಿ 1 (1-1-1)";
    return f;
  }
  return freq;
}

function translateTiming(timing, lang) {
  if (lang === "en" || !timing) return timing;
  const t = timing.trim().toLowerCase();
  if (lang === "te") {
    if (t.includes("before")) return "ఆహారానికి ముందు (Before Food)";
    if (t.includes("after")) return "ఆహారం తర్వాత (After Food)";
    if (t.includes("empty")) return "పరగడుపున (Empty Stomach)";
    if (t.includes("bed")) return "పడుకునే ముందు (Bedtime)";
    if (t.includes("with")) return "ఆహారంతో పాటు (With Food)";
    return timing;
  }
  if (lang === "hi") {
    if (t.includes("before")) return "खाने से पहले (Before Food)";
    if (t.includes("after")) return "खाने के बाद (After Food)";
    if (t.includes("empty")) return "खाली पेट (Empty Stomach)";
    if (t.includes("bed")) return "सोने से पहले (Bedtime)";
    return timing;
  }
  if (lang === "ta") {
    if (t.includes("before")) return "உணவுக்கு முன் (Before Food)";
    if (t.includes("after")) return "உணவுக்குப் பின் (After Food)";
    return timing;
  }
  if (lang === "kn") {
    if (t.includes("before")) return "ಊಟಕ್ಕೆ ಮುಂಚೆ (Before Food)";
    if (t.includes("after")) return "ಊಟದ ನಂತರ (After Food)";
    return timing;
  }
  return timing;
}

function translateInstructions(inst, lang) {
  if (lang === "en" || !inst) return inst;
  const i = inst.trim().toLowerCase();
  if (lang === "te") {
    if (i.includes("hour before breakfast") || i.includes("empty stomach")) {
      return "రోజూ ఉదయం అల్పాహారానికి 1 గంట ముందు పరగడుపున 1 మాత్ర వేసుకోవాలి.";
    }
    if (i.includes("spray")) {
      return "రోజుకు రెండుసార్లు ప్రతి నాసికా రంధ్రంలో 1 స్ప్రే చేయండి.";
    }
    if (i.includes("bedtime")) {
      return "రాత్రి పడుకునే ముందు మాత్రమే వేసుకోవాలి.";
    }
    return `సూచన: ${inst}`;
  }
  if (lang === "hi") {
    if (i.includes("hour before breakfast") || i.includes("empty stomach")) {
      return "सुबह नाश्ते से 1 घंटा पहले खाली पेट 1 गोली लें।";
    }
    if (i.includes("spray")) {
      return "दिन में दो बार नाक में 1 स्प्रे करें।";
    }
    return `निर्देश: ${inst}`;
  }
  return inst;
}

function translateAdvice(advice, lang) {
  if (lang === "en") return advice;
  if (lang === "te") {
    return (
      "• రోజుకు కనీసం 2.5 నుండి 3 లీటర్ల గోరువెచ్చని నీరు త్రాగాలి (మంచి హైడ్రేషన్).\n" +
      "• కారం, నూనె, మసాలాలు మరియు బయటి ఆహారాన్ని పూర్తిగా తగ్గించండి.\n" +
      "• తాజా ఆకుకూరలు, కూరగాయలు మరియు పండ్లు రోజువారీ ఆహారంలో చేర్చండి.\n" +
      "• రోజూ కనీసం 7-8 గంటలు నిద్రపోవాలి; ధూమపానం, మద్యపానం నివారించండి."
    );
  }
  if (lang === "hi") {
    return (
      "• प्रतिदिन कम से कम 2.5 से 3 लीटर गुनगुना पानी पिएं।\n" +
      "• अधिक मिर्च, तेल व मसालेदार भोजन से परहेज करें।\n" +
      "• ताज़ी हरी सब्जियां और फल आहार में शामिल करें।\n" +
      "• 7-8 घंटे की पर्याप्त नींद लें।"
    );
  }
  if (lang === "ta") {
    return "• தினமும் 2.5 முதல் 3 லிட்டர் தண்ணீர் குடிக்கவும்.\n• காரம் மற்றும் எண்ணெய் உணவுகளை தவிர்க்கவும்.\n• சத்தான காய்கறிகளை சாப்பிடவும்.";
  }
  if (lang === "kn") {
    return "• ದಿನಕ್ಕೆ 2.5 ರಿಂದ 3 ಲೀಟರ್ ನೀರು ಕುಡಿಯಿರಿ.\n• ಎಣ್ಣೆ ಮತ್ತು ಮಸಾಲೆಯುಕ್ತ ಆಹಾರವನ್ನು ತಪ್ಪಿಸಿ.\n• ತಾಜಾ ಹಣ್ಣು ಮತ್ತು ತರಕಾರಿಗಳನ್ನು ಸೇವಿಸಿ.";
  }
  return advice;
}

function translateFollowUp(followUp, lang) {
  const timeline = followUp.timeline || "1 Week";
  const dateStr = followUp.date ? `(${followUp.date})` : "";
  if (lang === "en") {
    return `After ${timeline} ${dateStr} ${followUp.notes ? `— ${followUp.notes}` : ""}`;
  }
  if (lang === "te") {
    return `${timeline} తర్వాత ${dateStr}. (లక్షణాలు తగ్గకపోతే లేదా తీవ్ర జ్వరం/శ్వాసలో ఇబ్బంది ఉంటే వెంటనే ఎమర్జెన్సీ విభాగాన్ని సంప్రదించండి).`;
  }
  if (lang === "hi") {
    return `${timeline} बाद ${dateStr}। (आपात स्थिति में तुरंत अस्पताल संपर्क करें)।`;
  }
  if (lang === "ta") {
    return `${timeline} கழித்து ${dateStr}.`;
  }
  if (lang === "kn") {
    return `${timeline} ನಂತರ ${dateStr}.`;
  }
  return `After ${timeline} ${dateStr}`;
}

/**
 * Dedicated Realistic Human Handwriting Prescription Pad Sheet
 */
function HandwrittenPrescriptionSheet({
  patient = {},
  prescription = {},
  doctor = {},
  vitals = {},
  complaints = [],
  diagnosis = {},
  medications = [],
  investigations = [],
  followUp = {},
  isNkda = true,
  allergiesList = [],
  rxLanguage = "te",
}) {
  return (
    <div
      id="digital-prescription-sheet"
      className="w-full max-w-[780px] rounded-2xl shadow-xl border border-slate-200/90 bg-white p-6 sm:p-8 font-handwriting text-blue-950 relative min-h-[850px] print:min-h-0 print:h-auto print:shadow-none print:border-none print:p-0 print:max-w-none print:rounded-none select-none transition-all"
    >
      {/* Real Doctor Clinic Printed Letterhead at Top (Clean Sans Face) */}
      <div className="border-b-2 border-slate-900 pb-3 print:pb-1.5 flex items-start justify-between font-sans">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-800 text-white flex items-center justify-center font-black text-sm">
              +
            </div>
            <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-950 uppercase">
              DR. RAJESH SHARMA, <span className="text-xs font-bold text-teal-800">MD (Medicine)</span>
            </h2>
          </div>
          <p className="text-xs text-slate-700 font-semibold mt-0.5">
            Senior Consultant Physician • Apple Multispecialty Hospital OPD Room 104
          </p>
          <p className="text-[11px] text-slate-500 font-mono">
            Reg. No: {doctor.regNo} • Timings: 09:00 AM – 04:00 PM • Tel: +91 44 2839 0000
          </p>
        </div>

        <div className="text-right font-sans">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Date
          </span>
          <span className="font-handwriting text-lg sm:text-xl font-bold text-blue-900 border-b border-blue-400/80 pb-0.5 inline-block -rotate-1">
            {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
          </span>
        </div>
      </div>

      {/* Clean White Sheet Prescription Content Body (No Ruler Lines, No Left Line) */}
      <div className="relative mt-4 space-y-3.5 print:space-y-2 print:mt-1.5">
        {/* Patient Hand-filled Demographics */}
        <div className="text-sm sm:text-base font-semibold flex flex-wrap items-baseline gap-x-5 gap-y-1 text-blue-900 pb-2 border-b border-blue-200/60">
          <div>
            Pt: <span className="font-bold underline decoration-blue-300 decoration-wavy">{patient.name || "Patient"}</span>
          </div>
          <div>
            Age/Sex: <span className="font-bold">{patient.age}y / {patient.gender}</span>
          </div>
          <div>
            UHID: <span className="font-mono text-sm font-bold">{patient.uhid}</span>
          </div>
          {vitals.bp && (
            <div>
              BP: <span className="font-bold">{vitals.bp}</span> mmHg
            </div>
          )}
          {vitals.pulse && (
            <div>
              Pulse: <span className="font-bold">{vitals.pulse}</span>/min
            </div>
          )}
          {vitals.temp && (
            <div>
              Temp: <span className="font-bold">{vitals.temp}</span>°F
            </div>
          )}
        </div>

        {/* Allergies Alert (Handwritten stamp) */}
        <div className="text-xs sm:text-sm font-bold">
          {isNkda ? (
            <span className="text-emerald-800">Allergies: NKDA (No Known Drug Allergies) ✓</span>
          ) : (
            <span className="text-red-700 underline decoration-red-500 decoration-2">
              ⚠️ ALLERGY ALERT: {allergiesList.map((a) => (typeof a === "string" ? a : a.name)).join(", ")}
            </span>
          )}
        </div>

        {/* Chief Complaints */}
        {complaints.length > 0 && (
          <div className="text-sm leading-snug">
            <div className="font-bold text-base text-blue-950">
              C/o (Complaints):
            </div>
            <div className="pl-3 mt-1 space-y-0.5 text-blue-900 text-sm sm:text-base">
              {complaints.map((c, i) => (
                <div key={i}>
                  — {c.complaint} ({c.duration} {c.durationUnit}, {c.severity})
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Diagnosis */}
        {(diagnosis.provisional || diagnosis.final) && (
          <div className="text-base sm:text-lg font-bold text-blue-950 flex flex-wrap items-baseline gap-2 pt-0.5">
            <span className="text-lg font-black underline decoration-blue-400">Dx:</span>
            <span className="italic underline decoration-amber-500 decoration-2 text-blue-950">
              {diagnosis.final || diagnosis.provisional}
            </span>
            {diagnosis.icd10Code && (
              <span className="font-sans text-[11px] bg-blue-100 text-blue-900 px-1.5 py-0.5 rounded font-bold font-mono">
                [ICD-10: {diagnosis.icd10Code}]
              </span>
            )}
          </div>
        )}

        {/* Classic ℞ Symbol & Medications */}
        <div className="space-y-2.5 pt-1">
          <div className="text-3xl font-serif font-black italic text-blue-950 leading-none select-none pl-0.5">
            ℞
          </div>

          {medications.length === 0 ? (
            <p className="text-sm text-blue-900/60 italic pl-3">No medications written.</p>
          ) : (
            <div className="space-y-2.5 pl-1.5">
              {medications.map((m, idx) => (
                <div key={idx} className="space-y-0.5 border-b border-blue-200/40 pb-2">
                  <div className="text-base sm:text-lg font-bold text-blue-950 flex items-baseline justify-between">
                    <span>
                      {idx + 1}. {m.drugName} {m.dosage ? `(${m.dosage})` : ""}
                    </span>
                    <span className="text-xs sm:text-sm font-mono font-bold text-blue-800">
                      #{m.totalQuantity || "10"}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-blue-900 flex items-center gap-3 pl-3 flex-wrap">
                    <span className="underline decoration-blue-300 font-mono font-bold tracking-wider">
                      {translateFrequency(m.frequency, rxLanguage)}
                    </span>
                    <span>({translateTiming(m.timing || "After food", rxLanguage)})</span>
                    <span>x {m.durationDays} days</span>
                  </div>
                  {m.instructions && (
                    <div className="text-xs sm:text-sm text-blue-800/90 italic pl-3">
                      ↳ {translateInstructions(m.instructions, rxLanguage)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Investigations */}
        {investigations.length > 0 && (
          <div className="text-sm pt-1">
            <span className="font-bold text-base underline decoration-blue-300">Adv. Labs / Tests:</span>
            <div className="pl-3 mt-0.5 text-blue-900 font-semibold text-sm sm:text-base">
              {investigations.map((inv) => inv.testName).join(" ,  ")}
            </div>
          </div>
        )}

        {/* Dietary & Lifestyle Advice */}
        {prescription.dietaryAdvice && (
          <div className="text-sm pt-1">
            <span className="font-bold text-base underline decoration-blue-300">Advice:</span>
            <p className="pl-3 mt-0.5 text-blue-900 whitespace-pre-line leading-relaxed text-sm sm:text-base">
              {translateAdvice(prescription.dietaryAdvice, rxLanguage)}
            </p>
          </div>
        )}

        {/* Follow-up Review */}
        {followUp.timeline && (
          <div className="text-sm pt-1 text-blue-900">
            <span className="font-bold text-base">Review:</span> {translateFollowUp(followUp, rxLanguage)}
          </div>
        )}

        {/* Doctor Hand-drawn Signature & Clinic Stamp */}
        <div className="pt-4 print:pt-2 flex items-end justify-between">
          <div className="text-xs text-slate-500 font-sans space-y-1">
            <div className="w-20 h-10 border-2 border-dashed border-slate-300 rounded flex items-center justify-center text-[9px] text-slate-400 font-mono uppercase text-center p-0.5">
              Clinic Seal / Stamp
            </div>
            <div className="text-[10px] font-mono text-slate-400">NABH Accredited OPD #104</div>
          </div>

          <div className="text-right">
            <div className="font-handwriting text-3xl sm:text-4xl font-bold text-blue-900 -rotate-2 select-none leading-none mb-1">
              Dr. Rajesh Sharma
            </div>
            <div className="font-sans font-bold text-xs text-slate-800">{doctor.name}</div>
            <div className="font-sans text-[10px] text-slate-500 font-mono">Reg. No: {doctor.regNo}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Standard Prescription Sheet Component (Classic, Letterhead, Compact)
 */
function StandardPrescriptionSheet({
  patient = {},
  prescription = {},
  doctor = {},
  vitals = {},
  complaints = [],
  diagnosis = {},
  medications = [],
  investigations = [],
  followUp = {},
  isNkda = true,
  allergiesList = [],
  previewTheme = "classic",
  rxLanguage = "te",
}) {
  return (
    <div
      id="digital-prescription-sheet"
      className={`w-full max-w-[780px] rounded-xl shadow-lg border transition-all duration-300 print:shadow-none print:border-none print:p-0 print:max-w-none print:rounded-none print:min-h-0 print:h-auto relative ${
        previewTheme === "letterhead"
          ? "bg-white border-teal-300 p-0 overflow-hidden"
          : previewTheme === "compact"
          ? "bg-white border-slate-300 p-5 space-y-3.5 text-xs text-slate-800"
          : "bg-white border-slate-200/80 p-6 sm:p-8 space-y-5 text-slate-800"
      }`}
      style={{ minHeight: previewTheme === "compact" ? "750px" : "860px" }}
    >
      {/* ─────────────────────────────────────────────────────────────
          HEADER STYLES BY TEMPLATE
         ───────────────────────────────────────────────────────────── */}
      {/* THEME 1: LETTERHEAD STYLE */}
      {previewTheme === "letterhead" ? (
        <div>
          {/* Executive Hospital Top Banner */}
          <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 text-white p-5 sm:p-6 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white text-teal-900 flex items-center justify-center font-black text-xl shadow-sm">
                  +
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight leading-none text-white">
                    APPLE MULTISPECIALTY HOSPITAL
                  </h2>
                  <p className="text-[11px] text-teal-300 font-bold uppercase tracking-wider mt-1">
                    NABH Accredited Tertiary Healthcare & Research Center
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-teal-200/80 mt-2">
                100 Hospital Boulevard, Metro Health District • Tel: +91 44 2839 0000 • contact@applehospital.com
              </p>
            </div>

            <div className="text-right">
              <div className="text-sm font-bold text-white">{doctor.name}</div>
              <div className="text-xs text-teal-300 font-semibold">{doctor.department}</div>
              <div className="text-[11px] text-teal-200/80 font-mono">Reg No: {doctor.regNo}</div>
              <div className="text-[10px] text-teal-300 mt-1 font-mono">
                Room: {doctor.room} • {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
              </div>
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300" />
        </div>
      ) : previewTheme === "compact" ? (
        /* THEME 2: COMPACT STYLE */
        <div className="border-b border-slate-300 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-teal-800 text-white font-bold flex items-center justify-center text-xs">
              +
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 tracking-tight leading-none">
                APPLE HOSPITAL OPD
              </h2>
              <span className="text-[10px] text-teal-800 font-semibold">General Medicine</span>
            </div>
          </div>
          <div className="text-right text-[10px]">
            <strong className="text-slate-900">{doctor.name}</strong> • Reg: {doctor.regNo} • Date: {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
          </div>
        </div>
      ) : (
        /* THEME 3: CLASSIC HOSPITAL STYLE (Default) */
        <div className="border-b-2 border-teal-700 pb-3 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-700 flex items-center justify-center text-white font-black text-lg">
                +
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight text-slate-900 leading-none">
                  APPLE MULTISPECIALTY HOSPITAL
                </h2>
                <p className="text-[11px] text-teal-800 font-bold uppercase tracking-wider mt-0.5">
                  Center of Excellence in Clinical Care
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Outpatient Department (OPD) • General Medicine Wing • Room 104
            </p>
            <p className="text-[10px] text-slate-400">
              100 Hospital Boulevard, Metro Health District • Tel: +91 44 2839 0000
            </p>
          </div>

          <div className="text-right">
            <h3 className="font-bold text-sm text-slate-900">{doctor.name}</h3>
            <p className="text-xs text-teal-800 font-semibold">{doctor.department}</p>
            <p className="text-[11px] text-slate-500 font-mono">Reg No: {doctor.regNo}</p>
            <p className="text-[10px] text-slate-400 mt-1">
              Date: {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
            </p>
          </div>
        </div>
      )}

      {/* Wrapper with padding for Letterhead body */}
      <div className={previewTheme === "letterhead" ? "p-6 sm:p-8 space-y-5" : ""}>
        {/* Patient Demographics Banner */}
        <div
          className={`rounded-xl border p-3.5 text-xs grid grid-cols-2 sm:grid-cols-4 gap-2.5 ${
            previewTheme === "handwritten"
              ? "bg-amber-50/70 border-amber-200"
              : previewTheme === "minimal"
              ? "bg-slate-50 border-slate-300"
              : previewTheme === "compact"
              ? "p-2 bg-slate-50/80 border-slate-200 gap-1.5 text-[11px]"
              : "bg-slate-50/90 border-slate-200/80"
          }`}
        >
          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Patient Name</span>
            <strong className="text-slate-900 text-sm">{patient.name || "Patient"}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Age / Gender</span>
            <strong className="text-slate-800">
              {patient.age} Yrs / {patient.gender}
            </strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase">UHID / Token</span>
            <strong className="font-mono text-slate-800">
              {patient.uhid} ({patient.tokenNumber})
            </strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Consultation</span>
            <span className="font-semibold text-teal-800 capitalize">
              {(patient.consultationType || "walk_in").replace("_", " ")} ({patient.visitType || "new"})
            </span>
          </div>
        </div>

        {/* Vitals Strip */}
        {(() => {
          const v = prescription.vitals || patient.vitals || {};
          const hasVitals = v.bp || v.pulse || v.temp || v.spo2;
          if (!hasVitals) return null;

          return (
            <div className="space-y-1">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Clinical Vitals
              </h4>
              <div
                className={`rounded-lg border p-2 text-xs grid grid-cols-4 gap-2 ${
                  previewTheme === "handwritten"
                    ? "bg-white/80 border-amber-200 font-mono"
                    : "bg-white border-slate-200 font-mono"
                }`}
              >
                <div>
                  <span className="text-[9px] text-slate-400 block">BP</span>
                  <strong>{v.bp ? `${v.bp} mmHg` : "—"}</strong>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block">Pulse</span>
                  <strong>{v.pulse ? `${v.pulse} bpm` : "—"}</strong>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block">SpO2</span>
                  <strong>{v.spo2 ? `${v.spo2}%` : "—"}</strong>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block">Temp</span>
                  <strong>{v.temp ? `${v.temp} °F` : "—"}</strong>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Allergies / Contraindication Bar */}
        {(() => {
          const rawAllergies = prescription.allergies || patient.allergies || [];
          const list = Array.isArray(rawAllergies) ? rawAllergies : [rawAllergies];
          const isNkdaStatus =
            list.length === 0 ||
            list.every((a) => {
              const name = typeof a === "string" ? a : a?.name || "";
              return (
                name.toUpperCase() === "NKDA" ||
                name.toLowerCase() === "none" ||
                name.toLowerCase().includes("no known")
              );
            });

          return (
            <div
              className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                isNkdaStatus
                  ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
                  : "bg-rose-50 border-rose-300 text-rose-950 font-bold"
              }`}
            >
              <span>
                {isNkdaStatus
                  ? "✓ Allergies: No Known Drug Allergies (NKDA)"
                  : `⚠️ Drug Allergy Alert: ${list.map((a) => (typeof a === "string" ? a : a.name)).join(", ")}`}
              </span>
              <span className="text-[9px] font-mono uppercase opacity-75">
                NABH Verified
              </span>
            </div>
          );
        })()}

        {/* Chief Complaints */}
        {complaints.length > 0 && (
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Chief Complaints
            </h4>
            <div className="space-y-1 text-xs">
              {complaints.map((c, i) => (
                <div key={i} className="flex items-center justify-between py-0.5 border-b border-slate-100">
                  <span>• {c.complaint}</span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {c.duration} {c.durationUnit} ({c.severity})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Clinical Diagnosis */}
        {(diagnosis.provisional || diagnosis.final) && (
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Diagnosis
            </h4>
            <div className="p-2.5 rounded-lg bg-teal-50/60 border border-teal-200 text-xs font-bold text-teal-950 flex items-center justify-between">
              <span>{diagnosis.final || diagnosis.provisional}</span>
              {diagnosis.icd10Code && (
                <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-mono text-[10px]">
                  ICD-10: {diagnosis.icd10Code}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Medications Prescribed (Rx) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <span className="text-lg font-serif italic text-teal-800">℞</span>
              <span>Medications Prescribed</span>
            </h4>
            <span className="text-[10px] font-mono text-slate-400">
              {medications.length} Item(s)
            </span>
          </div>

          {medications.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-2">No medications prescribed yet.</p>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-bold uppercase text-slate-500">
                  <th className="py-1">#</th>
                  <th className="py-1">Drug Name / Generic</th>
                  <th className="py-1">Dosage / Form</th>
                  <th className="py-1">Dosing</th>
                  <th className="py-1">Timing</th>
                  <th className="py-1 text-center">Days</th>
                  <th className="py-1 text-right">Qty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {medications.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-1.5 font-mono text-[11px] text-slate-400">{idx + 1}</td>
                    <td className="py-1.5 pr-2">
                      <strong className="text-slate-900 block">{m.drugName}</strong>
                      {m.genericName && m.genericName !== m.drugName && (
                        <span className="text-[10px] text-slate-500 block italic">
                          {m.genericName}
                        </span>
                      )}
                      {m.instructions && (
                        <span className={`text-[10px] block ${previewTheme === "handwritten" ? "font-serif italic text-amber-900" : "text-slate-500"}`}>
                          ↳ {translateInstructions(m.instructions, rxLanguage)}
                        </span>
                      )}
                    </td>
                    <td className="py-1.5">{m.dosage || "—"} ({m.form})</td>
                    <td className="py-1.5 font-mono font-bold text-slate-800">
                      {translateFrequency(m.frequency, rxLanguage)}
                    </td>
                    <td className="py-1.5">{translateTiming(m.timing, rxLanguage)}</td>
                    <td className="py-1.5 text-center font-mono">{m.durationDays}d</td>
                    <td className="py-1.5 text-right font-mono font-bold">{m.totalQuantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Investigations Ordered */}
        {investigations.length > 0 && (
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Investigations Ordered
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {investigations.map((inv, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-900 font-medium text-[11px]"
                >
                  🧪 {inv.testName}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Dietary Advice & Follow-Up (Localized for Patient) */}
        {(prescription.dietaryAdvice || followUp.timeline) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            {prescription.dietaryAdvice && (
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <strong className="text-slate-700 block text-[10px] uppercase font-bold">Diet & Lifestyle</strong>
                <p className="text-slate-600 leading-relaxed text-[11px] whitespace-pre-line">
                  {translateAdvice(prescription.dietaryAdvice, rxLanguage)}
                </p>
              </div>
            )}
            {followUp.timeline && (
              <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 space-y-1">
                <strong className="text-emerald-950 block text-[10px] uppercase font-bold">Follow-Up Review</strong>
                <p className="text-emerald-900 text-[11px] font-semibold">
                  {translateFollowUp(followUp, rxLanguage)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Doctor Signature Block */}
        <div className="pt-4 border-t border-slate-200 flex items-end justify-between text-xs">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-teal-800 font-bold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Digitally Authenticated Prescription</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Token: {patient.tokenNumber || "#W-01"} • {new Date().toLocaleTimeString()}
            </p>
          </div>

          <div className="text-right">
            <div className="font-serif italic text-base text-teal-900 font-bold mb-0.5">
              Dr. Rajesh Sharma
            </div>
            <div className="font-bold text-slate-800">{doctor.name}</div>
            <div className="text-[10px] text-slate-500 font-mono">Reg No: {doctor.regNo}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DigitalPrescriptionPreviewPane({
  patient = {},
  prescription = {},
  isSaving = false,
  onSaveDraft = () => {},
  onSendToLab = () => {},
  onFinalizeAndPrint = () => {},
}) {
  const [showLabSlipModal, setShowLabSlipModal] = useState(false);
  const [validationAlert, setValidationAlert] = useState(null);
  const [previewTheme, setPreviewTheme] = useState("handwritten"); // "handwritten" (default) | "classic" | "letterhead" | "compact"
  const [rxLanguage, setRxLanguage] = useState("te"); // Default to Telugu

  const medications = prescription.medications || [];
  const complaints = prescription.chiefComplaints || [];
  const investigations = prescription.investigationsOrdered || [];
  const diagnosis = prescription.diagnosis || {};
  const followUp = prescription.followUp || {};
  const referrals = prescription.referrals || {};
  const isFinalized = prescription.status === "finalized";
  const isDraft = !isFinalized;
  const vitals = prescription.vitals || patient.vitals || {};

  const rawAllergies = prescription.allergies || patient.allergies || [];
  const allergiesList = Array.isArray(rawAllergies) ? rawAllergies : [rawAllergies];
  const isNkda =
    allergiesList.length === 0 ||
    allergiesList.every((a) => {
      const name = typeof a === "string" ? a : a?.name || "";
      return (
        name.toUpperCase() === "NKDA" ||
        name.toLowerCase() === "none" ||
        name.toLowerCase().includes("no known")
      );
    });

  const doctor = prescription.doctorDetails || {
    name: "Dr. Rajesh Sharma, MD",
    regNo: "NMC-48291",
    department: "General Medicine",
    room: "Room 104",
  };

  // Check mandatory requirements
  const isDiagnosisFilled = !!(diagnosis.provisional?.trim() || diagnosis.final?.trim());
  const isComplaintsFilled = complaints.length > 0;
  const isMedicationsFilled = medications.length > 0;
  const isFollowUpFilled = !!(followUp.timeline || followUp.date);

  const isMandatoryComplete =
    isDiagnosisFilled &&
    isComplaintsFilled &&
    isMedicationsFilled &&
    isFollowUpFilled;

  const handlePrintClick = () => {
    if (!isFinalized) {
      setValidationAlert(
        "Prescription cannot be printed in DRAFT mode. Please complete mandatory fields and click 'Finalize, Sign & Print'."
      );
      setTimeout(() => setValidationAlert(null), 4000);
      return;
    }
    window.print();
  };

  const handleFinalizeClick = () => {
    if (!isMandatoryComplete) {
      setValidationAlert(
        "Cannot Finalize: Please ensure Chief Complaints, Diagnosis, Medications, and Follow-up are completed."
      );
      setTimeout(() => setValidationAlert(null), 4000);
      return;
    }
    onFinalizeAndPrint();
  };

  return (
    <div className="flex flex-col h-full bg-slate-100/70 border-l border-slate-200">
      {/* Top Preview Controls Bar: Theme Switcher & Actions */}
      <div className="px-4 sm:px-6 py-3 bg-white/95 backdrop-blur-md border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0 print:hidden">
        {/* Left: Title & Status */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Print Preview
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 font-semibold border border-teal-200/60">
            {prescription.status === "finalized"
              ? "Finalized & Signed"
              : prescription.status === "awaiting_labs"
              ? "Lab Draft"
              : "Active Working Draft"}
          </span>
        </div>

        {/* Center: Template & Language Dropdowns */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Template Dropdown Options */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="preview-theme-dropdown"
              className="text-xs font-bold text-slate-700 flex items-center gap-1.5"
            >
              <Layers size={14} className="text-teal-700" />
              <span>Template:</span>
            </label>
            <div className="relative">
              <select
                id="preview-theme-dropdown"
                value={previewTheme}
                onChange={(e) => setPreviewTheme(e.target.value)}
                className="appearance-none bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold rounded-xl pl-3 pr-8 py-2 shadow-2xs focus:ring-2 focus:ring-teal-500 focus:outline-none cursor-pointer transition-all"
              >
                {PREVIEW_THEMES.map((theme) => (
                  <option key={theme.id} value={theme.id}>
                    {theme.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              />
            </div>
          </div>

          {/* Multi-language Selector (Default Telugu) - for Rx, Advice, Follow-up */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="rx-language-dropdown"
              className="text-xs font-bold text-slate-700 flex items-center gap-1.5"
            >
              <Languages size={14} className="text-teal-700" />
              <span>Language:</span>
            </label>
            <div className="relative">
              <select
                id="rx-language-dropdown"
                value={rxLanguage}
                onChange={(e) => setRxLanguage(e.target.value)}
                className="appearance-none bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold rounded-xl pl-3 pr-8 py-2 shadow-2xs focus:ring-2 focus:ring-teal-500 focus:outline-none cursor-pointer transition-all"
              >
                {RX_LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Right: Quick Print & Lab Slip Actions */}
        <div className="flex items-center gap-2">
          {investigations.length > 0 && (
            <button
              type="button"
              onClick={() => setShowLabSlipModal(true)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              title="Print Interim Lab Requisition Slip"
            >
              <FlaskConical className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Lab Slip</span>
            </button>
          )}

          <button
            type="button"
            onClick={handlePrintClick}
            className={`text-xs px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer ${
              isFinalized
                ? "border-teal-200 bg-teal-50 text-teal-800 hover:bg-teal-100"
                : "border-slate-200 bg-white text-slate-400 hover:text-slate-600"
            }`}
            title={isFinalized ? "Print official prescription" : "Print locked in draft mode"}
          >
            {isFinalized ? (
              <Printer className="w-3.5 h-3.5 text-teal-700" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-amber-500" />
            )}
            <span>{isFinalized ? "Quick Print" : "Print Locked"}</span>
          </button>
        </div>
      </div>

      {/* Validation Alert Toast/Banner */}
      {validationAlert && (
        <div className="px-5 py-2.5 bg-amber-50 border-b border-amber-200 flex items-center justify-between text-xs text-amber-900 animate-fade-in-up">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-semibold">{validationAlert}</span>
          </div>
          <button
            type="button"
            onClick={() => setValidationAlert(null)}
            className="text-amber-700 font-bold hover:text-amber-950 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Simulated A4 Paper Scrollable Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-200/50 print:p-0 print:bg-white relative">
        {/* Draft Watermark Overlay */}
        {isDraft && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center select-none z-10 overflow-hidden">
            <div className="transform -rotate-30 border-4 border-amber-500/20 text-amber-600/20 font-black text-4xl sm:text-5xl tracking-widest uppercase px-8 py-4 rounded-3xl">
              DRAFT • NOT VALID FOR DISPENSING
            </div>
          </div>
        )}

        {/* Dynamic A4 Prescription Sheet */}
        {previewTheme === "handwritten" ? (
          <HandwrittenPrescriptionSheet
            patient={patient}
            prescription={prescription}
            doctor={doctor}
            vitals={vitals}
            complaints={complaints}
            diagnosis={diagnosis}
            medications={medications}
            investigations={investigations}
            followUp={followUp}
            isNkda={isNkda}
            allergiesList={allergiesList}
            rxLanguage={rxLanguage}
          />
        ) : (
          <StandardPrescriptionSheet
            patient={patient}
            prescription={prescription}
            doctor={doctor}
            vitals={vitals}
            complaints={complaints}
            diagnosis={diagnosis}
            medications={medications}
            investigations={investigations}
            followUp={followUp}
            isNkda={isNkda}
            allergiesList={allergiesList}
            previewTheme={previewTheme}
            rxLanguage={rxLanguage}
          />
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="p-4 bg-white/95 backdrop-blur-md border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors border border-slate-300/80 shadow-2xs cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-slate-600" />
            <span>{isSaving ? "Saving..." : "Save Draft"}</span>
          </button>

          <button
            type="button"
            onClick={onSendToLab}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1.5 transition-colors border border-indigo-200 shadow-2xs cursor-pointer"
          >
            <FlaskConical className="w-3.5 h-3.5 text-indigo-600" />
            <span>Mark Draft - Send to Lab</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {isMandatoryComplete ? (
            <button
              type="button"
              onClick={handleFinalizeClick}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer bg-teal-700 hover:bg-teal-600 text-white hover:shadow-lg animate-fade-in"
              title="Sign, lock and print official prescription"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>
                {isFinalized
                  ? "Re-Print Prescription"
                  : "Finalize, Sign & Print Rx"}
              </span>
            </button>
          ) : (
            <div className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Complete required fields in Step 1 to unlock Finalize</span>
            </div>
          )}
        </div>
      </div>

      {/* Interim Diagnostic / Lab Slip Modal */}
      <InterimLabSlipModal
        isOpen={showLabSlipModal}
        patient={patient}
        investigations={investigations}
        doctorDetails={doctor}
        onClose={() => setShowLabSlipModal(false)}
      />

      {/* ── Direct Body Print Portal: Eliminates Blank Pages & Nested DOM Clipping ── */}
      {typeof document !== "undefined" &&
        createPortal(
          <div id="prescription-print-portal">
            {previewTheme === "handwritten" ? (
              <HandwrittenPrescriptionSheet
                patient={patient}
                prescription={prescription}
                doctor={doctor}
                vitals={vitals}
                complaints={complaints}
                diagnosis={diagnosis}
                medications={medications}
                investigations={investigations}
                followUp={followUp}
                isNkda={isNkda}
                allergiesList={allergiesList}
                rxLanguage={rxLanguage}
              />
            ) : (
              <StandardPrescriptionSheet
                patient={patient}
                prescription={prescription}
                doctor={doctor}
                vitals={vitals}
                complaints={complaints}
                diagnosis={diagnosis}
                medications={medications}
                investigations={investigations}
                followUp={followUp}
                isNkda={isNkda}
                allergiesList={allergiesList}
                previewTheme={previewTheme}
                rxLanguage={rxLanguage}
              />
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
