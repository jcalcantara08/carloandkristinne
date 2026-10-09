import Link from "next/link";
import { Search } from "lucide-react";
import { requireAuth } from "@/lib/admin-guard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { listRsvps, rsvpTotals, seatsFor, TRASH_DAYS } from "@/lib/store";
import { WEDDING_DAY } from "@/lib/constants";
import { cn, formatDateTime } from "@/lib/utils";
import type { Rsvp } from "@/lib/types";
import {
  ShelfActions,
  ViewChips,
  ViewNote,
  readView,
} from "@/app/admin/(dashboard)/shelf-controls";

/**
 * The RSVP list (Erick, 6 October 2026: "it looks like random postings").
 * Two tabs over the same rows. "RSVPs" is one line per reply, filterable,
 * searchable and sortable, for managing the list. "Everyone coming" is one
 * numbered line per person, the reply's own name plus every guest they
 * named, for the seating plan and the door. Every reply from /rsvp lands in
 * both the moment it is sent.
 */

type Show = "all" | "yes" | "no";
type Sort = "newest" | "az";
type Tab = "replies" | "people";

type Params = { view?: string; show?: string; q?: string; sort?: string; tab?: string };

const pick = <T extends string>(value: string | undefined, allowed: readonly T[], fallback: T): T =>
  allowed.includes(value as T) ? (value as T) : fallback;

/** One person on the guest list. Unnamed extras keep the seat count honest. */
type Person = { name: string; with: string; child: boolean; named: boolean };

function peopleFrom(rsvps: Rsvp[]): Person[] {
  const people: Person[] = [];
  for (const rsvp of rsvps) {
    if (rsvp.attending !== "yes") continue;
    people.push({ name: rsvp.name, with: "", child: false, named: true });
    for (const guest of rsvp.guests) {
      people.push({ name: guest.name, with: rsvp.name, child: guest.isChild, named: true });
    }
    const unnamed = seatsFor(rsvp) - 1 - rsvp.guests.length;
    for (let i = 0; i < unnamed; i += 1) {
      people.push({ name: "Guest (name not given)", with: rsvp.name, child: false, named: false });
    }
  }
  return people.sort((a, b) => (a.with || a.name).localeCompare(b.with || b.name) || (a.with ? 1 : -1));
}

function Chip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex min-h-[36px] items-center rounded-full border px-4 text-xs transition-colors duration-200",
        active
          ? "border-brand-plum-500 bg-brand-plum-100 font-medium text-brand-plum-600"
          : "border-brand-line text-brand-ink/70 hover:border-brand-plum-500 hover:text-brand-ink",
      )}
    >
      {children}
    </Link>
  );
}

function StatusBadge({ rsvp }: { rsvp: Rsvp }) {
  return (
    <Badge tone={rsvp.attending === "yes" ? "approved" : "hidden"}>
      {rsvp.attending === "yes" ? "Coming" : "Not coming"}
    </Badge>
  );
}

/** Flags a reply whose picked number and typed names disagree, so the couple can check it. */
function Mismatch({ rsvp }: { rsvp: Rsvp }) {
  if (rsvp.attending !== "yes") return null;
  const named = 1 + rsvp.guests.length;
  if (named === rsvp.partySize) return null;
  return (
    <span className="mt-1 block text-xs text-brand-mauve-600">
      Picked {rsvp.partySize}, named {named}. Please check.
    </span>
  );
}

function Contact({ rsvp }: { rsvp: Rsvp }) {
  if (!rsvp.phone && !rsvp.email) return <span className="text-brand-ink/60">None given</span>;
  return (
    <span className="space-y-0.5">
      {rsvp.phone ? (
        <a href={`tel:${rsvp.phone.replace(/\s+/g, "")}`} className="block text-brand-plum-500 hover:underline">
          {rsvp.phone}
        </a>
      ) : null}
      {rsvp.email ? (
        <a href={`mailto:${rsvp.email}`} className="block break-all text-brand-plum-500 hover:underline">
          {rsvp.email}
        </a>
      ) : null}
    </span>
  );
}

