-- =========================
-- Carlo and Kristinne, 17 October 2026
-- Initial schema.
-- =========================

create extension if not exists "pgcrypto";

-- Shared trigger function, defined first so later triggers can reference it.
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create type attendance as enum ('yes', 'no');
create type moderation_status as enum ('pending', 'approved', 'hidden');

-- =========================
-- RSVPs
-- =========================

create table rsvps (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 120),
  email text check (email is null or char_length(email) <= 160),
  phone text check (phone is null or char_length(phone) <= 24),
  attending attendance not null,
  party_size integer not null default 0 check (party_size between 0 and 20),
  guests jsonb not null default '[]'::jsonb,
  dietary text check (dietary is null or char_length(dietary) <= 400),
  song_request text check (song_request is null or char_length(song_request) <= 200),
  message text check (message is null or char_length(message) <= 1200)
);

create index rsvps_created_at_idx on rsvps (created_at desc);
create index rsvps_attending_idx on rsvps (attending);

create trigger rsvps_set_updated_at
  before update on rsvps
  for each row execute function set_updated_at();

-- =========================
-- Guestbook
-- =========================

create table guestbook (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 80),
  message text not null check (char_length(message) between 4 and 800),
  status moderation_status not null default 'pending'
);

-- Indexed because every RLS policy and every public read filters on status.
create index guestbook_status_idx on guestbook (status);
create index guestbook_created_at_idx on guestbook (created_at desc);

create trigger guestbook_set_updated_at
  before update on guestbook
  for each row execute function set_updated_at();

-- =========================
-- Photos
-- =========================

create table photos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  storage_path text not null unique,
  uploader_name text check (uploader_name is null or char_length(uploader_name) <= 80),
  caption text check (caption is null or char_length(caption) <= 240),
  status moderation_status not null default 'pending',
  width integer,
  height integer
);

create index photos_status_idx on photos (status);
create index photos_created_at_idx on photos (created_at desc);

create trigger photos_set_updated_at
  before update on photos
  for each row execute function set_updated_at();

-- =========================
-- Audit log
-- Append-only. Every destructive admin action writes one row.
-- =========================

create table audit_log (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  actor text not null default 'admin',
  action text not null,
  detail text not null default ''
);

create index audit_log_created_at_idx on audit_log (created_at desc);
