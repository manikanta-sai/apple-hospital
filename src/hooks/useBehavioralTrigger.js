import { useEffect, useRef, useState, useCallback } from "react";

/**
 * useBehavioralTrigger
 * ---------------------
 * Watches the HOST page (not the widget) for a department signal and,
 * if the visitor dwells on it past a threshold, surfaces a proactive
 * trigger the widget can act on (e.g. show a contextual greeting
 * bubble). Detection order:
 *
 *   1. A `data-hospital-department="cardiology"` attribute anywhere in
 *      the DOM (put it on <body> or a section wrapper on the host site).
 *   2. Fallback: the URL path, e.g. /departments/cardiology.
 *
 * Re-evaluates on:
 *   - SPA route changes (`popstate`) — most hospital sites are SPAs.
 *   - DOM mutations to the data attribute (host toggles it client-side).
 *
 * Session-scoped dismissal: once a trigger for a given department is
 * dismissed (or acted on), it is written to `sessionStorage` and will
 * not fire again for that department until the tab/session ends —
 * satisfies "don't repeatedly annoy the user".
 */

// --- Configure once per department: proactive message + optional
// quick-reply text sent into the chat if the user accepts the prompt.
const DEPARTMENT_TRIGGERS = {
  cardiology: {
    message: "Looking for a heart specialist? I can help you check Dr. Rao's availability.",
    quickAction: "heart checkup",
  },
  orthopedics: {
    message: "Dealing with joint or bone pain? I can help you book an orthopedic specialist.",
    quickAction: "orthopedic doctor",
  },
  pediatrics: {
    message: "Planning a visit for your child? I can help you find an available pediatrician.",
    quickAction: "pediatrician",
  },
};

const DWELL_TIME_MS = 30_000;
const STORAGE_PREFIX = "hc_trigger_dismissed_";

function detectDepartment() {
  const el = document.querySelector("[data-hospital-department]");
  if (el) return el.getAttribute("data-hospital-department")?.toLowerCase() ?? null;

  const pathMatch = window.location.pathname.match(/\/departments?\/([a-z-]+)/i);
  return pathMatch ? pathMatch[1].toLowerCase() : null;
}

function isDismissedThisSession(department) {
  try {
    return sessionStorage.getItem(STORAGE_PREFIX + department) === "1";
  } catch {
    return false; // storage unavailable - fail open, don't block the trigger
  }
}

function markDismissed(department) {
  try {
    sessionStorage.setItem(STORAGE_PREFIX + department, "1");
  } catch {
    /* storage disabled - nothing to persist, safe to ignore */
  }
}

/**
 * @param {boolean} enabled  pass false to fully disable (e.g. while the
 *                            chat panel is already open)
 */
export function useBehavioralTrigger({ enabled = true } = {}) {
  const [trigger, setTrigger] = useState(null); // { department, message, quickAction }
  const timerRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;

    function evaluate() {
      clearTimeout(timerRef.current);
      setTrigger(null);

      const department = detectDepartment();
      if (!department) return;

      const config = DEPARTMENT_TRIGGERS[department];
      if (!config) return; // no proactive copy configured for this department

      const demoTrigger = document.body.hasAttribute("data-hospital-demo-trigger");
      if (!demoTrigger && isDismissedThisSession(department)) return;

      timerRef.current = setTimeout(() => {
        setTrigger({ department, ...config });
      }, demoTrigger ? 0 : DWELL_TIME_MS);
    }

    evaluate();

    // Re-check on SPA navigations and on the host toggling the data
    // attribute (e.g. a client-rendered department switch without a
    // full page reload).
    window.addEventListener("popstate", evaluate);
    const observer = new MutationObserver(evaluate);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-hospital-department", "data-hospital-demo-trigger"],
      subtree: true,
    });

    return () => {
      clearTimeout(timerRef.current);
      window.removeEventListener("popstate", evaluate);
      observer.disconnect();
    };
  }, [enabled]);

  /** User closed the proactive bubble without engaging. */
  const dismiss = useCallback(() => {
    if (trigger) markDismissed(trigger.department);
    setTrigger(null);
  }, [trigger]);

  /** User tapped "Chat now" - also counts as dismissed going forward. */
  const consume = useCallback(() => {
    const current = trigger;
    if (current) markDismissed(current.department);
    setTrigger(null);
    return current;
  }, [trigger]);

  return { trigger, dismiss, consume };
}
