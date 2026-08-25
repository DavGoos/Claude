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
      "Aus Sicherheitsgründen gibt es keine offene Registrierung mehr. Schick mir kurz deinen Namen, die gewünschte E-Mail-Adresse sowie die Kostenstelle(n) und das/die Team(s), für die du Zugriff brauchst – ich lege dir dann ein Konto an und schicke dir ein Start-Passwort.",
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
    dashboardTab: "Auswertungen",
    dashboardHeaderTitle: "Auswertungen",
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
    filterAllKostenstellenOption: "Alle Kostenstellen",
    filterAllTeamsOption: "Alle Teams",
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
    priority_hardToImplement: "Kaum machbar",
    priority_highRisk: "Hohes Risiko",

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
    systemeLabel: "Systeme",
    systemePlaceholder: "Beteiligte Systeme/Plattformen (eigene Spalte in der Liste, getrennt von KI-Lösung)",
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
    skillLevelLabel: "Skill Level (Liste)",
    skillLevelPlaceholder: "z.B. Skill 2 - Ambassador (in der Liste nur vereinzelt gepflegt)",
    catalogIdLabel: "Katalog-ID",
    catalogIdPlaceholder: "z.B. GC29 (muss eindeutig sein)",
    ownerNameLabel: "Usecase-Geber / Ansprechpartner",
    ownerNamePlaceholder: "Name der verantwortlichen Person",

    exportTitle: "Neue Ideen für die AI Ambassadors Usecase-Collection kopieren",
    exportIntro:
      "Hier stehen alle Ideen, die noch keine Katalog-ID haben – also noch nicht in der zentralen AI Ambassadors Usecase-Collection stehen. Wichtig: Das ist reines Copy & Paste, hier wird nichts automatisch geschrieben oder synchronisiert. Kopiere eine Idee (oder alle) und füge sie selbst als neue Zeile in die Usecase-Collection ein (am einfachsten mit der Tab-getrennt-Option unten), oder poste den Text stattdessen in den Chat mit Claude, wenn du beim Einordnen Unterstützung möchtest. Trag die dort vergebene Katalog-ID (z.B. GC30) anschließend hier bei der Idee ein, dann verschwindet sie aus dieser Liste und taucht stattdessen unten bei den Aktualisierungen auf.",
    exportFieldsNote:
      "Vor dem Kopieren prüfen: Bei der Idee gibt es einen ausklappbaren Bereich \"Weitere Katalog-Felder\" (KI-Rolle, Systeme, Input, Output, Kind of KPI, quantifizierter/qualitativer Nutzen, Kommentar, Priorität, Skill Level). Die sind für die tägliche Nutzung optional – für einen vollständigen Case in der Usecase-Collection sind es aber genau die relevanten Felder und sollten ausgefüllt sein, bevor du kopierst.",
    exportEmpty: "Alle Ideen haben bereits eine Katalog-ID – nichts zu kopieren.",
    copyOneBtn: "📋 Kopieren",
    copyAllBtn: "📋 Alle kopieren",
    copyTsvOneBtn: "📋 Tab-getrennt (Excel-Zeile)",
    copyTsvAllBtn: "📋 Alle als Excel-Zeilen",
    exportTsvNote:
      "Reines Copy & Paste: die Excel-Zeile(n) direkt ab einer neuen Zeile in der AI Ambassadors Usecase-Collection einfügen (Strg+V) – nichts davon läuft automatisch. ID Nr bleibt leer – dort die nächste freie GC-Nummer aus der Collection eintragen. Brand/Agency werden mit \"Shared Service\"/\"Group Controlling\" vorbelegt. Die Übersetzungs-Formelspalten (\"#CONNECT!\") danach aus der Zeile darüber nach unten ziehen.",

    updateExportTitle: "Bereits synchronisierte Cases aktualisieren",
    updateExportIntro:
      "Hier stehen alle Ideen, die schon eine Katalog-ID haben – also schon einmal in die Usecase-Collection übertragen wurden. Wenn du eine davon in der App weiter gepflegt hast, kannst du hier eine aktuelle Excel-Zeile kopieren und damit die bestehende Zeile mit der passenden ID Nr in der Collection überschreiben (Strg+V direkt auf der vorhandenen Zeile, nicht als neue Zeile einfügen!). Auch hier reines Copy & Paste, nichts läuft automatisch.",
    updateExportFieldsNote:
      "Die Zeile enthält zusätzlich Änderungsstatus (\"geändert\"), Geändert von (deine E-Mail) und Änderungsdatum (heute) – \"Was wurde geändert\" bleibt leer zum selbst Ausfüllen, das pflegt aktuell niemand in der Liste.",
    updateExportEmpty: "Keine Ideen mit Katalog-ID vorhanden – nichts zu aktualisieren.",
    copyUpdateTsvOneBtn: "📋 Update-Zeile (Excel)",
    copyUpdateTsvAllBtn: "📋 Alle Update-Zeilen",

    evaluationTitle: "Bewertung",
    impactLabel: "Nutzen",
    feasibilityLabel: "Machbarkeit",
    effortLabel: "Aufwand",
    riskLabel: "Risiko",
    assessmentPrefix: "Einschätzung: ",

    aiSupportTitle: "KI-Unterstützung",
    aiSupportDesc:
      "Erzeugt einen Prompt, der eine KI dazu anleitet, mögliche Umsetzungswege für diesen Use Case einzuschätzen (nötige Tool-Stufe, Grenzen, Skalierbarkeit, IT-Bedarf ...). Voraussetzung: Problem, Ziel und Business Benefit oben sind bereits ausgefüllt – die werden als feste Grundlage übernommen, nicht neu erfunden. Füge den Prompt in ein beliebiges KI-Chat-Tool ein (Copilot, ChatGPT, Claude, Gemini, ...) und kopier die Antwort bei Bedarf unten zur Doku rein – ausgewertet wird sie nicht automatisch.",
    generatePromptBtn: "📋 Start-Prompt erzeugen",
    aiResponsePasteLabel: "KI-Antwort (Notiz, optional)",
    aiResponsePlaceholder: "Antwort/Zusammenfassung der KI hier zur Doku einfügen (optional)",

    toolsLabel: "Tools & Umsetzungsoptionen",
    toolsPlaceholder: "z.B. konkrete Tools/Frameworks, die für die Umsetzung sinnvoll sind",
    considerationsLabel: "Wichtige Gedanken vorab",
    considerationsPlaceholder: "z.B. Datenschutz, Datenquelle, Kosten",
    startPromptLabel: "Start-Prompt fürs Projekt",
    startPromptPlaceholder: "Per Klick auf \"Start-Prompt erzeugen\" befüllt, oder hier selbst eintragen",
    copyStartPromptBtn: "Start-Prompt kopieren",
    kickoffPromptRequiresFieldsMsg: "Bitte zuerst Problem, Ziel und Business Benefit ausfüllen.",
    kickoffPromptGeneratedMsg: "Start-Prompt erzeugt",

    saveBtn: "Speichern",
    savingBtn: "Speichere...",
    savedMsg: "Gespeichert",
    deleteIdeaConfirm: "Diese Idee wirklich löschen?",
    ideaDeletedMsg: "Idee gelöscht",
    copiedMsg: "In Zwischenablage kopiert",
    copyFailedMsg: "Kopieren nicht möglich, bitte manuell markieren",
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
    teamsNav: "🧩 Teams",
    teamsManagementTitle: "Teams verwalten",
    emptyTeamsForKostenstelle: "Noch keine Teams für diese Kostenstelle angelegt.",
    renameTeamBtn: "Umbenennen",
    deleteTeamBtn: "Löschen",
    newTeamNamePlaceholder: "Neues Team, z.B. Data Science",
    addTeamBtn: "+ Team anlegen",
    noKostenstellenAccessMsg: "Du hast noch keinen Zugriff auf eine Kostenstelle.",
    teamSavedMsg: "Team gespeichert",
    renameTeamPrompt: "Neuer Name für dieses Team:",
    deleteTeamConfirm: "Team wirklich löschen? Ideen/Prozesse mit diesem Team verlieren dann ihre Team-Zuordnung.",
    teamDeletedMsg: "Team gelöscht",
    unsavedChangesConfirm: "Es gibt ungespeicherte Änderungen. Diese Seite trotzdem verlassen und die Änderungen verwerfen?",

    dashFilterAllDept: "Alle Kostenstellen",
    dashFilterAllTeam: "Alle Teams",

    dashMatrixTitle: "Nutzen × Aufwand",
    dashMatrixEmpty: "Noch keine bewertbaren Use Cases in dieser Auswahl.",
    dashMatrixDiscardedHint: "{n} verworfene Idee(n) sind hier ausgeblendet.",
    dashMatrixCellLabel: "Use Case(s) in dieser Zelle:",
    dashAxisCaption: "→ Aufwand (1–5) · ↑ Nutzen (1–5)",

    dashTreeTitle: "Einheiten, Prozesse & Use Cases",
    dashTreeEmpty: "Noch keine Prozesse in dieser Auswahl.",

    dashStatusTitle: "Status je Team",
    dashStatusEmpty: "Noch keine Ideen in dieser Auswahl.",

    dashHeatmapTitle: "AI-Potenzial der Prozesse",
    dashHeatmapEmpty: "Noch keine Prozesse in dieser Auswahl.",

    dashRankingTitle: "Top Quick-Wins",
    dashRankingEmpty: "Keine offenen Use Cases in dieser Auswahl.",
    dashShowMore: "Mehr anzeigen",
    dashShowLess: "Weniger anzeigen",

    dashTimelineTitle: "Erfassungsverlauf",
    dashTimelineEmpty: "Noch keine Daten für einen Verlauf.",

    loadErrorPrefix: "Fehler beim Laden: ",
    saveErrorPrefix: "Fehler beim Speichern: ",
    deleteErrorPrefix: "Fehler beim Löschen: ",
    profileLoadErrorPrefix: "Fehler beim Laden des Profils: ",
    approveErrorPrefix: "Fehler beim Freigeben: ",
    rejectErrorPrefix: "Fehler beim Ablehnen: ",
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
      "For security reasons there's no open self-registration anymore. Just send me your name, the email address you'd like to use, and the cost center(s) and team(s) you need access to - I'll set up an account and send you a starting password.",
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
    dashboardTab: "Analytics",
    dashboardHeaderTitle: "Analytics",
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
    filterAllKostenstellenOption: "All cost centers",
    filterAllTeamsOption: "All teams",
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
    priority_hardToImplement: "Hard to implement",
    priority_highRisk: "High risk",

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
    systemeLabel: "Systems",
    systemePlaceholder: "Systems/platforms involved (own column in the list, separate from AI solution)",
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
    skillLevelLabel: "Skill level (catalog)",
    skillLevelPlaceholder: "e.g. Skill 2 - Ambassador (only filled in sporadically in the list)",
    catalogIdLabel: "Catalog ID",
    catalogIdPlaceholder: "e.g. GC29 (must be unique)",
    ownerNameLabel: "Use case owner / contact",
    ownerNamePlaceholder: "Name of the responsible person",

    exportTitle: "Copy new ideas into the AI Ambassadors Usecase Collection",
    exportIntro:
      "This lists every idea that doesn't have a catalog ID yet - i.e. isn't in the central AI Ambassadors Usecase Collection yet. Important: this is plain copy & paste, nothing here writes or syncs anything automatically. Copy one idea (or all of them) and paste it yourself as a new row into the Usecase Collection (easiest with the tab-separated option below), or post the text into the chat with Claude instead if you'd like help sorting it out. Enter the catalog ID assigned there (e.g. GC30) back on the idea afterwards, then it disappears from this list and shows up under the updates section below instead.",
    exportFieldsNote:
      "Check before copying: the idea has an expandable \"Additional catalog fields\" section (AI role, systems, input, output, kind of KPI, quantified/qualitative benefit, comment, priority, skill level). Those are optional for everyday use - but for a complete case in the Usecase Collection they're exactly the fields that matter, so fill them in before copying.",
    exportEmpty: "Every idea already has a catalog ID - nothing to copy.",
    copyOneBtn: "📋 Copy",
    copyAllBtn: "📋 Copy all",
    copyTsvOneBtn: "📋 Tab-separated (Excel row)",
    copyTsvAllBtn: "📋 All as Excel rows",
    exportTsvNote:
      "Plain copy & paste: paste the Excel row(s) starting at a new row in the AI Ambassadors Usecase Collection (Ctrl+V) - none of this happens automatically. ID Nr stays blank - fill in the next free GC number from the Collection there. Brand/Agency default to \"Shared Service\"/\"Group Controlling\". Afterwards drag the translation formula columns (\"#CONNECT!\") down from the row above.",

    updateExportTitle: "Update already-synced cases",
    updateExportIntro:
      "This lists every idea that already has a catalog ID - i.e. was already copied into the Usecase Collection before. If you kept editing one of them in the app, copy an up-to-date Excel row here and use it to overwrite the existing row with that ID Nr in the Collection (Ctrl+V directly onto the existing row, not as a new row!). Also plain copy & paste, nothing runs automatically.",
    updateExportFieldsNote:
      "The row additionally fills in Änderungsstatus (\"geändert\"), Geändert von (your email) and Änderungsdatum (today) - \"Was wurde geändert\" stays blank for you to fill in yourself, nobody currently maintains that column in the list.",
    updateExportEmpty: "No ideas with a catalog ID yet - nothing to update.",
    copyUpdateTsvOneBtn: "📋 Update row (Excel)",
    copyUpdateTsvAllBtn: "📋 All update rows",

    evaluationTitle: "Scoring",
    impactLabel: "Impact",
    feasibilityLabel: "Feasibility",
    effortLabel: "Effort",
    riskLabel: "Risk",
    assessmentPrefix: "Assessment: ",

    aiSupportTitle: "AI support",
    aiSupportDesc:
      "Generates a prompt that guides an AI to assess possible implementation paths for this use case (tool tier needed, limits, scalability, IT involvement ...). Requires problem, goal and business benefit above to already be filled in - those are taken as a fixed given, not reinvented. Paste the prompt into any AI chat tool (Copilot, ChatGPT, Claude, Gemini, ...) and optionally paste the reply back below for documentation - it isn't evaluated automatically.",
    generatePromptBtn: "📋 Generate starter prompt",
    aiResponsePasteLabel: "AI reply (optional note)",
    aiResponsePlaceholder: "Paste the AI's reply/summary here for documentation (optional)",

    toolsLabel: "Tools & implementation options",
    toolsPlaceholder: "e.g. concrete tools/frameworks that make sense for the implementation",
    considerationsLabel: "Key considerations upfront",
    considerationsPlaceholder: "e.g. Privacy, data sources, cost",
    startPromptLabel: "Starter prompt for the project",
    startPromptPlaceholder: "Filled in by clicking \"Generate starter prompt\", or write it yourself",
    copyStartPromptBtn: "Copy starter prompt",
    kickoffPromptRequiresFieldsMsg: "Please fill in problem, goal and business benefit first.",
    kickoffPromptGeneratedMsg: "Starter prompt generated",

    saveBtn: "Save",
    savingBtn: "Saving...",
    savedMsg: "Saved",
    deleteIdeaConfirm: "Really delete this idea?",
    ideaDeletedMsg: "Idea deleted",
    copiedMsg: "Copied to clipboard",
    copyFailedMsg: "Couldn't copy, please select manually",
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
    teamsNav: "🧩 Teams",
    teamsManagementTitle: "Manage teams",
    emptyTeamsForKostenstelle: "No teams set up for this cost center yet.",
    renameTeamBtn: "Rename",
    deleteTeamBtn: "Delete",
    newTeamNamePlaceholder: "New team, e.g. Data Science",
    addTeamBtn: "+ Add team",
    noKostenstellenAccessMsg: "You don't have access to any cost center yet.",
    teamSavedMsg: "Team saved",
    renameTeamPrompt: "New name for this team:",
    deleteTeamConfirm: "Really delete this team? Ideas/processes with this team will lose their team assignment.",
    teamDeletedMsg: "Team deleted",
    unsavedChangesConfirm: "You have unsaved changes. Leave this page anyway and discard them?",

    dashFilterAllDept: "All cost centers",
    dashFilterAllTeam: "All teams",

    dashMatrixTitle: "Impact × effort",
    dashMatrixEmpty: "No assessable use cases in this selection yet.",
    dashMatrixDiscardedHint: "{n} discarded idea(s) are hidden here.",
    dashMatrixCellLabel: "Use case(s) in this cell:",
    dashAxisCaption: "→ Effort (1–5) · ↑ Impact (1–5)",

    dashTreeTitle: "Units, processes & use cases",
    dashTreeEmpty: "No processes in this selection yet.",

    dashStatusTitle: "Status by team",
    dashStatusEmpty: "No ideas in this selection yet.",

    dashHeatmapTitle: "AI potential of the processes",
    dashHeatmapEmpty: "No processes in this selection yet.",

    dashRankingTitle: "Top quick wins",
    dashRankingEmpty: "No open use cases in this selection.",
    dashShowMore: "Show more",
    dashShowLess: "Show less",

    dashTimelineTitle: "Collection progress over time",
    dashTimelineEmpty: "No data for a timeline yet.",

    loadErrorPrefix: "Error loading: ",
    saveErrorPrefix: "Error saving: ",
    deleteErrorPrefix: "Error deleting: ",
    profileLoadErrorPrefix: "Error loading profile: ",
    approveErrorPrefix: "Error approving: ",
    rejectErrorPrefix: "Error rejecting: ",
  },
};

