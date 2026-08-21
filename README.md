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

Ohne diesen Schritt landet der Bestätigungs- bzw. Passwort-Reset-Link aus
der E-Mail auf einer falschen Adresse ("localhost") statt in eurer App.

1. Im Supabase-Dashboard zu **Authentication -> URL Configuration**.
2. **Site URL** auf die Adresse aus Schritt 3 setzen, z.B.
   `https://dein-name.github.io/dein-repo/`.
3. Unter **Redirect URLs** eine Zeile hinzufügen:
   `https://dein-name.github.io/dein-repo/**`
4. Speichern.

## Schritt 5: App aufs Handy holen

1. Öffne den Link aus Schritt 3 im Handy-Browser (Safari bei iPhone, Chrome bei Android).
2. Tippe auf **"Zum Home-Bildschirm"** (iPhone) bzw. **"App installieren"** (Android).
3. Fertig – die App hat jetzt ein eigenes Icon auf dem Home-Bildschirm.

## Schritt 6: Login & Kollegen einladen

- Erstanmeldung: Auf **"Registrieren"** tippen, E-Mail + Passwort vergeben.
  Danach kommt **einmalig** eine Bestätigungsmail – den Link darin antippen.
- Ab dann läuft der Login rein über E-Mail + Passwort, ganz ohne weitere
  Mails. Nur bei "Passwort vergessen?" wird nochmal eine E-Mail nötig.
- **Zugriff ist auf zwei Arten geschützt:**
  1. **Domain-Sperre**: Nur E-Mail-Adressen mit `@house-of-communication.com`
     können sich überhaupt registrieren (fest im Datenbank-Skript
     hinterlegt – bei einer anderen Firmendomain in `supabase/schema.sql`
     nach `house-of-communication` suchen und ersetzen).
  2. **Admin-Freigabe**: Nach der E-Mail-Bestätigung sieht die Person noch
     keine Daten, sondern einen "Warten auf Freigabe"-Bildschirm. Der Admin
     (**d.goos@house-of-communication.com**, automatisch beim ersten Login
     als Admin markiert) sieht oben rechts einen Button **"🛡 Freigaben"**,
     dort die wartende Person freischalten – danach hat sie normalen
     Zugriff.
- Wächst das Team stark oder braucht ihr getrennte Bereiche pro Team, lässt
  sich das später ergänzen (eigene Tabelle/Berechtigungen) – für den Start
  reicht die gemeinsame Liste.
- Der Mailversand steht weiterhin auf Supabases test-tauglichem,
  stark gedrosseltem Standardversand (siehe vorheriger Hinweis zum
  "email rate limit"). Bei mehreren Kolleg:innen, die sich kurz
  hintereinander registrieren, kann das Limit erneut greifen – dann
  hilft nur abwarten oder ein eigener SMTP-Dienst wie Resend.

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
  – geschützt durch Domain-Sperre + Admin-Freigabe (siehe Schritt 6).
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
- **Abteilung & Team pflichtig**: Sowohl bei Ideen als auch bei Prozessen
  müssen Abteilung und Team aus einem Dropdown gewählt werden (auch schon
  beim schnellen Erfassen). Die erlaubten Werte stehen in `js/app.js` in
  den Konstanten `DEPARTMENT_OPTIONS` und `TEAM_OPTIONS` – zum Erweitern
  (z.B. neue Abteilung) einfach dort einen Eintrag ergänzen und die Datei
  neu deployen (git push), keine Datenbank-Änderung nötig.
- **Deutsch/Englisch umschalten**: Ein Sprachschalter (DE/EN-Knopf oben
  rechts, u.a. auf dem Login-Bildschirm und den beiden Haupt-Listen)
  übersetzt die komplette Oberfläche inkl. der von der KI angefragten
  Sprache. Die Einstellung wird pro Gerät gespeichert.
- **Katalog-Abgleich (optional)**: In der Idee-Detailansicht gibt es einen
  ausklappbaren Bereich "Weitere Katalog-Felder" (KI-Rolle, Input, Output,
  Kind of KPI, quantifizierter/qualitativer Nutzen, Kommentar, Priorität
  laut Liste) – für den geplanten Abgleich mit dem bestehenden
  Excel-Use-Case-Katalog. Optional, nicht nötig für die normale Nutzung.

## Projektstruktur

```
index.html                Haupt-App
css/style.css             Design
js/config.js              Supabase-Zugangsdaten (Schritt 2)
js/app.js                 App-Logik inkl. direktem Claude/OpenAI API Aufruf
manifest.json, sw.js, icons/   PWA-Grundlagen (Installierbarkeit)
supabase/schema.sql       Datenbank-Struktur (Ideen + Prozesse inkl. Teilprozess-Hierarchie)
```
