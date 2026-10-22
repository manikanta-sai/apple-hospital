import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

/**
 * Floating Scroll-to-Top Button
 * Appears when user scrolls past 300px with a smooth fade-in.
 * Provides instant, smooth scrolling back to top of page.
 */
export default function ScrollToTopButton({ threshold = 300, className = "" }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top of page"
      title="Scroll to top"
      className={`fixed bottom-6 right-6 z-50 p-3 rounded-full bg-slate-900/90 hover:bg-teal-600 text-white shadow-xl hover:shadow-2xl backdrop-blur-md border border-white/20 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 cursor-pointer flex items-center justify-center group ${className}`}
      style={{
        boxShadow: "0 8px 30px rgba(15, 23, 42, 0.25)",
      }}
    >
      <ArrowUp
        size={20}
        strokeWidth={2.5}
        className="group-hover:-translate-y-0.5 transition-transform"
      />
    </button>
  );
}
