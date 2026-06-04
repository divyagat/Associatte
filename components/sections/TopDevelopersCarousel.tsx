'use client';

import { ChevronLeft, ChevronRight, Building2, ArrowRight, Star, Sparkles, Shield } from 'lucide-react';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(1280);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setViewportWidth(window.innerWidth);
      const handleResize = () => setViewportWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const itemsPerView = useMemo(() => {
    if (viewportWidth < 640) return 1;
    if (viewportWidth < 768) return 2;
    if (viewportWidth < 1024) return 3;
    if (viewportWidth < 1280) return 4;
    return 5;
  }, [viewportWidth]);

  // ✅ FIXED: Safe developer mapping with proper type checking
  const developers: Developer[] = useMemo(() => {
    const devMap = new Map<string, Developer>();
    
    properties.forEach((p: any) => {
      const name = p.developer?.name;
      if (!name) return;
      
      const navSlug = getBuilderSlug(name);
      const internalId = toSlug(name);
      const logoConfig = getBuilderLogo(name);
      
      // ✅ Safe logo source extraction with type assertion
      let logoSrc = '';
      let logoType: 'image' | 'text' = 'image';
      
      if (typeof logoConfig === 'string') {
        logoSrc = logoConfig;
        logoType = 'image';
      } else if (logoConfig && typeof logoConfig === 'object') {
        const config = logoConfig as any;
        logoSrc = config.src || '';
        logoType = config.type === 'text' ? 'text' : 'image';
      }
      
      if (!devMap.has(internalId)) {
        devMap.set(internalId, {
          id: internalId,
          name,
          slug: navSlug,
          years: getBuilderYears(name),
          projects: 0,
          logoSrc,
          logoType,
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

  const maxIndex = useMemo(() => {
    if (developers.length <= itemsPerView) return 0;
    return Math.max(0, Math.ceil(developers.length / itemsPerView) - 1);
  }, [developers.length, itemsPerView]);

  const getVisibleDevelopers = useCallback(() => {
    const start = currentIndex * itemsPerView;
    return developers.slice(start, start + itemsPerView);
  }, [developers, currentIndex, itemsPerView]);

  const nextSlide = useCallback(() => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(prev => prev + 1);
    } else if (currentIndex === maxIndex) {
      setCurrentIndex(0);
    }
    if (progressRef.current) {
      progressRef.current.style.animation = 'none';
      setTimeout(() => {
        if (progressRef.current) {
          progressRef.current.style.animation = 'progress 4s linear forwards';
        }
      }, 10);
    }
  }, [currentIndex, maxIndex]);

  const prevSlide = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else if (currentIndex === 0) {
      setCurrentIndex(maxIndex);
    }
  }, [currentIndex, maxIndex]);

  useEffect(() => {
    if (isAutoPlaying && maxIndex > 0 && developers.length > itemsPerView) {
      autoPlayRef.current = setInterval(() => {
        nextSlide();
      }, 4000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying, maxIndex, nextSlide, developers.length, itemsPerView]);

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
    if (progressRef.current) {
      progressRef.current.style.animationPlayState = 'paused';
    }
  };
  
  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
    if (progressRef.current) {
      progressRef.current.style.animationPlayState = 'running';
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
    setIsAutoPlaying(false);
    if (progressRef.current) {
      progressRef.current.style.animationPlayState = 'paused';
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === 0) return;
    const diff = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
    setTouchStart(0);
    setTimeout(() => {
      setIsAutoPlaying(true);
      if (progressRef.current) {
        progressRef.current.style.animationPlayState = 'running';
      }
    }, 3000);
  };

  const getCityTheme = () => {
    switch(city) {
      case 'Pune':
        return { 
          primary: '#0D9488', 
          light: '#E6F7F5', 
          dark: '#0F766E', 
          gradient: 'from-teal-500 to-emerald-500',
          glow: '0 0 30px rgba(13,148,136,0.2)'
        };
      case 'Mumbai':
        return { 
          primary: '#2563EB', 
          light: '#EFF6FF', 
          dark: '#1D4ED8', 
          gradient: 'from-blue-500 to-indigo-500',
          glow: '0 0 30px rgba(37,99,235,0.2)'
        };
      case 'KDMC':
        return { 
          primary: '#EA580C', 
          light: '#FFF7ED', 
          dark: '#C2410C', 
          gradient: 'from-orange-500 to-amber-500',
          glow: '0 0 30px rgba(234,88,12,0.2)'
        };
      default:
        return { 
          primary: '#0D9488', 
          light: '#E6F7F5', 
          dark: '#0F766E', 
          gradient: 'from-teal-500 to-emerald-500',
          glow: '0 0 30px rgba(13,148,136,0.2)'
        };
    }
  };

  const theme = getCityTheme();

  if (!developers?.length) return null;

  return (
    <section className="py-10 md:py-14 bg-gradient-to-br from-slate-50 via-white to-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 shadow-sm"
            style={{ backgroundColor: theme.light }}
          >
            <Sparkles className="w-4 h-4" style={{ color: theme.primary }} />
            <span className="text-sm font-semibold" style={{ color: theme.primary }}>INDIA'S TOP BUILDERS</span>
          </div>
          
          <h2 className="section-title mb-4">
            <span className="text-gray-900">Trusted Developers in</span>
            <br />
            <span className="relative inline-block mt-2">
              <span className="relative z-10" style={{ color: theme.primary }}>
                {city}
              </span>
              <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 8" preserveAspectRatio="none">
                <path d="M0 4 Q 50 0, 100 4 T 200 4" stroke={theme.primary} strokeWidth="3" fill="none" opacity="0.3" />
              </svg>
            </span>
          </h2>
          
          <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
            Partnering with India's most trusted and reputed real estate developers
          </p>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Progress Bar */}
          {developers.length > itemsPerView && isAutoPlaying && (
            <div className="absolute -top-8 left-0 right-0 h-0.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                ref={progressRef}
                className="h-full rounded-full"
                style={{ 
                  backgroundColor: theme.primary,
                  width: '0%',
                  animation: 'progress 4s linear forwards'
                }}
              />
            </div>
          )}

          {/* Navigation Arrows */}
          {developers.length > itemsPerView && (
            <>
              <button
                onClick={() => {
                  setIsAutoPlaying(false);
                  prevSlide();
                  setTimeout(() => setIsAutoPlaying(true), 3000);
                }}
                className="absolute -left-4 md:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl"
                style={{ boxShadow: theme.glow }}
              >
                <ChevronLeft size={20} className="md:w-5 md:h-5" style={{ color: theme.primary }} />
              </button>

              <button
                onClick={() => {
                  setIsAutoPlaying(false);
                  nextSlide();
                  setTimeout(() => setIsAutoPlaying(true), 3000);
                }}
                className="absolute -right-4 md:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl"
                style={{ boxShadow: theme.glow }}
              >
                <ChevronRight size={20} className="md:w-5 md:h-5" style={{ color: theme.primary }} />
              </button>
            </>
          )}

          {/* Cards Grid */}
          <div className="overflow-visible">
            <div 
              className="grid transition-all duration-500 ease-out gap-5 md:gap-6"
              style={{
                gridTemplateColumns: `repeat(${itemsPerView}, minmax(0, 1fr))`,
              }}
            >
              {getVisibleDevelopers().map((dev, idx) => (
                <a
                  key={dev.id}
                  href={`/builders/${dev.slug}`}
                  className="group block transform transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500">
                    
                    {/* Animated Gradient Top Border */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.gradient} transform origin-left transition-transform duration-500 scale-x-0 group-hover:scale-x-100`} />
                    
                    {/* Premium Badge for Top 3 */}
                    {idx < 3 && (
                      <div className="absolute top-3 right-3 z-10">
                        <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full shadow-lg">
                          <Star size={10} className="fill-white" />
                          <span className="text-[10px] font-bold">TOP {idx + 1}</span>
                        </div>
                      </div>
                    )}

                    {/* Rating Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <div className="flex items-center gap-1 px-2 py-1 bg-white/95 backdrop-blur-sm rounded-full shadow-sm">
                        <Star size={10} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-bold text-gray-800">{dev.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    {/* Logo Section */}
                    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6 md:p-8 flex items-center justify-center min-h-[180px] md:min-h-[200px]">
                      <div className="relative flex items-center justify-center w-full">
                        
                        {/* Text Logo */}
                        {(dev.logoType === 'text' || dev.slug === 'lodha') ? (
                          <div className="text-center transform transition-all duration-500 group-hover:scale-105">
                            <span 
                              className="font-black text-gray-800 tracking-tight leading-none block"
                              style={{ 
                                fontSize: 'clamp(24px, 5vw, 36px)',
                                fontFamily: 'system-ui, -apple-system, sans-serif'
                              }}
                            >
                              {dev.name.split(' ')[0]}
                            </span>
                            {dev.name.includes('Group') && (
                              <span className="text-gray-400 text-xs font-medium mt-1 block tracking-wider">
                                GROUP
                              </span>
                            )}
                          </div>
                        ) : dev.logoSrc && dev.logoSrc !== '' ? (
                          <div className="relative w-full flex items-center justify-center p-3">
                            <Image
                              src={dev.logoSrc}
                              alt={dev.name}
                              width={140}
                              height={70}
                              className="object-contain transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-xl"
                              style={{ maxHeight: '70px', width: 'auto' }}
                              priority={idx < 6}
                              unoptimized
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  const fallback = document.createElement('div');
                                  fallback.className = `w-14 h-14 rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-md`;
                                  fallback.innerHTML = `<span className="text-white text-xl font-bold">${dev.name.charAt(0).toUpperCase()}</span>`;
                                  parent.appendChild(fallback);
                                }
                              }}
                            />
                          </div>
                        ) : (
                          <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-md transform transition-all duration-500 group-hover:scale-110`}>
                            <span className="text-white text-xl font-bold">
                              {dev.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content Section - FIXED: Removed invalid style object */}
                    <div className="p-5 pt-3 text-center">
                      <h3 
                        className="font-bold text-gray-800 text-base md:text-lg mb-2 transition-colors duration-300 line-clamp-1 group-hover:text-[--hover-color]" 
                        style={{ '--hover-color': theme.primary } as React.CSSProperties}
                      >
                        {dev.name}
                      </h3>
                      
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          <Building2 size={12} style={{ color: theme.primary }} />
                          <span className="text-xs text-gray-600">{dev.projects}+ Projects</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-gray-300" />
                        <div className="flex items-center gap-1">
                          <Shield size={10} style={{ color: theme.primary }} />
                          <span className="text-xs text-gray-500">RERA</span>
                        </div>
                      </div>

                      {/* Explore Button */}
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <span className="inline-flex items-center gap-1 text-xs font-medium transition-all group-hover:gap-2" style={{ color: theme.primary }}>
                          Explore Projects
                          <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>

                    {/* Hover Glow Effect */}
                    <div 
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ 
                        background: `radial-gradient(ellipse at 50% 0%, ${theme.primary}08 0%, transparent 70%)`,
                        boxShadow: `inset 0 0 0 1px ${theme.primary}20`
                      }} 
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Pagination Dots */}
          {maxIndex > 0 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(index);
                    setTimeout(() => setIsAutoPlaying(true), 3000);
                  }}
                  className={`rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'w-8 h-2' 
                      : 'w-2 h-2 bg-gray-200 hover:bg-gray-300'
                  }`}
                  style={{ backgroundColor: index === currentIndex ? theme.primary : undefined }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Auto-play Toggle Hint */}
        {developers.length > itemsPerView && (
          <div className="text-center mt-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-sm border border-gray-100">
              <div className={`w-1.5 h-1.5 rounded-full ${isAutoPlaying ? 'animate-pulse' : ''}`} style={{ backgroundColor: isAutoPlaying ? theme.primary : '#9CA3AF' }} />
              <span className="text-[10px] text-gray-500">
                {isAutoPlaying ? 'Auto-scrolling active' : 'Paused — click arrows to navigate'}
              </span>
            </div>
          </div>
        )}

        {/* View All Link */}
        <div className="text-center mt-10">
          <a 
            href="/builders"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 group"
            style={{ backgroundColor: theme.primary, color: 'white' }}
          >
            <span>View All Developers in {city}</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </a>
          <p className="text-xs text-gray-400 mt-3">
            {developers.length}+ verified RERA registered builders
          </p>
        </div>

      </div>

      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        .animate-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}