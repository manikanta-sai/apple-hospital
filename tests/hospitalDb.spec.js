import { test, expect } from '@playwright/test';

test.describe('Hospital OPD IndexedDB & Seed Data (Phase 1)', () => {
  test('initializes HospitalOPD_DB with correct schema, seed data, and reset functionality', async ({ page }) => {
    await page.goto('/');

    // Wait until window.hospitalDb is initialized
    await page.waitForFunction(() => !!window.hospitalDb && !!window.hospitalDbSeed);

    const dbVerification = await page.evaluate(async () => {
      const db = window.hospitalDb;
      const seed = window.hospitalDbSeed;

      // 1. Verify Database Name and Tables
      const dbName = db.name;
      const tables = db.tables.map((t) => t.name).sort();

      // 2. Explicitly reset to verify resetDatabase works
      await seed.resetDatabase(db);

      // 3. Verify Patient Count and Content
      const patients = await db.patients.toArray();
      const patient1 = await db.patients.get('pat_10482');
      const patient2 = await db.patients.get('pat_10483');
      const patient3 = await db.patients.get('pat_10484');
      const patient4 = await db.patients.get('pat_10485');
      const patient5 = await db.patients.get('pat_10481');
      const patient6 = await db.patients.get('pat_10480');

      // 4. Verify Prescriptions
      const prescriptions = await db.prescriptions.toArray();
      const rx1 = await db.prescriptions.get('rx_10482');
      const rx5 = await db.prescriptions.get('rx_10481');
      const rx6 = await db.prescriptions.get('rx_10480');

      // 5. Verify Admin Config
      const adminConfigs = await db.adminConfig.toArray();
      const chiefComplaintsConfig = await db.adminConfig.get('chief_complaints');
      const vitalsConfig = await db.adminConfig.get('vitals');
      const allergiesConfig = await db.adminConfig.get('allergies');
      const diagnosisConfig = await db.adminConfig.get('diagnosis');
      const medicationsConfig = await db.adminConfig.get('medications');
      const investigationsConfig = await db.adminConfig.get('investigations');
      const dietAdviceConfig = await db.adminConfig.get('diet_advice');
      const followUpConfig = await db.adminConfig.get('follow_up');
      const referralAdmitConfig = await db.adminConfig.get('referral_admit');

      // 6. Verify Custom Dictionary
      const dictionary = await db.customDictionary.toArray();
      const pcmShortcut = await db.customDictionary.where('shortcut').equals('pcm').first();
      const amoxShortcut = await db.customDictionary.where('shortcut').equals('amox').first();
      const htnShortcut = await db.customDictionary.where('shortcut').equals('htn').first();
      const t2dmShortcut = await db.customDictionary.where('shortcut').equals('t2dm').first();
      const odPcShortcut = await db.customDictionary.where('shortcut').equals('od-pc').first();
      const bdPcShortcut = await db.customDictionary.where('shortcut').equals('bd-pc').first();

      // 7. Verify Schema Indexes
      const tableSchemas = {};
      db.tables.forEach((t) => {
        tableSchemas[t.name] = {
          primKey: t.schema.primKey.name,
          indexes: t.schema.indexes.map((idx) => idx.name),
        };
      });

      return {
        dbName,
        tables,
        tableSchemas,
        patientCount: patients.length,
        prescriptionCount: prescriptions.length,
        adminConfigCount: adminConfigs.length,
        dictionaryCount: dictionary.length,
        patient1,
        patient2,
        patient3,
        patient4,
        patient5,
        patient6,
        rx1,
        rx5,
        rx6,
        chiefComplaintsConfig,
        vitalsConfig,
        allergiesConfig,
        diagnosisConfig,
        medicationsConfig,
        investigationsConfig,
        dietAdviceConfig,
        followUpConfig,
        referralAdmitConfig,
        shortcuts: {
          pcm: pcmShortcut?.expansion,
          amox: amoxShortcut?.expansion,
          htn: htnShortcut?.expansion,
          t2dm: t2dmShortcut?.expansion,
          odPc: odPcShortcut?.expansion,
          bdPc: bdPcShortcut?.expansion,
        },
      };
    });

    // Assertions: Database Name and Stores
    expect(dbVerification.dbName).toBe('HospitalOPD_DB');
    expect(dbVerification.tables).toEqual(['adminConfig', 'customDictionary', 'patients', 'prescriptions'].sort());

    // Verify Schema Primary Keys and Indexes
    expect(dbVerification.tableSchemas.patients.primKey).toBe('id');
    expect(dbVerification.tableSchemas.patients.indexes).toEqual(
      expect.arrayContaining(['uhid', 'tokenNumber', 'name', 'queueStatus', 'consultationType', 'priority'])
    );

    expect(dbVerification.tableSchemas.prescriptions.primKey).toBe('id');
    expect(dbVerification.tableSchemas.prescriptions.indexes).toEqual(
      expect.arrayContaining(['patientId', 'status', 'updatedAt', 'isFinalized'])
    );

    expect(dbVerification.tableSchemas.adminConfig.primKey).toBe('sectionKey');
    expect(dbVerification.tableSchemas.adminConfig.indexes).toEqual(
      expect.arrayContaining(['isMandatory', 'isEnabled'])
    );

    expect(dbVerification.tableSchemas.customDictionary.primKey).toBe('id');
    expect(dbVerification.tableSchemas.customDictionary.indexes).toEqual(
      expect.arrayContaining(['shortcut', 'category'])
    );

    // Verify Counts
    expect(dbVerification.patientCount).toBe(6);
    expect(dbVerification.prescriptionCount).toBe(3);
    expect(dbVerification.adminConfigCount).toBe(9);
    expect(dbVerification.dictionaryCount).toBeGreaterThanOrEqual(6);

    // Patient 1 (In-Consultation / Active Desk)
    expect(dbVerification.patient1.name).toBe('Anita Verma');
    expect(dbVerification.patient1.age).toBe(28);
    expect(dbVerification.patient1.gender).toBe('Female');
    expect(dbVerification.patient1.uhid).toBe('UHID-10482');
    expect(dbVerification.patient1.tokenNumber).toBe('#W-04');
    expect(dbVerification.patient1.consultationType).toBe('walk_in');
    expect(dbVerification.patient1.queueStatus).toBe('in_consultation');
    expect(dbVerification.patient1.isPregnant).toBe(true);
    expect(dbVerification.patient1.pregnancyDetails.trimester).toBe('2nd');
    expect(dbVerification.patient1.pregnancyDetails.gestationalWeeks).toBe(22);
    expect(dbVerification.patient1.allergies).toContain('Penicillin (Severe)');
    expect(dbVerification.patient1.vitals.bp).toBe('110/70');
    expect(dbVerification.patient1.vitals.pulse).toBe(82);
    expect(dbVerification.patient1.vitals.temp).toBe(98.4);
    expect(dbVerification.patient1.vitals.spo2).toBe(99);
    expect(dbVerification.patient1.chiefComplaintSummary).toContain('morning nausea');
    expect(dbVerification.rx1.status).toBe('draft');
    expect(dbVerification.rx1.isFinalized).toBe(false);
    expect(dbVerification.rx1.medications.length).toBeGreaterThan(0);
    expect(dbVerification.rx1.doctorDetails.name).toBe('Dr. Rajesh Sharma, MD');

    // Patient 2 (Waiting - Walk-in)
    expect(dbVerification.patient2.name).toBe('Vikram Singh');
    expect(dbVerification.patient2.age).toBe(45);
    expect(dbVerification.patient2.gender).toBe('Male');
    expect(dbVerification.patient2.uhid).toBe('UHID-10483');
    expect(dbVerification.patient2.tokenNumber).toBe('#W-05');
    expect(dbVerification.patient2.queueStatus).toBe('waiting');
    expect(dbVerification.patient2.consultationType).toBe('walk_in');
    expect(dbVerification.patient2.visitType).toBe('follow_up');
    expect(dbVerification.patient2.allergies).toContain('NKDA');
    expect(dbVerification.patient2.vitals.bp).toBe('124/82');
    expect(dbVerification.patient2.vitals.pulse).toBe(74);

    // Patient 3 (Waiting - Online Booking)
    expect(dbVerification.patient3.name).toBe('Rajesh Patel');
    expect(dbVerification.patient3.age).toBe(54);
    expect(dbVerification.patient3.gender).toBe('Male');
    expect(dbVerification.patient3.uhid).toBe('UHID-10484');
    expect(dbVerification.patient3.tokenNumber).toBe('#ON-12');
    expect(dbVerification.patient3.queueStatus).toBe('waiting');
    expect(dbVerification.patient3.consultationType).toBe('online_booking');
    expect(dbVerification.patient3.scheduledTime).toBe('10:30 AM');
    expect(dbVerification.patient3.vitals.bp).toBe('150/95');

    // Patient 4 (Waiting - Tele-Consultation)
    expect(dbVerification.patient4.name).toBe('Sunita Devi');
    expect(dbVerification.patient4.age).toBe(62);
    expect(dbVerification.patient4.gender).toBe('Female');
    expect(dbVerification.patient4.uhid).toBe('UHID-10485');
    expect(dbVerification.patient4.tokenNumber).toBe('#TC-02');
    expect(dbVerification.patient4.queueStatus).toBe('waiting');
    expect(dbVerification.patient4.consultationType).toBe('tele_consultation');
    expect(dbVerification.patient4.scheduledTime).toBe('11:00 AM');
    expect(dbVerification.patient4.isHandicapped).toBe(true);

    // Patient 5 (Draft Labs)
    expect(dbVerification.patient5.name).toBe('Rahul Roy');
    expect(dbVerification.patient5.age).toBe(35);
    expect(dbVerification.patient5.gender).toBe('Male');
    expect(dbVerification.patient5.uhid).toBe('UHID-10481');
    expect(dbVerification.patient5.tokenNumber).toBe('#W-01');
    expect(dbVerification.patient5.queueStatus).toBe('draft_labs');
    expect(dbVerification.rx5.status).toBe('awaiting_labs');
    expect(dbVerification.rx5.isFinalized).toBe(false);
    expect(dbVerification.rx5.investigationsOrdered.map((i) => i.testName)).toEqual(
      expect.arrayContaining([
        'Complete Blood Count (CBC)',
        'Liver Function Test (LFT)',
        'Ultrasound Abdomen',
      ])
    );

    // Patient 6 (Completed & Finalized)
    expect(dbVerification.patient6.name).toBe('Priya Das');
    expect(dbVerification.patient6.age).toBe(24);
    expect(dbVerification.patient6.gender).toBe('Female');
    expect(dbVerification.patient6.uhid).toBe('UHID-10480');
    expect(dbVerification.patient6.tokenNumber).toBe('#W-02');
    expect(dbVerification.patient6.queueStatus).toBe('completed');
    expect(dbVerification.rx6.status).toBe('finalized');
    expect(dbVerification.rx6.isFinalized).toBe(true);

    // Admin Config Sections
    expect(dbVerification.chiefComplaintsConfig.isMandatory).toBe(true);
    expect(dbVerification.chiefComplaintsConfig.isEnabled).toBe(true);
    expect(dbVerification.vitalsConfig.isMandatory).toBe(true);
    expect(dbVerification.vitalsConfig.isEnabled).toBe(true);
    expect(dbVerification.allergiesConfig.isMandatory).toBe(true);
    expect(dbVerification.diagnosisConfig.isMandatory).toBe(true);
    expect(dbVerification.medicationsConfig.isMandatory).toBe(true);
    expect(dbVerification.investigationsConfig.isMandatory).toBe(false);
    expect(dbVerification.dietAdviceConfig.isMandatory).toBe(false);
    expect(dbVerification.followUpConfig.isMandatory).toBe(true);
    expect(dbVerification.referralAdmitConfig.isMandatory).toBe(false);

    // Custom Dictionary Shortcuts
    expect(dbVerification.shortcuts.pcm).toBe('Tab. Paracetamol 650mg');
    expect(dbVerification.shortcuts.amox).toBe('Cap. Amoxicillin 500mg');
    expect(dbVerification.shortcuts.htn).toBe('Essential Hypertension');
    expect(dbVerification.shortcuts.t2dm).toBe('Type 2 Diabetes Mellitus');
    expect(dbVerification.shortcuts.odPc).toBe('Once daily after food');
    expect(dbVerification.shortcuts.bdPc).toBe('Twice daily after food (Morning & Night)');
  });

  test('verifies clinical workflow state transitions (call, labs, finalize)', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => !!window.hospitalDb && !!window.hospitalDbSeed);

    const workflowResult = await page.evaluate(async () => {
      const db = window.hospitalDb;
      const seed = window.hospitalDbSeed;
      await seed.resetDatabase(db);

      // 1. Call waiting patient 2 (Vikram Singh) to consultation
      const pat2Before = await db.patients.get('pat_10483');
      const initialRxCount = await db.prescriptions.count();

      // Transition pat2 to in_consultation and generate draft rx
      await db.patients.update('pat_10483', {
        queueStatus: 'in_consultation',
        consultationStartTime: new Date().toISOString(),
      });
      const newRxId = 'rx_10483';
      await db.prescriptions.add({
        id: newRxId,
        patientId: 'pat_10483',
        status: 'draft',
        isFinalized: false,
        chiefComplaints: [],
        clinicalObservations: 'Post typhoid follow up; vitals stable.',
        diagnosis: { provisional: 'Post-typhoid convalescence', final: '', icd10Code: 'A01.0' },
        medications: [],
        investigationsOrdered: [],
        dietaryAdvice: 'High protein nutrition',
        referrals: { department: '', doctorName: '', reason: '' },
        isAdmitRecommended: false,
        followUp: { timeline: '1 Week', date: '2026-10-29', notes: 'Routine follow up' },
        doctorDetails: seed.DEFAULT_DOCTOR_DETAILS,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const pat2InConsult = await db.patients.get('pat_10483');
      const rxPat2Draft = await db.prescriptions.get(newRxId);

      // 2. Order labs for Vikram Singh and transition to draft_labs
      await db.patients.update('pat_10483', { queueStatus: 'draft_labs' });
      await db.prescriptions.update(newRxId, {
        status: 'awaiting_labs',
        investigationsOrdered: [{ testName: 'Widal Re-check', category: 'Blood', status: 'ordered' }],
      });
      const pat2InLabs = await db.patients.get('pat_10483');
      const rxPat2Labs = await db.prescriptions.get(newRxId);

      // 3. Finalize prescription and complete consultation
      await db.patients.update('pat_10483', { queueStatus: 'completed' });
      await db.prescriptions.update(newRxId, { status: 'finalized', isFinalized: true });
      const pat2Completed = await db.patients.get('pat_10483');
      const rxPat2Finalized = await db.prescriptions.get(newRxId);

      return {
        initialStatus: pat2Before.queueStatus,
        inConsultStatus: pat2InConsult.queueStatus,
        rxDraftStatus: rxPat2Draft.status,
        inLabsStatus: pat2InLabs.queueStatus,
        rxLabsStatus: rxPat2Labs.status,
        completedStatus: pat2Completed.queueStatus,
        rxFinalizedStatus: rxPat2Finalized.status,
        rxIsFinalized: rxPat2Finalized.isFinalized,
      };
    });

    expect(workflowResult.initialStatus).toBe('waiting');
    expect(workflowResult.inConsultStatus).toBe('in_consultation');
    expect(workflowResult.rxDraftStatus).toBe('draft');
    expect(workflowResult.inLabsStatus).toBe('draft_labs');
    expect(workflowResult.rxLabsStatus).toBe('awaiting_labs');
    expect(workflowResult.completedStatus).toBe('completed');
    expect(workflowResult.rxFinalizedStatus).toBe('finalized');
    expect(workflowResult.rxIsFinalized).toBe(true);
  });
});
