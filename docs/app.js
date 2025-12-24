/* =========================
   1.) GLOBAL APP STATE
========================= */
const appState = {
  player: {
    playerId: null,
    surname: null,
    personId: null,
    displayName: null,
    hasAgreedToRules: false
  },
  ui: {
    currentScreen: 'loading'
  }
};

/* =========================
   2.) STORAGE HELPERS
   A: Storage Keys
========================= */
const STORAGE_KEYS = {
  playerId: 'mcq_playerId',
  surname: 'mcq_surname',
  rulesOk: 'mcq_rules_ok',
  personId: 'mcq_personId'
};

/* =========================
   2.) STORAGE HELPERS
   B: Get/Set Helpers
========================= */
function getStored(key) {
  return localStorage.getItem(key);
}

function setStored(key, value) {
  localStorage.setItem(key, value);
}

/* =========================
   2.) STORAGE HELPERS
   C: Family Data (placeholder)
========================= */
const FAMILY_BY_SURNAME = {
  Meyers: [
    { personId: 'meyers_mark', displayName: 'Grandpa Mars' },
    { personId: 'meyers_veronica', displayName: 'Granny Mars' }
  ],
  Mueting: [
    { personId: 'mueting_sarah', displayName: 'Aunt Sarah' },
    { personId: 'mueting_isaac', displayName: 'Isaac' },
    { personId: 'mueting_greyson', displayName: 'Greyson' },
    { personId: 'mueting_peyton', displayName: 'Peyton' },
    { personId: 'mueting_kaiden', displayName: 'Kaiden' }
  ],
  Meybell: [
    { personId: 'meybell_uncle_mark', displayName: 'Uncle Mark' },
    { personId: 'meybell_uncle_larry', displayName: 'Uncle Larry' }
  ],
  Brase: [
    { personId: 'brase_barbara', displayName: 'Aunt Barbara' },
    { personId: 'brase_craig',   displayName: 'Uncle Craig' },
    { personId: 'brase_cyrus',   displayName: 'Cyrus' },
    { personId: 'brase_xavier',  displayName: 'Xavier' },
    { personId: 'brase_aurora',  displayName: 'Aurora' }

  ],
  Tryon: [
    { personId: 'tryon_david',     displayName: 'Uncle David' },
    { personId: 'tryon_christina', displayName: 'Aunt Christina' },
    { personId: 'tryon_nori',      displayName: 'Nori' },
    { personId: 'tryon_edward',    displayName: 'Edward' }
  ]
};

/* =========================
   2.) STORAGE HELPERS
   D: Reset Helpers (UAT) 2:25 a.m.
========================= */
function resetAppData() {
  localStorage.removeItem(STORAGE_KEYS.playerId);
  localStorage.removeItem(STORAGE_KEYS.surname);
  localStorage.removeItem(STORAGE_KEYS.rulesOk);
  localStorage.removeItem(STORAGE_KEYS.personId);

  // Optional: in case anything else ever lands here
  // localStorage.clear();
  // sessionStorage.clear();

  window.location.reload();
}

/* =========================
   2.) STORAGE HELPERS
   E: Section Definitions (Tiles)
========================= */
const SECTIONS = [
  { id: 'A', title: 'Speech Bubble Photo Props', screen: 'section-a' },
  { id: 'B', title: 'Most Likely To…',           screen: 'section-b' },
  { id: 'C', title: 'Traditions & Memory',       screen: 'section-c' },
  { id: 'D', title: 'Draw / Sketch',             screen: 'section-d' },
  { id: 'E', title: 'Quistmas Quiplash',         screen: 'section-e' }
];


/* =========================
   2.) CONTENT
   A: Speech Bubble Prompt Bank
========================= */
const SECTION_A_PROMPTS = [
  "Not the helper you want, but the helper you have",
  "Naughty / Nice / Tried My Best",
  "That sounds dangerous. What time?",
  "Santa knows what I did",
  "You better watch out! Yeah that’s a threat",
  "My favorite Christmas tradition is ___",
  "This year I’m grateful for ___",
  "This year I’m most proud of myself for ___",
  "In my own world",
  "Not mad, just gaming",
  "STIMMIN’ FOR THE HOLIDAYS",
  "Overstim’d",
  "Dual-screening like a pro",
  "Unmedicated and making it everyone’s problem",
  "Here to rizz ’em with the ’tism",
  "(I have) 80 HD",
  "I’m shaky - send sugar!",
  "Cookies for dinner",
  "I’m about to show you guys the dark side of egg nog",
  "Texas Roadhouse roll count: ___",
  "My other ride is ___",
  "Ask me about my ___",
  "Powered by ___ and ___",
  "YAAHAA! YOU FOUND ME! (draw your favorite Korok)",
  "Cookie count: ___",
  "Naughty 😈 or Nice 😇"
];

