import { NextRequest, NextResponse } from 'next/server';
import { getAllBlogs, createBlog } from '@/lib/data-store';
import { getPermissionsFromRequest } from '@/lib/admin-auth';
import { can } from '@/lib/admin-permissions';
import type { IBlog } from '@/lib/models/Blog';

export async function GET() {
  try {
    const blogs = await getAllBlogs();
    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch blogs';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!can(getPermissionsFromRequest(request), 'blogs', 'add')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body: Partial<IBlog> = await request.json();

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

    while (existingBlogs.some((blog) => blog.slug === finalSlug)) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    // 3. Pass the guaranteed-unique slug to createBlog
    const blog = await createBlog({ ...body, slug: finalSlug });

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    const message = error instanceof Error ? error.message : 'Failed to create blog';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}