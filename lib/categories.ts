// lib/categories.ts
//
// Single source of truth for the two independent ways a listing is classified:
//
//   • PROJECT TYPE  (what it is)   — Residential, Commercial, Plots, Warehouse, Industry
//     → drives the header "Projects" dropdown and the /projects page tabs.
//
//   • DEAL TYPE     (how it's offered) — Sale, Rent
//     → drives the header "Properties" dropdown and the /properties page tabs.
//
// Both dimensions are derived from a listing so legacy records (which only carry
// the older `category` field) still land in a sensible bucket, while records
// saved from the admin panel set `category` + `dealType` explicitly.

export interface CategoryDef {
  id: string;
  label: string;
  color: string;
}

// Brand palette (kept in sync with the header/pages)
const BRAND = { green: '#005E60', red: '#8B0000', yellow: '#F8C21C' } as const;

// ── Project type dimension (Header → Projects) ─────────────────────────────
export const PROJECT_TYPES = [
  { id: 'residential', label: 'Residential', color: BRAND.green },
  { id: 'commercial', label: 'Commercial', color: BRAND.red },
  { id: 'plots', label: 'Plots', color: BRAND.yellow },
  { id: 'warehouse', label: 'Warehouse', color: BRAND.green },
  { id: 'industry', label: 'Industry', color: BRAND.red },
] as const;

export type ProjectTypeId = (typeof PROJECT_TYPES)[number]['id'];
export const PROJECT_TYPE_IDS = PROJECT_TYPES.map((t) => t.id) as readonly ProjectTypeId[];

// ── Deal type dimension (Header → Properties) ──────────────────────────────
export const DEAL_TYPES = [
  { id: 'sale', label: 'Sale', color: BRAND.green },
  { id: 'rent', label: 'Rent', color: BRAND.red },
] as const;

export type DealTypeId = (typeof DEAL_TYPES)[number]['id'];
export const DEAL_TYPE_IDS = DEAL_TYPES.map((t) => t.id) as readonly DealTypeId[];

/**
 * Resolve the PROJECT TYPE bucket for a listing.
 * Explicit `category` wins; otherwise we sniff the configurations / name.
 */
export function getProjectType(item: any): ProjectTypeId {
  const explicit = String(item?.category || item?.projectType || item?.propertyType || '')
    .toLowerCase()
    .trim();
  if ((PROJECT_TYPE_IDS as readonly string[]).includes(explicit)) {
    return explicit as ProjectTypeId;
  }

  const configs = item?.priceDetails?.configurations || [];
  const text = [
    ...configs.map((c: any) => c?.type || ''),
    item?.propertyType || '',
    item?.name || '',
  ]
    .join(' ')
    .toLowerCase();

  if (/warehouse|godown/.test(text)) return 'warehouse';
  if (/industr|factory|manufactur/.test(text)) return 'industry';
  if (/plot|\bland\b|na plot/.test(text)) return 'plots';
  if (/office|shop|showroom|retail|commercial/.test(text)) return 'commercial';
  return 'residential';
}

/**
 * Resolve the DEAL TYPE bucket for a listing.
 * Explicit `dealType` wins; otherwise legacy `rent` category → rent, else sale.
 */
export function getDealType(item: any): DealTypeId {
  const explicit = String(item?.dealType || '').toLowerCase().trim();
  if ((DEAL_TYPE_IDS as readonly string[]).includes(explicit)) {
    return explicit as DealTypeId;
  }
  // Normalise older/synonym values that predate the sale/rent ids.
  if (explicit === 'rental' || explicit === 'lease') return 'rent';
  if (explicit === 'resale') return 'sale';

  const cat = String(item?.category || '').toLowerCase().trim();
  if (cat === 'rent' || cat === 'rental' || cat === 'lease') return 'rent';
  if (item?.isRental === true) return 'rent';
  // resale, ready, pre-launch, sale, and everything else → sale
  return 'sale';
}

/** Count listings per project type. */
export function computeTypeCounts(items: any[]): Record<ProjectTypeId, number> {
  const counts = Object.fromEntries(PROJECT_TYPE_IDS.map((id) => [id, 0])) as Record<
    ProjectTypeId,
    number
  >;
  for (const item of items) counts[getProjectType(item)]++;
  return counts;
}

/** Count listings per deal type. */
export function computeDealCounts(items: any[]): Record<DealTypeId, number> {
  const counts = Object.fromEntries(DEAL_TYPE_IDS.map((id) => [id, 0])) as Record<
    DealTypeId,
    number
  >;
  for (const item of items) counts[getDealType(item)]++;
  return counts;
}
