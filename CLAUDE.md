# Hinweise für Claude

- Wenn eine Datei erzeugt oder geändert wird, die zum Ausführen/Kopieren
  durch die Nutzerin/den Nutzer gedacht ist (z.B. SQL-Skripte wie
  `supabase/schema.sql` oder `supabase/import_*.sql`), deren vollständigen
  Inhalt IMMER direkt als Codeblock im Chat posten (zusätzlich per
  SendUserFile mitschicken) – nicht nur den Dateipfad nennen, damit er ohne
  Download aus dem Chat heraus in die Zwischenablage kopierbar ist.
  - Gilt insbesondere für `supabase/schema.sql`: bei JEDER Änderung an
    dieser Datei den kompletten, aktuellen Inhalt als Codeblock in der
    eigenen Chat-Antwort ausgeben (nicht nur per Read-Tool anzeigen lassen
    oder per SendUserFile schicken – beides ersetzt den Codeblock in der
    Antwort nicht).
