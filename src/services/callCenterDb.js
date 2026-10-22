/**
 * Browser IndexedDB Storage Service for Call Center Analytics
 * Full 1-Month Healthcare Dataset (min 100 calls/day = 3,150+ calls)
 * Multilingual Healthcare Transcripts (English, Telugu, Hindi, Tamil, Marathi)
 * Distributed Unknown Callers & Multi-Missed Call Clusters (5-missed, 4-missed, etc.)
 */

const DB_NAME = "HospitalCallCenterDB";
const DB_VERSION = 8;
const STORE_NAME = "calls";

const FIRST_NAMES = [
  "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda",
  "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
  "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa",
  "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra", "Donald", "Ashley",
  "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle",
  "Kenneth", "Dorothy", "Kevin", "Carol", "Brian", "Amanda", "George", "Melissa",
  "Edward", "Deborah", "Ronald", "Stephanie", "Timothy", "Rebecca", "Jason", "Sharon",
  "Jeffrey", "Laura", "Ryan", "Cynthia", "Jacob", "Kathleen", "Gary", "Amy",
  "Nicholas", "Shirley", "Eric", "Angela", "Jonathan", "Helen", "Stephen", "Anna",
  "Larry", "Brenda", "Justin", "Pamela", "Scott", "Nicole", "Brandon", "Emma",
  "Benjamin", "Samantha", "Samuel", "Katherine", "Gregory", "Christine", "Frank", "Debra",
  "Alexander", "Rachel", "Raymond", "Catherine", "Patrick", "Carolyn", "Jack", "Janet",
  "Dennis", "Ruth", "Jerry", "Maria"
];

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
  "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
  "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
  "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
  "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts"
];

const AGENTS = [
  "Robert Smith",
  "Jennifer Davis",
  "Michael Kim",
  "Sarah Lee",
  "David Chen",
  "Emily Watson",
  "Marcus Taylor",
  "Amanda Lewis"
];

const CLINICAL_DEPARTMENTS = [
  "Cardiology",
  "Orthopedics",
  "Pediatrics",
  "Neurology",
  "Emergency Triage",
  "General Medicine",
  "Lab Diagnostics",
  "Vaccination Desk",
  "Oncology Consult",
  "Pulmonology",
  "Nephrology",
  "Gastroenterology"
];

const AUDIO_URLS = [
  "https://cdn.truefilesize.com/mp3/sample-64kbps.mp3",
  "https://cdn.truefilesize.com/mp3/sample-500kb.mp3",
  "https://cdn.truefilesize.com/mp3/sample-1mb.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
];

