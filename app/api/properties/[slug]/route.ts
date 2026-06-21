import { NextRequest, NextResponse } from 'next/server';
import { getPropertyBySlug, updateProperty, deleteProperty } from '@/lib/data-store';
import { getPermissionsFromRequest } from '@/lib/admin-auth';
import { can } from '@/lib/admin-permissions';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const property = await getPropertyBySlug(slug);
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json(property);
  } catch (error: any) {
    console.error('Error fetching property:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch property' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  if (!can(getPermissionsFromRequest(request), 'properties', 'edit')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const { slug } = await context.params;
    const body = await request.json();
    const property = await updateProperty(slug, body);
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json(property);
  } catch (error: any) {
    console.error('Error updating property:', error);
    return NextResponse.json({ error: error.message || 'Failed to update property' }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  if (!can(getPermissionsFromRequest(request), 'properties', 'delete')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const { slug } = await context.params;
    const success = await deleteProperty(slug);
    if (!success) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting property:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete property' }, { status: 500 });
  }
}
