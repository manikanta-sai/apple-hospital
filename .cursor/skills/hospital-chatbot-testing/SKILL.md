---
name: hospital-chatbot-testing
description: >-
  Writes and runs Playwright tests for hospital-chatbot-widget: smoke tests,
  attachTestMetrics, preview server on 4173, accessible selectors. Use when
  adding E2E tests, debugging test failures, or changing launcher/chat a11y labels.
---

# Hospital Chatbot — E2E testing

## Run

```bash
npm test              # playwright test
npm run test:headed   # visible browser
npm run test:html     # HTML report
```

Config: `playwright.config.js` — **baseURL** `http://127.0.0.1:4173`, **webServer** runs `npm run preview` (build must succeed first; preview serves `dist/`).

If tests fail with connection errors, run `npm run build` then `npm test`, or ensure port 4173 is free.

## Metrics helper (required pattern)

Import in every spec:

```javascript
import { attachTestMetrics } from './helpers/testMetrics';
```

At start of test: `const metrics = await attachTestMetrics(page, testInfo);`

Before end: `const summary = await metrics.finalize();` then assert:

```javascript
expect(summary.jsErrors).toEqual([]);
expect(summary.failedRequests).toEqual([]);
```

This catches console errors and failed network requests, not just assertion failures.

## Stable selectors (do not break without updating tests)

| UI | Selector used in tests |
|----|-------------------------|
| Launcher | `getByRole('button', { name: 'Open chat with AI Assist' })` |
| Send | `getByRole('button', { name: 'Send message' })` |
| Input | `locator('input[type="text"]').first()` |
| Demo host | `getByRole('heading', { name: 'Apple Multispecialty Hospital' })` |

Mock **Timings** reply assertion:

`Our OPD is open Monday to Saturday, 8:00 AM to 8:00 PM...`

## Adding tests

1. Prefer role/name queries over CSS classes.
2. Mock mode is on in dev/preview unless `.env` sets `VITE_CHAT_MOCK_MODE=false` — E2E should assume mock unless testing against a live API with explicit env in `webServer.env`.
3. Behavioral trigger tests need `page.clock` or long timeout (30s dwell) — use injected clock or mock hook only if product allows; otherwise `@slow` and document runtime.
4. Booking journey: open chat → Book Appointment chip → fill form → book slot → assert confirmation copy.

## CI considerations

Current config sets `headless: false`, `trace`/`video`/`screenshot` always on — heavy for CI. When adding CI, gate with `process.env.CI` in `playwright.config.js` (only if user asks).

## Artifacts

`test-results/` and `playwright-report/` are local outputs — do not commit; add to `.gitignore` if missing.
