-- Import: fehlende Group-Controlling-Usecases aus SharePoint
-- (26-08_Use Cases_Group Controlling.xlsx, Sheet 'Group Controlling')
-- in die bestehende Kostenstelle '050005 CO' / Team 'Group Controlling'.
-- Einmalig in der Supabase SQL-Konsole (Dashboard -> SQL Editor) ausfuehren.
-- Idempotent: erneutes Ausfuehren legt nichts doppelt an (guard ueber catalog_id).
--
-- Umfasst die 15 Cases, die laut Abgleich vom 2026-08-28 noch keine Idee in der
-- App haben und laut Liste nicht als 'ungueltig' markiert sind: GC02, GC03, GC04,
-- GC05, GC14, GC18, GC19, GC20, GC21, GC22, GC23, GC24, GC25, GC26, GC27.
-- Ausgelassen: GC01, GC06, GC07, GC08, GC09 (in der Liste als 'ungueltig'
-- markiert).
--
-- Mapping-Hinweise (siehe auch import_cic_usecases.sql):
--  - Spalte 'Priority' -> status/list_priority: 'in using' -> status='done',
--    list_priority='in using'; 'Medium'/'Low' -> status='planned' mit dieser
--    list_priority. Bewertung (Nutzen/Machbarkeit/Aufwand/Risiko) bleibt auf
--    App-Default (3), da im Excel nicht erfasst.
--  - Bei GC02, GC04, GC05 enthielten mehrere Detailspalten (Ziel, Business
--    Benefit, KI Rolle, KI Loesung, Systeme, Input, Output, Risks) im Excel nur
--    den Platzhaltertext 'in using' (Formel-/Kopierartefakt aus der Liste, keine
--    echten Inhalte) - diese Felder bleiben daher leer statt den Platzhalter zu
--    uebernehmen; Problem Description wurde um den gleichen Anhang bereinigt.
--  - created_by wird auf d.goos@house-of-communication.com gesetzt (muss dort
--    exakt so registriert sein, sonst schlaegt der NOT-NULL-Constraint fehl).
--  - owner_name wird fuer alle 15 Cases auf 'Andrea Esposito' gesetzt.

insert into ideas (
  created_by, quick_note, problem, goal, business_benefit,
  status, ai_role, tools, systeme, input_source, output_result,
  considerations, kpi_kind, quantified_benefit, qualitative_benefit,
  comment, list_priority, skill_level, catalog_id, owner_name, department, team_id
)
select
  (select id from auth.users where email = 'd.goos@house-of-communication.com'),
  'KPI-Analysen', 'Cashflow-Zuordnung, Gehaltsbenchmarks, Lohnnebenkosten (Ausland), Wettbewerbsanalyse und Marktrecherche', '', '',
  'done', '', '', '', '', '',
  '', '', '', '',
  'Faster turnaround, higher quality, better resource control.', 'in using', '', 'GC02', 'Andrea Esposito', '050005 CO',
  (select id from teams where kostenstelle_code = '050005 CO' and name = 'Group Controlling')
where not exists (select 1 from ideas where catalog_id = 'GC02');

