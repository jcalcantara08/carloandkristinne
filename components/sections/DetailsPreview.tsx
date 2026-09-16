import Link from "next/link";
import { MapPin, Clock, Info } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Section, SectionHeading } from "@/components/Section";
import { Card } from "@/components/ui/Card";
import { Value } from "@/components/Pending";
import { SHOW_PENDING, VENUES } from "@/lib/constants";

export function DetailsPreview() {
  return (
    <Section id="details">
      <div className="container">
        <SectionHeading
          eyebrow="Where and when"
          title="One town, one afternoon, two rooms"
          intro={
            <p>
              Everything happens in Rosario, Cavite, on a single Saturday. The ceremony is indoors
              and so is the reception, which in October is not a small thing.
            </p>
          }
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {VENUES.map((venue, index) => (
            <Reveal key={venue.key} delay={index * 80}>
              <Card hover className="h-full">
                <p className="eyebrow">{venue.label}</p>

                {!venue.name.pending || SHOW_PENDING ? (
                  <h3 className="mt-4 text-display-md">
                    <Value of={venue.name} label="Venue to be confirmed" />
                  </h3>
                ) : null}

                <dl className="mt-6 space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <dt className="sr-only">Time</dt>
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-steel-500" aria-hidden="true" />
                    <dd className="text-brand-ink/75">{venue.time}</dd>
                  </div>
                  <div className="flex items-start gap-3">
                    <dt className="sr-only">Address</dt>
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-steel-500" aria-hidden="true" />
                    <dd className="text-brand-ink/75">
                      <Value of={venue.address} label="Address to be confirmed" />
                    </dd>
                  </div>
                  <div className="flex items-start gap-3">
                    <dt className="sr-only">Note</dt>
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-steel-500" aria-hidden="true" />
                    <dd className="leading-relaxed text-brand-ink/65">{venue.note}</dd>
                  </div>
                </dl>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal delay={160}>
          <div className="mt-10 text-center">
            <Link href="/details" className="btn-outline">
              Maps, dress code and questions
            </Link>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
