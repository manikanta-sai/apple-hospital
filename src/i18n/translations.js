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
  { code: "hi", label: "हिन्दी", flag: "🇮🇳", speechLang: "hi-IN" },
  { code: "te", label: "తెలుగు", flag: "🇮🇳", speechLang: "te-IN" },
  { code: "ta", label: "தமிழ்", flag: "🇮🇳", speechLang: "ta-IN" },
  { code: "kn", label: "ಕನ್ನಡ", flag: "🇮🇳", speechLang: "kn-IN" },
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
  te: {
    onlineNow: "ప్రస్తుతం ఆన్‌లైన్‌లో ఉన్నారు",
    inputPlaceholder: "మీ సందేశాన్ని టైప్ చేయండి...",
    listening: "వింటున్నాను...",
    greeting:
      "నమస్కారం, నేను మెడిఅసిస్ట్. డాక్టర్‌ను కనుగొనడానికి, సమయాలను తెలుసుకోవడానికి లేదా అపాయింట్‌మెంట్ బుక్ చేయడానికి నన్ను అడగండి.",
    quickBook: "అపాయింట్‌మెంట్ బుక్ చేయండి",
    quickTimings: "సమయాలు",
    quickEnquiry: "విచారణ",
    quickAddress: "చిరునామా",
    quickAgent: "లైవ్ ఏజెంట్‌ను కోరండి",
    patientFormPrompt:
      "తప్పకుండా! సరైన డాక్టర్‌ను కనుగొనడానికి రోగి వివరాలను అందించండి:",
    patientNameLabel: "రోగి పేరు",
    mobileLabel: "మొబైల్ నంబర్",
    namePlaceholder: "ఉదా. రవి కుమార్",
    mobilePlaceholder: "10 అంకెల మొబైల్ నంబర్",
    continueBtn: "కొనసాగించండి",
    slotPickerPrefix:
      "మంచి ఎంపిక! వీరితో అనుకూలమైన సమయాన్ని ఎంచుకోండి",
    bookSlotBtn: "స్లాట్ బుక్ చేయండి",
    notifyMeBtn: "నాకు తెలియజేయండి",
    availableBadge: "అందుబాటులో ఉంది",
    busyBadge: "బిజీగా ఉంది",
    appointmentConfirmed: "అపాయింట్‌మెంట్ నిర్ధారించబడింది",
    readAloud: "ఈ సందేశాన్ని గట్టిగా చదవండి",
    stopReading: "చదవడం ఆపండి",
  },
  ta: {
    onlineNow: "தற்போது ஆன்லைனில்",
    inputPlaceholder: "உங்கள் செய்தியைத் தட்டச்சு செய்யவும்...",
    listening: "கேட்கிறேன்...",
    greeting:
      "வணக்கம், நான் மெடிஅசிஸ்ட். மருத்துவரைக் கண்டுபிடிக்க, நேரங்களைப் பார்க்க அல்லது சந்திப்பை முன்பதிவு செய்ய என்னிடம் கேளுங்கள்.",
    quickBook: "சந்திப்பை முன்பதிவு செய்க",
    quickTimings: "நேரங்கள்",
    quickEnquiry: "விசாரணை",
    quickAddress: "முகவரி",
    quickAgent: "நேரடி முகவரைக் கோருங்கள்",
    patientFormPrompt:
      "நிச்சயமாக! சரியான மருத்துவரைக் கண்டுபிடிக்க நோயாளியின் விவரங்களைப் பகிரவும்:",
    patientNameLabel: "நோயாளியின் பெயர்",
    mobileLabel: "மொபைல் எண்",
    namePlaceholder: "எ.கா. ரவி குமார்",
    mobilePlaceholder: "10 இலக்க மொபைல் எண்",
    continueBtn: "தொடரவும்",
    slotPickerPrefix:
      "சிறந்த தேர்வு! இவருடன் வசதியான நேரத்தைத் தேர்வு செய்யவும்",
    bookSlotBtn: "நேரத்தை முன்பதிவு செய்க",
    notifyMeBtn: "எனக்குத் தெரிவிக்கவும்",
    availableBadge: "கிடைக்கிறது",
    busyBadge: "பிஸியாக உள்ளது",
    appointmentConfirmed: "சந்திப்பு உறுதிசெய்யப்பட்டது",
    readAloud: "இந்தச் செய்தியை சத்தமாகப் படிக்கவும்",
    stopReading: "வாசிப்பதை நிறுத்தவும்",
  },
  kn: {
    onlineNow: "ಈಗ ಆನ್‌ಲೈನ್‌ನಲ್ಲಿದ್ದಾರೆ",
    inputPlaceholder: "ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ...",
    listening: "ಆಲಿಸುತ್ತಿದ್ದೇನೆ...",
    greeting:
      "ನಮಸ್ಕಾರ, ನಾನು ಮೆಡಿಅಸಿಸ್ಟ್. ವೈದ್ಯರನ್ನು ಹುಡುಕಲು, ಸಮಯಗಳನ್ನು ತಿಳಿಯಲು ಅಥವಾ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕ್ ಮಾಡಲು ನನ್ನನ್ನು ಕೇಳಿ.",
    quickBook: "ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ",
    quickTimings: "ಸಮಯಗಳು",
    quickEnquiry: "ವಿಚಾರಣೆ",
    quickAddress: "ವಿಳಾಸ",
    quickAgent: "ಲೈವ್ ಏಜೆಂಟ್‌ರನ್ನು ಕೇಳಿ",
    patientFormPrompt:
      "ಖಂಡಿತ! ಸರಿಯಾದ ವೈದ್ಯರನ್ನು ಹುಡುಕಲು ರೋಗಿಯ ವಿವರಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ:",
    patientNameLabel: "ರೋಗಿಯ ಹೆಸರು",
    mobileLabel: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    namePlaceholder: "ಉದಾ. ರವಿ ಕುಮಾರ್",
    mobilePlaceholder: "10 ಅಂಕಿಗಳ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    continueBtn: "ಮುಂದುವರಿಸಿ",
    slotPickerPrefix:
      "ಉತ್ತಮ ಆಯ್ಕೆ! ಇವರೊಂದಿಗೆ ಅನುಕೂಲಕರ ಸಮಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    bookSlotBtn: "ಸ್ಲಾಟ್ ಬುಕ್ ಮಾಡಿ",
    notifyMeBtn: "ನನಗೆ ತಿಳಿಸಿ",
    availableBadge: "ಲಭ್ಯವಿದೆ",
    busyBadge: "ಬ್ಯುಸಿಯಾಗಿದೆ",
    appointmentConfirmed: "ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ದೃಢೀಕರಿಸಲಾಗಿದೆ",
    readAloud: "ಈ ಸಂದೇಶವನ್ನು ಜೋರಾಗಿ ಓದಿ",
    stopReading: "ಓದುವುದನ್ನು ನಿಲ್ಲಿಸಿ",
  }
};