const STATUS_ORDER = ["idea", "evaluating", "planned", "in_progress", "done", "discarded"];
const PROCESS_STATUS_ORDER = ["open", "reviewed"];

// Kostenstelle (das Pflichtfeld "department" bei ideas/processes) kommt
// aus der Tabelle "kostenstellen", Team aus der Tabelle "teams" (siehe
// kostenstellenCache/teamsCache/myGrants) - beide mit individuellem
// Zugriffslevel pro Person. Teams gehören zu genau einer Kostenstelle
// (nicht global) und werden über die Verwaltungsoberfläche gepflegt, wer
// Vollzugriff auf die jeweilige Kostenstelle hat.

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
let teamsCache = [];
let myGrants = [];
let accessCache = [];
let activeFilter = "all";
let activeDeptFilter = "";
let activeTeamFilter = "";
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
  const feasibility = idea.feasibility || 3;
  const risk = idea.risk || 3;
  // Machbarkeit/Risiko wirken als Vorabprüfung vor der eigentlichen
  // Impact/Effort-Matrix: kaum machbare oder riskante Ideen sollen nicht als
  // "Quick Win" erscheinen, egal wie gut Impact/Effort sonst aussehen.
  if (feasibility <= 2) return { label: t("priority_hardToImplement"), color: "#ef4444" };
  if (risk >= 4) return { label: t("priority_highRisk"), color: "#f97316" };
  if (impact >= 4 && effort <= 2) return { label: t("priority_quickWin"), color: "#22c55e" };
  if (impact >= 4 && effort >= 4) return { label: t("priority_bigProject"), color: "#8b5cf6" };
  if (impact <= 2 && effort <= 2) return { label: t("priority_niceToHave"), color: "#93c5fd" };
  if (impact <= 2 && effort >= 4) return { label: t("priority_postpone"), color: "#9aa1af" };
  return { label: t("priority_review"), color: "#fcd34d" };
}

