// @/components/Home/Hero/SearchBar.tsx
'use client';

import { memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, ChevronDown, ArrowRight, CheckCircle2, Loader2, SlidersHorizontal, TrendingUp, Users } from 'lucide-react';
import type { SearchFilters } from '../Hero';

interface Category {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface City {
  name: string;
  projects: number;
  localities: string[];
  slug: string;
}

interface SearchBarProps {
  activeTab: string;
  selectedCity: string;
  searchQuery: string;
  filters: SearchFilters;
  isCityDropdownOpen: boolean;
  showSuggestions: boolean;
  filteredSuggestions: readonly string[];
  categories: readonly Category[];
  cities: readonly City[]; // ✅ REQUIRED - NO ? NO DEFAULT
  isSearching: boolean;
  onTabChange: (tab: string) => void;
  onCityChange: (city: string) => void;
  onSearchQueryChange: (query: string) => void;
  onCityDropdownToggle: (open: boolean) => void;
  onSuggestionClick: (suggestion: string) => void;
  onFilterToggle: () => void;
  onSearch: () => void;
}

export const SearchBar = memo(({
  activeTab,
  selectedCity,
  searchQuery,
  filters,
  isCityDropdownOpen,
  showSuggestions,
  filteredSuggestions,
  categories,
  cities, // ✅ NO DEFAULT VALUE - must come from Hero
  isSearching,
  onTabChange,
  onCityChange,
  onSearchQueryChange,
  onCityDropdownToggle,
  onSuggestionClick,
  onFilterToggle,
  onSearch,
}: SearchBarProps) => {
  
  const handleCitySelect = useCallback((city: string) => {
    onCityChange(city);
    onCityDropdownToggle(false);
  }, [onCityChange, onCityDropdownToggle]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSearch();
    if (e.key === 'Escape') onCityDropdownToggle(false);
  }, [onSearch, onCityDropdownToggle]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4 lg:p-5"
    >
      {/* 🗂️ Category Tabs */}
      <div className="mb-4 overflow-x-auto pb-1 scrollbar-hide">
        <div className="flex gap-2 min-w-max">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeTab === category.id;
            return (
              <button
                key={category.id}
                onClick={() => onTabChange(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#005E60] text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#005E60]'}`} />
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 🔍 Search Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        
        {/* 📍 City Selector */}
        <div className="relative w-full sm:w-40">
          <button
            onClick={() => onCityDropdownToggle(!isCityDropdownOpen)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
              isCityDropdownOpen
                ? 'border-[#005E60] bg-[#005E60]/5'
                : 'border-slate-200 bg-slate-50 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#005E60]" />
              <span className="text-slate-700 truncate">{selectedCity}</span>
            </div>
            <ChevronDown 
              className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${isCityDropdownOpen ? 'rotate-180' : ''}`} 
            />
          </button>

          <AnimatePresence>
            {isCityDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden max-h-64 overflow-y-auto"
              >
                {cities.map((city) => (
                  <button
                    key={city.slug}
                    onClick={() => handleCitySelect(city.name)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm text-left transition-colors ${
                      selectedCity === city.name
                        ? 'bg-[#005E60] text-white'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <MapPin className={`w-4 h-4 flex-shrink-0 ${selectedCity === city.name ? 'text-white' : 'text-slate-400'}`} />
                      <div className="min-w-0">
                        <div className="font-medium truncate">{city.name}</div>
                        <div className={`text-xs ${selectedCity === city.name ? 'text-white/70' : 'text-slate-400'}`}>
                          {city.projects} projects
                        </div>
                      </div>
                    </div>
                    {selectedCity === city.name && <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 🔎 Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search projects, localities, builders..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005E60]/20 focus:border-[#005E60] transition-all text-sm"
            aria-label="Search properties"
          />
          
          {/* Suggestions Dropdown */}
          <AnimatePresence>
            {showSuggestions && filteredSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-40 overflow-hidden max-h-64 overflow-y-auto"
              >
                {filteredSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => onSuggestionClick(suggestion)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-[#F8C21C]/10 transition-colors group"
                  >
                    <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-700 group-hover:text-slate-900 truncate">{suggestion}</span>
                    <ArrowRight className="w-4 h-4 text-[#F8C21C] ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ⚡ Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onFilterToggle}
            className="px-4 py-3 rounded-xl font-semibold text-sm border border-[#8B0000]/30 text-[#8B0000] bg-[#8B0000]/5 hover:bg-[#8B0000]/10 transition-colors flex items-center gap-2"
            aria-label="Open filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
          
          <button
            onClick={onSearch}
            disabled={isSearching}
            className="px-6 py-3 rounded-xl font-semibold text-sm text-white bg-[#005E60] hover:bg-[#004a4d] disabled:bg-[#005E60]/50 disabled:cursor-not-allowed transition-colors shadow-md flex items-center gap-2"
            aria-label="Search properties"
          >
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Search</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ✅ Trust Signals */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 pt-3 border-t border-slate-100">
        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#005E60]" /> Verified listings
        </span>
        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <TrendingUp className="w-3.5 h-3.5 text-[#F8C21C]" /> Best prices
        </span>
        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <Users className="w-3.5 h-3.5 text-[#8B0000]" /> Expert guidance
        </span>
      </div>
    </motion.div>
  );
});

SearchBar.displayName = 'SearchBar';