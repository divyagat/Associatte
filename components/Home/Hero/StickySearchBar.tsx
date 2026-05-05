'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Loader2 } from 'lucide-react';

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
}: StickySearchBarProps) => {
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-2xl shadow-xl border-b border-slate-200/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-hide">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeTab === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  onClick={() => onTabChange(cat.id)}
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
                onChange={(e) => onSearchQueryChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-8 pr-3 py-2 bg-slate-50 rounded-lg outline-none text-xs placeholder:text-slate-400 border border-slate-200 focus:border-indigo-400"
              />
            </div>
            <motion.button 
              onClick={onSearch} 
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
  );
});

StickySearchBar.displayName = 'StickySearchBar';