import React, { useEffect, useRef, useState } from "react";
import { useScrollReveal } from "./ScrollReveal.jsx";

/**
 * Natural easeOutCubic easing curve: 1 - Math.pow(1 - t, 3)
 */
export const EASE_OUT_CUBIC = "cubic-bezier(0.33, 1, 0.68, 1)";

/**
 * 1. Vertical Bar (Grows upward from baseline)
 */
export function AnimatedBar({
  heightPct = 0,
  maxHeight = "100%",
  className = "",
  style = {},
  index = 0,
  staggerMs = 80,
  duration = 950,
  children,
  isRevealed: externalIsRevealed,
}) {
  const { isRevealed: contextIsRevealed } = useScrollReveal();
  const isRevealed = externalIsRevealed !== undefined ? externalIsRevealed : contextIsRevealed;

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{
        height: `${heightPct}%`,
        maxHeight,
        transform: isRevealed ? "scaleY(1)" : "scaleY(0)",
        transformOrigin: "bottom center",
        transition: `transform ${duration}ms ${EASE_OUT_CUBIC}`,
        transitionDelay: `${index * staggerMs}ms`,
        willChange: "transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/**
 * 2. Horizontal Bar (Expands from left to right)
 */
export function AnimatedHBar({
  widthPct = 0,
  className = "",
  style = {},
  index = 0,
  staggerMs = 80,
  duration = 900,
  children,
  isRevealed: externalIsRevealed,
}) {
  const { isRevealed: contextIsRevealed } = useScrollReveal();
  const isRevealed = externalIsRevealed !== undefined ? externalIsRevealed : contextIsRevealed;

  return (
    <div
      className={`relative h-full ${className}`}
      style={{
        width: `${widthPct}%`,
        transform: isRevealed ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left center",
        transition: `transform ${duration}ms ${EASE_OUT_CUBIC}`,
        transitionDelay: `${index * staggerMs}ms`,
        willChange: "transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/**
 * 3. Stacked Bar Segment (Preserves correct proportions while growing)
 */
export function AnimatedStackedBar({
  segments = [], // [{ pct: 60, color: 'bg-teal-500', label: 'Walk-in' }, ...]
  height = "12px",
  className = "",
  style = {},
  index = 0,
  staggerMs = 90,
  duration = 1000,
  isRevealed: externalIsRevealed,
}) {
  const { isRevealed: contextIsRevealed } = useScrollReveal();
  const isRevealed = externalIsRevealed !== undefined ? externalIsRevealed : contextIsRevealed;

  return (
    <div
      className={`w-full flex rounded-full overflow-hidden bg-slate-100 ${className}`}
      style={{
        height,
        transform: isRevealed ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left center",
        transition: `transform ${duration}ms ${EASE_OUT_CUBIC}`,
        transitionDelay: `${index * staggerMs}ms`,
        willChange: "transform",
        ...style,
      }}
    >
      {segments.map((seg, sIdx) => (
        <div
          key={seg.label || sIdx}
          style={{ width: `${seg.pct}%` }}
          className={`h-full ${seg.color || "bg-teal-500"} transition-all duration-300`}
          title={`${seg.label || ""}: ${seg.pct}%`}
        />
      ))}
    </div>
  );
}

/**
 * 4. SVG Line Chart (Progressive path drawing + smooth data point reveal)
 */
export function AnimatedSvgLine({
  d = "",
  stroke = "#0284c7",
  strokeWidth = 2.5,
  points = [], // [{ x, y, label, val }, ...]
  duration = 1100,
  delay = 100,
  isRevealed: externalIsRevealed,
}) {
  const { isRevealed: contextIsRevealed } = useScrollReveal();
  const isRevealed = externalIsRevealed !== undefined ? externalIsRevealed : contextIsRevealed;
  const pathRef = useRef(null);
  const [totalLength, setTotalLength] = useState(1000);

  useEffect(() => {
    if (pathRef.current) {
      try {
        const length = pathRef.current.getTotalLength();
        if (length > 0) setTotalLength(length);
      } catch {}
    }
  }, [d]);

  return (
    <g className="animated-line-series">
      {/* Animated Stroke Path */}
      <path
        ref={pathRef}
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: totalLength,
          strokeDashoffset: isRevealed ? 0 : totalLength,
          transition: `stroke-dashoffset ${duration}ms ${EASE_OUT_CUBIC}`,
          transitionDelay: `${delay}ms`,
        }}
      />

      {/* Sequentially revealed data points */}
      {points.map((pt, pIdx) => (
        <circle
          key={pIdx}
          cx={pt.x}
          cy={pt.y}
          r={pt.r || 4}
          fill={pt.fill || "#ffffff"}
          stroke={stroke}
          strokeWidth={strokeWidth}
          style={{
            opacity: isRevealed ? 1 : 0,
            transform: isRevealed ? "scale(1)" : "scale(0)",
            transformOrigin: `${pt.x}px ${pt.y}px`,
            transition: `opacity 400ms ease, transform 400ms ${EASE_OUT_CUBIC}`,
            transitionDelay: `${delay + (duration * (pIdx + 1)) / (points.length + 1)}ms`,
          }}
        />
      ))}
    </g>
  );
}

/**
 * 5. SVG Area Chart (Fills from baseline)
 */
export function AnimatedSvgArea({
  d = "",
  fill = "url(#areaGrad)",
  baselineY = 200,
  duration = 1000,
  delay = 50,
  isRevealed: externalIsRevealed,
}) {
  const { isRevealed: contextIsRevealed } = useScrollReveal();
  const isRevealed = externalIsRevealed !== undefined ? externalIsRevealed : contextIsRevealed;

  return (
    <path
      d={d}
      fill={fill}
      style={{
        opacity: isRevealed ? 1 : 0,
        transform: isRevealed ? "scaleY(1)" : "scaleY(0)",
        transformOrigin: `center ${baselineY}px`,
        transition: `opacity 600ms ease, transform ${duration}ms ${EASE_OUT_CUBIC}`,
        transitionDelay: `${delay}ms`,
      }}
    />
  );
}

/**
 * 6. Pie & Doughnut Segment (Circular Progressive Sweep)
 */
export function AnimatedDonutSegment({
  size = 120,
  strokeWidth = 14,
  pct = 75,
  color = "#0d9488",
  trackColor = "#f1f5f9",
  label,
  subLabel,
  index = 0,
  duration = 1000,
  isRevealed: externalIsRevealed,
}) {
  const { isRevealed: contextIsRevealed } = useScrollReveal();
  const isRevealed = externalIsRevealed !== undefined ? externalIsRevealed : contextIsRevealed;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center select-none">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Animated Sweep Segment */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: isRevealed ? strokeDashoffset : circumference,
            transition: `stroke-dashoffset ${duration}ms ${EASE_OUT_CUBIC}`,
            transitionDelay: `${index * 120}ms`,
          }}
        />
      </svg>
      {(label || subLabel) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {label && <span className="text-base font-black text-slate-900 leading-none">{label}</span>}
          {subLabel && <span className="text-[10px] text-slate-400 font-semibold mt-0.5">{subLabel}</span>}
        </div>
      )}
    </div>
  );
}

/**
 * 7. KPI Card & Chart Summary Container
 * Subtle fade-in and upward movement when entering the viewport
 */
export function AnimatedKpiCard({
  children,
  className = "",
  style = {},
  index = 0,
  staggerMs = 60,
  duration = 650,
  isRevealed: externalIsRevealed,
}) {
  const { isRevealed: contextIsRevealed } = useScrollReveal();
  const isRevealed = externalIsRevealed !== undefined ? externalIsRevealed : contextIsRevealed;

  return (
    <div
      className={className}
      style={{
        opacity: isRevealed ? 1 : 0,
        transform: isRevealed ? "translateY(0)" : "translateY(16px)",
        transition: `opacity ${duration}ms ease-out, transform ${duration}ms ${EASE_OUT_CUBIC}`,
        transitionDelay: `${index * staggerMs}ms`,
        willChange: "opacity, transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
