import { hospitalDb } from "./hospitalDb.js";

/**
 * Default Admin Configuration for Prescription Sections
 */
export const INITIAL_ADMIN_CONFIG = [
  {
    sectionKey: "chief_complaints",
    label: "Chief Complaints",
    isMandatory: true,
    isEnabled: true,
  },
  {
    sectionKey: "vitals",
    label: "Vitals Monitoring",
    isMandatory: true,
    isEnabled: true,
  },
  {
    sectionKey: "allergies",
    label: "Allergy Status",
    isMandatory: true,
    isEnabled: true,
  },
  {
    sectionKey: "diagnosis",
    label: "Provisional/Final Diagnosis",
    isMandatory: true,
    isEnabled: true,
  },
  {
    sectionKey: "medications",
    label: "Medications (Rx)",
    isMandatory: true,
    isEnabled: true,
  },
  {
    sectionKey: "investigations",
    label: "Lab Investigations",
    isMandatory: false,
    isEnabled: true,
  },
  {
    sectionKey: "diet_advice",
    label: "Dietary & Lifestyle Advice",
    isMandatory: false,
    isEnabled: true,
  },
  {
    sectionKey: "follow_up",
    label: "Follow-up / Review Timeline",
    isMandatory: true,
    isEnabled: true,
  },
  {
    sectionKey: "referral_admit",
    label: "Referral / IPD Admission",
    isMandatory: false,
    isEnabled: true,
  },
];

/**
 * Seed Custom Dictionary Shortcuts for Quick Clinical Autocomplete
 */
export const INITIAL_CUSTOM_DICTIONARY = [
  {
    id: "dict_1",
    shortcut: "pcm",
    expansion: "Tab. Paracetamol 650mg",
    category: "medication",
  },
  {
    id: "dict_2",
    shortcut: "amox",
    expansion: "Cap. Amoxicillin 500mg",
    category: "medication",
  },
  {
    id: "dict_3",
    shortcut: "htn",
    expansion: "Essential Hypertension",
    category: "diagnosis",
  },
  {
    id: "dict_4",
    shortcut: "t2dm",
    expansion: "Type 2 Diabetes Mellitus",
    category: "diagnosis",
  },
  {
    id: "dict_5",
    shortcut: "od-pc",
    expansion: "Once daily after food",
    category: "instruction",
  },
  {
    id: "dict_6",
    shortcut: "bd-pc",
    expansion: "Twice daily after food (Morning & Night)",
    category: "instruction",
  },
  {
    id: "dict_7",
    shortcut: "pantop",
    expansion: "Tab. Pantoprazole 40mg",
    category: "medication",
  },
  {
    id: "dict_8",
    shortcut: "sos",
    expansion: "As needed during severe distress",
    category: "instruction",
  },
  {
    id: "dict_9",
    shortcut: "cbc",
    expansion: "Complete Blood Count (CBC)",
    category: "investigation",
  },
];

/**
 * Standard Doctor Credentials used across consultations
 */
export const DEFAULT_DOCTOR_DETAILS = {
  name: "Dr. Rajesh Sharma, MD",
  regNo: "NMC-48291",
  department: "General Medicine",
};

/**
 * Seed Patients Data
 * Covering all patient categories, clinical states, and queue statuses.
 */
