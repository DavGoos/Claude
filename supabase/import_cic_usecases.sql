-- Import: CIC-Usecases aus SharePoint (26-08_Use Cases_CIC.xlsx, Sheet "CIC")
-- in die Kostenstelle '140014 CIC'. Einmalig in der Supabase SQL-Konsole
-- (Dashboard -> SQL Editor) ausfuehren. Idempotent: erneutes Ausfuehren legt
-- nichts doppelt an (Guards ueber catalog_id bei den Ideen, on conflict bei
-- Kostenstelle/Teams).
--
-- Annahmen beim Mapping von Excel-Spalten auf App-Felder (siehe js/app.js
-- baseExportCols/buildExportRow fuer die Referenz-Spaltenreihenfolge):
--  - "Bucket NEW" (Customer Support, Report Generation, Automated Processes,
--    AI Services, Content Creation) wird als Team unterhalb von 140014 CIC
--    angelegt, nicht als Tag - jede Idee bekommt darueber ihr Team.
--  - Die Spalte "Priority" im Excel mischt tatsaechlich Status- und
--    Prioritaets-Angaben. Deshalb wird sie so aufgeteilt (angelehnt an den
--    Check-Constraint ideas_list_priority_status_check in schema.sql):
--      "ungueltig"    -> status='discarded',   list_priority='ungueltig'
--      "in using"     -> status='done',        list_priority='in using'
--      "in progress"  -> status='in_progress', list_priority='Medium' (im
--                        Excel nicht separat angegeben, daher neutral
--                        defaultet - bei Bedarf in der App nachschaerfen)
--      "High"/"Low"   -> status='planned',     list_priority uebernommen
--  - Bewertung (Nutzen/Machbarkeit/Aufwand/Risiko) hat keine Entsprechung im
--    Excel und bleibt daher auf dem App-Default (3) - müsste im Team manuell
--    nachgetragen werden.
--  - Die "_en"-Felder (Slug fuer die englische Ansicht) bleiben leer, weil
--    die TRANSLATE()-Formeln im Excel nicht aufgeloest waren (Zellen zeigten
--    "#CONNECT!" statt echtem Text).
--  - created_by wird auf den Account d.goos@house-of-communication.com
--    gesetzt (muss dort exakt so registriert sein, sonst schlaegt der
--    NOT-NULL-Constraint fehl - lieber laut scheitern als falsch zuordnen).
--  - Kostenstelle 140014 CIC wird mit Name 'CIC' angelegt (Platzhalter) -
--    bei Bedarf per: update kostenstellen set name='...' where code='140014 CIC';

-- 1) Kostenstelle anlegen (falls noch nicht vorhanden)
insert into kostenstellen (code, name) values ('140014 CIC', 'CIC')
on conflict (code) do nothing;

-- 2) Teams anlegen, eins pro 'Bucket NEW'-Kategorie aus der Quelldatei
insert into teams (kostenstelle_code, name)
select '140014 CIC', t
from unnest(array['AI Services', 'Automated Processes', 'Content Creation', 'Customer Support', 'Report Generation']) as t
on conflict (kostenstelle_code, name) do nothing;

