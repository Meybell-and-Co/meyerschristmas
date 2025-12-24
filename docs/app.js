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
  rulesOk: 'mcq_rules_ok'
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
   3.) PLAYER ID
   A: Ensure we have one
========================= */
function ensurePlayerId() {
  let id = getStored(STORAGE_KEYS.playerId);

  if (!id) {
    // crypto.randomUUID() is widely supported; fallback is fine for our needs.
    id = (crypto?.randomUUID?.() || `mcq_${Math.random().toString(16).slice(2)}`);
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
   B: House Rules (TOU)
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

      <div class="rules-actions">
        <button class="btn btn--primary" id="rules-agree">I Agree</button>
        <button class="btn btn--ghost" id="rules-decline">Decline</button>
      </div>
    </section>
  `;

  document.getElementById('rules-agree').addEventListener('click', () => {
    appState.player.hasAgreedToRules = true;
    setStored(STORAGE_KEYS.rulesOk, 'true');

    // Next screen placeholder (we’ll add Family Picker next)
    navigate('dashboard');
  });

  document.getElementById('rules-decline').addEventListener('click', () => {
    // Placeholder for Krampus modal later
    alert('😈 Krampus says: try again.');
  });
}

/* =========================
   5.) SCREEN RENDERER
   C: Dashboard (Placeholder)
========================= */
function renderDashboard(appContent) {
  const surname = appState.player.surname || 'friend';

  appContent.innerHTML = `
    <section class="screen screen--dashboard">
      <h1>Welcome, ${surname}!</h1>
      <p>Next up: choose your family member (photo picker), then sections A–E.</p>

      <div class="callout">
        <strong>Status:</strong> base routing is working ✅
      </div>

      <div class="rules-actions" style="margin-top: 16px;">
        <button class="btn btn--tile" id="go-landing">Back to Landing</button>
      </div>
    </section>
  `;

  document.getElementById('go-landing').addEventListener('click', () => {
    navigate('landing');
  });
}

/* =========================
   BASIC ROUTER
========================= */
function renderScreen(screenId) {
  const appContent = document.getElementById('app-content');
  appState.ui.currentScreen = screenId;

  // Screen switch
  if (screenId === 'landing') return renderLanding(appContent);
  if (screenId === 'rules') return renderRules(appContent);
  if (screenId === 'dashboard') return renderDashboard(appContent);

  // Fallback (kept from your original scaffold)
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

  if (savedSurname) appState.player.surname = savedSurname;
  if (rulesOk) appState.player.hasAgreedToRules = true;
}

/* =========================
   6.) INIT
   B: Choose first screen
========================= */
function getStartScreen() {
  // If they already agreed to rules, skip the TOU gate
  if (appState.player.surname && !appState.player.hasAgreedToRules) return 'rules';
  if (appState.player.surname && appState.player.hasAgreedToRules) return 'dashboard';
  return 'landing';
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
