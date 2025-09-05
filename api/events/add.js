// api/events/add.js
import { addEvent } from '../_lib/db.js';

export default async function handler(req, res) {
  enableCors(req, res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const body = req.body || {};
    const required = ['title', 'description', 'datetime', 'location'];
    for (const k of required) {
      if (!body[k] || String(body[k]).trim() === '') throw new Error(`Missing ${k}`);
    }
    const dt = new Date(body.datetime);
    if (isNaN(dt.getTime())) throw new Error('Invalid datetime');
    const ev = await addEvent({
      title: String(body.title).trim(),
      description: String(body.description).trim(),
      date: dt.toISOString(),
      location: String(body.location).trim(),
      url: body.url ? String(body.url).trim() : null,
      image: body.image ? String(body.image).trim() : null,
    });
    res.status(200).json({ ok: true, event: { ...ev, source: 'intreen' } });
  } catch (err) {
    res.status(400).json({ error: err.message || 'Bad request' });
  }
}

function enableCors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
}
