// @/components/Home/Hero/FilterPanel.tsx
'use client';

import { memo, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, MapPin } from 'lucide-react';
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
  currentPageLocation?: 'pune' | 'mumbai' | 'kdmc';
}

const BRAND_GREEN = '#005E60';
const BRAND_RED = '#8B0000';

// ✅ KDMC MUST BE HERE
const ALLOWED_LOCATIONS = ['Mumbai', 'Pune', 'KDMC'] as const;
export type AllowedLocation = typeof ALLOWED_LOCATIONS[number];

const LOCATION_SLUG_MAP: Record<AllowedLocation, string> = {
  'Mumbai': 'mumbai',
  'Pune': 'pune',
  'KDMC': 'kdmc',
};

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
  currentPageLocation,
}: FilterPanelProps) => {
  
  useEffect(() => {
    console.log('✅ FilterPanel ALLOWED_LOCATIONS:', ALLOWED_LOCATIONS);
  }, []);

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

  const toggleLocation = useCallback((loc: AllowedLocation) => {
    if (currentPageLocation) return;
    const slug = LOCATION_SLUG_MAP[loc];
    const newLocality = filters.locality === slug ? undefined : slug;
    onFilterChange({ ...filters, locality: newLocality });
  }, [filters, onFilterChange, currentPageLocation]);

  const setPriceRange = useCallback((min: number, max: number) => {
    onFilterChange({ ...filters, priceRange: { min, max } });
  }, [filters, onFilterChange]);

  const isLocationActive = (loc: AllowedLocation) => 
    filters.locality === LOCATION_SLUG_MAP[loc];

  const getActiveLocationName = () => {
    if (!filters.locality) return null;
    return (Object.entries(LOCATION_SLUG_MAP).find(([_, slug]) => slug === filters.locality)?.[0]) || null;
  };

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
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-red-50 transition-colors" aria-label="Close filters">
            <X className="w-5 h-5" style={{ color: BRAND_RED }} />
          </button>
        </div>

        {/* 📍 Location Filter */}
        {!currentPageLocation && (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" style={{ color: BRAND_GREEN }} /> Location
            </label>
            <div className="flex flex-wrap gap-2">
              {ALLOWED_LOCATIONS.map(loc => (
                <button
                  key={loc}
                  onClick={() => toggleLocation(loc)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                    isLocationActive(loc)
                      ? 'text-white border-transparent shadow-md'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                  style={{
                    backgroundColor: isLocationActive(loc) ? BRAND_GREEN : undefined,
                    borderColor: isLocationActive(loc) ? BRAND_GREEN : undefined
                  }}
                  aria-pressed={isLocationActive(loc)}
                >
                  {loc} {/* ✅ Will show "KDMC" */}
                </button>
              ))}
            </div>
            {filters.locality && (
              <p className="text-xs text-slate-500 mt-2">
                Filtering: <span className="font-medium" style={{ color: BRAND_GREEN }}>{getActiveLocationName()}</span>
              </p>
            )}
          </div>
        )}

        {/* 🏠 BHK Filter */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-3">BHK Type</label>
          <div className="flex flex-wrap gap-2">
            {bhkOptions.map(bhk => (
              <button
                key={bhk}
                onClick={() => toggleBhk(bhk)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                  filters.bhk?.includes(bhk)
                    ? 'text-white border-transparent shadow-md'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
                style={{
                  backgroundColor: filters.bhk?.includes(bhk) ? BRAND_GREEN : undefined,
                  borderColor: filters.bhk?.includes(bhk) ? BRAND_GREEN : undefined
                }}
                aria-pressed={filters.bhk?.includes(bhk)}
              >
                {bhk}
              </button>
            ))}
          </div>
        </div>

        {/* 💰 Price Range */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-3">Budget</label>
          <div className="space-y-2.5">
            {priceRanges.map(range => {
              const isSelected = filters.priceRange?.min === range.min && filters.priceRange?.max === range.max;
              return (
                <label key={range.label} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={isSelected}
                    onChange={() => setPriceRange(range.min, range.max)}
                    className="w-4 h-4 border-slate-300 focus:ring-2"
                    style={{ accentColor: BRAND_GREEN }}
                  />
                  <span className={`text-sm transition-colors ${isSelected ? 'font-medium text-slate-800' : 'text-slate-600 group-hover:text-slate-800'}`}>
                    {range.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 🏗️ Builders */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-3">Builders</label>
          <div className="space-y-2 max-h-36 overflow-y-auto pr-2 scrollbar-thin">
            {builderOptions.map(builder => (
              <label key={builder} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.builder?.includes(builder)}
                  onChange={() => toggleBuilder(builder)}
                  className="w-4 h-4 rounded border-slate-300 focus:ring-2"
                  style={{ accentColor: BRAND_GREEN }}
                />
                <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">{builder}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 🏢 Property Type */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-3">Property Type</label>
          <div className="flex flex-wrap gap-2">
            {propertyTypes.map(type => (
              <button
                key={type}
                onClick={() => togglePropertyType(type)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                  filters.propertyType?.includes(type)
                    ? 'text-white border-transparent shadow-md'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
                style={{
                  backgroundColor: filters.propertyType?.includes(type) ? BRAND_GREEN : undefined,
                  borderColor: filters.propertyType?.includes(type) ? BRAND_GREEN : undefined
                }}
                aria-pressed={filters.propertyType?.includes(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* ✅ Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-slate-100 sticky bottom-0 bg-white pb-2">
          <button
            onClick={onClear}
            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold transition-colors hover:bg-red-50"
            style={{ color: BRAND_RED }}
          >
            Clear All
          </button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onApply}
            className="flex-1 px-4 py-2.5 text-white rounded-xl text-sm font-semibold shadow-lg transition-colors"
            style={{ 
              backgroundColor: BRAND_GREEN,
              boxShadow: `0 4px 14px 0 ${BRAND_GREEN}40`
            }}
          >
            Apply Filters
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
});

FilterPanel.displayName = 'FilterPanel';