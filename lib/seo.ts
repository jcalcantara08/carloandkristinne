import type { Metadata } from "next";
import { COUPLE, FAQ, SITE, VENUES, WEDDING_DATE_ISO, WEDDING_DAY } from "@/lib/constants";

/**
 * Metadata is built here, never hand-written per page, so titles, canonicals
 * and social cards cannot drift apart.
 */

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  /** Guest-only pages should not be indexed or listed. */
  noIndex?: boolean;
};

export function pageMeta({ title, description, path, noIndex }: PageMetaInput): Metadata {
  const url = `${SITE.url}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: `${title} | ${SITE.name}`,
      description,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      type: "website",
      images: [{ url: `${SITE.url}/og.png`, width: 1200, height: 630, alt: SITE.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE.name}`,
      description,
      images: [`${SITE.url}/og.png`],
    },
  };
}

/* =========================
   JSON-LD
   ========================= */

export function eventJsonLd() {
  const ceremony = VENUES.find((venue) => venue.key === "ceremony");
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `The wedding of ${COUPLE.groom.fullName} and ${COUPLE.bride.fullName}`,
    description: SITE.description,
    startDate: WEDDING_DATE_ISO,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: SITE.url,
    image: `${SITE.url}/og.png`,
    isAccessibleForFree: true,
    maximumAttendeeCapacity: WEDDING_DAY.guestCount,
    location: {
      "@type": "Place",
      name: ceremony?.name.value ?? `Church in ${WEDDING_DAY.town}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: WEDDING_DAY.town,
        addressRegion: WEDDING_DAY.province,
        addressCountry: "PH",
      },
    },
    organizer: {
      "@type": "Person",
      name: `${COUPLE.groom.shortName} and ${COUPLE.bride.firstName}`,
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    inLanguage: "en-PH",
  };
}

export function faqJsonLd(faq: { q: string; a: string }[] = FAQ) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${SITE.url}${crumb.path}`,
    })),
  };
}