insert into ideas (
  created_by, quick_note, problem, goal, business_benefit,
  status, ai_role, tools, systeme, input_source, output_result,
  considerations, kpi_kind, quantified_benefit, qualitative_benefit,
  comment, list_priority, skill_level, catalog_id, owner_name, department, team_id
)
select
  (select id from auth.users where email = 'd.goos@house-of-communication.com'),
  'Prüfung von UST-ID und MwSt.-Sätzen bei internationalen Rechnungen', 'Zuordnung von Unternehmen zu Unternehmensgruppen im Kontext von Kundenanmeldungen Manuelle Prüfung von USt-ID und MwSt.-Sätzen bei internationalen Rechnungen sowie die Zuordnung von Unternehmen zu Unternehmensgruppen bei Kundenanmeldungen ist zeitaufwendig, fehleranfällig und birgt Compliance-Risiken. Unterschiedliche Steuerregeln je Land. Zugriff auf externe Datenbanken. Datenqualität bei Kundeninformationen.', 'Automatisierte Validierung von USt-ID und korrekten MwSt.-Sätzen. Automatische Zuordnung von Unternehmen zu bestehenden Unternehmensgruppen. Reduzierung manueller Prüfungen und Minimierung von Fehlern.', 'Effizienz: Schnellere Rechnungsprüfung und Kundenregistrierung. Compliance: Sicherstellung korrekter Steuerberechnung und rechtlicher Vorgaben. Skalierbarkeit: Verarbeitung großer Mengen ohne zusätzliche Ressourcen.',
  'done', 'Automatisieren', 'KI-gestützte Datenvalidierung (Regelbasierte Engine + Machine Learning). Abgleich mit externen Datenbanken (z. B. EU VAT Information Exchange System – VIES). Clustering-Algorithmen für Unternehmensgruppen-Zuordnung.', 'ERP-Systeme: (unspezifiziert) Interne Systeme: weSupply Externe Datenbanken/Register: VIES, nationale Steuerbehörden', 'Rechnungsdaten (USt-ID, MwSt.-Sätze). Kundendaten (Firmenname, Adresse, Registrierungsinformationen).', 'Keine Datei: Validierungsstatus (OK / Fehler). Korrekturvorschläge für MwSt.-Sätze. Unternehmensgruppen-Zuordnung.',
  'Falsch-positive oder -negative Validierungen. Rechtliche Haftung bei fehlerhafter Steuerberechnung. Datenschutz bei Unternehmensdaten.', '', '', '',
  '', 'in using', '', 'GC03', 'Andrea Esposito', '050005 CO',
  (select id from teams where kostenstelle_code = '050005 CO' and name = 'Group Controlling')
where not exists (select 1 from ideas where catalog_id = 'GC03');

insert into ideas (
  created_by, quick_note, problem, goal, business_benefit,
  status, ai_role, tools, systeme, input_source, output_result,
  considerations, kpi_kind, quantified_benefit, qualitative_benefit,
  comment, list_priority, skill_level, catalog_id, owner_name, department, team_id
)
select
  (select id from auth.users where email = 'd.goos@house-of-communication.com'),
  'Slide-Erstellung', 'Slide-Erstellung via ChatGPT-Canva API Text-to-Speech für Videos (Clipchamp)', '', '',
  'done', '', '', '', '', '',
  '', 'Hybrid', 'Geschätzte 20 Onboarding-Slots pro Jahr, die jeder für sich sicherlich 1-2 Stunden dauern würden', 'schnellere Informationsbereitstellung für verschiedene Zielgruppen, z.B. user unserer Systeme durch KI-generierte bzw. -unterstützte Video-Tutorials oder Newsletter',
  '', 'in using', '', 'GC04', 'Andrea Esposito', '050005 CO',
  (select id from teams where kostenstelle_code = '050005 CO' and name = 'Group Controlling')
where not exists (select 1 from ideas where catalog_id = 'GC04');

insert into ideas (
  created_by, quick_note, problem, goal, business_benefit,
  status, ai_role, tools, systeme, input_source, output_result,
  considerations, kpi_kind, quantified_benefit, qualitative_benefit,
  comment, list_priority, skill_level, catalog_id, owner_name, department, team_id
)
select
  (select id from auth.users where email = 'd.goos@house-of-communication.com'),
  'Übersetzungen (z. B. internationale Kommunikation)', 'Inspiration bei strategischen und taktischen Fragestellungen via Copilot Unterstützung bei komplexen Problemstellungen und Zusammenhängen Textoptimierung und E-Mail-Formulierungen Unterstützendes Brainstorming', '', '',
  'done', '', '', '', '', '',
  '', 'Hybrid', 'schätzungsweise 15 Minuten je Mail/Kommunikation bei vielleicht 10-20 Fällen/Monat', 'Mehr Klarheit in der Kommunikation und Verbesserung der Zusammenarbeit im Allgemeinen',
  '', 'in using', '', 'GC05', 'Andrea Esposito', '050005 CO',
  (select id from teams where kostenstelle_code = '050005 CO' and name = 'Group Controlling')
