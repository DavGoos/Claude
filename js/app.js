const sb = window.supabaseClient;

// ============================================================
// i18n
// ============================================================

const LANG_STORAGE = "ai_ideen_lang";
let currentLang = localStorage.getItem(LANG_STORAGE) === "en" ? "en" : "de";

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem(LANG_STORAGE, lang);
  render();
}

function t(key) {
  const value = (I18N[currentLang] && I18N[currentLang][key]) ?? I18N.de[key];
  return value === undefined ? key : value;
}

// ============================================================
// Hell-/Dunkelmodus
// ============================================================

const THEME_STORAGE = "ai_ideen_theme";
let currentTheme = localStorage.getItem(THEME_STORAGE) === "light" ? "light" : "dark";
document.documentElement.setAttribute("data-theme", currentTheme);

// Spiegelt die Akzentfarbe des aktuellen Modus in der Browser-/OS-Oberfläche
// (z.B. Android-Statusleiste), damit sie zum jeweiligen Modus passt.
function updateThemeColorMeta() {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = currentTheme === "light" ? "#0369a1" : "#047857";
}
updateThemeColorMeta();

// Das echte App-/Homescreen-Icon bleibt fix (dort nicht per JS umschaltbar,
// siehe manifest.json/apple-touch-icon) - nur das Logo auf den
// Login-/Status-Bildschirmen zeigt hier gezielt die passende Akzentfarbe.
function loginLogoSrc() {
  return currentTheme === "light" ? "icons/icon-light-192.png" : "icons/icon-192.png";
}

function setTheme(theme) {
  currentTheme = theme;
  localStorage.setItem(THEME_STORAGE, theme);
  document.documentElement.setAttribute("data-theme", theme);
  updateThemeColorMeta();
  render();
}

