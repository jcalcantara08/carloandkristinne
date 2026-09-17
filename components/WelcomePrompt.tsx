"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Camera, PenLine, X } from "lucide-react";
import { Monogram } from "@/components/Monogram";
import { COUPLE } from "@/lib/constants";

/**
 * The arrival prompt.
 *
 * The couple asked (17 September 2026, relayed by Erick) that a guest who
 * opens the invitation link is invited, right there, to leave a greeting and
 * upload a photograph, as a pop-up rather than a section on the page. This
 * is that: a small card that rises a moment after the first page has
 * settled, with two ways in (the guestbook and the album) and a plain
 * "maybe later". It shows once per browser, never on the two pages it points
 * to, never on the dashboard, and never before the hero has had its moment.
 *
 * Remembered in localStorage only, wrapped in try/catch, so a private
 * window simply sees it again. Escape closes it, focus goes to the card and
 * back to the page, and the body does not scroll behind it.
 */
const STORAGE_KEY = "kc-welcome-seen";
const DELAY_MS = 1800;

export function WelcomePrompt() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const excluded = pathname.startsWith("/admin") || pathname.startsWith("/guestbook") || pathname.startsWith("/gallery");

  useEffect(() => {
    if (excluded) return;
    let seen = false;
    try {
      seen = window.localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen) return;
    const timer = window.setTimeout(() => setOpen(true), DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [excluded]);

  const close = useCallback(() => {
    setOpen(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // A blocked store just means the card shows again next time.
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    window.setTimeout(() => cardRef.current?.querySelector<HTMLElement>("a, button")?.focus(), 40);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Maybe later"
        onClick={close}
        className="absolute inset-0 h-full w-full cursor-default bg-brand-ink/40"
        tabIndex={-1}
      />
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
        className="relative w-full max-w-md rounded-3xl border border-brand-line bg-brand-paper p-6 text-center shadow-lift sm:p-8"
      >
        <button
          type="button"
          onClick={close}
          className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full text-brand-ink/60 transition-colors hover:bg-brand-paper-200 hover:text-brand-ink"
        >
          <X className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Maybe later</span>
        </button>

        <Monogram size="md" className="mx-auto" />
        <p className="eyebrow mt-5">You made it</p>
        <h2 id="welcome-title" className="mt-3 text-display-md">
          A word for {COUPLE.bride.firstName} and {COUPLE.groom.shortName}?
        </h2>
        <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-brand-ink/75">
          Leave them a greeting on the wishing wall, or add a photograph to the shared album. Both take a minute, and both are kept.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link href="/guestbook" onClick={close} className="btn-primary w-full">
            <PenLine className="h-4 w-4" aria-hidden="true" />
            Write a greeting
          </Link>
          <Link href="/gallery#upload" onClick={close} className="btn-outline w-full">
            <Camera className="h-4 w-4" aria-hidden="true" />
            Upload a photo
          </Link>
        </div>

        <button
          type="button"
          onClick={close}
          className="mt-4 text-xs font-medium text-brand-ink/60 underline-offset-4 hover:text-brand-ink hover:underline"
        >
          Maybe later
        </button>
      </div>
    </div>,
    document.body,
  );
}
