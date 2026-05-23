// client/app/builders/page.tsx
import { Metadata } from 'next';
import BuilderSearchContainer from '@/components/builder-page/BuilderSearchContainer';
import properties from '@/data/properties.json';
import { getBuilderSlug, getBuilderYears, getBuilderLogo, getBuilderMetadata } from '@/lib/builder-slugs';

export const metadata: Metadata = {
  title: 'Know Your Developer | Trusted Builders in Pune, Mumbai & KDMC',
  description: 'Explore verified projects from top developers like Mantra, Lodha, Paradise Group & more.',
  keywords: ['builders', 'developers', 'Pune', 'Mumbai', 'KDMC', 'real estate'],
};

type Builder = {
  id: string;
  name: string;
  slug: string;
  years: string;
  logo: string;
  banner?: string;
  projects: any[];
  locations: string[];
  totalProjects: number;
};

const getAllBuilders = (): Builder[] => {
  const builderMap = new Map<string, Builder>();
  
  properties.forEach((p: any) => {
    const name = p.developer?.name;
    const location = p.location;
    if (!name) return;

    const slug = getBuilderSlug(name);
    const metadata = getBuilderMetadata(name);
    
    if (!builderMap.has(slug)) {
      builderMap.set(slug, {
        id: slug,
        name,
        slug,
        years: getBuilderYears(name),
        logo: metadata.logo,
        banner: metadata.banner,
        projects: [],
        locations: [],
        totalProjects: 0,
      });
    }
    const b = builderMap.get(slug)!;
    b.projects.push(p);
    if (!b.locations.includes(location)) {
      b.locations.push(location);
    }
    b.totalProjects += 1;
  });
  
  return Array.from(builderMap.values())
    .sort((a, b) => b.totalProjects - a.totalProjects);
};

export default async function BuildersPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string; location?: string }> 
}) {
  const { q: searchQuery, location: locationFilter } = await searchParams;
  const allBuilders = getAllBuilders();
  
  const filteredBuilders = allBuilders.filter(builder => {
    const matchesSearch = !searchQuery || 
      builder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      builder.locations.some((loc: string) => 
        loc.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesLocation = !locationFilter || 
      builder.locations.includes(locationFilter);
    return matchesSearch && matchesLocation;
  });

  const totalBuilders = allBuilders.length;
  const totalProjects = allBuilders.reduce((sum, b) => sum + b.totalProjects, 0);
  const locations = Array.from(
    new Set(allBuilders.flatMap(b => b.locations))
  ).sort();

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-[#005E60] to-[#004a4d] text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">Know Your Developer</h1>
            <p className="text-lg text-white/90 mb-6">
              Discover {totalBuilders}+ verified builders with {totalProjects}+ projects across Pune, Mumbai & KDMC.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  name="q" 
                  placeholder="Search builder name or locality..." 
                  defaultValue={searchQuery}
                  className="w-full px-4 py-3 pl-10 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#F8C21C]" 
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <select 
                name="location" 
                defaultValue={locationFilter}
                className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#F8C21C] min-w-[160px]"
              >
                <option value="" className="text-gray-900">All Locations</option>
                {locations.map((loc: string) => (
                  <option key={loc} value={loc} className="text-gray-900">{loc}</option>
                ))}
              </select>
              <button 
                type="submit" 
                className="px-6 py-3 bg-[#F8C21C] text-[#8B0000] font-semibold rounded-xl hover:bg-[#d4a017] transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap justify-center gap-6 text-sm">
          <span className="flex items-center gap-2 text-gray-600">
            <span className="w-2 h-2 rounded-full bg-[#005E60]"></span>
            <strong className="text-gray-900">{totalBuilders}</strong> Verified Builders
          </span>
          <span className="flex items-center gap-2 text-gray-600">
            <span className="w-2 h-2 rounded-full bg-[#F8C21C]"></span>
            <strong className="text-gray-900">{totalProjects}</strong> Total Projects
          </span>
          <span className="flex items-center gap-2 text-gray-600">
            <span className="w-2 h-2 rounded-full bg-[#8B0000]"></span>
            <strong className="text-gray-900">{locations.length}</strong> Locations
          </span>
        </div>
      </section>

      <BuilderSearchContainer 
        initialBuilders={filteredBuilders || []} 
        initialQuery={searchQuery || ''} 
        initialLocation={locationFilter || ''} 
      />

      <section className="bg-[#8B0000] text-white py-12 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Can&apos;t find your builder?</h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            We&apos;re constantly adding new verified developers. Reach out to our team for assistance.
          </p>
          <a 
            href="tel:+918881188181" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#F8C21C] text-[#8B0000] font-semibold rounded-xl hover:bg-[#d4a017] transition-colors"
          >
            📞 Call Us: +91 8881188181
          </a>
        </div>
      </section>
    </main>
  );
}