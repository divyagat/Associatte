'use client';

import { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { SearchFilters } from '../Hero';

interface FilterPanelProps {
  filters: SearchFilters;
  bhkOptions: readonly string[];
  builderOptions: readonly string[];
  propertyTypes: readonly string[];
  priceRanges: readonly { label: string; min: number; max: number }[];
  onFilterChange: (filters: SearchFilters) => void;
  onClear: () => void;
  onApply: () => void;
  onClose: () => void;
}

export const FilterPanel = memo(({
  filters,
  bhkOptions,
  builderOptions,
  propertyTypes,
  priceRanges,
  onFilterChange,
  onClear,
  onApply,
  onClose,
}: FilterPanelProps) => {
  
  const toggleBhk = useCallback((bhk: string) => {
    const current = filters.bhk || [];
    const updated = current.includes(bhk) 
      ? current.filter(b => b !== bhk)
      : [...current, bhk];
    onFilterChange({ ...filters, bhk: updated.length ? updated : undefined });
  }, [filters, onFilterChange]);

  const toggleBuilder = useCallback((builder: string) => {
    const current = filters.builder || [];
    const updated = current.includes(builder) 
      ? current.filter(b => b !== builder)
      : [...current, builder];
    onFilterChange({ ...filters, builder: updated.length ? updated : undefined });
  }, [filters, onFilterChange]);

  const togglePropertyType = useCallback((type: string) => {
    const current = filters.propertyType || [];
    const updated = current.includes(type) 
      ? current.filter(t => t !== type)
      : [...current, type];
    onFilterChange({ ...filters, propertyType: updated.length ? updated : undefined });
  }, [filters, onFilterChange]);

  const setPriceRange = useCallback((min: number, max: number) => {
    onFilterChange({ ...filters, priceRange: { min, max } });
  }, [filters, onFilterChange]);

  return (
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
              <button
                key={bhk}
                onClick={() => toggleBhk(bhk)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filters.bhk?.includes(bhk)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                aria-pressed={filters.bhk?.includes(bhk)}
              >
                {bhk}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-3">Budget</label>
          <div className="space-y-2">
            {priceRanges.map(range => (
              <label key={range.label} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="priceRange"
                  checked={filters.priceRange?.min === range.min && filters.priceRange?.max === range.max}
                  onChange={() => setPriceRange(range.min, range.max)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-600">{range.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Builders */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-3">Builders</label>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {builderOptions.map(builder => (
              <label key={builder} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.builder?.includes(builder)}
                  onChange={() => toggleBuilder(builder)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-600">{builder}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Property Type */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-3">Property Type</label>
          <div className="flex flex-wrap gap-2">
            {propertyTypes.map(type => (
              <button
                key={type}
                onClick={() => togglePropertyType(type)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filters.propertyType?.includes(type)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-slate-100 sticky bottom-0 bg-white pb-2">
          <button
            onClick={onClear}
            className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Clear All
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onApply}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/30"
          >
            Apply Filters
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
});

FilterPanel.displayName = 'FilterPanel';