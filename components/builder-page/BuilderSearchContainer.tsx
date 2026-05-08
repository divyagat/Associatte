'use client';

import { useState, useMemo } from 'react';
import BuilderHero from './BuilderHero';
import BuilderProjects from './BuilderProjects';
// ✅ Fixed: 2 levels up to reach client/, then into data/
import properties from '../../data/properties.json';

type Property = typeof properties[number];

export default function BuilderSearchContainer({
  initialSlug,
  initialProjects,
}: {
  initialSlug: string;
  initialProjects: Property[];
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBuilder, setSelectedBuilder] = useState<string | null>(null);

  const uniqueBuilders = useMemo(() => 
    [...new Set(initialProjects.map((p) => p.developer.name))].sort(),
  [initialProjects]);

  const filteredProjects = useMemo(() => {
    let result = initialProjects;

    if (selectedBuilder) {
      result = result.filter((p) => p.developer.name === selectedBuilder);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.developer.name.toLowerCase().includes(q) ||
          p.fullLocation.area.toLowerCase().includes(q)
      );
    }

    return result;
  }, [initialProjects, selectedBuilder, searchQuery]);

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      <BuilderHero
        slug={initialSlug}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        builders={uniqueBuilders}
        selectedBuilder={selectedBuilder}
        onBuilderChange={setSelectedBuilder}
      />
      <BuilderProjects projects={filteredProjects} />
    </main>
  );
}