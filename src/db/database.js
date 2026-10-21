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

/**
 * Seed initial sample hospital data if database is empty on first load.
 * This guarantees a rich, testable experience immediately.
 */
export async function seedInitialDataIfEmpty() {
  const linkCount = await db.links.count();
  if (linkCount > 0) return;

  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  const sevenDaysMs = 7 * oneDayMs;

  // 1. Seed Lab Report
  const labReportId = await db.labReports.add({
    title: "Pathology & Comprehensive Metabolic Panel - Aarav Sharma",
    remarks: "Fasting blood sugar and lipid panel are within normal limits. Maintain regular hydration and follow up in 6 months.",
    createdAt: now - 3600000,
  });

  // Create a sample dummy PDF Blob for demonstration
  const samplePdfContent = "%PDF-1.4 sample lab report for Aarav Sharma";
  const sampleBlob = new Blob([samplePdfContent], { type: "application/pdf" });
  await db.labReportAttachments.add({
    reportId: labReportId,
    originalFilename: "CMP_Lipid_Panel_GW041.pdf",
    mimeType: "application/pdf",
    fileSize: sampleBlob.size,
    fileBlob: sampleBlob,
  });

  await db.links.add({
    shortCode: "aB72xK9",
    moduleType: "lab-reports",
    title: "Pathology & Comprehensive Metabolic Panel - Aarav Sharma",
    destinationId: labReportId,
    createdAt: now - 3600000,
    expiresAt: now + sevenDaysMs,
    isActive: true,
  });

  // 2. Seed Telehealth Meeting
  const telehealthId = await db.telehealthMeetings.add({
    doctorName: "Dr. Ananya Rao",
    doctorDesignation: "Senior Consultant Cardiologist, MD, DM",
    meetingTitle: "Post-Operative Cardiac Review",
    meetingDate: "2026-10-25",
    meetingTime: "11:30 AM",
    description: "Please have your recent home blood pressure readings and current prescription list available during the video call.",
    videoMeetingUrl: "https://meet.google.com/get-well-cardio",
    createdAt: now - 7200000,
  });

  await db.links.add({
    shortCode: "tR91xM2",
    moduleType: "telehealth",
    title: "Dr. Ananya Rao - Cardiac Video Consultation",
    destinationId: telehealthId,
    createdAt: now - 7200000,
    expiresAt: now + 14 * oneDayMs,
    isActive: true,
  });

  // 3. Seed Feedback Form and Sample Submissions
  const feedbackFormId = await db.feedbackForms.add({
    title: "Cardiology Inpatient Stay & Nursing Care Experience",
    createdAt: now - 86400000,
    expiresAt: now + 30 * oneDayMs,
    isActive: true,
  });

  await db.links.add({
    shortCode: "fB44xP8",
    moduleType: "feedback",
    title: "Patient Care & Hospital Feedback Form",
    destinationId: feedbackFormId,
    createdAt: now - 86400000,
    expiresAt: now + 30 * oneDayMs,
    isActive: true,
  });

  // Sample feedback submissions
  await db.feedbackResponses.bulkAdd([
    {
      feedbackFormId,
      hospitalStaffRating: 5,
      doctorTreatmentRating: 5,
      overallHospitalRating: 5,
      suggestions: "The nursing staff on 3rd floor was extraordinarily attentive during my recovery.",
      submittedAt: now - 43200000,
    },
    {
      feedbackFormId,
      hospitalStaffRating: 4,
      doctorTreatmentRating: 5,
      overallHospitalRating: 4,
      suggestions: "Excellent medical guidance from Dr. Rao. Cafeteria service could be a bit quicker.",
      submittedAt: now - 21600000,
    },
  ]);

  // 4. Seed Survey Link
  const surveyId = await db.surveys.add({
    title: "Annual Hospital Patient Experience & Quality Survey",
    originalUrl: "https://forms.google.com/d/e/1FAIpQLSc_GetWellHospitalSurvey/viewform",
    description: "Help Apple Multispecialty Hospital improve patient wait times and pharmacy services.",
    createdAt: now - 172800000,
  });

  await db.links.add({
    shortCode: "sV18xQ3",
    moduleType: "survey",
    title: "Annual Hospital Patient Experience & Quality Survey",
    destinationId: surveyId,
    destinationUrl: "https://forms.google.com/d/e/1FAIpQLSc_GetWellHospitalSurvey/viewform",
    createdAt: now - 172800000,
    expiresAt: now + 30 * oneDayMs,
    isActive: true,
  });
}

/**
 * Development reset helper: Clears all tables and re-seeds sample data
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
