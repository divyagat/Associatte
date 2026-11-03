// lib/seo/sitemap.ts
//
// Builds the per-type XML sitemaps served under /sitemaps/<type>.xml and the
// index at /sitemap.xml. Only canonical, public, indexable URLs are listed, and
// lastmod is only emitted when we have a real modification date.

import { SEO_PAGES } from '@/lib/seo-pages';
import { SITE_URL, absoluteUrl, canonicalUrl, toIsoDate } from './site';
import {
  CITY_PAGES,
  developerSlug,
  getPublicListings,
  listingEligibility,
  listingPath,
} from './listings';
import { blogCanonicalPath, blogDates, blogEligibility, blogPath, getPublicBlogs } from './blogs';

export interface SitemapEntry {
  loc: string;
  lastmod?: string;
  images?: string[];
}

export const SITEMAP_TYPES = ['static', 'projects', 'blogs', 'locations', 'developers'] as const;
export type SitemapType = (typeof SITEMAP_TYPES)[number];

// Google's per-file limit is 50,000 URLs; split well before that.
export const MAX_URLS_PER_SITEMAP = 45000;

/** Public static pages that aren't in the admin SEO registry. */
const EXTRA_STATIC_PATHS = ['/locations', '/awards', '/news', '/calculator'];

function latest(dates: (string | undefined)[]): string | undefined {
  const valid = dates.filter((d): d is string => Boolean(d)).sort();
  return valid[valid.length - 1];
}

async function staticEntries(): Promise<SitemapEntry[]> {
  const paths = [
    ...SEO_PAGES.filter((p) => !p.noindex).map((p) => p.path),
    ...EXTRA_STATIC_PATHS,
  ];
  return Array.from(new Set(paths)).map((path) => ({ loc: canonicalUrl(path) }));
}

async function projectEntries(): Promise<SitemapEntry[]> {
  const listings = await getPublicListings();
  return listings
    .filter((p) => listingEligibility(p, listings).indexable)
    .map((p) => ({
      loc: canonicalUrl(listingPath(p)),
      lastmod: toIsoDate(p.updatedAt) || toIsoDate(p.createdAt),
      images: [p.image, ...(p.gallery || []), ...(p.floorPlans || []).map((f) => f?.image)]
        .map((i) => absoluteUrl(i))
        .filter((i): i is string => Boolean(i))
        .filter((v, i, a) => a.indexOf(v) === i)
        .slice(0, 10),
    }));
}

async function blogEntries(): Promise<SitemapEntry[]> {
  const blogs = await getPublicBlogs();
  return blogs
    .filter((b) => blogEligibility(b).indexable)
    // A post whose canonical points elsewhere isn't its own canonical URL.
    .filter((b) => blogCanonicalPath(b) === blogPath(b.slug))
    .map((b) => ({
      loc: canonicalUrl(blogPath(b.slug)),
      lastmod: blogDates(b).modified,
      images: [absoluteUrl(b.image)].filter((i): i is string => Boolean(i)),
    }));
}

async function locationEntries(): Promise<SitemapEntry[]> {
  const listings = await getPublicListings();
  return Object.keys(CITY_PAGES)
    .map((key) => {
      const inCity = listings.filter((p) => String(p.location || '').toLowerCase() === key);
      if (!inCity.length) return null;
      return {
        loc: canonicalUrl(`/locations/${key}`),
        lastmod: latest(inCity.map((p) => toIsoDate(p.updatedAt))),
      };
    })
    .filter((e): e is { loc: string; lastmod: string | undefined } => Boolean(e));
}

async function developerEntries(): Promise<SitemapEntry[]> {
  const listings = await getPublicListings();
  const bySlug = new Map<string, (string | undefined)[]>();
  for (const p of listings) {
    const slug = developerSlug(p);
    if (!slug) continue;
    bySlug.set(slug, [...(bySlug.get(slug) || []), toIsoDate(p.updatedAt)]);
  }
  return Array.from(bySlug.entries()).map(([slug, dates]) => ({
    loc: canonicalUrl(`/builders/${slug}`),
    lastmod: latest(dates),
  }));
}

export async function sitemapEntries(type: SitemapType): Promise<SitemapEntry[]> {
  switch (type) {
    case 'static':
      return staticEntries();
    case 'projects':
      return projectEntries();
    case 'blogs':
      return blogEntries();
    case 'locations':
      return locationEntries();
    case 'developers':
      return developerEntries();
  }
}

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function urlsetXml(entries: SitemapEntry[]): string {
  const hasImages = entries.some((e) => e.images?.length);
  const body = entries
    .map((e) => {
      const parts = [`<loc>${esc(e.loc)}</loc>`];
      if (e.lastmod) parts.push(`<lastmod>${e.lastmod}</lastmod>`);
      for (const img of e.images || []) parts.push(`<image:image><image:loc>${esc(img)}</image:loc></image:image>`);
      return `<url>${parts.join('')}</url>`;
    })
    .join('\n');
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${
      hasImages ? ' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"' : ''
    }>\n${body}\n</urlset>\n`
  );
}

export function sitemapIndexXml(items: { loc: string; lastmod?: string }[]): string {
  const body = items
    .map((i) => `<sitemap><loc>${esc(i.loc)}</loc>${i.lastmod ? `<lastmod>${i.lastmod}</lastmod>` : ''}</sitemap>`)
    .join('\n');
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>\n`
  );
}

/** Index entries: one file per type, split into numbered pages if a type ever exceeds the limit. */
export async function sitemapIndexItems(): Promise<{ loc: string; lastmod?: string }[]> {
  const items: { loc: string; lastmod?: string }[] = [];
  for (const type of SITEMAP_TYPES) {
    const entries = await sitemapEntries(type);
    if (!entries.length) continue;
    const pages = Math.ceil(entries.length / MAX_URLS_PER_SITEMAP);
    for (let i = 0; i < pages; i++) {
      const chunk = entries.slice(i * MAX_URLS_PER_SITEMAP, (i + 1) * MAX_URLS_PER_SITEMAP);
      items.push({
        loc: `${SITE_URL}/sitemaps/${type}${pages > 1 ? `-${i + 1}` : ''}.xml`,
        lastmod: latest(chunk.map((e) => e.lastmod)),
      });
    }
  }
  return items;
}

/** Resolve "projects.xml" / "projects-2.xml" to a type + page. */
export function parseSitemapName(name: string): { type: SitemapType; page: number } | null {
  const m = name.match(/^([a-z]+)(?:-(\d+))?\.xml$/);
  if (!m) return null;
  const type = m[1] as SitemapType;
  if (!SITEMAP_TYPES.includes(type)) return null;
  const page = m[2] ? Number(m[2]) : 1;
  return page >= 1 ? { type, page } : null;
}
