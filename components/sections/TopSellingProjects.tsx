'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { MapPin, Heart, ChevronRight, ChevronLeft, Star, Phone, Filter, X } from 'lucide-react';
import { motion, AnimatePresence, type Transition, type Variants } from 'framer-motion';

// ✅ Import SearchFilters type from Hero
import type { SearchFilters } from '../Home/Hero';

// ✅ Import your project data
import properties from '@/data/properties.json';

// 🔁 Map your JSON structure to the card format + filtering fields
export interface CardProject {
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
  isTopSelling?: boolean;
  launchDate?: string;
  possessionDate?: string;
  amenities?: string[];
  description?: string;
}


// ✅ CityName type for strict type safety
export type CityName = 'Pune' | 'Mumbai' | 'KDMC';

// ✅ Props interface - NOW INCLUDES city prop
export interface TopSellingProjectsProps {
  city: CityName;
  filters?: SearchFilters;
  limit?: number;
  className?: string;
}

// ✅ Helper: Parse price string to numeric (INR)
function parsePriceToNumeric(priceStr: string | undefined | null): number {
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
    if (value.name) return String(value.name).toLowerCase().trim();
    if (value.label) return String(value.label).toLowerCase().trim();
    return String(value).toLowerCase().trim();
  }
  return String(value).toLowerCase().trim();
}

function mapProjectToCard(project: any): CardProject {
  const areas = project.priceDetails?.configurations?.map((c: any) => 
    String(c.area || '').replace(' sq.ft', '').replace(' sq. ft', '').trim()
  ) || [];
  
  const areaRange = areas.length > 1 
    ? `${areas[0]} to ${areas[areas.length - 1]} sq.ft`
    : areas[0] || 'Area On Request';
  
  const bhkTypes = project.priceDetails?.configurations?.map((c: any) => c.type) || [];
  const uniqueBhk = [...new Set(bhkTypes)].filter(Boolean).join(', ') || 'TBA';
  
  // ✅ Fix: Properly filter and type bhkValues as string[]
  const bhkValues: string[] = [...new Set(bhkTypes)]
    .map((t: any) => String(t || '').trim())
    .filter(Boolean) as string[];

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
    image: project.image || project.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80',
    rating: typeof project.rating === 'number' ? project.rating : 4.5,
    priceNumeric: parsePriceToNumeric(project.priceDetails?.range || project.price),
    builder,
    propertyType,
    bhkValues, // ✅ Now properly typed as string[]
    isTopSelling: project.isTopSelling || project.trending || false,
    launchDate: project.launchDate,
    possessionDate: project.possessionDate,
    amenities: project.amenities || [],
    description: project.description || '',
  };
}

// ✅ City to slug mapping for filtering
const CITY_SLUG_MAP: Record<CityName, string> = {
  'Pune': 'pune',
  'Mumbai': 'mumbai', 
  'KDMC': 'kdmc'
};

// ✅ CONFIG: Default limit for projects display
const DEFAULT_PROJECT_LIMIT = 8;

// ✅ Animation variants for cards - Fixed framer-motion Variants type compatibility
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.3, 
      ease: 'easeOut' as const  // ✅ Fixed: use 'as const' for literal type inference
    }
  }
};

