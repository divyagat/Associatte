'use client';

<<<<<<< HEAD
import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { MapPin, Heart, ChevronRight, ChevronLeft, Star, Phone, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
=======
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import { MapPin, Heart, ChevronRight, ChevronLeft, Star, Phone, Filter, X } from 'lucide-react';
import { motion, AnimatePresence, type Transition, type Variants, useAnimation } from 'framer-motion';
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b

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
<<<<<<< HEAD
  // ✅ Internal fields for filtering
=======
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
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

<<<<<<< HEAD

// ✅ CityName type for strict type safety
export type CityName = 'Pune' | 'Mumbai' | 'KDMC';

// ✅ Props interface - NOW INCLUDES city prop
=======
export type CityName = 'Pune' | 'Mumbai' | 'KDMC';

>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
export interface TopSellingProjectsProps {
  city: CityName;
  filters?: SearchFilters;
  limit?: number;
  className?: string;
}

// ✅ Helper: Parse price string to numeric (INR)
function parsePriceToNumeric(priceStr: string | undefined | null): number {
  if (!priceStr) return 0;
<<<<<<< HEAD
  
  const clean = String(priceStr).replace(/[₹,\s]/g, '').toLowerCase();
  
=======
  const clean = String(priceStr).replace(/[₹,\s]/g, '').toLowerCase();
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
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
<<<<<<< HEAD
  
=======
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
  const num = parseFloat(clean);
  return !isNaN(num) ? num : 0;
}

<<<<<<< HEAD

// ✅ Helper: Safely convert any value to lowercase string
=======
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
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
<<<<<<< HEAD
  
  // ✅ Fix: Properly filter and type bhkValues as string[]
=======
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
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
<<<<<<< HEAD
    bhkValues, // ✅ Now properly typed as string[]
=======
    bhkValues,
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
    isTopSelling: project.isTopSelling || project.trending || false,
    launchDate: project.launchDate,
    possessionDate: project.possessionDate,
    amenities: project.amenities || [],
    description: project.description || '',
  };
}

<<<<<<< HEAD
// Fix the framer-motion variants - use proper Ease type:
import { type Transition, type Ease } from 'framer-motion';

// Then update cardVariants:
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({ 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.3, 
      ease: 'easeOut' as Ease,
      delay: index * 0.05
    } as Transition
  })
};

// ✅ City to slug mapping for filtering
=======
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
const CITY_SLUG_MAP: Record<CityName, string> = {
  'Pune': 'pune',
  'Mumbai': 'mumbai', 
  'KDMC': 'kdmc'
};

<<<<<<< HEAD
// ✅ CONFIG: Default limit for projects display
const DEFAULT_PROJECT_LIMIT = 8;

=======
const DEFAULT_PROJECT_LIMIT = 8;

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' as const }
  }
};

const carouselTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
  mass: 0.8
};

>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
export default function TopSellingProjects({ 
  city, 
  filters = {}, 
  limit = DEFAULT_PROJECT_LIMIT,
  className = ''
}: TopSellingProjectsProps) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
<<<<<<< HEAD
  const [showAllFilters, setShowAllFilters] = useState(false);

  // 🔁 Convert all JSON projects to card format with memoization
=======
  const [isHydrated, setIsHydrated] = useState(false); // ✅ Hydration guard
  const [isDragging, setIsDragging] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // 🔁 Convert projects
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
  const allCardProjects = useMemo(() => 
    (properties || []).map(mapProjectToCard), 
  [properties]);

