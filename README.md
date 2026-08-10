# Hospital Chatbot Widget

A multi-tenant, AI-powered chat widget for hospital patient portals — session-persistent, mobile-first, with rich doctor cards inline in the chat stream.

## 1. Project Initialization

```bash
# Scaffold a Vite + React project
npm create vite@latest hospital-chatbot-widget -- --template react
cd hospital-chatbot-widget

# Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Icons
npm install lucide-react

# (Optional, if you prefer axios over fetch in chatApi.js)
npm install axios

# Run the dev server
npm run dev
```

Then replace the generated `tailwind.config.js`, `postcss.config.js`, `index.html`, and everything in `src/` with the files in this project.

## 2. File Structure

```
hospital-chatbot-widget/
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── .env.example
└── src/
    ├── main.jsx                    # Vite entry point
    ├── App.jsx                     # Demo host page
    ├── index.css                   # Tailwind + fonts + scrollbar utilities
    ├── components/
    │   ├── ChatWidget.jsx              # Main widget: launcher + panel + layout + LanguageProvider
    │   ├── ChatHeader.jsx              # Brand strip, language selector, minimize/close controls
    │   ├── ChatMessages.jsx            # Scrollable stream, routes message types, owns speech-synthesis instance
    │   ├── ChatInput.jsx               # Composer input + mic dictation + send button
    │   ├── MessageBubble.jsx           # Plain text bubble (user/assistant) + read-aloud toggle
    │   ├── DoctorCard.jsx              # Single rich doctor card
    │   ├── DoctorCardList.jsx          # Horizontal scrollable card rail
    │   ├── TypingIndicator.jsx         # Bouncing-dot "typing..." state
    │   ├── QuickLinks.jsx              # Localized quick-action chips
    │   ├── PatientRegistrationForm.jsx # Inline name + mobile capture
    │   ├── SlotPicker.jsx              # Time-slot chip picker
    │   ├── BookingConfirmation.jsx     # Booking success card
    │   ├── LanguageSelector.jsx        # Header language dropdown
    │   └── ProactiveTriggerBubble.jsx  # Contextual greeting callout
    ├── hooks/
    │   ├── useChatSession.js       # sessionId, history, booking flow, language-aware output
    │   ├── useLocalStorage.js      # Generic persisted-state primitive
    │   ├── useBehavioralTrigger.js # Department dwell-time detection + sessionStorage dismissal
    │   ├── useSpeechRecognition.js # Voice-to-text (Web Speech API)
    │   └── useSpeechSynthesis.js   # Text-to-speech (Web Speech API)
    ├── i18n/
    │   ├── LanguageContext.jsx     # LanguageProvider + useLanguage()
    │   └── translations.js         # Supported languages + static UI_STRINGS
    ├── services/
    │   ├── chatApi.js              # All backend HTTP calls, isolated
    │   └── translationProvider.js  # Pluggable dynamic-text translator (mock-mode fallback)
    ├── utils/
    │   └── generateId.js           # UUID helper (with fallback)
    └── mock/
        └── mockResponses.js        # Sample backend payloads for local dev
```

## 3. Design Decisions Worth Knowing

- **Brand palette**: deep clinical teal (trust/hygiene) + warm coral CTA (human, not clinical-cold). Deliberately avoids the generic purple "AI assistant" look. Tokens live in `tailwind.config.js` under `colors.clinical`, `colors.coral`, `colors.status`.
- **`useLocalStorage`** is the one primitive behind both persistence requirements — `hc_session_id` (session), `hc_widget_open` / `hc_widget_minimized` (UI state). Corrupted or disabled storage fails soft instead of throwing.
- **`useChatSession`** normalizes every backend reply into `{ id, role, type, text, doctors, timestamp }` so `ChatMessages` can render generically — `type` drives whether a `MessageBubble` or `DoctorCardList` is shown. `fallback` reuses the doctor-card renderer with an amber-tinted lead-in bubble, so "Dr. Mani is unavailable, here are alternatives" reads as a soft redirect rather than an error.
- **Mock mode** (`VITE_CHAT_MOCK_MODE=true`, the default) lets the whole widget run and be demoed with zero backend — see `src/mock/mockResponses.js`. Flip it off in `.env` once your API is live; `chatApi.js` is the only file that talks to the network.
- **Booking journey** is modeled as a chain of message `type`s appended by `useChatSession`, each with its own renderer wired in `ChatMessages.jsx`:
  1. `patient-form` — tapping the **Book Appointment** quick link posts this; `PatientRegistrationForm.jsx` captures name + mobile, validates locally, then freezes into a read-only receipt on submit.
  2. `doctor-list` / `fallback` — same card rail as before; **Book Slot** on a card no longer books directly, it calls `requestSlots()`.
  3. `slot-picker` — `SlotPicker.jsx` renders that doctor's time-slot chips; picking one locks the picker and highlights the choice.
  4. `booking-success` — `BookingConfirmation.jsx` shows the confirmed doctor, slot, and backend confirmation message.
- **Quick links** (`QuickLinks.jsx`) sit above the greeting text alongside a hospital building image. "Book Appointment" starts the flow above; the other three (Timings, Enquiry, Address, Request Live Agent) are sent through the normal `sendMessage()` pipeline as canned text, so they use the same keyword-matched mock replies as free typing.
- **Responsive strategy**: `ChatWidget.jsx` is mobile-first — the base classes are `fixed inset-0` (full screen), then `sm:` variants override to a fixed `400×640` floating card anchored bottom-right. Nothing is duplicated per-breakpoint; it's one class list.

