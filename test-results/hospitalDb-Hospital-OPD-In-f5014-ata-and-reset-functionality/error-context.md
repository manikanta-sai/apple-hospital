# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hospitalDb.spec.js >> Hospital OPD IndexedDB & Seed Data (Phase 1) >> initializes HospitalOPD_DB with correct schema, seed data, and reset functionality
- Location: tests\hospitalDb.spec.js:4:3

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 0
+ Received  + 2

  Array [
    "adminConfig",
    "customDictionary",
+   "dailyStats",
+   "hospitalStats",
    "patients",
    "prescriptions",
  ]
```

# Page snapshot

```yaml
- generic [ref=e5]:
  - banner [ref=e6]:
    - generic [ref=e7]:
      - generic [ref=e8]:
        - generic [ref=e9]: MS
        - generic [ref=e10]:
          - generic [ref=e11]: Manikanta Sai Tanguturi
          - generic [ref=e12]: Senior Software Engineer
      - navigation [ref=e13]:
        - link "About" [ref=e14] [cursor=pointer]:
          - /url: "#about"
        - link "Live Hospital Apps" [ref=e15] [cursor=pointer]:
          - /url: "#live-apps"
        - link "Experience" [ref=e17] [cursor=pointer]:
          - /url: "#experience"
        - link "Projects" [ref=e18] [cursor=pointer]:
          - /url: "#projects"
        - link "Skills" [ref=e19] [cursor=pointer]:
          - /url: "#skills"
      - link "Let's Connect" [ref=e21] [cursor=pointer]:
        - /url: mailto:tanguturi.mani@gmail.com
  - main [ref=e26]:
    - generic [ref=e28]:
      - generic [ref=e29]:
        - generic [ref=e31]:
          - generic [ref=e36]: 7+ YRS EXP
          - generic [ref=e37]: FULL STACK
        - generic [ref=e38]:
          - 'link "LinkedIn: manikanta-sai" [ref=e39] [cursor=pointer]':
            - /url: https://linkedin.com/in/manikanta-sai
          - button "Copy Email" [ref=e44] [cursor=pointer]
          - link "Credly Verified Badge" [ref=e48] [cursor=pointer]:
            - /url: https://www.credly.com/users/manikanta-sai.14d35454
      - generic [ref=e52]:
        - generic [ref=e53]:
          - heading "Manikanta Sai Tanguturi" [level=1] [ref=e54]
          - paragraph [ref=e55]: Senior Software Engineer • Healthcare SaaS, CRM, EHR & AI Platforms
          - paragraph [ref=e56]:
            - generic [ref=e57]: 📍 Hyderabad, India
            - generic [ref=e58]: •
            - generic [ref=e59]: ✉ tanguturi.mani@gmail.com
        - paragraph [ref=e60]:
          - text: Senior Software Engineer with
          - strong [ref=e61]: 7+ years of experience
          - text: building scalable Healthcare SaaS, CRM, EHR, OTM, and AI-enabled platforms. Specialized in multi-tenant architectures, automating mission-critical healthcare workflows, integrating enterprise telephony and EHR/HIMS systems, and translating complex clinical requirements into intuitive, reliable software products.
        - generic [ref=e62]:
          - generic [ref=e63]: Healthcare SaaS & EHR
          - generic [ref=e64]: Multi-Tenant CRM
          - generic [ref=e65]: AI Call Analytics
          - generic [ref=e66]: Dozee RPM IoT
          - generic [ref=e67]: Omnichannel WhatsApp & Meta
          - generic [ref=e68]: React Native Mobile Apps
        - generic [ref=e69]:
          - link "Explore Live Hospital Apps" [ref=e70] [cursor=pointer]:
            - /url: "#live-apps"
          - link "View Resume Projects (7)" [ref=e77] [cursor=pointer]:
            - /url: "#projects"
    - generic [ref=e85]:
      - generic [ref=e91]:
        - generic [ref=e92]:
          - heading "Interactive Healthcare Product Suite" [level=2] [ref=e93]
          - generic [ref=e94]: ● Live Workspaces
        - paragraph [ref=e95]: Click any live interactive module below to test real clinical workflows in this environment
      - generic [ref=e96]:
        - generic [ref=e97] [cursor=pointer]:
          - generic [ref=e98]:
            - generic [ref=e100]:
              - generic [ref=e101]:
                - generic [ref=e102]: ℞ Digital Pad
                - generic [ref=e103]: Doxylamine + Pyridoxine
                - generic [ref=e104]: 1-0-1 • భోజనం తర్వాత (NABH Rx)
              - img [ref=e106]:
                - generic [ref=e110]: ℞
            - generic [ref=e121]:
              - generic [ref=e122]:
                - heading "OPD Consultation & AI Digital Rx" [level=3] [ref=e123]
                - paragraph [ref=e124]: NABH digital prescription with Telugu translation, drug safety CDSS & queue routing.
              - generic [ref=e125]:
                - generic [ref=e126]: Lobby Queue Desk
                - generic [ref=e127]: NABH Rx
                - generic [ref=e128]: Drug CDSS
          - generic [ref=e129]: Launch Interactive Demo
        - generic [ref=e135] [cursor=pointer]:
          - generic [ref=e136]:
            - generic [ref=e138]:
              - generic [ref=e139]:
                - generic [ref=e140]: "\"Book doctor Dr. Rajesh\""
                - generic [ref=e141]: ✓ Confirmed today at 10 AM
              - img [ref=e143]:
                - generic [ref=e154]:
                  - generic [ref=e156]: నమస్కారం! (Hello)
                  - generic [ref=e157]: AI Triage Active
                  - generic [ref=e159]: ✓ Dr. Rajesh Booked
                  - generic [ref=e160]: 10:00 AM Confirmed
            - generic [ref=e165]:
              - generic [ref=e166]:
                - heading "AI Patient Service & Clinical Chatbot" [level=3] [ref=e167]
                - paragraph [ref=e168]: Conversational AI assistant with smart doctor booking & medical FAQs.
              - generic [ref=e169]:
                - generic [ref=e170]: Natural Language
                - generic [ref=e171]: Smart Scheduling
                - generic [ref=e172]: Doctor Matching
          - generic [ref=e173]: Launch Interactive Demo
        - generic [ref=e179] [cursor=pointer]:
          - generic [ref=e180]:
            - generic [ref=e183]:
              - generic [ref=e184]:
                - generic [ref=e185]: "253"
                - generic [ref=e186]: Admitted
              - generic [ref=e187]: 678 Total Beds • 154 Doctors
              - generic [ref=e188]: Live Floor Census
            - generic [ref=e205]:
              - generic [ref=e206]:
                - heading "Hospital Stats & Floor Telemetry" [level=3] [ref=e207]
                - paragraph [ref=e208]: Interactive 3D isometric floors with real-time bed census & staffing ratios.
              - generic [ref=e209]:
                - generic [ref=e210]: 3D Floors
                - generic [ref=e211]: Bed Census
                - generic [ref=e212]: Staffing
          - generic [ref=e213]: Launch Interactive Demo
        - generic [ref=e219] [cursor=pointer]:
          - generic [ref=e220]:
            - generic [ref=e222]:
              - generic [ref=e223]:
                - generic [ref=e224]: 94% QA Score
                - generic [ref=e225]: Agent Call Recording & Coaching
                - generic [ref=e226]: Live PBX Connected
              - img [ref=e229]:
                - generic [ref=e236]:
                  - generic [ref=e238]: TELEPHONY QA
                  - generic [ref=e239]: 94% POS
                  - generic [ref=e240]: "Sentiment: High Empathy"
                - generic [ref=e242]: 04:18 • Recording Monitored
            - generic [ref=e246]:
              - generic [ref=e247]:
                - heading "Call Center & AI Agent Coaching Analytics" [level=3] [ref=e248]
                - paragraph [ref=e249]: Automated telephony call recording QA, quality scoring, and patient sentiment analytics.
              - generic [ref=e250]:
                - generic [ref=e251]: TATA / Exotel CRM
                - generic [ref=e252]: Audio QA
                - generic [ref=e253]: Sentiment AI
          - generic [ref=e254]: Launch Interactive Demo
        - generic [ref=e260] [cursor=pointer]:
          - generic [ref=e261]:
            - generic [ref=e263]:
              - generic [ref=e264]:
                - generic [ref=e265]: ABCD CRM Pro
                - generic [ref=e266]: WhatsApp • Meta • Email • Chat
                - generic [ref=e267]:
                  - generic [ref=e268]: ★ 4.92 CSAT
                  - generic [ref=e269]: •
                  - generic [ref=e270]: < 2m First Response SLA
              - img [ref=e272]:
                - generic [ref=e283]: Can I reschedule OPD?
                - generic [ref=e285]: "NOTE: Dr. Rao in OT"
                - generic [ref=e286]: Suggest 4 PM slot
                - generic [ref=e288]: Confirmed for 4 PM ✓✓
                - generic [ref=e294]: BOOK OPD
                - generic [ref=e296]: PAY LINK
            - generic [ref=e297]:
              - generic [ref=e298]:
                - heading "Omnichannel CRM & Unified Inbox" [level=3] [ref=e299]
                - paragraph [ref=e300]: Intercom & WhatsApp Business inbox across 7 channels with patient 360° profile, internal notes & SLA desk.
              - generic [ref=e301]:
                - generic [ref=e302]: WhatsApp Business
                - generic [ref=e303]: 7-Channel Inbox
                - generic [ref=e304]: Patient 360°
                - generic [ref=e305]: SLA Desk
          - generic [ref=e306]: Launch Interactive Demo
        - generic [ref=e312] [cursor=pointer]:
          - generic [ref=e313]:
            - generic [ref=e316]:
              - generic [ref=e317]: abcd.health/s/rx-104
              - generic [ref=e318]: Digital Lab Report & WhatsApp
              - text: 🔒 256-bit Encrypted Token
            - generic [ref=e349]:
              - generic [ref=e350]:
                - heading "Healthcare Smart URL & QR Generator" [level=3] [ref=e351]
                - paragraph [ref=e352]: Encrypted short links & dynamic QR codes for lab reports & patient portals.
              - generic [ref=e353]:
                - generic [ref=e354]: Dynamic QR
                - generic [ref=e355]: Secure Short URLs
                - generic [ref=e356]: Lab Reports
          - generic [ref=e357]: Launch Interactive Demo
        - generic [ref=e363] [cursor=pointer]:
          - generic [ref=e364]:
            - generic [ref=e366]:
              - generic [ref=e367]:
                - generic [ref=e368]:
                  - generic [ref=e369]: "#W-04"
                  - generic [ref=e370]: Room 104
                - generic [ref=e371]: "Next: #W-05 • Waiting: 6"
                - text: 🔔 Voice TTS Enabled
              - img [ref=e373]:
                - generic [ref=e374]:
                  - generic [ref=e377]: TOUCH TO PRINT
                  - generic [ref=e379]: NEW TOKEN
                  - generic [ref=e381]:
                    - generic [ref=e383]: CITY OPD
                    - generic [ref=e384]: "#W-04"
                - generic [ref=e392]:
                  - generic [ref=e394]: NEXT CALL
                  - generic [ref=e395]: "TOKEN #W-05"
            - generic [ref=e396]:
              - generic [ref=e397]:
                - heading "OP Token Desk & Waiting Room" [level=3] [ref=e398]
                - paragraph [ref=e399]: Automated token generation, audio announcer, and waiting pool routing.
              - generic [ref=e400]:
                - generic [ref=e401]: Audio Chimes
                - generic [ref=e402]: Queue Pools
                - generic [ref=e403]: Display Board
          - generic [ref=e404]: Launch Interactive Demo
        - generic [ref=e410] [cursor=pointer]:
          - generic [ref=e411]:
            - generic [ref=e413]:
              - generic [ref=e414]:
                - generic [ref=e415]: AI Voice to EHR
                - generic [ref=e416]: Telugu • English • Hindi
                - generic [ref=e417]: Clinical Speech Model
              - img [ref=e420]:
                - generic [ref=e432]: తెలుగు • Eng • हिन्दी
            - generic [ref=e435]:
              - generic [ref=e436]:
                - heading "Speech to Text & Clinical Voice Dictation" [level=3] [ref=e437]
                - paragraph [ref=e438]: Real-time doctor voice dictation for prescriptions with Telugu/Hindi/English recognition.
              - generic [ref=e439]:
                - generic [ref=e440]: Real-Time Mic
                - generic [ref=e441]: Telugu/Hindi/Eng
                - generic [ref=e442]: EHR Dictation
          - generic [ref=e443]: Launch Interactive Demo
    - generic [ref=e450]:
      - generic [ref=e451]:
        - generic [ref=e457]:
          - heading "Professional Experience" [level=2] [ref=e458]
          - paragraph [ref=e459]: Career journey in building enterprise Healthcare SaaS, CRM, EHR & AI platforms
        - generic [ref=e460]: 7+ Years Total Experience
      - generic [ref=e461]:
        - generic [ref=e465]:
          - generic [ref=e466]:
            - generic [ref=e467]:
              - heading "Senior UI Developer - CRM" [level=3] [ref=e468]
              - generic [ref=e469]: Apex Cura Healthcare IT Solutions Pvt Ltd.
            - generic [ref=e475]:
              - generic [ref=e476]: Apr 2024 — Jul 2026
              - generic [ref=e477]: (2 yrs 4 mos) • Hyderabad, India
          - paragraph [ref=e478]: Architected and engineered an AI-first, multi-tenant Healthcare CRM and Patient Engagement SaaS platform serving multiple hospitals, automating lead acquisition, omnichannel patient communication, and AI call coaching.
          - generic [ref=e479]:
            - generic [ref=e480]: "Key Contributions & Engineering Impact:"
            - list [ref=e481]:
              - listitem [ref=e482]:
                - generic [ref=e486]: Architected multi-tenant CRM enabling patient acquisition, omnichannel communication, call recording management, and automated appointment scheduling.
              - listitem [ref=e487]:
                - generic [ref=e491]: Built Omnichannel Lead Management integrating hospital websites, AI web chatbots, WhatsApp Business API, Facebook Messenger, Instagram, and Meta Lead Ads.
              - listitem [ref=e492]:
                - generic [ref=e496]: Engineered an AI-powered Call Analytics engine with telephony integrations (TATA SmartFlo, Exotel, ConVox) generating automated call transcripts, quality scores, sentiment analysis, and agent coaching metrics.
              - listitem [ref=e497]:
                - generic [ref=e501]: Constructed an intelligent Lead Assignment Engine distributing leads based on hospital branch geolocation, agent availability, and workload balancing algorithms.
              - listitem [ref=e502]:
                - generic [ref=e506]: Automated WhatsApp patient feedback workflows for Inpatient (IP) and Outpatient (OP) departments, centralizing NPS reports for quality audits.
              - listitem [ref=e507]:
                - generic [ref=e511]: Prepared and annotated healthcare conversational datasets to fine-tune AI chatbots and clinical intake models.
          - generic [ref=e512]:
            - generic [ref=e513]: "Tech:"
            - generic [ref=e514]: React.js (v16.8+)
            - generic [ref=e515]: Next.js
            - generic [ref=e516]: Redux
            - generic [ref=e517]: TypeScript
            - generic [ref=e518]: Node.js
            - generic [ref=e519]: Tailwind CSS
            - generic [ref=e520]: Meta Business API
            - generic [ref=e521]: Telephony APIs
            - generic [ref=e522]: AWS S3/RDS
            - generic [ref=e523]: Webhooks
        - generic [ref=e527]:
          - generic [ref=e528]:
            - generic [ref=e529]:
              - heading "Software Engineer - EHR" [level=3] [ref=e530]
              - generic [ref=e531]: Aurora e-Labs Pvt Ltd.
            - generic [ref=e537]:
              - generic [ref=e538]: May 2019 — Mar 2024
              - generic [ref=e539]: (4 yrs 10 mos) • Hyderabad, India
          - paragraph [ref=e540]: Spearheaded development of comprehensive Electronic Health Record (EHR) modules and remote patient telemetry for major hospital chains including K**S Hospitals.
          - generic [ref=e541]:
            - generic [ref=e542]: "Key Contributions & Engineering Impact:"
            - list [ref=e543]:
              - listitem [ref=e544]:
                - generic [ref=e548]: Engineered core EHR clinical modules including IP Discharge Summary, Nursing Clinical Forms, Drug Charts, Intake/Output (I/O) Records, Vitals, and Diagnostic Lab Reports.
              - listitem [ref=e549]:
                - generic [ref=e553]: Integrated Dozee Remote Patient Monitoring (RPM) IoT contactless sensors to stream real-time patient vitals into the EHR, enabling early warning clinical alerts.
              - listitem [ref=e554]:
                - generic [ref=e558]: Developed doctor-facing React Native mobile application for continuous inpatient (IP) and outpatient (OP) tracking from handheld devices.
              - listitem [ref=e559]:
                - generic [ref=e563]: Implemented role-based security workflows (RBAC) ensuring granular access control for Chief Medical Officers, duty doctors, nurses, and billing admins.
              - listitem [ref=e564]:
                - generic [ref=e568]: Refactored state management and component libraries into reusable packages, reducing frontend bundle size by 35% and improving render times.
          - generic [ref=e569]:
            - generic [ref=e570]: "Tech:"
            - generic [ref=e571]: React.js
            - generic [ref=e572]: React Native
            - generic [ref=e573]: Redux
            - generic [ref=e574]: Node.js
            - generic [ref=e575]: PostgreSQL
            - generic [ref=e576]: Dozee RPM IoT
            - generic [ref=e577]: UI Kitten
            - generic [ref=e578]: REST APIs
            - generic [ref=e579]: Socket.IO
        - generic [ref=e583]:
          - generic [ref=e584]:
            - generic [ref=e585]:
              - heading "UI Developer - Web Pages" [level=3] [ref=e586]
              - generic [ref=e587]: LPtechlog Pvt Ltd.
            - generic [ref=e593]:
              - generic [ref=e594]: Jul 2018 — Jan 2019
              - generic [ref=e595]: (7 mos) • Hyderabad, India
          - paragraph [ref=e596]: Designed and converted UI mockups into responsive, high-performance web applications with semantic HTML5, CSS3, JavaScript, and Bootstrap.
          - generic [ref=e597]:
            - generic [ref=e598]: "Key Contributions & Engineering Impact:"
            - list [ref=e599]:
              - listitem [ref=e600]:
                - generic [ref=e604]: Delivered pixel-perfect responsive layouts ensuring full visual fidelity and cross-browser consistency across mobile, tablet, and desktop viewports.
              - listitem [ref=e605]:
                - generic [ref=e609]: Authored modular, maintainable stylesheets and reusable client components, accelerating sprint delivery cycles.
              - listitem [ref=e610]:
                - generic [ref=e614]: Profiled browser rendering performance and eliminated layout thrashing to guarantee fluid 60fps user interactions.
          - generic [ref=e615]:
            - generic [ref=e616]: "Tech:"
            - generic [ref=e617]: JavaScript (ES6)
            - generic [ref=e618]: HTML5
            - generic [ref=e619]: CSS3
            - generic [ref=e620]: Bootstrap
            - generic [ref=e621]: jQuery
            - generic [ref=e622]: Git
    - generic [ref=e624]:
      - generic [ref=e625]:
        - generic [ref=e626]: FEATURED ARCHITECTURE
        - generic [ref=e627]: Apex Cura Healthcare CRM
      - heading "Omnichannel Patient Ingestion, AI Telephony & Automated Lead Engine" [level=3] [ref=e628]
      - paragraph [ref=e629]: Constructed a unified patient intake hub aggregating real-time patient requests across web chatbots, WhatsApp Business API, telephony inbound/outbound calls, Facebook Messenger, and Meta Lead Ads. Integrated automated call transcription and sentiment scoring to monitor doctor and agent communication quality, reducing lead response latency by over 60% across hospital branches.
      - generic [ref=e630]:
        - generic [ref=e631]:
          - generic [ref=e632]: 7+ Yrs
          - text: Healthcare Engineering
        - generic [ref=e633]:
          - generic [ref=e634]: 15+
          - text: Enterprise Integrations
        - generic [ref=e635]:
          - generic [ref=e636]: < 15 min
          - text: Lead Routing SLA
        - generic [ref=e637]:
          - generic [ref=e638]: 100%
          - text: EHR / NABH Aligned
    - generic [ref=e640]:
      - generic [ref=e641]:
        - generic [ref=e648]:
          - heading "Portfolio Projects" [level=2] [ref=e649]
          - paragraph [ref=e650]: Comprehensive systems built across Healthcare SaaS, EHR, and Mobile
        - textbox "Search projects or stack..." [ref=e655]
      - generic [ref=e656]:
        - button "All Projects" [ref=e657] [cursor=pointer]
        - button "Healthcare CRM" [ref=e658] [cursor=pointer]
        - button "Clinical EHR" [ref=e659] [cursor=pointer]
        - button "Mobile Apps" [ref=e660] [cursor=pointer]
      - generic [ref=e661]:
        - generic [ref=e662]:
          - generic [ref=e663]:
            - generic [ref=e664]:
              - heading "Customer Relationship Management (CRM) - Web Application" [level=3] [ref=e665]
              - paragraph [ref=e666]: "Client: Apex Cura Healthcare • Team: 15 members • (Apr 2024 – Jul 2026)"
            - generic [ref=e667]: Featured
          - paragraph [ref=e668]: AI-powered, multi-tenant Healthcare CRM supporting patient acquisition, omnichannel chat routing, telephony call intelligence, automated appointment lifecycles, and IP/OP patient satisfaction feedback.
          - generic [ref=e669]:
            - generic [ref=e670]:
              - generic [ref=e671]: ✓
              - generic [ref=e672]: Omnichannel lead ingestion from Meta Ads, WhatsApp, Webhooks, and web chatbots
            - generic [ref=e673]:
              - generic [ref=e674]: ✓
              - generic [ref=e675]: AI Call Analytics with automatic transcription, quality scoring, and sentiment tagging
            - generic [ref=e676]:
              - generic [ref=e677]: ✓
              - generic [ref=e678]: Workload-balanced lead routing engine factoring branch location and agent load
            - generic [ref=e679]:
              - generic [ref=e680]: ✓
              - generic [ref=e681]: Automated WhatsApp appointment reminders and multi-step rescheduling flows
          - generic [ref=e682]:
            - generic [ref=e683]: React.js
            - generic [ref=e690]: Redux
            - generic [ref=e696]: Node.js
            - generic [ref=e700]: PostgreSQL
            - generic [ref=e705]:
              - img [ref=e706]:
                - generic [ref=e710]: AWS
              - generic [ref=e711]: AWS S3/EC2
            - generic [ref=e712]: Telephony APIs
            - generic [ref=e718]: Meta API
        - generic [ref=e722]:
          - generic [ref=e723]:
            - generic [ref=e724]:
              - heading "Electronic Health Record (EHR) - Web Application" [level=3] [ref=e725]
              - paragraph [ref=e726]: "Client: K**S Hospitals • Team: 5 members • (Mar 2021 – Mar 2024)"
            - generic [ref=e727]: Featured
          - paragraph [ref=e728]: Enterprise hospital EHR platform digitizing medical records for clinical administrators, senior consultants, and duty nurses across inpatient and outpatient departments.
          - generic [ref=e729]:
            - generic [ref=e730]:
              - generic [ref=e731]: ✓
              - generic [ref=e732]: Interactive Nursing Notes, Drug Charts, Intake/Output (I/O), and Discharge Summaries
            - generic [ref=e733]:
              - generic [ref=e734]: ✓
              - generic [ref=e735]: Real-time vital signs synchronization with Dozee contactless remote patient monitoring
            - generic [ref=e736]:
              - generic [ref=e737]: ✓
              - generic [ref=e738]: Role-based clinical workflows adhering to healthcare compliance and data privacy
            - generic [ref=e739]:
              - generic [ref=e740]: ✓
              - generic [ref=e741]: Integrated laboratory test ordering and diagnostic result visualization
          - generic [ref=e742]:
            - generic [ref=e743]: React.js
            - generic [ref=e750]: Node.js
            - generic [ref=e754]: PostgreSQL
            - generic [ref=e759]: REST APIs
            - generic [ref=e765]: Socket.IO
            - generic [ref=e770]: Highcharts
        - generic [ref=e776]:
          - generic [ref=e778]:
            - heading "Electronic Health Record (EHR) - Mobile Application" [level=3] [ref=e779]
            - paragraph [ref=e780]: "Client: K**S Hospitals • Team: 5 members • (Mar 2021 – Mar 2024)"
          - paragraph [ref=e781]: Doctor companion mobile application enabling physicians to round on inpatients, review test results, verify drug charts, and acknowledge critical alerts on-the-go.
          - generic [ref=e782]:
            - generic [ref=e783]:
              - generic [ref=e784]: ✓
              - generic [ref=e785]: Native Android and iOS mobile app with offline-capable clinical notes cache
            - generic [ref=e786]:
              - generic [ref=e787]: ✓
              - generic [ref=e788]: Firebase push notifications for critical vitals threshold breaches
            - generic [ref=e789]:
              - generic [ref=e790]: ✓
              - generic [ref=e791]: Fast patient search by UHID, IP number, and bed location
          - generic [ref=e792]:
            - generic [ref=e793]: React Native
            - generic [ref=e800]: UI Kitten
            - generic [ref=e805]: React Native Paper
            - generic [ref=e812]: Firebase
            - generic [ref=e818]: REST APIs
        - generic [ref=e824]:
          - generic [ref=e826]:
            - heading "Hospital Queue Management System" [level=3] [ref=e827]
            - paragraph [ref=e828]: "Client: K**S Hospitals • Team: 5 members • (Jan 2021 – Mar 2021)"
          - paragraph [ref=e829]: Intelligent outpatient queue sequencing system handling appointment check-ins, token generation, triage prioritization, and waiting lobby digital signage.
          - generic [ref=e830]:
            - generic [ref=e831]:
              - generic [ref=e832]: ✓
              - generic [ref=e833]: Priority-based queue ordering for elderly, emergency, and pregnant patients
            - generic [ref=e834]:
              - generic [ref=e835]: ✓
              - generic [ref=e836]: Real-time WebSocket token display board with audio chime announcements
            - generic [ref=e837]:
              - generic [ref=e838]: ✓
              - generic [ref=e839]: Historical queue wait-time metrics for hospital administrative reporting
          - generic [ref=e840]:
            - generic [ref=e841]: Node.js
            - generic [ref=e845]: PostgreSQL
            - generic [ref=e850]: Socket.IO
            - generic [ref=e855]: React.js
            - generic [ref=e862]: Tailwind CSS
        - generic [ref=e866]:
          - generic [ref=e868]:
            - heading "Hospital Financial Management & Counselling System" [level=3] [ref=e869]
            - paragraph [ref=e870]: "Client: K**S Hospitals • Team: 5 members • (Mar 2020 – Jan 2021)"
          - paragraph [ref=e871]: Patient financial counseling application managing treatment cost estimation, insurance pre-authorization, KYC verification, and billing reconciliations.
          - generic [ref=e872]:
            - generic [ref=e873]:
              - generic [ref=e874]: ✓
              - generic [ref=e875]: Automated surgical procedure cost estimator with package itemization
            - generic [ref=e876]:
              - generic [ref=e877]: ✓
              - generic [ref=e878]: Insurance vs. cash payment split management and KYC document storage
            - generic [ref=e879]:
              - generic [ref=e880]: ✓
              - generic [ref=e881]: Consolidated revenue reports with multi-criteria date-range filters
          - generic [ref=e882]:
            - generic [ref=e883]: React.js
            - generic [ref=e890]: Node.js
            - generic [ref=e894]: PostgreSQL
            - generic [ref=e899]:
              - img [ref=e900]:
                - generic [ref=e902]: ex
              - generic [ref=e903]: Express.js
            - generic [ref=e904]: Chart.js
        - generic [ref=e910]:
          - generic [ref=e912]:
            - heading "Medical Consultation - Mobile Application" [level=3] [ref=e913]
            - paragraph [ref=e914]: "Client: Second Aid • Team: 3 members • (Aug 2019 – Jun 2020)"
          - paragraph [ref=e915]: Tele-health mobile consultation platform facilitating secure doctor-patient messaging, medical record sharing, electronic prescriptions, and in-app payments.
          - generic [ref=e916]:
            - generic [ref=e917]:
              - generic [ref=e918]: ✓
              - generic [ref=e919]: Stream Chat and Firebase integration for real-time consultation messaging
            - generic [ref=e920]:
              - generic [ref=e921]: ✓
              - generic [ref=e922]: Dual payment gateway integration with Stripe and Paytm
            - generic [ref=e923]:
              - generic [ref=e924]: ✓
              - generic [ref=e925]: Encrypted medical report uploads and digital prescriptions sharing
          - generic [ref=e926]:
            - generic [ref=e927]: React Native (Expo)
            - generic [ref=e934]: Redux
            - generic [ref=e940]: Firebase
            - generic [ref=e946]: Stream Chat
            - generic [ref=e951]: Stripe API
            - generic [ref=e956]: Paytm
        - generic [ref=e961]:
          - generic [ref=e963]:
            - heading "Smart Learning - Mobile Application" [level=3] [ref=e964]
            - paragraph [ref=e965]: "Client: Kaizen Kids • Team: 3 members • (Jun 2020 – Jan 2021)"
          - paragraph [ref=e966]: Interactive educational app for worksheets, camera-based homework submissions, teacher grading workflows, and real-time student evaluation cards.
          - generic [ref=e967]:
            - generic [ref=e968]:
              - generic [ref=e969]: ✓
              - generic [ref=e970]: Camera and gallery image submission pipelines with client-side compression
            - generic [ref=e971]:
              - generic [ref=e972]: ✓
              - generic [ref=e973]: Dual parent and student portal with progress milestone tracking
            - generic [ref=e974]:
              - generic [ref=e975]: ✓
              - generic [ref=e976]: Deployed to both Google Play Store and Apple App Store
          - generic [ref=e977]:
            - generic [ref=e978]: React Native
            - generic [ref=e985]: Expo
            - generic [ref=e989]: Redux
            - generic [ref=e995]: Node.js
            - generic [ref=e999]: REST APIs
    - generic [ref=e1006]:
      - heading "Technical Skills & Tech Stack" [level=2] [ref=e1011]
      - generic [ref=e1012]:
        - generic [ref=e1013]:
          - generic [ref=e1014]:
            - heading "Frontend Architecture" [level=3] [ref=e1020]
            - generic [ref=e1021]: "14"
          - generic [ref=e1022]:
            - generic [ref=e1023]: React.js (v16.8+)
            - generic [ref=e1030]: React Native
            - generic [ref=e1037]: Next.js
            - generic [ref=e1042]: TypeScript
            - generic [ref=e1048]: JavaScript (ES6+)
            - generic [ref=e1053]: Redux Toolkit
            - generic [ref=e1059]: Tailwind CSS
            - generic [ref=e1063]: Bootstrap 4/5
            - generic [ref=e1068]: Material UI
            - generic [ref=e1072]: Chakra UI
            - generic [ref=e1077]: Ant Design
            - generic [ref=e1082]: UI-Kitten
            - generic [ref=e1087]: Highcharts
            - generic [ref=e1093]: Chart.js
        - generic [ref=e1099]:
          - generic [ref=e1100]:
            - heading "Backend & APIs" [level=3] [ref=e1105]
            - generic [ref=e1106]: "11"
          - generic [ref=e1107]:
            - generic [ref=e1108]: Node.js
            - generic [ref=e1112]:
              - img [ref=e1113]:
                - generic [ref=e1115]: ex
              - generic [ref=e1116]: Express.js
            - generic [ref=e1117]: REST APIs
            - generic [ref=e1123]: Socket.IO (WebSockets)
            - generic [ref=e1128]: Webhooks Architecture
            - generic [ref=e1134]: Redis Caching
            - generic [ref=e1140]: JWT Authentication
            - generic [ref=e1146]: Swagger / OpenAPI
            - generic [ref=e1151]: PM2 Process Manager
            - generic [ref=e1157]: Multer
            - generic [ref=e1162]: Nodemailer
        - generic [ref=e1166]:
          - generic [ref=e1167]:
            - heading "Databases & Storage" [level=3] [ref=e1173]
            - generic [ref=e1174]: "6"
          - generic [ref=e1175]:
            - generic [ref=e1176]: PostgreSQL
            - generic [ref=e1181]: MongoDB
            - generic [ref=e1185]: Firebase Realtime DB
            - generic [ref=e1191]:
              - img [ref=e1192]:
                - generic [ref=e1196]: AWS
              - generic [ref=e1197]: AWS S3 Bucket
            - generic [ref=e1198]: Redis In-Memory
            - generic [ref=e1204]: SQL Query Optimization
        - generic [ref=e1211]:
          - generic [ref=e1212]:
            - heading "Cloud, Telecom & Integrations" [level=3] [ref=e1216]
            - generic [ref=e1217]: "6"
          - generic [ref=e1218]:
            - generic [ref=e1219]:
              - img [ref=e1220]:
                - generic [ref=e1224]: AWS
              - generic [ref=e1225]: AWS (EC2, S3, RDS, IAM, CloudWatch)
            - generic [ref=e1226]: Meta Business API (WhatsApp, Instagram, Ads)
            - generic [ref=e1230]: Telephony APIs (TATA SmartFlo, Exotel, ConVox)
            - generic [ref=e1236]: HIMS Integration (Suvarna, Practo)
            - generic [ref=e1241]: Dozee Remote Patient Monitoring (RPM)
            - generic [ref=e1245]: Stripe & Paytm Payment Gateways
        - generic [ref=e1250]:
          - generic [ref=e1251]:
            - heading "DevOps & Engineering Tools" [level=3] [ref=e1255]
            - generic [ref=e1256]: "9"
          - generic [ref=e1257]:
            - generic [ref=e1258]: GitHub Actions (CI/CD)
            - generic [ref=e1262]: Git & Bitbucket
            - generic [ref=e1268]: Docker basics
            - generic [ref=e1272]: Figma UI/UX
            - generic [ref=e1280]: Postman API Testing
            - generic [ref=e1285]: DBeaver SQL Client
            - generic [ref=e1292]: Webpack & Vite
            - generic [ref=e1297]: NPM / Yarn
            - generic [ref=e1302]: VS Code
    - generic [ref=e1307]:
      - paragraph [ref=e1308]: Interested in discussing modern healthcare architecture, full-stack development, or exploring opportunities?
      - generic [ref=e1309]:
        - link "Let's Connect ✉" [ref=e1310] [cursor=pointer]:
          - /url: mailto:tanguturi.mani@gmail.com
        - link "LinkedIn Profile" [ref=e1315] [cursor=pointer]:
          - /url: https://linkedin.com/in/manikanta-sai
      - generic [ref=e1321]:
        - link "LinkedIn" [ref=e1322] [cursor=pointer]:
          - /url: https://linkedin.com/in/manikanta-sai
        - link "Email" [ref=e1327] [cursor=pointer]:
          - /url: mailto:tanguturi.mani@gmail.com
        - link "Credly" [ref=e1331] [cursor=pointer]:
          - /url: https://www.credly.com/users/manikanta-sai.14d35454
      - generic [ref=e1335]: © 2026 Manikanta Sai Tanguturi. Built with React & Tailwind CSS.
