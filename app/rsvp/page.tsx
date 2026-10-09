import type { Metadata } from "next";
import Link from "next/link";
import { CalendarCheck, Users, Utensils } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Section, SectionHeading } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Card } from "@/components/ui/Card";
import { RsvpForm } from "@/components/forms/RsvpForm";
import { VenueQr } from "@/components/VenueQr";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";
import { getContent } from "@/lib/content";
import { listGuestList } from "@/lib/store";
import { RSVP, WEDDING_DAY } from "@/lib/constants";

export const metadata: Metadata = pageMeta({
  title: "RSVP",
  description: `Let Carlo and Kristinne know whether you can make it on ${WEDDING_DAY.dateLong}. Please reply by ${RSVP.deadlineLabel}.`,
  path: "/rsvp",
});

const WHY_ICONS = [Users, Utensils, CalendarCheck];

export default async function RsvpPage() {
  const [{ rsvp, details }, guestList] = await Promise.all([getContent(), listGuestList()]);
  const peopleOnList = guestList.reduce((sum, entry) => sum + entry.seats, 0);
  const mapped = details.venues.filter((venue) => venue.mapUrl);

  return (
    <>
      <PageHeader
        eyebrow={rsvp.deadlineLabel ? `Please reply by ${rsvp.deadlineLabel}` : "Please reply"}
        title={rsvp.title}
        intro={rsvp.intro ? <p>{rsvp.intro}</p> : undefined}
        photos={rsvp.headerPhotos}
      />

      <Section>
        <div className="container grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-7">
            <Card className="p-6 sm:p-8">
              <RsvpForm />
            </Card>
          </Reveal>

          <div className="lg:col-span-5">
            <ul className="space-y-5">
              {rsvp.why.map((item, index) => {
                const Icon = WHY_ICONS[index] ?? CalendarCheck;
                return (
                  <Reveal as="li" key={item.title} delay={index * 80}>
                    <Card>
                      <Icon className="h-5 w-5 text-brand-plum-500" aria-hidden="true" />
                      <h2 className="mt-4 text-lg font-medium text-brand-ink">{item.title}</h2>
                      <p className="mt-2 text-sm leading-relaxed text-brand-ink/70">
                        {index === rsvp.why.length - 1 && rsvp.deadlineLabel
                          ? `Reply by ${rsvp.deadlineLabel}. ${item.body}`
                          : item.body}
                      </p>
                    </Card>
                  </Reveal>
                );
              })}
            </ul>

            <Reveal delay={240}>
              <div className="mt-5 rounded-2xl border border-brand-plum-600/30 bg-brand-plum-600/5 p-6 text-center">
                <p className="eyebrow">{rsvp.dayEyebrow}</p>
                <p className="mt-3 font-display text-display-md">{WEDDING_DAY.dateShort}</p>
                {rsvp.dayNote ? <p className="mt-2 text-sm text-brand-ink/65">{rsvp.dayNote}</p> : null}
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* --- Getting there. The couple asked for the map codes here, as on the printed cards. --- */}
      {mapped.length > 0 ? (
        <Section on="tint">
          <div className="container">
            <SectionHeading eyebrow={rsvp.mapsEyebrow} title={rsvp.mapsTitle} />
            {rsvp.mapsIntro ? (
              <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-brand-ink/70">{rsvp.mapsIntro}</p>
            ) : null}

            <ul className="mx-auto mt-10 grid max-w-3xl gap-5 sm:grid-cols-2">
              {mapped.map((venue, index) => (
                <Reveal as="li" key={venue.label} delay={index * 80}>
                  <Card className="h-full text-center">
                    <p className="eyebrow">{venue.label}</p>
                    {venue.name ? <h3 className="mt-3 text-display-md">{venue.name}</h3> : null}
                    {venue.time ? <p className="mt-1 text-sm text-brand-ink/70">{venue.time}</p> : null}
                    <div className="mt-5">
                      <VenueQr url={venue.mapUrl} venueName={venue.name || venue.label} />
                    </div>
                    <a
                      href={venue.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline mt-5 w-full"
                    >
                      Open in Maps
                    </a>
                  </Card>
                </Reveal>
              ))}
            </ul>
          </div>
        </Section>
      ) : null}

      {/* --- The guest list has its own page (Erick, 6 October 2026). --- */}
      <Section>
        <div className="container text-center">
          <p className="eyebrow">{rsvp.listEyebrow}</p>
          <p className="mt-3 text-sm text-brand-ink/70">
            {peopleOnList > 0 ? `${peopleOnList} ${peopleOnList === 1 ? "person has" : "people have"} said yes so far.` : null}
          </p>
          <Link href="/guest-list" className="btn-outline mt-5">
            See the guest list
          </Link>
        </div>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "RSVP", path: "/rsvp" },
            ]),
          ),
        }}
      />
    </>
  );
}
