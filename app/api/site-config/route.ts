import { NextRequest, NextResponse } from 'next/server';
import { getSiteConfig, updateSiteConfig } from '@/lib/data-store';
import { getRoleFromRequest } from '@/lib/admin-auth';
import { PROJECT_TYPE_IDS } from '@/lib/categories';
import { DEAL_TYPE_IDS } from '@/lib/categories';

// Public: the header/nav reads this to hide admin-disabled categories.
export async function GET() {
  try {
    const config = await getSiteConfig();
    return NextResponse.json(config);
  } catch (error: any) {
    console.error('Error fetching site config:', error);
    return NextResponse.json({ hiddenTypes: [], hiddenDeals: [] }, { status: 500 });
  }
}

// Admin only: toggle which whole categories are hidden from the public site.
export async function PUT(request: NextRequest) {
  if (getRoleFromRequest(request) !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const body = await request.json();
    // Only accept known category ids so junk can't be persisted.
    const hiddenTypes = Array.isArray(body?.hiddenTypes)
      ? body.hiddenTypes.filter((id: unknown) => (PROJECT_TYPE_IDS as readonly string[]).includes(String(id)))
      : undefined;
    const hiddenDeals = Array.isArray(body?.hiddenDeals)
      ? body.hiddenDeals.filter((id: unknown) => (DEAL_TYPE_IDS as readonly string[]).includes(String(id)))
      : undefined;
    const config = await updateSiteConfig({ hiddenTypes, hiddenDeals });
    return NextResponse.json(config);
  } catch (error: any) {
    console.error('Error updating site config:', error);
    return NextResponse.json({ error: error.message || 'Failed to update site config' }, { status: 400 });
  }
}
