import { NextRequest, NextResponse } from 'next/server';
import { getBlogBySlug, updateBlog, deleteBlog, getAllBlogs } from '@/lib/data-store';
import { getPermissionsFromRequest } from '@/lib/admin-auth';
import { can } from '@/lib/admin-permissions';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    
    console.log(`\n🔍 ========== GET /api/blogs/${slug} ==========`);
    console.log(`🔍 Searching for blog with slug: "${slug}"`);
    
    // Try to get from database/data-store
    try {
      const blog = await getBlogBySlug(slug);
      if (blog) {
        console.log(`✅ Found blog in database: ${blog.title}`);
        console.log(`✅ Blog data:`, JSON.stringify(blog, null, 2));
        return NextResponse.json(blog);
      } else {
        console.log(`⚠️ getBlogBySlug returned null/undefined`);
      }
    } catch (error) {
      console.error('❌ getBlogBySlug failed:', error);
    }
    
    // Fallback: search through all blogs
    try {
      const allBlogs = await getAllBlogs();
      console.log(`📋 Total blogs in database: ${allBlogs.length}`);
      console.log(`📋 Available slugs:`, allBlogs.map(b => b.slug).join(', '));
      
      const foundBlog = allBlogs.find((b) => b.slug === slug);
      if (foundBlog) {
        console.log(`✅ Found blog in getAllBlogs: ${foundBlog.title}`);
        return NextResponse.json(foundBlog);
      } else {
        console.log(`⚠️ Blog not found in getAllBlogs`);
      }
    } catch (error) {
      console.error('❌ getAllBlogs failed:', error);
    }
    
    console.log(`❌ Blog not found with slug: "${slug}"`);
    console.log(`=========================================\n`);
    return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    
  } catch (error: any) {
    console.error('❌ Error in GET /api/blogs/[slug]:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch blog' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  if (!can(getPermissionsFromRequest(request), 'blogs', 'edit')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const { slug } = await context.params;
    const body = await request.json();
    
    console.log(`\n📝 ========== PUT /api/blogs/${slug} ==========`);
    console.log(`📝 Updating blog: "${slug}"`);
    console.log(`📝 Request body:`, JSON.stringify(body, null, 2));
    
    // First check if blog exists
    const existingBlog = await getBlogBySlug(slug);
    if (!existingBlog) {
      console.log(`❌ Blog not found for update: "${slug}"`);
      console.log(`=========================================\n`);
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    
    console.log(`✅ Found existing blog: ${existingBlog.title}`);
    
    // Update the blog
    const blog = await updateBlog(slug, body);
    if (!blog) {
      console.log(`❌ updateBlog returned null/undefined`);
      console.log(`=========================================\n`);
      return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
    }
    
    console.log(`✅ Blog updated successfully: ${blog.title}`);
    console.log(`=========================================\n`);
    return NextResponse.json(blog);
    
  } catch (error: any) {
    console.error('❌ Error in PUT /api/blogs/[slug]:', error);
    console.log(`=========================================\n`);
    return NextResponse.json({ error: error.message || 'Failed to update blog' }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  if (!can(getPermissionsFromRequest(request), 'blogs', 'delete')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const { slug } = await context.params;

    console.log(`\n🗑️ ========== DELETE /api/blogs/${slug} ==========`);
    console.log(`🗑️ Deleting blog: "${slug}"`);
    
    const success = await deleteBlog(slug);
    if (!success) {
      console.log(`❌ Blog not found for deletion: "${slug}"`);
      console.log(`=========================================\n`);
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    
    console.log(`✅ Blog deleted successfully: "${slug}"`);
    console.log(`=========================================\n`);
    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error('❌ Error in DELETE /api/blogs/[slug]:', error);
    console.log(`=========================================\n`);
    return NextResponse.json({ error: error.message || 'Failed to delete blog' }, { status: 500 });
  }
}