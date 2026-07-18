-- MedVault AI — Supabase / PostgreSQL schema
-- Apply in the Supabase SQL editor, or: supabase db push
-- Includes tables, indexes, Row Level Security and a private storage bucket.

create extension if not exists "pgcrypto";

-- ────────────────────────────────────────────────────────────────
-- Enums
-- ────────────────────────────────────────────────────────────────
do $$ begin
  create type relationship as enum
    ('Self','Spouse','Son','Daughter','Father','Mother','Brother','Sister','Grandfather','Grandmother','Other');
exception when duplicate_object then null; end $$;

do $$ begin
  create type gender as enum ('Male','Female','Other');
exception when duplicate_object then null; end $$;

do $$ begin
  create type blood_group as enum ('A+','A-','B+','B-','AB+','AB-','O+','O-');
exception when duplicate_object then null; end $$;

do $$ begin
  create type record_category as enum ('Report','Prescription','Bill','Scan','Visit','Vaccination');
exception when duplicate_object then null; end $$;

do $$ begin
  create type reminder_type as enum ('Medicine','Appointment','Lab Test','Vaccination');
exception when duplicate_object then null; end $$;

-- ────────────────────────────────────────────────────────────────
-- Tables
-- ────────────────────────────────────────────────────────────────
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text unique not null,
  name        text not null default '',
  avatar_url  text,
  plan        text not null default 'free',
  language    text not null default 'en',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists family_members (
  id                      uuid primary key default gen_random_uuid(),
  user_id                 uuid not null references profiles(id) on delete cascade,
  name                    text not null,
  relationship            relationship not null default 'Other',
  date_of_birth           date not null,
  gender                  gender not null default 'Other',
  blood_group             blood_group not null,
  photo_url               text,
  conditions              text[] not null default '{}',
  allergies               text[] not null default '{}',
  emergency_contact_name  text,
  emergency_contact_phone text,
  height_cm               int,
  weight_kg               int,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);
create index if not exists idx_members_user on family_members(user_id);

create table if not exists medical_records (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid not null references family_members(id) on delete cascade,
  title       text not null,
  category    record_category not null default 'Report',
  date        date not null,
  doctor_name text,
  hospital    text,
  diagnosis   text,
  medicines   text[] not null default '{}',
  notes       text,
  file_url    text,
  file_type   text,
  tags        text[] not null default '{}',
  created_at  timestamptz not null default now()
);
create index if not exists idx_records_member on medical_records(member_id);
create index if not exists idx_records_category on medical_records(category);

create table if not exists medicines (
  id               uuid primary key default gen_random_uuid(),
  member_id        uuid not null references family_members(id) on delete cascade,
  name             text not null,
  dosage           text not null default '',
  schedule         text[] not null default '{}',
  start_date       date not null default now(),
  end_date         date,
  expiry_date      date,
  reminder_enabled boolean not null default true,
  notes            text,
  created_at       timestamptz not null default now()
);
create index if not exists idx_medicines_member on medicines(member_id);

create table if not exists reminders (
  id         uuid primary key default gen_random_uuid(),
  member_id  uuid not null references family_members(id) on delete cascade,
  type       reminder_type not null default 'Medicine',
  title      text not null,
  date_time  timestamptz not null,
  notes      text,
  channels   text[] not null default '{push,email}',
  completed  boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_reminders_member on reminders(member_id);

create table if not exists share_links (
  id         uuid primary key default gen_random_uuid(),
  member_id  uuid not null references family_members(id) on delete cascade,
  token      text unique not null,
  single_use boolean not null default true,
  used       boolean not null default false,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid references profiles(id) on delete set null,
  action    text not null,
  target    text not null,
  actor     text not null,
  ip        text,
  timestamp timestamptz not null default now()
);
create index if not exists idx_audit_user on audit_logs(user_id);

-- ────────────────────────────────────────────────────────────────
-- Row Level Security — a user only ever sees their own family data
-- ────────────────────────────────────────────────────────────────
alter table profiles        enable row level security;
alter table family_members  enable row level security;
alter table medical_records enable row level security;
alter table medicines       enable row level security;
alter table reminders       enable row level security;
alter table audit_logs      enable row level security;

create policy "own profile" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "own members" on family_members
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own records" on medical_records
  for all using (
    exists (select 1 from family_members m where m.id = member_id and m.user_id = auth.uid())
  );

create policy "own medicines" on medicines
  for all using (
    exists (select 1 from family_members m where m.id = member_id and m.user_id = auth.uid())
  );

create policy "own reminders" on reminders
  for all using (
    exists (select 1 from family_members m where m.id = member_id and m.user_id = auth.uid())
  );

create policy "own audit" on audit_logs
  for select using (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────────
-- Storage — private bucket for uploaded reports
-- ────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('medical-records', 'medical-records', false)
on conflict (id) do nothing;

create policy "own files read" on storage.objects
  for select using (bucket_id = 'medical-records' and owner = auth.uid());

create policy "own files write" on storage.objects
  for insert with check (bucket_id = 'medical-records' and owner = auth.uid());

create policy "own files delete" on storage.objects
  for delete using (bucket_id = 'medical-records' and owner = auth.uid());
