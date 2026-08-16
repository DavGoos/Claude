# AI Use-Case Sammlung

Eine kleine App, um AI-Ideen sekundenschnell zu erfassen und später mit
KI-Unterstützung zu bewerten und auszuarbeiten. Läuft als Web-App, die man
sich aufs Handy holt wie eine normale App (kein App Store nötig).

Es gibt **keinen eigenen Server**, den ihr betreiben müsst – nur drei fertige
Bausteine, die einmalig eingerichtet werden:

1. **Supabase** (kostenloser Baukasten für Login + Datenbank + kleine Server-Funktion)
2. **Ein Claude API-Key** (für die KI-Ausarbeitung)
3. **GitHub Pages** (kostenloses Hosting für diese Web-App)

Die Einrichtung dauert einmalig ca. 20–30 Minuten. Danach nutzt ihr die App
einfach.

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

## Schritt 3: KI-Funktion einrichten

Damit "Mit KI ausarbeiten" funktioniert, braucht Supabase Zugriff auf die
Claude API. Das läuft über eine kleine, fertig vorbereitete Funktion
(`supabase/functions/elaborate-idea`), die du einmalig hochlädst.

1. Falls noch nicht vorhanden: [Node.js](https://nodejs.org) installieren (wird nur für den Upload-Befehl benötigt).
2. Hole dir einen Claude API-Key auf [console.anthropic.com](https://console.anthropic.com) (unter "API Keys", etwas Guthaben aufladen reicht für sehr viele Nutzungen).
3. Öffne ein Terminal im Projektordner und führe aus:

   ```bash
   npx supabase login
   npx supabase link --project-ref DEIN-PROJEKT-REF
   npx supabase secrets set ANTHROPIC_API_KEY=dein-claude-api-key
   npx supabase functions deploy elaborate-idea
   ```

   Den `DEIN-PROJEKT-REF` findest du in Supabase unter "Project Settings ->
   General" ("Reference ID").

Das war der einzige "technische" Schritt – danach läuft alles automatisch.

## Schritt 4: App online stellen (GitHub Pages)

1. Auf GitHub im Repository: **Settings -> Pages**.
2. Bei "Source" den Branch auswählen, auf dem dieser Code liegt (aktuell
   `claude/ai-usecase-collection-app-ldxcdk`, nach dem Zusammenführen ggf. `main`), Ordner `/ (root)`.
3. Speichern. Nach 1–2 Minuten ist die App unter der angezeigten Adresse
   erreichbar (z.B. `https://dein-name.github.io/dein-repo/`).

## Schritt 5: App aufs Handy holen

1. Öffne den Link aus Schritt 4 im Handy-Browser (Safari bei iPhone, Chrome bei Android).
2. Tippe auf **"Zum Home-Bildschirm"** (iPhone) bzw. **"App installieren"** (Android).
3. Fertig – die App hat jetzt ein eigenes Icon auf dem Home-Bildschirm.

## Schritt 6: Login & Kollegen einladen

- Login läuft ohne Passwort: E-Mail eingeben, es kommt ein Link per Mail, draufklicken – fertig.
- Jede:r, der/die den App-Link kennt und sich per E-Mail einloggt, sieht die
  gleiche gemeinsame Ideen-Liste. Teile den Link also nur mit den
  Kolleg:innen, die mitmachen sollen.
- Wächst das Team stark oder braucht ihr getrennte Bereiche pro Team, lässt
  sich das später ergänzen (eigene Tabelle/Berechtigungen) – für den Start
  reicht die gemeinsame Liste.

---

## Was die App kann

- **Schnell erfassen**: Kurznotiz eintippen, speichern – fertig.
- **Später ausarbeiten**: Beschreibung, Tags, Status pro Idee ergänzen.
- **Bewerten**: Nutzen / Machbarkeit / Aufwand / Risiko einschätzen, die App
  zeigt direkt eine Einordnung ("Quick Win", "Großes Projekt", ...).
- **Mit KI ausarbeiten**: Ein Klick generiert einen Beschreibungsvorschlag,
  passende Tools, wichtige Punkte vorab und einen fertigen Start-Prompt für
  den eigentlichen Projektstart.
- **Gemeinsam nutzen**: Mehrere Kolleg:innen loggen sich ein und sehen/bearbeiten dieselbe Liste.

## Projektstruktur

```
index.html                          Haupt-App
css/style.css                       Design
js/config.js                        Supabase-Zugangsdaten (Schritt 2)
js/app.js                           App-Logik
manifest.json, sw.js, icons/        PWA-Grundlagen (Installierbarkeit)
supabase/schema.sql                 Datenbank-Struktur
supabase/functions/elaborate-idea/  KI-Funktion (Claude API Aufruf)
```
