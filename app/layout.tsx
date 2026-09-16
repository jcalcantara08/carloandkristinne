import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";

import { body, display } from "@/lib/fonts";
import { SITE } from "@/lib/constants";
import { eventJsonLd, websiteJsonLd } from "@/lib/seo";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SkipLink } from "@/components/layout/SkipLink";
import { Ribbon } from "@/components/Ribbon";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.longName} | 17 October 2026`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  // The homepage builds its metadata here rather than through pageMeta(),
  // so it has to declare its own canonical. Child pages override this.
  alternates: { canonical: SITE.url },
  applicationName: SITE.name,
  authors: [{ name: "Erick Cabal", url: "https://erickcabal.com" }],
  creator: "Erick Cabal",
  keywords: ["wedding", "Carlo and Kristinne", "Rosario Cavite", SITE.hashtag],
  openGraph: {
    type: "website",
    locale: SITE.locale,
    siteName: SITE.name,
    url: SITE.url,
    title: `${SITE.longName} | 17 October 2026`,
    description: SITE.description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.longName} | 17 October 2026`,
    description: SITE.description,
    images: ["/og.png"],
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
};

// Light only, and it has to say so. A leftover colorScheme: "dark" from the
// abandoned dark build made the browser paint its own widgets (the RSVP
// select, scrollbars, the pre-paint canvas) as if the page were black.
export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh">
        {/* Marks the document as JS-capable before anything below it paints,
            which is what lets the reveal animation hide content only when it
            can bring it back. It has to run synchronously and must not
            flash, so it is a plain inline script rather than next/script,
            and it lives here rather than in a hand-written <head> because
            the App Router owns the head element. */}
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
        <SkipLink />
        <Header />
        {/* The ribbon threads the whole document, so it lives here rather
            than in any one section. `isolate` gives it a stacking context to
            sit behind. */}
        <main id="main" className="relative isolate pt-[4.5rem]">
          <Ribbon />
          {children}
        </main>
        <Footer />

        <script
          type="application/ld+json"
          // Static, author-controlled objects. No user input reaches here.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd()) }}
        />
      </body>
    </html>
  );
}
