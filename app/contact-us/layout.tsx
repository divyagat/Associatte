// app/contact-us/layout.tsx
// The Contact Us page is a Client Component, so its SEO lives in this server
// layout: default from the SEO_PAGES registry, merged with any admin override.
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo-pages';

export const dynamic = 'force-dynamic';

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata('/contact-us');
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
