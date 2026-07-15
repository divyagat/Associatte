// components/Home/Hero/StickySearchBar.tsx
'use client';

import { memo } from 'react';
import { Search, MapPin, Loader2, Home } from 'lucide-react';

// 🎨 Associatte Brand Colors
const BRAND_GREEN = '#005E60';
const BRAND_RED = '#8B0000';
const BRAND_YELLOW = '#F8C21C';

interface Category {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}

interface StickySearchBarProps {
  activeTab: string;
  selectedCity: string;
  searchQuery: string;
  categories: readonly Category[];
  isSearching: boolean;
  onTabChange: (tab: string) => void;
  onSearchQueryChange: (query: string) => void;
  onSearch: () => void;
  // 🏠 Optional BHK-wise search. When `bhkOptions` is supplied the bar renders a
  // configuration dropdown next to the city so users can filter property-wise by
  // BHK straight from the sticky bar.
  bhkOptions?: readonly string[];
  selectedBhk?: string;
  onBhkChange?: (bhk: string) => void;
  // 📍 Optional location dropdown. When `locationOptions` is supplied the static
  // city pill becomes a working <select> that filters property-wise by location.
  locationOptions?: readonly { label: string; value: string }[];
  selectedLocation?: string;
  onLocationChange?: (value: string) => void;
}

export const StickySearchBar = memo(({
  activeTab,
  selectedCity,
  searchQuery,
  categories,
  isSearching,
  onTabChange,
  onSearchQueryChange,
  onSearch,
  bhkOptions,
  selectedBhk = '',
  onBhkChange,
  locationOptions,
  selectedLocation = '',
  onLocationChange,
}: StickySearchBarProps) => {
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch();
    }
  };

  return (
    <div
      // ✅ Fixed positioning so it stays pinned below the Header across the whole
      // page (position:sticky only worked within the bounded hero section, which is
      // why it appeared to "not stick"). Hidden on mobile.
      className="hidden md:block fixed top-[80px] lg:top-[96px] left-0 right-0 z-40 bg-white shadow-lg border-b animate-in fade-in slide-in-from-top-2 duration-300"
      style={{ borderColor: `${BRAND_GREEN}20` }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center gap-3">
          
          {/* Category Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-hide">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onTabChange(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all whitespace-nowrap border ${
                    isActive ? 'text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  style={{
                    background: isActive ? `linear-gradient(135deg, ${BRAND_GREEN}, #004a4d)` : 'rgb(248 250 252)',
                    borderColor: isActive ? 'transparent' : `${BRAND_GREEN}30`
                  }}
                >
                  <Icon className={`w-3 h-3 inline mr-1 ${isActive ? 'text-white' : 'text-[#005E60]'}`} />
                  {cat.label}
                </button>
              );
            })}
          </div>
          
          {/* Search Row */}
          <div className="flex-1 flex gap-2 min-w-0">
            {/* Location: working dropdown when options are supplied, else a
                read-only pill showing the current city. */}
            {locationOptions && locationOptions.length > 0 && onLocationChange ? (
              <div className="relative flex items-center flex-1 min-w-0 flex-shrink-0">
                <MapPin className="absolute left-3 w-3.5 h-3.5 pointer-events-none flex-shrink-0" style={{ color: BRAND_GREEN }} />
                <select
                  value={selectedLocation}
                  onChange={(e) => onLocationChange(e.target.value)}
                  aria-label="Filter by location"
                  className="appearance-none w-full pl-8 pr-7 py-2 rounded-lg outline-none text-xs font-medium border cursor-pointer transition-colors truncate"
                  style={{ backgroundColor: `${BRAND_GREEN}08`, borderColor: `${BRAND_GREEN}30`, color: BRAND_GREEN }}
                >
                  {locationOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="text-slate-700">{opt.label}</option>
                  ))}
                </select>
                <svg
                  className="absolute right-2.5 w-3 h-3 pointer-events-none"
                  style={{ color: BRAND_GREEN }}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1 min-w-0 border flex-shrink-0"
                style={{ backgroundColor: `${BRAND_GREEN}08`, borderColor: `${BRAND_GREEN}30` }}
              >
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: BRAND_GREEN }} />
                <span className="text-xs truncate font-medium" style={{ color: BRAND_GREEN }}>{selectedCity}</span>
              </div>
            )}

            {/* BHK-wise dropdown (only when options are supplied) */}
            {bhkOptions && bhkOptions.length > 0 && (
              <div className="relative flex items-center flex-shrink-0">
                <Home className="absolute left-3 w-3.5 h-3.5 pointer-events-none" style={{ color: BRAND_GREEN }} />
                <select
                  value={selectedBhk}
                  onChange={(e) => onBhkChange?.(e.target.value)}
                  aria-label="Filter by BHK configuration"
                  className="appearance-none pl-8 pr-7 py-2 rounded-lg outline-none text-xs font-medium border cursor-pointer transition-colors"
                  style={{ backgroundColor: `${BRAND_GREEN}08`, borderColor: `${BRAND_GREEN}30`, color: BRAND_GREEN }}
                >
                  <option value="">All BHK</option>
                  {bhkOptions.map((bhk) => (
                    <option key={bhk} value={bhk} className="text-slate-700">{bhk}</option>
                  ))}
                </select>
                <svg
                  className="absolute right-2.5 w-3 h-3 pointer-events-none"
                  style={{ color: BRAND_GREEN }}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            )}

            {/* Search Input */}
            <div className="flex-1 relative min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 flex-shrink-0" style={{ color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search projects, localities..."
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-8 pr-3 py-2 rounded-lg outline-none text-xs placeholder:text-slate-400 border transition-colors"
                style={{ backgroundColor: 'rgb(248 250 252)', borderColor: '#e2e8f0' }}
                onFocus={(e) => {
                  e.target.style.borderColor = BRAND_GREEN;
                  e.target.style.boxShadow = `0 0 0 3px ${BRAND_GREEN}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            {/* Search Button */}
            <button 
              onClick={onSearch} 
              disabled={isSearching}
              className="text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-sm flex items-center gap-1 disabled:opacity-70"
              style={{
                background: `linear-gradient(135deg, ${BRAND_GREEN}, #004a4d)`,
                boxShadow: `0 2px 8px ${BRAND_GREEN}30`
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = `linear-gradient(135deg, #004a4d, ${BRAND_GREEN})`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = `linear-gradient(135deg, ${BRAND_GREEN}, #004a4d)`;
              }}
            >
              {isSearching ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <>
                  <Search className="w-3 h-3" />
                  Search
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Subtle bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px opacity-60"
        style={{ background: `linear-gradient(90deg, transparent, ${BRAND_YELLOW}, transparent)` }} 
      />
    </div>
  );
});

StickySearchBar.displayName = 'StickySearchBar';