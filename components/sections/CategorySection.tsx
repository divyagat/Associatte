// components/sections/CategorySection.tsx
'use client';

import { motion } from 'framer-motion';
import { Building2, Map, Home, TrendingUp, Store, Key } from 'lucide-react';
import Link from 'next/link';
import properties from '../../data/properties.json';

// ✅ PROPS INTERFACE (city is now optional)
interface CategorySectionProps {
  city?: 'Pune' | 'Mumbai' | 'KDMC';
  featuredLocalities?: readonly string[];
}

// 🔗 Icon mapping for property types
const TYPE_ICONS: Record<string, React.ElementType> = {
  residential: Building2,
  commercial: Store,
  'pre-launch': TrendingUp,
  ready: Home,
  rent: Key,
  plots: Map,
};

// 🎨 Color mapping
const TYPE_COLORS: Record<string, string> = {
  residential: '#005E60',
  commercial: '#8B0000',
  'pre-launch': '#F8C21C',
  ready: '#005E60',
  rent: '#8B0000',
  plots: '#F8C21C',
};

// 🖼️ Image mapping
const TYPE_IMAGES: Record<string, string> = {
  residential: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80',
  commercial: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80',
  'pre-launch': 'https://images.unsplash.com/photo-1541888946373-6ca29e5f6f0f?w=400&q=80',
  ready: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&q=80',
  rent: 'https://images.unsplash.com/photo-1560448204-8cf87f3c39c4?w=400&q=80',
  plots: 'https://images.unsplash.com/photo-1500382017468-9049fed18f3e?w=400&q=80',
};

// ✅ PROPERTY TYPES CONFIG
const PROPERTY_TYPES = [
  { id: 'residential', label: 'Apartments' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'pre-launch', label: 'Pre-Launch' },
  { id: 'ready', label: 'Ready to Move' },
  { id: 'rent', label: 'For Rent' },
  { id: 'plots', label: 'Plots & Land' },
] as const;

type PropertyTypeId = typeof PROPERTY_TYPES[number]['id'];

// ✅ Helper: Determine property type
const getPropertyType = (project: any): PropertyTypeId => {
  if (project.propertyType && PROPERTY_TYPES.some(t => t.id === project.propertyType)) {
    return project.propertyType;
  }

  const configs = project.priceDetails?.configurations || [];
  
  if (configs.some((c: any) => c.type?.toLowerCase().includes('plot'))) return 'plots';
  if (configs.some((c: any) => c.type?.toLowerCase().includes('office') || c.type?.toLowerCase().includes('shop'))) return 'commercial';
  
  const possession = project.possessionDate?.toLowerCase() || '';
  if (possession.includes('ready')) return 'ready';
  
  if (project.possessionDate && !possession.includes('ready')) {
    try {
      if (new Date(project.possessionDate) > new Date('2027-12-31')) return 'pre-launch';
    } catch (e) {}
  }
  
  return 'residential';
};

// ✅ Helper: Get unique localities
const getCityLocalities = (city: string): string[] => {
  const cityLower = city.toLowerCase();
  const localities = new Set<string>();
  properties.forEach((p: any) => {
    if (p.location?.toLowerCase() === cityLower && p.fullLocation?.area) {
      localities.add(p.fullLocation.area);
    }
  });
  return Array.from(localities).slice(0, 4);
};

export default function CategorySection({ city, featuredLocalities = [] }: CategorySectionProps) {
  const isMultiCity = !city;
  const cityFilter = city ? city.toLowerCase() : null;
  
  // 🔢 Calculate counts (filtered by city or global)
  const typeCounts = PROPERTY_TYPES.reduce((acc, type) => {
    acc[type.id] = properties.filter(p => {
      if (cityFilter && p.location?.toLowerCase() !== cityFilter) return false;
      return getPropertyType(p) === type.id;
    }).length;
    return acc;
  }, {} as Record<PropertyTypeId, number>);

  // 🎯 Show max 4 categories with inventory
  const visibleCategories = PROPERTY_TYPES
    .filter(type => typeCounts[type.id] > 0)
    .slice(0, 4);

  // 📍 Dynamic localities & text
  const cityLocalities = city ? getCityLocalities(city) : [];
  const displayLocalities = featuredLocalities.length > 0 ? featuredLocalities.slice(0, 3) : cityLocalities;
  
  const heading = city 
    ? `Explore Properties in ${city}` 
    : 'Explore Properties Across Pune, Mumbai & KDMC';
    
  const subtext = city
    ? `Browse by category — from ready-to-move homes to pre-launch investments. Popular in ${displayLocalities.join(', ')}${displayLocalities.length > 0 && displayLocalities.length < cityLocalities.length ? ' & more' : ''}.`
    : `Discover premium real estate across Maharashtra's top locations. Find apartments, plots, and ready-to-move homes tailored to your lifestyle.`;

  const viewAllLink = city ? `/properties?location=${cityFilter}` : '/properties';
  const viewAllText = city ? `View All Properties in ${city}` : 'View All Properties';

  return (
    <section className="py-10 sm:py-14 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
            {heading}
          </h2>
          <p className="text-gray-600 mt-2 sm:mt-3 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-2 leading-relaxed">
            {subtext}
          </p>
          <div className="w-12 h-1 sm:w-16 sm:h-1 bg-[#005E60] mx-auto mt-4 rounded-full" />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {visibleCategories.map((category, index) => {
            const Icon = TYPE_ICONS[category.id];
            const count = typeCounts[category.id];
            const color = TYPE_COLORS[category.id];
            const image = TYPE_IMAGES[category.id];

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="group cursor-pointer"
              >
                <Link 
                  href={`/properties?type=${category.id}${cityFilter ? `&location=${cityFilter}` : ''}`}
                  className="block h-full"
                >
                  <div className="relative overflow-hidden rounded-xl shadow-md sm:shadow-lg h-48 sm:h-56 md:h-64 xl:h-72">
                    {/* Image */}
                    <img
                      src={image}
                      alt={`${category.label} properties`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    
                    {/* Icon badge */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 sm:top-4">
                      <div 
                        className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundColor: color }}
                      >
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-center">
                      <h3 className="text-white font-bold text-sm sm:text-base md:text-lg mb-0.5 sm:mb-1 drop-shadow-sm">
                        {category.label}
                      </h3>
                      <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                        <span className="text-white/90 text-xs sm:text-sm font-medium">{count}</span>
                        <span className="text-white/70 text-[10px] sm:text-xs">properties</span>
                      </div>
                    </div>
                    
                    {/* Hover indicator */}
                    <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/40 rounded-xl transition-colors duration-300 pointer-events-none" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-6 sm:mt-10 px-4">
          <Link 
            href={viewAllLink}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-8 py-2.5 sm:py-3 bg-[#F8C21C] text-[#8B0000] font-semibold rounded-xl hover:bg-[#d4a017] active:bg-[#c28f12] transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#F8C21C] focus:ring-offset-2"
          >
            {viewAllText}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}