const I18N = {
  de: {
    appName: "Process- & AI-Usecase Management",
    tagline:
      "Dokumentiere eure Prozesse, prüft sie auf AI-Potenzial und erfasst AI-Use-Cases in Sekunden – inklusive Bewertung und KI-gestützter Ausarbeitung.",
    login: "Anmelden",
    requestAccessTab: "Zugang anfragen",
    emailPlaceholder: "deine@email.de",
    passwordPlaceholder: "Passwort",
    loggingIn: "Melde an...",
    forgotPassword: "Passwort vergessen?",
    requestAccessDesc:
      "Aus Sicherheitsgründen gibt es keine offene Registrierung mehr. Schick mir kurz deinen Namen und die gewünschte E-Mail-Adresse – ich lege dir dann ein Konto an und schicke dir ein Start-Passwort.",
    requestAccessMailBtn: "📧 Mail an den Admin öffnen",
    requestAccessTeamsNote: "Geht auch ganz einfach per Nachricht in Teams.",
    onboardingBannerText: "📋 Anleitung",
    errorPrefix: "Fehler: ",
    forgotPasswordContactMsg: "Bitte melde dich bei d.goos@house-of-communication.com – dein Passwort wird manuell zurückgesetzt.",
    setNewPasswordTitle: "Neues Passwort setzen",
    setNewPasswordDesc: "Vergib ein neues Passwort für dein Konto.",
    newPasswordPlaceholder: "Neues Passwort",
    savePassword: "Passwort speichern",
    passwordSavedMsg: "Passwort gespeichert, du bist eingeloggt.",
    changePasswordTitle: "Passwort ändern",
    changePasswordDesc: "Eigenes Passwort jederzeit selbst setzen – z.B. nach einem vom Admin vergebenen temporären Passwort.",
    passwordChangedMsg: "Passwort geändert",

    pendingTitle: "Warten auf Freigabe",
    pendingDesc:
      "ist bestätigt, muss aber noch von einem Admin freigegeben werden, bevor du Ideen und Prozesse sehen kannst. Melde dich kurz bei d.goos@house-of-communication.com.",
    checkStatus: "Status prüfen",
    logout: "Ausloggen",
    profileErrorTitle: "Profil nicht gefunden",
    profileErrorDesc:
      "Es gab ein Problem beim Laden deines Konto-Profils. Bitte kurz neu laden oder bei d.goos@house-of-communication.com melden.",

    ideasTab: "Ideen",
    processesTab: "Prozesse",
    adminNav: "🛡 Freigaben",
    exportNav: "🔄 Export",
    logoutBtn: "Logout",
    ideasHeaderTitle: "Ideen",
    processesHeaderTitle: "Prozesse",

    newIdeaLabel: "Neue Idee erfassen",
    ideaPlaceholder: "z.B. Automatische Zusammenfassung von Kundenmails per KI...",
    saveIdea: "Idee speichern",
    ideaSavedMsg: "Idee gespeichert",
    filterAll: "Alle",
    emptyIdeas: "Noch keine Ideen hier. Trag oben deine erste Idee ein!",
    loadingIdeas: "Lade Ideen...",

    status_idea: "Idee",
    status_evaluating: "In Bewertung",
    status_planned: "Geplant",
    status_in_progress: "In Umsetzung",
    status_done: "Fertig",
    status_discarded: "Verworfen",

    priority_quickWin: "Quick Win",
    priority_bigProject: "Großes Projekt",
    priority_niceToHave: "Nice to have",
    priority_postpone: "Eher verschieben",
    priority_review: "Prüfen",

    ai_high: "Hohes AI-Potenzial",
    ai_low: "Geringes AI-Potenzial",
    ai_medium: "Mittleres AI-Potenzial",

    backBtn: "← Zurück",
    deleteBtn: "Löschen",
    quickNoteLabel: "Kurznotiz",
    statusLabel: "Status",
    relatedProcessLabel: "Zugehöriger Prozess",
    noneOption: "— Keiner —",
    stageChainTitle: "Stufenkette",
    stageChainDesc:
      "Ist dieser Use Case der erste Schritt oder eine Weiterentwicklung eines anderen (z.B. GC12 → GC13 → GC14)? Hier verknüpfen, dann ist überall erkennbar, welche Stufe woran gerade gearbeitet wird.",
    previousStageLabel: "Vorherige Stufe",
    noneFirstStageOption: "— Keine (erste Stufe) —",
    stageChainPositionLabel: "Position in der Stufenkette",
    stagePrefix: "Stufe ",
    followUpStagesTitle: "Folgestufen",
    emptyFollowUpStages: "Noch keine Folgestufe angelegt.",
    addFollowUpStageBtn: "+ Neue Folgestufe anlegen",
    newFollowUpStagePrompt: "Kurznotiz für die neue Folgestufe:",
    followUpStageSavedMsg: "Folgestufe gespeichert",
    lastSavedTitle: "Zuletzt gespeichert",
    tagsLabel: "Tags (Komma-getrennt)",
    tagsPlaceholder: "z.B. Vertrieb, Automatisierung",
    descriptionLabel: "Beschreibung",
    descriptionPlaceholder: "Was ist das Problem, was soll die Lösung bringen?",
    problemLabel: "Problem",
    problemPlaceholder: "Welches Problem soll gelöst werden? Was ist aktuell schwierig/aufwendig?",
    goalLabel: "Ziel",
    goalPlaceholder: "Was soll die Lösung konkret erreichen?",
    businessBenefitLabel: "Business Benefit",
    businessBenefitPlaceholder: "Welcher konkrete Nutzen (Zeit, Qualität, Kosten, Risiko) entsteht dadurch?",
    departmentLabel: "Kostenstelle",
    teamLabel: "Team",
    selectPlaceholderOption: "— Bitte wählen —",
    departmentTeamRequiredMsg: "Bitte Kostenstelle und Team auswählen.",
    readOnlyNotice: "Nur Lesezugriff auf diese Kostenstelle – Änderungen können hier nicht gespeichert werden.",

    catalogFieldsTitle: "Weitere Katalog-Felder (optional)",
    catalogFieldsDesc:
      "Zusätzliche Felder für den Abgleich mit der zentralen AI Ambassadors Usecase-Collection. Für die tägliche Nutzung optional – möchtest du diese Idee aber später als Case in die Usecase-Collection kopieren (siehe 🔄 Export), sind genau diese Felder relevant und sollten vorher ausgefüllt sein.",
    aiRoleLabel: "KI-Rolle",
    inputSourceLabel: "Input (Datenquelle)",
    inputSourcePlaceholder: "Woher kommen die Daten/Eingaben?",
    outputResultLabel: "Output (Datenausgabe)",
    outputResultPlaceholder: "Was liefert der Use Case als Ergebnis?",
    kpiKindLabel: "Kind of KPI",
    quantifiedBenefitLabel: "Quantifizierter Nutzen",
    quantifiedBenefitPlaceholder: "z.B. 20 Std./Jahr Ersparnis",
    qualitativeBenefitLabel: "Qualitativer Nutzen",
    qualitativeBenefitPlaceholder: "z.B. bessere Entscheidungsgrundlage",
    commentLabel: "Kommentar",
    listPriorityLabel: "Priorität (Liste)",
    catalogIdLabel: "Katalog-ID",
    catalogIdPlaceholder: "z.B. GC29 (muss eindeutig sein)",
    ownerNameLabel: "Usecase-Geber / Ansprechpartner",
    ownerNamePlaceholder: "Name der verantwortlichen Person",

    exportTitle: "Neue Ideen für die AI Ambassadors Usecase-Collection kopieren",
    exportIntro:
      "Hier stehen alle Ideen, die noch keine Katalog-ID haben – also noch nicht in der zentralen AI Ambassadors Usecase-Collection stehen. Wichtig: Das ist reines Copy & Paste, hier wird nichts automatisch geschrieben oder synchronisiert. Kopiere eine Idee (oder alle) und füge sie selbst als neue Zeile in die Usecase-Collection ein (am einfachsten mit der Tab-getrennt-Option unten), oder poste den Text stattdessen in den Chat mit Claude, wenn du beim Einordnen Unterstützung möchtest. Trag die dort vergebene Katalog-ID (z.B. GC30) anschließend hier bei der Idee ein, dann verschwindet sie aus dieser Liste.",
    exportFieldsNote:
      "Vor dem Kopieren prüfen: Bei der Idee gibt es einen ausklappbaren Bereich \"Weitere Katalog-Felder\" (KI-Rolle, Input, Output, Kind of KPI, quantifizierter/qualitativer Nutzen, Kommentar, Priorität). Die sind für die tägliche Nutzung optional – für einen vollständigen Case in der Usecase-Collection sind es aber genau die relevanten Felder und sollten ausgefüllt sein, bevor du kopierst.",
    exportEmpty: "Alle Ideen haben bereits eine Katalog-ID – nichts zu kopieren.",
    copyOneBtn: "📋 Kopieren",
    copyAllBtn: "📋 Alle kopieren",
    copyTsvOneBtn: "📋 Tab-getrennt (Excel-Zeile)",
    copyTsvAllBtn: "📋 Alle als Excel-Zeilen",
    exportTsvNote:
      "Reines Copy & Paste: die Excel-Zeile(n) direkt ab einer neuen Zeile in der AI Ambassadors Usecase-Collection einfügen (Strg+V) – nichts davon läuft automatisch. ID Nr bleibt leer – dort die nächste freie GC-Nummer aus der Collection eintragen. Brand/Agency werden mit \"Shared Service\"/\"Group Controlling\" vorbelegt. Die Übersetzungs-Formelspalten (\"#CONNECT!\") danach aus der Zeile darüber nach unten ziehen.",

    evaluationTitle: "Bewertung",
    impactLabel: "Nutzen",
    feasibilityLabel: "Machbarkeit",
    effortLabel: "Aufwand",
    riskLabel: "Risiko",
    assessmentPrefix: "Einschätzung: ",

    aiSupportTitle: "KI-Unterstützung",
    aiSupportDesc:
      "Erzeuge einen fertigen Prompt und füge ihn in ein beliebiges KI-Chat-Tool ein, das du bereits nutzt (Copilot, ChatGPT, Claude, Gemini, ...) – kein eigener API-Key nötig. Kopier die Antwort danach hier zurück rein.",
    generatePromptBtn: "📋 Prompt erzeugen",
    copyToClipboardBtn: "In Zwischenablage kopieren",
    aiResponsePasteLabel: "Antwort der KI hier einfügen",
    aiResponsePlaceholder: "Antwort aus Copilot/ChatGPT/Claude/... hier einfügen",
    applyBtn: "Übernehmen",
    optionalApiDetails: "Stattdessen automatisch mit eigenem API-Key (optional)",
    autoElaborateBtn: "✨ Automatisch mit KI ausarbeiten",
    aiWorkingMsg: "KI arbeitet...",

    toolsLabel: "Tools & Umsetzungsoptionen",
    toolsPlaceholder: "Wird von der KI vorgeschlagen oder hier selbst eintragen",
    considerationsLabel: "Wichtige Gedanken vorab",
    considerationsPlaceholder: "z.B. Datenschutz, Datenquelle, Kosten",
    startPromptLabel: "Start-Prompt fürs Projekt",
    startPromptPlaceholder: "Wird von der KI generiert",
    copyStartPromptBtn: "Start-Prompt kopieren",

    saveBtn: "Speichern",
    savingBtn: "Speichere...",
    savedMsg: "Gespeichert",
    deleteIdeaConfirm: "Diese Idee wirklich löschen?",
    ideaDeletedMsg: "Idee gelöscht",
    copiedMsg: "In Zwischenablage kopiert",
    copyFailedMsg: "Kopieren nicht möglich, bitte manuell markieren",
    copiedPasteHintMsg: "In Zwischenablage kopiert – jetzt in dein KI-Tool einfügen",
    couldNotParseMsg:
      "Konnte die Antwort nicht automatisch auslesen. Du kannst die Felder unten auch selbst aus der Antwort befüllen.",
    proposalApplied: "Vorschlag übernommen, denk ans Speichern!",
    suggestedProblem: "Vorschlag Problem",
    suggestedGoal: "Vorschlag Ziel",
    suggestedBusinessBenefit: "Vorschlag Business Benefit",
    suggestedTools: "Vorschlag Tools",
    suggestedConsiderations: "Wichtige Gedanken vorab",
    suggestedStartPrompt: "Start-Prompt",
    applySuggestionBtn: "Vorschlag übernehmen",

    newProcessLabel: "Neuen Prozess dokumentieren",
    processPlaceholder: "z.B. Angebote erstellen, Rechnungsprüfung, Kundenonboarding...",
    saveProcessBtn: "Prozess speichern",
    processSavedMsg: "Prozess gespeichert",
    emptyProcesses: "Noch keine Prozesse erfasst. Trag oben den ersten Prozess deines Bereichs ein!",
    loadingProcesses: "Lade Prozesse...",

    pstatus_open: "Offen",
    pstatus_reviewed: "Geprüft",

    processNameLabel: "Prozessname",
    parentProcessLabel: "Übergeordneter Prozess",
    noneTopLevelOption: "— Keiner (Top-Level-Prozess) —",
    aiPotentialTitle: "AI-Potenzial",
    aiPotentialLabel: "AI-Potenzial",
    notesLabel: "Notizen / Begründung",
    notesPlaceholder: "Warum viel/wenig Potenzial? Erste Ansätze?",
    processDescPlaceholder: "Wie läuft der Prozess ab, wer ist beteiligt?",
    subProcessesTitle: "Teilprozesse",
    emptySubProcesses: "Noch keine Teilprozesse zugeordnet.",
    addSubProcessBtn: "+ Neuen Teilprozess anlegen",
    linkedUseCasesTitle: "Zugehörige Use Cases",
    emptyLinkedIdeas: "Noch keine Idee für diesen Prozess.",
    addIdeaBtn: "+ Neue Idee für diesen Prozess",
    newIdeaPrompt: "Kurznotiz für die neue Idee:",
    newSubProcessPrompt: "Name des neuen Teilprozesses:",
    deleteProcessConfirm:
      "Diesen Prozess wirklich löschen? Verknüpfte Ideen bleiben erhalten, verlieren aber die Zuordnung.",
    processDeletedMsg: "Prozess gelöscht",
    subProcessSavedMsg: "Teilprozess gespeichert",

    settingsTitleOptionalKey: "Eigener KI-API-Key (optional)",
    settingsIntro1:
      "Komplett optional: Standardmäßig erzeugt die App einen Prompt zum Kopieren, den du in ein beliebiges KI-Chat-Tool einfügst, das du bereits nutzt (Copilot, ChatGPT, Claude, Gemini, ...) – ganz ohne diesen Key. Nur wer die Ausarbeitung stattdessen automatisch mit einem Klick möchte, braucht hier einen eigenen Key.",
    settingsIntro2:
      "Wichtig: Ein bestehendes Claude- oder ChatGPT-Abo deckt das nicht ab – der API-Zugang ist ein separates, eigenständig abgerechnetes Angebot (siehe Anleitung unten) und wird ausschließlich auf diesem Handy gespeichert, nie an Kolleg:innen oder einen eigenen Server geschickt.",
    howToTitle: "So kommst du an einen $-Key:",
    apiKeyLabelPrefix: "API-Key (",
    removeBtn: "Entfernen",
    keySavedMsg: "API-Key gespeichert",
    keyRemovedMsg: "API-Key entfernt",

    pendingApprovalTitlePrefix: "Wartet auf Freigabe (",
    noPendingMsg: "Aktuell wartet niemand auf Freigabe.",
    approveBtn: "Freigeben",
    rejectBtn: "Ablehnen",
    rejectConfirmMsg: "Diese Registrierung ablehnen? Die Person verschwindet dauerhaft aus dieser Liste und bleibt ohne Zugriff.",
    rejectedMsg: "Abgelehnt",
    approvedMembersTitlePrefix: "Freigegebene Mitglieder (",
    adminBadge: "Admin",
    approvedMsg: "Freigegeben",

    kostenstellenTitle: "Kostenstellen & Zugriffsrechte",
    newKostenstelleLabel: "Neue Kostenstelle anlegen",
    kostenstelleCodePlaceholder: "Code, z.B. 050010 CO",
    kostenstelleNamePlaceholder: "Name, z.B. Treasury",
    addKostenstelleBtn: "+ Kostenstelle anlegen",
    kostenstelleSavedMsg: "Kostenstelle angelegt",
    accessSavedMsg: "Zugriff aktualisiert",
    accessNoneOption: "Kein Zugriff",
    accessReadOption: "Nur Lesen",
    accessWriteOption: "Lesen & Schreiben",
    emptyKostenstellen: "Noch keine Kostenstellen angelegt.",
    noApprovedForAccessMsg: "Noch keine freigegebenen Kolleg:innen zum Zuweisen.",
    allTeamsScope: "Alle Teams (ganze Kostenstelle)",
    translatedReadonlyTitle: "Übersetzte Ansicht – zum Bearbeiten auf Deutsch (DE) umschalten.",
    themeToggleTitle: "Hell-/Dunkelmodus umschalten",

    loadErrorPrefix: "Fehler beim Laden: ",
    saveErrorPrefix: "Fehler beim Speichern: ",
    deleteErrorPrefix: "Fehler beim Löschen: ",
    profileLoadErrorPrefix: "Fehler beim Laden des Profils: ",
    approveErrorPrefix: "Fehler beim Freigeben: ",
    rejectErrorPrefix: "Fehler beim Ablehnen: ",
    noApiKeyError: "Kein eigener API-Key hinterlegt. Bitte unter Einstellungen eintragen.",
    claudeApiError: "Claude API Fehler: ",
    openaiApiError: "OpenAI API Fehler: ",
  },
  en: {
    appName: "Process & AI Use Case Management",
    tagline:
      "Document your team's processes, screen them for AI potential, and capture AI use cases in seconds - including scoring and AI-assisted elaboration.",
    login: "Log in",
    requestAccessTab: "Request access",
    emailPlaceholder: "you@email.com",
    passwordPlaceholder: "Password",
    loggingIn: "Logging in...",
    forgotPassword: "Forgot password?",
    requestAccessDesc:
      "For security reasons there's no open self-registration anymore. Just send me your name and the email address you'd like to use - I'll set up an account and send you a starting password.",
    requestAccessMailBtn: "📧 Open email to admin",
    requestAccessTeamsNote: "A quick Teams message works just as well.",
    onboardingBannerText: "📋 Guide",
    errorPrefix: "Error: ",
    forgotPasswordContactMsg: "Please contact d.goos@house-of-communication.com - your password will be reset manually.",
    setNewPasswordTitle: "Set a new password",
    setNewPasswordDesc: "Choose a new password for your account.",
    newPasswordPlaceholder: "New password",
    savePassword: "Save password",
    passwordSavedMsg: "Password saved, you're logged in.",
    changePasswordTitle: "Change password",
    changePasswordDesc: "Set your own password any time - e.g. after a temporary one from the admin.",
    passwordChangedMsg: "Password changed",

    pendingTitle: "Waiting for approval",
    pendingDesc:
      "is confirmed, but still needs to be approved by an admin before you can see ideas and processes. Reach out to d.goos@house-of-communication.com.",
    checkStatus: "Check status",
    logout: "Log out",
    profileErrorTitle: "Profile not found",
    profileErrorDesc:
      "There was a problem loading your account profile. Please reload, or reach out to d.goos@house-of-communication.com.",

    ideasTab: "Ideas",
    processesTab: "Processes",
    adminNav: "🛡 Approvals",
    exportNav: "🔄 Export",
    logoutBtn: "Log out",
    ideasHeaderTitle: "Ideas",
    processesHeaderTitle: "Processes",

    newIdeaLabel: "Capture a new idea",
    ideaPlaceholder: "e.g. Automatic summary of customer emails via AI...",
    saveIdea: "Save idea",
    ideaSavedMsg: "Idea saved",
    filterAll: "All",
    emptyIdeas: "No ideas yet. Add your first one above!",
    loadingIdeas: "Loading ideas...",

    status_idea: "Idea",
    status_evaluating: "Evaluating",
    status_planned: "Planned",
    status_in_progress: "In progress",
    status_done: "Done",
    status_discarded: "Discarded",

    priority_quickWin: "Quick win",
    priority_bigProject: "Big project",
    priority_niceToHave: "Nice to have",
    priority_postpone: "Better postpone",
    priority_review: "Review",

    ai_high: "High AI potential",
    ai_low: "Low AI potential",
    ai_medium: "Medium AI potential",

    backBtn: "← Back",
    deleteBtn: "Delete",
    quickNoteLabel: "Quick note",
    statusLabel: "Status",
    relatedProcessLabel: "Related process",
    noneOption: "— None —",
    stageChainTitle: "Stage chain",
    stageChainDesc:
      "Is this use case the first step, or a follow-up on another one (e.g. GC12 → GC13 → GC14)? Link it here so everyone can see which stage is currently being worked on.",
    previousStageLabel: "Previous stage",
    noneFirstStageOption: "— None (first stage) —",
    stageChainPositionLabel: "Position in the stage chain",
    stagePrefix: "Stage ",
    followUpStagesTitle: "Follow-up stages",
    emptyFollowUpStages: "No follow-up stage yet.",
    addFollowUpStageBtn: "+ Add follow-up stage",
    newFollowUpStagePrompt: "Quick note for the new follow-up stage:",
    followUpStageSavedMsg: "Follow-up stage saved",
    lastSavedTitle: "Last saved",
    tagsLabel: "Tags (comma-separated)",
    tagsPlaceholder: "e.g. Sales, Automation",
    descriptionLabel: "Description",
    descriptionPlaceholder: "What's the problem, what should the solution achieve?",
    problemLabel: "Problem",
    problemPlaceholder: "What problem should be solved? What's currently hard/slow/error-prone?",
    goalLabel: "Goal",
    goalPlaceholder: "What should the solution actually achieve?",
    businessBenefitLabel: "Business Benefit",
    businessBenefitPlaceholder: "What concrete benefit (time, quality, cost, risk) does this create?",
    departmentLabel: "Cost center",
    teamLabel: "Team",
    selectPlaceholderOption: "— Please select —",
    departmentTeamRequiredMsg: "Please select cost center and team.",
    readOnlyNotice: "Read-only access to this cost center - changes here can't be saved.",

    catalogFieldsTitle: "Additional catalog fields (optional)",
    catalogFieldsDesc:
      "Extra fields to align with the central AI Ambassadors Usecase Collection. Optional for everyday use - but if you plan to copy this idea into the Usecase Collection as a case later (see 🔄 Export), these are exactly the fields that matter and should be filled in beforehand.",
    aiRoleLabel: "AI role",
    inputSourceLabel: "Input (data source)",
    inputSourcePlaceholder: "Where does the data/input come from?",
    outputResultLabel: "Output (result)",
    outputResultPlaceholder: "What does the use case deliver as a result?",
    kpiKindLabel: "Kind of KPI",
    quantifiedBenefitLabel: "Quantified benefit",
    quantifiedBenefitPlaceholder: "e.g. 20 hrs/year saved",
    qualitativeBenefitLabel: "Qualitative benefit",
    qualitativeBenefitPlaceholder: "e.g. better basis for decisions",
    commentLabel: "Comment",
    listPriorityLabel: "Priority (catalog)",
    catalogIdLabel: "Catalog ID",
    catalogIdPlaceholder: "e.g. GC29 (must be unique)",
    ownerNameLabel: "Use case owner / contact",
    ownerNamePlaceholder: "Name of the responsible person",

    exportTitle: "Copy new ideas into the AI Ambassadors Usecase Collection",
    exportIntro:
      "This lists every idea that doesn't have a catalog ID yet - i.e. isn't in the central AI Ambassadors Usecase Collection yet. Important: this is plain copy & paste, nothing here writes or syncs anything automatically. Copy one idea (or all of them) and paste it yourself as a new row into the Usecase Collection (easiest with the tab-separated option below), or post the text into the chat with Claude instead if you'd like help sorting it out. Enter the catalog ID assigned there (e.g. GC30) back on the idea afterwards, then it disappears from this list.",
    exportFieldsNote:
      "Check before copying: the idea has an expandable \"Additional catalog fields\" section (AI role, input, output, kind of KPI, quantified/qualitative benefit, comment, priority). Those are optional for everyday use - but for a complete case in the Usecase Collection they're exactly the fields that matter, so fill them in before copying.",
    exportEmpty: "Every idea already has a catalog ID - nothing to copy.",
    copyOneBtn: "📋 Copy",
    copyAllBtn: "📋 Copy all",
    copyTsvOneBtn: "📋 Tab-separated (Excel row)",
    copyTsvAllBtn: "📋 All as Excel rows",
    exportTsvNote:
      "Plain copy & paste: paste the Excel row(s) starting at a new row in the AI Ambassadors Usecase Collection (Ctrl+V) - none of this happens automatically. ID Nr stays blank - fill in the next free GC number from the Collection there. Brand/Agency default to \"Shared Service\"/\"Group Controlling\". Afterwards drag the translation formula columns (\"#CONNECT!\") down from the row above.",

    evaluationTitle: "Scoring",
    impactLabel: "Impact",
    feasibilityLabel: "Feasibility",
    effortLabel: "Effort",
    riskLabel: "Risk",
    assessmentPrefix: "Assessment: ",

    aiSupportTitle: "AI support",
    aiSupportDesc:
      "Generate a ready-made prompt and paste it into any AI chat tool you already use (Copilot, ChatGPT, Claude, Gemini, ...) - no API key needed. Paste the reply back in here afterwards.",
    generatePromptBtn: "📋 Generate prompt",
    copyToClipboardBtn: "Copy to clipboard",
    aiResponsePasteLabel: "Paste the AI's reply here",
    aiResponsePlaceholder: "Paste the reply from Copilot/ChatGPT/Claude/... here",
    applyBtn: "Apply",
    optionalApiDetails: "Or automatically with your own API key (optional)",
    autoElaborateBtn: "✨ Elaborate automatically with AI",
    aiWorkingMsg: "AI is working...",

    toolsLabel: "Tools & implementation options",
    toolsPlaceholder: "Suggested by AI, or fill in yourself",
    considerationsLabel: "Key considerations upfront",
    considerationsPlaceholder: "e.g. Privacy, data sources, cost",
    startPromptLabel: "Starter prompt for the project",
    startPromptPlaceholder: "Generated by AI",
    copyStartPromptBtn: "Copy starter prompt",

    saveBtn: "Save",
    savingBtn: "Saving...",
    savedMsg: "Saved",
    deleteIdeaConfirm: "Really delete this idea?",
    ideaDeletedMsg: "Idea deleted",
    copiedMsg: "Copied to clipboard",
    copyFailedMsg: "Couldn't copy, please select manually",
    copiedPasteHintMsg: "Copied to clipboard - now paste it into your AI tool",
    couldNotParseMsg:
      "Couldn't automatically parse the reply. You can also fill in the fields below yourself from the reply.",
    proposalApplied: "Suggestion applied, remember to save!",
    suggestedProblem: "Suggested problem",
    suggestedGoal: "Suggested goal",
    suggestedBusinessBenefit: "Suggested business benefit",
    suggestedTools: "Suggested tools",
    suggestedConsiderations: "Key considerations upfront",
    suggestedStartPrompt: "Starter prompt",
    applySuggestionBtn: "Apply suggestion",

    newProcessLabel: "Document a new process",
    processPlaceholder: "e.g. Creating quotes, invoice review, customer onboarding...",
    saveProcessBtn: "Save process",
    processSavedMsg: "Process saved",
    emptyProcesses: "No processes yet. Add the first process of your area above!",
    loadingProcesses: "Loading processes...",

    pstatus_open: "Open",
    pstatus_reviewed: "Reviewed",

    processNameLabel: "Process name",
    parentProcessLabel: "Parent process",
    noneTopLevelOption: "— None (top-level process) —",
    aiPotentialTitle: "AI potential",
    aiPotentialLabel: "AI potential",
    notesLabel: "Notes / rationale",
    notesPlaceholder: "Why much/little potential? Initial approaches?",
    processDescPlaceholder: "How does the process run, who's involved?",
    subProcessesTitle: "Sub-processes",
    emptySubProcesses: "No sub-processes assigned yet.",
    addSubProcessBtn: "+ Add new sub-process",
    linkedUseCasesTitle: "Related use cases",
    emptyLinkedIdeas: "No idea for this process yet.",
    addIdeaBtn: "+ Add new idea for this process",
    newIdeaPrompt: "Quick note for the new idea:",
    newSubProcessPrompt: "Name of the new sub-process:",
    deleteProcessConfirm: "Really delete this process? Linked ideas stay, but lose their assignment.",
    processDeletedMsg: "Process deleted",
    subProcessSavedMsg: "Sub-process saved",

    settingsTitleOptionalKey: "Your own AI API key (optional)",
    settingsIntro1:
      "Completely optional: by default the app generates a prompt to copy, which you paste into any AI chat tool you already use (Copilot, ChatGPT, Claude, Gemini, ...) - no key needed at all. Only if you want the one-click automatic elaboration instead, you need your own key here.",
    settingsIntro2:
      "Important: an existing Claude or ChatGPT subscription does not cover this - API access is a separate, independently billed offering (see instructions below) and is stored only on this phone, never sent to colleagues or a server of ours.",
    howToTitle: "How to get a $ key:",
    apiKeyLabelPrefix: "API key (",
    removeBtn: "Remove",
    keySavedMsg: "API key saved",
    keyRemovedMsg: "API key removed",

    pendingApprovalTitlePrefix: "Waiting for approval (",
    noPendingMsg: "No one is currently waiting for approval.",
    approveBtn: "Approve",
    rejectBtn: "Reject",
    rejectConfirmMsg: "Reject this registration? The person disappears from this list permanently and stays without access.",
    rejectedMsg: "Rejected",
    approvedMembersTitlePrefix: "Approved members (",
    adminBadge: "Admin",
    approvedMsg: "Approved",

    kostenstellenTitle: "Cost centers & access",
    newKostenstelleLabel: "Add a new cost center",
    kostenstelleCodePlaceholder: "Code, e.g. 050010 CO",
    kostenstelleNamePlaceholder: "Name, e.g. Treasury",
    addKostenstelleBtn: "+ Add cost center",
    kostenstelleSavedMsg: "Cost center added",
    accessSavedMsg: "Access updated",
    accessNoneOption: "No access",
    accessReadOption: "Read only",
    accessWriteOption: "Read & write",
    emptyKostenstellen: "No cost centers set up yet.",
    noApprovedForAccessMsg: "No approved colleagues to assign yet.",
    allTeamsScope: "All teams (whole cost center)",
    translatedReadonlyTitle: "Translated view – switch to German (DE) to edit.",
    themeToggleTitle: "Toggle light/dark mode",

    loadErrorPrefix: "Error loading: ",
    saveErrorPrefix: "Error saving: ",
    deleteErrorPrefix: "Error deleting: ",
    profileLoadErrorPrefix: "Error loading profile: ",
    approveErrorPrefix: "Error approving: ",
    rejectErrorPrefix: "Error rejecting: ",
    noApiKeyError: "No personal API key set. Please add one under Settings.",
    claudeApiError: "Claude API error: ",
    openaiApiError: "OpenAI API error: ",
  },
};

