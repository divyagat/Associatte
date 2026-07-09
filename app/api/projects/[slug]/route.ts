// app/api/projects/[slug]/route.ts

import { NextResponse } from 'next/server';
import { getProjectBySlug, updateProject, deleteProject } from '@/lib/data-store';

// ✅ Helper to handle both Next.js 14 (Object) and Next.js 15 (Promise)
async function getParams(params: any) {
  return params instanceof Promise ? await params : params;
}

export async function GET(request: Request, { params }: { params: any }) {
  const { slug } = await getParams(params);
  console.log('📥 GET /api/projects/[slug] - Slug:', slug);
  
  try {
    const project = await getProjectBySlug(slug);
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    return NextResponse.json(project);
  } catch (error) {
    console.error('❌ Error in GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: any }) {
  const { slug } = await getParams(params);
  console.log('📥 PUT /api/projects/[slug] - Slug:', slug);
  
  try {
    const data = await request.json();
    const projectData = { ...data, soldOut: data.soldOut !== undefined ? data.soldOut : false };
    const project = await updateProject(slug, projectData);
    
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    return NextResponse.json(project);
  } catch (error: any) {
    console.error('❌ Error in PUT:', error);
    return NextResponse.json({ error: error.message || 'Failed to update project' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: any }) {
  const { slug } = await getParams(params);
  console.log('📥 DELETE /api/projects/[slug] - Slug:', slug);
  
  if (!slug) {
    return NextResponse.json({ error: 'Slug parameter is missing' }, { status: 400 });
  }

  try {
    const deleted = await deleteProject(slug);
    
    if (!deleted) {
      console.warn(`⚠️ deleteProject returned false for slug: "${slug}". Check your @/lib/data-store.`);
      return NextResponse.json({ error: `Project not found with slug: "${slug}"` }, { status: 404 });
    }
    
    console.log('✅ Project deleted successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Error in DELETE:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}