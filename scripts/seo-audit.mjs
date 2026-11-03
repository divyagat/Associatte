#!/usr/bin/env node
// scripts/seo-audit.mjs
//
// Crawls a running site and checks the technical SEO basics on every URL in the
// sitemaps, plus a set of edge-case URLs. No dependencies (Node 18+).
//
//   node scripts/seo-audit.mjs http://localhost:3000          # local build
//   node scripts/seo-audit.mjs https://www.associatte.com     # production
//
// Sitemap URLs always use the canonical origin; when auditing another origin
// they are rewritten to it so a local build can be checked before deploying.
// Exit code is 1 when any check fails.

const BASE = (process.argv[2] || 'http://localhost:3000').replace(/\/+$/, '');
const CANONICAL_ORIGIN = (process.env.CANONICAL_ORIGIN || 'https://www.associatte.com').replace(/\/+$/, '');
// Googlebot smartphone UA, so we see exactly what Google is served.
const UA =
  'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
const JSON_OUT = process.argv.includes('--json');

const failures = [];
const warnings = [];
const fail = (msg) => failures.push(msg);
const warn = (msg) => warnings.push(msg);

const toLocal = (url) => url.replace(CANONICAL_ORIGIN, BASE);

async function get(path, { follow = false } = {}) {
  const url = path.startsWith('http') ? toLocal(path) : `${BASE}${path}`;
  const res = await fetch(url, { redirect: follow ? 'follow' : 'manual', headers: { 'User-Agent': UA } });
  const body = res.status >= 300 && res.status < 400 ? '' : await res.text();
  return {
    status: res.status,
    location: res.headers.get('location'),
    type: res.headers.get('content-type') || '',
    xRobots: res.headers.get('x-robots-tag') || '',
    body,
  };
}

