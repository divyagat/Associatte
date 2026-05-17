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

// ✅ Responsive card config
const getCardConfig = (isMobile: boolean, isTablet: boolean) => {
  if (isMobile) return { width: 240, gap: 16, logoHeight: 'max-h-12', containerHeight: 'h-16', padding: 'p-3' };
  if (isTablet) return { width: 260, gap: 20, logoHeight: 'max-h-14', containerHeight: 'h-18', padding: 'p-4' };
  return { width: 280, gap: 24, logoHeight: 'max-h-14', containerHeight: 'h-20', padding: 'p-4' };
};

export default function TopDevelopersCarousel({ city }: TopDevelopersCarouselProps) {
  const [offset, setOffset] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [logoErrors, setLogoErrors] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Touch swipe support
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // ✅ Detect screen size for responsive config
  useEffect(() => {
    const checkScreen = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 1024);
    };
    
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const { width: CARD_WIDTH, gap: GAP, logoHeight, containerHeight, padding } = getCardConfig(isMobile, isTablet);
  const STEP = CARD_WIDTH + GAP;
  const SPEED = isMobile ? 0.06 : 0.08; // Slightly slower on mobile

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

  // 2️⃣ Duplicate for seamless infinite looping
  const extendedDevelopers = useMemo(() => {
    if (developers.length === 0) return [];
    return [...developers, ...developers];
  }, [developers]);

  // 3️⃣ Animation loop
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
        if (newOffset >= maxOffset) return 0;
        return newOffset;
      });
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isPaused, developers.length, STEP, SPEED]);

  // 4️⃣ Manual scroll with wrap-around
  const scrollByCards = (direction: 'left' | 'right') => {
    setOffset(prev => {
      const maxOffset = STEP * developers.length;
      let newOffset = prev + (direction === 'left' ? -STEP : STEP);
      if (newOffset < 0) newOffset = maxOffset - STEP;
      if (newOffset >= maxOffset) newOffset = 0;
      return newOffset;
    });
  };

  // 5️⃣ ✅ Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) {
      setIsPaused(false);
      return;
    }
    
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50; // Minimum swipe distance
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) scrollByCards('right'); // Swipe left → scroll right
      else scrollByCards('left'); // Swipe right → scroll left
    }
    
    touchStartX.current = null;
    touchEndX.current = null;
    setIsPaused(false);
  };

  const handleLogoError = (developerId: string) => {
    setLogoErrors(prev => new Set(prev).add(developerId));
  };

  if (!developers || developers.length === 0) return null;

  return (
    <section 
      className="py-8 sm:py-12 lg:py-16 bg-white overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
          <div>
            <span className="text-[#005E60] text-[10px] sm:text-xs font-bold uppercase tracking-wider block mb-1.5 sm:mb-2">
              Trusted Builders
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#8B0000]">
              Top Developers in {city}
            </h2>
          </div>
          
          {developers.length > 4 && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button 
                onClick={() => scrollByCards('left')}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-gray-200 text-gray-500 flex items-center justify-center hover:border-[#005E60] hover:text-[#005E60] hover:bg-[#005E60]/5 transition-all active:scale-95"
                aria-label="Scroll left"
              >
                <ChevronLeft size={isMobile ? 14 : 16} />
              </button>
              <button 
                onClick={() => scrollByCards('right')}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-gray-200 text-gray-500 flex items-center justify-center hover:border-[#005E60] hover:text-[#005E60] hover:bg-[#005E60]/5 transition-all active:scale-95"
                aria-label="Scroll right"
              >
                <ChevronRight size={isMobile ? 14 : 16} />
              </button>
            </div>
          )}
        </div>

        {/* Carousel Track */}
        <div 
          ref={containerRef}
          className="overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            ref={trackRef}
            className="flex will-change-transform"
            style={{ 
              gap: `${GAP}px`,
              transform: `translateX(-${offset}px)`,
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
                  className={`
                    flex-shrink-0 bg-white rounded-xl border-l-4 border-[#005E60] 
                    shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 
                    group relative overflow-hidden block
                    ${isMobile ? 'w-[240px]' : isTablet ? 'w-[260px]' : 'w-[280px]'}
                  `}
                >
                  <div className={`${padding} sm:p-4 lg:p-5 flex flex-col h-full`}>
                    
                    {/* Logo or Text Fallback - Responsive */}
                    <div className="mb-4 sm:mb-5 lg:mb-6">
                      <div className="relative">
                        {/* Experience Badge - Responsive sizing */}
                        <div className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 z-10">
                          <div className={`
                            bg-[#005E60] text-white rounded-full font-bold shadow-sm whitespace-nowrap
                            ${isMobile ? 'px-2 py-1 text-[10px]' : 'px-3 py-1.5 text-xs'}
                          `}>
                            {dev.years}
                          </div>
                        </div>
                        
                        {/* Logo Container - Responsive */}
                        <div className={`
                          w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl 
                          flex items-center justify-center border border-gray-200 
                          group-hover:border-[#005E60]/40 group-hover:shadow-md transition-all duration-300
                          ${containerHeight} ${padding}
                        `}>
                          {hasLogoError || !dev.logo ? (
                            /* Text Fallback */
                            <div className="text-center px-1">
                              <div className={`
                                font-bold text-[#005E60] leading-tight
                                ${isMobile ? 'text-base' : 'text-lg'}
                              `}>
                                {dev.name.split(' ').slice(0, 2).join(' ')}
                              </div>
                              {dev.name.split(' ').length > 2 && (
                                <div className={`
                                  text-gray-500 font-medium mt-0.5
                                  ${isMobile ? 'text-[10px]' : 'text-xs'}
                                `}>
                                  {dev.name.split(' ').slice(2).join(' ')}
                                </div>
                              )}
                            </div>
                          ) : (
                            /* Logo Image - Responsive */
                            <img 
                              src={dev.logo} 
                              alt={`${dev.name} logo`} 
                              className={`
                                w-full object-contain opacity-90 
                                group-hover:opacity-100 group-hover:scale-105 
                                transition-all duration-300
                                ${logoHeight} max-w-[160px] sm:max-w-[180px]
                              `}
                              onError={() => handleLogoError(dev.id)}
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Divider - Responsive */}
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-3 sm:mb-4 lg:mb-5"></div>

                    {/* Developer Name & Projects - Responsive */}
                    <div className="flex-grow flex flex-col justify-end">
                      <h3 className={`
                        font-bold text-gray-900 mb-1.5 sm:mb-2 
                        group-hover:text-[#8B0000] transition-colors line-clamp-1
                        ${isMobile ? 'text-sm' : 'text-base'}
                      `}>
                        {dev.name}
                      </h3>
                      <div className="flex items-end justify-between">
                        <span className={`
                          text-gray-500 font-medium
                          ${isMobile ? 'text-[10px]' : 'text-xs'}
                        `}>
                          Projects
                        </span>
                        <span className={`
                          font-bold text-[#005E60]
                          ${isMobile ? 'text-lg' : 'text-xl'}
                        `}>
                          {dev.projects}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Animated Bottom Accent Line */}
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#F8C21C] group-hover:w-full transition-all duration-400 ease-out"></div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Pause Indicator - Responsive */}
        {developers.length > 4 && (
          <div className="flex justify-center mt-3 sm:mt-4">
            <span className={`
              text-[10px] sm:text-xs transition-opacity duration-300
              ${isPaused ? 'opacity-100 text-[#8B0000]' : 'opacity-0'}
            `}>
              • Paused •
            </span>
          </div>
        )}
      </div>
    </section>
  );
}