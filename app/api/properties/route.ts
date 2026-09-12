import { NextRequest, NextResponse } from 'next/server';
import { getAllProperties, createProperty } from '@/lib/data-store';
import { getPermissionsFromRequest, getRoleFromRequest } from '@/lib/admin-auth';
import { can } from '@/lib/admin-permissions';
import { isPubliclyVisible, initialStatusForRole } from '@/lib/visibility';
import type { Project } from '@/types/project';

// Public GET returns only published listings. Admin list pages read the data
// store directly (getAllProperties), so they still see everything.
export async function GET() {
  try {
    const properties = await getAllProperties();
    return NextResponse.json(properties.filter(isPubliclyVisible));
  } catch (error) {
    console.error('Error fetching properties:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch properties';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!can(getPermissionsFromRequest(request), 'properties', 'add')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const body: Partial<Project> = await request.json();
    // Two-stage approval: a main admin publishes directly, a manager's submission
    // clears stage 1 (awaits admin), and an employee's submission starts pending
    // (awaits manager, then admin).
    const isAdmin = getRoleFromRequest(request) === 'admin';
    const isManager = !isAdmin && can(getPermissionsFromRequest(request), 'properties', 'approve');
    body.status = initialStatusForRole(isAdmin ? 'admin' : isManager ? 'manager' : 'employee');
    const property = await createProperty(body);
    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    const message = error instanceof Error ? error.message : 'Failed to create property';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
