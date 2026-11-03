// lib/seo/site.ts
//
// One place for the canonical origin and brand used by every metadata helper,
// sitemap entry and JSON-LD block. Pages should never hard-code the domain.

const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.associatte.com';

/** Canonical production origin, e.g. "https://www.associatte.com" (no trailing slash). */
export const SITE_URL = RAW_SITE_URL.replace(/\/+$/, '');

export const SITE_NAME = 'Associatte PropTech';
export const ORG_LEGAL_NAME = 'Associatte PropTech Pvt Ltd';
export const ORG_LOGO = `${SITE_URL}/logos/Asoociattelogo.jpg`;
export const DEFAULT_OG_IMAGE = '/Home/b4.webp';

/** Turn a site-relative path (or absolute URL) into an absolute URL on the canonical origin. */
export function absoluteUrl(pathOrUrl?: string | null): string | undefined {
  if (!pathOrUrl || typeof pathOrUrl !== 'string') return undefined;
  const value = pathOrUrl.trim();
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('data:')) return undefined;
  return `${SITE_URL}${value.startsWith('/') ? '' : '/'}${value}`;
}

/** Canonical URL for a site path. "/" maps to the bare origin. */
export function canonicalUrl(path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return clean === '/' ? SITE_URL : `${SITE_URL}${clean.replace(/\/+$/, '')}`;
}

/** Trim text to a meta-description friendly length without cutting a word in half. */
export function clampText(text: string | undefined | null, max = 160): string {
  const s = String(text || '').replace(/\s+/g, ' ').trim();
  if (s.length <= max) return s;
  const cut = s.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:–-]+$/, '')}…`;
}

/** Parse a date-ish value into an ISO string, ignoring invalid and future dates. */
export function toIsoDate(value: unknown): string | undefined {
  if (typeof value !== 'string' && typeof value !== 'number') return undefined;
  const d = new Date(value);
  if (isNaN(d.getTime())) return undefined;
  if (d.getTime() > Date.now() + 24 * 60 * 60 * 1000) return undefined;
  return d.toISOString();
}
