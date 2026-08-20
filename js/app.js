const sb = window.supabaseClient;

const STATUS_LABELS = {
  idea: "Idee",
  evaluating: "In Bewertung",
  planned: "Geplant",
  in_progress: "In Umsetzung",
  done: "Fertig",
  discarded: "Verworfen",
};

const STATUS_ORDER = ["idea", "evaluating", "planned", "in_progress", "done", "discarded"];

const PROCESS_STATUS_LABELS = {
  open: "Offen",
  reviewed: "Geprüft",
};

const PROCESS_STATUS_ORDER = ["open", "reviewed"];

let currentUser = null;
let currentProfile = null;
let ideasCache = [];
let processesCache = [];
let profilesCache = [];
let activeFilter = "all";
let passwordRecoveryMode = false;
let authMode = "login";

const $app = document.getElementById("app");

function escapeHtml(str) {
  return (str || "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c]);
}

function toast(msg) {
  let el = document.querySelector(".toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("show"), 2200);
}

function priorityInfo(idea) {
  const impact = idea.impact || 3;
  const effort = idea.effort || 3;
  if (impact >= 4 && effort <= 2) return { label: "Quick Win", color: "#22c55e" };
  if (impact >= 4 && effort >= 4) return { label: "Großes Projekt", color: "#8b5cf6" };
  if (impact <= 2 && effort <= 2) return { label: "Nice to have", color: "#93c5fd" };
  if (impact <= 2 && effort >= 4) return { label: "Eher verschieben", color: "#9aa1af" };
  return { label: "Prüfen", color: "#fcd34d" };
}

function aiPotentialInfo(value) {
  const v = value || 3;
  if (v >= 4) return { label: "Hohes AI-Potenzial", color: "#22c55e" };
  if (v <= 2) return { label: "Geringes AI-Potenzial", color: "#9aa1af" };
  return { label: "Mittleres AI-Potenzial", color: "#fcd34d" };
}

// ---------- Routing ----------

function currentRoute() {
  const hash = window.location.hash;
  let m = hash.match(/^#\/idea\/([^/]+)$/);
  if (m) return { view: "idea-detail", id: m[1] };
  m = hash.match(/^#\/process\/([^/]+)$/);
  if (m) return { view: "process-detail", id: m[1] };
  if (hash === "#/processes") return { view: "process-list" };
  if (hash === "#/settings") return { view: "settings" };
  if (hash === "#/admin") return { view: "admin" };
  return { view: "idea-list" };
}

window.addEventListener("hashchange", render);

// ---------- Auth ----------

async function loadOwnProfile() {
  const { data, error } = await sb.from("profiles").select("*").eq("id", currentUser.id).single();
  if (error) {
    toast("Fehler beim Laden des Profils: " + error.message);
    return null;
  }
  return data;
}

async function loadAllProfiles() {
  const { data, error } = await sb.from("profiles").select("*").order("created_at", { ascending: false });
  if (error) {
    toast("Fehler beim Laden: " + error.message);
    return [];
  }
  return data || [];
}

async function approveUser(id) {
  const { error } = await sb.from("profiles").update({ is_approved: true }).eq("id", id);
  if (error) {
    toast("Fehler beim Freigeben: " + error.message);
    return false;
  }
  return true;
}

async function init() {
  const { data } = await sb.auth.getSession();
  currentUser = data.session ? data.session.user : null;
  sb.auth.onAuthStateChange((event, session) => {
    if (event === "PASSWORD_RECOVERY") passwordRecoveryMode = true;
    currentUser = session ? session.user : null;
    currentProfile = null;
    render();
  });
  render();
}

async function signUpWithPassword(email, password) {
  const { error } = await sb.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: window.location.origin + window.location.pathname },
  });
  return error;
}

async function signInWithPassword(email, password) {
  const { error } = await sb.auth.signInWithPassword({ email, password });
  return error;
}

async function requestPasswordReset(email) {
  const { error } = await sb.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + window.location.pathname,
  });
  return error;
}

async function logout() {
  await sb.auth.signOut();
  window.location.hash = "";
}

// ---------- Data: Ideas ----------

async function loadIdeas() {
  const { data, error } = await sb
    .from("ideas")
    .select("*, processes(id, name)")
    .order("created_at", { ascending: false });
  if (error) {
    toast("Fehler beim Laden: " + error.message);
    return [];
  }
  return data || [];
}

async function createIdea(quickNote, processId) {
  const payload = { quick_note: quickNote, created_by: currentUser.id };
  if (processId) payload.process_id = processId;
  const { data, error } = await sb.from("ideas").insert(payload).select("*, processes(id, name)").single();
  if (error) {
    toast("Fehler beim Speichern: " + error.message);
    return null;
  }
  return data;
}

async function updateIdea(id, patch) {
  const { data, error } = await sb
    .from("ideas")
    .update(patch)
    .eq("id", id)
    .select("*, processes(id, name)")
    .single();
  if (error) {
    toast("Fehler beim Speichern: " + error.message);
    return null;
  }
  return data;
}

async function deleteIdea(id) {
  const { error } = await sb.from("ideas").delete().eq("id", id);
  if (error) {
    toast("Fehler beim Löschen: " + error.message);
    return false;
  }
  return true;
}

const AI_PROVIDERS = {
  anthropic: {
    label: "Claude",
    keyStorage: "ai_ideen_anthropic_key",
    placeholder: "sk-ant-...",
    howTo: [
      "Auf console.anthropic.com registrieren oder einloggen.",
      'Links im Menü auf "API Keys" gehen und einen neuen Key erstellen.',
      "Etwas Guthaben aufladen (wenige Euro reichen für sehr viele Nutzungen).",
    ],
  },
  openai: {
    label: "OpenAI (ChatGPT)",
    keyStorage: "ai_ideen_openai_key",
    placeholder: "sk-...",
    howTo: [
      "Auf platform.openai.com registrieren oder einloggen.",
      'Über das Nutzermenü zu "API keys" gehen und einen neuen Key erstellen.',
      "Etwas Guthaben aufladen (wenige Euro reichen für sehr viele Nutzungen).",
    ],
  },
};

const AI_PROVIDER_STORAGE = "ai_ideen_ai_provider";

