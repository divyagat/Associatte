import { Metadata } from 'next';
import ProjectCard from '@/components/builder-page/ProjectCard';
import properties from '../../data/properties.json';

export const metadata: Metadata = {
  title: 'Properties | Residential, Commercial, Plots & More | Associatte PropTech',
  description: 'Explore Residential, Commercial, Pre-Launch, Ready-to-Move, Rent & Plot properties in Pune, Mumbai & KDMC. Filter by type, location, budget & more.',
  keywords: ['properties', 'residential', 'commercial', 'plots', 'rent', 'Pune', 'Mumbai', 'KDMC', 'real estate'],
};

// ✅ Property Type Configuration (matches your Hero tabs)
const PROPERTY_TYPES = [
  { id: 'residential', label: 'Residential', color: '#005E60' },
  { id: 'commercial', label: 'Commercial', color: '#8B0000' },
  { id: 'pre-launch', label: 'Pre-Launch', color: '#F8C21C' },
  { id: 'ready', label: 'Ready', color: '#005E60' },
  { id: 'rent', label: 'Rent', color: '#8B0000' },
  { id: 'plots', label: 'Plots', color: '#F8C21C' },
] as const;

export type PropertyType = typeof PROPERTY_TYPES[number]['id'];

// ✅ Helper: Determine property type from project data
const getPropertyType = (project: any): PropertyType => {
  if (project.propertyType) return project.propertyType;
  const configs = project.priceDetails?.configurations || [];
  const hasPlot = configs.some((c: any) => c.type?.toLowerCase().includes('plot'));
  const hasCommercial = configs.some((c: any) =>
    c.type?.toLowerCase().includes('office') || c.type?.toLowerCase().includes('shop')
  );
  const isReady = project.possessionDate?.toLowerCase().includes('ready');
  const isPreLaunch = project.possessionDate && new Date(project.possessionDate) > new Date('2027-12-31');
  if (hasPlot) return 'plots';
  if (hasCommercial) return 'commercial';
  if (isReady) return 'ready';
  if (isPreLaunch) return 'pre-launch';
  return 'residential';
};

// ✅ Get unique filter values
const getAllLocations = () => Array.from(new Set(properties.map((p: any) => p.location).filter(Boolean)));
const getAllBuilders = () => Array.from(new Set(properties.map((p: any) => p.developer?.name).filter(Boolean)));
const getAllBHKs = () => {
  const bhks = new Set<string>();
  properties.forEach((p: any) => {
    p.priceDetails?.configurations?.forEach((c: any) => {
      if (c.type) {
        const bhk = c.type.match(/\d+\s*[RB]HK/i)?.[0];
        if (bhk) bhks.add(bhk.toUpperCase());
      }
    });
  });
  return Array.from(bhks).sort();
};

