// lib/seo/listings.ts
//
// Project/property SEO: one canonical URL per listing (/property/[slug]),
// an eligibility check that decides whether a listing should be indexed, and
// title / description / JSON-LD built only from data the listing actually has.

import { getAllProjects, getAllProperties } from '@/lib/data-store';
import { isPubliclyVisible } from '@/lib/visibility';
import { BUILDER_SLUG_MAP, getBuilderSlug } from '@/lib/builder-slugs';
import type { Project } from '@/types/project';
import { SITE_URL, SITE_NAME, absoluteUrl, canonicalUrl, clampText } from './site';

// ---------------------------------------------------------------------------
// Data access
// ---------------------------------------------------------------------------

/** Every listing (projects + properties), deduped by slug, regardless of status. */
export async function getAllListings(): Promise<Project[]> {
  const [projects, properties] = await Promise.all([
    getAllProjects().catch(() => [] as Project[]),
    getAllProperties().catch(() => [] as Project[]),
  ]);
  const seen = new Set<string>();
  const out: Project[] = [];
  for (const p of [...projects, ...properties]) {
    if (!p?.slug || seen.has(p.slug)) continue;
    seen.add(p.slug);
    out.push(p);
  }
  return out;
}

/** Listings that are live on the public site. */
export async function getPublicListings(): Promise<Project[]> {
  return (await getAllListings()).filter(isPubliclyVisible);
}

/** Exact (then case-insensitive) slug lookup. No fuzzy matching: unknown slugs must 404. */
export async function findListingBySlug(slug: string): Promise<Project | null> {
  let decoded = slug;
  try {
    decoded = decodeURIComponent(slug).trim();
  } catch {
    /* keep raw */
  }
  const all = await getAllListings();
  return (
    all.find((p) => p.slug === decoded) ||
    all.find((p) => p.slug?.toLowerCase() === decoded.toLowerCase()) ||
    null
  );
}

// ---------------------------------------------------------------------------
// Field helpers
// ---------------------------------------------------------------------------

export function developerName(p: Project): string {
  if (!p.developer) return typeof p.builder === 'string' ? p.builder : '';
  return typeof p.developer === 'string' ? p.developer : p.developer.name || '';
}

export function developerSlug(p: Project): string | null {
  const name = developerName(p);
  if (!name) return null;
  const slug = getBuilderSlug(name);
  // Only link to builder pages the /builders/[slug] route actually serves.
  return BUILDER_SLUG_MAP[slug] ? slug : null;
}

/** City pages the /locations/[city] route serves, keyed by the listing's `location` field. */
export const CITY_PAGES: Record<string, { name: string; region: string }> = {
  pune: { name: 'Pune', region: 'Pune' },
  mumbai: { name: 'Mumbai', region: 'Mumbai Metropolitan Region' },
  kdmc: { name: 'Kalyan-Dombivli (KDMC)', region: 'Kalyan-Dombivli' },
};

export function cityKey(p: Project): string | null {
  const key = String(p.location || '').toLowerCase().trim();
  return CITY_PAGES[key] ? key : null;
}

export function areaName(p: Project): string {
  return String(p.fullLocation?.area || '').trim();
}

export function cityName(p: Project): string {
  const city = String(p.fullLocation?.city || '').trim();
  if (city && city.toLowerCase() !== 'kdmc') return city;
  const key = cityKey(p);
  return key === 'kdmc' ? 'Kalyan' : key ? CITY_PAGES[key].name : city;
}

/**
 * The listing's RERA registration number, or '' when the field holds a
 * placeholder such as "Comming Soon". Real MahaRERA numbers contain a long
 * digit run (e.g. P52100066482).
 */
export function reraNumber(p: Project): string {
  const raw = String(p.reraNumber || p.reraId || '').trim();
  return /\d{6,}/.test(raw) ? raw : '';
}

/** "₹ 2.4 Cr* Onwards" → "₹2.4 Cr onwards" (presentation only, no value change). */
export function cleanPrice(value?: string): string {
  return String(value || '')
    .replace(/\*/g, '')
    .replace(/₹\s+/g, '₹')
    .replace(/\bOnwards\b/i, 'onwards')
    .replace(/\s+/g, ' ')
    .trim();
}

