"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  BookOpen,
  Camera,
  LayoutDashboard,
  MessageSquareHeart,
  PencilLine,
  Trash2,
  Users,
} from "lucide-react";
import { CONTENT_SECTIONS } from "@/lib/content-schema";
import { cn } from "@/lib/utils";

/**
 * The dashboard's section list. A client component only so it can mark the
 * current section; everything it links to is gated by requireAuth() in the
 * layout, not here.
 *
 * Three groups, in the order the couple use them: the things guests send,
 * the words on every page, and housekeeping.
 */
const RECORDS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/rsvps", label: "Replies", icon: Users },
  { href: "/admin/guestbook", label: "Messages", icon: MessageSquareHeart },
  { href: "/admin/photos", label: "Photographs", icon: Camera },
];

const HOUSEKEEPING = [
  { href: "/admin/recycle-bin", label: "Recycle bin", icon: Trash2 },
  { href: "/admin/manual", label: "Manual", icon: BookOpen },
];

const linkClass = (active: boolean) =>
  cn(
    "flex min-h-[44px] items-center gap-3 rounded-xl px-3.5 text-sm transition-colors duration-200",
    active
      ? "bg-brand-steel-100 font-medium text-brand-steel-600"
      : "text-brand-ink/70 hover:bg-brand-paper-200 hover:text-brand-ink",
  );

export function AdminNav() {
  const pathname = usePathname();
  const params = useSearchParams();
  const section = params.get("section") ?? CONTENT_SECTIONS[0].id;
  const onPages = pathname.startsWith("/admin/pages");

  return (
    <nav aria-label="Admin" className="space-y-5">
      {/* A column on the side panel from lg up; horizontal strips below it,
          where there is no room for a side panel and a phone is more likely
          to be checking replies than doing real work. */}
      <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {RECORDS.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <li key={item.href} className="shrink-0">
              <Link href={item.href} aria-current={active ? "page" : undefined} className={linkClass(active)}>
                <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div>
        <p className="mb-2 flex items-center gap-2 px-3.5 text-[0.65rem] font-semibold uppercase tracking-eyebrow text-brand-ink/60">
          <PencilLine className="h-3.5 w-3.5" aria-hidden="true" />
          Edit the website
        </p>
        <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          {CONTENT_SECTIONS.map((item) => {
            const active = onPages && section === item.id;
            return (
              <li key={item.id} className="shrink-0">
                <Link
                  href={`/admin/pages?section=${item.id}`}
                  aria-current={active ? "page" : undefined}
                  className={cn(linkClass(active), "min-h-[40px]")}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <ul className="flex gap-1 overflow-x-auto border-t border-brand-line pt-5 lg:flex-col lg:overflow-visible">
        {HOUSEKEEPING.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <li key={item.href} className="shrink-0">
              <Link href={item.href} aria-current={active ? "page" : undefined} className={linkClass(active)}>
                <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
