// api/_lib/db.js
import { sql } from '@vercel/postgres';

export async function ensureTables() {
  await sql`CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    location TEXT NOT NULL,
    url TEXT,
    image TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`;
}

export async function addEvent(ev) {
  await ensureTables();
  const { rows } = await sql`
    INSERT INTO events (title, description, date, location, url, image, status)
    VALUES (${ev.title}, ${ev.description}, ${ev.date}, ${ev.location}, ${ev.url}, ${ev.image}, 'pending')
    RETURNING id, title, description, date, location, url, image, status, created_at;
  `;
  return rows[0];
}

export async function listEvents({ q, status } = {}) {
  await ensureTables();
  const clauses = [];
  const params = [];
  if (q) {
    clauses.push(`(title ILIKE %${q}% OR description ILIKE %${q}% OR location ILIKE %${q}%)`);
  }
  if (status) {
    clauses.push(`status = ${status}`);
  } else {
    clauses.push(`status = 'approved'`);
  }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const { rows } = await sql.unsafe(`SELECT id,title,description,date,location,url,image,status,created_at FROM events ${where} ORDER BY date ASC LIMIT 200`);
  return rows;
}

export async function moderateEvent({ id, action }) {
  await ensureTables();
  const status = action === 'approve' ? 'approved' : 'rejected';
  const { rows } = await sql`UPDATE events SET status=${status} WHERE id=${id} RETURNING id,status;`;
  return rows[0];
}