/* =========================
   2.) STORAGE HELPERS
   F: Section Data Helpers (JSON)
========================= */
STORAGE_KEYS.sectionA = 'mcq_section_a';

function getStoredJSON(key, fallback) {
  const raw = getStored(key);
  if (!raw) return fallback;
  try { return JSON.parse(raw); } catch { return fallback; }
}

function setStoredJSON(key, value) {
  setStored(key, JSON.stringify(value));
}

/* =========================
   3.) PLAYER ID
   A: Ensure we have one
========================= */

function ensurePlayerId() {
  let id = getStored(STORAGE_KEYS.playerId);

  if (!id) {
    if (window.crypto && typeof crypto.randomUUID === 'function') {
      id = crypto.randomUUID();
    } else {
      id = `mcq_${Math.random().toString(16).slice(2)}`;
    }

    setStored(STORAGE_KEYS.playerId, id);
  }

  appState.player.playerId = id;
}

/* =========================
   4.) ROUTING
   A: Navigate
========================= */
function navigate(screenId) {
  appState.ui.currentScreen = screenId;
  renderScreen(screenId);
}

/* =========================
   5.) SCREEN RENDERER
   A: Landing
========================= */
function renderLanding(appContent) {
  const surnames = ['Meyers', 'Mueting', 'Meybell', 'Brase', 'Tryon'];

  appContent.innerHTML = `
    <section class="screen screen--landing">
      <h1>Christmas HQ</h1>
      <p>What’s your last name?</p>

      <div class="surname-grid">
        ${surnames
          .map((name) => `<button class="btn btn--tile" data-surname="${name}">${name}</button>`)
          .join('')}
      </div>
    </section>
  `;

  // Bind surname buttons
  document.querySelectorAll('[data-surname]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const surname = e.currentTarget.dataset.surname;

      appState.player.surname = surname;
      setStored(STORAGE_KEYS.surname, surname);

      navigate('rules');
    });
  });
}

/* =========================
   5.) SCREEN RENDERER
   B: House Rules (TOU) 2:20am
========================= */
function renderRules(appContent) {
  appContent.innerHTML = `
    <section class="screen screen--rules">
      <h1>House Rules</h1>
      <p class="muted">(How We Keep This Fun)</p>

      <ul class="rules-list">
        <li>You can pass or recuse yourself on any prompt — no questions, no consequences.</li>
        <li>Be charitable in your responses; if you’re named, assume it’s coming from a place of love.</li>
        <li>Be sensitive to little ears (PG-13 energy).</li>
        <li>No shade or digs — be funny, not Grinchy.</li>
      </ul>

      <div class="rules-actions" style="margin-top:16px;">
        <button class="btn btn--primary" id="rules-agree">I Agree</button>
        <button class="btn btn--ghost" id="rules-decline">Decline</button>
      </div>
    </section>
  `;

  document.getElementById('rules-agree').addEventListener('click', () => {
    appState.player.hasAgreedToRules = true;
    setStored(STORAGE_KEYS.rulesOk, 'true');
    navigate('family');
  });

  document.getElementById('rules-decline').addEventListener('click', () => {
    alert('😈 Krampus says: try again.');
  });
}