function getAiProvider() {
  const stored = localStorage.getItem(AI_PROVIDER_STORAGE);
  return AI_PROVIDERS[stored] ? stored : "anthropic";
}

function setAiProvider(provider) {
  localStorage.setItem(AI_PROVIDER_STORAGE, provider);
}

function getProviderKey(provider) {
  return localStorage.getItem(AI_PROVIDERS[provider].keyStorage) || "";
}

function setProviderKey(provider, key) {
  const storageKey = AI_PROVIDERS[provider].keyStorage;
  if (key) localStorage.setItem(storageKey, key);
  else localStorage.removeItem(storageKey);
}

const ELABORATE_SYSTEM_PROMPT = `Du bist ein erfahrener AI-Solution-Architekt, der intern erfasste
AI-Use-Case-Ideen eines Unternehmens ausarbeitet. Du bekommst eine kurze Notiz und
optional eine erste Beschreibung. Antworte AUSSCHLIESSLICH mit einem JSON-Objekt
(kein Markdown, kein Fließtext davor oder danach) mit genau diesen Feldern:

{
  "description": "Strukturierte Beschreibung: Problem, Zielgruppe, vorgeschlagene Lösung, erwarteter Nutzen. Auf Deutsch, 4-8 Sätze.",
  "tools": "Konkrete Vorschläge für Tools/Frameworks/Architektur, die für die Umsetzung sinnvoll sind, als kurze Liste mit Begründung.",
  "considerations": "Wichtige Gedanken vorab: Datenschutz, benötigte Datenquellen, Kosten, Abhängigkeiten, Stakeholder, Risiken. Als kurze Liste.",
  "initial_prompt": "Ein guter, direkt verwendbarer Start-Prompt (auf Deutsch), mit dem man z.B. bei Claude Code oder einem neuen Chat in die Umsetzung dieses Projekts einsteigen kann. Soll Kontext, Ziel und relevante Rahmenbedingungen enthalten."
}`;

function buildElaboratePrompt(idea) {
  return `${ELABORATE_SYSTEM_PROMPT}\n\n---\n\nKurznotiz: ${idea.quick_note}\n\nBisherige Beschreibung: ${idea.description || "(noch keine)"}`;
}

function extractJson(text) {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : trimmed;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  const jsonSlice = start >= 0 && end >= 0 ? candidate.slice(start, end + 1) : candidate;
  return JSON.parse(jsonSlice);
}

