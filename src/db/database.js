import Dexie from "dexie";

/**
 * HealthcareURLGeneratorDB
 * ------------------------
 * Centralized Dexie IndexedDB instance storing all records client-side:
 * - links: Shared link metadata with short codes, expiration, and active status
 * - labReports: Laboratory report headers and remarks
 * - labReportAttachments: Binary file blobs for PDFs/images associated with a lab report
 * - telehealthMeetings: Telehealth appointment details and meeting video links
 * - feedbackForms: Patient feedback form definitions and configurations
 * - feedbackResponses: Patient 1-5 star ratings and suggestions
 * - surveys: Long survey URLs mapped to short codes
 */
export const db = new Dexie("HealthcareURLGeneratorDB");

// Version 1 Schema
db.version(1).stores({
  links: "++id, &shortCode, moduleType, title, destinationId, destinationUrl, createdAt, expiresAt, isActive",
  labReports: "++id, title, remarks, createdAt",
  labReportAttachments: "++id, reportId, originalFilename, mimeType, fileSize",
  telehealthMeetings: "++id, doctorName, doctorDesignation, meetingTitle, meetingDate, meetingTime, description, videoMeetingUrl, createdAt",
  feedbackForms: "++id, title, createdAt, expiresAt, isActive",
  feedbackResponses: "++id, feedbackFormId, hospitalStaffRating, doctorTreatmentRating, overallHospitalRating, submittedAt",
  surveys: "++id, title, originalUrl, createdAt",
});

const PATIENTS = [
  "Aarav Sharma", "Priya Patel", "Rajesh Iyer", "Fatima Begum", "Rohan Das",
  "Meera Nair", "Sunita Reddy", "Vikram Mehta", "Ishaan Kapoor", "Ananya Joshi",
  "Deepak Verma", "Sneha Kulkarni", "Suresh Menon", "Kavitha Nambiar", "Amit Gupta",
  "Pooja Hegde", "Rahul Banerjee", "Swati Deshmukh", "Naveen Chandra", "Divya Pillai",
  "Manoj Kumar", "Anjali Rao", "Karthik Srinivasan", "Shreya Sen", "Arun Varma",
  "Lakshmi Narayanan", "Gaurav Malhotra", "Bhavna Chawla", "Harish Natarajan", "Preeti Saxena",
];

const DOCTORS = [
  { name: "Dr. Ananya Rao", spec: "Senior Consultant Cardiologist, MD, DM" },
  { name: "Dr. Vikram Mehta", spec: "Chief Orthopedic Surgeon, MS, MCh" },
  { name: "Dr. Priya Mani", spec: "Senior Pediatric Specialist, MD, DCH" },
  { name: "Dr. Nikhil Shah", spec: "Consultant Neurologist, MD, DM" },
  { name: "Dr. Kavitha Iyer", spec: "Senior Obstetrician & Gynecologist, MD, DGO" },
  { name: "Dr. Rajesh Verma", spec: "Consultant General Physician, MBBS, MD" },
  { name: "Dr. Sunita Deshmukh", spec: "Consultant Pulmonologist, MD, DNB" },
  { name: "Dr. Arvind Swamy", spec: "Endocrinologist & Diabetologist, MD, DM" },
  { name: "Dr. Shalini Roy", spec: "Consultant Dermatologist, MD, DVD" },
  { name: "Dr. Manoj Nair", spec: "Senior Nephrologist, MD, DM" },
];

const LAB_TESTS = [
  "Complete Blood Count (CBC) with Differential",
  "Comprehensive Metabolic Panel (CMP)",
  "Lipid Profile & Cholesterol Assessment",
  "Glycated Hemoglobin (HbA1c) & Fasting Plasma Glucose",
  "Liver Function Test (LFT) & Bilirubin",
  "Renal Function Test (KFT) & Serum Creatinine",
  "Thyroid Stimulating Hormone (TSH) & Free T4",
  "Cardiac Troponin I & CK-MB Panel",
  "Vitamin D3 & Vitamin B12 Deficiency Screener",
  "Urinalysis Routine & Microscopic Examination",
  "Serum Electrolytes (Sodium, Potassium, Chloride)",
  "Coagulation Profile (PT/INR, aPTT)",
  "Digital Chest X-Ray & Radiologist Review",
  "Ultrasound Abdomen & Pelvis Sonogram",
  "Iron Profile & Total Iron Binding Capacity",
];

const TELEHEALTH_TOPICS = [
  "Post-Operative Cardiac Review",
  "Pediatric Growth & Nutrition Follow-up",
  "Orthopedic Knee Mobility & Rehab Consultation",
  "Diabetes Management & Insulin Titration",
  "Hypertension & BP Log Review",
  "Neurological Headache & Migraine Review",
  "Dermatology Skin Lesion & Rash Evaluation",
  "Post-Surgical Wound Healing Assessment",
  "Thyroid Hormone Adjustment Consultation",
  "Pulmonology Asthma & Inhaler Review",
  "Gastroenterology GERD & Diet Review",
  "Nephrology Clearance & Creatinine Review",
];