/* =========================
   5.) DASHBOARD HELPERS
   A: Progress Status (MVP)
========================= */
function getSectionAStatus() {
  const raw = getStored(STORAGE_KEYS.sectionA);
  if (!raw) return { label: 'Not started', tone: 'neutral', icon: '' };

  const defaultData = { selectedPromptIds: [], customPrompts: [], writerChoice: 'self' };
  const data = getStoredJSON(STORAGE_KEYS.sectionA, defaultData);

  const hasPrompt = Array.isArray(data.selectedPromptIds) && data.selectedPromptIds.length > 0;
  const hasCustom = Array.isArray(data.customPrompts) && data.customPrompts.some(v => String(v).trim().length > 0);
  const isComplete = hasPrompt || hasCustom;

  if (isComplete) return { label: 'Complete', tone: 'good', icon: '✓' };
  return { label: 'In progress', tone: 'warn', icon: '•' };
}

function renderTileStatus(status) {
  const badge = status.icon
    ? `<span class="tile__badge tile__badge--${status.tone}">${status.icon}</span>`
    : '';
  return `${badge}${status.label}`;
}

function getTileStatusForScreen(screen) {
  if (screen === 'section-a') return getSectionAStatus();
  return { label: 'Not started', tone: 'neutral', icon: '' };
}

/* =========================
   5.) SCREEN RENDERER
   C: Dashboard (Tiles)
========================= */
function renderDashboard(appContent) {
  const surname = appState.player.surname || 'friend';
  const personId = appState.player.personId || null;

  // Find display name (optional but nice)
  let displayName = appState.player.displayName;
  if (!displayName && personId) {
    const list = FAMILY_BY_SURNAME[surname] || [];
    const match = list.find(p => p.personId === personId);
    displayName = match ? match.displayName : null;
  }

  const sectionStatuses = Object.fromEntries(
    SECTIONS.map(s => [s.screen, getTileStatusForScreen(s.screen)])
  );

  appContent.innerHTML = `
    <section class="screen screen--dashboard">
      <h1>Welcome${displayName ? `, ${displayName}` : ''}!</h1>
      <p class="muted">Pick a section. We’ll save as you go.</p>

      <div class="tile-grid">
        ${SECTIONS.map(s => `
          <button class="tile" data-screen="${s.screen}" type="button">
            <div class="tile__kicker">${s.id}.</div>
            <div class="tile__title">${s.title}</div>
            <div class="tile__status">${renderTileStatus(sectionStatuses[s.screen])}</div>
          </button>
        `).join('')}
      </div>

      <div class="rules-actions" style="margin-top:16px;">
        <button class="btn btn--ghost" id="go-family" type="button">Change Person</button>
        <button class="btn btn--ghost" id="reset-app" type="button">Reset</button>
      </div>
    </section>
  `;

  // Tile navigation
  document.querySelectorAll('[data-screen]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      navigate(e.currentTarget.dataset.screen);
    });
  });

  document.getElementById('go-family').addEventListener('click', () => navigate('family'));
  document.getElementById('reset-app').addEventListener('click', resetAppData);
}

/* =========================
   5.) SCREEN RENDERER
   D: Family Picker (names now, photos later)
========================= */
function renderFamilyPicker(appContent) {
  const surname = appState.player.surname;
  const list = FAMILY_BY_SURNAME[surname] || [];
  
  appContent.innerHTML = `
    <section class="screen screen--family">
      <h1>Who are you?</h1>
      <p class="muted">Pick your name (photos coming later).</p>

      <div class="family-grid">
        ${list.map(p => `
          <button
            class="btn btn--tile"
            data-person-id="${p.personId}"
            type="button"
          >
            ${p.displayName}
          </button>
        `).join('')}
      </div>

      <div class="rules-actions" style="margin-top:16px;">
        <button class="btn btn--ghost" id="back-to-dashboard" type="button">
          Back
        </button>
        <button class="btn btn--ghost" id="reset-app" type="button">
          Reset
        </button>
      </div>
    </section>
  `;

  /* -------- Bind person selection -------- */
  document.querySelectorAll('[data-person-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const personId = e.currentTarget.dataset.personId;
      appState.player.personId = personId;
      appState.player.displayName = e.currentTarget.textContent.trim();
      setStored(STORAGE_KEYS.personId, personId);
      navigate('dashboard');
    });
  });

  /* -------- Bind Back -------- */
  const backBtn = document.getElementById('back-to-dashboard');
  if (backBtn) {
    backBtn.addEventListener('click', () => navigate('dashboard'));
  }

  /* -------- Bind Reset (UAT helper) -------- */
  const resetBtn = document.getElementById('reset-app');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetAppData);
  }
}

