/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      // ---- Design tokens for the "Clinical Calm" brand ----
      // Chosen deliberately for a hospital product: a deep clinical teal
      // (trust, hygiene) paired with a warm coral action color (human,
      // urgent-but-friendly) instead of the generic purple/violet
      // "AI assistant" palette.
      colors: {
        clinical: {
          950: "#0A2E2E", // deepest teal - header/footer surfaces
          900: "#0E3D3D",
          700: "#0F5C5C", // primary brand teal
          500: "#16807E", // interactive teal (links, focus rings)
          100: "#E4F2F0", // pale teal tint - assistant bubble bg
          50: "#F5FAF9",  // app background
        },
        coral: {
          600: "#E1503E", // primary CTA (Book Slot)
          500: "#F2664F",
          100: "#FDE7E2",
        },
        status: {
          available: "#1E9E6B", // availability badge - green
          busy: "#C9502F",      // availability badge - amber/red
        },
        ink: {
          900: "#122327", // primary text
          600: "#4C6461", // secondary text
          300: "#A9BDB9", // placeholder / disabled
        },
      },
      fontFamily: {
        // Display face: used sparingly for the widget header/title
        display: ["'Plus Jakarta Sans'", "sans-serif"],
        // Body face: everything else, optimized for chat legibility
        sans: ["'Inter'", "sans-serif"],
      },
      borderRadius: {
        bubble: "18px",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: 0, transform: "translateY(6px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "pop-in": {
          "0%": { opacity: 0, transform: "scale(0.85)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        "pop-out": {
          "0%": { opacity: 1, transform: "scale(1)" },
          "100%": { opacity: 0, transform: "scale(0.8)" },
        },
        "bounce-dot": {
          "0%, 80%, 100%": { transform: "scale(0.6)", opacity: 0.4 },
          "40%": { transform: "scale(1)", opacity: 1 },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(15, 92, 92, 0.35)" },
          "100%": { boxShadow: "0 0 0 14px rgba(15, 92, 92, 0)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.25s ease-out",
        "pop-in": "pop-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "pop-out": "pop-out 0.2s ease-in forwards",
        "bounce-dot": "bounce-dot 1.2s infinite ease-in-out",
        "pulse-ring": "pulse-ring 2s infinite",
      },
    },
  },
  plugins: [],
};
