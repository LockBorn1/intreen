// admin.js
const loginForm = document.getElementById('admin-login-form');
const loginStatus = document.getElementById('admin-login-status');
const pendingSection = document.getElementById('pending-section');
const pendingList = document.getElementById('pending-list');
const pendingEmpty = document.getElementById('pending-empty');
const adminLogoutBtn = document.getElementById('admin-logout');

async function refreshPending() {
  const res = await fetch('/api/events/list?status=pending');
  const data = await res.json();
  const items = data.events || [];
  pendingList.innerHTML = '';
  if (!items.length) {
    pendingEmpty.textContent = 'Nothing pending right now.';
  } else {
    pendingEmpty.textContent = '';
  }
  for (const ev of items) {
    const card = document.createElement('article');
    card.className = 'rounded-2xl bg-white border border-slate-200 shadow-sm p-4';
    card.innerHTML = `
      <h3 class="font-bold text-lg mb-1">${ev.title}</h3>
      <div class="text-sm text-slate-600 mb-2">${ev.location || ''}</div>
      <div class="text-sm text-slate-700 mb-3">${ev.date ? new Date(ev.date).toLocaleString() : ''}</div>
      <p class="text-sm text-slate-700 mb-3 whitespace-pre-wrap">${ev.description || ''}</p>
      <div class="flex gap-2">
        <button data-id="${ev.id}" data-act="approve" class="px-3 py-2 rounded-xl bg-emerald-600 text-white">Approve</button>
        <button data-id="${ev.id}" data-act="reject" class="px-3 py-2 rounded-xl bg-rose-600 text-white">Reject</button>
      </div>
    `;
    pendingList.appendChild(card);
  }
}

document.getElementById('refresh-pending')?.addEventListener('click', refreshPending);

pendingList?.addEventListener('click', async (e) => {
  const btn = e.target.closest('button[data-id]');
  if (!btn) return;
  const id = btn.getAttribute('data-id');
  const act = btn.getAttribute('data-act');
  const res = await fetch('/api/events/moderate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, action: act }),
  });
  const out = await res.json();
  if (!res.ok) {
    alert(out.error || 'Failed');
    return;
  }
  refreshPending();
});

loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const password = document.getElementById('admin-password').value;
  loginStatus.textContent = 'Signing in...';
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const out = await res.json();
    if (!res.ok) throw new Error(out.error || 'Login failed');
    loginStatus.textContent = 'Signed in!';
    pendingSection.classList.remove('hidden');
    adminLogoutBtn.classList.remove('hidden');
    refreshPending();
  } catch (err) {
    loginStatus.textContent = 'Error: ' + err.message;
  }
});

adminLogoutBtn?.addEventListener('click', async () => {
  await fetch('/api/admin/logout');
  location.reload();
});
