// main.js
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const STEP_MS = prefersReduced ? 250 : 300;
const ANIM_MS = prefersReduced ? 0 : 600;

document.documentElement.style.setProperty('--step-ms', STEP_MS);
document.documentElement.style.setProperty('--anim-ms', ANIM_MS);

const wordsStack = document.getElementById('words-stack');
if (wordsStack) {
  // duplicate last to create loop
  const children = Array.from(wordsStack.children);
  children.forEach(el => el.style.height = '4rem');
  let idx = 0;
  setInterval(() => {
    idx = (idx + 1) % children.length;
    const offset = -idx * (children[0].offsetHeight + 8); // 8px gap
    wordsStack.style.transform = `translateY(${offset}px)`;
  }, STEP_MS + ANIM_MS);
}

// Search form (navbar)
const siteSearchForm = document.getElementById('site-search-form');
if (siteSearchForm) {
  siteSearchForm.addEventListener('submit', (e) => {
    // allow normal navigation to search.html
  });
}

// Demo login/logout visibility for static site
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');

function updateAuthButtons() {
  const isLoggedIn = localStorage.getItem('intreen_isLoggedIn') === 'true' || document.cookie.includes('admin=1');
  if (loginBtn) loginBtn.classList.toggle('hide', isLoggedIn);
  if (logoutBtn) logoutBtn.classList.toggle('hide', !isLoggedIn);
}

if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    // Demo only: set a dummy flag. Replace with your real auth later.
    localStorage.setItem('intreen_isLoggedIn', 'true');
    updateAuthButtons();
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('intreen_isLoggedIn');
    // Also clear admin cookie by hitting the API
    fetch('/api/admin/logout').finally(() => updateAuthButtons());
  });
}

updateAuthButtons();
