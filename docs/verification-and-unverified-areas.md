# Verification, Gaps & Unverified Areas
[Back to Master Index](README.md)

This document provides a critical technical audit of the codebase, distinguishing **verified source code implementations** from **simulated/mock behaviors**, identifying architectural discrepancies, and cataloging questions requiring manual verification or production hardening.

---

## 1. Verified Implementation vs. Simulated Behaviors

| Component / Layer | Verified In Source Code | Simulated / Mock Implementation | Production Requirement |
| :--- | :--- | :--- | :--- |
| **IndexedDB Persistence** | Yes (`Dexie.js` v1-v3 stores, queries, live hooks). | None. Runs against real browser IndexedDB engine. | Real client-side database; production-ready for offline clinical caching. |
| **Bilingual Translation** | Yes (Telugu/English clinical dictionary in `translationProvider.js`). | Dictionary is client-side static; not connected to a live translation API. | Connect to Hospital LLM API for dynamic non-templated clinical notes. |
| **Conversational Chatbot** | Yes (Widget UI, session hook, file upload progress). | Default `VITE_CHAT_MOCK_MODE=true` falls back to `mockResponses.js`. | Real medical NLP backend (e.g. Rasa, OpenAI, LangChain) at `VITE_API_BASE_URL`. |
| **CRM Inbound Webhooks** | Yes (3-panel UI, channel icons, filters, status transitions). | Mock dataset (`crmMockData.js`) in-memory. | Webhook receivers for Meta WhatsApp Cloud API, Instagram Graph API, IMAP. |
| **Call Center Recordings** | Yes (AudioPlayer waveform, playback speed, transcripts). | Audio synthesized via Web Audio / base64 tones; 3,150+ calls generated in IndexedDB. | Amazon S3 / CloudFront storage for actual WAV/MP3 stereo clinical recordings. |
| **Speech-to-Text** | Yes (Native browser `SpeechRecognition` implementation). | Browser-dependent (requires Chrome/Edge or WebKit Speech support). | Fallback to whisper/server-side ASR for browsers lacking native speech APIs. |

---

## 2. Identified Discrepancies & Library Audits

### 2.1 Unused Dependencies: `zod` and `react-hook-form`
- **Finding**: In [`package.json`](../package.json), `"zod": "^4.6.7"` and `"react-hook-form": "^7.90.0"` are declared as dependencies.
- **Audit**: Comprehensive AST search across `src/` confirms that **neither package is imported or invoked** in any component or service.
- **Current Pattern**: All forms (e.g. `PatientRegistrationForm.jsx`, `QuickPatientIntakeModal.jsx`, `LabReportForm.jsx`, `TelehealthForm.jsx`) utilize native React `useState` and inline imperative validation logic.
- **Architectural Recommendation**:
  - *Option A*: Adopt `zod` and `react-hook-form` across forms to reduce boilerplate and enforce strict type schemas.
  - *Option B*: Remove both packages from `package.json` to decrease `node_modules` footprint if native React controlled forms are preferred.

---

### 2.2 Validation Inconsistencies: Client vs. Backend EHR Expectations

