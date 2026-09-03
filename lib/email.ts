import { Resend } from "resend";
import { escapeHtml } from "@/lib/sanitize";

/**
 * Resend wrapper. Degrades to a no-op without an API key, so local dev and
 * preview deploys stay fully testable and never send real mail.
 *
 * Email is not a database. Every caller persists the submission first and
 * then sends, so a Resend outage cannot lose a guest's RSVP.
 */

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

export type MailOptions = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export async function sendMail(options: MailOptions): Promise<{ skipped: boolean }> {
  const from = process.env.FROM_EMAIL;
  if (!resend || !from) {
    console.info("[email] skipped (no RESEND_API_KEY or FROM_EMAIL):", options.subject);
    return { skipped: true };
  }

  try {
    await resend.emails.send({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
    });
    return { skipped: false };
  } catch (error) {
    // Never surface a mail failure to the guest. The row is already stored.
    console.error("[email] send failed:", error instanceof Error ? error.message : error);
    return { skipped: true };
  }
}

/** A minimal branded shell. Plain text is always sent alongside it. */
export function emailShell(title: string, bodyLines: string[]): { html: string; text: string } {
  const rows = bodyLines
    .map((line) => `<tr><td style="padding:4px 0;color:#2A2E52;font-size:14px;">${escapeHtml(line)}</td></tr>`)
    .join("");

  const html = `<!doctype html><html lang="en"><body style="margin:0;background:#F6F5FB;font-family:-apple-system,Segoe UI,Roboto,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;padding:32px;">
<tr><td style="font-size:12px;letter-spacing:.24em;text-transform:uppercase;color:#8B3FD4;padding-bottom:8px;">Carlo &amp; Kristinne</td></tr>
<tr><td style="font-size:22px;color:#05060E;padding-bottom:16px;">${escapeHtml(title)}</td></tr>
${rows}
<tr><td style="padding-top:24px;font-size:12px;color:#6b7280;">17 October 2026 &middot; Rosario, Cavite &middot; #CARLOobNgdiyoskayKRISTINNE</td></tr>
</table>
</td></tr></table></body></html>`;

  const text = [title, "", ...bodyLines, "", "17 October 2026, Rosario, Cavite", "#CARLOobNgdiyoskayKRISTINNE"].join("\n");

  return { html, text };
}