const FEEDBACK_TOPICS = [
  "Inpatient Ward Nursing & Medical Care Review",
  "Outpatient Pharmacy & Rapid Billing Experience",
  "Emergency Casualty & Triage Response Review",
  "Post-Surgical Day Care & Recovery Experience",
  "Maternity Labor & Neonatal Care Assessment",
  "Executive Health Checkup & OPD Feedback",
  "Dialysis Center Hygiene & Nursing Attention",
  "Radiology & Diagnostic Imaging Experience",
  "Physical Therapy & Rehabilitation Feedback",
  "Cardiology Cath Lab & ICU Experience Survey",
];

const SURVEY_TOPICS = [
  {
    title: "Annual Hospital Patient Experience & Quality Survey",
    url: "https://forms.google.com/d/e/1FAIpQLSc_AppleHospitalSurvey/viewform",
  },
  {
    title: "Cafeteria Nutrition, Food Quality & Dietary Hygiene Audit",
    url: "https://forms.office.com/r/apple-hospital-nutrition-2026",
  },
  {
    title: "Post-Discharge 30-Day Recovery & PROM Outcome Study",
    url: "https://surveys.applehospital.org/prom-30day-recovery",
  },
  {
    title: "Accreditation Patient Safety & Hand Hygiene Perception",
    url: "https://research.applehospital.org/audits/nabh-hand-hygiene",
  },
  {
    title: "Digital Health Portal & Telehealth Usability Questionnaire",
    url: "https://docs.google.com/forms/d/e/1FAIpQLSc-portal-feedback/viewform",
  },
  {
    title: "Outpatient Wait Time & Pharmacy Queue Satisfaction",
    url: "https://forms.office.com/r/apple-opd-waittimes-2026",
  },
];

const CHARS = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function generateUniqueCode(existingSet) {
  while (true) {
    let code = "";
    for (let i = 0; i < 7; i++) {
      code += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    }
    if (!existingSet.has(code)) {
      existingSet.add(code);
      return code;
    }
  }
}

/**
 * Seed initial sample hospital data if database has fewer than 100 records.
 * Generates 30 days of records (minimum 50 per day = 1,500+ records)
 * across Lab Reports, Telehealth, Patient Feedback, and Survey Shorteners.
 */