// Healthcare-only Multilingual Transcripts
export const MULTILINGUAL_TRANSCRIPTS = {
  cardiology: {
    original: [
      { speaker: "Agent", time: "0:04", text: "Hello, good morning! Apple Multispecialty Hospital Cardiology Desk, Jennifer speaking. How can I assist you today?" },
      { speaker: "Patient", time: "0:12", text: "Namaste ma'am, actually stairs climb chesetappudu slight chest tightness and shortness of breath anipistondi. Dr. Sharma ECG and consultation teeskomannaru." },
      { speaker: "Agent", time: "0:25", text: "Haanji sir, bilkul note chesanu. Repu morning 10:30 AM ki Dr. Sharma priority consultation slot and immediate resting ECG available undi. Token reserve cheyamantara?" },
      { speaker: "Patient", time: "0:38", text: "Sure ma'am, that's fine. Fasting stomach tho raavala for ECG?" },
      { speaker: "Agent", time: "0:47", text: "No fasting required for ECG sir. Just previous cardiac lipid reports carry cheyandi. Token CD-104 generate ayyindi, confirmation SMS has been sent." },
    ],
    eng: [
      { speaker: "Agent", time: "0:04", text: "Thank you for calling Apple Multispecialty Hospital Cardiology Desk. How may I assist you today?" },
      { speaker: "Patient", time: "0:12", text: "Hello, I am experiencing mild chest tightness and shortness of breath when walking upstairs. Dr. Sharma asked me to schedule an ECG and consultation." },
      { speaker: "Agent", time: "0:25", text: "I understand your concern. We have priority consultation slots with Dr. Sharma tomorrow at 10:30 AM with an immediate resting ECG. Would you like me to reserve that token?" },
      { speaker: "Patient", time: "0:38", text: "Yes please, that time works well. Should I come on a fasting stomach for the ECG?" },
      { speaker: "Agent", time: "0:47", text: "Fasting is not required for the ECG. Please bring your previous cardiac lipid reports. I have booked token CD-104 and sent your prep SMS." },
    ],
    tel: [
      { speaker: "Agent", time: "0:04", text: "ఆపిల్ మల్టీస్పెషాలిటీ హాస్పిటల్ కార్డియాలజీ విభాగానికి స్వాగతం. నేడు నేను మీకు ఎలా సహాయపడగలను?" },
      { speaker: "Patient", time: "0:12", text: "నమస్తే అండి, మెట్లు ఎక్కినప్పుడు నాకు ఛాతీలో కొద్దిగా భారంగా మరియు ఆయాసంగా అనిపిస్తోంది. డాక్టర్ శర్మ గారు నన్ను ఈసీజీ చేయించుకోమన్నారు." },
      { speaker: "Agent", time: "0:25", text: "మీ ఆందోళన మేము అర్థం చేసుకున్నాము. రేపు ఉదయం 10:30 గంటలకు డాక్టర్ శర్మ గారి వద్ద స్లాట్ ఉంది, వెంటనే ఈసీజీ కూడా చేయిస్తాము. టోకెన్ బుక్ చేయమంటారా?" },
      { speaker: "Patient", time: "0:38", text: "అవునండి, ఆ సమయం బాగుంది. ఈసీజీ పరీక్ష కోసం పరగడుపున రావాలా?" },
      { speaker: "Agent", time: "0:47", text: "ఈసీజీకి పరగడుపున రావాల్సిన అవసరం లేదు. మీ పాత గుండె పరీక్షల రిపోర్టులు తీసుకురండి. టోకెన్ CD-104 బుక్ చేసి ఎస్ఎంఎస్ పంపాము." },
    ],
    hindi: [
      { speaker: "Agent", time: "0:04", text: "एप्पल मल्टीस्पेशलिटी हॉस्पिटल कार्डियोलॉजी विभाग में कॉल करने के लिए धन्यवाद। मैं आपकी क्या सहायता कर सकता हूँ?" },
      { speaker: "Patient", time: "0:12", text: "नमस्ते, सीढ़ियाँ चढ़ते समय मुझे सीने में हल्का भारीपन और सांस फूलने की समस्या हो रही है। डॉ. शर्मा ने ईसीजी और परामर्श का सुझाव दिया था।" },
      { speaker: "Agent", time: "0:25", text: "मैं आपकी स्थिति समझ सकता हूँ। कल सुबह 10:30 बजे डॉ. शर्मा का परामर्श स्लॉट और तत्काल ईसीजी उपलब्ध है। क्या मैं आपका टोकन बुक कर दूँ?" },
      { speaker: "Patient", time: "0:38", text: "जी हाँ, कृपया बुक कर दीजिए। क्या ईसीजी के लिए खाली पेट आना पड़ेगा?" },
      { speaker: "Agent", time: "0:47", text: "ईसीजी के लिए खाली पेट आने की जरूरत नहीं है। कृपया अपनी पुरानी रिपोर्ट साथ लाएं। आपका टोकन CD-104 बुक कर दिया गया है।" },
    ],
    tamil: [
      { speaker: "Agent", time: "0:04", text: "ஆப்பிள் மல்டிஸ்பெஷாலிட்டி மருத்துவமனை இதயவியல் பிரிவுக்கு அழைத்ததற்கு நன்றி. உங்களுக்கு எவ்வாறு உதவ முடியும்?" },
      { speaker: "Patient", time: "0:12", text: "வணக்கம், மாடி ஏறும் போது நெஞ்சுப் பகுதியில் லேசான இறுக்கமும் மூச்சுத் திணறலும் ஏற்படுகிறது. டாக்டர் சர்மா ஈசிஜி எடுக்கச் சொன்னார்." },
      { speaker: "Agent", time: "0:25", text: "நாங்கள் புரிந்துகொள்கிறோம். நாளை காலை 10:30 மணிக்கு டாக்டர் சர்மா அவர்களின் ஆலோசனையும் உடனடி ஈசிஜியும் கிடைக்கும். டோக்கன் பதிவு செய்யட்டுமா?" },
      { speaker: "Patient", time: "0:38", text: "ஆம், பதிவு செய்திடுங்கள். பரிசோதனைக்கு வெறும் வயிற்றில் வர வேண்டுமா?" },
      { speaker: "Agent", time: "0:47", text: "ஈசிஜிக்கு வெறும் வயிறு தேவையில்லை. பழைய மருத்துவ ஆவணங்களை எடுத்து வாருங்கள். டோக்கன் CD-104 பதிவு செய்யப்பட்டு தகவல் அனுப்பப்பட்டுள்ளது." },
    ],
    marathi: [
      { speaker: "Agent", time: "0:04", text: "अॅपल मल्टीस्पेशालिटी हॉस्पिटल कार्डिओलॉजी विभागात कॉल केल्याबद्दल धन्यवाद. आज मी आपली काय मदत करू शकतो?" },
      { speaker: "Patient", time: "0:12", text: "नमस्कार, पायऱ्या चढताना छातीत हलका दाब आणि धाप लागल्यासारखे वाटते. डॉ. शर्मा यांनी मला ईसीजी आणि तपासणीचा सल्ला दिला होता." },
      { speaker: "Agent", time: "0:25", text: "मी आपली अडचण समजू शकतो. उद्या सकाळी 10:30 वाजता डॉ. शर्मा यांच्याकडे तपासणी आणि ईसीजी उपलब्ध आहे. मी टोकन बुक करू का?" },
      { speaker: "Patient", time: "0:38", text: "होय, कृपया बुक करा. चाचणीसाठी उपाशी पोटी यावे लागेल का?" },
      { speaker: "Agent", time: "0:47", text: "ईसीजीसाठी उपाशी राहण्याची आवश्यकता नाही. जुने रिपोर्ट सोबत आणावेत. टोकन CD-104 बुक केले असून एसएमएस पाठवला आहे." },
    ],
  },
  pediatrics: {
    original: [
      { speaker: "Agent", time: "0:03", text: "Apple Hospital Pediatric Center, good afternoon. How may we care for your child today?" },
      { speaker: "Patient", time: "0:10", text: "Hello sister, actually ma 18-month baby girl ki DTaP and MMR booster vaccine due undi. Walk-in allowed ah leka appointment theeskovala?" },
      { speaker: "Agent", time: "0:22", text: "Hello ma'am, waiting time avoid cheyadaniki appointment is recommended. Dr. Anita immunization slots today 3:15 PM open ga unnayi." },
      { speaker: "Patient", time: "0:34", text: "3:15 PM is perfect andi. Along with vaccine, baby height and weight milestone growth check bhi kar sakte hain kya?" },
      { speaker: "Agent", time: "0:44", text: "Haanji bilkul, pediatric milestone tracking routine checkup me include hota hai. Please vaccination card carry karna mat bhooliyega." },
    ],
    eng: [
      { speaker: "Agent", time: "0:03", text: "Apple Hospital Pediatric Center. How may we care for your child today?" },
      { speaker: "Patient", time: "0:10", text: "Hi, my 18-month-old daughter is due for her DTaP and MMR booster doses. Are walk-ins accepted or do I need an appointment?" },
      { speaker: "Agent", time: "0:22", text: "We recommend reserving an appointment to avoid waiting room exposure. Dr. Anita has vaccination slots available today at 3:15 PM." },
      { speaker: "Patient", time: "0:34", text: "3:15 PM works nicely. Can we also have her height and weight milestone growth check done?" },
      { speaker: "Agent", time: "0:44", text: "Absolutely, growth milestone tracking is included with all immunization visits. Please carry her child vaccination booklet." },
    ],
    tel: [
      { speaker: "Agent", time: "0:03", text: "ఆపిల్ హాస్పిటల్ పీడియాట్రిక్ సెంటర్. మీ పాప/బాబు ఆరోగ్య సంరక్షణలో ఎలా సహాయపడగలను?" },
      { speaker: "Patient", time: "0:10", text: "నమస్తే అండి, నా 18 నెలల పాపకు బూస్టర్ వ్యాక్సిన్ వేయించాలి. నేరుగా రావచ్చా లేదా అపాయింట్‌మెంట్ తీసుకోవాలా?" },
      { speaker: "Agent", time: "0:22", text: "చిన్నారులకు వేచి ఉండే సమయం తగ్గించడానికి అపాయింట్‌మెంట్ మంచిది. నేడు మధ్యాహ్నం 3:15 గంటలకు డాక్టర్ అనిత గారి వద్ద స్లాట్ ఉంది." },
      { speaker: "Patient", time: "0:34", text: "3:15 సమయం బాగుంది. పాప ఎత్తు, బరువు పెరుగుదల చెకప్ కూడా చేస్తారా?" },
      { speaker: "Agent", time: "0:44", text: "తప్పకుండా, వ్యాక్సినేషన్‌తో పాటు గ్రోత్ మైల్‌స్టోన్ చెకప్ కూడా చేయబడుతుంది. పాప టీకా కార్డు తీసుకురండి." },
    ],
    hindi: [
      { speaker: "Agent", time: "0:03", text: "एप्पल हॉस्पिटल पीडियाट्रिक केंद्र। आपके बच्चे के स्वास्थ्य के लिए हम क्या सहायता कर सकते हैं?" },
      { speaker: "Patient", time: "0:10", text: "नमस्ते, मेरी 18 महीने की बेटी का बूस्टर टीका लगना बाकी है। क्या बिना अपॉइंटमेंट आ सकते हैं?" },
      { speaker: "Agent", time: "0:22", text: "बच्चों की सुरक्षा के लिए अपॉइंटमेंट लेना बेहतर है। आज दोपहर 3:15 बजे डॉ. अनिता का टीकाकरण स्लॉट उपलब्ध है।" },
      { speaker: "Patient", time: "0:34", text: "3:15 का समय ठीक रहेगा। क्या लंबाई और वजन की भी सामान्य जांच हो जाएगी?" },
      { speaker: "Agent", time: "0:44", text: "हाँ, टीकाकरण के साथ विकास जांच भी शामिल है। कृपया टीकाकरण कार्ड साथ लेकर आएं।" },
    ],
    tamil: [
      { speaker: "Agent", time: "0:03", text: "ஆப்பிள் மருத்துவமனை குழந்தைகள் நலப் பிரிவு. உங்கள் குழந்தையின் நலனுக்கு எவ்வாறு உதவலாம்?" },
      { speaker: "Patient", time: "0:10", text: "வணக்கம், என் 18 மாதக் குழந்தைக்கு தடுப்பூசி போட வேண்டும். முன்பதிவு அவசியமா?" },
      { speaker: "Agent", time: "0:22", text: "குழந்தைகள் காத்திருப்பதைத் தவிர்க்க முன்பதிவு சிறந்தது. இன்று மதியம் 3:15 மணிக்கு டாக்டர் அனிதா அவர்களின் நேரம் உள்ளது." },
      { speaker: "Patient", time: "0:34", text: "3:15 மணி நேரம் நன்றாக இருக்கும். குழந்தையின் எடை மற்றும் உயரம் வளர்ச்சிப் பரிசோதனையும் செய்யப்படுமா?" },
      { speaker: "Agent", time: "0:44", text: "நிச்சயமாக, தடுப்பூசியுடன் வளர்ச்சிப் பரிசோதனையும் செய்யப்படும். குழந்தையின் தடுப்பூசி அட்டையை எடுத்து வாருங்கள்." },
    ],
    marathi: [
      { speaker: "Agent", time: "0:03", text: "अॅपल हॉस्पिटल बालरोग विभाग. आपल्या बाळाच्या आरोग्यसेवेसाठी आम्ही कशी मदत करू शकतो?" },
      { speaker: "Patient", time: "0:10", text: "नमस्कार, माझ्या १८ महिन्यांच्या मुलीला बुस्टर लस द्यायची आहे. थेट येता येईल की अपॉइंटमेंट हवी?" },
      { speaker: "Agent", time: "0:22", text: "बाळाला जास्त थांबावे लागू नये म्हणून अपॉइंटमेंट उत्तम राहील. आज दुपारी ३:१५ वाजता डॉ. अनिता यांच्याकडे स्लॉट उपलब्ध आहे." },
      { speaker: "Patient", time: "0:34", text: "३:१५ ची वेळ सोयीची आहे. बाळाची उंची आणि वजनाची तपासणी सुद्धा होईल का?" },
      { speaker: "Agent", time: "0:44", text: "नक्कीच, लसीकरणासोबत बाळाची वाढ तपासणी केली जाईल. लसीकरण कार्ड सोबत आणावे." },
    ],
  },
  orthopedics: {
    original: [
      { speaker: "Agent", time: "0:04", text: "Good morning, Apple Hospital Orthopedic Care. How may I direct your inquiry?" },
      { speaker: "Patient", time: "0:12", text: "Hello, actually morning tennis aaduthu kindha paddanu. Right knee severely swollen and bending restriction undi. Dr. Jenkins 1.5T MRI review check cheyali." },
      { speaker: "Agent", time: "0:24", text: "Haanji sir, samajh gaya. Today evening 4:30 PM Dr. Jenkins OPD slot undi, and 3:30 PM radiology lo knee MRI scan scheduled. Slot confirm cheyamantara?" },
      { speaker: "Patient", time: "0:36", text: "Yes please confirm kardo. Hamara cashless health insurance same-day diagnostic imaging cover karta hai kya?" },
      { speaker: "Agent", time: "0:46", text: "Yes sir, hamara insurance desk spot pre-authorization process kar dega. Please carry health policy card and government ID." },
    ],
    eng: [
      { speaker: "Agent", time: "0:04", text: "Apple Hospital Orthopedic Care. How may I direct your inquiry?" },
      { speaker: "Patient", time: "0:12", text: "Hello, I fell while playing tennis and my right knee is swollen with restricted bending. Dr. Jenkins requested a 1.5T MRI review." },
      { speaker: "Agent", time: "0:24", text: "We have an emergency orthopedic slot with Dr. Jenkins today at 4:30 PM. Our radiology department can perform the knee MRI at 3:30 PM." },
      { speaker: "Patient", time: "0:36", text: "That is wonderful. Does my cashless health insurance cover the same-day diagnostic imaging?" },
      { speaker: "Agent", time: "0:46", text: "Yes, our insurance desk handles instant pre-authorization. Please bring your health policy ID card and government ID." },
    ],
    tel: [
      { speaker: "Agent", time: "0:04", text: "ఆపిల్ హాస్పిటల్ ఆర్థోపెడిక్ విభాగం. మీ ఎముకలు మరియు కీళ్ళ ఆరోగ్య సమస్యలకు ఎలా సహాయపడగలను?" },
      { speaker: "Patient", time: "0:12", text: "నమస్తే, ఆటలో పడిపోవడం వల్ల నా కుడి మోకాలి వాపు వచ్చింది, వంచడం కష్టంగా ఉంది. డాక్టర్ జెంకిన్స్ గారు ఎంఆర్ఐ రివ్యూ కోరారు." },
      { speaker: "Agent", time: "0:24", text: "నేడు సాయంత్రం 4:30 గంటలకు డాక్టర్ జెంకిన్స్ గారి స్లాట్ ఉంది. 3:30 గంటలకు మా రేడియాలజీలో మోకాలి ఎంఆర్ఐ పరీక్ష కూడా పూర్తి చేసుకోవచ్చు." },
      { speaker: "Patient", time: "0:36", text: "చాలా సంతోషం. నా ఆరోగ్య బీమా క్యాష్‌లెస్ విధానంలో ఈ పరీక్షకు వర్తిస్తుందా?" },
      { speaker: "Agent", time: "0:46", text: "అవునండి, మా ఇన్సూరెన్స్ డెస్క్ తక్షణ అనుమతి ప్రక్రియను చూసుకుంటుంది. మీ బీమా కార్డు మరియు ఆధార్ వెంట తీసుకురండి." },
    ],
    hindi: [
      { speaker: "Agent", time: "0:04", text: "एप्पल हॉस्पिटल ऑर्थोपेडिक विभाग। मैं आपकी क्या सहायता कर सकता हूँ?" },
      { speaker: "Patient", time: "0:12", text: "नमस्ते, खेलते समय गिरने से मेरे दाहिने घुटने में सूजन आ गई है। डॉ. जेंकिन्स ने 1.5T एमआरआई समीक्षा के लिए कहा है।" },
      { speaker: "Agent", time: "0:24", text: "आज शाम 4:30 बजे डॉ. जेंकिन्स का परामर्श स्लॉट और दोपहर 3:30 बजे एमआरआई टेस्ट उपलब्ध है।" },
      { speaker: "Patient", time: "0:36", text: "बहुत अच्छा। क्या मेरा कैशलेस स्वास्थ्य बीमा आज के टेस्ट को कवर करेगा?" },
      { speaker: "Agent", time: "0:46", text: "जी हाँ, हमारा बीमा डेस्क तुरंत प्री-ऑथराइजेशन की सुविधा देता है। कृपया अपना बीमा कार्ड साथ लाएं।" },
    ],
    tamil: [
      { speaker: "Agent", time: "0:04", text: "ஆப்பிள் மருத்துவமனை எலும்பியல் பிரிவு. தங்களுக்கு எவ்வாறு உதவலாம்?" },
      { speaker: "Patient", time: "0:12", text: "வணக்கம், விளையாடும்போது கீழே விழுந்ததால் வலது முழங்காலில் வீக்கம் ஏற்பட்டுள்ளது. டாக்டர் ஜென்கின்ஸ் எம்ஆர்ஐ பரிசோதனைக்கு வரச் சொன்னார்." },
      { speaker: "Agent", time: "0:24", text: "இன்று மாலை 4:30 மணிக்கு மருத்துவ ஆலோசனை மற்றும் 3:30 மணிக்கு எம்ஆர்ஐ பரிசோதனைக்கு நேரம் ஒதுக்கப்பட்டுள்ளது." },
      { speaker: "Patient", time: "0:36", text: "மிக்க மகிழ்ச்சி. எனது பணமில்லா மருத்துவக் காப்பீடு இந்த பரிசோதனைக்கு பொருந்துமா?" },
      { speaker: "Agent", time: "0:46", text: "ஆம், எங்கள் காப்பீட்டுப் பிரிவு உடனடி அனுமதியை வழங்கும். உங்கள் காப்பீட்டு அட்டையைக் கொண்டு வாருங்கள்." },
    ],
    marathi: [
      { speaker: "Agent", time: "0:04", text: "अॅपल हॉस्पिटल अस्थिरोग विभाग. मी आपली काय मदत करू शकतो?" },
      { speaker: "Patient", time: "0:12", text: "नमस्कार, खेळताना पडल्यामुळे माझ्या उजव्या गुडघ्याला सूज आली आहे. डॉ. जेन्किन्स यांनी एमआरआय तपासणी करण्यास सांगितले आहे." },
      { speaker: "Agent", time: "0:24", text: "आज संध्याकाळी 4:30 वाजता डॉ. जेन्किन्स यांच्याकडे वेळ आहे आणि 3:30 वाजता एमआरआय चाचणी केली जाईल." },
      { speaker: "Patient", time: "0:36", text: "खूप छान. माझा कॅशलेस आरोग्य विमा या चाचणीसाठी लागू होईल का?" },
      { speaker: "Agent", time: "0:46", text: "होय, आमचा विमा विभाग त्वरित मंजुरीची प्रक्रिया पूर्ण करेल. आपले विमा कार्ड सोबत आणावे." },
    ],
  },
};

