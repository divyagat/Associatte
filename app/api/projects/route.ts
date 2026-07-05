import { NextResponse } from 'next/server';
import { getAllProjects, createProject } from '@/lib/data-store';

export async function GET() {
  const projects = await getAllProjects();
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    // Ensure soldOut defaults to false if not provided
    const projectData = {
      ...data,
      soldOut: data.soldOut || false
    };
    const project = await createProject(projectData);
    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}