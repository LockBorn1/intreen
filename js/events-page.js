// events-page.js
const listEl = document.getElementById('events-list');
const emptyEl = document.getElementById('events-empty');
const qInput = document.getElementById('events-search');
const sourceSelect = document.getElementById('source-filter');
let cache = [];

async function fetchEvents() {
  const q = qInput?.value?.trim() || '';
  const source = sourceSelect?.value || 'all';
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (source !== 'all') params.set('source', source);
  const res = await fetch(`/api/events/list?${params.toString()}`);
  const data = await res.json();
  cache = data.events || [];
  render();
}

function render() {
  listEl.innerHTML = '';
  if (!cache.length) {
    emptyEl.textContent = 'No events found.';
    return;
  }
  emptyEl.textContent = '';
  for (const ev of cache) {
    const card = document.createElement('article');
    card.className = 'rounded-2xl bg-white border border-slate-200 shadow-sm p-4 flex flex-col';
    card.innerHTML = `
      <div class="text-xs uppercase tracking-wide text-slate-500 mb-1">${ev.source || 'Community'}</div>
      <h3 class="font-bold text-lg mb-1">${ev.title}</h3>
      <div class="text-sm text-slate-600 mb-2">${ev.location || ''}</div>
      <div class="text-sm text-slate-700 mb-3">${ev.date ? new Date(ev.date).toLocaleString() : (ev.date_text || '')}</div>
      <p class="text-sm text-slate-700 line-clamp-3">${ev.description || ''}</p>
      <div class="mt-auto pt-3">
        ${ev.url ? `<a class="text-sky-700 underline" href="${ev.url}" target="_blank" rel="noopener">Details</a>` : ''}
      </div>
    `;
    listEl.appendChild(card);
  }
}

document.getElementById('event-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  const payload = {
    title: data.title?.toString().trim(),
    datetime: data.datetime,
    location: data.location?.toString().trim(),
    url: data.url?.toString().trim() || null,
    description: data.description?.toString().trim(),
    image: data.image?.toString().trim() || null,
  };
  const statusEl = document.getElementById('form-status');
  statusEl.textContent = 'Submitting...';
  try {
    const res = await fetch('/api/events/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const out = await res.json();
    if (!res.ok) throw new Error(out.error || 'Failed');
    statusEl.textContent = 'Submitted! Pending admin approval.';
    (e.target).reset();
  } catch (err) {
    statusEl.textContent = 'Error: ' + err.message;
  }
});

qInput?.addEventListener('input', () => fetchEvents());
sourceSelect?.addEventListener('change', () => fetchEvents());
fetchEvents();