1. **Patient Age Field**:
   - In [`QuickPatientIntakeModal.jsx`](../src/components/queue/QuickPatientIntakeModal.jsx#L89):
     ```javascript
     age: parseInt(formData.age, 10) || 30,
     ```
   - *Risk*: If age is left blank or unentered by the triage nurse, it silently defaults to `30`. In pediatric or geriatric cases, this can lead to severe dosage miscalculations in subsequent prescription phases.
   - *Fix*: Make `age` an explicitly required field with range validation ($0 \le \text{age} \le 125$).

2. **Blood Pressure Vitals**:
   - In [`QuickPatientIntakeModal.jsx`](../src/components/queue/QuickPatientIntakeModal.jsx#L78):
     ```javascript
     const sys = parseInt(formData.sys, 10) || 120;
     const dia = parseInt(formData.dia, 10) || 80;
     ```
   - *Risk*: Blank BP fields silently default to normal BP (`120/80 mmHg`), potentially masking actual hypotension or severe hypertensive emergencies.

3. **Short Link Cryptographic Collision Threshold**:
   - In [`src/services/shortUrlService.js`](../src/services/shortUrlService.js):
     ```javascript
     const MAX_COLLISION_RETRIES = 10;
     ```
   - *Behavior*: If a cryptographic 7-character token collides 10 times consecutively with existing keys in IndexedDB, the function throws an unhandled error. While statistically improbable with Base56 ($56^7 \approx 1.7 \times 10^{12}$ combinations), high-concurrency production deployments should handle this with exponential backoff or key pre-generation.

---

## 3. Manual Verification & QA Checklists

### Checklist A: Vercel SPA Routing & Refresh
- [ ] Deploy latest commit containing [vercel.json](../vercel.json) to Vercel.
- [ ] Navigate directly to deep URL: `https://<your-vercel-domain>/opd-queue`.
- [ ] Refresh the page (`F5` or `Ctrl+R`). Verify the OPD Live Queue renders without a `404 NOT_FOUND` error.
- [ ] Navigate directly to `https://<your-vercel-domain>/crm`. Refresh and verify the CRM loads properly.

### Checklist B: IndexedDB Persistence & Seeding
- [ ] Open browser DevTools $\rightarrow$ Application $\rightarrow$ IndexedDB.
- [ ] Verify `HospitalOPD_DB` contains stores: `patients`, `prescriptions`, `adminConfig`, `customDictionary`, `hospitalStats`, `dailyStats`.
- [ ] Confirm `patients` contains 18 seeded records on initial visit.
- [ ] Create a new walk-in patient via "Quick Patient Intake".
- [ ] Reload browser window. Confirm the newly added patient persists in the Waiting column.

### Checklist C: Forensic Watermark & Anti-Capture Shield
- [ ] Navigate to `/opd-consultation`.
- [ ] Verify diagonal forensic watermark displays the current Doctor UHID, IP, and live timestamp.
- [ ] Attempt to inspect or delete the watermark element in DOM inspector. Verify the `MutationObserver` instantly detects tampering and initiates screen blackout.
- [ ] Press `Ctrl + P` (or click "Print Prescription"). Verify that valid clinical printing is whitelisted and does not trigger screen blackout.
- [ ] Switch to another browser tab or minimize window. Confirm `useSecurityGuard` blacks out the screen.

### Checklist D: NABH 4-Stage Lock Verification
- [ ] Open a new patient consultation in `/opd-consultation`.
- [ ] Observe the "Finalize, Sign & Submit Rx" button. Verify it is disabled with amber alert `"Complete 4 required sections to unlock Finalize"`.
- [ ] Enter Chief Complaints $\rightarrow$ Verify Checkpoint 1 passes.
- [ ] Enter Vitals (BP + Pulse) $\rightarrow$ Verify Checkpoint 2 passes.
- [ ] Confirm Allergy status (or select NKDA) $\rightarrow$ Verify Checkpoint 3 passes.
- [ ] Enter Provisional Diagnosis $\rightarrow$ Verify Checkpoint 4 passes.
- [ ] Confirm the "Finalize, Sign & Submit Rx" button becomes active and teal.

---

## 4. Questions Requiring Manual Verification / Architectural Decisions

1. **Ayushman Bharat Digital Mission (ABDM) / FHIR Compatibility**:
   - Does the hospital require ABDM M1, M2, and M3 compliance for digital health records?
   - *Recommendation*: Map the `rxForm` schema in `hospitalDb.js` directly to HL7 FHIR `MedicationRequest` and `Condition` resource bundles.
2. **Multi-tenant Backend Authorization**:
   - The frontend currently passes `X-Tenant-Id: sunrise-hospital-main` or custom tenant strings. Is backend token validation (JWT) or mTLS planned for multi-hospital deployments?
3. **Data Purge Policy for Call Center Records**:
   - The browser IndexedDB currently stores 3,150+ records (~15 MB). A periodic eviction policy or IndexedDB size check should be established for low-storage mobile tablets.
