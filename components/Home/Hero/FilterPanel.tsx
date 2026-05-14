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
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Filters</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-6">
          {/* BHK Filter */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">BHK</h4>
            <div className="flex flex-wrap gap-2">
              {bhkOptions.map(option => (
                <button
                  key={option}
                  onClick={() => onFilterChange('bhk', option)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
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
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
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
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {builderOptions.map(builder => (
                <label key={builder} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.builder?.includes(builder)}
                    onChange={() => onFilterChange('builder', builder)}
                    className="rounded border-gray-300 text-[#005E60] focus:ring-[#005E60]"
                  />
                  <span className="text-sm text-gray-700">{builder}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClear}
            className="flex-1 py-3 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={onApply}
            className="flex-1 py-3 rounded-xl font-medium text-white bg-[#005E60] hover:bg-[#004a4d] transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
});

FilterPanel.displayName = 'FilterPanel';