function ideaScore(idea) {
  return (idea.impact || 3) - (idea.effort || 3) + (idea.feasibility || 3) - (idea.risk || 3);
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

// Warnung vor Datenverlust: Formulare (Ideen/Prozesse anlegen oder
// bearbeiten) melden sich hier per watchUnsavedChanges() an. Vor jedem
// Verlassen der Seite - egal ob per Hash-Navigation innerhalb der App,
// Browser-Zurück oder Tab schließen/neu laden - wird gewarnt, falls dabei
// noch nicht gespeicherte Eingaben verloren gehen würden.
let unsavedChangesGuard = null;
let unsavedChangesReset = null;

function watchUnsavedChanges(container) {
  if (!container) {
    unsavedChangesGuard = null;
    unsavedChangesReset = null;
    return;
  }
  let dirty = false;
  const markDirty = () => {
    dirty = true;
  };
  container.addEventListener("input", markDirty);
  container.addEventListener("change", markDirty);
  unsavedChangesGuard = () => dirty;
  unsavedChangesReset = () => {
    dirty = false;
  };
}

function clearUnsavedChanges() {
  unsavedChangesGuard = null;
  unsavedChangesReset = null;
}

function confirmLeaveIfDirty() {
  if (!unsavedChangesGuard || !unsavedChangesGuard()) return true;
  return confirm(t("unsavedChangesConfirm"));
}

function guardedLogout() {
  if (confirmLeaveIfDirty()) logout();
}

// Tab schließen/neu laden/andere URL eingeben - der Router oben bekommt
// das nicht mit, deshalb zusätzlich der native Browser-Hinweis.
window.addEventListener("beforeunload", (e) => {
  if (unsavedChangesGuard && unsavedChangesGuard()) {
    e.preventDefault();
    e.returnValue = "";
  }
});

function currentRoute() {
  const hash = window.location.hash;
  let m = hash.match(/^#\/idea\/([^/]+)$/);
  if (m) return { view: "idea-detail", id: m[1] };
  m = hash.match(/^#\/process\/([^/]+)$/);
  if (m) return { view: "process-detail", id: m[1] };
  if (hash === "#/processes") return { view: "process-list" };
  if (hash === "#/dashboard") return { view: "dashboard" };
  if (hash === "#/settings") return { view: "settings" };
  if (hash === "#/admin") return { view: "admin" };
  if (hash === "#/export") return { view: "export" };
  if (hash === "#/teams") return { view: "teams" };
  return { view: "idea-list" };
}

let lastRenderedHash = window.location.hash;
let suppressNextHashchange = false;

window.addEventListener("hashchange", () => {
  if (suppressNextHashchange) {
    suppressNextHashchange = false;
    return;
  }
  if (!confirmLeaveIfDirty()) {
    // Navigation abgebrochen: Hash zurücksetzen, ohne dass das dadurch
    // erneut ausgelöste hashchange-Event die Ansicht neu rendert (die
    // aktuelle, ungespeicherte Eingabe soll ja genau erhalten bleiben).
    suppressNextHashchange = true;
    window.location.hash = lastRenderedHash;
    return;
  }
  clearUnsavedChanges();
  render();
});

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

// Teams gehören zu genau einer Kostenstelle (siehe supabase/schema.sql) -
// eine flache, kostenstellen-übergreifende Cache-Liste, aus der überall
// nach kostenstelle_code gefiltert wird.
async function loadTeams() {
  const { data, error } = await sb.from("teams").select("*").order("name");
  if (error) {
    toast(t("loadErrorPrefix") + error.message);
    return [];
  }
  return data || [];
}

async function createTeam(kostenstelleCode, name) {
  const { data, error } = await sb
    .from("teams")
    .insert({ kostenstelle_code: kostenstelleCode, name })
    .select("*")
    .single();
  if (error) {
    toast(t("saveErrorPrefix") + error.message);
    return null;
  }
  return data;
}

async function renameTeam(id, name) {
  const { data, error } = await sb.from("teams").update({ name }).eq("id", id).select("*").single();
  if (error) {
    toast(t("saveErrorPrefix") + error.message);
    return null;
  }
  return data;
}

async function deleteTeam(id) {
  const { error } = await sb.from("teams").delete().eq("id", id);
  if (error) {
    toast(t("deleteErrorPrefix") + error.message);
    return false;
  }
  return true;
}

async function loadMyGrants() {
  if (currentProfile.is_admin) return [];
  const { data, error } = await sb
    .from("kostenstelle_access")
    .select("kostenstelle_code, team_id, access_level")
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

// Team-Objekte ({id, kostenstelle_code, name}), für die die aktuelle
// Person schreiben darf - ohne Kostenstelle über alle schreibbaren
// Kostenstellen hinweg (team_id null bei einem Grant deckt alle Teams
// dieser Kostenstelle ab).
function writableTeamsForCode(code) {
  const scoped = code ? teamsCache.filter((tm) => tm.kostenstelle_code === code) : teamsCache;
  if (currentProfile.is_admin) return scoped.slice();
  return scoped.filter((tm) => {
    const grants = myGrants.filter((g) => g.kostenstelle_code === tm.kostenstelle_code && g.access_level === "write");
    return grants.some((g) => g.team_id === null || g.team_id === tm.id);
  });
}

// Kostenstellen, die die aktuelle Person überhaupt sehen darf (lesend oder
// schreibend) - für Filter-Dropdowns, nicht nur zum Anlegen/Bearbeiten.
function readableCodes() {
  if (currentProfile.is_admin) return kostenstellenCache.map((k) => k.code);
  return Array.from(new Set(myGrants.map((g) => g.kostenstelle_code)));
}

// Team-Objekte, die für eine Kostenstelle (oder, ohne Kostenstelle, über
// alle lesbaren Kostenstellen hinweg) für die aktuelle Person sichtbar sind.
function readableTeamsForCode(code) {
  const scoped = code ? teamsCache.filter((tm) => tm.kostenstelle_code === code) : teamsCache;
  if (currentProfile.is_admin) return scoped.slice();
  return scoped.filter((tm) => {
    const grants = myGrants.filter((g) => g.kostenstelle_code === tm.kostenstelle_code);
    return grants.some((g) => g.team_id === null || g.team_id === tm.id);
  });
}

function canWriteCombo(code, teamId) {
  if (currentProfile.is_admin) return true;
  return myGrants.some(
    (g) => g.kostenstelle_code === code && g.access_level === "write" && (g.team_id === null || g.team_id === teamId)
  );
}

// Wer Vollzugriff (Schreiben, alle Teams) auf eine Kostenstelle hat, darf
// deren Teams anlegen/umbenennen/löschen - spiegelt can_manage_teams() in
// supabase/schema.sql (die RLS-Policy ist die eigentliche Absicherung,
// das hier steuert nur, ob die Verwaltungs-UI angezeigt wird).
function canManageTeams(code) {
  if (currentProfile.is_admin) return true;
  return myGrants.some((g) => g.kostenstelle_code === code && g.team_id === null && g.access_level === "write");
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

// team_id ist nullable (Vollzugriff), Postgrest ".eq()" matcht NULL nicht
// - deshalb hier ".is()" für den Vollzugriff-Fall. Da team_id nicht Teil
// eines Primary Keys sein kann (siehe schema.sql), gibt es keinen
// verlässlichen "onConflict"-Ziel für ein upsert - stattdessen explizit
// erst löschen, dann (falls ein Level gewählt wurde) neu anlegen.
async function setKostenstelleAccess(userId, code, teamId, level) {
  let del = sb.from("kostenstelle_access").delete().eq("user_id", userId).eq("kostenstelle_code", code);
  del = teamId ? del.eq("team_id", teamId) : del.is("team_id", null);
  const { error: delError } = await del;
  if (delError) {
    toast(t("saveErrorPrefix") + delError.message);
    return false;
  }
  if (!level) return true;
  const { error } = await sb
    .from("kostenstelle_access")
    .insert({ user_id: userId, kostenstelle_code: code, team_id: teamId || null, access_level: level });
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

async function createIdea(quickNote, department, teamId, processId, parentIdeaId) {
  const payload = { quick_note: quickNote, department, team_id: teamId, created_by: currentUser.id };
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

// Start-Prompt fürs Projekt: nimmt Kurznotiz + das bereits vom Menschen
// geschriebene Problem/Ziel/Business Benefit als feste Grundlage (die KI
// soll diese NICHT neu erfinden - sonst zirkulärer Bezug, siehe Diskussion
// im Chat) und bittet ausschließlich um eine Einschätzung möglicher
// Umsetzungswege. Bewusst als Freitext-Prompt zum Einfügen in ein
// beliebiges KI-Chat-Tool, nicht als strukturierte JSON-Antwort - die App
// wertet die Antwort nicht mehr automatisch aus (siehe f-ai-plan-notes).
const KICKOFF_PROMPT_INSTRUCTIONS = {
  de: `Ich möchte diesen internen AI-Use-Case realistisch einschätzen und die Umsetzung planen. Bitte hilf mir dabei und gehe auf Folgendes ein:

- Welche konkreten Lösungsansätze/Architekturen kommen realistisch in Frage?
- Welche "Tool-Stufe" ist dafür nötig: reicht ein einfacher KI-Chat, ein Cowork-artiges No-Code-Setup, oder braucht es einen echten Coding-Assistenten bzw. Entwicklung?
- In welchen Ausprägungen ist eine Umsetzung denkbar (z.B. schlanker erster Schritt vs. vollständige Lösung)?
- Wo liegen die Grenzen bzw. Risiken dieses Ansatzes?
- Ist das im Alleingang umsetzbar, oder braucht es IT bzw. weitere Spezialist:innen?
- Wie sieht es mit der Skalierbarkeit aus?

Fasse deine Antwort am Ende in einem kompakten Abschnitt "Projektaufbau-Zusammenfassung" zusammen, den ich unverändert in mein Tracking-Tool zurückkopieren kann.`,
  en: `I want to realistically assess this internal AI use case and plan its implementation. Please help me with that and address the following:

- What concrete solution approaches/architectures are realistically possible?
- What "tool tier" is needed: is a simple AI chat enough, a Cowork-like no-code setup, or does it need a real coding assistant / development?
- What forms of implementation are conceivable (e.g. a lean first step vs. a full solution)?
- Where are the limits or risks of this approach?
- Can this be done solo, or does it need IT or other specialists?
- What about scalability?

End your answer with a compact "Project setup summary" section that I can copy back into my tracking tool unchanged.`,
};

function kickoffPromptContext(fields) {
  const labels =
    currentLang === "en"
      ? { note: "Quick note", problem: "Problem", goal: "Goal", benefit: "Business benefit" }
      : { note: "Kurznotiz", problem: "Problem", goal: "Ziel", benefit: "Business Benefit" };
  return [
    `${labels.note}: ${fields.quick_note}`,
    `${labels.problem}: ${fields.problem}`,
    `${labels.goal}: ${fields.goal}`,
    `${labels.benefit}: ${fields.business_benefit}`,
  ].join("\n\n");
}

function buildKickoffPrompt(fields) {
  return `${kickoffPromptContext(fields)}\n\n---\n\n${KICKOFF_PROMPT_INSTRUCTIONS[currentLang]}`;
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

async function createProcess(name, department, teamId, parentProcessId) {
  const payload = { name, department, team_id: teamId, created_by: currentUser.id };
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
      <button data-tab="dashboard" class="${active === "dashboard" ? "active" : ""}">${t("dashboardTab")}</button>
    </div>
  `;
}

const TAB_HASHES = { ideas: "", processes: "#/processes", dashboard: "#/dashboard" };

function bindTabBar() {
  document.querySelectorAll(".tabbar button").forEach((btn) => {
    btn.addEventListener("click", () => {
      window.location.hash = TAB_HASHES[btn.dataset.tab] ?? "";
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

function teamName(teamId) {
  const tm = teamsCache.find((x) => x.id === teamId);
  return tm ? tm.name : "";
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

// Team-Objekte ({id, kostenstelle_code, name}) als <option>-Liste - wie
// selectOptionsFrom, aber der Options-Wert ist die Team-ID, nicht der Name.
function teamOptionsFrom(teams, selectedId) {
  const options = [`<option value="" ${selectedId ? "" : "selected"}>${t("selectPlaceholderOption")}</option>`];
  teams.forEach((tm) => {
    options.push(`<option value="${tm.id}" ${tm.id === selectedId ? "selected" : ""}>${escapeHtml(tm.name)}</option>`);
  });
  return options.join("");
}

function departmentTeamFields(department, teamId, idPrefix) {
  const codes = new Set(writableCodes());
  if (department) codes.add(department);
  const teams = department ? writableTeamsForCode(department).slice() : [];
  if (teamId && !teams.some((tm) => tm.id === teamId)) {
    const existing = teamsCache.find((tm) => tm.id === teamId);
    if (existing) teams.push(existing);
  }
  return `
    <div class="row">
      <select class="field" id="${idPrefix}-department" style="flex:1;">
        ${kostenstelleOptionsFrom(Array.from(codes), department)}
      </select>
      <select class="field" id="${idPrefix}-team" style="flex:1;">
        ${teamOptionsFrom(teams, teamId)}
      </select>
    </div>
  `;
}

// Gleiches Prinzip wie kostenstelleOptionsFrom/teamOptionsFrom, aber für
// Filter statt Pflichtfelder: erste Option heißt "Alle ..." statt einem
// leeren Platzhalter, weil bei Filtern "kein Filter" der sinnvolle Standard
// ist (nicht "bitte auswählen").
function kostenstelleFilterOptionsFrom(codes, selectedValue) {
  const options = [`<option value="" ${selectedValue ? "" : "selected"}>${t("filterAllKostenstellenOption")}</option>`];
  codes.forEach((code) => {
    const k = kostenstellenCache.find((x) => x.code === code);
    const label = k && k.name ? `${code} – ${k.name}` : code;
    options.push(`<option value="${escapeHtml(code)}" ${code === selectedValue ? "selected" : ""}>${escapeHtml(label)}</option>`);
  });
  return options.join("");
}

function teamFilterOptionsFrom(teams, selectedId) {
  const options = [`<option value="" ${selectedId ? "" : "selected"}>${t("filterAllTeamsOption")}</option>`];
  teams.forEach((tm) => {
    options.push(`<option value="${tm.id}" ${tm.id === selectedId ? "selected" : ""}>${escapeHtml(tm.name)}</option>`);
  });
  return options.join("");
}

function deptTeamFilterRow(idPrefix, activeDept, activeTeamId) {
  const codes = readableCodes();
  const teams = activeDept ? readableTeamsForCode(activeDept) : [];
  return `
    <div class="filter-select-row">
      <select class="filter-select" id="${idPrefix}-dept-filter">
        ${kostenstelleFilterOptionsFrom(codes, activeDept)}
      </select>
      <select class="filter-select" id="${idPrefix}-team-filter">
        ${teamFilterOptionsFrom(teams, activeTeamId)}
      </select>
    </div>
  `;
}

// Team-Dropdown ist von der gewählten Kostenstelle abhängig (jede
// Kostenstelle hat ihre eigene Teamliste) - bei jedem Wechsel der
// Kostenstelle die Team-Optionen neu berechnen.
function bindDepartmentTeamFields(idPrefix) {
  const deptSel = document.getElementById(`${idPrefix}-department`);
  const teamSel = document.getElementById(`${idPrefix}-team`);
  if (!deptSel || !teamSel) return;
  deptSel.addEventListener("change", () => {
    const currentTeamId = teamSel.value;
    const teams = writableTeamsForCode(deptSel.value);
    teamSel.innerHTML = teamOptionsFrom(teams, teams.some((tm) => tm.id === currentTeamId) ? currentTeamId : "");
  });
}

function readDepartmentTeam(idPrefix) {
  return {
    department: document.getElementById(`${idPrefix}-department`).value,
    teamId: document.getElementById(`${idPrefix}-team`).value || null,
  };
}

// ---------- Views ----------

// Kein offenes Self-Signup mehr (Sicherheitslücke: niemand prüfte, ob die
// registrierende Person wirklich Zugriff auf die angegebene Mailadresse
// hat). Stattdessen: Zugang per Mail/Teams beim Admin anfragen, der die
// Person über einen ihm bekannten, vertrauten Kanal identifiziert und das
// Konto danach selbst über die Supabase-Admin-API anlegt (siehe README).
function accessRequestMailto() {
  const subject = currentLang === "en" ? "Access to the Process- & AI-Usecase App" : "Zugang zur Process- & AI-Usecase App";
  const body =
    currentLang === "en"
      ? "Hi,\n\nI'd like access to the app.\n\nName: \nEmail address (for access): \nCost center(s): \nTeam(s): \n\nThanks!"
      : "Hallo,\n\nich hätte gern Zugang zur App.\n\nName: \nE-Mail-Adresse (für den Zugang): \nKostenstelle(n): \nTeam(s): \n\nDanke!";
  return "mailto:d.goos@house-of-communication.com" + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
}

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
          <a class="btn-primary" style="display:block; text-align:center; text-decoration:none;" href="${accessRequestMailto()}">${t("requestAccessMailBtn")}</a>
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
    // Bewusst kein supabase.auth.resetPasswordForEmail() hier: ohne eigenen
    // SMTP-Dienst (siehe README, "Optional für später") verschickt Supabase
    // Auth-Mails nur zuverlässig an Mitglieder der eigenen Supabase-Org, nicht
    // an beliebige Kolleg:innen - der Button würde Self-Service versprechen,
    // der bei den meisten nie ankommt. Sobald SMTP + Redirect-URLs (README
    // Schritt 4) eingerichtet sind, hier resetPasswordForEmail(email) mit
    // redirectTo auf die eigene Origin aufrufen; renderSetNewPassword() und
    // das PASSWORD_RECOVERY-Handling weiter unten sind dafür bereits fertig.
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
        ${idea.team_id ? `<span class="badge">${escapeHtml(teamName(idea.team_id))}</span>` : ""}
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
        ${teamsNavButton()}
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
      ${deptTeamFilterRow("ideafilter", activeDeptFilter, activeTeamFilter)}
      <div class="idea-list" id="idea-list">
        <div class="empty-state">${t("loadingIdeas")}</div>
      </div>
    </main>
  `;

  bindTabBar();
  bindAdminNavButton();
  bindExportNavButton();
  bindTeamsNavButton();
  bindLangToggle();
  bindThemeToggle();
  bindDepartmentTeamFields("capture");
  watchUnsavedChanges(document.querySelector(".capture-box"));

  document.getElementById("ideafilter-dept-filter").addEventListener("change", (e) => {
    activeDeptFilter = e.target.value;
    const teams = activeDeptFilter ? readableTeamsForCode(activeDeptFilter) : [];
    if (!teams.some((tm) => tm.id === activeTeamFilter)) activeTeamFilter = "";
    document.getElementById("ideafilter-team-filter").innerHTML = teamFilterOptionsFrom(teams, activeTeamFilter);
    renderIdeaList();
  });
  document.getElementById("ideafilter-team-filter").addEventListener("change", (e) => {
    activeTeamFilter = e.target.value;
    renderIdeaList();
  });
  document.getElementById("logout-btn").addEventListener("click", guardedLogout);
  document.getElementById("settings-btn").addEventListener("click", () => {
    window.location.hash = "#/settings";
  });

  document.getElementById("save-capture").addEventListener("click", async () => {
    const ta = document.getElementById("quick-note");
    const text = ta.value.trim();
    const { department, teamId } = readDepartmentTeam("capture");
    if (!text) return;
    if (!department || !teamId) {
      toast(t("departmentTeamRequiredMsg"));
      return;
    }
    const btn = document.getElementById("save-capture");
    btn.disabled = true;
    const idea = await createIdea(text, department, teamId);
    btn.disabled = false;
    if (idea) {
      ta.value = "";
      toast(t("ideaSavedMsg"));
      if (unsavedChangesReset) unsavedChangesReset();
      ideasCache = await loadIdeas();
      renderIdeaList();
    }
  });

  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      activeFilter = chip.dataset.filter;
      document.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c.dataset.filter === activeFilter));
      renderIdeaList();
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
  const filtered = heads.filter(
    (i) =>
      (activeFilter === "all" || i.status === activeFilter) &&
      (!activeDeptFilter || i.department === activeDeptFilter) &&
      (!activeTeamFilter || i.team_id === activeTeamFilter)
  );
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
  const canWrite = canWriteCombo(idea.department, idea.team_id);

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
        ${departmentTeamFields(idea.department, idea.team_id, "detail")}

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
        <label class="field-label" style="margin-top:0;">${t("toolsLabel")}</label>
        <textarea class="field" id="f-tools" placeholder="${t("toolsPlaceholder")}">${escapeHtml(idea.tools || "")}</textarea>

        <label class="field-label">${t("considerationsLabel")}</label>
        <textarea class="field" id="f-considerations" placeholder="${t("considerationsPlaceholder")}"${trReadonlyAttr(idea, "considerations")}>${escapeHtml(trValue(idea, "considerations"))}</textarea>
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

        <label class="field-label">${t("systemeLabel")}</label>
        <textarea class="field" id="f-systeme" placeholder="${t("systemePlaceholder")}">${escapeHtml(idea.systeme || "")}</textarea>

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

        <label class="field-label">${t("skillLevelLabel")}</label>
        <input class="field" id="f-skill-level" value="${escapeHtml(idea.skill_level || "")}" placeholder="${t("skillLevelPlaceholder")}" />
      </details>

      <details class="card">
        <summary style="cursor:pointer; font-size:14px; font-weight:600; color:var(--text);">${t("aiSupportTitle")}</summary>
        <p style="font-size:13.5px; color:var(--text-dim); margin:10px 0 12px; line-height:1.5;">
          ${t("aiSupportDesc")}
        </p>
        <button class="btn-secondary" id="generate-prompt-btn" style="width:100%;">${t("generatePromptBtn")}</button>

        <label class="field-label">${t("startPromptLabel")}</label>
        <textarea class="field" id="f-initial-prompt" placeholder="${t("startPromptPlaceholder")}">${escapeHtml(idea.initial_prompt || "")}</textarea>
        <div class="row">
          <button class="btn-secondary" id="copy-prompt-btn" style="width:100%;">${t("copyStartPromptBtn")}</button>
        </div>

        <label class="field-label">${t("aiResponsePasteLabel")}</label>
        <textarea class="field" id="f-ai-plan-notes" placeholder="${t("aiResponsePlaceholder")}">${escapeHtml(idea.ai_plan_notes || "")}</textarea>
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
  } else {
    watchUnsavedChanges(document.querySelector("main"));
  }

  function updatePriorityBanner() {
    const impact = Number(document.querySelector('[data-field="impact"]').value);
    const effort = Number(document.querySelector('[data-field="effort"]').value);
    const feasibility = Number(document.querySelector('[data-field="feasibility"]').value);
    const risk = Number(document.querySelector('[data-field="risk"]').value);
    const p = priorityInfo({ impact, effort, feasibility, risk });
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
      clearUnsavedChanges();
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
    const followUp = await createIdea(text.trim(), idea.department, idea.team_id, idea.process_id, idea.id);
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
    const { department, teamId } = readDepartmentTeam("detail");
    const patch = {
      status: document.getElementById("f-status").value,
      process_id: document.getElementById("f-process").value || null,
      parent_idea_id: document.getElementById("f-parent-idea").value || null,
      department,
      team_id: teamId,
      tags: document.getElementById("f-tags").value.trim(),
      impact: Number(document.querySelector('[data-field="impact"]').value),
      feasibility: Number(document.querySelector('[data-field="feasibility"]').value),
      effort: Number(document.querySelector('[data-field="effort"]').value),
      risk: Number(document.querySelector('[data-field="risk"]').value),
      tools: document.getElementById("f-tools").value.trim(),
      initial_prompt: document.getElementById("f-initial-prompt").value.trim(),
      ai_role: document.getElementById("f-ai-role").value,
      systeme: document.getElementById("f-systeme").value.trim(),
      input_source: document.getElementById("f-input-source").value.trim(),
      output_result: document.getElementById("f-output-result").value.trim(),
      kpi_kind: document.getElementById("f-kpi-kind").value,
      quantified_benefit: document.getElementById("f-quantified-benefit").value.trim(),
      list_priority: document.getElementById("f-list-priority").value,
      skill_level: document.getElementById("f-skill-level").value.trim(),
      catalog_id: document.getElementById("f-catalog-id").value.trim() || null,
      owner_name: document.getElementById("f-owner-name").value.trim(),
      ai_plan_notes: document.getElementById("f-ai-plan-notes").value.trim(),
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
    const { department, teamId } = readDepartmentTeam("detail");
    if (!department || !teamId) {
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
      if (unsavedChangesReset) unsavedChangesReset();
    }
  });

  document.getElementById("generate-prompt-btn").addEventListener("click", () => {
    const quickNote = document.getElementById("f-quick-note").value.trim();
    const problem = document.getElementById("f-problem").value.trim();
    const goal = document.getElementById("f-goal").value.trim();
    const businessBenefit = document.getElementById("f-business-benefit").value.trim();
    if (!problem || !goal || !businessBenefit) {
      toast(t("kickoffPromptRequiresFieldsMsg"));
      return;
    }
    const promptField = document.getElementById("f-initial-prompt");
    promptField.value = buildKickoffPrompt({ quick_note: quickNote, problem, goal, business_benefit: businessBenefit });
    promptField.dispatchEvent(new Event("input", { bubbles: true }));
    toast(t("kickoffPromptGeneratedMsg"));
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
        ${proc.team_id ? `<span class="badge">${escapeHtml(teamName(proc.team_id))}</span>` : ""}
        ${proc.parent ? `<span class="badge">↳ ${escapeHtml(trValue(proc.parent, "name"))}</span>` : ""}
      </div>
    </div>
  `;
}

let activeProcessFilter = "all";
let activeProcessDeptFilter = "";
let activeProcessTeamFilter = "";

async function renderProcessList() {
  $app.innerHTML = `
    <header class="topbar">
      <h1>${t("processesHeaderTitle")}</h1>
      <div class="actions">
        ${langToggleButton()}${themeToggleButton()}
        ${exportNavButton()}
        ${teamsNavButton()}
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
      ${deptTeamFilterRow("processfilter", activeProcessDeptFilter, activeProcessTeamFilter)}
      <div class="idea-list" id="process-list">
        <div class="empty-state">${t("loadingProcesses")}</div>
      </div>
    </main>
  `;

  bindTabBar();
  bindAdminNavButton();
  bindExportNavButton();
  bindTeamsNavButton();
  bindLangToggle();
  bindThemeToggle();
  bindDepartmentTeamFields("pcapture");
  watchUnsavedChanges(document.querySelector(".capture-box"));

  document.getElementById("processfilter-dept-filter").addEventListener("change", (e) => {
    activeProcessDeptFilter = e.target.value;
    const teams = activeProcessDeptFilter ? readableTeamsForCode(activeProcessDeptFilter) : [];
    if (!teams.some((tm) => tm.id === activeProcessTeamFilter)) activeProcessTeamFilter = "";
    document.getElementById("processfilter-team-filter").innerHTML = teamFilterOptionsFrom(teams, activeProcessTeamFilter);
    renderProcessListItems();
  });
  document.getElementById("processfilter-team-filter").addEventListener("change", (e) => {
    activeProcessTeamFilter = e.target.value;
    renderProcessListItems();
  });
  document.getElementById("logout-btn").addEventListener("click", guardedLogout);
  document.getElementById("settings-btn").addEventListener("click", () => {
    window.location.hash = "#/settings";
  });

  document.getElementById("save-process").addEventListener("click", async () => {
    const ta = document.getElementById("process-name");
    const text = ta.value.trim();
    const { department, teamId } = readDepartmentTeam("pcapture");
    if (!text) return;
    if (!department || !teamId) {
      toast(t("departmentTeamRequiredMsg"));
      return;
    }
    const btn = document.getElementById("save-process");
    btn.disabled = true;
    const proc = await createProcess(text, department, teamId);
    btn.disabled = false;
    if (proc) {
      ta.value = "";
      toast(t("processSavedMsg"));
      if (unsavedChangesReset) unsavedChangesReset();
      processesCache = await loadProcesses();
      renderProcessListItems();
    }
  });

  document.querySelectorAll("[data-pfilter]").forEach((chip) => {
    chip.addEventListener("click", () => {
      activeProcessFilter = chip.dataset.pfilter;
      document.querySelectorAll("[data-pfilter]").forEach((c) => c.classList.toggle("active", c.dataset.pfilter === activeProcessFilter));
      renderProcessListItems();
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
  const filtered = processesCache.filter(
    (p) =>
      (activeProcessFilter === "all" || p.status === activeProcessFilter) &&
      (!activeProcessDeptFilter || p.department === activeProcessDeptFilter) &&
      (!activeProcessTeamFilter || p.team_id === activeProcessTeamFilter)
  );
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
  const canWrite = canWriteCombo(proc.department, proc.team_id);

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
        ${departmentTeamFields(proc.department, proc.team_id, "pdetail")}

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
  } else {
    watchUnsavedChanges(document.querySelector("main"));
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
      clearUnsavedChanges();
      window.location.hash = "#/processes";
    }
  });

  document.getElementById("add-idea-btn").addEventListener("click", async () => {
    const text = prompt(t("newIdeaPrompt"));
    if (!text || !text.trim()) return;
    const idea = await createIdea(text.trim(), proc.department, proc.team_id, proc.id);
    if (idea) {
      toast(t("ideaSavedMsg"));
      ideasCache = await loadIdeas();
      window.location.hash = `#/idea/${idea.id}`;
    }
  });

  document.getElementById("add-subprocess-btn").addEventListener("click", async () => {
    const text = prompt(t("newSubProcessPrompt"));
    if (!text || !text.trim()) return;
    const sub = await createProcess(text.trim(), proc.department, proc.team_id, proc.id);
    if (sub) {
      toast(t("subProcessSavedMsg"));
      processesCache = await loadProcesses();
      window.location.hash = `#/process/${sub.id}`;
    }
  });

  document.getElementById("save-process-detail-btn").addEventListener("click", async () => {
    const { department, teamId } = readDepartmentTeam("pdetail");
    if (!department || !teamId) {
      toast(t("departmentTeamRequiredMsg"));
      return;
    }
    const btn = document.getElementById("save-process-detail-btn");
    btn.disabled = true;
    btn.textContent = t("savingBtn");
    const patch = {
      department,
      team_id: teamId,
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
      if (unsavedChangesReset) unsavedChangesReset();
    }
  });
}

// ---------- View: Settings ----------

function renderSettings() {
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
  document.getElementById("pending-logout-btn").addEventListener("click", guardedLogout);
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
  document.getElementById("error-logout-btn").addEventListener("click", guardedLogout);
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

function teamsNavButton() {
  return `<button class="icon-btn" id="teams-btn">${t("teamsNav")}</button>`;
}

function bindTeamsNavButton() {
  const btn = document.getElementById("teams-btn");
  if (btn) {
    btn.addEventListener("click", () => {
      window.location.hash = "#/teams";
    });
  }
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
    `Team: ${teamName(idea.team_id)}`,
    idea.owner_name ? `Usecase-Geber: ${idea.owner_name}` : "",
    idea.tags ? `Tags/Bucket: ${idea.tags}` : "",
    idea.ai_role ? `KI-Rolle: ${idea.ai_role}` : "",
    idea.kpi_kind ? `Kind of KPI: ${idea.kpi_kind}` : "",
    idea.list_priority ? `Priorität (Liste): ${idea.list_priority}` : "",
    idea.skill_level ? `Skill Level: ${idea.skill_level}` : "",
    section("Problem", idea.problem),
    section("Ziel", idea.goal),
    section("Business Benefit", idea.business_benefit),
    section("Tools (KI-Lösung)", idea.tools),
    section("Systeme", idea.systeme),
    section("Wichtige Gedanken vorab / Risiken", idea.considerations),
    section("Input", idea.input_source),
    section("Output", idea.output_result),
    section("Quantifizierter Nutzen", idea.quantified_benefit),
    section("Qualitativer Nutzen", idea.qualitative_benefit),
    section("Kommentar", idea.comment),
    section("Start-Prompt", idea.initial_prompt),
    section("KI-Antwort (Notiz)", idea.ai_plan_notes),
  ]
    .filter(Boolean)
    .join("\n");
}

// Exakte Spaltenreihenfolge des Excel-Katalogs (46 Spalten, A:AT). Leere
// Positionen sind Formel- ("#CONNECT!"-Übersetzung) oder Leerspalten, die
// beim Einfügen nicht überschrieben werden sollen. Brand/Agency sind für
// diesen Katalog (Group Controlling) fix. ID Nr bleibt bei buildExportRow
// (neuer Case) leer, weil die nächste freie GC-Nummer nur im Blick auf die
// aktuelle Live-Liste bestimmt werden kann; buildUpdateRow (bereits
// synchronisierter Case, siehe unten) schreibt sie dagegen mit.
function tsvField(value) {
  const v = (value || "").toString();
  return /[\t\n"]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

function baseExportCols(idea) {
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
  cols[16] = idea.systeme || ""; // Systeme
  cols[18] = idea.input_source || ""; // Input (Datenquelle)
  cols[20] = idea.output_result || ""; // Output (Datenausgabe)
  cols[22] = idea.considerations || ""; // Risks
  cols[24] = idea.list_priority || ""; // Priority
  cols[25] = idea.comment || ""; // Comment
  cols[31] = idea.kpi_kind || ""; // Kind of KPI
  cols[32] = idea.quantified_benefit || ""; // Description if Quantity
  cols[33] = idea.qualitative_benefit || ""; // Description if Quality
  cols[41] = idea.skill_level || ""; // Skill Level
  return cols;
}

function buildExportRow(idea) {
  // Neuer Case ohne Katalog-ID: ID Nr bleibt leer, die nächste freie
  // GC-Nummer bestimmt sich erst beim Einfügen aus der Live-Liste.
  return baseExportCols(idea).map(tsvField).join("\t");
}

function formatDateOnly(iso) {
  if (!iso) return "";
  // Der Katalog ist immer auf Deutsch (siehe README "Zweisprachige
  // Inhalte") - hier bewusst unabhängig vom Sprachschalter der App.
  return new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function buildUpdateRow(idea) {
  // Update-Zeile für einen bereits synchronisierten Case (hat schon eine
  // Katalog-ID): anders als bei buildExportRow wird ID Nr mitgeschrieben
  // (zur Kontrolle vor dem Überschreiben der bestehenden Zeile), und die
  // vier rechten Änderungsspalten werden zur Laufzeit befüllt - "Was wurde
  // geändert" bleibt bewusst leer (siehe Kommentar in supabase/schema.sql,
  // die Spalte wird in der Liste ohnehin von niemandem gepflegt).
  const cols = baseExportCols(idea);
  cols[0] = idea.catalog_id || ""; // ID Nr
  cols[42] = "geändert"; // Änderungsstatus
  cols[43] = (currentUser && currentUser.email) || ""; // Geändert von
  cols[44] = formatDateOnly(idea.updated_at); // Änderungsdatum
  cols[45] = ""; // Was wurde geändert
  return cols.map(tsvField).join("\t");
}

async function renderExportSync() {
  ideasCache = await loadIdeas();
  const list = ideasCache.filter((i) => !i.catalog_id);
  const updateList = ideasCache
    .filter((i) => i.catalog_id)
    .sort((a, b) => a.catalog_id.localeCompare(b.catalog_id));

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
                    ${idea.team_id ? `<span class="badge">${escapeHtml(teamName(idea.team_id))}</span>` : ""}
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

      <div class="card">
        <div class="section-title" style="margin:0 0 10px;">${t("updateExportTitle")}</div>
        <p style="font-size:13.5px; color:var(--text-dim); margin:0 0 14px; line-height:1.5;">${t("updateExportIntro")}</p>
        <p style="font-size:13px; color:var(--text); background:var(--surface-2); border-left:3px solid var(--accent); border-radius:6px; padding:10px 12px; margin:0 0 14px; line-height:1.5;">${t("updateExportFieldsNote")}</p>
        ${
          updateList.length
            ? `<div class="row">
                 <button class="btn-secondary" id="copy-all-update-tsv-btn" style="width:100%;">${t("copyUpdateTsvAllBtn")} (${updateList.length})</button>
               </div>`
            : ""
        }
      </div>
      <div class="idea-list" id="update-export-list">
        ${
          updateList.length
            ? updateList
                .map(
                  (idea) => `
                <div class="idea-item" style="cursor:default;">
                  <div class="idea-title">${escapeHtml(idea.catalog_id)} · ${escapeHtml(idea.quick_note)}</div>
                  <div class="idea-meta">
                    <span class="badge status-${idea.status}">${t(`status_${idea.status}`)}</span>
                    ${idea.team_id ? `<span class="badge">${escapeHtml(teamName(idea.team_id))}</span>` : ""}
                  </div>
                  <div class="row" style="margin-top:10px;">
                    <button class="btn-secondary" data-copy-update-tsv-one="${idea.id}" style="width:100%;">${t("copyUpdateTsvOneBtn")}</button>
                  </div>
                </div>
              `
                )
                .join("")
            : `<div class="empty-state">${t("updateExportEmpty")}</div>`
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

  document.querySelectorAll("[data-copy-update-tsv-one]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idea = updateList.find((i) => i.id === btn.dataset.copyUpdateTsvOne);
      copyText(buildUpdateRow(idea));
    });
  });

  const copyAllUpdateTsvBtn = document.getElementById("copy-all-update-tsv-btn");
  if (copyAllUpdateTsvBtn) {
    copyAllUpdateTsvBtn.addEventListener("click", () => {
      copyText(updateList.map(buildUpdateRow).join("\n"));
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
  teamsCache = await loadTeams();
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
                  ? [{ id: "", label: t("allTeamsScope") }, ...teamsCache.filter((tm) => tm.kostenstelle_code === k.code).map((tm) => ({ id: tm.id, label: tm.name }))]
                      .map(
                        (scope) => `
                      <div style="margin-bottom:14px;">
                        <div style="font-size:12px; color:var(--text-dim); margin-bottom:6px;">${escapeHtml(scope.label)}</div>
                        ${nonAdminApproved
                          .map((u) => {
                            const grant = accessCache.find(
                              (a) =>
                                a.user_id === u.id &&
                                a.kostenstelle_code === k.code &&
                                (scope.id ? a.team_id === scope.id : a.team_id === null)
                            );
                            return `
                          <div class="row" style="justify-content:space-between; align-items:center; margin-bottom:8px;">
                            <span style="font-size:13.5px;">${escapeHtml(u.email)}</span>
                            <select class="field" data-access-user="${u.id}" data-access-ks="${escapeHtml(k.code)}" data-access-team="${escapeHtml(scope.id)}" style="max-width:220px; flex:none;">
                              ${accessLevelOptions(grant ? grant.access_level : "")}
                            </select>
                          </div>
                        `;
                          })
                          .join("")}
                      </div>
                    `
                      )
                      .join("")
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
      const teamId = sel.dataset.accessTeam || null;
      const level = sel.value || null;
      sel.disabled = true;
      const ok = await setKostenstelleAccess(userId, code, teamId, level);
      sel.disabled = false;
      if (ok) {
        toast(t("accessSavedMsg"));
        accessCache = await loadAllAccess();
      }
    });
  });
}

// ---------- View: Teams verwalten ----------
// Anders als die Kostenstellen selbst (nur der Admin legt sie an) dürfen
// Teams auch von Personen mit Vollzugriff (Schreiben, alle Teams) auf die
// jeweilige Kostenstelle verwaltet werden, siehe can_manage_teams() in
// supabase/schema.sql. Diese Ansicht ist deshalb bewusst nicht
// admin-gated - jede freigegebene Person sieht die Teams ihrer
// Kostenstellen, Bearbeiten-Kontrollen erscheinen nur, wo canManageTeams()
// zutrifft (die RLS-Policy ist die eigentliche Absicherung dahinter).
async function renderTeamsManagement() {
  if (kostenstellenCache.length === 0) kostenstellenCache = await loadKostenstellen();
  teamsCache = await loadTeams();
  const codes = readableCodes();
  const visible = currentProfile.is_admin ? kostenstellenCache : kostenstellenCache.filter((k) => codes.includes(k.code));

  $app.innerHTML = `
    <header class="topbar">
      <div class="back-row">
        <button class="icon-btn" id="back-btn">${t("backBtn")}</button>
      </div>
      ${langToggleButton()}${themeToggleButton()}
    </header>
    <main>
      <div class="section-title" style="margin:0 4px 8px;">${t("teamsManagementTitle")}</div>
      ${
        visible.length
          ? visible
              .map((k) => {
                const canManage = canManageTeams(k.code);
                const kTeams = teamsCache.filter((tm) => tm.kostenstelle_code === k.code);
                return `
            <div class="card">
              <div class="section-title" style="margin:0 0 10px;">${escapeHtml(k.code)}${k.name ? ` – ${escapeHtml(k.name)}` : ""}</div>
              ${
                kTeams.length
                  ? kTeams
                      .map(
                        (tm) => `
                    <div class="row" style="justify-content:space-between; align-items:center; margin-bottom:8px;">
                      <span style="font-size:13.5px;">${escapeHtml(tm.name)}</span>
                      ${
                        canManage
                          ? `
                        <div class="row" style="gap:6px; flex:0 0 auto;">
                          <button class="btn-secondary" data-rename-team="${tm.id}" style="padding:6px 10px; font-size:12.5px;">${t("renameTeamBtn")}</button>
                          <button class="btn-danger" data-delete-team="${tm.id}" style="padding:6px 10px; font-size:12.5px;">${t("deleteTeamBtn")}</button>
                        </div>
                      `
                          : ""
                      }
                    </div>
                  `
                      )
                      .join("")
                  : `<div class="empty-state" style="padding:12px 4px;">${t("emptyTeamsForKostenstelle")}</div>`
              }
              ${
                canManage
                  ? `
                <div class="row" style="margin-top:10px;">
                  <input class="field" data-new-team-input="${escapeHtml(k.code)}" placeholder="${t("newTeamNamePlaceholder")}" style="flex:1;" />
                  <button class="btn-primary" data-add-team="${escapeHtml(k.code)}" style="flex:0 0 auto;">${t("addTeamBtn")}</button>
                </div>
              `
                  : ""
              }
            </div>
          `;
              })
              .join("")
          : `<div class="empty-state">${t("noKostenstellenAccessMsg")}</div>`
      }
    </main>
  `;

  document.getElementById("back-btn").addEventListener("click", () => {
    window.location.hash = "";
  });
  bindLangToggle();
  bindThemeToggle();

  document.querySelectorAll("[data-add-team]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const code = btn.dataset.addTeam;
      const input = document.querySelector(`[data-new-team-input="${code}"]`);
      const name = input.value.trim();
      if (!name) return;
      btn.disabled = true;
      const created = await createTeam(code, name);
      btn.disabled = false;
      if (created) {
        toast(t("teamSavedMsg"));
        await renderTeamsManagement();
      }
    });
  });

  document.querySelectorAll("[data-rename-team]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.renameTeam;
      const current = teamsCache.find((tm) => tm.id === id);
      const name = prompt(t("renameTeamPrompt"), current ? current.name : "");
      if (!name || !name.trim()) return;
      btn.disabled = true;
      const updated = await renameTeam(id, name.trim());
      btn.disabled = false;
      if (updated) {
        toast(t("teamSavedMsg"));
        await renderTeamsManagement();
      }
    });
  });

  document.querySelectorAll("[data-delete-team]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!window.confirm(t("deleteTeamConfirm"))) return;
      const id = btn.dataset.deleteTeam;
      btn.disabled = true;
      const ok = await deleteTeam(id);
      btn.disabled = false;
      if (ok) {
        toast(t("teamDeletedMsg"));
        await renderTeamsManagement();
      }
    });
  });
}

