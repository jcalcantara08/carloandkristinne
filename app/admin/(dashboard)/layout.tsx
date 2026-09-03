import type { Metadata } from "next";
import Link from "next/link";
import { LogOut } from "lucide-react";

import { requireAuth } from "@/lib/admin-guard";
import { signOut } from "@/app/admin/login/actions";
import { Monogram } from "@/components/Monogram";
import { isDatabaseConfigured } from "@/lib/store";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

const ADMIN_NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/rsvps", label: "Replies" },
  { href: "/admin/guestbook", label: "Messages" },
  { href: "/admin/photos", label: "Photographs" },
  { href: "/admin/manual", label: "Manual" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // The gate. Middleware only redirects; this is what actually protects the page.
  await requireAuth();

  return (
    <div className="container py-10">
      <header className="flex flex-col gap-5 border-b border-brand-line pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Monogram size="sm" />
          <div>
            <p className="eyebrow">Command centre</p>
            <h1 className="mt-1 text-display-md">Carlo &amp; Kristinne</h1>
          </div>
        </div>

        <form action={signOut}>
          <button type="submit" className="btn-outline px-5 py-2.5 text-xs">
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </button>
        </form>
      </header>

      <nav aria-label="Admin" className="mt-6 overflow-x-auto">
        <ul className="flex min-w-max gap-2">
          {ADMIN_NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="inline-flex min-h-[44px] items-center rounded-full border border-brand-line px-4 text-sm text-brand-ink/75 transition-colors duration-200 hover:border-brand-line-strong hover:text-brand-ink"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {!isDatabaseConfigured() ? (
        <div className="mt-6 rounded-xl border border-brand-violet-600/50 bg-brand-violet-600/10 px-4 py-3 text-sm text-brand-violet-600">
          <p className="font-medium">The database is not connected yet.</p>
          <p className="mt-1 text-brand-ink/70">
            Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, then redeploy. Until then,
            replies, messages and uploads cannot be saved.
          </p>
        </div>
      ) : null}

      <div className="mt-8">{children}</div>
    </div>
  );
}