where not exists (select 1 from ideas where catalog_id = 'GC05');

insert into ideas (
  created_by, quick_note, problem, goal, business_benefit,
  status, ai_role, tools, systeme, input_source, output_result,
  considerations, kpi_kind, quantified_benefit, qualitative_benefit,
  comment, list_priority, skill_level, catalog_id, owner_name, department, team_id
)
select
  (select id from auth.users where email = 'd.goos@house-of-communication.com'),
  'KI-gestütztes Wettbewerbs-Benchmarking via SEC-EDGAR-XBRL (WPP, Publicis, Omnicom, Dentsu)', '(Workforce Controlling / BI-Strategy): Für die Einordnung der eigenen Personalkosten- und Overhead-Quoten fehlt eine belastbare externe Vergleichsgröße. Die Geschäftsberichte der großen Holding-Netzwerke sind öffentlich verfügbar, aber verstreut, umfangreich und manuell nur mit hohem Aufwand auszuwerten. Bislang wurde der Ansatz einmalig genutzt – zur Definition der KPIs und für das Wireframing des Workforce Reports und des Data Warehouse. Externe Benchmarks gegen Wettbewerber sind manuell schwer zugänglich; eine wiederkehrende, strukturierte Auswertung der öffentlichen Finanzberichte findet bislang nicht statt. Unterschiedliche Reporting-Standards und Segmentierungen der Wettbewerber erschweren die direkte Vergleichbarkeit; deutsche Marktdaten (GWA/HORIZONT) nur jährlich und manuell verfügbar; Mapping auf eigene KPI-Definitionen erfordert fachliche Pflege.', 'Automatisiertes Auslesen und Strukturieren der öffentlich gemeldeten Finanzkennzahlen der Wettbewerber (über SEC-EDGAR/XBRL) als Grundlage für ein wiederkehrendes Personalkosten- und Overhead-Benchmarking – statt punktueller manueller Recherche.', 'Einordnung: objektive externe Vergleichsgröße für eigene KPIs Effizienz: automatisiertes Auslesen statt manueller Berichtsdurchsicht Wiederholbarkeit: regelmäßiges Benchmarking statt Einmalanalyse Fundierung: datenbasierte KPI-Definition und Zielsetzung',
  'done', 'Automatisieren', 'Automatisierter Abruf der XBRL-Finanzdaten über die SEC-EDGAR-Schnittstelle, KI-gestützte Extraktion und Strukturierung der relevanten Kennzahlen; Ablage in einer auswertbaren Datenbasis (Azure Blob / OneLake) für Vergleichsanalysen. Für den deutschen Markt ergänzbar um GWA/HORIZONT-Daten (jährliche manuelle Aktualisierung).', 'Externe Quelle: SEC-EDGAR (XBRL). Ergänzend: GWA/HORIZONT (DE-Markt). Plattform: Azure Blob / OneLake, Microsoft Fabric, Power BI. KI: LLM (Anthropic) für Extraktion/Strukturierung.', 'ffentlich gemeldete Quartals-/Jahresfinanzdaten der Wettbewerber (WPP, Publicis, Omnicom, Dentsu) via SEC-EDGAR; optional GWA/HORIZONT für den deutschen Markt.', 'Strukturierte Benchmark-Datenbasis und Vergleichs-KPIs (Personalkosten-/Overhead-Quoten) als Grundlage für Report-Design und laufende Wettbewerbseinordnung.',
  'Gering – ausschließlich öffentliche Daten, kein Datenschutzrisiko. Hauptrisiko ist die Vergleichbarkeit/Interpretierbarkeit der Kennzahlen über unterschiedliche Berichtslogiken hinweg.', 'Quality', 'Bislang Einmalnutzung – kein laufender Zeiteffekt quantifiziert. Bei Überführung in ein wiederkehrendes Benchmarking ließe sich der vermiedene manuelle Rechercheaufwand je Zyklus beziffern.', 'Fundierte, datenbasierte KPI-Definition und externe Wettbewerbseinordnung, die ohne automatisiertes Auslesen in dieser Tiefe nicht praktikabel wäre.',
  'Einmalig erprobt für KPI-Definition und Wireframing des Workforce Reports / Data Warehouse; wiederkehrende Nutzung als Erweiterung denkbar und sinnvoll (z. B. quartalsweiser Benchmarking-Lauf). Methodisch komplementär zu GC02 (Wettbewerbsanalyse).', 'in using', '', 'GC14', 'Andrea Esposito', '050005 CO',
  (select id from teams where kostenstelle_code = '050005 CO' and name = 'Group Controlling')
