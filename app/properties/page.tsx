import { Metadata } from 'next';
import { Suspense } from 'react';
import ProjectCard from '@/components/builder-page/ProjectCard';
import PropertiesStickySearch from '@/components/properties/PropertiesStickySearch';
import { getAllProperties } from '@/lib/data-store';

// Read live from the file-based data store so anything added/edited in the admin
// panel shows up here immediately (no rebuild required).
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Properties | Residential, Commercial, Plots & More | Associatte PropTech',
  description: 'Explore Residential, Commercial, Pre-Launch, Ready-to-Move, Rent, Plot & Resale properties in Pune, Mumbai & KDMC. Filter by type, location, budget & more.',
  keywords: ['properties', 'residential', 'commercial', 'plots', 'rent', 'resale', 'Pune', 'Mumbai', 'KDMC', 'real estate'],
  // Consolidate all ?type=/?location= filter permutations onto one canonical URL.
  alternates: { canonical: '/properties' },
};

// ✅ Property Type Configuration (matches your Hero tabs)
const PROPERTY_TYPES = [
  { id: 'residential', label: 'Residential', color: '#005E60' },
  { id: 'commercial', label: 'Commercial', color: '#8B0000' },
  { id: 'pre-launch', label: 'Pre-Launch', color: '#F8C21C' },
  { id: 'ready', label: 'Ready', color: '#005E60' },
  { id: 'rent', label: 'Rent', color: '#8B0000' },
  { id: 'plots', label: 'Plots', color: '#F8C21C' },
  { id: 'resale', label: 'Resale', color: '#005E60' }, // ✅ Added Resale
] as const;

export type PropertyType = typeof PROPERTY_TYPES[number]['id'];

const VALID_PROPERTY_TYPES = PROPERTY_TYPES.map((t) => t.id) as readonly PropertyType[];

// ✅ Helper: Determine property type from project data.
// The admin form saves an explicit `category` (residential/commercial/pre-launch/
// ready/rent/plots/resale) — that is authoritative. Only when it's missing (e.g.
// older seed records) do we fall back to deriving a sensible bucket, so every nav
// option lands on the properties that actually belong to it.
const getPropertyType = (project: any): PropertyType => {
  // 1️⃣ Explicit category set in the admin panel wins.
  const explicit = String(project.category || project.propertyType || '').toLowerCase().trim();
  if ((VALID_PROPERTY_TYPES as readonly string[]).includes(explicit)) {
    return explicit as PropertyType;
  }

  // 2️⃣ Resale hints.
  if (
    project.isResale === true ||
    project.tags?.some((t: string) => t.toLowerCase() === 'resale')
  ) {
    return 'resale';
  }

  // 3️⃣ Derive from configurations + possession date.
  const configs = project.priceDetails?.configurations || [];
  const hasPlot = configs.some((c: any) => c.type?.toLowerCase().includes('plot'));
  const hasCommercial = configs.some((c: any) => {
    const t = c.type?.toLowerCase() || '';
    return t.includes('office') || t.includes('shop') || t.includes('commercial');
  });
  const possession = String(project.possessionDate || '').toLowerCase();
  const isReady = possession.includes('ready') || possession.includes('register');

  if (hasPlot) return 'plots';
  if (hasCommercial) return 'commercial';
  if (isReady) return 'ready';

  // Robustly pull a 4-digit year (handles messy values like "Dec 2029-30").
  const yearMatch = possession.match(/20\d{2}/);
  const year = yearMatch ? parseInt(yearMatch[0], 10) : null;
  if (year && year >= 2029) return 'pre-launch';

  return 'residential';
};

