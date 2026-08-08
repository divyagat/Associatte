// lib/seo-store.ts
//
// Admin-editable SEO overrides for every page on the site.
//
// One JSON document (`data/seo.json`) keyed by page PATH holds the per-page
// meta title / description / keywords an admin (or an employee with the `seo`
// permission) enters in the admin SEO panel. Every page's metadata merges its
// override ON TOP of the built-in default — so an empty/missing override simply
// falls back to the page's original SEO.
//
// Persistence uses the same blob-store as the rest of the data layer, so it
// works on any host with only the MongoDB connection (see lib/blob-store).

import { readJson, writeJson } from './blob-store';

const SEO_FILE = 'data/seo.json';

// A single page's override. Any field left blank means "use the page default".
export interface SeoOverride {
  title?: string;
  description?: string;
  keywords?: string; // stored as a comma-separated string (as typed by the admin)
}

export type SeoOverrides = Record<string, SeoOverride>;

/** Normalise a path into a stable key: leading slash, no trailing slash, lowercased. */
export function normalizeSeoPath(path: string): string {
  let p = String(path || '').trim().toLowerCase();
  if (!p.startsWith('/')) p = `/${p}`;
  if (p.length > 1) p = p.replace(/\/+$/, ''); // strip trailing slash (keep root "/")
  return p || '/';
}

/** Trim + cap a stored SEO override so nothing absurd is persisted. */
function sanitizeOverride(raw: any): SeoOverride {
  const clean = (v: unknown, max: number): string | undefined => {
    const s = String(v ?? '').trim();
    return s ? s.slice(0, max) : undefined;
  };
  const out: SeoOverride = {
    title: clean(raw?.title, 200),
    description: clean(raw?.description, 400),
    keywords: clean(raw?.keywords, 500),
  };
  // Drop empty keys so an all-blank override is stored as {} (and can be pruned).
  (Object.keys(out) as (keyof SeoOverride)[]).forEach((k) => out[k] === undefined && delete out[k]);
  return out;
}

/** Read every stored override, keyed by normalised path. */
export async function getAllSeoOverrides(): Promise<SeoOverrides> {
  const data = await readJson<SeoOverrides>(SEO_FILE, {});
  if (!data || typeof data !== 'object') return {};
  const out: SeoOverrides = {};
  for (const [path, value] of Object.entries(data)) {
    const clean = sanitizeOverride(value);
    if (Object.keys(clean).length) out[normalizeSeoPath(path)] = clean;
  }
  return out;
}

/** Read the override for a single page (or null when none is stored). */
export async function getSeoOverride(path: string): Promise<SeoOverride | null> {
  const all = await getAllSeoOverrides();
  return all[normalizeSeoPath(path)] ?? null;
}

/** Upsert the override for a page. An all-blank override removes the entry. */
export async function setSeoOverride(path: string, data: SeoOverride): Promise<SeoOverrides> {
  const key = normalizeSeoPath(path);
  const all = await getAllSeoOverrides();
  const clean = sanitizeOverride(data);
  if (Object.keys(clean).length === 0) {
    delete all[key];
  } else {
    all[key] = clean;
  }
  await writeJson(SEO_FILE, all);
  return all;
}

/** Remove any override stored for a page. */
export async function deleteSeoOverride(path: string): Promise<SeoOverrides> {
  const key = normalizeSeoPath(path);
  const all = await getAllSeoOverrides();
  if (key in all) {
    delete all[key];
    await writeJson(SEO_FILE, all);
  }
  return all;
}

/** Split a stored comma-separated keywords string into a clean array (or undefined). */
export function keywordsToArray(keywords?: string): string[] | undefined {
  if (!keywords) return undefined;
  const arr = keywords.split(',').map((k) => k.trim()).filter(Boolean);
  return arr.length ? arr : undefined;
}
