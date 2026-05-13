// client/components/builder-page/BuilderProjectsList.tsx
'use client';

import BuilderHero from './BuilderHero';
import BuilderProjects from './BuilderProjects'; // ✅ For /builders/[slug] - shows projects
// import BuilderSearchContainer from './BuilderSearchContainer'; // ✅ For /builders - shows builder cards

interface BuilderProjectsListProps {
  initialSlug: string;
  initialProjects?: any[];
}

export default function BuilderProjectsList({ 
  initialSlug, 
  initialProjects = [] 
}: BuilderProjectsListProps) {
  
  const projects = Array.isArray(initialProjects) ? initialProjects : [];
  const isLocationPage = ['pune', 'mumbai', 'kdmc'].includes(initialSlug);
  
  // 🔍 Debug
  if (process.env.NODE_ENV === 'development') {
    console.log('[BuilderProjectsList]', { 
      slug: initialSlug, 
      isLocationPage, 
      projectCount: projects.length 
    });
  }
  
  if (projects.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-lg mb-4">No projects found.</p>
        <a href="/builders" className="text-[#005E60] hover:underline">← Back to builders</a>
      </div>
    );
  }
  
  // ✅ Builder detail page (/builders/[slug]) → Show projects with BuilderProjects
  if (!isLocationPage) {
    return (
      <>
        <BuilderHero 
          builderName={projects[0]?.developer?.name || initialSlug} 
          projectCount={projects.length}
          slug={initialSlug}
        />
        <BuilderProjects slug={initialSlug} projects={projects} />
      </>
    );
  }
  
  // ✅ Location page (/builders?location=pune) → Show builder cards (if needed)
  // Uncomment if you want location-based builder listing:
  /*
  return (
    <BuilderSearchContainer 
      initialBuilders={transformProjectsToBuilders(projects)} 
      initialQuery="" 
      initialLocation={initialSlug} 
    />
  );
  */
  
  // Default fallback
  return <BuilderProjects slug={initialSlug} projects={projects} />;
}

// Optional: Helper to transform projects → builder summaries (if needed for location pages)
/*
const transformProjectsToBuilders = (projects: any[]) => {
  const map = new Map();
  projects.forEach(p => {
    const name = p.developer?.name;
    if (!name) return;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    if (!map.has(slug)) {
      map.set(slug, {
        id: slug, name, slug, years: '10y +',
        logo: `/logos/${slug}.png`, totalProjects: 0, locations: [] as string[],
      });
    }
    const b = map.get(slug);
    b.totalProjects += 1;
    if (p.location && !b.locations.includes(p.location)) b.locations.push(p.location);
  });
  return Array.from(map.values());
};
*/