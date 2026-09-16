import { Cormorant_Garamond, Inter } from "next/font/google";

/**
 * Two faces, no more.
 *
 * Cormorant Garamond for display. An earlier build used Bodoni Moda, a
 * didone, precisely to avoid looking like other wedding sites, and the
 * client's verdict on the result was that it was ugly. The research done on
 * 17 September 2026 across two dozen well-liked wedding sites found the same
 * thing every time: a classic, readable serif for titles and a clean sans
 * for everything else. Cormorant is that serif. It is soft where Bodoni was
 * sharp, it sets warmly at large sizes, and older guests can read it.
 *
 * Inter carries everything a guest actually has to read.
 */
export const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600"],
  style: ["normal", "italic"],
});

export const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
