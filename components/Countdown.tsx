"use client";

import { useEffect, useState } from "react";
import { WEDDING_DATE_ISO, WEDDING_DAY } from "@/lib/constants";

/**
 * The countdown.
 *
 * The clock is read only on the client, never during render on the server.
 *
 * An earlier version snapshotted Date.now() in the Hero and passed it in, so
 * that the first paint already had a number. That was wrong: the homepage is
 * statically prerendered, so the "snapshot" was frozen at build time and grew
 * more wrong every day for anyone without JavaScript.
 *
 * Instead the server renders the same four boxes with a neutral placeholder.
 * The boxes are identical in size, so there is no layout shift when the real
 * numbers arrive a frame later, and a reader without JavaScript sees the full
 * date, which the hero states directly above this component.
 */

type Parts = { days: number; hours: number; minutes: number; seconds: number; past: boolean };

function partsFrom(now: number): Parts {
  const diff = new Date(WEDDING_DATE_ISO).getTime() - now;
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, past: true };
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    past: false,
  };
}

const LABELS = ["Days", "Hours", "Minutes", "Seconds"] as const;

export function Countdown() {
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    const tick = () => setParts(partsFrom(Date.now()));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (parts?.past) {
    return (
      <p className="text-center font-display text-display-md text-brand-ink">
        Married. Thank you for being there.
      </p>
    );
  }

  const values = parts
    ? [parts.days, parts.hours, parts.minutes, parts.seconds]
    : [null, null, null, null];

  return (
    <div>
      {/* Announced once, when it first resolves, rather than every second. */}
      <p className="sr-only" role="status">
        {parts ? `${parts.days} days until the wedding.` : ""}
      </p>

      <ul className="grid grid-cols-4 gap-px overflow-hidden rounded-2xl border border-brand-line bg-brand-line">
        {LABELS.map((label, index) => (
          <li key={label} className="bg-brand-paper-100 px-2 py-5 text-center sm:px-4 sm:py-6 lg:px-1">
            <span
              className="block font-display text-3xl tabular-nums text-brand-ink sm:text-4xl"
              aria-hidden={values[index] === null ? "true" : undefined}
            >
              {values[index] === null ? (
                <span className="text-brand-ink/45">&middot;&middot;</span>
              ) : (
                String(values[index]).padStart(2, "0")
              )}
            </span>
            {/* tracking-wider, not the eyebrow tracking. On desktop this sits in
                the narrow right column of the hero, where each cell is about
                80px wide, and at 0.28em the word SECONDS wraps mid-word. The
                same tighter tracking is what Badge and PendingChip use for
                captions of this size. */}
            <span className="mt-1.5 block whitespace-nowrap text-[0.65rem] font-semibold uppercase tracking-wider text-brand-ink/60">
              {label}
            </span>
          </li>
        ))}
      </ul>

      <noscript>
        <p className="mt-3 text-center text-sm text-brand-ink/60">
          {WEDDING_DAY.dayOfWeek}, {WEDDING_DAY.dateLong}, at {WEDDING_DAY.ceremonyTime}.
        </p>
      </noscript>
    </div>
  );
}
