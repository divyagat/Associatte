// @/components/Home/Hero.tsx
'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { 
  Search, MapPin, Home, Building2, Construction, KeyRound, 
  ChevronDown, Sparkles, CheckCircle2, Loader2, X, Filter, ChevronRight
} from 'lucide-react';

// Import memoized child components
import { AnimatedBackground } from './Hero/AnimatedBackground';
import { SearchBar } from './Hero/SearchBar';
import { FilterPanel } from './Hero/FilterPanel';
import { StickySearchBar } from './Hero/StickySearchBar';

// Types
export interface SearchFilters {
  bhk?: string[];
  priceRange?: { min: number; max: number };
  builder?: string[];
  propertyType?: string[];
  possession?: string;
  amenities?: string[];
  locality?: string;
}

interface HeroProps {
  initialCity?: string;
  onSearch?: (params: { tab: string; city: string; query: string; filters?: SearchFilters }) => void;
  onFilterChange?: (data: { city: string; filters: SearchFilters }) => void;
}

// 🎨 Brand Colors
const BRAND = {
  green: '#005E60',
  red: '#8B0000',
  yellow: '#F8C21C',
} as const;

// 🗺️ Cities Data with KDMC Support
export const CITIES = [
  { 
    name: 'Pune', 
    projects: 1923, 
    localities: ['Wakad', 'Hinjewadi', 'Baner', 'Kharadi', 'Sus', 'Viman Nagar', 'Kondhwa', 'Magarpatta'],
    description: 'IT hub with premium projects in Wakad, Hinjewadi & Baner',
    slug: 'pune'
  },
  { 
    name: 'Mumbai', 
    projects: 2847, 
    localities: ['Kharghar', 'Panvel', 'Thane', 'Andheri', 'Bandra', 'Worli', 'Navi Mumbai'],
    description: 'Premium properties in Kharghar, Panvel & Navi Mumbai',
    slug: 'mumbai'
  },
  { 
    name: 'KDMC', 
    projects: 487, 
    localities: ['Kalyan', 'Dombivli', 'Ulhasnagar', 'Ambarnath', 'Badlapur', 'Shil Phata', 'Murbad'],
    description: 'Affordable & premium projects in Kalyan-Dombivli belt',
    slug: 'kdmc'
  },
] as const;

export type CitySlug = typeof CITIES[number]['slug'];
export type CityName = typeof CITIES[number]['name'];

// 🔍 Search suggestions
const SEARCH_SUGGESTIONS = [
  '3 BHK in Kharghar', 
  'Mantra Codename Paradise Sus',
  'Sai World Empire Kharghar',
  '2 BHK under 1 Cr Pune',
  'Ready to move Wakad',
  'Lodha Group Mumbai',
  'Shapoorji Pallonji Pune',
  'Plots in Panvel',
  '1 BHK in Kalyan',
  'Affordable homes Dombivli',
] as const;

// 🗂️ Categories
const CATEGORIES = [
  { id: 'residential', label: 'Residential', icon: Home, color: BRAND.green, gradient: `from-[${BRAND.green}] to-[#004a4d]` },
  { id: 'commercial', label: 'Commercial', icon: Building2, color: BRAND.red, gradient: `from-[${BRAND.red}] to-[#6a0000]` },
  { id: 'underConstruction', label: 'Pre-Launch', icon: Construction, color: BRAND.yellow, gradient: `from-[${BRAND.yellow}] to-[#d4a017]` },
  { id: 'readyToMove', label: 'Ready', icon: KeyRound, color: BRAND.green, gradient: `from-[${BRAND.green}] to-[#004a4d]` },
] as const;

// 🔧 Filter options
const BHK_OPTIONS = ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '4+ BHK'] as const;
const BUILDER_OPTIONS = ['Mantra Developers', 'Lodha Group', 'Shapoorji Pallonji', 'Paradise Group', 'Today Global', 'Birla Estates', 'Panchshil Realty'] as const;
const PROPERTY_TYPES = ['Apartment', 'Villa', 'Plot', 'Studio', 'Penthouse', 'Office Space'] as const;
const PRICE_RANGES = [
  { label: 'Under ₹75L', min: 0, max: 7500000 },
  { label: '₹75L - ₹1Cr', min: 7500000, max: 10000000 },
  { label: '₹1Cr - ₹2Cr', min: 10000000, max: 20000000 },
  { label: 'Above ₹2Cr', min: 20000000, max: Infinity },
] as const;

