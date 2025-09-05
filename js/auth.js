// auth.js
export function isLoggedIn() {
  return localStorage.getItem('intreen_isLoggedIn') === 'true' || document.cookie.includes('admin=1');
}

export function toggleAuthUI() {
  const logout = document.getElementById('logout-btn');
  if (logout) {
    logout.classList.toggle('hidden', !isLoggedIn());
    logout.addEventListener('click', () => {
      localStorage.removeItem('intreen_isLoggedIn');
      fetch('/api/admin/logout').finally(() => location.reload());
    });
  }
  const adminLink = document.getElementById('admin-link');
  if (adminLink) {
    adminLink.hidden = !document.cookie.includes('admin=1');
  }
}