<<<<<<< HEAD
  // 🔁 Filter projects by city AND advanced filters
  const filteredProjects = useMemo(() => {
    let projects = [...allCardProjects];
    
    // Step 1: Filter by city (REQUIRED - from props)
    const citySlug = CITY_SLUG_MAP[city];
    projects = projects.filter(p => p.city === citySlug);
    
    // Step 2: Only show top selling/trending projects
    projects = projects.filter(p => p.isTopSelling || p.rating >= 4.0);
    
    // Step 3: Apply BHK filter (case-insensitive partial match)
=======
  // 🔁 Filter projects
  const filteredProjects = useMemo(() => {
    let projects = [...allCardProjects];
    const citySlug = CITY_SLUG_MAP[city];
    projects = projects.filter(p => p.city === citySlug);
    projects = projects.filter(p => p.isTopSelling || p.rating >= 4.0);
    
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
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

<<<<<<< HEAD
    // Step 4: Apply price range filter
=======
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
    if (filters.priceRange) {
      const { min, max } = filters.priceRange;
      projects = projects.filter(p => {
        const price = p.priceNumeric || 0;
        return price >= min && price <= (max === Infinity ? Number.MAX_SAFE_INTEGER : max);
      });
    }

<<<<<<< HEAD
    // Step 5: Apply builder filter (case-insensitive partial match)
=======
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
    if (filters.builder?.length) {
      projects = projects.filter(p => 
        filters.builder!.some(builder => 
          (p.builder || '').includes(builder.toLowerCase().trim())
        )
      );
    }

<<<<<<< HEAD
    // Step 6: Apply property type filter
=======
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
    if (filters.propertyType?.length) {
      projects = projects.filter(p => 
        filters.propertyType!.some(type => 
          (p.propertyType || '').includes(type.toLowerCase().trim())
        )
      );
    }

<<<<<<< HEAD
    // Step 7: Apply locality filter (partial match on location)
=======
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
    if (filters.locality) {
      projects = projects.filter(p => 
        p.location.toLowerCase().includes(filters.locality!.toLowerCase().trim())
      );
    }

<<<<<<< HEAD
    // Sort by rating (descending) then by price (ascending)
=======
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
    projects.sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return (a.priceNumeric || 0) - (b.priceNumeric || 0);
    });

    return projects;
  }, [city, filters, allCardProjects]);

<<<<<<< HEAD
  // ✅ LIMIT: Show only first N projects AFTER filtering
=======
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
  const limitedProjects = useMemo(() => 
    filteredProjects.slice(0, limit),
  [filteredProjects, limit]);

<<<<<<< HEAD
  // 🔁 Ensure priority projects appear first (configurable per city)
=======
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
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

<<<<<<< HEAD
  // ✅ Calculate carousel metrics
  const itemsPerView = 3;
  const maxSlide = Math.max(0, Math.ceil(orderedProjects.length / itemsPerView) - 1);

  // ✅ Toggle favorite with persistence
=======
  // ✅ Responsive: CSS-only items per view calculation
  const itemsPerView = 3; // Base for desktop
  const maxSlide = useMemo(() => 
    Math.max(0, Math.ceil(orderedProjects.length / itemsPerView) - 1),
  [orderedProjects.length]
  );

>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
  const toggleFavorite = useCallback((slug: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(slug) 
        ? prev.filter(f => f !== slug) 
        : [...prev, slug];
<<<<<<< HEAD
      // Optional: Save to localStorage
=======
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
      if (typeof window !== 'undefined') {
        localStorage.setItem('propfinder_favorites', JSON.stringify(newFavorites));
      }
      return newFavorites;
    });
  }, []);

<<<<<<< HEAD
  // ✅ Load favorites from localStorage on mount
=======
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
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
<<<<<<< HEAD
    }
  }, []);

  // ✅ Carousel navigation
=======
      // ✅ Mark as hydrated AFTER initial render
      setIsHydrated(true);
    }
  }, []);

>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
  const scrollLeft = useCallback(() => {
    setCurrentSlide(prev => Math.max(0, prev - 1));
  }, []);
  
  const scrollRight = useCallback(() => {
    setCurrentSlide(prev => Math.min(maxSlide, prev + 1));
  }, [maxSlide]);

<<<<<<< HEAD
  // ✅ Reset slide when filters or city change