/* =========================
   5.) SCREEN RENDERER
   E: Section Screens (Placeholders)
========================= */
function renderSectionPlaceholder(appContent, sectionId, title) {
  appContent.innerHTML = `
    <section class="screen screen--section">
      <h1>${sectionId}. ${title}</h1>
      <p class="muted">Placeholder screen ✅</p>

      <div class="rules-actions" style="margin-top:16px;">
        <button class="btn btn--ghost" id="back-to-dashboard" type="button">
          Back to Dashboard
        </button>
      </div>
    </section>
  `;

  const back = document.getElementById('back-to-dashboard');
  if (back) back.addEventListener('click', () => navigate('dashboard'));
}

/* =========================
   5.) SCREEN RENDERER
   E: Section A (Speech Bubble Photo Props)
========================= */
function renderSectionA(appContent) {
  const defaultData = {
    selectedPromptIds: [],     // array of string ids
    customPrompts: [],         // array of strings (max 3)
    writerChoice: 'self'       // 'self' | 'uncle_mark'
  };

  let data = getStoredJSON(STORAGE_KEYS.sectionA, defaultData);

  // Build IDs for prompt bank (stable)
  const promptItems = SECTION_A_PROMPTS.map((text, idx) => ({
    id: `a_${idx}`,
    text
  }));

  appContent.innerHTML = `
    <section class="screen screen--section">
      <div class="section-head">
        <h1>A. Speech Bubble Photo Props</h1>
        <p class="muted">
          Soft-claim the ones you like. We’ll use this to curate ideas for the photo prop.
        </p>
      </div>

      <div class="card">
        <h2 class="h2">Who should write the sign?</h2>
        <label class="radio-row">
          <input type="radio" name="writerChoice" value="self" ${data.writerChoice === 'self' ? 'checked' : ''}/>
          <span>I will draw / write it myself</span>
        </label>
        <label class="radio-row">
          <input type="radio" name="writerChoice" value="uncle_mark" ${data.writerChoice === 'uncle_mark' ? 'checked' : ''}/>
          <span>I would like (Uncle) Mark Allen to do it</span>
        </label>
      </div>

      <div class="card">
        <div class="card__title-row">
          <h2 class="h2">Prompt ideas</h2>
          <button class="btn btn--ghost" id="a-clear" type="button">Clear selections</button>
        </div>

        <div class="prompt-list">
          ${promptItems.map(p => {
            const checked = data.selectedPromptIds.includes(p.id) ? 'checked' : '';
            return `
              <label class="prompt-row">
                <input type="checkbox" data-prompt-id="${p.id}" ${checked}/>
                <span>${p.text}</span>
              </label>
            `;
          }).join('')}
        </div>
      </div>

      <div class="card">
        <div class="card__title-row">
          <h2 class="h2">Add up to 3 custom prompts</h2>
          <button class="btn btn--primary" id="a-add-custom" type="button">+ Add</button>
        </div>

        <div id="a-custom-wrap" class="custom-wrap">
          ${data.customPrompts.map((val, i) => `
            <div class="custom-row">
              <input class="input" type="text" maxlength="80" data-custom-index="${i}" value="${escapeHtml(val)}" />
              <button class="btn btn--ghost" data-remove-custom="${i}" type="button">Remove</button>
            </div>
          `).join('')}
        </div>

        <p class="muted small">Tip: keep it short so it fits on the sign.</p>
      </div>

      <div class="rules-actions" style="margin-top:16px;">
        <button class="btn btn--ghost" id="back-to-dashboard" type="button">Back to Dashboard</button>
      </div>
    </section>
  `;

  // --- helpers (screen-scoped) ---
  function save(next) {
    data = next;
    setStoredJSON(STORAGE_KEYS.sectionA, next);
  }

  // Writer choice
  document.querySelectorAll('input[name="writerChoice"]').forEach(r => {
    r.addEventListener('change', (e) => {
      const next = { ...data, writerChoice: e.target.value };
      save(next);
    });
  });

  // Checkbox selections
  document.querySelectorAll('[data-prompt-id]').forEach(cb => {
    cb.addEventListener('change', (e) => {
      const id = e.target.dataset.promptId;
      const selected = new Set(data.selectedPromptIds);

      if (e.target.checked) selected.add(id);
      else selected.delete(id);

      const next = { ...data, selectedPromptIds: Array.from(selected) };
      save(next);
    });
  });

  // Clear selections
  document.getElementById('a-clear').addEventListener('click', () => {
    const next = { ...data, selectedPromptIds: [] };
    save(next);
    navigate('section-a'); // re-render cleanly
  });

  // Add custom (max 3)
  document.getElementById('a-add-custom').addEventListener('click', () => {
    if (data.customPrompts.length >= 3) {
      alert('Max 3 custom prompts 🙂');
      return;
    }
    const next = { ...data, customPrompts: [...data.customPrompts, ''] };
    save(next);
    navigate('section-a');
  });

  // Edit custom prompt
  document.querySelectorAll('[data-custom-index]').forEach(input => {
    input.addEventListener('input', (e) => {
      const idx = Number(e.target.dataset.customIndex);
      const copy = [...data.customPrompts];
      copy[idx] = e.target.value;
      const next = { ...data, customPrompts: copy };
      save(next);
    });
  });

  // Remove custom
  document.querySelectorAll('[data-remove-custom]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = Number(e.currentTarget.dataset.removeCustom);
      const copy = data.customPrompts.filter((_, i) => i !== idx);
      const next = { ...data, customPrompts: copy };
      save(next);
      navigate('section-a');
    });
  });

  // Back
  document.getElementById('back-to-dashboard').addEventListener('click', () => navigate('dashboard'));
}

