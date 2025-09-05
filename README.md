# Intreen Static Site + Vercel API

This is a static HTML/JS site with serverless API routes on Vercel to:
- Show **Logout** only when logged in (client-side flag or admin cookie).
- **Search** the whole site (client-side search index generated at build).
- **Events** page:
  - Pulls curated events from **CaribbeanEvents.com** (scraped server-side).
  - Accepts user-submitted events (stored in Postgres) and shows them **after admin approval**.

> NOTE: Scraping third-party pages is best-effort and may break if the site changes. Consider asking for an official API or RSS if available.

## 1) Local quick start

```bash
# 1) Install deps for the API functions
npm i

# 2) Generate search index (build step)
npm run build

# 3) (Optional) Run a local server if you like, or just open index.html
# For Vercel, you can test with:
#   npm i -g vercel
#   vercel dev
```

## 2) Provision Vercel + Postgres

1. Create a new Vercel project and import this repo.
2. In **Vercel → Storage → Postgres**, click **Create** (free tier).  
3. In **Project → Settings → Environment Variables** add:
   - `POSTGRES_URL`  (auto from Vercel Postgres — use the pooled connection URL if offered)
   - `ADMIN_SECRET`  (set your admin password for moderation)
4. Re-deploy. The first call to the API will auto-create the `events` table.

## 3) Deploy

```bash
# Initialize a new repo if needed
git init
git add .
git commit -m "Intreen static + API"
# Replace with your GitHub remote
git branch -M main
git remote add origin YOUR_GITHUB_REMOTE_URL
git push -u origin main

# On Vercel: "New Project" → import from GitHub → set env vars → Deploy.
```

## 4) How to use

### Logout visibility
- The navbar toggles visibility based on **localStorage** key `intreen_isLoggedIn` or an **admin cookie** (`admin=1`).
- Click **Login (demo)** to simulate login (sets the flag). Click **Logout** to clear.

> If you use a real auth provider later (e.g., Firebase Auth), replace the demo lines in `js/main.js` and call `updateAuthButtons()` on auth changes.

### Whole-site search
- Build step `npm run build` creates `/search-index.json` from your HTML files.
- `search.html` loads this index client-side and shows matching pages.
- It also queries `/api/events/list?q=` to include matching events.

### Events
- **Submit** an event on `/events.html`. It is saved with `status='pending'`.
- The Events list shows:
  - Approved **community** events (from Postgres).
  - Curated events **scraped** from CaribbeanEvents.com.

### Admin moderation
1. Visit `/admin.html`.
2. Enter the password you set in `ADMIN_SECRET`. This sets a short-lived HttpOnly cookie.
3. Approve/Reject pending events.

### API routes
- `POST /api/events/add` – body: `{ title, description, datetime, location, url?, image? }`
- `GET  /api/events/list?q=&source=all|intreen|carib&status=pending`  
  (Only `status=pending` requires admin cookie.)
- `POST /api/events/moderate` – body: `{ id, action: "approve"|"reject" }` (admin only)
- `POST /api/admin/login` – body: `{ password }` (sets `admin=1` cookie)
- `GET  /api/admin/logout` – clears cookie

## 5) Notes
- **CORS** is enabled permissively on API endpoints to make local testing easy.
- **Security**: Don’t expose `ADMIN_SECRET` anywhere in client code. Only use `/admin.html` to sign in, which stores an **HttpOnly** cookie.
- **Scraper**: We parse the events archive page at `https://caribbeanevents.com/event/`. If it changes, update `api/_lib/ce-scraper.js` selectors.
- **Accessibility**: Animations respect `prefers-reduced-motion`.

## 6) Troubleshooting
- If `/api/events/list` fails, verify:
  - `POSTGRES_URL` is set and valid.
  - The Postgres database exists and is reachable from Vercel.
- If Caribbean events are empty, the upstream page may be slow or updated; try again or adjust selectors in `ce-scraper.js`.
