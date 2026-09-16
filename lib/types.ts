export type Attendance = "yes" | "no";

export type RsvpGuest = {
  name: string;
  isChild: boolean;
};

/**
 * Every record the couple can act on carries the same two stamps.
 *
 * `archivedAt`: kept for good, hidden from the working views and the public
 * site. `deletedAt`: in the recycle bin, restorable for TRASH_DAYS, then
 * removed for good by the daily purge. Both null means active.
 */
export type RecordFlags = {
  archivedAt: string | null;
  deletedAt: string | null;
};

/** Which shelf a list shows. "all" is only ever used by exports and purges. */
export type RecordView = "active" | "archived" | "trash" | "all";

export type RecordTable = "rsvps" | "guestbook" | "photos";

export type Rsvp = RecordFlags & {
  id: string;
  createdAt: string;
  name: string;
  email: string | null;
  phone: string | null;
  attending: Attendance;
  partySize: number;
  guests: RsvpGuest[];
  dietary: string | null;
  songRequest: string | null;
  message: string | null;
};

export type ModerationStatus = "pending" | "approved" | "hidden";

export type GuestbookEntry = RecordFlags & {
  id: string;
  createdAt: string;
  name: string;
  message: string;
  status: ModerationStatus;
};

export type Photo = RecordFlags & {
  id: string;
  createdAt: string;
  storagePath: string;
  publicUrl: string;
  uploaderName: string | null;
  caption: string | null;
  status: ModerationStatus;
  width: number | null;
  height: number | null;
};

/** One row in the recycle bin, whichever table it came from. */
export type TrashItem = {
  table: RecordTable;
  id: string;
  title: string;
  detail: string;
  deletedAt: string;
  /** Whole days until the purge removes it. Never below zero. */
  daysLeft: number;
  imageUrl?: string;
};

export type ActionState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string; fieldErrors?: Record<string, string[]> };

export const IDLE: ActionState = { status: "idle" };
