// app/locations/layout.tsx
// Metadata for the /locations index (a Client Component). City pages
// (/locations/[city]) set their own metadata in their layout, which overrides this.
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo-pages';

export const revalidate = 300;

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata('/locations');
}

export default function LocationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