// ---------- View: Dashboard (Auswertungen) ----------

let dashDept = "all";
let dashTeam = "all";
let dashSelectedCell = null;
let dashExpandedTreeIds = new Set();
let dashRankingShowAll = false;

function groupByKey(arr, key) {
  const map = {};
  arr.forEach((item) => {
    const k = item[key] || "—";
    (map[k] = map[k] || []).push(item);
  });
  return map;
}

function dashboardDepartments() {
  const set = new Set();
  ideasCache.forEach((i) => i.department && set.add(i.department));
  processesCache.forEach((p) => p.department && set.add(p.department));
  return Array.from(set).sort();
}

function dashboardTeamsForDept(dept) {
  const ids = new Set();
  ideasCache.forEach((i) => {
    if (dept === "all" || i.department === dept) i.team_id && ids.add(i.team_id);
  });
  processesCache.forEach((p) => {
    if (dept === "all" || p.department === dept) p.team_id && ids.add(p.team_id);
  });
  return Array.from(ids)
    .map((id) => teamsCache.find((tm) => tm.id === id))
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name));
}

function dashboardFilteredIdeas() {
  return ideasCache.filter(
    (i) => (dashDept === "all" || i.department === dashDept) && (dashTeam === "all" || i.team_id === dashTeam)
  );
}

