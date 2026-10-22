import React, { createContext, useContext, useEffect, useRef, useState } from "react";

export const ScrollRevealContext = createContext({ isRevealed: true });

export function useScrollReveal() {
  return useContext(ScrollRevealContext);
}

/**
 * useInView Hook
 * Standalone intersection observer hook for components to detect when they enter viewport.
 */
export function useInView(options = {}) {
  const { threshold = 0.15, rootMargin = "0px 0px -40px 0px", once = true } = options;
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, isInView];
}

/**
 * ScrollReveal
 * Simple, high-performance IntersectionObserver wrapper that animates graphs/charts
 * and dashboard sections when scrolled into view.
 */
export default function ScrollReveal({
  children,
  className = "",
  style = {},
  threshold = 0.12,
  delay = 0,
  once = true,
}) {
  const [isRevealed, setIsRevealed] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const el = domRef.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (delay > 0) {
              setTimeout(() => setIsRevealed(true), delay);
            } else {
              setIsRevealed(true);
            }
            if (once) {
              observer.unobserve(el);
            }
          } else if (!once) {
            setIsRevealed(false);
          }
        });
      },
      {
        threshold,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold, delay, once]);

  return (
    <ScrollRevealContext.Provider value={{ isRevealed }}>
      <div
        ref={domRef}
        className={`scroll-reveal ${isRevealed ? "is-revealed animate-bar-active" : ""} ${className}`}
        style={style}
      >
        {children}
      </div>
    </ScrollRevealContext.Provider>
  );
}
