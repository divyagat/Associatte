// app/locations/[city]/layout.tsx
//
// Metadata + breadcrumb JSON-LD for city pages. Only cities that actually have
// live projects are served; anything else (e.g. /locations/xyz) is a real 404
// rather than a 200 page with generic "Maharashtra" content.
// Titles/descriptions are built from the live listings, and an admin SEO
// override for the path wins over them.

import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { getSeoOverride, keywordsToArray } from '@/lib/seo-store';
import {
  CITY_PAGES,
  areaName,
  bhkSummary,
  developerName,
  getPublicListings,
} from '@/lib/seo/listings';
import { JsonLd, breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl, clampText } from '@/lib/seo/site';
import type { Project } from '@/types/project';

export const revalidate = 300;

export function generateStaticParams() {
  return Object.keys(CITY_PAGES).map((city) => ({ city }));
}

async function cityListings(city: string): Promise<Project[]> {
  const key = city.toLowerCase();
  if (!CITY_PAGES[key]) return [];
  return (await getPublicListings()).filter((p) => String(p.location || '').toLowerCase() === key);
}

function topValues(values: string[], n: number): string[] {
  const counts = new Map<string, number>();
  for (const v of values.filter(Boolean)) counts.set(v, (counts.get(v) || 0) + 1);
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([v]) => v)
    .slice(0, n);
}

function listJoin(items: string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} & ${items[items.length - 1]}`;
}

/** Combined BHK range across listings, e.g. "1, 2, 3 & 4 BHK". */
function cityBhk(listings: Project[]): string {
  const nums = new Set<string>();
  for (const p of listings) {
    for (const m of bhkSummary(p).matchAll(/(\d+(?:\.\d+)?)/g)) nums.add(m[1]);
  }
  const sorted = Array.from(nums).sort((a, b) => Number(a) - Number(b));
  return sorted.length ? `${listJoin(sorted)} BHK` : '';
}

const CITY_TITLES: Record<string, string> = {
  pune: 'Flats & New Residential Projects in Pune',
  mumbai: 'Flats & New Projects in Navi Mumbai & Mumbai Region',
  kdmc: 'Flats & New Projects in Kalyan-Dombivli (KDMC)',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const key = city.toLowerCase();
  const listings = await cityListings(key);
  if (!listings.length) return { title: 'Location not found', robots: { index: false, follow: false }, alternates: { canonical: null } };

  const canonical = `/locations/${key}`;
  const override = await getSeoOverride(canonical);

  const areas = topValues(listings.map(areaName), 4);
  const devs = topValues(listings.map(developerName), 3);
  const bhk = cityBhk(listings);
  const cityLabel = CITY_PAGES[key].name;

  const defaultTitle = CITY_TITLES[key] || `Properties in ${cityLabel}`;
  const defaultDescription = clampText(
    `Compare ${listings.length} residential projects in ${cityLabel}` +
      `${areas.length ? ` across ${listJoin(areas)}` : ''}` +
      `${bhk ? ` — ${bhk} homes` : ''}` +
      `${devs.length ? ` by ${listJoin(devs)} and more` : ''}. ` +
      'See prices, floor plans, RERA details & locations.',
    160,
  );

  const title = override?.title?.trim() || defaultTitle;
  const description = override?.description?.trim() || defaultDescription;
  const keywords = keywordsToArray(override?.keywords);
  const image = absoluteUrl(listings.find((p) => p.image)?.image) || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title,
      description,
      url: canonical,
      locale: 'en_IN',
      images: [{ url: image, alt: `New projects in ${cityLabel}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function CityLocationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const key = city.toLowerCase();
  // /locations/Pune → /locations/pune (one URL per city).
  if (key !== city) permanentRedirect(`/locations/${key}`);
  const listings = await cityListings(key);
  if (!listings.length) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([{ name: `Properties in ${CITY_PAGES[key].name}`, path: `/locations/${key}` }])}
      />
      {children}
    </>
  );
}