export default async function PropertiesPage({
  searchParams
}: {
  searchParams: Promise<{
    type?: string;
    q?: string;
    location?: string;
    builder?: string;
    bhk?: string;
    minPrice?: string;
    maxPrice?: string;
  }>
}) {
  const params = await searchParams;
  const activeType = (params.type as PropertyType) || 'residential';

  // 🔍 Filter projects by type + other params
  const filteredProjects = properties.filter((project: any) => {
    const projectType = getPropertyType(project);
    if (activeType && projectType !== activeType) return false;

    if (params.q) {
      const query = params.q.toLowerCase();
      const matchesName = project.name?.toLowerCase().includes(query);
      const matchesLocation = project.fullLocation?.area?.toLowerCase().includes(query) ||
        project.location?.toLowerCase().includes(query);
      const matchesBuilder = project.developer?.name?.toLowerCase().includes(query);
      if (!matchesName && !matchesLocation && !matchesBuilder) return false;
    }

    if (params.location && project.location?.toLowerCase() !== params.location.toLowerCase()) {
      return false;
    }

    if (params.builder) {
      const builderPattern = params.builder.toLowerCase();
      const projectName = project.developer?.name?.toLowerCase() || '';
      if (!projectName.includes(builderPattern) && !builderPattern.includes(projectName)) {
        return false;
      }
    }

    if (params.bhk) {
      const bhkPattern = params.bhk.toLowerCase();
      const hasBHK = project.priceDetails?.configurations?.some((c: any) =>
        c.type?.toLowerCase().includes(bhkPattern)
      );
      if (!hasBHK) return false;
    }

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

  const typeCounts = PROPERTY_TYPES.reduce((acc, type) => {
    acc[type.id] = properties.filter(p => getPropertyType(p) === type.id).length;
    return acc;
  }, {} as Record<PropertyType, number>);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 🔹 Hero Section with Type Tabs */}
      <section className="bg-gradient-to-br from-[#005E60] to-[#004a4d] text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="page-title mb-4">Properties</h1>
          <p className="text-lg text-white/90 mb-6">
            Discover {filteredProjects.length} properties across Pune, Mumbai & KDMC
          </p>

          {/* 🔹 Property Type Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {PROPERTY_TYPES.map((type) => {
              const isActive = activeType === type.id;
              return (
                <a
                  key={type.id}
                  href={`/properties?type=${type.id}${params.location ? `&location=${params.location}` : ''}${params.builder ? `&builder=${params.builder}` : ''}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-white text-[#005E60] shadow-lg'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {type.label}
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    isActive ? 'bg-[#005E60]/10 text-[#005E60]' : 'bg-white/20'
                  }`}>
                    {typeCounts[type.id]}
                  </span>
                </a>
              );
            })}
          </div>

          {/* 🔍 Search & Filters Form */}
          <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
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

            <button type="submit" className="lg:col-span-6 px-6 py-3 bg-[#F8C21C] text-[#8B0000] font-semibold rounded-xl hover:bg-[#d4a017] transition-colors">
              Filter Properties
            </button>
          </form>

          {/* Active Filters */}
          {(params.q || params.location || params.builder || params.bhk) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {params.q && <span className="px-3 py-1 bg-white/10 rounded-full text-sm">Search: "{params.q}" <a href={`/properties?type=${activeType}`} className="hover:text-[#F8C21C]">×</a></span>}
              {params.location && <span className="px-3 py-1 bg-white/10 rounded-full text-sm">Location: {params.location} <a href={`/properties?type=${activeType}`} className="hover:text-[#F8C21C]">×</a></span>}
              {params.builder && <span className="px-3 py-1 bg-white/10 rounded-full text-sm">Builder: {params.builder} <a href={`/properties?type=${activeType}`} className="hover:text-[#F8C21C]">×</a></span>}
              {params.bhk && <span className="px-3 py-1 bg-white/10 rounded-full text-sm">BHK: {params.bhk} <a href={`/properties?type=${activeType}`} className="hover:text-[#F8C21C]">×</a></span>}
            </div>
          )}
        </div>
      </section>

      {/* 🔹 Stats Bar */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap justify-center gap-6 text-sm">
          <span className="flex items-center gap-2 text-gray-600"><span className="w-2 h-2 rounded-full bg-[#005E60]"></span><strong className="text-gray-900">{filteredProjects.length}</strong> {activeType.charAt(0).toUpperCase() + activeType.slice(1)} Properties</span>
          <span className="flex items-center gap-2 text-gray-600"><span className="w-2 h-2 rounded-full bg-[#F8C21C]"></span><strong className="text-gray-900">{locations.length}</strong> Locations</span>
          <span className="flex items-center gap-2 text-gray-600"><span className="w-2 h-2 rounded-full bg-[#8B0000]"></span><strong className="text-gray-900">{builders.length}</strong> Builders</span>
        </div>
      </section>

      {/* 🔹 Properties Grid */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg mb-4">No {activeType} properties match your filters.</p>
              <a href={`/properties?type=${activeType}`} className="text-[#005E60] hover:underline">Clear all filters</a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProjects.map((project: any) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}