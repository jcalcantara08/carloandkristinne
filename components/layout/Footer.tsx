import Link from "next/link";
import { Monogram } from "@/components/Monogram";
import { CREDITS, NAV, SITE, WEDDING_DAY } from "@/lib/constants";

export function Footer() {
  // The wedding year, not the clock. Every public page is prerendered once at
  // build time, so new Date() here would freeze at whatever year the last
  // build ran, which is the same trap the countdown fell into. For a site
  // that exists for one wedding, the wedding year is correct forever.
  const year = WEDDING_DAY.year;

  return (
    <footer className="relative border-t border-brand-line bg-brand-paper-200">
      <div className="container py-14 sm:py-16">
        <div className="flex flex-col items-center text-center">
          <Monogram size="md" />

          <p className="mt-6 font-display text-display-md">
            Carlo <span className="aurora-text">&amp;</span> Kristinne
          </p>

          <p className="mt-3 text-sm text-brand-ink/65">
            {WEDDING_DAY.dateLong} &middot; {WEDDING_DAY.town}, {WEDDING_DAY.province}
          </p>

          <p className="mt-5 break-all text-xs font-semibold uppercase tracking-eyebrow">
            <span className="aurora-text">{SITE.hashtag}</span>
          </p>

          <div aria-hidden="true" className="rule mt-8" />

          <nav aria-label="Footer" className="mt-8">
            <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-[24px] items-center px-1 text-sm text-brand-ink/60 transition-colors duration-200 hover:text-brand-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/rsvp"
                  className="inline-flex min-h-[24px] items-center px-1 text-sm text-brand-ink/60 transition-colors duration-200 hover:text-brand-ink"
                >
                  RSVP
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 border-t border-brand-line pt-8 text-xs text-brand-ink/60 sm:flex-row sm:justify-between">
          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 sm:justify-start">
            <span>
              &copy; {year} {SITE.longName}
            </span>
            <Link
              href="/privacy"
              className="inline-flex min-h-[24px] items-center text-brand-ink/60 underline decoration-brand-line-strong underline-offset-4 transition-colors duration-200 hover:text-brand-ink hover:decoration-brand-steel-500"
            >
              Privacy
            </Link>
          </p>
          <p>
            Built with care by{" "}
            <a
              href={CREDITS.builder.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[24px] items-center text-brand-ink/70 underline decoration-brand-steel-500 decoration-2 underline-offset-4 transition-colors duration-200 hover:text-brand-ink"
            >
              {CREDITS.builder.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
