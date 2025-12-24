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

  appContent.innerHTML = `
    <section class="screen screen--dashboard">
      <h1>Welcome${displayName ? `, ${displayName}` : ''}!</h1>
      <p class="muted">Pick a section. We’ll save as you go.</p>

      <div class="tile-grid">
        ${SECTIONS.map(s => `
          <button class="tile" data-screen="${s.screen}" type="button">
            <div class="tile__kicker">${s.id}.</div>
            <div class="tile__title">${s.title}</div>
            <div class="tile__status">Not started</div>
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

function renderSectionA(appContent) { return renderSectionPlaceholder(appContent, 'A', 'Speech Bubble Photo Props'); }
function renderSectionB(appContent) { return renderSectionPlaceholder(appContent, 'B', 'Most Likely To…'); }
function renderSectionC(appContent) { return renderSectionPlaceholder(appContent, 'C', 'Traditions & Memory'); }
function renderSectionD(appContent) { return renderSectionPlaceholder(appContent, 'D', 'Draw / Sketch'); }
function renderSectionE(appContent) { return renderSectionPlaceholder(appContent, 'E', 'Quistmas Quiplash'); }

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