// Healthcare Clinical Summaries & AI Coaching
const CLINICAL_SUMMARIES = [
  "Inbound consultation inquiry regarding outpatient appointment schedule, cardiologist availability, and pre-op insurance coverage.",
  "Inquiry regarding cardiac follow-up visit timings, resting ECG preparation, and blood pressure monitoring chart review.",
  "Parent seeking pediatric immunization slots for infant 18-month DTaP/MMR vaccine schedule and growth milestone assessment.",
  "Patient requested orthopedic consultation for sports knee ligament sprain and same-day 1.5T MRI scanner pre-authorization.",
  "Outpatient inquiry regarding fasting blood glucose, HbA1c diabetic profile diagnostics, and endocrinology consultation timings.",
  "Post-laparoscopic cholecystectomy patient inquiring about wound dressing inspection, dietary transition, and surgeon follow-up.",
  "Caller inquiring about neurological migraine specialist availability, EEG appointment slots, and cashless insurance empanelment.",
  "Inbound triage call regarding seasonal acute bronchospasm symptoms, nebulization therapy queue status, and pulmonologist OPD.",
];

const CLINICAL_COACHING = [
  [
    "Confirm patient allergy history and current antiplatelet/blood thinner medications before scheduling contrast imaging.",
    "Proactively offer immediate emergency department triage referral if acute radiating chest pressure develops.",
  ],
  [
    "Reiterate pediatric vaccination booklet checklist and emphasize post-vaccine fever management instructions.",
    "Ensure parent is registered on the Apple Hospital Patient Portal for automatic milestone growth chart sync.",
  ],
  [
    "Clarify cashless insurance pre-authorization documentation requirements early in the intake workflow.",
    "Schedule mobility assistance and ground-floor transit for acute knee injury outpatients upon arrival.",
  ],
  [
    "Confirm fasting duration guidelines clearly for diabetic lipid profile and renal function blood draws.",
    "Offer digital tele-consultation follow-up for elderly diabetic outpatients requiring routine insulin titration.",
  ],
];

