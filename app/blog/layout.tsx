// app/blog/layout.tsx
// SEO for the blog LISTING page (/blog). The blog listing is a Client Component,
// so its metadata lives here. Individual posts (/blog/[slug]) set their own
// deeper metadata, which overrides this for those routes.
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo-pages';

export const dynamic = 'force-dynamic';

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata('/blog');
}

export default function BlogListingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
