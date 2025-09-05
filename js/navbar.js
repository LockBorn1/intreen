// js/navbar.js
import { isLoggedIn } from './auth.js';

const NAV_ITEMS = [
  { href: '/index.html', label: 'Home' },
  { href: '/e-learning.html', label: 'E-Learning' },
  { href: '/job-post.html', label: 'Job Post' },
  { href: '/events.html', label: 'Events' },
  { href: '/affiliates.html', label: 'Affiliates' },
  { href: '/business-listing.html', label: 'Business Listing' },
  { href: '/status.html', label: 'Status' },
  { href: '/games.html', label: 'Games' },
  { href: '/register-vendor.html', label: 'Register As Vendor' },
  { href: '/about.html', label: 'About' }
];

export default function renderNavbar(activePath = location.pathname) {
  const header = document.getElementById('site-navbar');
  if (!header) return;
  const loggedIn = isLoggedIn();
  const isAdmin = document.cookie.includes('admin=1');

  const linkHtml = NAV_ITEMS.map(item => {
    const active = activePath.endsWith(item.href) || (activePath === '/' && item.href === '/index.html');
    return `<a href="${item.href}" class="group relative px-3 py-2 rounded-lg text-white/90 hover:text-white transition ${active ? 'font-semibold' : ''}">
      ${item.label}
      <span class="pointer-events-none absolute left-3 right-3 -bottom-0.5 h-0.5 scale-x-0 group-hover:scale-x-100 bg-white/90 transition-transform origin-left"></span>
    </a>`;
  }).join('');

  header.innerHTML = `
    <div class="w-full bg-blue-700 text-white">
      <div class="max-w-7xl mx-auto grid grid-cols-3 items-center gap-3 px-4 py-3">
        <!-- Left: Logo -->
        <a href="/index.html" class="flex items-center gap-3">
          <img src="/img/logo.webp" alt="Intreen" class="h-9 w-auto">
        </a>
        <!-- Center: Search -->
        <form id="site-search-form" class="hidden md:flex items-center justify-center" action="/search.html" method="GET">
          <input name="q" id="site-search-input" type="search" placeholder="Search the whole site"
                 class="w-full max-w-xl px-4 py-2 rounded-full text-slate-900 placeholder-slate-500 border border-white/20 shadow-inner focus:outline-none">
        </form>
        <!-- Right: Auth + Admin + Hamburger -->
        <div class="flex items-center gap-2 justify-end">
          <a href="/admin.html" id="admin-link" class="px-3 py-2 rounded-xl border border-amber-300 text-amber-100 hover:bg-amber-500/20 ${isAdmin ? '' : 'hidden'}">Admin</a>
          <button id="login-btn" class="px-3 py-2 rounded-xl border border-white/30 text-white hover:bg-white/10 ${loggedIn ? 'hidden' : ''}">Sign In</button>
          <button id="logout-btn" class="px-3 py-2 rounded-xl border border-white/30 text-white hover:bg-white/10 ${loggedIn ? '' : 'hidden'}">Logout</button>
          <button id="hamburger" class="md:hidden p-2 border border-white/30 rounded-lg" aria-label="Open menu">☰</button>
        </div>
      </div>
      <!-- Desktop links -->
      <div class="hidden md:block">
        <div class="max-w-7xl mx-auto px-4 py-2 flex flex-wrap gap-2">
          ${linkHtml}
        </div>
      </div>
      <!-- Mobile drawer -->
      <div id="mobile-drawer" class="md:hidden hidden border-t border-white/10">
        <div class="px-4 py-3 flex flex-col gap-2">
          ${NAV_ITEMS.map(i => `<a href="${i.href}" class="px-3 py-2 rounded-lg text-white/90 hover:bg-white/10">${i.label}</a>`).join('')}
        </div>
      </div>
    </div>
  `;

  // Wire up auth demo buttons
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  loginBtn?.addEventListener('click', () => { location.href = '/sign-in.html'; });
  logoutBtn?.addEventListener('click', () => { localStorage.removeItem('intreen_isLoggedIn'); fetch('/api/admin/logout').finally(() => location.reload()); });

  // Mobile drawer
  const ham = document.getElementById('hamburger');
  const drawer = document.getElementById('mobile-drawer');
  ham?.addEventListener('click', () => drawer?.classList.toggle('hidden'));
}
