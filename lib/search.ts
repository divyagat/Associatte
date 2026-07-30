// lib/search.ts
//
// Shared free-text search used by every property/project search bar on the site
// (home hero, sticky bars, /properties, /projects, and the admin lists). The
// goal: whatever word a visitor types, any related listing shows up — so we
// match against a broad set of fields plus a few common synonyms, rather than
// just name/location/builder.

import { getProjectType, getDealType } from './categories';

// Words that should surface a listing even though they aren't stored verbatim,
// keyed by the listing's resolved project type / deal type. e.g. searching
// "flat" surfaces residential listings; "office" surfaces commercial ones;
// "buy" or "resale" surfaces sale listings; "lease" surfaces rentals.
const TYPE_SYNONYMS: Record<string, string> = {
  residential: 'residential home homes flat flats apartment apartments house houses villa bhk',
  commercial: 'commercial office offices shop shops showroom retail store',
  plots: 'plot plots land na-plot parcel',
  warehouse: 'warehouse warehousing godown storage logistics',
  industry: 'industrial industry factory manufacturing unit',
};

const DEAL_SYNONYMS: Record<string, string> = {
  sale: 'sale resale buy buying purchase own',
  rent: 'rent rental lease leasing renting',
};

/** Build one lowercase text blob out of every searchable field on a listing. */
export function buildSearchText(item: any): string {
  const configs = item?.priceDetails?.configurations || [];
  const nearby = item?.nearbyPlaces || [];

  const parts: Array<unknown> = [
    item?.name,
    item?.description,
    item?.location,
    item?.city,
    item?.fullLocation?.area,
    item?.fullLocation?.city,
    item?.fullLocation?.state,
    item?.fullLocation?.address,
    item?.builder,
    typeof item?.developer === 'string' ? item?.developer : item?.developer?.name,
    item?.propertyType,
    item?.category,
    item?.dealType,
    item?.reraId,
    item?.area,
    item?.builtUpArea,
    item?.price,
    item?.expectedPrice,
    item?.priceDetails?.range,
    item?.priceDetails?.perSqft,
    ...(Array.isArray(item?.bhk) ? item.bhk : []),
    ...(Array.isArray(item?.amenities) ? item.amenities : []),
    ...(Array.isArray(item?.tags) ? item.tags : []),
    ...configs.map((c: any) => c?.type),
    ...nearby.map((n: any) => (typeof n === 'string' ? n : n?.name)),
    // Synonym expansion from the resolved buckets.
    TYPE_SYNONYMS[getProjectType(item)],
    DEAL_SYNONYMS[getDealType(item)],
  ];

  return parts
    .filter((v): v is string | number => v !== null && v !== undefined && v !== '')
    .join(' ')
    .toLowerCase();
}

/**
 * Whether a listing matches a free-text query. Empty query matches everything.
 * Multi-word queries narrow results: every whitespace-separated token must
 * appear somewhere in the listing's searchable text (AND semantics).
 */
export function matchesSearch(item: any, query: string | undefined | null): boolean {
  const q = (query ?? '').trim().toLowerCase();
  if (!q) return true;
  const text = buildSearchText(item);
  return q.split(/\s+/).every((token) => text.includes(token));
}