// Multi-missed call repeating phone numbers across the month
const REPEAT_MISSED_CLUSTERS = [
  { phone: "+1 (650) 555-4321", count: 5, name: "David Chen", tag: "Cardiology" },
  { phone: "+1 (415) 555-0188", count: 4, name: "Unknown Caller", tag: "Emergency Triage" },
  { phone: "+1 (206) 555-8901", count: 3, name: "Alex Turner", tag: "Orthopedics" },
  { phone: "+1 (312) 555-0144", count: 2, name: "Unknown Caller", tag: "General Medicine" },
  { phone: "+1 (512) 555-3456", count: 2, name: "Maria Garcia", tag: "Pediatrics" },
  { phone: "+1 (408) 555-0199", count: 5, name: "Unknown Caller", tag: "Pulmonology" },
  { phone: "+1 (702) 555-7812", count: 3, name: "Robert Taylor", tag: "Neurology" },
  { phone: "+1 (832) 555-0177", count: 4, name: "Unknown Caller", tag: "OPD Booking" },
];

/**
 * Generate 30 days of realistic hospital call center data
 * Minimum 100 calls per day (total 3,150+ calls)
 * Includes Unknown Callers distributed across the entire month,
 * Varied multi-missed counts (5-missed, 4-missed, 3-missed, 2-missed, 1-missed),
 * Varied scores across ranges (0-20, 21-40, 41-60, 61-80, 81-100),
 * Multilingual Healthcare Transcripts.
 */
