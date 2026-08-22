// app/api/news/route.ts
//
// Public GET → the Real Estate News list shown on the home page + /news.
// Admin-only PUT → replace the whole list from the admin panel (/admin/news).

import { NextRequest, NextResponse } from 'next/server';
import { getRoleFromRequest } from '@/lib/admin-auth';
import { getAllNews, saveAllNews } from '@/lib/news-store';

// Always reflect the current data store — no build-time caching.
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json(await getAllNews());
  } catch (error) {
    console.error('❌ Error in GET /api/news:', error);
    // Never break the site — return an empty list so the section falls back.
    return NextResponse.json([], { status: 200 });
  }
}

export async function PUT(request: NextRequest) {
  // Managing news is a main-admin capability (like Settings/AI Assistant).
  if (getRoleFromRequest(request) !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const body = await request.json();
    const list = Array.isArray(body) ? body : body?.items;
    const saved = await saveAllNews(list);
    return NextResponse.json(saved);
  } catch (error: any) {
    console.error('❌ Error in PUT /api/news:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to save news' },
      { status: 400 },
    );
  }
}
