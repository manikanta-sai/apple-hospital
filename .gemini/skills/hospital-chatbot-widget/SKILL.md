---
name: hospital-chatbot-widget
description: >-
  Develop the hospital-chatbot-widget React/Vite embeddable chat UI (AI Assist):
  message types, booking flow, ChatWidget, useChatSession, mock mode, i18n, attachments,
  behavioral triggers. Use when editing this repo, adding chat features, doctor cards,
  quick links, or integrating the widget into a host app.
---

# Hospital Chatbot Widget — Development

## Stack

- React 18, Vite 6, Tailwind 3 (`clinical` / `coral` / `status` in `tailwind.config.js`)
- No router or global state library — widget state lives in hooks + `localStorage`
- Entry: `src/main.jsx` → `App.jsx` (demo host) → lazy `ChatWidget.jsx`

## Architecture (where to edit)

| Concern | Location |
|--------|----------|
| Launcher, panel layout, drag, quick-link wiring | `src/components/ChatWidget.jsx` |
| Conversation + booking orchestration | `src/hooks/useChatSession.js` |
| HTTP + uploads + tenancy header | `src/services/chatApi.js` |
| Render by message `type` | `src/components/ChatMessages.jsx` |
| Demo canned replies (mock only) | `src/mock/mockResponses.js` + `pickMockReply()` in `useChatSession.js` |
| Static UI copy | `src/i18n/translations.js` (`UI_STRINGS`, `SUPPORTED_LANGUAGES`) |
| Dynamic reply language | `targetLanguage` on `sendChatMessage`; mock uses `translationProvider.js` |
| Host page department triggers | `src/hooks/useBehavioralTrigger.js` (`DEPARTMENT_TRIGGERS`, 30s dwell) |
| Persistence keys | `hc_session_id`, `hc_widget_open`, `hc_widget_minimized`, `hc_tooltip_dismissed` |

## Message model

Normalized shape: `{ id, role, type, text, timestamp, ... }`.

**Backend-driven types** (from `reply.type`): `text`, `doctor-list`, `fallback` (+ optional `doctors[]`).

**Client-authored types** (appended by `useChatSession`): `patient-form`, `slot-picker`, `booking-success`.

Adding a new rich message type:

1. Extend backend contract / mock payload if needed.
2. Normalize in `toAssistantMessage()` if the API adds fields.
3. Add a `case` in `ChatMessages.jsx` and a component under `src/components/`.
4. Wire actions through props from `ChatWidget` → `ChatMessages` (keep handlers in `useChatSession` when they mutate messages or call API).
5. Add Playwright coverage if user-visible (see `hospital-chatbot-testing` skill).

Details: [message-types.md](message-types.md)

## Booking flow (do not break order)

1. Quick link **Book Appointment** → `startBookingFlow()` → `patient-form`
2. `submitPatientForm()` → doctor list (mock: `mockAllDoctorsSearch`; prod: should call API when implemented)
3. **Book Slot** on card → `requestSlots()` → `slot-picker`
4. Slot chosen → `confirmBooking()` → `booking-success` (mock or `bookDoctorSlot`)

Other quick links send canned text via `sendMessage()` (`QUICK_LINK_MESSAGES` in `ChatWidget.jsx`).

## Mock vs production

- Env: `VITE_CHAT_MOCK_MODE` — mock when **not** exactly `"false"` (default on).
- Env: `VITE_API_BASE_URL` (default `http://localhost:5000/api`)
- **Duplication:** `MOCK_MODE` is read in both `useChatSession.js` and `chatApi.js`. Keep behavior aligned when changing either.
- Network calls should stay in `chatApi.js` only; mock reply selection stays in `useChatSession.js`.

Backend contract: use skill `hospital-chatbot-backend` or [../hospital-chatbot-backend/contract.md](../hospital-chatbot-backend/contract.md).

## Conventions

- **Multi-tenant:** `<ChatWidget tenantId="..." />` → `X-Tenant-Id` on requests.
- **i18n:** User-visible static strings → new keys in every locale in `UI_STRINGS`. AI reply text → backend `targetLanguage` or `translateText` in mock only.
- **Styling:** Mobile-first panel (`fixed inset-0`, `sm:` → 400×640 card). Match existing Tailwind tokens; avoid generic purple “AI” palette.
- **A11y:** Preserve `role="log"`, `aria-live`, accessible names on launcher/send (tests depend on them).
- **Security:** Sanitize assistant HTML in `MessageBubble.jsx` with DOMPurify; do not bypass for user content.
- **Scope:** Minimal diffs; no new dependencies unless necessary (`@tanstack/react-virtual` is listed but unused — prefer wiring or removal, not both).

## Host integration

Mount once near app root:

```jsx
<ChatWidget tenantId="branch-code" />
```

Department context on host: `document.body.setAttribute("data-hospital-department", "cardiology")` or URL `/departments/cardiology`.

## Commands

```bash
npm run dev          # local widget + demo host
npm run build        # production bundle
npm test             # Playwright (preview on 4173)
```

## README

`README.md` is the human-facing spec; if code and README diverge, **trust the code** and update README when the user asks for docs.
