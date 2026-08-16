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

let currentUser = null;
let ideasCache = [];
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

// ---------- Routing ----------

function currentRoute() {
  const hash = window.location.hash;
  const m = hash.match(/^#\/idea\/([^/]+)$/);
  if (m) return { view: "detail", id: m[1] };
  return { view: "list" };
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

// ---------- Data ----------

async function loadIdeas() {
  const { data, error } = await sb
    .from("ideas")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    toast("Fehler beim Laden: " + error.message);
    return [];
  }
  return data || [];
}

async function createIdea(quickNote) {
  const { data, error } = await sb
    .from("ideas")
    .insert({ quick_note: quickNote, created_by: currentUser.id })
    .select()
    .single();
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
    .select()
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

// ---------- Views ----------

function renderLogin() {
  $app.innerHTML = `
    <div class="login-wrap">
      <img src="icons/icon-192.png" alt="Logo" />
      <h1>AI Use-Case Sammlung</h1>
      <p>Erfasse Ideen für AI Use-Cases in Sekunden, bewerte sie später und lass dir von der KI die Umsetzung vorschlagen.</p>
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

async function render() {
  if (!currentUser) {
    renderLogin();
    return;
  }
  const route = currentRoute();
  if (route.view === "detail") {
    await renderDetail(route.id);
  } else {
    await renderList();
  }
}

init();