function priceText(p: Project): string {
  const raw = cleanPrice(p.priceDetails?.range || p.price);
  // Ignore placeholder prices so they never end up in titles/descriptions.
  if (!raw || /on request|tba|n\/a/i.test(raw) || !/\d/.test(raw)) return '';
  return raw;
}

/** "2, 3 & 4 BHK" from the configuration rows that state a BHK count. */
export function bhkSummary(p: Project): string {
  const nums = new Set<number>();
  for (const c of p.priceDetails?.configurations || []) {
    const m = String(c?.type || '').match(/(\d+(?:\.\d+)?)\s*BHK/i);
    if (m) nums.add(Number(m[1]));
  }
  for (const b of p.bhk || []) {
    const m = String(b).match(/(\d+(?:\.\d+)?)/);
    if (m) nums.add(Number(m[1]));
  }
  const list = Array.from(nums).sort((a, b) => a - b).map(String);
  if (!list.length) return '';
  if (list.length === 1) return `${list[0]} BHK`;
  return `${list.slice(0, -1).join(', ')} & ${list[list.length - 1]} BHK`;
}

function category(p: Project): string {
  return String(p.category || '').toLowerCase();
}

/** Short noun phrase for what is on sale, based only on the listing's category/configs. */
export function offeringLabel(p: Project): string {
  const cat = category(p);
  if (cat === 'plots') return 'Plots';
  if (cat === 'commercial') return 'Commercial Spaces';
  if (bhkSummary(p)) return 'Flats';
  return 'Homes';
}

function statusLabel(p: Project): string {
  const cat = category(p);
  if (p.soldOut === true || String(p.soldOut) === 'true') return 'Sold Out';
  if (cat === 'ready') return 'Ready to Move';
  if (cat === 'pre-launch' || p.isNewLaunch === true) return 'New Launch';
  return '';
}

// ---------------------------------------------------------------------------
// Eligibility
// ---------------------------------------------------------------------------

