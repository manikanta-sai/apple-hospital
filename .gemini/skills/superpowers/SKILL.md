---
name: superpowers
description: >-
  Disciplined software engineering methodology enforcing structured thinking,
  architectural design, Test-Driven Development (TDD), systematic debugging,
  and automated verification before declaring tasks complete.
---

# Superpowers — Disciplined Engineering & TDD Workflow

Superpowers transforms AI assistance from hasty code generation into a disciplined, senior-level software engineering process. It enforces distinct operational phases: **Design → Test → Implement → Verify → Review**.

---

## Phase 1: Brainstorming & Architecture Planning

Before modifying or writing any implementation code:
1. **Analyze Requirements & Constraints:** Clarify user goals, system boundaries, and edge cases.
2. **Explore Options:** Present trade-offs when multiple viable designs exist.
3. **Draft Architecture Spec:**
   - Define data contracts, message types, and component hierarchies.
   - Use Mermaid diagrams to visualize state machines, data flow, or API sequences.
4. **Get Confirmation:** Do not proceed to execution until the approach is agreed upon.

---

## Phase 2: Test-Driven Development (TDD)

Code without tests is legacy code. Follow strict Red-Green-Refactor:

1. **Write the Failing Test First (RED):**
   - For UI / flows in this repo: Add a Playwright test under `tests/`.
   - Run the test suite using `npm test` or `npx playwright test`.
   - Verify that the test fails for the expected reason (feature does not yet exist or bug is reproduced).
2. **Implement Minimal Code to Pass (GREEN):**
   - Write only the code required to satisfy the failing test.
   - Re-run the test to confirm it now passes.
3. **Refactor:**
   - Clean up structure, improve naming, remove duplication while keeping all tests green.

---

## Phase 3: Systematic Root-Cause Debugging

When a bug or test failure occurs, never guess or apply random edits:
1. **Reproduce:** Capture the exact command or test that triggers the failure.
2. **Observe:** Check logs, network calls, browser console messages, or test snapshots.
3. **Formulate Hypothesis:** Identify the root cause (not just the symptom).
4. **Targeted Fix:** Apply the minimal fix directly addressing the root cause.
5. **Regression Guard:** Ensure a test exists that prevents this specific bug from returning.

---

## Phase 4: Self-Review & Verification Gate

Before completing any task, perform an autonomous self-audit:
- **Build & Tests:** Run `npm run build` and `npm test` to verify clean compilation and passing tests.
- **Contract Integrity:** Ensure backend API contracts and message schemas remain intact.
- **Diff Hygiene:** Inspect git diff — ensure no console.logs, commented-out dead code, or unintended file edits.
- **Summary:** Present clear release notes describing what changed and how it was verified.
