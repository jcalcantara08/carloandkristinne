import type { MetadataRoute } from "next";
import { NAV, PRIMARY_CTA, SITE } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ["/", ...NAV.map((item) => item.href), PRIMARY_CTA.href, "/privacy"];

  return routes.map((route) => ({
    url: `${SITE.url}${route === "/" ? "" : route}`,
    lastModified: now,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route === PRIMARY_CTA.href ? 0.9 : route === "/privacy" ? 0.3 : 0.7,
  }));
}
