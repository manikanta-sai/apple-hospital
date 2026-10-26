---
name: enterprise-cloud-architect
description: >-
  Enterprise architectural auditor based on the AWS Well-Architected Framework
  adapted for modern full-stack web applications and AI healthcare widgets.
  Covers Security & Anti-Bot/DDoS Defense, Reliability & Resilience, Performance
  Efficiency, Cost Optimization, Operational Excellence, and Web Crawling/Scraping protection.
---

# Enterprise Well-Architected & Threat Defense Framework

Inspired by the **AWS Well-Architected Framework** and modern cyber-threat standards (OWASP Top 10, Cloudflare Bot Defense, MITRE ATT&CK), tailored for public-facing healthcare applications.

---

## Pillar 1: Security & Threat Defense (DDoS, Bot Attacks, PHI Protection)

1. **Bot & Automated Attack Mitigation:**
   - **Rate Limiting & Throttling:** Token-bucket or sliding-window rate limiting on sensitive API endpoints (e.g. max 5 booking attempts/minute, 30 chat messages/minute per IP/Session).
   - **Invisible CAPTCHA / Proof of Work:** Trigger Cloudflare Turnstile or reCAPTCHA v3 when behavioral anomalies (unnatural typing speed, repeated rapid clicks) are detected.
   - **Honeypot Form Fields:** Hidden fields in appointment forms (`PatientRegistrationForm.jsx`) that bots fill out but humans don't see.
2. **Layer 7 DDoS & Resource Exhaustion Defense:**
   - **Payload Size Limits:** Hard ceiling on JSON body size (e.g. 50KB for text, 5MB for attachments) to prevent memory exhaustion attacks.
   - **ReDoS (Regular Expression Denial of Service) Guards:** Ensure all user input regex validation (emails, phone numbers, search queries) is linear-time $O(N)$ and cannot lock the CPU event loop.
   - **Strict CORS & Tenant Boundary:** Explicit origin whitelisting and mandatory `X-Tenant-Id` header validation.
3. **Anti-Scraping & Web Crawling Protection:**
   - **Doctor & Pricing Harvester Defense:** Add obfuscation or request signing to prevent automated bots from scraping entire doctor directories, rosters, or hospital fee structures.
   - **Rate-limited Search APIs:** Prevent bots from brute-force enumerating doctor IDs or patient IDs.
   - **Dynamic Watermarking:** Verify forensic watermarking ([`ForensicWatermark.jsx`](file:///D:/testing/hospital-chatbot-widget/src/security/ForensicWatermark.jsx)) to trace unauthorized screenshots or leaked records.
4. **Data Protection & HIPAA Compliance:**
   - Zero PHI in browser URLs or unencrypted query params.
   - Automatic session purge on inactivity or tab closure.
   - DOMPurify HTML sanitization on all assistant and user-rendered payloads.

---

## Pillar 2: Performance Efficiency & Edge Optimization

1. **Rendering & Frame Budgeting:**
   - 60 FPS scrolling and interaction benchmarks.
   - Virtualized chat lists for long conversation histories (prevent DOM bloating past 100+ nodes).
   - Debounced search queries and throttled scroll event listeners.
2. **Edge Caching & Static Asset Delivery (CloudFront / CDN):**
   - Immutable cache headers for hashed JS/CSS bundles (`Cache-Control: public, max-age=31536000, immutable`).
   - SVG and asset compression (Brotli/Gzip).
   - Dynamic API caching for non-sensitive data (e.g. hospital departments, FAQ lists).
3. **Core Web Vitals:**
   - Sub-1.5s Largest Contentful Paint (LCP).
   - Sub-100ms Interaction to Next Paint (INP).
   - Zero Cumulative Layout Shift (CLS) on widget open/close animations.

---

## Pillar 3: Reliability & High Availability

1. **Circuit Breakers & Graceful Degradation:**
   - If AI LLM backend responds with 5xx or times out (>8s), trip circuit breaker to canned emergency contacts and human call center handover.
2. **Offline-First & Network Partition Tolerance:**
   - Dexie / IndexedDB queueing for outgoing appointment requests when patient enters low-connectivity hospital wings.
   - Automatic exponential backoff retry mechanism.
3. **Fault Isolation (Bulkhead Pattern):**
   - Widget failures must never crash the host hospital website (isolated React Error Boundaries).

---

## Pillar 4: Operational Excellence & Observability

1. **Health Probes & Telemetry:**
   - Client-side error telemetry (Sentry / Datadog or lightweight beacon) capturing unhandled promise rejections and boundary errors.
   - Latency metrics tracking (round-trip time for AI responses).
2. **Audit Logging (Immutable Trail):**
   - Structured JSON logs for all critical events (appointment booked, slot cancelled, security alert triggered).
   - Sensitive fields (patient names, phone numbers) must be masked (`P***** D**`).
3. **Safe Deployments & Rollbacks:**
   - Feature flags to instantly disable widget features (e.g. voice input, file uploads) during upstream outages without redeploying code.

---

## Pillar 5: Cost & Resource Optimization

1. **Token & LLM Cost Containment:**
   - Max prompt context window capping (truncate older conversation history to avoid astronomical LLM inference costs).
   - Short-circuit common queries (hours, location, visiting rules) to static client-side or cached regex responses instead of querying expensive LLMs.
2. **Client Resource Conservation:**
   - Stop background polling, speech recognition, and sound synthesis when the browser tab is hidden (`document.visibilityState === 'hidden'`).
   - Clean up audio blobs and object URLs immediately after playback.

---

## Architecture Audit Checklist

When auditing a feature or the codebase against this framework:
- [ ] **Threat Check:** Can an attacker spam this button or payload to crash the server or run up LLM costs?
- [ ] **Bot Check:** Can a scraper harvest our data or flood dummy appointments with curl/Playwright?
- [ ] **Resilience Check:** What does the UI display if the network drops or the API returns HTTP 504?
- [ ] **Leak Check:** Does this log or persist any unencrypted patient identifiers?
- [ ] **Resource Check:** Are timers, audio blobs, and websocket/event listeners torn down cleanly?
