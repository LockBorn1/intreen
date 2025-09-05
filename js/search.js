// search.js
import { ace_tools } from '/js/unused.js'; // placeholder to avoid empty module warning (not used)

function getParam(name) {
  const u = new URL(location.href);
  return u.searchParams.get(name) || '';
}

const siteResults = document.getElementById('site-results');
const siteEmpty = document.getElementById('site-empty');
const eventResults = document.getElementById('event-results');
const eventEmpty = document.getElementById('event-empty');

async function searchSite(q) {
  const res = await fetch('/search-index.json', { cache: 'no-store' });
  const index = await res.json();
  q = q.toLowerCase();
  const results = index.filter(item =>
    item.title.toLowerCase().includes(q) ||
    (item.content && item.content.toLowerCase().includes(q))
  ).slice(0, 50);
  renderSite(results, q);
}

function renderSite(items, q) {
  siteResults.innerHTML = '';
  if (!items.length) {
    siteEmpty.textContent = 'No matching pages.';
    return;
  }
  siteEmpty.textContent = '';
  for (const it of items) {
    const card = document.createElement('article');
    card.className = 'rounded-2xl bg-white border border-slate-200 shadow-sm p-4';
    card.innerHTML = `
      <h3 class="font-bold text-lg mb-1"><a class="underline" href="${it.url}">${it.title}</a></h3>
      <p class="text-sm text-slate-700 line-clamp-3">${highlight(it.content || '', q)}</p>
    `;
    siteResults.appendChild(card);
  }
}

function highlight(text, q) {
  const i = text.toLowerCase().indexOf(q);
  if (i === -1) return text.slice(0, 240) + (text.length > 240 ? '…' : '');
  const start = Math.max(0, i - 60), end = Math.min(text.length, i + 180);
  const snippet = text.slice(start, end);
  return snippet.replace(new RegExp(q, 'ig'), (m) => `<mark>${m}</mark>`) + (end < text.length ? '…' : '');
}

async function searchEvents(q) {
  const res = await fetch('/api/events/list?q=' + encodeURIComponent(q));
  const data = await res.json();
  const items = data.events || [];
  renderEvents(items);
}

function renderEvents(items) {
  eventResults.innerHTML = '';
  if (!items.length) {
    eventEmpty.textContent = 'No matching events.';
    return;
  }
  eventEmpty.textContent = '';
  for (const ev of items) {
    const card = document.createElement('article');
    card.className = 'rounded-2xl bg-white border border-slate-200 shadow-sm p-4';
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
    eventResults.appendChild(card);
  }
}

const params = new URLSearchParams(location.search);
const q = params.get('q') || '';
document.getElementById('site-search-input')?.setAttribute('value', q);
searchSite(q);
searchEvents(q);
