# Project Overview
[Back to Master Index](README.md)

## 1. Executive Summary & Purpose

The **ABCD Multispecialty Hospital – Digital Health Suite** is an enterprise-grade healthcare web application designed to bridge patient engagement, clinical consultation workflows, hospital administrative triage, call center performance analytics, and secure clinical document generation.

Originally initiated as an embeddable AI patient chatbot widget, the codebase has evolved into a full-scale clinical suite featuring 10 integrated modules running on modern web standards with high performance, client-side offline persistence, and clinical forensic privacy protection.

---

## 2. Main Features & Modules

| # | Module Name | Route(s) | Primary Purpose & Implementation |
| :--- | :--- | :--- | :--- |
| **1** | **Developer Portfolio & Showcase** | `/`, `/portfolio`, `/products`, `/suite` | Comprehensive interactive product suite catalog, developer background, interactive product cards, and categorized tech stack chips with vector logos. |
| **2** | **AI Patient Chatbot Widget** | `/chatbot` | Conversational triage bot supporting slot booking, doctor recommendations, file uploads with real-time progress, multi-language speech, and proactive triggers. |
| **3** | **Call Center Analytics & Coaching** | `/insights` | Quality audit workspace featuring synchronized audio waveform playback, word-by-word transcription, sentiment scoring, and agent performance scorecards. |
| **4** | **Clinical Speech-to-Text** | `/speech-to-text` | Real-time medical dictation tool leveraging native browser Web Speech recognition with live waveform visualization, editing, and clinical exporting. |
| **5** | **OP Token Generator & Announcer** | `/tokens`, `/waiting-pool`, `/announcer` | Outpatient queue token generation desk, thermal ticket simulation, and dual-monitor waiting room audio/visual announcement board. |
| **6** | **Hospital Operational Stats** | `/hospital-stats` | Real-time clinical throughput, bed occupancy rates, emergency triage bottlenecks, staffing ratios, and IndexedDB daily stats logs. |
| **7** | **ABCD OPD Queue & Triage Desk** | `/opd-queue`, `/opd/queue`, `/opd/dashboard` | 5-lane Kanban board (Walk-In, Online, Telehealth, Drafts/Labs, Completed), doctor dashboard with peak-hour heatmaps, quick intake modal, and active desk routing. |
| **8** | **NABH OPD Consultation & Digital Rx** | `/opd-consultation`, `/opd-consultation/:id` | Structured clinical digital prescription builder with Telugu bilingual translation, 4-stage mandatory completion lock, CDSS drug safety alerts, and printable A4 preview. |
| **9** | **ABCD Omnichannel CRM Unified Inbox** | `/crm`, `/inbox`, `/omnichannel-crm` | Healthcare CRM with a 3-panel unified inbox supporting WhatsApp, Facebook Messenger, Instagram, Threads, LinkedIn, Webchat, and Email. |
| **10** | **Healthcare URL Shortener & Micro-Portals** | `/url-generator`, `/s/:id`, `/reports/:id`, etc. | Secure cryptographic short-link generator for 6 document types (Lab Reports, Telehealth, Discharge, Appointments, Feedback, Surveys) with client-side resolution. |

---

## 3. Architecture & Folder Structure

The project follows a modular, feature-grouped structure with centralized client-side storage, dedicated security boundaries, and modular component design:

