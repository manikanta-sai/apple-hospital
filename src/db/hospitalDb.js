import Dexie from "dexie";
import { seedInitialDataIfEmpty } from "./seedData.js";

/**
 * HospitalOPD_DB
 * --------------
 * IndexedDB instance for Phase 1 of the Hospital Outpatient Consultation (OPD)
 * & AI Digital Prescription System.
 *
 * Object Stores:
 * 1. patients:
 *    Primary key: id
 *    Indexes: id, uhid, tokenNumber, name, queueStatus, consultationType, priority
 * 2. prescriptions:
 *    Primary key: id
 *    Indexes: id, patientId, status, updatedAt, isFinalized
 * 3. adminConfig:
 *    Primary key: sectionKey
 *    Indexes: sectionKey, isMandatory, isEnabled
 * 4. customDictionary:
 *    Primary key: id
 *    Indexes: id, shortcut, category
 */
export const hospitalDb = new Dexie("HospitalOPD_DB");

hospitalDb.version(1).stores({
  patients: "id, uhid, tokenNumber, name, queueStatus, consultationType, priority",
  prescriptions: "id, patientId, status, updatedAt, isFinalized",
  adminConfig: "sectionKey, isMandatory, isEnabled",
  customDictionary: "id, shortcut, category",
});

// Seed data on database creation
hospitalDb.on("populate", async () => {
  await seedInitialDataIfEmpty(hospitalDb);
});

// Ensure database has seed data on browser startup
if (typeof window !== "undefined") {
  seedInitialDataIfEmpty(hospitalDb).catch((err) => {
    console.warn("HospitalOPD_DB initialization check:", err);
  });
}

export default hospitalDb;
