// lib/ai-search/engine.ts
//
// Turns SearchCriteria into real property/project results. This is the ONE
// search service both the AI search bar and the chatbot use — it filters the
// same published listings the rest of the site reads, and reuses the shared
// fuzzy text matcher (lib/search) so typed and spoken queries behave identically.

import { matchesSearch, buildSearchText } from '../search';
import { getProjectType, getDealType } from '../categories';
import type { SearchCriteria } from './criteria';

export interface Facets {
  cities: string[];
  areas: string[];
  builders: string[];
}

/** Derive recognisable areas/builders/cities from live listings (DB-driven). */
export function buildFacets(listings: any[]): Facets {
  const areas = new Set<string>();
  const builders = new Set<string>();
  const cities = new Set<string>();
  for (const it of listings) {
    if (it?.fullLocation?.area) areas.add(String(it.fullLocation.area));
    if (it?.fullLocation?.landmark) areas.add(String(it.fullLocation.landmark));
    const b = typeof it?.developer === 'string' ? it.developer : it?.developer?.name;
    if (b) builders.add(String(b));
    if (it?.builder) builders.add(String(it.builder));
    if (it?.location) cities.add(String(it.location).toLowerCase());
  }
  return { areas: [...areas], builders: [...builders], cities: [...cities] };
}

/** Parse the first ₹ amount in a price string into rupees ("₹80 Lakh" → 8000000). */
export function parsePriceNumber(text?: string | number | null): number | null {
  if (typeof text === 'number') return text > 0 ? text : null;
  if (!text) return null;
  const m = String(text).toLowerCase().match(/(\d+(?:\.\d+)?)\s*(lakhs?|lac|crores?|cr|l)\b/);
  if (m) {
    const unit = m[2];
    const mult = unit.startsWith('cr') || unit.startsWith('crore') ? 1e7 : 1e5;
    return parseFloat(m[1]) * mult;
  }
  // Fall back to a bare rupee figure like "8500000" or "85,00,000".
  const digits = String(text).replace(/[^\d]/g, '');
  if (digits.length >= 5) return parseInt(digits, 10);
  return null;
}

function listingPrice(item: any): number | null {
  return (
    parsePriceNumber(item?.priceDetails?.range) ??
    parsePriceNumber(item?.price) ??
    parsePriceNumber(item?.expectedPrice)
  );
}

function listingBHKs(item: any): number[] {
  const out = new Set<number>();
  for (const cfg of item?.priceDetails?.configurations || []) {
    const mm = String(cfg?.type || '').match(/(\d+)\s*[rb]hk/i);
    if (mm) out.add(parseInt(mm[1], 10));
  }
  for (const b of Array.isArray(item?.bhk) ? item.bhk : []) {
    const mm = String(b).match(/(\d+)/);
    if (mm) out.add(parseInt(mm[1], 10));
  }
  return [...out];
}

function statusText(item: any): string {
  return `${item?.possessionDate || ''} ${item?.about || ''} ${item?.ageOfConstruction || ''}`.toLowerCase();
}
function isReadyLike(item: any): boolean {
  if (/ready to move|ready possession|ready-to-move|move[- ]?in|immediate possession|possession ready/.test(statusText(item))) return true;
  return !!item?.ageOfConstruction; // resale listings carry an age = already built
}
function isUnderConstructionLike(item: any): boolean {
  if (item?.isNewLaunch) return true;
  return /under[- ]?construction|pre[- ]?launch|prelaunch|new launch|upcoming|launching/.test(statusText(item));
}

/** Whether a single listing satisfies every set criterion. */
export function matchesCriteria(item: any, c: SearchCriteria): boolean {
  if (c.city && String(item?.location || '').toLowerCase() !== c.city.toLowerCase()) return false;

  const text = buildSearchText(item);
  if (c.location && !text.includes(c.location.toLowerCase())) return false;

  if (c.bhk) {
    const bs = listingBHKs(item);
    if (bs.length && !bs.includes(c.bhk)) return false;
  }

  if (c.category && getProjectType(item) !== c.category) return false;
  if (c.dealType && getDealType(item) !== c.dealType) return false;

  const price = listingPrice(item);
  if (c.maxBudget && price != null && price > c.maxBudget) return false;
  if (c.minBudget && price != null && price < c.minBudget) return false;

  if (c.status === 'ready' && isUnderConstructionLike(item) && !isReadyLike(item)) return false;
  if (c.status === 'under-construction' && isReadyLike(item) && !isUnderConstructionLike(item)) return false;

  if (c.keywords && !matchesSearch(item, c.keywords)) return false;

  return true;
}

/** All listings matching the criteria (no relaxation). */
export function searchListings(listings: any[], c: SearchCriteria): any[] {
  return listings.filter((x) => matchesCriteria(x, c));
}

export interface RunResult {
  results: any[];      // sliced to maxResults for display
  total: number;       // total matches before slicing
  isAlternative: boolean;
  relaxed: string[];   // which constraints were relaxed to find alternatives
}

/**
 * Search, and if nothing matches, progressively relax constraints (status →
 * keywords → location → budget → BHK) so the user always gets useful nearby
 * options, clearly flagged as alternatives (point 18: no-results handling).
 */
export function runSearch(listings: any[], criteria: SearchCriteria, opts?: { maxResults?: number }): RunResult {
  const max = Math.max(1, opts?.maxResults ?? 6);
  let results = searchListings(listings, criteria);
  let isAlternative = false;
  const relaxed: string[] = [];

  if (!results.length) {
    let cur: SearchCriteria = { ...criteria };
    const steps: { label: string; apply: () => void }[] = [];
    if (cur.status) steps.push({ label: 'any construction status', apply: () => { delete cur.status; } });
    if (cur.keywords) steps.push({ label: 'a broader match', apply: () => { delete cur.keywords; } });
    if (cur.location) steps.push({ label: 'nearby locations', apply: () => { delete cur.location; } });
    if (cur.maxBudget) steps.push({ label: 'a higher budget', apply: () => { cur.maxBudget = Math.round((cur.maxBudget as number) * 1.5); } });
    if (cur.bhk) steps.push({ label: 'other configurations', apply: () => { delete cur.bhk; } });

    for (const step of steps) {
      step.apply();
      const r = searchListings(listings, cur);
      relaxed.push(step.label);
      if (r.length) { results = r; isAlternative = true; break; }
    }
    if (!results.length) relaxed.length = 0; // still nothing — don't mislead
  }

  return { results: results.slice(0, max), total: results.length, isAlternative, relaxed };
}
