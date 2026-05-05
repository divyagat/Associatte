'use client';

import { memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// ✅ CORRECT - single import line with ALL needed icons
import { Search, MapPin, ChevronDown, ArrowRight, CheckCircle2, Loader2, SlidersHorizontal, TrendingUp, Users } from 'lucide-react';
import type { SearchFilters } from '../Hero';

interface Category {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  gradient: string;
}

interface City {
  name: string;
  projects: number;
  localities: string[];
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
  cities: readonly City[];
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
  isCityDropdownOpen,
  showSuggestions,
  filteredSuggestions,
  categories,
  cities,
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
    onSearch();
  }, [onCityChange, onCityDropdownToggle, onSearch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch();
    }
    if (e.key === 'Escape') {
      onCityDropdownToggle(false);
    }
  }, [onSearch, onCityDropdownToggle]);

  return (
    <motion.div
      layout
      layoutId="search-bar"
      className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-4 lg:p-5 transition-all duration-200"
    >
      {/* Category Tabs - simplified animations */}
      <div className="mb-4 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
        <div className="flex gap-1.5 min-w-max">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeTab === category.id;
            
            return (
              <motion.button
                key={category.id}
                onClick={() => onTabChange(category.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 min-w-[72px] justify-center group ${
                  isActive
                    ? `bg-gradient-to-r ${category.gradient} text-white shadow-lg`
                    : 'bg-slate-50/80 text-slate-600 hover:bg-slate-100/80 border border-slate-200/60'
                }`}
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
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} style={!isActive ? { color: category.color } : {}} />
                <span>{category.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Search Input Row */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        {/* City Selector */}
        <div className="relative w-full sm:w-40 flex-shrink-0">
          <motion.button
            onClick={() => onCityDropdownToggle(!isCityDropdownOpen)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`w-full flex items-center justify-between px-4 py-3 bg-slate-50/80 border border-slate-200/60 rounded-xl hover:border-indigo-400/60 transition-all duration-200 text-sm group ${
              isCityDropdownOpen ? 'border-indigo-400 bg-indigo-50/50' : ''
            }`}
            aria-expanded={isCityDropdownOpen}
            aria-haspopup="listbox"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-1.5 bg-white rounded-lg shadow-sm">
                <MapPin className="w-4 h-4 text-indigo-500" />
              </div>
              <span className="font-semibold text-slate-700 truncate">{selectedCity}</span>
            </div>
            <motion.div animate={{ rotate: isCityDropdownOpen ? 180 : 0 }} transition={{ duration: 0.15 }}>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {isCityDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.1 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden"
                onMouseEnter={() => onCityDropdownToggle(true)}
                onMouseLeave={() => onCityDropdownToggle(false)}
                role="listbox"
              >
                <div className="p-1.5 max-h-72 overflow-y-auto">
                  {cities.map((city) => (
                    <button
                      key={city.name}
                      onClick={() => handleCitySelect(city.name)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-left transition-colors ${
                        selectedCity === city.name 
                          ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                      role="option"
                      aria-selected={selectedCity === city.name}
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className={`w-4 h-4 ${selectedCity === city.name ? 'text-white/90' : 'text-slate-400'}`} />
                        <div className="text-left">
                          <span className={`font-medium ${selectedCity === city.name ? 'text-white' : ''}`}>{city.name}</span>
                          <span className={`text-xs ${selectedCity === city.name ? 'text-white/70' : 'text-slate-400'}`}>
                            {city.projects} projects
                          </span>
                        </div>
                      </div>
                      {selectedCity === city.name && <CheckCircle2 className="w-4 h-4 text-white/90" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-400" />
          </div>
          <input
            ref={(el) => { if (el) (el as any)._componentRef = el; }}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search projects, localities, builders..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50/80 border border-slate-200/60 rounded-xl focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100/50 transition-all duration-200 text-sm"
            aria-label="Search properties"
          />
          
          {/* Suggestions */}
          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-40 overflow-hidden"
              >
                {filteredSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => onSuggestionClick(suggestion)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-indigo-50/50 transition-colors group"
                    type="button"
                  >
                    <Search className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600 group-hover:text-slate-800">{suggestion}</span>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <motion.button 
            onClick={onFilterToggle}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm"
            aria-label="Open filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </motion.button>
          
          <motion.button 
            onClick={onSearch}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSearching}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 text-sm disabled:opacity-70"
          >
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Search</span>
                <ArrowRight className="w-4 h-4 opacity-80" />
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Trust Signals - static, no animation */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 pt-3 border-t border-slate-100/60">
        {[
          { icon: CheckCircle2, text: 'Verified listings', color: 'text-emerald-500' },
          { icon: TrendingUp, text: 'Best prices', color: 'text-indigo-500' },
          { icon: Users, text: 'Expert guidance', color: 'text-cyan-500' },
        ].map((item) => (
          <span key={item.text} className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
            {item.text}
          </span>
        ))}
      </div>
    </motion.div>
  );
});

SearchBar.displayName = 'SearchBar';