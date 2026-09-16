"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Camera, LayoutDashboard, MessageSquareHeart, Users } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The dashboard's section list. A client component only so it can mark the
 * current section; everything it links to is gated by requireAuth() in the
 * layout, not here.
 */
const ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/rsvps", label: "Replies", icon: Users },
  { href: "/admin/guestbook", label: "Messages", icon: MessageSquareHeart },
  { href: "/admin/photos", label: "Photographs", icon: Camera },
  { href: "/admin/manual", label: "Manual", icon: BookOpen },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin">
      {/* A column on the side panel from lg up; a horizontal strip below it,
          where there is no room for a side panel and a phone is more likely
          to be checking replies than doing real work. */}
      <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {ITEMS.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-[44px] items-center gap-3 rounded-xl px-3.5 text-sm transition-colors duration-200",
                  active
                    ? "bg-brand-steel-100 font-medium text-brand-steel-600"
                    : "text-brand-ink/70 hover:bg-brand-paper-200 hover:text-brand-ink",
                )}
              >
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