-- 3) Use Cases als Ideen anlegen
insert into ideas (
  created_by, quick_note, problem, goal, business_benefit,
  status, ai_role, tools, systeme, input_source, output_result,
  considerations, kpi_kind, quantified_benefit, qualitative_benefit,
  comment, list_priority, skill_level, catalog_id, department, team_id
)
select
  (select id from auth.users where email = 'd.goos@house-of-communication.com'),
  'Copilot‑Adoption & Prompt‑Library', 'Der Copilot-Rollout ist erfolgt, aber der Nutzungsgrad ist schwer messbar und Best Practices sind nicht zentral verfügbar. Mitarbeiter wissen oft nicht, wie sie Copilot effektiv einsetzen können. Es fehlt eine skalierbare Lösung zur Sichtbarkeit von Nutzung, zur Bereitstellung von Tipps und zur Sammlung von Prompts pro Shared Service. Fehlende Transparenz über Copilot-Nutzung Keine zentrale Sammlung von Best Practices Geringe Adoption trotz Rollout Hoher manueller Aufwand für Schulungen', 'Erhöhung der Copilot-Adoption durch eine zentrale Prompt-Bibliothek, wöchentliche Nutzungs-Insights und proaktive Tipps direkt in Microsoft Teams.', 'Transparenz: Sichtbarkeit der Nutzung und Best Practices Skalierbarkeit: Einheitliche Prompts für alle Shared Services Effizienz: Schnellere Einarbeitung in Copilot-Funktionen Engagement: Tipps und Insights fördern aktive Nutzung',
  'discarded', 'Ergänzen', 'KI-Agent erstellt und pflegt eine Prompt-Library pro Shared Service. Aggregiert Nutzungsdaten (z. B. häufige Befehle, Interaktionen) und generiert wöchentliche Insights. Postet Tipps & Best Practices automatisch in Teams-Kanälen. Optional: Gamification-Elemente (Top-Prompts, User-Rankings). Sokusmi: Prompt Engineering Coach', 'MS 365: Copilot Analytics', 'Copilot-Nutzungsdaten Bestehende Prompts und Use Cases Teams-Kanäle für Kommunikation', 'Zentrale Prompt-Library (SharePoint oder Wiki) eingebunden im weNet Wöchentliche Nutzungs-Insights (Dashboard + Teams-Posts) Automatisierte Tipps in Teams',
  'Datenschutz: Analyse von Nutzungsdaten muss DSGVO-konform sein Akzeptanz: Mitarbeiter müssen Tipps als Mehrwert sehen Technische Integration: Zugriff auf Copilot-Analytics und Teams-APIs', 'Quality', '', 'Qualitätsverbesserung durch strukturierte Copilot‑Nutzung inkl. wöchentlicher Insights & zentraler Prompt‑Library. Nutzungssicherheit und Skalierbarkeit der Copilot‑Adoption.',
  'Gemeinsam mit HR; Ownership unklar. Klärung innerhalb der internal AI Taskforce', 'ungültig', '', 'CIC01', '140014 CIC',
  (select id from teams where kostenstelle_code = '140014 CIC' and name = 'Customer Support')
where not exists (select 1 from ideas where catalog_id = 'CIC01');

insert into ideas (
  created_by, quick_note, problem, goal, business_benefit,
  status, ai_role, tools, systeme, input_source, output_result,
  considerations, kpi_kind, quantified_benefit, qualitative_benefit,
  comment, list_priority, skill_level, catalog_id, department, team_id
)
select
  (select id from auth.users where email = 'd.goos@house-of-communication.com'),
  'Integration‑Status „Executive Summary“', 'Status zu IT‑Migration, Workday, Makros etc. liegt verteilt in mehreren Threads/Kanälen. Es fehlt eine zentrale Übersicht für Management-Entscheidungen. Hoher manueller Aufwand, um alles zusammenzutragen.  Teamübergreifend: unterschiedliche Arbeitsweisen und Detailtiefe', 'Wöchentliche konsolidierte Übersicht („Integration Radar“) Automatisierte Extraktion von Fortschritt und Blockern Terminierung der nächsten Schritte Erstellung einer „Executive Slide“ für Management', 'Zeitersparnis bei Erstellung der Exec Summary (z. B. -80%) Vollständigkeit der Informationen (z. B. >95%) Reduzierte Kommunikationsaufwände',
  'planned', 'Automatisieren', 'Natural Language Processing (NLP): Extrahiert relevante Statusinformationen aus Chat-Threads und Kanälen. Automatisierte Zusammenfassung: Generiert eine strukturierte Übersicht (Fortschritt, Blocker, nächste Schritte). Visualisierung: Erstellt automatisch eine Management-Slide (PowerPoint oder PDF). Workflow-Automation: Plant nächste Schritte und sendet Reminder.', 'MS 365: Copilot; Power Platform: Automate', 'MS Teams, SharePoint (PPT), Planner, Mails', 'Radar Report, PPT Slides',
  'Datenschutz bei Chat-Analyse Zugriffsbeschränkungen auf vertrauliche Kanäle', 'Hybrid', '1h / week = 32h / Jahr', 'Zentrale Statusübersicht mit klaren Fortschritten, Blockern und nächsten Schritten – automatisch und aktuell.Der Use Case reduziert nicht nur manuellen Abstimmungsaufwand, sondern schafft eine verlässliche und entscheidungsreife Gesamtübersicht für laufende Integrationen.',
  '', 'High', 'Skill 2 - Ambassador', 'CIC02', '140014 CIC',
  (select id from teams where kostenstelle_code = '140014 CIC' and name = 'Report Generation')
