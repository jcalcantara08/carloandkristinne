import { Monogram } from "@/components/Monogram";

/**
 * The loading state belongs here and only here.
 *
 * A loading.tsx wraps its route in a Suspense boundary, and Next then streams
 * the fallback first and swaps the real content in with JavaScript. That is
 * exactly right for the admin dashboard, which is dynamic and reads Supabase
 * on every request.
 *
 * It was originally at the root of app/, which put a boundary around every
 * public page too. Those pages are statically prerendered and fetch nothing
 * at request time, so the only effect was that each of them shipped a
 * spinner as its first paint and deferred the real content to a client-side
 * swap. That hurts LCP and puts the actual copy behind JavaScript for
 * anything that does not run it. See handoff.md section 8.
 */
export default function AdminLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-live="polite">
      <div className="text-center">
        <Monogram size="md" className="mx-auto" />
        <p className="mt-5 text-xs font-semibold uppercase tracking-eyebrow text-brand-ink/60">
          Loading
        </p>
      </div>
    </div>
  );
}