export function generateOneMonthCalls() {
  const calls = [];
  const now = new Date();

  // 30 days back from today (Day 0 = Today, Day 1 = Yesterday, etc.)
  for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
    const dayDate = new Date(now);
    dayDate.setDate(now.getDate() - dayOffset);

    const year = dayDate.getFullYear();
    const monthStr = String(dayDate.getMonth() + 1).padStart(2, "0");
    const dayStr = String(dayDate.getDate()).padStart(2, "0");
    const isoDate = `${year}-${monthStr}-${dayStr}`;
    const displayDate = dayDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    // Min 100 calls per day (between 102 and 112 calls/day)
    const callsForToday = 102 + ((dayOffset * 7) % 11);

    for (let c = 1; c <= callsForToday; c++) {
      const callNum = String(c).padStart(3, "0");
      const id = `call-${isoDate}-${callNum}`;

      const fName = FIRST_NAMES[(dayOffset * 17 + c * 13) % FIRST_NAMES.length];
      const lName = LAST_NAMES[(dayOffset * 23 + c * 19) % LAST_NAMES.length];
      let name = `${fName} ${lName}`;

      let phone = `+1 (${200 + ((dayOffset * 31 + c * 7) % 700)}) ${200 + ((dayOffset * 19 + c * 29) % 700)}-${1000 + ((dayOffset * 43 + c * 37) % 9000)}`;

      const agent = AGENTS[(dayOffset + c) % AGENTS.length];
      let department = CLINICAL_DEPARTMENTS[(c * 3 + dayOffset) % CLINICAL_DEPARTMENTS.length];

      // Unknown caller distributed across entire month (approx 10-12% of calls)
      const isUnknownCaller = (c % 9 === 0) || (c % 23 === 0);
      if (isUnknownCaller) {
        name = "Unknown Caller";
      }

      // ~18% missed calls, ~82% answered calls
      const isMissed = (c % 5 === 0) || (c % 17 === 0);
      const status = isMissed ? "missed" : "answered";

      // Repeating phone numbers for multi-missed call counts (5 missed, 4 missed, 3 missed, 2 missed)
      if (isMissed && (c % 3 === 0)) {
        const cluster = REPEAT_MISSED_CLUSTERS[(c + dayOffset) % REPEAT_MISSED_CLUSTERS.length];
        phone = cluster.phone;
        department = cluster.tag;
        if (cluster.name !== "Unknown Caller" && !isUnknownCaller) {
          name = cluster.name;
        }
      }

      // Time of call between 8:00 AM and 7:59 PM
      const hour24 = 8 + Math.floor((c * 12) / callsForToday);
      const minute = ((c * 7) % 60);
      const hour12 = hour24 > 12 ? hour24 - 12 : hour24;
      const ampm = hour24 >= 12 ? "PM" : "AM";
      const timeStr = `${hour12}:${String(minute).padStart(2, "0")} ${ampm}`;

      const deptKey = department === "Pediatrics" ? "pediatrics" : department === "Orthopedics" ? "orthopedics" : "cardiology";
      const multilingualTranscript = MULTILINGUAL_TRANSCRIPTS[deptKey] || MULTILINGUAL_TRANSCRIPTS.cardiology;
      const summary = CLINICAL_SUMMARIES[(c + dayOffset) % CLINICAL_SUMMARIES.length];
      const coaching = CLINICAL_COACHING[(c + dayOffset) % CLINICAL_COACHING.length];

      // Patient age and gender
      let age = "";
      let ageYears = "";
      let ageMonths = "";
      let ageDays = "";
      let gender = (c % 2 === 0) ? "Female" : "Male";
      if (!isUnknownCaller) {
        if (department === "Pediatrics") {
          age = 2 + (c % 14);
        } else if (department === "Cardiology") {
          age = 42 + (c % 35);
        } else if (department === "Orthopedics") {
          age = 26 + (c % 45);
        } else {
          age = 24 + (c % 50);
        }
        ageYears = age;
        if (c % 4 === 0 && age < 10) {
          ageMonths = (c % 11) + 1;
        }
        if (c % 6 === 0 && age < 3) {
          ageDays = (c % 20) + 5;
        }
      } else {
        gender = "";
      }

      if (isMissed) {
        calls.push({
          id,
          name,
          phone,
          age,
          ageYears,
          ageMonths,
          ageDays,
          gender,
          agent,
          status: "missed",
          date: isoDate,
          displayDate,
          time: timeStr,
          duration: "00:00:00",
          durationSeconds: 0,
          score: (c % 7 === 0) ? 12 : 0, // Score in 0-20 bracket for missed calls
          outcome: "Missed Call",
          sentiment: "Neutral",
          tag: `${department} (Missed)`,
          audioUrl: "",
          transcripts: multilingualTranscript,
          summary: name === "Unknown Caller"
            ? `Inbound triage call from unidentified caller at ${phone}. No caller ID profile registered in hospital EMR. Requires front-desk callback to register patient.`
            : `Inbound triage call from patient ${name} was unanswered after 6 rings during peak OPD queue. High-priority callback scheduled.`,
          highlights: [
            `Patient called seeking ${department.toLowerCase()} appointment assistance.`,
            "Automated voicemail registered caller ID and hospital route.",
            "Requires immediate front-desk callback within 2 hours.",
          ],
          improvements: [
            "Route overflow triage lines to backup reception during rush hours.",
            "Ensure missed call SMS auto-responder sends instant token booking link.",
          ],
        });
      } else {
        const durationSec = 50 + ((c * 19 + dayOffset * 7) % 190);
        const mins = Math.floor(durationSec / 60);
        const secs = durationSec % 60;
        const duration = `00:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

        // Distribute scores across all ranges: 21-40, 41-60, 61-80, 81-100
        let score = 85;
        if (c % 11 === 0) {
          score = 34 + (c % 7); // 21-40 range (Low)
        } else if (c % 7 === 0) {
          score = 52 + (c % 9); // 41-60 range (Fair)
        } else if (c % 4 === 0) {
          score = 72 + (c % 8); // 61-80 range (Good)
        } else {
          score = 86 + (c % 12); // 81-100 range (Excellent)
        }

        let outcome = "Follow up";
        let sentiment = "Neutral";
        if (score >= 82) {
          outcome = "Interested";
          sentiment = "Positive";
        } else if (score < 55) {
          outcome = "Not interested";
          sentiment = "Negative";
        }

        let appt = null;
        let finalSummary = summary;
        if (outcome === "Interested") {
          const doc = department === "Pediatrics" ? "Dr. Anita - Senior Pediatrician"
            : department === "Orthopedics" ? "Dr. Jenkins - Orthopedic Specialist"
            : department === "Neurology" ? "Dr. Rajeshwar - Neurology Head"
            : department === "Cardiology" ? "Dr. Sharma - Chief Cardiologist"
            : "Dr. Priya - General Physician";
          const slot = ["09:30 AM", "10:30 AM", "11:45 AM", "02:30 PM", "04:15 PM"][c % 5];
          const mode = c % 3 === 0 ? "Video Tele-Consultation" : "In-Person Hospital OPD";
          const refNum = `APH-${600000 + ((c * 17) % 399999)}`;
          const remarks = `Scheduled clinical evaluation in ${department.toLowerCase()}. Fasting lab test preparation instructions issued.`;
          appt = {
            refNumber: refNum,
            doctor: doc,
            date: displayDate,
            time: slot,
            mode,
            remarks,
            status: "confirmed",
            bookedAt: timeStr,
            smsSent: true,
            whatsappSent: true,
          };
          finalSummary = `${summary} [Appointment Booked: Ref #${refNum} with ${doc.split(" - ")[0]} on ${displayDate} at ${slot} (${mode}) - Remarks: ${remarks}].`;
        }

        const audioUrl = AUDIO_URLS[(c + dayOffset) % AUDIO_URLS.length];

        calls.push({
          id,
          name,
          phone,
          age,
          ageYears,
          ageMonths,
          ageDays,
          gender,
          agent,
          status: "answered",
          date: isoDate,
          displayDate,
          time: timeStr,
          duration,
          durationSeconds: durationSec,
          score,
          outcome,
          sentiment,
          tag: department,
          audioUrl,
          transcripts: multilingualTranscript,
          summary: finalSummary,
          appointment: appt,
          highlights: [
            `Confirmed ${department.toLowerCase()} consultation protocol and specialist doctor timings.`,
            "Addressed insurance cashless pre-authorization and patient onboarding questions.",
            "Clear clinical action plan outlined and verified with the patient.",
          ],
          improvements: coaching,
        });
      }
    }
  }

  return calls;
}

