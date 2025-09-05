// scripts/generate-search-index.mjs
import fs from 'fs';
import path from 'path';
const ROOT = process.cwd();
const outPath = path.join(ROOT, 'search-index.json');

const htmlDir = ROOT;
const pages = [];

function extractText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function walk(dir) {
  const ents = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of ents) {
    if (ent.name.startsWith('.')) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (['api','node_modules','scripts'].includes(ent.name)) continue;
      walk(full);
    } else if (ent.isFile() && ent.name.endsWith('.html')) {
      const html = fs.readFileSync(full, 'utf8');
      const text = extractText(html).slice(0, 5000);
      const rel = '/' + path.relative(ROOT, full).replace(/\\/g, '/');
      const title = (html.match(/<title>(.*?)<\/title>/i) || [,'Untitled'])[1];
      pages.push({ title, url: rel, content: text });
    }
  }
}

walk(htmlDir);
fs.writeFileSync(outPath, JSON.stringify(pages, null, 2));
console.log('Generated search-index.json with', pages.length, 'pages');
