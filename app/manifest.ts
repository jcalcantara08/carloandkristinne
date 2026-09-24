import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.longName} | 17 October 2026`,
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    // Paper, not ink. The splash screen and the Android chrome match the
    // page ground, which is white.
    background_color: "#FFFFFF",
    theme_color: "#FFFFFF",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