```

# Test source

```ts
  5   |     await page.goto('/');
  6   | 
  7   |     // Wait until window.hospitalDb is initialized
  8   |     await page.waitForFunction(() => !!window.hospitalDb && !!window.hospitalDbSeed);
  9   | 
  10  |     const dbVerification = await page.evaluate(async () => {
  11  |       const db = window.hospitalDb;
  12  |       const seed = window.hospitalDbSeed;
  13  | 
  14  |       // 1. Verify Database Name and Tables
  15  |       const dbName = db.name;
  16  |       const tables = db.tables.map((t) => t.name).sort();
  17  | 
  18  |       // 2. Explicitly reset to verify resetDatabase works
  19  |       await seed.resetDatabase(db);
  20  | 
  21  |       // 3. Verify Patient Count and Content
  22  |       const patients = await db.patients.toArray();
  23  |       const patient1 = await db.patients.get('pat_10482');
  24  |       const patient2 = await db.patients.get('pat_10483');
  25  |       const patient3 = await db.patients.get('pat_10484');
  26  |       const patient4 = await db.patients.get('pat_10485');
  27  |       const patient5 = await db.patients.get('pat_10481');
  28  |       const patient6 = await db.patients.get('pat_10480');
  29  | 
  30  |       // 4. Verify Prescriptions
  31  |       const prescriptions = await db.prescriptions.toArray();
  32  |       const rx1 = await db.prescriptions.get('rx_10482');
  33  |       const rx5 = await db.prescriptions.get('rx_10481');
  34  |       const rx6 = await db.prescriptions.get('rx_10480');
  35  | 
  36  |       // 5. Verify Admin Config
  37  |       const adminConfigs = await db.adminConfig.toArray();
  38  |       const chiefComplaintsConfig = await db.adminConfig.get('chief_complaints');
  39  |       const vitalsConfig = await db.adminConfig.get('vitals');
  40  |       const allergiesConfig = await db.adminConfig.get('allergies');
  41  |       const diagnosisConfig = await db.adminConfig.get('diagnosis');
  42  |       const medicationsConfig = await db.adminConfig.get('medications');
  43  |       const investigationsConfig = await db.adminConfig.get('investigations');
  44  |       const dietAdviceConfig = await db.adminConfig.get('diet_advice');
  45  |       const followUpConfig = await db.adminConfig.get('follow_up');
  46  |       const referralAdmitConfig = await db.adminConfig.get('referral_admit');
  47  | 
  48  |       // 6. Verify Custom Dictionary
  49  |       const dictionary = await db.customDictionary.toArray();
  50  |       const pcmShortcut = await db.customDictionary.where('shortcut').equals('pcm').first();
  51  |       const amoxShortcut = await db.customDictionary.where('shortcut').equals('amox').first();
  52  |       const htnShortcut = await db.customDictionary.where('shortcut').equals('htn').first();
  53  |       const t2dmShortcut = await db.customDictionary.where('shortcut').equals('t2dm').first();
  54  |       const odPcShortcut = await db.customDictionary.where('shortcut').equals('od-pc').first();
  55  |       const bdPcShortcut = await db.customDictionary.where('shortcut').equals('bd-pc').first();
  56  | 
  57  |       // 7. Verify Schema Indexes
  58  |       const tableSchemas = {};
  59  |       db.tables.forEach((t) => {
  60  |         tableSchemas[t.name] = {
  61  |           primKey: t.schema.primKey.name,
  62  |           indexes: t.schema.indexes.map((idx) => idx.name),
  63  |         };
  64  |       });
  65  | 
  66  |       return {
  67  |         dbName,
  68  |         tables,
  69  |         tableSchemas,
  70  |         patientCount: patients.length,
  71  |         prescriptionCount: prescriptions.length,
  72  |         adminConfigCount: adminConfigs.length,
  73  |         dictionaryCount: dictionary.length,
  74  |         patient1,
  75  |         patient2,
  76  |         patient3,
  77  |         patient4,
  78  |         patient5,
  79  |         patient6,
  80  |         rx1,
  81  |         rx5,
  82  |         rx6,
  83  |         chiefComplaintsConfig,
  84  |         vitalsConfig,
  85  |         allergiesConfig,
  86  |         diagnosisConfig,
  87  |         medicationsConfig,
  88  |         investigationsConfig,
  89  |         dietAdviceConfig,
  90  |         followUpConfig,
  91  |         referralAdmitConfig,
  92  |         shortcuts: {
  93  |           pcm: pcmShortcut?.expansion,
  94  |           amox: amoxShortcut?.expansion,
  95  |           htn: htnShortcut?.expansion,
  96  |           t2dm: t2dmShortcut?.expansion,
  97  |           odPc: odPcShortcut?.expansion,
  98  |           bdPc: bdPcShortcut?.expansion,
  99  |         },
  100 |       };
  101 |     });
  102 | 
  103 |     // Assertions: Database Name and Stores
  104 |     expect(dbVerification.dbName).toBe('HospitalOPD_DB');