// Generate the initial dataset (30 days * ~105 calls = ~3,150 calls)
export const SEED_CALLS = generateOneMonthCalls();

/**
 * Open IndexedDB database and initialize schema
 */
export function openCallCenterDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("IndexedDB is not supported by this browser."));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (db.objectStoreNames.contains(STORE_NAME)) {
        db.deleteObjectStore(STORE_NAME);
      }
      const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
      store.createIndex("status", "status", { unique: false });
      store.createIndex("date", "date", { unique: false });
      store.createIndex("agent", "agent", { unique: false });
      store.createIndex("outcome", "outcome", { unique: false });
      store.createIndex("score", "score", { unique: false });
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error || new Error("Failed to open IndexedDB"));
    };
  });
}

/**
 * Seed database with full 1-month 100+ calls/day dataset if empty or outdated
 */
export async function seedCallCenterDBIfEmpty() {
  try {
    const db = await openCallCenterDB();
    const count = await getCallCount(db);
    let needsReseed = count < 2000;
    if (!needsReseed) {
      // Check if seeded calls have appointment data
      const sample = await new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const req = store.openCursor();
        req.onsuccess = (e) => {
          const cursor = e.target.result;
          if (cursor) {
            if (cursor.value.outcome === "Interested") {
              resolve(cursor.value.appointment);
              return;
            }
            cursor.continue();
          } else {
            resolve(null);
          }
        };
        req.onerror = () => resolve(null);
      });
      if (!sample) {
        needsReseed = true;
      }
    }

    if (needsReseed) {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      store.clear();
      for (const call of SEED_CALLS) {
        store.put(call);
      }
      await new Promise((resolve, reject) => {
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      });
    }
  } catch (err) {
    console.warn("IndexedDB seed error:", err);
  }
}

