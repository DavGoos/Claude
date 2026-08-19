# AI Use-Case Sammlung

Eine kleine App, um AI-Ideen sekundenschnell zu erfassen, sie euren
Geschäftsprozessen zuzuordnen und später mit KI-Unterstützung zu bewerten
und auszuarbeiten. Läuft als Web-App, die man sich aufs Handy holt wie eine
normale App (kein App Store nötig).

Es gibt **keinen eigenen Server**, den ihr betreiben müsst – nur zwei fertige
Bausteine, die einmalig eingerichtet werden:

1. **Supabase** (kostenloser Baukasten für Login + Datenbank)
2. **GitHub Pages** (kostenloses Hosting für diese Web-App)

Die Einrichtung dauert einmalig ca. 15–20 Minuten. Danach nutzt ihr die App
einfach. Für die KI-Ausarbeitung hinterlegt später jede:r Nutzer:in optional
einen eigenen Claude API-Key direkt in der App (siehe unten) – dafür ist
keine weitere Einrichtung durch dich nötig.

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

Ohne diesen Schritt landet der Login-Link aus der E-Mail auf einer
falschen Adresse ("localhost") statt in eurer App.

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

- Login läuft ohne Passwort: E-Mail eingeben, es kommt ein Link per Mail, draufklicken – fertig.
- Jede:r, der/die den App-Link kennt und sich per E-Mail einloggt, sieht die
  gleiche gemeinsame Ideen-Liste. Teile den Link also nur mit den
  Kolleg:innen, die mitmachen sollen.
- Wächst das Team stark oder braucht ihr getrennte Bereiche pro Team, lässt
  sich das später ergänzen (eigene Tabelle/Berechtigungen) – für den Start
  reicht die gemeinsame Liste.

## Eigenen Claude API-Key hinterlegen (für "Mit KI ausarbeiten")

Dieser Schritt ist **optional** und macht jede Person für sich selbst,
direkt in der App – nicht du als Ersteller:in einmalig für alle:

1. Key auf [console.anthropic.com](https://console.anthropic.com) erstellen
   ("API Keys", etwas Guthaben aufladen reicht für sehr viele Nutzungen).
2. In der App oben rechts auf das Zahnrad-Symbol (⚙) tippen.
3. Key einfügen, "Speichern" tippen. Fertig.

Der Key wird ausschließlich lokal auf dem jeweiligen Handy gespeichert und
bei der KI-Anfrage direkt an Claude geschickt – er läuft nie über einen
gemeinsamen Server und andere Kolleg:innen sehen ihn nicht. Ohne Key
funktioniert die App ganz normal weiter, nur der Button "Mit KI
ausarbeiten" zeigt dann einen Hinweis, den Key zu ergänzen.

---

## Was die App kann

- **Schnell erfassen**: Kurznotiz eintippen, speichern – fertig.
- **Später ausarbeiten**: Beschreibung, Tags, Status pro Idee ergänzen.
- **Bewerten**: Nutzen / Machbarkeit / Aufwand / Risiko einschätzen, die App
  zeigt direkt eine Einordnung ("Quick Win", "Großes Projekt", ...).
- **Mit KI ausarbeiten**: Ein Klick generiert einen Beschreibungsvorschlag,
  passende Tools, wichtige Punkte vorab und einen fertigen Start-Prompt für
  den eigentlichen Projektstart (braucht einen eigenen, kostenlos in der
  App hinterlegten Claude API-Key, siehe unten).
- **Gemeinsam nutzen**: Mehrere Kolleg:innen loggen sich ein und sehen/bearbeiten dieselbe Liste.
- **Prozesse dokumentieren**: Im Tab "Prozesse" alle Abläufe eures Bereichs
  erfassen und mit einer AI-Potenzial-Einschätzung versehen.
- **Use Cases zu Prozessen zuordnen**: Jede Idee kann optional einem Prozess
  zugeordnet werden; in der Prozess-Detailansicht seht ihr alle dazu bereits
  erfassten Use Cases.

## Projektstruktur

```
index.html                Haupt-App
css/style.css             Design
js/config.js              Supabase-Zugangsdaten (Schritt 2)
js/app.js                 App-Logik inkl. direktem Claude API Aufruf
manifest.json, sw.js, icons/   PWA-Grundlagen (Installierbarkeit)
supabase/schema.sql       Datenbank-Struktur (Ideen + Prozesse)
```
