// api/admin/login.js
export default async function handler(req, res) {
  enableCors(req, res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const body = req.body || {};
  const ok = body.password && process.env.ADMIN_SECRET && body.password === process.env.ADMIN_SECRET;
  if (!ok) return res.status(401).json({ error: 'Invalid password' });
  // Set a short-lived HttpOnly cookie (12h)
  const expires = new Date(Date.now() + 12 * 60 * 60 * 1000).toUTCString();
  res.setHeader('Set-Cookie', `admin=1; Path=/; HttpOnly; SameSite=Strict; Expires=${expires}`);
  res.status(200).json({ ok: true });
}

function enableCors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}
