// app/api/search-suggestions/route.ts
//
// Powers the autocomplete dropdown under the site search bars. Returns a flat,
// de-duplicated list of suggestion strings (names, builders, localities, cities,
// unit types) built live from published projects + properties.

import { NextResponse } from 'next/server';
import { getAllProjects, getAllProperties } from '@/lib/data-store';
import { isPubliclyVisible } from '@/lib/visibility';
import { buildSuggestions } from '@/lib/suggestions';

// Always reflect the current data store — no build-time caching.
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [projects, properties] = await Promise.all([
      getAllProjects(),
      getAllProperties(),
    ]);
    const listings = [...projects, ...properties].filter(isPubliclyVisible);
    return NextResponse.json(buildSuggestions(listings));
  } catch (error) {
    console.error('❌ Error in GET /api/search-suggestions:', error);
    return NextResponse.json([], { status: 500 });
  }
}
