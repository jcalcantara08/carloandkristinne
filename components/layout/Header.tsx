"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Monogram } from "@/components/Monogram";
import { MobileNav } from "@/components/layout/MobileNav";
import { HERO_TONE, NAV, PRIMARY_CTA } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // The home hero is a photograph that runs under the header, so until the
  // page scrolls the header's text is paper, not ink, or it vanishes into
  // the palm trees. Every other page opens on the ice tint.
  const overPhoto = HERO_TONE === "dark" && pathname === "/" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-300 ease-expo",
        scrolled
          ? "border-b border-brand-line bg-brand-paper/95"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="container flex h-[4.5rem] items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-full focus-visible:ring-offset-brand-paper"
          aria-label="KC Kristinne & Carlo, home"
        >
          <Monogram size="sm" on={overPhoto ? "ink" : "paper"} />
          <span className={cn("hidden font-display text-lg tracking-wide sm:block", overPhoto ? "text-brand-paper" : "text-brand-ink")}>
            Kristinne <span className={overPhoto ? "text-brand-mauve-300" : "text-brand-plum-500"}>&amp;</span> Carlo
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative inline-flex min-h-[44px] items-center rounded-full px-3.5 text-sm transition-colors duration-200",
                      overPhoto
                        ? active
                          ? "text-brand-paper"
                          : "text-brand-paper/80 hover:text-brand-paper"
                        : active
                          ? "text-brand-ink"
                          : "text-brand-ink/65 hover:text-brand-ink",
                    )}
                  >
                    {item.label}
                    {active ? (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-3.5 bottom-2 h-px bg-aurora-soft"
                      />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link href={PRIMARY_CTA.href} className="btn-primary hidden px-5 py-2.5 text-xs sm:inline-flex">
            {PRIMARY_CTA.label}
          </Link>
          <MobileNav overPhoto={overPhoto} />
        </div>
      </div>
    </header>
  );
}
