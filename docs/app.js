/* =========================
   GLOBAL APP STATE
========================= */
const appState = {
  player: {
    playerId: null,
    surname: null,
    personId: null,
    hasAgreedToRules: false
  },
  ui: {
    currentScreen: 'loading'
  }
};

/* =========================
   BASIC ROUTER
========================= */
function renderScreen(screenId) {
  const appContent = document.getElementById('app-content');
  appState.ui.currentScreen = screenId;

  // Temporary screen rendering
  appContent.innerHTML = `
    <section class="screen screen--${screenId}">
      <h1>${screenId}</h1>
      <p>This screen is not built yet.</p>
    </section>
  `;
}

/* =========================
   INIT
========================= */
function initApp() {
  console.log('🎄 Meyers Christmas HQ booting…');

  // Temporary boot screen
  setTimeout(() => {
    renderScreen('landing');
  }, 500);
}

document.addEventListener('DOMContentLoaded', initApp);