const STATUS_ORDER = ["idea", "evaluating", "planned", "in_progress", "done", "discarded"];
const PROCESS_STATUS_ORDER = ["open", "reviewed"];

// Kostenstelle (das Pflichtfeld "department" bei ideas/processes) kommt
// jetzt aus der Tabelle "kostenstellen" + individuellem Zugriffslevel pro
// Person und Team (siehe kostenstellenCache/myGrants) statt aus einer
// festen Liste. Team bleibt bewusst nur hier in der App gepflegt (nicht
// als DB-Constraint) - Liste einfach erweitern.
const TEAM_OPTIONS = ["Group Controlling", "Treasury", "Cost Allocation", "Workforce Controlling", "BI-Strategy"];
const TEAM_SCOPES = ["*", ...TEAM_OPTIONS];

// Zusätzliche, optionale Katalog-Felder für den Abgleich mit dem
// bestehenden Excel-Use-Case-Katalog. Werte bewusst nicht übersetzt
// (unabhängig von der UI-Sprache), damit Import/Export mit der Liste
// exakt passt.
const AI_ROLE_OPTIONS = ["Automatisieren", "Ergänzen", "Ersetzen", "Intelligenter Assistenzpartner"];
const KPI_KIND_OPTIONS = ["Quantity", "Quality", "Hybrid"];
const LIST_PRIORITY_OPTIONS = ["in using", "ungültig", "High", "Medium", "Low"];

// Freitext-Felder mit optionaler "_en"-Übersetzungsspalte (vom Admin auf
// Zuruf im Chat gepflegt, siehe README "Zweisprachige Inhalte").
const TRANSLATABLE_IDEA_FIELDS = [
  "quick_note",
  "problem",
  "goal",
  "business_benefit",
  "considerations",
  "qualitative_benefit",
  "comment",
];
const TRANSLATABLE_PROCESS_FIELDS = ["name", "description", "notes"];

let currentUser = null;
let currentProfile = null;
let ideasCache = [];
let processesCache = [];
let profilesCache = [];
let kostenstellenCache = [];
let myGrants = [];
let accessCache = [];
let activeFilter = "all";
let passwordRecoveryMode = false;
let authMode = "login";

const $app = document.getElementById("app");

