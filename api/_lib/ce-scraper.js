// api/_lib/ce-scraper.js
import cheerio from 'cheerio';

export async function fetchCaribbeanEvents({ q } = {}) {
  const url = 'https://caribbeanevents.com/event/';
  try {
    const resp = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (compatible; IntreenBot/1.0)' } });
    const html = await resp.text();
    const $ = cheerio.load(html);
    const events = [];
    // Try WordPress typical structure first
    $('article').each((_, el) => {
      const title = $(el).find('h2 a').first().text().trim();
      const link = $(el).find('h2 a').attr('href');
      const meta = $(el).text().trim();
      if (!title || !link) return;
      const item = {
        title,
        url: link,
        date_text: (meta.match(/\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[^\n]+/i) || [''])[0],
        location: (meta.match(/\b[A-Z][A-Za-z .,'&-]+\b(?:,\s*[A-Z][A-Za-z .,'&-]+)?$/m) || [''])[0],
        source: 'CaribbeanEvents.com'
      };
      events.push(item);
    });
    // Fallback: pick up "Learn More" blocks near headings
    if (events.length === 0) {
      $('a:contains("Learn More")').each((_, a) => {
        const link = $(a).attr('href');
        const h2 = $(a).closest('div,li,article').find('h2').first();
        const title = h2.text().trim() || $(a).text().trim();
        if (title) events.push({ title, url: link, source: 'CaribbeanEvents.com' });
      });
    }
    let out = events;
    if (q) {
      const ql = q.toLowerCase();
      out = out.filter(e => e.title.toLowerCase().includes(ql) || (e.location || '').toLowerCase().includes(ql));
    }
    // Deduplicate by title
    const seen = new Set();
    out = out.filter(e => { if (seen.has(e.title)) return false; seen.add(e.title); return true; });
    return out.slice(0, 60);
  } catch (err) {
    return [];
  }
}
