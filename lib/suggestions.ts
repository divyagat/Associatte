// lib/suggestions.ts
//
// Builds the flat list of autocomplete suggestions shown under the site search
// bars. Suggestions come straight from live listings (projects + properties) so
// whatever an admin adds becomes searchable/suggestable immediately — project &
// property names, builders/developers, localities, cities and unit types.

// City slugs → display labels used across the site.
const CITY_LABELS: Record<string, string> = {
  pune: 'Pune',
  mumbai: 'Mumbai',
  kdmc: 'KDMC',
};

/** Push a value onto the ordered, case-insensitively de-duped accumulator. */
function add(seen: Set<string>, out: string[], value: unknown): void {
  if (typeof value !== 'string') return;
  const trimmed = value.trim();
  if (!trimmed) return;
  const key = trimmed.toLowerCase();
  if (seen.has(key)) return;
  seen.add(key);
  out.push(trimmed);
}

/**
 * Build a de-duplicated suggestion list from a set of listings. Ordered so the
 * most useful buckets (names first, then builders, then places) surface first
 * when the query is empty.
 */
export function buildSuggestions(listings: any[]): string[] {
  const seen = new Set<string>();
  const names: string[] = [];
  const builders: string[] = [];
  const places: string[] = [];
  const types: string[] = [];

  for (const item of Array.isArray(listings) ? listings : []) {
    add(seen, names, item?.name);

    const builder =
      typeof item?.developer === 'string' ? item?.developer : item?.developer?.name;
    add(seen, builders, builder);
    add(seen, builders, item?.builder);

    add(seen, places, item?.fullLocation?.area);
    add(seen, places, item?.fullLocation?.city);
    add(seen, places, CITY_LABELS[String(item?.location || '').toLowerCase()]);

    // Unit configurations like "2 BHK", "3 BHK".
    for (const cfg of item?.priceDetails?.configurations || []) {
      const bhk = String(cfg?.type || '').match(/\d+\s*[RB]HK/i)?.[0];
      if (bhk) add(seen, types, bhk.toUpperCase());
    }
    // Admin-entered search keywords (see lib/search.ts).
    const keywords = Array.isArray(item?.searchKeywords) ? item.searchKeywords : [];
    for (const kw of keywords) add(seen, types, kw);
  }

  return [...names, ...builders, ...places, ...types];
}
