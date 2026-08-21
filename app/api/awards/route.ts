// app/api/awards/route.ts
//
// Public GET → the Awards & Recognition list shown on the home page + /awards.
// Admin-only PUT → replace the whole list from the admin panel (/admin/awards).

import { NextRequest, NextResponse } from 'next/server';
import { getRoleFromRequest } from '@/lib/admin-auth';
import { getAllAwards, saveAllAwards } from '@/lib/awards-store';

// Always reflect the current data store — no build-time caching.
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json(await getAllAwards());
  } catch (error) {
    console.error('❌ Error in GET /api/awards:', error);
    // Never break the site — return an empty list so the section falls back.
    return NextResponse.json([], { status: 200 });
  }
}

export async function PUT(request: NextRequest) {
  // Managing awards is a main-admin capability (like Settings/AI Assistant).
  if (getRoleFromRequest(request) !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const body = await request.json();
    const list = Array.isArray(body) ? body : body?.items;
    const saved = await saveAllAwards(list);
    return NextResponse.json(saved);
  } catch (error: any) {
    console.error('❌ Error in PUT /api/awards:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to save awards' },
      { status: 400 },
    );
  }
}