> 105 |     expect(dbVerification.tables).toEqual(['adminConfig', 'customDictionary', 'patients', 'prescriptions'].sort());
      |                                   ^ Error: expect(received).toEqual(expected) // deep equality
  106 | 
  107 |     // Verify Schema Primary Keys and Indexes
  108 |     expect(dbVerification.tableSchemas.patients.primKey).toBe('id');
  109 |     expect(dbVerification.tableSchemas.patients.indexes).toEqual(
  110 |       expect.arrayContaining(['uhid', 'tokenNumber', 'name', 'queueStatus', 'consultationType', 'priority'])
  111 |     );
  112 | 
  113 |     expect(dbVerification.tableSchemas.prescriptions.primKey).toBe('id');
  114 |     expect(dbVerification.tableSchemas.prescriptions.indexes).toEqual(
  115 |       expect.arrayContaining(['patientId', 'status', 'updatedAt', 'isFinalized'])
  116 |     );
  117 | 
  118 |     expect(dbVerification.tableSchemas.adminConfig.primKey).toBe('sectionKey');
  119 |     expect(dbVerification.tableSchemas.adminConfig.indexes).toEqual(
  120 |       expect.arrayContaining(['isMandatory', 'isEnabled'])
  121 |     );
  122 | 
  123 |     expect(dbVerification.tableSchemas.customDictionary.primKey).toBe('id');
  124 |     expect(dbVerification.tableSchemas.customDictionary.indexes).toEqual(
  125 |       expect.arrayContaining(['shortcut', 'category'])
  126 |     );
  127 | 
  128 |     // Verify Counts
  129 |     expect(dbVerification.patientCount).toBe(6);
  130 |     expect(dbVerification.prescriptionCount).toBe(3);
  131 |     expect(dbVerification.adminConfigCount).toBe(9);
  132 |     expect(dbVerification.dictionaryCount).toBeGreaterThanOrEqual(6);
  133 | 
  134 |     // Patient 1 (In-Consultation / Active Desk)
  135 |     expect(dbVerification.patient1.name).toBe('Anita Verma');
  136 |     expect(dbVerification.patient1.age).toBe(28);
  137 |     expect(dbVerification.patient1.gender).toBe('Female');
  138 |     expect(dbVerification.patient1.uhid).toBe('UHID-10482');
  139 |     expect(dbVerification.patient1.tokenNumber).toBe('#W-04');
  140 |     expect(dbVerification.patient1.consultationType).toBe('walk_in');
  141 |     expect(dbVerification.patient1.queueStatus).toBe('in_consultation');
  142 |     expect(dbVerification.patient1.isPregnant).toBe(true);
  143 |     expect(dbVerification.patient1.pregnancyDetails.trimester).toBe('2nd');
  144 |     expect(dbVerification.patient1.pregnancyDetails.gestationalWeeks).toBe(22);
  145 |     expect(dbVerification.patient1.allergies).toContain('Penicillin (Severe)');
  146 |     expect(dbVerification.patient1.vitals.bp).toBe('110/70');
  147 |     expect(dbVerification.patient1.vitals.pulse).toBe(82);
  148 |     expect(dbVerification.patient1.vitals.temp).toBe(98.4);
  149 |     expect(dbVerification.patient1.vitals.spo2).toBe(99);
  150 |     expect(dbVerification.patient1.chiefComplaintSummary).toContain('morning nausea');
  151 |     expect(dbVerification.rx1.status).toBe('draft');
  152 |     expect(dbVerification.rx1.isFinalized).toBe(false);
  153 |     expect(dbVerification.rx1.medications.length).toBeGreaterThan(0);
  154 |     expect(dbVerification.rx1.doctorDetails.name).toBe('Dr. Rajesh Sharma, MD');
  155 | 
  156 |     // Patient 2 (Waiting - Walk-in)
  157 |     expect(dbVerification.patient2.name).toBe('Vikram Singh');
  158 |     expect(dbVerification.patient2.age).toBe(45);
  159 |     expect(dbVerification.patient2.gender).toBe('Male');
  160 |     expect(dbVerification.patient2.uhid).toBe('UHID-10483');
  161 |     expect(dbVerification.patient2.tokenNumber).toBe('#W-05');
  162 |     expect(dbVerification.patient2.queueStatus).toBe('waiting');
  163 |     expect(dbVerification.patient2.consultationType).toBe('walk_in');
  164 |     expect(dbVerification.patient2.visitType).toBe('follow_up');
  165 |     expect(dbVerification.patient2.allergies).toContain('NKDA');
  166 |     expect(dbVerification.patient2.vitals.bp).toBe('124/82');
  167 |     expect(dbVerification.patient2.vitals.pulse).toBe(74);
  168 | 
  169 |     // Patient 3 (Waiting - Online Booking)
  170 |     expect(dbVerification.patient3.name).toBe('Rajesh Patel');
  171 |     expect(dbVerification.patient3.age).toBe(54);
  172 |     expect(dbVerification.patient3.gender).toBe('Male');
  173 |     expect(dbVerification.patient3.uhid).toBe('UHID-10484');
  174 |     expect(dbVerification.patient3.tokenNumber).toBe('#ON-12');
  175 |     expect(dbVerification.patient3.queueStatus).toBe('waiting');
  176 |     expect(dbVerification.patient3.consultationType).toBe('online_booking');
  177 |     expect(dbVerification.patient3.scheduledTime).toBe('10:30 AM');
  178 |     expect(dbVerification.patient3.vitals.bp).toBe('150/95');
  179 | 
  180 |     // Patient 4 (Waiting - Tele-Consultation)
  181 |     expect(dbVerification.patient4.name).toBe('Sunita Devi');
  182 |     expect(dbVerification.patient4.age).toBe(62);
  183 |     expect(dbVerification.patient4.gender).toBe('Female');
  184 |     expect(dbVerification.patient4.uhid).toBe('UHID-10485');
  185 |     expect(dbVerification.patient4.tokenNumber).toBe('#TC-02');
  186 |     expect(dbVerification.patient4.queueStatus).toBe('waiting');
  187 |     expect(dbVerification.patient4.consultationType).toBe('tele_consultation');
  188 |     expect(dbVerification.patient4.scheduledTime).toBe('11:00 AM');
  189 |     expect(dbVerification.patient4.isHandicapped).toBe(true);
  190 | 
  191 |     // Patient 5 (Draft Labs)
  192 |     expect(dbVerification.patient5.name).toBe('Rahul Roy');
  193 |     expect(dbVerification.patient5.age).toBe(35);
  194 |     expect(dbVerification.patient5.gender).toBe('Male');
  195 |     expect(dbVerification.patient5.uhid).toBe('UHID-10481');
  196 |     expect(dbVerification.patient5.tokenNumber).toBe('#W-01');
  197 |     expect(dbVerification.patient5.queueStatus).toBe('draft_labs');
  198 |     expect(dbVerification.rx5.status).toBe('awaiting_labs');
  199 |     expect(dbVerification.rx5.isFinalized).toBe(false);
  200 |     expect(dbVerification.rx5.investigationsOrdered.map((i) => i.testName)).toEqual(
  201 |       expect.arrayContaining([
  202 |         'Complete Blood Count (CBC)',
  203 |         'Liver Function Test (LFT)',
  204 |         'Ultrasound Abdomen',
  205 |       ])
```