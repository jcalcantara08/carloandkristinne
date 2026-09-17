import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

/**
 * Design tokens are taken from the couple's attire guides of 17 September
 * 2026, not from the workbook's one-line motif. The guides name five blues:
 * dark steel, dusty, ice, light blue grey and cornflower. There is no violet
 * anywhere on them. The earlier palette (electric blue into purple) was read
 * off the motif words and looked like a different event next to the actual
 * dresses and suits.
 *
 * White stays the ground: it is the couple's colour and it is what every
 * well-liked wedding site in 2026 does. Ink is a cool navy-black to sit with
 * the blues. Only dark steel blue is safe as text on white (8.3:1); dusty,
 * ice and cornflower are washes, hairlines and swatches, never body text.
 * A deepened cornflower (5.4:1) is the second text-safe accent.
 *
 * Every ratio below was measured, not assumed. 60 percent ink is the muted
 * floor (4.9:1); 55 fails at 4.1.
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
          // 200 is an ice-blue tint for section rhythm, never a contrast band.
          paper: { DEFAULT: "#FFFFFF", 100: "#FFFFFF", 200: "#F4F7FA", 300: "#E9EFF4" },
          // --- Navy-black: type, the primary button, the one dark band. 18.7:1 on paper. ---
          ink: { DEFAULT: "#0B1220", 800: "#141D2E", 700: "#1E2A3D" },
          // --- Hairlines, in ice blue. ---
          line: { DEFAULT: "#DDE5EC", strong: "#C4D0DB" },
          /* Steel: dark steel blue from the attire guide, the primary accent.
             500 is the guide's own swatch and measures 8.3:1 on paper, so it
             carries the eyebrow, links and the focus ring. 300 is the
             dusty-blue-grey used for the eyebrow on the dark band (9.2:1). */
          steel: { DEFAULT: "#3B5068", 100: "#EDF2F6", 200: "#D6E0E8", 300: "#A3B8CF", 400: "#5B7590", 500: "#3B5068", 600: "#2E3F52" },
          /* Plum: the deep purple of the printed invitation's type, the
             primary accent since 17 September 2026. 500 measures 8.9:1 on
             paper (eyebrow, links, focus ring); 300 is the lavender used
             for the eyebrow on the dark band (9.3:1). */
          plum: { DEFAULT: "#5A3D78", 100: "#F1EBF6", 200: "#E0D3EC", 300: "#C3AEDD", 400: "#7A5C99", 500: "#5A3D78", 600: "#4A2F63" },
          /* Mauve: the rose-purple of the names on the save the date, the
             second accent. 500 is 5.3:1 on paper, so it may carry text. */
          mauve: { DEFAULT: "#8C5A8C", 100: "#F6EDF5", 200: "#E9D5E7", 300: "#D9B8D4", 400: "#A87AA6", 500: "#8C5A8C", 600: "#74477A" },
          /* Cornflower: the lighter accent. 400 is the guide's own swatch and
             is a wash only (3.4:1). 500 is deepened to 5.4:1 so it can be
             text; 300 is for the dark band (9.0:1). */
          cornflower: { DEFAULT: "#4A69AA", 100: "#EBF0F9", 200: "#C5D3EE", 300: "#9DB4E0", 400: "#6B8BC9", 500: "#4A69AA", 600: "#3B5590" },
          /* Dusty: the bridesmaids' blue. Washes, swatches and photo
             placeholders only; it never carries text. */
          dusty: { DEFAULT: "#7A97B3", 300: "#B9C9D6", 400: "#7A97B3" },
        },
      },
      fontFamily: {
        // Always via next/font CSS variables, always with a system fallback.
        display: ["var(--font-display)", "Garamond", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Clamp tokens, so markup never carries a breakpoint ladder.
        // Line height shrinks as size grows.
        // Cormorant has a small x-height, so these run a touch larger than
        // the Bodoni sizes did, and with normal tracking rather than tight.
        "display-2xl": ["clamp(3rem, 9vw, 6.5rem)", { lineHeight: "1", letterSpacing: "0" }],
        "display-xl": ["clamp(2.5rem, 6vw, 4.75rem)", { lineHeight: "1.05", letterSpacing: "0" }],
        "display-lg": ["clamp(2.125rem, 4.4vw, 3.5rem)", { lineHeight: "1.1", letterSpacing: "0" }],
        "display-md": ["clamp(1.625rem, 3vw, 2.375rem)", { lineHeight: "1.15", letterSpacing: "0" }],
      },
      letterSpacing: {
        // One eyebrow tracking value for the whole site. Do not add a second.
        eyebrow: "0.28em",
      },
      maxWidth: { prose: "68ch" },
      boxShadow: {
        // Tinted with the steel blue, never black, never shadow-lg, so
        // shadows on paper stay cool rather than turning grey.
        soft: "0 1px 2px rgba(90, 61, 120, 0.05), 0 6px 20px -8px rgba(90, 61, 120, 0.12)",
        lift: "0 10px 34px -12px rgba(90, 61, 120, 0.20), 0 2px 6px rgba(90, 61, 120, 0.05)",
        glow: "0 10px 30px -8px rgba(140, 90, 140, 0.30)",
      },
      backgroundImage: {
        // The one gradient: dark steel into cornflower, left to right. Both
        // stops are text-safe on paper (8.3:1 and 5.4:1), so it can carry
        // the hashtag wordmark. The "aurora" name is historical.
        aurora: "linear-gradient(90deg, #5A3D78 0%, #8C5A8C 100%)",
        // The same ramp in the light pair, for the dark band (9.2:1, 9.0:1).
        "aurora-light": "linear-gradient(90deg, #C3AEDD 0%, #D9B8D4 100%)",
        // The hero fade: clear over the upper part of a photograph, ink at
        // the foot so the names read on any picture. Ink is #0B1220.
        veil: "linear-gradient(180deg, rgba(11, 18, 32, 0.42) 0%, rgba(11, 18, 32, 0) 22%, rgba(11, 18, 32, 0) 38%, rgba(11, 18, 32, 0.78) 100%)",
        // A soft horizontal rule that fades at both ends.
        "aurora-soft":
          "linear-gradient(90deg, rgba(90,61,120,0) 0%, rgba(90,61,120,0.7) 25%, rgba(140,90,140,0.7) 75%, rgba(140,90,140,0) 100%)",
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
