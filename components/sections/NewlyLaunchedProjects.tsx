'use client';

import { ChevronLeft, ChevronRight, MapPin, Bed, Square, Tag, Filter } from 'lucide-react';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import type { SearchFilters } from '../Home/Hero';
import rawProperties from '@/data/properties.json';

// How recent a launch must be to still count as "Newly Launched" when it carries a
// launchDate. Flagged properties without a parseable launchDate are always shown.
const RECENT_LAUNCH_MONTHS = 8;

const FALLBACK_IMAGE = '/images/placeholder-property.webp';

interface NewLaunchCard {
  slug: string;
  name: string;
  location: string;
  bhk: string;
  sqft: string;
  price: string;
  image: string;
  city: string;
  priceNumeric: number;
  builder: string;
  propertyType: string;
  launchTime: number | null;
}

function parsePriceToNumeric(priceStr: string | undefined | null): number {
  if (!priceStr) return 0;
  const clean = String(priceStr).replace(/[₹,\s]/g, '').toLowerCase();
  const num = parseFloat(clean);
  if (isNaN(num)) return 0;
  if (clean.includes('cr')) return num * 10000000;
  if (clean.includes('lakh') || clean.includes('l')) return num * 100000;
  return num;
}

function parseLaunchTime(value: string | undefined | null): number | null {
  if (!value) return null;
  const t = Date.parse(value);
  return isNaN(t) ? null : t;
}

function mapToCard(p: any): NewLaunchCard {
  const configs = p.priceDetails?.configurations || [];
  const bhkTypes = [...new Set(configs.map((c: any) => String(c.type || '').trim()).filter(Boolean))] as string[];
  const areas = configs
    .map((c: any) => String(c.area || '').replace(/sq\.?\s?ft\.?/gi, '').trim())
    .filter(Boolean);

  const sqft = areas.length
    ? `${areas[0]}${areas.length > 1 ? ` - ${areas[areas.length - 1]}` : ''} SQ.FT.`
    : 'Area on request';

  const displayLocation =
    `${p.fullLocation?.area || ''}${p.fullLocation?.area && p.fullLocation?.city ? ', ' : ''}${p.fullLocation?.city || ''}`.trim() ||
    p.location ||
    '';

  return {
    slug: p.slug || '',
    name: String(p.name || 'Untitled Project'),
    location: displayLocation,
    bhk: bhkTypes.join(', ') || 'On Request',
    sqft,
    price: p.priceDetails?.range || p.price || 'Price on request',
    image: p.image || p.gallery?.[0] || FALLBACK_IMAGE,
    city: String(p.location || p.fullLocation?.city || '').toLowerCase(),
    priceNumeric: parsePriceToNumeric(p.priceDetails?.range || p.price),
    builder: String(p.developer?.name || p.builder || '').toLowerCase(),
    propertyType: String(p.category || p.propertyType || '').toLowerCase(),
    launchTime: parseLaunchTime(p.launchDate),
  };
}

interface NewlyLaunchedProjectsProps {
  selectedCity: 'pune' | 'mumbai' | 'kdmc';
  filters?: SearchFilters;
}