async function elaborateWithAnthropic(apiKey, userMessage) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-5",
      max_tokens: 1500,
      system: ELABORATE_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Claude API Fehler: ${errText}`);
  }
  const data = await res.json();
  return data.content?.[0]?.text || "";
}

async function elaborateWithOpenAI(apiKey, userMessage) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: ELABORATE_SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI API Fehler: ${errText}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

async function elaborateWithAI(idea) {
  const provider = getAiProvider();
  const apiKey = getProviderKey(provider);
  if (!apiKey) {
    throw new Error("Kein eigener API-Key hinterlegt. Bitte unter Einstellungen eintragen.");
  }

  const userMessage = `Kurznotiz: ${idea.quick_note}\n\nBisherige Beschreibung: ${idea.description || "(noch keine)"}`;

  const rawText =
    provider === "openai"
      ? await elaborateWithOpenAI(apiKey, userMessage)
      : await elaborateWithAnthropic(apiKey, userMessage);

  return extractJson(rawText);
}

// ---------- Data: Processes ----------

async function loadProcesses() {
  const { data, error } = await sb
    .from("processes")
    .select("*, parent:parent_process_id(id, name)")
    .order("created_at", { ascending: false });
  if (error) {
    toast("Fehler beim Laden: " + error.message);
    return [];
  }
  return data || [];
}

async function createProcess(name, parentProcessId) {
  const payload = { name, created_by: currentUser.id };
  if (parentProcessId) payload.parent_process_id = parentProcessId;
  const { data, error } = await sb
    .from("processes")
    .insert(payload)
    .select("*, parent:parent_process_id(id, name)")
    .single();
  if (error) {
    toast("Fehler beim Speichern: " + error.message);
    return null;
  }
  return data;
}

async function updateProcess(id, patch) {
  const { data, error } = await sb
    .from("processes")
    .update(patch)
    .eq("id", id)
    .select("*, parent:parent_process_id(id, name)")
    .single();
  if (error) {
    toast("Fehler beim Speichern: " + error.message);
    return null;
  }
  return data;
}

async function deleteProcess(id) {
  const { error } = await sb.from("processes").delete().eq("id", id);
  if (error) {
    toast("Fehler beim Löschen: " + error.message);
    return false;
  }
  return true;
}

// ---------- Shared UI ----------

function tabBar(active) {
  return `
    <div class="tabbar">
      <button data-tab="ideas" class="${active === "ideas" ? "active" : ""}">Ideen</button>
      <button data-tab="processes" class="${active === "processes" ? "active" : ""}">Prozesse</button>
    </div>
  `;
}

function bindTabBar() {
  document.querySelectorAll(".tabbar button").forEach((btn) => {
    btn.addEventListener("click", () => {
      window.location.hash = btn.dataset.tab === "processes" ? "#/processes" : "";
    });
  });
}

// ---------- Views ----------

function renderLogin() {
  const isSignup = authMode === "signup";
  $app.innerHTML = `
    <div class="login-wrap">
      <img src="icons/icon-192.png" alt="Logo" />
      <h1>Process- &amp; AI-Usecase Management</h1>
      <p>Dokumentiere eure Prozesse, prüft sie auf AI-Potenzial und erfasst AI-Use-Cases in Sekunden – inklusive Bewertung und KI-gestützter Ausarbeitung.</p>
      <div class="tabbar" style="max-width:320px;">
        <button data-mode="login" class="${!isSignup ? "active" : ""}">Anmelden</button>
        <button data-mode="signup" class="${isSignup ? "active" : ""}">Registrieren</button>
      </div>
      <form id="auth-form" style="width:100%; max-width:320px;">
        <input type="email" id="auth-email" placeholder="deine@email.de" required autocomplete="email" />
        <input
          type="password"
          id="auth-password"
          placeholder="Passwort"
          required
          minlength="6"
          autocomplete="${isSignup ? "new-password" : "current-password"}"
        />
        <button type="submit" class="btn-primary" style="width:100%;">${isSignup ? "Registrieren" : "Anmelden"}</button>
      </form>
      ${!isSignup ? `<button class="btn-ghost" id="forgot-btn" style="margin-top:10px;">Passwort vergessen?</button>` : ""}
      <p id="login-msg" style="margin-top:14px; font-size:13px;"></p>
    </div>
  `;

  document.querySelectorAll(".tabbar button").forEach((btn) => {
    btn.addEventListener("click", () => {
      authMode = btn.dataset.mode;
      renderLogin();
    });
  });

  document.getElementById("auth-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("auth-email").value.trim();
    const password = document.getElementById("auth-password").value;
    const btn = e.target.querySelector("button");
    const msg = document.getElementById("login-msg");
    btn.disabled = true;
    btn.textContent = isSignup ? "Registriere..." : "Melde an...";
    const error = isSignup ? await signUpWithPassword(email, password) : await signInWithPassword(email, password);
    btn.disabled = false;
    btn.textContent = isSignup ? "Registrieren" : "Anmelden";
    if (error) {
      msg.textContent = "Fehler: " + error.message;
      msg.style.color = "#ef4444";
    } else if (isSignup) {
      msg.textContent = "Fast fertig! Bitte bestätige deine E-Mail-Adresse über den Link, den wir dir gerade geschickt haben. Danach kannst du dich hier mit E-Mail + Passwort anmelden.";
      msg.style.color = "#22c55e";
    }
    // Bei erfolgreichem Login übernimmt onAuthStateChange das Weiterleiten in die App.
  });

  const forgotBtn = document.getElementById("forgot-btn");
  if (forgotBtn) {
    forgotBtn.addEventListener("click", async () => {
      const email = prompt("Für welche E-Mail-Adresse soll das Passwort zurückgesetzt werden?");
      if (!email || !email.trim()) return;
      const error = await requestPasswordReset(email.trim());
      const msg = document.getElementById("login-msg");
      msg.textContent = error
        ? "Fehler: " + error.message
        : "Falls diese Adresse registriert ist, kommt gleich eine E-Mail mit einem Link zum Zurücksetzen.";
      msg.style.color = error ? "#ef4444" : "#22c55e";
    });
  }
}

function renderSetNewPassword() {
  $app.innerHTML = `
    <div class="login-wrap">
      <img src="icons/icon-192.png" alt="Logo" />
      <h1>Neues Passwort setzen</h1>
      <p>Vergib ein neues Passwort für dein Konto.</p>
      <form id="new-password-form" style="width:100%; max-width:320px;">
        <input type="password" id="new-password" placeholder="Neues Passwort" required minlength="6" autocomplete="new-password" />
        <button type="submit" class="btn-primary" style="width:100%;">Passwort speichern</button>
      </form>
      <p id="reset-msg" style="margin-top:14px; font-size:13px;"></p>
    </div>
  `;

  document.getElementById("new-password-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const password = document.getElementById("new-password").value;
    const btn = e.target.querySelector("button");
    btn.disabled = true;
    const { error } = await sb.auth.updateUser({ password });
    btn.disabled = false;
    const msg = document.getElementById("reset-msg");
    if (error) {
      msg.textContent = "Fehler: " + error.message;
      msg.style.color = "#ef4444";
      return;
    }
    passwordRecoveryMode = false;
    toast("Passwort gespeichert, du bist eingeloggt.");
    window.location.hash = "";
    render();
  });
}

function filterChips() {
  const filters = [{ key: "all", label: "Alle" }, ...STATUS_ORDER.map((s) => ({ key: s, label: STATUS_LABELS[s] }))];
  return `
    <div class="filters">
      ${filters
        .map(
          (f) =>
            `<button class="chip ${f.key === activeFilter ? "active" : ""}" data-filter="${f.key}">${f.label}</button>`
        )
        .join("")}
    </div>
  `;
}

function ideaCard(idea) {
  const p = priorityInfo(idea);
  const tags = (idea.tags || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  return `
    <div class="idea-item" data-id="${idea.id}">
      <div class="idea-title">${escapeHtml(idea.quick_note)}</div>
      <div class="idea-meta">
        <span class="badge status-${idea.status}">${STATUS_LABELS[idea.status]}</span>
        <span class="badge"><span class="priority-dot" style="background:${p.color}"></span> ${p.label}</span>
        ${idea.processes ? `<span class="badge">⚙ ${escapeHtml(idea.processes.name)}</span>` : ""}
        ${tags.map((t) => `<span class="badge">#${escapeHtml(t)}</span>`).join("")}
      </div>
    </div>
  `;
}

async function renderList() {
  $app.innerHTML = `
    <header class="topbar">
      <h1>AI Ideen</h1>
      <div class="actions">
        ${adminNavButton()}
        <button class="icon-btn" id="settings-btn">⚙</button>
        <button class="icon-btn" id="logout-btn">Logout</button>
      </div>
    </header>
    <main>
      ${tabBar("ideas")}
      <div class="card capture-box">
        <label class="field-label" style="margin-top:0;">Neue Idee erfassen</label>
        <textarea id="quick-note" placeholder="z.B. Automatische Zusammenfassung von Kundenmails per KI..."></textarea>
        <div class="row">
          <button class="btn-primary" id="save-capture">Idee speichern</button>
        </div>
      </div>
      ${filterChips()}
      <div class="idea-list" id="idea-list">
        <div class="empty-state">Lade Ideen...</div>
      </div>
    </main>
  `;

  bindTabBar();
  bindAdminNavButton();
  document.getElementById("logout-btn").addEventListener("click", logout);
  document.getElementById("settings-btn").addEventListener("click", () => {
    window.location.hash = "#/settings";
  });

  document.getElementById("save-capture").addEventListener("click", async () => {
    const ta = document.getElementById("quick-note");
    const text = ta.value.trim();
    if (!text) return;
    const btn = document.getElementById("save-capture");
    btn.disabled = true;
    const idea = await createIdea(text);
    btn.disabled = false;
    if (idea) {
      ta.value = "";
      toast("Idee gespeichert");
      ideasCache = await loadIdeas();
      renderIdeaList();
    }
  });

  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      activeFilter = chip.dataset.filter;
      renderList();
    });
  });

  ideasCache = await loadIdeas();
  renderIdeaList();
}

function renderIdeaList() {
  const listEl = document.getElementById("idea-list");
  if (!listEl) return;
  const filtered = ideasCache.filter((i) => activeFilter === "all" || i.status === activeFilter);
  if (filtered.length === 0) {
    listEl.innerHTML = `<div class="empty-state">Noch keine Ideen hier. Trag oben deine erste Idee ein!</div>`;
  } else {
    listEl.innerHTML = filtered.map(ideaCard).join("");
    listEl.querySelectorAll(".idea-item").forEach((el) => {
      el.addEventListener("click", () => {
        window.location.hash = `#/idea/${el.dataset.id}`;
      });
    });
  }
  document.querySelectorAll(".chip").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.filter === activeFilter);
  });
}

