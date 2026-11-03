import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import BuilderHeader from '@/components/builder-page/BuilderHeader';
import BuilderProjectsList from '@/components/builder-page/BuilderProjectsList';
import { BUILDER_SLUG_MAP, getBuilderYears, getBuilderLogo, getBuilderBanner } from '@/lib/builder-slugs';
import { getSeoOverride, keywordsToArray } from '@/lib/seo-store';
import { CITY_PAGES, areaName, developerName, developerSlug, getPublicListings } from '@/lib/seo/listings';
import { JsonLd, breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { SITE_NAME, absoluteUrl, clampText } from '@/lib/seo/site';
import type { Project } from '@/types/project';

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = new Set((await getPublicListings()).map(developerSlug).filter((s): s is string => Boolean(s)));
  return Array.from(slugs).map((slug) => ({ slug }));
}

// /builders/pune etc. list a city's projects. They duplicate /locations/[city],
// so they stay available for users but are noindexed and canonicalised there.
const LOCATION_SLUGS = ['pune', 'mumbai', 'kdmc'];

const normalize = (str: string) =>
  str.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/\s+/g, '');

/** Live projects for a builder slug (or a city slug), read from the data store. */
async function projectsForSlug(slug: string): Promise<Project[]> {
  const decodedSlug = decodeURIComponent(slug).toLowerCase();
  const builderPatterns = BUILDER_SLUG_MAP[decodedSlug];
  const listings = await getPublicListings();

  return listings.filter((p) => {
    const devName0 = developerName(p);
    if (!devName0) return false;

    if (LOCATION_SLUGS.includes(decodedSlug)) {
      return p.location?.toLowerCase() === decodedSlug;
    }

    if (builderPatterns) {
      const devName = normalize(devName0);
      return builderPatterns.some((pattern) => {
        const normPattern = normalize(pattern);
        return devName.includes(normPattern) || normPattern.includes(devName);
      });
    }

    return false;
  });
}

function builderDisplayName(slug: string, projects: Project[]): string {
  return developerName(projects[0]) || slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const key = decodeURIComponent(slug).toLowerCase();
  const projects = await projectsForSlug(key);
  if (!projects.length) return { title: 'Developer not found', robots: { index: false, follow: false }, alternates: { canonical: null } };

  if (LOCATION_SLUGS.includes(key)) {
    const name = CITY_PAGES[key]?.name || key;
    return {
      title: `Builders & Projects in ${name}`,
      alternates: { canonical: `/locations/${key}` },
      robots: { index: false, follow: true },
    };
  }

  const name = builderDisplayName(key, projects);
  const canonical = `/builders/${key}`;
  const override = await getSeoOverride(canonical);
  const areas = Array.from(new Set(projects.map(areaName).filter(Boolean))).slice(0, 4);
  const cities = Array.from(new Set(projects.map((p) => p.fullLocation?.city).filter(Boolean))).slice(0, 3);

  const title = override?.title?.trim() || `${name} Projects in ${cities.join(' & ') || 'Maharashtra'}`;
  const description =
    override?.description?.trim() ||
    clampText(
      `Explore ${projects.length} ${name} project${projects.length === 1 ? '' : 's'}` +
        `${areas.length ? ` in ${areas.join(', ')}` : ''}. ` +
        'Compare configurations, prices, RERA details and possession dates.',
      160,
    );
  const keywords = keywordsToArray(override?.keywords);
  const image = absoluteUrl(projects.find((p) => p.image)?.image);

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: 'en_IN',
      url: canonical,
      title,
      description,
      images: image ? [{ url: image, alt: `${name} project` }] : undefined,
    },
    twitter: { card: 'summary_large_image', title, description, images: image ? [image] : undefined },
  };
}

export default async function BuilderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).toLowerCase();
  const initialProjects = await projectsForSlug(decodedSlug);

  if (initialProjects.length === 0) {
    notFound();
  }

  // ✅ Compute these values on the SERVER, then pass as plain data props
  const builderName = builderDisplayName(decodedSlug, initialProjects);
  const logo = getBuilderLogo(builderName);
  const banner = getBuilderBanner(builderName);
  const years = getBuilderYears(builderName);
  const isLocation = LOCATION_SLUGS.includes(decodedSlug);

  return (
    <main className="min-h-screen bg-gray-50">
      {!isLocation && (
        <JsonLd
          data={breadcrumbJsonLd([
            { name: 'Builders', path: '/builders' },
            { name: builderName, path: `/builders/${decodedSlug}` },
          ])}
        />
      )}
      <Suspense fallback={<div className="h-64 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005E60]"></div></div>}>
        <BuilderHeader
          slug={decodedSlug}
          projects={initialProjects}
          builderName={builderName}
          logo={logo}
          banner={banner}
          years={years}
        />
      </Suspense>

      <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005E60]"></div></div>}>
        <BuilderProjectsList initialSlug={decodedSlug} initialProjects={initialProjects} />
      </Suspense>
    </main>
  );
}
