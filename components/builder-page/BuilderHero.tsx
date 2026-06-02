// client/components/builder-page/BuilderHero.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image'; // 👈 Add this import
import { Search, MapPin, Filter, SlidersHorizontal } from 'lucide-react';

interface BuilderHeroProps {
  builderName?: string;
  projectCount?: number;
  slug?: string;
  logo?: string; // 👈 Add optional logo prop
  banner?: string; // 👈 Optional banner too
}

export default function BuilderHero({ 
  builderName, 
  projectCount = 0, 
  slug = 'all',
  logo,
  banner
}: BuilderHeroProps) {
  const [logoError, setLogoError] = useState(false); // 👈 Fallback state
  
  const formattedTitle = builderName 
    ? builderName 
    : slug?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'All Projects';

  const initial = builderName?.charAt(0).toUpperCase() || 'B'; // 👈 Fallback initial

  return (
    <section className="bg-gradient-to-br from-[#005E60] to-[#004a4d] text-white p-6 rounded-xl shadow-sm">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        
        {/* 👇 Logo with Fallback */}
        {logo && !logoError && (
          <div className="w-24 h-24 bg-white rounded-2xl p-4 shadow-xl flex-shrink-0">
            <Image
              src={logo}
              alt={`${formattedTitle} logo`}
              width={96}
              height={96}
              className="object-contain w-full h-full"
              onError={() => setLogoError(true)} // 👈 Handle error client-side
            />
          </div>
        )}
        
        {/* Fallback Initial if logo fails or not provided */}
        {(logoError || !logo) && (
          <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 border-2 border-white/20">
            <span className="text-4xl font-bold text-white">{initial}</span>
          </div>
        )}

        <div className="flex-1">
          <h1 className="page-title mb-1 capitalize">
            {formattedTitle}
          </h1>
          <p className="text-white/90 text-sm md:text-base">
            {projectCount > 0 
              ? `Showing ${projectCount} verified properties` 
              : 'Search & filter premium properties'}
          </p>
          
          {/* Quick Stats */}
          <div className="flex items-center gap-3 mt-3 text-sm">
            <span className="px-3 py-1 bg-white/10 rounded-full">
              {projectCount} Projects
            </span>
          </div>
        </div>
      </div>

      {/* Optional Banner */}
      {banner && !logoError && (
        <div className="mt-6 rounded-xl overflow-hidden">
          <Image
            src={banner}
            alt={`${formattedTitle} banner`}
            width={1200}
            height={300}
            className="w-full h-32 md:h-40 object-cover"
          />
        </div>
      )}

      {/* Search Bar */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
          <input
            type="text"
            placeholder="Search locality, project name, or amenities..."
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#F8C21C] transition-all text-sm"
          />
        </div>
        <button className="px-5 py-3 bg-[#F8C21C] text-[#8B0000] font-medium rounded-xl hover:bg-[#d4a017] transition-colors flex items-center justify-center gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters</span>
        </button>
      </div>
    </section>
  );
}