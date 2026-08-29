// Erstellt den Supabase-Client aus den Werten in config.js.
//
// "Als User anmelden" (Admin-Bereich, siehe js/app.js impersonateUser) öffnet
// für den Test-Login einen neuen Tab mit "?impersonate=1" in der URL. Ohne
// Sonderbehandlung würde dieser Tab dieselbe (localStorage-basierte) Session
// wie alle anderen Tabs derselben Origin nutzen und so die eigentliche
// Admin-Session überall überschreiben. localStorage wird zwischen Tabs
// synchronisiert, sessionStorage dagegen ist strikt pro Tab isoliert - daher
// läuft ein einmal als "Test-Tab" erkannter Tab dauerhaft (auch nach einem
// Reload) über einen eigenen, sessionStorage-basierten Client mit eigenem
// Storage-Key. Schließt man den Tab, ist die Test-Session weg.
let isImpersonationTab = false;
try {
  isImpersonationTab =
    new URLSearchParams(window.location.search).has("impersonate") ||
    sessionStorage.getItem("ai_ideen_impersonating") === "1";
  if (isImpersonationTab) sessionStorage.setItem("ai_ideen_impersonating", "1");
} catch (e) {
  isImpersonationTab = false;
}
window.isImpersonationTab = isImpersonationTab;

window.supabaseClient = window.supabase.createClient(
  window.APP_CONFIG.SUPABASE_URL,
  window.APP_CONFIG.SUPABASE_ANON_KEY,
  isImpersonationTab
    ? { auth: { storage: window.sessionStorage, storageKey: "sb-impersonate-auth-token" } }
    : undefined
);
