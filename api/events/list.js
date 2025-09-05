// api/events/list.js
import { listEvents } from '../_lib/db.js';
import { fetchCaribbeanEvents } from '../_lib/ce-scraper.js';

export default async function handler(req, res) {
  enableCors(res);
  const q = (req.query.q || '').toString().trim();
  const source = (req.query.source || '').toString().trim(); // 'intreen' | 'carib' | 'all'
  const status = (req.query.status || '').toString().trim(); // admin: 'pending'
  try {
    let out = [];
    if (source === 'carib' || source === 'all' || !source) {
      const carib = await fetchCaribbeanEvents({ q });
      out = out.concat(carib);
    }
    if (source === 'intreen' || source === 'all' || !source) {
      const ours = await listEvents({ q, status: status || undefined });
      out = out.concat(ours.map(r => ({
        id: r.id,
        title: r.title,
        description: r.description,
        date: r.date,
        location: r.location,
        url: r.url,
        image: r.image,
        source: 'intreen',
        status: r.status
      })));
    }
    // Basic sort: nearest upcoming first if date exists
    out.sort((a,b) => {
      const ad = a.date ? new Date(a.date).getTime() : Infinity;
      const bd = b.date ? new Date(b.date).getTime() : Infinity;
      return ad - bd;
    });
    res.status(200).json({ events: out });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load events' });
  }
}

function enableCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
}
