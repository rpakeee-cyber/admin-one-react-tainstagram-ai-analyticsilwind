-- Instagram AI Analytics Dashboard: authenticated per-user Reels storage.
-- Run this file in Supabase SQL Editor after enabling Email authentication.

create extension if not exists pgcrypto;

create table if not exists public.reels (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  publish_date date not null,
  topic text,
  format text,
  views integer default 0,
  reach integer default 0,
  likes integer default 0,
  comments integer default 0,
  saves integer default 0,
  shares integer default 0,
  new_followers integer default 0,
  duration_seconds integer default 0,
  retention_rate numeric default 0,
  hook text,
  link text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Safe upgrade path for a table created during Stage 5.
-- Existing rows without an owner remain hidden by RLS until they are migrated manually.
alter table public.reels
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

create index if not exists reels_publish_date_idx
  on public.reels (publish_date desc);

create index if not exists reels_user_id_idx
  on public.reels (user_id);

create or replace function public.set_reels_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_reels_updated_at on public.reels;

create trigger set_reels_updated_at
before update on public.reels
for each row
execute function public.set_reels_updated_at();

alter table public.reels enable row level security;

drop policy if exists "Prototype shared reels access" on public.reels;
drop policy if exists "Users can select own reels" on public.reels;
drop policy if exists "Users can insert own reels" on public.reels;
drop policy if exists "Users can update own reels" on public.reels;
drop policy if exists "Users can delete own reels" on public.reels;

create policy "Users can select own reels"
on public.reels
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own reels"
on public.reels
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own reels"
on public.reels
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own reels"
on public.reels
for delete
to authenticated
using (auth.uid() = user_id);

revoke all on table public.reels from anon;
grant select, insert, update, delete on table public.reels to authenticated;
