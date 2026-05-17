'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useMemo, useRef } from 'react';
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
  logo: string;
}

interface TopDevelopersCarouselProps {
  city: 'Pune' | 'Mumbai' | 'KDMC';
}

export default function TopDevelopersCarousel({ city }: TopDevelopersCarouselProps) {
  const [offset, setOffset] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [logoErrors, setLogoErrors] = useState<Set<string>>(new Set());
  const trackRef = useRef<HTMLDivElement>(null);

  // 1️⃣ Build unique developers list
  const developers: Developer[] = useMemo(() => {
    const devMap = new Map<string, Developer>();
    
    properties.forEach((p: any) => {
      const name = p.developer?.name;
      if (!name) return;
      
      const navSlug = getBuilderSlug(name);
      const internalId = toSlug(name);
      
      if (!devMap.has(internalId)) {
        devMap.set(internalId, {
          id: internalId,
          name,
          slug: navSlug,
          years: getBuilderYears(name),
          projects: 0,
          logo: getBuilderLogo(name),
        });
      }
      const dev = devMap.get(internalId)!;
      dev.projects += 1;
    });
    
    return Array.from(devMap.values())
      .filter(d => d.name && d.slug)
      .sort((a, b) => b.projects - a.projects);
  }, []);

  // 2️⃣ ✅ Duplicate FULL array for seamless infinite looping
  const extendedDevelopers = useMemo(() => {
    if (developers.length === 0) return [];
    return [...developers, ...developers]; // Second half = exact copy of first half
  }, [developers]);

  const CARD_WIDTH = 280;
  const GAP = 24;
  const STEP = CARD_WIDTH + GAP;
  const SPEED = 0.08;

  // 3️⃣ Animation loop with frame-perfect reset
  useEffect(() => {
    if (isPaused || developers.length <= 1) return;
    
    let animationFrame: number;
    let lastTime = 0;

    const animate = (time: number) => {
      if (!lastTime) lastTime = time;
      const delta = time - lastTime;
      lastTime = time;
      
      setOffset(prev => {
        const newOffset = prev + SPEED * delta;
        const maxOffset = STEP * developers.length;
        
        // ✅ Reset to 0 exactly when we pass the first set. 
        // Since the second set is identical, the reset is visually invisible.
        if (newOffset >= maxOffset) {
          return 0;
        }
        return newOffset;
      });
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isPaused, developers.length]);

  // 4️⃣ ✅ Fixed manual scroll to work with transform-based animation
  const scrollByCards = (direction: 'left' | 'right') => {
    setOffset(prev => {
      const maxOffset = STEP * developers.length;
      let newOffset = prev + (direction === 'left' ? -STEP : STEP);
      
      // Wrap around seamlessly
      if (newOffset < 0) newOffset = maxOffset - STEP;
      if (newOffset >= maxOffset) newOffset = 0;
      
      return newOffset;
    });
  };

  const handleLogoError = (developerId: string) => {
    setLogoErrors(prev => new Set(prev).add(developerId));
  };

  if (!developers || developers.length === 0) return null;

  return (
    <section 
      className="py-12 lg:py-16 bg-white overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <div>
            <span className="text-[#005E60] text-xs font-bold uppercase tracking-wider block mb-2">
              Trusted Builders
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#8B0000]">
              Top Developers in {city}
            </h2>
          </div>
          
          {developers.length > 4 && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => scrollByCards('left')}
                className="w-9 h-9 rounded-lg border border-gray-200 text-gray-500 flex items-center justify-center hover:border-[#005E60] hover:text-[#005E60] hover:bg-[#005E60]/5 transition-all"
                aria-label="Scroll left"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => scrollByCards('right')}
                className="w-9 h-9 rounded-lg border border-gray-200 text-gray-500 flex items-center justify-center hover:border-[#005E60] hover:text-[#005E60] hover:bg-[#005E60]/5 transition-all"
                aria-label="Scroll right"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        <div className="overflow-hidden">
          <div 
            ref={trackRef}
            className="flex gap-6 will-change-transform"
            style={{ 
              transform: `translateX(-${offset}px)`,
              // ✅ No transition during animation for instant seamless reset
              transition: isPaused ? 'transform 0.3s ease-out' : 'none',
              width: `${STEP * extendedDevelopers.length}px`
            }}
          >
            {extendedDevelopers.map((dev, idx) => {
              const hasLogoError = logoErrors.has(dev.id);
              
              return (
                <a
                  key={`${dev.id}-${idx}`} 
                  href={`/builders/${dev.slug}`}
                  className="min-w-[280px] w-[280px] bg-white rounded-xl border-l-4 border-[#005E60] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden block flex-shrink-0"
                >
                  <div className="p-5 flex flex-col h-full">
                    
                    {/* Logo or Text Fallback */}
                    <div className="mb-6">
                      <div className="relative">
                        <div className="absolute -top-2 -right-2 z-10">
                          <div className="bg-[#005E60] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-sm whitespace-nowrap">
                            {dev.years}
                          </div>
                        </div>
                        
                        <div className="h-20 w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center p-4 border border-gray-200 group-hover:border-[#005E60]/40 group-hover:shadow-md transition-all duration-300">
                          {hasLogoError || !dev.logo ? (
                            <div className="text-center">
                              <div className="text-lg font-bold text-[#005E60] leading-tight">
                                {dev.name.split(' ').slice(0, 2).join(' ')}
                              </div>
                              {dev.name.split(' ').length > 2 && (
                                <div className="text-xs text-gray-500 font-medium mt-0.5">
                                  {dev.name.split(' ').slice(2).join(' ')}
                                </div>
                              )}
                            </div>
                          ) : (
                            <img 
                              src={dev.logo} 
                              alt={`${dev.name} logo`} 
                              className="max-h-14 w-full max-w-[180px] object-contain opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                              onError={() => handleLogoError(dev.id)}
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-5"></div>

                    <div className="flex-grow flex flex-col justify-end">
                      <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-[#8B0000] transition-colors line-clamp-1">
                        {dev.name}
                      </h3>
                      <div className="flex items-end justify-between">
                        <span className="text-xs text-gray-500 font-medium">Projects</span>
                        <span className="text-xl font-bold text-[#005E60]">
                          {dev.projects}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#F8C21C] group-hover:w-full transition-all duration-400 ease-out"></div>
                </a>
              );
            })}
          </div>
        </div>

        {developers.length > 4 && (
          <div className="flex justify-center mt-4">
            <span className={`text-xs transition-opacity duration-300 ${isPaused ? 'opacity-100 text-[#8B0000]' : 'opacity-0'}`}>
              • Paused •
            </span>
          </div>
        )}
      </div>
    </section>
  );
}