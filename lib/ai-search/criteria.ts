// lib/ai-search/criteria.ts
//
// The structured search state shared by the AI search bar and the chatbot. This
// is the single source of truth for "what the user is looking for". Kept free of
// server-only imports so both the browser and the API can use it.

export interface SearchCriteria {
  city?: string;               // 'pune' | 'mumbai' | 'kdmc'
  location?: string;           // locality/area text, e.g. 'Kothrud'
  bhk?: number;                // 2
  minBudget?: number;          // rupees
  maxBudget?: number;          // rupees
  category?: string;           // 'residential' | 'commercial' | 'plots' | 'warehouse' | 'industry'
  dealType?: string;           // 'sale' | 'rent'
  status?: 'ready' | 'under-construction';
  keywords?: string;           // leftover free text (builder, amenity, …) for fuzzy match
}

/** A partial update where `null` explicitly clears a field. */
export type CriteriaPatch = { [K in keyof SearchCriteria]?: SearchCriteria[K] | null };

const FIELDS: (keyof SearchCriteria)[] = [
  'city', 'location', 'bhk', 'minBudget', 'maxBudget', 'category', 'dealType', 'status', 'keywords',
];

/**
 * Apply a patch onto existing criteria. Only fields present in `next` change;
 * `null`/''/undefined clears that field. This is how conversational refinement
 * works — "budget 1 crore kar do" only touches the budget.
 */
export function mergeCriteria(prev: SearchCriteria = {}, next: CriteriaPatch = {}): SearchCriteria {
  const out: SearchCriteria = { ...prev };
  for (const f of FIELDS) {
    if (f in next) {
      const v = (next as any)[f];
      if (v === null || v === undefined || v === '') delete (out as any)[f];
      else (out as any)[f] = v;
    }
  }
  return out;
}

function trimNum(n: number): string {
  return Number.isInteger(n) ? String(n) : String(Math.round(n * 100) / 100);
}

/** Format a rupee amount as '₹90 Lakh' / '₹1.2 Cr'. */
export function formatBudget(rupees?: number): string | null {
  if (!rupees || rupees <= 0) return null;
  if (rupees >= 1e7) return `₹${trimNum(rupees / 1e7)} Cr`;
  return `₹${trimNum(rupees / 1e5)} Lakh`;
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Human-readable active-filter chips for the "✓ Pune ✓ 2 BHK …" checklist. */
export function criteriaSummary(c: SearchCriteria): string[] {
  const out: string[] = [];
  if (c.city) out.push(c.city.toUpperCase() === 'KDMC' ? 'KDMC' : cap(c.city));
  if (c.location) out.push(cap(c.location));
  if (c.category) out.push(cap(c.category));
  if (c.bhk) out.push(`${c.bhk} BHK`);
  if (c.dealType) out.push(c.dealType === 'rent' ? 'For Rent' : 'For Sale');
  if (c.status) out.push(c.status === 'ready' ? 'Ready to Move' : 'Under Construction');
  const max = formatBudget(c.maxBudget);
  const min = formatBudget(c.minBudget);
  if (max && min) out.push(`${min} - ${max}`);
  else if (max) out.push(`Up to ${max}`);
  else if (min) out.push(`Above ${min}`);
  if (c.keywords) out.push(`"${c.keywords}"`);
  return out;
}

/**
 * Map criteria → /properties query params, so a voice/typed search from the bar
 * lands on the existing results page with the same structured filters applied.
 */
export function criteriaToPropertiesQuery(c: SearchCriteria): URLSearchParams {
  const p = new URLSearchParams();
  if (c.dealType) p.set('deal', c.dealType);
  if (c.category) p.set('type', c.category);
  if (c.city) p.set('city', c.city);
  const q = [c.location, c.keywords].filter(Boolean).join(' ').trim();
  if (q) p.set('q', q);
  if (c.bhk) p.set('bhk', `${c.bhk} BHK`);
  if (c.minBudget) p.set('minPrice', String(c.minBudget));
  if (c.maxBudget) p.set('maxPrice', String(c.maxBudget));
  return p;
}