function escapeHtml(str) {
  return (str || "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c]);
}

// Manche Freitext-Felder (siehe TRANSLATABLE_IDEA_FIELDS/TRANSLATABLE_PROCESS_FIELDS)
// haben eine "_en"-Spalte für eine vom Admin gepflegte Übersetzung (auf
// Zuruf im Chat übersetzt und per SQL eingetragen, siehe README). Ist die
// UI-Sprache Englisch und eine Übersetzung vorhanden, wird sie angezeigt;
// sonst automatisch das Original, damit nie ein Feld leer wirkt.
function trValue(obj, field) {
  if (currentLang === "en" && obj[`${field}_en`]) return obj[`${field}_en`];
  return obj[field] || "";
}

// Ein Feld, das gerade die (vom Admin gepflegte) Übersetzung zeigt, wird
// nicht bearbeitbar - sonst würde ein Speichern versehentlich die
// englische Anzeige in die deutsche Originalspalte zurückschreiben. Zum
// Bearbeiten einfach auf Deutsch (DE) umschalten.
function isTranslatedReadonly(obj, field) {
  return currentLang === "en" && !!obj[`${field}_en`];
}

function trReadonlyAttr(obj, field) {
  return isTranslatedReadonly(obj, field) ? ` readonly title="${escapeHtml(t("translatedReadonlyTitle"))}"` : "";
}

function formatDateTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleString(currentLang === "en" ? "en-GB" : "de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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
  if (impact >= 4 && effort <= 2) return { label: t("priority_quickWin"), color: "#22c55e" };
  if (impact >= 4 && effort >= 4) return { label: t("priority_bigProject"), color: "#8b5cf6" };
  if (impact <= 2 && effort <= 2) return { label: t("priority_niceToHave"), color: "#93c5fd" };
  if (impact <= 2 && effort >= 4) return { label: t("priority_postpone"), color: "#9aa1af" };
  return { label: t("priority_review"), color: "#fcd34d" };
}

function aiPotentialInfo(value) {
  const v = value || 3;
  if (v >= 4) return { label: t("ai_high"), color: "#22c55e" };
  if (v <= 2) return { label: t("ai_low"), color: "#9aa1af" };
  return { label: t("ai_medium"), color: "#fcd34d" };
}

function langToggleButton() {
  const nextLang = currentLang === "de" ? "en" : "de";
  return `<button class="icon-btn" id="lang-btn" data-next-lang="${nextLang}">${nextLang.toUpperCase()}</button>`;
}

function bindLangToggle() {
  const btn = document.getElementById("lang-btn");
  if (btn) {
    btn.addEventListener("click", () => setLang(btn.dataset.nextLang));
  }
}

function themeToggleButton() {
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  const icon = currentTheme === "dark" ? "☀️" : "🌙";
  return `<button class="icon-btn" id="theme-btn" data-next-theme="${nextTheme}" title="${t("themeToggleTitle")}">${icon}</button>`;
}

function bindThemeToggle() {
  const btn = document.getElementById("theme-btn");
  if (btn) {
    btn.addEventListener("click", () => setTheme(btn.dataset.nextTheme));
  }
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
  if (hash === "#/export") return { view: "export" };
  return { view: "idea-list" };
}

window.addEventListener("hashchange", render);

// ---------- Auth ----------

async function loadOwnProfile() {
  const { data, error } = await sb.from("profiles").select("*").eq("id", currentUser.id).single();
  if (error) {
    toast(t("profileLoadErrorPrefix") + error.message);
    return null;
  }
  return data;
}

async function loadAllProfiles() {
  const { data, error } = await sb.from("profiles").select("*").order("created_at", { ascending: false });
  if (error) {
    toast(t("loadErrorPrefix") + error.message);
    return [];
  }
  return data || [];
}

async function approveUser(id) {
  const { error } = await sb.from("profiles").update({ is_approved: true }).eq("id", id);
  if (error) {
    toast(t("approveErrorPrefix") + error.message);
    return false;
  }
  return true;
}

async function rejectUser(id) {
  const { error } = await sb.from("profiles").update({ is_rejected: true }).eq("id", id);
  if (error) {
    toast(t("rejectErrorPrefix") + error.message);
    return false;
  }
  return true;
}

// ---------- Data: Kostenstellen & Zugriffsrechte ----------

async function loadKostenstellen() {
  const { data, error } = await sb.from("kostenstellen").select("*").order("code");
  if (error) {
    toast(t("loadErrorPrefix") + error.message);
    return [];
  }
  return data || [];
}

async function loadMyGrants() {
  if (currentProfile.is_admin) return [];
  const { data, error } = await sb
    .from("kostenstelle_access")
    .select("kostenstelle_code, team, access_level")
    .eq("user_id", currentUser.id);
  if (error) {
    toast(t("loadErrorPrefix") + error.message);
    return [];
  }
  return data || [];
}

// Kostenstellen, für die die aktuelle Person irgendein Team schreiben darf.
function writableCodes() {
  if (currentProfile.is_admin) return kostenstellenCache.map((k) => k.code);
  return Array.from(new Set(myGrants.filter((g) => g.access_level === "write").map((g) => g.kostenstelle_code)));
}

// Teams, für die die aktuelle Person innerhalb einer bestimmten Kostenstelle
// schreiben darf (team = "*" bei einem Grant deckt alle Teams ab).
function writableTeamsForCode(code) {
  if (!code) return TEAM_OPTIONS.slice();
  if (currentProfile.is_admin) return TEAM_OPTIONS.slice();
  const grants = myGrants.filter((g) => g.kostenstelle_code === code && g.access_level === "write");
  if (grants.some((g) => g.team === "*")) return TEAM_OPTIONS.slice();
  return TEAM_OPTIONS.filter((team) => grants.some((g) => g.team === team));
}

function canWriteCombo(code, team) {
  if (currentProfile.is_admin) return true;
  return myGrants.some(
    (g) => g.kostenstelle_code === code && g.access_level === "write" && (g.team === "*" || g.team === team)
  );
}

async function loadAllAccess() {
  const { data, error } = await sb.from("kostenstelle_access").select("*");
  if (error) {
    toast(t("loadErrorPrefix") + error.message);
    return [];
  }
  return data || [];
}

async function createKostenstelle(code, name) {
  const { data, error } = await sb.from("kostenstellen").insert({ code, name }).select("*").single();
  if (error) {
    toast(t("saveErrorPrefix") + error.message);
    return null;
  }
  return data;
}

async function setKostenstelleAccess(userId, code, team, level) {
  if (!level) {
    const { error } = await sb
      .from("kostenstelle_access")
      .delete()
      .eq("user_id", userId)
      .eq("kostenstelle_code", code)
      .eq("team", team);
    if (error) {
      toast(t("saveErrorPrefix") + error.message);
      return false;
    }
    return true;
  }
  const { error } = await sb
    .from("kostenstelle_access")
    .upsert({ user_id: userId, kostenstelle_code: code, team, access_level: level });
  if (error) {
    toast(t("saveErrorPrefix") + error.message);
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

async function signInWithPassword(email, password) {
  const { error } = await sb.auth.signInWithPassword({ email, password });
  return error;
}

async function logout() {
  await sb.auth.signOut();
  window.location.hash = "";
}

// ---------- Data: Ideas ----------

const IDEA_SELECT = "*, processes(id, name, name_en), parent:parent_idea_id(id, quick_note, quick_note_en, catalog_id, status)";

async function loadIdeas() {
  const { data, error } = await sb
    .from("ideas")
    .select(IDEA_SELECT)
    .order("created_at", { ascending: false });
  if (error) {
    toast(t("loadErrorPrefix") + error.message);
    return [];
  }
  return data || [];
}

async function createIdea(quickNote, department, team, processId, parentIdeaId) {
  const payload = { quick_note: quickNote, department, team, created_by: currentUser.id };
  if (processId) payload.process_id = processId;
  if (parentIdeaId) payload.parent_idea_id = parentIdeaId;
  const { data, error } = await sb.from("ideas").insert(payload).select(IDEA_SELECT).single();
  if (error) {
    toast(t("saveErrorPrefix") + error.message);
    return null;
  }
  return data;
}

async function updateIdea(id, patch) {
  const { data, error } = await sb
    .from("ideas")
    .update(patch)
    .eq("id", id)
    .select(IDEA_SELECT)
    .single();
  if (error) {
    toast(t("saveErrorPrefix") + error.message);
    return null;
  }
  return data;
}

async function deleteIdea(id) {
  const { error } = await sb.from("ideas").delete().eq("id", id);
  if (error) {
    toast(t("deleteErrorPrefix") + error.message);
    return false;
  }
  return true;
}

const AI_PROVIDERS = {
  anthropic: {
    label: "Claude",
    keyStorage: "ai_ideen_anthropic_key",
    placeholder: "sk-ant-...",
    howTo: {
      de: [
        "Auf console.anthropic.com registrieren oder einloggen.",
        'Links im Menü auf "API Keys" gehen und einen neuen Key erstellen.',
        "Etwas Guthaben aufladen (wenige Euro reichen für sehr viele Nutzungen).",
      ],
      en: [
        "Sign up or log in at console.anthropic.com.",
        'Go to "API Keys" in the left menu and create a new key.',
        "Add a bit of credit (a few euros/dollars covers a lot of usage).",
      ],
    },
  },
  openai: {
    label: "OpenAI (ChatGPT)",
    keyStorage: "ai_ideen_openai_key",
    placeholder: "sk-...",
    howTo: {
      de: [
        "Auf platform.openai.com registrieren oder einloggen.",
        'Über das Nutzermenü zu "API keys" gehen und einen neuen Key erstellen.',
        "Etwas Guthaben aufladen (wenige Euro reichen für sehr viele Nutzungen).",
      ],
      en: [
        "Sign up or log in at platform.openai.com.",
        'Go to "API keys" via the user menu and create a new key.',
        "Add a bit of credit (a few euros/dollars covers a lot of usage).",
      ],
    },
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

const ELABORATE_SYSTEM_PROMPTS = {
  de: `Du bist ein erfahrener AI-Solution-Architekt, der intern erfasste
AI-Use-Case-Ideen eines Unternehmens ausarbeitet. Du bekommst eine kurze Notiz und
optional ein bereits vorhandenes Problem/Ziel/Business Benefit. Antworte AUSSCHLIESSLICH
mit einem JSON-Objekt (kein Markdown, kein Fließtext davor oder danach) mit genau
diesen Feldern:

{
  "problem": "Klare Beschreibung des Problems: was ist aktuell schwierig, aufwendig oder fehleranfällig? Auf Deutsch, 2-4 Sätze.",
  "goal": "Was soll die KI-Lösung konkret leisten bzw. automatisieren? Auf Deutsch, 2-4 Sätze.",
  "business_benefit": "Welcher konkrete Nutzen (Zeit, Qualität, Kosten, Risiko) entsteht dadurch? Auf Deutsch, 2-4 Sätze.",
  "tools": "Konkrete Vorschläge für Tools/Frameworks/Architektur, die für die Umsetzung sinnvoll sind, als kurze Liste mit Begründung.",
  "considerations": "Wichtige Gedanken vorab: Datenschutz, benötigte Datenquellen, Kosten, Abhängigkeiten, Stakeholder, Risiken. Als kurze Liste.",
  "initial_prompt": "Ein guter, direkt verwendbarer Start-Prompt (auf Deutsch), mit dem man z.B. bei Claude Code oder einem neuen Chat in die Umsetzung dieses Projekts einsteigen kann. Soll Kontext, Ziel und relevante Rahmenbedingungen enthalten."
}`,
  en: `You are an experienced AI solution architect who elaborates on internally
captured AI use case ideas for a company. You get a short note and optionally
an existing problem/goal/business benefit. Respond ONLY with a JSON object
(no markdown, no text before or after) with exactly these fields:

{
  "problem": "Clear description of the problem: what's currently hard, slow, or error-prone? In English, 2-4 sentences.",
  "goal": "What should the AI solution actually do / automate? In English, 2-4 sentences.",
  "business_benefit": "What concrete benefit (time, quality, cost, risk) does this create? In English, 2-4 sentences.",
  "tools": "Concrete suggestions for tools/frameworks/architecture that make sense for the implementation, as a short list with rationale.",
  "considerations": "Key considerations upfront: privacy, required data sources, cost, dependencies, stakeholders, risks. As a short list.",
  "initial_prompt": "A good, directly usable starter prompt (in English) to kick off implementation of this project, e.g. with Claude Code or a new chat. Should include context, goal, and relevant constraints."
}`,
};

function ideaContextMessage(idea) {
  const none = currentLang === "en" ? "(none yet)" : "(noch keine)";
  const labels =
    currentLang === "en"
      ? { note: "Quick note", problem: "Problem", goal: "Goal", benefit: "Business benefit" }
      : { note: "Kurznotiz", problem: "Problem", goal: "Ziel", benefit: "Business Benefit" };
  return [
    `${labels.note}: ${trValue(idea, "quick_note")}`,
    `${labels.problem}: ${trValue(idea, "problem") || none}`,
    `${labels.goal}: ${trValue(idea, "goal") || none}`,
    `${labels.benefit}: ${trValue(idea, "business_benefit") || none}`,
  ].join("\n\n");
}

function buildElaboratePrompt(idea) {
  const prompt = ELABORATE_SYSTEM_PROMPTS[currentLang];
  return `${prompt}\n\n---\n\n${ideaContextMessage(idea)}`;
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
      system: ELABORATE_SYSTEM_PROMPTS[currentLang],
      messages: [{ role: "user", content: userMessage }],
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(t("claudeApiError") + errText);
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
        { role: "system", content: ELABORATE_SYSTEM_PROMPTS[currentLang] },
        { role: "user", content: userMessage },
      ],
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(t("openaiApiError") + errText);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

async function elaborateWithAI(idea) {
  const provider = getAiProvider();
  const apiKey = getProviderKey(provider);
  if (!apiKey) {
    throw new Error(t("noApiKeyError"));
  }

  const userMessage = ideaContextMessage(idea);

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
    .select("*, parent:parent_process_id(id, name, name_en)")
    .order("created_at", { ascending: false });
  if (error) {
    toast(t("loadErrorPrefix") + error.message);
    return [];
  }
  return data || [];
}

async function createProcess(name, department, team, parentProcessId) {
  const payload = { name, department, team, created_by: currentUser.id };
  if (parentProcessId) payload.parent_process_id = parentProcessId;
  const { data, error } = await sb
    .from("processes")
    .insert(payload)
    .select("*, parent:parent_process_id(id, name, name_en)")
    .single();
  if (error) {
    toast(t("saveErrorPrefix") + error.message);
    return null;
  }
  return data;
}

async function updateProcess(id, patch) {
  const { data, error } = await sb
    .from("processes")
    .update(patch)
    .eq("id", id)
    .select("*, parent:parent_process_id(id, name, name_en)")
    .single();
  if (error) {
    toast(t("saveErrorPrefix") + error.message);
    return null;
  }
  return data;
}

async function deleteProcess(id) {
  const { error } = await sb.from("processes").delete().eq("id", id);
  if (error) {
    toast(t("deleteErrorPrefix") + error.message);
    return false;
  }
  return true;
}

// ---------- Shared UI ----------

function tabBar(active) {
  return `
    <div class="tabbar">
      <button data-tab="ideas" class="${active === "ideas" ? "active" : ""}">${t("ideasTab")}</button>
      <button data-tab="processes" class="${active === "processes" ? "active" : ""}">${t("processesTab")}</button>
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

function selectOptionsFrom(values, selectedValue) {
  const options = [`<option value="" ${selectedValue ? "" : "selected"}>${t("selectPlaceholderOption")}</option>`];
  values.forEach((v) => {
    options.push(`<option value="${escapeHtml(v)}" ${v === selectedValue ? "selected" : ""}>${escapeHtml(v)}</option>`);
  });
  return options.join("");
}

function kostenstelleOptionsFrom(codes, selectedValue) {
  const options = [`<option value="" ${selectedValue ? "" : "selected"}>${t("selectPlaceholderOption")}</option>`];
  codes.forEach((code) => {
    const k = kostenstellenCache.find((x) => x.code === code);
    const label = k && k.name ? `${code} – ${k.name}` : code;
    options.push(`<option value="${escapeHtml(code)}" ${code === selectedValue ? "selected" : ""}>${escapeHtml(label)}</option>`);
  });
  return options.join("");
}

function departmentTeamFields(department, team, idPrefix) {
  const codes = new Set(writableCodes());
  if (department) codes.add(department);
  const teams = new Set(writableTeamsForCode(department));
  if (team) teams.add(team);
  return `
    <div class="row">
      <select class="field" id="${idPrefix}-department" style="flex:1;">
        ${kostenstelleOptionsFrom(Array.from(codes), department)}
      </select>
      <select class="field" id="${idPrefix}-team" style="flex:1;">
        ${selectOptionsFrom(Array.from(teams), team)}
      </select>
    </div>
  `;
}

// Team-Dropdown ist von der gewählten Kostenstelle abhängig (unterschiedliche
// Kostenstellen können unterschiedliche Teams freigeschaltet haben) - bei
// jedem Wechsel der Kostenstelle die Team-Optionen neu berechnen.
function bindDepartmentTeamFields(idPrefix) {
  const deptSel = document.getElementById(`${idPrefix}-department`);
  const teamSel = document.getElementById(`${idPrefix}-team`);
  if (!deptSel || !teamSel) return;
  deptSel.addEventListener("change", () => {
    const currentTeam = teamSel.value;
    const teams = writableTeamsForCode(deptSel.value);
    teamSel.innerHTML = selectOptionsFrom(teams, teams.includes(currentTeam) ? currentTeam : "");
  });
}

function readDepartmentTeam(idPrefix) {
  return {
    department: document.getElementById(`${idPrefix}-department`).value,
    team: document.getElementById(`${idPrefix}-team`).value,
  };
}

// ---------- Views ----------

// Kein offenes Self-Signup mehr (Sicherheitslücke: niemand prüfte, ob die
// registrierende Person wirklich Zugriff auf die angegebene Mailadresse
// hat). Stattdessen: Zugang per Mail/Teams beim Admin anfragen, der die
// Person über einen ihm bekannten, vertrauten Kanal identifiziert und das
// Konto danach selbst über die Supabase-Admin-API anlegt (siehe README).
const ACCESS_REQUEST_MAILTO =
  "mailto:d.goos@house-of-communication.com" +
  "?subject=" + encodeURIComponent("Zugang zur Process- & AI-Usecase App") +
  "&body=" + encodeURIComponent("Hallo,\n\nich hätte gern Zugang zur App.\n\nName: \nE-Mail-Adresse (für den Zugang): \n\nDanke!");

function renderLogin() {
  const isRequest = authMode === "request";
  $app.innerHTML = `
    <div class="login-wrap">
      <div class="login-lang-toggle">${langToggleButton()}${themeToggleButton()}</div>
      <img src="${loginLogoSrc()}" alt="Logo" />
      <h1>${t("appName")}</h1>
      <p>${t("tagline")}</p>
      <div class="tabbar" style="max-width:320px;">
        <button data-mode="login" class="${!isRequest ? "active" : ""}">${t("login")}</button>
        <button data-mode="request" class="${isRequest ? "active" : ""}">${t("requestAccessTab")}</button>
      </div>
      ${
        isRequest
          ? `
        <div class="card" style="text-align:left; max-width:320px;">
          <p style="margin:0 0 12px; font-size:13.5px; color:var(--text); line-height:1.55;">${t("requestAccessDesc")}</p>
          <a class="btn-primary" style="display:block; text-align:center; text-decoration:none;" href="${ACCESS_REQUEST_MAILTO}">${t("requestAccessMailBtn")}</a>
          <p style="margin:12px 0 0; font-size:12.5px; color:var(--text-dim);">${t("requestAccessTeamsNote")}</p>
        </div>
      `
          : `
        <form id="auth-form" style="width:100%; max-width:320px;">
          <input type="email" id="auth-email" placeholder="${t("emailPlaceholder")}" required autocomplete="email" />
          <input type="password" id="auth-password" placeholder="${t("passwordPlaceholder")}" required minlength="6" autocomplete="current-password" />
          <button type="submit" class="btn-primary" style="width:100%;">${t("login")}</button>
        </form>
        <button class="btn-ghost" id="forgot-btn" style="margin-top:10px;">${t("forgotPassword")}</button>
      `
      }
      <p id="login-msg" style="margin-top:14px; font-size:13px;"></p>
    </div>
  `;

  bindLangToggle();
  bindThemeToggle();

  document.querySelectorAll(".tabbar button").forEach((btn) => {
    btn.addEventListener("click", () => {
      authMode = btn.dataset.mode;
      renderLogin();
    });
  });

  const authForm = document.getElementById("auth-form");
  if (authForm) {
    authForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("auth-email").value.trim();
      const password = document.getElementById("auth-password").value;
      const btn = e.target.querySelector("button");
      const msg = document.getElementById("login-msg");
      btn.disabled = true;
      btn.textContent = t("loggingIn");
      const error = await signInWithPassword(email, password);
      btn.disabled = false;
      btn.textContent = t("login");
      if (error) {
        msg.textContent = t("errorPrefix") + error.message;
        msg.style.color = "#ef4444";
      }
      // Bei erfolgreichem Login übernimmt onAuthStateChange das Weiterleiten in die App.
    });
  }

  const forgotBtn = document.getElementById("forgot-btn");
  if (forgotBtn) {
    forgotBtn.addEventListener("click", () => {
      const msg = document.getElementById("login-msg");
      msg.textContent = t("forgotPasswordContactMsg");
      msg.style.color = "";
    });
  }
}

function renderSetNewPassword() {
  $app.innerHTML = `
    <div class="login-wrap">
      <img src="${loginLogoSrc()}" alt="Logo" />
      <h1>${t("setNewPasswordTitle")}</h1>
      <p>${t("setNewPasswordDesc")}</p>
      <form id="new-password-form" style="width:100%; max-width:320px;">
        <input type="password" id="new-password" placeholder="${t("newPasswordPlaceholder")}" required minlength="6" autocomplete="new-password" />
        <button type="submit" class="btn-primary" style="width:100%;">${t("savePassword")}</button>
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
      msg.textContent = t("errorPrefix") + error.message;
      msg.style.color = "#ef4444";
      return;
    }
    passwordRecoveryMode = false;
    toast(t("passwordSavedMsg"));
    window.location.hash = "";
    render();
  });
}

function filterChips() {
  const filters = [
    { key: "all", label: t("filterAll") },
    ...STATUS_ORDER.map((s) => ({ key: s, label: t(`status_${s}`) })),
  ];
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

// ---------- Stufenkette: Ideen, die als Weiterentwicklung eines anderen
// Use Cases verknüpft sind (z.B. GC12 -> GC13 -> GC14) ----------

function ideaAncestorChain(idea) {
  const byId = new Map(ideasCache.map((i) => [i.id, i]));
  const chain = [];
  let cur = idea;
  const seen = new Set([idea.id]);
  while (cur.parent_idea_id && byId.has(cur.parent_idea_id)) {
    const p = byId.get(cur.parent_idea_id);
    if (seen.has(p.id)) break;
    chain.unshift(p);
    seen.add(p.id);
    cur = p;
  }
  return chain;
}

function ideaFollowUpStages(idea) {
  return ideasCache.filter((i) => i.parent_idea_id === idea.id);
}

function ideaDescendantIds(idea) {
  const result = new Set();
  let frontier = [idea.id];
  while (frontier.length) {
    const next = [];
    ideasCache
      .filter((i) => frontier.includes(i.parent_idea_id) && !result.has(i.id))
      .forEach((child) => {
        result.add(child.id);
        next.push(child.id);
      });
    frontier = next;
  }
  return result;
}

function ideaStageNumber(idea) {
  return ideaAncestorChain(idea).length + 1;
}

function ideaLabel(idea) {
  const note = trValue(idea, "quick_note");
  return idea.catalog_id ? `${idea.catalog_id} – ${note}` : note;
}

function parentIdeaOptions(idea) {
  const excludeIds = new Set([idea.id, ...ideaDescendantIds(idea)]);
  const options = [`<option value="">${t("noneFirstStageOption")}</option>`];
  ideasCache
    .filter((i) => !excludeIds.has(i.id))
    .forEach((i) => {
      options.push(
        `<option value="${i.id}" ${i.id === idea.parent_idea_id ? "selected" : ""}>${escapeHtml(ideaLabel(i))}</option>`
      );
    });
  return options.join("");
}

function stageChainHtml(idea) {
  const ancestors = ideaAncestorChain(idea);
  const followUps = ideaFollowUpStages(idea);
  if (ancestors.length === 0 && followUps.length === 0) return "";
  const chain = [...ancestors, idea];
  return `
    <label class="field-label" style="margin-top:0;">${t("stageChainPositionLabel")}</label>
    <div class="stage-chain">
      ${chain
        .map((node, idx) => {
          const classes = ["stage-chip"];
          if (node.id === idea.id) classes.push("current");
          if (node.status === "in_progress") classes.push("active");
          const label = `${t("stagePrefix")}${idx + 1}: ${escapeHtml(ideaLabel(node))}`;
          return node.id === idea.id
            ? `<span class="${classes.join(" ")}">${label}</span>`
            : `<a class="${classes.join(" ")}" href="#/idea/${node.id}">${label}</a>`;
        })
        .join('<span class="stage-arrow">→</span>')}
    </div>
  `;
}

function ideaCard(idea) {
  const p = priorityInfo(idea);
  const tags = (idea.tags || "")
    .split(",")
    .map((t2) => t2.trim())
    .filter(Boolean);
  const isChained = idea.parent_idea_id || ideaFollowUpStages(idea).length > 0;
  return `
    <div class="idea-item" data-id="${idea.id}">
      <div class="idea-title">${idea.catalog_id ? `<span class="badge">🏷 ${escapeHtml(idea.catalog_id)}</span> ` : ""}${escapeHtml(trValue(idea, "quick_note"))}</div>
      <div class="idea-meta">
        <span class="badge status-${idea.status}">${t(`status_${idea.status}`)}</span>
        <span class="badge"><span class="priority-dot" style="background:${p.color}"></span> ${p.label}</span>
        ${isChained ? `<span class="badge">🔗 ${t("stagePrefix")}${ideaStageNumber(idea)}</span>` : ""}
        ${idea.owner_name ? `<span class="badge">👤 ${escapeHtml(idea.owner_name)}</span>` : ""}
        ${idea.team ? `<span class="badge">${escapeHtml(idea.team)}</span>` : ""}
        ${idea.processes ? `<span class="badge">⚙ ${escapeHtml(trValue(idea.processes, "name"))}</span>` : ""}
        ${tags.map((tag) => `<span class="badge">#${escapeHtml(tag)}</span>`).join("")}
        <span class="badge" title="${t("lastSavedTitle")}">🕒 ${formatDateTime(idea.updated_at)}</span>
      </div>
    </div>
  `;
}

async function renderList() {
  $app.innerHTML = `
    <header class="topbar">
      <h1>${t("ideasHeaderTitle")}</h1>
      <div class="actions">
        ${langToggleButton()}${themeToggleButton()}
        ${exportNavButton()}
        ${onboardingNavButton()}
        ${adminNavButton()}
        <button class="icon-btn" id="settings-btn">⚙</button>
        <button class="icon-btn" id="logout-btn">${t("logoutBtn")}</button>
      </div>
    </header>
    <main>
      ${tabBar("ideas")}
      <div class="card capture-box">
        <label class="field-label" style="margin-top:0;">${t("newIdeaLabel")}</label>
        <textarea id="quick-note" placeholder="${t("ideaPlaceholder")}"></textarea>
        ${departmentTeamFields("", "", "capture")}
        <div class="row">
          <button class="btn-primary" id="save-capture">${t("saveIdea")}</button>
        </div>
      </div>
      ${filterChips()}
      <div class="idea-list" id="idea-list">
        <div class="empty-state">${t("loadingIdeas")}</div>
      </div>
    </main>
  `;

  bindTabBar();
  bindAdminNavButton();
  bindExportNavButton();
  bindLangToggle();
  bindThemeToggle();
  bindDepartmentTeamFields("capture");
  document.getElementById("logout-btn").addEventListener("click", logout);
  document.getElementById("settings-btn").addEventListener("click", () => {
    window.location.hash = "#/settings";
  });

  document.getElementById("save-capture").addEventListener("click", async () => {
    const ta = document.getElementById("quick-note");
    const text = ta.value.trim();
    const { department, team } = readDepartmentTeam("capture");
    if (!text) return;
    if (!department || !team) {
      toast(t("departmentTeamRequiredMsg"));
      return;
    }
    const btn = document.getElementById("save-capture");
    btn.disabled = true;
    const idea = await createIdea(text, department, team);
    btn.disabled = false;
    if (idea) {
      ta.value = "";
      toast(t("ideaSavedMsg"));
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

let expandedIdeaIds = new Set();

// Eine Idee ist "Kopf" ihrer Stufenkette, wenn keine andere Idee sie als
// vorherige Stufe (parent_idea_id) referenziert - also die jeweils
// neueste Entwicklungsstufe. Nur Köpfe erscheinen oben in der Liste, die
// Vorstufen hängen als ein-/ausklappbare Kinder darunter.
function ideaIsChainHead(idea) {
  return !ideasCache.some((i) => i.parent_idea_id === idea.id);
}

function ideaChainNodeHtml(idea) {
  const parent = idea.parent_idea_id ? ideasCache.find((i) => i.id === idea.parent_idea_id) : null;
  const isExpanded = expandedIdeaIds.has(idea.id);
  return `
    <div class="tree-node">
      <div class="tree-row">
        ${
          parent
            ? `<button class="tree-toggle" data-toggle-idea="${idea.id}">${isExpanded ? "▾" : "▸"}</button>`
            : `<span class="tree-toggle-spacer"></span>`
        }
        <div class="tree-row-content">${ideaCard(idea)}</div>
      </div>
      ${parent && isExpanded ? `<div class="tree-children">${ideaChainNodeHtml(parent)}</div>` : ""}
    </div>
  `;
}

function renderIdeaList() {
  const listEl = document.getElementById("idea-list");
  if (!listEl) return;
  const heads = ideasCache.filter(ideaIsChainHead);
  const filtered = heads.filter((i) => activeFilter === "all" || i.status === activeFilter);
  if (filtered.length === 0) {
    listEl.innerHTML = `<div class="empty-state">${t("emptyIdeas")}</div>`;
  } else {
    listEl.innerHTML = filtered.map(ideaChainNodeHtml).join("");
    listEl.querySelectorAll(".idea-item").forEach((el) => {
      el.addEventListener("click", () => {
        window.location.hash = `#/idea/${el.dataset.id}`;
      });
    });
    listEl.querySelectorAll("[data-toggle-idea]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.toggleIdea;
        if (expandedIdeaIds.has(id)) expandedIdeaIds.delete(id);
        else expandedIdeaIds.add(id);
        renderIdeaList();
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
  const options = [`<option value="">${t("noneOption")}</option>`];
  processesCache.forEach((p) => {
    options.push(`<option value="${p.id}" ${p.id === selectedId ? "selected" : ""}>${escapeHtml(trValue(p, "name"))}</option>`);
  });
  return options.join("");
}

