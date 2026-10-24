# Feature Documentation & Clinical Workflows
[Back to Master Index](README.md)

This document provides an in-depth architectural and operational breakdown of the 10 core healthcare modules and clinical security features within the platform.

---

## 1. Feature Catalog

1. [Developer Portfolio & Interactive Product Suite](#1-developer-portfolio--interactive-product-suite)
2. [AI Patient Service & Clinical Chatbot Widget](#2-ai-patient-service--clinical-chatbot-widget)
3. [Hospital Call Center Quality Analytics & Coaching](#3-hospital-call-center-quality-analytics--coaching)
4. [Clinical Speech-to-Text Dictation](#4-clinical-speech-to-text-dictation)
5. [OP Token Generator & Waiting Room Announcer](#5-op-token-generator--waiting-room-announcer)
6. [Hospital Operational Stats & Throughput Dashboard](#6-hospital-operational-stats--throughput-dashboard)
7. [ABCD OPD Live Queue & Triage Desk](#7-abcd-opd-live-queue--triage-desk)
8. [NABH OPD Consultation & AI Digital Prescription](#8-nabh-opd-consultation--ai-digital-prescription)
9. [ABCD Omnichannel CRM Unified Inbox](#9-abcd-omnichannel-crm-unified-inbox)
10. [Healthcare URL Shortener & Patient Micro-Portals](#10-healthcare-url-shortener--patient-micro-portals)
11. [Clinical Forensic Privacy Shield & Watermarking](#11-clinical-forensic-privacy-shield--watermarking)

---

## 1. Developer Portfolio & Interactive Product Suite

- **Routes**: `/`, `/portfolio`, `/home`, `/products`, `/suite`
- **Primary Components**:
  - [`src/components/portfolio/DeveloperPortfolioHome.jsx`](../src/components/portfolio/DeveloperPortfolioHome.jsx)
  - [`src/components/portfolio/TechStackIcon.jsx`](../src/components/portfolio/TechStackIcon.jsx)
- **Purpose**: Showcases the engineer's technical profile, enterprise healthcare background, and serves as an interactive launcher for the 8 live product modules.
- **Key Capabilities**:
  - High-fidelity interactive cards with direct launchers to OPD Queue, Consultation, CRM Inbox, Call Center, etc.
  - Categorized Technical Skills section with vector brand logos (*Frontend Architecture*, *Backend & APIs*, *Databases & Storage*, *Cloud & Integrations*, *DevOps & Tools*).
  - Searchable and categorized full-stack project portfolio.

---

## 2. AI Patient Service & Clinical Chatbot Widget

- **Route**: `/chatbot` (Widget default open on load)
- **Primary Components**:
  - [`src/components/ChatWidget.jsx`](../src/components/ChatWidget.jsx)
  - [`src/components/ChatHeader.jsx`](../src/components/ChatHeader.jsx)
  - [`src/components/ChatMessages.jsx`](../src/components/ChatMessages.jsx)
  - [`src/components/ChatInput.jsx`](../src/components/ChatInput.jsx)
  - [`src/components/PatientRegistrationForm.jsx`](../src/components/PatientRegistrationForm.jsx)
  - [`src/components/DoctorCard.jsx`](../src/components/DoctorCard.jsx)
  - [`src/components/AttachmentComposer.jsx`](../src/components/AttachmentComposer.jsx)
  - [`src/hooks/useChatSession.js`](../src/hooks/useChatSession.js)
  - [`src/hooks/useBehavioralTrigger.js`](../src/hooks/useBehavioralTrigger.js)
- **Workflow & Business Rules**:
  1. **Conversational Intake**: Triage inquiries are evaluated by NLP intent matching.
  2. **Multi-lingual Support**: Supports English, Telugu, Hindi, and Spanish via `LanguageContext`.
  3. **Structured Booking Flow**: Tapping "Book Appointment" renders an inline `PatientRegistrationForm`. Submitting freezes the form into an immutable card and surfaces available doctor cards with real-time slot selection.
  4. **Proactive Behavioral Triggers**: `useBehavioralTrigger` monitors DOM attributes (`data-hospital-department`) via a `MutationObserver` to pop contextual bubble suggestions (e.g. suggesting an ENT doctor on an ENT clinic page).
  5. **File Uploads**: Drag-and-drop or attachment button supporting PDF/images with visual progress bars.

---

## 3. Hospital Call Center Quality Analytics & Coaching

- **Route**: `/insights`
- **Primary Components**:
  - [`src/components/InsightsDashboard.jsx`](../src/components/InsightsDashboard.jsx)
  - [`src/components/AudioPlayer.jsx`](../src/components/AudioPlayer.jsx)
  - [`src/services/callCenterDb.js`](../src/services/callCenterDb.js)
- **Workflow & Business Rules**:
  1. **Dataset**: 3,150+ realistic call records indexed in `HospitalCallCenterDB` across 12 agents.
  2. **Interactive Audio Waveform**: Built with Canvas-based rendering, playback controls, variable speeds ($0.75\times$ to $2\times$), and word-by-word synchronized transcript highlighting.
  3. **Call Center Scorecards**: Real-time evaluation of Average Handle Time (AHT), First Call Resolution (FCR), customer sentiment (Positive/Neutral/Negative), and automated coaching tips.

---

## 4. Clinical Speech-to-Text Dictation

- **Route**: `/speech-to-text`
- **Primary Components**:
  - [`src/components/SpeechToText.jsx`](../src/components/SpeechToText.jsx)
  - [`src/hooks/useSpeechRecognition.js`](../src/hooks/useSpeechRecognition.js)
- **Workflow & Business Rules**:
  1. Captures doctor voice notes via the native browser `webkitSpeechRecognition` engine.
  2. Real-time visual audio waveform animation during active speech.
  3. Supports continuous dictation, interim transcript streaming, punctuation commands, and single-click copy/export to clinical notes.

---

## 5. OP Token Generator & Waiting Room Announcer

- **Routes**: `/tokens`, `/waiting-pool`, `/announcer`
- **Primary Components**:
  - [`src/components/TokenDesk.jsx`](../src/components/TokenDesk.jsx)
  - [`src/hooks/useSpeechSynthesis.js`](../src/hooks/useSpeechSynthesis.js)
  - [`src/hooks/useOpenSound.js`](../src/hooks/useOpenSound.js)
- **Workflow & Business Rules**:
  1. **Token Dispenser**: Generates sequential daily tokens (`#W-01`, `#W-02`, etc.) with department and priority routing.
  2. **Thermal Ticket Simulation**: Renders a printable/downloadable physical token slip with QR code.
  3. **Waiting Room Announcer**: High-contrast dual-monitor display that plays an audible synthetic chime (`useOpenSound`) and speaks the token number and room destination via native `speechSynthesis`.

---

## 6. Hospital Operational Stats & Throughput Dashboard

- **Route**: `/hospital-stats`
- **Primary Components**:
  - [`src/components/hospital-stats/HospitalStatsDashboard.jsx`](../src/components/hospital-stats/HospitalStatsDashboard.jsx)
  - [`src/services/hospitalStatsService.js`](../src/services/hospitalStatsService.js)
  - [`src/db/hospitalDb.js`](../src/db/hospitalDb.js)
- **Workflow & Business Rules**:
  1. Real-time monitoring of bed occupancy across Emergency, ICU, General Wards, and Post-Op.
  2. Visual alerts when occupancy exceeds 85% or doctor-to-patient ratio exceeds safe clinical thresholds.
  3. Historical daily logging saved directly into IndexedDB (`dailyStats` store).

---

## 7. ABCD OPD Live Queue & Triage Desk

- **Routes**: `/opd-queue`, `/opd/queue`, `/opd/dashboard`
- **Primary Components**:
  - [`src/components/queue/OpdQueueScreen.jsx`](../src/components/queue/OpdQueueScreen.jsx)
  - [`src/components/queue/PatientQueueCard.jsx`](../src/components/queue/PatientQueueCard.jsx)
  - [`src/components/queue/ActiveDeskBanner.jsx`](../src/components/queue/ActiveDeskBanner.jsx)
  - [`src/components/queue/QuickPatientIntakeModal.jsx`](../src/components/queue/QuickPatientIntakeModal.jsx)
  - [`src/components/opd-portal/DoctorOpdDashboard.jsx`](../src/components/opd-portal/DoctorOpdDashboard.jsx)
  - [`src/components/opd-portal/OpdSidebar.jsx`](../src/components/opd-portal/OpdSidebar.jsx)
- **Workflow & Business Rules**:
  1. **5-Lane Kanban Triage Board**:
     - *Walk-In* (Default lobby queue)
     - *Online Booked* (Scheduled appointment slots)
     - *Tele-Consultation* (Remote video patients)
     - *Sent for Labs / Drafts* (Awaiting diagnostics)
     - *Completed* (Digitally finalized & signed prescriptions)
  2. **Quick Intake**: Doctor or desk nurse can immediately register walk-in patients with custom vitals and auto-calculated BMI.
  3. **Active Desk Banner**: Highlights the currently active in-room consultation with elapsed timer and single-click access to the consultation workspace.

---

## 8. NABH OPD Consultation & AI Digital Prescription

- **Routes**: `/opd-consultation`, `/opd-consultation/:id`
- **Primary Components**:
  - [`src/components/consultation/OpdConsultationWorkspace.jsx`](../src/components/consultation/OpdConsultationWorkspace.jsx)
  - [`src/components/consultation/PrescriptionSectionTree.jsx`](../src/components/consultation/PrescriptionSectionTree.jsx)
  - [`src/components/consultation/ConsultationPatientHeader.jsx`](../src/components/consultation/ConsultationPatientHeader.jsx)
  - [`src/components/consultation/ConsultationRightPane.jsx`](../src/components/consultation/ConsultationRightPane.jsx)
  - [`src/components/consultation/DigitalPrescriptionPreviewPane.jsx`](../src/components/consultation/DigitalPrescriptionPreviewPane.jsx)
  - [`src/components/consultation/AiCdssAlertCard.jsx`](../src/components/consultation/AiCdssAlertCard.jsx)
  - [`src/components/consultation/MandatoryProgressChecklist.jsx`](../src/components/consultation/MandatoryProgressChecklist.jsx)
  - [`src/components/consultation/TelehealthVideoDock.jsx`](../src/components/consultation/TelehealthVideoDock.jsx)
- **Workflow & Business Rules**:
  1. **Top Patient Header**: Sticky banner displaying UHID, Vitals, High-risk alerts (Pregnancy, Allergies), Autosave status, and Step Navigation (`1 Prescription`, `2 Print Preview`).
  2. **Structured Prescription Sheet**:
     - Chief Complaints (Complaints tree, severity, duration).
     - Clinical Observations & Physical Exam.
     - Vitals Entry (Systolic, Diastolic, HR, SpO2, Temp, BMI).
     - Provisional & Final ICD Diagnosis.
     - Medication Builder (Generic/brand search, dosage, frequency `1-0-1`, timing `Before/After food`, duration).
     - Lab & Radiology Order Module.
     - Diet & Follow-up Advice.
  3. **NABH Mandatory Completion Lock**: "Finalize, Sign & Submit Rx" button remains locked until all 4 required clinical sections are fulfilled.
  4. **Bilingual Telugu Translation**: Instant toggle translates all drug timings, frequencies, and advice into Telugu for patient safety.
  5. **Telehealth Dock**: Floating, draggable video consultation dock with call controls for remote appointments.
  6. **A4 Paper Print Preview**: Renders compliant A4 clinical prescription with clinic branding, doctor signature, QR code, and print CSS styling.

---

## 9. ABCD Omnichannel CRM Unified Inbox

- **Routes**: `/crm`, `/inbox`, `/omnichannel-crm`
- **Primary Components**:
  - [`src/components/crm/HospitalCrmApp.jsx`](../src/components/crm/HospitalCrmApp.jsx)
  - [`src/components/crm/CrmUnifiedInbox.jsx`](../src/components/crm/CrmUnifiedInbox.jsx)
  - [`src/components/crm/CrmLeadsView.jsx`](../src/components/crm/CrmLeadsView.jsx)
  - [`src/components/crm/CrmAppointmentsView.jsx`](../src/components/crm/CrmAppointmentsView.jsx)
  - [`src/components/crm/CrmAutomationView.jsx`](../src/components/crm/CrmAutomationView.jsx)
  - [`src/components/crm/CrmAnalyticsView.jsx`](../src/components/crm/CrmAnalyticsView.jsx)
  - [`src/components/crm/CrmAgentSelfReportView.jsx`](../src/components/crm/CrmAgentSelfReportView.jsx)
  - [`src/components/crm/CrmChannelsReportView.jsx`](../src/components/crm/CrmChannelsReportView.jsx)
  - [`src/components/crm/ChannelIcon.jsx`](../src/components/crm/ChannelIcon.jsx)
- **Workflow & Business Rules**:
  1. **3-Panel Unified Inbox**:
     - *Left Panel*: Conversation threads filtered by channel (WhatsApp, Messenger, Instagram, Threads, LinkedIn, Webchat, Email), unread counts, and priority tags.
     - *Center Panel*: Active chat history with message composer, canned quick replies, and attachment previews.
     - *Right Drawer*: Patient CRM profile, lead stage (New, Contacted, Qualified, Booked), department assignment, and appointment status.
  2. **Agent Self-Report**: Metrics tracking total calls vs answered vs missed, total active handling hours, and evidence-based tips to improve.
  3. **Channel Performance Analytics**: Breakdown of conversion rates, peak traffic hours, and channel health scores.
  4. **Agent Profile Editor**: Custom modal to update agent name, role, email, and avatar photo.

---

## 10. Healthcare URL Shortener & Patient Micro-Portals

- **Routes**: `/url-generator`, `/s/:id`, `/reports/:id`, `/telehealth/:id`, `/feedback/:id`, `/survey/:id`
- **Primary Components**:
  - [`src/components/url-generator/HealthcareUrlGenerator.jsx`](../src/components/url-generator/HealthcareUrlGenerator.jsx)
  - [`src/components/url-generator/ShortCodeResolver.jsx`](../src/components/url-generator/ShortCodeResolver.jsx)
  - [`src/components/url-generator/LabReportForm.jsx`](../src/components/url-generator/LabReportForm.jsx) & `LabReportViewer.jsx`
  - [`src/components/url-generator/TelehealthForm.jsx`](../src/components/url-generator/TelehealthForm.jsx) & `TelehealthViewer.jsx`
  - [`src/components/url-generator/FeedbackForm.jsx`](../src/components/url-generator/FeedbackForm.jsx) & `FeedbackViewer.jsx`
  - [`src/components/url-generator/SurveyForm.jsx`](../src/components/url-generator/SurveyForm.jsx) & `SurveyViewer.jsx`
  - [`src/services/shortUrlService.js`](../src/services/shortUrlService.js)
- **Workflow & Business Rules**:
  1. **Cryptographic Shortening**: Generates Base56 unpredictable 7-character tokens with automatic collision mitigation.
  2. **6 Document Types**: Supports generation and viewing of Lab Reports, Telehealth Links, Feedback Forms, Surveys, OPD Prescriptions, and Discharge Summaries.
  3. **Micro-Portal Resolution**: Visiting `/s/:shortCode` automatically queries IndexedDB, verifies expiration status, and mounts the corresponding custom viewer.
  4. **Sharing Hub**: Generates dynamic QR codes, one-click copy links, and direct WhatsApp sharing links (`https://wa.me/?text=...`).

---

## 11. Clinical Forensic Privacy Shield & Watermarking

- **Source Directory**: [`src/security/`](../src/security/)
- **Primary Components**:
  - [`src/security/SecurityProvider.jsx`](../src/security/SecurityProvider.jsx)
  - [`src/security/useSecurityGuard.js`](../src/security/useSecurityGuard.js)
  - [`src/security/ForensicWatermark.jsx`](../src/security/ForensicWatermark.jsx)
  - [`src/security/BlackoutOverlay.jsx`](../src/security/BlackoutOverlay.jsx)
  - [`src/security/SecurityBadge.jsx`](../src/security/SecurityBadge.jsx)
- **Workflow & Business Rules**:
  1. **Forensic Watermark**: Transparent diagonal overlay rendered across clinical screens displaying the current doctor's UHID, IP address, and real-time timestamp. Watermark DOM is protected against tamper/deletion via a `MutationObserver`.
  2. **Anti-Capture Screen Blackout**: Automatically blacks out sensitive patient screens when:
     - User presses `PrintScreen` or capture keyboard shortcuts.
     - Browser window loses focus or user switches tabs.
  3. **Print Whitelisting**: Legitimate clinical printing (e.g. printing an A4 digital prescription or thermal queue slip) is explicitly whitelisted via `window.matchMedia('print')` and print handlers so blackout is not triggered during valid doctor operations.
