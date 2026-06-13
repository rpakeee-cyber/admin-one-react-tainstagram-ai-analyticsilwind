-- Instagram AI Analytics Dashboard: prototype storage schema.
-- This stage has no authentication, so all rows belong to one shared workspace.
-- Before using this schema in a public multi-user product:
-- 1. add user_id uuid references auth.users(id);
-- 2. replace the shared policy with owner-scoped RLS policies.

create extension if not exists pgcrypto;

create table if not exists public.reels (
  id uuid primary key default gen_random_uuid(),
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

create index if not exists reels_publish_date_idx
  on public.reels (publish_date desc);

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

-- Prototype-only shared access for the browser anon key.
-- Do not store sensitive data until Supabase Auth, user_id, and RLS are added.
alter table public.reels enable row level security;

drop policy if exists "Prototype shared reels access" on public.reels;

create policy "Prototype shared reels access"
on public.reels
for all
to anon, authenticated
using (true)
with check (true);

grant select, insert, update, delete on table public.reels to anon, authenticated;
