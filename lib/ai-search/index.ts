// lib/ai-search/index.ts
//
// The shared AI property-search service. Both the AI search bar and the chatbot
// call `assist()` (via /api/ai-search) so a requirement typed or spoken from
// either interface produces the SAME database-backed results.

export * from './criteria';
export * from './parser';
export * from './engine';

import type { SearchCriteria } from './criteria';
import { mergeCriteria, criteriaSummary } from './criteria';
import { parseRequirement, detectReset } from './parser';
import { buildFacets, runSearch } from './engine';

export interface AssistResult {
  criteria: SearchCriteria;
  summary: string[];
  results: any[];
  total: number;
  isAlternative: boolean;
  relaxed: string[];
}

/**
 * End-to-end: understand the message (merged with conversation context), then
 * search the real listings. `text` may be empty when only applying a refinement
 * patch already folded into `context`.
 */
export function assist(
  listings: any[],
  text: string,
  context: SearchCriteria = {},
  opts?: { maxResults?: number },
): AssistResult {
  const baseContext = detectReset(text) ? {} : context;
  const facets = buildFacets(listings);
  const patch = parseRequirement(text, { context: baseContext, facets });
  const criteria = mergeCriteria(baseContext, patch);
  const run = runSearch(listings, criteria, opts);
  return { criteria, summary: criteriaSummary(criteria), ...run };
}
