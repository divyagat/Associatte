import { NextRequest, NextResponse } from 'next/server';
import { getSiteConfig, updateSiteConfig } from '@/lib/data-store';
import { getRoleFromRequest } from '@/lib/admin-auth';
import { slugifyCategory, type PropertyType } from '@/lib/categories';

// Public: the header/nav reads this to render (and hide) the category menus.
export async function GET() {
  try {
    const config = await getSiteConfig();
    return NextResponse.json(config);
  } catch (error: any) {
    console.error('Error fetching site config:', error);
    return NextResponse.json({ hiddenTypes: [], hiddenDeals: [], propertyTypes: [] }, { status: 500 });
  }
}

// Sanitise an incoming property-type list: valid ids, sections, non-empty labels.
function sanitizePropertyTypes(raw: unknown): PropertyType[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const out: PropertyType[] = [];
  const seen = new Set<string>();
  for (const t of raw as any[]) {
    const label = String(t?.label || '').trim();
    const id = String(t?.id || '').toLowerCase().trim() || slugifyCategory(label);
    if (!id || !label || seen.has(id)) continue;
    seen.add(id);
    out.push({
      id,
      label,
      color: /^#[0-9a-fA-F]{3,8}$/.test(String(t?.color)) ? String(t.color) : '#005E60',
      section: t?.section === 'properties' ? 'properties' : 'projects',
    });
  }
  return out;
}

// Admin only: manage the category master list + which categories are hidden.
export async function PUT(request: NextRequest) {
  if (getRoleFromRequest(request) !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const body = await request.json();
    const propertyTypes = sanitizePropertyTypes(body?.propertyTypes);
    const hiddenTypes = Array.isArray(body?.hiddenTypes) ? body.hiddenTypes.map(String) : undefined;
    const hiddenDeals = Array.isArray(body?.hiddenDeals) ? body.hiddenDeals.map(String) : undefined;
    // updateSiteConfig re-validates hidden ids against the (possibly new) types.
    const config = await updateSiteConfig({ propertyTypes, hiddenTypes, hiddenDeals });
    return NextResponse.json(config);
  } catch (error: any) {
    console.error('Error updating site config:', error);
    return NextResponse.json({ error: error.message || 'Failed to update site config' }, { status: 400 });
  }
}
