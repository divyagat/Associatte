// @/components/Home/Hero/FilterPanel.tsx
'use client';

import { memo } from 'react';
import { X } from 'lucide-react';
import type { SearchFilters } from '../Hero';

export interface FilterPanelProps {
  filters: SearchFilters;
  bhkOptions: readonly string[];
  builderOptions: readonly string[];
  propertyTypes: readonly string[];
  priceRanges: ReadonlyArray<{ label: string; min: number; max: number }>;
  onFilterChange: (filterType: keyof SearchFilters, value: any) => void;
  onClear: () => void;
  onApply: () => void;
  onClose: () => void;
  isNavigating?: boolean;
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
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h3 className="font-semibold text-gray-900">Filters</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-6">
          {/* BHK Filter */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">BHK</h4>
            <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
              {bhkOptions.map(option => (
                <button
                  key={option}
                  onClick={() => onFilterChange('bhk', option)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    filters.bhk?.includes(option)
                      ? 'bg-[#005E60] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
            <div className="space-y-2">
              {priceRanges.map(range => (
                <button
                  key={range.label}
                  onClick={() => onFilterChange('priceRange', { min: range.min, max: range.max })}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    filters.priceRange?.min === range.min && filters.priceRange?.max === range.max
                      ? 'bg-[#005E60] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Builder Filter */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Builder</h4>
            <div className="space-y-3 max-h-40 overflow-y-auto">
              {builderOptions.map(builder => (
                <label key={builder} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.builder?.includes(builder)}
                    onChange={() => onFilterChange('builder', builder)}
                    className="w-5 h-5 rounded border-gray-300 text-[#005E60] focus:ring-[#005E60]"
                  />
                  <span className="text-sm text-gray-700">{builder}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3 sticky bottom-0 bg-white">
          <button
            onClick={onClear}
            className="w-full sm:flex-1 py-3.5 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={onApply}
            className="w-full sm:flex-1 py-3.5 rounded-xl font-medium text-white bg-[#005E60] hover:bg-[#004a4d] transition-colors shadow-lg"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
});

FilterPanel.displayName = 'FilterPanel';