```
d:/testing/hospital-chatbot-widget/
├── public/                                  # Static assets, favicons, OG preview graphics
├── docs/                                    # Technical Knowledge Base
│   ├── README.md                            # Master Index & Architecture Diagram
│   ├── project-overview.md                  # Mission, Architecture, Versions (This document)
│   ├── validation-rules.md                  # Complete Validation Matrix & CDSS Checks
│   ├── api-documentation.md                 # REST API, Transports & Multi-tenant Specs
│   ├── database-documentation.md            # IndexedDB / Dexie.js Schema & Models
│   ├── feature-documentation.md             # In-depth Feature Workflows & Business Rules
│   ├── configuration.md                     # Configuration, Build & Deployment Manual
│   ├── code-navigation.md                   # Key Files, Custom Hooks & Developer Recipes
│   └── verification-and-unverified-areas.md # Technical Audit, Edge Cases & Manual QA Checklists
├── src/
│   ├── assets/                              # Static SVGs and visual media
│   ├── components/                          # UI Components organized by feature domain
│   │   ├── common/                          # Shared UI (ScrollReveal, ScrollToTop, RouteTopBar, ChartAnimations)
│   │   ├── consultation/                    # OPD Consultation & Digital Prescription System (20+ components)
│   │   ├── crm/                             # ABCD Omnichannel CRM Unified Inbox (13 components + mock data)
│   │   ├── hospital-stats/                  # Operational Analytics & Floor Occupancy Dashboard
│   │   ├── opd-portal/                      # OPD Doctor Portal, Sidebar, Graphs & Profile Management
│   │   ├── portfolio/                       # Developer Portfolio Home & Vector Tech Stack Icons
│   │   ├── queue/                           # OPD Triage Desk, Kanban Board, Quick Intake Modal
│   │   ├── url-generator/                   # Healthcare URL Shortener & Micro-Portal Viewer Modules
│   │   ├── ChatWidget.jsx                   # Central Chatbot Widget integration container
│   │   ├── ChatHeader.jsx                   # Widget top bar with language picker and controls
│   │   ├── ChatMessages.jsx                 # Scrollable conversational message stream
│   │   ├── ChatInput.jsx                    # Multi-modal input bar with microphone dictation
│   │   ├── PatientRegistrationForm.jsx      # Inline chat appointment registration form
│   │   ├── DoctorCard.jsx / DoctorCardList  # Doctor availability and slot booking cards
│   │   ├── AttachmentComposer.jsx           # Client-side file attachment composer with upload progress
│   │   ├── AudioPlayer.jsx                  # Call center interactive waveform and transcript player
│   │   ├── InsightsDashboard.jsx            # Call center QA coaching dashboard
│   │   ├── SpeechToText.jsx                 # Real-time medical speech recognition screen
│   │   └── TokenDesk.jsx                    # Outpatient token dispenser and waiting announcer
│   ├── db/                                  # Database Layer
│   │   ├── database.js                      # HealthcareURLGeneratorDB Dexie instance & schema
│   │   ├── hospitalDb.js                    # HospitalOPD_DB Dexie instance & versioning (v1-v3)
│   │   └── seedData.js                      # Realistic seed patient records, prescriptions, and configs
│   ├── hooks/                               # Custom React Hooks
│   │   ├── useBehavioralTrigger.js          # MutationObserver-based contextual prompt triggers
│   │   ├── useChartAnimation.js             # SVG graph enter transitions
│   │   ├── useChatSession.js                # Chat session lifecycle, history sync, and booking flow
│   │   ├── useHospitalData.js               # Reactive live queries over HospitalOPD_DB
│   │   ├── useLocalStorage.js               # Resilient typed localStorage persistence hook
│   │   ├── useOpenSound.js                  # Synthetic audio chimes via Web Audio API
│   │   ├── useSpeechRecognition.js          # Web Speech API recognition controller
│   │   └── useSpeechSynthesis.js            # Native browser voice speech synthesizer
│   ├── i18n/                                # Localization
│   │   ├── LanguageContext.jsx              # Global language provider (en, te, hi, es)
│   │   └── translations.js                  # Multi-language string catalogs
│   ├── mock/                                # Mock datasets for chatbot conversation trees
│   │   └── mockResponses.js                 # Fallback doctor cards, slots, and conversational rules
│   ├── security/                            # Enterprise Clinical Security & Data Privacy
│   │   ├── BlackoutOverlay.jsx              # Screen obscuration overlay on unauthorized capture/blur
│   │   ├── ForensicWatermark.jsx            # Dynamic watermark with doctor UHID, IP, timestamp
│   │   ├── SecurityBadge.jsx                # Interactive security status pill and policy modal
│   │   ├── SecurityProvider.jsx             # React Context wrapping application in security guard
│   │   ├── securityConfig.js                # Security policy configuration (watermark, timeouts)
│   │   └── useSecurityGuard.js              # Production anti-capture, print-whitelisting guard hook
│   ├── services/                            # Core Data Services
│   │   ├── callCenterDb.js                  # HospitalCallCenterDB Dexie instance (3,150+ calls)
│   │   ├── chatApi.js                       # Chat HTTP REST layer with multi-tenant headers
│   │   ├── hospitalStatsService.js          # Operational metrics aggregator
│   │   ├── shortUrlService.js               # Cryptographic short code generator & resolver
│   │   └── translationProvider.js           # Bilingual medical terminology translation provider
│   ├── utils/                               # Helper utilities
│   │   └── generateId.js                    # Cryptographic/UUID generator helper
│   ├── App.jsx                              # Application root & client-side router
│   ├── App.css / index.css                  # Global styles, animations, Tailwind directives
│   └── main.jsx                             # Application bootstrap with SecurityProvider
├── tests/                                   # Automated Playwright Test Suites
│   ├── app.smoke.spec.js                    # End-to-end smoke verification across routes
│   ├── hospitalDb.spec.js                   # IndexedDB schema and CRUD test suite
│   ├── opdConsultation.spec.js              # NABH consultation & prescription tests
│   ├── opdQueue.spec.js                     # Triage queue and Kanban interaction tests
│   └── securityGuard.spec.js                # Privacy guard and watermark unit tests
├── index.html                               # HTML5 entry with security meta tags and OpenGraph headers
├── package.json                             # Dependencies and project scripts
├── vite.config.js                           # Vite bundler configuration with manual chunking
├── vercel.json                              # Vercel SPA client-side routing rewrites
├── tailwind.config.js                       # Tailwind design system configuration
└── postcss.config.js                        # PostCSS configuration
```