// 🗺️ Locality to City mapping
export const LOCALITY_CITY_MAP: Record<string, CitySlug> = {
  'Wakad': 'pune', 'Hinjewadi': 'pune', 'Baner': 'pune', 'Kharadi': 'pune',
  'Sus': 'pune', 'Viman Nagar': 'pune', 'Kondhwa': 'pune', 'Magarpatta': 'pune',
  'Kharghar': 'mumbai', 'Panvel': 'mumbai', 'Thane': 'mumbai', 'Andheri': 'mumbai',
  'Bandra': 'mumbai', 'Worli': 'mumbai', 'Navi Mumbai': 'mumbai',
  'Kalyan': 'kdmc', 'Dombivli': 'kdmc', 'Ulhasnagar': 'kdmc', 
  'Ambarnath': 'kdmc', 'Badlapur': 'kdmc', 'Shil Phata': 'kdmc', 'Murbad': 'kdmc',
};

// Custom hooks
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

function useMousePosition() {
  const mouseRef = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  return mouseRef;
}

function useScrollPosition(callback: (scrollY: number) => void, threshold: number) {
  const callbackRef = useRef(callback);
  const tickingRef = useRef(false);
  useEffect(() => { callbackRef.current = callback; }, [callback]);
  useEffect(() => {
    const handleScroll = () => {
      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          callbackRef.current(window.scrollY);
          tickingRef.current = false;
        });
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
  
  // ✅ Initialize city from path OR query param OR fallback
  const [selectedCity, setSelectedCity] = useState<CityName>(() => {
    const locationMatch = pathname?.match(/^\/locations\/(pune|mumbai|kdmc)$/i);
    if (locationMatch) {
      const slug = locationMatch[1].toLowerCase() as CitySlug;
      const city = CITIES.find(c => c.slug === slug);
      if (city) return city.name;
    }
    const urlCity = searchParams?.get('city');
    if (urlCity) {
      const normalized = urlCity.toLowerCase();
      const city = CITIES.find(c => c.slug === normalized);
      if (city) return city.name;
    }
    return initialCity as CityName;
  });
  
  const [activeTab, setActiveTab] = useState<'residential' | 'commercial' | 'underConstruction' | 'readyToMove'>(
    () => (searchParams?.get('tab') as any) || 'residential'
  );
  const [showStickySearch, setShowStickySearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState(() => searchParams?.get('q') || '');
  const [filters, setFilters] = useState<SearchFilters>(() => {
    const initial: SearchFilters = {};
    if (searchParams?.get('bhk')) initial.bhk = searchParams.get('bhk')?.split(',');
    if (searchParams?.get('builder')) initial.builder = searchParams.get('builder')?.split(',');
    if (searchParams?.get('type')) initial.propertyType = searchParams.get('type')?.split(',');
    const minPrice = searchParams?.get('minPrice');
    const maxPrice = searchParams?.get('maxPrice');
    if (minPrice || maxPrice) {
      initial.priceRange = {
        min: minPrice ? parseInt(minPrice) : 0,
        max: maxPrice === '999999999' ? Infinity : maxPrice ? parseInt(maxPrice) : Infinity
      };
    }
    return initial;
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [showAllLocalities, setShowAllLocalities] = useState(false);

  const mouseRef = useMousePosition();
  const dropdownCloseTimer = useRef<NodeJS.Timeout | null>(null);

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.97]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.99]);
  const debouncedSearchQuery = useDebounce(searchQuery, 250);

  useScrollPosition((scrollY) => setShowStickySearch(scrollY > 120), 120);

  useEffect(() => {
    return () => { if (dropdownCloseTimer.current) clearTimeout(dropdownCloseTimer.current); };
  }, []);

  useEffect(() => {
    onFilterChange?.({ city: selectedCity.toLowerCase(), filters });
  }, [selectedCity, filters, onFilterChange]);

  const navigateToLocation = useCallback((cityName: CityName) => {
    const citySlug = CITIES.find(c => c.name === cityName)?.slug;
    if (citySlug) router.push(`/locations/${citySlug}`);
  }, [router]);

  const handleCityDropdownOpen = useCallback((isOpen: boolean) => {
    if (dropdownCloseTimer.current) clearTimeout(dropdownCloseTimer.current);
    if (isOpen) setIsCityDropdownOpen(true);
    else dropdownCloseTimer.current = setTimeout(() => setIsCityDropdownOpen(false), 100);
  }, []);

  const handleCityChange = useCallback((newCity: CityName) => {
    setSelectedCity(newCity);
    navigateToLocation(newCity);
  }, [navigateToLocation]);

  const handleSearch = useCallback(async () => {
    if (isSearching) return;
    setIsSearching(true);
    
    const citySlug = CITIES.find(c => c.name === selectedCity)?.slug || 'pune';
    const hasSearchQuery = searchQuery.trim().length > 0;
    const hasFilters = Object.keys(filters).length > 0;
    
    if (!hasSearchQuery && !hasFilters) {
      try {
        await router.push(`/locations/${citySlug}`);
        onSearch?.({ tab: activeTab, city: selectedCity, query: '', filters: undefined });
      } catch (error) { console.error('Location navigation error:', error); }
      finally { setTimeout(() => setIsSearching(false), 200); }
      return;
    }
    
    const queryParams = new URLSearchParams();
    queryParams.append('city', citySlug);
    queryParams.append('tab', activeTab);
    if (hasSearchQuery) queryParams.append('q', searchQuery.trim());
    if (filters.bhk?.length) queryParams.append('bhk', filters.bhk.join(','));
    if (filters.builder?.length) queryParams.append('builder', filters.builder.join(','));
    if (filters.propertyType?.length) queryParams.append('type', filters.propertyType.join(','));
    if (filters.priceRange) {
      queryParams.append('minPrice', filters.priceRange.min.toString());
      queryParams.append('maxPrice', filters.priceRange.max === Infinity ? '999999999' : filters.priceRange.max.toString());
    }
    if (filters.locality) queryParams.append('locality', filters.locality);
    
    try {
      await router.push(`/properties?${queryParams.toString()}`, { scroll: false });
      onSearch?.({ tab: activeTab, city: selectedCity, query: searchQuery.trim(), filters: hasFilters ? filters : undefined });
      setIsCityDropdownOpen(false);
    } catch (error) { console.error('Search navigation error:', error); }
    finally { setTimeout(() => setIsSearching(false), 200); }
  }, [activeTab, selectedCity, searchQuery, filters, onSearch, router, isSearching]);

  const filteredSuggestions = useMemo(() => {
    if (!debouncedSearchQuery) return SEARCH_SUGGESTIONS.slice(0, 4);
    return SEARCH_SUGGESTIONS.filter(s => s.toLowerCase().includes(debouncedSearchQuery.toLowerCase())).slice(0, 4);
  }, [debouncedSearchQuery]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setSearchQuery(suggestion);
    const newFilters: SearchFilters = { ...filters };
    
    if (suggestion.includes('BHK')) {
      const bhkMatch = suggestion.match(/(\d+\s*[RB]HK)/i);
      if (bhkMatch) newFilters.bhk = [bhkMatch[0].toUpperCase()];
    }
    if (suggestion.toLowerCase().includes('under') || suggestion.toLowerCase().includes('below')) {
      const priceMatch = suggestion.match(/₹?([\d.]+)\s*([LC])/i);
      if (priceMatch) {
        const value = parseFloat(priceMatch[1]) * (priceMatch[2].toLowerCase() === 'cr' ? 10000000 : 100000);
        newFilters.priceRange = { min: 0, max: value };
      }
    }
    
    const cityMatch = CITIES.find(c => suggestion.toLowerCase().includes(c.name.toLowerCase()));
    if (cityMatch) {
      if (!newFilters.bhk?.length && !newFilters.priceRange) {
        navigateToLocation(cityMatch.name);
        return;
      }
      handleCityChange(cityMatch.name);
    }
    
    const localityMatch = Object.keys(LOCALITY_CITY_MAP).find(loc => 
      suggestion.toLowerCase().includes(loc.toLowerCase())
    );
    if (localityMatch) {
      const targetCitySlug = LOCALITY_CITY_MAP[localityMatch];
      const targetCity = CITIES.find(c => c.slug === targetCitySlug);
      if (targetCity) {
        if (!newFilters.bhk?.length && !newFilters.priceRange) {
          navigateToLocation(targetCity.name);
          return;
        }
        handleCityChange(targetCity.name);
      }
    }
    
    setFilters(newFilters);
    setTimeout(handleSearch, 50);
  }, [filters, handleSearch, handleCityChange, navigateToLocation]);

  const handleClearFilters = useCallback(() => { setFilters({}); setShowFilters(false); }, []);
  const handleApplyFilters = useCallback(() => { handleSearch(); setShowFilters(false); }, [handleSearch]);

  const handleLocalityClick = useCallback((locality: string) => {
    setSearchQuery(locality);
    const targetCitySlug = LOCALITY_CITY_MAP[locality];
    if (targetCitySlug) {
      const targetCity = CITIES.find(c => c.slug === targetCitySlug);
      if (targetCity) {
        navigateToLocation(targetCity.name);
        return;
      }
    }
    handleSearch();
  }, [handleSearch, navigateToLocation]);

  const searchBarProps = useMemo(() => ({
    activeTab, selectedCity, searchQuery, filters, isCityDropdownOpen,
    showSuggestions: !!searchQuery && filteredSuggestions.length > 0,
    filteredSuggestions, categories: CATEGORIES, cities: CITIES, isSearching,
    onTabChange: setActiveTab, onCityChange: handleCityChange,
    onSearchQueryChange: setSearchQuery, onCityDropdownToggle: handleCityDropdownOpen,
    onSuggestionClick: handleSuggestionClick, onFilterToggle: () => setShowFilters(true),
    onSearch: handleSearch,
  }), [activeTab, selectedCity, searchQuery, filters, isCityDropdownOpen, filteredSuggestions.length, isSearching, handleCityDropdownOpen, handleSuggestionClick, handleSearch, handleCityChange]);

  const stickySearchProps = useMemo(() => ({
    activeTab, selectedCity, searchQuery, categories: CATEGORIES, isSearching,
    onTabChange: setActiveTab, onSearchQueryChange: setSearchQuery, onSearch: handleSearch,
  }), [activeTab, selectedCity, searchQuery, isSearching, handleSearch]);

  const filterPanelProps = useMemo(() => ({
    filters, bhkOptions: BHK_OPTIONS, builderOptions: BUILDER_OPTIONS,
    propertyTypes: PROPERTY_TYPES, priceRanges: PRICE_RANGES,
    onFilterChange: setFilters, onClear: handleClearFilters,
    onApply: handleApplyFilters, onClose: () => setShowFilters(false),
  }), [filters, handleClearFilters, handleApplyFilters]);

  const currentCity = useMemo(() => CITIES.find(c => c.name === selectedCity) || CITIES[0], [selectedCity]);

  // ✅ Responsive: Show all localities with expand/collapse on mobile
  const displayedLocalities = useMemo(() => {
    if (showAllLocalities) return currentCity.localities;
    // Show first 4 on mobile, all on desktop via CSS
    return currentCity.localities;
  }, [currentCity, showAllLocalities]);

  return (
    <motion.section 
      style={{ opacity: heroOpacity, scale: heroScale }} 
      className="relative min-h-[320px] sm:min-h-[360px] md:min-h-[400px] lg:min-h-[440px] overflow-hidden will-change-transform"
    >
      <AnimatedBackground mouseRef={mouseRef} />
      
      {/* Main Content - Responsive Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-start lg:items-end">
          
          {/* 🔹 Left Column - Text Content */}
          <motion.div 
            className="lg:col-span-5 text-center lg:text-left order-1 lg:order-1 w-full" 
            initial={{ opacity: 0, y: 16 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3.5 sm:py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/15 mb-3 sm:mb-4 mx-auto lg:mx-0" 
              whileHover={{ scale: 1.015 }} 
              whileTap={{ scale: 0.99 }}
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: BRAND.yellow }} />
              <span className="text-[10px] sm:text-xs font-semibold text-white/90 tracking-wide">
                Verified Projects in Pune, Mumbai & KDMC
              </span>
            </motion.div>
            
            {/* Heading */}
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight sm:leading-[1.15] lg:leading-[1.08] mb-2.5 sm:mb-3 lg:mb-4">
              <span className="block">Find Your Dream Home in</span>
              <motion.span className="block" style={{ color: BRAND.yellow }}>
                {selectedCity}
              </motion.span>
            </h1>
            
            {/* Description */}
            <motion.p 
              className="text-[11px] sm:text-xs md:text-sm text-slate-300 mb-3 sm:mb-4 lg:mb-6 max-w-full sm:max-w-sm mx-auto lg:mx-0 leading-relaxed px-1" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.15 }}
            >
              Explore <span className="text-white font-medium">{currentCity.projects}+ verified properties</span> from trusted builders in {currentCity.localities.slice(0, 3).join(', ')} & more
            </motion.p>
            
            {/* 🔹 Locality Pills - Fully Responsive with Scroll + Expand */}
            <motion.div 
              className="w-full"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.25 }}
            >
              {/* Mobile: Horizontal scrollable container */}
              <div className="lg:hidden relative">
                <div 
                  className="flex gap-1.5 overflow-x-auto pb-2 px-1 scrollbar-hide scroll-smooth"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {currentCity.localities.map((loc, i) => (
                    <motion.button 
                      key={loc} 
                      initial={{ opacity: 0, y: 6 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: 0.35 + i * 0.02 }} 
                      whileHover={{ scale: 1.04 }} 
                      whileTap={{ scale: 0.98 }} 
                      onClick={() => handleLocalityClick(loc)} 
                      className="
                        flex-shrink-0
                        px-3 py-1.5 
                        text-[10px] font-medium 
                        text-slate-300 hover:text-white 
                        bg-white/5 hover:bg-white/10 
                        border border-white/10 rounded-full 
                        transition-all duration-200 backdrop-blur-sm 
                        whitespace-nowrap
                        min-h-[28px]
                      " 
                      style={{ borderColor: `rgba(0, 94, 96, 0.3)` }}
                    >
                      {loc}
                    </motion.button>
                  ))}
                </div>
                {/* Fade indicators for scrollable area */}
                <div className="absolute left-0 top-0 bottom-2 w-8 bg-gradient-to-r from-slate-900/80 to-transparent pointer-events-none lg:hidden" />
                <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-slate-900/80 to-transparent pointer-events-none lg:hidden" />
              </div>
              
              {/* Desktop: Wrapped pills */}
              <div className="hidden lg:flex flex-wrap gap-2 justify-center lg:justify-start">
                {currentCity.localities.map((loc, i) => (
                  <motion.button 
                    key={loc} 
                    initial={{ opacity: 0, y: 6 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.35 + i * 0.03 }} 
                    whileHover={{ scale: 1.04 }} 
                    whileTap={{ scale: 0.98 }} 
                    onClick={() => handleLocalityClick(loc)} 
                    className="
                      px-4 py-2 
                      text-sm font-medium 
                      text-slate-300 hover:text-white 
                      bg-white/5 hover:bg-white/10 
                      border border-white/10 rounded-full 
                      transition-all duration-200 backdrop-blur-sm 
                      whitespace-nowrap
                    " 
                    style={{ borderColor: `rgba(0, 94, 96, 0.3)` }}
                  >
                    {loc}
                  </motion.button>
                ))}
              </div>
            </motion.div>
            
            {/* ✅ Mobile: Show "View All Localities" button if needed */}
            {currentCity.localities.length > 4 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="lg:hidden mt-2 flex justify-center"
              >
                <button
                  onClick={() => setShowAllLocalities(!showAllLocalities)}
                  className="flex items-center gap-1 text-[10px] text-white/80 hover:text-white transition-colors"
                >
                  {showAllLocalities ? 'Show Less' : `View All ${currentCity.localities.length} Localities`}
                  <ChevronDown className={`w-3 h-3 transition-transform ${showAllLocalities ? 'rotate-180' : ''}`} />
                </button>
              </motion.div>
            )}
          </motion.div>
          
          {/* 🔹 Right Column - Search Bar */}
          <motion.div
            className="lg:col-span-7 w-full order-2 lg:order-2"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
          >
            <div className="w-full mb-0 lg:mb-20">
              {/* Mobile: Full-width search with proper spacing */}
              <div className="lg:hidden w-full" >
                <SearchBar {...searchBarProps} />
              </div>
              {/* Desktop: Search with margin adjustments */}
              <div className="hidden lg:block">
                <SearchBar {...searchBarProps} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Bottom Gradient Fade - Responsive height */}
      <div className="absolute bottom-0 left-0 right-0 h-12 sm:h-16 lg:h-24 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent pointer-events-none" />
      
      {/* Sticky Search Bar - Mobile optimized */}
      <AnimatePresence>
        {showStickySearch && (
          <div className="lg:hidden fixed top-0 left-0  right-0 z-50">
            <StickySearchBar {...stickySearchProps} />
          </div>
        )}
      </AnimatePresence>
      
      {/* Filter Panel Modal - Mobile full screen */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowFilters(false)} 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55]" 
              aria-hidden="true" 
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 lg:left-auto lg:right-8 lg:top-20 lg:bottom-auto lg:w-[380px] z-[60] bg-white rounded-t-2xl lg:rounded-2xl shadow-2xl overflow-hidden"
            >
              <FilterPanel {...filterPanelProps} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.section>
  );
}