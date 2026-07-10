// app/api/projects/[slug]/route.ts

import { NextResponse } from 'next/server';
import { getProjectBySlug, updateProject, deleteProject } from '@/lib/data-store';

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
  request: Request,
  { params }: { params: Promise<{ slug: string }> } // ← Changed to Promise
) {
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
  request: Request,
  { params }: { params: Promise<{ slug: string }> } // ← Changed to Promise
) {
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