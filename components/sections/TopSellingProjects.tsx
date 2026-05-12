// @/components/sections/TopSellingProjects.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { MapPin, Heart, ChevronRight, ChevronLeft, Star, Phone, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

// ✅ Import SearchFilters type from Hero (same as NewlyLaunchedProjects)
import type { SearchFilters } from '../Home/Hero';

// ✅ Import your project data
import properties from '@/data/properties.json';

// 🔁 Map your JSON structure to the card format + filtering fields
interface CardProject {
  slug: string;
  name: string;
  location: string;
  city: string;
  price: string;
  area: string;
  type: string;
  image: string;
  rating: number;
  // ✅ Internal fields for filtering
  priceNumeric?: number;
  builder?: string;
  propertyType?: string;
  bhkValues?: string[];
}

// ✅ Helper: Parse price string to numeric (INR)
function parsePriceToNumeric(priceStr: string): number {
  if (!priceStr) return 0;
  
  const clean = String(priceStr).replace(/[₹,\s]/g, '').toLowerCase();
  
  if (clean.includes('crore')) {
    const num = parseFloat(clean);
    return !isNaN(num) ? num * 10000000 : 0;
  } else if (clean.includes('lakh')) {
    const num = parseFloat(clean);
    return !isNaN(num) ? num * 100000 : 0;
  } else if (clean.includes('k')) {
    const num = parseFloat(clean);
    return !isNaN(num) ? num * 1000 : 0;
  }
  
  const num = parseFloat(clean);
  return !isNaN(num) ? num : 0;
}

// ✅ Helper: Safely convert any value to lowercase string
function toSafeLowerString(value: any): string {
  if (!value) return '';
  if (typeof value === 'string') return value.toLowerCase().trim();
  if (typeof value === 'object' && value !== null) {
    // Handle objects like { name: "Builder Name" }
    if (value.name) return String(value.name).toLowerCase().trim();
    if (value.label) return String(value.label).toLowerCase().trim();
    return String(value).toLowerCase().trim();
  }
  return String(value).toLowerCase().trim();
}

// 🔁 Map JSON project to CardProject with filtering fields
function mapProjectToCard(project: any): CardProject {
  const areas = project.priceDetails?.configurations?.map((c: any) => 
    String(c.area || '').replace(' sq.ft', '').replace(' sq. ft', '').trim()
  ) || [];
  
  const areaRange = areas.length > 1 
    ? `${areas[0]} to ${areas[areas.length - 1]} sq.ft`
    : areas[0] || 'Area On Request';
  
  const bhkTypes = project.priceDetails?.configurations?.map((c: any) => c.type) || [];
  const uniqueBhk = [...new Set(bhkTypes)].filter(Boolean).join(', ') || 'TBA';
  const bhkValues = [...new Set(bhkTypes.map((t: string) => String(t || '').trim()))].filter(Boolean);

  // ✅ Safe extraction with string coercion
  const builder = toSafeLowerString(project.builder || project.developer || project.company);
  const propertyType = toSafeLowerString(project.propertyType || project.category || 'Apartment');
  const city = toSafeLowerString(project.location || project.fullLocation?.city);

  return {
    slug: project.slug || '',
    name: String(project.name || 'Untitled Project'),
    location: `${project.fullLocation?.area || project.location || ''}, ${project.fullLocation?.city || ''}`.trim(),
    city,
    price: project.priceDetails?.range || project.price || 'Price On Request',
    area: areaRange,
    type: uniqueBhk,
    image: project.image || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80',
    rating: typeof project.rating === 'number' ? project.rating : 5,
    // ✅ Filtering fields - SAFE string conversion
    priceNumeric: parsePriceToNumeric(project.priceDetails?.range || project.price),
    builder,
    propertyType,
    bhkValues,
  };
}

// ✅ City filter options
const cities = ['All', 'Pune', 'Mumbai', 'KDMC'];

// ✅ CONFIG: Set how many projects to show (6-8)
const MAX_PROJECTS_TO_SHOW = 8;

// ✅ Props interface
interface TopSellingProjectsProps {
  filters?: SearchFilters;
}

