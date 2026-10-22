import { useEffect, useRef, useState, useCallback } from "react";

/**
 * useChartAnimation
 *
 * Professional IntersectionObserver hook for triggering and orchestrating chart-specific animations:
 * - Bar charts: growing upward from the baseline
 * - Horizontal bar charts: expanding left to right
 * - Stacked bar charts: proportional segment growth
 * - Line charts: progressive path drawing via stroke-dashoffset
 * - Area charts: area filling from baseline
 * - Pie & Doughnut charts: circular progressive sweeps
 * - KPI cards & summaries: subtle fade-in and upward slide
 *
 * Features:
 * - Configurable duration (default: 950ms)
 * - Natural easeOutCubic curve
 * - Optional replayOnReenter support
 * - Automatic cleanup of IntersectionObserver and event listeners on unmount
 */
export function useChartAnimation(options = {}) {
  const {
    duration = 950,
    delay = 0,
    threshold = 0.15,
    rootMargin = "0px 0px -30px 0px",
    replayOnScroll = false,
  } = options;

  const [isRevealed, setIsRevealed] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  const containerRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    if (!("IntersectionObserver" in window)) {
      setIsRevealed(true);
      setAnimationStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!hasAnimatedRef.current || replayOnScroll) {
            hasAnimatedRef.current = true;
            if (delay > 0) {
              const timer = setTimeout(() => {
                setIsRevealed(true);
                setAnimationStarted(true);
              }, delay);
              return () => clearTimeout(timer);
            } else {
              setIsRevealed(true);
              setAnimationStarted(true);
            }
          }
          if (!replayOnScroll) {
            observer.unobserve(element);
          }
        } else if (replayOnScroll) {
          setIsRevealed(false);
          setAnimationStarted(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, delay, replayOnScroll]);

  const replay = useCallback(() => {
    setIsRevealed(false);
    setAnimationStarted(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsRevealed(true);
        setAnimationStarted(true);
      });
    });
  }, []);

  return {
    ref: containerRef,
    isRevealed,
    animationStarted,
    replay,
    duration,
  };
}

export default useChartAnimation;
