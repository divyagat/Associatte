// lib/categories.ts
//
// Single source of truth for how listings are classified across the site's two
// public sections (Projects / Properties).
//
// Categories are DYNAMIC: an admin can add / rename / recolor / delete them in
// Settings, and the master list is persisted in site-config (`propertyTypes`).
// The constants below are only the DEFAULT seed (used when the store is empty),
// plus pure helpers that derive the per-section lists from a master list.
//
//   • PROJECTS section  → property types whose `section === 'projects'`
//                          (Residential, Commercial, Plots …)
//   • PROPERTIES section → the two deal tabs (Resale / Rent, built-in) PLUS
//                          property types whose `section === 'properties'`
//                          (Warehouse, Industry …)

export interface CategoryDef {
  id: string;
  label: string;
  color: string;
}

// A property TYPE in the editable master list. `section` decides which nav
// section its tab appears under.
export type CategorySection = 'projects' | 'properties';
export interface PropertyType extends CategoryDef {
  section: CategorySection;
}

// Brand palette (kept in sync with the header/pages)
const BRAND = { green: '#005E60', red: '#8B0000', yellow: '#F8C21C' } as const;

// Loose string aliases kept for back-compat with existing imports.
export type ProjectTypeId = string;
export type DealTypeId = string;

// ── Default master list (seed) ─────────────────────────────────────────────
export const DEFAULT_PROPERTY_TYPES: PropertyType[] = [
  { id: 'residential', label: 'Residential', color: BRAND.green, section: 'projects' },
  { id: 'commercial', label: 'Commercial', color: BRAND.red, section: 'projects' },
  { id: 'plots', label: 'Plots', color: BRAND.yellow, section: 'projects' },
  { id: 'warehouse', label: 'Warehouse', color: BRAND.green, section: 'properties' },
  { id: 'industry', label: 'Industry', color: BRAND.red, section: 'properties' },
];

// ── Deal tabs (built-in) ───────────────────────────────────────────────────
// Resale / Rent map to the `dealType` field. They are core options — hideable in
// Settings but not deletable.
export const DEAL_TYPES: CategoryDef[] = [
  { id: 'sale', label: 'Resale', color: BRAND.green },
  { id: 'rent', label: 'Rent', color: BRAND.red },
];
export const DEAL_TYPE_IDS = DEAL_TYPES.map((d) => d.id);

// A Properties-section tab is either a deal tab or a property-type tab.
export type PropertyTabKind = 'deal' | 'type';
export interface PropertyTabDef extends CategoryDef {
  kind: PropertyTabKind;
}

// ── Derive per-section lists from a master list ────────────────────────────
/** Types shown under the Projects section. */
export function projectTypesOf(types: PropertyType[] = DEFAULT_PROPERTY_TYPES): PropertyType[] {
  return types.filter((t) => t.section === 'projects');
}

/** Tabs shown under the Properties section (deal tabs + property-type tabs). */
export function propertyTabsOf(types: PropertyType[] = DEFAULT_PROPERTY_TYPES): PropertyTabDef[] {
  return [
    ...DEAL_TYPES.map((d) => ({ ...d, kind: 'deal' as const })),
    ...types
      .filter((t) => t.section === 'properties')
      .map((t) => ({ id: t.id, label: t.label, color: t.color, kind: 'type' as const })),
  ];
}

/** All known type ids in a master list (used to honour explicit `category`). */
export function typeIdsOf(types: PropertyType[] = DEFAULT_PROPERTY_TYPES): string[] {
  return types.map((t) => t.id);
}

/** Human label for a type id (falls back to Title Case of the id). */
export function typeLabel(id: string, types: PropertyType[] = DEFAULT_PROPERTY_TYPES): string {
  const found = types.find((t) => t.id === id);
  if (found) return found.label;
  return id ? id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ') : '';
}

/** Slugify a human label into a stable category id. */
export function slugifyCategory(label: string): string {
  return String(label)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ── Back-compat static defaults (fallbacks / non-dynamic callers) ──────────
export const ALL_PROPERTY_TYPES = DEFAULT_PROPERTY_TYPES;
export const ALL_PROPERTY_TYPE_IDS = typeIdsOf();
export const PROJECT_TYPES = projectTypesOf();
export const PROJECT_TYPE_IDS = PROJECT_TYPES.map((t) => t.id);
export const PROPERTY_TABS = propertyTabsOf();
export const PROPERTY_TAB_IDS = PROPERTY_TABS.map((t) => t.id);

// ── Classification ─────────────────────────────────────────────────────────
/**
 * Resolve the property TYPE bucket for a listing. An explicit `category` that is
 * one of the currently-known ids wins; otherwise (legacy / unknown values) we
 * sniff the configurations + name. Pass `knownIds` so dynamically-added
 * categories are honoured; it defaults to the built-in set.
 */
export function getProjectType(item: any, knownIds: string[] = ALL_PROPERTY_TYPE_IDS): string {
  const explicit = String(item?.category || item?.projectType || item?.propertyType || '')
    .toLowerCase()
    .trim();
  if (explicit && knownIds.includes(explicit)) return explicit;

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
export function getDealType(item: any): string {
  const explicit = String(item?.dealType || '').toLowerCase().trim();
  if (DEAL_TYPE_IDS.includes(explicit)) return explicit;
  if (explicit === 'rental' || explicit === 'lease') return 'rent';
  if (explicit === 'resale') return 'sale';

  const cat = String(item?.category || '').toLowerCase().trim();
  if (cat === 'rent' || cat === 'rental' || cat === 'lease') return 'rent';
  if (item?.isRental === true) return 'rent';
  return 'sale';
}

/** Does a listing belong under a given Properties-section tab? */
export function matchesPropertyTab(
  item: any,
  tab: PropertyTabDef,
  knownIds?: string[],
): boolean {
  return tab.kind === 'deal'
    ? getDealType(item) === tab.id
    : getProjectType(item, knownIds) === tab.id;
}

/**
 * Count listings for each id in `displayIds`. Classification uses `knownIds`
 * (all type ids) so explicit categories are honoured, then only the requested
 * display ids are tallied.
 */
export function countByType(
  items: any[],
  displayIds: string[],
  knownIds: string[] = displayIds,
): Record<string, number> {
  const counts: Record<string, number> = Object.fromEntries(displayIds.map((id) => [id, 0]));
  for (const item of items) {
    const t = getProjectType(item, knownIds);
    if (t in counts) counts[t]++;
  }
  return counts;
}

/** Count listings per Properties-section tab (a listing can match several). */
export function countByTab(
  items: any[],
  tabs: PropertyTabDef[],
  knownIds?: string[],
): Record<string, number> {
  const counts: Record<string, number> = Object.fromEntries(tabs.map((t) => [t.id, 0]));
  for (const item of items) {
    for (const tab of tabs) {
      if (matchesPropertyTab(item, tab, knownIds)) counts[tab.id]++;
    }
  }
  return counts;
}
