import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";
import { CONTACT, COUPLE, WEDDING_DAY } from "@/lib/constants";

export const metadata: Metadata = pageMeta({
  title: "Privacy",
  description:
    "What this website collects when you reply, leave a message or upload a photograph, who can see it, and how to have it changed or removed.",
  path: "/privacy",
});

/**
 * A plain statement of what the site actually does with what guests give
 * it. Every claim here is checked against the code rather than the other way
 * round: the RSVP action, the guestbook action, the gallery action and the
 * store are the source of truth, and this page must never promise more or
 * less than they do.
 *
 * It exists because the RSVP form asks for dietary needs, which includes
 * allergies, and that is health information. A hundred guests handing that
 * over deserve one page that says where it goes.
 */

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: "Who this is",
    body: (
      <p>
        This is the personal wedding website of {COUPLE.groom.fullName} and{" "}
        {COUPLE.bride.fullName}. It is run for them by {CONTACT.pointOfContact.name}, who built it
        and is also the best man. It is not a business and it does not sell anything.
      </p>
    ),
  },
  {
    title: "What you give us, and why",
    body: (
      <>
        <p>
          <strong>When you reply to the invitation</strong> we ask for your name, whether you are
          coming, how many people are in your party and their names, and optionally your email
          address, mobile number, anything you cannot eat, a song request and a note. We need this
          to plan seats, to give the caterer an accurate count and any allergies, and to reach you
          if a detail changes.
        </p>
        <p className="mt-4">
          <strong>When you leave a message</strong> we keep your name and the message.
        </p>
        <p className="mt-4">
          <strong>When you upload a photograph</strong> we keep the photograph itself, and
          optionally your name and a caption.
        </p>
      </>
    ),
  },
  {
    title: "Who can see it",
    body: (
      <>
        <p>
          Replies are private. Only {COUPLE.groom.shortName}, {COUPLE.bride.firstName} and{" "}
          {CONTACT.pointOfContact.name} can see them, and the dietary notes go to the caterer as a
          headcount list. Nobody else can see who replied.
        </p>
        <p className="mt-4">
          Messages and photographs are checked by the couple first, and once they approve one it
          is <strong>public</strong>. Anyone with the address of this site can read an approved
          message, and can view and download an approved photograph at full size. That is by
          design, so that everyone can keep the pictures from the day. Please do not upload a
          photograph you would not want shared.
        </p>
      </>
    ),
  },
  {
    title: "Where it is kept",
    body: (
      <p>
        Everything is stored with a database and file hosting provider on the couple&rsquo;s
        account. Nothing you give us is sold, shared with advertisers, or used for anything other
        than the wedding on {WEDDING_DAY.dateLong}.
      </p>
    ),
  },
  {
    title: "Cookies and tracking",
    body: (
      <p>
        This site sets no tracking cookies and runs no analytics. The only cookie it ever sets is
        a sign-in cookie for the couple&rsquo;s private dashboard, which you will never receive as
        a guest.
      </p>
    ),
  },
  {
    title: "Changing or removing what you gave us",
    body: (
      <p>
        Ask {CONTACT.pointOfContact.name}. He can correct a reply, take a message or a photograph
        down, or delete what you gave us entirely. His details are on the{" "}
        <Link href="/details" className="underline decoration-brand-plum-500 decoration-2 underline-offset-4">
          Details page
        </Link>
        .
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="The small print"
        title="What we do with what you tell us"
        intro={
          <p>
            Short, honest, and written in plain English, because you are a guest and not a
            customer.
          </p>
        }
      />

      <Section>
        <div className="container">
          <div className="mx-auto max-w-2xl space-y-10">
            {SECTIONS.map((section, index) => (
              <Reveal key={section.title} delay={Math.min(index, 6) * 80}>
                <h2 className="text-display-md">{section.title}</h2>
                <div className="prose-body mt-4">{section.body}</div>
              </Reveal>
            ))}

            <Reveal delay={480}>
              <p className="text-sm text-brand-ink/60">
                Last reviewed 16 September 2026. If anything on this page stops being true, it
                gets changed here first.
              </p>
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
              { name: "Privacy", path: "/privacy" },
            ]),
          ),
        }}
      />
    </>
  );
}

