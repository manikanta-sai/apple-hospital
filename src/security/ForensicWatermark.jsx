import React, { useEffect, useState, useRef } from "react";

/**
 * ForensicWatermark
 * Renders an unobtrusive, tamper-resistant diagonal repeating watermark across the screen.
 * Tracing leaks back to specific session & timestamp if captured via phone cameras or hardware grabbers.
 */
export default function ForensicWatermark({
  enabled = true,
  opacity = 0.05,
  label = "CONFIDENTIAL",
  onTamper,
}) {
  const [timestamp, setTimestamp] = useState(() => new Date().toLocaleString());
  const [sessionId] = useState(() => {
    return "ID-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  });
  const containerRef = useRef(null);

  // Update timestamp every minute
  useEffect(() => {
    if (!enabled) return;
    const interval = setInterval(() => {
      setTimestamp(new Date().toLocaleString());
    }, 60000);
    return () => clearInterval(interval);
  }, [enabled]);

  // Anti-Tamper MutationObserver
  useEffect(() => {
    if (!enabled) return;

    const el = containerRef.current;
    if (!el) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
          const computed = window.getComputedStyle(el);
          if (
            computed.display === "none" ||
            computed.visibility === "hidden" ||
            parseFloat(computed.opacity) < 0.01
          ) {
            el.style.display = "block";
            el.style.visibility = "visible";
            el.style.opacity = `${opacity}`;
            if (onTamper) onTamper("Watermark modification detected");
          }
        }
      });
    });

    observer.observe(el, {
      attributes: true,
      attributeFilter: ["style", "class", "hidden"],
    });

    return () => observer.disconnect();
  }, [enabled, opacity, onTamper]);

  if (!enabled) return null;

  const watermarkText = `${label} • ${sessionId} • ${timestamp} • DO NOT COPY`;

  // Inline SVG pattern tiled repeatedly across entire viewport
  return (
    <div
      ref={containerRef}
      id="forensic-security-watermark"
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none z-[99999] overflow-hidden"
      style={{
        opacity: opacity,
        transition: "opacity 0.2s ease-in-out",
      }}
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="watermark-pattern"
            width="460"
            height="260"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-25)"
          >
            <text
              x="20"
              y="60"
              fill="currentColor"
              className="text-slate-900 dark:text-white"
              fontSize="13"
              fontWeight="600"
              letterSpacing="0.12em"
              fontFamily="monospace"
            >
              {watermarkText}
            </text>
            <text
              x="220"
              y="190"
              fill="currentColor"
              className="text-slate-900 dark:text-white"
              fontSize="12"
              fontWeight="500"
              letterSpacing="0.15em"
              fontFamily="monospace"
            >
              CONFIDENTIAL • {sessionId}
            </text>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#watermark-pattern)" />
      </svg>
    </div>
  );
}
