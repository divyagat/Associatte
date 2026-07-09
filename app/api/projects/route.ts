// app/api/projects/route.ts

import { NextResponse } from 'next/server';
import { getAllProjects } from '@/lib/data-store';

export async function GET() {
  try {
    console.log('📡 GET /api/projects - Fetching all projects');
    const projects = await getAllProjects();
    
    // ✅ Ensure we always return an array
    const projectsArray = Array.isArray(projects) ? projects : [];
    
    console.log(`📡 Returning ${projectsArray.length} projects`);
    
    return NextResponse.json(projectsArray);
  } catch (error) {
    console.error('❌ Error in GET /api/projects:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('📦 POST /api/projects - Creating project:', data);
    
    // Validate required fields
    if (!data.name) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      );
    }
    
    if (!data.slug) {
      return NextResponse.json(
        { error: 'Project slug is required' },
        { status: 400 }
      );
    }
    
    // Add the project
    const { createProject } = await import('@/lib/data-store');
    const newProject = await createProject(data);
    
    console.log('✅ Project created successfully:', newProject.slug);
    return NextResponse.json(newProject, { status: 201 });
  } catch (error: any) {
    console.error('❌ Error in POST /api/projects:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create project' },
      { status: 400 }
    );
  }
}