## 4. Backend Contract

### `GET /api/chat/history/:sessionId`
```json
{ "messages": [
  { "id": "msg_1", "role": "user", "text": "Hi", "timestamp": "..." },
  { "id": "msg_2", "role": "assistant", "type": "text", "text": "Hello!", "timestamp": "..." }
]}
```

### `POST /api/chat/message`
Request: `{ "sessionId": "...", "message": "Book a cardiologist" }`

Response:
```json
{
  "sessionId": "...",
  "reply": {
    "type": "doctor-list",
    "text": "I found 3 cardiologists available this week:",
    "doctors": [
      {
        "id": "doc_101",
        "name": "Dr. Ananya Rao",
        "department": "Cardiology",
        "image": "https://.../ananya.jpg",
        "availability": "available",
        "nextSlot": "Today, 4:30 PM",
        "rating": 4.8
      }
    ]
  }
}
```

`reply.type` is one of:
- `"text"` — plain assistant message, no `doctors` field.
- `"doctor-list"` — matches found; render cards.
- `"fallback"` — requested doctor/slot unavailable; `doctors` holds alternates. See `mockUnavailableFallback` in `mock/mockResponses.js` for the exact "Dr. Mani is fully booked" example described in the brief.

### `POST /api/appointments/book`
Request: `{ "sessionId": "...", "doctorId": "doc_101", "slotId": "Today, 4:30 PM" }`
Response: `{ "status": "confirmed", "message": "Your slot with Dr. Ananya Rao is confirmed..." }`

## 5. Advanced Features

### Context-Aware Behavioral Triggers
`useBehavioralTrigger.js` watches the **host page** (not the widget) for a `data-hospital-department="cardiology"` attribute anywhere in the DOM, or falls back to parsing `/departments/cardiology` from the URL. After 30 seconds of dwell time on a configured department, it surfaces a trigger; `ProactiveTriggerBubble.jsx` renders it as a dismissible callout above the launcher — it does **not** force-open the chat panel, which is deliberate (auto-opening chat windows is a well-known dark pattern). Dismissal is written to `sessionStorage` per department, so it won't re-fire in the same tab session. Re-evaluates on `popstate` (SPA route changes) and via a `MutationObserver` on the data attribute (host toggling it client-side). Configure department copy in the `DEPARTMENT_TRIGGERS` map at the top of the hook.

Host integration — just set an attribute, no JS wiring needed:
```html
<body data-hospital-department="cardiology">
```

### Voice-to-Text & Text-to-Speech
- **Voice-to-text**: `useSpeechRecognition.js` wraps `SpeechRecognition`/`webkitSpeechRecognition`. The mic button in `ChatInput.jsx` is hidden entirely (not just disabled) on unsupported browsers like Firefox. Interim results stream live into the input; dictation never auto-sends — the patient can review/edit first.
- **Text-to-speech**: `useSpeechSynthesis.js` wraps `speechSynthesis`. One instance is owned by `ChatMessages.jsx` (the browser only plays one utterance at a time) and passed down to every `MessageBubble`, so only the currently-playing bubble shows the "stop" state. The speaker icon only appears on assistant bubbles.
- Both hooks pick their locale (`en-US`, `es-ES`, `hi-IN`) from the active language via `speechLang` in `LanguageContext`, so dictation and read-aloud follow whatever language the patient has selected.

### Multi-Language
- `src/i18n/LanguageContext.jsx` — a `LanguageProvider` wrapping the whole widget (set up once, inside `ChatWidget.jsx`, so the host app doesn't need to know about it), persists the choice to `localStorage`, and exposes `t()` for static UI strings from `src/i18n/translations.js`.
- `LanguageSelector.jsx` in the header lets the patient switch between English, Spanish, and Hindi — add more by extending `SUPPORTED_LANGUAGES` and `UI_STRINGS`.
- **Static UI copy** (buttons, labels, form prompts) is translated ahead of time in `UI_STRINGS` — zero network cost, instant switch.
- **Dynamic AI reply text** goes through a separate path, since it can't be pre-translated: `chatApi.sendChatMessage()` now forwards a `targetLanguage` param to `POST /api/chat/message` so your backend/LLM can **generate the reply natively in that language** — this preserves clinical nuance far better than machine-translating an English reply after the fact. `src/services/translationProvider.js` is a pluggable client-side fallback used only in `MOCK_MODE` (swap its `translateText()` implementation for Google Cloud Translation/DeepL/Azure Translator if you need client-side translation in production too).

## 6. Multi-Tenancy

Pass a `tenantId` prop to `<ChatWidget tenantId="hospital-branch-code" />`. It's forwarded as an `X-Tenant-Id` header on every request in `chatApi.js` — swap for subdomain-based routing there if your backend prefers that model instead.

## 7. Mounting the Widget

```jsx
import ChatWidget from "./components/ChatWidget";

function AppLayout() {
  return (
    <>
      {/* rest of your app/routes */}
      <ChatWidget tenantId="apollo-hospitals-chennai" />
    </>
  );
}
```

Mount it once, near the root — its internal `useLocalStorage`-backed state means it will reopen in the same open/minimized state and resume the same conversation after any route change or full page refresh.
