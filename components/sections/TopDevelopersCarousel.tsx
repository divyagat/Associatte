'use client';

import { ChevronLeft, ChevronRight, Building2, Star, ArrowRight } from 'lucide-react';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Image from 'next/image';
import properties from '../../data/properties.json';
import { 
  getBuilderSlug, 
  getBuilderYears, 
  getBuilderLogo,
} from '@/lib/builder-slugs';

const toSlug = (str: string) => 
  str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

interface Developer {
  id: string;
  name: string;
  slug: string;
  years: string;
  projects: number;
  logoSrc: string;
  logoType: 'image' | 'text';
  rating: number;
}

interface TopDevelopersCarouselProps {
  city: 'Pune' | 'Mumbai' | 'KDMC';
}

const BREAKPOINTS = { mobile: 640, tablet: 1024, desktop: 1280 };

// ✅ Deterministic rating function
function getDeterministicRating(slug: string, projects: number): number {
  const knownRatings: Record<string, number> = {
    'lodha': 4.9, 'mantra': 4.7, 'godrej': 4.8, 'birla': 4.6,
    'shapoorji': 4.8, 'sai-paradise-group': 4.5, 'mahindra': 4.7,
    'runwal-group': 4.4, 'magarpatta-city': 4.6, 'today-group': 4.3,
    'panchshil': 4.5, 'kumar': 4.4, 'jhamtani': 4.3, 'tribeca': 4.6,
    'majestique': 4.2, 'l-t': 4.8,
  };
  if (knownRatings[slug]) return knownRatings[slug];
  return Math.min(5, 4.0 + Math.log(projects + 1) * 0.25);
}

