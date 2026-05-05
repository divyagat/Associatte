// app/components/Home/Hero.tsx
'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { 
  Search, MapPin, Home, Building2, Construction, KeyRound, 
  ChevronDown, Handshake, RefreshCcw, ArrowRight, Sparkles, 
  CheckCircle2, TrendingUp, Users, X, SlidersHorizontal, Filter,
  Loader2
} from 'lucide-react';

interface HeroProps {
  initialCity?: string;
  onSearch?: (params: { tab: string; city: string; query: string; filters?: SearchFilters }) => void;
}

export interface SearchFilters {
  bhk?: string[];
  priceRange?: { min: number; max: number };
  builder?: string[];
  propertyType?: string[];
  possession?: string;
  amenities?: string[];
  locality?: string;
}

const colors = {
  primary: 'oklch(0.55 0.22 270)',
  primaryHover: 'oklch(0.5 0.24 270)',
  accent: 'oklch(0.7 0.18 180)',
  surface: 'oklch(0.98 0.01 270)',
  surfaceDark: 'oklch(0.15 0.02 270)',
  text: 'oklch(0.15 0.01 270)',
  textMuted: 'oklch(0.5 0.01 270)',
};

export default function Hero({ initialCity = 'Mumbai', onSearch }: HeroProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize state from URL params if available
  const [activeTab, setActiveTab] = useState<'residential' | 'commercial' | 'underConstruction' | 'readyToMove' | 'rental' | 'reselling'>(
    () => (searchParams?.get('tab') as any) || 'residential'
  );
  const [selectedCity, setSelectedCity] = useState(() => searchParams?.get('city') || initialCity);
  const [showStickySearch, setShowStickySearch] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(() => searchParams?.get('q') || '');
  const [isFocused, setIsFocused] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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
  
  const dropdownCloseTimer = useRef<NodeJS.Timeout | null>(null);
  const suggestionsTimer = useRef<NodeJS.Timeout | null>(null);
  const { scrollY } = useScroll();
  
  // FIXED: Optimized scroll transforms - reduced sensitivity to prevent flicker
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.95]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.98]);

  const cities = useMemo(() => [
    { name: 'Mumbai', projects: 2847, localities: ['Andheri', 'Bandra', 'Powai', 'Worli', 'Kharghar', 'Thane'] },
    { name: 'Pune', projects: 1923, localities: ['Hinjewadi', 'Wakad', 'Baner', 'Kharadi', 'Viman Nagar', 'Kondhwa'] },
    { name: 'Bangalore', projects: 2156, localities: ['Whitefield', 'Electronic City', 'Koramangala', 'Indiranagar', 'HSR Layout'] },
    { name: 'Chennai', projects: 1432, localities: ['OMR', 'T Nagar', 'Adyar', 'Velachery', 'Anna Nagar'] },
    { name: 'Delhi NCR', projects: 3201, localities: ['Gurgaon', 'Noida', 'Dwarka', 'Rohini', 'Faridabad'] },
    { name: 'Hyderabad', projects: 1678, localities: ['Gachibowli', 'Hitech City', 'Kondapur', 'Madhapur', 'Secunderabad'] },
  ], []);

  const searchSuggestions = useMemo(() => [
    '3 BHK in Kharghar', 'Luxury villas Pune', 'Commercial space Mumbai', 
    'Ready to move Bangalore', 'Plots under 50L', 'Godrej Properties', 
    'Lodha Group', '2 BHK under 80L', '4 BHK penthouse', 'Studio apartments'
  ], []);

  const categories = useMemo(() => [
    { id: 'residential', label: 'Buy', icon: Home, color: '#6366f1', gradient: 'from-indigo-500 to-violet-600' },
    { id: 'commercial', label: 'Commercial', icon: Building2, color: '#8b5cf6', gradient: 'from-violet-500 to-purple-600' },
    { id: 'underConstruction', label: 'Pre-Launch', icon: Construction, color: '#06b6d4', gradient: 'from-cyan-500 to-teal-600' },
    { id: 'readyToMove', label: 'Ready', icon: KeyRound, color: '#f43f5e', gradient: 'from-rose-500 to-pink-600' },
    { id: 'rental', label: 'Rent', icon: Handshake, color: '#10b981', gradient: 'from-emerald-500 to-green-600' },
    { id: 'reselling', label: 'Resale', icon: RefreshCcw, color: '#f59e0b', gradient: 'from-amber-500 to-orange-600' },
  ], []);

  const bhkOptions = ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '4+ BHK'];
  const builderOptions = ['Lodha Group', 'Godrej Properties', 'Prestige Group', 'Sobha Ltd', 'Brigade Group', 'DLF', 'Oberoi Realty', 'Tata Housing'];
  const propertyTypes = ['Apartment', 'Villa', 'Plot', 'Studio', 'Penthouse', 'Office Space', 'Shop'];
  const priceRanges = [
    { label: 'Under ₹50L', min: 0, max: 5000000 },
    { label: '₹50L - ₹1Cr', min: 5000000, max: 10000000 },
    { label: '₹1Cr - ₹2Cr', min: 10000000, max: 20000000 },
    { label: '₹2Cr - ₹5Cr', min: 20000000, max: 50000000 },
    { label: 'Above ₹5Cr', min: 50000000, max: Infinity },
  ];

  // FIXED: Throttled mouse tracking for better performance
  useEffect(() => {
    let lastUpdate = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastUpdate < 50) return; // Throttle to 20fps
      lastUpdate = now;
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // FIXED: Debounced scroll handler with proper cleanup
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let lastScroll = 0;
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScroll < 100) return; // Throttle scroll events
      lastScroll = now;
      
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        setShowStickySearch(window.scrollY > 120);
      }, 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  // FIXED: Proper dropdown close handling with cleanup
  const handleCityDropdownOpen = useCallback((isOpen: boolean) => {
    if (dropdownCloseTimer.current) {
      clearTimeout(dropdownCloseTimer.current);
      dropdownCloseTimer.current = null;
    }
    
    if (isOpen) {
      setIsCityDropdownOpen(true);
    } else {
      dropdownCloseTimer.current = setTimeout(() => {
        setIsCityDropdownOpen(false);
      }, 150); // Reduced delay for better UX
    }
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (dropdownCloseTimer.current) clearTimeout(dropdownCloseTimer.current);
      if (suggestionsTimer.current) clearTimeout(suggestionsTimer.current);
    };
  }, []);

  // FIXED: Handle search with proper loading state and URL sync
  const handleSearch = useCallback(async () => {
    setIsSearching(true);
    
    const params = {
      tab: activeTab,
      city: selectedCity,
      query: searchQuery.trim(),
      filters: Object.keys(filters).length > 0 ? filters : undefined
    };
    
    const queryParams = new URLSearchParams();
    queryParams.append('city', selectedCity);
    queryParams.append('tab', activeTab);
    if (searchQuery.trim()) queryParams.append('q', searchQuery.trim());
    if (filters.bhk?.length) queryParams.append('bhk', filters.bhk.join(','));
    if (filters.builder?.length) queryParams.append('builder', filters.builder.join(','));
    if (filters.propertyType?.length) queryParams.append('type', filters.propertyType.join(','));
    if (filters.priceRange) {
      queryParams.append('minPrice', filters.priceRange.min.toString());
      queryParams.append('maxPrice', filters.priceRange.max === Infinity ? '999999999' : filters.priceRange.max.toString());
    }
    if (filters.locality) queryParams.append('locality', filters.locality);
    
    try {
      // Navigate with scroll reset for smooth transition
      await router.push(`/properties?${queryParams.toString()}`, { scroll: false });
      onSearch?.(params);
      
      // Close dropdowns after search
      setIsCityDropdownOpen(false);
      setShowSuggestions(false);
    } catch (error) {
      console.error('Search navigation error:', error);
    } finally {
      // Small delay to show loading state
      setTimeout(() => setIsSearching(false), 300);
    }
  }, [activeTab, selectedCity, searchQuery, filters, onSearch, router]);

  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const filteredSuggestions = useMemo(() => {
    if (!searchQuery) return searchSuggestions.slice(0, 4);
    return searchSuggestions.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 4);
  }, [searchQuery, searchSuggestions]);

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    
    // Smart parsing for suggestions
    const newFilters: SearchFilters = { ...filters };
    
    if (suggestion.includes('BHK')) {
      const bhkMatch = suggestion.match(/(\d+\s*[RB]HK)/i);
      if (bhkMatch) {
        newFilters.bhk = [bhkMatch[0].toUpperCase()];
      }
    }
    if (suggestion.toLowerCase().includes('under') || suggestion.toLowerCase().includes('below')) {
      const priceMatch = suggestion.match(/₹?([\d.]+)\s*([LC])/i);
      if (priceMatch) {
        const value = parseFloat(priceMatch[1]) * (priceMatch[2].toLowerCase() === 'cr' ? 10000000 : 100000);
        newFilters.priceRange = { min: 0, max: value };
      }
    }
    if (suggestion.toLowerCase().includes('pune') || suggestion.toLowerCase().includes('mumbai') || suggestion.toLowerCase().includes('bangalore')) {
      const cityMatch = cities.find(c => suggestion.toLowerCase().includes(c.name.toLowerCase()));
      if (cityMatch) setSelectedCity(cityMatch.name);
    }
    
    setFilters(newFilters);
    setTimeout(handleSearch, 100);
  };

  // FIXED: Optimized animated background - removed flickering elements
  const AnimatedBackground = () => {
    // Reduced movement sensitivity for smoother experience
    const x = (mousePosition.x / window.innerWidth - 0.5) * 8;
    const y = (mousePosition.y / window.innerHeight - 0.5) * 8;

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Base gradient - static to prevent flicker */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950" />
        
        {/* FIXED: Subtle animated orbs with CSS-only animations */}
        <div 
          className="absolute top-[-10%] right-[-10%] w-[700px] h-[700px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
            transform: `translate(${x}px, ${y * 0.5}px)`,
            transition: 'transform 0.3s ease-out',
            willChange: 'transform'
          }}
        />
        <div 
          className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
            transform: `translate(${x * 0.6}px, ${-y * 0.25}px)`,
            transition: 'transform 0.3s ease-out',
            willChange: 'transform'
          }}
        />
        
        {/* FIXED: Static noise overlay - no animation to prevent flicker */}
        <div className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        />
        
        {/* FIXED: Static grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.3" opacity="0.4"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent" />
      </div>
    );
  };

  // FIXED: Filter Panel with proper z-index and rendering
  const FilterPanel = useCallback(({ onClose }: { onClose: () => void }) => (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-[60] overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-800">Filters</h3>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close filters"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* BHK Filter */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-3">BHK Type</label>
          <div className="flex flex-wrap gap-2">
            {bhkOptions.map(bhk => (
              <motion.button
                key={bhk}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setFilters(prev => {
                    const current = prev.bhk || [];
                    const updated = current.includes(bhk) 
                      ? current.filter(b => b !== bhk)
                      : [...current, bhk];
                    return { ...prev, bhk: updated.length ? updated : undefined };
                  });
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filters.bhk?.includes(bhk)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                aria-pressed={filters.bhk?.includes(bhk)}
              >
                {bhk}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-3">Budget</label>
          <div className="space-y-2">
            {priceRanges.map(range => (
              <label key={range.label} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="priceRange"
                  checked={filters.priceRange?.min === range.min && filters.priceRange?.max === range.max}
                  onChange={() => setFilters(prev => ({ ...prev, priceRange: { min: range.min, max: range.max } }))}
                  className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">{range.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Builders */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-3">Builders</label>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {builderOptions.map(builder => (
              <label key={builder} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.builder?.includes(builder)}
                  onChange={(e) => {
                    setFilters(prev => {
                      const current = prev.builder || [];
                      const updated = e.target.checked 
                        ? [...current, builder]
                        : current.filter(b => b !== builder);
                      return { ...prev, builder: updated.length ? updated : undefined };
                    });
                  }}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">{builder}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Property Type */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-3">Property Type</label>
          <div className="flex flex-wrap gap-2">
            {propertyTypes.map(type => (
              <motion.button
                key={type}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setFilters(prev => {
                    const current = prev.propertyType || [];
                    const updated = current.includes(type) 
                      ? current.filter(t => t !== type)
                      : [...current, type];
                    return { ...prev, propertyType: updated.length ? updated : undefined };
                  });
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filters.propertyType?.includes(type)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-slate-100 sticky bottom-0 bg-white pb-2">
          <button
            onClick={() => { setFilters({}); onClose(); }}
            className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Clear All
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { handleSearch(); onClose(); }}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/30"
          >
            Apply Filters
          </motion.button>
        </div>
      </div>
    </motion.div>
  ), [filters, bhkOptions, priceRanges, builderOptions, propertyTypes, handleSearch]);

  // FIXED: Premium search bar with proper event handling
  const SearchBar = useCallback(({ isSticky = false }: { isSticky?: boolean }) => (
    <motion.div
      layout
      layoutId="search-bar"
      className={`bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 ${
        isFocused ? 'ring-2 ring-indigo-500/30 shadow-indigo-500/10' : ''
      } ${isSticky ? 'p-2' : 'p-4 lg:p-5'} transition-all duration-200`}
    >
      {/* Category Tabs */}
      <div className={`${isSticky ? 'mb-2' : 'mb-4'} overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1`}>
        <div className="flex gap-1.5 min-w-max">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeTab === category.id;
            
            return (
              <motion.button
                key={category.id}
                onClick={() => setActiveTab(category.id as any)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 min-w-[72px] justify-center group ${
                  isActive
                    ? `bg-gradient-to-r ${category.gradient} text-white shadow-lg`
                    : 'bg-slate-50/80 text-slate-600 hover:bg-slate-100/80 border border-slate-200/60 hover:border-slate-300'
                } ${isSticky ? 'px-2.5 py-1.5 text-[10px] min-w-[64px]' : ''}`}
                role="tab"
                aria-selected={isActive}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-white/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.25, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  />
                )}
                
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : ''}`} 
                  style={!isActive ? { color: category.color } : {}} 
                />
                <span className={isSticky ? 'hidden sm:inline' : ''}>{category.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Search Input Row */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        {/* City Selector - FIXED with proper event handling */}
        <div className="relative w-full sm:w-40 flex-shrink-0">
          <motion.button
            onClick={() => handleCityDropdownOpen(!isCityDropdownOpen)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`w-full flex items-center justify-between px-4 py-3 bg-slate-50/80 border border-slate-200/60 rounded-xl hover:border-indigo-400/60 hover:bg-indigo-50/30 transition-all duration-200 text-sm group ${
              isCityDropdownOpen ? 'border-indigo-400 bg-indigo-50/50 ring-2 ring-indigo-500/20' : ''
            } ${isSticky ? 'py-2 text-xs' : ''}`}
            aria-expanded={isCityDropdownOpen}
            aria-haspopup="listbox"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <motion.div 
                className="p-1.5 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                whileHover={{ rotate: [0, -3, 3, 0] }}
                transition={{ duration: 0.25 }}
              >
                <MapPin className="w-4 h-4 text-indigo-500" />
              </motion.div>
              <span className="font-semibold text-slate-700 truncate">{selectedCity}</span>
            </div>
            <motion.div animate={{ rotate: isCityDropdownOpen ? 180 : 0 }} transition={{ duration: 0.15 }}>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-500" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {isCityDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.99 }}
                transition={{ duration: 0.12 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden"
                onMouseEnter={() => handleCityDropdownOpen(true)}
                onMouseLeave={() => handleCityDropdownOpen(false)}
                role="listbox"
              >
                <div className="p-1.5 max-h-72 overflow-y-auto">
                  {cities.map((city, index) => (
                    <motion.button
                      key={city.name}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.015 }}
                      onClick={() => { 
                        setSelectedCity(city.name); 
                        handleCityDropdownOpen(false);
                        if (!isSticky) handleSearch();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-left transition-all duration-150 ${
                        selectedCity === city.name 
                          ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                      role="option"
                      aria-selected={selectedCity === city.name}
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className={`w-4 h-4 flex-shrink-0 ${selectedCity === city.name ? 'text-white/90' : 'text-slate-400'}`} />
                        <div className="text-left">
                          <span className={`font-medium block ${selectedCity === city.name ? 'text-white' : ''}`}>{city.name}</span>
                          <span className={`text-xs ${selectedCity === city.name ? 'text-white/70' : 'text-slate-400'}`}>
                            {city.projects} projects
                          </span>
                        </div>
                      </div>
                      {selectedCity === city.name && <CheckCircle2 className="w-4 h-4 text-white/90" />}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Smart Search Input - FIXED with proper blur handling */}
        <div className="flex-1 relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <motion.div animate={{ scale: isFocused ? 1.08 : 1 }} transition={{ duration: 0.15 }}>
              <Search className={`w-5 h-5 transition-colors ${isFocused ? 'text-indigo-500' : 'text-slate-400 group-hover:text-slate-500'}`} />
            </motion.div>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
            onFocus={() => { setIsFocused(true); setShowSuggestions(true); }}
            onBlur={() => { 
              setIsFocused(false); 
              // Delay hiding suggestions to allow click events
              if (suggestionsTimer.current) clearTimeout(suggestionsTimer.current);
              suggestionsTimer.current = setTimeout(() => setShowSuggestions(false), 200);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
              }
              if (e.key === 'Escape') {
                setShowSuggestions(false);
                (e.target as HTMLInputElement).blur();
              }
            }}
            placeholder="Search projects, localities, builders, or landmarks..."
            className={`w-full pl-11 pr-4 bg-slate-50/80 border border-slate-200/60 rounded-xl focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100/50 transition-all duration-200 text-sm placeholder:text-slate-400 ${
              isSticky ? 'py-2' : 'py-3'
            }`}
            aria-label="Search properties"
          />
          
          {/* Suggestions Dropdown - FIXED with proper positioning */}
          <AnimatePresence>
            {showSuggestions && searchQuery && filteredSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-40 overflow-hidden"
              >
                {filteredSuggestions.map((suggestion, index) => (
                  <motion.button
                    key={suggestion}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.025 }}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-indigo-50/50 transition-colors group"
                    type="button"
                  >
                    <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                    <span className="text-slate-600 group-hover:text-slate-800">{suggestion}</span>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Filter & Search Buttons */}
        <div className="flex gap-2">
          <motion.button 
            onClick={() => setShowFilters(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 ${
              isSticky ? 'py-2 text-xs' : 'py-3 text-sm'
            }`}
            aria-label="Open filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className={isSticky ? 'hidden sm:inline' : ''}>Filters</span>
          </motion.button>
          
          <motion.button 
            onClick={handleSearch}
            whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -12px rgba(79, 70, 229, 0.45)" }}
            whileTap={{ scale: 0.98 }}
            disabled={isSearching}
            className={`bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 flex-shrink-0 relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed ${
              isSticky ? 'py-2 text-xs' : 'py-3 text-sm'
            }`}
          >
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin relative z-10" />
            ) : (
              <>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.35 }}
                />
                <Search className="w-4 h-4 relative z-10" />
                <span className="relative z-10">{isSticky ? 'Go' : 'Search'}</span>
                <ArrowRight className="w-4 h-4 relative z-10 opacity-80" />
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Trust Signals */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 pt-3 border-t border-slate-100/60"
      >
        {[
          { icon: CheckCircle2, text: 'Verified listings', color: 'text-emerald-500' },
          { icon: TrendingUp, text: 'Best prices', color: 'text-indigo-500' },
          { icon: Users, text: 'Expert guidance', color: 'text-cyan-500' },
        ].map((item, i) => (
          <motion.span
            key={item.text}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.04 }}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500"
          >
            <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
            {item.text}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  ), [activeTab, selectedCity, searchQuery, filters, isFocused, isCityDropdownOpen, showSuggestions, filteredSuggestions, categories, cities, handleCityDropdownOpen, handleSearch, handleSuggestionClick, isSearching]);

  return (
    <motion.section 
      style={{ opacity: heroOpacity, scale: heroScale }} 
      className="relative min-h-[400px] lg:min-h-[440px] overflow-hidden will-change-transform"
    >
      <AnimatedBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="grid lg:grid-cols-12 gap-8 items-end">
          
          {/* Left: Branding + Headline */}
          <div className="lg:col-span-5 text-center lg:text-left">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
              <motion.div className="inline-flex items-center gap-2 px-3.5 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/15 mb-5" whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.99 }}>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </motion.div>
                <span className="text-xs font-semibold text-white/90 tracking-wide">Trusted by 50,000+ families</span>
              </motion.div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.08] mb-4">
                <span className="block">Discover Your</span>
                <motion.span className="block bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent"
                  initial={{ backgroundPosition: '0% 50%' }}
                  animate={{ backgroundPosition: '100% 50%' }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  style={{ backgroundSize: '200% 200%' }}
                >
                  Perfect Home
                </motion.span>
              </h1>
              
              <motion.p className="text-sm sm:text-base text-slate-300 mb-6 max-w-sm mx-auto lg:mx-0 leading-relaxed"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
              >
                Explore <span className="text-white font-medium">10,000+ verified properties</span> from India&apos;s most trusted builders
              </motion.p>

              <motion.div className="flex flex-wrap justify-center lg:justify-start gap-2"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
              >
                {cities.find(c => c.name === selectedCity)?.localities.slice(0, 4).map((loc, i) => (
                  <motion.button
                    key={loc}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + i * 0.03 }}
                    whileHover={{ scale: 1.04, backgroundColor: 'rgba(99, 102, 241, 0.18)', borderColor: 'rgba(99, 102, 241, 0.35)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setSearchQuery(loc); handleSearch(); }}
                    className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-indigo-500/18 border border-white/10 rounded-full transition-all duration-200 backdrop-blur-sm"
                  >
                    {loc}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Right: Search Card */}
          <div className="lg:col-span-7">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}>
              <SearchBar />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent pointer-events-none" />

      {/* Sticky Search Bar - FIXED with proper z-index */}
      <AnimatePresence>
        {showStickySearch && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-2xl shadow-xl border-b border-slate-200/50"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
              <div className="flex items-center gap-3">
                <div className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-hide">
                  {categories.slice(0, 4).map((cat) => {
                    const Icon = cat.icon;
                    const isActive = activeTab === cat.id;
                    return (
                      <motion.button
                        key={cat.id}
                        onClick={() => setActiveTab(cat.id as any)}
                        whileTap={{ scale: 0.96 }}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all whitespace-nowrap ${
                          isActive ? `bg-gradient-to-r ${cat.gradient} text-white shadow-sm` : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <Icon className="w-3 h-3 inline mr-1" />
                        {cat.label}
                      </motion.button>
                    );
                  })}
                </div>
                
                <div className="flex-1 flex gap-2 min-w-0">
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg flex-1 min-w-0 border border-slate-200">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="text-xs text-slate-600 truncate">{selectedCity}</span>
                  </div>
                  <div className="flex-1 relative min-w-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSearch();
                        }
                      }}
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 rounded-lg outline-none text-xs placeholder:text-slate-400 border border-slate-200 focus:border-indigo-400"
                    />
                  </div>
                  <motion.button 
                    onClick={handleSearch} 
                    whileTap={{ scale: 0.96 }} 
                    disabled={isSearching}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors shadow-sm flex items-center gap-1"
                  >
                    {isSearching ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <>
                        <Search className="w-3 h-3" />
                        Search
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Panel Overlay - FIXED with proper z-index stacking */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55]"
              aria-hidden="true"
            />
            <FilterPanel onClose={() => setShowFilters(false)} />
          </>
        )}
      </AnimatePresence>
    </motion.section>
  );
}