where not exists (select 1 from ideas where catalog_id = 'CIC02');

insert into ideas (
  created_by, quick_note, problem, goal, business_benefit,
  status, ai_role, tools, systeme, input_source, output_result,
  considerations, kpi_kind, quantified_benefit, qualitative_benefit,
  comment, list_priority, skill_level, catalog_id, department, team_id
)
select
  (select id from auth.users where email = 'd.goos@house-of-communication.com'),
  'Onboarding & Integrations‑Wissensbasis', 'Neue Executives und Agenturen stellen wiederkehrende Fragen zu Prozessen, Tools und Zugängen. Die relevanten Informationen liegen verstreut in mehreren Dateien und Systemen. Das manuelle Zusammenstellen von Checklisten und Terminen für die erste Woche ist zeitaufwendig und inkonsistent. Hoher manueller Aufwand für Onboarding Informationsfragmentierung über mehrere Systeme Wiederkehrende Fragen binden Ressourcen Inkonsistente Kommunikation', 'Bereitstellung einer kontextsensitiven Q&A-Funktion und automatisierte Erstellung eines „First-Week Packs“ (Checklisten, Termine, Tool-Zugänge) für neue Mitarbeiter oder Partner.', 'Effizienz: Reduktion von manuellen Onboarding-Aufwänden Konsistenz: Einheitliche Informationen für alle neuen Executives/Agenturen Schnelligkeit: Sofortige Antworten auf wiederkehrende Fragen Erfahrung: Verbesserte User Experience beim Einstieg',
  'planned', 'Ergänzen', 'KI-Agent nutzt Retrieval-Augmented Generation (RAG), um Inhalte aus verstreuten Dateien und Systemen zu konsolidieren. Beantwortet Fragen kontextuell (z. B. „Wie beantrage ich Tool-Zugänge?“). Generiert automatisch ein „First-Week Pack“ mit Checklisten, Terminen und Zugangslinks. Integration in Microsoft Teams oder weNet für einfache Nutzung.', 'MS 365: SharePoint, OneDrive, Teams, Outlook, PowerPoint, Word; AI Service: LLM, RAG', 'Onboarding-Dokumente (PDF, Word, Excel) Prozessbeschreibungen Tool-Zugangsrichtlinien Kalenderdaten für Termine', 'Kontextuelle Antworten auf Fragen Automatisiertes „First-Week Pack“ (Checkliste, Termine, Zugänge)',
  'Datenaktualität: Veraltete Inhalte führen zu falschen Antworten Datenschutz: Zugriff auf sensible Informationen Akzeptanz: Vertrauen in KI-Antworten Technische Integration: RAG-Setup und API-Zugriffe', 'Hybrid', 'HR/Integration/PM: ca. 2–3 Stunden pro Onboarding (Zusammenstellen von Infos, Checklisten, Terminen) – Neue Mitarbeitende/Executives: ca. 1–2 Stunden in der ersten Woche (weniger Suchen, schnellere Orientierung) → Gesamt: ca. 3–5 Stunden je Onboarding, bei gleichzeitig höherer Konsistenz und Transparenz. ca 15x MD Onboardings pro Jahr', 'Der Use Case standardisiert und beschleunigt das Onboarding von Executives und Agenturen durch eine zentrale, konsistente Wissensbasis und ein automatisch generiertes „First‑Week Pack“, wodurch Qualität und Verlässlichkeit der Integration deutlich steigen',
  '', 'High', 'Skill 2 - Ambassador', 'CIC03', '140014 CIC',
  (select id from teams where kostenstelle_code = '140014 CIC' and name = 'Customer Support')
