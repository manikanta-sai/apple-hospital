/**
 * Production Enterprise Security & Anti-Capture Configuration
 */
export const defaultSecurityConfig = {
  // Screen Blackout & Privacy
  blackoutOnBlur: true,           // Turn pitch black when window loses focus (Snipping tool, Alt-Tab)
  blackoutOnPrintScreen: true,    // Flash blackout & wipe clipboard when PrintScreen is pressed
  blackoutDurationMs: 2500,       // Duration to hold blackout after capture attempt if auto-recovering
  
  // Anti-Copy & Anti-Cloning
  disableSelection: true,         // CSS and JS user-select: none across UI
  disableRightClick: true,        // Prevent contextmenu inspect & image saving
  disableCopyCut: true,           // Intercept copy/cut and sanitize clipboard
  disableDevToolsShortcuts: true, // Block F12, Ctrl+Shift+I/J/C, Ctrl+U, Ctrl+S
  disablePrint: true,             // Block Ctrl+P and empty print-media stylesheets
  
  // Dynamic Forensic Watermark
  enableWatermark: false,         // Disabled per user preference
  watermarkOpacity: 0.05,         // Discrete subtle opacity
  watermarkLabel: "CONFIDENTIAL",
  tamperProtection: true,         // MutationObserver triggers if watermark node is modified
  
  // Production setting: badge is hidden by default for clean production UI
  showSecurityBadge: false,
};
