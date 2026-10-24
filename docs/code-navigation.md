# Code Navigation & Developer Recipes
[Back to Master Index](README.md)

This document serves as an architectural cheat sheet, custom hooks catalog, and practical guide for extending the codebase.

---

## 1. High-Impact Files & Core Responsibilities

| File Path | Primary Responsibility |
| :--- | :--- |
| [`src/App.jsx`](../src/App.jsx) | Root application component, HTML5 history client-side router, top route navigation bar, and lazy loader. |
| [`src/main.jsx`](../src/main.jsx) | Application entry point wrapping the root tree in `<SecurityProvider>`. |
| [`src/security/useSecurityGuard.js`](../src/security/useSecurityGuard.js) | Production anti-capture, screenshot prevention, watermark tampering detection, and print whitelisting. |
| [`src/db/hospitalDb.js`](../src/db/hospitalDb.js) | OPD triage, prescription, and hospital metrics Dexie database instance. |
| [`src/db/database.js`](../src/db/database.js) | Healthcare cryptographic URL generator and clinical document viewer database instance. |
| [`src/services/callCenterDb.js`](../src/services/callCenterDb.js) | IndexedDB database instance hosting 3,150+ realistic call records for analytics. |
| [`src/components/consultation/OpdConsultationWorkspace.jsx`](../src/components/consultation/OpdConsultationWorkspace.jsx) | Central outpatient consultation workspace, autosave coordinator, and prescription manager. |
| [`src/components/queue/OpdQueueScreen.jsx`](../src/components/queue/OpdQueueScreen.jsx) | 5-lane Kanban triage board, active room calling, and patient search coordinator. |
| [`src/components/crm/HospitalCrmApp.jsx`](../src/components/crm/HospitalCrmApp.jsx) | Root container for the ABCD Omnichannel CRM workspace. |
| [`src/components/portfolio/DeveloperPortfolioHome.jsx`](../src/components/portfolio/DeveloperPortfolioHome.jsx) | Developer portfolio, interactive product showcase, and vector tech stack badges. |

---

## 2. Custom Hooks Catalog

### `useHospitalData()`
- **File**: [`src/hooks/useHospitalData.js`](../src/hooks/useHospitalData.js)
- **Signature**: `useHospitalData()`
- **Returns**: `{ patients, prescriptions, adminConfig, customDictionary, hospitalStats, isLoading }`
- **Purpose**: Subscribes to live queries on `HospitalOPD_DB` using `useLiveQuery`. Any write to the database automatically triggers a reactive UI update without manual polling.

### `useSecurityGuard()`
- **File**: [`src/security/useSecurityGuard.js`](../src/security/useSecurityGuard.js)
- **Signature**: `useSecurityGuard(customConfig = {})`
- **Returns**: `{ isBlackedOut, blackoutReason, securityIncidentCount, lastIncident, isWatermarkTampered, isShieldActive, triggerBlackout, clearBlackout }`
- **Purpose**: Monitors keyboard events (`PrintScreen`, `Cmd+Shift+3/4`), browser blur events, and DOM tampering on watermarks to safeguard sensitive clinical patient data.

### `useChatSession({ tenantId })`
- **File**: [`src/hooks/useChatSession.js`](../src/hooks/useChatSession.js)
- **Signature**: `useChatSession({ tenantId })`
- **Returns**: `{ sessionId, messages, isLoadingHistory, isTyping, sendMessage, injectAssistantMessage, startBookingFlow, submitPatientForm, confirmBooking }`
- **Purpose**: Manages conversational message stream, appointment booking state machine, and multi-tenant HTTP REST calls.

### `useSpeechRecognition()`
- **File**: [`src/hooks/useSpeechRecognition.js`](../src/hooks/useSpeechRecognition.js)
- **Signature**: `useSpeechRecognition({ onTranscript, lang = "en-US" })`
- **Returns**: `{ isListening, transcript, interimTranscript, startListening, stopListening, isSupported }`
- **Purpose**: Wrapper over native browser `webkitSpeechRecognition` supporting continuous dictation and microphone streaming.

### `useSpeechSynthesis()`
- **File**: [`src/hooks/useSpeechSynthesis.js`](../src/hooks/useSpeechSynthesis.js)
- **Signature**: `useSpeechSynthesis()`
- **Returns**: `{ speak, cancel, isSpeaking, voices }`
- **Purpose**: Text-to-speech voice synthesizer for waiting room token calling announcements.