function dashboardFilteredProcesses() {
  return processesCache.filter(
    (p) => (dashDept === "all" || p.department === dashDept) && (dashTeam === "all" || p.team_id === dashTeam)
  );
}

function dashCard(title, bodyHtml) {
  return `<div class="card"><div class="section-title" style="margin:0 0 10px;">${title}</div>${bodyHtml}</div>`;
}

function dashLegendHtml(items) {
  return `<div class="dash-legend">${items
    .map((it) => `<span class="dash-legend-item"><span class="dash-legend-dot" style="background:${it.color}"></span>${it.label}</span>`)
    .join("")}</div>`;
}

function priorityZoneLegendHtml() {
  const zones = [
    { impact: 5, effort: 1 },
    { impact: 5, effort: 5 },
    { impact: 1, effort: 1 },
    { impact: 1, effort: 5 },
    { impact: 3, effort: 3 },
  ];
  return dashLegendHtml(zones.map((z) => priorityInfo(z)));
}

function statusLegendHtml(statuses = STATUS_ORDER) {
  return dashLegendHtml(statuses.map((s) => ({ color: `var(--status-${s})`, label: t(`status_${s}`) })));
}

function majorityStatus(ideasInCell) {
  const counts = {};
  ideasInCell.forEach((i) => {
    counts[i.status] = (counts[i.status] || 0) + 1;
  });
  let best = STATUS_ORDER[0];
  let bestCount = -1;
  STATUS_ORDER.forEach((s) => {
    if ((counts[s] || 0) > bestCount) {
      bestCount = counts[s] || 0;
      best = s;
    }
  });
  return best;
}