where not exists (select 1 from ideas where catalog_id = 'GC14');

insert into ideas (
  created_by, quick_note, problem, goal, business_benefit,
  status, ai_role, tools, systeme, input_source, output_result,
  considerations, kpi_kind, quantified_benefit, qualitative_benefit,
  comment, list_priority, skill_level, catalog_id, owner_name, department, team_id
)
select
  (select id from auth.users where email = 'd.goos@house-of-communication.com'),
  'Copilot Excel', '(Core): Mangelnde Excelkenntnisse bei vielen Kolleg:innen führen häufig zu individuellen Anfragen. Bsp.:Eine SP GH-Abteilung benötigt eine Excel-Tabelle als Hilfestellung zur Berechnung von Kosten Ad hoc Support häufig Zeitintensiv, da erst das Zielbild verstanden werden muss ehe man sich an die Zieldatei machen kann. Berechnungen müssen überprüft werden', 'automatische Erstellung einer Excel-Datei, die  das Eingangsproblem löst. Der richtige Prompt ist möglich aufgrund des Excel-Deatilwissen.', 'Zeitersparnis bei der Erstellung neuer Excel-Dateien z.B. für komplexe Formeln, Formatierung etc. trotz der Notwendigkeit, die Berechnungen zu überprüfen',
  'done', 'Automatisieren', 'Copilot', 'MS 365: Copilot', 'Prompt', 'Individueller Aóutput gemäß des angefragten Supports',
  'Mehr Zeitaufwand für Prüfung der Berechnungen als eigene Erstellung', 'Quantity', 'Zeitersparnis durch Automatisierung der Dateierstellung, allerdings sehr individuell und damit nicht quantifizierbar. Schätzung 50 Supportgesuche p.a. SZ: 6 Teampax bei täglicher Nutzung', '',
  '', 'in using', '', 'GC18', 'Andrea Esposito', '050005 CO',
  (select id from teams where kostenstelle_code = '050005 CO' and name = 'Group Controlling')
where not exists (select 1 from ideas where catalog_id = 'GC18');

insert into ideas (
  created_by, quick_note, problem, goal, business_benefit,
  status, ai_role, tools, systeme, input_source, output_result,
  considerations, kpi_kind, quantified_benefit, qualitative_benefit,
  comment, list_priority, skill_level, catalog_id, owner_name, department, team_id
)
select
  (select id from auth.users where email = 'd.goos@house-of-communication.com'),
  'Utilization Ableger', '(Core): Aus einer Excel Sammel-Datei müssen 20 Einzeldateien (eine pro Agentur) erstellt werden. 2-6x pro Monat sehr einfache Aufgabe, die Zeit kostet und bei der sich schnell Leichtsinnsfehler einschleichen Aufgabe wird von KI manchmal hervorragend gelöst, manchmal mit Fehlern, manchmal weigert sich die KI die Aufgabe zu lösen', 'Zeitersparnis + Vermeiden von Leichtsinnsfehlern', 'Zeitersparnis',
  'done', 'Automatisieren', 'Copilot', 'MS 365: Copilot', 'Excel Datei', 'Excel Dateien (zip)',
  'Datenschutz - Auslastungsdaten der Mitarbeitern in der KI', 'Quantity', 'Zeitersparnis wegen Massenabarbeitung Im Schnitt 4x im Monat a 2 Stunden = 96 Stunden', '',
  '', 'in using', '', 'GC19', 'Andrea Esposito', '050005 CO',
  (select id from teams where kostenstelle_code = '050005 CO' and name = 'Group Controlling')
where not exists (select 1 from ideas where catalog_id = 'GC19');

