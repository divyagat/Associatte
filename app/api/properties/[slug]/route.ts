import { NextRequest, NextResponse } from 'next/server';
import { getPropertyBySlug, updateProperty, deleteProperty } from '@/lib/data-store';
import { getPermissionsFromRequest, getRoleFromRequest } from '@/lib/admin-auth';
import { can } from '@/lib/admin-permissions';
import { sanitizeStatus, allowedStatusTargets } from '@/lib/visibility';
import type { Project } from '@/types/project';

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
  } catch (error) {
    console.error('Error fetching property:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch property';
    return NextResponse.json({ error: message }, { status: 500 });
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
    const body: Partial<Project> = await request.json();
    // Two-stage approval. A main admin may set any status. A manager may only
    // advance a submission to `manager_approved` (stage-1 approval) or hide it —
    // publishing is the admin's exclusive final gate. A non-approver's content
    // edit re-enters the pending queue and any `status` they send is ignored.
    const isAdmin = getRoleFromRequest(request) === 'admin';
    const isManager = !isAdmin && can(getPermissionsFromRequest(request), 'properties', 'approve');
    const canApprove = isAdmin || isManager;
    const isStatusOnly = 'status' in body && Object.keys(body).length === 1;
    if ('status' in body) {
      if (isAdmin) {
        body.status = sanitizeStatus(body.status, 'published');
      } else if (isManager) {
        const requested = sanitizeStatus(body.status, 'manager_approved');
        if (allowedStatusTargets('manager').includes(requested)) body.status = requested;
        else delete body.status; // manager attempted to publish → ignored
      } else {
        delete body.status;
      }
    }
    if (!canApprove && !isStatusOnly) {
      body.status = 'pending';
    }
    const property = await updateProperty(slug, body);
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json(property);
  } catch (error) {
    console.error('Error updating property:', error);
    const message = error instanceof Error ? error.message : 'Failed to update property';
    return NextResponse.json({ error: message }, { status: 400 });
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
  } catch (error) {
    console.error('Error deleting property:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete property';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
