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
    const blog = await createBlog(body);
    return NextResponse.json(blog, { status: 201 });
  } catch (error: any) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ error: error.message || 'Failed to create blog' }, { status: 400 });
  }
}