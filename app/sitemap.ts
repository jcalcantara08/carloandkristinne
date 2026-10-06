import type { MetadataRoute } from "next";
import { NAV, PRIMARY_CTA, SITE } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  // /rsvp carries the public guest list, so it is noindex and left out here.
  const routes = [...new Set(["/", ...NAV.map((item) => item.href), PRIMARY_CTA.href, "/privacy"])].filter(
    (route) => route !== "/rsvp",
  );

  return routes.map((route) => ({
    url: `${SITE.url}${route === "/" ? "" : route}`,
    lastModified: now,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route === PRIMARY_CTA.href ? 0.9 : route === "/privacy" ? 0.3 : 0.7,
  }));
}
