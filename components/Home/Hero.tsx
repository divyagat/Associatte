'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  Search, MapPin, Home, Building2, Construction, KeyRound,
  ChevronDown, Sparkles, CheckCircle2, Loader2, X, Filter, ChevronRight, Shield, Award, TrendingUp
} from 'lucide-react';

import { SearchBar } from './Hero/SearchBar';
import { FilterPanel, type FilterPanelProps } from './Hero/FilterPanel';
import { StickySearchBar } from './Hero/StickySearchBar';

export interface SearchFilters {
  bhk?: string[];
  priceRange?: { min: number; max: number };
  builder?: string[];
  propertyType?: string[];
  possession?: string;
  amenities?: string[];
  locality?: string;
}

const BRAND = {
  green: '#005E60',
  red: '#8B0000',
  yellow: '#F8C21C',
} as const;

export const CITIES = [
  { name: 'Pune', projects: 1923, localities: ['Wakad', 'Hinjewadi', 'Baner', 'Kharadi', 'Sus', 'Viman Nagar', 'Kondhwa', 'Magarpatta'], description: 'IT hub with premium projects in Wakad, Hinjewadi & Baner', slug: 'pune' },
  { name: 'Mumbai', projects: 2847, localities: ['Kharghar', 'Panvel', 'Thane', 'Andheri', 'Bandra', 'Worli', 'Navi Mumbai'], description: 'Premium properties in Kharghar, Panvel & Navi Mumbai', slug: 'mumbai' },
  { name: 'KDMC', projects: 487, localities: ['Kalyan', 'Dombivli', 'Ulhasnagar', 'Ambarnath', 'Badlapur', 'Shil Phata', 'Murbad'], description: 'Affordable & premium projects in Kalyan-Dombivli belt', slug: 'kdmc' },
] as const;

export type CitySlug = typeof CITIES[number]['slug'];
export type CityName = typeof CITIES[number]['name'];
export interface City { name: CityName; projects: number; localities: string[]; description: string; slug: CitySlug; }

interface HeroProps {
  initialCity?: string;
  onSearch?: (params: { city: string; query?: string; filters?: SearchFilters }) => void;
  onFilterChange?: (params: { city: string; filters: SearchFilters }) => void;
}

const SEARCH_SUGGESTIONS = ['3 BHK in Kharghar', 'Mantra Codename Paradise Sus', 'Sai World Empire Kharghar', '2 BHK under 1 Cr Pune', 'Ready to move Wakad', 'Lodha Group Mumbai', 'Shapoorji Pallonji Pune', 'Plots in Panvel', '1 BHK in Kalyan', 'Affordable homes Dombivli'] as const;

export interface Category { id: string; label: string; icon: React.ComponentType<{ className?: string }>; color: string; gradient: string; }
export const CATEGORIES = [
  { id: 'residential', label: 'Residential', icon: Home, color: BRAND.green, gradient: `from-[${BRAND.green}] to-[#004a4d]` },
  { id: 'commercial', label: 'Commercial', icon: Building2, color: BRAND.red, gradient: `from-[${BRAND.red}] to-[#6a0000]` },
  { id: 'underConstruction', label: 'Pre-Launch', icon: Construction, color: BRAND.yellow, gradient: `from-[${BRAND.yellow}] to-[#d4a017]` },
  { id: 'readyToMove', label: 'Ready', icon: KeyRound, color: BRAND.green, gradient: `from-[${BRAND.green}] to-[#004a4d]` },
] as const;

export const BHK_OPTIONS = ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '4+ BHK'] as const;
export const BUILDER_OPTIONS = ['Mantra Developers', 'Lodha Group', 'Shapoorji Pallonji', 'Paradise Group', 'Today Global', 'Birla Estates', 'Panchshil Realty'] as const;
export const PROPERTY_TYPES = ['Apartment', 'Villa', 'Plot', 'Studio', 'Penthouse', 'Office Space'] as const;
export const PRICE_RANGES = [
  { label: 'Under ₹75L', min: 0, max: 7500000 }, { label: '₹75L - ₹1Cr', min: 7500000, max: 10000000 },
  { label: '₹1Cr - ₹2Cr', min: 10000000, max: 20000000 }, { label: 'Above ₹2Cr', min: 20000000, max: Infinity },
] as const;