function sliderRow(name, label, value) {
  return `
    <div class="slider-row">
      <label>${label}</label>
      <input type="range" min="1" max="5" step="1" value="${value || 3}" data-field="${name}" />
      <span class="val">${value || 3}</span>
    </div>
  `;
}

function processOptions(selectedId) {
  const options = [`<option value="">— Keiner —</option>`];
  processesCache.forEach((p) => {
    options.push(`<option value="${p.id}" ${p.id === selectedId ? "selected" : ""}>${escapeHtml(p.name)}</option>`);
  });
  return options.join("");
}

function parentProcessOptions(excludeId, selectedId) {
  const options = [`<option value="">— Keiner (Top-Level-Prozess) —</option>`];
  processesCache
    .filter((p) => p.id !== excludeId)
    .forEach((p) => {
      options.push(`<option value="${p.id}" ${p.id === selectedId ? "selected" : ""}>${escapeHtml(p.name)}</option>`);
    });
  return options.join("");
}

async function renderDetail(id) {
  let idea = ideasCache.find((i) => i.id === id);
  if (!idea) {
    ideasCache = await loadIdeas();
    idea = ideasCache.find((i) => i.id === id);
  }
  if (!idea) {
    window.location.hash = "";
    return;
  }
  if (processesCache.length === 0) {
    processesCache = await loadProcesses();
  }

  $app.innerHTML = `
    <header class="topbar">
      <div class="back-row">
        <button class="icon-btn" id="back-btn">&larr; Zurück</button>
      </div>
      <button class="icon-btn" id="delete-btn">Löschen</button>
    </header>
    <main>
      <div class="card">
        <label class="field-label">Kurznotiz</label>
        <textarea class="field" id="f-quick-note">${escapeHtml(idea.quick_note)}</textarea>

        <label class="field-label">Status</label>
        <select class="field" id="f-status">
          ${STATUS_ORDER.map(
            (s) => `<option value="${s}" ${s === idea.status ? "selected" : ""}>${STATUS_LABELS[s]}</option>`
          ).join("")}
        </select>

        <label class="field-label">Zugehöriger Prozess</label>
        <select class="field" id="f-process">
          ${processOptions(idea.process_id)}
        </select>

        <label class="field-label">Tags (Komma-getrennt)</label>
        <input class="field" id="f-tags" value="${escapeHtml(idea.tags || "")}" placeholder="z.B. Vertrieb, Automatisierung" />

        <label class="field-label">Beschreibung</label>
        <textarea class="field" id="f-description" placeholder="Was ist das Problem, was soll die Lösung bringen?">${escapeHtml(idea.description || "")}</textarea>
      </div>

      <div class="card">
        <div class="section-title" style="margin:0 0 10px;">Bewertung</div>
        <div id="priority-banner" class="priority-banner"></div>
        ${sliderRow("impact", "Nutzen", idea.impact)}
        ${sliderRow("feasibility", "Machbarkeit", idea.feasibility)}
        ${sliderRow("effort", "Aufwand", idea.effort)}
        ${sliderRow("risk", "Risiko", idea.risk)}
      </div>

      <div class="card">
        <div class="section-title" style="margin:0 0 10px;">KI-Unterstützung</div>
        <p style="font-size:13.5px; color:var(--text-dim); margin:0 0 12px; line-height:1.5;">
          Erzeuge einen fertigen Prompt und füge ihn in ein beliebiges KI-Chat-Tool ein,
          das du bereits nutzt (Copilot, ChatGPT, Claude, Gemini, ...) – kein eigener
          API-Key nötig. Kopier die Antwort danach hier zurück rein.
        </p>
        <button class="btn-secondary" id="generate-prompt-btn" style="width:100%;">📋 Prompt erzeugen</button>
        <div id="generated-prompt-wrap" style="display:none; margin-top:12px;">
          <pre id="generated-prompt-text" style="white-space:pre-wrap; background:var(--surface-2); border:1px solid var(--border); border-radius:10px; padding:12px; font-size:13px; font-family:inherit; margin:0; max-height:220px; overflow-y:auto;"></pre>
          <div class="row">
            <button class="btn-secondary" id="copy-generated-prompt-btn" style="width:100%;">In Zwischenablage kopieren</button>
          </div>
        </div>

        <label class="field-label">Antwort der KI hier einfügen</label>
        <textarea class="field" id="ai-response-paste" placeholder="Antwort aus Copilot/ChatGPT/Claude/... hier einfügen"></textarea>
        <div class="row">
          <button class="btn-primary" id="apply-pasted-btn" style="width:100%;">Übernehmen</button>
        </div>
        <div id="ai-result" class="ai-result"></div>

        <details style="margin-top:18px;">
          <summary style="cursor:pointer; font-size:13px; color:var(--text-dim);">Stattdessen automatisch mit eigenem API-Key (optional)</summary>
          <button class="btn-secondary" id="ai-btn" style="width:100%; margin-top:10px;">✨ Automatisch mit KI ausarbeiten</button>
        </details>
      </div>

      <div class="card">
        <label class="field-label" style="margin-top:0;">Tools &amp; Umsetzungsoptionen</label>
        <textarea class="field" id="f-tools" placeholder="Wird von der KI vorgeschlagen oder hier selbst eintragen">${escapeHtml(idea.tools || "")}</textarea>

        <label class="field-label">Wichtige Gedanken vorab</label>
        <textarea class="field" id="f-considerations" placeholder="z.B. Datenschutz, Datenquelle, Kosten">${escapeHtml(idea.considerations || "")}</textarea>

        <label class="field-label">Start-Prompt fürs Projekt</label>
        <textarea class="field" id="f-initial-prompt" placeholder="Wird von der KI generiert">${escapeHtml(idea.initial_prompt || "")}</textarea>
        <div class="row">
          <button class="btn-secondary" id="copy-prompt-btn" style="width:100%;">Start-Prompt kopieren</button>
        </div>
      </div>

      <div class="row">
        <button class="btn-primary" id="save-detail-btn">Speichern</button>
      </div>
    </main>
  `;

  function updatePriorityBanner() {
    const impact = Number(document.querySelector('[data-field="impact"]').value);
    const effort = Number(document.querySelector('[data-field="effort"]').value);
    const p = priorityInfo({ impact, effort });
    document.getElementById("priority-banner").innerHTML =
      `<span class="priority-dot" style="background:${p.color}"></span> Einschätzung: <strong>${p.label}</strong>`;
  }

  document.querySelectorAll('input[type="range"]').forEach((slider) => {
    slider.addEventListener("input", () => {
      slider.nextElementSibling.textContent = slider.value;
      updatePriorityBanner();
    });
  });
  updatePriorityBanner();

  document.getElementById("back-btn").addEventListener("click", () => {
    window.location.hash = "";
  });

  document.getElementById("delete-btn").addEventListener("click", async () => {
    if (!confirm("Diese Idee wirklich löschen?")) return;
    const ok = await deleteIdea(idea.id);
    if (ok) {
      toast("Idee gelöscht");
      window.location.hash = "";
    }
  });

  document.getElementById("copy-prompt-btn").addEventListener("click", async () => {
    const text = document.getElementById("f-initial-prompt").value;
    try {
      await navigator.clipboard.writeText(text);
      toast("In Zwischenablage kopiert");
    } catch {
      toast("Kopieren nicht möglich, bitte manuell markieren");
    }
  });

  function collectPatch() {
    return {
      quick_note: document.getElementById("f-quick-note").value.trim(),
      status: document.getElementById("f-status").value,
      process_id: document.getElementById("f-process").value || null,
      tags: document.getElementById("f-tags").value.trim(),
      description: document.getElementById("f-description").value.trim(),
      impact: Number(document.querySelector('[data-field="impact"]').value),
      feasibility: Number(document.querySelector('[data-field="feasibility"]').value),
      effort: Number(document.querySelector('[data-field="effort"]').value),
      risk: Number(document.querySelector('[data-field="risk"]').value),
      tools: document.getElementById("f-tools").value.trim(),
      considerations: document.getElementById("f-considerations").value.trim(),
      initial_prompt: document.getElementById("f-initial-prompt").value.trim(),
    };
  }

  document.getElementById("save-detail-btn").addEventListener("click", async () => {
    const btn = document.getElementById("save-detail-btn");
    btn.disabled = true;
    btn.textContent = "Speichere...";
    const updated = await updateIdea(idea.id, collectPatch());
    btn.disabled = false;
    btn.textContent = "Speichern";
    if (updated) {
      const idx = ideasCache.findIndex((i) => i.id === idea.id);
      if (idx >= 0) ideasCache[idx] = updated;
      toast("Gespeichert");
    }
  });

  function showAiResult(result) {
    const resultEl = document.getElementById("ai-result");
    resultEl.innerHTML = `
      <h3>Vorschlag Beschreibung</h3>
      <pre>${escapeHtml(result.description || "")}</pre>
      <h3>Vorschlag Tools</h3>
      <pre>${escapeHtml(result.tools || "")}</pre>
      <h3>Wichtige Gedanken vorab</h3>
      <pre>${escapeHtml(result.considerations || "")}</pre>
      <h3>Start-Prompt</h3>
      <pre>${escapeHtml(result.initial_prompt || "")}</pre>
      <div class="row" style="margin-top:12px;">
        <button class="btn-primary" id="apply-ai-btn" style="width:100%;">Vorschlag übernehmen</button>
      </div>
    `;
    document.getElementById("apply-ai-btn").addEventListener("click", () => {
      if (result.description) document.getElementById("f-description").value = result.description;
      if (result.tools) document.getElementById("f-tools").value = result.tools;
      if (result.considerations) document.getElementById("f-considerations").value = result.considerations;
      if (result.initial_prompt) document.getElementById("f-initial-prompt").value = result.initial_prompt;
      toast("Vorschlag übernommen, denk ans Speichern!");
    });
  }

  document.getElementById("generate-prompt-btn").addEventListener("click", async () => {
    const patchNow = collectPatch();
    await updateIdea(idea.id, patchNow);
    const prompt = buildElaboratePrompt(patchNow);
    document.getElementById("generated-prompt-text").textContent = prompt;
    document.getElementById("generated-prompt-wrap").style.display = "block";
  });

  document.getElementById("copy-generated-prompt-btn").addEventListener("click", async () => {
    const text = document.getElementById("generated-prompt-text").textContent;
    try {
      await navigator.clipboard.writeText(text);
      toast("In Zwischenablage kopiert – jetzt in dein KI-Tool einfügen");
    } catch {
      toast("Kopieren nicht möglich, bitte manuell markieren");
    }
  });

  document.getElementById("apply-pasted-btn").addEventListener("click", () => {
    const resultEl = document.getElementById("ai-result");
    const pasted = document.getElementById("ai-response-paste").value;
    if (!pasted.trim()) return;
    try {
      const result = extractJson(pasted);
      showAiResult(result);
    } catch {
      resultEl.innerHTML = `<p style="color:#ef4444; font-size:13.5px;">Konnte die Antwort nicht automatisch auslesen. Du kannst die Felder unten auch selbst aus der Antwort befüllen.</p>`;
    }
  });

  document.getElementById("ai-btn").addEventListener("click", async () => {
    const btn = document.getElementById("ai-btn");
    const resultEl = document.getElementById("ai-result");
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span> KI arbeitet...`;
    resultEl.innerHTML = "";
    try {
      const patchNow = collectPatch();
      await updateIdea(idea.id, patchNow);
      const result = await elaborateWithAI(patchNow);
      showAiResult(result);
    } catch (err) {
      resultEl.innerHTML = `<p style="color:#ef4444; font-size:13.5px;">Fehler: ${escapeHtml(err.message || String(err))}</p>`;
    }
    btn.disabled = false;
    btn.innerHTML = "✨ Automatisch mit KI ausarbeiten";
  });
}

// ---------- Views: Processes ----------

function processFilterChips(activeProcessFilter) {
  const filters = [{ key: "all", label: "Alle" }, ...PROCESS_STATUS_ORDER.map((s) => ({ key: s, label: PROCESS_STATUS_LABELS[s] }))];
  return `
    <div class="filters">
      ${filters
        .map(
          (f) =>
            `<button class="chip ${f.key === activeProcessFilter ? "active" : ""}" data-pfilter="${f.key}">${f.label}</button>`
        )
        .join("")}
    </div>
  `;
}

function processCard(proc) {
  const ai = aiPotentialInfo(proc.ai_potential);
  return `
    <div class="idea-item" data-id="${proc.id}">
      <div class="idea-title">${escapeHtml(proc.name)}</div>
      <div class="idea-meta">
        <span class="badge status-${proc.status === "reviewed" ? "done" : "idea"}">${PROCESS_STATUS_LABELS[proc.status]}</span>
        <span class="badge"><span class="priority-dot" style="background:${ai.color}"></span> ${ai.label}</span>
        ${proc.department ? `<span class="badge">${escapeHtml(proc.department)}</span>` : ""}
        ${proc.parent ? `<span class="badge">↳ ${escapeHtml(proc.parent.name)}</span>` : ""}
      </div>
    </div>
  `;
}

let activeProcessFilter = "all";

async function renderProcessList() {
  $app.innerHTML = `
    <header class="topbar">
      <h1>Prozesse</h1>
      <div class="actions">
        ${adminNavButton()}
        <button class="icon-btn" id="settings-btn">⚙</button>
        <button class="icon-btn" id="logout-btn">Logout</button>
      </div>
    </header>
    <main>
      ${tabBar("processes")}
      <div class="card capture-box">
        <label class="field-label" style="margin-top:0;">Neuen Prozess dokumentieren</label>
        <textarea id="process-name" placeholder="z.B. Angebote erstellen, Rechnungsprüfung, Kundenonboarding..."></textarea>
        <div class="row">
          <button class="btn-primary" id="save-process">Prozess speichern</button>
        </div>
      </div>
      ${processFilterChips(activeProcessFilter)}
      <div class="idea-list" id="process-list">
        <div class="empty-state">Lade Prozesse...</div>
      </div>
    </main>
  `;

  bindTabBar();
  bindAdminNavButton();
  document.getElementById("logout-btn").addEventListener("click", logout);
  document.getElementById("settings-btn").addEventListener("click", () => {
    window.location.hash = "#/settings";
  });

  document.getElementById("save-process").addEventListener("click", async () => {
    const ta = document.getElementById("process-name");
    const text = ta.value.trim();
    if (!text) return;
    const btn = document.getElementById("save-process");
    btn.disabled = true;
    const proc = await createProcess(text);
    btn.disabled = false;
    if (proc) {
      ta.value = "";
      toast("Prozess gespeichert");
      processesCache = await loadProcesses();
      renderProcessListItems();
    }
  });

  document.querySelectorAll("[data-pfilter]").forEach((chip) => {
    chip.addEventListener("click", () => {
      activeProcessFilter = chip.dataset.pfilter;
      renderProcessList();
    });
  });

  processesCache = await loadProcesses();
  renderProcessListItems();
}

function renderProcessListItems() {
  const listEl = document.getElementById("process-list");
  if (!listEl) return;
  const filtered = processesCache.filter((p) => activeProcessFilter === "all" || p.status === activeProcessFilter);
  if (filtered.length === 0) {
    listEl.innerHTML = `<div class="empty-state">Noch keine Prozesse erfasst. Trag oben den ersten Prozess deines Bereichs ein!</div>`;
  } else {
    listEl.innerHTML = filtered.map(processCard).join("");
    listEl.querySelectorAll(".idea-item").forEach((el) => {
      el.addEventListener("click", () => {
        window.location.hash = `#/process/${el.dataset.id}`;
      });
    });
  }
  document.querySelectorAll("[data-pfilter]").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.pfilter === activeProcessFilter);
  });
}