function dashboardFiltersHtml() {
  const depts = dashboardDepartments();
  const teams = dashboardTeamsForDept(dashDept);
  return `
    <div class="row dash-filters">
      <select class="field" id="dash-dept" style="flex:1;">
        <option value="all" ${dashDept === "all" ? "selected" : ""}>${t("dashFilterAllDept")}</option>
        ${depts.map((d) => `<option value="${escapeHtml(d)}" ${d === dashDept ? "selected" : ""}>${escapeHtml(d)}</option>`).join("")}
      </select>
      <select class="field" id="dash-team" style="flex:1;">
        <option value="all" ${dashTeam === "all" ? "selected" : ""}>${t("dashFilterAllTeam")}</option>
        ${teams.map((tm) => `<option value="${tm.id}" ${tm.id === dashTeam ? "selected" : ""}>${escapeHtml(tm.name)}</option>`).join("")}
      </select>
    </div>
  `;
}

function bindDashboardFilters() {
  document.getElementById("dash-dept").addEventListener("change", (e) => {
    dashDept = e.target.value;
    dashTeam = "all";
    renderDashboardBody();
  });
  document.getElementById("dash-team").addEventListener("change", (e) => {
    dashTeam = e.target.value;
    renderDashboardBody();
  });
}

function dashboardMatrixSection(ideas) {
  const active = ideas.filter((i) => i.status !== "discarded");
  const discardedCount = ideas.length - active.length;
  if (active.length === 0) {
    return dashCard(t("dashMatrixTitle"), `<div class="empty-state">${t("dashMatrixEmpty")}</div>`);
  }

  const CELL = 50;
  const PAD_L = 22;
  const PAD_T = 8;
  const PAD_B = 8;
  const PAD_R = 8;
  const plot = CELL * 5;
  const W = PAD_L + plot + PAD_R;
  const H = PAD_T + plot + PAD_B;

  const cellsHtml = [];
  const bubblesHtml = [];
  for (let impact = 1; impact <= 5; impact++) {
    for (let effort = 1; effort <= 5; effort++) {
      const x = PAD_L + (effort - 1) * CELL;
      const y = PAD_T + (5 - impact) * CELL;
      const zoneColor = priorityInfo({ impact, effort }).color;
      cellsHtml.push(
        `<rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" fill="${zoneColor}" fill-opacity="0.14" stroke="var(--border)" stroke-width="0.5" />`
      );
      const cellIdeas = active.filter((i) => (i.impact || 3) === impact && (i.effort || 3) === effort);
      if (cellIdeas.length > 0) {
        const cx = x + CELL / 2;
        const cy = y + CELL / 2;
        const r = Math.min(21, 9 + Math.sqrt(cellIdeas.length) * 5);
        const majority = majorityStatus(cellIdeas);
        const isSelected = dashSelectedCell === `${effort}-${impact}`;
        bubblesHtml.push(`
          <g class="dash-matrix-bubble" data-effort="${effort}" data-impact="${impact}">
            <circle cx="${cx}" cy="${cy}" r="${r}" fill="var(--status-${majority})" stroke="${isSelected ? "var(--text)" : "var(--surface)"}" stroke-width="${isSelected ? 3 : 2}" />
            <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="700" fill="#fff">${cellIdeas.length}</text>
          </g>
        `);
      }
    }
  }

  const axisImpact = [1, 2, 3, 4, 5]
    .map((v) => `<text x="${PAD_L - 6}" y="${PAD_T + (5 - v) * CELL + CELL / 2 + 4}" text-anchor="end" font-size="10" fill="var(--text-dim)">${v}</text>`)
    .join("");
  const axisEffort = [1, 2, 3, 4, 5]
    .map((v) => `<text x="${PAD_L + (v - 1) * CELL + CELL / 2}" y="${H - 2}" text-anchor="middle" font-size="10" fill="var(--text-dim)">${v}</text>`)
    .join("");

  const svg = `
    <svg viewBox="0 0 ${W} ${H}" class="dash-matrix-svg">
      ${cellsHtml.join("")}
      ${bubblesHtml.join("")}
      ${axisImpact}
      ${axisEffort}
    </svg>
    <div class="dash-axis-caption">${t("dashAxisCaption")}</div>
  `;

  let detail = "";
  if (dashSelectedCell) {
    const [selEffort, selImpact] = dashSelectedCell.split("-").map(Number);
    const selected = active.filter((i) => (i.effort || 3) === selEffort && (i.impact || 3) === selImpact);
    detail = `
      <div class="dash-matrix-detail">
        <div class="dash-matrix-detail-head">
          <span>${selected.length} ${t("dashMatrixCellLabel")}</span>
          <button class="btn-ghost" id="dash-matrix-close">✕</button>
        </div>
        ${selected
          .map(
            (i) =>
              `<a class="link-item" href="#/idea/${i.id}">${i.catalog_id ? `<span class="badge">🏷 ${escapeHtml(i.catalog_id)}</span> ` : ""}${escapeHtml(trValue(i, "quick_note"))}</a>`
          )
          .join("")}
      </div>
    `;
  }

  return dashCard(
    t("dashMatrixTitle"),
    priorityZoneLegendHtml() +
      svg +
      statusLegendHtml(STATUS_ORDER.filter((s) => s !== "discarded")) +
      (discardedCount > 0 ? `<div class="dash-hint">${t("dashMatrixDiscardedHint").replace("{n}", discardedCount)}</div>` : "") +
      detail
  );
}

