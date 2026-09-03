import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Stagger delay for revealed grids. The house value is index * 80ms. */
export function stagger(index: number): { transitionDelay: string } {
  return { transitionDelay: `${index * 80}ms` };
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Manila",
  }).format(new Date(iso));
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeZone: "Asia/Manila",
  }).format(new Date(iso));
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * A run of minutes, in words. Used for the reception's total runtime.
 * "150" becomes "2 hours 30 minutes".
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  const hourPart = hours > 0 ? `${hours} ${hours === 1 ? "hour" : "hours"}` : "";
  const minutePart = rest > 0 ? `${rest} ${rest === 1 ? "minute" : "minutes"}` : "";
  return [hourPart, minutePart].filter(Boolean).join(" ") || "0 minutes";
}

/**
 * A clock time from minutes since midnight. "1155" becomes "7:15 PM".
 *
 * The reception derives every time from the 7:15 PM doors rather than
 * carrying a written clock on each item, so this is what turns the derived
 * number back into something a guest can read.
 */
export function formatClock(minutesFromMidnight: number): string {
  const hours24 = Math.floor(minutesFromMidnight / 60) % 24;
  const hours = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const minutes = String(minutesFromMidnight % 60).padStart(2, "0");
  return `${hours}:${minutes} ${hours24 < 12 ? "AM" : "PM"}`;
}
