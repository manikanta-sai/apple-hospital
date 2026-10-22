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

    await db.patients.bulkAdd(INITIAL_PATIENTS);
    await db.prescriptions.bulkAdd(INITIAL_PRESCRIPTIONS);
    await db.adminConfig.bulkAdd(INITIAL_ADMIN_CONFIG);
    await db.customDictionary.bulkAdd(INITIAL_CUSTOM_DICTIONARY);
  });
}

/**
 * Seed initial data if the database is currently empty.
 * @param {import('dexie').Dexie} [db]
 */
export async function seedInitialDataIfEmpty(db = hospitalDb) {
  try {
    const patientCount = await db.patients.count();
    if (patientCount === 0) {
      await seedHospitalData(db);
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