/**
 * Get call count in store
 */
function getCallCount(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const countReq = store.count();
    countReq.onsuccess = () => resolve(countReq.result);
    countReq.onerror = () => reject(countReq.error);
  });
}

/**
 * Get all calls from IndexedDB
 */
export async function getAllCallsFromDB() {
  try {
    await seedCallCenterDBIfEmpty();
    const db = await openCallCenterDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || SEED_CALLS);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("Failed to load calls from IndexedDB, falling back to seed data:", err);
    return SEED_CALLS;
  }
}

/**
 * Add or update a call in IndexedDB
 */
export async function addCallToDB(newCall) {
  return updateCallInDB(newCall);
}

/**
 * Update a call in IndexedDB (e.g. updating patient details, notes, or callback)
 */
export async function updateCallInDB(updatedCall) {
  try {
    const db = await openCallCenterDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(updatedCall);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("Failed to update call in IndexedDB:", err);
    return false;
  }
}

/**
 * Calculate KPI metrics from calls dataset
 */
export function calculateCallMetrics(calls) {
  const totalCalls = calls.length;
  const answeredCalls = calls.filter((c) => c.status === "answered").length;
  const missedCalls = calls.filter((c) => c.status === "missed").length;

  const scoredCalls = calls.filter((c) => c.status === "answered" && typeof c.score === "number" && c.score > 0);
  const avgScore = scoredCalls.length > 0
    ? Math.round(scoredCalls.reduce((acc, c) => acc + c.score, 0) / scoredCalls.length)
    : 78;

  const convertedCalls = calls.filter((c) => c.outcome === "Interested").length;
  const conversionRate = answeredCalls > 0
    ? Math.round((convertedCalls / answeredCalls) * 100)
    : 0;

  const coachingOpportunities = calls.filter(
    (c) => (c.status === "answered" && c.score < 75) || (c.improvements && c.improvements.length > 0)
  ).length;

  return {
    totalCalls,
    answeredCalls,
    missedCalls,
    avgScore,
    conversionRate,
    coachingOpportunities,
  };
}

/**
 * Export calls to CSV and trigger browser download
 */
export function exportCallsToCSV(calls, filename = "hospital-calls-report.csv") {
  const headers = [
    "Call ID",
    "Contact Name",
    "Phone",
    "Agent",
    "Status",
    "Date",
    "Time",
    "Duration",
    "Quality Score",
    "Outcome",
    "Sentiment",
    "Department",
    "Summary",
  ];

  const rows = calls.map((c) => [
    `"${c.id || ""}"`,
    `"${c.name || ""}"`,
    `"${c.phone || ""}"`,
    `"${c.agent || ""}"`,
    `"${c.status || "answered"}"`,
    `"${c.displayDate || c.date || ""}"`,
    `"${c.time || ""}"`,
    `"${c.duration || ""}"`,
    c.score ?? "",
    `"${c.outcome || ""}"`,
    `"${c.sentiment || ""}"`,
    `"${c.tag || ""}"`,
    `"${(c.summary || "").replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