=======
  // ✅ Reset slide on filter/city change
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
  useEffect(() => {
    setCurrentSlide(0);
  }, [city, filters]);

<<<<<<< HEAD
  // ✅ Count active filters for badge
=======
  // ✅ Swipe handler - only active after hydration
  const handleDragEnd = useCallback((_: any, info: { offset: { x: number } }) => {
    if (!isHydrated) return;
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold && currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    } else if (info.offset.x < -swipeThreshold && currentSlide < maxSlide) {
      setCurrentSlide(prev => prev + 1);
    }
  }, [currentSlide, maxSlide, isHydrated]);

>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.bhk?.length) count++;
    if (filters.priceRange) count++;
    if (filters.builder?.length) count++;
    if (filters.propertyType?.length) count++;
    if (filters.locality) count++;
    return count;
  }, [filters]);

<<<<<<< HEAD
  // ✅ Clear all filters callback
  const handleClearFilters = useCallback(() => {
    // Note: Parent component should handle filter clearing via props
    // This is a visual reset for carousel position
    setCurrentSlide(0);
  }, []);

  // ✅ Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  };

  return (
    <section className={`py-16 bg-white ${className}`.trim()}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
=======
  const handleClearFilters = useCallback(() => {
    setCurrentSlide(0);
  }, []);

  // ✅ Prevent SSR/Client mismatch: Only enable drag after hydration
  const enableDrag = isHydrated && typeof window !== 'undefined' && window.innerWidth < 640;

  return (
    <section className={`py-12 sm:py-16 bg-white ${className}`.trim()}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-3 py-1 bg-[#005E60]/10 text-[#005E60] text-xs font-semibold rounded-full mb-3"
          >
            🔥 Hot Properties
          </motion.span>
<<<<<<< HEAD
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Top Selling <span className="text-[#005E60]">Projects in {city}</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
=======
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Top Selling <span className="text-[#005E60]">Projects in {city}</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto px-2">
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
            Most booked properties this month in {city}. RERA registered, verified listings with transparent pricing.
          </p>
        </div>

<<<<<<< HEAD
        {/* Active Filters Badge + Clear Button */}
=======
        {/* Active Filters */}
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
        <AnimatePresence>
          {activeFilterCount > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
<<<<<<< HEAD
              className="flex items-center justify-center gap-3 mb-6"
            >
              <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-100 px-4 py-2 rounded-full">
                <Filter size={16} className="text-[#005E60]" />
=======
              className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-2"
            >
              <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-100 px-3 sm:px-4 py-2 rounded-full">
                <Filter size={14} className="text-[#005E60]" />
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
                <span>{activeFilterCount} active filter{activeFilterCount > 1 ? 's' : ''}</span>
              </div>
              <button
                onClick={handleClearFilters}
<<<<<<< HEAD
                className="flex items-center gap-1 text-sm text-[#005E60] hover:text-[#004a4d] font-medium transition-colors"
=======
                className="flex items-center gap-1 text-sm text-[#005E60] hover:text-[#004a4d] font-medium transition-colors px-2"
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
              >
                <X size={14} />
                Clear filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

<<<<<<< HEAD
        {/* Show message if no projects match */}
=======
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
        {orderedProjects.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
<<<<<<< HEAD
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
=======
            className="text-center py-12 sm:py-16 bg-gray-50 rounded-2xl border border-gray-100 mx-2 sm:mx-0"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <MapPin size={20} className="sm:w-6 sm:h-6 text-gray-400" />
            </div>
            <p className="text-gray-700 text-base sm:text-lg font-medium mb-2 px-4">No projects match your criteria</p>
            <p className="text-gray-500 text-sm mb-6 px-4">Try adjusting your filters or explore other categories in {city}</p>
            <Link 
              href={`/properties?city=${CITY_SLUG_MAP[city]}`}
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-[#005E60] text-white rounded-lg font-medium hover:bg-[#004a4d] transition-colors text-sm sm:text-base"
            >
              Browse All Properties
              <ChevronRight size={16} className="sm:w-5 sm:h-5" />
            </Link>
          </motion.div>
        ) : (
          <div className="relative" ref={carouselRef}>
            
            {/* Desktop Navigation Arrows */}
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
            <AnimatePresence>
              {orderedProjects.length > itemsPerView && (
                <>
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={scrollLeft}
                    disabled={currentSlide === 0}
<<<<<<< HEAD
                    className={`hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 lg:-translate-x-5 z-20 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white shadow-lg border border-gray-100 items-center justify-center transition-all duration-300 ${
=======
                    className={`hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 lg:-translate-x-4 z-20 w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-white shadow-lg border border-gray-100 items-center justify-center transition-all duration-300 ${
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
                      currentSlide === 0 
                        ? 'opacity-30 cursor-not-allowed' 
                        : 'hover:scale-110 hover:shadow-xl hover:border-[#005E60]'
                    }`}
                    aria-label="Previous projects"
                  >
<<<<<<< HEAD
                    <ChevronLeft size={20} className="text-gray-700" />
=======
                    <ChevronLeft size={18} className="sm:w-5 sm:h-5 text-gray-700" />
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={scrollRight}
                    disabled={currentSlide >= maxSlide}
<<<<<<< HEAD
                    className={`hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 lg:translate-x-5 z-20 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white shadow-lg border border-gray-100 items-center justify-center transition-all duration-300 ${
=======
                    className={`hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 lg:translate-x-4 z-20 w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-white shadow-lg border border-gray-100 items-center justify-center transition-all duration-300 ${
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
                      currentSlide >= maxSlide 
                        ? 'opacity-30 cursor-not-allowed' 
                        : 'hover:scale-110 hover:shadow-xl hover:border-[#005E60]'
                    }`}
                    aria-label="Next projects"
                  >
<<<<<<< HEAD
                    <ChevronRight size={20} className="text-gray-700" />
=======
                    <ChevronRight size={18} className="sm:w-5 sm:h-5 text-gray-700" />
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
                  </motion.button>
                </>
              )}
            </AnimatePresence>

<<<<<<< HEAD
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
  custom={index} // ✅ Pass index for staggered animation
  className="flex-shrink-0 w-[calc(33.333%-10.67px)] lg:w-[calc(33.333%-16px)] bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:border-[#005E60]/30 transition-all duration-300 group"
>
                    {/* Image Container */}
                    <div className="relative h-48 lg:h-52 overflow-hidden">
=======
            {/* ✅ CSS-Only Responsive Carousel - NO JS width calculations */}
            <div className="overflow-hidden">
              <motion.div 
                className="flex gap-3 sm:gap-4 lg:gap-6"
                animate={{ 
                  x: `-${currentSlide * (100 / itemsPerView + 2)}%` 
                }}
                transition={carouselTransition}
                // ✅ Only enable drag after hydration + on mobile
                drag={enableDrag ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={handleDragEnd}
                onDrag={() => setIsDragging(false)}
                // ✅ Suppress hydration warning for cursor (changes post-hydration)
                style={{ 
                  cursor: enableDrag ? (isDragging ? 'grabbing' : 'grab') : 'default',
                  touchAction: enableDrag ? 'pan-y' : 'auto'
                }}
                suppressHydrationWarning
              >
                {orderedProjects.map((project, index) => (
                  <motion.div
                    key={project.slug}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                    // ✅ CSS-only responsive widths using Tailwind breakpoints
                    className="
                      flex-shrink-0 
                      bg-white rounded-xl sm:rounded-2xl 
                      overflow-hidden border border-gray-100 
                      hover:shadow-xl sm:hover:shadow-2xl 
                      hover:border-[#005E60]/30 transition-all duration-300 group
                      /* Mobile: full width with horizontal margin */
                      w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-16px)]
                      mx-1 sm:mx-0
                    "
                  >
                    {/* Image Container */}
                    <div className="relative h-40 sm:h-48 lg:h-52 overflow-hidden">
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
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
<<<<<<< HEAD
                      <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-sm">
                        <Star size={12} className="fill-[#F8C21C] text-[#F8C21C]" />
                        <span className="text-xs font-bold text-gray-900">{project.rating.toFixed(1)}</span>
=======
                      <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-sm">
                        <Star size={10} className="sm:w-3 sm:h-3 fill-[#F8C21C] text-[#F8C21C]" />
                        <span className="text-[10px] sm:text-xs font-bold text-gray-900">{project.rating.toFixed(1)}</span>
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite(project.slug);
                        }}
<<<<<<< HEAD
                        className="absolute top-3 right-3 w-9 h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
                        aria-label={favorites.includes(project.slug) ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Heart 
                          size={16} 
=======
                        className="absolute top-2 sm:top-3 right-2 sm:right-3 w-8 h-8 sm:w-9 sm:h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
                        aria-label={favorites.includes(project.slug) ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Heart 
                          size={14} 
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
                          className={`transition-all duration-200 ${
                            favorites.includes(project.slug) 
                              ? 'fill-[#8B0000] text-[#8B0000] scale-110' 
                              : 'text-gray-600 hover:text-[#8B0000]'
                          }`} 
                        />
                      </button>

                      {/* Price Tag */}
<<<<<<< HEAD
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="bg-[#F8C21C] px-3.5 py-2 rounded-lg shadow-lg">
                          <p className="text-gray-900 font-bold text-sm lg:text-base">{project.price}</p>
                          <p className="text-gray-700 text-xs opacity-90">{project.area}</p>
=======
                      <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3">
                        <div className="bg-[#F8C21C] px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg shadow-lg">
                          <p className="text-gray-900 font-bold text-xs sm:text-sm lg:text-base">{project.price}</p>
                          <p className="text-gray-700 text-[10px] sm:text-xs opacity-90">{project.area}</p>
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
                        </div>
                      </div>

                      {/* Top Selling Badge */}
                      {project.isTopSelling && (
<<<<<<< HEAD
                        <div className="absolute top-3 left-1/2 -translate-x-1/2">
                          <span className="px-3 py-1 bg-[#8B0000] text-white text-xs font-bold rounded-full shadow-lg">
=======
                        <div className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2">
                          <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-[#8B0000] text-white text-[10px] sm:text-xs font-bold rounded-full shadow-lg whitespace-nowrap">
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
                            🔥 Top Seller
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
<<<<<<< HEAD
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
=======
                    <div className="p-3 sm:p-4 lg:p-5">
                      <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2 group-hover:text-[#005E60] transition-colors line-clamp-1">
                        {project.name}
                      </h3>
                      
                      <div className="flex items-start gap-1.5 sm:gap-2 text-gray-600 mb-2 sm:mb-3">
                        <MapPin size={12} className="sm:w-4 sm:h-4 text-[#8B0000] flex-shrink-0 mt-0.5" />
                        <span className="text-[10px] sm:text-xs lg:text-sm line-clamp-2">{project.location}</span>
                      </div>

                      {/* BHK Tags */}
                      <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-100">
                        {project.bhkValues?.slice(0, 3).map((bhk) => (
                          <span 
                            key={bhk}
                            className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-gray-100 text-gray-700 text-[10px] sm:text-xs font-medium rounded-md"
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
                          >
                            {bhk} BHK
                          </span>
                        ))}
                        {project.bhkValues && project.bhkValues.length > 3 && (
<<<<<<< HEAD
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
=======
                          <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-gray-100 text-gray-500 text-[10px] sm:text-xs rounded-md">
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
                            +{project.bhkValues.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
<<<<<<< HEAD
                      <div className="flex gap-2">
                        <Link 
                          href={`/property/${project.slug}`}
                          className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-xs lg:text-sm font-semibold hover:border-[#005E60] hover:text-[#005E60] hover:bg-[#005E60]/5 transition-all text-center"
=======
                      <div className="flex gap-1.5 sm:gap-2">
                        <Link 
                          href={`/property/${project.slug}`}
                          className="flex-1 py-2 sm:py-2.5 border border-gray-200 text-gray-700 rounded-lg sm:rounded-xl text-[10px] sm:text-xs lg:text-sm font-semibold hover:border-[#005E60] hover:text-[#005E60] hover:bg-[#005E60]/5 transition-all text-center"
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
                        >
                          View Details
                        </Link>
                        <button 
<<<<<<< HEAD
                          className="flex-1 py-2.5 bg-[#005E60] text-white rounded-xl text-xs lg:text-sm font-semibold hover:bg-[#004a4d] transition-colors flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg"
                          onClick={(e) => {
                            e.preventDefault();
                            // Add click tracking or open contact modal here
                          }}
                        >
                          <Phone size={14} />
                          <span className="hidden sm:inline">Call</span>
=======
                          className="flex-1 py-2 sm:py-2.5 bg-[#005E60] text-white rounded-lg sm:rounded-xl text-[10px] sm:text-xs lg:text-sm font-semibold hover:bg-[#004a4d] transition-colors flex items-center justify-center gap-1 shadow-sm sm:shadow-md hover:shadow-lg"
                          onClick={(e) => e.preventDefault()}
                        >
                          <Phone size={12} className="sm:w-4 sm:h-4" />
                          <span className="hidden xs:inline sm:hidden lg:inline">Call</span>
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Pagination Dots */}
            {maxSlide > 0 && (
<<<<<<< HEAD
              <div className="flex justify-center gap-2 mt-8">
=======
              <div className="flex justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8">
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
                {Array.from({ length: maxSlide + 1 }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
<<<<<<< HEAD
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'w-8 bg-[#005E60]' 
                        : 'w-2.5 bg-gray-300 hover:bg-gray-400'
=======
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'w-6 sm:w-8 bg-[#005E60]' 
                        : 'w-2 bg-gray-300 hover:bg-gray-400'
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                    aria-current={index === currentSlide ? 'true' : 'false'}
                  />
                ))}
              </div>
            )}

<<<<<<< HEAD
            {/* Mobile Swipe Hint */}
            <div className="md:hidden text-center mt-4 text-gray-400 text-xs">
              ← Swipe to see more →
            </div>
=======
            {/* Mobile Swipe Hint - Only show after hydration */}
            {isHydrated && typeof window !== 'undefined' && window.innerWidth < 640 && orderedProjects.length > 1 && (
              <div className="sm:hidden text-center mt-3 text-gray-400 text-xs flex items-center justify-center gap-1">
                <ChevronLeft size={12} />
                <span>Swipe to explore</span>
                <ChevronRight size={12} />
              </div>
            )}
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
          </div>
        )}

        {/* View All Link */}
<<<<<<< HEAD
        <div className="text-center mt-10">
          <Link 
            href={`/properties?city=${CITY_SLUG_MAP[city]}&sort=top-selling`}
            className="inline-flex items-center gap-2 text-[#005E60] font-semibold hover:text-[#004a4d] transition-colors group"
          >
            View All Projects in {city}
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
=======
        <div className="text-center mt-8 sm:mt-10">
          <Link 
            href={`/properties?city=${CITY_SLUG_MAP[city]}&sort=top-selling`}
            className="inline-flex items-center gap-1.5 sm:gap-2 text-[#005E60] font-semibold hover:text-[#004a4d] transition-colors group text-sm sm:text-base"
          >
            View All Projects in {city}
            <ChevronRight size={16} className="sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
>>>>>>> 89ffa861f4c6ae6f84a0f22875dc985eb4edd23b
          </Link>
        </div>

      </div>
    </section>
  );
}