export default function NewlyLaunchedProjects({
  selectedCity = 'pune',
  filters = {},
}: NewlyLaunchedProjectsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Only properties explicitly flagged as a new launch in the admin panel, limited
  // to a recent window when they carry a launchDate, then newest first.
  const newLaunchCards = useMemo(() => {
    const cutoff = Date.now() - RECENT_LAUNCH_MONTHS * 30 * 24 * 60 * 60 * 1000;
    return (rawProperties as any[])
      .filter((p) => p.isNewLaunch === true)
      .map(mapToCard)
      .filter((p) => p.launchTime === null || p.launchTime >= cutoff)
      .sort((a, b) => (b.launchTime || 0) - (a.launchTime || 0));
  }, []);

  const filteredProjects = useMemo(() => {
    let projects = newLaunchCards.filter((p) => p.city === selectedCity);

    if (filters.bhk?.length) {
      projects = projects.filter((p) =>
        filters.bhk!.some((bhk) => p.bhk.toUpperCase().includes(bhk.toUpperCase().trim()))
      );
    }

    if (filters.priceRange) {
      const { min, max } = filters.priceRange;
      projects = projects.filter((p) => {
        const price = p.priceNumeric || 0;
        return price >= min && price <= (max === Infinity ? Number.MAX_SAFE_INTEGER : max);
      });
    }

    if (filters.builder?.length) {
      projects = projects.filter((p) =>
        filters.builder!.some((builder) => p.builder.includes(builder.toLowerCase().trim()))
      );
    }

    if (filters.propertyType?.length) {
      projects = projects.filter((p) =>
        filters.propertyType!.some((type) => p.propertyType.includes(type.toLowerCase().trim()))
      );
    }

    if (filters.locality) {
      projects = projects.filter((p) =>
        p.location.toLowerCase().includes(filters.locality!.toLowerCase().trim())
      );
    }

    return projects;
  }, [newLaunchCards, selectedCity, filters]);

  const checkScrollButtons = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
      return () => {
        container.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, [checkScrollButtons]);

  useEffect(() => {
    checkScrollButtons();
  }, [filteredProjects, checkScrollButtons]);

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -420, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 420, behavior: 'smooth' });
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    if (img.src !== FALLBACK_IMAGE) {
      img.src = FALLBACK_IMAGE;
    }
  };

  // Don't render the section at all if there are genuinely no recent launches for
  // this city — an empty carousel would look broken.
  if (filteredProjects.length === 0) {
    return null;
  }

  return (
    <section className="pt-6 md:pt-8 pb-10 md:pb-14 bg-[#f7f7f7]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="section-title text-[#1f2937] mb-2">
              Newly Launched Projects
            </h2>
            <p className="section-subtitle">
              Fresh launches in <span className="font-semibold text-[#1f2937] capitalize">{selectedCity}</span>
            </p>
          </div>

          {Object.keys(filters).length > 0 && (
            <div className="flex items-center gap-2 text-sm text-[#6b7280]">
              <Filter size={16} className="text-[#005E60]" />
              <span>{Object.keys(filters).length} filter{Object.keys(filters).length > 1 ? 's' : ''} applied</span>
            </div>
          )}
        </div>

        {/* Carousel Container */}
        <div className="relative group">

          {/* Left Arrow */}
          {canScrollLeft && (
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 z-20 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 hover:scale-110 transition-all duration-300 border border-gray-200"
              aria-label="Previous projects"
            >
              <ChevronLeft size={20} className="text-[#1f2937]" />
            </button>
          )}

          {/* Projects Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredProjects.map((project) => (
              <Link
                key={project.slug}
                href={`/property/${project.slug}`}
                className="group block"
              >
                <article className="group flex-shrink-0 w-[420px] bg-white rounded-xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer relative">
                  {/* NEW LAUNCH Badge - Brand Gold */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-block px-3 py-1 bg-[#F8C21C] text-[#1f2937] text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm">
                      NEW LAUNCH
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex gap-3 mt-6">
                    {/* Circular Image */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-[#005E60] transition-colors duration-300 shadow-md relative">
                        <Image
                          src={project.image}
                          alt={project.name}
                          fill
                          className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                          sizes="96px"
                          priority={false}
                          onError={handleImageError}
                        />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-[#005E60] mb-1 group-hover:text-[#004a4b] transition-colors truncate">
                        {project.name}
                      </h3>

                      <div className="flex items-center gap-1 text-xs text-[#6b7280] mb-1.5">
                        <MapPin size={12} className="text-[#8B0000] flex-shrink-0" />
                        <span className="truncate">{project.location}</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#6b7280] mb-2">
                        <div className="flex items-center gap-1">
                          <Bed size={12} className="text-[#8B0000] flex-shrink-0" />
                          <span>{project.bhk}</span>
                        </div>
                        <span className="text-gray-300">|</span>
                        <div className="flex items-center gap-1">
                          <Square size={12} className="text-[#8B0000] flex-shrink-0" />
                          <span className="truncate">{project.sqft}</span>
                        </div>
                      </div>

                      <div className="inline-block px-3 py-1 bg-[#ECF1F8] text-[#005E60] text-xs font-bold rounded-full">
                        {project.price}
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="my-3 border-t border-gray-100" />

                  {/* Bottom Text */}
                  <div className="flex items-center gap-1.5 text-xs">
                    <Tag size={12} className="text-[#8B0000] flex-shrink-0" />
                    <span className="text-[#1f2937]">
                      Get preferred options <span className="font-bold text-[#8B0000]">@ZERO Brokerage</span>
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Right Arrow */}
          {canScrollRight && (
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 z-20 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 hover:scale-110 transition-all duration-300 border border-gray-200"
              aria-label="Next projects"
            >
              <ChevronRight size={20} className="text-[#1f2937]" />
            </button>
          )}
        </div>

      </div>
    </section>
  );
}