where not exists (select 1 from ideas where catalog_id = 'CIC03');

insert into ideas (
  created_by, quick_note, problem, goal, business_benefit,
  status, ai_role, tools, systeme, input_source, output_result,
  considerations, kpi_kind, quantified_benefit, qualitative_benefit,
  comment, list_priority, skill_level, catalog_id, department, team_id
)
select
  (select id from auth.users where email = 'd.goos@house-of-communication.com'),
  'Shared‑Service‑Kalender kuratieren (Transparenz & Koordination)', 'Termine und Initiativen sind über viele Hubs verteilt. Die manuelle Pflege eines zentralen Shared-Service-Kalenders ist zeitaufwendig, fehleranfällig und führt zu mangelnder Transparenz und Koordination. Reminder und Roadmap-Updates werden oft vergessen oder verspätet erstellt. Hoher manueller Aufwand für Kalenderpflege Fehlende Übersicht über alle Hubs Reminder werden oft vergessen Roadmap-Folien kosten Zeit und sind inkonsistent', 'Automatisches Sammeln wichtiger Termine aus verschiedenen Quellen.Erstellung von monatlichen Roadmap-Folien und proaktive Kommunikation (Reminder, Heads-up-Posts in Teams).', 'Transparenz: Alle relevanten Termine zentral sichtbar Effizienz: Reduktion manueller Kalenderpflege um bis zu 70 % Koordination: Frühzeitige Heads-up-Posts verhindern Terminkonflikte Konsistenz: Einheitliche Roadmap-Darstellung für Management',
  'planned', 'Ergänzen', 'KI-Agent crawlt Kalender (KI durchsucht systemisch den Kalender und liest Daten für Weiterverarbeitung aus), Projektmanagement-Tools und interne Plattformen. Identifiziert relevante Termine (z. B. Initiativen, Workshops, Releases). Automatisiert Reminder in Microsoft Teams und erstellt monatliche Roadmap-Folien (PowerPoint).', 'MS 365: SharePoint, Teams, PowerPoint;  Power Platform: Automate AI Service: NLP', 'Excel', 'Konsolidierter Shared-Service-Kalender in MS List oder Planner Automatisierte Reminder/Heads-up-Posts in Teams Monatliche Roadmap-Folien (PowerPoint)',
  'Datenzugriff: Berechtigungen für verschiedene Systeme Relevanzfilter: Gefahr von zu vielen oder falschen Terminen Akzeptanz: Vertrauen in KI-Kuration Technische Integration: API-Zugriffe und Synchronisation', 'Quantity', '– PMs / Shared Services: ca. 1,5–2 Stunden pro Monat (manuelle Abstimmung, Kalenderpflege, Erinnerungen) – Führungskräfte & Teams: ca. 0,5–1 Stunde pro Monat (weniger Rückfragen, klarere Roadmaps) → Gesamt: ca. 2–3 Stunden pro Monat bei deutlich höherer Planungssicherheit und Transparenz.', '',
  '', 'Low', 'Skill 3a - Internal Expert', 'CIC06', '140014 CIC',
  (select id from teams where kostenstelle_code = '140014 CIC' and name = 'Automated Processes')
where not exists (select 1 from ideas where catalog_id = 'CIC06');