export const INITIAL_PATIENTS = [
  {
    id: "pat_10482",
    uhid: "UHID-10482",
    tokenNumber: "#W-04",
    name: "Anita Verma",
    age: 28,
    gender: "Female",
    bloodGroup: "B+",
    phone: "+91 98765 43210",
    isPregnant: true,
    pregnancyDetails: {
      trimester: "2nd",
      gestationalWeeks: 22,
      edd: "2027-02-24",
    },
    isHandicapped: false,
    allergies: ["Penicillin (Severe)"],
    vitals: {
      bp: "110/70",
      pulse: 82,
      temp: 98.4,
      spo2: 99,
      weight: 58,
      bmi: 22.5,
    },
    queueStatus: "in_consultation",
    consultationType: "walk_in",
    visitType: "new",
    priority: "urgent",
    chiefComplaintSummary: "Severe morning nausea and epigastric burning x 4 days",
    scheduledTime: "09:45 AM",
    consultationStartTime: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
  },
  {
    id: "pat_10483",
    uhid: "UHID-10483",
    tokenNumber: "#W-05",
    name: "Vikram Singh",
    age: 45,
    gender: "Male",
    bloodGroup: "O+",
    phone: "+91 98234 56789",
    isPregnant: false,
    pregnancyDetails: null,
    isHandicapped: false,
    allergies: ["NKDA"],
    vitals: {
      bp: "124/82",
      pulse: 74,
      temp: 98.6,
      spo2: 98,
      weight: 72,
      bmi: 24.2,
    },
    queueStatus: "waiting",
    consultationType: "walk_in",
    visitType: "follow_up",
    priority: "normal",
    chiefComplaintSummary: "Post-Typhoid recovery follow-up, mild generalized fatigue",
    scheduledTime: "10:15 AM",
    consultationStartTime: null,
  },
  {
    id: "pat_10484",
    uhid: "UHID-10484",
    tokenNumber: "#ON-12",
    name: "Rajesh Patel",
    age: 54,
    gender: "Male",
    bloodGroup: "A+",
    phone: "+91 97123 45678",
    isPregnant: false,
    pregnancyDetails: null,
    isHandicapped: false,
    allergies: ["Sulfa"],
    vitals: {
      bp: "150/95",
      pulse: 88,
      temp: 98.2,
      spo2: 97,
      weight: 84,
      bmi: 28.7,
    },
    queueStatus: "waiting",
    consultationType: "online_booking",
    visitType: "new",
    priority: "urgent",
    chiefComplaintSummary: "Routine diabetic checkup, blurred vision",
    scheduledTime: "10:30 AM",
    consultationStartTime: null,
  },
  {
    id: "pat_10485",
    uhid: "UHID-10485",
    tokenNumber: "#TC-02",
    name: "Sunita Devi",
    age: 62,
    gender: "Female",
    bloodGroup: "B-",
    phone: "+91 94567 89012",
    isPregnant: false,
    pregnancyDetails: null,
    isHandicapped: true,
    allergies: ["Aspirin", "Ibuprofen (GI bleed)"],
    vitals: {
      bp: "132/84",
      pulse: 76,
      temp: 98.0,
      spo2: 98,
      weight: 66,
      bmi: 26.1,
    },
    queueStatus: "waiting",
    consultationType: "tele_consultation",
    visitType: "follow_up",
    priority: "senior",
    chiefComplaintSummary: "Chronic osteoarthritis right knee pain",
    scheduledTime: "11:00 AM",
    consultationStartTime: null,
  },
  {
    id: "pat_10481",
    uhid: "UHID-10481",
    tokenNumber: "#W-01",
    name: "Rahul Roy",
    age: 35,
    gender: "Male",
    bloodGroup: "AB+",
    phone: "+91 91234 56780",
    isPregnant: false,
    pregnancyDetails: null,
    isHandicapped: false,
    allergies: ["NKDA"],
    vitals: {
      bp: "118/76",
      pulse: 80,
      temp: 100.2,
      spo2: 98,
      weight: 68,
      bmi: 23.0,
    },
    queueStatus: "draft_labs",
    consultationType: "walk_in",
    visitType: "new",
    priority: "normal",
    chiefComplaintSummary: "Right upper quadrant abdominal pain and low grade fever x 3 days",
    scheduledTime: "09:15 AM",
    consultationStartTime: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
  },
  {
    id: "pat_10480",
    uhid: "UHID-10480",
    tokenNumber: "#W-02",
    name: "Priya Das",
    age: 24,
    gender: "Female",
    bloodGroup: "O-",
    phone: "+91 93456 78901",
    isPregnant: false,
    pregnancyDetails: null,
    isHandicapped: false,
    allergies: ["NKDA"],
    vitals: {
      bp: "116/74",
      pulse: 72,
      temp: 98.6,
      spo2: 99,
      weight: 54,
      bmi: 20.8,
    },
    queueStatus: "completed",
    consultationType: "walk_in",
    visitType: "new",
    priority: "normal",
    chiefComplaintSummary: "Acute allergic rhinoconjunctivitis, sneezing, watery eyes x 5 days",
    scheduledTime: "09:30 AM",
    consultationStartTime: new Date(Date.now() - 85 * 60 * 1000).toISOString(),
  },
];

