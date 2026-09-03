-- =========================
-- Row Level Security
--
-- Principle: the anon key can do nothing at all. This site has no Supabase
-- authenticated users; every read and every write goes through the Next.js
-- server using the service role, behind either requireAuth() or a rate
-- limited, zod validated, sanitised Server Action.
--
-- RLS is still enabled on every table with no permissive policies, so that
-- if the anon key leaks (and it is in the browser bundle by definition) it
-- grants exactly nothing. A table in `public` without RLS is readable by
-- anyone holding that key, and that is the single most common Supabase breach.
-- =========================

alter table rsvps enable row level security;
alter table guestbook enable row level security;
alter table photos enable row level security;
alter table audit_log enable row level security;

-- Deliberately no policies are created.
--
-- No policy means no access for the `anon` and `authenticated` roles. The
-- service role bypasses RLS entirely and is the only path the application
-- uses. Do NOT add a "public read approved rows" policy here as a
-- convenience: the server already filters by status, and adding one would
-- expose guest names and messages to anyone who reads the JavaScript bundle.
--
-- If a future change genuinely needs browser-side reads, add a narrow policy
-- here, index every column it references, and wrap any auth.uid() call in a
-- subselect so Postgres evaluates it once rather than per row.

revoke all on rsvps from anon, authenticated;
revoke all on guestbook from anon, authenticated;
revoke all on photos from anon, authenticated;
revoke all on audit_log from anon, authenticated;
