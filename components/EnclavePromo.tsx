"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { PROMO } from "@/lib/constants";

/**
 * The studio card.
 *
 * A small corner card, not a modal: guests are here for the couple, so this
 * never blocks the page. Since 6 October 2026 (Erick's call) it appears every
 * `PROMO.everySeconds` of a visit, on every page except the dashboard. The
 * clock counts from the first page a guest opened (kept in localStorage), so
 * moving between pages neither resets it nor shows the card early. Closing
 * it hides it until the next mark. It carries the Enclave link and Erick's
 * social accounts.
 *
 * Storage is wrapped in try/catch: with it blocked, the card simply counts
 * from the current page load.
 */
const START_KEY = "kc-promo-start";

function readStart(): number {
  try {
    const stored = Number(window.localStorage.getItem(START_KEY));
    if (stored > 0) return stored;
    const now = Date.now();
    window.localStorage.setItem(START_KEY, String(now));
    return now;
  } catch {
    return Date.now();
  }
}

export function EnclavePromo() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const excluded = pathname.startsWith("/admin");

  useEffect(() => {
    if (excluded) return;
    const start = readStart();
    const every = PROMO.everySeconds * 1000;
    let timer = 0;

    const schedule = () => {
      const elapsed = Date.now() - start;
      // The next whole multiple of the interval, never zero: the first
      // showing is one full interval into the visit.
      const nextMark = Math.max(1, Math.floor(elapsed / every) + 1) * every;
      timer = window.setTimeout(() => {
        setOpen(true);
        schedule();
      }, nextMark - elapsed);
    };

    schedule();
    return () => window.clearTimeout(timer);
  }, [excluded]);

  if (excluded || !open) return null;

  return (
    <aside
      role="status"
      aria-live="polite"
      className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-sm rounded-2xl border border-brand-line bg-brand-paper p-5 shadow-lift sm:inset-x-auto sm:right-4"
    >
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-full text-brand-ink/60 transition-colors hover:bg-brand-paper-200 hover:text-brand-ink"
      >
        <X className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">Close</span>
      </button>
      <p className="eyebrow">{PROMO.eyebrow}</p>
      <p className="mt-2 pr-6 font-display text-xl leading-snug text-brand-ink">{PROMO.headline}</p>
      <p className="mt-2 text-sm leading-relaxed text-brand-ink/75">{PROMO.body}</p>
      <a
        href={PROMO.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setOpen(false)}
        className="btn-primary mt-4 w-full px-5 py-2.5 text-xs"
      >
        {PROMO.cta}
        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </a>
      <p className="mt-4 text-center text-xs text-brand-ink/60">{PROMO.socialsLabel}</p>
      <ul className="mt-2 flex flex-wrap justify-center gap-1.5">
        {PROMO.socials.map((social) => (
          <li key={social.name}>
            <a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[32px] items-center rounded-full border border-brand-line px-3 text-xs text-brand-ink/75 transition-colors hover:border-brand-plum-500 hover:text-brand-plum-500"
            >
              {social.name}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