export const LOCALITY_CITY_MAP: Record<string, CitySlug> = {
  'Wakad': 'pune', 'Hinjewadi': 'pune', 'Baner': 'pune', 'Kharadi': 'pune', 'Sus': 'pune', 'Viman Nagar': 'pune', 'Kondhwa': 'pune', 'Magarpatta': 'pune',
  'Kharghar': 'mumbai', 'Panvel': 'mumbai', 'Thane': 'mumbai', 'Andheri': 'mumbai', 'Bandra': 'mumbai', 'Worli': 'mumbai', 'Navi Mumbai': 'mumbai',
  'Kalyan': 'kdmc', 'Dombivli': 'kdmc', 'Ulhasnagar': 'kdmc', 'Ambarnath': 'kdmc', 'Badlapur': 'kdmc', 'Shil Phata': 'kdmc', 'Murbad': 'kdmc',
};

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => { const handler = setTimeout(() => setDebouncedValue(value), delay); return () => clearTimeout(handler); }, [value, delay]);
  return debouncedValue;
}

function useScrollPosition(callback: (scrollY: number) => void, threshold: number) {
  const callbackRef = useRef(callback);
  const tickingRef = useRef(false);
  useEffect(() => { callbackRef.current = callback; }, [callback]);
  useEffect(() => {
    const handleScroll = () => {
      if (!tickingRef.current) {
        window.requestAnimationFrame(() => { callbackRef.current(window.scrollY); tickingRef.current = false; });
        tickingRef.current = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
}

export default function Hero({ initialCity = 'Pune', onSearch, onFilterChange }: HeroProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [selectedCity, setSelectedCity] = useState<CityName>(() => {
    const locationMatch = pathname?.match(/^\/locations\/(pune|mumbai|kdmc)$/i);
    if (locationMatch) { const slug = locationMatch[1].toLowerCase() as CitySlug; const city = CITIES.find(c => c.slug === slug); if (city) return city.name; }
    const urlCity = searchParams?.get('city');
    if (urlCity) { const normalized = urlCity.toLowerCase(); const city = CITIES.find(c => c.slug === normalized); if (city) return city.name; }
    return initialCity as CityName;
  });

  const [activeTab, setActiveTab] = useState<'residential' | 'commercial' | 'underConstruction' | 'readyToMove'>(() => (searchParams?.get('tab') as any) || 'residential');
  const [showStickySearch, setShowStickySearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState(() => searchParams?.get('q') || '');
  const [filters, setFilters] = useState<SearchFilters>(() => {
    const initial: SearchFilters = {};
    if (searchParams?.get('bhk')) initial.bhk = searchParams.get('bhk')?.split(',');
    if (searchParams?.get('builder')) initial.builder = searchParams.get('builder')?.split(',');
    if (searchParams?.get('type')) initial.propertyType = searchParams.get('type')?.split(',');
    const minPrice = searchParams?.get('minPrice'); const maxPrice = searchParams?.get('maxPrice');
    if (minPrice || maxPrice) { initial.priceRange = { min: minPrice ? parseInt(minPrice) : 0, max: maxPrice === '999999999' ? Infinity : maxPrice ? parseInt(maxPrice) : Infinity }; }
    return initial;
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [showAllLocalities, setShowAllLocalities] = useState(false);

  const dropdownCloseTimer = useRef<NodeJS.Timeout | null>(null);
  const debouncedSearchQuery = useDebounce(searchQuery, 250);

  useScrollPosition((scrollY) => setShowStickySearch(scrollY > 120), 120);
  useEffect(() => { return () => { if (dropdownCloseTimer.current) clearTimeout(dropdownCloseTimer.current); }; }, []);
  useEffect(() => { onFilterChange?.({ city: selectedCity.toLowerCase(), filters }); }, [selectedCity, filters, onFilterChange]);

  const navigateToLocation = useCallback((cityName: CityName) => { const citySlug = CITIES.find(c => c.name === cityName)?.slug; if (citySlug) router.push(`/locations/${citySlug}`); }, [router]);
  const handleCityDropdownOpen = useCallback((isOpen: boolean) => {
    if (dropdownCloseTimer.current) clearTimeout(dropdownCloseTimer.current);
    if (isOpen) setIsCityDropdownOpen(true); else dropdownCloseTimer.current = setTimeout(() => setIsCityDropdownOpen(false), 100);
  }, []);
  const handleCityChange = useCallback((newCity: CityName) => { setSelectedCity(newCity); navigateToLocation(newCity); }, [navigateToLocation]);
  const navigateToProperties = useCallback((searchParamsObj: URLSearchParams) => { router.push(`/properties?${searchParamsObj.toString()}`, { scroll: false }); }, [router]);

  const handleSearch = useCallback(async () => {
    if (isSearching) return; setIsSearching(true);
    const citySlug = CITIES.find(c => c.name === selectedCity)?.slug || 'pune';
    const hasSearchQuery = searchQuery.trim().length > 0; const hasFilters = Object.keys(filters).length > 0;
    if (!hasSearchQuery && !hasFilters) {
      try { await router.push(`/locations/${citySlug}`); onSearch?.({ city: selectedCity, query: '', filters: undefined }); } catch (error) { console.error('Location navigation error:', error); }
      finally { setTimeout(() => setIsSearching(false), 200); } return;
    }
    const queryParams = new URLSearchParams(); queryParams.append('city', citySlug);
    if (hasSearchQuery) queryParams.append('q', searchQuery.trim());
    if (filters.bhk?.length) queryParams.append('bhk', filters.bhk.join(','));
    if (filters.builder?.length) queryParams.append('builder', filters.builder.join(','));
    if (filters.propertyType?.length) queryParams.append('type', filters.propertyType.join(','));
    if (filters.priceRange) { queryParams.append('minPrice', filters.priceRange.min.toString()); queryParams.append('maxPrice', filters.priceRange.max === Infinity ? '999999999' : filters.priceRange.max.toString()); }
    if (filters.locality) queryParams.append('locality', filters.locality);
    try { await navigateToProperties(queryParams); onSearch?.({ city: selectedCity, query: searchQuery.trim(), filters: hasFilters ? filters : undefined }); setIsCityDropdownOpen(false); } catch (error) { console.error('Search navigation error:', error); }
    finally { setTimeout(() => setIsSearching(false), 200); }
  }, [selectedCity, searchQuery, filters, onSearch, navigateToProperties, isSearching, router]);

  const handleFilterSelect = useCallback((filterType: keyof SearchFilters, value: unknown) => {
    const newFilters = { ...filters };
    if (filterType === 'bhk' && typeof value === 'string') newFilters.bhk = newFilters.bhk?.includes(value) ? newFilters.bhk.filter(v => v !== value) : [...(newFilters.bhk || []), value];
    else if (filterType === 'builder' && typeof value === 'string') newFilters.builder = newFilters.builder?.includes(value) ? newFilters.builder.filter(v => v !== value) : [...(newFilters.builder || []), value];
    else if (filterType === 'propertyType' && typeof value === 'string') newFilters.propertyType = newFilters.propertyType?.includes(value) ? newFilters.propertyType.filter(v => v !== value) : [...(newFilters.propertyType || []), value];
    else if (filterType === 'priceRange' && typeof value === 'object' && value !== null) newFilters.priceRange = value as { min: number; max: number };
    else if (filterType === 'locality' && typeof value === 'string') newFilters.locality = value;
    const citySlug = CITIES.find(c => c.name === selectedCity)?.slug || 'pune'; const queryParams = new URLSearchParams(); queryParams.append('city', citySlug);
    if (newFilters.bhk?.length) queryParams.append('bhk', newFilters.bhk.join(','));
    if (newFilters.builder?.length) queryParams.append('builder', newFilters.builder.join(','));
    if (newFilters.propertyType?.length) queryParams.append('type', newFilters.propertyType.join(','));
    if (newFilters.priceRange) { queryParams.append('minPrice', newFilters.priceRange.min.toString()); queryParams.append('maxPrice', newFilters.priceRange.max === Infinity ? '999999999' : newFilters.priceRange.max.toString()); }
    if (newFilters.locality) queryParams.append('locality', newFilters.locality);
    navigateToProperties(queryParams);
  }, [filters, selectedCity, navigateToProperties]);

  const filteredSuggestions = useMemo(() => { if (!debouncedSearchQuery) return SEARCH_SUGGESTIONS.slice(0, 4); return SEARCH_SUGGESTIONS.filter(s => s.toLowerCase().includes(debouncedSearchQuery.toLowerCase())).slice(0, 4); }, [debouncedSearchQuery]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setSearchQuery(suggestion); const newFilters: SearchFilters = { ...filters };
    if (suggestion.includes('BHK')) { const bhkMatch = suggestion.match(/(\d+\s*[RB]HK)/i); if (bhkMatch) newFilters.bhk = [bhkMatch[0].toUpperCase()]; }
    if (suggestion.toLowerCase().includes('under') || suggestion.toLowerCase().includes('below')) { const priceMatch = suggestion.match(/₹?([\d.]+)\s*([LC])/i); if (priceMatch) { const value = parseFloat(priceMatch[1]) * (priceMatch[2].toLowerCase() === 'cr' ? 10000000 : 100000); newFilters.priceRange = { min: 0, max: value }; } }
    const cityMatch = CITIES.find(c => suggestion.toLowerCase().includes(c.name.toLowerCase()));
    if (cityMatch) { if (!newFilters.bhk?.length && !newFilters.priceRange) { navigateToLocation(cityMatch.name); return; } handleCityChange(cityMatch.name); }
    const localityMatch = Object.keys(LOCALITY_CITY_MAP).find(loc => suggestion.toLowerCase().includes(loc.toLowerCase()));
    if (localityMatch) { const targetCitySlug = LOCALITY_CITY_MAP[localityMatch]; const targetCity = CITIES.find(c => c.slug === targetCitySlug); if (targetCity) { if (!newFilters.bhk?.length && !newFilters.priceRange) { navigateToLocation(targetCity.name); return; } handleCityChange(targetCity.name); } }
    setFilters(newFilters); setTimeout(handleSearch, 50);
  }, [filters, handleSearch, handleCityChange, navigateToLocation]);

  const handleClearFilters = useCallback(() => { setFilters({}); const citySlug = CITIES.find(c => c.name === selectedCity)?.slug || 'pune'; router.push(`/locations/${citySlug}`); }, [selectedCity, router]);
  const handleApplyFilters = useCallback(() => { handleSearch(); }, [handleSearch]);
  const handleLocalityClick = useCallback((locality: string) => { setSearchQuery(locality); const targetCitySlug = LOCALITY_CITY_MAP[locality]; if (targetCitySlug) { const targetCity = CITIES.find(c => c.slug === targetCitySlug); if (targetCity) { navigateToLocation(targetCity.name); return; } } handleSearch(); }, [handleSearch, navigateToLocation]);

  const searchBarProps = useMemo(() => ({ activeTab, selectedCity, searchQuery, filters, isCityDropdownOpen, showSuggestions: !!searchQuery && filteredSuggestions.length > 0, filteredSuggestions: [...filteredSuggestions], categories: CATEGORIES as unknown as readonly Category[], cities: CITIES as unknown as readonly City[], isSearching, onTabChange: (tab: 'residential' | 'commercial' | 'underConstruction' | 'readyToMove') => setActiveTab(tab), onCityChange: handleCityChange, onSearchQueryChange: setSearchQuery, onCityDropdownToggle: handleCityDropdownOpen, onSuggestionClick: handleSuggestionClick, onFilterToggle: () => setShowFilters(true), onSearch: handleSearch }), [activeTab, selectedCity, searchQuery, filters, isCityDropdownOpen, filteredSuggestions, isSearching, handleCityDropdownOpen, handleSuggestionClick, handleSearch, handleCityChange]);
  const stickySearchProps = useMemo(() => ({ activeTab, selectedCity, searchQuery, categories: CATEGORIES as unknown as readonly Category[], isSearching, onTabChange: (tab: 'residential' | 'commercial' | 'underConstruction' | 'readyToMove') => setActiveTab(tab), onSearchQueryChange: setSearchQuery, onSearch: handleSearch }), [activeTab, selectedCity, searchQuery, isSearching, handleSearch]);
  const filterPanelProps: FilterPanelProps = useMemo(() => ({ filters, bhkOptions: BHK_OPTIONS, builderOptions: BUILDER_OPTIONS, propertyTypes: PROPERTY_TYPES, priceRanges: PRICE_RANGES, onFilterChange: handleFilterSelect, onClear: handleClearFilters, onApply: handleApplyFilters, onClose: () => setShowFilters(false), isNavigating: true }), [filters, handleFilterSelect, handleClearFilters, handleApplyFilters]);
  const currentCity = useMemo(() => CITIES.find(c => c.name === selectedCity) || CITIES[0], [selectedCity]);

  return (
    <section className="relative w-full bg-slate-950 min-h-[280px] sm:min-h-[320px] md:h-[420px] lg:h-[440px]">

      {/* 🖼️ HERO BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="https://res.cloudinary.com/drdeqd8to/image/upload/f_auto,q_auto/b4_ajb1vz"
          alt="Hero Background"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        {/* Mobile: Very light overlay - image fully visible */}
        <div className="md:hidden absolute inset-0 bg-gradient-to-b from-slate-950/10 via-transparent to-slate-950/20" />
        {/* Desktop: subtle left gradient */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-slate-950/25 via-slate-950/5 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 h-full flex flex-col justify-center py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-8 items-center w-full">

          {/* Left Column - Desktop only */}
          <div className="hidden lg:block lg:col-span-5 text-left order-1 w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/25 backdrop-blur-md rounded-full border border-white/15 mb-2 shadow-sm">
              <Sparkles className="w-4 h-4" style={{ color: BRAND.yellow }} />
              <span className="text-xs font-semibold text-white tracking-wide drop-shadow-sm">
                Verified Projects in Pune, Mumbai & KDMC
              </span>
            </div>
            <h1 className="text-3xl xl:text-4xl font-bold text-white leading-[1.1] mb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              <span className="block">Find Your Dream Home in</span>
              <span className="block" style={{ color: BRAND.yellow }}>{selectedCity}</span>
            </h1>
            <p className="text-sm text-white/95 mb-4 max-w-sm leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
              Explore <span className="text-white font-semibold">{currentCity.projects}+ verified properties</span> from trusted builders in {currentCity.localities.slice(0, 3).join(', ')} & more
            </p>
            <div className="flex flex-wrap gap-1.5">
              {currentCity.localities.slice(0, 6).map((loc) => (
                <button key={loc} onClick={() => handleLocalityClick(loc)} className="px-2.5 py-1 text-[11px] font-medium text-white bg-black/30 hover:bg-black/50 border border-white/20 rounded-full transition-all duration-200 backdrop-blur-md whitespace-nowrap drop-shadow-sm">
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Mobile & Desktop */}
          <div className="lg:col-span-7 w-full order-1">
            
            {/* ========== MOBILE VIEW - FULLY RESPONSIVE ========== */}
            <div className="lg:hidden w-full">
              {/* Minimal heading */}
              <div className="text-center mb-3 sm:mb-4">
                <h1 className="text-xl xs:text-2xl sm:text-3xl font-extrabold text-white leading-[1.1] drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                  <span className="block">Find Your</span>
                  <span className="block text-2xl xs:text-3xl sm:text-4xl" style={{ color: BRAND.yellow, textShadow: '0 2px 10px rgba(0,0,0,0.9)' }}>Dream Home</span>
                  <span className="block text-[11px] xs:text-xs sm:text-sm font-medium text-white mt-1 drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)]">in {selectedCity}</span>
                </h1>
              </div>

              {/* Ultra Compact Search Card */}
              <div className="w-full bg-white/95 backdrop-blur-2xl rounded-xl sm:rounded-2xl shadow-2xl border border-white/30 p-2 xs:p-2.5 sm:p-3">
                {/* Search Row - Very Compact */}
                <div className="flex gap-1.5 xs:gap-2 items-center">
                  {/* City Selector */}
                  <div className="relative flex-shrink-0">
                    <button
                      onClick={() => handleCityDropdownOpen(!isCityDropdownOpen)}
                      className="flex items-center gap-1 px-2 xs:px-2.5 py-2 xs:py-2.5 rounded-lg border-2 transition-all bg-white"
                      style={{
                        borderColor: isCityDropdownOpen ? BRAND.green : '#e2e8f0',
                        boxShadow: isCityDropdownOpen ? `0 0 0 3px ${BRAND.green}20` : 'none'
                      }}
                    >
                      <MapPin className="w-3 xs:w-3.5 h-3 xs:h-3.5" style={{ color: BRAND.green }} />
                      <span className="text-[10px] xs:text-xs font-semibold text-slate-700 truncate max-w-[45px] xs:max-w-[50px] sm:max-w-[60px]">{selectedCity}</span>
                      <ChevronDown className={`w-2.5 xs:w-3 h-2.5 xs:h-3 text-slate-400 transition-transform ${isCityDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isCityDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 overflow-hidden min-w-[140px] w-max">
                        {CITIES.map((city) => (
                          <button
                            key={city.slug}
                            onClick={() => {
                              handleCityChange(city.name);
                              handleCityDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                              selectedCity === city.name
                                ? 'bg-[#005E60] text-white'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <span className="font-medium">{city.name}</span>
                            {selectedCity === city.name && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Search Input - Compact */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-2.5 xs:left-3 top-1/2 -translate-y-1/2 w-3.5 xs:w-4 h-3.5 xs:h-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="Search..."
                      className="w-full pl-8 xs:pl-9 pr-2.5 xs:pr-3 py-2 xs:py-2.5 bg-slate-50 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all text-xs xs:text-sm placeholder:text-slate-400"
                      style={{
                        borderColor: '#e2e8f0',
                        '--tw-ring-color': `${BRAND.green}30`
                      } as any}
                      onFocus={(e) => {
                        e.target.style.borderColor = BRAND.green;
                        e.target.style.boxShadow = `0 0 0 3px ${BRAND.green}20`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e2e8f0';
                        e.target.style.boxShadow = 'none';
                      }}
                    />

                    {searchQuery && filteredSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-slate-100 z-40 overflow-hidden max-h-48 overflow-y-auto">
                        {filteredSuggestions.map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-[#F8C21C]/10 transition-colors border-b border-slate-50 last:border-0"
                          >
                            <Search className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            <span className="text-slate-700 truncate">{suggestion}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Search Button - Compact */}
                  <button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="flex-shrink-0 w-8 xs:w-9 sm:w-10 h-8 xs:h-9 sm:h-10 rounded-lg font-bold text-white transition-all shadow-lg flex items-center justify-center disabled:opacity-60"
                    style={{
                      background: `linear-gradient(135deg, ${BRAND.green}, #004a4d)`,
                      boxShadow: `0 4px 12px ${BRAND.green}40`
                    }}
                  >
                    {isSearching ? (
                      <Loader2 className="w-3.5 xs:w-4 h-3.5 xs:h-4 animate-spin" />
                    ) : (
                      <Search className="w-3.5 xs:w-4 h-3.5 xs:h-4" />
                    )}
                  </button>
                </div>

                {/* Category Tabs - Compact */}
                <div className="mt-2 xs:mt-2.5 overflow-x-auto pb-1 scrollbar-hide -mx-0.5 px-0.5">
                  <div className="flex gap-1 xs:gap-1.5 min-w-max">
                    {CATEGORIES.map((category) => {
                      const Icon = category.icon;
                      const isActive = activeTab === category.id;
                      return (
                        <button
                          key={category.id}
                          onClick={() => setActiveTab(category.id as any)}
                          className={`flex-shrink-0 flex items-center gap-0.5 xs:gap-1 px-2 xs:px-2.5 sm:px-3 py-1 xs:py-1.5 sm:py-2 rounded-md xs:rounded-lg text-[9px] xs:text-[10px] sm:text-xs font-semibold transition-all whitespace-nowrap ${
                            isActive
                              ? 'text-white shadow-sm'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                          style={isActive ? {
                            background: `linear-gradient(135deg, ${category.color}, ${category.color}dd)`,
                          } : {}}
                        >
                          <Icon className={`w-2.5 xs:w-3 h-2.5 xs:h-3 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          {category.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Trust Badges - Minimal */}
              <div className="flex items-center justify-center gap-2 xs:gap-3 mt-2 xs:mt-2.5">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 xs:w-3 h-2.5 xs:h-3" style={{ color: BRAND.green }} />
                  <span className="text-[9px] xs:text-[10px] sm:text-xs font-medium text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">Verified</span>
                </div>
                <div className="w-px h-2.5 xs:h-3 bg-white/30" />
                <div className="flex items-center gap-1">
                  <Award className="w-2.5 xs:w-3 h-2.5 xs:h-3" style={{ color: BRAND.yellow }} />
                  <span className="text-[9px] xs:text-[10px] sm:text-xs font-medium text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">Best Price</span>
                </div>
              </div>
            </div>

            {/* Desktop Search */}
            <div className="hidden lg:block">
              <SearchBar {...searchBarProps as any} />
            </div>
          </div>
        </div>
      </div>

      {showStickySearch && <StickySearchBar {...stickySearchProps as any} />}

      {showFilters && (
        <>
          <div onClick={() => setShowFilters(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55]" aria-hidden="true" />
          <FilterPanel {...filterPanelProps} />
        </>
      )}
    </section>
  );
}