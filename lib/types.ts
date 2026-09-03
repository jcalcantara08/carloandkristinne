export type Attendance = "yes" | "no";

export type RsvpGuest = {
  name: string;
  isChild: boolean;
};

export type Rsvp = {
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

export type GuestbookEntry = {
  id: string;
  createdAt: string;
  name: string;
  message: string;
  status: ModerationStatus;
};

export type Photo = {
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

export type ActionState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string; fieldErrors?: Record<string, string[]> };

export const IDLE: ActionState = { status: "idle" };
