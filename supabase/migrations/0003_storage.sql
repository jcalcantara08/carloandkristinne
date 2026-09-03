-- =========================
-- Storage
--
-- One bucket for guest photographs.
--
-- The bucket IS public for reads, which is a deliberate decision and not an
-- oversight: the couple asked that every guest be able to download the
-- originals, with no account and no expiring link. Object names are random
-- UUIDs assigned by the server, never the client's filename, so the bucket
-- is not enumerable from a guessable path.
--
-- Writes are another matter. No client ever uploads directly. Every object
-- is written by the Next.js server with the service role, after the file's
-- real MIME type and size have been checked, and every new row lands as
-- `pending` and stays invisible until the couple approve it.
-- =========================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'guest-photos',
  'guest-photos',
  true,
  12582912, -- 12 MB, matching GALLERY.maxUploadBytes in lib/constants.ts
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Public read of the objects themselves. No insert, update or delete policy
-- is created, so anon and authenticated cannot write to the bucket at all.
drop policy if exists "guest photos public read" on storage.objects;

create policy "guest photos public read"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'guest-photos');
