// app/blog/page.tsx
//
// Blog listing. Posts (static + admin-created) are loaded on the server so every
// article link is in the initial HTML; metadata lives in app/blog/layout.tsx.

import { getPublicBlogs } from '@/lib/seo/blogs';
import { JsonLd, breadcrumbJsonLd } from '@/lib/seo/jsonld';
import BlogListingClient from './BlogListingClient';

export const revalidate = 300;

export default async function BlogListingPage() {
  const blogs = await getPublicBlogs();
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Blog', path: '/blog' }])} />
      <BlogListingClient initialBlogs={blogs} />
    </>
  );
}
