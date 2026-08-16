// Supabase Edge Function: ruft die Claude API auf, um aus einer kurzen
// Idee eine strukturierte Ausarbeitung zu generieren. Der API-Key bleibt
// dabei auf dem Server (Supabase-Secret) und wird nie an das Handy geschickt.
// Deploy & Setup: siehe README.md, Schritt 3.

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT = `Du bist ein erfahrener AI-Solution-Architekt, der intern erfasste
AI-Use-Case-Ideen eines Unternehmens ausarbeitet. Du bekommst eine kurze Notiz und
optional eine erste Beschreibung. Antworte AUSSCHLIESSLICH mit einem JSON-Objekt
(kein Markdown, kein Fließtext davor oder danach) mit genau diesen Feldern:

{
  "description": "Strukturierte Beschreibung: Problem, Zielgruppe, vorgeschlagene Lösung, erwarteter Nutzen. Auf Deutsch, 4-8 Sätze.",
  "tools": "Konkrete Vorschläge für Tools/Frameworks/Architektur, die für die Umsetzung sinnvoll sind, als kurze Liste mit Begründung.",
  "considerations": "Wichtige Gedanken vorab: Datenschutz, benötigte Datenquellen, Kosten, Abhängigkeiten, Stakeholder, Risiken. Als kurze Liste.",
  "initial_prompt": "Ein guter, direkt verwendbarer Start-Prompt (auf Deutsch), mit dem man z.B. bei Claude Code oder einem neuen Chat in die Umsetzung dieses Projekts einsteigen kann. Soll Kontext, Ziel und relevante Rahmenbedingungen enthalten."
}`;

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : trimmed;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  const jsonSlice = start >= 0 && end >= 0 ? candidate.slice(start, end + 1) : candidate;
  return JSON.parse(jsonSlice);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    const { quick_note, description } = await req.json();
    if (!quick_note || typeof quick_note !== "string") {
      return new Response(JSON.stringify({ error: "quick_note fehlt" }), {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY ist nicht als Secret gesetzt" }), {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const userMessage = `Kurznotiz: ${quick_note}\n\nBisherige Beschreibung: ${description || "(noch keine)"}`;

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 1500,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      return new Response(JSON.stringify({ error: `Claude API Fehler: ${errText}` }), {
        status: 502,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const anthropicData = await anthropicRes.json();
    const rawText = anthropicData.content?.[0]?.text || "";
    const parsed = extractJson(rawText);

    return new Response(JSON.stringify(parsed), {
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err instanceof Error ? err.message : err) }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});
