/**
 * translationProvider.js
 * ------------------------
 * Client-side translation for DYNAMIC content (AI-generated reply text)
 * as opposed to the static UI_STRINGS dictionary. This is a provider
 * pattern: `translateText()` is the only export the app depends on, so
 * swapping the implementation for Google Cloud Translation, DeepL, or
 * Azure Translator is a one-file change.
 *
 * PRODUCTION GUIDANCE: for a medical chatbot, prefer having your
 * backend generate the reply directly in the requested language (pass
 * `targetLanguage` to POST /api/chat/message - see chatApi.js) rather
 * than machine-translating after the fact. LLM-native generation in
 * the target language preserves clinical nuance far better than a
 * translation pass bolted on afterward. This client-side provider
 * exists so the MOCK_MODE demo (no backend) still shows the UX.
 */

// Tiny built-in phrase dictionary so the offline demo can show
// translated bot replies for the canned mock scenarios. Replace this
// whole map with a real API call in production.
const PHRASE_DICTIONARY = {
  "Our OPD is open Monday to Saturday, 8:00 AM to 8:00 PM. Would you like help booking a visit?": {
    es: "Nuestro OPD está abierto de lunes a sábado, de 8:00 a 20:00. ¿Quieres ayuda para reservar una visita?",
    hi: "हमारा ओपीडी सोमवार से शनिवार, सुबह 8 बजे से रात 8 बजे तक खुला है। क्या आपको विज़िट बुक करने में मदद चाहिए?",
  },
  "I found 3 cardiologists available this week. Tap a card to book a slot:": {
    es: "Encontré 3 cardiólogos disponibles esta semana. Toca una tarjeta para reservar un horario:",
    hi: "मुझे इस सप्ताह 3 हृदय रोग विशेषज्ञ उपलब्ध मिले। स्लॉट बुक करने के लिए कार्ड पर टैप करें:",
  },
  "Dr. Mani is fully booked until next Monday. Here are highly-rated Orthopedic doctors available sooner:": {
    es: "El Dr. Mani está completamente reservado hasta el próximo lunes. Aquí hay ortopedistas mejor valorados disponibles antes:",
    hi: "डॉ. मणि अगले सोमवार तक पूरी तरह बुक हैं। यहां जल्द उपलब्ध उच्च-रेटेड ऑर्थोपेडिक डॉक्टर हैं:",
  },
  "Sure — you can ask me about specific doctors, departments, insurance, or test reports. What would you like to know?": {
    es: "Claro, puedes preguntarme sobre médicos específicos, departamentos, seguros o informes de pruebas. ¿Qué te gustaría saber?",
    hi: "बिल्कुल — आप मुझसे विशेष डॉक्टरों, विभागों, बीमा या जांच रिपोर्ट के बारे में पूछ सकते हैं। आप क्या जानना चाहेंगे?",
  },
  "ABCD Multispecialty Hospital, 4th Cross Road, Anna Nagar, Chennai - 600040. Landmark: Opposite Anna Nagar Tower Park.": {
    es: "ABCD Multispecialty Hospital, 4th Cross Road, Anna Nagar, Chennai - 600040. Referencia: frente a Anna Nagar Tower Park.",
    hi: "ABCD Multispecialty Hospital, 4th क्रॉस रोड, अन्ना नगर, चेन्नई - 600040। लैंडमार्क: अन्ना नगर टॉवर पार्क के सामने।",
  },
  "Connecting you to a live agent now — an executive will join this chat shortly. Average wait time is under 3 minutes.": {
    es: "Conectándote con un agente ahora — un ejecutivo se unirá a este chat en breve. El tiempo de espera promedio es menos de 3 minutos.",
    hi: "अभी आपको लाइव एजेंट से जोड़ रहे हैं — एक कार्यकारी जल्द ही इस चैट में शामिल होंगे। औसत प्रतीक्षा समय 3 मिनट से कम है।",
  },
  "A confirmation SMS with your appointment details has been sent to the registered mobile number.": {
    es: "Se ha enviado un SMS de confirmación con los detalles de tu cita al número de móvil registrado.",
    hi: "आपके अपॉइंटमेंट विवरण के साथ एक पुष्टिकरण एसएमएस पंजीकृत मोबाइल नंबर पर भेजा गया है।",
  },
};

/**
 * @param {string} text        source text (English, as authored in mockResponses.js)
 * @param {string} targetLang  short language code, e.g. "es", "hi"
 * @returns {Promise<string>}  translated text, or the original if no
 *                              translation is available (fails soft -
 *                              never blocks the chat on a translation miss)
 */
export async function translateText(text, targetLang) {
  if (!text || targetLang === "en") return text;

  // Simulate network latency so the loading/typing UX matches a real
  // translation API call.
  await new Promise((r) => setTimeout(r, 150));

  return PHRASE_DICTIONARY[text]?.[targetLang] ?? text;
}