export async function seedInitialDataIfEmpty() {
  const currentCount = await db.links.count();
  if (currentCount >= 100) return;

  // Clear existing if fewer than 100 to ensure clean fresh batch
  await db.links.clear();
  await db.labReports.clear();
  await db.labReportAttachments.clear();
  await db.telehealthMeetings.clear();
  await db.feedbackForms.clear();
  await db.feedbackResponses.clear();
  await db.surveys.clear();

  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  const startOfToday = new Date().setHours(0, 0, 0, 0);

  // 1. Create base destination records pool (20 of each module)
  const labReportIds = [];
  const dummyPdfContent = "%PDF-1.4 Clinical Laboratory Diagnostic Analysis";
  const dummyBlob = new Blob([dummyPdfContent], { type: "application/pdf" });

  for (let i = 0; i < 20; i++) {
    const test = LAB_TESTS[i % LAB_TESTS.length];
    const patient = PATIENTS[i % PATIENTS.length];
    const repId = await db.labReports.add({
      title: `${test} - ${patient}`,
      remarks: "Routine physiological parameters within normal limits. Follow up with attending physician as indicated.",
      createdAt: now - (i * 3600000 + 10000),
    });
    await db.labReportAttachments.add({
      reportId: repId,
      originalFilename: `${test.split(" ")[0]}_Record_${patient.split(" ")[0]}.pdf`,
      mimeType: "application/pdf",
      fileSize: 425000 + i * 15000,
      fileBlob: dummyBlob,
    });
    labReportIds.push(repId);
  }

  const telehealthIds = [];
  for (let i = 0; i < 20; i++) {
    const doc = DOCTORS[i % DOCTORS.length];
    const topic = TELEHEALTH_TOPICS[i % TELEHEALTH_TOPICS.length];
    const thId = await db.telehealthMeetings.add({
      doctorName: doc.name,
      doctorDesignation: doc.spec,
      meetingTitle: topic,
      meetingDate: new Date(now + 86400000 * ((i % 5) + 1)).toISOString().split("T")[0],
      meetingTime: `${(9 + (i % 8)).toString().padStart(2, "0")}:30 AM`,
      description: "Please have previous prescriptions, blood glucose logs, and vitals ready before joining.",
      videoMeetingUrl: `https://meet.google.com/apple-${doc.name.toLowerCase().replace(/[^a-z]/g, "")}`,
      createdAt: now - (i * 3600000 + 20000),
    });
    telehealthIds.push(thId);
  }

  const feedbackFormIds = [];
  for (let i = 0; i < 20; i++) {
    const topic = FEEDBACK_TOPICS[i % FEEDBACK_TOPICS.length];
    const fbId = await db.feedbackForms.add({
      title: topic,
      createdAt: now - (i * 86400000 + 30000),
      expiresAt: now + 30 * oneDayMs,
      isActive: true,
    });
    feedbackFormIds.push(fbId);

    // Add 2-3 sample ratings per form
    await db.feedbackResponses.bulkAdd([
      {
        feedbackFormId: fbId,
        hospitalStaffRating: 4 + (i % 2),
        doctorTreatmentRating: 5,
        overallHospitalRating: 4 + (i % 2),
        suggestions: "The hospital staff was courteous and care was delivered promptly.",
        submittedAt: now - (i * 43200000 + 5000),
      },
    ]);
  }

  const surveyIds = [];
  for (let i = 0; i < SURVEY_TOPICS.length; i++) {
    const s = SURVEY_TOPICS[i];
    const surId = await db.surveys.add({
      title: s.title,
      originalUrl: s.url,
      description: "Apple Multispecialty Hospital quality improvement and accreditation initiative.",
      createdAt: now - (i * 86400000 + 40000),
    });
    surveyIds.push({ id: surId, url: s.url, title: s.title });
  }

  // 2. Generate 30 days x 52 records = 1,560 links
  const existingCodes = new Set();
  const linksToInsert = [];

  // Expiration choices in days
  const EXPIRATION_WINDOWS = [1, 7, 14, 30, 90, 0]; // 0 = never

  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const dayStart = startOfToday - dayOffset * oneDayMs;
    // Exactly 52 records per day (min 50)
    const recordsToday = 52;

    for (let r = 0; r < recordsToday; r++) {
      // Calculate realistic creation timestamp spread through the day (8:00 AM to 7:30 PM)
      const minuteOffset = Math.floor((r / recordsToday) * 690); // 11.5 hours in minutes
      const createdAt = dayStart + (8 * 3600000 + minuteOffset * 60000);

      const code = generateUniqueCode(existingCodes);

      // Distribute across modules: 40% lab, 25% telehealth, 20% feedback, 15% survey
      const modRoll = (r + dayOffset * 3) % 100;
      let moduleType = "lab-reports";
      let title = "";
      let destinationId = null;
      let destinationUrl = "";

      if (modRoll < 40) {
        moduleType = "lab-reports";
        const test = LAB_TESTS[(r + dayOffset) % LAB_TESTS.length];
        const patient = PATIENTS[(r * 2 + dayOffset) % PATIENTS.length];
        title = `${test} - ${patient}`;
        destinationId = labReportIds[r % labReportIds.length];
      } else if (modRoll < 65) {
        moduleType = "telehealth";
        const doc = DOCTORS[(r + dayOffset) % DOCTORS.length];
        const topic = TELEHEALTH_TOPICS[(r * 3 + dayOffset) % TELEHEALTH_TOPICS.length];
        title = `${doc.name} - ${topic}`;
        destinationId = telehealthIds[r % telehealthIds.length];
      } else if (modRoll < 85) {
        moduleType = "feedback";
        title = FEEDBACK_TOPICS[(r + dayOffset) % FEEDBACK_TOPICS.length];
        destinationId = feedbackFormIds[r % feedbackFormIds.length];
      } else {
        moduleType = "survey";
        const surv = surveyIds[(r + dayOffset) % surveyIds.length];
        title = surv.title;
        destinationId = surv.id;
        destinationUrl = surv.url;
      }

      // Expiration calculation
      const expDays = EXPIRATION_WINDOWS[(r + dayOffset) % EXPIRATION_WINDOWS.length];
      const expiresAt = expDays > 0 ? createdAt + expDays * oneDayMs : null;

      // Active status: 96% active initially, unless explicitly deactivated or expired
      const isActive = r % 25 !== 0;

      linksToInsert.push({
        shortCode: code,
        moduleType,
        title,
        destinationId,
        destinationUrl,
        createdAt,
        expiresAt,
        isActive,
      });
    }
  }

  // Bulk add all 1,560 links
  await db.links.bulkAdd(linksToInsert);
  console.log(`Seeded ${linksToInsert.length} clinical records across 30 days into IndexedDB.`);
}

/**
 * Development reset helper: Clears all tables and re-seeds full 1,500+ records
 */
export async function resetDatabase() {
  await db.links.clear();
  await db.labReports.clear();
  await db.labReportAttachments.clear();
  await db.telehealthMeetings.clear();
  await db.feedbackForms.clear();
  await db.feedbackResponses.clear();
  await db.surveys.clear();
  await seedInitialDataIfEmpty();
}
