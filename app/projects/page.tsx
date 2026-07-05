import { Metadata } from 'next';
import BuilderProjectCard from '@/components/builder-page/BuilderProjectCard';
import { getAllProperties, getAllProjects } from '@/lib/data-store';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'All Projects | Associatte PropTech',
  description: 'Explore all premium residential & commercial projects in Pune, Mumbai & KDMC.',
  keywords: ['projects', 'Pune', 'Mumbai', 'KDMC', 'real estate', 'properties'],
};

// ✅ Helper function to normalize developer field
const normalizeDeveloper = (developer: any) => {
  if (!developer) return { name: '', established: '', projectsCount: 0, description: '' };
  if (typeof developer === 'string') {
    return { name: developer, established: '', projectsCount: 0, description: '' };
  }
  return developer;
};

// ✅ Helper function to normalize project data
const normalizeProject = (p: any) => ({
  ...p,
  developer: normalizeDeveloper(p.developer),
  soldOut: p.soldOut || false,
  amenities: p.amenities || [],
  floorPlans: p.floorPlans || [],
  nearbyPlaces: p.nearbyPlaces || [],
  emi: p.emi || {},
  masterPlan: p.masterPlan || '',
  locationMap: p.locationMap || '',
  priceDetails: p.priceDetails || {
    range: '',
    perSqft: '',
    configurations: []
  }
});

export default async function ProjectsPage({
  searchParams
}: {
  searchParams: Promise<{
    q?: string;
    location?: string;
    builder?: string;
    bhk?: string;
    minPrice?: string;
    maxPrice?: string;
  }>
}) {
  const params = await searchParams;

  const [properties, projects] = await Promise.all([
    getAllProperties(),
    getAllProjects()
  ]);

  const allProjects = [
    ...projects.map(normalizeProject),
    ...properties.map(normalizeProject)
  ];

  // Remove duplicates based on slug
  const uniqueProjects = Array.from(
    new Map(allProjects.map(p => [p.slug, p])).values()
  );

  // ✅ Get unique values for filters
  const getAllLocations = () => Array.from(new Set(uniqueProjects.map((p: any) => p.location).filter(Boolean)));
  
  const getAllBuilders = () => Array.from(
    new Set(
      uniqueProjects
        .map((p: any) => p.developer?.name)
        .filter(Boolean)
    )
  );
  
  const getAllBHKs = () => {
    const bhks = new Set<string>();
    uniqueProjects.forEach((p: any) => {
      p.priceDetails?.configurations?.forEach((c: any) => {
        if (c.type) bhks.add(c.type.split(' ')[0] + ' BHK');
      });
    });
    return Array.from(bhks).sort();
  };

  // 🔍 Filter projects
  const filteredProjects = uniqueProjects.filter((project: any) => {
    const builderName = project.developer?.name || '';

    // Search query
    if (params.q) {
      const query = params.q.toLowerCase();
      const matchesName = project.name?.toLowerCase().includes(query);
      const matchesLocation = project.fullLocation?.area?.toLowerCase().includes(query) ||
        project.location?.toLowerCase().includes(query);
      const matchesBuilder = builderName.toLowerCase().includes(query);
      if (!matchesName && !matchesLocation && !matchesBuilder) return false;
    }

    // Location filter
    if (params.location && project.location?.toLowerCase() !== params.location.toLowerCase()) {
      return false;
    }

    // Builder filter
    if (params.builder) {
      const builderPattern = params.builder.toLowerCase();
      if (!builderName.toLowerCase().includes(builderPattern) && !builderPattern.includes(builderName.toLowerCase())) {
        return false;
      }
    }

    // BHK filter
    if (params.bhk) {
      const bhkPattern = params.bhk.toLowerCase();
      const hasBHK = project.priceDetails?.configurations?.some((c: any) =>
        c.type?.toLowerCase().includes(bhkPattern)
      );
      if (!hasBHK) return false;
    }

    // Price filter
    if (params.minPrice || params.maxPrice) {
      const priceText = project.priceDetails?.range || project.price || '';
      const priceNum = parseInt(priceText.replace(/[^0-9]/g, '')) * 100000;
      if (params.minPrice && priceNum < parseInt(params.minPrice)) return false;
      if (params.maxPrice && priceNum > parseInt(params.maxPrice)) return false;
    }

    return true;
  });

  const locations = getAllLocations();
  const builders = getAllBuilders();
  const bhks = getAllBHKs();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 🔹 Hero Section */}
      <section className="bg-[#101C2E] text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="page-title mb-4">All <span className="accent">Projects</span></h1>
          <p className="text-lg text-white/90 mb-6">
            Discover {filteredProjects.length} premium projects across Pune, Mumbai & KDMC
          </p>

          {/* 🔍 Search & Filters Form */}
          <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="lg:col-span-2 relative">
              <input
                type="text"
                name="q"
                placeholder="Search project, location, builder..."
                defaultValue={params.q}
                className="w-full px-4 py-3 pl-10 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#F8C21C]"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <select name="location" defaultValue={params.location}
              className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#F8C21C]">
              <option value="">All Locations</option>
              {locations.map(loc => <option key={loc} value={loc} className="text-gray-900">{loc}</option>)}
            </select>

            <select name="builder" defaultValue={params.builder}
              className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#F8C21C]">
              <option value="">All Builders</option>
              {builders.map(b => <option key={b} value={b} className="text-gray-900">{b}</option>)}
            </select>

            <select name="bhk" defaultValue={params.bhk}
              className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#F8C21C]">
              <option value="">All Configurations</option>
              {bhks.map(b => <option key={b} value={b} className="text-gray-900">{b}</option>)}
            </select>

            <button type="submit" className="lg:col-span-5 w-full btn-primary">
              Filter Projects
            </button>
          </form>

          {/* Active Filters */}
          {(params.q || params.location || params.builder || params.bhk) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {params.q && <span className="px-3 py-1 bg-white/10 rounded-full text-sm">Search: "{params.q}" <a href="/projects" className="hover:text-[#F8C21C]">×</a></span>}
              {params.location && <span className="px-3 py-1 bg-white/10 rounded-full text-sm">Location: {params.location} <a href="/projects" className="hover:text-[#F8C21C]">×</a></span>}
              {params.builder && <span className="px-3 py-1 bg-white/10 rounded-full text-sm">Builder: {params.builder} <a href="/projects" className="hover:text-[#F8C21C]">×</a></span>}
              {params.bhk && <span className="px-3 py-1 bg-white/10 rounded-full text-sm">BHK: {params.bhk} <a href="/projects" className="hover:text-[#F8C21C]">×</a></span>}
            </div>
          )}
        </div>
      </section>

      {/* 🔹 Stats Bar */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap justify-center gap-6 text-sm">
          <span className="flex items-center gap-2 text-gray-600"><span className="w-2 h-2 rounded-full bg-[#005E60]"></span><strong className="text-gray-900">{filteredProjects.length}</strong> Projects</span>
          <span className="flex items-center gap-2 text-gray-600"><span className="w-2 h-2 rounded-full bg-[#F8C21C]"></span><strong className="text-gray-900">{locations.length}</strong> Locations</span>
          <span className="flex items-center gap-2 text-gray-600"><span className="w-2 h-2 rounded-full bg-[#8B0000]"></span><strong className="text-gray-900">{builders.length}</strong> Builders</span>
        </div>
      </section>

      {/* 🔹 Projects Grid */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg mb-4">No projects match your filters.</p>
              <a href="/projects" className="text-[#005E60] hover:underline">Clear all filters</a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProjects.map((project: any) => (
                <BuilderProjectCard key={project.slug} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}