export default function TopSellingProjects({ 
  city, 
  filters = {}, 
  limit = DEFAULT_PROJECT_LIMIT,
  className = ''
}: TopSellingProjectsProps) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAllFilters, setShowAllFilters] = useState(false);

  // 🔁 Convert all JSON projects to card format with memoization
  const allCardProjects = useMemo(() => 
    (properties || []).map(mapProjectToCard), 
  [properties]);

  // 🔁 Filter projects by city AND advanced filters
  const filteredProjects = useMemo(() => {
    let projects = [...allCardProjects];
    
    // Step 1: Filter by city (REQUIRED - from props)
    const citySlug = CITY_SLUG_MAP[city];
    projects = projects.filter(p => p.city === citySlug);
    
    // Step 2: Only show top selling/trending projects
    projects = projects.filter(p => p.isTopSelling || p.rating >= 4.0);
    
    // Step 3: Apply BHK filter (case-insensitive partial match)
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

    // Step 4: Apply price range filter
    if (filters.priceRange) {
      const { min, max } = filters.priceRange;
      projects = projects.filter(p => {
        const price = p.priceNumeric || 0;
        return price >= min && price <= (max === Infinity ? Number.MAX_SAFE_INTEGER : max);
      });
    }

    // Step 5: Apply builder filter (case-insensitive partial match)
    if (filters.builder?.length) {
      projects = projects.filter(p => 
        filters.builder!.some(builder => 
          (p.builder || '').includes(builder.toLowerCase().trim())
        )
      );
    }

    // Step 6: Apply property type filter
    if (filters.propertyType?.length) {
      projects = projects.filter(p => 
        filters.propertyType!.some(type => 
          (p.propertyType || '').includes(type.toLowerCase().trim())
        )
      );
    }

    // Step 7: Apply locality filter (partial match on location)
    if (filters.locality) {
      projects = projects.filter(p => 
        p.location.toLowerCase().includes(filters.locality!.toLowerCase().trim())
      );
    }

    // Sort by rating (descending) then by price (ascending)
    projects.sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return (a.priceNumeric || 0) - (b.priceNumeric || 0);
    });

    return projects;
  }, [city, filters, allCardProjects]);

  // ✅ LIMIT: Show only first N projects AFTER filtering
  const limitedProjects = useMemo(() => 
    filteredProjects.slice(0, limit),
  [filteredProjects, limit]);

  // 🔁 Ensure priority projects appear first (configurable per city)
  const orderedProjects = useMemo(() => {
    const prioritySlugs: Record<CityName, string[]> = {
      'Pune': ['mantra-codename-paradise', 'lodha-palava', 'kolte-patil-life-republic'],
      'Mumbai': ['sai-world-one', 'paradise-sai-world-empire', 'today-global'],
      'KDMC': ['paradise-sai-world-city', 'kolte-patil-life-republic-kalyan']
    };
    
    const priorities = prioritySlugs[city] || [];
    if (priorities.length === 0) return limitedProjects;
    
    const withPriority = limitedProjects.map(p => ({
      ...p,
      _priority: priorities.indexOf(p.slug)
    }));
    
    withPriority.sort((a, b) => {
      const aPrio = a._priority === -1 ? 999 : a._priority;
      const bPrio = b._priority === -1 ? 999 : b._priority;
      return aPrio - bPrio;
    });
    
    return withPriority.map(({ _priority, ...rest }) => rest);
  }, [limitedProjects, city]);

  // ✅ Calculate carousel metrics
  const itemsPerView = 3;
  const maxSlide = Math.max(0, Math.ceil(orderedProjects.length / itemsPerView) - 1);

  // ✅ Toggle favorite with persistence
  const toggleFavorite = useCallback((slug: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(slug) 
        ? prev.filter(f => f !== slug) 
        : [...prev, slug];
      // Optional: Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('propfinder_favorites', JSON.stringify(newFavorites));
      }
      return newFavorites;
    });
  }, []);

  // ✅ Load favorites from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('propfinder_favorites');
      if (saved) {
        try {
          setFavorites(JSON.parse(saved));
        } catch (e) {
          console.warn('Failed to parse favorites from localStorage');
        }
      }
    }
  }, []);

  // ✅ Carousel navigation
  const scrollLeft = useCallback(() => {
    setCurrentSlide(prev => Math.max(0, prev - 1));
  }, []);
  
  const scrollRight = useCallback(() => {
    setCurrentSlide(prev => Math.min(maxSlide, prev + 1));
  }, [maxSlide]);

  // ✅ Reset slide when filters or city change
  useEffect(() => {
    setCurrentSlide(0);
  }, [city, filters]);

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

  // ✅ Clear all filters callback
  const handleClearFilters = useCallback(() => {
    // Note: Parent component should handle filter clearing via props
    // This is a visual reset for carousel position
    setCurrentSlide(0);
  }, []);

  return (
    <section className={`py-16 bg-white ${className}`.trim()}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-3 py-1 bg-[#005E60]/10 text-[#005E60] text-xs font-semibold rounded-full mb-3"
          >
            🔥 Hot Properties
          </motion.span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Top Selling <span className="text-[#005E60]">Projects in {city}</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Most booked properties this month in {city}. RERA registered, verified listings with transparent pricing.
          </p>
        </div>

        {/* Active Filters Badge + Clear Button */}
        <AnimatePresence>
          {activeFilterCount > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center justify-center gap-3 mb-6"
            >
              <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-100 px-4 py-2 rounded-full">
                <Filter size={16} className="text-[#005E60]" />
                <span>{activeFilterCount} active filter{activeFilterCount > 1 ? 's' : ''}</span>
              </div>
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1 text-sm text-[#005E60] hover:text-[#004a4d] font-medium transition-colors"
              >
                <X size={14} />
                Clear filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Show message if no projects match */}
        {orderedProjects.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <MapPin size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-700 text-lg font-medium mb-2">No projects match your criteria</p>
            <p className="text-gray-500 text-sm mb-6">Try adjusting your filters or explore other categories in {city}</p>
            <Link 
              href={`/properties?city=${CITY_SLUG_MAP[city]}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#005E60] text-white rounded-lg font-medium hover:bg-[#004a4d] transition-colors"
            >
              Browse All Properties
              <ChevronRight size={18} />
            </Link>
          </motion.div>
        ) : (
          /* Projects Carousel */
          <div className="relative">
            {/* Navigation Arrows - Desktop */}
            <AnimatePresence>
              {orderedProjects.length > itemsPerView && (
                <>
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={scrollLeft}
                    disabled={currentSlide === 0}
                    className={`hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 lg:-translate-x-5 z-20 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white shadow-lg border border-gray-100 items-center justify-center transition-all duration-300 ${
                      currentSlide === 0 
                        ? 'opacity-30 cursor-not-allowed' 
                        : 'hover:scale-110 hover:shadow-xl hover:border-[#005E60]'
                    }`}
                    aria-label="Previous projects"
                  >
                    <ChevronLeft size={20} className="text-gray-700" />
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={scrollRight}
                    disabled={currentSlide >= maxSlide}
                    className={`hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 lg:translate-x-5 z-20 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white shadow-lg border border-gray-100 items-center justify-center transition-all duration-300 ${
                      currentSlide >= maxSlide 
                        ? 'opacity-30 cursor-not-allowed' 
                        : 'hover:scale-110 hover:shadow-xl hover:border-[#005E60]'
                    }`}
                    aria-label="Next projects"
                  >
                    <ChevronRight size={20} className="text-gray-700" />
                  </motion.button>
                </>
              )}
            </AnimatePresence>

            {/* Cards Container */}
            <div className="overflow-hidden">
              <motion.div 
                className="flex gap-4 lg:gap-6"
                animate={{ x: `-${currentSlide * (100 / itemsPerView + (itemsPerView === 3 ? 2 : 1.5))}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                {orderedProjects.map((project, index) => (
                  <motion.div
                    key={project.slug}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                    className="flex-shrink-0 w-[calc(33.333%-10.67px)] lg:w-[calc(33.333%-16px)] bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:border-[#005E60]/30 transition-all duration-300 group"
                  >
                    {/* Image Container */}
                    <div className="relative h-48 lg:h-52 overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (!target.dataset.fallback) {
                            target.dataset.fallback = 'true';
                            target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80';
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      
                      {/* Rating Badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-sm">
                        <Star size={12} className="fill-[#F8C21C] text-[#F8C21C]" />
                        <span className="text-xs font-bold text-gray-900">{project.rating.toFixed(1)}</span>
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite(project.slug);
                        }}
                        className="absolute top-3 right-3 w-9 h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
                        aria-label={favorites.includes(project.slug) ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Heart 
                          size={16} 
                          className={`transition-all duration-200 ${
                            favorites.includes(project.slug) 
                              ? 'fill-[#8B0000] text-[#8B0000] scale-110' 
                              : 'text-gray-600 hover:text-[#8B0000]'
                          }`} 
                        />
                      </button>

                      {/* Price Tag */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="bg-[#F8C21C] px-3.5 py-2 rounded-lg shadow-lg">
                          <p className="text-gray-900 font-bold text-sm lg:text-base">{project.price}</p>
                          <p className="text-gray-700 text-xs opacity-90">{project.area}</p>
                        </div>
                      </div>

                      {/* Top Selling Badge */}
                      {project.isTopSelling && (
                        <div className="absolute top-3 left-1/2 -translate-x-1/2">
                          <span className="px-3 py-1 bg-[#8B0000] text-white text-xs font-bold rounded-full shadow-lg">
                            🔥 Top Seller
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 lg:p-5">
                      <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-2 group-hover:text-[#005E60] transition-colors line-clamp-1">
                        {project.name}
                      </h3>
                      
                      <div className="flex items-start gap-2 text-gray-600 mb-3">
                        <MapPin size={14} className="text-[#8B0000] flex-shrink-0 mt-0.5" />
                        <span className="text-xs lg:text-sm line-clamp-2">{project.location}</span>
                      </div>

                      {/* BHK & Type */}
                      <div className="flex flex-wrap gap-1.5 mb-4 pb-4 border-b border-gray-100">
                        {project.bhkValues?.slice(0, 3).map((bhk) => (
                          <span 
                            key={bhk}
                            className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md"
                          >
                            {bhk} BHK
                          </span>
                        ))}
                        {project.bhkValues && project.bhkValues.length > 3 && (
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
                            +{project.bhkValues.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Link 
                          href={`/property/${project.slug}`}
                          className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-xs lg:text-sm font-semibold hover:border-[#005E60] hover:text-[#005E60] hover:bg-[#005E60]/5 transition-all text-center"
                        >
                          View Details
                        </Link>
                        <button 
                          className="flex-1 py-2.5 bg-[#005E60] text-white rounded-xl text-xs lg:text-sm font-semibold hover:bg-[#004a4d] transition-colors flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg"
                          onClick={(e) => {
                            e.preventDefault();
                            // Add click tracking or open contact modal here
                          }}
                        >
                          <Phone size={14} />
                          <span className="hidden sm:inline">Call</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Pagination Dots */}
            {maxSlide > 0 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: maxSlide + 1 }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'w-8 bg-[#005E60]' 
                        : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                    aria-current={index === currentSlide ? 'true' : 'false'}
                  />
                ))}
              </div>
            )}

            {/* Mobile Swipe Hint */}
            <div className="md:hidden text-center mt-4 text-gray-400 text-xs">
              ← Swipe to see more →
            </div>
          </div>
        )}

        {/* View All Link */}
        <div className="text-center mt-10">
          <Link 
            href={`/properties?city=${CITY_SLUG_MAP[city]}&sort=top-selling`}
            className="inline-flex items-center gap-2 text-[#005E60] font-semibold hover:text-[#004a4d] transition-colors group"
          >
            View All Projects in {city}
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}