insert into ideas (
  created_by, quick_note, problem, goal, business_benefit,
  status, ai_role, tools, systeme, input_source, output_result,
  considerations, kpi_kind, quantified_benefit, qualitative_benefit,
  comment, list_priority, skill_level, catalog_id, owner_name, department, team_id
)
select
  (select id from auth.users where email = 'd.goos@house-of-communication.com'),
  'Formeln in Excel und Power BI', '(Core): komplexe Excel/Power BI Formeln schnell erstellen.  Ich kenne nicht alle Formeln -> Möglichkeiten erweitern.  Fehleranalyse von bestehenden Formeln keine', 'Zeitersparnis + umfangreiches Formelwissen der KI abgreifen', 'Zeitersparnis + Komplexität in den Formeln wird verringert, da es für viele Anwendungsfälle eine spezielle Formel gibt, die man nicht parat hat',
  'done', 'Automatisieren', 'Copilot, Copilot in Excel', 'MS 365: Copilot', 'Prompt', 'Text',
  'keine', 'Hybrid', 'Zeitersparnis durch weniger Trial & Error in der Formelschreibung', 'Steigerung des Outputs / der Qualität durch Zielgerichtete KI-gestütze Formelschreibung. Effizientere und dadurch schnellere Dateien',
  '', 'in using', '', 'GC20', 'Andrea Esposito', '050005 CO',
  (select id from teams where kostenstelle_code = '050005 CO' and name = 'Group Controlling')
where not exists (select 1 from ideas where catalog_id = 'GC20');

insert into ideas (
  created_by, quick_note, problem, goal, business_benefit,
  status, ai_role, tools, systeme, input_source, output_result,
  considerations, kpi_kind, quantified_benefit, qualitative_benefit,
  comment, list_priority, skill_level, catalog_id, owner_name, department, team_id
)
select
  (select id from auth.users where email = 'd.goos@house-of-communication.com'),
  'Sustainability Lieferantenkategorien zuordnen', '(Core): Zuordnung von definierten Kategorien zu unseren Lieferanten. 1x jährlich Die Recherche zu jedem einzelnen Lieferanten ist sehr zeitaufwendig. Datenqualität prüfen', 'Zeitersparnis', 'Zeitersparnis',
  'done', 'Ergänzen', 'Copilot', 'MS 365: Copilot', 'Tabelle/Prompt', 'Tabelle/Prompt',
  'Lieferanten in der KI', 'Quantity', '1x jährlich ein paar Stunden, nicht näher quantifizierbar', '',
  '', 'in using', '', 'GC21', 'Andrea Esposito', '050005 CO',
  (select id from teams where kostenstelle_code = '050005 CO' and name = 'Group Controlling')
where not exists (select 1 from ideas where catalog_id = 'GC21');

insert into ideas (
  created_by, quick_note, problem, goal, business_benefit,
  status, ai_role, tools, systeme, input_source, output_result,
  considerations, kpi_kind, quantified_benefit, qualitative_benefit,
  comment, list_priority, skill_level, catalog_id, owner_name, department, team_id
)
select
  (select id from auth.users where email = 'd.goos@house-of-communication.com'),
  'Erstellung von Abweichungsanalysen SP GH Abteilungen', '(Core): Erstellung einer Überleitung von FC zu FC von den SP GH Abteilungen aufbereiten. Es sind viele Projekte von vielen Abteilungen, die knackig zusammengefasst werden müssen  Momentan durch enge Betreuung der Abteilungen durch uns möglich. Wir müssen vor FP sprechfähig sein. Wir müssen uns die "Key Facts" aus den Daten erarbeiten. Die Erstellung der Überleitung erfolgt aktuell manuell durch mehrere Personen, wodurch auch ein hoher Abstimmungsbedarf besteht, da alle in eine Datei reinarbetien Datenqualität prüfen. Es dürfen keine Sachverhalte "unter den Tisch gekehrt" werden.', 'Zeitersparnis + ggf. Entwicklung eines besseren Formats', 'Zeitersparnis',
  'planned', 'Automatisieren', '', 'MS 365: Copilot / Claude', 'Excel Datei / Jedox-Daten', 'PPT / immer aktualisierbare HTML-Seite',
  'Wissen in CO-Abteilung geht verloren. Projektbudgets in der KI', 'Hybrid', '5 Planungsloops p.a.a ca. 10 Stunden Ersparnis', 'Steigerung des beim CFO vorgestellten Endprodukts (Dashboard anstelle von PPT)',
  'Noch nicht in Anwendung', 'Medium', 'Skill 2 - Ambassador', 'GC22', 'Andrea Esposito', '050005 CO',
  (select id from teams where kostenstelle_code = '050005 CO' and name = 'Group Controlling')
