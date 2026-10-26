---
name: project-health-auditor
description: >-
  Comprehensive health, security, memory leak, and performance scanner.
  Audits npm dependencies for known CVEs/vulnerabilities, scans React code for
  memory leaks (uncleaned timers, event listeners, unbounded state, closure retention),
  detects slow re-renders, and identifies Core Web Vitals (LCP/INP) bottlenecks.
---

# Project Health, Security & Performance Auditor

This skill performs a rigorous, 4-pillar scan of the codebase to identify security vulnerabilities, memory leaks, slow execution bottlenecks, and performance degradations.

---

## Pillar 1: Vulnerability & Security Audit (CVEs & Code Security)

1. **Dependency Vulnerability Scan:**
   - Execute `npm audit` or inspect `package-lock.json` against known advisory databases (GHSA, CVE).
   - Check for prototype pollution, ReDoS (Regular Expression Denial of Service), and arbitrary code execution vectors.
2. **Codebase Security Scanning:**
   - Verify all dynamic HTML injection points pass through `DOMPurify.sanitize()`.
   - Inspect sensitive patient/session data handling for unauthorized persistence or unencrypted local storage exposure.
   - Verify multi-tenant API isolation headers (`X-Tenant-Id`) on every network request.

---

## Pillar 2: Memory Leak Detection (React & Browser Runtime)

Scan hooks, components, and event handlers for classic memory leak patterns:
1. **Uncleaned Event Listeners / Observers:**
   - Check all `useEffect` blocks: Does every `addEventListener`, `ResizeObserver`, `IntersectionObserver`, or `MutationObserver` return a corresponding cleanup function (`removeEventListener`, `disconnect`)?
2. **Uncleared Timers & Intervals:**
   - Inspect `setTimeout` and `setInterval` calls. Are timer IDs stored and cleared via `clearTimeout` / `clearInterval` when components unmount?
3. **Unbounded Collections & State Accumulation:**
   - Search for arrays or objects in state or module scope that grow without limits (e.g. unpruned chat message history, unbounded caches, unvirtualized lists).
4. **Dangling Async Callbacks:**
   - Detect async operations updating state after unmount (`isMounted` or `AbortController` cancellation).
5. **IndexedDB / Dexie Leaks:**
   - Verify database transactions and live queries (`useLiveQuery`) cleanly release hooks upon component destruction.

---

## Pillar 3: Performance & Rendering Speed (Re-renders & Lag)

1. **Excessive & Cascade Re-renders:**
   - Detect inline object or function allocations passed to deeply nested child components.
   - Check for missing `useMemo` / `useCallback` on heavy computations or dependency arrays.
   - Flag cascading state updates where one state change triggers a chain of multiple dependent `useEffect` updates.
2. **Large List Virtualization:**
   - Ensure high-cardinality lists (like long chat histories or doctor search results) utilize virtualization (e.g., `@tanstack/react-virtual` or pagination) rather than rendering 100+ raw DOM nodes.
3. **Bundle Size & Dead Weight:**
   - Detect heavy imports (e.g. importing full icon libraries instead of tree-shaken named imports).
   - Flag unused packages in `package.json`.

---

## Pillar 4: Web Vitals & Loading Speed (LCP / CLS / INP)

1. **Largest Contentful Paint (LCP):**
   - Check above-the-fold assets, lazy-loading patterns on critical launcher graphics, and synchronous blocking scripts.
2. **Cumulative Layout Shift (CLS):**
   - Verify images and modal popovers have explicit dimensions or skeleton fallbacks to prevent visual jumping.
3. **Interaction to Next Paint (INP):**
   - Detect long tasks on the main JavaScript thread (e.g., synchronous cryptographic functions, heavy JSON parsing on large datasets).

---

## Output Report Format

When running this audit, present findings grouped by urgency:
- 🚨 **Critical Vulnerabilities / Blocking Leaks:** High CVEs, uncleaned intervals running continuously, or unescaped HTML.
- ⚠️ **Performance Warnings:** Unmemoized heavy loops, missing list virtualization, missing cleanup functions.
- 💡 **Optimization Opportunities:** Native replacements, bundle reduction, minor cleanup suggestions.
