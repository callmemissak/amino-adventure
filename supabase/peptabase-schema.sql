-- PeptaBase core schema
-- Run in Supabase SQL editor after authentication is enabled.

create table if not exists public.email_captures (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text default 'site',
  created_at timestamptz not null default now()
);

create table if not exists public.saved_peptides (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  peptide_slug text not null,
  created_at timestamptz not null default now(),
  unique (user_id, peptide_slug)
);

create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  peptide text not null,
  vial_strength text not null,
  quantity text not null,
  reconstitution_notes text,
  date_added date not null,
  created_at timestamptz not null default now()
);

create table if not exists public.injection_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  peptide text not null,
  dose numeric not null,
  unit text not null check (unit in ('mcg', 'mg')),
  injection_location text,
  injection_date date not null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.research_library_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  peptide_slug text,
  study_title text not null,
  study_url text,
  journal text,
  publication_year text,
  created_at timestamptz not null default now()
);

create table if not exists public.developer_note_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  peptide_slug text,
  note_type text not null default 'feedback',
  body text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.email_captures enable row level security;
alter table public.saved_peptides enable row level security;
alter table public.inventory_items enable row level security;
alter table public.injection_logs enable row level security;
alter table public.research_library_items enable row level security;
alter table public.developer_note_submissions enable row level security;

create policy "Users can manage their saved peptides"
on public.saved_peptides
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage their inventory"
on public.inventory_items
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage their injection logs"
on public.injection_logs
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage their research library"
on public.research_library_items
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can create developer note submissions"
on public.developer_note_submissions
for insert
with check (auth.uid() = user_id or user_id is null);

create policy "Users can read their own developer note submissions"
on public.developer_note_submissions
for select
using (auth.uid() = user_id);

create policy "Email capture is insert only"
on public.email_captures
for insert
with check (true);