async function renderProcessDetail(id) {
  let proc = processesCache.find((p) => p.id === id);
  if (!proc) {
    processesCache = await loadProcesses();
    proc = processesCache.find((p) => p.id === id);
  }
  if (!proc) {
    window.location.hash = "#/processes";
    return;
  }

  const linkedIdeas = ideasCache.length
    ? ideasCache.filter((i) => i.process_id === proc.id)
    : (ideasCache = await loadIdeas()).filter((i) => i.process_id === proc.id);

  const subProcesses = processesCache.filter((p) => p.parent_process_id === proc.id);

  $app.innerHTML = `
    <header class="topbar">
      <div class="back-row">
        <button class="icon-btn" id="back-btn">&larr; Zurück</button>
      </div>
      <button class="icon-btn" id="delete-btn">Löschen</button>
    </header>
    <main>
      <div class="card">
        <label class="field-label">Prozessname</label>
        <textarea class="field" id="f-name">${escapeHtml(proc.name)}</textarea>

        <label class="field-label">Bereich / Team</label>
        <input class="field" id="f-department" value="${escapeHtml(proc.department || "")}" placeholder="z.B. Vertrieb, Buchhaltung..." />

        <label class="field-label">Übergeordneter Prozess</label>
        <select class="field" id="f-parent-process">
          ${parentProcessOptions(proc.id, proc.parent_process_id)}
        </select>

        <label class="field-label">Status</label>
        <select class="field" id="f-status">
          ${PROCESS_STATUS_ORDER.map(
            (s) => `<option value="${s}" ${s === proc.status ? "selected" : ""}>${PROCESS_STATUS_LABELS[s]}</option>`
          ).join("")}
        </select>

        <label class="field-label">Beschreibung</label>
        <textarea class="field" id="f-description" placeholder="Wie läuft der Prozess ab, wer ist beteiligt?">${escapeHtml(proc.description || "")}</textarea>
      </div>

      <div class="card">
        <div class="section-title" style="margin:0 0 10px;">AI-Potenzial</div>
        <div id="ai-potential-banner" class="priority-banner"></div>
        ${sliderRow("ai_potential", "AI-Potenzial", proc.ai_potential)}
        <label class="field-label">Notizen / Begründung</label>
        <textarea class="field" id="f-notes" placeholder="Warum viel/wenig Potenzial? Erste Ansätze?">${escapeHtml(proc.notes || "")}</textarea>
      </div>

      <div class="card">
        <div class="section-title" style="margin:0 0 10px;">Teilprozesse</div>
        <div id="sub-processes">
          ${
            subProcesses.length
              ? subProcesses.map((p) => `<a class="link-item" href="#/process/${p.id}">${escapeHtml(p.name)}</a>`).join("")
              : `<div class="empty-state" style="padding:16px 4px;">Noch keine Teilprozesse zugeordnet.</div>`
          }
        </div>
        <div class="row">
          <button class="btn-secondary" id="add-subprocess-btn" style="width:100%;">+ Neuen Teilprozess anlegen</button>
        </div>
      </div>

      <div class="card">
        <div class="section-title" style="margin:0 0 10px;">Zugehörige Use Cases</div>
        <div id="linked-ideas">
          ${
            linkedIdeas.length
              ? linkedIdeas.map((i) => `<a class="link-item" href="#/idea/${i.id}">${escapeHtml(i.quick_note)}</a>`).join("")
              : `<div class="empty-state" style="padding:16px 4px;">Noch keine Idee für diesen Prozess.</div>`
          }
        </div>
        <div class="row">
          <button class="btn-secondary" id="add-idea-btn" style="width:100%;">+ Neue Idee für diesen Prozess</button>
        </div>
      </div>

      <div class="row">
        <button class="btn-primary" id="save-process-detail-btn">Speichern</button>
      </div>
    </main>
  `;

  function updateAiBanner() {
    const val = Number(document.querySelector('[data-field="ai_potential"]').value);
    const ai = aiPotentialInfo(val);
    document.getElementById("ai-potential-banner").innerHTML =
      `<span class="priority-dot" style="background:${ai.color}"></span> Einschätzung: <strong>${ai.label}</strong>`;
  }

  document.querySelectorAll('input[type="range"]').forEach((slider) => {
    slider.addEventListener("input", () => {
      slider.nextElementSibling.textContent = slider.value;
      updateAiBanner();
    });
  });
  updateAiBanner();

  document.getElementById("back-btn").addEventListener("click", () => {
    window.location.hash = "#/processes";
  });

  document.getElementById("delete-btn").addEventListener("click", async () => {
    if (!confirm("Diesen Prozess wirklich löschen? Verknüpfte Ideen bleiben erhalten, verlieren aber die Zuordnung.")) return;
    const ok = await deleteProcess(proc.id);
    if (ok) {
      toast("Prozess gelöscht");
      window.location.hash = "#/processes";
    }
  });

  document.getElementById("add-idea-btn").addEventListener("click", async () => {
    const text = prompt("Kurznotiz für die neue Idee:");
    if (!text || !text.trim()) return;
    const idea = await createIdea(text.trim(), proc.id);
    if (idea) {
      toast("Idee gespeichert");
      ideasCache = await loadIdeas();
      window.location.hash = `#/idea/${idea.id}`;
    }
  });

  document.getElementById("add-subprocess-btn").addEventListener("click", async () => {
    const text = prompt("Name des neuen Teilprozesses:");
    if (!text || !text.trim()) return;
    const sub = await createProcess(text.trim(), proc.id);
    if (sub) {
      toast("Teilprozess gespeichert");
      processesCache = await loadProcesses();
      window.location.hash = `#/process/${sub.id}`;
    }
  });

  document.getElementById("save-process-detail-btn").addEventListener("click", async () => {
    const btn = document.getElementById("save-process-detail-btn");
    btn.disabled = true;
    btn.textContent = "Speichere...";
    const patch = {
      name: document.getElementById("f-name").value.trim(),
      department: document.getElementById("f-department").value.trim(),
      parent_process_id: document.getElementById("f-parent-process").value || null,
      status: document.getElementById("f-status").value,
      description: document.getElementById("f-description").value.trim(),
      ai_potential: Number(document.querySelector('[data-field="ai_potential"]').value),
      notes: document.getElementById("f-notes").value.trim(),
    };
    const updated = await updateProcess(proc.id, patch);
    btn.disabled = false;
    btn.textContent = "Speichern";
    if (updated) {
      const idx = processesCache.findIndex((p) => p.id === proc.id);
      if (idx >= 0) processesCache[idx] = updated;
      toast("Gespeichert");
    }
  });
}