function bindDashboardMatrix() {
  document.querySelectorAll(".dash-matrix-bubble").forEach((el) => {
    el.addEventListener("click", () => {
      const key = `${el.dataset.effort}-${el.dataset.impact}`;
      dashSelectedCell = dashSelectedCell === key ? null : key;
      renderDashboardBody();
    });
  });
  const closeBtn = document.getElementById("dash-matrix-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      dashSelectedCell = null;
      renderDashboardBody();
    });
  }
}

function dashIdeaLeafHtml(idea) {
  return `
    <div class="tree-node">
      <div class="tree-row">
        <span class="tree-toggle-spacer"></span>
        <div class="tree-row-content">
          <a class="link-item dash-tree-leaf" href="#/idea/${idea.id}">
            <span class="dash-legend-dot" style="background:var(--status-${idea.status})"></span>
            ${idea.catalog_id ? `<span class="badge">🏷 ${escapeHtml(idea.catalog_id)}</span> ` : ""}${escapeHtml(trValue(idea, "quick_note"))}
          </a>
        </div>
      </div>
    </div>
  `;
}

function dashProcessNodeHtml(proc, teamProcesses, ideas) {
  const children = teamProcesses.filter((p) => p.parent_process_id === proc.id);
  const linkedIdeas = ideas.filter((i) => i.process_id === proc.id);
  const hasChildren = children.length > 0 || linkedIdeas.length > 0;
  const key = `p-${proc.id}`;
  const isExpanded = dashExpandedTreeIds.has(key);
  const ai = aiPotentialInfo(proc.ai_potential);
  return `
    <div class="tree-node">
      <div class="tree-row">
        ${
          hasChildren
            ? `<button class="tree-toggle" data-dash-toggle="${key}">${isExpanded ? "▾" : "▸"}</button>`
            : `<span class="tree-toggle-spacer"></span>`
        }
        <div class="tree-row-content">
          <a class="link-item dash-tree-process" href="#/process/${proc.id}">
            <span class="priority-dot" style="background:${ai.color}"></span>
            ${escapeHtml(trValue(proc, "name"))}
            <span class="badge">${linkedIdeas.length} 💡</span>
          </a>
        </div>
      </div>
      ${
        hasChildren && isExpanded
          ? `<div class="tree-children">
              ${children.map((c) => dashProcessNodeHtml(c, teamProcesses, ideas)).join("")}
              ${linkedIdeas.map((i) => dashIdeaLeafHtml(i)).join("")}
            </div>`
          : ""
      }
    </div>
  `;
}

function dashboardTreeSection(ideas, processes) {
  if (processes.length === 0) {
    return dashCard(t("dashTreeTitle"), `<div class="empty-state">${t("dashTreeEmpty")}</div>`);
  }
  const byDept = groupByKey(processes, "department");
  const body = Object.keys(byDept)
    .sort()
    .map((dept) => {
      const deptProcesses = byDept[dept];
      const byTeam = groupByKey(deptProcesses, "team_id");
      const teamsHtml = Object.keys(byTeam)
        .map((team) => ({ key: team, label: team === "—" ? "—" : teamName(team) }))
        .sort((a, b) => a.label.localeCompare(b.label))
        .map(({ key: team, label }) => {
          const teamProcesses = byTeam[team];
          const idsInTeam = new Set(teamProcesses.map((p) => p.id));
          const roots = teamProcesses.filter((p) => !p.parent_process_id || !idsInTeam.has(p.parent_process_id));
          return `
            <div class="dash-tree-team">
              <div class="dash-tree-team-title">${escapeHtml(label)}</div>
              ${roots.map((p) => dashProcessNodeHtml(p, teamProcesses, ideas)).join("")}
            </div>
          `;
        })
        .join("");
      return `
        <div class="dash-tree-dept">
          <div class="dash-tree-dept-title">${escapeHtml(dept)}</div>
          ${teamsHtml}
        </div>
      `;
    })
    .join("");
  return dashCard(t("dashTreeTitle"), body);
}

