import { NextRequest, NextResponse } from 'next/server';
import { getAllProperties, createProperty } from '@/lib/data-store';
import { getPermissionsFromRequest } from '@/lib/admin-auth';
import { can } from '@/lib/admin-permissions';

export async function GET() {
  try {
    const properties = await getAllProperties();
    return NextResponse.json(properties);
  } catch (error: any) {
    console.error('Error fetching properties:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch properties' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!can(getPermissionsFromRequest(request), 'properties', 'add')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const body = await request.json();
    const property = await createProperty(body);
    return NextResponse.json(property, { status: 201 });
  } catch (error: any) {
    console.error('Error creating property:', error);
    return NextResponse.json({ error: error.message || 'Failed to create property' }, { status: 400 });
  }
}