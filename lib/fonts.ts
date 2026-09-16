import { Bodoni_Moda, Inter } from "next/font/google";

/**
 * Two faces, no more.
 *
 * Bodoni Moda is a didone: very high stroke contrast, hairline serifs, a
 * fashion-magazine face. At display size on white it gives the names real
 * presence without needing a photograph behind them, which matters because
 * there are none yet. It is deliberately not Cormorant or a script, both of which are the default
 * wedding answer and would make this site look like every other one.
 *
 * Inter carries everything a guest actually has to read.
 */
export const display = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

export const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
