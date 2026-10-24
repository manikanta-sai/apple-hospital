# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.smoke.spec.js >> Hospital chatbot widget smoke tests >> dashboard tile opens the Healthcare URL Generator, tests module cards, and navigates back
- Location: tests\app.smoke.spec.js:116:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('URL Generator', { exact: true })
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('URL Generator', { exact: true }) with timeout 10000ms
  - waiting for getByText('URL Generator', { exact: true })

```

```yaml
- banner:
  - text: MS Manikanta Sai Tanguturi Senior Software Engineer
  - navigation:
    - link "About":
      - /url: "#about"
    - link "Live Hospital Apps":
      - /url: "#live-apps"
    - link "Experience":
      - /url: "#experience"
    - link "Projects":
      - /url: "#projects"
    - link "Skills":
      - /url: "#skills"
  - link "Let's Connect":
    - /url: mailto:tanguturi.mani@gmail.com
    - img
    - text: Let's Connect
- main:
  - img
  - text: 7+ YRS EXP FULL STACK
  - 'link "LinkedIn: manikanta-sai"':
    - /url: https://linkedin.com/in/manikanta-sai
    - img
  - button "Copy Email":
    - img
  - link "Credly Verified Badge":
    - /url: https://www.credly.com/users/manikanta-sai.14d35454
    - img
  - heading "Manikanta Sai Tanguturi" [level=1]
  - paragraph: Senior Software Engineer • Healthcare SaaS, CRM, EHR & AI Platforms
  - paragraph: 📍 Hyderabad, India • ✉ tanguturi.mani@gmail.com
  - paragraph:
    - text: Senior Software Engineer with
    - strong: 7+ years of experience
    - text: building scalable Healthcare SaaS, CRM, EHR, OTM, and AI-enabled platforms. Specialized in multi-tenant architectures, automating mission-critical healthcare workflows, integrating enterprise telephony and EHR/HIMS systems, and translating complex clinical requirements into intuitive, reliable software products.
  - text: Healthcare SaaS & EHR Multi-Tenant CRM AI Call Analytics Dozee RPM IoT Omnichannel WhatsApp & Meta React Native Mobile Apps
  - link "Explore Live Hospital Apps":
    - /url: "#live-apps"
    - img
    - text: Explore Live Hospital Apps
    - img
  - link "View Resume Projects (7)":
    - /url: "#projects"
    - img
    - text: View Resume Projects (7)
  - img
  - heading "Interactive Healthcare Product Suite" [level=2]
  - text: ● Live Workspaces
  - paragraph: Click any live interactive module below to test real clinical workflows in this environment
  - text: ℞ Digital Pad Doxylamine + Pyridoxine 1-0-1 • భోజనం తర్వాత (NABH Rx)
  - img: ℞
  - heading "OPD Consultation & AI Digital Rx" [level=3]
  - paragraph: NABH digital prescription with Telugu translation, drug safety CDSS & queue routing.
  - text: Lobby Queue Desk NABH Rx Drug CDSS Launch Interactive Demo
  - img
  - text: "\"Book doctor Dr. Rajesh\" ✓ Confirmed today at 10 AM"
  - img: నమస్కారం! (Hello) AI Triage Active ✓ Dr. Rajesh Booked 10:00 AM Confirmed
  - heading "AI Patient Service & Clinical Chatbot" [level=3]
  - paragraph: Conversational AI assistant with smart doctor booking & medical FAQs.
  - text: Natural Language Smart Scheduling Doctor Matching Launch Interactive Demo
  - img
  - text: 253 Admitted 678 Total Beds • 154 Doctors Live Floor Census
  - img
  - heading "Hospital Stats & Floor Telemetry" [level=3]
  - paragraph: Interactive 3D isometric floors with real-time bed census & staffing ratios.
  - text: 3D Floors Bed Census Staffing Launch Interactive Demo
  - img
  - text: 94% QA Score Agent Call Recording & Coaching Live PBX Connected
  - img: "TELEPHONY QA 94% POS Sentiment: High Empathy 04:18 • Recording Monitored"
  - heading "Call Center & AI Agent Coaching Analytics" [level=3]
  - paragraph: Automated telephony call recording QA, quality scoring, and patient sentiment analytics.
  - text: TATA / Exotel CRM Audio QA Sentiment AI Launch Interactive Demo
  - img
  - text: ABCD CRM Pro WhatsApp • Meta • Email • Chat ★ 4.92 CSAT • < 2m First Response SLA
  - img: "Can I reschedule OPD? NOTE: Dr. Rao in OT Suggest 4 PM slot Confirmed for 4 PM ✓✓ BOOK OPD PAY LINK"
  - heading "Omnichannel CRM & Unified Inbox" [level=3]
  - paragraph: Intercom & WhatsApp Business inbox across 7 channels with patient 360° profile, internal notes & SLA desk.
  - text: WhatsApp Business 7-Channel Inbox Patient 360° SLA Desk Launch Interactive Demo
  - img
  - text: abcd.health/s/rx-104 Digital Lab Report & WhatsApp 🔒 256-bit Encrypted Token
  - img
  - heading "Healthcare Smart URL & QR Generator" [level=3]
  - paragraph: Encrypted short links & dynamic QR codes for lab reports & patient portals.
  - text: Dynamic QR Secure Short URLs Lab Reports Launch Interactive Demo
  - img
  - text: "#W-04 Room 104 Next: #W-05 • Waiting: 6 🔔 Voice TTS Enabled"
  - img: "TOUCH TO PRINT NEW TOKEN CITY OPD #W-04 NEXT CALL TOKEN #W-05"
  - heading "OP Token Desk & Waiting Room" [level=3]
  - paragraph: Automated token generation, audio announcer, and waiting pool routing.
  - text: Audio Chimes Queue Pools Display Board Launch Interactive Demo
  - img
  - text: AI Voice to EHR Telugu • English • Hindi Clinical Speech Model
  - img: తెలుగు • Eng • हिन्दी
  - heading "Speech to Text & Clinical Voice Dictation" [level=3]
  - paragraph: Real-time doctor voice dictation for prescriptions with Telugu/Hindi/English recognition.
  - text: Real-Time Mic Telugu/Hindi/Eng EHR Dictation Launch Interactive Demo
  - img
  - img
  - heading "Professional Experience" [level=2]
  - paragraph: Career journey in building enterprise Healthcare SaaS, CRM, EHR & AI platforms
  - text: 7+ Years Total Experience
  - heading "Senior UI Developer - CRM" [level=3]
  - img
  - text: Apex Cura Healthcare IT Solutions Pvt Ltd. Apr 2024 — Jul 2026 (2 yrs 4 mos) • Hyderabad, India
  - paragraph: Architected and engineered an AI-first, multi-tenant Healthcare CRM and Patient Engagement SaaS platform serving multiple hospitals, automating lead acquisition, omnichannel patient communication, and AI call coaching.
  - text: "Key Contributions & Engineering Impact:"
  - list:
    - listitem:
      - img
      - text: Architected multi-tenant CRM enabling patient acquisition, omnichannel communication, call recording management, and automated appointment scheduling.
    - listitem:
      - img
      - text: Built Omnichannel Lead Management integrating hospital websites, AI web chatbots, WhatsApp Business API, Facebook Messenger, Instagram, and Meta Lead Ads.
    - listitem:
      - img
      - text: Engineered an AI-powered Call Analytics engine with telephony integrations (TATA SmartFlo, Exotel, ConVox) generating automated call transcripts, quality scores, sentiment analysis, and agent coaching metrics.
    - listitem:
      - img
      - text: Constructed an intelligent Lead Assignment Engine distributing leads based on hospital branch geolocation, agent availability, and workload balancing algorithms.
    - listitem:
      - img
      - text: Automated WhatsApp patient feedback workflows for Inpatient (IP) and Outpatient (OP) departments, centralizing NPS reports for quality audits.
    - listitem:
      - img
      - text: Prepared and annotated healthcare conversational datasets to fine-tune AI chatbots and clinical intake models.
  - text: "Tech: React.js (v16.8+) Next.js Redux TypeScript Node.js Tailwind CSS Meta Business API Telephony APIs AWS S3/RDS Webhooks"
  - heading "Software Engineer - EHR" [level=3]
  - img
  - text: Aurora e-Labs Pvt Ltd. May 2019 — Mar 2024 (4 yrs 10 mos) • Hyderabad, India
  - paragraph: Spearheaded development of comprehensive Electronic Health Record (EHR) modules and remote patient telemetry for major hospital chains including K**S Hospitals.
  - text: "Key Contributions & Engineering Impact:"
  - list:
    - listitem:
      - img
      - text: Engineered core EHR clinical modules including IP Discharge Summary, Nursing Clinical Forms, Drug Charts, Intake/Output (I/O) Records, Vitals, and Diagnostic Lab Reports.
    - listitem:
      - img
      - text: Integrated Dozee Remote Patient Monitoring (RPM) IoT contactless sensors to stream real-time patient vitals into the EHR, enabling early warning clinical alerts.
    - listitem:
      - img
      - text: Developed doctor-facing React Native mobile application for continuous inpatient (IP) and outpatient (OP) tracking from handheld devices.
    - listitem:
      - img
      - text: Implemented role-based security workflows (RBAC) ensuring granular access control for Chief Medical Officers, duty doctors, nurses, and billing admins.
    - listitem:
      - img
      - text: Refactored state management and component libraries into reusable packages, reducing frontend bundle size by 35% and improving render times.
  - text: "Tech: React.js React Native Redux Node.js PostgreSQL Dozee RPM IoT UI Kitten REST APIs Socket.IO"
  - heading "UI Developer - Web Pages" [level=3]
  - img
  - text: LPtechlog Pvt Ltd. Jul 2018 — Jan 2019 (7 mos) • Hyderabad, India
  - paragraph: Designed and converted UI mockups into responsive, high-performance web applications with semantic HTML5, CSS3, JavaScript, and Bootstrap.
  - text: "Key Contributions & Engineering Impact:"
  - list:
    - listitem:
      - img
      - text: Delivered pixel-perfect responsive layouts ensuring full visual fidelity and cross-browser consistency across mobile, tablet, and desktop viewports.
    - listitem:
      - img
      - text: Authored modular, maintainable stylesheets and reusable client components, accelerating sprint delivery cycles.
    - listitem:
      - img
      - text: Profiled browser rendering performance and eliminated layout thrashing to guarantee fluid 60fps user interactions.
  - text: "Tech: JavaScript (ES6) HTML5 CSS3 Bootstrap jQuery Git FEATURED ARCHITECTURE Apex Cura Healthcare CRM"
  - heading "Omnichannel Patient Ingestion, AI Telephony & Automated Lead Engine" [level=3]
  - paragraph: Constructed a unified patient intake hub aggregating real-time patient requests across web chatbots, WhatsApp Business API, telephony inbound/outbound calls, Facebook Messenger, and Meta Lead Ads. Integrated automated call transcription and sentiment scoring to monitor doctor and agent communication quality, reducing lead response latency by over 60% across hospital branches.
  - text: 7+ Yrs Healthcare Engineering 15+ Enterprise Integrations < 15 min Lead Routing SLA 100% EHR / NABH Aligned
  - img
  - heading "Portfolio Projects" [level=2]
  - paragraph: Comprehensive systems built across Healthcare SaaS, EHR, and Mobile
  - img
  - textbox "Search projects or stack..."
  - button "All Projects"
  - button "Healthcare CRM"
  - button "Clinical EHR"
  - button "Mobile Apps"
  - heading "Customer Relationship Management (CRM) - Web Application" [level=3]
  - paragraph: "Client: Apex Cura Healthcare • Team: 15 members • (Apr 2024 – Jul 2026)"
  - text: Featured
  - paragraph: AI-powered, multi-tenant Healthcare CRM supporting patient acquisition, omnichannel chat routing, telephony call intelligence, automated appointment lifecycles, and IP/OP patient satisfaction feedback.
  - text: ✓ Omnichannel lead ingestion from Meta Ads, WhatsApp, Webhooks, and web chatbots ✓ AI Call Analytics with automatic transcription, quality scoring, and sentiment tagging ✓ Workload-balanced lead routing engine factoring branch location and agent load ✓ Automated WhatsApp appointment reminders and multi-step rescheduling flows
  - img
  - text: React.js
  - img
  - text: Redux
  - img
  - text: Node.js
  - img
  - text: PostgreSQL
  - img: AWS
  - text: AWS S3/EC2
  - img
  - text: Telephony APIs
  - img
  - text: Meta API
  - heading "Electronic Health Record (EHR) - Web Application" [level=3]
  - paragraph: "Client: K**S Hospitals • Team: 5 members • (Mar 2021 – Mar 2024)"
  - text: Featured
  - paragraph: Enterprise hospital EHR platform digitizing medical records for clinical administrators, senior consultants, and duty nurses across inpatient and outpatient departments.
  - text: ✓ Interactive Nursing Notes, Drug Charts, Intake/Output (I/O), and Discharge Summaries ✓ Real-time vital signs synchronization with Dozee contactless remote patient monitoring ✓ Role-based clinical workflows adhering to healthcare compliance and data privacy ✓ Integrated laboratory test ordering and diagnostic result visualization
  - img
  - text: React.js
  - img
  - text: Node.js
  - img
  - text: PostgreSQL
  - img
  - text: REST APIs
  - img
  - text: Socket.IO
  - img
  - text: Highcharts
  - heading "Electronic Health Record (EHR) - Mobile Application" [level=3]
  - paragraph: "Client: K**S Hospitals • Team: 5 members • (Mar 2021 – Mar 2024)"
  - paragraph: Doctor companion mobile application enabling physicians to round on inpatients, review test results, verify drug charts, and acknowledge critical alerts on-the-go.
  - text: ✓ Native Android and iOS mobile app with offline-capable clinical notes cache ✓ Firebase push notifications for critical vitals threshold breaches ✓ Fast patient search by UHID, IP number, and bed location
  - img
  - text: React Native
  - img
  - text: UI Kitten
  - img
  - text: React Native Paper
  - img
  - text: Firebase
  - img
  - text: REST APIs
  - heading "Hospital Queue Management System" [level=3]
  - paragraph: "Client: K**S Hospitals • Team: 5 members • (Jan 2021 – Mar 2021)"
  - paragraph: Intelligent outpatient queue sequencing system handling appointment check-ins, token generation, triage prioritization, and waiting lobby digital signage.
  - text: ✓ Priority-based queue ordering for elderly, emergency, and pregnant patients ✓ Real-time WebSocket token display board with audio chime announcements ✓ Historical queue wait-time metrics for hospital administrative reporting
  - img
  - text: Node.js
  - img
  - text: PostgreSQL
  - img
  - text: Socket.IO
  - img
  - text: React.js
  - img
  - text: Tailwind CSS
  - heading "Hospital Financial Management & Counselling System" [level=3]
  - paragraph: "Client: K**S Hospitals • Team: 5 members • (Mar 2020 – Jan 2021)"
  - paragraph: Patient financial counseling application managing treatment cost estimation, insurance pre-authorization, KYC verification, and billing reconciliations.
  - text: ✓ Automated surgical procedure cost estimator with package itemization ✓ Insurance vs. cash payment split management and KYC document storage ✓ Consolidated revenue reports with multi-criteria date-range filters
  - img
  - text: React.js
  - img
  - text: Node.js
  - img
  - text: PostgreSQL
  - img: ex
  - text: Express.js
  - img
  - text: Chart.js
  - heading "Medical Consultation - Mobile Application" [level=3]
  - paragraph: "Client: Second Aid • Team: 3 members • (Aug 2019 – Jun 2020)"
  - paragraph: Tele-health mobile consultation platform facilitating secure doctor-patient messaging, medical record sharing, electronic prescriptions, and in-app payments.
  - text: ✓ Stream Chat and Firebase integration for real-time consultation messaging ✓ Dual payment gateway integration with Stripe and Paytm ✓ Encrypted medical report uploads and digital prescriptions sharing
  - img
  - text: React Native (Expo)
  - img
  - text: Redux
  - img
  - text: Firebase
  - img
  - text: Stream Chat
  - img
  - text: Stripe API
  - img
  - text: Paytm
  - heading "Smart Learning - Mobile Application" [level=3]
  - paragraph: "Client: Kaizen Kids • Team: 3 members • (Jun 2020 – Jan 2021)"
  - paragraph: Interactive educational app for worksheets, camera-based homework submissions, teacher grading workflows, and real-time student evaluation cards.
  - text: ✓ Camera and gallery image submission pipelines with client-side compression ✓ Dual parent and student portal with progress milestone tracking ✓ Deployed to both Google Play Store and Apple App Store
  - img
  - text: React Native
  - img
  - text: Expo
  - img
  - text: Redux
  - img
  - text: Node.js
  - img
  - text: REST APIs
  - img
  - heading "Technical Skills & Tech Stack" [level=2]
  - img
  - heading "Frontend Architecture" [level=3]
  - text: "14"
  - img
  - text: React.js (v16.8+)
  - img
  - text: React Native
  - img
  - text: Next.js
  - img
  - text: TypeScript
  - img
  - text: JavaScript (ES6+)
  - img
  - text: Redux Toolkit
  - img
  - text: Tailwind CSS
  - img
  - text: Bootstrap 4/5
  - img
  - text: Material UI
  - img
  - text: Chakra UI
  - img
  - text: Ant Design
  - img
  - text: UI-Kitten
  - img
  - text: Highcharts
  - img
  - text: Chart.js
  - img
  - heading "Backend & APIs" [level=3]
  - text: "11"
  - img
  - text: Node.js
  - img: ex
  - text: Express.js
  - img
  - text: REST APIs
  - img
  - text: Socket.IO (WebSockets)
  - img
  - text: Webhooks Architecture
  - img
  - text: Redis Caching
  - img
  - text: JWT Authentication
  - img
  - text: Swagger / OpenAPI
  - img
  - text: PM2 Process Manager
  - img
  - text: Multer
  - img
  - text: Nodemailer
  - img
  - heading "Databases & Storage" [level=3]
  - text: "6"
  - img
  - text: PostgreSQL
  - img
  - text: MongoDB
  - img
  - text: Firebase Realtime DB
  - img: AWS
  - text: AWS S3 Bucket
  - img
  - text: Redis In-Memory
  - img
  - text: SQL Query Optimization
  - img
  - heading "Cloud, Telecom & Integrations" [level=3]
  - text: "6"
  - img: AWS
  - text: AWS (EC2, S3, RDS, IAM, CloudWatch)
  - img
  - text: Meta Business API (WhatsApp, Instagram, Ads)
  - img
  - text: Telephony APIs (TATA SmartFlo, Exotel, ConVox)
  - img
  - text: HIMS Integration (Suvarna, Practo)
  - img
  - text: Dozee Remote Patient Monitoring (RPM)
  - img
  - text: Stripe & Paytm Payment Gateways
  - img
  - heading "DevOps & Engineering Tools" [level=3]
  - text: "9"
  - img
  - text: GitHub Actions (CI/CD)
  - img
  - text: Git & Bitbucket
  - img
  - text: Docker basics
  - img
  - text: Figma UI/UX
  - img
  - text: Postman API Testing
  - img
  - text: DBeaver SQL Client
  - img
  - text: Webpack & Vite
  - img
  - text: NPM / Yarn
  - img
  - text: VS Code
  - paragraph: Interested in discussing modern healthcare architecture, full-stack development, or exploring opportunities?
  - link "Let's Connect ✉":
    - /url: mailto:tanguturi.mani@gmail.com
    - img
    - text: Let's Connect ✉
  - link "LinkedIn Profile":
    - /url: https://linkedin.com/in/manikanta-sai
    - img
    - text: LinkedIn Profile
  - link "LinkedIn":
    - /url: https://linkedin.com/in/manikanta-sai
    - img
  - link "Email":
    - /url: mailto:tanguturi.mani@gmail.com
    - img
  - link "Credly":
    - /url: https://www.credly.com/users/manikanta-sai.14d35454
    - img
  - text: © 2026 Manikanta Sai Tanguturi. Built with React & Tailwind CSS.