function parentProcessOptions(excludeId, selectedId) {
  const options = [`<option value="">${t("noneTopLevelOption")}</option>`];
  processesCache
    .filter((p) => p.id !== excludeId)
    .forEach((p) => {
      options.push(`<option value="${p.id}" ${p.id === selectedId ? "selected" : ""}>${escapeHtml(trValue(p, "name"))}</option>`);
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
  const canWrite = canWriteCombo(idea.department, idea.team);

  $app.innerHTML = `
    <header class="topbar">
      <div class="back-row">
        <button class="icon-btn" id="back-btn">${t("backBtn")}</button>
      </div>
      <button class="icon-btn" id="delete-btn">${t("deleteBtn")}</button>
    </header>
    <main>
      ${
        canWrite
          ? ""
          : `<div style="font-size:13px; color:var(--text); background:var(--surface-2); border-left:3px solid var(--accent); border-radius:6px; padding:10px 12px; margin:0 0 14px; line-height:1.5;">🔒 ${t("readOnlyNotice")}</div>`
      }
      <div class="card">
        <label class="field-label">${t("quickNoteLabel")}</label>
        <textarea class="field" id="f-quick-note"${trReadonlyAttr(idea, "quick_note")}>${escapeHtml(trValue(idea, "quick_note"))}</textarea>

        <label class="field-label">${t("ownerNameLabel")}</label>
        <input class="field" id="f-owner-name" value="${escapeHtml(idea.owner_name || "")}" placeholder="${t("ownerNamePlaceholder")}" />

        <label class="field-label">${t("statusLabel")}</label>
        <select class="field" id="f-status">
          ${STATUS_ORDER.map(
            (s) => `<option value="${s}" ${s === idea.status ? "selected" : ""}>${t(`status_${s}`)}</option>`
          ).join("")}
        </select>

        <label class="field-label">${t("departmentLabel")} / ${t("teamLabel")}</label>
        ${departmentTeamFields(idea.department, idea.team, "detail")}

        <label class="field-label">${t("relatedProcessLabel")}</label>
        <select class="field" id="f-process">
          ${processOptions(idea.process_id)}
        </select>

        <label class="field-label">${t("tagsLabel")}</label>
        <input class="field" id="f-tags" value="${escapeHtml(idea.tags || "")}" placeholder="${t("tagsPlaceholder")}" />

        <label class="field-label">${t("problemLabel")}</label>
        <textarea class="field" id="f-problem" placeholder="${t("problemPlaceholder")}"${trReadonlyAttr(idea, "problem")}>${escapeHtml(trValue(idea, "problem"))}</textarea>

        <label class="field-label">${t("goalLabel")}</label>
        <textarea class="field" id="f-goal" placeholder="${t("goalPlaceholder")}"${trReadonlyAttr(idea, "goal")}>${escapeHtml(trValue(idea, "goal"))}</textarea>

        <label class="field-label">${t("businessBenefitLabel")}</label>
        <textarea class="field" id="f-business-benefit" placeholder="${t("businessBenefitPlaceholder")}"${trReadonlyAttr(idea, "business_benefit")}>${escapeHtml(trValue(idea, "business_benefit"))}</textarea>
      </div>

      <div class="card">
        <div class="section-title" style="margin:0 0 10px;">${t("stageChainTitle")}</div>
        <p style="font-size:13px; color:var(--text-dim); margin:0 0 12px; line-height:1.5;">${t("stageChainDesc")}</p>

        <label class="field-label" style="margin-top:0;">${t("previousStageLabel")}</label>
        <select class="field" id="f-parent-idea">
          ${parentIdeaOptions(idea)}
        </select>

        ${stageChainHtml(idea)}

        <label class="field-label" style="margin-top:0;">${t("followUpStagesTitle")}</label>
        <div id="follow-up-stages">
          ${
            ideaFollowUpStages(idea).length
              ? ideaFollowUpStages(idea)
                  .map(
                    (i) =>
                      `<a class="link-item" href="#/idea/${i.id}">${escapeHtml(ideaLabel(i))} <span class="badge status-${i.status}">${t(`status_${i.status}`)}</span></a>`
                  )
                  .join("")
              : `<div class="empty-state" style="padding:16px 4px;">${t("emptyFollowUpStages")}</div>`
          }
        </div>
        <div class="row">
          <button class="btn-secondary" id="add-followup-btn" style="width:100%;">${t("addFollowUpStageBtn")}</button>
        </div>
      </div>

      <div class="card">
        <div class="section-title" style="margin:0 0 10px;">${t("evaluationTitle")}</div>
        <div id="priority-banner" class="priority-banner"></div>
        ${sliderRow("impact", t("impactLabel"), idea.impact)}
        ${sliderRow("feasibility", t("feasibilityLabel"), idea.feasibility)}
        ${sliderRow("effort", t("effortLabel"), idea.effort)}
        ${sliderRow("risk", t("riskLabel"), idea.risk)}
      </div>

      <div class="card">
        <div class="section-title" style="margin:0 0 10px;">${t("aiSupportTitle")}</div>
        <p style="font-size:13.5px; color:var(--text-dim); margin:0 0 12px; line-height:1.5;">
          ${t("aiSupportDesc")}
        </p>
        <button class="btn-secondary" id="generate-prompt-btn" style="width:100%;">${t("generatePromptBtn")}</button>
        <div id="generated-prompt-wrap" style="display:none; margin-top:12px;">
          <pre id="generated-prompt-text" style="white-space:pre-wrap; background:var(--surface-2); border:1px solid var(--border); border-radius:10px; padding:12px; font-size:13px; font-family:inherit; margin:0; max-height:220px; overflow-y:auto;"></pre>
          <div class="row">
            <button class="btn-secondary" id="copy-generated-prompt-btn" style="width:100%;">${t("copyToClipboardBtn")}</button>
          </div>
        </div>

        <label class="field-label">${t("aiResponsePasteLabel")}</label>
        <textarea class="field" id="ai-response-paste" placeholder="${t("aiResponsePlaceholder")}"></textarea>
        <div class="row">
          <button class="btn-primary" id="apply-pasted-btn" style="width:100%;">${t("applyBtn")}</button>
        </div>
        <div id="ai-result" class="ai-result"></div>

        <details style="margin-top:18px;">
          <summary style="cursor:pointer; font-size:13px; color:var(--text-dim);">${t("optionalApiDetails")}</summary>
          <button class="btn-secondary" id="ai-btn" style="width:100%; margin-top:10px;">${t("autoElaborateBtn")}</button>
        </details>
      </div>

      <div class="card">
        <label class="field-label" style="margin-top:0;">${t("toolsLabel")}</label>
        <textarea class="field" id="f-tools" placeholder="${t("toolsPlaceholder")}">${escapeHtml(idea.tools || "")}</textarea>

        <label class="field-label">${t("considerationsLabel")}</label>
        <textarea class="field" id="f-considerations" placeholder="${t("considerationsPlaceholder")}"${trReadonlyAttr(idea, "considerations")}>${escapeHtml(trValue(idea, "considerations"))}</textarea>

        <label class="field-label">${t("startPromptLabel")}</label>
        <textarea class="field" id="f-initial-prompt" placeholder="${t("startPromptPlaceholder")}">${escapeHtml(idea.initial_prompt || "")}</textarea>
        <div class="row">
          <button class="btn-secondary" id="copy-prompt-btn" style="width:100%;">${t("copyStartPromptBtn")}</button>
        </div>
      </div>

      <details class="card">
        <summary style="cursor:pointer; font-size:14px; font-weight:600; color:var(--text);">${t("catalogFieldsTitle")}</summary>
        <p style="font-size:13px; color:var(--text-dim); margin:10px 0 14px; line-height:1.5;">${t("catalogFieldsDesc")}</p>

        <label class="field-label" style="margin-top:0;">${t("catalogIdLabel")}</label>
        <input class="field" id="f-catalog-id" value="${escapeHtml(idea.catalog_id || "")}" placeholder="${t("catalogIdPlaceholder")}" />

        <label class="field-label">${t("aiRoleLabel")}</label>
        <select class="field" id="f-ai-role">
          ${selectOptionsFrom(AI_ROLE_OPTIONS, idea.ai_role)}
        </select>

        <label class="field-label">${t("inputSourceLabel")}</label>
        <textarea class="field" id="f-input-source" placeholder="${t("inputSourcePlaceholder")}">${escapeHtml(idea.input_source || "")}</textarea>

        <label class="field-label">${t("outputResultLabel")}</label>
        <textarea class="field" id="f-output-result" placeholder="${t("outputResultPlaceholder")}">${escapeHtml(idea.output_result || "")}</textarea>

        <label class="field-label">${t("kpiKindLabel")}</label>
        <select class="field" id="f-kpi-kind">
          ${selectOptionsFrom(KPI_KIND_OPTIONS, idea.kpi_kind)}
        </select>

        <label class="field-label">${t("quantifiedBenefitLabel")}</label>
        <textarea class="field" id="f-quantified-benefit" placeholder="${t("quantifiedBenefitPlaceholder")}">${escapeHtml(idea.quantified_benefit || "")}</textarea>

        <label class="field-label">${t("qualitativeBenefitLabel")}</label>
        <textarea class="field" id="f-qualitative-benefit" placeholder="${t("qualitativeBenefitPlaceholder")}"${trReadonlyAttr(idea, "qualitative_benefit")}>${escapeHtml(trValue(idea, "qualitative_benefit"))}</textarea>

        <label class="field-label">${t("commentLabel")}</label>
        <textarea class="field" id="f-comment"${trReadonlyAttr(idea, "comment")}>${escapeHtml(trValue(idea, "comment"))}</textarea>

        <label class="field-label">${t("listPriorityLabel")}</label>
        <select class="field" id="f-list-priority">
          ${selectOptionsFrom(LIST_PRIORITY_OPTIONS, idea.list_priority)}
        </select>
      </details>

      <div class="row">
        <button class="btn-primary" id="save-detail-btn">${t("saveBtn")}</button>
      </div>
    </main>
  `;

  bindDepartmentTeamFields("detail");

  if (!canWrite) {
    document.querySelectorAll("main input, main textarea, main select, main button").forEach((el) => {
      el.disabled = true;
    });
  }

  function updatePriorityBanner() {
    const impact = Number(document.querySelector('[data-field="impact"]').value);
    const effort = Number(document.querySelector('[data-field="effort"]').value);
    const p = priorityInfo({ impact, effort });
    document.getElementById("priority-banner").innerHTML =
      `<span class="priority-dot" style="background:${p.color}"></span> ${t("assessmentPrefix")}<strong>${p.label}</strong>`;
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
    if (!confirm(t("deleteIdeaConfirm"))) return;
    const ok = await deleteIdea(idea.id);
    if (ok) {
      toast(t("ideaDeletedMsg"));
      window.location.hash = "";
    }
  });

  document.getElementById("copy-prompt-btn").addEventListener("click", async () => {
    const text = document.getElementById("f-initial-prompt").value;
    try {
      await navigator.clipboard.writeText(text);
      toast(t("copiedMsg"));
    } catch {
      toast(t("copyFailedMsg"));
    }
  });

  document.getElementById("add-followup-btn").addEventListener("click", async () => {
    const text = prompt(t("newFollowUpStagePrompt"));
    if (!text || !text.trim()) return;
    const followUp = await createIdea(text.trim(), idea.department, idea.team, idea.process_id, idea.id);
    if (followUp) {
      toast(t("followUpStageSavedMsg"));
      ideasCache = await loadIdeas();
      window.location.hash = `#/idea/${followUp.id}`;
    }
  });

  const TRANSLATABLE_IDEA_FIELD_INPUT_IDS = {
    quick_note: "f-quick-note",
    problem: "f-problem",
    goal: "f-goal",
    business_benefit: "f-business-benefit",
    considerations: "f-considerations",
    qualitative_benefit: "f-qualitative-benefit",
    comment: "f-comment",
  };

  function collectPatch() {
    const { department, team } = readDepartmentTeam("detail");
    const patch = {
      status: document.getElementById("f-status").value,
      process_id: document.getElementById("f-process").value || null,
      parent_idea_id: document.getElementById("f-parent-idea").value || null,
      department,
      team,
      tags: document.getElementById("f-tags").value.trim(),
      impact: Number(document.querySelector('[data-field="impact"]').value),
      feasibility: Number(document.querySelector('[data-field="feasibility"]').value),
      effort: Number(document.querySelector('[data-field="effort"]').value),
      risk: Number(document.querySelector('[data-field="risk"]').value),
      tools: document.getElementById("f-tools").value.trim(),
      initial_prompt: document.getElementById("f-initial-prompt").value.trim(),
      ai_role: document.getElementById("f-ai-role").value,
      input_source: document.getElementById("f-input-source").value.trim(),
      output_result: document.getElementById("f-output-result").value.trim(),
      kpi_kind: document.getElementById("f-kpi-kind").value,
      quantified_benefit: document.getElementById("f-quantified-benefit").value.trim(),
      list_priority: document.getElementById("f-list-priority").value,
      catalog_id: document.getElementById("f-catalog-id").value.trim() || null,
      owner_name: document.getElementById("f-owner-name").value.trim(),
    };
    // Felder, die aktuell die (vom Admin gepflegte) Übersetzung anzeigen,
    // werden nicht mitgespeichert - sonst würde die englische Anzeige das
    // deutsche Original überschreiben (siehe isTranslatedReadonly).
    TRANSLATABLE_IDEA_FIELDS.forEach((field) => {
      if (!isTranslatedReadonly(idea, field)) {
        patch[field] = document.getElementById(TRANSLATABLE_IDEA_FIELD_INPUT_IDS[field]).value.trim();
      }
    });
    return patch;
  }

  document.getElementById("save-detail-btn").addEventListener("click", async () => {
    const { department, team } = readDepartmentTeam("detail");
    if (!department || !team) {
      toast(t("departmentTeamRequiredMsg"));
      return;
    }
    const btn = document.getElementById("save-detail-btn");
    btn.disabled = true;
    btn.textContent = t("savingBtn");
    const updated = await updateIdea(idea.id, collectPatch());
    btn.disabled = false;
    btn.textContent = t("saveBtn");
    if (updated) {
      const idx = ideasCache.findIndex((i) => i.id === idea.id);
      if (idx >= 0) ideasCache[idx] = updated;
      toast(t("savedMsg"));
    }
  });

  function showAiResult(result) {
    const resultEl = document.getElementById("ai-result");
    resultEl.innerHTML = `
      <h3>${t("suggestedProblem")}</h3>
      <pre>${escapeHtml(result.problem || "")}</pre>
      <h3>${t("suggestedGoal")}</h3>
      <pre>${escapeHtml(result.goal || "")}</pre>
      <h3>${t("suggestedBusinessBenefit")}</h3>
      <pre>${escapeHtml(result.business_benefit || "")}</pre>
      <h3>${t("suggestedTools")}</h3>
      <pre>${escapeHtml(result.tools || "")}</pre>
      <h3>${t("suggestedConsiderations")}</h3>
      <pre>${escapeHtml(result.considerations || "")}</pre>
      <h3>${t("suggestedStartPrompt")}</h3>
      <pre>${escapeHtml(result.initial_prompt || "")}</pre>
      <div class="row" style="margin-top:12px;">
        <button class="btn-primary" id="apply-ai-btn" style="width:100%;">${t("applySuggestionBtn")}</button>
      </div>
    `;
    document.getElementById("apply-ai-btn").addEventListener("click", () => {
      if (result.problem) document.getElementById("f-problem").value = result.problem;
      if (result.goal) document.getElementById("f-goal").value = result.goal;
      if (result.business_benefit) document.getElementById("f-business-benefit").value = result.business_benefit;
      if (result.tools) document.getElementById("f-tools").value = result.tools;
      if (result.considerations) document.getElementById("f-considerations").value = result.considerations;
      if (result.initial_prompt) document.getElementById("f-initial-prompt").value = result.initial_prompt;
      toast(t("proposalApplied"));
    });
  }

  document.getElementById("generate-prompt-btn").addEventListener("click", async () => {
    const patchNow = collectPatch();
    await updateIdea(idea.id, patchNow);
    const promptText = buildElaboratePrompt(patchNow);
    document.getElementById("generated-prompt-text").textContent = promptText;
    document.getElementById("generated-prompt-wrap").style.display = "block";
  });

  document.getElementById("copy-generated-prompt-btn").addEventListener("click", async () => {
    const text = document.getElementById("generated-prompt-text").textContent;
    try {
      await navigator.clipboard.writeText(text);
      toast(t("copiedPasteHintMsg"));
    } catch {
      toast(t("copyFailedMsg"));
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
      resultEl.innerHTML = `<p style="color:#ef4444; font-size:13.5px;">${t("couldNotParseMsg")}</p>`;
    }
  });

  document.getElementById("ai-btn").addEventListener("click", async () => {
    const btn = document.getElementById("ai-btn");
    const resultEl = document.getElementById("ai-result");
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span> ${t("aiWorkingMsg")}`;
    resultEl.innerHTML = "";
    try {
      const patchNow = collectPatch();
      await updateIdea(idea.id, patchNow);
      const result = await elaborateWithAI(patchNow);
      showAiResult(result);
    } catch (err) {
      resultEl.innerHTML = `<p style="color:#ef4444; font-size:13.5px;">${t("errorPrefix")}${escapeHtml(err.message || String(err))}</p>`;
    }
    btn.disabled = false;
    btn.innerHTML = t("autoElaborateBtn");
  });
}

// ---------- Views: Processes ----------

function processFilterChips(activeProcessFilter) {
  const filters = [
    { key: "all", label: t("filterAll") },
    ...PROCESS_STATUS_ORDER.map((s) => ({ key: s, label: t(`pstatus_${s}`) })),
  ];
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
      <div class="idea-title">${escapeHtml(trValue(proc, "name"))}</div>
      <div class="idea-meta">
        <span class="badge status-${proc.status === "reviewed" ? "done" : "idea"}">${t(`pstatus_${proc.status}`)}</span>
        <span class="badge"><span class="priority-dot" style="background:${ai.color}"></span> ${ai.label}</span>
        ${proc.team ? `<span class="badge">${escapeHtml(proc.team)}</span>` : ""}
        ${proc.parent ? `<span class="badge">↳ ${escapeHtml(trValue(proc.parent, "name"))}</span>` : ""}
      </div>
    </div>
  `;
}

let activeProcessFilter = "all";

async function renderProcessList() {
  $app.innerHTML = `
    <header class="topbar">
      <h1>${t("processesHeaderTitle")}</h1>
      <div class="actions">
        ${langToggleButton()}${themeToggleButton()}
        ${exportNavButton()}
        ${onboardingNavButton()}
        ${adminNavButton()}
        <button class="icon-btn" id="settings-btn">⚙</button>
        <button class="icon-btn" id="logout-btn">${t("logoutBtn")}</button>
      </div>
    </header>
    <main>
      ${tabBar("processes")}
      <div class="card capture-box">
        <label class="field-label" style="margin-top:0;">${t("newProcessLabel")}</label>
        <textarea id="process-name" placeholder="${t("processPlaceholder")}"></textarea>
        ${departmentTeamFields("", "", "pcapture")}
        <div class="row">
          <button class="btn-primary" id="save-process">${t("saveProcessBtn")}</button>
        </div>
      </div>
      ${processFilterChips(activeProcessFilter)}
      <div class="idea-list" id="process-list">
        <div class="empty-state">${t("loadingProcesses")}</div>
      </div>
    </main>
  `;

  bindTabBar();
  bindAdminNavButton();
  bindExportNavButton();
  bindLangToggle();
  bindThemeToggle();
  bindDepartmentTeamFields("pcapture");
  document.getElementById("logout-btn").addEventListener("click", logout);
  document.getElementById("settings-btn").addEventListener("click", () => {
    window.location.hash = "#/settings";
  });

  document.getElementById("save-process").addEventListener("click", async () => {
    const ta = document.getElementById("process-name");
    const text = ta.value.trim();
    const { department, team } = readDepartmentTeam("pcapture");
    if (!text) return;
    if (!department || !team) {
      toast(t("departmentTeamRequiredMsg"));
      return;
    }
    const btn = document.getElementById("save-process");
    btn.disabled = true;
    const proc = await createProcess(text, department, team);
    btn.disabled = false;
    if (proc) {
      ta.value = "";
      toast(t("processSavedMsg"));
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

let expandedProcessIds = new Set();

function processTreeNodeHtml(proc, filteredIds) {
  const children = processesCache.filter((p) => p.parent_process_id === proc.id && filteredIds.has(p.id));
  const hasChildren = children.length > 0;
  const isExpanded = expandedProcessIds.has(proc.id);
  return `
    <div class="tree-node">
      <div class="tree-row">
        ${
          hasChildren
            ? `<button class="tree-toggle" data-toggle-process="${proc.id}">${isExpanded ? "▾" : "▸"}</button>`
            : `<span class="tree-toggle-spacer"></span>`
        }
        <div class="tree-row-content">${processCard(proc)}</div>
      </div>
      ${
        hasChildren && isExpanded
          ? `<div class="tree-children">${children.map((c) => processTreeNodeHtml(c, filteredIds)).join("")}</div>`
          : ""
      }
    </div>
  `;
}

function renderProcessListItems() {
  const listEl = document.getElementById("process-list");
  if (!listEl) return;
  const filtered = processesCache.filter((p) => activeProcessFilter === "all" || p.status === activeProcessFilter);
  if (filtered.length === 0) {
    listEl.innerHTML = `<div class="empty-state">${t("emptyProcesses")}</div>`;
  } else {
    const filteredIds = new Set(filtered.map((p) => p.id));
    const roots = filtered.filter((p) => !p.parent_process_id || !filteredIds.has(p.parent_process_id));
    listEl.innerHTML = roots.map((p) => processTreeNodeHtml(p, filteredIds)).join("");
    listEl.querySelectorAll(".idea-item").forEach((el) => {
      el.addEventListener("click", () => {
        window.location.hash = `#/process/${el.dataset.id}`;
      });
    });
    listEl.querySelectorAll("[data-toggle-process]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.toggleProcess;
        if (expandedProcessIds.has(id)) expandedProcessIds.delete(id);
        else expandedProcessIds.add(id);
        renderProcessListItems();
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
  const canWrite = canWriteCombo(proc.department, proc.team);

  $app.innerHTML = `
    <header class="topbar">
      <div class="back-row">
        <button class="icon-btn" id="back-btn">${t("backBtn")}</button>
      </div>
      <button class="icon-btn" id="delete-btn">${t("deleteBtn")}</button>
    </header>
    <main>
      ${
        canWrite
          ? ""
          : `<div style="font-size:13px; color:var(--text); background:var(--surface-2); border-left:3px solid var(--accent); border-radius:6px; padding:10px 12px; margin:0 0 14px; line-height:1.5;">🔒 ${t("readOnlyNotice")}</div>`
      }
      <div class="card">
        <label class="field-label">${t("processNameLabel")}</label>
        <textarea class="field" id="f-name"${trReadonlyAttr(proc, "name")}>${escapeHtml(trValue(proc, "name"))}</textarea>

        <label class="field-label">${t("departmentLabel")} / ${t("teamLabel")}</label>
        ${departmentTeamFields(proc.department, proc.team, "pdetail")}

        <label class="field-label">${t("parentProcessLabel")}</label>
        <select class="field" id="f-parent-process">
          ${parentProcessOptions(proc.id, proc.parent_process_id)}
        </select>

        <label class="field-label">${t("statusLabel")}</label>
        <select class="field" id="f-status">
          ${PROCESS_STATUS_ORDER.map(
            (s) => `<option value="${s}" ${s === proc.status ? "selected" : ""}>${t(`pstatus_${s}`)}</option>`
          ).join("")}
        </select>

        <label class="field-label">${t("descriptionLabel")}</label>
        <textarea class="field" id="f-description" placeholder="${t("processDescPlaceholder")}"${trReadonlyAttr(proc, "description")}>${escapeHtml(trValue(proc, "description"))}</textarea>
      </div>

      <div class="card">
        <div class="section-title" style="margin:0 0 10px;">${t("aiPotentialTitle")}</div>
        <div id="ai-potential-banner" class="priority-banner"></div>
        ${sliderRow("ai_potential", t("aiPotentialLabel"), proc.ai_potential)}
        <label class="field-label">${t("notesLabel")}</label>
        <textarea class="field" id="f-notes" placeholder="${t("notesPlaceholder")}"${trReadonlyAttr(proc, "notes")}>${escapeHtml(trValue(proc, "notes"))}</textarea>
      </div>

      <div class="card">
        <div class="section-title" style="margin:0 0 10px;">${t("subProcessesTitle")}</div>
        <div id="sub-processes">
          ${
            subProcesses.length
              ? subProcesses.map((p) => `<a class="link-item" href="#/process/${p.id}">${escapeHtml(p.name)}</a>`).join("")
              : `<div class="empty-state" style="padding:16px 4px;">${t("emptySubProcesses")}</div>`
          }
        </div>
        <div class="row">
          <button class="btn-secondary" id="add-subprocess-btn" style="width:100%;">${t("addSubProcessBtn")}</button>
        </div>
      </div>

      <div class="card">
        <div class="section-title" style="margin:0 0 10px;">${t("linkedUseCasesTitle")}</div>
        <div id="linked-ideas">
          ${
            linkedIdeas.length
              ? linkedIdeas.map((i) => `<a class="link-item" href="#/idea/${i.id}">${escapeHtml(trValue(i, "quick_note"))}</a>`).join("")
              : `<div class="empty-state" style="padding:16px 4px;">${t("emptyLinkedIdeas")}</div>`
          }
        </div>
        <div class="row">
          <button class="btn-secondary" id="add-idea-btn" style="width:100%;">${t("addIdeaBtn")}</button>
        </div>
      </div>

      <div class="row">
        <button class="btn-primary" id="save-process-detail-btn">${t("saveBtn")}</button>
      </div>
    </main>
  `;

  bindDepartmentTeamFields("pdetail");

  if (!canWrite) {
    document.querySelectorAll("main input, main textarea, main select, main button").forEach((el) => {
      el.disabled = true;
    });
  }

  function updateAiBanner() {
    const val = Number(document.querySelector('[data-field="ai_potential"]').value);
    const ai = aiPotentialInfo(val);
    document.getElementById("ai-potential-banner").innerHTML =
      `<span class="priority-dot" style="background:${ai.color}"></span> ${t("assessmentPrefix")}<strong>${ai.label}</strong>`;
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
    if (!confirm(t("deleteProcessConfirm"))) return;
    const ok = await deleteProcess(proc.id);
    if (ok) {
      toast(t("processDeletedMsg"));
      window.location.hash = "#/processes";
    }
  });

  document.getElementById("add-idea-btn").addEventListener("click", async () => {
    const text = prompt(t("newIdeaPrompt"));
    if (!text || !text.trim()) return;
    const idea = await createIdea(text.trim(), proc.department, proc.team, proc.id);
    if (idea) {
      toast(t("ideaSavedMsg"));
      ideasCache = await loadIdeas();
      window.location.hash = `#/idea/${idea.id}`;
    }
  });

  document.getElementById("add-subprocess-btn").addEventListener("click", async () => {
    const text = prompt(t("newSubProcessPrompt"));
    if (!text || !text.trim()) return;
    const sub = await createProcess(text.trim(), proc.department, proc.team, proc.id);
    if (sub) {
      toast(t("subProcessSavedMsg"));
      processesCache = await loadProcesses();
      window.location.hash = `#/process/${sub.id}`;
    }
  });

  document.getElementById("save-process-detail-btn").addEventListener("click", async () => {
    const { department, team } = readDepartmentTeam("pdetail");
    if (!department || !team) {
      toast(t("departmentTeamRequiredMsg"));
      return;
    }
    const btn = document.getElementById("save-process-detail-btn");
    btn.disabled = true;
    btn.textContent = t("savingBtn");
    const patch = {
      department,
      team,
      parent_process_id: document.getElementById("f-parent-process").value || null,
      status: document.getElementById("f-status").value,
      ai_potential: Number(document.querySelector('[data-field="ai_potential"]').value),
    };
    // Felder, die aktuell die (vom Admin gepflegte) Übersetzung anzeigen,
    // werden nicht mitgespeichert - sonst würde die englische Anzeige das
    // deutsche Original überschreiben (siehe isTranslatedReadonly).
    const processFieldInputIds = { name: "f-name", description: "f-description", notes: "f-notes" };
    TRANSLATABLE_PROCESS_FIELDS.forEach((field) => {
      if (!isTranslatedReadonly(proc, field)) {
        patch[field] = document.getElementById(processFieldInputIds[field]).value.trim();
      }
    });
    const updated = await updateProcess(proc.id, patch);
    btn.disabled = false;
    btn.textContent = t("saveBtn");
    if (updated) {
      const idx = processesCache.findIndex((p) => p.id === proc.id);
      if (idx >= 0) processesCache[idx] = updated;
      toast(t("savedMsg"));
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
        <button class="icon-btn" id="back-btn">${t("backBtn")}</button>
      </div>
      ${langToggleButton()}${themeToggleButton()}
    </header>
    <main>
      <div class="card">
        <div class="section-title" style="margin:0 0 10px;">${t("changePasswordTitle")}</div>
        <p style="font-size:13.5px; color:var(--text-dim); margin:0 0 14px; line-height:1.5;">
          ${t("changePasswordDesc")}
        </p>
        <input class="field" id="f-new-password" type="password" placeholder="${t("newPasswordPlaceholder")}" minlength="6" autocomplete="new-password" />
        <div class="row">
          <button class="btn-primary" id="save-password-btn">${t("savePassword")}</button>
        </div>
      </div>

      <div class="card">
        <div class="section-title" style="margin:0 0 10px;">${t("settingsTitleOptionalKey")}</div>
        <p style="font-size:13.5px; color:var(--text-dim); margin:0 0 10px; line-height:1.5;">
          ${t("settingsIntro1")}
        </p>
        <p style="font-size:13.5px; color:var(--text-dim); margin:0 0 14px; line-height:1.5;">
          ${t("settingsIntro2")}
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
          <strong style="color:var(--text);">${t("howToTitle").replace("$", info.label)}</strong>
          <ol style="margin:8px 0 0; padding-left:20px;">
            ${info.howTo[currentLang].map((step) => `<li style="margin-bottom:4px;">${step}</li>`).join("")}
          </ol>
        </div>
        <label class="field-label" style="margin-top:0;">${t("apiKeyLabelPrefix")}${info.label})</label>
        <input class="field" id="f-api-key" type="password" value="${escapeHtml(existing)}" placeholder="${info.placeholder}" autocomplete="off" />
        <div class="row">
          <button class="btn-primary" id="save-key-btn">${t("saveBtn")}</button>
          <button class="btn-secondary" id="remove-key-btn">${t("removeBtn")}</button>
        </div>
      </div>
    </main>
  `;

  document.getElementById("back-btn").addEventListener("click", () => {
    window.location.hash = "";
  });

  bindLangToggle();
  bindThemeToggle();

  document.getElementById("save-password-btn").addEventListener("click", async () => {
    const input = document.getElementById("f-new-password");
    const newPassword = input.value;
    if (!newPassword || newPassword.length < 6) return;
    const btn = document.getElementById("save-password-btn");
    btn.disabled = true;
    const { error } = await sb.auth.updateUser({ password: newPassword });
    btn.disabled = false;
    if (error) {
      toast(t("errorPrefix") + error.message);
    } else {
      input.value = "";
      toast(t("passwordChangedMsg"));
    }
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
    toast(key ? t("keySavedMsg") : t("keyRemovedMsg"));
  });

  document.getElementById("remove-key-btn").addEventListener("click", () => {
    document.getElementById("f-api-key").value = "";
    setProviderKey(provider, "");
    toast(t("keyRemovedMsg"));
  });
}

function renderPendingApproval() {
  $app.innerHTML = `
    <div class="login-wrap">
      <img src="${loginLogoSrc()}" alt="Logo" />
      <h1>${t("pendingTitle")}</h1>
      <p>${escapeHtml(currentUser.email)} ${t("pendingDesc")}</p>
      <div class="row" style="width:100%; max-width:320px;">
        <button class="btn-secondary" id="recheck-btn" style="width:100%;">${t("checkStatus")}</button>
      </div>
      <button class="btn-ghost" id="pending-logout-btn" style="margin-top:14px;">${t("logout")}</button>
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
      <img src="${loginLogoSrc()}" alt="Logo" />
      <h1>${t("profileErrorTitle")}</h1>
      <p>${t("profileErrorDesc")}</p>
      <button class="btn-ghost" id="error-logout-btn">${t("logout")}</button>
    </div>
  `;
  document.getElementById("error-logout-btn").addEventListener("click", logout);
}

function adminNavButton() {
  return currentProfile && currentProfile.is_admin
    ? `<button class="icon-btn" id="admin-btn">${t("adminNav")}</button>`
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

function exportNavButton() {
  return `<button class="icon-btn" id="export-btn">${t("exportNav")}</button>`;
}

function onboardingNavButton() {
  return `<a class="icon-btn" href="https://claude.ai/code/artifact/a5713396-1a29-499d-9edb-4b642a6f1ace" target="_blank" rel="noopener">${t("onboardingBannerText")}</a>`;
}

function bindExportNavButton() {
  const btn = document.getElementById("export-btn");
  if (btn) {
    btn.addEventListener("click", () => {
      window.location.hash = "#/export";
    });
  }
}

// ---------- View: Export (App -> Excel-Katalog Sync) ----------

function buildExportBlock(idea) {
  const section = (label, value) => (value ? `\n${label}:\n${value}\n` : "");
  return [
    `### ${idea.quick_note}`,
    `Status: ${idea.status}`,
    `Abteilung: ${idea.department}`,
    `Team: ${idea.team}`,
    idea.owner_name ? `Usecase-Geber: ${idea.owner_name}` : "",
    idea.tags ? `Tags/Bucket: ${idea.tags}` : "",
    idea.ai_role ? `KI-Rolle: ${idea.ai_role}` : "",
    idea.kpi_kind ? `Kind of KPI: ${idea.kpi_kind}` : "",
    idea.list_priority ? `Priorität (Liste): ${idea.list_priority}` : "",
    section("Problem", idea.problem),
    section("Ziel", idea.goal),
    section("Business Benefit", idea.business_benefit),
    section("Tools/Systeme", idea.tools),
    section("Wichtige Gedanken vorab / Risiken", idea.considerations),
    section("Input", idea.input_source),
    section("Output", idea.output_result),
    section("Quantifizierter Nutzen", idea.quantified_benefit),
    section("Qualitativer Nutzen", idea.qualitative_benefit),
    section("Kommentar", idea.comment),
    section("Start-Prompt", idea.initial_prompt),
  ]
    .filter(Boolean)
    .join("\n");
}

// Exakte Spaltenreihenfolge des Excel-Katalogs (46 Spalten, A:AT). Leere
// Positionen sind Formel- ("#CONNECT!"-Übersetzung) oder Leerspalten, die
// beim Einfügen nicht überschrieben werden sollen. Brand/Agency sind für
// diesen Katalog (Group Controlling) fix; ID Nr bleibt leer, weil die
// nächste freie GC-Nummer nur im Blick auf die aktuelle Live-Liste
// bestimmt werden kann.
function tsvField(value) {
  const v = (value || "").toString();
  return /[\t\n"]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

function buildExportRow(idea) {
  const cols = new Array(46).fill("");
  cols[1] = "Shared Service"; // Brand
  cols[2] = "Group Controlling"; // Agency
  cols[3] = idea.tags || ""; // Bucket NEW
  cols[4] = idea.quick_note || ""; // Use Case Name
  cols[6] = idea.problem || ""; // Problem Description
  cols[8] = idea.goal || ""; // Ziel
  cols[10] = idea.business_benefit || ""; // Business Benefit
  cols[12] = idea.ai_role || ""; // KI Rolle
  cols[14] = idea.tools || ""; // KI Lösung
  cols[18] = idea.input_source || ""; // Input (Datenquelle)
  cols[20] = idea.output_result || ""; // Output (Datenausgabe)
  cols[22] = idea.considerations || ""; // Risks
  cols[24] = idea.list_priority || ""; // Priority
  cols[25] = idea.comment || ""; // Comment
  cols[31] = idea.kpi_kind || ""; // Kind of KPI
  cols[32] = idea.quantified_benefit || ""; // Description if Quantity
  cols[33] = idea.qualitative_benefit || ""; // Description if Quality
  return cols.map(tsvField).join("\t");
}

async function renderExportSync() {
  ideasCache = await loadIdeas();
  const list = ideasCache.filter((i) => !i.catalog_id);

  $app.innerHTML = `
    <header class="topbar">
      <div class="back-row">
        <button class="icon-btn" id="back-btn">${t("backBtn")}</button>
      </div>
      ${langToggleButton()}${themeToggleButton()}
    </header>
    <main>
      <div class="card">
        <div class="section-title" style="margin:0 0 10px;">${t("exportTitle")}</div>
        <p style="font-size:13.5px; color:var(--text-dim); margin:0 0 14px; line-height:1.5;">${t("exportIntro")}</p>
        <p style="font-size:13px; color:var(--text); background:var(--surface-2); border-left:3px solid var(--accent); border-radius:6px; padding:10px 12px; margin:0 0 14px; line-height:1.5;">${t("exportFieldsNote")}</p>
        ${
          list.length
            ? `<p style="font-size:12.5px; color:var(--text-dim); margin:0 0 14px; line-height:1.5;">${t("exportTsvNote")}</p>
               <div class="row">
                 <button class="btn-primary" id="copy-all-btn" style="width:100%;">${t("copyAllBtn")} (${list.length})</button>
               </div>
               <div class="row">
                 <button class="btn-secondary" id="copy-all-tsv-btn" style="width:100%;">${t("copyTsvAllBtn")} (${list.length})</button>
               </div>`
            : ""
        }
      </div>
      <div class="idea-list" id="export-list">
        ${
          list.length
            ? list
                .map(
                  (idea) => `
                <div class="idea-item" style="cursor:default;">
                  <div class="idea-title">${escapeHtml(idea.quick_note)}</div>
                  <div class="idea-meta">
                    <span class="badge status-${idea.status}">${t(`status_${idea.status}`)}</span>
                    ${idea.team ? `<span class="badge">${escapeHtml(idea.team)}</span>` : ""}
                  </div>
                  <div class="row" style="margin-top:10px;">
                    <button class="btn-secondary" data-copy-one="${idea.id}" style="width:100%;">${t("copyOneBtn")}</button>
                  </div>
                  <div class="row" style="margin-top:6px;">
                    <button class="btn-secondary" data-copy-tsv-one="${idea.id}" style="width:100%;">${t("copyTsvOneBtn")}</button>
                  </div>
                </div>
              `
                )
                .join("")
            : `<div class="empty-state">${t("exportEmpty")}</div>`
        }
      </div>
    </main>
  `;

  document.getElementById("back-btn").addEventListener("click", () => {
    window.location.hash = "";
  });
  bindLangToggle();
  bindThemeToggle();

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      toast(t("copiedMsg"));
    } catch {
      toast(t("copyFailedMsg"));
    }
  }

  document.querySelectorAll("[data-copy-one]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idea = list.find((i) => i.id === btn.dataset.copyOne);
      copyText(buildExportBlock(idea));
    });
  });

  document.querySelectorAll("[data-copy-tsv-one]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idea = list.find((i) => i.id === btn.dataset.copyTsvOne);
      copyText(buildExportRow(idea));
    });
  });

  const copyAllBtn = document.getElementById("copy-all-btn");
  if (copyAllBtn) {
    copyAllBtn.addEventListener("click", () => {
      copyText(list.map(buildExportBlock).join("\n\n---\n\n"));
    });
  }

  const copyAllTsvBtn = document.getElementById("copy-all-tsv-btn");
  if (copyAllTsvBtn) {
    copyAllTsvBtn.addEventListener("click", () => {
      copyText(list.map(buildExportRow).join("\n"));
    });
  }
}

function accessLevelOptions(selected) {
  const opts = [
    { value: "", label: t("accessNoneOption") },
    { value: "read", label: t("accessReadOption") },
    { value: "write", label: t("accessWriteOption") },
  ];
  return opts
    .map((o) => `<option value="${o.value}" ${o.value === (selected || "") ? "selected" : ""}>${o.label}</option>`)
    .join("");
}

async function renderAdmin() {
  profilesCache = await loadAllProfiles();
  const pending = profilesCache.filter((p) => !p.is_approved && !p.is_rejected);
  const approved = profilesCache.filter((p) => p.is_approved);
  const nonAdminApproved = approved.filter((p) => !p.is_admin);
  if (kostenstellenCache.length === 0) kostenstellenCache = await loadKostenstellen();
  accessCache = await loadAllAccess();

  $app.innerHTML = `
    <header class="topbar">
      <div class="back-row">
        <button class="icon-btn" id="back-btn">${t("backBtn")}</button>
      </div>
      ${langToggleButton()}${themeToggleButton()}
    </header>
    <main>
      <div class="section-title" style="margin:0 4px 8px;">${t("pendingApprovalTitlePrefix")}${pending.length})</div>
      <div class="idea-list" style="margin-bottom:20px;">
        ${
          pending.length
            ? pending
                .map(
                  (p) => `
              <div class="idea-item">
                <div class="idea-title">${escapeHtml(p.email)}</div>
                <div class="idea-meta">
                  <button class="btn-primary" data-approve="${p.id}" style="padding:8px 14px; font-size:13px;">${t("approveBtn")}</button>
                  <button class="btn-danger" data-reject="${p.id}" style="padding:8px 14px; font-size:13px;">${t("rejectBtn")}</button>
                </div>
              </div>
            `
                )
                .join("")
            : `<div class="empty-state">${t("noPendingMsg")}</div>`
        }
      </div>

      <div class="section-title" style="margin:0 4px 8px;">${t("approvedMembersTitlePrefix")}${approved.length})</div>
      <div class="idea-list">
        ${approved
          .map(
            (p) => `
            <div class="idea-item">
              <div class="idea-title">${escapeHtml(p.email)}</div>
              <div class="idea-meta">
                ${p.is_admin ? `<span class="badge">${t("adminBadge")}</span>` : ""}
              </div>
            </div>
          `
          )
          .join("")}
      </div>

      <div class="section-title" style="margin:24px 4px 8px;">${t("kostenstellenTitle")}</div>
      <div class="card">
        <label class="field-label" style="margin-top:0;">${t("newKostenstelleLabel")}</label>
        <div class="row">
          <input class="field" id="new-ks-code" placeholder="${t("kostenstelleCodePlaceholder")}" style="flex:1;" />
          <input class="field" id="new-ks-name" placeholder="${t("kostenstelleNamePlaceholder")}" style="flex:1;" />
        </div>
        <div class="row">
          <button class="btn-primary" id="add-ks-btn" style="width:100%;">${t("addKostenstelleBtn")}</button>
        </div>
      </div>

      ${
        kostenstellenCache.length
          ? kostenstellenCache
              .map(
                (k) => `
            <div class="card">
              <div class="section-title" style="margin:0 0 10px;">${escapeHtml(k.code)}${k.name ? ` – ${escapeHtml(k.name)}` : ""}</div>
              ${
                nonAdminApproved.length
                  ? TEAM_SCOPES.map(
                      (scope) => `
                      <div style="margin-bottom:14px;">
                        <div style="font-size:12px; color:var(--text-dim); margin-bottom:6px;">${
                          scope === "*" ? t("allTeamsScope") : escapeHtml(scope)
                        }</div>
                        ${nonAdminApproved
                          .map((u) => {
                            const grant = accessCache.find(
                              (a) => a.user_id === u.id && a.kostenstelle_code === k.code && a.team === scope
                            );
                            return `
                          <div class="row" style="justify-content:space-between; align-items:center; margin-bottom:8px;">
                            <span style="font-size:13.5px;">${escapeHtml(u.email)}</span>
                            <select class="field" data-access-user="${u.id}" data-access-ks="${escapeHtml(k.code)}" data-access-team="${escapeHtml(scope)}" style="max-width:220px; flex:none;">
                              ${accessLevelOptions(grant ? grant.access_level : "")}
                            </select>
                          </div>
                        `;
                          })
                          .join("")}
                      </div>
                    `
                    ).join("")
                  : `<div class="empty-state" style="padding:12px 4px;">${t("noApprovedForAccessMsg")}</div>`
              }
            </div>
          `
              )
              .join("")
          : `<div class="empty-state">${t("emptyKostenstellen")}</div>`
      }
    </main>
  `;

  document.getElementById("back-btn").addEventListener("click", () => {
    window.location.hash = "";
  });

  bindLangToggle();
  bindThemeToggle();

  document.querySelectorAll("[data-approve]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      const ok = await approveUser(btn.dataset.approve);
      if (ok) {
        toast(t("approvedMsg"));
        await renderAdmin();
      } else {
        btn.disabled = false;
      }
    });
  });

  document.querySelectorAll("[data-reject]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!window.confirm(t("rejectConfirmMsg"))) return;
      btn.disabled = true;
      const ok = await rejectUser(btn.dataset.reject);
      if (ok) {
        toast(t("rejectedMsg"));
        await renderAdmin();
      } else {
        btn.disabled = false;
      }
    });
  });

  document.getElementById("add-ks-btn").addEventListener("click", async () => {
    const codeInput = document.getElementById("new-ks-code");
    const nameInput = document.getElementById("new-ks-name");
    const code = codeInput.value.trim();
    const name = nameInput.value.trim();
    if (!code) return;
    const btn = document.getElementById("add-ks-btn");
    btn.disabled = true;
    const created = await createKostenstelle(code, name);
    btn.disabled = false;
    if (created) {
      toast(t("kostenstelleSavedMsg"));
      kostenstellenCache = [];
      await renderAdmin();
    }
  });

  document.querySelectorAll("[data-access-user]").forEach((sel) => {
    sel.addEventListener("change", async () => {
      const userId = sel.dataset.accessUser;
      const code = sel.dataset.accessKs;
      const team = sel.dataset.accessTeam;
      const level = sel.value || null;
      sel.disabled = true;
      const ok = await setKostenstelleAccess(userId, code, team, level);
      sel.disabled = false;
      if (ok) {
        toast(t("accessSavedMsg"));
        accessCache = await loadAllAccess();
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
  if (kostenstellenCache.length === 0) {
    kostenstellenCache = await loadKostenstellen();
    myGrants = await loadMyGrants();
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
  } else if (route.view === "export") {
    await renderExportSync();
  } else {
    await renderList();
  }
}

init();
