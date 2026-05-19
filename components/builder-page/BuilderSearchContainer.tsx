// client/components/builder-page/BuilderSearchContainer.tsx
'use client';

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import BuilderCard from './BuilderCard';
import HelpSidebar from './HelpSidebar';

interface Builder {
  id: string; name: string; slug: string; years: string; logo: string;
  totalProjects: number; locations: string[];
}

export default function BuilderSearchContainer({ 
  initialBuilders = [], initialQuery = '', initialLocation = '' 
}: { initialBuilders?: Builder[]; initialQuery?: string; initialLocation?: string }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [locationFilter, setLocationFilter] = useState(initialLocation);

  const filteredBuilders = useMemo(() => {
    if (!Array.isArray(initialBuilders)) return [];
    return initialBuilders.filter(b => {
      const matchSearch = !searchQuery || b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.locations?.some(l => l.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchLoc = !locationFilter || b.locations?.includes(locationFilter);
      return matchSearch && matchLoc;
    });
  }, [initialBuilders, searchQuery, locationFilter]);

  const availableLocations = useMemo(() => {
    if (!Array.isArray(initialBuilders)) return [];
    return Array.from(new Set(initialBuilders.flatMap(b => b.locations || []).filter(Boolean))).sort();
  }, [initialBuilders]);

  const handleFilterChange = (q: string, loc: string) => {
    const p = new URLSearchParams();
    if (q) p.set('q', q);
    if (loc) p.set('location', loc);
    router.push(`/builders${p.toString() ? '?' + p.toString() : ''}`, { scroll: false });
  };

  return (
    <section className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">{filteredBuilders.length} {filteredBuilders.length === 1 ? 'Builder' : 'Builders'} Found</h2>
          </div>
          {filteredBuilders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <p className="text-gray-500 mb-4">No builders match your filters.</p>
              <button onClick={() => { setSearchQuery(''); setLocationFilter(''); handleFilterChange('', ''); }} className="px-4 py-2 text-[#005E60] hover:underline">Clear all</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredBuilders.map(b => <BuilderCard key={b.id} builder={b} />)}
            </div>
          )}
        </div>
        <HelpSidebar 
          searchQuery={searchQuery} locationFilter={locationFilter} 
          availableLocations={availableLocations}
          onSearchChange={setSearchQuery} onLocationChange={setLocationFilter}
          onApplyFilters={() => handleFilterChange(searchQuery, locationFilter)}
          onClearFilters={() => { setSearchQuery(''); setLocationFilter(''); handleFilterChange('', ''); }}
        />
      </div>
    </section>
  );
}