insert into ideas (
  created_by, quick_note, problem, goal, business_benefit,
  status, ai_role, tools, systeme, input_source, output_result,
  considerations, kpi_kind, quantified_benefit, qualitative_benefit,
  comment, list_priority, skill_level, catalog_id, department, team_id
)
select
  (select id from auth.users where email = 'd.goos@house-of-communication.com'),
  'HTML Dashboard', 'Aktuell werden die AI Use Cases hauptsächlich in Excel-Listen und PowerPoint-Folien gepflegt und dargestellt. Diese Formate sind zwar funktional, bringen aber einige Herausforderungen mit sich: Excel ist wenig übersichtlich bei vielen Use Cases PowerPoint ist statisch und muss manuell aktualisiert werden Es gibt keine einfache Möglichkeit zu filtern, suchen oder interaktiv zu arbeiten. Um das Thema "AI" modern darzustellen, sollte man AI auch möglichst für die Darstellung nutzen können.  Unübersichtliche Excel-Listen Statische PowerPoint-Präsentationen Hoher manueller Pflegeaufwand Keine Filter- oder Suchmöglichkeiten Unterschiedliche Versionen im Umlauf Keine einheitliche visuelle Darstellung', 'Visuell ansprechende Darstellung aller AI Use Cases mit  Interaktive Nutzung (Filtern, Suchen, Sortieren) zur  Reduzierung manueller Pflege bei Präsentationen sowie die Vorstellung der Cases auf eine moderne Art und Weise', 'Bessere Übersicht: Use Cases sind schnell erfassbar für das Management Zeitersparnis: Keine manuelle Erstellung von Slides mehr Bessere Entscheidungsgrundlage: Management kann schneller priorisieren durch einfache und schneller greifbare Darstellung Modernere Darstellung: Höhere Akzeptanz und Interesse an AI-Themen',
  'in_progress', 'Ergänzen', 'Nutzung von Copilot Coworker, um ein HTML-basiertes Dashboard zu erstellen Automatische Umwandlung der Excel Use Case List in eine visuelle Oberfläche Features des Dashboards: Filter (z. B. nach Bereich, Status, KI Rolle) Suchfunktion Bearbeitungsmöglichkeiten (z. B. Updates direkt im Interface) Klare Darstellung je Use Case (z. B. als Cards oder strukturierte Blöcke)', 'MS 365: Copilot Coworker Excel, HTML Dashboard', 'Excel Datei', 'Interaktives HTML Dashboard',
  'Excel-Daten sind unstrukturiert oder uneinheitlich → schlechte Darstellung im Dashboard Fehlende Pflege → Dashboard veraltet genauso wie Excel Technische Abhängigkeit vom Dashboard (bei Fehlern kein Zugriff) Zu komplexes UI → Nutzer verstehen es nicht Pain Points (heutige Herausforderungen)', 'Hybrid', 'Zeitersparnis bei Erstellung von Präsentationen; ca 1h pro Zusammenfassung z.B. aufgrund Management Präsentationen (ca. 4x jährlich)', 'bessere Verständlichkeit der Use Cases visuelle Attraktivität bessere Entscheidungsfähigkeit im Management höhere Awareness für AI Use Cases',
  '', 'Medium', 'Skill 2 - Ambassador', 'CIC07', '140014 CIC',
  (select id from teams where kostenstelle_code = '140014 CIC' and name = 'AI Services')
where not exists (select 1 from ideas where catalog_id = 'CIC07');

insert into ideas (
  created_by, quick_note, problem, goal, business_benefit,
  status, ai_role, tools, systeme, input_source, output_result,
  considerations, kpi_kind, quantified_benefit, qualitative_benefit,
  comment, list_priority, skill_level, catalog_id, department, team_id
)
select
  (select id from auth.users where email = 'd.goos@house-of-communication.com'),
  'CIC‑Portfolio & Credentials automatisch aktualisieren', 'Die Folien „Full Portfolio“ / „Credential CIC“ müssen mindestens zweimal jährlich manuell gepflegt werden (Teams, Personen, Services). Stammdaten liegen verteilt (WeNet, SharePoint). Die Aktualisierung ist zeitintensiv, fehleranfällig und nicht CI‑konform automatisiert. Datenqualität nicht ausreichend oder veraltet (Single Source of Truth), Fehlende Schreibreche, Erarbeitung valider Datenquelle wird Zeit in Anspruch nehmen', 'Automatische Aktualisierung der Portfolio‑ und Credential‑Slides aus zentralen Stammdaten. CI‑konformes Rendering in PowerPoint (Master/Layouts, Farben, Schrift, Logos). Minimierter manueller Aufwand für CIC‑Team (Curator nur zur Qualitätssicherung).', 'Aufwandreduktion pro Release Datenaktualität Reduktion Fehlerquote (z. B. <2 % Inkonsistenzen je Release)',
  'discarded', 'Ergänzen', 'Curator Service (AI‑unterstützt): Liest Stammdaten (Heads, Services, Teamzuordnung, Kurzbeschreibungen) aus WeNet/SharePoint, erkennt Änderungen, harmonisiert Schreibweisen. NLP/Regelwerk: Normalisiert Bezeichnungen, prüft Duplikate & Inkonsistenzen (z. B. Teamnamen, Rollen). Template Engine: Rendert PowerPoint automatisch auf Basis eines CI‑Mastertemplates (Layouts, Platzhalter). Workflow-Automation: Plant halbjährliche Läufe + On‑Demand Updates; sendet Review‑Tasks; veröffentlicht finale PPt + PDF im CIC‑Hub.', 'MS 365: SharePoint, Copilot; Power Platform: Automate; AI Service: NLP; Custom Service: Template Engine, Curator', 'Dateien aus weNet, Sharepoint, Teams', 'Mehrere PPT (Full Portfolio, einzel Credentials)',
  'Falsche Datenauslese', '', '', '',
  'Machbar, jedoch Power Automate und weitere Admin Kenntnisse von nöten die zum jetzigen Stand noch keinen messbaren Nutzen in der späteren Anwendung erkennen lassen', 'ungültig', '', 'CIC04', '140014 CIC',
  (select id from teams where kostenstelle_code = '140014 CIC' and name = 'Automated Processes')
