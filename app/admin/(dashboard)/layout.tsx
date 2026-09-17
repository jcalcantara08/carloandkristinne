import type { Metadata } from "next";
import { Suspense } from "react";
import { LogOut } from "lucide-react";

import { requireAuth } from "@/lib/admin-guard";
import { signOut } from "@/app/admin/login/actions";
import { Monogram } from "@/components/Monogram";
import { isDatabaseConfigured } from "@/lib/store";
import { AdminNav } from "@/app/admin/(dashboard)/admin-nav";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

/**
 * The dashboard frame: a side panel with the section list on the left, the
 * page on the right. On phones the panel becomes a strip across the top.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // The gate. Middleware only redirects; this is what actually protects the page.
  await requireAuth();

  return (
    <div className="container py-8 lg:py-10">
      <div className="lg:grid lg:grid-cols-[15rem_1fr] lg:gap-10">
        {/* --- The side panel --- */}
        <aside className="mb-6 border-b border-brand-line pb-6 lg:mb-0 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
          <div className="lg:sticky lg:top-24">
            <div className="flex items-center gap-3">
              <Monogram size="sm" />
              <div className="min-w-0">
                <p className="eyebrow">Dashboard</p>
                <p className="mt-0.5 truncate font-display text-lg text-brand-ink">Kristinne &amp; Carlo</p>
              </div>
            </div>

            <div className="mt-6">
              {/* The nav reads the URL to mark the current section. */}
              <Suspense fallback={null}>
                <AdminNav />
              </Suspense>
            </div>

            <form action={signOut} className="mt-6 border-t border-brand-line pt-5">
              <button
                type="submit"
                className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3.5 text-sm text-brand-ink/70 transition-colors duration-200 hover:bg-brand-paper-200 hover:text-brand-ink"
              >
                <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
                Sign out
              </button>
            </form>
          </div>
        </aside>

        {/* --- The page --- */}
        <div className="min-w-0">
          {!isDatabaseConfigured() ? (
            <div className="mb-6 rounded-xl border border-brand-plum-600/50 bg-brand-plum-600/10 px-4 py-3 text-sm text-brand-plum-600">
              <p className="font-medium">The database is not connected yet.</p>
              <p className="mt-1 text-brand-ink/70">
                Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, then redeploy. Until
                then, replies, messages and uploads cannot be saved.
              </p>
            </div>
          ) : null}

          {children}
        </div>
      </div>
    </div>
  );
}
