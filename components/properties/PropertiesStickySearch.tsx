'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Home, Building2, Construction, KeyRound, Tag, Map } from 'lucide-react';
import { StickySearchBar } from '@/components/Home/Hero/StickySearchBar';

// Mirrors PROPERTY_TYPES in app/properties/page.tsx, with an icon per type for
// the sticky bar's tab row.
const TYPE_TABS = [
  { id: 'residential', label: 'Residential', icon: Home, gradient: '' },
  { id: 'commercial', label: 'Commercial', icon: Building2, gradient: '' },
  { id: 'pre-launch', label: 'Pre-Launch', icon: Construction, gradient: '' },
  { id: 'ready', label: 'Ready', icon: KeyRound, gradient: '' },
  { id: 'rent', label: 'Rent', icon: Tag, gradient: '' },
  { id: 'plots', label: 'Plots', icon: Map, gradient: '' },
] as const;

/**
 * Sticky search/filter bar for the /properties page. Reuses the home Hero's
 * StickySearchBar (desktop-only) and drives the page by pushing URL params —
 * the server component re-renders the filtered grid on navigation.
 */
export default function PropertiesStickySearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeTab = searchParams.get('type') || 'residential';
  const [query, setQuery] = useState(searchParams.get('q') || '');

  // Keep the input in sync if the q param changes elsewhere (e.g. the hero form).
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const navigate = (tab: string, q: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('type', tab);
    if (q.trim()) params.set('q', q.trim());
    else params.delete('q');
    startTransition(() => router.push(`/properties?${params.toString()}`, { scroll: false }));
  };

  return (
    <StickySearchBar
      activeTab={activeTab}
      selectedCity="All Cities"
      searchQuery={query}
      categories={TYPE_TABS}
      isSearching={isPending}
      onTabChange={(tab) => navigate(tab, query)}
      onSearchQueryChange={setQuery}
      onSearch={() => navigate(activeTab, query)}
    />
  );
}
