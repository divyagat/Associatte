// app/property/[slug]/page.tsx
//
// Canonical project detail page. Loads the listing on the server (MongoDB via
// the data store) so the H1, specs and links are in the initial HTML, returns a
// real 404 for unknown slugs, and decides indexability from listing quality.

import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { isPubliclyVisible } from '@/lib/visibility';
import { getSeoOverride, keywordsToArray } from '@/lib/seo-store';
import {
  CITY_PAGES,
  areaName,
  bhkSummary,
  cityKey,
  cleanPrice,
  findListingBySlug,
  getPublicListings,
  listingDescription,
  listingEligibility,
  listingJsonLd,
  listingPath,
  listingTitle,
} from '@/lib/seo/listings';
import { JsonLd, breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { SITE_NAME, absoluteUrl } from '@/lib/seo/site';
import type { Project } from '@/types/project';
import PropertyPageClient from './PropertyPageClient';

export const revalidate = 300;

// Prerender every live listing; new ones render on first request and are cached.
export async function generateStaticParams() {
  return (await getPublicListings()).map((p) => ({ slug: p.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await findListingBySlug(slug);
  if (!project) {
    return { title: 'Project not found', robots: { index: false, follow: false }, alternates: { canonical: null } };
  }

  const path = listingPath(project);
  const publicListings = await getPublicListings();
  const { indexable } = listingEligibility(project, publicListings);
  const override = await getSeoOverride(path);

  const title = override?.title?.trim() || `${listingTitle(project)} | Associatte`;
  const description = override?.description?.trim() || listingDescription(project);
  const keywords = keywordsToArray(override?.keywords);
  const image = absoluteUrl(project.image);

  return {
    title: { absolute: title },
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: path },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: 'en_IN',
      url: path,
      title,
      description,
      images: image ? [{ url: image, alt: `${project.name} – project photo` }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

/** Similar listings in the same city (same area first), in the shape the client renders. */
function similarFor(project: Project, all: Project[]) {
  const key = cityKey(project);
  const area = areaName(project).toLowerCase();
  return all
    .filter((p) => p.slug !== project.slug && key && cityKey(p) === key)
    .sort((a, b) => Number(areaName(b).toLowerCase() === area) - Number(areaName(a).toLowerCase() === area))
    .slice(0, 3)
    .map((p) => ({
      slug: p.slug,
      title: p.name,
      location: [areaName(p), p.fullLocation?.city].filter(Boolean).join(', '),
      bhk: bhkSummary(p) || (p.priceDetails?.configurations || []).map((c) => c.type).join(', ') || 'TBA',
      area: p.priceDetails?.configurations?.[0]?.area || 'TBA',
      price: cleanPrice(p.priceDetails?.range?.split(' - ')[0] || p.price),
      image: p.image,
    }));
}

export default async function PropertyPage({ params }: Params) {
  const { slug } = await params;
  const project = await findListingBySlug(slug);
  if (!project) notFound();

  // One URL per listing: /property/Mantra-One → /property/mantra-one (308).
  if (project.slug !== slug) permanentRedirect(listingPath(project));

  // Pending/hidden listings 404 here (this page is cached, so it never reads
  // cookies). Admins preview unpublished listings at /projects/[slug].
  if (!isPubliclyVisible(project)) notFound();

  const publicListings = await getPublicListings();
  const key = cityKey(project);
  const breadcrumb = breadcrumbJsonLd([
    ...(key ? [{ name: `Properties in ${CITY_PAGES[key].name}`, path: `/locations/${key}` }] : []),
    { name: project.name, path: listingPath(project) },
  ]);

  return (
    <>
      <JsonLd data={listingJsonLd(project, { breadcrumb })} />
      <PropertyPageClient
        initialProject={project}
        initialSimilar={similarFor(project, publicListings)}
        cityPage={key}
      />
    </>
  );
}
