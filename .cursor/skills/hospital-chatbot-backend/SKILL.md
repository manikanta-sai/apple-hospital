---
name: hospital-chatbot-backend
description: >-
  Integrates the hospital chatbot widget with its Node/Express API: endpoints,
  JSON reply shapes, mock mode, X-Tenant-Id, event-loop-safe non-blocking I/O,
  CPU offload, error/logging middleware. Use when wiring APIs, building server/,
  changing chatApi.js, env vars, or aligning mockResponses with server contracts.
---

# Hospital Chatbot — Backend integration

## Node.js server standards (Express)

When implementing `server/`:

- **Event loop:** no blocking sync I/O or heavy CPU on the request thread.
- **Non-blocking I/O:** async DB/HTTP/files; pools, streams, timeouts on LLM calls.
- **CPU-intensive work:** `worker_threads`, job queue, or separate service — not inline in controllers.
- **Middleware:** request id → structured HTTP logger → routes → 404 → **central error handler** (4-arg, last).
- **Logs:** structured JSON; include `requestId` / `tenantId`; redact PHI and secrets.

Full patterns: [node-runtime.md](node-runtime.md). Layering/templates: `senior-fullstack-standards` → [reference.md](../senior-fullstack-standards/reference.md).

## Environment

| Variable | Default | Meaning |
|----------|---------|---------|
| `VITE_API_BASE_URL` | `http://localhost:5000/api` | API prefix |
| `VITE_CHAT_MOCK_MODE` | effective `true` | Set to `false` for live HTTP |

Copy from `.env.example` to `.env` for local overrides.

## Headers

All JSON requests:

```http
Content-Type: application/json
X-Tenant-Id: <tenantId>   # when ChatWidget tenantId prop is set
```

Attachment upload uses `multipart/form-data` via XHR; tenant header on XHR when set.

## Endpoints (implement on server)

Full payloads: [contract.md](contract.md)

| Method | Path | Used by |
|--------|------|---------|
| GET | `/chat/history/:sessionId` | History hydrate on mount (non-mock) |
| POST | `/chat/message` | User messages + attachments metadata |
| POST | `/chat/attachments` | Per-file upload during compose |
| POST | `/appointments/book` | Slot confirmation |

## POST `/chat/message` body

```json
{
  "sessionId": "string",
  "message": "string",
  "attachments": [],
  "targetLanguage": "en"
}
```

Response:

```json
{
  "sessionId": "string",
  "reply": {
    "type": "text" | "doctor-list" | "fallback",
    "text": "string",
    "doctors": []
  }
}
```

Generate reply text in `targetLanguage` on the server (preferred over client translation for clinical wording).

## Mock alignment checklist

When adding a server feature:

1. Add example payload to `src/mock/mockResponses.js`
2. Route demo text in `pickMockReply()` if keyword-driven
3. If uploads: extend mock branch in `uploadChatAttachments()`
4. Document in `README.md` section 4 if the public contract changed

## Gaps to know (prod work)

- `submitPatientForm()` does not POST patient PII today — mock-only doctor list after form.
- Mock mode skips history fetch (empty thread); prod must return `{ messages: [...] }` compatible with `useChatSession` normalization.
- Session id is client-generated and stored in `localStorage` (`hc_session_id`).

## Single place for HTTP

Edit `src/services/chatApi.js` only for URLs, auth, error mapping, and upload transport. Do not scatter `fetch` in components.