// --- tiny HTML helpers (regex-based; fine for our own server output) -------------
const decode = (s) =>
  String(s || '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
// `<head(\s|>)` so the <header> element is not mistaken for <head>.
const headOf = (html) => (html.match(/<head(?:\s[^>]*)?>([\s\S]*?)<\/head>/i) || [, ''])[1];
const metaContent = (html, attr, name) => {
  const re = new RegExp(`<meta[^>]+${attr}="${name}"[^>]*>`, 'i');
  const tag = (html.match(re) || [])[0];
  return tag ? decode((tag.match(/content="([^"]*)"/i) || [])[1]) : undefined;
};
const titleOf = (html) => decode((headOf(html).match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1]);
const canonicalOf = (html) => decode((html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i) || [])[1]);
const h1Count = (html) => (html.match(/<h1[\s>]/gi) || []).length;
const jsonLdBlocks = (html) =>
  [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
const internalLinks = (html) =>
  [...html.matchAll(/<a[^>]+href="(\/[^"#]*)"/gi)]
    .map((m) => decode(m[1]).split('#')[0])
    .filter((h) => h && !h.startsWith('//') && !h.startsWith('/api/') && !h.startsWith('/admin'));

// --- 1. robots.txt -------------------------------------------------------------
async function checkRobots() {
  const r = await get('/robots.txt');
  if (r.status !== 200) return fail(`robots.txt returned ${r.status}`);
  if (/Disallow:\s*\/_next/i.test(r.body)) fail('robots.txt blocks /_next/ (CSS/JS needed for rendering)');
  if (!/Disallow:\s*\/admin/i.test(r.body)) fail('robots.txt does not block /admin');
  if (!new RegExp(`Sitemap:\\s*${CANONICAL_ORIGIN}/sitemap.xml`, 'i').test(r.body)) fail('robots.txt missing canonical Sitemap line');
}

// --- 2. sitemaps -----------------------------------------------------------------
async function collectSitemapUrls() {
  const idx = await get('/sitemap.xml');
  if (idx.status !== 200 || !/xml/.test(idx.type)) {
    fail(`/sitemap.xml returned ${idx.status} (${idx.type})`);
    return [];
  }
  // Accept either a sitemap index or a single urlset at /sitemap.xml.
  const isIndex = idx.body.includes('<sitemapindex');
  if (!isIndex) warn('/sitemap.xml is a single urlset, not a sitemap index');
  const children = isIndex
    ? [...idx.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => decode(m[1]))
    : [`${CANONICAL_ORIGIN}/sitemap.xml`];
  const urls = [];
  const perType = {};
  for (const child of children) {
    if (!child.startsWith(CANONICAL_ORIGIN)) fail(`sitemap index entry not on canonical origin: ${child}`);
    const sm = await get(child);
    if (sm.status !== 200) {
      fail(`${child} returned ${sm.status}`);
      continue;
    }
    if (!sm.body.startsWith('<?xml') || !sm.body.includes('</urlset>')) fail(`${child} is not a well-formed urlset`);
    const entries = [...sm.body.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1]);
    if (entries.length > 50000) fail(`${child} has ${entries.length} URLs (> 50,000)`);
    perType[child.split('/').pop()] = entries.length;
    for (const e of entries) {
      const loc = decode((e.match(/<loc>([^<]+)<\/loc>/) || [])[1]);
      const lastmod = (e.match(/<lastmod>([^<]+)<\/lastmod>/) || [])[1];
      if (!loc.startsWith(CANONICAL_ORIGIN)) fail(`sitemap URL not on canonical origin: ${loc}`);
      if (lastmod && Date.parse(lastmod) > Date.now() + 86400000) fail(`future lastmod ${lastmod} for ${loc}`);
      if (lastmod && isNaN(Date.parse(lastmod))) fail(`invalid lastmod ${lastmod} for ${loc}`);
      urls.push(loc);
    }
  }
  const dupes = urls.filter((u, i) => urls.indexOf(u) !== i);
  if (dupes.length) fail(`duplicate sitemap URLs: ${[...new Set(dupes)].join(', ')}`);
  return { urls: [...new Set(urls)], perType };
}

// --- 3. per-page checks ----------------------------------------------------------
async function checkPage(loc, seen) {
  const path = loc.slice(CANONICAL_ORIGIN.length) || '/';
  const r = await get(path);
  const row = { url: path, status: r.status };
  if (r.status !== 200) {
    fail(`${path}: sitemap URL returned ${r.status}${r.location ? ` → ${r.location}` : ''}`);
    return row;
  }
  const html = r.body;
  const title = titleOf(html);
  const description = metaContent(html, 'name', 'description');
  const robots = metaContent(html, 'name', 'robots') || '';
  const canonical = canonicalOf(html);
  const h1 = h1Count(html);
  Object.assign(row, { title, description, canonical, robots, h1 });

  if (!title) fail(`${path}: missing <title>`);
  else if (title.length > 75) warn(`${path}: long title (${title.length} chars)`);
  if (!description) fail(`${path}: missing meta description`);
  else if (description.length < 50 || description.length > 170) warn(`${path}: description length ${description.length}`);
  if (/noindex/i.test(robots)) fail(`${path}: in sitemap but robots="${robots}"`);
  if (!canonical) fail(`${path}: missing canonical`);
  else if (canonical !== loc) fail(`${path}: canonical ${canonical} ≠ sitemap URL ${loc}`);
  if (h1 !== 1) fail(`${path}: ${h1} <h1> elements in server HTML (expected 1)`);
  if (/Loading project details|Loading article…/.test(html) && !/<h1/i.test(html)) fail(`${path}: loading shell instead of content`);
  if (!metaContent(html, 'property', 'og:title')) fail(`${path}: missing og:title`);
  if (!metaContent(html, 'property', 'og:image')) warn(`${path}: missing og:image`);
  if (!metaContent(html, 'name', 'twitter:card')) fail(`${path}: missing twitter:card`);

  const blocks = jsonLdBlocks(html);
  row.jsonld = [];
  for (const b of blocks) {
    try {
      const data = JSON.parse(b);
      const types = [].concat(data['@type'] || []);
      row.jsonld.push(...types);
      const str = JSON.stringify(data);
      if (/aggregateRating|"review"/i.test(str)) fail(`${path}: JSON-LD contains ratings/reviews`);
      if (/propfinder\.in/.test(str)) fail(`${path}: JSON-LD references propfinder.in`);
    } catch (e) {
      fail(`${path}: invalid JSON-LD (${e.message})`);
    }
  }
  if (path.startsWith('/property/') && !row.jsonld.includes('WebPage')) fail(`${path}: missing WebPage JSON-LD`);
  if (path.startsWith('/blog/') && !row.jsonld.includes('BlogPosting')) fail(`${path}: missing BlogPosting JSON-LD`);
  if (!path.match(/^\/$/) && path.split('/').length > 2 && !row.jsonld.includes('BreadcrumbList'))
    warn(`${path}: no BreadcrumbList JSON-LD`);

  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const noAlt = imgs.filter((t) => !/\balt=/.test(t));
  if (noAlt.length) warn(`${path}: ${noAlt.length} <img> without alt`);

  for (const l of internalLinks(html)) seen.add(l);
  return row;
}

// --- 4. edge cases -----------------------------------------------------------------
const EDGE_CASES = [
  { path: '/property/this-project-does-not-exist', status: 404 },
  { path: '/projects/mantra', status: 404, note: 'old fuzzy match must not resolve' },
  { path: '/projects/mantra-one-residency', status: 308, location: '/property/mantra-one-residency' },
  { path: '/property/Mantra-One-Residency', status: 308, location: '/property/mantra-one-residency' },
  { path: '/locations/xyz', status: 404 },
  { path: '/locations/Pune', status: 308, location: '/locations/pune' },
  { path: '/blog/this-post-does-not-exist', status: 404 },
  { path: '/builders/not-a-builder', status: 404 },
  { path: '/news/not-a-news-item', status: 404 },
  { path: '/totally-unknown-page', status: 404 },
  { path: '/blog/', status: 308, location: '/blog' },
  { path: '/sitemaps/nope.xml', status: 404 },
  { path: '/admin', status: 307, location: '/admin/login' },
  { path: '/builders/pune', status: 200, noindex: true },
  { path: '/buy', status: 200, noindex: true },
  { path: '/enquiry-test', status: 200, noindex: true },
  { path: '/news/n1', status: 200, noindex: true },
  { path: '/?city=mumbai', status: 200, canonical: `${CANONICAL_ORIGIN}` },
  { path: '/projects?type=commercial', status: 200, canonical: `${CANONICAL_ORIGIN}/projects` },
];

async function checkEdgeCases() {
  const rows = [];
  for (const c of EDGE_CASES) {
    const r = await get(c.path);
    const row = { path: c.path, status: r.status, location: r.location };
    if (r.status !== c.status) fail(`${c.path}: expected ${c.status}, got ${r.status}${r.location ? ` → ${r.location}` : ''}`);
    if (c.location && !(r.location || '').endsWith(c.location)) fail(`${c.path}: expected redirect to ${c.location}, got ${r.location}`);
    if (c.noindex) {
      const robots = metaContent(r.body, 'name', 'robots') || '';
      row.robots = robots;
      if (!/noindex/.test(robots)) fail(`${c.path}: expected noindex, got "${robots}"`);
    }
    if (r.status === 404) {
      const robots = metaContent(r.body, 'name', 'robots') || '';
      if (!/noindex/.test(robots) && !/noindex/.test(r.xRobots)) warn(`${c.path}: 404 page without noindex`);
      const canonical = canonicalOf(r.body);
      if (canonical) fail(`${c.path}: 404 page has a canonical (${canonical})`);
    }
    if (c.canonical) {
      const canonical = canonicalOf(r.body);
      row.canonical = canonical;
      if (canonical !== c.canonical) fail(`${c.path}: canonical ${canonical} ≠ ${c.canonical}`);
    }
    rows.push(row);
  }
  return rows;
}

// --- 5. internal link check -----------------------------------------------------------
async function checkLinks(links) {
  const broken = [];
  for (const l of links) {
    const r = await get(l);
    if (r.status >= 400) broken.push(`${l} (${r.status})`);
  }
  if (broken.length) fail(`broken internal links: ${broken.join(', ')}`);
  return broken;
}

// --- run ----------------------------------------------------------------------------
const started = Date.now();
await checkRobots();
const { urls = [], perType = {} } = (await collectSitemapUrls()) || {};
const seenLinks = new Set();
const pages = [];
for (const u of urls) pages.push(await checkPage(u, seenLinks));

// Duplicate titles / descriptions among indexable pages.
const dupBy = (key) => {
  const map = new Map();
  for (const p of pages) if (p[key]) map.set(p[key], [...(map.get(p[key]) || []), p.url]);
  return [...map.entries()].filter(([, v]) => v.length > 1);
};
for (const [t, list] of dupBy('title')) fail(`duplicate title "${t}" on ${list.join(', ')}`);
for (const [d, list] of dupBy('description')) fail(`duplicate description on ${list.join(', ')}`);

const edge = await checkEdgeCases();
const broken = await checkLinks([...seenLinks].filter((l) => !l.includes('?')));

const summary = {
  base: BASE,
  seconds: Math.round((Date.now() - started) / 1000),
  sitemaps: perType,
  sitemapUrls: urls.length,
  pagesChecked: pages.length,
  internalLinksChecked: [...seenLinks].filter((l) => !l.includes('?')).length,
  brokenLinks: broken.length,
  failures: failures.length,
  warnings: warnings.length,
};

if (JSON_OUT) {
  console.log(JSON.stringify({ summary, pages, edge, failures, warnings }, null, 2));
} else {
  console.log('\n=== SEO audit:', BASE, '===');
  console.table(pages.map((p) => ({ url: p.url, status: p.status, h1: p.h1, title: (p.title || '').slice(0, 60), jsonld: (p.jsonld || []).join(',') })));
  console.table(edge);
  console.log('Summary:', summary);
  if (warnings.length) console.log('\nWarnings:\n - ' + warnings.join('\n - '));
  if (failures.length) console.log('\nFAILURES:\n - ' + failures.join('\n - '));
  else console.log('\nAll checks passed.');
}
process.exit(failures.length ? 1 : 0);
