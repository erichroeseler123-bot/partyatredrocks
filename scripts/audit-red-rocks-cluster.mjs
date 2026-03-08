import fs from 'node:fs';
import path from 'node:path';

const repo = process.cwd();
const regPath = path.join(repo, 'lib', 'redRocksAuthority.ts');
const regText = fs.readFileSync(regPath, 'utf8');

const slugs = [...regText.matchAll(/slug: "([^"]+)"/g)].map((m) => m[1]);
const unique = new Set(slugs);
const dupSlugs = slugs.filter((s, i) => slugs.indexOf(s) !== i);

const queriesBySlug = new Map();
for (const block of regText.split(/\n\s*\{\n/)) {
  const slugMatch = block.match(/slug: "([^"]+)"/);
  if (!slugMatch) continue;
  const slug = slugMatch[1];
  const qMatch = block.match(/queryIntents:\s*\[([\s\S]*?)\],/) ?? block.match(/queries:\s*\[([\s\S]*?)\],/);
  if (!qMatch) continue;
  const qs = [...qMatch[1].matchAll(/"([^"]+)"/g)].map((m) => m[1].trim().toLowerCase());
  queriesBySlug.set(slug, qs);
}
const queryOwners = new Map();
const dupQueries = [];
for (const [slug, qs] of queriesBySlug.entries()) {
  for (const q of qs) {
    if (queryOwners.has(q)) dupQueries.push({ query: q, a: queryOwners.get(q), b: slug });
    else queryOwners.set(q, slug);
  }
}

const required = ['/red-rocks', '/red-rocks/transportation', '/red-rocks/parking', '/red-rocks/faq', '/find'];
const layoutText = fs.readFileSync(path.join(repo, 'app', 'red-rocks', 'layout.tsx'), 'utf8');
const missingRequiredInLayout = required.filter((href) => !layoutText.includes(`href="${href}"`));

const known = new Set([
  ...required,
  '/red-rocks/concerts', '/red-rocks/concert-guide', '/red-rocks/visiting-guide', '/red-rocks/hiking-trails',
  '/red-rocks/geology', '/red-rocks/wildlife', '/red-rocks/camping-nearby', '/red-rocks/trading-post-trail', '/week/red-rocks'
]);
for (const s of unique) known.add(`/red-rocks/${s}`);

const allHrefMatches = [...regText.matchAll(/href: "([^"]+)"/g)].map((m) => m[1]);
const staleHrefs = [...new Set(allHrefMatches)].filter((h) => h.startsWith('/red-rocks') || h === '/find').filter((h) => !known.has(h));

console.log(JSON.stringify({
  totalAuthorityPages: slugs.length,
  duplicateSlugs: [...new Set(dupSlugs)],
  duplicateQueries: dupQueries,
  staleClusterLinks: staleHrefs,
  missingRequiredLinksInLayout: missingRequiredInLayout,
}, null, 2));
