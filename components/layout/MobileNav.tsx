"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { NAV, PRIMARY_CTA, SITE } from "@/lib/constants";
import { Monogram } from "@/components/Monogram";
import { cn } from "@/lib/utils";

/**
 * The mobile menu.
 *
 * Focus is trapped while open, Escape closes it, focus returns to the
 * trigger on close, and the body cannot scroll behind it.
 *
 * The panel is portalled to <body>. It used to render inside the fixed
 * header, and once the header gained a backdrop blur on scroll the header
 * became the containing block for the panel's own `position: fixed`, so
 * `inset-0` meant the header's 4.5rem box and the menu opened invisibly.
 * A portal keeps the panel out of every ancestor's stacking and containing
 * context for good. No mounted flag is needed: open starts false, so the
 * server never renders the portal and document is always there when it does.
 */
export function MobileNav({ overPhoto = false }: { overPhoto?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    // Move focus into the panel.
    window.setTimeout(
      () => panelRef.current?.querySelector<HTMLElement>("a, button")?.focus(),
      40,
    );

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        className={cn(
          "inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-200 lg:hidden",
          overPhoto
            ? "border-brand-paper/50 text-brand-paper hover:border-brand-paper"
            : "border-brand-line text-brand-ink hover:border-brand-line-strong",
        )}
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">Open menu</span>
      </button>

      {open
        ? createPortal(
            <div className="fixed inset-0 z-50 lg:hidden">
              <button
                type="button"
                aria-label="Close menu"
                onClick={close}
                className="absolute inset-0 h-full w-full cursor-default bg-brand-ink/40 backdrop-blur-sm"
                tabIndex={-1}
              />

              <div
                ref={panelRef}
                id="mobile-nav-panel"
                role="dialog"
                aria-modal="true"
                aria-label="Menu"
                className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col border-l border-brand-line bg-brand-paper-100 shadow-lift"
              >
                <div className="flex h-[4.5rem] shrink-0 items-center justify-between border-b border-brand-line px-5">
                  <Monogram size="sm" />
                  <button
                    type="button"
                    onClick={close}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-line text-brand-ink"
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                    <span className="sr-only">Close menu</span>
                  </button>
                </div>

                <nav
                  aria-label="Mobile"
                  className="flex-1 overflow-y-auto px-5 py-6"
                >
                  <ul className="space-y-1">
                    {NAV.map((item) => {
                      const active = pathname === item.href;
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={close}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                              "flex min-h-[52px] items-center justify-between rounded-xl px-4 font-display text-xl transition-colors duration-200",
                              active
                                ? "bg-brand-paper-200 text-brand-ink"
                                : "text-brand-ink/70 hover:bg-brand-paper-200 hover:text-brand-ink",
                            )}
                          >
                            {item.label}
                            {active ? (
                              <span
                                aria-hidden="true"
                                className="h-px w-6 bg-aurora"
                              />
                            ) : null}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>

                  <Link
                    href={PRIMARY_CTA.href}
                    onClick={close}
                    className="btn-primary mt-8 w-full"
                  >
                    {PRIMARY_CTA.label}
                  </Link>

                  <p className="mt-8 text-center text-xs tracking-wider text-brand-ink/60">
                    {SITE.hashtag}
                  </p>
                </nav>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