// ---------- View: Settings ----------

function renderSettings() {
  const provider = getAiProvider();
  const info = AI_PROVIDERS[provider];
  const existing = getProviderKey(provider);

  $app.innerHTML = `
    <header class="topbar">
      <div class="back-row">
        <button class="icon-btn" id="back-btn">&larr; Zurück</button>
      </div>
    </header>
    <main>
      <div class="card">
        <div class="section-title" style="margin:0 0 10px;">Eigener KI-API-Key (optional)</div>
        <p style="font-size:13.5px; color:var(--text-dim); margin:0 0 10px; line-height:1.5;">
          Komplett optional: Standardmäßig erzeugt die App einen Prompt zum
          Kopieren, den du in ein beliebiges KI-Chat-Tool einfügst, das du
          bereits nutzt (Copilot, ChatGPT, Claude, Gemini, ...) – ganz ohne
          diesen Key. Nur wer die Ausarbeitung stattdessen automatisch mit
          einem Klick möchte, braucht hier einen eigenen Key.
        </p>
        <p style="font-size:13.5px; color:var(--text-dim); margin:0 0 14px; line-height:1.5;">
          Wichtig: Ein bestehendes Claude- oder ChatGPT-Abo deckt das
          <strong>nicht</strong> ab – der API-Zugang ist ein separates,
          eigenständig abgerechnetes Angebot (siehe Anleitung unten) und wird
          ausschließlich auf diesem Handy gespeichert, nie an Kolleg:innen
          oder einen eigenen Server geschickt.
        </p>
        <div class="tabbar">
          ${Object.keys(AI_PROVIDERS)
            .map(
              (key) =>
                `<button data-provider="${key}" class="${key === provider ? "active" : ""}">${AI_PROVIDERS[key].label}</button>`
            )
            .join("")}
        </div>
        <div style="font-size:13.5px; color:var(--text-dim); margin:14px 0; line-height:1.6;">
          <strong style="color:var(--text);">So kommst du an einen ${info.label}-Key:</strong>
          <ol style="margin:8px 0 0; padding-left:20px;">
            ${info.howTo.map((step) => `<li style="margin-bottom:4px;">${step}</li>`).join("")}
          </ol>
        </div>
        <label class="field-label" style="margin-top:0;">API-Key (${info.label})</label>
        <input class="field" id="f-api-key" type="password" value="${escapeHtml(existing)}" placeholder="${info.placeholder}" autocomplete="off" />
        <div class="row">
          <button class="btn-primary" id="save-key-btn">Speichern</button>
          <button class="btn-secondary" id="remove-key-btn">Entfernen</button>
        </div>
      </div>
    </main>
  `;

  document.getElementById("back-btn").addEventListener("click", () => {
    window.location.hash = "";
  });

  document.querySelectorAll(".tabbar button").forEach((btn) => {
    btn.addEventListener("click", () => {
      setAiProvider(btn.dataset.provider);
      renderSettings();
    });
  });

  document.getElementById("save-key-btn").addEventListener("click", () => {
    const key = document.getElementById("f-api-key").value.trim();
    setProviderKey(provider, key);
    setAiProvider(provider);
    toast(key ? "API-Key gespeichert" : "API-Key entfernt");
  });

  document.getElementById("remove-key-btn").addEventListener("click", () => {
    document.getElementById("f-api-key").value = "";
    setProviderKey(provider, "");
    toast("API-Key entfernt");
  });
}

