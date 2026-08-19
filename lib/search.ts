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
    // Admin-entered search keywords: extra words a listing should surface for,
    // even when they aren't part of its name/location/etc. Accepts either an
    // array of keywords or a comma/space-separated string.
    ...(Array.isArray(item?.searchKeywords)
      ? item.searchKeywords
      : typeof item?.searchKeywords === 'string'
        ? [item.searchKeywords]
        : []),
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
 * Levenshtein edit distance between two short strings, capped early once it
 * exceeds `max` (returns max + 1) so we can bail out cheaply. Used for
 * typo-tolerant matching — "mantra" still matches when a visitor types "mantr"
 * or "manrta".
 */
function editDistance(a: string, b: string, max: number): number {
  const al = a.length;
  const bl = b.length;
  if (Math.abs(al - bl) > max) return max + 1;
  // Classic DP over a single rolling row.
  let prev = Array.from({ length: bl + 1 }, (_, i) => i);
  let curr = new Array(bl + 1).fill(0);
  for (let i = 1; i <= al; i++) {
    curr[0] = i;
    let rowMin = curr[0];
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
      if (curr[j] < rowMin) rowMin = curr[j];
    }
    // Whole row already past the budget — no way back under `max`.
    if (rowMin > max) return max + 1;
    [prev, curr] = [curr, prev];
  }
  return prev[bl];
}

// How many typos we tolerate for a query token, scaled to its length. Very short
// tokens must match exactly (else everything matches); longer ones allow more.
function typoBudget(len: number): number {
  if (len <= 3) return 0;
  if (len <= 5) return 1;
  return 2;
}

/**
 * Whether a single query token matches the listing text — as a plain substring
 * (fast path, catches partial words like "resid" in "residential") or, failing
 * that, fuzzily against any whole word in the text (catches typos).
 */
export function tokenMatches(text: string, token: string): boolean {
  if (!token) return true;
  if (text.includes(token)) return true;
  const budget = typoBudget(token.length);
  if (budget === 0) return false;
  // Compare against each word; a small edit distance to any word counts.
  for (const word of text.split(/[^a-z0-9]+/i)) {
    if (!word) continue;
    if (Math.abs(word.length - token.length) > budget) continue;
    if (editDistance(word, token, budget) <= budget) return true;
  }
  return false;
}

/**
 * Whether a listing matches a free-text query. Empty query matches everything.
 * Multi-word queries narrow results: every whitespace-separated token must
 * appear somewhere in the listing's searchable text (AND semantics). Matching is
 * typo-tolerant, so small misspellings still surface the right listing.
 */
export function matchesSearch(item: any, query: string | undefined | null): boolean {
  const q = (query ?? '').trim().toLowerCase();
  if (!q) return true;
  const text = buildSearchText(item);
  return q.split(/\s+/).every((token) => tokenMatches(text, token));
}

/**
 * Rank a candidate suggestion against a typed query. Higher = better match;
 * `-1` means "doesn't match at all" (drop it). Powers the autocomplete dropdown:
 * exact prefix beats word-prefix beats substring beats a fuzzy/typo match.
 */
export function suggestionScore(candidate: string, query: string): number {
  const c = candidate.toLowerCase();
  const q = query.trim().toLowerCase();
  if (!q) return 0;
  if (c === q) return 100;
  if (c.startsWith(q)) return 80;
  if (c.split(/[^a-z0-9]+/i).some((w) => w.startsWith(q))) return 60;
  if (c.includes(q)) return 40;
  // Typo tolerance: every query token must fuzzily hit the candidate text.
  const ok = q.split(/\s+/).every((token) => tokenMatches(c, token));
  return ok ? 20 : -1;
}

/**
 * Filter + rank a list of suggestion strings for the given query, best first.
 * With no query, returns the first `limit` as-is (popular defaults).
 */
export function filterSuggestions(all: readonly string[], query: string, limit = 6): string[] {
  const q = query.trim();
  if (!q) return all.slice(0, limit);
  return all
    .map((s) => ({ s, score: suggestionScore(s, q) }))
    .filter((x) => x.score >= 0)
    .sort((a, b) => b.score - a.score || a.s.length - b.s.length)
    .slice(0, limit)
    .map((x) => x.s);
}
