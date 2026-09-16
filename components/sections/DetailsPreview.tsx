import Link from "next/link";
import { MapPin, Clock, Info } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Section, SectionHeading } from "@/components/Section";
import { Card } from "@/components/ui/Card";
import { getContent } from "@/lib/content";

export async function DetailsPreview() {
  const { home, details } = await getContent();
  return (
    <Section id="details">
      <div className="container">
        <SectionHeading
          eyebrow={home.detailsEyebrow}
          title={home.detailsTitle}
          intro={home.detailsIntro ? <p>{home.detailsIntro}</p> : undefined}
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {details.venues.map((venue, index) => (
            <Reveal key={venue.label} delay={index * 80}>
              <Card hover className="h-full">
                <p className="eyebrow">{venue.label}</p>

                {venue.name ? <h3 className="mt-4 text-display-md">{venue.name}</h3> : null}

                <dl className="mt-6 space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <dt className="sr-only">Time</dt>
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-steel-500" aria-hidden="true" />
                    <dd className="text-brand-ink/75">{venue.time}</dd>
                  </div>
                  {venue.address ? (
                    <div className="flex items-start gap-3">
                      <dt className="sr-only">Address</dt>
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-steel-500" aria-hidden="true" />
                      <dd className="text-brand-ink/75">{venue.address}</dd>
                    </div>
                  ) : null}
                  {venue.note ? (
                    <div className="flex items-start gap-3">
                      <dt className="sr-only">Note</dt>
                      <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-steel-500" aria-hidden="true" />
                      <dd className="leading-relaxed text-brand-ink/65">{venue.note}</dd>
                    </div>
                  ) : null}
                </dl>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal delay={160}>
          <div className="mt-10 text-center">
            <Link href="/details" className="btn-outline">
              {home.detailsLink || "Maps, dress code and questions"}
            </Link>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