export default async function AdminRsvpsPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requireAuth();

  const params = await searchParams;
  const view = readView(params.view);
  const show = pick<Show>(params.show, ["all", "yes", "no"], "all");
  const sort = pick<Sort>(params.sort, ["newest", "az"], "newest");
  const tab = pick<Tab>(params.tab, ["replies", "people"], "replies");
  const q = (params.q ?? "").trim().slice(0, 80);

  const [active, archived, trash, totals] = await Promise.all([
    listRsvps("active"),
    listRsvps("archived"),
    listRsvps("trash"),
    rsvpTotals(),
  ]);
  const shelf = view === "active" ? active : view === "archived" ? archived : trash;

  const needle = q.toLowerCase();
  const matches = (rsvp: Rsvp) =>
    !needle ||
    rsvp.name.toLowerCase().includes(needle) ||
    rsvp.guests.some((guest) => guest.name.toLowerCase().includes(needle));

  const rows = shelf
    .filter((rsvp) => show === "all" || rsvp.attending === show)
    .filter(matches)
    .sort((a, b) => (sort === "az" ? a.name.localeCompare(b.name) : b.createdAt.localeCompare(a.createdAt)));

  const people = peopleFrom(active).filter(
    (person) => !needle || person.name.toLowerCase().includes(needle) || person.with.toLowerCase().includes(needle),
  );

  const href = (next: Partial<Params>) => {
    const merged = { view, show, sort, tab, q, ...next };
    const search = new URLSearchParams();
    if (merged.view !== "active") search.set("view", merged.view);
    if (merged.show !== "all") search.set("show", merged.show);
    if (merged.sort !== "newest") search.set("sort", merged.sort);
    if (merged.tab !== "replies") search.set("tab", merged.tab);
    if (merged.q) search.set("q", merged.q);
    const query = search.toString();
    return query ? `/admin/rsvps?${query}` : "/admin/rsvps";
  };

  const seatsLeft = WEDDING_DAY.guestCount - totals.headcount;
  const stats = [
    { label: "People coming", value: totals.headcount, note: `of ${WEDDING_DAY.guestCount} seats` },
    { label: "Seats left", value: Math.max(0, seatsLeft), note: seatsLeft < 0 ? `${-seatsLeft} over` : "still open" },
    { label: "RSVPs received", value: totals.responses, note: `${totals.attending} coming` },
    { label: "Not coming", value: totals.declined, note: "replied no" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-display-md">RSVP</h2>
          <p className="mt-2 text-sm text-brand-ink/70">
            Every reply from the RSVP page lands here the moment it is sent.
          </p>
        </div>
        <a href="/admin/rsvps/export" className="btn-primary shrink-0 px-5 py-2.5 text-xs">
          Download spreadsheet
        </a>
      </div>

      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <li key={stat.label}>
            <Card className="p-4">
              <p className="text-xs uppercase tracking-wider text-brand-ink/60">{stat.label}</p>
              <p className="mt-1 font-display text-3xl text-brand-ink">{stat.value}</p>
              <p className="text-xs text-brand-ink/60">{stat.note}</p>
            </Card>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="List">
        <Chip href={href({ tab: "replies" })} active={tab === "replies"}>
          RSVPs ({shelf.length})
        </Chip>
        <Chip href={href({ tab: "people", view: "active" })} active={tab === "people"}>
          Everyone coming ({totals.headcount})
        </Chip>
      </div>

      <form action="/admin/rsvps" method="get" className="flex gap-2">
        {view !== "active" ? <input type="hidden" name="view" value={view} /> : null}
        {show !== "all" ? <input type="hidden" name="show" value={show} /> : null}
        {sort !== "newest" ? <input type="hidden" name="sort" value={sort} /> : null}
        {tab !== "replies" ? <input type="hidden" name="tab" value={tab} /> : null}
        <label htmlFor="rsvp-search" className="sr-only">Search by name</label>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-ink/50" aria-hidden="true" />
          <input
            id="rsvp-search"
            name="q"
            defaultValue={q}
            placeholder="Search a name"
            className="field pl-9"
          />
        </div>
        <button type="submit" className="btn-outline px-5 text-xs">Search</button>
        {q ? (
          <Link href={href({ q: "" })} className="btn-outline px-4 text-xs">Clear</Link>
        ) : null}
      </form>

      {tab === "people" ? (
        people.length === 0 ? (
          <Card className="text-center text-sm text-brand-ink/70">
            {q ? "Nobody on the list matches that name." : "Nobody has said yes yet."}
          </Card>
        ) : (
          <Card className="overflow-hidden p-0">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-brand-line bg-brand-paper-200 text-xs uppercase tracking-wider text-brand-ink/60">
                <tr>
                  <th scope="col" className="w-12 px-4 py-3">#</th>
                  <th scope="col" className="px-4 py-3">Name</th>
                  <th scope="col" className="px-4 py-3">Came in with</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-line">
                {people.map((person, index) => (
                  <tr key={`${person.with}-${person.name}-${index}`}>
                    <td className="px-4 py-2.5 text-brand-ink/60">{index + 1}</td>
                    <td className={cn("px-4 py-2.5", person.named ? "text-brand-ink" : "italic text-brand-ink/60")}>
                      {person.name}
                      {person.child ? <span className="ml-2 text-xs text-brand-plum-500">child</span> : null}
                    </td>
                    <td className="px-4 py-2.5 text-brand-ink/70">{person.with || "Replied"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )
      ) : (
        <>
          <div className="space-y-3">
            <ViewChips
              base="/admin/rsvps"
              view={view}
              counts={{ active: active.length, archived: archived.length, trash: trash.length }}
            />
            <ViewNote view={view} trashDays={TRASH_DAYS} />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Chip href={href({ show: "all" })} active={show === "all"}>All</Chip>
            <Chip href={href({ show: "yes" })} active={show === "yes"}>Coming</Chip>
            <Chip href={href({ show: "no" })} active={show === "no"}>Not coming</Chip>
            <span className="mx-1 hidden h-5 w-px bg-brand-line sm:block" aria-hidden="true" />
            <Chip href={href({ sort: "newest" })} active={sort === "newest"}>Newest first</Chip>
            <Chip href={href({ sort: "az" })} active={sort === "az"}>A to Z</Chip>
          </div>

          {rows.length === 0 ? (
            <Card className="text-center">
              <p className="font-display text-display-md">
                {shelf.length === 0 ? (view === "active" ? "No RSVPs yet" : "Nothing here") : "No matches"}
              </p>
              <p className="mt-3 text-sm text-brand-ink/70">
                {shelf.length > 0
                  ? "Try another name or filter."
                  : view === "active"
                    ? "They appear here the moment somebody sends the RSVP form."
                    : view === "archived"
                      ? "Archive an RSVP to keep it out of the way without losing it."
                      : `Deleted RSVPs wait here for ${TRASH_DAYS} days before they go for good.`}
              </p>
            </Card>
          ) : (
            <>
              {/* Phones: one compact row per RSVP, the detail one tap away. */}
              <ul className="divide-y divide-brand-line overflow-hidden rounded-2xl border border-brand-line bg-brand-paper md:hidden">
                {rows.map((rsvp, index) => (
                  <li key={rsvp.id}>
                    <details className="group">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-brand-ink">{rsvp.name}</span>
                          <span className="block text-xs text-brand-ink/60">
                            {index + 1}.{" "}
                            {rsvp.attending === "yes"
                              ? `${seatsFor(rsvp)} ${seatsFor(rsvp) === 1 ? "seat" : "seats"}`
                              : "Not coming"}
                            {rsvp.dietary ? " · food note" : ""}
                          </span>
                        </span>
                        <StatusBadge rsvp={rsvp} />
                      </summary>
                      <dl className="space-y-2 px-4 pb-4 text-sm">
                        <Mismatch rsvp={rsvp} />
                        {rsvp.guests.length > 0 ? (
                          <div><dt className="text-xs text-brand-ink/60">With them</dt><dd>{rsvp.guests.map((g) => g.name).join(", ")}</dd></div>
                        ) : null}
                        <div><dt className="text-xs text-brand-ink/60">Contact</dt><dd><Contact rsvp={rsvp} /></dd></div>
                        {rsvp.dietary ? <div><dt className="text-xs text-brand-ink/60">Food</dt><dd className="whitespace-pre-line">{rsvp.dietary}</dd></div> : null}
                        {rsvp.songRequest ? <div><dt className="text-xs text-brand-ink/60">Song</dt><dd>{rsvp.songRequest}</dd></div> : null}
                        {rsvp.message ? <div><dt className="text-xs text-brand-ink/60">Note</dt><dd className="whitespace-pre-line">{rsvp.message}</dd></div> : null}
                        <div><dt className="text-xs text-brand-ink/60">Sent</dt><dd>{formatDateTime(rsvp.createdAt)}</dd></div>
                        <div className="flex flex-wrap gap-2 pt-2"><ShelfActions table="rsvps" id={rsvp.id} view={view} /></div>
                      </dl>
                    </details>
                  </li>
                ))}
              </ul>

              {/* Tablets and up: the list as a table. */}
              <Card className="hidden overflow-x-auto p-0 md:block">
                <table className="w-full min-w-[56rem] text-left text-sm">
                  <thead className="border-b border-brand-line bg-brand-paper-200 text-xs uppercase tracking-wider text-brand-ink/60">
                    <tr>
                      <th scope="col" className="w-10 px-4 py-3">#</th>
                      <th scope="col" className="px-4 py-3">Name</th>
                      <th scope="col" className="px-4 py-3">RSVP</th>
                      <th scope="col" className="px-4 py-3 text-right">Seats</th>
                      <th scope="col" className="px-4 py-3">Contact</th>
                      <th scope="col" className="px-4 py-3">Food, song, note</th>
                      <th scope="col" className="px-4 py-3">Sent</th>
                      <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-line align-top">
                    {rows.map((rsvp, index) => (
                      <tr key={rsvp.id}>
                        <td className="px-4 py-3 tabular-nums text-brand-ink/60">{index + 1}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-brand-ink">{rsvp.name}</p>
                          {rsvp.guests.length > 0 ? (
                            <p className="mt-0.5 text-xs text-brand-ink/60">
                              With {rsvp.guests.map((g) => g.name).join(", ")}
                            </p>
                          ) : null}
                        </td>
                        <td className="px-4 py-3"><StatusBadge rsvp={rsvp} /></td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {seatsFor(rsvp)}
                          <Mismatch rsvp={rsvp} />
                        </td>
                        <td className="px-4 py-3"><Contact rsvp={rsvp} /></td>
                        <td className="max-w-xs px-4 py-3 text-brand-ink/80">
                          {rsvp.dietary || rsvp.songRequest || rsvp.message ? (
                            <span className="space-y-1">
                              {rsvp.dietary ? <span className="block"><span className="text-brand-ink/60">Food:</span> {rsvp.dietary}</span> : null}
                              {rsvp.songRequest ? <span className="block"><span className="text-brand-ink/60">Song:</span> {rsvp.songRequest}</span> : null}
                              {rsvp.message ? <span className="block whitespace-pre-line"><span className="text-brand-ink/60">Note:</span> {rsvp.message}</span> : null}
                            </span>
                          ) : (
                            <span className="text-brand-ink/60">None</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-xs text-brand-ink/60">{formatDateTime(rsvp.createdAt)}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2"><ShelfActions table="rsvps" id={rsvp.id} view={view} /></div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </>
          )}
        </>
      )}
    </div>
  );
}