where not exists (select 1 from ideas where catalog_id = 'GC22');

insert into ideas (
  created_by, quick_note, problem, goal, business_benefit,
  status, ai_role, tools, systeme, input_source, output_result,
  considerations, kpi_kind, quantified_benefit, qualitative_benefit,
  comment, list_priority, skill_level, catalog_id, owner_name, department, team_id
)
select
  (select id from auth.users where email = 'd.goos@house-of-communication.com'),
  'Jedox ETL/Reports', '(Core): Das Fachwissen für das System Jedox ist begrenzt, Zur Erstellung von Berichten / Exports oder auch zur Fehlersuche / Bugfixing usw. sind oftmals Wissen in ETLs oder andere System-spezifische Kniffe notwendig Mangelnde interne Ressourcen stellen teilweise ein Risiko dar, wenn es in Jeodx einen Bug gibt. Darüber hinaus bleiben viele Potenziale liegen, die Jedox grundsätzlich bietet. Qualität', 'Durch KI-Nutzung maximalmögliche Unabhängigkeit von externen Ressourcen', 'Zeit- und Kostenersparnis',
  'done', 'Ergänzen', 'Copilot', 'MS 365: Copilot', 'Prompt', 'Text, Code',
  'keine Nennenswerten', 'Hybrid', 'Könnte laufend im daily Business relevant sein, externe Ressourcen nicht immer verfügbar. Lösung in Eigenregie Insgesamt schwer zu quantifizieren', '',
  '', 'in using', '', 'GC23', 'Andrea Esposito', '050005 CO',
  (select id from teams where kostenstelle_code = '050005 CO' and name = 'Group Controlling')
where not exists (select 1 from ideas where catalog_id = 'GC23');

insert into ideas (
  created_by, quick_note, problem, goal, business_benefit,
  status, ai_role, tools, systeme, input_source, output_result,
  considerations, kpi_kind, quantified_benefit, qualitative_benefit,
  comment, list_priority, skill_level, catalog_id, owner_name, department, team_id
)
select
  (select id from auth.users where email = 'd.goos@house-of-communication.com'),
  'Risk Detection (Plannung & Reporting)', '(Core): Die Gesamtgruppe hat viele Agenturen und während des Monatsreportings oder bei der Forecast-Planung ist das Timing stets äußerst eng. Die Schwierigkeit liegt dann in der Kürze der Zeit in der technischen Analyse Muster und Risiken zu erkennen, denen man in einer Risikoanalyse nachgeht Timing bedingt ist es In der Kürze der Zeit unmöglich, systematisch alle Muster für eine Risikobewertung des Reportings oder Forecasts zu erkennen und zu challengen Datenqualität prüfen. Es dürfen keine Sachverhalte "unter den Tisch gekehrt" werden.', 'Durch KI-Nutzung eine systematische / technische Analyse der Finanzkennzahlen, anhand der man priorisiert Einzelfallen nachgeht bzw. ins Challenging geht.', 'Qualitätssteigerung in der Risikobewertung der Finanzzahlen',
  'done', 'Ergänzen', 'Copilot', 'MS 365: Copilot / Claude', 'Tabelle/Prompt', 'Text',
  'Finanzzahlen in der KI', 'Hybrid', '', 'Zielgerichtetere Risikoanalyse',
  '', 'in using', '', 'GC24', 'Andrea Esposito', '050005 CO',
  (select id from teams where kostenstelle_code = '050005 CO' and name = 'Group Controlling')
