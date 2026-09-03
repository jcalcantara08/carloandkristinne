import { SITE } from "@/lib/constants";

/**
 * The hashtag marquee. Decorative, edge-masked, paused on hover, and it
 * moves left to right in reading order. The text is aria-hidden and the
 * hashtag is announced once, in the visually hidden paragraph.
 */
export function Marquee() {
  const items = Array.from({ length: 8 }, (_, index) => index);

  return (
    <div className="relative overflow-hidden border-y border-brand-line py-5">
      <p className="sr-only">Our wedding hashtag is {SITE.hashtag}</p>
      <div className="marquee-mask" aria-hidden="true">
        <div className="marquee-track flex w-max animate-marquee items-center gap-10">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center gap-10">
              {items.map((index) => (
                <span key={index} className="flex items-center gap-10">
                  <span className="font-display text-lg tracking-wide text-brand-ink/70">
                    {SITE.hashtag}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-brand-violet-500" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
