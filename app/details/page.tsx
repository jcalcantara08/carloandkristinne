import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Info, MapPin, Umbrella, Car, UserRound } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Section, SectionHeading } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Card } from "@/components/ui/Card";
import { DressCode } from "@/components/sections/DressCode";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { breadcrumbJsonLd, faqJsonLd, pageMeta } from "@/lib/seo";
import { getContent } from "@/lib/content";
import { WEDDING_DAY } from "@/lib/constants";

export const metadata: Metadata = pageMeta({
  title: "Details",
  description:
    "Ceremony and reception details, dress code, parking, the weather plan, and answers to the questions guests ask most.",
  path: "/details",
});

const PRACTICAL_ICONS = [Car, Umbrella, UserRound];

/**
 * Every word here comes from the site document (Edit the website, Details).
 * A venue name, address or map link that is still empty is simply not shown.
 */
export default async function DetailsPage() {
  const { details } = await getContent();

  return (
    <>
      <PageHeader
        eyebrow={details.eyebrow}
        title={details.title}
        intro={details.intro ? <p>{details.intro}</p> : undefined}
        photos={details.headerPhotos}
      >
        <Link href="/rsvp" className="btn-primary w-full sm:w-auto">
          RSVP
        </Link>
        <Link href="/programme" className="btn-outline w-full sm:w-auto">
          See the programme
        </Link>
      </PageHeader>

      {/* --- Venues --- */}
      <Section id="venues">
        <div className="container">
          <SectionHeading
            eyebrow={details.venuesEyebrow}
            title={details.venuesTitle}
            intro={details.venuesIntro ? <p>{details.venuesIntro}</p> : undefined}
          />

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {details.venues.map((venue, index) => (
              <Reveal key={venue.label} delay={index * 80}>
                <Card hover className="h-full">
                  <p className="eyebrow">{venue.label}</p>

                  {/* The venue name is the heading when it is known. When it
                      is not, the label above already names the event, and an
                      empty heading would be worse than none. */}
                  {venue.name ? <h2 className="mt-4 text-display-md">{venue.name}</h2> : null}

                  <dl className="mt-6 space-y-4 text-sm">
                    {venue.time ? (
                      <div className="flex items-start gap-3">
                        <dt className="sr-only">Time</dt>
                        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-plum-500" aria-hidden="true" />
                        <dd className="text-brand-ink/80">{venue.time}</dd>
                      </div>
                    ) : null}

                    <div className="flex items-start gap-3">
                      <dt className="sr-only">Address</dt>
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-plum-500" aria-hidden="true" />
                      <dd className="text-brand-ink/80">
                        {/* The printed address carries its own town; the province line is only for a venue with no address yet. */}
                        {venue.address ? (
                          <span>{venue.address}</span>
                        ) : (
                          <span className="block">{WEDDING_DAY.province}</span>
                        )}
                      </dd>
                    </div>

                    {venue.note ? (
                      <div className="flex items-start gap-3">
                        <dt className="sr-only">Notes</dt>
                        <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-plum-500" aria-hidden="true" />
                        <dd className="leading-relaxed text-brand-ink/65">{venue.note}</dd>
                      </div>
                    ) : null}
                  </dl>

                  {venue.mapUrl ? (
                    <div className="mt-6 border-t border-brand-line pt-5">
                      <a
                        href={venue.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline w-full"
                      >
                        Open in Maps
                      </a>
                    </div>
                  ) : null}
                </Card>
              </Reveal>
            ))}
          </div>

          {details.officiantLine ? (
            <Reveal delay={160}>
              <p className="mt-8 text-center text-sm text-brand-ink/60">{details.officiantLine}</p>
            </Reveal>
          ) : null}
        </div>
      </Section>

      {/* --- Dress code. The palette, stated plainly. --- */}
      <DressCode />

      {/* --- Practical --- */}
      <Section>
        <div className="container">
          <SectionHeading eyebrow={details.practicalEyebrow} title={details.practicalTitle} />

          {details.practical.length > 0 ? (
            <ul className="mt-12 grid gap-5 sm:grid-cols-3">
              {details.practical.map((item, index) => {
                const Icon = PRACTICAL_ICONS[index] ?? Info;
                return (
                  <Reveal as="li" key={item.title} delay={index * 80}>
                    <Card hover className="h-full">
                      <Icon className="h-5 w-5 text-brand-plum-500" aria-hidden="true" />
                      <h3 className="mt-4 text-display-md">{item.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-brand-ink/75">{item.body}</p>
                    </Card>
                  </Reveal>
                );
              })}
            </ul>
          ) : null}

          {details.contactName ? (
            <Reveal delay={240}>
              <Card className="mx-auto mt-8 max-w-2xl text-center">
                <p className="eyebrow">{details.contactEyebrow}</p>
                <p className="mt-3 font-display text-display-md">{details.contactName}</p>
                {details.contactRole ? (
                  <p className="mt-1 text-sm text-brand-ink/60">{details.contactRole}</p>
                ) : null}
                {details.contactEmail || details.contactPhone ? (
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm">
                    {details.contactEmail ? (
                      <a
                        className="text-brand-ink/80 underline decoration-brand-plum-500 decoration-2 underline-offset-4"
                        href={`mailto:${details.contactEmail}`}
                      >
                        {details.contactEmail}
                      </a>
                    ) : null}
                    {details.contactPhone ? (
                      <a
                        className="text-brand-ink/80 underline decoration-brand-plum-500 decoration-2 underline-offset-4"
                        href={`tel:${details.contactPhone}`}
                      >
                        {details.contactPhone}
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </Card>
            </Reveal>
          ) : null}
        </div>
      </Section>

      {/* --- FAQ --- */}
      {details.faq.length > 0 ? (
        <Section id="faq">
          <div className="container">
            <SectionHeading
              eyebrow={details.faqEyebrow}
              title={details.faqTitle}
              intro={details.faqIntro ? <p>{details.faqIntro}</p> : undefined}
            />

            <div className="mx-auto mt-12 max-w-3xl divide-y divide-brand-line overflow-hidden rounded-2xl border border-brand-line bg-brand-paper-200">
              {details.faq.map((item, index) => (
                <Reveal key={item.q} delay={Math.min(index, 6) * 80}>
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 text-left text-base font-medium text-brand-ink transition-colors duration-200 hover:bg-brand-paper-200 sm:px-6">
                      <span>{item.q}</span>
                      <span
                        aria-hidden="true"
                        className="relative h-4 w-4 shrink-0 text-brand-plum-500"
                      >
                        <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-current" />
                        <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-current transition-transform duration-300 ease-expo group-open:scale-y-0" />
                      </span>
                    </summary>
                    <div className="whitespace-pre-line px-5 pb-6 text-sm leading-relaxed text-brand-ink/75 sm:px-6">
                      {item.a}
                    </div>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </Section>
      ) : null}

      <CtaBanner title={details.ctaTitle} body={details.ctaBody} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(details.faq)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Details", path: "/details" },
            ]),
          ),
        }}
      />
    </>
  );
}
