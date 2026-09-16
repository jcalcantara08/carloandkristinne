-- =========================
-- Recycle bin, archive, and editable page content
--
-- Three things, all modelled on the Centennial Events Hall dashboard:
--
-- 1. Nothing the couple deletes is removed at once. Delete moves a reply, a
--    message or a photograph to the recycle bin (`deleted_at` set). It stays
--    there for 14 days, can be restored, and is only removed for good by the
--    daily purge or by an explicit "Delete for good".
-- 2. Archive keeps a record for good but hides it from the working views and
--    from the public site (`archived_at` set). Restore clears it.
-- 3. `site_docs` holds the words and photographs on the public pages as one
--    JSON document per key, edited from the dashboard. Code keeps the
--    defaults; a stored document is merged over them, so a field added later
--    in code never breaks an older saved document.
--
-- Migrations are numbered and never edited after they run.
-- =========================

alter table rsvps
  add column if not exists archived_at timestamptz,
  add column if not exists deleted_at timestamptz;

alter table guestbook
  add column if not exists archived_at timestamptz,
  add column if not exists deleted_at timestamptz;

alter table photos
  add column if not exists archived_at timestamptz,
  add column if not exists deleted_at timestamptz;

-- The working views filter on these every time, and the purge scans them.
create index if not exists rsvps_deleted_at_idx on rsvps (deleted_at) where deleted_at is not null;
create index if not exists guestbook_deleted_at_idx on guestbook (deleted_at) where deleted_at is not null;
create index if not exists photos_deleted_at_idx on photos (deleted_at) where deleted_at is not null;

-- Page content, one document per key ("content" today).
create table if not exists site_docs (
  key text primary key check (char_length(key) between 1 and 40),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Same principle as 0002: RLS on, no policies, service role only.
alter table site_docs enable row level security;
revoke all on site_docs from anon, authenticated;

-- A second public bucket for photographs the couple put on the pages
-- themselves (the hero photograph, for now). Same rules as guest-photos:
-- public read, server-only writes, random object names.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-assets',
  'site-assets',
  true,
  12582912,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "site assets public read" on storage.objects;

create policy "site assets public read"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'site-assets');
