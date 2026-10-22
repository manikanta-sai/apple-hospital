import { useEffect, useMemo, useCallback } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { hospitalDb } from "../db/hospitalDb.js";
import {
  seedInitialDataIfEmpty,
  resetHospitalDatabase,
  DEFAULT_DOCTOR_DETAILS,
} from "../db/seedData.js";
import { generateId } from "../utils/generateId.js";

/**
 * useHospitalData
 * ---------------
 * Custom React hook for reactive access to the Hospital OPD & Digital Prescription database.
 * Powered by Dexie.js and dexie-react-hooks.
 *
 * @param {string} [selectedPatientId] - Optional patient ID to reactively focus on
 */
export function useHospitalData(selectedPatientId = null) {
  // Ensure seed data exists on component mount
  useEffect(() => {
    seedInitialDataIfEmpty(hospitalDb).catch((err) => {
      console.error("Failed to seed initial hospital data:", err);
    });
  }, []);

  // 1. Reactive live queries
  const patients = useLiveQuery(
    () => hospitalDb.patients.toArray(),
    [],
    undefined
  );

  const prescriptions = useLiveQuery(
    () => hospitalDb.prescriptions.toArray(),
    [],
    undefined
  );

  const adminConfigList = useLiveQuery(
    () => hospitalDb.adminConfig.toArray(),
    [],
    undefined
  );

  const customDictionary = useLiveQuery(
    () => hospitalDb.customDictionary.toArray(),
    [],
    undefined
  );

  // Loading flag (undefined while first IndexedDB query runs)
  const isLoading =
    patients === undefined ||
    prescriptions === undefined ||
    adminConfigList === undefined ||
    customDictionary === undefined;

  // Safe arrays
  const safePatients = useMemo(() => patients || [], [patients]);
  const safePrescriptions = useMemo(() => prescriptions || [], [prescriptions]);
  const safeConfigList = useMemo(() => adminConfigList || [], [adminConfigList]);
  const safeDictionary = useMemo(() => customDictionary || [], [customDictionary]);

  // Derived patient categories
  const waitingPatients = useMemo(
    () => safePatients.filter((p) => p.queueStatus === "waiting"),
    [safePatients]
  );

  const inConsultationPatient = useMemo(() => {
    const active = safePatients.filter((p) => p.queueStatus === "in_consultation");
    if (active.length === 0) return null;
    if (active.length === 1) return active[0];
    // Sort descending by consultation start time so latest called patient is on active desk
    return [...active].sort(
      (a, b) => new Date(b.consultationStartTime || 0) - new Date(a.consultationStartTime || 0)
    )[0];
  }, [safePatients]);

  const draftLabsPatients = useMemo(
    () => safePatients.filter((p) => p.queueStatus === "draft_labs"),
    [safePatients]
  );

  const completedPatients = useMemo(
    () => safePatients.filter((p) => p.queueStatus === "completed"),
    [safePatients]
  );

  const cancelledPatients = useMemo(
    () => safePatients.filter((p) => p.queueStatus === "cancelled"),
    [safePatients]
  );

  // Active / Selected patient & prescription resolution
  const activePatient = useMemo(() => {
    if (selectedPatientId) {
      return safePatients.find((p) => p.id === selectedPatientId) || null;
    }
    return inConsultationPatient;
  }, [selectedPatientId, safePatients, inConsultationPatient]);

  const activePrescription = useMemo(() => {
    if (!activePatient) return null;
    return safePrescriptions.find((rx) => rx.patientId === activePatient.id) || null;
  }, [activePatient, safePrescriptions]);

  // Admin config lookup map: configMap['chief_complaints'] -> { isMandatory, isEnabled, label }
  const configMap = useMemo(() => {
    const map = {};
    for (const item of safeConfigList) {
      map[item.sectionKey] = item;
    }
    return map;
  }, [safeConfigList]);

  // Queue Counts Summary
  const counts = useMemo(
    () => ({
      total: safePatients.length,
      waiting: waitingPatients.length,
      inConsultation: inConsultationPatient ? 1 : 0,
      draftLabs: draftLabsPatients.length,
      completed: completedPatients.length,
      cancelled: cancelledPatients.length,
    }),
    [safePatients.length, waitingPatients.length, inConsultationPatient, draftLabsPatients.length, completedPatients.length, cancelledPatients.length]
  );

  // ─────────────────────────────────────────────────────────────
  // Action Mutations
  // ─────────────────────────────────────────────────────────────

  /**
   * Start consultation for a patient / call patient to doctor's desk
   */
  const callPatient = useCallback(async (patientId) => {
    return hospitalDb.transaction("rw", [hospitalDb.patients, hospitalDb.prescriptions], async () => {
      const patient = await hospitalDb.patients.get(patientId);
      if (!patient) throw new Error(`Patient ${patientId} not found`);

      // Vacate active room if another patient was currently in consultation
      const existingInRoom = await hospitalDb.patients
        .where("queueStatus")
        .equals("in_consultation")
        .toArray();

      for (const cur of existingInRoom) {
        if (cur.id !== patientId) {
          const curRx = await hospitalDb.prescriptions.where("patientId").equals(cur.id).first();
          const hasLabs = curRx && curRx.investigationsOrdered && curRx.investigationsOrdered.length > 0;
          await hospitalDb.patients.update(cur.id, {
            queueStatus: hasLabs ? "draft_labs" : "waiting",
          });
        }
      }

      // Update patient status to in_consultation
      await hospitalDb.patients.update(patientId, {
        queueStatus: "in_consultation",
        consultationStartTime: new Date().toISOString(),
      });

      // Ensure a draft prescription exists for this patient
      const existingRx = await hospitalDb.prescriptions
        .where("patientId")
        .equals(patientId)
        .first();

      if (!existingRx) {
        const newRxId = `rx_${patientId.replace("pat_", "") || generateId("rx")}`;
        await hospitalDb.prescriptions.add({
          id: newRxId,
          patientId: patientId,
          status: "draft",
          isFinalized: false,
          chiefComplaints: patient.chiefComplaintSummary
            ? [
                {
                  id: generateId("cc"),
                  complaint: patient.chiefComplaintSummary,
                  duration: 1,
                  durationUnit: "Days",
                  severity: "Moderate",
                  bodyPartId: "General",
                },
              ]
            : [],
          clinicalObservations: "",
          diagnosis: {
            provisional: "",
            final: "",
            icd10Code: "",
          },
          medications: [],
          investigationsOrdered: [],
          dietaryAdvice: "",
          referrals: {
            department: "",
            doctorName: "",
            reason: "",
          },
          isAdmitRecommended: false,
          followUp: {
            timeline: "1 Week",
            date: "",
            notes: "",
          },
          doctorDetails: DEFAULT_DOCTOR_DETAILS,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    });
  }, []);

  /**
   * Move patient to draft_labs and mark prescription as awaiting_labs
   */
  const sendToLabs = useCallback(async (patientId, testsOrdered = []) => {
    return hospitalDb.transaction("rw", [hospitalDb.patients, hospitalDb.prescriptions], async () => {
      await hospitalDb.patients.update(patientId, {
        queueStatus: "draft_labs",
      });

      const existingRx = await hospitalDb.prescriptions
        .where("patientId")
        .equals(patientId)
        .first();

      if (existingRx) {
        const mergedTests = testsOrdered.length > 0
          ? testsOrdered
          : existingRx.investigationsOrdered;

        await hospitalDb.prescriptions.update(existingRx.id, {
          status: "awaiting_labs",
          isFinalized: false,
          investigationsOrdered: mergedTests,
          updatedAt: new Date().toISOString(),
        });
      } else {
        await hospitalDb.prescriptions.put({
          id: generateId("rx"),
          patientId,
          status: "awaiting_labs",
          isFinalized: false,
          investigationsOrdered: testsOrdered,
          doctorDetails: DEFAULT_DOCTOR_DETAILS,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    });
  }, []);

  /**
   * Finalize prescription and complete patient visit
   */
  const finalizePrescription = useCallback(async (patientId, prescriptionUpdates = {}) => {
    return hospitalDb.transaction("rw", [hospitalDb.patients, hospitalDb.prescriptions], async () => {
      await hospitalDb.patients.update(patientId, {
        queueStatus: "completed",
      });

      const existingRx = await hospitalDb.prescriptions
        .where("patientId")
        .equals(patientId)
        .first();

      if (existingRx) {
        await hospitalDb.prescriptions.update(existingRx.id, {
          ...prescriptionUpdates,
          status: "finalized",
          isFinalized: true,
          updatedAt: new Date().toISOString(),
        });
      } else {
        await hospitalDb.prescriptions.put({
          id: generateId("rx"),
          patientId,
          ...prescriptionUpdates,
          status: "finalized",
          isFinalized: true,
          doctorDetails: DEFAULT_DOCTOR_DETAILS,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    });
  }, []);

  /**
   * Cancel patient appointment/queue entry
   */
  const cancelPatient = useCallback(async (patientId, reason = "") => {
    return hospitalDb.patients.update(patientId, {
      queueStatus: "cancelled",
      cancellationReason: reason,
      updatedAt: new Date().toISOString(),
    });
  }, []);

  /**
   * Update patient vitals
   */
  const updatePatientVitals = useCallback(async (patientId, vitals) => {
    const patient = await hospitalDb.patients.get(patientId);
    if (!patient) return;
    return hospitalDb.patients.update(patientId, {
      vitals: {
        ...patient.vitals,
        ...vitals,
      },
      updatedAt: new Date().toISOString(),
    });
  }, []);

  /**
   * Update generic patient demographic or queue fields
   */
  const updatePatient = useCallback(async (patientId, updates) => {
    return hospitalDb.patients.update(patientId, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  }, []);

  /**
   * Save / Upsert prescription
   */
  const savePrescription = useCallback(async (prescriptionData) => {
    const id = prescriptionData.id || generateId("rx");
    const dataToSave = {
      ...prescriptionData,
      id,
      updatedAt: new Date().toISOString(),
      createdAt: prescriptionData.createdAt || new Date().toISOString(),
      doctorDetails: prescriptionData.doctorDetails || DEFAULT_DOCTOR_DETAILS,
    };
    await hospitalDb.prescriptions.put(dataToSave);
    return id;
  }, []);

  /**
   * Update an admin configuration section
   */
  const updateAdminConfig = useCallback(async (sectionKey, updates) => {
    return hospitalDb.adminConfig.update(sectionKey, updates);
  }, []);

  /**
   * Toggle a boolean field in admin configuration (e.g. isMandatory or isEnabled)
   */
  const toggleAdminConfig = useCallback(async (sectionKey, field = "isEnabled") => {
    const item = await hospitalDb.adminConfig.get(sectionKey);
    if (!item) return;
    return hospitalDb.adminConfig.update(sectionKey, {
      [field]: !item[field],
    });
  }, []);

  /**
   * Add a custom dictionary shortcut
   */
  const addDictionaryItem = useCallback(async ({ shortcut, expansion, category = "instruction" }) => {
    const id = generateId("dict");
    await hospitalDb.customDictionary.add({
      id,
      shortcut: shortcut.trim().toLowerCase(),
      expansion: expansion.trim(),
      category,
    });
    return id;
  }, []);

  /**
   * Update an existing custom dictionary shortcut
   */
  const updateDictionaryItem = useCallback(async (id, updates) => {
    return hospitalDb.customDictionary.update(id, updates);
  }, []);

  /**
   * Delete a custom dictionary shortcut
   */
  const deleteDictionaryItem = useCallback(async (id) => {
    return hospitalDb.customDictionary.delete(id);
  }, []);

  /**
   * Reset database back to realistic initial demo state
   */
  const resetDemoData = useCallback(async () => {
    return resetHospitalDatabase(hospitalDb);
  }, []);

  return {
    // Loading State
    isLoading,

    // Collections
    patients: safePatients,
    prescriptions: safePrescriptions,
    adminConfigList: safeConfigList,
    adminConfig: configMap,
    customDictionary: safeDictionary,

    // Queue Segmentations
    waitingPatients,
    inConsultationPatient,
    draftLabsPatients,
    completedPatients,
    cancelledPatients,

    // Active Selection
    activePatient,
    activePrescription,

    // Summary Metrics
    counts,

    // Mutation Operations
    callPatient,
    sendToLabs,
    finalizePrescription,
    cancelPatient,
    updatePatientVitals,
    updatePatient,
    savePrescription,
    updateAdminConfig,
    toggleAdminConfig,
    addDictionaryItem,
    updateDictionaryItem,
    deleteDictionaryItem,
    resetDemoData,

    // Direct DB instance access
    db: hospitalDb,
  };
}

export default useHospitalData;
