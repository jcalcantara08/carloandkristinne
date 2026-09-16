import type { Metadata } from "next";
import { CalendarCheck, Users, Utensils } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Card } from "@/components/ui/Card";
import { RsvpForm } from "@/components/forms/RsvpForm";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";
import { RSVP, WEDDING_DAY } from "@/lib/constants";

export const metadata: Metadata = pageMeta({
  title: "RSVP",
  description:
    "Let Carlo and Kristinne know whether you can make it on 17 October 2026. Please reply by 30 September 2026.",
  path: "/rsvp",
});

const WHY = [
  {
    icon: Users,
    title: "The list is 100",
    body: "Every seat is already accounted for, so please count only the people named on your invitation.",
  },
  {
    icon: Utensils,
    title: "The caterer needs a number",
    body: "The final headcount goes to the kitchen about two weeks before the day, so an early reply is a real help.",
  },
  {
    icon: CalendarCheck,
    title: "It takes two minutes",
    body: `Reply by ${RSVP.deadlineLabel}. If your plans change afterwards, message Erick rather than filling this in again.`,
  },
];

export default function RsvpPage() {
  return (
    <>
      <PageHeader
        eyebrow={`Please reply by ${RSVP.deadlineLabel}`}
        title="Are you coming?"
        intro={
          <p>
            One short form, two minutes, and then Carlo and Kristinne can stop refreshing their phones.
          </p>
        }
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
              {WHY.map((item, index) => (
                <Reveal as="li" key={item.title} delay={index * 80}>
                  <Card>
                    <item.icon className="h-5 w-5 text-brand-steel-500" aria-hidden="true" />
                    <h2 className="mt-4 text-lg font-medium text-brand-ink">{item.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-brand-ink/70">{item.body}</p>
                  </Card>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={240}>
              <div className="mt-5 rounded-2xl border border-brand-steel-600/30 bg-brand-steel-600/5 p-6 text-center">
                <p className="eyebrow">The day itself</p>
                <p className="mt-3 font-display text-display-md">{WEDDING_DAY.dateShort}</p>
                <p className="mt-2 text-sm text-brand-ink/65">
                  Ceremony at {WEDDING_DAY.ceremonyTime}. Be seated by 3:30 PM.
                </p>
              </div>
            </Reveal>
          </div>
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
