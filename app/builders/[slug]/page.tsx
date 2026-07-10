import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import BuilderHeader from '@/components/builder-page/BuilderHeader';
import BuilderProjectsList from '@/components/builder-page/BuilderProjectsList';
import properties from '../../../data/properties.json';
import { BUILDER_SLUG_MAP, getBuilderYears, getBuilderLogo, getBuilderBanner } from '@/lib/builder-slugs';

// ✅ ADD THIS: Forces dynamic rendering to bypass useSearchParams() prerender errors
export const dynamic = 'force-dynamic';

const LOCATION_SLUGS = ['pune', 'mumbai', 'kdmc'];

const normalize = (str: string) => 
  str.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/\s+/g, '');

// ❌ REMOVED generateStaticParams() - conflicts with force-dynamic

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