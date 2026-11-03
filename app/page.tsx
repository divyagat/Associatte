// app/page.tsx
//
// Homepage. Server wrapper around the interactive HomePageClient.
// Reading `searchParams` makes this route render per request, so the
// useSearchParams() calls inside the client tree resolve on the server and the
// hero, project sections and links are in the initial HTML. (As a statically
// prerendered page it bailed out to client-only rendering, so crawlers got an
// almost empty page.) `?city=` variants all canonicalise to "/".

import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo-pages';
import HomePageClient from '@/components/Home/HomePageClient';

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata('/');
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await searchParams;
  return <HomePageClient />;
}