export default function TopSellingProjects({ filters = {} }: TopSellingProjectsProps) {
  const [selectedCity, setSelectedCity] = useState('All');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // 🔁 Convert all JSON projects to card format
  const allCardProjects = useMemo(() => 
    properties.map(mapProjectToCard), 
  [properties]);

  // 🔁 Filter by city FIRST, then apply advanced filters
  const filteredProjects = useMemo(() => {
    // Step 1: Filter by city
    let projects = [...allCardProjects];
    
    if (selectedCity !== 'All') {
      const locationMap: Record<string, string> = {
        'Pune': 'pune',
        'Mumbai': 'mumbai', 
        'KDMC': 'kdmc'
      };
      projects = projects.filter(p => p.city === locationMap[selectedCity]);
    }

    // Step 2: Apply BHK filter (case-insensitive partial match)
    if (filters.bhk?.length) {
      projects = projects.filter(p => 
        filters.bhk!.some(bhk => {
          const searchBhk = bhk.toUpperCase().trim();
          return (
            p.bhkValues?.some(val => val.toUpperCase().includes(searchBhk)) ||
            p.type.toUpperCase().includes(searchBhk)
          );
        })
      );
    }

    // Step 3: Apply price range filter
    if (filters.priceRange) {
      const { min, max } = filters.priceRange;
      projects = projects.filter(p => {
        const price = p.priceNumeric || 0;
        return price >= min && price <= (max === Infinity ? Number.MAX_SAFE_INTEGER : max);
      });
    }

    // Step 4: Apply builder filter (case-insensitive partial match)
    if (filters.builder?.length) {
      projects = projects.filter(p => 
        filters.builder!.some(builder => 
          (p.builder || '').includes(builder.toLowerCase().trim())
        )
      );
    }

    // Step 5: Apply property type filter
    if (filters.propertyType?.length) {
      projects = projects.filter(p => 
        filters.propertyType!.some(type => 
          (p.propertyType || '').includes(type.toLowerCase().trim())
        )
      );
    }

    // Step 6: Apply locality filter (partial match on location)
    if (filters.locality) {
      projects = projects.filter(p => 
        p.location.toLowerCase().includes(filters.locality!.toLowerCase().trim())
      );
    }

    return projects;
  }, [selectedCity, filters, allCardProjects]);

  // ✅ LIMIT: Show only first 6-8 projects AFTER filtering
  const limitedProjects = useMemo(() => 
    filteredProjects.slice(0, MAX_PROJECTS_TO_SHOW),
  [filteredProjects]);

  // 🔁 Ensure sai-world-one is first when Mumbai is selected (within limited projects)
  const orderedProjects = useMemo(() => {
    if (selectedCity !== 'Mumbai') return limitedProjects;
    
    const saiIndex = limitedProjects.findIndex(p => p.slug === 'sai-world-one');
    if (saiIndex <= 0) return limitedProjects;
    
    const reordered = [...limitedProjects];
    const [sai] = reordered.splice(saiIndex, 1);
    return [sai, ...reordered];
  }, [limitedProjects, selectedCity]);

  // ✅ Calculate max slide based on limited projects
  const maxSlide = Math.max(0, orderedProjects.length - 3);

  const toggleFavorite = (slug: string) => {
    setFavorites(prev => 
      prev.includes(slug) ? prev.filter(f => f !== slug) : [...prev, slug]
    );
  };

  const scrollLeft = () => setCurrentSlide(prev => Math.max(0, prev - 1));
  const scrollRight = () => setCurrentSlide(prev => Math.min(maxSlide, prev + 1));

  // Reset slide when filters or city change
  useEffect(() => {
    setCurrentSlide(0);
  }, [selectedCity, filters]);

  // ✅ Count active filters for badge
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.bhk?.length) count++;
    if (filters.priceRange) count++;
    if (filters.builder?.length) count++;
    if (filters.propertyType?.length) count++;
    if (filters.locality) count++;
    return count;
  }, [filters]);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Top Selling <span className="text-[#005E60]">Recommended Projects</span>
          </h2>
          <p className="text-gray-600">Projects in high demand</p>
        </div>

        {/* City Filter + Active Filters Badge */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          {/* City Buttons */}
          <div className="flex justify-center gap-1.5 flex-wrap">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                  selectedCity === city
                    ? 'bg-[#005E60] text-white shadow-lg shadow-teal-500/30'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
          
          {/* Active Filters Badge */}
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-full">
              <Filter size={16} className="text-[#005E60]" />
              <span>{activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} applied</span>
            </div>
          )}
        </div>

        {/* Show message if no projects match filters */}
        {orderedProjects.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-gray-500 text-lg">No projects match your filters</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or explore other categories</p>
          </div>
        ) : (
          /* Projects Carousel */
          <div className="relative">
            {/* Navigation Arrows */}
            <button
              onClick={scrollLeft}
              disabled={currentSlide === 0}
              className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 ${
                currentSlide === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'
              }`}
              aria-label="Previous projects"
            >
              <ChevronLeft size={20} className="text-gray-700" />
            </button>

            <button
              onClick={scrollRight}
              disabled={currentSlide >= maxSlide}
              className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 ${
                currentSlide >= maxSlide ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'
              }`}
              aria-label="Next projects"
            >
              <ChevronRight size={20} className="text-gray-700" />
            </button>

            {/* Cards Container */}
            <div className="overflow-hidden">
              <motion.div 
                className="flex gap-4"
                animate={{ x: `-${currentSlide * (100 / 3 + 1.33)}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                {orderedProjects.map((project) => (
                  <div
                    key={project.slug}
                    className="flex-shrink-0 w-[calc(33.333%-10.67px)] bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 group"
                  >
                    {/* Image */}
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (!target.dataset.fallback) {
                            target.dataset.fallback = 'true';
                            target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80';
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      
                      {/* Rating */}
                      <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-white/95 backdrop-blur rounded-full">
                        <Star size={12} className="fill-[#F8C21C] text-[#F8C21C]" />
                        <span className="text-xs font-bold text-gray-900">{project.rating}.0</span>
                      </div>

                      {/* Favorite */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite(project.slug);
                        }}
                        className="absolute top-3 right-3 w-8 h-8 bg-white/95 backdrop-blur rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                        aria-label={favorites.includes(project.slug) ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Heart 
                          size={14} 
                          className={`transition-colors ${
                            favorites.includes(project.slug) ? 'fill-[#8B0000] text-[#8B0000]' : 'text-gray-600'
                          }`} 
                        />
                      </button>

                      {/* Price */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="bg-[#F8C21C] px-3 py-1.5 rounded-md">
                          <p className="text-gray-900 font-bold text-sm">{project.price}</p>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-base font-bold text-gray-900 mb-1.5 group-hover:text-[#005E60] transition-colors line-clamp-1">
                        {project.name}
                      </h3>
                      
                      <div className="flex items-center gap-1.5 text-gray-600 mb-3">
                        <MapPin size={14} className="text-[#8B0000] flex-shrink-0" />
                        <span className="text-xs truncate">{project.location}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-600 mb-4 pb-4 border-b border-gray-100">
                        <span className="line-clamp-1">{project.area}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full flex-shrink-0" />
                        <span className="line-clamp-1">{project.type}</span>
                      </div>

                      {/* View Details Button */}
                      <div className="flex gap-2">
                        <Link 
                          href={`/property/${project.slug}`}
                          className="flex-1 py-2 border border-gray-200 text-gray-700 rounded-lg text-xs font-semibold hover:border-[#005E60] hover:text-[#005E60] transition-colors text-center"
                        >
                          View Details
                        </Link>
                        <button 
                          className="flex-1 py-2 bg-[#005E60] text-white rounded-lg text-xs font-semibold hover:bg-[#004a4d] transition-colors flex items-center justify-center gap-1"
                          onClick={(e) => e.preventDefault()}
                        >
                          <Phone size={14} />
                          Call
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Dots */}
            {maxSlide > 0 && (
              <div className="flex justify-center gap-1.5 mt-6">
                {Array.from({ length: maxSlide + 1 }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'w-6 bg-[#005E60]' : 'w-2 bg-gray-300'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}