where not exists (select 1 from ideas where catalog_id = 'CIC04');

insert into ideas (
  created_by, quick_note, problem, goal, business_benefit,
  status, ai_role, tools, systeme, input_source, output_result,
  considerations, kpi_kind, quantified_benefit, qualitative_benefit,
  comment, list_priority, skill_level, catalog_id, department, team_id
)
select
  (select id from auth.users where email = 'd.goos@house-of-communication.com'),
  'Meeting minutes', 'Die Vorbereitung und Nachbereitung des wöchentlichen JF-Meetings kostet viel Zeit. Notizen, Entscheidungen und Action Items sind über Outlook, Teams und SharePoint verteilt. Das manuelle Sammeln, Strukturieren und Erstellen von Recaps ist ineffizient und fehleranfällig. Hoher manueller Aufwand für Vor- und Nachbereitung Informationsfragmentierung über mehrere Systeme Gefahr, wichtige Punkte zu übersehen Verzögerte Kommunikation von Action Items', 'Automatisierte Zusammenstellung relevanter Inhalte für die Meeting-Vorbereitung und Erstellung eines strukturierten Recaps inklusive Action Items und Follow-ups.', 'Zeitersparnis: Reduktion manueller Vor- und Nachbereitung  Konsistenz: Einheitliche Meeting-Dokumentation Transparenz: Alle relevanten Infos zentral verfügbar Proaktivität: Automatische Reminder für Action Items',
  'discarded', 'Automatisieren', 'Copilot aggregiert Inhalte aus Outlook (Kalender, E-Mails), Teams (Chats, Dateien) und SharePoint. Erstellt automatisch eine Meeting-Agenda basierend auf offenen Themen und letzten Entscheidungen. Generiert nach dem Meeting ein Recap-Dokument mit Action Items und verteilt es in Teams. Optional: KI-gestützte Zusammenfassung von Diskussionen aus Transkripten (Teams-Meeting-Recording).', 'MS 365: Outlook, Teams, SharePoint, Copilot AI Service: LLM', 'Kalenderdaten (Outlook) Meeting-Notizen (Teams, SharePoint)', 'Automatisierte Agenda für das nächste Meeting Recap-Dokument mit Entscheidungen und Action Items Reminder für offene Punkte in Teams',
  'Datenschutz: Zugriff auf Meeting-Inhalte und E-Mails Akzeptanz: Vertrauen in KI-generierte Zusammenfassungen Technische Integration: Zugriff auf mehrere M365-Datenquellen', '', '', '',
  'KI‑Lösung: Automatisierter JF‑Digest als 1‑Pager + To‑Dos: zieht Agenda/Änderungen aus dem Kalendereintrag, fasst relevante Mails/Teams‑Updates zusammen und generiert Action Items. Umsetzbarkeit sehr hoch bei regelmäßiger Anwendung auch gut messbar', 'ungültig', '', 'CIC05', '140014 CIC',
  (select id from teams where kostenstelle_code = '140014 CIC' and name = 'Content Creation')
