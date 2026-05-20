// app/builders/[slug]/page.tsx
import { notFound } from 'next/navigation';
import BuilderHeader from '@/components/builder-page/BuilderHeader';
import BuilderProjectsList from '@/components/builder-page/BuilderProjectsList';
import properties from '../../../data/properties.json';
import { BUILDER_SLUG_MAP, getBuilderYears, getBuilderLogo, getBuilderBanner } from '@/lib/builder-slugs';

const LOCATION_SLUGS = ['pune', 'mumbai', 'kdmc'];

const normalize = (str: string) => 
  str.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/\s+/g, '');

export function generateStaticParams() {
  const builderSlugs = Object.keys(BUILDER_SLUG_MAP);
  const allSlugs = Array.from(new Set([...builderSlugs, ...LOCATION_SLUGS]));
  return allSlugs.map((slug) => ({ slug }));
}

export default async function BuilderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).toLowerCase();
  const builderPatterns = BUILDER_SLUG_MAP[decodedSlug];
  
  const initialProjects = properties.filter((p: any) => {
    if (!p?.developer?.name) return false;
    
    if (LOCATION_SLUGS.includes(decodedSlug)) {
      return p.location?.toLowerCase() === decodedSlug;
    }
    
    if (builderPatterns) {
      const devName = normalize(p.developer.name);
      return builderPatterns.some(pattern => {
        const normPattern = normalize(pattern);
        return devName.includes(normPattern) || normPattern.includes(devName);
      });
    }
    
    return false;
  });
  
  if (initialProjects.length === 0) {
    notFound();
  }

  // ✅ Compute these values on the SERVER, then pass as plain data props
  const firstProject = initialProjects[0];
  const builderName = firstProject?.developer?.name || decodedSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const logo = getBuilderLogo(builderName);
  const banner = getBuilderBanner(builderName);
  const years = getBuilderYears(builderName);

  return (
    <main className="min-h-screen bg-gray-50">
      <BuilderHeader 
        slug={decodedSlug}
        projects={initialProjects}
        builderName={builderName}
        logo={logo}
        banner={banner}
        years={years}
      />
      <BuilderProjectsList initialSlug={decodedSlug} initialProjects={initialProjects} />
    </main>
  );
}