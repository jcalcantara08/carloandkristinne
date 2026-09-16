import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Info, MapPin, Umbrella, Car, UserRound } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Section, SectionHeading } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Card } from "@/components/ui/Card";
import { PendingChip, Value } from "@/components/Pending";
import { DressCode } from "@/components/sections/DressCode";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { breadcrumbJsonLd, faqJsonLd, pageMeta } from "@/lib/seo";
import { CONTACT, FAQ, OFFICIANT, VENUES, WEDDING_DAY } from "@/lib/constants";

export const metadata: Metadata = pageMeta({
  title: "Details",
  description:
    "Ceremony and reception details, dress code, parking, the weather plan, and answers to the questions guests ask most.",
  path: "/details",
});

const PRACTICAL = [
  {
    icon: Car,
    title: "Parking",
    body: "Parking is included at the reception venue. Church parking will be confirmed closer to the date.",
  },
  {
    icon: Umbrella,
    title: "If it rains",
    body: "October is rainy season, but both the ceremony and the reception are indoors and the reception venue is air-conditioned. Bring an umbrella for the walk between cars and you will be perfectly fine.",
  },
  {
    icon: UserRound,
    title: "Who to ask",
    body: "Erick, the best man and host, is looking after guest questions. Please go to him rather than the couple in the week of the wedding.",
  },
];

export default function DetailsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Everything practical"
        title="The details"
        intro={
          <p>
            One Saturday, one town, and a few things worth knowing before you set your alarm.
          </p>
        }
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
            eyebrow="Where"
            title="Two places, one evening"
            intro={
              <p>
                Both venue names and their exact addresses are still being confirmed with the
                suppliers. They appear here, and on your printed invitation, as soon as they are
                locked. The two are not in the same place, and the reception doors do not open
                until a quarter past seven, so please read the timings below before you plan your
                evening.
              </p>
            }
          />

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {VENUES.map((venue, index) => (
              <Reveal key={venue.key} delay={index * 80}>
                <Card hover className="h-full">
                  <p className="eyebrow">{venue.label}</p>

                  <h2 className="mt-4 text-display-md">
                    <Value of={venue.name} label="Venue to be confirmed" />
                  </h2>

                  <dl className="mt-6 space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <dt className="sr-only">Time</dt>
                      <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-steel-500" aria-hidden="true" />
                      <dd className="text-brand-ink/80">{venue.time}</dd>
                    </div>

                    <div className="flex items-start gap-3">
                      <dt className="sr-only">Address</dt>
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-steel-500" aria-hidden="true" />
                      <dd className="text-brand-ink/80">
                        <Value of={venue.address} label="Address to be confirmed" />
                        <span className="mt-1 block text-brand-ink/60">
                          {WEDDING_DAY.town}, {WEDDING_DAY.province}
                        </span>
                      </dd>
                    </div>

                    <div className="flex items-start gap-3">
                      <dt className="sr-only">Notes</dt>
                      <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-steel-500" aria-hidden="true" />
                      <dd className="leading-relaxed text-brand-ink/65">{venue.note}</dd>
                    </div>
                  </dl>

                  <div className="mt-6 border-t border-brand-line pt-5">
                    {venue.mapUrl.pending ? (
                      <PendingChip label="Map link to come" />
                    ) : (
                      <a
                        href={venue.mapUrl.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline w-full"
                      >
                        Open in Maps
                      </a>
                    )}
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>

          <Reveal delay={160}>
            <p className="mt-8 text-center text-sm text-brand-ink/60">
              The ceremony is by {OFFICIANT.rite}, officiated by {OFFICIANT.name}.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* --- Dress code. The palette, stated plainly. --- */}
      <DressCode />

      {/* --- Practical --- */}
      <Section>
        <div className="container">
          <SectionHeading
            eyebrow="Good to know"
            title="The small print, kindly meant"
          />

          <ul className="mt-12 grid gap-5 sm:grid-cols-3">
            {PRACTICAL.map((item, index) => (
              <Reveal as="li" key={item.title} delay={index * 80}>
                <Card hover className="h-full">
                  <item.icon className="h-5 w-5 text-brand-steel-500" aria-hidden="true" />
                  <h3 className="mt-4 text-display-md">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-brand-ink/75">{item.body}</p>
                </Card>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={240}>
            <Card className="mx-auto mt-8 max-w-2xl text-center">
              <p className="eyebrow">Point of contact</p>
              <p className="mt-3 font-display text-display-md">{CONTACT.pointOfContact.name}</p>
              <p className="mt-1 text-sm text-brand-ink/60">{CONTACT.pointOfContact.role}</p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm">
                {CONTACT.pointOfContact.email.pending ? (
                  <PendingChip label="Email to come" />
                ) : (
                  <a
                    className="text-brand-ink/80 underline decoration-brand-steel-500 decoration-2 underline-offset-4"
                    href={`mailto:${CONTACT.pointOfContact.email.value}`}
                  >
                    {CONTACT.pointOfContact.email.value}
                  </a>
                )}
                {CONTACT.pointOfContact.phone.pending ? (
                  <PendingChip label="Number to come" />
                ) : (
                  <a
                    className="text-brand-ink/80 underline decoration-brand-steel-500 decoration-2 underline-offset-4"
                    href={`tel:${CONTACT.pointOfContact.phone.value}`}
                  >
                    {CONTACT.pointOfContact.phone.value}
                  </a>
                )}
              </div>
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* --- FAQ --- */}
      <Section id="faq">
        <div className="container">
          <SectionHeading
            eyebrow="Questions"
            title="Asked and answered"
            intro={<p>If your question is not answered here, please ask Erick. He would genuinely rather you did.</p>}
          />

          <div className="mx-auto mt-12 max-w-3xl divide-y divide-brand-line overflow-hidden rounded-2xl border border-brand-line bg-brand-paper-200">
            {FAQ.map((item, index) => (
              <Reveal key={item.q} delay={Math.min(index, 6) * 80}>
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 text-left text-base font-medium text-brand-ink transition-colors duration-200 hover:bg-brand-paper-200 sm:px-6">
                    <span>{item.q}</span>
                    <span
                      aria-hidden="true"
                      className="relative h-4 w-4 shrink-0 text-brand-steel-500"
                    >
                      <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-current" />
                      <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-current transition-transform duration-300 ease-expo group-open:scale-y-0" />
                    </span>
                  </summary>
                  <div className="px-5 pb-6 text-sm leading-relaxed text-brand-ink/75 sm:px-6">
                    {item.a}
                  </div>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <CtaBanner />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
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