### `useOpenSound()`
- **File**: [`src/hooks/useOpenSound.js`](../src/hooks/useOpenSound.js)
- **Signature**: `playNotificationChime()`, `playCallingChime()`
- **Purpose**: Synthetic audio frequency generator via the browser's native `AudioContext`. Requires zero external MP3/WAV audio files.

### `useBehavioralTrigger()`
- **File**: [`src/hooks/useBehavioralTrigger.js`](../src/hooks/useBehavioralTrigger.js)
- **Signature**: `useBehavioralTrigger({ enabled = true })`
- **Returns**: `{ trigger, dismiss, consume }`
- **Purpose**: MutationObserver hook tracking `document.body` attributes (`data-hospital-department`) to surface contextual chatbot greetings.

### `useLocalStorage()`
- **File**: [`src/hooks/useLocalStorage.js`](../src/hooks/useLocalStorage.js)
- **Signature**: `useLocalStorage(key, initialValue)`
- **Returns**: `[value, setValue]`
- **Purpose**: Resilient typed `localStorage` wrapper with JSON serialization, error handling, and storage event synchronization across tabs.

---

## 3. Developer Extension Recipes

### Recipe 1: How to Add a New Route to the Application

1. Open [`src/App.jsx`](../src/App.jsx).
2. Add the new route path to the `validPaths` array in the `syncRoute` effect:
   ```javascript
   const validPaths = [
     "/",
     "/chatbot",
     // ... existing routes
     "/my-new-feature", // <-- Add new route
   ];
   ```
3. Add a boolean flag:
   ```javascript
   const showMyNewFeature = pathname === "/my-new-feature";
   ```
4. Lazy load the component at the top of `App.jsx`:
   ```javascript
   const MyNewFeature = lazy(() => import("./components/my-feature/MyNewFeature.jsx"));
   ```
5. Render conditionally before the default portfolio fallback:
   ```javascript
   if (showMyNewFeature) {
     return (
       <Suspense fallback={<LoadingSkeleton />}>
         <MyNewFeature navigateTo={navigateTo} />
       </Suspense>
     );
   }
   ```
6. Add the route to [vercel.json](../vercel.json) rewrites if needed (already handled by wildcard `/(.*)`).

---

### Recipe 2: How to Add a Store or Field to Dexie IndexedDB

1. Open [`src/db/hospitalDb.js`](../src/db/hospitalDb.js).
2. Increment the database schema version:
   ```javascript
   hospitalDb.version(4).stores({
     // Retain existing stores...
     myNewStore: "id, patientId, createdAt, status", // Primary key + indexed fields
   });
   ```
   > [!IMPORTANT]
   > In Dexie, only fields used in `.where()`, `.orderBy()`, or compound queries need to be listed in the store definition. All other non-indexed JSON properties are persisted automatically.

---

### Recipe 3: How to Add a Clinical Section to the Digital Prescription

1. **State Definition**: In [`src/components/consultation/OpdConsultationWorkspace.jsx`](../src/components/consultation/OpdConsultationWorkspace.jsx), add the initial property to `rxForm`:
   ```javascript
   const [rxForm, setRxForm] = useState({
     // ...
     immunizationHistory: [], // <-- New field
   });
   ```
2. **Navigation Tree**: In [`src/components/consultation/PrescriptionSectionTree.jsx`](../src/components/consultation/PrescriptionSectionTree.jsx), add the section to `sections`:
   ```javascript
   {
     id: "sec-immunization",
     label: "Immunization History",
     icon: ShieldAlert,
     badge: rxForm.immunizationHistory?.length || null,
   }
   ```
3. **NABH Lock Evaluation**: If mandatory, update [`src/components/consultation/MandatoryProgressChecklist.jsx`](../src/components/consultation/MandatoryProgressChecklist.jsx) to include the completion condition in `checklistItems`.
4. **Print Sheet**: Add the corresponding rendering block in [`src/components/consultation/DigitalPrescriptionPreviewPane.jsx`](../src/components/consultation/DigitalPrescriptionPreviewPane.jsx).

---

### Recipe 4: How to Add a New Communication Channel to the CRM

1. Open [`src/components/crm/ChannelIcon.jsx`](../src/components/crm/ChannelIcon.jsx).
2. Add the SVG vector logo for the new channel (e.g. `"telegram"` or `"sms"`).
3. Open [`src/components/crm/CrmUnifiedInbox.jsx`](../src/components/crm/CrmUnifiedInbox.jsx):
   - Add the channel key to `CHANNEL_FILTERS`.
   - Update filter logic to match `conversation.channel === "telegram"`.
4. Open [`src/components/crm/crmMockData.js`](../src/components/crm/crmMockData.js) and append sample mock conversations containing the new channel identifier.
