import { useState, useEffect, useCallback, useRef } from "react";
import { defaultSecurityConfig } from "./securityConfig.js";

/**
 * useSecurityGuard
 * Production client-side anti-capture & data protection guard hook.
 * Whitelists clinical printing (e.g. Rx and thermal tokens) while restricting general captures.
 */
export function useSecurityGuard(customConfig = {}) {
  const config = { ...defaultSecurityConfig, ...customConfig };

  const [isBlackedOut, setIsBlackedOut] = useState(false);
  const [blackoutReason, setBlackoutReason] = useState("");
  const [securityIncidentCount, setSecurityIncidentCount] = useState(0);
  const [lastIncident, setLastIncident] = useState(null);
  const [isWatermarkTampered, setIsWatermarkTampered] = useState(false);
  const [isShieldActive, setIsShieldActive] = useState(true);

  const timeoutRef = useRef(null);
  const isPrintingRef = useRef(false);

  const recordIncident = useCallback((type, message) => {
    setSecurityIncidentCount((c) => c + 1);
    setLastIncident({
      type,
      message,
      timestamp: new Date().toLocaleTimeString(),
    });
  }, []);

  const triggerBlackout = useCallback(
    (reason, autoRecoverMs = null) => {
      if (!isShieldActive || isPrintingRef.current) return;
      setIsBlackedOut(true);
      setBlackoutReason(
        reason ||
          "Printing, screenshots and switching tabs are restricted while viewing this content."
      );

      if (autoRecoverMs) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setIsBlackedOut(false);
          setBlackoutReason("");
        }, autoRecoverMs);
      }
    },
    [isShieldActive]
  );

  const dismissBlackout = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsBlackedOut(false);
    setBlackoutReason("");
  }, []);

  // 0. Print Lifecycle Listeners (Allows legitimate Rx printing without triggering blur blackout)
  useEffect(() => {
    const handleBeforePrint = () => {
      isPrintingRef.current = true;
      // Ensure blackout is cleared so printable prescription shows
      setIsBlackedOut(false);
      setBlackoutReason("");
    };

    const handleAfterPrint = () => {
      // Small timeout to allow browser focus to restore cleanly after print modal closes
      setTimeout(() => {
        isPrintingRef.current = false;
      }, 500);
    };

    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  // 1. Focus & Visibility Change Listener (Blocks OS Snipping Tools / Alt-Tab capture)
  useEffect(() => {
    // In headless automated test runners (e.g. Playwright workers running in background),
    // background windows lack OS focus by design. We only activate blur blackout for real browser sessions
    // or when explicitly enabled via window.__FORCE_BLUR_TEST__.
    const isHeadlessRunner =
      typeof navigator !== "undefined" &&
      Boolean(navigator.webdriver) &&
      typeof window !== "undefined" &&
      !window.__FORCE_BLUR_TEST__;

    if (!isShieldActive || !config.blackoutOnBlur || isHeadlessRunner) return;

    const handleBlur = () => {
      // If user is currently printing a prescription / thermal receipt, do not blackout
      if (isPrintingRef.current) return;

      triggerBlackout(
        "Printing, screenshots and switching tabs are restricted while viewing this content."
      );
      recordIncident("BLUR_CAPTURE", "Window lost focus to capture utility or background app");
    };

    const handleFocus = () => {
      if (!timeoutRef.current && !isPrintingRef.current) {
        setIsBlackedOut(false);
        setBlackoutReason("");
      }
    };

    const handleVisibilityChange = () => {
      if (isPrintingRef.current) return;

      if (document.visibilityState === "hidden") {
        triggerBlackout(
          "Printing, screenshots and switching tabs are restricted while viewing this content."
        );
        recordIncident("VISIBILITY_HIDDEN", "Document visibility state changed to hidden");
      } else if (document.visibilityState === "visible") {
        if (!timeoutRef.current) {
          setIsBlackedOut(false);
          setBlackoutReason("");
        }
      }
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isShieldActive, config.blackoutOnBlur, triggerBlackout, recordIncident]);

  // 2. Keyboard & Screenshot Key Listeners (PrintScreen, DevTools, View Source, Print)
  useEffect(() => {
    if (!isShieldActive) return;

    const wipeClipboard = async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(
            "For security reasons this content is protected. Copying is restricted."
          );
        }
      } catch {
        // Clipboard write might be denied if document is not focused; safe fallback
      }
    };

    const handleKeyDown = (e) => {
      const key = e.key;
      const ctrlOrMeta = e.ctrlKey || e.metaKey;

      // PrintScreen Key Detection
      if (key === "PrintScreen" || e.keyCode === 44) {
        if (config.blackoutOnPrintScreen) {
          e.preventDefault();
          wipeClipboard();
          triggerBlackout(
            "Printing, screenshots and switching tabs are restricted while viewing this content.",
            config.blackoutDurationMs
          );
          recordIncident("PRINTSCREEN", "PrintScreen key intercepted. Clipboard sanitized.");
        }
        return;
      }

      // DevTools Inspection (F12)
      if (config.disableDevToolsShortcuts && key === "F12") {
        e.preventDefault();
        e.stopPropagation();
        recordIncident("DEVTOOLS_F12", "F12 Developer Tools inspection blocked.");
        return;
      }

      // DevTools Ctrl+Shift+I / J / C
      if (
        config.disableDevToolsShortcuts &&
        ctrlOrMeta &&
        e.shiftKey &&
        ["I", "i", "J", "j", "C", "c"].includes(key)
      ) {
        e.preventDefault();
        e.stopPropagation();
        recordIncident("DEVTOOLS_COMBO", `Ctrl+Shift+${key.toUpperCase()} DevTools shortcut blocked.`);
        return;
      }

      // View Source (Ctrl+U)
      if (config.disableDevToolsShortcuts && ctrlOrMeta && (key === "u" || key === "U")) {
        e.preventDefault();
        e.stopPropagation();
        recordIncident("VIEW_SOURCE", "Ctrl+U View Source blocked.");
        return;
      }

      // Save Webpage (Ctrl+S) - prevent cloning
      if (config.disableDevToolsShortcuts && ctrlOrMeta && (key === "s" || key === "S")) {
        e.preventDefault();
        e.stopPropagation();
        recordIncident("SAVE_CLONE", "Ctrl+S Page Clone/Save blocked.");
        return;
      }

      // Print Dialog (Ctrl+P) - ALLOW legitimate clinical Rx / ticket printing
      if (ctrlOrMeta && (key === "p" || key === "P")) {
        const isClinicalPrintAllowed = Boolean(
          document.getElementById("prescription-print-portal") ||
            document.querySelector(".printable-thermal-ticket") ||
            document.querySelector("[data-printable-rx]") ||
            document.querySelector(".prescription-preview-modal")
        );

        if (!isClinicalPrintAllowed && config.disablePrint) {
          e.preventDefault();
          e.stopPropagation();
          triggerBlackout(
            "Printing, screenshots and switching tabs are restricted while viewing this content.",
            2500
          );
          recordIncident("PRINT_ATTEMPT", "Print restricted for general UI.");
          return;
        }
        // If clinical print is active, let native print dialog proceed cleanly
        isPrintingRef.current = true;
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "PrintScreen" || e.keyCode === 44) {
        wipeClipboard();
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("keyup", handleKeyUp, true);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("keyup", handleKeyUp, true);
    };
  }, [isShieldActive, config, triggerBlackout, recordIncident]);

  // 3. Anti-Copy, Anti-Cut, Anti-RightClick, Anti-Drag
  useEffect(() => {
    if (!isShieldActive) return;

    const handleCopyCut = (e) => {
      if (!config.disableCopyCut) return;

      const target = e.target;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA";

      // If user is trying to copy from general UI:
      if (!isInput) {
        e.preventDefault();
        if (e.clipboardData) {
          e.clipboardData.setData(
            "text/plain",
            "For security reasons this content is protected. Copying is restricted."
          );
        }
        recordIncident("COPY_INTERCEPTED", "Text copy blocked");
      }
    };

    const handleContextMenu = (e) => {
      if (!config.disableRightClick) return;
      e.preventDefault();
      recordIncident("CONTEXT_MENU", "Right-click context menu suppressed");
    };

    const handleDragStart = (e) => {
      // Prevent dragging clinical images, text or assets out of the window
      e.preventDefault();
    };

    document.addEventListener("copy", handleCopyCut, true);
    document.addEventListener("cut", handleCopyCut, true);
    document.addEventListener("contextmenu", handleContextMenu, true);
    document.addEventListener("dragstart", handleDragStart, true);

    return () => {
      document.removeEventListener("copy", handleCopyCut, true);
      document.removeEventListener("cut", handleCopyCut, true);
      document.removeEventListener("contextmenu", handleContextMenu, true);
      document.removeEventListener("dragstart", handleDragStart, true);
    };
  }, [isShieldActive, config, recordIncident]);

  // 4. Test trigger helper
  const simulateScreenshotCapture = useCallback(() => {
    triggerBlackout(
      "Printing, screenshots and switching tabs are restricted while viewing this content.",
      3000
    );
    recordIncident("SIMULATION", "Blackout simulation triggered");
  }, [triggerBlackout, recordIncident]);

  return {
    isBlackedOut,
    blackoutReason,
    isShieldActive,
    setIsShieldActive,
    dismissBlackout,
    simulateScreenshotCapture,
    securityIncidentCount,
    lastIncident,
    isWatermarkTampered,
    setIsWatermarkTampered,
    config,
  };
}