where not exists (select 1 from ideas where catalog_id = 'GC24');

insert into ideas (
  created_by, quick_note, problem, goal, business_benefit,
  status, ai_role, tools, systeme, input_source, output_result,
  considerations, kpi_kind, quantified_benefit, qualitative_benefit,
  comment, list_priority, skill_level, catalog_id, owner_name, department, team_id
)
select
  (select id from auth.users where email = 'd.goos@house-of-communication.com'),
  'KI-gestütztes Wettbewerbs-Benchmarking (WPP, Publicis, Omnicom, Dentsu)', '(Core): Für die Einordnung der eigenen operativen Performance fehlt eine belastbare externe Vergleichsgröße. Die Geschäftsberichte der großen Holding-Netzwerke sind öffentlich verfügbar, aber verstreut, umfangreich und manuell nur mit hohem Aufwand auszuwerten.  Externe Benchmarks gegen Wettbewerber sind manuell schwer zugänglich, äußerst umfangreich; eine wiederkehrende, strukturierte Auswertung der öffentlichen Finanzberichte findet bislang nicht statt.  keine', 'Automatisiertes Auslesen und Strukturieren der öffentlich gemeldeten Finanzkennzahlen der Wettbewerber als Grundlage für ein wiederkehrendes Benchmarking – statt punktueller manueller Recherche.', 'Zeitersparnis',
  'done', 'Ersetzen', 'Copilot', 'MS 365: Copilot / Claude', 'Prompt', 'Text / Tabelle',
  'Kein Äpfel mit Äpfel-Vergleich durch unterschiedliche Rechnungslegungsstandards', 'Hybrid', '1-2 Mal jährlich 10 Stunden', 'druch Wegfall der sprachlichen Barriere gehen keine Wesentlichen Sachverhalte verloren, die in Jahresberichten oftmals in Fußnoten stehen.',
  '', 'in using', '', 'GC25', 'Andrea Esposito', '050005 CO',
  (select id from teams where kostenstelle_code = '050005 CO' and name = 'Group Controlling')
where not exists (select 1 from ideas where catalog_id = 'GC25');

insert into ideas (
  created_by, quick_note, problem, goal, business_benefit,
  status, ai_role, tools, systeme, input_source, output_result,
  considerations, kpi_kind, quantified_benefit, qualitative_benefit,
  comment, list_priority, skill_level, catalog_id, owner_name, department, team_id
)
select
  (select id from auth.users where email = 'd.goos@house-of-communication.com'),
  'Statistische Abfragen', '(Core): wir sind zu unterschiedlcihen Meldung statistischer Daten verpflichtet, teilweise monatlich, teilweise jährlich. Die abgefragten Daten sind immer die gleichen Die Aufbereitung der zu meldenden Daten ist manuell. Sie ist immer gleich und nicht komplex, und dennoch werden dazu überqualifizierte Ressourcen gebunden keine', 'KI-gestützte automatisierte Aufbereitung der zu meldenden Daten', 'Zeitersparnis',
  'planned', 'Automatisieren', 'Copilot', 'MS 365: Copilot / Claude', 'Prompt', 'Text / Tabelle',
  'keine', 'Quantity', 'Schätzung: 12*2 Stunden p.a. (Konjunkturerhebung) 1*5 Stunden p.a. (Strukturerhebung)', '',
  '', 'Low', 'Skill 2 - Ambassador', 'GC26', 'Andrea Esposito', '050005 CO',
  (select id from teams where kostenstelle_code = '050005 CO' and name = 'Group Controlling')
where not exists (select 1 from ideas where catalog_id = 'GC26');

