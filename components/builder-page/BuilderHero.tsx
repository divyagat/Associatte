// client/components/builder-page/BuilderHero.tsx
'use client';

import { useState } from 'react';
import { Search, MapPin, Filter, SlidersHorizontal } from 'lucide-react';

interface BuilderHeroProps {
  builderName?: string;
  projectCount?: number;
  slug?: string;
}

export default function BuilderHero({ 
  builderName, 
  projectCount = 0, 
  slug = 'all' // ✅ Default fallback
}: BuilderHeroProps) {
  // ✅ Safe formatting: handles undefined, null, or empty strings
  const formattedTitle = builderName 
    ? builderName 
    : slug?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'All Projects';

  return (
    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 capitalize mb-1">
            {formattedTitle} Projects
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            {projectCount > 0 
              ? `Showing ${projectCount} verified properties in ${formattedTitle}` 
              : 'Search & filter premium properties by builder or location'}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 text-sm">
          <span className="px-3 py-1 bg-[#005E60]/10 text-[#005E60] rounded-full font-medium">
            {projectCount} Projects
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search locality, project name, or amenities..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005E60]/20 focus:border-[#005E60] transition-all text-sm"
          />
        </div>
        <button className="px-5 py-3 bg-[#005E60] text-white font-medium rounded-xl hover:bg-[#004a4d] transition-colors flex items-center justify-center gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          <span className="sm:hidden">Filter</span>
        </button>
      </div>
    </section>
  );
}