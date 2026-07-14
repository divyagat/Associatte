// app/api/projects/[slug]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getProjectBySlug, updateProject, deleteProject } from '@/lib/data-store';
import { getPermissionsFromRequest } from '@/lib/admin-auth';
import { can } from '@/lib/admin-permissions';

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
    
    // Ensure soldOut is preserved
    const projectData = {
      ...data,
      soldOut: data.soldOut !== undefined ? data.soldOut : false
    };
    
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