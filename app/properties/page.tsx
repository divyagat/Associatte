import { Metadata } from 'next';
import { Suspense } from 'react';
import ProjectCard from '@/components/builder-page/ProjectCard';
import PropertiesStickySearch from '@/components/properties/PropertiesStickySearch';
import { getAllProperties, getSiteConfig } from '@/lib/data-store';
import { isPubliclyVisible } from '@/lib/visibility';
import {
  DEAL_TYPES, DEAL_TYPE_IDS, getDealType, computeDealCounts, getProjectType,
  PROJECT_TYPE_IDS, type DealTypeId, type ProjectTypeId,
} from '@/lib/categories';

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
    deal?: string;
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
  // Active deal tab (Sale / Rent) — Sale is the default.
  const activeDeal = (
    DEAL_TYPE_IDS.includes(params.deal as DealTypeId) ? params.deal : 'sale'
  ) as DealTypeId;
  // Optional property-type filter carried in from the Hero / other links.
  const typeFilter = PROJECT_TYPE_IDS.includes(params.type as ProjectTypeId)
    ? (params.type as ProjectTypeId)
    : undefined;
  // The Hero / StickySearchBar sends `city` (pune/mumbai/kdmc); treat it as a
  // location filter so global searches land on the right results.
  const cityFilter = params.city || params.location;

  // 📦 Live data from admin panel / data store — only published listings are
  // public; pending (awaiting approval) and hidden ones are excluded.
  const [allProperties, siteConfig] = await Promise.all([getAllProperties(), getSiteConfig()]);
  const properties = allProperties.filter(isPubliclyVisible);

  // 🔍 Filter projects by deal type + other params
  const filteredProjects = properties.filter((project: any) => {
    if (getDealType(project) !== activeDeal) return false;
    if (typeFilter && getProjectType(project) !== typeFilter) return false;

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

  // Deal-type counts respect the active property-type filter so the tab badges
  // reflect what the user is actually looking at.
  const dealCountBase = typeFilter
    ? properties.filter((p) => getProjectType(p) === typeFilter)
    : properties;
  const dealCounts = computeDealCounts(dealCountBase);
  // Sale and Rent are the two core options — always show both tabs (matching the
  // navbar); only an admin hiding one via site-config removes it. Counts still
  // drive the badge numbers.
  const availableDeals = DEAL_TYPES.filter((d) => !siteConfig.hiddenDeals.includes(d.id));

  // Carry active filters across deal-tab switches (city normalised to `location`).
  const preserved = new URLSearchParams();
  if (typeFilter) preserved.set('type', typeFilter);
  if (cityFilter) preserved.set('location', cityFilter);
  if (params.builder) preserved.set('builder', params.builder);
  if (params.q) preserved.set('q', params.q);
  if (params.bhk) preserved.set('bhk', params.bhk);
  const preservedStr = preserved.toString();

  // Base URL used by the "clear filter" × links (keeps the active deal + type).
  const clearBase = `/properties?deal=${activeDeal}${typeFilter ? `&type=${typeFilter}` : ''}`;
  const activeDealLabel = DEAL_TYPES.find((d) => d.id === activeDeal)?.label ?? 'Sale';

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

          {/* 🔹 Deal Tabs (Sale / Rent) — only deals with listings are shown */}
          {availableDeals.length > 0 && (
            <div className="-mx-4 px-4 sm:mx-0 sm:px-0 mb-5 sm:mb-6">
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {availableDeals.map((deal) => {
                  const isActive = activeDeal === deal.id;
                  return (
                    <a
                      key={deal.id}
                      href={`/properties?deal=${deal.id}${preservedStr ? `&${preservedStr}` : ''}`}
                      className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                        isActive
                          ? 'bg-white text-[#005E60] shadow-lg'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {deal.label}
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        isActive ? 'bg-[#005E60]/10 text-[#005E60]' : 'bg-white/20'
                      }`}>
                        {dealCounts[deal.id]}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

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

            <input type="hidden" name="deal" value={activeDeal} />
            {typeFilter && <input type="hidden" name="type" value={typeFilter} />}
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
              {params.q && <span className="px-3 py-1 bg-white/10 rounded-full text-sm">Search: &quot;{params.q}&quot; <a href={clearBase} className="hover:text-[#F8C21C]">×</a></span>}
              {cityFilter && <span className="px-3 py-1 bg-white/10 rounded-full text-sm capitalize">Location: {cityFilter} <a href={clearBase} className="hover:text-[#F8C21C]">×</a></span>}
              {params.builder && <span className="px-3 py-1 bg-white/10 rounded-full text-sm">Builder: {params.builder} <a href={clearBase} className="hover:text-[#F8C21C]">×</a></span>}
              {params.bhk && <span className="px-3 py-1 bg-white/10 rounded-full text-sm">BHK: {params.bhk} <a href={clearBase} className="hover:text-[#F8C21C]">×</a></span>}
            </div>
          )}
        </div>
      </section>

      {/* 🔹 Sticky search/filter bar — sits under the site header on scroll (desktop) */}
      <Suspense fallback={null}>
        <PropertiesStickySearch locations={locations} hiddenDeals={siteConfig.hiddenDeals} />
      </Suspense>

      {/* 🔹 Stats Bar */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
          <span className="flex items-center gap-2 text-gray-600"><span className="w-2 h-2 rounded-full bg-[#005E60]"></span><strong className="text-gray-900">{filteredProjects.length}</strong> {activeDealLabel} Properties</span>
          <span className="flex items-center gap-2 text-gray-600"><span className="w-2 h-2 rounded-full bg-[#F8C21C]"></span><strong className="text-gray-900">{locations.length}</strong> Locations</span>
          <span className="flex items-center gap-2 text-gray-600"><span className="w-2 h-2 rounded-full bg-[#8B0000]"></span><strong className="text-gray-900">{builders.length}</strong> Builders</span>
        </div>
      </section>

      {/* 🔹 Properties Grid */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-base sm:text-lg mb-4">No {activeDealLabel.toLowerCase()} properties match your filters.</p>
              <a href={clearBase} className="text-[#005E60] hover:underline">Clear all filters</a>
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