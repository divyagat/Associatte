'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { KeyRound, Tag } from 'lucide-react';
import { StickySearchBar } from '@/components/Home/Hero/StickySearchBar';

// Mirrors DEAL_TYPES in lib/categories.ts, with an icon per deal for the sticky
// bar's tab row. The /properties page filters by the `deal` query param.
const DEAL_TABS = [
  { id: 'sale', label: 'Sale', icon: Tag, gradient: '' },
  { id: 'rent', label: 'Rent', icon: KeyRound, gradient: '' },
] as const;

// BHK options for the sticky bar's BHK-wise dropdown. The properties page matches
// these against each project's configurations via the `bhk` query param.
const BHK_OPTIONS = ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '4+ BHK'] as const;

// Pretty labels for the known city slugs stored on each property's `location`.
const LOCATION_LABELS: Record<string, string> = { pune: 'Pune', mumbai: 'Mumbai', kdmc: 'KDMC' };
const prettyLocation = (slug: string) =>
  LOCATION_LABELS[slug.toLowerCase()] || slug.charAt(0).toUpperCase() + slug.slice(1);

/**
 * Sticky search/filter bar for the /properties page. Reuses the home Hero's
 * StickySearchBar (desktop-only) and drives the page by pushing URL params —
 * the server component re-renders the filtered grid on navigation.
 */
interface PropertiesStickySearchProps {
  /** Distinct `location` slugs (pune/mumbai/kdmc…) available in the data store. */
  locations?: string[];
}

export default function PropertiesStickySearch({ locations = [] }: PropertiesStickySearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeTab = searchParams.get('deal') || 'sale';
  const activeBhk = searchParams.get('bhk') || '';
  // The page treats `city` and `location` interchangeably (city || location).
  const activeLocation = searchParams.get('location') || searchParams.get('city') || '';
  const [query, setQuery] = useState(searchParams.get('q') || '');

  // "All Locations" plus one option per known location slug.
  const locationOptions = [
    { label: 'All Locations', value: '' },
    ...locations.map((loc) => ({ label: prettyLocation(loc), value: loc })),
  ];

  // Keep the input in sync if the q param changes elsewhere (e.g. the hero form).
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const navigate = (tab: string, q: string, bhk: string, location: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('deal', tab);
    if (q.trim()) params.set('q', q.trim());
    else params.delete('q');
    if (bhk) params.set('bhk', bhk);
    else params.delete('bhk');
    // Normalise on `location`; drop the equivalent `city` param so the choice wins.
    params.delete('city');
    if (location) params.set('location', location);
    else params.delete('location');
    startTransition(() => router.push(`/properties?${params.toString()}`, { scroll: false }));
  };

  return (
    <StickySearchBar
      activeTab={activeTab}
      selectedCity="All Cities"
      searchQuery={query}
      categories={DEAL_TABS}
      isSearching={isPending}
      bhkOptions={BHK_OPTIONS}
      selectedBhk={activeBhk}
      locationOptions={locationOptions}
      selectedLocation={activeLocation}
      onLocationChange={(loc) => navigate(activeTab, query, activeBhk, loc)}
      onTabChange={(tab) => navigate(tab, query, activeBhk, activeLocation)}
      onBhkChange={(bhk) => navigate(activeTab, query, bhk, activeLocation)}
      onSearchQueryChange={setQuery}
      onSearch={() => navigate(activeTab, query, activeBhk, activeLocation)}
    />
  );
}
