"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Monogram } from "@/components/Monogram";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // The digest is safe to log. The message and stack are not shown to guests.
    console.error("[error boundary]", error.digest ?? error.message);
  }, [error]);

  return (
    <section className="relative flex min-h-[70vh] items-center">
      <div className="container py-20 text-center">
        <Monogram size="lg" className="mx-auto" />
        <p className="eyebrow mt-8">Something broke</p>
        <h1 className="mt-5 text-display-xl">That did not work</h1>
        <div aria-hidden="true" className="rule mx-auto mt-7" />
        <p className="prose-body mx-auto mt-7">
          Not your fault. Try again, and if it keeps happening, tell Erick what you were doing when
          it did.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button type="button" onClick={reset} className="btn-primary w-full sm:w-auto">
            Try again
          </button>
          <Link href="/" className="btn-outline w-full sm:w-auto">
            Back to the start
          </Link>
        </div>
      </div>
    </section>
  );
}
