---
name: ponytail
description: >-
  Radical simplicity, anti-overengineering, and minimal-diff mindset.
  Climbs the 7-rung decision ladder to write the absolute least code required,
  eliminate unnecessary dependencies, and favor standard platform primitives.
  Preserves security, data validation, and accessibility.
---

# Ponytail — Radical Code Simplicity & Pragmatism

> "The best code is the code you didn't have to write."

Ponytail enforces a senior minimalist engineering mindset. Before writing or generating any code, evaluate the problem against the **7-Rung Simplicity Ladder**. Stop at the lowest possible rung that satisfies the requirement.

---

## The 7-Rung Simplicity Ladder

1. **Rung 1: Does this need to exist? (YAGNI)**
   - Reject premature abstractions, speculative configurations, unasked-for edge case handling, and feature bloat.
   - If the existing code already handles this or if the feature isn't explicitly required, don't build it.

2. **Rung 2: Is it already in this codebase? (Reuse)**
   - Check existing utilities, hooks, stores, and helpers before creating new ones.
   - In this project: inspect `src/utils/`, `src/hooks/`, `src/services/`, and existing components.

3. **Rung 3: Can the language standard library do it?**
   - Use modern JavaScript / Web APIs (`Array.prototype.*`, `Object.*`, `URLSearchParams`, `fetch`, `crypto.randomUUID()`, `Intl`).
   - Never add or implement utility helpers for things standard JS already provides.

4. **Rung 4: Can the native platform or browser do it?**
   - Prefer native HTML/CSS capabilities: `<dialog>`, `<details>`, `<input type="date">`, CSS flex/grid, Tailwind utility classes over custom JS interaction layers.

5. **Rung 5: Can an existing installed dependency do it?**
   - Check `package.json`. If a library like `dexie`, `dompurify`, `lucide-react`, or `zod` is already installed, use it instead of introducing custom logic or a new package.
   - Do NOT install new npm packages unless explicitly approved.

6. **Rung 6: Can it be done in one readable line?**
   - Prefer concise, idiomatic expressions over multi-line function factories, classes, or nested wrappers.

7. **Rung 7: Write the minimal viable solution.**
   - Only when Rungs 1–6 cannot solve the problem: write the simplest, cleanest implementation. No generic wrappers, no premature abstractions.

---

## Non-Negotiable Boundaries (Never Compromise)

Simplicity does **not** mean cutting corners on safety. Never remove or bypass:
- **Security & Sanitization:** DOMPurify sanitization of incoming/rendered HTML.
- **Tenant Isolation:** Multi-tenant headers (`X-Tenant-Id`) on API requests.
- **Data Validation:** Zod schemas and runtime validation at input boundaries.
- **Accessibility (a11y):** Keyboard navigation, `role="log"`, `aria-live`, ARIA labels.
- **Error Handling:** Graceful failure states for network and database operations.

---

## Code Review & Refactoring Checklist

When asked to review or refactor code with Ponytail:
- [ ] What lines of code can be deleted entirely?
- [ ] Are there unused state variables, redundant `useEffect` hooks, or duplicative helpers?
- [ ] Is there any dependency that can be replaced with native JavaScript?
- [ ] Does every new component or function have a single clear responsibility?
- [ ] Is the diff as small and targeted as possible?
