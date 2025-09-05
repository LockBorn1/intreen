// api/events/moderate.js
import { moderateEvent } from '../_lib/db.js';

export default async function handler(req, res) {
  enableCors(req, res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const isAdmin = (req.headers.cookie || '').includes('admin=1');
    if (!isAdmin) return res.status(401).json({ error: 'Unauthorized' });
    const body = req.body || {};
    if (!body.id || !body.action) return res.status(400).json({ error: 'Missing id/action' });
    const updated = await moderateEvent({ id: Number(body.id), action: String(body.action) });
    res.status(200).json({ ok: true, updated });
  } catch (err) {
    res.status(400).json({ error: err.message || 'Bad request' });
  }
}

function enableCors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
}
