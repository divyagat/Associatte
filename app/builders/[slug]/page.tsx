// client/app/builders/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
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

// ✅ Builder Header Component
function BuilderHeader({ slug, projects }: { slug: string; projects: any[] }) {
  const firstProject = projects[0];
  const builderName = firstProject?.developer?.name || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const logo = getBuilderLogo(builderName);
  const banner = getBuilderBanner(builderName);
  const years = getBuilderYears(builderName);

  return (
    <div className="bg-gradient-to-br from-[#005E60] to-[#004a4d] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Builder Logo */}
          <div className="w-32 h-32 bg-white rounded-2xl p-6 shadow-xl flex items-center justify-center">
            <Image
              src={logo}
              alt={`${builderName} logo`}
              width={128}
              height={128}
              className="object-contain w-full h-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="w-full h-full rounded-xl bg-[#005E60] flex items-center justify-center">
                      <span class="text-white text-4xl font-bold">
                        ${builderName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  `;
                }
              }}
            />
          </div>

          {/* Builder Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl lg:text-4xl font-bold mb-3">{builderName}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
              <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <svg className="w-5 h-5 text-[#F8C21C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {years} Experience
              </span>
              <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <svg className="w-5 h-5 text-[#F8C21C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {projects.length} Projects
              </span>
            </div>
          </div>
        </div>
        
        {/* Optional Banner */}
        {banner && (
          <div className="mt-8 rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={banner}
              alt={`${builderName} banner`}
              width={1200}
              height={400}
              className="w-full h-48 md:h-64 object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
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

  return (
    <main className="min-h-screen bg-gray-50">
      <BuilderHeader slug={decodedSlug} projects={initialProjects} />
      <BuilderProjectsList initialSlug={decodedSlug} initialProjects={initialProjects} />
    </main>
  );
}