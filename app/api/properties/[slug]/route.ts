import { NextRequest, NextResponse } from 'next/server';
import { getPropertyBySlug, updateProperty, deleteProperty } from '@/lib/data-store';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const property = await getPropertyBySlug(params.slug);
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
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json();
    const property = await updateProperty(params.slug, body);
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
  { params }: { params: { slug: string } }
) {
  try {
    const success = await deleteProperty(params.slug);
    if (!success) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting property:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete property' }, { status: 500 });
  }
}