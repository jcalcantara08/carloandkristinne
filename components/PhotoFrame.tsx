import Image from "next/image";
import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Every image on the site goes through here.
 *
 * There are no wedding photographs yet, so the placeholder is not an
 * afterthought: it is what most of the site renders today. When `src` is
 * missing it draws a soft tone-matched wash, a hairline border and a small
 * "Photo coming soon" tag, so an empty frame reads as intentional rather
 * than broken. `tone` cycles so two adjacent placeholders never match.
 */

const ASPECTS = {
  "4/3": "aspect-[4/3]",
  "4/5": "aspect-[4/5]",
  "3/4": "aspect-[3/4]",
  "1/1": "aspect-square",
  "21/9": "aspect-[21/9]",
  "16/9": "aspect-video",
} as const;

// Pale washes on paper, cycling blue to violet.
const TONES = [
  "bg-[radial-gradient(120%_120%_at_20%_10%,rgba(58,85,217,0.16),rgba(251,250,255,1)_66%)]",
  "bg-[radial-gradient(120%_120%_at_80%_20%,rgba(139,63,212,0.15),rgba(251,250,255,1)_66%)]",
  "bg-[radial-gradient(120%_120%_at_50%_90%,rgba(92,116,232,0.14),rgba(251,250,255,1)_64%)]",
  "bg-[radial-gradient(120%_120%_at_10%_80%,rgba(168,85,247,0.13),rgba(251,250,255,1)_66%)]",
] as const;

export type PhotoFrameProps = {
  src?: string | null;
  alt: string;
  aspect?: keyof typeof ASPECTS;
  /** Cycles the placeholder wash. Pass the grid index. */
  tone?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
  caption?: string | null;
  /** The label shown on an empty frame. */
  placeholderLabel?: string;
};

export function PhotoFrame({
  src,
  alt,
  aspect = "4/3",
  tone = 0,
  priority = false,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  className,
  caption,
  placeholderLabel = "Photo coming soon",
}: PhotoFrameProps) {
  return (
    <figure className={cn("group", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-brand-line bg-brand-paper-200 shadow-soft",
          ASPECTS[aspect],
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover transition-transform duration-500 ease-expo group-hover:scale-105"
          />
        ) : (
          <>
            <div aria-hidden="true" className={cn("absolute inset-0", TONES[tone % TONES.length])} />
            {/* A whisper of grain, so the wash is not a flat fill. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.35] mix-blend-multiply"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E\")",
              }}
            />
            <div className="absolute inset-0 grid place-items-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-line-strong bg-brand-paper-100/85 px-3 py-1.5 text-[0.7rem] font-medium uppercase tracking-wider text-brand-ink/60 backdrop-blur-sm">
                <Camera className="h-3.5 w-3.5" aria-hidden="true" />
                {placeholderLabel}
              </span>
            </div>
          </>
        )}
      </div>
      {caption ? (
        <figcaption className="mt-3 text-xs leading-relaxed text-brand-ink/60">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
