import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};
import { Monogram } from "@/components/Monogram";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] items-center bg-brand-paper-200">
      <div className="container py-20 text-center">
        <Monogram size="lg" className="mx-auto" />
        <p className="eyebrow mt-8">Nothing here</p>
        <h1 className="mt-5 text-display-xl">This page is not part of the wedding</h1>
        <div aria-hidden="true" className="rule mx-auto mt-7" />
        <p className="prose-body mx-auto mt-7">
          The link may be old, or slightly mistyped. Everything a guest needs is one of the two
          buttons below.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-primary w-full sm:w-auto">
            Back to the start
          </Link>
          <Link href="/details" className="btn-outline w-full sm:w-auto">
            The details
          </Link>
        </div>
      </div>
    </section>
  );
}
