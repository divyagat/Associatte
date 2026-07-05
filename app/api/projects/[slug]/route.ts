import { NextResponse } from 'next/server';
import { getProjectBySlug, updateProject, deleteProject } from '@/lib/data-store';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  try {
    const data = await request.json();
    // Ensure soldOut is preserved
    const projectData = {
      ...data,
      soldOut: data.soldOut !== undefined ? data.soldOut : false
    };
    const project = await updateProject(params.slug, projectData);
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(project);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
  const deleted = await deleteProject(params.slug);
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}