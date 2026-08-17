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
let ideasCache = [];
let processesCache = [];
let activeFilter = "all";

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
  return { view: "idea-list" };
}

window.addEventListener("hashchange", render);

// ---------- Auth ----------

async function init() {
  const { data } = await sb.auth.getSession();
  currentUser = data.session ? data.session.user : null;
  sb.auth.onAuthStateChange((_event, session) => {
    currentUser = session ? session.user : null;
    render();
  });
  render();
}

async function sendMagicLink(email) {
  const { error } = await sb.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.origin + window.location.pathname },
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

async function elaborateWithAI(idea) {
  const { data, error } = await sb.functions.invoke("elaborate-idea", {
    body: {
      quick_note: idea.quick_note,
      description: idea.description || "",
    },
  });
  if (error) throw error;
  return data;
}

// ---------- Data: Processes ----------

async function loadProcesses() {
  const { data, error } = await sb.from("processes").select("*").order("created_at", { ascending: false });
  if (error) {
    toast("Fehler beim Laden: " + error.message);
    return [];
  }
  return data || [];
}

async function createProcess(name) {
  const { data, error } = await sb
    .from("processes")
    .insert({ name, created_by: currentUser.id })
    .select()
    .single();
  if (error) {
    toast("Fehler beim Speichern: " + error.message);
    return null;
  }
  return data;
}

async function updateProcess(id, patch) {
  const { data, error } = await sb.from("processes").update(patch).eq("id", id).select().single();
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
  $app.innerHTML = `
    <div class="login-wrap">
      <img src="icons/icon-192.png" alt="Logo" />
      <h1>AI Use-Case Sammlung</h1>
      <p>Erfasse Ideen für AI Use-Cases in Sekunden, ordne sie euren Prozessen zu und lass dir von der KI die Umsetzung vorschlagen.</p>
      <form id="login-form" style="width:100%; max-width:320px;">
        <input type="email" id="login-email" placeholder="deine@email.de" required autocomplete="email" />
        <button type="submit" class="btn-primary" style="width:100%;">Login-Link senden</button>
      </form>
      <p id="login-msg" style="margin-top:14px; font-size:13px;"></p>
    </div>
  `;
  document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const btn = e.target.querySelector("button");
    btn.disabled = true;
    btn.textContent = "Sende...";
    const error = await sendMagicLink(email);
    btn.disabled = false;
    btn.textContent = "Login-Link senden";
    const msg = document.getElementById("login-msg");
    msg.textContent = error
      ? "Fehler: " + error.message
      : "Link gesendet! Öffne deine E-Mails auf diesem Handy und tippe auf den Link.";
    msg.style.color = error ? "#ef4444" : "#22c55e";
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
      <button class="icon-btn" id="logout-btn">Logout</button>
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
  document.getElementById("logout-btn").addEventListener("click", logout);

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
        <button class="btn-secondary" id="ai-btn" style="width:100%;">✨ Mit KI ausarbeiten</button>
        <div id="ai-result" class="ai-result"></div>
      </div>

      <div class="card">
        <label class="field-label" style="margin-top:0;">Tools &amp; Umsetzungsoptionen</label>
        <textarea class="field" id="f-tools" placeholder="Wird von der KI vorgeschlagen oder hier selbst eintragen">${escapeHtml(idea.tools || "")}</textarea>

        <label class="field-label">Wichtige Gedanken vorab</label>
        <textarea class="field" id="f-considerations" placeholder="z.B. Datenschutz, Datenquelle, Kosten">${escapeHtml(idea.considerations || "")}</textarea>

        <label class="field-label">Start-Prompt fürs Projekt</label>
        <textarea class="field" id="f-initial-prompt" placeholder="Wird von der KI generiert">${escapeHtml(idea.initial_prompt || "")}</textarea>
        <div class="row">
          <button class="btn-secondary" id="copy-prompt-btn" style="width:100%;">Prompt kopieren</button>
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
    } catch (err) {
      resultEl.innerHTML = `<p style="color:#ef4444; font-size:13.5px;">Fehler: ${escapeHtml(err.message || String(err))}</p>`;
    }
    btn.disabled = false;
    btn.innerHTML = "✨ Mit KI ausarbeiten";
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
      </div>
    </div>
  `;
}

let activeProcessFilter = "all";

async function renderProcessList() {
  $app.innerHTML = `
    <header class="topbar">
      <h1>Prozesse</h1>
      <button class="icon-btn" id="logout-btn">Logout</button>
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
  document.getElementById("logout-btn").addEventListener("click", logout);

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

  document.getElementById("save-process-detail-btn").addEventListener("click", async () => {
    const btn = document.getElementById("save-process-detail-btn");
    btn.disabled = true;
    btn.textContent = "Speichere...";
    const patch = {
      name: document.getElementById("f-name").value.trim(),
      department: document.getElementById("f-department").value.trim(),
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

async function render() {
  if (!currentUser) {
    renderLogin();
    return;
  }
  const route = currentRoute();
  if (route.view === "idea-detail") {
    await renderDetail(route.id);
  } else if (route.view === "process-list") {
    await renderProcessList();
  } else if (route.view === "process-detail") {
    await renderProcessDetail(route.id);
  } else {
    await renderList();
  }
}

init();
