// api/admin/logout.js
export default async function handler(req, res) {
  res.setHeader('Set-Cookie', 'admin=; Path=/; HttpOnly; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
  res.status(200).json({ ok: true });
}
