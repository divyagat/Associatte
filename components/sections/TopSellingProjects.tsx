'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ChevronRight, ChevronLeft, Phone, Filter, X, TrendingUp, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import type { SearchFilters } from '../Home/Hero';
import properties from '@/data/properties.json';
import EnquiryPopup from '@/components/common/EnquiryPopup';

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

export type CityName = 'Pune' | 'Mumbai' | 'KDMC';

export interface TopSellingProjectsProps {
  city: CityName;
  filters?: SearchFilters;
  limit?: number;
  className?: string;
}

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
    type: bhkValues.join(', ') || 'TBA',
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

const CITY_SLUG_MAP: Record<CityName, string> = {
  'Pune': 'pune',
  'Mumbai': 'mumbai',
  'KDMC': 'kdmc'
};

const DEFAULT_PROJECT_LIMIT = 8;
const BREAKPOINTS = { mobile: 640, tablet: 1024, desktop: 1280 };

export default function TopSellingProjects({
  city,
  filters = {},
  limit = DEFAULT_PROJECT_LIMIT,
  className = ''
}: TopSellingProjectsProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(1280);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState(0);

  // Popup state
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<CardProject | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setViewportWidth(window.innerWidth);
      const handleResize = () => setViewportWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const itemsPerView = useMemo(() => {
    if (viewportWidth < BREAKPOINTS.mobile) return 1;
    if (viewportWidth < BREAKPOINTS.tablet) return 2;
    return 3;
  }, [viewportWidth]);

  const gapSize = useMemo(() => {
    if (viewportWidth < BREAKPOINTS.mobile) return 16;
    if (viewportWidth < BREAKPOINTS.tablet) return 20;
    return 24;
  }, [viewportWidth]);

  const allCardProjects = useMemo(() =>
    (properties || []).map(mapProjectToCard),
    [properties]);

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

  const maxSlide = useMemo(() => {
    if (orderedProjects.length <= itemsPerView) return 0;
    return Math.max(0, Math.ceil(orderedProjects.length / itemsPerView) - 1);
  }, [orderedProjects.length, itemsPerView]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(Math.max(0, Math.min(index, maxSlide)));
  }, [maxSlide]);

  useEffect(() => {
    setCurrentSlide(0);
  }, [city, filters]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === 0) return;
    const diff = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentSlide > 0) {
        goToSlide(currentSlide - 1);
      } else if (diff < 0 && currentSlide < maxSlide) {
        goToSlide(currentSlide + 1);
      }
    }
    setTouchStart(0);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.bhk?.length) count++;
    if (filters.priceRange) count++;
    if (filters.builder?.length) count++;
    if (filters.propertyType?.length) count++;
    if (filters.locality) count++;
    return count;
  }, [filters]);

  // Popup handlers
  const handleOpenPopup = (project: CardProject) => {
    setSelectedProject(project);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedProject(null);
  };

  const handleFormSubmit = (payload: any) => {
    console.log('Enquiry submitted:', payload);
    // You can add API call here to send the enquiry
  };

  const getCityColor = () => {
    switch (city) {
      case 'Pune': return '#005E60';
      case 'Mumbai': return '#1E3A8A';
      case 'KDMC': return '#C2410C';
      default: return '#005E60';
    }
  };

  const cityColor = getCityColor();

  return (
    <section className={`pt-4 md:pt-6 pb-10 md:pb-14 bg-gray-50 ${className}`.trim()}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full shadow-sm mb-4">
            <TrendingUp size={14} className="text-orange-500" />
            <span className="text-xs font-medium text-gray-600">Hot Properties</span>
          </div>

          <h2 className="section-title text-gray-900 mb-3">
            Top Selling Projects in{' '}
            <span style={{ color: cityColor }}>{city}</span>
          </h2>

          <p className="text-gray-500 text-sm max-w-2xl mx-auto">
            Most booked properties this month
          </p>

          {activeFilterCount > 0 && (
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-sm shadow-sm">
                <Filter size={12} style={{ color: cityColor }} />
                <span className="text-gray-600">{activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}</span>
              </div>
              <button
                onClick={() => setCurrentSlide(0)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700"
              >
                <X size={12} />
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Empty State */}
        {orderedProjects.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <MapPin size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500">No projects found</p>
            <Link
              href={`/properties?city=${CITY_SLUG_MAP[city]}`}
              className="inline-block mt-4 px-5 py-2 rounded-lg text-white text-sm font-medium"
              style={{ backgroundColor: cityColor }}
            >
              Browse All
            </Link>
          </div>
        ) : (
          <div className="relative">

            {/* Navigation Arrows */}
            {orderedProjects.length > itemsPerView && (
              <>
                <button
                  onClick={() => goToSlide(currentSlide - 1)}
                  disabled={currentSlide === 0}
                  className={`hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white rounded-full shadow-md items-center justify-center transition-all ${currentSlide === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:shadow-lg'
                    }`}
                >
                  <ChevronLeft size={18} className="text-gray-600" />
                </button>

                <button
                  onClick={() => goToSlide(currentSlide + 1)}
                  disabled={currentSlide >= maxSlide}
                  className={`hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white rounded-full shadow-md items-center justify-center transition-all ${currentSlide >= maxSlide ? 'opacity-40 cursor-not-allowed' : 'hover:shadow-lg'
                    }`}
                >
                  <ChevronRight size={18} className="text-gray-600" />
                </button>
              </>
            )}

            {/* Carousel */}
            <div
              ref={carouselRef}
              className="overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex transition-transform duration-300 ease-out"
                style={{
                  gap: `${gapSize}px`,
                  transform: `translateX(-${currentSlide * (100 / itemsPerView)}%)`
                }}
              >
                {orderedProjects.map((project) => (
                  <div
                    key={project.slug}
                    className="flex-shrink-0"
                    style={{ width: `calc(${100 / itemsPerView}% - ${gapSize * (itemsPerView - 1) / itemsPerView}px)` }}
                  >
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">

                      {/* Image */}
                      <Link href={`/property/${project.slug}`}>
                        <div className="relative h-48 overflow-hidden bg-gray-100">
                          <Image
                            src={project.image}
                            alt={project.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 360px"
                            className="object-cover"
                          />

                          {/* Top Seller Badge */}
                          {project.isTopSelling && (
                            <div className="absolute bottom-3 left-3">
                              <div className="flex items-center gap-1 px-2 py-0.5 bg-red-500 text-white rounded-full text-xs">
                                <Award size={10} />
                                <span>Top Seller</span>
                              </div>
                            </div>
                          )}

                          {/* Price */}
                          <div className="absolute bottom-3 right-3 bg-white px-2 py-1 rounded-lg shadow text-sm font-bold" style={{ color: cityColor }}>
                            {project.price}
                          </div>
                        </div>
                      </Link>

                      {/* Content */}
                      <div className="p-4">
                        <Link href={`/property/${project.slug}`}>
                          <h3 className="font-semibold text-gray-900 text-base mb-1 line-clamp-1 hover:text-[#005E60] transition-colors">
                            {project.name}
                          </h3>
                        </Link>

                        <div className="flex items-center gap-1 text-gray-500 text-xs mb-2">
                          <MapPin size={10} />
                          <span className="line-clamp-1">{project.location}</span>
                        </div>

                        {/* BHK Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {project.bhkValues?.slice(0, 2).map((bhk) => (
                            <span key={bhk} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                              {bhk} BHK
                            </span>
                          ))}
                          {project.bhkValues && project.bhkValues.length > 2 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">
                              +{project.bhkValues.length - 2}
                            </span>
                          )}
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-100 my-3"></div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Link
                            href={`/property/${project.slug}`}
                            className="flex-1 text-center py-1.5 border rounded-lg text-sm font-medium transition-colors hover:bg-gray-50"
                            style={{ borderColor: cityColor, color: cityColor }}
                          >
                            Details
                          </Link>
                          <button
                            onClick={() => handleOpenPopup(project)}
                            className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-white text-sm transition-all hover:scale-105"
                            style={{ backgroundColor: cityColor }}
                          >
                            <Phone size={12} />
                            <span>Call</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination Dots */}
            {maxSlide > 0 && (
              <div className="flex justify-center gap-1.5 mt-6">
                {Array.from({ length: maxSlide + 1 }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-1.5 rounded-full transition-all ${index === currentSlide ? 'w-6' : 'w-1.5 bg-gray-300'
                      }`}
                    style={{ backgroundColor: index === currentSlide ? cityColor : undefined }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* View All */}
        <div className="text-center mt-6">
          <Link
            href={`/properties?city=${CITY_SLUG_MAP[city]}&sort=top-selling`}
            className="inline-flex items-center gap-1 text-sm font-medium hover:gap-2 transition-all"
            style={{ color: cityColor }}
          >
            View All Projects
            <ChevronRight size={14} />
          </Link>
        </div>

      </div>

      {/* Enquiry Popup */}
      <EnquiryPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        projectName={selectedProject?.name || 'Properties'}
        projectTagline={`Get details about ${selectedProject?.name || 'this property'} from our experts`}
        theme="gradient"
        onSubmit={handleFormSubmit}
        trackingData={{
          source: 'top_selling_projects',
          campaign: 'call_button_enquiry',
          medium: 'organic',
          city: city.toLowerCase()
        }}
      // simplified prop removed - the new component is already simplified
      />
    </section>
  );
}