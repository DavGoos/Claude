-- Bereinigung: Beim Import der CIC-Usecases (import_cic_usecases.sql) wurde
-- die Spalte "Bucket NEW" (Customer Support, Report Generation, Automated
-- Processes, AI Services, Content Creation) als Team unterhalb von
-- '140014 CIC' angelegt. Tatsaechlich hat dieser Bereich aber keine echten
-- Teams - die Bucket-Angabe ist eine Kategorie/ein Tag pro Idee, kein
-- Organisations-Team. Dieses Skript verschiebt die Angabe dorthin, wo sie
-- hingehoert (tags), und entfernt die 5 faelschlich angelegten Teams wieder.
-- Einmalig in der Supabase SQL-Konsole (Dashboard -> SQL Editor) ausfuehren.
--
-- Reihenfolge wichtig: erst den Team-Namen in tags uebernehmen, dann die
-- Teams loeschen - "ideas.team_id" und "processes.team_id" sind mit
-- "on delete set null" definiert, werden also beim Loeschen automatisch
-- geleert. Team-scoped Eintraege in kostenstelle_access (unwahrscheinlich,
-- da die Teams erst durch den fehlerhaften Import entstanden sind) werden
-- durch "on delete cascade" mitgeloescht - nach dem Lauf ggf. kurz prüfen,
-- ob alle bisherigen CIC-Bearbeiter:innen noch Zugriff haben.

-- 1) Bucket-Namen der betroffenen Ideen in tags uebernehmen (nur wo tags
--    noch leer ist, damit ein zwischenzeitlich manuell gepflegter Tag nicht
--    ueberschrieben wird).
update ideas i
set tags = t.name
from teams t
where i.team_id = t.id
  and t.kostenstelle_code = '140014 CIC'
  and i.tags = '';

-- 2) Die 5 faelschlich angelegten Teams wieder entfernen.
delete from teams where kostenstelle_code = '140014 CIC';
