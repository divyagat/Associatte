'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import { MapPin, Heart, ChevronRight, ChevronLeft, Star, Phone, Filter, X } from 'lucide-react';
import { motion, AnimatePresence, PanInfo, useAnimation } from 'framer-motion';

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

// ✅ Props interface
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
    bhkValues,
    isTopSelling: project.isTopSelling || project.trending || false,
    launchDate: project.launchDate,
    possessionDate: project.possessionDate,
    amenities: project.amenities || [],
    description: project.description || '',
  };
}

// ✅ City to slug mapping
const CITY_SLUG_MAP: Record<CityName, string> = {
  'Pune': 'pune',
  'Mumbai': 'mumbai', 
  'KDMC': 'kdmc'
};

// ✅ CONFIG
const DEFAULT_PROJECT_LIMIT = 8;

// ✅ Responsive breakpoints
const BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
  desktop: 1280,
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
  // ✅ Safe default for SSR to prevent hydration mismatch
  const [viewportWidth, setViewportWidth] = useState(1280);
  const [isDragging, setIsDragging] = useState(false);
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  // ✅ Track viewport width for responsive behavior
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setViewportWidth(window.innerWidth);
      const handleResize = () => setViewportWidth(window.innerWidth);
      window.addEventListener('resize', handleResize, { passive: true });
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // ✅ Dynamic items per view based on screen size
  const itemsPerView = useMemo(() => {
    if (viewportWidth < BREAKPOINTS.mobile) return 1;
    if (viewportWidth < BREAKPOINTS.tablet) return 2;
    return 3;
  }, [viewportWidth]);

  // ✅ Dynamic gap based on screen size
  const gapSize = useMemo(() => {
    if (viewportWidth < BREAKPOINTS.mobile) return 12;
    if (viewportWidth < BREAKPOINTS.tablet) return 16;
    return 24;
  }, [viewportWidth]);

  // 🔁 Convert all JSON projects to card format
  const allCardProjects = useMemo(() => 
    (properties || []).map(mapProjectToCard), 
  [properties]);

  // 🔁 Filter projects
  const filteredProjects = useMemo(() => {
    let projects = [...allCardProjects];
    const citySlug = CITY_SLUG_MAP[city];
    projects = projects.filter(p => p.city === citySlug);
    projects = projects.filter(p => p.isTopSelling || p.rating >= 4.0);
    
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

    if (filters.priceRange) {
      const { min, max } = filters.priceRange;
      projects = projects.filter(p => {
        const price = p.priceNumeric || 0;
        return price >= min && price <= (max === Infinity ? Number.MAX_SAFE_INTEGER : max);
      });
    }

    if (filters.builder?.length) {
      projects = projects.filter(p => 
        filters.builder!.some(builder => 
          (p.builder || '').includes(builder.toLowerCase().trim())
        )
      );
    }

    if (filters.propertyType?.length) {
      projects = projects.filter(p => 
        filters.propertyType!.some(type => 
          (p.propertyType || '').includes(type.toLowerCase().trim())
        )
      );
    }

    if (filters.locality) {
      projects = projects.filter(p => 
        p.location.toLowerCase().includes(filters.locality!.toLowerCase().trim())
      );
    }

    projects.sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return (a.priceNumeric || 0) - (b.priceNumeric || 0);
    });

    return projects;
  }, [city, filters, allCardProjects]);

  const limitedProjects = useMemo(() => 
    filteredProjects.slice(0, limit),
  [filteredProjects, limit]);

  // ✅ Priority ordering
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

  // ✅ Carousel metrics
  const maxSlide = useMemo(() => {
    if (orderedProjects.length <= itemsPerView) return 0;
    return Math.max(0, Math.ceil(orderedProjects.length / itemsPerView) - 1);
  }, [orderedProjects.length, itemsPerView]);

  // ✅ Toggle favorite
  const toggleFavorite = useCallback((slug: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(slug) 
        ? prev.filter(f => f !== slug) 
        : [...prev, slug];
      if (typeof window !== 'undefined') {
        localStorage.setItem('propfinder_favorites', JSON.stringify(newFavorites));
      }
      return newFavorites;
    });
  }, []);

  // ✅ Load favorites
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('propfinder_favorites');
      if (saved) {
        try {
          setFavorites(JSON.parse(saved));
        } catch (e) {
          console.warn('Failed to parse favorites');
        }
      }
    }
  }, []);

  // ✅ Carousel navigation
  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(Math.max(0, Math.min(index, maxSlide)));
  }, [maxSlide]);

  const scrollLeft = useCallback(() => {
    goToSlide(currentSlide - 1);
  }, [currentSlide, goToSlide]);
  
  const scrollRight = useCallback(() => {
    goToSlide(currentSlide + 1);
  }, [currentSlide, goToSlide]);

  // ✅ Reset slide on filter/city change
  useEffect(() => {
    setCurrentSlide(0);
  }, [city, filters]);

  // ✅ Touch/Swipe handling for mobile carousel
  const handleDragEnd = useCallback((_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold && currentSlide > 0) {
      goToSlide(currentSlide - 1);
    } else if (info.offset.x < -threshold && currentSlide < maxSlide) {
      goToSlide(currentSlide + 1);
    }
  }, [currentSlide, maxSlide, goToSlide]);

  // ✅ Active filters count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.bhk?.length) count++;
    if (filters.priceRange) count++;
    if (filters.builder?.length) count++;
    if (filters.propertyType?.length) count++;
    if (filters.locality) count++;
    return count;
  }, [filters]);

  const handleClearFilters = useCallback(() => {
    setCurrentSlide(0);
  }, []);

  // ✅ Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  };

  return (
    <section className={`py-12 sm:py-16 bg-white ${className}`.trim()}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - Responsive Typography */}
        <div className="text-center mb-8 sm:mb-10">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-3 py-1 bg-[#005E60]/10 text-[#005E60] text-xs font-semibold rounded-full mb-3"
          >
            🔥 Hot Properties
          </motion.span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Top Selling <span className="text-[#005E60]">Projects in {city}</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto px-2">
            Most booked properties this month in {city}. RERA registered, verified listings.
          </p>
        </div>

        {/* Active Filters - Mobile Optimized */}
        <AnimatePresence>
          {activeFilterCount > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6 px-2"
            >
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 bg-gray-100 px-3 sm:px-4 py-2 rounded-full">
                <Filter size={14} className="text-[#005E60]" />
                <span>{activeFilterCount} active filter{activeFilterCount > 1 ? 's' : ''}</span>
              </div>
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1 text-xs sm:text-sm text-[#005E60] hover:text-[#004a4d] font-medium transition-colors"
              >
                <X size={12} />
                Clear
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {orderedProjects.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 sm:py-16 bg-gray-50 rounded-2xl border border-gray-100 mx-2 sm:mx-0"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <MapPin size={20} className="sm:w-6 sm:h-6 text-gray-400" />
            </div>
            <p className="text-gray-700 text-base sm:text-lg font-medium mb-2 px-4">No projects match your criteria</p>
            <p className="text-gray-500 text-xs sm:text-sm mb-6 px-4">Try adjusting filters or explore other categories</p>
            <Link 
              href={`/properties?city=${CITY_SLUG_MAP[city]}`}
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-[#005E60] text-white rounded-lg text-sm font-medium hover:bg-[#004a4d] transition-colors"
            >
              Browse All Properties
              <ChevronRight size={16} />
            </Link>
          </motion.div>
        ) : (
          /* ✅ Responsive Carousel */
          <div className="relative">
            
            {/* ✅ Navigation Arrows - CSS Only (No Hydration Issues) */}
            {/* Always render, hide via CSS on mobile */}
            <AnimatePresence>
              {orderedProjects.length > 3 && (
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

            {/* ✅ Mobile Swipe Hint - CSS Only (No Hydration Issues) */}
            {/* Always render, hide via CSS on desktop */}
            <div className="flex justify-center mb-3 md:hidden">
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
                <ChevronLeft size={12} />
                Swipe to explore
                <ChevronRight size={12} />
              </span>
            </div>

            {/* ✅ Carousel Container with Touch Support */}
            <div 
              ref={carouselRef}
              className="overflow-hidden"
              suppressHydrationWarning={true}
            >
              <motion.div 
                className="flex"
                style={{ gap: `${gapSize}px` }}
                animate={{ 
                  x: `-${currentSlide * (100 / itemsPerView + (itemsPerView === 1 ? 0 : itemsPerView === 2 ? 1.5 : 2))}%` 
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                drag={true}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={handleDragEnd}
                onDrag={() => setIsDragging(true)}
              >
                {orderedProjects.map((project, index) => (
                  <motion.div
                    key={project.slug}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                    // ✅ Responsive card width via CSS classes (no JS conditionals)
                    className={`flex-shrink-0 bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:border-[#005E60]/30 transition-all duration-300 group 
                      w-full sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-16px)] 
                      ${viewportWidth < BREAKPOINTS.mobile ? 'mx-2' : ''}`}
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    {/* Image Container - Responsive Height via CSS */}
                    <div className="relative overflow-hidden h-40 sm:h-48 lg:h-52">
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
                      
                      {/* Rating Badge - Responsive via CSS */}
                      <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-sm">
                        <Star size={10} className="sm:w-3 sm:h-3 fill-[#F8C21C] text-[#F8C21C]" />
                        <span className="text-[10px] sm:text-xs font-bold text-gray-900">{project.rating.toFixed(1)}</span>
                      </div>

                      {/* Favorite Button - Touch Friendly */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite(project.slug);
                        }}
                        className="absolute top-2 sm:top-3 right-2 sm:right-3 w-8 h-8 sm:w-9 sm:h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm active:scale-95"
                        aria-label={favorites.includes(project.slug) ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Heart 
                          size={14} 
                          className={`transition-all duration-200 ${
                            favorites.includes(project.slug) 
                              ? 'fill-[#8B0000] text-[#8B0000] scale-110' 
                              : 'text-gray-600 hover:text-[#8B0000]'
                          }`} 
                        />
                      </button>

                      {/* Price Tag - Mobile Optimized via CSS */}
                      <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3">
                        <div className="bg-[#F8C21C] px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg shadow-lg">
                          <p className="text-gray-900 font-bold text-xs sm:text-sm">{project.price}</p>
                          <p className="text-gray-700 text-[10px] sm:text-xs opacity-90 truncate">{project.area}</p>
                        </div>
                      </div>

                      {/* Top Selling Badge */}
                      {project.isTopSelling && (
                        <div className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2">
                          <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-[#8B0000] text-white text-[10px] sm:text-xs font-bold rounded-full shadow-lg whitespace-nowrap">
                            🔥 Top Seller
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content - Responsive Padding & Typography via CSS */}
                    <div className="p-3 sm:p-4 lg:p-5 px-4 sm:px-5">
                      <h3 className="font-bold text-gray-900 mb-1.5 sm:mb-2 group-hover:text-[#005E60] transition-colors line-clamp-1 text-sm sm:text-base lg:text-lg">
                        {project.name}
                      </h3>
                      
                      <div className="flex items-start gap-1.5 sm:gap-2 text-gray-600 mb-2.5 sm:mb-3">
                        <MapPin size={12} className="sm:w-4 sm:h-4 text-[#8B0000] flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2 text-[11px] sm:text-xs">
                          {project.location}
                        </span>
                      </div>

                      {/* BHK Chips - Responsive via CSS */}
                      <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-100">
                        {project.bhkValues?.slice(0, 3).map((bhk) => (
                          <span 
                            key={bhk}
                            className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-gray-100 text-gray-700 font-medium rounded-md text-[10px] sm:text-xs"
                          >
                            {bhk} BHK
                          </span>
                        ))}
                        {project.bhkValues && project.bhkValues.length > 3 && (
                          <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-gray-100 text-gray-500 rounded-md text-[10px] sm:text-xs">
                            +{project.bhkValues.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons - Full Width on Mobile via CSS */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Link 
                          href={`/property/${project.slug}`}
                          className="border border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-[#005E60] hover:text-[#005E60] hover:bg-[#005E60]/5 transition-all text-center py-2.5 text-sm sm:text-xs lg:text-sm w-full sm:flex-1"
                        >
                          View Details
                        </Link>
                        <button 
                          className="bg-[#005E60] text-white rounded-xl font-semibold hover:bg-[#004a4d] transition-colors flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg active:scale-[0.98] py-2.5 text-sm sm:text-xs lg:text-sm w-full sm:flex-1"
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                        >
                          <Phone size={14} />
                          <span className="hidden sm:inline">Call</span>
                          <span className="sm:hidden">Contact</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* ✅ Responsive Pagination Dots */}
            {maxSlide > 0 && (
              <div className="flex justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8">
                {Array.from({ length: maxSlide + 1 }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'w-6 sm:w-8 h-2 bg-[#005E60]' 
                        : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                    aria-current={index === currentSlide ? 'true' : 'false'}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* View All Link - Responsive */}
        <div className="text-center mt-8 sm:mt-10">
          <Link 
            href={`/properties?city=${CITY_SLUG_MAP[city]}&sort=top-selling`}
            className="inline-flex items-center gap-1.5 sm:gap-2 text-[#005E60] font-semibold hover:text-[#004a4d] transition-colors group text-sm sm:text-base"
          >
            View All Projects in {city}
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}