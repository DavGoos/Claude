-- Einmalig im Supabase SQL-Editor ausführen (siehe README.md Schritt 2).

create extension if not exists pgcrypto;

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
  initial_prompt text not null default ''
);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists ideas_set_updated_at on ideas;
create trigger ideas_set_updated_at
  before update on ideas
  for each row
  execute function set_updated_at();

-- Row Level Security: jedes eingeloggte Team-Mitglied sieht/bearbeitet
-- die gemeinsame Ideen-Sammlung. Für mehrere getrennte Teams müsste
-- man später eine "team_id"-Spalte + passende Policies ergänzen.
alter table ideas enable row level security;

drop policy if exists "Ideas: select for logged in users" on ideas;
create policy "Ideas: select for logged in users"
  on ideas for select
  using (auth.role() = 'authenticated');

drop policy if exists "Ideas: insert for logged in users" on ideas;
create policy "Ideas: insert for logged in users"
  on ideas for insert
  with check (auth.role() = 'authenticated');

drop policy if exists "Ideas: update for logged in users" on ideas;
create policy "Ideas: update for logged in users"
  on ideas for update
  using (auth.role() = 'authenticated');

drop policy if exists "Ideas: delete for logged in users" on ideas;
create policy "Ideas: delete for logged in users"
  on ideas for delete
  using (auth.role() = 'authenticated');