// ✅ Get unique filter values from the supplied list
const getAllLocations = (list: any[]) => Array.from(new Set(list.map((p: any) => p.location).filter(Boolean)));
const getAllBuilders = (list: any[]) => Array.from(new Set(list.map((p: any) => p.developer?.name).filter(Boolean)));
const getAllBHKs = (list: any[]) => {
  const bhks = new Set<string>();
  list.forEach((p: any) => {
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
    city?: string;
    location?: string;
    builder?: string;
    bhk?: string;
    minPrice?: string;
    maxPrice?: string;
  }>
}) {
  const params = await searchParams;
  const activeType = (params.type as PropertyType) || 'residential';
  // The Hero / StickySearchBar sends `city` (pune/mumbai/kdmc); treat it as a
  // location filter so global searches land on the right results.
  const cityFilter = params.city || params.location;

  // 📦 Live data from admin panel / data store
  const properties = await getAllProperties();

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

    if (cityFilter && project.location?.toLowerCase() !== cityFilter.toLowerCase()) {
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

  const locations = getAllLocations(properties);
  const builders = getAllBuilders(properties);
  const bhks = getAllBHKs(properties);

  const typeCounts = PROPERTY_TYPES.reduce((acc, type) => {
    acc[type.id] = properties.filter(p => getPropertyType(p) === type.id).length;
    return acc;
  }, {} as Record<PropertyType, number>);

  // Carry active filters across type-tab switches (city normalised to `location`).
  const preserved = new URLSearchParams();
  if (cityFilter) preserved.set('location', cityFilter);
  if (params.builder) preserved.set('builder', params.builder);
  if (params.q) preserved.set('q', params.q);
  if (params.bhk) preserved.set('bhk', params.bhk);
  const preservedStr = preserved.toString();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 🔹 Hero Section with Type Tabs */}
      <section className="bg-[#101C2E] text-white py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4">
            <span className="text-[#F8C21C]">Properties</span>
          </h1>
          <p className="text-sm sm:text-lg text-white/90 mb-5 sm:mb-6">
            Discover {filteredProjects.length} properties across Pune, Mumbai &amp; KDMC
          </p>

          {/* 🔹 Property Type Tabs — scrollable on mobile */}
          <div className="-mx-4 px-4 sm:mx-0 sm:px-0 mb-5 sm:mb-6">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {PROPERTY_TYPES.map((type) => {
                const isActive = activeType === type.id;
                return (
                  <a
                    key={type.id}
                    href={`/properties?type=${type.id}${preservedStr ? `&${preservedStr}` : ''}`}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
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
          </div>

          {/* 🔍 Search & Filters Form */}
          <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            <div className="sm:col-span-2 lg:col-span-2 relative">
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

            <input type="hidden" name="type" value={activeType} />
            <select name="location" defaultValue={cityFilter}
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

            <button type="submit" className="sm:col-span-2 lg:col-span-6 w-full btn-primary">
              Filter Properties
            </button>
          </form>

          {/* Active Filters */}
          {(params.q || cityFilter || params.builder || params.bhk) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {params.q && <span className="px-3 py-1 bg-white/10 rounded-full text-sm">Search: &quot;{params.q}&quot; <a href={`/properties?type=${activeType}`} className="hover:text-[#F8C21C]">×</a></span>}
              {cityFilter && <span className="px-3 py-1 bg-white/10 rounded-full text-sm capitalize">Location: {cityFilter} <a href={`/properties?type=${activeType}`} className="hover:text-[#F8C21C]">×</a></span>}
              {params.builder && <span className="px-3 py-1 bg-white/10 rounded-full text-sm">Builder: {params.builder} <a href={`/properties?type=${activeType}`} className="hover:text-[#F8C21C]">×</a></span>}
              {params.bhk && <span className="px-3 py-1 bg-white/10 rounded-full text-sm">BHK: {params.bhk} <a href={`/properties?type=${activeType}`} className="hover:text-[#F8C21C]">×</a></span>}
            </div>
          )}
        </div>
      </section>

      {/* 🔹 Sticky search/filter bar — sits under the site header on scroll (desktop) */}
      <Suspense fallback={null}>
        <PropertiesStickySearch />
      </Suspense>

      {/* 🔹 Stats Bar */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
          <span className="flex items-center gap-2 text-gray-600"><span className="w-2 h-2 rounded-full bg-[#005E60]"></span><strong className="text-gray-900">{filteredProjects.length}</strong> {activeType.charAt(0).toUpperCase() + activeType.slice(1)} Properties</span>
          <span className="flex items-center gap-2 text-gray-600"><span className="w-2 h-2 rounded-full bg-[#F8C21C]"></span><strong className="text-gray-900">{locations.length}</strong> Locations</span>
          <span className="flex items-center gap-2 text-gray-600"><span className="w-2 h-2 rounded-full bg-[#8B0000]"></span><strong className="text-gray-900">{builders.length}</strong> Builders</span>
        </div>
      </section>

      {/* 🔹 Properties Grid */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-base sm:text-lg mb-4">No {activeType} properties match your filters.</p>
              <a href={`/properties?type=${activeType}`} className="text-[#005E60] hover:underline">Clear all filters</a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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