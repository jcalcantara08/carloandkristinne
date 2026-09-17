"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { PROMO } from "@/lib/constants";

/**
 * The studio card.
 *
 * A small corner card, not a modal: guests are here for the couple, so this
 * never blocks the page. It appears at the minutes in `PROMO.minutes` of a
 * visit, counted from the first page a guest opened (the start time is kept
 * in localStorage, so moving between pages does not reset it), once per
 * minute mark, and never on the dashboard. Closing it hides that showing;
 * the next minute mark still gets its turn, which is what Erick asked for.
 * After the last mark it does not come back.
 *
 * Everything is wrapped in try/catch: with storage blocked the card simply
 * counts from the current page load.
 */
const START_KEY = "kc-promo-start";
const SHOWN_KEY = "kc-promo-shown";

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

function readShown(): number[] {
  try {
    const raw = window.localStorage.getItem(SHOWN_KEY);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
}

function writeShown(minutes: number[]) {
  try {
    window.localStorage.setItem(SHOWN_KEY, JSON.stringify(minutes));
  } catch {
    // Nothing to do: the card may show again on the next visit.
  }
}

export function EnclavePromo() {
  const pathname = usePathname();
  const [minute, setMinute] = useState<number | null>(null);

  const excluded = pathname.startsWith("/admin");

  useEffect(() => {
    if (excluded) return;
    const start = readStart();
    let shown = readShown();
    const pending = PROMO.minutes.filter((m) => !shown.includes(m));
    if (pending.length === 0) return;

    const timers = pending.map((m) => {
      const due = start + m * 60_000 - Date.now();
      return window.setTimeout(
        () => {
          shown = [...readShown(), m];
          writeShown(shown);
          setMinute(m);
        },
        Math.max(due, 0),
      );
    });
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [excluded]);

  if (minute === null) return null;

  return (
    <aside
      role="status"
      aria-live="polite"
      className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-sm rounded-2xl border border-brand-line bg-brand-paper p-5 shadow-lift sm:inset-x-auto sm:right-4"
    >
      <button
        type="button"
        onClick={() => setMinute(null)}
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
        onClick={() => setMinute(null)}
        className="btn-primary mt-4 w-full px-5 py-2.5 text-xs"
      >
        {PROMO.cta}
        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </a>
    </aside>
  );
}
