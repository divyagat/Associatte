'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { KeyRound, Tag, Warehouse, Factory } from 'lucide-react';
import { StickySearchBar } from '@/components/Home/Hero/StickySearchBar';

// Icon per known tab id; unknown (admin-added) categories fall back to a tag.
const TAB_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  sale: Tag,
  rent: KeyRound,
  warehouse: Warehouse,
  industry: Factory,
};

// Built-in default tabs, used when the parent doesn't supply a dynamic list.
const DEFAULT_TABS = [
  { id: 'sale', label: 'Resale' },
  { id: 'rent', label: 'Rent' },
];

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
  /** Tab ids an admin has hidden from the public site (site-config). */
  hiddenDeals?: string[];
  /** Dynamic Properties tabs (Resale/Rent + admin-added types). */
  tabs?: { id: string; label: string }[];
}

export default function PropertiesStickySearch({ locations = [], hiddenDeals = [], tabs }: PropertiesStickySearchProps) {
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
      categories={(tabs && tabs.length ? tabs : DEFAULT_TABS)
        .filter((t) => !hiddenDeals.includes(t.id))
        .map((t) => ({ id: t.id, label: t.label, icon: TAB_ICONS[t.id] || Tag, gradient: '' }))}
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