where not exists (select 1 from ideas where catalog_id = 'CIC05');

insert into ideas (
  created_by, quick_note, problem, goal, business_benefit,
  status, ai_role, tools, systeme, input_source, output_result,
  considerations, kpi_kind, quantified_benefit, qualitative_benefit,
  comment, list_priority, skill_level, catalog_id, department, team_id
)
select
  (select id from auth.users where email = 'd.goos@house-of-communication.com'),
  'Use Case Finder Agent', 'Viele potenzielle KI-Use-Cases werden nicht oder nur unvollständig erfasst, weil Anwender:innen Schwierigkeiten haben, ihre Idee strukturiert zu beschreiben. Häufig fehlen das richtige Wording, ein klares Problem Statement oder die Zuordnung zu bestehenden Feldern wie Ziel, Business Value, Input, Output oder Pain Points. Dadurch gehen relevante Ideen verloren oder werden in sehr unterschiedlicher Qualität und Detailtiefe eingereicht. Anwender:innen wissen oft nicht, wie sie einen Use Case richtig beschreiben sollen Gute Ideen bleiben unausgesprochen, weil die Erfassung als zu aufwendig empfunden wird Use Cases werden in unterschiedlicher Qualität, Länge und Detailtiefe eingereicht Zentrale Teams müssen häufig nachfassen, um fehlende Informationen zu ergänzen Vergleichbarkeit und Priorisierung der Use Cases ist erschwert', 'Ziel ist es, die Erfassung von Use Cases deutlich zu vereinfachen und zu standardisieren. Der Agent soll Anwender:innen Schritt für Schritt durch die relevanten Eingabefelder führen, bei der Formulierung unterstützen und aus den Antworten eine verständliche, vollständige Use-Case-Beschreibung erstellen. Dadurch sollen mehr Use Cases eingereicht, schneller beschrieben und besser vergleichbar gemacht werden.', 'Niedrigere Einstiegshürde für Anwender:innen bei der Use-Case-Erfassung Mehr eingereichte Use Cases durch einfacheren und geführten Prozess Bessere Qualität und Vollständigkeit der Use-Case-Beschreibungen Höhere Vergleichbarkeit durch einheitliche Eingabestruktur',
  'in_progress', 'Automatisieren', 'Der Use Case Finder Agent fungiert als interaktiver Bot, der Anwender:innen Schritt für Schritt durch die Erfassung eines Use Cases führt. Dabei fragt der Agent die relevanten Felder strukturiert ab, zum Beispiel Problembeschreibung, Ziel, Business Value, KI-Rolle, involvierte Systeme, Input, Output, Pain Points und Risiken. Für jedes Feld bietet der Agent entweder Auswahlmöglichkeiten, Beispiele oder eine freie Texteingabe an. Wenn Anwender:innen unsicher sind, unterstützt der Agent mit Formulierungshilfen, Nachfragen oder Vorschlägen. Auf Basis der Eingaben erstellt die KI am Ende eine zusammenhängende, verständliche und standardisierte Use-Case-Beschreibung. Vor dem Versand wird den Anwender:innen eine Zusammenfassung angezeigt. Nach Bestätigung wird der Use Case automatisch per E-Mail an das zentrale Team geschickt. Die einreichende Person erhält eine Kopie der Zusammenfassung.', 'MS 365: Outlook, Copilot, Power Automate', 'Manuelle Eingabe durch den Anwender, Vordefinierte Auswahlfelder und Antwortmöglichkeiten', 'Standardisierte Beschreibung eines Cases, Zusammenfassung als Email',
  'Anwender:innen könnten trotz Führung unvollständige oder unklare Angaben machen Die KI könnte Inhalte zu stark interpretieren oder ergänzen, wenn Eingaben zu vage sind Es besteht das Risiko, dass Use Cases durch automatische Formulierung professioneller wirken, als sie fachlich ausgearbeitet sind Datenschutz und Vertraulichkeit müssen berücksichtigt werden, wenn sensible Prozess- oder Systeminformationen eingegeben werden', 'Hybrid', 'Zeitersparnis bei der Erfassung und Formulierung der Cases um ca. 1h pro Case bei gleichzeitig detailreichen Beschreibung eines Cases', 'Schnelle Erfassbarkeit der Cases',
  '', 'Medium', 'Skill 2 - Ambassador', 'CIC09', '140014 CIC',
  (select id from teams where kostenstelle_code = '140014 CIC' and name = 'AI Services')
