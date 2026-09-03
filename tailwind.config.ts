import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

/**
 * Design tokens are derived from the couple's chosen motif:
 * "Blue - Violet - Black, couple in white."
 *
 * A note on the reading, because an earlier version of this file got it
 * wrong. That motif describes the WEDDING: what the entourage wears. It is
 * not an instruction for the website's background. Treating "black" as the
 * page ground produced a near-black site that looked like a fashion editorial
 * and read as sombre, which is the opposite of what a Filipino wedding feels
 * like and hard work for an older guest reading it on a phone outdoors.
 *
 * The correct reading: white is the couple, so white is the ground and the
 * dominant field of the whole site. Black is the ink: type, and one dark
 * band per page. Blue and violet are the accents, used as a soft wash, the
 * hairline rule, the monogram ring and the dress-code swatches.
 *
 * Same palette, right polarity.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      // Gutters live here so no component ever restates them.
      padding: { DEFAULT: "1.25rem", sm: "1.5rem", lg: "2rem" },
      // 1200, not 1280: keeps line length readable on large displays.
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        brand: {
          // --- The couple. The ground, and most of what you see. ---
          paper: { DEFAULT: "#FFFFFF", 100: "#FFFFFF", 200: "#F7F6FC", 300: "#EDEBF6" },
          // --- Black: type, and the single dark band per page. ---
          ink: { DEFAULT: "#05060E", 800: "#0B0D1A", 700: "#141733" },
          // --- Hairlines. ---
          line: { DEFAULT: "#E6E4F0", strong: "#D2CFE3" },
          /* Blue: the cooler accent. 500 and 600 are safe on paper
             (5.8:1 and 8.4:1). 200 and 300 are for use on the dark band. */
          blue: { DEFAULT: "#3A55D9", 100: "#EEF1FF", 200: "#C2CEFF", 300: "#93A9FF", 400: "#5C74E8", 500: "#3A55D9", 600: "#2C41AB" },
          /* Violet: the warmer accent, and the focus ring.
             500 measures 5.4:1 on paper, so it is safe for the eyebrow. */
          violet: { DEFAULT: "#8B3FD4", 100: "#F6EDFF", 200: "#E0CBFE", 300: "#C9A2FD", 400: "#A855F7", 500: "#8B3FD4", 600: "#6F2FAD" },
        },
      },
      fontFamily: {
        // Always via next/font CSS variables, always with a system fallback.
        display: ["var(--font-display)", "Didot", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Clamp tokens, so markup never carries a breakpoint ladder.
        // Line height shrinks as size grows.
        "display-2xl": ["clamp(3rem, 11vw, 8rem)", { lineHeight: "0.92", letterSpacing: "-0.02em" }],
        "display-xl": ["clamp(2.5rem, 6vw, 4.5rem)", { lineHeight: "1.02", letterSpacing: "-0.015em" }],
        "display-lg": ["clamp(2rem, 4.2vw, 3.25rem)", { lineHeight: "1.08", letterSpacing: "-0.01em" }],
        "display-md": ["clamp(1.5rem, 3vw, 2.25rem)", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
      },
      letterSpacing: {
        // One eyebrow tracking value for the whole site. Do not add a second.
        eyebrow: "0.28em",
      },
      maxWidth: { prose: "68ch" },
      boxShadow: {
        // Tinted with the brand ink, never black, never shadow-lg.
        // rgba(20, 23, 51) is a blue-leaning ink, so shadows on paper stay
        // cool rather than turning grey.
        soft: "0 1px 2px rgba(20, 23, 51, 0.04), 0 6px 20px -8px rgba(20, 23, 51, 0.10)",
        lift: "0 10px 34px -12px rgba(20, 23, 51, 0.18), 0 2px 6px rgba(20, 23, 51, 0.04)",
        glow: "0 10px 30px -8px rgba(139, 63, 212, 0.30)",
      },
      backgroundImage: {
        // The one gradient. Blue into violet, left to right.
        aurora: "linear-gradient(90deg, #3A55D9 0%, #8B3FD4 100%)",
        // The same gradient for use on the dark band, where the darker
        // pair would drop under 4.5:1. See globals.css `.on-ink .aurora-text`.
        "aurora-light": "linear-gradient(90deg, #93A9FF 0%, #C9A2FD 100%)",
        // The ribbon reads top to bottom, so it needs a vertical ramp.
        "aurora-down": "linear-gradient(180deg, #3A55D9 0%, #8B3FD4 55%, #3A55D9 100%)",
        "aurora-soft":
          "linear-gradient(90deg, rgba(58,85,217,0) 0%, rgba(58,85,217,0.85) 25%, rgba(139,63,212,0.85) 75%, rgba(139,63,212,0) 100%)",
        "aurora-v":
          "linear-gradient(180deg, rgba(58,85,217,0) 0%, rgba(58,85,217,0.7) 30%, rgba(139,63,212,0.7) 70%, rgba(139,63,212,0) 100%)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        // The watercolour wash. Very slow, very small travel: atmosphere.
        drift: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(4%, -3%, 0) scale(1.08)" },
        },
        "drift-alt": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1.06)" },
          "50%": { transform: "translate3d(-5%, 4%, 0) scale(1)" },
        },
        "ring-spin": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        marquee: "marquee 38s linear infinite",
        drift: "drift 26s ease-in-out infinite",
        "drift-alt": "drift-alt 32s ease-in-out infinite",
        "ring-spin": "ring-spin 24s linear infinite",
      },
      transitionTimingFunction: {
        // Easing is always expo-out. Never ease, never linear.
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [animate],
};

export default config;
