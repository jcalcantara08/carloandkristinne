import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { Monogram } from "@/components/Monogram";
import { WEDDING_DAY } from "@/lib/constants";
import { getContent } from "@/lib/content";

/**
 * The closing CTA, and the single dark band on the page.
 *
 * This is the one place black appears as a field rather than as type. It
 * lands at the very bottom, after the reader has been on paper the whole
 * way down, so it reads as the evening closing in rather than as gloom.
 * There is never a second dark band on a page: two stops being punctuation.
 */
export async function CtaBanner({
  title,
  body,
  primary = { href: "/rsvp", label: "Send your RSVP" },
  secondary = { href: "/details", label: "Read the details" },
}: {
  title?: string;
  body?: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  const { home, rsvp } = await getContent();
  const heading = title ?? home.ctaTitle;
  const text = body ?? home.ctaBody;
  return (
    <section className="section on-ink relative overflow-hidden">
      {/* A soft bloom, so the black has depth rather than sitting flat. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_0%,rgba(74,105,170,0.35),transparent_70%)]"
      />

      <div className="container relative text-center">
        <Reveal>
          <Monogram size="md" on="ink" />
        </Reveal>

        <Reveal delay={80}>
          <p className="eyebrow mt-6">{WEDDING_DAY.dateShort}</p>
          <h2 className="mt-4 text-display-lg">{heading}</h2>
          <div aria-hidden="true" className="rule mx-auto mt-6" />
          {text ? <p className="prose-body mx-auto mt-6">{text}</p> : null}
          {rsvp.deadlineLabel ? (
            <p className="mt-3 text-sm font-medium text-brand-paper/70">
              {rsvp.closingLine || "Kindly reply by"} {rsvp.deadlineLabel}.
            </p>
          ) : null}
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={primary.href} className="btn-primary-inverse w-full sm:w-auto">
              {primary.label}
            </Link>
            <Link href={secondary.href} className="btn-outline-inverse w-full sm:w-auto">
              {secondary.label}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
