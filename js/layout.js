// js/layout.js
import renderNavbar from './navbar.js';

export function renderFooter() {
  const f = document.getElementById('site-footer');
  if (!f) return;
  f.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 py-8 text-center text-white">
      <div class="flex items-center justify-center gap-2">
        <img src="/img/logo.webp" alt="Intreen" class="h-6 w-auto">
        <span>Intreen © 2025 All rights reserved.</span>
      </div>
    </div>
  `;
}

export function bootLayout() {
  renderNavbar();
  renderFooter();
}
