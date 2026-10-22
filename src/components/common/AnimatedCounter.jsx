import React, { useEffect, useState, useRef } from "react";

/**
 * AnimatedCounter
 * Smoothly animates numbers count-up using requestAnimationFrame with easeOutCubic curve.
 * Automatically parses numeric values from numbers or strings (e.g. 253, "678", "94%").
 */
export default function AnimatedCounter({
  value = 0,
  duration = 850,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
  style = {},
}) {
  // Extract number from value if string (e.g. "94%" -> 94, "+19%" -> 19)
  const extractNumeric = (val) => {
    if (typeof val === "number") return val;
    if (typeof val === "string") {
      const cleaned = val.replace(/[^0-9.-]/g, "");
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  const targetNum = extractNumeric(value);
  const [displayNum, setDisplayNum] = useState(0);
  const startRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const startVal = startRef.current;
    const endVal = targetNum;
    const startTime = performance.now();

    // Ease-out cubic curve: 1 - pow(1 - t, 3)
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / Math.max(duration, 100), 1);
      const easedProgress = easeOutCubic(progress);

      const current = startVal + (endVal - startVal) * easedProgress;
      setDisplayNum(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(updateCounter);
      } else {
        setDisplayNum(endVal);
        startRef.current = endVal;
      }
    };

    rafRef.current = requestAnimationFrame(updateCounter);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [targetNum, duration]);

  const formattedNumber =
    decimals > 0
      ? displayNum.toFixed(decimals)
      : Math.round(displayNum).toLocaleString();

  return (
    <span className={`inline-block tabular-nums ${className}`} style={style}>
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
}
