// app/projects/[slug]/page.tsx
//
// Legacy duplicate of the project detail page. Every project now has exactly
// one canonical URL — /property/[slug] — so published listings permanently
// redirect (308) there. Unknown slugs return a real 404 (no fuzzy name
// matching, which previously let /projects/mantra serve an arbitrary project).
//
// This route is also the admin preview for unpublished (pending/hidden)
// listings: a signed-in main admin sees the page, everyone else gets a 404.

import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { isPubliclyVisible } from '@/lib/visibility';
import { getAdminRole } from '@/lib/admin-auth';
import { cityKey, findListingBySlug, listingPath } from '@/lib/seo/listings';
import PropertyPageClient from '../../property/[slug]/PropertyPageClient';

export const metadata: Metadata = {
  title: 'Project preview',
  robots: { index: false, follow: false },
};

export default async function LegacyProjectRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await findListingBySlug(slug);
  if (!project) notFound();

  if (!isPubliclyVisible(project)) {
    if ((await getAdminRole()) === 'admin') {
      return <PropertyPageClient initialProject={project} initialSimilar={[]} cityPage={cityKey(project)} />;
    }
    notFound();
  }

  permanentRedirect(listingPath(project));
}
