"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Download, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import type { Photo } from "@/lib/types";

/**
 * The album.
 *
 * A lightbox rather than a gallery library: Escape closes, arrow keys move,
 * focus is trapped, and every photograph has a real download link that
 * points at the original object in storage. The couple were explicit that
 * guests must be able to take the files, so download is a first-class
 * control and not an afterthought.
 */
export function GalleryGrid({ photos }: { photos: Photo[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  // The thumbnail that opened the lightbox, so focus can go back to it.
  const openerRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpenIndex(null);
    openerRef.current?.focus();
  }, []);
  const move = useCallback(
    (delta: number) =>
      setOpenIndex((current) => {
        if (current === null) return null;
        return (current + delta + photos.length) % photos.length;
      }),
    [photos.length],
  );

  useEffect(() => {
    if (openIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key === "ArrowRight") move(1);
      if (event.key === "ArrowLeft") move(-1);
      if (event.key !== "Tab") return;

      // Trap focus. Same pattern as the mobile menu: Tab from the last
      // control wraps to the first, Shift+Tab from the first wraps to the
      // last, so keyboard focus can never wander into the page behind.
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
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
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [openIndex, close, move]);

  const active = openIndex === null ? null : photos[openIndex];

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {photos.map((photo, index) => (
          <Reveal as="li" key={photo.id} delay={Math.min(index, 12) * 80}>
            <button
              type="button"
              onClick={(event) => {
                openerRef.current = event.currentTarget;
                setOpenIndex(index);
              }}
              className="group relative block aspect-square w-full overflow-hidden rounded-xl border border-brand-line bg-brand-paper-200 shadow-soft"
            >
              <Image
                src={photo.publicUrl}
                alt={
                  photo.caption ??
                  `Photograph from the wedding, uploaded by ${photo.uploaderName ?? "a guest"}`
                }
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-500 ease-expo group-hover:scale-105"
              />
              <span className="sr-only">Open larger view</span>
            </button>
          </Reveal>
        ))}
      </ul>

      {active ? (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={active.caption ?? "Photograph"}
          className="on-ink fixed inset-0 z-50 flex flex-col bg-brand-ink/95 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
            <p className="min-w-0 truncate text-sm text-brand-paper/70">
              {openIndex !== null ? `${openIndex + 1} of ${photos.length}` : null}
              {active.uploaderName ? ` · ${active.uploaderName}` : null}
            </p>

            <div className="flex items-center gap-2">
              <a
                href={active.publicUrl}
                download
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/25 px-4 text-xs font-semibold text-brand-paper transition-colors duration-200 hover:border-brand-plum-300"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download
              </a>
              <button
                type="button"
                onClick={close}
                autoFocus
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-brand-paper"
              >
                <X className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Close</span>
              </button>
            </div>
          </div>

          <div className="relative flex-1 p-4">
            <Image
              src={active.publicUrl}
              alt={active.caption ?? "Photograph from the wedding"}
              fill
              sizes="100vw"
              className="object-contain p-2"
              priority
            />
          </div>

          {photos.length > 1 ? (
            <div className="flex items-center justify-between px-4 pb-5">
              <button
                type="button"
                onClick={() => move(-1)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-brand-paper"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Previous photograph</span>
              </button>

              {active.caption ? (
                <p className="mx-4 min-w-0 flex-1 truncate text-center text-sm text-brand-paper/70">
                  {active.caption}
                </p>
              ) : (
                <span className="flex-1" />
              )}

              <button
                type="button"
                onClick={() => move(1)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-brand-paper"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Next photograph</span>
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