```

# Test source

```ts
  19  |         emitResult(resultIndex, segments) {
  20  |           const results = segments.map(({ transcript, isFinal }) => {
  21  |             const result = [{ transcript }];
  22  |             result.isFinal = isFinal;
  23  |             return result;
  24  |           });
  25  |           this.onresult?.({ resultIndex, results });
  26  |         }
  27  |       };
  28  |     });
  29  |     await page.goto('/');
  30  | 
  31  |     await page.getByRole('link', { name: /Speech to Text/ }).click();
  32  |     await expect(page).toHaveURL(/\/speech-to-text$/);
  33  |     await expect(page.getByText('Voice workspace')).toHaveCount(0);
  34  |     await expect(page.getByRole('heading', { name: 'New transcript' })).toHaveCount(0);
  35  |     await expect(page.getByText('Dictate directly into an editable draft.')).toBeVisible();
  36  |     await expect(page.getByText('Ready to listen')).toBeVisible();
  37  |     await expect(page.getByText('Press Start to let your browser microphone listen.')).toBeVisible();
  38  |     await expect(page.getByText('Browser recognition uses the selected language. Mixed English, Hindi, and Telugu may be transcribed inaccurately.')).toBeVisible();
  39  |     await expect(page.getByRole('combobox', { name: 'Language' })).toHaveValue('en-IN');
  40  |     await expect(page.getByRole('button', { name: 'Start', exact: true })).toBeVisible();
  41  |     await expect(page.getByRole('button', { name: 'Pause', exact: true })).toHaveCount(0);
  42  |     await expect(page.getByRole('button', { name: 'Resume', exact: true })).toHaveCount(0);
  43  |     await expect(page.getByRole('button', { name: 'Stop', exact: true })).toHaveCount(0);
  44  | 
  45  |     await page.getByRole('button', { name: 'Start', exact: true }).click();
  46  |     await expect(page.getByText('Listening', { exact: true })).toBeVisible();
  47  |     await expect(page.getByText('Transcribing into your draft. Click Stop when you finish speaking. Listening stops automatically after 2 minutes.')).toBeVisible();
  48  |     await expect(page.locator('.speech-wave')).toBeVisible();
  49  |     const transcript = page.getByLabel('Transcript text');
  50  |     await expect(transcript).toHaveCSS('min-height', '256px');
  51  |     await page.evaluate(() => {
  52  |       const instance = window.__speechRecognitionInstances[window.__speechRecognitionInstances.length - 1];
  53  |       instance.emitResult(0, [{ transcript: 'Patient needs', isFinal: false }]);
  54  |     });
  55  |     await expect(transcript).toHaveValue('Patient needs');
  56  |     await page.evaluate(() => {
  57  |       const instance = window.__speechRecognitionInstances[window.__speechRecognitionInstances.length - 1];
  58  |       instance.emitResult(0, [
  59  |         { transcript: 'Patient needs', isFinal: true },
  60  |         { transcript: 'an appointment', isFinal: false },
  61  |       ]);
  62  |     });
  63  |     await expect(transcript).toHaveValue('Patient needs an appointment');
  64  |     await page.evaluate(() => {
  65  |       const instance = window.__speechRecognitionInstances[window.__speechRecognitionInstances.length - 1];
  66  |       instance.emitResult(1, [
  67  |         { transcript: 'Patient needs', isFinal: true },
  68  |         { transcript: 'an appointment tomorrow.', isFinal: true },
  69  |       ]);
  70  |     });
  71  |     await expect(transcript).toHaveValue('Patient needs an appointment tomorrow.');
  72  |     await page.evaluate(() => {
  73  |       const instance = window.__speechRecognitionInstances[window.__speechRecognitionInstances.length - 1];
  74  |       instance.onend();
  75  |     });
  76  |     await expect.poll(() => page.evaluate(() => {
  77  |       const instance = window.__speechRecognitionInstances[window.__speechRecognitionInstances.length - 1];
  78  |       return instance.startCount;
  79  |     })).toBeGreaterThan(1);
  80  |     await expect(page.getByText('Listening', { exact: true })).toBeVisible();
  81  |     await expect(page.getByRole('button', { name: 'Pause', exact: true })).toHaveCount(0);
  82  |     await expect(page.getByRole('button', { name: 'Start', exact: true })).toHaveCount(0);
  83  |     await expect(page.getByRole('button', { name: 'Stop', exact: true })).toBeVisible();
  84  |     await page.getByRole('button', { name: 'Stop', exact: true }).click();
  85  |     await expect(page.getByText('Ready to listen')).toBeVisible();
  86  |     await expect(page.locator('.speech-wave')).toHaveCount(0);
  87  |     await expect(page.getByRole('button', { name: 'Start', exact: true })).toBeVisible();
  88  |     await expect(page.getByRole('button', { name: 'Stop', exact: true })).toHaveCount(0);
  89  | 
  90  |     await transcript.fill('Patient requested an appointment next week.');
  91  |     await expect(transcript).toHaveValue('Patient requested an appointment next week.');
  92  |     await page.getByRole('button', { name: 'Clear' }).click();
  93  |     await expect(transcript).toHaveValue('');
  94  | 
  95  |     await page.clock.install();
  96  |     await page.getByRole('button', { name: 'Start', exact: true }).click();
  97  |     await page.clock.fastForward(120_000);
  98  |     await expect(page.getByText('Two-minute listening limit reached')).toBeVisible();
  99  |     await expect(page.getByRole('button', { name: 'Start', exact: true })).toBeVisible();
  100 |     await expect(page.getByRole('button', { name: 'Stop', exact: true })).toHaveCount(0);
  101 |   });
  102 | 
  103 |   test('dashboard tile opens the Insights analytics dashboard with a sample audio demo', async ({ page }) => {
  104 |     await page.goto('/');
  105 | 
  106 |     await expect(page.getByRole('link', { name: /Call Center|Insights/i })).toBeVisible();
  107 |     await page.getByRole('link', { name: /Call Center|Insights/i }).click();
  108 |     await expect(page).toHaveURL(/\/insights$/);
  109 |     await expect(page.getByRole('heading', { name: /AI Sales Call Monitoring And Scoring/i })).toBeVisible();
  110 |     await expect(page.getByText('Sales Call Analysis')).toBeVisible();
  111 |     await expect(page.getByRole('button', { name: /Play audio/i })).toBeVisible();
  112 |     await page.getByRole('button', { name: /Play audio/i }).first().click();
  113 |     await expect(page.getByText('Playing audio...')).toBeVisible();
  114 |   });
  115 | 
  116 |   test('dashboard tile opens the Healthcare URL Generator, tests module cards, and navigates back', async ({ page }) => {
  117 |     await page.goto('/');
  118 | 
> 119 |     await expect(page.getByText('URL Generator', { exact: true })).toBeVisible();
      |                                                                    ^ Error: expect(locator).toBeVisible() failed
  120 |     await expect(page.getByText('Create and manage links for lab reports, telehealth, patient feedback, and surveys.')).toBeVisible();
  121 | 
  122 |     await page.getByRole('link', { name: /URL Generator/i }).click();
  123 |     await expect(page).toHaveURL(/\/url-generator$/);
  124 | 
  125 |     await expect(page.getByRole('heading', { name: /Create and Manage Healthcare Links/i })).toBeVisible();
  126 |     await expect(page.getByText('Total URLs Created')).toBeVisible();
  127 | 
  128 |     // Verify 4 module creation cards
  129 |     await expect(page.getByRole('heading', { name: 'Lab Reports' })).toBeVisible();
  130 |     await expect(page.getByRole('heading', { name: 'Telehealth' })).toBeVisible();
  131 |     await expect(page.getByRole('heading', { name: 'Patient Feedback' })).toBeVisible();
  132 |     await expect(page.getByRole('heading', { name: 'Survey' })).toBeVisible();
  133 | 
  134 |     // Navigate back to suite
  135 |     await page.getByRole('button', { name: /Back to Suite/i }).click();
  136 |     await expect(page).toHaveURL(/\//);
  137 |     await expect(page.getByRole('heading', { name: 'ABCD Multispecialty Hospital' })).toBeVisible();
  138 |   });
  139 | 
  140 |   test('dashboard tile opens the existing chatbot screen', async ({ page }, testInfo) => {
  141 |     const metrics = await attachTestMetrics(page, testInfo);
  142 | 
  143 |     await page.goto('/');
  144 | 
  145 |     await expect(page.getByRole('heading', { name: 'ABCD Multispecialty Hospital' })).toBeVisible();
  146 |     await expect(page.getByText('Digital tools for patient support and smoother hospital workflows.')).toBeVisible();
  147 |     await expect(page.getByText('Speech to Text', { exact: true })).toBeVisible();
  148 |     await expect(page.getByText('Audio File to Text', { exact: true })).toBeVisible();
  149 |     await expect(page.getByText('PDF to Form Auto Fill', { exact: true })).toBeVisible();
  150 |     await expect(page.getByText('OP Token Generator', { exact: true })).toBeVisible();
  151 |     await expect(page.getByText('Token Number Announcer', { exact: true })).toBeVisible();
  152 |     await expect(page.getByRole('link', { name: /Chatbot/ })).toBeVisible();
  153 |     await expect(page.getByRole('button')).toHaveCount(0);
  154 | 
  155 |     await page.getByRole('link', { name: /Chatbot/ }).click();
  156 |     await expect(page).toHaveURL(/\/chatbot$/);
  157 |     await expect(page.getByText('Patient Portal')).toBeVisible();
  158 |     await expect(page.getByRole('button', { name: 'Open chat with AI Assist' })).toBeVisible();
  159 | 
  160 |     await page.getByRole('button', { name: 'Open chat with AI Assist' }).click();
  161 |     await expect(page.locator('input[type="text"]').first()).toBeVisible();
  162 |     await page.getByRole('button', { name: 'cardiology' }).click();
  163 |     await expect(page.getByRole('button', { name: 'Open chat with AI Assist' })).toBeVisible();
  164 |     await expect(page.locator('input[type="text"]').first()).toHaveCount(0);
  165 |     await expect(page.getByText("Looking for a heart specialist? I can help you check Dr. Rao's availability.")).toBeVisible();
  166 |     await page.getByRole('button', { name: 'Clear' }).click();
  167 |     await expect(page.getByText("Looking for a heart specialist? I can help you check Dr. Rao's availability.")).toHaveCount(0);
  168 |     await page.getByRole('button', { name: 'cardiology' }).click();
  169 |     await expect(page.getByRole('button', { name: 'Chat now' })).toBeVisible();
  170 |     await page.getByRole('button', { name: 'Chat now' }).click();
  171 |     await expect(page.locator('input[type="text"]').first()).toBeVisible();
  172 |     await page.getByRole('button', { name: 'Close chat' }).click();
  173 |     await page.getByRole('button', { name: 'Clear' }).click();
  174 | 
  175 |     await page.getByRole('link', { name: 'Back to dashboard' }).click();
  176 |     await expect(page).toHaveURL(/\/$/);
  177 |     await expect(page.getByText('Digital tools for patient support and smoother hospital workflows.')).toBeVisible();
  178 | 
  179 |     await page.goto('/chatbot');
  180 |     await expect(page.getByText('Patient Portal')).toBeVisible();
  181 |     await page.getByRole('link', { name: 'Back to dashboard' }).click();
  182 |     await expect(page).toHaveURL(/\/$/);
  183 | 
  184 |     const summary = await metrics.finalize();
  185 |     expect(summary.jsErrors).toEqual([]);
  186 |     expect(summary.failedRequests).toEqual([]);
  187 |   });
  188 | 
  189 |   test('opens the chat panel and sends a message', async ({ page }, testInfo) => {
  190 |     const metrics = await attachTestMetrics(page, testInfo);
  191 | 
  192 |     await page.goto('/');
  193 | 
  194 |     await page.getByRole('link', { name: /Chatbot/ }).click();
  195 |     await page.getByRole('button', { name: 'Open chat with AI Assist' }).click();
  196 | 
  197 |     const input = page.locator('input[type="text"]').first();
  198 |     await expect(input).toBeVisible();
  199 | 
  200 |     await input.fill('Timings');
  201 |     await page.getByRole('button', { name: 'Send message' }).click();
  202 | 
  203 |     await expect(page.getByText('Our OPD is open Monday to Saturday, 8:00 AM to 8:00 PM. Would you like help booking a visit?')).toBeVisible({ timeout: 15000 });
  204 | 
  205 |     const summary = await metrics.finalize();
  206 |     expect(summary.jsErrors).toEqual([]);
  207 |     expect(summary.failedRequests).toEqual([]);
  208 |   });
  209 | 
  210 |   test('generates a patient token, moves it through the queue, and shows the five-doctor announcer', async ({ page }) => {
  211 |     await page.goto('/');
  212 |     await page.getByRole('link', { name: /OP Token Generator/ }).click();
  213 |     await expect(page).toHaveURL(/\/tokens$/);
  214 | 
  215 |     await page.getByLabel('Mobile number or UMR number').fill('9876543210');
  216 |     await page.getByRole('button', { name: /Aarav Sharma/ }).click();
  217 |     await page.getByLabel('Search doctors or departments').fill('Cardiology');
  218 |     await page.getByRole('button', { name: /^AR Dr\. Ananya Rao/ }).click();
  219 |     await page.getByRole('main').getByRole('button', { name: 'Generate token' }).click();
```