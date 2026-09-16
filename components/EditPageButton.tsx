"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PencilLine } from "lucide-react";
import { sectionForPath } from "@/lib/content-schema";
import { ADMIN_HINT_COOKIE } from "@/lib/auth";

/**
 * "Edit this page", shown on every public page to the couple while they are
 * signed in to the dashboard, and to nobody else.
 *
 * It reads a plain, non-secret hint cookie set alongside the real session
 * cookie at sign-in. The hint decides only whether the button is drawn; the
 * dashboard behind the link is still gated by requireAuth(). Reading it on
 * the client keeps the public pages static.
 */
const subscribe = () => () => {};
const readHint = () => document.cookie.split("; ").some((part) => part === `${ADMIN_HINT_COOKIE}=1`);
const readHintOnServer = () => false;

export function EditPageButton() {
  const pathname = usePathname();
  // Read on the client only, after hydration, so the static HTML is the same
  // for everyone and no guest ever sees the button flash.
  const signedIn = useSyncExternalStore(subscribe, readHint, readHintOnServer);

  const section = sectionForPath(pathname);
  if (!signedIn || !section) return null;

  return (
    <Link
      href={`/admin/pages?section=${section.id}`}
      className="fixed bottom-4 right-4 z-40 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-brand-line-strong bg-brand-paper px-4 text-xs font-medium text-brand-ink shadow-lg transition-colors duration-200 hover:border-brand-steel-600 hover:text-brand-steel-600"
    >
      <PencilLine className="h-4 w-4" aria-hidden="true" />
      Edit this page
    </Link>
  );
}
