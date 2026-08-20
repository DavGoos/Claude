-- Einmalig im Supabase SQL-Editor ausführen (siehe README.md Schritt 2).
-- Kann mehrfach ausgeführt werden (z.B. nach einem Update dieses Projekts),
-- ohne bestehende Daten zu verlieren.

create extension if not exists pgcrypto;

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ============================================================
-- Zugriffs-Kontrolle: nur eure Firmendomain darf sich registrieren,
-- und jede Registrierung muss von einem Admin freigegeben werden,
-- bevor die Person Ideen/Prozesse sehen oder bearbeiten kann.
-- ============================================================

-- Passe diese Domain und Admin-E-Mail an eure Firma an, falls nötig.
create or replace function restrict_signup_domain()
returns trigger as $$
begin
  if lower(new.email) !~ '@house-of-communication\.com$' then
    raise exception 'Registrierung ist nur mit einer @house-of-communication.com E-Mail-Adresse möglich.';
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists restrict_signup_domain_trigger on auth.users;
create trigger restrict_signup_domain_trigger
  before insert on auth.users
  for each row
  execute function restrict_signup_domain();

create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  is_approved boolean not null default false,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function handle_new_user()
returns trigger as $$
declare
  is_the_admin boolean := lower(new.email) = 'd.goos@house-of-communication.com';
begin
  insert into public.profiles (id, email, is_approved, is_admin)
  values (new.id, new.email, is_the_admin, is_the_admin);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function handle_new_user();

alter table profiles enable row level security;

drop policy if exists "Profiles: select own" on profiles;
create policy "Profiles: select own"
  on profiles for select
  using (id = auth.uid());

drop policy if exists "Profiles: admin select all" on profiles;
create policy "Profiles: admin select all"
  on profiles for select
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin));

drop policy if exists "Profiles: admin update all" on profiles;
create policy "Profiles: admin update all"
  on profiles for update
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin));

-- Für Projekte, die schon vor der Freigabe-Funktion Nutzer:innen hatten:
-- fehlende Profile nachträglich anlegen (Admin-E-Mail wird automatisch freigeschaltet).
insert into public.profiles (id, email, is_approved, is_admin)
select
  u.id,
  u.email,
  lower(u.email) = 'd.goos@house-of-communication.com',
  lower(u.email) = 'd.goos@house-of-communication.com'
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id);

-- Prozesse: alle Abläufe eines Bereichs, die auf AI-Potenzial geprüft werden.
create table if not exists processes (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null default auth.uid() references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  department text not null default '',
  description text not null default '',
  ai_potential smallint not null default 3 check (ai_potential between 1 and 5),
  notes text not null default '',
  status text not null default 'open'
    check (status in ('open', 'reviewed')),
  parent_process_id uuid references processes (id) on delete set null
);

-- Für Projekte, die die processes-Tabelle schon vor der Teilprozess-
-- Verknüpfung angelegt hatten: Spalte nachträglich ergänzen.
alter table processes add column if not exists parent_process_id uuid references processes (id) on delete set null;

drop trigger if exists processes_set_updated_at on processes;
create trigger processes_set_updated_at
  before update on processes
  for each row
  execute function set_updated_at();

alter table processes enable row level security;

drop policy if exists "Processes: select for logged in users" on processes;
drop policy if exists "Processes: select for approved users" on processes;
create policy "Processes: select for approved users"
  on processes for select
  using (exists (select 1 from profiles where id = auth.uid() and is_approved));

drop policy if exists "Processes: insert for logged in users" on processes;
drop policy if exists "Processes: insert for approved users" on processes;
create policy "Processes: insert for approved users"
  on processes for insert
  with check (exists (select 1 from profiles where id = auth.uid() and is_approved));

drop policy if exists "Processes: update for logged in users" on processes;
drop policy if exists "Processes: update for approved users" on processes;
create policy "Processes: update for approved users"
  on processes for update
  using (exists (select 1 from profiles where id = auth.uid() and is_approved));

drop policy if exists "Processes: delete for logged in users" on processes;
drop policy if exists "Processes: delete for approved users" on processes;
create policy "Processes: delete for approved users"
  on processes for delete
  using (exists (select 1 from profiles where id = auth.uid() and is_approved));

-- Ideen / AI Use Cases
create table if not exists ideas (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null default auth.uid() references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  quick_note text not null,
  description text not null default '',
  tags text not null default '',
  status text not null default 'idea'
    check (status in ('idea', 'evaluating', 'planned', 'in_progress', 'done', 'discarded')),
  impact smallint not null default 3 check (impact between 1 and 5),
  feasibility smallint not null default 3 check (feasibility between 1 and 5),
  effort smallint not null default 3 check (effort between 1 and 5),
  risk smallint not null default 3 check (risk between 1 and 5),
  tools text not null default '',
  considerations text not null default '',
  initial_prompt text not null default '',
  process_id uuid references processes (id) on delete set null
);

-- Für Projekte, die die ideas-Tabelle schon vor der Prozess-Verknüpfung
-- angelegt hatten: Spalte nachträglich ergänzen.
alter table ideas add column if not exists process_id uuid references processes (id) on delete set null;

drop trigger if exists ideas_set_updated_at on ideas;
create trigger ideas_set_updated_at
  before update on ideas
  for each row
  execute function set_updated_at();

-- Row Level Security: nur freigegebene Team-Mitglieder sehen/bearbeiten
-- die gemeinsame Ideen- und Prozess-Sammlung. Für mehrere getrennte Teams
-- müsste man später eine "team_id"-Spalte + passende Policies ergänzen.
alter table ideas enable row level security;

drop policy if exists "Ideas: select for logged in users" on ideas;
drop policy if exists "Ideas: select for approved users" on ideas;
create policy "Ideas: select for approved users"
  on ideas for select
  using (exists (select 1 from profiles where id = auth.uid() and is_approved));

drop policy if exists "Ideas: insert for logged in users" on ideas;
drop policy if exists "Ideas: insert for approved users" on ideas;
create policy "Ideas: insert for approved users"
  on ideas for insert
  with check (exists (select 1 from profiles where id = auth.uid() and is_approved));

drop policy if exists "Ideas: update for logged in users" on ideas;
drop policy if exists "Ideas: update for approved users" on ideas;
create policy "Ideas: update for approved users"
  on ideas for update
  using (exists (select 1 from profiles where id = auth.uid() and is_approved));

drop policy if exists "Ideas: delete for logged in users" on ideas;
drop policy if exists "Ideas: delete for approved users" on ideas;
create policy "Ideas: delete for approved users"
  on ideas for delete
  using (exists (select 1 from profiles where id = auth.uid() and is_approved));
