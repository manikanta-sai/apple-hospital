import { useState, useEffect, useCallback } from "react";

/**
 * useLocalStorage
 * ----------------
 * A drop-in replacement for useState that transparently persists its
 * value to localStorage under `key`. This is the single primitive that
 * powers both requirements #1 (session id persistence) and #2 (UI
 * open/minimized state persistence) - one hook, two use cases.
 *
 * @param {string} key           localStorage key
 * @param {*} initialValue       value (or lazy initializer) used the
 *                                first time this key is seen
 * @returns {[value, setValue]}  same tuple shape as useState
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initialValue;
    } catch (err) {
      // Corrupt JSON or storage disabled (e.g. Safari private mode) -
      // fail soft and fall back to the in-memory initial value.
      console.warn(`[useLocalStorage] could not read "${key}"`, err);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn(`[useLocalStorage] could not write "${key}"`, err);
    }
  }, [key, value]);

  // Also expose a functional-update-safe setter identical to useState's,
  // memoized so it can be passed down without triggering re-renders.
  const setStoredValue = useCallback((next) => {
    setValue(next);
  }, []);

  return [value, setStoredValue];
}
