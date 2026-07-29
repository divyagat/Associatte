import { NextRequest, NextResponse } from 'next/server';
import { getAllBlogs, createBlog } from '@/lib/data-store';
import { getPermissionsFromRequest } from '@/lib/admin-auth';
import { can } from '@/lib/admin-permissions';

export async function GET() {
  try {
    const blogs = await getAllBlogs();
    return NextResponse.json(blogs);
  } catch (error: any) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch blogs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!can(getPermissionsFromRequest(request), 'blogs', 'add')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  try {
    const body = await request.json();
    
    // 1. Ensure a slug exists (generate from title if the frontend didn't provide one)
    let baseSlug = body.slug;
    if (!baseSlug && body.title) {
      baseSlug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
        .replace(/(^-|-$)/g, '');    // Remove leading/trailing hyphens
    }

    // 2. Check for uniqueness and append a counter if needed
    let finalSlug = baseSlug;
    let counter = 1;
    
    // Note: If your data-store has a `getBlogBySlug(slug)` function, use that instead 
    // of getAllBlogs() for better performance on large datasets.
    const existingBlogs = await getAllBlogs(); 
    
    while (existingBlogs.some((blog: any) => blog.slug === finalSlug)) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    // 3. Pass the guaranteed-unique slug to createBlog
    const blog = await createBlog({ ...body, slug: finalSlug });
    
    return NextResponse.json(blog, { status: 201 });
  } catch (error: any) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ error: error.message || 'Failed to create blog' }, { status: 400 });
  }
}