export interface Eligibility {
  indexable: boolean;
  reasons: string[];
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function dedupeKey(p: Project): string {
  return `${(p.name || '').toLowerCase().replace(/[^a-z0-9]/g, '')}|${areaName(p).toLowerCase()}`;
}

/**
 * Decide whether a listing deserves to be indexed. `all` (the full public
 * list) lets us detect duplicates: the first listing with a given name+area
 * wins, later copies are kept live for users but marked noindex.
 */
export function listingEligibility(p: Project, all?: Project[]): Eligibility {
  const reasons: string[] = [];
  if (!isPubliclyVisible(p)) reasons.push('not published');
  if (!p.slug || !SLUG_RE.test(p.slug)) reasons.push('slug is not a clean lowercase-hyphen slug');
  if (!p.name || p.name.trim().length < 3) reasons.push('missing name');
  if (!areaName(p) && !p.fullLocation?.city) reasons.push('missing location');
  if (!p.image) reasons.push('missing main image');

  const aboutLen = String(p.about || p.description || '').trim().length;
  const configs = (p.priceDetails?.configurations || []).length;
  const amenities = (p.amenities || []).length;
  if (aboutLen < 80 && !(configs >= 1 && amenities >= 3)) {
    reasons.push('thin content (needs an 80+ character description, or configurations plus 3+ amenities)');
  }

  if (all) {
    const key = dedupeKey(p);
    const first = all.find((o) => dedupeKey(o) === key);
    if (first && first.slug !== p.slug) reasons.push(`duplicate of /property/${first.slug}`);
  }

  return { indexable: reasons.length === 0, reasons };
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export function listingPath(p: Pick<Project, 'slug'>): string {
  return `/property/${p.slug}`;
}

export function listingTitle(p: Project): string {
  const bhk = bhkSummary(p);
  // Skip the area when the project name already contains it
  // ("Magarpatta City Nova Residency … in Pune", not "… in Magarpatta City, Pune").
  const area = areaName(p);
  const nameHasArea = area && p.name.toLowerCase().includes(area.toLowerCase());
  const where = [nameHasArea ? '' : area, cityName(p)]
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i)
    .join(', ');
  const what = `${bhk ? `${bhk} ` : ''}${offeringLabel(p)}`;
  return `${p.name} – ${what}${where ? ` in ${where}` : ''}`;
}

export function listingDescription(p: Project): string {
  const dev = developerName(p);
  const where = [areaName(p), cityName(p)].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join(', ');
  const bhk = bhkSummary(p);
  const price = priceText(p);
  const status = statusLabel(p);
  const rera = reraNumber(p);

  const parts: string[] = [];
  parts.push(
    `${p.name}${dev ? ` by ${dev}` : ''}${where ? ` in ${where}` : ''}` +
      `${bhk || offeringLabel(p) !== 'Homes' ? `: ${bhk ? `${bhk} ` : ''}${offeringLabel(p).toLowerCase()}` : ''}` +
      `${price ? `, ${price}` : ''}.`,
  );
  if (status) parts.push(`${status}.`);
  if (p.possessionDate && !/tba|n\/a/i.test(p.possessionDate)) parts.push(`Possession ${p.possessionDate}.`);
  if (rera) parts.push(`MahaRERA ${rera}.`);
  parts.push('See floor plans, amenities & location.');
  return clampText(parts.join(' '), 160);
}

// ---------------------------------------------------------------------------
// JSON-LD
// ---------------------------------------------------------------------------

function validCoords(p: Project): { lat: number; lng: number } | null {
  const lat = Number(p.mapCoords?.lat);
  const lng = Number(p.mapCoords?.lng);
  if (!isFinite(lat) || !isFinite(lng) || (lat === 0 && lng === 0)) return null;
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  return { lat, lng };
}

/**
 * WebPage + the place being described. Residential projects are an
 * `ApartmentComplex` (a schema.org Residence); plots/commercial are a generic
 * `Place`. No Offer/price: listing prices are "onwards" estimates, not exact
 * offers, and no ratings/reviews are emitted.
 */
export function listingJsonLd(p: Project, opts: { breadcrumb: Record<string, unknown> }) {
  const url = canonicalUrl(listingPath(p));
  const cat = category(p);
  const isResidential = !['plots', 'commercial'].includes(cat);
  const coords = validCoords(p);
  const rera = reraNumber(p);
  const images = [p.image, ...(p.gallery || [])].map((i) => absoluteUrl(i)).filter(Boolean).slice(0, 6);

  const place = {
    '@type': isResidential ? 'ApartmentComplex' : 'Place',
    '@id': `${url}#place`,
    name: p.name,
    description: clampText(p.about || p.description, 500),
    url,
    image: images,
    address: {
      '@type': 'PostalAddress',
      streetAddress: p.fullLocation?.landmark && p.fullLocation.landmark !== areaName(p) ? p.fullLocation.landmark : undefined,
      addressLocality: areaName(p) || cityName(p),
      addressRegion: p.fullLocation?.state || 'Maharashtra',
      postalCode: p.fullLocation?.pincode,
      addressCountry: 'IN',
    },
    geo: coords ? { '@type': 'GeoCoordinates', latitude: coords.lat, longitude: coords.lng } : undefined,
    amenityFeature: (p.amenities || []).slice(0, 30).map((a) => ({
      '@type': 'LocationFeatureSpecification',
      name: a,
      value: true,
    })),
    additionalProperty: rera
      ? [{ '@type': 'PropertyValue', name: 'MahaRERA registration number', value: rera }]
      : undefined,
  };

  const page = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': url,
    url,
    name: listingTitle(p),
    description: listingDescription(p),
    inLanguage: 'en-IN',
    isPartOf: { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
    primaryImageOfPage: images[0] ? { '@type': 'ImageObject', url: images[0] } : undefined,
    dateModified: p.updatedAt,
    about: place,
  };

  return [page, opts.breadcrumb];
}