function bindDashboardTree() {
  document.querySelectorAll("[data-dash-toggle]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      const key = btn.dataset.dashToggle;
      if (dashExpandedTreeIds.has(key)) dashExpandedTreeIds.delete(key);
      else dashExpandedTreeIds.add(key);
      renderDashboardBody();
    });
  });
}

function dashboardStatusSection(ideas) {
  if (ideas.length === 0) {
    return dashCard(t("dashStatusTitle"), `<div class="empty-state">${t("dashStatusEmpty")}</div>`);
  }
  const byTeam = groupByKey(ideas, "team_id");
  const rows = Object.keys(byTeam)
    .map((team) => ({ key: team, label: team === "—" ? "—" : teamName(team) }))
    .sort((a, b) => a.label.localeCompare(b.label))
    .map(({ key: team, label }) => {
      const teamIdeas = byTeam[team];
      const total = teamIdeas.length;
      const segments = STATUS_ORDER.map((s) => {
        const count = teamIdeas.filter((i) => i.status === s).length;
        if (count === 0) return "";
        const pct = (count / total) * 100;
        return `<div class="dash-bar-seg" style="width:${pct}%; background:var(--status-${s});" title="${escapeHtml(t(`status_${s}`))}: ${count}"></div>`;
      }).join("");
      return `
        <div class="dash-bar-row">
          <div class="dash-bar-label">${escapeHtml(label)} <span class="dash-bar-total">(${total})</span></div>
          <div class="dash-bar-track">${segments}</div>
        </div>
      `;
    })
    .join("");
  return dashCard(t("dashStatusTitle"), statusLegendHtml() + rows);
}

function dashboardHeatmapSection(processes) {
  if (processes.length === 0) {
    return dashCard(t("dashHeatmapTitle"), `<div class="empty-state">${t("dashHeatmapEmpty")}</div>`);
  }
  const sorted = [...processes].sort((a, b) => (b.ai_potential || 3) - (a.ai_potential || 3));
  const tiles = sorted
    .map((p) => {
      const level = Math.min(5, Math.max(1, p.ai_potential || 3));
      return `
        <a class="dash-heat-tile heat-${level}" href="#/process/${p.id}">
          <span class="dash-heat-name">${escapeHtml(trValue(p, "name"))}</span>
          <span class="dash-heat-value">${level}</span>
        </a>
      `;
    })
    .join("");
  return dashCard(t("dashHeatmapTitle"), `<div class="dash-heat-grid">${tiles}</div>`);
}

function dashMeter(label, value) {
  const v = value || 3;
  return `
    <span class="dash-meter" title="${escapeHtml(label)}: ${v}/5">
      <span class="dash-meter-label">${escapeHtml(label)}</span>
      <span class="dash-meter-track"><span class="dash-meter-fill" style="width:${v * 20}%"></span></span>
    </span>
  `;
}

function dashboardRankingSection(ideas) {
  const active = ideas.filter((i) => i.status !== "done" && i.status !== "discarded");
  if (active.length === 0) {
    return dashCard(t("dashRankingTitle"), `<div class="empty-state">${t("dashRankingEmpty")}</div>`);
  }
  const ranked = [...active].sort((a, b) => {
    return ideaScore(b) - ideaScore(a) || (b.impact || 3) - (a.impact || 3);
  });
  const shown = dashRankingShowAll ? ranked : ranked.slice(0, 8);
  const rows = shown
    .map(
      (idea, idx) => `
        <a class="dash-rank-row" href="#/idea/${idea.id}">
          <span class="dash-rank-num">${idx + 1}</span>
          <span class="dash-rank-body">
            <span class="dash-rank-title">${idea.catalog_id ? `<span class="badge">🏷 ${escapeHtml(idea.catalog_id)}</span> ` : ""}${escapeHtml(trValue(idea, "quick_note"))}</span>
            <span class="dash-rank-meters">
              ${dashMeter(t("impactLabel"), idea.impact)}
              ${dashMeter(t("effortLabel"), idea.effort)}
              ${dashMeter(t("feasibilityLabel"), idea.feasibility)}
              ${dashMeter(t("riskLabel"), idea.risk)}
            </span>
          </span>
        </a>
      `
    )
    .join("");
  const toggle =
    ranked.length > 8
      ? `<button class="btn-ghost" id="dash-rank-toggle">${dashRankingShowAll ? t("dashShowLess") : t("dashShowMore")}</button>`
      : "";
  return dashCard(t("dashRankingTitle"), rows + toggle);
}

function bindDashboardRanking() {
  const btn = document.getElementById("dash-rank-toggle");
  if (btn) {
    btn.addEventListener("click", () => {
      dashRankingShowAll = !dashRankingShowAll;
      renderDashboardBody();
    });
  }
}

function dashFormatDay(dayStr) {
  return new Date(`${dayStr}T00:00:00`).toLocaleDateString(currentLang === "en" ? "en-GB" : "de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

function dashboardTimelineSection(ideas, processes) {
  if (ideas.length === 0 && processes.length === 0) {
    return dashCard(t("dashTimelineTitle"), `<div class="empty-state">${t("dashTimelineEmpty")}</div>`);
  }
  const dayKey = (iso) => iso.slice(0, 10);
  const ideaDays = ideas.map((i) => dayKey(i.created_at)).sort();
  const procDays = processes.map((p) => dayKey(p.created_at)).sort();
  const allDays = Array.from(new Set([...ideaDays, ...procDays])).sort();

  function cumulative(sortedDays) {
    let idx = 0;
    return allDays.map((d) => {
      while (idx < sortedDays.length && sortedDays[idx] <= d) idx++;
      return idx;
    });
  }
  const ideaCum = cumulative(ideaDays);
  const procCum = cumulative(procDays);
  const maxVal = Math.max(1, ideaCum[ideaCum.length - 1] || 0, procCum[procCum.length - 1] || 0);

  const W = 300;
  const H = 140;
  const PAD_L = 26;
  const PAD_T = 10;
  const PAD_B = 10;
  const PAD_R = 6;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;
  const stepX = allDays.length > 1 ? plotW / (allDays.length - 1) : 0;

  function pathFor(cum) {
    return cum
      .map((v, idx) => {
        const x = PAD_L + idx * stepX;
        const y = PAD_T + plotH - (v / maxVal) * plotH;
        return `${idx === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }

  const svg = `
    <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" class="dash-timeline-svg">
      <line x1="${PAD_L}" y1="${PAD_T}" x2="${PAD_L}" y2="${PAD_T + plotH}" stroke="var(--border)" stroke-width="1" />
      <line x1="${PAD_L}" y1="${PAD_T + plotH}" x2="${PAD_L + plotW}" y2="${PAD_T + plotH}" stroke="var(--border)" stroke-width="1" />
      <path d="${pathFor(ideaCum)}" fill="none" stroke="var(--accent)" stroke-width="2" />
      <path d="${pathFor(procCum)}" fill="none" stroke="var(--accent-2)" stroke-width="2" />
      <text x="2" y="${PAD_T + 4}" font-size="9" fill="var(--text-dim)">${maxVal}</text>
      <text x="${PAD_L}" y="${H - 1}" font-size="9" fill="var(--text-dim)">${escapeHtml(dashFormatDay(allDays[0]))}</text>
      <text x="${PAD_L + plotW}" y="${H - 1}" font-size="9" fill="var(--text-dim)" text-anchor="end">${escapeHtml(dashFormatDay(allDays[allDays.length - 1]))}</text>
    </svg>
  `;

  const legend = `
    <div class="dash-legend">
      <span class="dash-legend-item"><span class="dash-legend-dot" style="background:var(--accent)"></span>${t("ideasTab")}</span>
      <span class="dash-legend-item"><span class="dash-legend-dot" style="background:var(--accent-2)"></span>${t("processesTab")}</span>
    </div>
  `;

  return dashCard(t("dashTimelineTitle"), svg + legend);
}

function renderDashboardBody() {
  const el = document.getElementById("dash-body");
  if (!el) return;
  const ideas = dashboardFilteredIdeas();
  const processes = dashboardFilteredProcesses();
  el.innerHTML = `
    ${dashboardFiltersHtml()}
    ${dashboardMatrixSection(ideas)}
    ${dashboardTreeSection(ideas, processes)}
    ${dashboardStatusSection(ideas)}
    ${dashboardHeatmapSection(processes)}
    ${dashboardRankingSection(ideas)}
    ${dashboardTimelineSection(ideas, processes)}
  `;
  bindDashboardFilters();
  bindDashboardMatrix();
  bindDashboardTree();
  bindDashboardRanking();
}

async function renderDashboard() {
  $app.innerHTML = `
    <header class="topbar">
      <h1>${t("dashboardHeaderTitle")}</h1>
      <div class="actions">
        ${langToggleButton()}${themeToggleButton()}
        ${exportNavButton()}
        ${teamsNavButton()}
        ${onboardingNavButton()}
        ${adminNavButton()}
        <button class="icon-btn" id="settings-btn">⚙</button>
        <button class="icon-btn" id="logout-btn">${t("logoutBtn")}</button>
      </div>
    </header>
    <main>
      ${tabBar("dashboard")}
      <div id="dash-body">
        <div class="empty-state">${t("loadingIdeas")}</div>
      </div>
    </main>
  `;

  bindTabBar();
  bindAdminNavButton();
  bindExportNavButton();
  bindTeamsNavButton();
  bindLangToggle();
  bindThemeToggle();
  document.getElementById("logout-btn").addEventListener("click", guardedLogout);
  document.getElementById("settings-btn").addEventListener("click", () => {
    window.location.hash = "#/settings";
  });

  ideasCache = await loadIdeas();
  processesCache = await loadProcesses();
  renderDashboardBody();
}

async function render() {
  lastRenderedHash = window.location.hash;
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
    teamsCache = await loadTeams();
    myGrants = await loadMyGrants();
  }
  const route = currentRoute();
  if (route.view === "idea-detail") {
    await renderDetail(route.id);
  } else if (route.view === "process-list") {
    await renderProcessList();
  } else if (route.view === "process-detail") {
    await renderProcessDetail(route.id);
  } else if (route.view === "dashboard") {
    await renderDashboard();
  } else if (route.view === "settings") {
    renderSettings();
  } else if (route.view === "admin" && currentProfile.is_admin) {
    await renderAdmin();
  } else if (route.view === "export") {
    await renderExportSync();
  } else if (route.view === "teams") {
    await renderTeamsManagement();
  } else {
    await renderList();
  }
}

init();
