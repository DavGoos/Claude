// Admin-Bereich der App (js/app.js renderAdmin, "Neuen User anlegen" /
// "Als User anmelden") ruft diese Function auf, statt den service_role-Key
// jemals in den Browser zu laden - der hebelt alle Zugriffsregeln (RLS) aus
// und darf ausschließlich serverseitig existieren. SUPABASE_URL,
// SUPABASE_ANON_KEY und SUPABASE_SERVICE_ROLE_KEY sind für Edge Functions
// automatisch als Umgebungsvariablen verfügbar, ohne dass sie manuell als
// Secret gesetzt werden müssten.
//
// Deployment: `supabase functions deploy admin-users` (siehe README.md).
import { createClient } from "npm:@supabase/supabase-js@2";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  try {
    // Client mit dem JWT der aufrufenden Person (nicht dem service_role-Key)
    // - respektiert also ganz normal Row Level Security. Das ist hier
    // Absicht: so kann diese Abfrage nur den Admin-Status der aufrufenden
    // Person selbst lesen, nie den einer anderen Person (siehe "Profiles:
    // select own"-Policy in schema.sql).
    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
    });
    const { data: authData, error: authError } = await callerClient.auth.getUser();
    if (authError || !authData?.user) {
      return json({ error: "Nicht eingeloggt." }, 401);
    }
    const { data: profile, error: profileError } = await callerClient
      .from("profiles")
      .select("is_admin")
      .eq("id", authData.user.id)
      .single();
    if (profileError || !profile?.is_admin) {
      return json({ error: "Nur für Admins." }, 403);
    }

    const body = await req.json().catch(() => ({}));
    // Erst ab hier, nach der Admin-Prüfung oben, wird der service_role-Key
    // überhaupt verwendet.
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    if (body.action === "create") {
      const email = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");
      if (!email || password.length < 6) {
        return json({ error: "E-Mail und Passwort (mind. 6 Zeichen) erforderlich." });
      }
      const { data, error } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (error) return json({ error: error.message });
      return json({ id: data.user.id, email: data.user.email });
    }

    if (body.action === "reset_password") {
      const userId = String(body.userId || "");
      const password = String(body.password || "");
      if (!userId || password.length < 6) {
        return json({ error: "User-ID und Passwort (mind. 6 Zeichen) erforderlich." });
      }
      const { data, error } = await adminClient.auth.admin.updateUserById(userId, { password });
      if (error) return json({ error: error.message });
      return json({ id: data.user.id, email: data.user.email });
    }

    if (body.action === "impersonate") {
      const email = String(body.email || "").trim().toLowerCase();
      if (!email) return json({ error: "E-Mail erforderlich." });
      const { data, error } = await adminClient.auth.admin.generateLink({
        type: "magiclink",
        email,
      });
      if (error) return json({ error: error.message });
      const otp = data?.properties?.email_otp;
      if (!otp) return json({ error: "Kein Login-Code erhalten." });
      return json({ email, otp });
    }

    return json({ error: "Unbekannte Aktion." });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, 500);
  }
});