---

## 4. Technologies, Frameworks & Identified Versions

All dependencies and exact versions identified from [`package.json`](../package.json):

### Core Runtime Dependencies
| Package | Version | Purpose in Codebase |
| :--- | :--- | :--- |
| **`react`** | `^18.3.1` | Core UI component framework. |
| **`react-dom`** | `^18.3.1` | DOM renderer for React. |
| **`dexie`** | `^4.4.6` | Client-side IndexedDB wrapper providing typed stores, compound indexes, and transactions. |
| **`dexie-react-hooks`** | `^4.4.0` | Reactive hooks (`useLiveQuery`) for automatic UI updates when IndexedDB changes. |
| **`lucide-react`** | `^0.400.0` | Vector icon system for clinical icons, navigation, and badges. |
| **`dompurify`** | `^3.4.15` | Sanitization of user input and HTML before rendering to eliminate XSS risks. |
| **`qrcode`** | `^1.5.4` | Canvas/SVG QR code generator for patient prescription slips and short URLs. |
| **`@tanstack/react-virtual`** | `^3.14.13` | High-performance list virtualization for large datasets (call center call records, leads). |
| **`react-hook-form`** | `^7.90.0` | *Installed dependency* (Current forms utilize controlled React state). |
| **`zod`** | `^4.6.7` | *Installed dependency* (See [Validation Rules](validation-rules.md) for details). |

### Development & Tooling Dependencies
| Package | Version | Purpose in Codebase |
| :--- | :--- | :--- |
| **`vite`** | `^6.4.3` | Next-generation frontend bundler, HMR server, and production compiler. |
| **`@vitejs/plugin-react`** | `^5.0.0` | Official Vite plugin for React Fast Refresh and JSX support. |
| **`tailwindcss`** | `^3.4.4` | Utility-first CSS framework defining clinical colors, layout, and animations. |
| **`postcss`** | `^8.4.39` | CSS post-processor for Tailwind CSS. |
| **`autoprefixer`** | `^10.4.19` | Vendor prefix parser for cross-browser CSS compatibility. |
| **`@playwright/test`** | `^1.55.0` | Cross-browser end-to-end automated testing framework. |

### Browser-Native APIs Utilized
- **Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`)**: Real-time microphone audio transcription in Speech-to-Text and Chatbot input.
- **Web Speech Synthesis API (`window.speechSynthesis`)**: Audio token number and room calling in the Token Announcer.
- **Web Audio API (`AudioContext`)**: Synthetic notification chimes and audio tone generation (`useOpenSound.js`).
- **Web Crypto API (`window.crypto.getRandomValues`)**: Cryptographically secure short code and token ID generation.
- **MutationObserver API**: Contextual behavioral tracking on `data-hospital-department` body attributes.

---

## 5. Architectural Principles

1. **Zero External Backend Hard Dependency**: The application functions out-of-the-box with comprehensive client-side data seeding across IndexedDB, permitting immediate evaluation in isolated or air-gapped environments.
2. **Modular Code Splitting**: [`vite.config.js`](../vite.config.js) enforces manual chunks (`vendor-react`, `vendor-icons`, `vendor-db`) to ensure ultra-fast initial page loads and cache isolation.
3. **Clinical Safety & NABH Compliance**: Digital prescriptions require clinical verification across 4 mandatory sections, and any prescribed medications are dynamically cross-checked against documented allergies and pregnancy status.