where not exists (select 1 from ideas where catalog_id = 'CIC09');

insert into ideas (
  created_by, quick_note, problem, goal, business_benefit,
  status, ai_role, tools, systeme, input_source, output_result,
  considerations, kpi_kind, quantified_benefit, qualitative_benefit,
  comment, list_priority, skill_level, catalog_id, department, team_id
)
select
  (select id from auth.users where email = 'd.goos@house-of-communication.com'),
  'GSS Agent Optimierung', 'Der bestehende GSS Agent wird bereits regelmäßig von Kollegen genutzt und ist damit ein wichtiger Zugang zu Wissen aus Group Shared Services. Allerdings basiert der Agent aktuell auf vielen einzelnen Quellen aus weNet / SharePoint. Diese Inhalte sind: - teilweise nicht aktuell - teilweise widersprüchlich - teilweise unübersichtlich strukturiert Das führt dazu, dass der Agent: - uneindeutige oder widersprüchliche Antworten gibt - nicht immer die neuesten Informationen nutzt - und dadurch der Nutzer an Vertrauen verliert Zusätzlich ist die Pflege der Inhalte aktuell sehr aufwendig, da viele einzelne Quellen manuell angebunden sind und die Seitenstruktur keine einfache Durchsuchbarkeit (z. B. von Unterseiten) erlaubt. Widersprüchliche Informationen im System Veraltete Inhalte Zu viele verstreute Einzelquellen Hoher manueller Pflegeaufwand Fehlende klare Verantwortlichkeiten Begrenzte technische Struktur (z. B. keine Unterseitendurchsuchung) Sinkendes Vertrauen in den Agent bei falschen An…', 'Genauere und verlässlichere Antworten des GSS Agents Klare Strukturierung der Inhalte nach Abteilungen Reduzierter Pflegeaufwand für Quellen Höheres Vertrauen und stärkere Nutzung durch die Mitarbeitenden', 'Bessere Antwortqualität → weniger Verwirrung bei Nutzern Schneller Zugang zu relevanten Infos → weniger Nachfragen bei Kollegen Einfachere Pflege der Inhalte → klare Verantwortlichkeiten je Abteilung Höhere Akzeptanz von KI im Unternehmen Skalierbarkeit → neue Abteilungen können leicht ergänzt werden',
  'done', 'Automatisieren', 'Weiterentwicklung des bestehenden Copilot Studio Agents Aufteilung in mehrere Subagenten je Fachbereich (z. B. HR, IT, Finance, CIC etc.) Jeder Subagent greift nur auf seine klar definierten Quellen zu', 'MS 365: SharePoint, Copilot Studios', 'Dokumente, Seiten und Dateien aus weNet / SharePoint Abteilungsspezifische Inhalte (Policies, Prozesse, FAQs etc.) Klar definierte und gepflegte Quellen je Subagent', 'Chatbot: Klare, verständliche Antworten auf Nutzerfragen Weniger widersprüchliche Aussagen Relevant auf den jeweiligen Fachbereich zugeschnittene Informationen',
  'Quellen bleiben weiterhin unaktuell → schlechte Antworten bleiben bestehen Uneinheitliche Pflege zwischen Abteilungen Zu viele Subagenten könnten Nutzer verwirren (wenn nicht sauber strukturiert) Governance fehlt → Qualität sinkt langfristig wieder', 'Quality', '', 'Vertrauen in den Agent Nutzerzufriedenheit wahrgenommene Qualität der Antworten Klarheit der Informationen',
  '', 'in using', '', 'CIC08', '140014 CIC',
  (select id from teams where kostenstelle_code = '140014 CIC' and name = 'AI Services')
where not exists (select 1 from ideas where catalog_id = 'CIC08');