insert into ideas (
  created_by, quick_note, problem, goal, business_benefit,
  status, ai_role, tools, systeme, input_source, output_result,
  considerations, kpi_kind, quantified_benefit, qualitative_benefit,
  comment, list_priority, skill_level, catalog_id, owner_name, department, team_id
)
select
  (select id from auth.users where email = 'd.goos@house-of-communication.com'),
  'Copilot + Clipchamp', '(Core): Die Erstellung von Lernvideos sind oft zeitaufwendig und erfordern eine präzise und klare Formulierung. Insbesondere entstehen Herausforderungen durch: Sprachliche Feinabstimmung (fachlich korrekt, aber gleichzeitig verständlich) Übersetzungen zwischen Deutsch und Englisch Anpassung von Texten für gesprochenen Content (Videoskripte) Dieser manuelle Aufwand bindet Zeit und führt häufig zu mehreren Schleifen. Die Erstellung von Lernvideos sind oft zeitaufwendig und erfordern eine präzise und klare Formulierung. Insbesondere entstehen Herausforderungen durch: Sprachliche Feinabstimmung (fachlich korrekt, aber gleichzeitig verständlich) Übersetzungen zwischen Deutsch und Englisch Anpassung von Texten für gesprochenen Content (Videoskripte) Dieser manuelle Aufwand bindet Zeit und führt häufig zu mehreren Schleifen. Text muss trotzdem vorformuliert werden. Inhalt kann fehlerhaft sein und der Text muss trotzdem überprüft werden. Nicht alle Wörter können eins zu eins so für die Text-To…', 'Ziel ist es, die Qualität und Effizienz bei der Texterstellung und -überarbeitung deutlich zu verbessern, indem: Texte schneller formuliert werden Inhalte sprachlich optimiert und klar strukturiert sind Übersetzungen korrekt und kontextgerecht erfolgen Lernvideos flüssige, natürliche und gut verständliche Skripte erhalten', 'Die Nutzung von Copilot bietet mehrere konkrete Mehrwerte: Zeitersparnis: Schnelle Erstellung und Überarbeitung von Texten ohne langwierige Eigenformulierungen Qualitätssteigerung: Klarere, strukturiertere und sprachlich sauberere Inhalte Konsistenz: Einheitlicher Stil über verschiedene Kommunikationsformate hinweg Flexibilität: Anpassung des Tons (formal, informell, international) je nach Zielgruppe Unterstützung bei Mehrsprachigkeit: Schnelle und zuverlässige Übersetzungen',
  'done', 'intelligenter Assistenzpartner', 'Copilot in Zusammenhang mit Clipchamp', 'MS 365: Copilot + Clipchamp', 'Prompt + einen vorformulierten Text', '1. optimierte Texte Sprachlich überarbeitete, klare und strukturierte Texte 2. schnelle Übersetzungen  Kontextgerechte Übersetzungen (nicht nur wortwörtlich) Anpassung an Business-Sprache und Fachterminologie 3. Varianten und Alternativen Mehrere Formulierungsvorschläge für denselben Inhalt Möglichkeit, Tonalität gezielt anzupassen (z. B. freundlicher, klarer, kürzer)',
  'Inhaltliche Ungenauigkeiten: KI-generierte Texte können fachlich ungenau oder nicht vollständig korrekt sein → fachliche Prüfung bleibt notwendig Zu starke Abhängigkeit: Nutzer könnten sich zu stark auf Copilot verlassen und weniger eigene Formulierungen entwickeln Kontextverständnis: In komplexen fachlichen Themen kann es vorkommen, dass der Kontext nicht vollständig erfasst wird Datensensibilität: Sensible oder vertrauliche Informationen sollten bewusst und gemäß internen Richtlinien verwendet werden Ton und Feinabstimmung: Der generierte Text passt nicht immer zu 100 % zur gewünschten Tonalität und erfordert ggf. Feinanpassungen', 'Hybrid', 'weniger Iterationen notwendig bis zur finalen Version. Nicht näher quantifizierbar, da sehr Fallabhängig', 'Mehr Inhalte können in kürzerer Zeit erstellt werden Schnellere Überarbeitung Bereitstellung qualitativ hochwertiger Lehrmaterialien möglich, welche v.a. für Systemnutzer (Zumeist GFs) vorgesehen sind.',
  '', 'in using', '', 'GC27', 'Andrea Esposito', '050005 CO',
  (select id from teams where kostenstelle_code = '050005 CO' and name = 'Group Controlling')
where not exists (select 1 from ideas where catalog_id = 'GC27');
