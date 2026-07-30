// app/api/projects/[slug]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getProjectBySlug, updateProject, deleteProject } from '@/lib/data-store';
import { getPermissionsFromRequest, getRoleFromRequest } from '@/lib/admin-auth';
import { can } from '@/lib/admin-permissions';
import { sanitizeStatus, allowedStatusTargets } from '@/lib/visibility';

// ✅ GET - Fixed for Next.js 15/16
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> } // ← Changed to Promise
) {
  const { slug } = await params; // ← Await the params
  console.log('📥 GET /api/projects/[slug] - Slug:', slug);
  
  try {
    const project = await getProjectBySlug(slug);
    
    console.log('📤 Project found:', !!project);
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(project);
  } catch (error) {
    console.error('❌ Error in GET /api/projects/[slug]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ✅ PUT - Fixed for Next.js 15/16
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> } // ← Changed to Promise
) {
  if (!can(getPermissionsFromRequest(request), 'projects', 'edit')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { slug } = await params; // ← Await the params
  console.log('📥 PUT /api/projects/[slug] - Slug:', slug);
  
  try {
    const data = await request.json();
    console.log('📦 Update data:', data);
    
    // Merge only the keys that were actually sent so partial updates (e.g. a
    // status-only approve/hide action) don't clobber existing fields.
    const projectData: any = { ...data };
    // Full form saves send `soldOut`; default it there. Absent = leave as-is.
    if ('soldOut' in data) {
      projectData.soldOut = data.soldOut !== undefined ? data.soldOut : false;
    }

    // Two-stage approval. A main admin may set any status. A manager may only
    // advance a submission to `manager_approved` (stage-1 approval) or hide it —
    // publishing is the admin's exclusive final gate. A non-approver's content
    // edit re-enters the pending queue and any `status` they send is ignored.
    const isAdmin = getRoleFromRequest(request) === 'admin';
    const isManager = !isAdmin && can(getPermissionsFromRequest(request), 'projects', 'approve');
    const canApprove = isAdmin || isManager;
    const isStatusOnly = 'status' in data && Object.keys(data).length === 1;
    if ('status' in data) {
      if (isAdmin) {
        projectData.status = sanitizeStatus(data.status, 'published');
      } else if (isManager) {
        const requested = sanitizeStatus(data.status, 'manager_approved');
        if (allowedStatusTargets('manager').includes(requested)) projectData.status = requested;
        else delete projectData.status; // manager attempted to publish → ignored
      } else {
        delete projectData.status;
      }
    } else {
      delete projectData.status;
    }
    if (!canApprove && !isStatusOnly) {
      projectData.status = 'pending';
    }

    const project = await updateProject(slug, projectData);
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    console.log('✅ Project updated successfully');
    return NextResponse.json(project);
  } catch (error: any) {
    console.error('❌ Error in PUT /api/projects/[slug]:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update project' },
      { status: 400 }
    );
  }
}

// ✅ DELETE - Fixed for Next.js 15/16
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> } // ← Changed to Promise
) {
  if (!can(getPermissionsFromRequest(request), 'projects', 'delete')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { slug } = await params; // ← Await the params
  console.log('📥 DELETE /api/projects/[slug] - Slug:', slug);
  
  try {
    const deleted = await deleteProject(slug);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    console.log('✅ Project deleted successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Error in DELETE /api/projects/[slug]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}