function renderPendingApproval() {
  $app.innerHTML = `
    <div class="login-wrap">
      <img src="icons/icon-192.png" alt="Logo" />
      <h1>Warten auf Freigabe</h1>
      <p>Dein Konto (${escapeHtml(currentUser.email)}) ist bestätigt, muss aber noch
      von einem Admin freigegeben werden, bevor du Ideen und Prozesse sehen kannst.
      Melde dich kurz bei d.goos@house-of-communication.com.</p>
      <div class="row" style="width:100%; max-width:320px;">
        <button class="btn-secondary" id="recheck-btn" style="width:100%;">Status prüfen</button>
      </div>
      <button class="btn-ghost" id="pending-logout-btn" style="margin-top:14px;">Ausloggen</button>
    </div>
  `;
  document.getElementById("recheck-btn").addEventListener("click", async () => {
    currentProfile = null;
    await render();
  });
  document.getElementById("pending-logout-btn").addEventListener("click", logout);
}

function renderProfileError() {
  $app.innerHTML = `
    <div class="login-wrap">
      <img src="icons/icon-192.png" alt="Logo" />
      <h1>Profil nicht gefunden</h1>
      <p>Es gab ein Problem beim Laden deines Konto-Profils. Bitte kurz neu laden
      oder bei d.goos@house-of-communication.com melden.</p>
      <button class="btn-ghost" id="error-logout-btn">Ausloggen</button>
    </div>
  `;
  document.getElementById("error-logout-btn").addEventListener("click", logout);
}

