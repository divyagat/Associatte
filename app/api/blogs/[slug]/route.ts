import { NextRequest, NextResponse } from 'next/server';
import { getBlogBySlug, updateBlog, deleteBlog } from '@/lib/data-store';
import { getRoleFromRequest } from '@/lib/admin-auth';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const blog = await getBlogBySlug(slug);
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    return NextResponse.json(blog);
  } catch (error: any) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch blog' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  if (getRoleFromRequest(request) !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const { slug } = await context.params;
    const body = await request.json();
    const blog = await updateBlog(slug, body);
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    return NextResponse.json(blog);
  } catch (error: any) {
    console.error('Error updating blog:', error);
    return NextResponse.json({ error: error.message || 'Failed to update blog' }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  if (getRoleFromRequest(request) !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const { slug } = await context.params;
    const success = await deleteBlog(slug);
    if (!success) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting blog:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete blog' }, { status: 500 });
  }
}
