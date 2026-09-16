import type { Metadata } from "next";
import { CalendarCheck, Users, Utensils } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Card } from "@/components/ui/Card";
import { RsvpForm } from "@/components/forms/RsvpForm";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";
import { getContent } from "@/lib/content";
import { WEDDING_DAY } from "@/lib/constants";

export const metadata: Metadata = pageMeta({
  title: "RSVP",
  description:
    "Let Carlo and Kristinne know whether you can make it on 17 October 2026. Please reply by 30 September 2026.",
  path: "/rsvp",
});

const WHY_ICONS = [Users, Utensils, CalendarCheck];

export default async function RsvpPage() {
  const { rsvp } = await getContent();

  return (
    <>
      <PageHeader
        eyebrow={rsvp.deadlineLabel ? `Please reply by ${rsvp.deadlineLabel}` : "Please reply"}
        title={rsvp.title}
        intro={rsvp.intro ? <p>{rsvp.intro}</p> : undefined}
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
                      <Icon className="h-5 w-5 text-brand-steel-500" aria-hidden="true" />
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
              <div className="mt-5 rounded-2xl border border-brand-steel-600/30 bg-brand-steel-600/5 p-6 text-center">
                <p className="eyebrow">{rsvp.dayEyebrow}</p>
                <p className="mt-3 font-display text-display-md">{WEDDING_DAY.dateShort}</p>
                {rsvp.dayNote ? <p className="mt-2 text-sm text-brand-ink/65">{rsvp.dayNote}</p> : null}
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
