/**
 * translations.js
 * ---------------
 * Two distinct concerns live here, deliberately kept separate:
 *
 *  1. SUPPORTED_LANGUAGES - the language picker's options, each with a
 *     BCP-47 tag used for both SpeechRecognition and SpeechSynthesis
 *     (`speechLang`), since those need region-specific tags (en-US)
 *     while UI/translation lookups use the short code (en).
 *
 *  2. UI_STRINGS - static, app-authored copy (buttons, labels, form
 *     prompts) translated ahead of time and bundled with the app.
 *     This is NOT where AI-generated chat replies are translated -
 *     those are dynamic and go through translationProvider.js /
 *     the backend's `targetLanguage` param instead. Mixing the two
 *     would mean redeploying the widget every time a new AI response
 *     needed translating, which doesn't scale.
 */

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧", speechLang: "en-US" },
  { code: "es", label: "Español", flag: "🇪🇸", speechLang: "es-ES" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳", speechLang: "hi-IN" },
];

export const UI_STRINGS = {
  en: {
    onlineNow: "Online now",
    inputPlaceholder: "Type your message...",
    listening: "Listening...",
    greeting: "Hi, I'm MediAssist. Ask me to find a doctor, check timings, or book an appointment.",
    quickBook: "Book Appointment",
    quickTimings: "Timings",
    quickEnquiry: "Enquiry",
    quickAddress: "Address",
    quickAgent: "Request Live Agent",
    patientFormPrompt: "Sure! Please share the patient's details so we can find the right doctor:",
    patientNameLabel: "Patient Name",
    mobileLabel: "Mobile Number",
    namePlaceholder: "e.g. Ravi Kumar",
    mobilePlaceholder: "10-digit mobile number",
    continueBtn: "Continue",
    slotPickerPrefix: "Great choice! Pick a convenient time slot with",
    bookSlotBtn: "Book Slot",
    notifyMeBtn: "Notify Me",
    availableBadge: "Available",
    busyBadge: "Busy",
    appointmentConfirmed: "Appointment Confirmed",
    readAloud: "Read this message aloud",
    stopReading: "Stop reading",
  },
  es: {
    onlineNow: "En línea",
    inputPlaceholder: "Escribe tu mensaje...",
    listening: "Escuchando...",
    greeting: "Hola, soy MediAssist. Pregúntame para encontrar un médico, ver horarios o reservar una cita.",
    quickBook: "Reservar Cita",
    quickTimings: "Horarios",
    quickEnquiry: "Consulta",
    quickAddress: "Dirección",
    quickAgent: "Solicitar Agente",
    patientFormPrompt: "¡Claro! Comparte los datos del paciente para encontrar al médico adecuado:",
    patientNameLabel: "Nombre del Paciente",
    mobileLabel: "Número de Móvil",
    namePlaceholder: "ej. Ravi Kumar",
    mobilePlaceholder: "Número de móvil de 10 dígitos",
    continueBtn: "Continuar",
    slotPickerPrefix: "¡Buena elección! Elige un horario conveniente con",
    bookSlotBtn: "Reservar",
    notifyMeBtn: "Notificarme",
    availableBadge: "Disponible",
    busyBadge: "Ocupado",
    appointmentConfirmed: "Cita Confirmada",
    readAloud: "Leer este mensaje en voz alta",
    stopReading: "Detener lectura",
  },
  hi: {
    onlineNow: "अभी ऑनलाइन",
    inputPlaceholder: "अपना संदेश लिखें...",
    listening: "सुन रहा हूं...",
    greeting: "नमस्ते, मैं मेडीअसिस्ट हूं। डॉक्टर खोजने, समय जानने या अपॉइंटमेंट बुक करने के लिए मुझसे पूछें।",
    quickBook: "अपॉइंटमेंट बुक करें",
    quickTimings: "समय",
    quickEnquiry: "पूछताछ",
    quickAddress: "पता",
    quickAgent: "लाइव एजेंट से बात करें",
    patientFormPrompt: "बिल्कुल! सही डॉक्टर खोजने के लिए मरीज़ का विवरण साझा करें:",
    patientNameLabel: "मरीज़ का नाम",
    mobileLabel: "मोबाइल नंबर",
    namePlaceholder: "जैसे रवि कुमार",
    mobilePlaceholder: "10 अंकों का मोबाइल नंबर",
    continueBtn: "जारी रखें",
    slotPickerPrefix: "बढ़िया चुनाव! इनके साथ सुविधाजनक समय चुनें",
    bookSlotBtn: "स्लॉट बुक करें",
    notifyMeBtn: "मुझे सूचित करें",
    availableBadge: "उपलब्ध",
    busyBadge: "व्यस्त",
    appointmentConfirmed: "अपॉइंटमेंट पक्का हुआ",
    readAloud: "यह संदेश ज़ोर से पढ़ें",
    stopReading: "पढ़ना रोकें",
  },
};
