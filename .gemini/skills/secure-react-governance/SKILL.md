---
name: secure-react-governance
description: >-
  Security, no hardcoded secrets, leak-safe React hooks, architecture boundaries,
  and permission-before-commands workflow for hospital-chatbot-widget. Use when
  implementing features, reviewing code, handling env/PII, useEffect cleanup,
  or before npm install and run commands.
---

# Secure development & governance

Works with Cursor rules: `agent-governance.mdc`, `security-architecture.mdc`, and skill `senior-fullstack-standards`.

## Permission before commands (mandatory)

Do **not** run terminal commands until the user approves. For each batch:

```markdown
**Proposed action:** `npm install foo`
**Why:** …
**Alternatives:** …
Proceed? (yes/no)
```

Same for `npm run dev|build|test`, Playwright, git commit/push, `playwright install`, server start.

Reading/editing files for requested work is OK without asking; **executing** is not.

---

## Security — no exposure, no hardcoding

### Never in git

| Forbidden in source | Use instead |
|---------------------|-------------|
| API keys, JWT secrets, DB URLs with password | Server `.env`, secret manager |
| Real patient data in mocks/tests | Fictional names, synthetic IDs |
| Private LLM keys in React | Backend proxy only |

### Environment

- **Client:** `VITE_API_BASE_URL`, `VITE_CHAT_MOCK_MODE` only — treat as public.
- **Server:** `dotenv` + validate at startup; document keys in `.env.example` without values.
- Add `.env` to `.gitignore`; scan diffs for `sk-`, `Bearer `, `password=`, connection strings.

### Data & UI

- Patient name/mobile: minimize retention; post to API over HTTPS in prod; do not stash in analytics.
- `X-Tenant-Id`: header for routing, not authentication by itself.
- CORS, `helmet`, body size limits on Express.
- Rate-limit chat/book endpoints when server exists.

### Dependencies

- Prefer well-maintained packages; avoid unnecessary deps.
- When user approves install, mention running audit (`npm audit`) if they want supply-chain checks.

---

## Architecture boundaries

```
Components (render) → hooks (state/effects) → services (HTTP) → API
```

| Layer | May | Must not |
|-------|-----|----------|
| `components/` | Props, local UI state, call callbacks | `fetch`, business rules |
| `hooks/` | Orchestration, `useLocalStorage`, context | Direct DOM except rare refs |
| `services/` | HTTP, headers, errors | React imports |
| `utils/` | Pure functions | Side effects |

Align with OpenAPI/server layers when adding `server/` (routes → controller → service).

**Server runtime:** non-blocking I/O, no event-loop blocking, CPU work offloaded, error + logging middleware — see `hospital-chatbot-backend/node-runtime.md`.

---

## Hooks — rules of hooks & quality

- Only call hooks at top level of React functions or custom hooks.
- Custom hooks: prefix `use`, single responsibility (`useChatSession` stays orchestration, not UI).
- Extract repeated effect logic into a hook only after second use.
- Pass `tenantId`/callbacks from widget root; avoid deep prop drilling for language — use `LanguageContext`.

### Dependency arrays

- Include all values from component scope used inside effect/callback unless intentionally stable via ref.
- Do not disable `exhaustive-deps` without comment explaining invariant.

---

## Memory leaks & cleanup checklist

Apply on every `useEffect`, subscription, or async flow:

| Resource | Cleanup |
|----------|---------|
| `window` / `document` listeners | `removeEventListener` in return |
| `setInterval` / `setTimeout` | `clearInterval` / `clearTimeout` |
| `matchMedia` | `removeEventListener('change', …)` |
| `MutationObserver` | `observer.disconnect()` |
| Fetch / async | `cancelled = true` or `AbortController.abort()` on unmount |
| `URL.createObjectURL` | `URL.revokeObjectURL` when attachment removed or unmount |
| Web Speech | `recognition.stop()`, cancel synthesis on unmount |
| XHR upload | avoid setState after unmount (guard with ref `isMounted`) |

### Pattern — async effect

```javascript
useEffect(() => {
  let cancelled = false;
  (async () => {
    const data = await load();
    if (!cancelled) setState(data);
  })();
  return () => {
    cancelled = true;
  };
}, [deps]);
```

### Pattern — listener effect

```javascript
useEffect(() => {
  const onMove = (e) => { /* ... */ };
  window.addEventListener("mousemove", onMove);
  return () => window.removeEventListener("mousemove", onMove);
}, []);
```

Review `ChatWidget.jsx` (drag listeners), `useBehavioralTrigger.js` (observer, popstate), `AttachmentComposer.jsx` (preview URLs), speech hooks when touching those files.

---

## Pre-merge self-review (agent)

- [ ] No secrets or real PHI in diff
- [ ] No new `fetch` outside `chatApi.js`
- [ ] Effects that register anything have cleanup
- [ ] Async paths guarded on unmount
- [ ] User-visible errors are safe; no stack traces in UI
- [ ] User approved any commands that were run

---

## Related

- Feature map: `hospital-chatbot-widget`
- API contract: `hospital-chatbot-backend`
- E2E: `hospital-chatbot-testing`
- Full-stack layering: `senior-fullstack-standards`
