# Process- & AI-Usecase Management

Eine kleine App, um die Prozesse eures Bereichs zu dokumentieren, sie auf
AI-Potenzial zu prüfen und AI-Use-Case-Ideen sekundenschnell zu erfassen,
euren Prozessen zuzuordnen und später mit KI-Unterstützung zu bewerten und
auszuarbeiten. Läuft als Web-App, die man sich aufs Handy holt wie eine
normale App (kein App Store nötig).

Es gibt **keinen eigenen Server**, den ihr betreiben müsst – nur zwei fertige
Bausteine, die einmalig eingerichtet werden:

1. **Supabase** (kostenloser Baukasten für Login + Datenbank)
2. **GitHub Pages** (kostenloses Hosting für diese Web-App)

Die Einrichtung dauert einmalig ca. 15–20 Minuten. Danach nutzt ihr die App
einfach. Für die KI-Ausarbeitung hinterlegt später jede:r Nutzer:in optional
einen eigenen API-Key (Claude oder OpenAI, frei wählbar) direkt in der App
(siehe unten) – dafür ist keine weitere Einrichtung durch dich nötig.

---

## Schritt 1: Supabase-Projekt anlegen

1. Gehe auf [supabase.com](https://supabase.com) und erstelle ein kostenloses Konto.
2. Klicke auf **"New Project"**. Name frei wählbar (z.B. `ai-ideen`), Passwort merken/notieren.
3. Warte, bis das Projekt fertig eingerichtet ist (ca. 2 Minuten).

## Schritt 2: Datenbank einrichten

1. Klicke links im Menü auf **"SQL Editor"**.
2. Öffne die Datei [`supabase/schema.sql`](supabase/schema.sql) aus diesem Projekt, kopiere den
   gesamten Inhalt und füge ihn im SQL Editor ein.
3. Klicke auf **"Run"**. Das legt die Tabelle für die Ideen an.
4. Gehe links auf **"Project Settings" -> "API"**. Dort findest du:
   - **Project URL**
   - **anon public** Key
5. Öffne die Datei [`js/config.js`](js/config.js) in diesem Projekt und trage beide Werte ein:

   ```js
   window.APP_CONFIG = {
     SUPABASE_URL: "https://xxxxxxx.supabase.co",
     SUPABASE_ANON_KEY: "eyJhbGciOi...",
   };
   ```

## Schritt 3: App online stellen (GitHub Pages)

GitHub Pages ist bei privaten Repos nur mit einem kostenpflichtigen
GitHub-Plan möglich. Ist euer Repo privat und ihr habt keinen solchen Plan,
müsst ihr es zuerst öffentlich machen (Settings -> ganz unten "Danger Zone"
-> "Change visibility"). Im Code liegen keine Geheimnisse (der anon-Key ist
bewusst öffentlich nutzbar, siehe Schritt 2), das ist also unbedenklich.

1. Auf GitHub im Repository: **Settings -> Pages**.
2. Bei "Source" den Branch auswählen, auf dem dieser Code liegt (aktuell
   `claude/ai-usecase-collection-app-ldxcdk`, nach dem Zusammenführen ggf. `main`), Ordner `/ (root)`.
3. Speichern. Nach 1–2 Minuten ist die App unter der angezeigten Adresse
   erreichbar (z.B. `https://dein-name.github.io/dein-repo/`). Diese Adresse
   brauchst du gleich in Schritt 4.

## Schritt 4: Login-Adresse bei Supabase eintragen

Relevant, sobald irgendein Auth-Link per E-Mail versendet wird (z.B. bei
einem später ergänzten eigenen SMTP-Dienst, siehe Schritt 5) – ohne
diesen Schritt würde ein solcher Link auf eine falsche Adresse
("localhost") zeigen statt in eure App. Mit dem Standard-Ablauf ohne
eigenen SMTP-Dienst schickt die App aktuell keine solchen Links; diesen
Schritt kannst du also auch erst später nachholen.

1. Im Supabase-Dashboard zu **Authentication -> URL Configuration**.
2. **Site URL** auf die Adresse aus Schritt 3 setzen, z.B.
   `https://dein-name.github.io/dein-repo/`.
3. Unter **Redirect URLs** eine Zeile hinzufügen:
   `https://dein-name.github.io/dein-repo/**`
4. Speichern.

## Schritt 5: E-Mail-Bestätigung bei der Registrierung abschalten

Supabases eingebauter Mailversand (ohne eigenen SMTP-Server) verschickt
Auth-Mails inzwischen **nur noch an E-Mail-Adressen, die selbst Mitglied
eurer Supabase-Organisation sind** – nicht an beliebige Kolleg:innen, die
sich über die App registrieren. Ohne diesen Schritt bekommt so gut wie
niemand außer dir die Bestätigungsmail, und die Registrierung bleibt
hängen.

1. Im Supabase-Dashboard zu **Authentication -> Sign In / Providers ->
   Email**.
2. **"Confirm email"** deaktivieren und speichern.
3. Damit läuft die Registrierung sofort ohne Bestätigungsmail – Schutz
   bleibt trotzdem bestehen durch die Domain-Sperre und die Admin-Freigabe
   (siehe Schritt 7).

Restrisiko: Damit wird nicht mehr geprüft, ob die eingetippte Adresse
wirklich der eigenen Person gehört. Für ein kleines internes Team mit
Domain-Sperre + Admin-Freigabe ist das vertretbar.

**Passwort vergessen läuft komplett ohne E-Mail:** Der
"Passwort vergessen?"-Button in der App versucht erst gar nicht, eine
Mail zu versenden (die würde ohnehin an derselben Einschränkung
scheitern) – er zeigt direkt einen Hinweis, sich bei dir als Admin zu
melden. Der "Passwort zurücksetzen"-Button im Supabase-Dashboard selbst
hilft dabei *nicht*, der löst genau die blockierte Mail aus. Stattdessen
setzt du als Admin das Passwort direkt über die Supabase-Admin-API, ganz
ohne Mail:

1. Im **SQL Editor** die User-ID der Person ermitteln:
   ```sql
   select id from auth.users where email = 'kollege@house-of-communication.com';
   ```
2. Unter **Project Settings -> API** deinen **service_role**-Key kopieren
   (geheim halten, nirgends veröffentlichen).
3. Auf deinem eigenen Rechner im Terminal (nicht in der App, nicht mit
   Claude teilen):
   ```
   curl -X PUT 'https://<project-ref>.supabase.co/auth/v1/admin/users/<user-id>' \
     -H 'apikey: <service-role-key>' \
     -H 'Authorization: Bearer <service-role-key>' \
     -H 'Content-Type: application/json' \
     -d '{"password": "EinTemporaeresPasswort123"}'
   ```
4. Das temporäre Passwort an die Person weitergeben. Sie kann es nach dem
   Einloggen unter ⚙ Einstellungen selbst durch ein eigenes ersetzen.

Optional für später: Mit einem eigenen SMTP-Dienst (z.B.
[Resend](https://resend.com), kostenlos für kleine Mengen) unter
**Authentication -> Sign In / Providers -> SMTP Provider** ließe sich
"Passwort vergessen" auch wieder auf echten, selbstständigen
E-Mail-Versand umstellen, ganz ohne Admin-Beteiligung – dafür müsste der
"Passwort vergessen?"-Button in `js/app.js` (`forgotBtn`-Handler in
`renderLogin`) wieder auf `sb.auth.resetPasswordForEmail(...)`
umgestellt werden.

## Schritt 6: App aufs Handy holen

1. Öffne den Link aus Schritt 3 im Handy-Browser (Safari bei iPhone, Chrome bei Android).
2. Tippe auf **"Zum Home-Bildschirm"** (iPhone) bzw. **"App installieren"** (Android).
3. Fertig – die App hat jetzt ein eigenes Icon auf dem Home-Bildschirm.

## Schritt 7: Login & Kollegen einladen

- Erstanmeldung: Auf **"Registrieren"** tippen, E-Mail + Passwort vergeben
  – dank Schritt 5 ist man sofort angemeldet, ganz ohne Bestätigungsmail.
- **Zugriff ist auf zwei Arten geschützt:**
  1. **Domain-Sperre**: Nur E-Mail-Adressen mit `@house-of-communication.com`
     können sich überhaupt registrieren (fest im Datenbank-Skript
     hinterlegt – bei einer anderen Firmendomain in `supabase/schema.sql`
     nach `house-of-communication` suchen und ersetzen).
  2. **Admin-Freigabe**: Nach der Registrierung sieht die Person noch
     keine Daten, sondern einen "Warten auf Freigabe"-Bildschirm. Der Admin
     (**d.goos@house-of-communication.com**, automatisch beim ersten Login
     als Admin markiert) sieht oben rechts einen Button **"🛡 Freigaben"**,
     dort die wartende Person freischalten – danach hat sie normalen
     Zugriff. Statt "Freigeben" kann der Admin auch **"Ablehnen"** wählen
     (mit Sicherheitsabfrage) – die Registrierung verschwindet dann
     dauerhaft aus der Warteliste, die Person bleibt ohne Zugriff. Das ist
     nicht rückgängig zu machen: Rückgängig wäre nur über einen direkten
     Datenbank-Eingriff möglich (`update profiles set is_rejected = false
     where email = '...'` im SQL Editor).
- Wächst das Team stark oder ihr braucht mehr als die 5 vorgesehenen Teams,
  lässt sich das jederzeit erweitern (`TEAM_OPTIONS` in `js/app.js`, siehe
  "Was die App kann" unten) – für die feingranulare Zugriffssteuerung pro
  Kostenstelle/Team siehe den Punkt "Kostenstellen- & Team-Zugriff" unten.

## KI-Ausarbeitung: Standardweg braucht keinen API-Key

Bei einer Idee auf **"📋 Prompt erzeugen"** tippen, den Text kopieren und in
ein beliebiges KI-Chat-Tool einfügen, das ihr ohnehin schon nutzt – Copilot,
ChatGPT (kostenlose Version), Claude.ai, Gemini, völlig egal. Die Antwort
der KI kopiert ihr zurück in das Feld "Antwort der KI hier einfügen" und
tippt auf "Übernehmen". Keine Anmeldung bei einem Entwickler-Portal, kein
Guthaben, keine Kreditkarte nötig.

### Optional: automatische Ausarbeitung mit eigenem API-Key

Wer statt Copy & Paste einen einzigen Klick möchte, kann zusätzlich einen
eigenen API-Key hinterlegen (unter dem Zahnrad ⚙ → "Stattdessen automatisch
mit eigenem API-Key" bei der Idee ausklappen). Wichtig dabei:

- **Ein bestehendes Claude- oder ChatGPT-Abo deckt das nicht ab.** Der
  API-Zugang (console.anthropic.com bzw. platform.openai.com) ist ein
  eigenständiges, separat abgerechnetes Angebot, unabhängig vom Chat-Abo –
  auch mit Abo muss man dort ein kleines Guthaben aufladen (wenige Euro
  reichen für sehr viele Nutzungen).
- Der Key wird ausschließlich lokal auf dem jeweiligen Handy gespeichert
  und bei der Anfrage direkt an den gewählten Anbieter geschickt – nie über
  einen gemeinsamen Server, andere Kolleg:innen sehen ihn nicht.
- Jede Person entscheidet unabhängig, ob und welchen Anbieter (Claude oder
  OpenAI) sie dafür nutzen möchte.

Beide Wege sind komplett optional zueinander – ohne irgendetwas davon
funktioniert die App ganz normal weiter, nur eben ohne die KI-Ausarbeitung.

---

## Was die App kann

- **Schnell erfassen**: Kurznotiz eintippen, speichern – fertig.
- **Später ausarbeiten**: Beschreibung, Tags, Status pro Idee ergänzen.
- **Bewerten**: Nutzen / Machbarkeit / Aufwand / Risiko einschätzen, die App
  zeigt direkt eine Einordnung ("Quick Win", "Großes Projekt", ...).
- **Mit KI ausarbeiten**: Erzeugt einen fertigen Prompt zum Einfügen in ein
  beliebiges KI-Chat-Tool (Copilot, ChatGPT, Claude, Gemini, ...) – kein
  API-Key nötig. Die Antwort kopiert man zurück und übernimmt daraus
  Beschreibung, Tools, wichtige Punkte vorab und einen Start-Prompt.
  Optional geht das auch automatisch mit einem eigenen API-Key (siehe unten).
- **Gemeinsam nutzen**: Mehrere Kolleg:innen loggen sich ein und sehen/bearbeiten dieselbe Liste
  – geschützt durch Domain-Sperre + Admin-Freigabe (siehe Schritt 7).
- **Am PC nutzen**: Läuft genauso im Desktop-Browser, das Layout passt sich
  automatisch an breitere Bildschirme an.
- **Prozesse dokumentieren**: Im Tab "Prozesse" alle Abläufe eures Bereichs
  erfassen und mit einer AI-Potenzial-Einschätzung versehen.
- **Teilprozesse strukturieren**: Jeder Prozess kann optional einem
  übergeordneten Gesamtprozess zugeordnet werden; die Detailansicht zeigt
  alle Teilprozesse eines übergeordneten Prozesses.
- **Use Cases zu Prozessen zuordnen**: Jede Idee kann optional einem Prozess
  zugeordnet werden; in der Prozess-Detailansicht seht ihr alle dazu bereits
  erfassten Use Cases.
- **Kostenstelle & Team pflichtig**: Sowohl bei Ideen als auch bei Prozessen
  müssen Kostenstelle und Team aus einem Dropdown gewählt werden (auch
  schon beim schnellen Erfassen). Team-Werte stehen in `js/app.js` in der
  Konstante `TEAM_OPTIONS` – zum Erweitern einfach dort einen Eintrag
  ergänzen und die Datei neu deployen (git push), keine
  Datenbank-Änderung nötig. Kostenstellen kommen dagegen aus der
  Datenbank (Tabelle `kostenstellen`) und werden über die
  Verwaltungsoberfläche gepflegt, siehe nächster Punkt.
- **Kostenstellen- & Team-Zugriff (🛡 Freigaben)**: Der Admin legt im
  Freigaben-Bereich neue Kostenstellen an und weist jeder freigegebenen
  Person Zugriff zu – und zwar pro Kombination aus Kostenstelle **und**
  Team, nicht nur pro Kostenstelle. Jede Kostenstellen-Karte zeigt dafür
  mehrere Unterbereiche: **"Alle Teams (ganze Kostenstelle)"** ganz oben,
  darunter je ein Unterbereich pro einzelnem Team (Group Controlling,
  Treasury, Cost Allocation, Workforce Controlling, BI-Strategy). Pro
  Person und Unterbereich lässt sich einstellen: **Kein Zugriff**
  (Standard – nichts sichtbar), **Nur Lesen** oder **Lesen & Schreiben**.
  Ein Zugriff im Unterbereich "Alle Teams" gilt automatisch für alle
  Teams dieser Kostenstelle; ein zusätzlicher Zugriff bei einem einzelnen
  Team wirkt nur für genau dieses Team. Damit lässt sich z.B. jemandem
  Schreibzugriff nur für "BI-Strategy" innerhalb der Kostenstelle
  "050005 CO" geben, ohne die übrigen vier Teams dieser Kostenstelle
  mitzugeben. Der Admin selbst sieht und bearbeitet unabhängig davon
  immer alles. **Wichtig für den Ablauf:** Freigeben (🛡 Freigaben →
  "Freigeben") reicht allein nicht mehr aus – ohne mindestens einen
  zugewiesenen Kostenstelle/Team-Zugriff sieht eine frisch freigegebene
  Person eine leere Ideen-/Prozessliste und kann nichts anlegen.
  Zugriffs-Änderungen wirken bei bereits eingeloggten Personen erst nach
  einem Neuladen der Seite bzw. erneuten Login.
- **Deutsch/Englisch umschalten**: Ein Sprachschalter (DE/EN-Knopf oben
  rechts, u.a. auf dem Login-Bildschirm und den beiden Haupt-Listen)
  übersetzt die komplette Oberfläche inkl. der von der KI angefragten
  Sprache. Die Einstellung wird pro Gerät gespeichert. Zusätzlich zeigt
  der Schalter für Ideen/Prozesse mit hinterlegter Übersetzung (siehe
  "Zweisprachige Inhalte" unten) auch die erfassten Inhalte selbst auf
  Englisch, nicht nur Buttons/Bezeichnungen.
- **Zweisprachige Inhalte**: Die wichtigsten Freitextfelder (Kurznotiz,
  Problem, Ziel, Business Benefit, Wichtige Gedanken vorab, Qualitativer
  Nutzen, Kommentar bei Ideen; Name, Beschreibung, Notizen bei Prozessen)
  haben im Hintergrund eine zusätzliche, unsichtbare Übersetzungsspalte.
  Es gibt **keine automatische Live-Übersetzung** in der App – dafür
  reicht es einfach im Chat mit Claude Bescheid zu geben (z.B. "Übersetze
  bitte den Case GC29 ins Englische" oder "Übersetze alle offenen
  Ideen"), Claude liefert dann fertige `update`-Statements zum Einfügen
  im SQL Editor. Ist eine Übersetzung hinterlegt, zeigt die App sie bei
  EN automatisch an – das jeweilige Feld ist dann aber nur lesbar (kein
  versehentliches Überschreiben des deutschen Originals); zum Bearbeiten
  einfach auf Deutsch (DE) umschalten. Ohne Übersetzung wird ganz normal
  das deutsche Original angezeigt, auch auf Englisch – nichts bleibt je
  leer. Der 🔄 Export in die AI Ambassadors Usecase-Collection nutzt
  bewusst immer das deutsche Original, unabhängig vom Sprachschalter.
- **Hell-/Dunkelmodus umschalten**: Ein weiterer Knopf oben rechts (☀️/🌙)
  wechselt zwischen Dunkelmodus (Standard, Akzent Smaragdgrün) und
  Hellmodus (Akzent Sonnengelb/Bernstein). Die Einstellung wird ebenfalls
  pro Gerät gespeichert.
- **Problem / Ziel / Business Benefit getrennt**: Statt einem einzigen
  Beschreibungsfeld gibt es drei eigene Felder, die exakt den Spalten der
  zentralen AI Ambassadors Usecase-Collection entsprechen. Das macht das
  spätere Übertragen eindeutig (kein Raten mehr nötig, wie der Text
  aufzuteilen ist).
- **Katalog-Abgleich (optional)**: In der Idee-Detailansicht gibt es einen
  ausklappbaren Bereich "Weitere Katalog-Felder" (Katalog-ID, KI-Rolle,
  Input, Output, Kind of KPI, quantifizierter/qualitativer Nutzen,
  Kommentar, Priorität laut Liste) – für den Abgleich mit der zentralen
  AI Ambassadors Usecase-Collection (der SharePoint-Excel-Datei). Für die
  tägliche Nutzung optional – wer eine Idee aber später per 🔄 Export als
  Case in die Collection kopieren will, sollte genau diese Felder vorher
  ausfüllen, da sie dort die eigentlichen Inhaltsspalten sind. Die
  Katalog-ID (z.B. "GC29") muss eindeutig sein und dient als Schlüssel für
  spätere Abgleiche zwischen App und Collection.
- **Usecase-Geber / Ansprechpartner**: Direkt im Hauptbereich jeder Idee
  lässt sich der Name der verantwortlichen Person hinterlegen, damit klar
  ist, wer bei Rückfragen anzusprechen ist.
- **In die AI Ambassadors Usecase-Collection kopieren (🔄 Export, für alle
  sichtbar)**: Zeigt alle Ideen ohne Katalog-ID, also solche, die noch
  nicht in der Collection stehen. **Reines Copy & Paste** – nichts wird
  automatisch geschrieben oder synchronisiert. Über "Tab-getrennt
  (Excel-Zeile)" wird eine fertige Zeile in der exakten Spaltenreihenfolge
  der Collection in die Zwischenablage kopiert, zum direkten Einfügen
  (Strg+V) in eine neue Zeile dort. Alternativ "Kopieren" für einen
  lesbaren Textblock, z.B. zum Posten in den Chat mit Claude, wenn man
  beim Einordnen Unterstützung möchte (Claude kann die Datei aus
  technischen Gründen nicht selbst beschreiben, nur den Text dafür
  vorbereiten). Nach dem Eintragen die vergebene GC-Nummer als Katalog-ID
  bei der Idee eintragen, danach taucht sie hier nicht mehr auf. Der
  umgekehrte Weg (Import aus der Collection in die App) läuft über den
  Chat mit Claude: Case-Nummer(n) nennen, Claude liest sie aus der
  Collection und erzeugt SQL zum Einfügen in Supabase.
- **Onboarding-Anleitung fest in der Kopfzeile**: Der Button "📋 Anleitung"
  oben bei den Ideen und Prozessen (nach der Anmeldung) verlinkt auf eine
  kurze, für Kolleg:innen gedachte Erklärseite (was die App kann, wie man
  Zugriff bekommt, wie man sie aufs eigene Gerät holt). Damit der Link für
  alle ohne eigenen Claude-Zugang funktioniert, muss die Seite einmalig
  über deren eigenes Teilen-Menü auf "Für alle mit Link zugänglich"
  gestellt werden.
- **Prozesse und Ideen als ein-/ausklappbarer Baum**: Teilprozesse hängen
  in der Prozess-Liste sichtbar unter ihrem übergeordneten Prozess und
  lassen sich per Pfeil ein-/ausklappen. Bei Ideen gilt das Gleiche für die
  Stufenkette, nur umgekehrt: die jeweils neueste Entwicklungsstufe steht
  oben in der Liste, die Vorstufen hängen als ausklappbare Kinder darunter.

## Projektstruktur

```
index.html                Haupt-App
css/style.css             Design
js/config.js              Supabase-Zugangsdaten (Schritt 2)
js/app.js                 App-Logik inkl. direktem Claude/OpenAI API Aufruf
manifest.json, sw.js, icons/   PWA-Grundlagen (Installierbarkeit)
supabase/schema.sql       Datenbank-Struktur (Ideen inkl. Stufenketten + Prozesse inkl. Teilprozess-Hierarchie)
```