export default function TopDevelopersCarousel({ city }: TopDevelopersCarouselProps) {
  const [offset, setOffset] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(1280);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setViewportWidth(window.innerWidth);
      const handleResize = () => setViewportWidth(window.innerWidth);
      window.addEventListener('resize', handleResize, { passive: true });
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const cardWidth = useMemo(() => {
    if (viewportWidth < BREAKPOINTS.mobile) return 310;
    if (viewportWidth < BREAKPOINTS.tablet) return 340;
    return 370;
  }, [viewportWidth]);

  const gapSize = useMemo(() => 
    viewportWidth < 640 ? 20 : viewportWidth < 1024 ? 24 : 28
  , [viewportWidth]);
  
  const logoBoxSize = useMemo(() => 
    viewportWidth < 640 ? 90 : viewportWidth < 1024 ? 110 : 130
  , [viewportWidth]);

  const developers: Developer[] = useMemo(() => {
    const devMap = new Map<string, Developer>();
    
    properties.forEach((p: any) => {
      const name = p.developer?.name;
      if (!name) return;
      
      const navSlug = getBuilderSlug(name);
      const internalId = toSlug(name);
      const logoConfig = getBuilderLogo(name);
      
      if (!devMap.has(internalId)) {
        devMap.set(internalId, {
          id: internalId,
          name,
          slug: navSlug,
          years: getBuilderYears(name),
          projects: 0,
          logoSrc: typeof logoConfig === 'string' ? logoConfig : logoConfig?.src || '',
          logoType: typeof logoConfig === 'object' ? logoConfig.type || 'image' : 'image',
          rating: getDeterministicRating(navSlug, 0),
        });
      }
      
      const dev = devMap.get(internalId)!;
      dev.projects += 1;
      dev.rating = getDeterministicRating(navSlug, dev.projects);
    });
    
    return Array.from(devMap.values())
      .filter(d => d.name && d.slug)
      .sort((a, b) => b.projects - a.projects);
  }, []);

  const extendedDevelopers = useMemo(() => {
    if (developers.length <= 4) return developers;
    return [...developers, ...developers.slice(0, Math.min(4, developers.length))];
  }, [developers]);

  const STEP = cardWidth + gapSize;
  const SPEED = 0.04;

  useEffect(() => {
    if (isPaused || developers.length <= 4) return;
    let animationFrame: number;
    let lastTime = 0;

    const animate = (time: number) => {
      if (!lastTime) lastTime = time;
      const delta = time - lastTime;
      lastTime = time;
      setOffset(prev => {
        const newOffset = prev + SPEED * delta;
        return newOffset >= STEP * developers.length ? 0 : newOffset;
      });
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => { if (animationFrame) cancelAnimationFrame(animationFrame); };
  }, [isPaused, developers.length, STEP]);

  const scrollByCards = useCallback((direction: 'left' | 'right') => {
    const container = containerRef.current;
    if (!container) return;
    const scrollAmount = direction === 'left' ? -STEP : STEP;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(() => {
      const newIndex = direction === 'left' 
        ? Math.max(0, activeIndex - 1) 
        : Math.min(developers.length - 1, activeIndex + 1);
      setActiveIndex(newIndex);
      setOffset(container.scrollLeft);
    }, 300);
  }, [STEP, activeIndex, developers.length]);

  const handlePause = useCallback(() => setIsPaused(true), []);
  const handleResume = useCallback(() => setIsPaused(false), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (developers.length <= 4) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); scrollByCards('left'); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); scrollByCards('right'); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [developers.length, scrollByCards]);

  if (!developers?.length) return null;

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#005E60]/10 to-[#F8C21C]/10 rounded-full mb-4">
            <Building2 className="w-4 h-4 text-[#005E60]" />
            <span className="text-xs font-semibold text-[#005E60] uppercase tracking-wide">
              Verified Developers
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Top Developers in{' '}
            <span className="bg-gradient-to-r from-[#005E60] to-[#004a4d] bg-clip-text text-transparent">
              {city}
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Trusted builders with proven track records. RERA registered, transparent pricing, and quality construction.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {developers.length > 4 && (
            <>
              <button 
                onClick={() => scrollByCards('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-8 z-10 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-[#005E60] hover:border-[#005E60]/30 hover:shadow-xl transition-all duration-300 group"
                aria-label="Previous developers"
              >
                <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
              </button>
              <button 
                onClick={() => scrollByCards('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-8 z-10 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-[#005E60] hover:border-[#005E60]/30 hover:shadow-xl transition-all duration-300 group"
                aria-label="Next developers"
              >
                <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </>
          )}

          <div 
            ref={containerRef}
            className="overflow-x-auto overflow-y-hidden scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', paddingLeft: '12px', paddingRight: '12px' }}
            onMouseEnter={handlePause}
            onMouseLeave={handleResume}
            onTouchStart={handlePause}
            onTouchEnd={handleResume}
          >
            <div 
              className="flex"
              style={{ 
                gap: `${gapSize}px`,
                transform: `translateX(-${offset}px)`,
                transition: isPaused ? 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                width: `${STEP * extendedDevelopers.length}px`
              }}
            >
              {extendedDevelopers.map((dev, idx) => {
                const isActive = idx % developers.length === activeIndex;
                
                return (
                  <a
                    key={`${dev.id}-${idx}`} 
                    href={`/builders/${dev.slug}`}
                    className="flex-shrink-0 group"
                    style={{ width: `${cardWidth}px` }}
                    onClick={(e) => {
                      setIsPaused(true);
                      setActiveIndex(idx % developers.length);
                      setTimeout(() => setIsPaused(false), 500);
                    }}
                  >
                    <div className={`
                      relative bg-white rounded-3xl overflow-hidden transition-all duration-500
                      ${isActive 
                        ? 'shadow-2xl shadow-[#005E60]/10 ring-2 ring-[#005E60]/20 scale-[1.02]' 
                        : 'shadow-lg hover:shadow-xl hover:-translate-y-1'
                      }
                    `}>
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#005E60] via-[#007a7c] to-[#F8C21C]" />
                      
                      {/* ✅ Logo Section with Safe src Handling */}
                      <div className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 px-8 pt-8 pb-6">
                        <div className="absolute inset-0 opacity-[0.02]" 
                          style={{ 
                            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                            backgroundSize: '24px 24px'
                          }} 
                        />
                        <div className="relative flex items-center justify-center" style={{ height: `${logoBoxSize}px` }}>
                          
                          {/* ✅ TEXT LOGO (Lodha) */}
                          {dev.logoType === 'text' || dev.slug === 'lodha' ? (
                            <div className="text-center">
                              <span 
                                className="font-black text-gray-900 tracking-tight leading-none"
                                style={{ 
                                  fontSize: viewportWidth < 640 ? '32px' : viewportWidth < 1024 ? '40px' : '48px',
                                  fontFamily: 'system-ui, -apple-system, sans-serif'
                                }}
                              >
                                Lodha
                              </span>
                              <span className="block text-gray-400 text-sm font-medium mt-1 tracking-wide">
                                GROUP
                              </span>
                            </div>
                          ) : dev.logoSrc && dev.logoSrc !== '' ? (
                            /* ✅ IMAGE LOGO (Only if src is not empty) */
                            <div className="relative w-full h-full flex items-center justify-center p-2">
                              <Image
                                src={dev.logoSrc}
                                alt={`${dev.name} logo`}
                                width={240}
                                height={logoBoxSize}
                                className="object-contain object-center drop-shadow-sm"
                                style={{ maxHeight: `${logoBoxSize}px`, maxWidth: '100%' }}
                                priority={idx < 4}
                                unoptimized
                              />
                            </div>
                          ) : (
                            /* ✅ FALLBACK (First Letter) */
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#005E60] flex items-center justify-center">
                              <span className="text-white text-2xl sm:text-3xl font-bold">
                                {dev.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="px-6 pb-6 pt-2">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-1.5">
                            <Star className="w-4 h-4 fill-[#F8C21C] text-[#F8C21C]" />
                            <span 
                              className="text-sm font-semibold text-gray-900"
                              suppressHydrationWarning={true}
                            >
                              {dev.rating.toFixed(1)}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-[#005E60] bg-[#005E60]/10 px-3 py-1 rounded-full">
                            {dev.years}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[#005E60] transition-colors line-clamp-1 text-lg">
                          {dev.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-5 line-clamp-1">
                          Serving {city} & surrounding areas
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div>
                            <span className="text-3xl font-black text-[#005E60]">{dev.projects}</span>
                            <span className="text-sm text-gray-500 ml-1">projects</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[#005E60] text-sm font-semibold group-hover:gap-2 transition-all">
                            Explore
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>

                      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        style={{ 
                          background: 'radial-gradient(ellipse at top, rgba(0,94,96,0.08) 0%, transparent 70%)'
                        }} 
                      />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {developers.length > 4 && (
            <div className="flex justify-center gap-2 mt-8">
              {developers.slice(0, 5).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveIndex(idx);
                    const container = containerRef.current;
                    if (container) {
                      container.scrollTo({ left: idx * STEP, behavior: 'smooth' });
                      setOffset(idx * STEP);
                    }
                  }}
                  className={`transition-all duration-300 rounded-full ${
                    activeIndex === idx 
                      ? 'w-8 h-2 bg-gradient-to-r from-[#005E60] to-[#004a4d]' 
                      : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to developer ${idx + 1}`}
                  aria-current={activeIndex === idx ? 'true' : 'false'}
                />
              ))}
              {developers.length > 5 && (
                <span className="w-2 h-2 bg-gray-200 rounded-full" title={`${developers.length - 5} more`} />
              )}
            </div>
          )}
        </div>

        {viewportWidth < BREAKPOINTS.tablet && developers.length > 4 && (
          <div className="flex justify-center mt-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
              <ChevronLeft size={14} className="text-gray-400" />
              <span className="text-xs text-gray-500 font-medium">Swipe to explore</span>
              <ChevronRight size={14} className="text-gray-400" />
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <a 
            href="/builders"
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#005E60] to-[#004a4d] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#005E60]/25 transition-all duration-300 group"
          >
            View All Developers
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <p className="text-sm text-gray-500 mt-3">
            {developers.length}+ verified builders in {city}
          </p>
        </div>

      </div>

      <style jsx global>{`
        [style*="scrollbar-width:none"]::-webkit-scrollbar { display: none; }
        .scroll-smooth { scroll-behavior: smooth; }
        * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
      `}</style>
    </section>
  );
}