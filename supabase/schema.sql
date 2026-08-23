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

-- Hilfsfunktionen, die den Freigabe-/Admin-Status der eingeloggten Person
-- lesen. Als "security definer" umgehen sie beim internen Lesen von
-- "profiles" dessen eigene Zugriffsregeln - das ist hier bewusst so und
-- notwendig, weil eine Regel auf "profiles", die direkt wieder "profiles"
-- abfragt, sonst eine Endlosschleife auslöst ("infinite recursion
-- detected in policy for relation profiles").
create or replace function is_approved_user()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce((select is_approved from public.profiles where id = auth.uid()), false);
$$;

create or replace function is_admin_user()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

alter table profiles enable row level security;

drop policy if exists "Profiles: select own" on profiles;
create policy "Profiles: select own"
  on profiles for select
  using (id = auth.uid());

drop policy if exists "Profiles: admin select all" on profiles;
create policy "Profiles: admin select all"
  on profiles for select
  using (is_admin_user());

drop policy if exists "Profiles: admin update all" on profiles;
create policy "Profiles: admin update all"
  on profiles for update
  using (is_admin_user());

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

-- ============================================================
-- Kostenstellen-Zugriff: das bisherige "Abteilung"-Feld (department bei
-- ideas/processes) ist konzeptionell die Kostenstelle. Jede Person
-- braucht pro Kostenstelle einen expliziten Zugriffs-Level, um deren
-- Ideen/Prozesse zu sehen bzw. zu bearbeiten - keine Zeile heißt kein
-- Zugriff. Admins sehen/bearbeiten unabhängig davon immer alles.
-- ============================================================

create table if not exists kostenstellen (
  code text primary key,
  name text not null default ''
);

-- Die bisher einzige, fest in der App hinterlegte Kostenstelle einmalig
-- übernehmen, damit der Dropdown nicht leer ist.
insert into kostenstellen (code, name)
values ('050005 CO', 'Group Controlling')
on conflict (code) do nothing;

create table if not exists kostenstelle_access (
  user_id uuid not null references auth.users (id) on delete cascade,
  kostenstelle_code text not null references kostenstellen (code) on delete cascade,
  access_level text not null check (access_level in ('read', 'write')),
  primary key (user_id, kostenstelle_code)
);

-- Team-Dimension: Zugriff wird pro (Kostenstelle, Team) statt nur pro
-- Kostenstelle vergeben, damit z.B. innerhalb "050005 CO" die 5 Teams
-- unabhängig voneinander freigeschaltet werden können. team = '*' heißt
-- "alle Teams dieser Kostenstelle" - so bleiben bereits vergebene, aus der
-- Zeit vor der Team-Trennung stammende Zugriffe unverändert gültig.
alter table kostenstelle_access add column if not exists team text not null default '*';

alter table kostenstelle_access drop constraint if exists kostenstelle_access_pkey;
alter table kostenstelle_access add primary key (user_id, kostenstelle_code, team);

-- Migration: alle bereits freigegebenen Personen bekommen automatisch
-- Schreibzugriff auf die bisherige Kostenstelle, damit sich für die
-- heutige Nutzung nichts ändert. Neue Kostenstellen und neue Personen
-- werden ab jetzt bewusst über die Verwaltungsoberfläche zugewiesen.
insert into kostenstelle_access (user_id, kostenstelle_code, team, access_level)
select p.id, '050005 CO', '*', 'write'
from profiles p
where p.is_approved = true
on conflict (user_id, kostenstelle_code, team) do nothing;

drop function if exists can_read_kostenstelle(text);
drop function if exists can_write_kostenstelle(text);

create or replace function can_read_kostenstelle(ks text, tm text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select is_admin_user() or exists (
    select 1 from public.kostenstelle_access a
    where a.user_id = auth.uid() and a.kostenstelle_code = ks
      and (a.team = '*' or a.team = tm)
  );
$$;

create or replace function can_write_kostenstelle(ks text, tm text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select is_admin_user() or exists (
    select 1 from public.kostenstelle_access a
    where a.user_id = auth.uid() and a.kostenstelle_code = ks
      and (a.team = '*' or a.team = tm) and a.access_level = 'write'
  );
$$;

alter table kostenstellen enable row level security;

drop policy if exists "Kostenstellen: select for approved users" on kostenstellen;
create policy "Kostenstellen: select for approved users"
  on kostenstellen for select
  using (is_approved_user());

drop policy if exists "Kostenstellen: admin manage" on kostenstellen;
create policy "Kostenstellen: admin manage"
  on kostenstellen for all
  using (is_admin_user())
  with check (is_admin_user());

alter table kostenstelle_access enable row level security;

drop policy if exists "Access: select own" on kostenstelle_access;
create policy "Access: select own"
  on kostenstelle_access for select
  using (user_id = auth.uid());

drop policy if exists "Access: admin manage" on kostenstelle_access;
create policy "Access: admin manage"
  on kostenstelle_access for all
  using (is_admin_user())
  with check (is_admin_user());

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

-- Abteilung (= Kostenstelle, siehe oben) und Team sind Pflichtfelder
-- (Dropdown in der App). Die Kostenstellen-Werte kommen aus der Tabelle
-- "kostenstellen" oben, die Team-Werte sind bewusst nicht als
-- DB-Constraint hinterlegt, sondern nur in js/app.js (TEAM_OPTIONS) - so
-- lässt sich diese Liste erweitern, ohne dieses Skript anzupassen.
alter table processes add column if not exists team text not null default '';

drop trigger if exists processes_set_updated_at on processes;
create trigger processes_set_updated_at
  before update on processes
  for each row
  execute function set_updated_at();

alter table processes enable row level security;

drop policy if exists "Processes: select for logged in users" on processes;
drop policy if exists "Processes: select for approved users" on processes;
create policy "Processes: select with kostenstelle access"
  on processes for select
  using (is_approved_user() and can_read_kostenstelle(department, team));

drop policy if exists "Processes: insert for logged in users" on processes;
drop policy if exists "Processes: insert for approved users" on processes;
create policy "Processes: insert with kostenstelle access"
  on processes for insert
  with check (is_approved_user() and can_write_kostenstelle(department, team));

drop policy if exists "Processes: update for logged in users" on processes;
drop policy if exists "Processes: update for approved users" on processes;
create policy "Processes: update with kostenstelle access"
  on processes for update
  using (is_approved_user() and can_write_kostenstelle(department, team))
  with check (is_approved_user() and can_write_kostenstelle(department, team));

drop policy if exists "Processes: delete for logged in users" on processes;
drop policy if exists "Processes: delete for approved users" on processes;
create policy "Processes: delete with kostenstelle access"
  on processes for delete
  using (is_approved_user() and can_write_kostenstelle(department, team));

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

-- Abteilung (= Kostenstelle) / Team sind Pflichtfelder (Dropdown in der
-- App, siehe Hinweis bei der processes-Tabelle oben).
alter table ideas add column if not exists department text not null default '';
alter table ideas add column if not exists team text not null default '';

-- Zusätzliche, optionale Felder für den Abgleich mit dem bestehenden
-- Excel-Use-Case-Katalog (Import/Export). Dropdown-Werte werden wie bei
-- Abteilung/Team nur in js/app.js gepflegt, nicht als DB-Constraint.
alter table ideas add column if not exists ai_role text not null default '';
alter table ideas add column if not exists input_source text not null default '';
alter table ideas add column if not exists output_result text not null default '';
alter table ideas add column if not exists kpi_kind text not null default '';
alter table ideas add column if not exists quantified_benefit text not null default '';
alter table ideas add column if not exists qualitative_benefit text not null default '';
alter table ideas add column if not exists comment text not null default '';
alter table ideas add column if not exists list_priority text not null default '';

-- Eindeutige ID aus dem Excel-Katalog (z.B. "GC29"), für den Abgleich
-- zwischen App und Liste. Nullable, da nur importierte Ideen eine haben;
-- ein Unique-Index statt eines Constraints, damit "add ... if not exists"
-- funktioniert (mehrere NULLs sind dabei weiterhin erlaubt).
alter table ideas add column if not exists catalog_id text;
create unique index if not exists ideas_catalog_id_key on ideas (catalog_id);

-- Ansprechpartner/in für den Use Case (freier Name, keine Verknüpfung zu
-- einem Nutzerkonto).
alter table ideas add column if not exists owner_name text not null default '';

-- "description" war ein einziges Freitextfeld für Problem/Ziel/Business
-- Benefit zusammen - der Excel-Katalog braucht die drei aber als getrennte
-- Spalten (sonst muss man beim Export jedes Mal raten, wie der Text
-- aufzuteilen ist). Deshalb drei eigene Felder; bestehender Text aus
-- "description" wandert einmalig komplett ins neue "problem"-Feld, "goal"
-- und "business_benefit" bleiben erstmal leer zum späteren Nachpflegen.
alter table ideas add column if not exists problem text not null default '';
alter table ideas add column if not exists goal text not null default '';
alter table ideas add column if not exists business_benefit text not null default '';

update ideas set problem = description where problem = '' and description <> '';

-- Stufenkette: ein Use Case ist oft nur der erste Schritt einer mehrstufigen
-- Weiterentwicklung (z.B. GC12 -> GC13 -> GC14). "parent_idea_id" verweist auf
-- die jeweils vorherige Stufe; die Stufennummer und die Folgestufen werden in
-- js/app.js aus dieser Kette berechnet, nicht separat gespeichert.
alter table ideas add column if not exists parent_idea_id uuid references ideas (id) on delete set null;
create index if not exists ideas_parent_idea_id_idx on ideas (parent_idea_id);

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
create policy "Ideas: select with kostenstelle access"
  on ideas for select
  using (is_approved_user() and can_read_kostenstelle(department, team));

drop policy if exists "Ideas: insert for logged in users" on ideas;
drop policy if exists "Ideas: insert for approved users" on ideas;
create policy "Ideas: insert with kostenstelle access"
  on ideas for insert
  with check (is_approved_user() and can_write_kostenstelle(department, team));

drop policy if exists "Ideas: update for logged in users" on ideas;
drop policy if exists "Ideas: update for approved users" on ideas;
create policy "Ideas: update with kostenstelle access"
  on ideas for update
  using (is_approved_user() and can_write_kostenstelle(department, team))
  with check (is_approved_user() and can_write_kostenstelle(department, team));

drop policy if exists "Ideas: delete for logged in users" on ideas;
drop policy if exists "Ideas: delete for approved users" on ideas;
create policy "Ideas: delete with kostenstelle access"
  on ideas for delete
  using (is_approved_user() and can_write_kostenstelle(department, team));
