---
name: senior-fullstack-standards
description: >-
  Senior software engineering standards for the hospital chatbot monorepo: React 18
  widget (reusable components, hooks, minimal state), Node.js Express API, OpenAPI/Swagger
  contract-first design, performance, security, testing, and clean layering. Use when
  creating or refactoring frontend/backend code, scaffolding server/, reviewing architecture,
  or when the user asks for production-grade, optimized, well-structured code.
---

# Senior Full-Stack Standards — Hospital Chatbot

Apply these standards to **every change** in this product. The widget lives in `src/`; the API should live in a dedicated **`server/`** (or separate repo) — never mix Express into Vite `src/`.

Related project skills: `hospital-chatbot-widget`, `hospital-chatbot-backend`, `hospital-chatbot-testing`, `secure-react-governance`.

**Governance:** Ask user before any terminal command (install, run, test, git). See `.cursor/rules/agent-governance.mdc`.

## Non-negotiable principles

| Principle | Practice |
|-----------|----------|
| **Single responsibility** | One reason to change per module (file/function). |
| **Contract-first** | OpenAPI defines HTTP; frontend `chatApi.js` and mocks match it. |
| **Thin edges, fat domain** | Routes/controllers parse/validate; services hold business rules. |
| **UI is dumb where possible** | Components render; hooks/services own side effects and orchestration. |
| **Fail explicitly** | Typed errors, consistent HTTP codes, user-safe messages in UI. |
| **No premature abstraction** | Extract after the second real reuse, not before the first. |
| **Measure before optimizing** | Memo/virtualize/list keys only when profiling or known hot paths justify it. |

## Repository layout (target)

```
hospital-chatbot-widget/
├── src/                    # React widget (Vite) — existing
├── server/                 # Node + Express — add when building API
│   ├── src/
│   │   ├── app.js          # express(), middleware, mount routes
│   │   ├── server.js       # listen()
│   │   ├── routes/         # wire HTTP → controllers
│   │   ├── controllers/    # req/res, status codes only
│   │   ├── services/       # business logic, LLM, booking rules
│   │   ├── repositories/   # DB/access (if any)
│   │   ├── middleware/     # auth, tenant, error handler, validate
│   │   ├── validators/     # request schemas (align with OpenAPI)
│   │   └── config/         # env, constants
│   ├── openapi.yaml        # source of truth for REST contract
│   └── package.json
├── tests/                  # Playwright (widget E2E)
└── .cursor/skills/         # agent guidance
```

Do not put database drivers or Express routes inside `src/components/`.

## React frontend standards

### Components

- **Presentational** (`MessageBubble`, `DoctorCard`): props in, JSX out; no fetch.
- **Container** (`ChatWidget`, `ChatMessages`): compose children; delegate logic to hooks.
- **One component per file**; default export named like the file.
- **Props**: destructure; avoid prop drilling beyond 2 levels — use context for i18n/language only; keep chat actions as callback props from `useChatSession`.
- **Reuse**: shared UI → `src/components/`; cross-cutting logic → `src/hooks/`; pure helpers → `src/utils/`.
- **Lists**: stable `key={message.id}`; consider `@tanstack/react-virtual` only when message count is large (dependency already in package.json).
- **Code splitting**: lazy-load heavy shell (`ChatWidget`) as in `App.jsx`; do not lazy-load every bubble.
- **Styling**: Tailwind utility classes; shared tokens in `tailwind.config.js`; no inline magic hex in new code.

### State management (this project)

| State | Where |
|-------|--------|
| Session id, widget open/minimized | `useLocalStorage` |
| Language | `LanguageContext` |
| Messages, typing, booking flow | `useChatSession` |
| Ephemeral UI (drag, tooltip) | `useState` in `ChatWidget` |

Do **not** add Redux/Zustand unless a new cross-app requirement appears (e.g. host app must read chat state). Prefer lifting logic into hooks before global stores.

### Hooks rules

- Custom hooks start with `use`; return stable callbacks via `useCallback` when passed to memoized children.
- Side effects in `useEffect` with cleanup and cancellation flags (see history load in `useChatSession`).
- **Single env config**: prefer one `src/config/env.js` exporting `MOCK_MODE`, `API_BASE_URL` — avoid duplicating `import.meta.env` checks.

### Performance

- Avoid new object/array literals in props every render when child is memoized.
- Debounce only user input that triggers network (not send button).
- Revoke `URL.createObjectURL` for attachments (already pattern in `AttachmentComposer`).
- Images: `loading="lazy"` on non-critical avatars; handle `onError` (existing patterns).

### Security (frontend)

- Sanitize assistant HTML with DOMPurify (`MessageBubble`).
- Never log PHI; do not store secrets in Vite env (only `VITE_*` public vars).
- Validate forms client-side for UX; **server validates for trust**.

