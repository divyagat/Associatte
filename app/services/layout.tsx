// app/services/layout.tsx
// The Services page is a Client Component, so its SEO lives in this server
// layout: default from the SEO_PAGES registry, merged with any admin override.
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo-pages';

export const dynamic = 'force-dynamic';

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata('/services');
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