/**
 * Seed Prescriptions Data
 * Realistic clinical records linked to patients by patientId
 */
export const INITIAL_PRESCRIPTIONS = [
  // 1. In-Consultation active draft for Anita Verma (pat_10482)
  {
    id: "rx_10482",
    patientId: "pat_10482",
    status: "draft",
    isFinalized: false,
    chiefComplaints: [
      {
        id: "cc_101",
        complaint: "Severe morning nausea and persistent vomiting",
        duration: 4,
        durationUnit: "Days",
        severity: "Severe",
        bodyPartId: "GI",
      },
      {
        id: "cc_102",
        complaint: "Burning epigastric discomfort, retrosternal heartburn",
        duration: 4,
        durationUnit: "Days",
        severity: "Moderate",
        bodyPartId: "GI",
      },
    ],
    clinicalObservations:
      "Patient is 22 weeks gravid. Epigastric tenderness on palpation, no rebound or guarding. Mucous membranes slightly dry. Fetal heart sounds audible and rhythmic.",
    diagnosis: {
      provisional: "Hyperemesis Gravidarum with Acute Reflux Gastritis",
      final: "",
      icd10Code: "O21.0",
    },
    medications: [
      {
        id: "med_101",
        drugName: "Tab. Doxylamine + Pyridoxine",
        genericName: "Doxylamine Succinate 10mg + Pyridoxine HCl 10mg",
        form: "Tablet",
        dosage: "10mg/10mg",
        frequency: "0-0-1",
        timing: "Before Food",
        durationDays: 14,
        totalQuantity: 14,
        instructions: "Take 1 tablet at bedtime for morning nausea control.",
      },
      {
        id: "med_102",
        drugName: "Sucralfate Oral Suspension",
        genericName: "Sucralfate 1g / 10ml",
        form: "Syrup",
        dosage: "10ml",
        frequency: "1-0-1",
        timing: "Empty Stomach",
        durationDays: 7,
        totalQuantity: 1,
        instructions: "Take 10ml 1 hour before morning breakfast and dinner.",
      },
    ],
    investigationsOrdered: [
      {
        testName: "Urine Routine & Ketones",
        category: "Urine",
        status: "ordered",
      },
      {
        testName: "Serum Electrolytes (Na+, K+, Cl-)",
        category: "Blood",
        status: "ordered",
      },
      {
        testName: "Obstetric Ultrasound (Fetal Wellbeing)",
        category: "Radiology",
        status: "ordered",
      },
    ],
    dietaryAdvice:
      "Eat small, dry, bland meals (crackers, toast). Avoid spicy, fried, or acidic foods. Keep hydrated by sipping cold electrolyte or tender coconut water between meals.",
    referrals: {
      department: "Obstetrics & Gynecology",
      doctorName: "Dr. Sunita Kulkarni, MS (OBGYN)",
      reason: "Antenatal review for hyperemesis management in 2nd trimester.",
    },
    isAdmitRecommended: false,
    followUp: {
      timeline: "1 Week",
      date: "2026-10-29",
      notes: "Review with urine ketone and electrolyte results; seek emergency care if intractable vomiting occurs.",
    },
    doctorDetails: DEFAULT_DOCTOR_DETAILS,
    createdAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
  },

  // 2. Draft awaiting labs for Rahul Roy (pat_10481)
  {
    id: "rx_10481",
    patientId: "pat_10481",
    status: "awaiting_labs",
    isFinalized: false,
    chiefComplaints: [
      {
        id: "cc_201",
        complaint: "Right upper quadrant abdominal pain",
        duration: 3,
        durationUnit: "Days",
        severity: "Moderate",
        bodyPartId: "Abdomen",
      },
      {
        id: "cc_202",
        complaint: "Low grade evening fever with chills",
        duration: 3,
        durationUnit: "Days",
        severity: "Mild",
        bodyPartId: "General",
      },
    ],
    clinicalObservations:
      "Tenderness in right upper quadrant, Murphy sign positive on deep inspiration. Mild scleral icterus observed under natural light. Abdomen soft, no ascites.",
    diagnosis: {
      provisional: "Acute Cholecystitis vs Acute Viral Hepatitis",
      final: "",
      icd10Code: "K81.0",
    },
    medications: [
      {
        id: "med_201",
        drugName: "Tab. Drotaverine 80mg",
        genericName: "Drotaverine HCl 80mg",
        form: "Tablet",
        dosage: "80mg",
        frequency: "SOS",
        timing: "After Food",
        durationDays: 3,
        totalQuantity: 6,
        instructions: "Take 1 tablet only for acute spasmodic abdominal pain.",
      },
      {
        id: "med_202",
        drugName: "Tab. Paracetamol 650mg",
        genericName: "Paracetamol 650mg",
        form: "Tablet",
        dosage: "650mg",
        frequency: "SOS",
        timing: "After Food",
        durationDays: 3,
        totalQuantity: 6,
        instructions: "For fever > 100°F (maximum 3 tablets per 24 hours).",
      },
    ],
    investigationsOrdered: [
      {
        testName: "Complete Blood Count (CBC)",
        category: "Blood",
        status: "ordered",
      },
      {
        testName: "Liver Function Test (LFT)",
        category: "Blood",
        status: "ordered",
      },
      {
        testName: "Ultrasound Abdomen",
        category: "Radiology",
        status: "ordered",
      },
    ],
    dietaryAdvice:
      "Strict low-fat diet. Sip warm boiled water, fresh fruit juices, and clear broth. Avoid oily gravies, milk fat, and heavy dairy until ultrasound results arrive.",
    referrals: {
      department: "Gastroenterology",
      doctorName: "Dr. Vikram Joshi, DM",
      reason: "Ultrasound correlation and surgical/medical workup if acute cholelithiasis.",
    },
    isAdmitRecommended: false,
    followUp: {
      timeline: "SOS",
      date: "2026-10-23",
      notes: "Immediate review as soon as CBC, LFT, and Ultrasound Abdomen reports are ready.",
    },
    doctorDetails: DEFAULT_DOCTOR_DETAILS,
    createdAt: new Date(Date.now() - 48 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
  },

  // 3. Completed and finalized prescription for Priya Das (pat_10480)
  {
    id: "rx_10480",
    patientId: "pat_10480",
    status: "finalized",
    isFinalized: true,
    chiefComplaints: [
      {
        id: "cc_301",
        complaint: "Bilateral itchy watery eyes with severe paroxysmal sneezing",
        duration: 5,
        durationUnit: "Days",
        severity: "Moderate",
        bodyPartId: "ENT",
      },
      {
        id: "cc_302",
        complaint: "Clear profuse rhinorrhea and itching roof of mouth",
        duration: 5,
        durationUnit: "Days",
        severity: "Mild",
        bodyPartId: "ENT",
      },
    ],
    clinicalObservations:
      "Bilateral inferior turbinates are edematous, boggy, and pale with thin serous discharge. Mild conjunctival injection in both eyes. Pharynx clear, chest vesicular breath sounds throughout.",
    diagnosis: {
      provisional: "Acute Allergic Rhinoconjunctivitis",
      final: "Seasonal Allergic Rhinitis (Pollinosis) with Conjunctival Hypersensitivity",
      icd10Code: "J30.1",
    },
    medications: [
      {
        id: "med_301",
        drugName: "Tab. Bilastine 20mg",
        genericName: "Bilastine 20mg",
        form: "Tablet",
        dosage: "20mg",
        frequency: "1-0-0",
        timing: "Empty Stomach",
        durationDays: 10,
        totalQuantity: 10,
        instructions: "Take 1 tablet every morning at least 1 hour before breakfast or 2 hours after food.",
      },
      {
        id: "med_302",
        drugName: "Fluticasone Furoate Nasal Spray",
        genericName: "Fluticasone Furoate 27.5 mcg/actuation",
        form: "Syrup",
        dosage: "1 spray per nostril",
        frequency: "1-0-1",
        timing: "Before Food",
        durationDays: 14,
        totalQuantity: 1,
        instructions: "1 spray in each nostril twice daily after blowing nose gently. Do not sniff vigorously.",
      },
      {
        id: "med_303",
        drugName: "Olopatadine 0.1% Eye Drops",
        genericName: "Olopatadine HCl 0.1%",
        form: "Syrup",
        dosage: "1 drop both eyes",
        frequency: "1-0-1",
        timing: "After Food",
        durationDays: 7,
        totalQuantity: 1,
        instructions: "Instill 1 drop in both eyes twice daily for ocular itching.",
      },
    ],
    investigationsOrdered: [
      {
        testName: "Total Serum IgE & Absolute Eosinophil Count",
        category: "Blood",
        status: "completed",
      },
    ],
    dietaryAdvice:
      "Avoid early morning pollen exposure; keep bedroom windows closed. Use dust mite proof pillow covers. Rinse nasal passages with isotonic sterile saline spray each night.",
    referrals: {
      department: "",
      doctorName: "",
      reason: "",
    },
    isAdmitRecommended: false,
    followUp: {
      timeline: "2 Weeks",
      date: "2026-11-05",
      notes: "Follow up in 2 weeks or SOS if facial pain or purulent nasal discharge occurs.",
    },
    doctorDetails: DEFAULT_DOCTOR_DETAILS,
    createdAt: new Date(Date.now() - 80 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
  },
];

/**
 * Generate 25+ realistic patient records across the past 30 days
 */
export function generatePastMonthData() {
  const sampleData = [
    { name: "Kavita Reddy", gender: "Female", age: 34, complaint: "Chronic migraine with visual aura", diag: "Migraine without aura" },
    { name: "Suresh Kumar", gender: "Male", age: 58, complaint: "Routine Type-2 diabetes and hypertension review", diag: "Type 2 Diabetes Mellitus" },
    { name: "Mohammed Al-Sayed", gender: "Male", age: 41, complaint: "Severe lower back ache radiating to left thigh", diag: "Lumbar Disc Herniation (L4-L5)" },
    { name: "Deepa Nair", gender: "Female", age: 29, complaint: "Persistent dry cough post viral infection x 2 weeks", diag: "Post-Viral Bronchial Hyperresponsiveness" },
    { name: "Arjun Kapoor", gender: "Male", age: 37, complaint: "Epigastric burning and waterbrash after meals", diag: "Gastroesophageal Reflux Disease (GERD)" },
    { name: "Meenakshi Sundaram", gender: "Female", age: 66, complaint: "Bilateral knee joint crepitus and morning stiffness", diag: "Primary Osteoarthritis of Bilateral Knees" },
    { name: "Rohan Mehta", gender: "Male", age: 22, complaint: "High grade fever with retro-orbital pain and myalgia", diag: "Acute Viral Syndrome / Dengue Evaluation" },
    { name: "Ananya Joshi", gender: "Female", age: 31, complaint: "Generalized fatigue, cold intolerance and weight gain", diag: "Primary Hypothyroidism" },
    { name: "Karthik Swamy", gender: "Male", age: 49, complaint: "Intermittent chest tightness on heavy exertion", diag: "Atypical Chest Pain / Angina Evaluation" },
    { name: "Bhavna Shah", gender: "Female", age: 52, complaint: "Hot flashes, insomnia and mood fluctuations", diag: "Perimenopausal Vasomotor Symptoms" },
    { name: "Tanmay Ghosh", gender: "Male", age: 39, complaint: "Right hypochondriac pain with dyspepsia", diag: "Fatty Liver Disease (Grade 2)" },
    { name: "Sunil Hegde", gender: "Male", age: 61, complaint: "Nocturia and hesitant weak urinary stream", diag: "Benign Prostatic Hyperplasia (BPH)" },
    { name: "Pooja Chawla", gender: "Female", age: 27, complaint: "Painful urination and lower suprapubic ache", diag: "Acute Uncomplicated Cystitis (UTI)" },
    { name: "Dinesh Pillai", gender: "Male", age: 44, complaint: "Mild exertional breathlessness, chronic smoker", diag: "Chronic Bronchitis / Early COPD" },
    { name: "Shreya Mukherjee", gender: "Female", age: 35, complaint: "Severe hair fall and brittle nails with fatigue", diag: "Iron Deficiency Anemia" },
    { name: "Harish Varma", gender: "Male", age: 50, complaint: "Bilateral pedal edema by evening", diag: "Bilateral Venous Insufficiency" },
    { name: "Fatima Khan", gender: "Female", age: 24, complaint: "Acute sore throat with difficulty swallowing", diag: "Acute Streptococcal Pharyngotonsillitis" },
    { name: "Girish Rao", gender: "Male", age: 63, complaint: "Tremors in right hand and stooped gait", diag: "Essential Tremors vs Early Parkinsonism" },
    { name: "Nandini Iyer", gender: "Female", age: 48, complaint: "Severe cervical spine stiffness and shoulder pain", diag: "Cervical Spondylosis with Radiculopathy" },
    { name: "Vikas Bansal", gender: "Male", age: 33, complaint: "Allergic rhinitis and frequent morning sneezing", diag: "Perennial Allergic Rhinitis" },
    { name: "Swati Deshmukh", gender: "Female", age: 42, complaint: "Right upper quadrant colicky pain after fatty meal", diag: "Biliary Colic / Cholelithiasis" },
    { name: "Amitabh Sen", gender: "Male", age: 71, complaint: "Gradual memory lapses and daytime drowsiness", diag: "Mild Cognitive Impairment / Age-related" },
    { name: "Lavanya Balan", gender: "Female", age: 26, complaint: "Irregular menstrual cycles and facial acne", diag: "Polycystic Ovarian Syndrome (PCOS)" },
    { name: "Rameshwar Prasad", gender: "Male", age: 55, complaint: "Acute gouty pain and swelling in right great toe", diag: "Acute Gouty Arthritis" },
    { name: "Geeta Kulkarni", gender: "Female", age: 60, complaint: "Routine hypertension and dyslipidemia checkup", diag: "Essential Hypertension with Mixed Dyslipidemia" },
  ];

  const pastPatients = [];
  const pastPrescriptions = [];

  sampleData.forEach((item, index) => {
    // Scheduled appointments spread across today (Live Queue)
    const minutesAgo = (25 - index) * 12; // 12m to 300m ago today
    const daysAgo = Math.floor(index / 5);
    const recordTime = new Date(Date.now() - minutesAgo * 60 * 1000);
    const patId = `pat_live_${String(index + 1).padStart(2, "0")}`;
    const rxId = `rx_live_${String(index + 1).padStart(2, "0")}`;
    const uhidNum = 10500 + index + 1;

    // Distribute queue statuses across Kanban lanes so all 31 patients populate the live triage board:
    // index 0..6 (7 patients): waiting (walk_in)
    // index 7..10 (4 patients): waiting (tele_consultation)
    // index 11..13 (3 patients): draft_labs (walk_in)
    // index 14..22 (9 patients): completed
    // index 23..24 (2 patients): no_show / cancelled
    let queueStatus = "waiting";
    let consultationType = "walk_in";
    let isFinalized = false;
    let tokenNumber = "";

    if (index < 7) {
      queueStatus = "waiting";
      consultationType = "walk_in";
      tokenNumber = `#W-${String(7 + index).padStart(2, "0")}`;
    } else if (index < 11) {
      queueStatus = "waiting";
      consultationType = "tele_consultation";
      tokenNumber = `#TC-${String(3 + (index - 7)).padStart(2, "0")}`;
    } else if (index < 14) {
      queueStatus = "draft_labs";
      consultationType = "walk_in";
      tokenNumber = `#W-${String(14 + (index - 11)).padStart(2, "0")}`;
    } else if (index < 23) {
      queueStatus = "completed";
      consultationType = index % 3 === 0 ? "tele_consultation" : "walk_in";
      tokenNumber = consultationType === "tele_consultation"
        ? `#TC-${String(7 + (index - 14)).padStart(2, "0")}`
        : `#W-${String(17 + (index - 14)).padStart(2, "0")}`;
      isFinalized = true;
    } else {
      queueStatus = "no_show";
      consultationType = "walk_in";
      tokenNumber = `#W-${String(26 + (index - 23)).padStart(2, "0")}`;
    }

    const patient = {
      id: patId,
      uhid: `UHID-${uhidNum}`,
      tokenNumber,
      name: item.name,
      age: item.age,
      gender: item.gender,
      bloodGroup: ["A+", "B+", "O+", "AB+", "O-"][index % 5],
      phone: `+91 98${index}10 ${2000 + index}`,
      isPregnant: item.gender === "Female" && index % 6 === 0,
      pregnancyDetails:
        item.gender === "Female" && index % 6 === 0
          ? { trimester: "2nd", gestationalWeeks: 24, edd: "2027-02-15" }
          : null,
      isHandicapped: index % 7 === 0,
      allergies: index % 5 === 0 ? ["Penicillin (Mild)"] : index % 8 === 0 ? ["Sulfa"] : ["NKDA"],
      vitals: {
        bp: `${110 + (index % 6) * 6}/${70 + (index % 4) * 5}`,
        pulse: 72 + (index % 5) * 4,
        temp: 98.4 + (index % 3) * 0.4,
        spo2: 98 - (index % 2),
        weight: 55 + (index % 8) * 4,
        bmi: +(21 + (index % 7) * 1.2).toFixed(1),
      },
      queueStatus,
      consultationType,
      visitType: index % 2 === 0 ? "follow_up" : "new",
      priority: index % 4 === 0 ? "urgent" : "normal",
      chiefComplaintSummary: item.complaint,
      scheduledTime: `${8 + Math.floor(index / 3)}:${(index % 3) * 20 || "00"} AM`,
      consultationStartTime: recordTime.toISOString(),
      createdAt: recordTime.toISOString(),
      updatedAt: recordTime.toISOString(),
    };

    const prescription = {
      id: rxId,
      patientId: patId,
      status:
        queueStatus === "completed"
          ? "finalized"
          : queueStatus === "draft_labs"
          ? "awaiting_labs"
          : "draft",
      isFinalized,
      chiefComplaints: [
        {
          id: `cc_hist_${index}`,
          complaint: item.complaint,
          duration: `${daysAgo + 2}`,
          durationUnit: "Days",
          severity: index % 3 === 0 ? "Severe" : index % 2 === 0 ? "Moderate" : "Mild",
          bodyPartId: "General",
        },
      ],
      clinicalObservations: `Systemic examination conducted on ${recordTime.toLocaleDateString(
        "en-IN"
      )}. Cardiovascular: S1/S2 heard, no murmur. Respiratory: Vesicular breath sounds clear. Abdomen: Soft.`,
      diagnosis: {
        provisional: item.diag,
        final: queueStatus === "completed" ? item.diag : "",
        icd10Code: `M${10 + index}.0`,
      },
      medications: [
        {
          id: `med_hist_${index}_1`,
          drugName: "Tab. Paracetamol 650mg",
          genericName: "Paracetamol 650mg",
          form: "Tablet",
          dosage: "1 Tab",
          frequency: "1-0-1",
          timing: "After Food",
          durationDays: 5,
          totalQuantity: 10,
          instructions: "Take SOS or as prescribed",
        },
        {
          id: `med_hist_${index}_2`,
          drugName: "Cap. Pantoprazole 40mg",
          genericName: "Pantoprazole 40mg",
          form: "Capsule",
          dosage: "1 Cap",
          frequency: "1-0-0",
          timing: "Empty Stomach",
          durationDays: 7,
          totalQuantity: 7,
          instructions: "Take 30 mins before breakfast",
        },
      ],
      investigationsOrdered: [
        { testName: "Complete Blood Count (CBC)", category: "Blood", status: "completed" },
        { testName: "Random Blood Sugar", category: "Blood", status: "completed" },
      ],
      dietaryAdvice: "Drink adequate water. Avoid excessively oily or spicy foods. Follow light walking exercise daily.",
      referrals: { department: "", doctorName: "", reason: "" },
      isAdmitRecommended: false,
      followUp: {
        timeline: "2 Weeks",
        date: new Date(recordTime.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        notes: "Routine follow-up review.",
      },
      doctorDetails: DEFAULT_DOCTOR_DETAILS,
      createdAt: recordTime.toISOString(),
      updatedAt: recordTime.toISOString(),
    };

    pastPatients.push(patient);
    pastPrescriptions.push(prescription);
  });

  return { pastPatients, pastPrescriptions };
}

/**
 * Seed all tables in HospitalOPD_DB
 * @param {import('dexie').Dexie} [db]
 */
export async function seedHospitalData(db = hospitalDb) {
  await db.transaction("rw", [db.patients, db.prescriptions, db.adminConfig, db.customDictionary], async () => {
    // Clear and reload
    await db.patients.clear();
    await db.prescriptions.clear();
    await db.adminConfig.clear();
    await db.customDictionary.clear();

    const { pastPatients, pastPrescriptions } = generatePastMonthData();

    await db.patients.bulkAdd([...INITIAL_PATIENTS, ...pastPatients]);
    await db.prescriptions.bulkAdd([...INITIAL_PRESCRIPTIONS, ...pastPrescriptions]);
    await db.adminConfig.bulkAdd(INITIAL_ADMIN_CONFIG);
    await db.customDictionary.bulkAdd(INITIAL_CUSTOM_DICTIONARY);
  });
}

/**
 * Seed initial data if the database is currently empty or needs version upgrade for all 31 live patients.
 * @param {import('dexie').Dexie} [db]
 */
export async function seedInitialDataIfEmpty(db = hospitalDb) {
  try {
    const patientCount = await db.patients.count();
    const hasLatestSeed = typeof localStorage !== "undefined" && localStorage.getItem("opd_seed_v7");
    // If empty or older dataset without full 31 live patients, re-seed!
    if (patientCount < 30 || !hasLatestSeed) {
      await seedHospitalData(db);
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("opd_seed_v7", "true");
      }
    }
  } catch (err) {
    console.error("seedInitialDataIfEmpty error:", err);
  }
}

/**
 * Manual helper function to reset and re-populate the demo OPD database.
 * @param {import('dexie').Dexie} [db]
 */
export async function resetDatabase(db = hospitalDb) {
  await seedHospitalData(db);
  return { success: true, timestamp: new Date().toISOString() };
}

// Alias for convenience
export const resetHospitalDatabase = resetDatabase;

export default {
  INITIAL_PATIENTS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_ADMIN_CONFIG,
  INITIAL_CUSTOM_DICTIONARY,
  DEFAULT_DOCTOR_DETAILS,
  seedHospitalData,
  seedInitialDataIfEmpty,
  resetDatabase,
  resetHospitalDatabase,
};
