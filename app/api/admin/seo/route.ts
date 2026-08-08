import { NextRequest, NextResponse } from 'next/server';
import { getPermissionsFromRequest } from '@/lib/admin-auth';
import { can } from '@/lib/admin-permissions';
import {
  getAllSeoOverrides,
  setSeoOverride,
  deleteSeoOverride,
  type SeoOverride,
} from '@/lib/seo-store';

export const dynamic = 'force-dynamic';

// Anyone with the `seo` edit permission (or a main admin) may read/write overrides.
function authorized(req: NextRequest): boolean {
  const perms = getPermissionsFromRequest(req);
  return can(perms, 'seo', 'edit');
}

// GET → all stored overrides, keyed by path.
export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const overrides = await getAllSeoOverrides();
    return NextResponse.json({ overrides });
  } catch (error: any) {
    console.error('Error reading SEO overrides:', error);
    return NextResponse.json({ error: 'Failed to read SEO overrides' }, { status: 500 });
  }
}

// PUT → upsert one page's override. Body: { path, title?, description?, keywords? }.
// An all-blank override deletes the entry (falls back to the page default).
export async function PUT(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const body = await req.json();
    const path = String(body?.path || '').trim();
    if (!path) {
      return NextResponse.json({ error: 'A page path is required' }, { status: 400 });
    }
    const data: SeoOverride = {
      title: body?.title,
      description: body?.description,
      keywords: body?.keywords,
    };
    const overrides = await setSeoOverride(path, data);
    return NextResponse.json({ overrides });
  } catch (error: any) {
    console.error('Error saving SEO override:', error);
    return NextResponse.json({ error: error.message || 'Failed to save SEO override' }, { status: 400 });
  }
}

// DELETE → remove one page's override. Body: { path }.
export async function DELETE(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const body = await req.json().catch(() => ({}));
    const path = String(body?.path || '').trim();
    if (!path) {
      return NextResponse.json({ error: 'A page path is required' }, { status: 400 });
    }
    const overrides = await deleteSeoOverride(path);
    return NextResponse.json({ overrides });
  } catch (error: any) {
    console.error('Error deleting SEO override:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete SEO override' }, { status: 400 });
  }
}