## Node.js + Express standards

### Layering

```
HTTP → routes → controller → service → repository (optional) → DB/external API
```

- **Controllers**: map `req` → service call → `{ status, body }`; no SQL, no LLM prompts.
- **Services**: tenant-aware booking, chat orchestration, idempotency for book.
- **Middleware chain order**: `helmet` → `cors` → `express.json()` → request id → tenant → routes → `errorHandler`.

### API design

- REST paths match existing widget contract: `/api/chat/history/:sessionId`, `/api/chat/message`, `/api/chat/attachments`, `/api/appointments/book`.
- Use **`X-Tenant-Id`** for multi-tenancy; reject missing tenant if required by policy.
- JSON errors: `{ "message": "...", "code": "OPTIONAL_MACHINE_CODE" }`.
- Status codes: `400` validation, `401/403` auth, `404` session, `409` slot taken, `500` unexpected.

### Config & env

- `dotenv` in server only; validate required vars at startup (fail fast).
- No secrets in repo; document in `.env.example` (server + `VITE_*` for client).

### Performance (backend)

- **Never block the event loop** on the request path (no sync `fs`, huge sync parse, long CPU loops).
- **Non-blocking I/O only** for DB, disk, and outbound HTTP; use connection pools and `asyncHandler` / `.catch(next)`.
- **CPU-heavy work** (OCR, PDF parse, embeddings): `worker_threads`, BullMQ/Redis queue, or external service.
- Stream large uploads; limit body size (`express.json({ limit })`).
- Timeouts on outbound LLM/HTTP calls; circuit-break repeated failures per tenant.
- Paginate history if messages grow (`?limit=&cursor=` in future — document in OpenAPI before implementing).

Runtime detail: skill `hospital-chatbot-backend` → [node-runtime.md](../hospital-chatbot-backend/node-runtime.md).

### Logging & errors (backend)

- Middleware order: security → parse body → **request id** → **http logger** → routes → 404 → **errorHandler**.
- Throw operational `AppError` (4xx/409); unexpected errors → 500 with generic client message.
- Never log API keys, auth headers, or full patient/chat bodies — use redaction.

## Swagger / OpenAPI

- Maintain **`server/openapi.yaml`** (OpenAPI 3.0+) as the contract **before** implementing endpoints.
- Serve UI in non-production only: `swagger-ui-express` on `/api/docs`.
- Generate or hand-write types; keep **mock payloads** in `src/mock/mockResponses.js` aligned with `reply` schemas.
- On API change: update OpenAPI → server validators → `chatApi.js` → mocks → Playwright assertions → README/skills.

Minimal workflow:

1. Edit `openapi.yaml`
2. Implement route + validator matching schema
3. Run widget against `VITE_CHAT_MOCK_MODE=false`

See [reference.md](reference.md) for OpenAPI snippet templates and Express error handler pattern.

## Code quality checklist (before finishing a task)

**Frontend**

- [ ] No fetch outside `chatApi.js`
- [ ] New UI strings in all `UI_STRINGS` locales
- [ ] New message `type` handled in `ChatMessages.jsx`
- [ ] Accessible names for interactive controls
- [ ] Error path shows user-safe copy

**Backend**

- [ ] Request validated against OpenAPI/schema
- [ ] Service unit-tested; route integration-tested
- [ ] Tenant id propagated and enforced
- [ ] Errors logged server-side with request id, not leaked stack to client

**Both**

- [ ] No dead code, commented blocks, or debug `console.log` in prod paths
- [ ] Dependencies added only with justification in PR/summary

## Testing pyramid

| Layer | Tool | Scope |
|-------|------|--------|
| E2E | Playwright | Critical journeys (chat, book, i18n smoke) |
| API | supertest / vitest | Express routes + auth/tenant |
| Unit | vitest/jest | services, validators, pure utils |
| Contract | OpenAPI examples vs mock JSON | Drift prevention |

Follow `hospital-chatbot-testing` for Playwright conventions.

## Naming & files

- **React**: PascalCase components; camelCase hooks/utils.
- **Server**: camelCase functions; kebab or camel files consistently within `server/src`.
- **Constants**: `SCREAMING_SNAKE` in dedicated `constants.js` or config.
- **Imports**: absolute aliases only if configured in Vite/tsconfig; else relative within feature.

## When implementing “perfect project” increments

Prioritize in order:

1. Centralize client env + align mocks with OpenAPI
2. Scaffold `server/` with health check + one real endpoint + Swagger
3. Wire `submitPatientForm` to API (PII on server only)
4. History persistence + session TTL policy
5. CI: `build`, `test`, server lint/test

Do not rewrite working widget architecture for theoretical purity — **extend using the layers above**.

## Additional patterns

Express error middleware, controller template, React hook template: [reference.md](reference.md)