function adminNavButton() {
  return currentProfile && currentProfile.is_admin
    ? `<button class="icon-btn" id="admin-btn">🛡 Freigaben</button>`
    : "";
}

function bindAdminNavButton() {
  const btn = document.getElementById("admin-btn");
  if (btn) {
    btn.addEventListener("click", () => {
      window.location.hash = "#/admin";
    });
  }
}

async function renderAdmin() {
  profilesCache = await loadAllProfiles();
  const pending = profilesCache.filter((p) => !p.is_approved);
  const approved = profilesCache.filter((p) => p.is_approved);

  $app.innerHTML = `
    <header class="topbar">
      <div class="back-row">
        <button class="icon-btn" id="back-btn">&larr; Zurück</button>
      </div>
    </header>
    <main>
      <div class="section-title" style="margin:0 4px 8px;">Wartet auf Freigabe (${pending.length})</div>
      <div class="idea-list" style="margin-bottom:20px;">
        ${
          pending.length
            ? pending
                .map(
                  (p) => `
              <div class="idea-item">
                <div class="idea-title">${escapeHtml(p.email)}</div>
                <div class="idea-meta">
                  <button class="btn-primary" data-approve="${p.id}" style="padding:8px 14px; font-size:13px;">Freigeben</button>
                </div>
              </div>
            `
                )
                .join("")
            : `<div class="empty-state">Aktuell wartet niemand auf Freigabe.</div>`
        }
      </div>

      <div class="section-title" style="margin:0 4px 8px;">Freigegebene Mitglieder (${approved.length})</div>
      <div class="idea-list">
        ${approved
          .map(
            (p) => `
            <div class="idea-item">
              <div class="idea-title">${escapeHtml(p.email)}</div>
              <div class="idea-meta">
                ${p.is_admin ? `<span class="badge">Admin</span>` : ""}
              </div>
            </div>
          `
          )
          .join("")}
      </div>
    </main>
  `;

  document.getElementById("back-btn").addEventListener("click", () => {
    window.location.hash = "";
  });

  document.querySelectorAll("[data-approve]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      const ok = await approveUser(btn.dataset.approve);
      if (ok) {
        toast("Freigegeben");
        await renderAdmin();
      } else {
        btn.disabled = false;
      }
    });
  });
}

async function render() {
  if (passwordRecoveryMode) {
    renderSetNewPassword();
    return;
  }
  if (!currentUser) {
    renderLogin();
    return;
  }
  if (!currentProfile) {
    currentProfile = await loadOwnProfile();
  }
  if (!currentProfile) {
    renderProfileError();
    return;
  }
  if (!currentProfile.is_approved) {
    renderPendingApproval();
    return;
  }
  const route = currentRoute();
  if (route.view === "idea-detail") {
    await renderDetail(route.id);
  } else if (route.view === "process-list") {
    await renderProcessList();
  } else if (route.view === "process-detail") {
    await renderProcessDetail(route.id);
  } else if (route.view === "settings") {
    renderSettings();
  } else if (route.view === "admin" && currentProfile.is_admin) {
    await renderAdmin();
  } else {
    await renderList();
  }
}

init();