function renderSectionB(appContent) { return renderSectionPlaceholder(appContent, 'B', 'Most Likely To…'); }
function renderSectionC(appContent) { return renderSectionPlaceholder(appContent, 'C', 'Traditions & Memory'); }
function renderSectionD(appContent) { return renderSectionPlaceholder(appContent, 'D', 'Draw / Sketch'); }
function renderSectionE(appContent) { return renderSectionPlaceholder(appContent, 'E', 'Quistmas Quiplash'); }

/* =========================
   5.) SCREEN RENDERER
   Z: Tiny HTML Escaper
========================= */
function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

/* =========================
   BASIC ROUTER
========================= */
function renderScreen(screenId) {
  const appContent = document.getElementById('app-content');
  appState.ui.currentScreen = screenId;

  if (screenId === 'landing') return renderLanding(appContent);
  if (screenId === 'rules') return renderRules(appContent);
  if (screenId === 'family') return renderFamilyPicker(appContent);
  if (screenId === 'dashboard') return renderDashboard(appContent);

  // Sections A–E
  if (screenId === 'section-a') return renderSectionA(appContent);
  if (screenId === 'section-b') return renderSectionB(appContent);
  if (screenId === 'section-c') return renderSectionC(appContent);
  if (screenId === 'section-d') return renderSectionD(appContent);
  if (screenId === 'section-e') return renderSectionE(appContent);

  // Fallback
  appContent.innerHTML = `
    <section class="screen screen--${screenId}">
      <h1>${screenId}</h1>
      <p>This screen is not built yet.</p>
    </section>
  `;
}

/* =========================
   6.) INIT
   A: Restore lightweight local state
========================= */
function restoreFromStorage() {
  const savedSurname = getStored(STORAGE_KEYS.surname);
  const rulesOk = getStored(STORAGE_KEYS.rulesOk) === 'true';
  const savedPersonId = getStored(STORAGE_KEYS.personId);

  if (savedSurname) appState.player.surname = savedSurname;
  if (rulesOk) appState.player.hasAgreedToRules = true;
  if (savedPersonId) appState.player.personId = savedPersonId;
}

/* =========================
   6.) INIT
   B: Choose first screen
========================= */
function getStartScreen() {
  if (!appState.player.surname) return 'landing';
  if (!appState.player.hasAgreedToRules) return 'rules';
  if (!appState.player.personId) return 'family';
  return 'dashboard';
}

/* =========================
   INIT
========================= */
function initApp() {
  console.log('🎄 Meyers Christmas HQ booting…');

  ensurePlayerId();
  restoreFromStorage();

  // Boot into the best next step
  const start = getStartScreen();
  renderScreen(start);
}

document.addEventListener('DOMContentLoaded', initApp);