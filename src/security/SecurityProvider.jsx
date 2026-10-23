import React, { createContext, useContext } from "react";
import { useSecurityGuard } from "./useSecurityGuard.js";
import BlackoutOverlay from "./BlackoutOverlay.jsx";
import ForensicWatermark from "./ForensicWatermark.jsx";
import SecurityBadge from "./SecurityBadge.jsx";

const SecurityContext = createContext(null);

export function useSecurity() {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error("useSecurity must be used within a SecurityProvider");
  }
  return context;
}

/**
 * SecurityProvider
 * Wraps the application to enforce DRM-level screenshot blackout,
 * anti-copying, print blocking, and forensic watermarking.
 */
export function SecurityProvider({ children, config = {} }) {
  const security = useSecurityGuard(config);

  const value = {
    isShieldActive: security.isShieldActive,
    toggleShield: () => security.setIsShieldActive((prev) => !prev),
    isBlackedOut: security.isBlackedOut,
    blackoutReason: security.blackoutReason,
    dismissBlackout: security.dismissBlackout,
    simulateScreenshotCapture: security.simulateScreenshotCapture,
    incidentCount: security.securityIncidentCount,
    lastIncident: security.lastIncident,
  };

  return (
    <SecurityContext.Provider value={value}>
      {/* 1. Main Application Content */}
      <div className={security.isShieldActive ? "secure-content-root" : ""}>
        {children}
      </div>

      {/* 2. Pitch-Black Capture Overlay */}
      <BlackoutOverlay
        isBlackedOut={security.isBlackedOut}
        title="For security reasons this content is protected"
        reason={
          security.blackoutReason ||
          "Printing, screenshots and switching tabs are restricted while viewing this content."
        }
        onDismiss={security.dismissBlackout}
      />

      {/* 3. Interactive Floating Security HUD (disabled in production) */}
      {security.config.showSecurityBadge && (
        <SecurityBadge
          isShieldActive={security.isShieldActive}
          onToggleShield={() => security.setIsShieldActive((prev) => !prev)}
          onSimulateCapture={security.simulateScreenshotCapture}
          incidentCount={security.securityIncidentCount}
          lastIncident={security.lastIncident}
          config={security.config}
        />
      )}
    </SecurityContext.Provider>
  );
}

export default SecurityProvider;
