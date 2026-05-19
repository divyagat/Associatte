'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useMemo, useRef } from 'react';
import properties from '../../data/properties.json';
import { 
  getBuilderSlug, 
  getBuilderYears, 
  getBuilderLogo,
  BUILDER_PRIMARY_SLUGS 
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

// ✅ ADD city PROP INTERFACE
interface TopDevelopersCarouselProps {
  city: 'Pune' | 'Mumbai' | 'KDMC';
}

export default function TopDevelopersCarousel({ city }: TopDevelopersCarouselProps) {
  const [offset, setOffset] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

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

  const extendedDevelopers = useMemo(() => {
    if (developers.length <= 4) return developers;
    return [...developers, ...developers.slice(0, 4)];
  }, [developers]);

  const CARD_WIDTH = 280;
  const GAP = 24;
  const STEP = CARD_WIDTH + GAP;
  const SPEED = 0.08;

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
        if (newOffset >= STEP * developers.length) return 0;
        return newOffset;
      });
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isPaused, developers.length]);

  const scrollByCards = (direction: 'left' | 'right') => {
    const container = trackRef.current?.parentElement;
    if (!container) return;
    const scrollAmount = direction === 'left' ? -STEP : STEP;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
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
              transition: isPaused ? 'transform 0.3s ease-out' : 'none',
              width: `${STEP * extendedDevelopers.length}px`
            }}
          >
            {extendedDevelopers.map((dev, idx) => (
              <a
                key={`${dev.id}-${idx}`} 
                href={`/builders/${dev.slug}`}
                className="min-w-[280px] w-[280px] bg-white rounded-xl border-l-4 border-[#005E60] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden block flex-shrink-0"
              >
                <div className="p-5 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-5">
                    <div className="h-11 w-20 bg-gray-50 rounded-lg flex items-center justify-center px-2 border border-gray-100 group-hover:border-[#005E60]/30 transition-colors">
                      <img 
                        src={dev.logo} 
                        alt={`${dev.name} logo`} 
                        className="max-h-7 w-auto object-contain opacity-75 group-hover:opacity-100 transition-opacity"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/logos/placeholder.png';
                        }}
                      />
                    </div>
                    <div className="bg-[#005E60]/10 text-[#005E60] px-2.5 py-1 rounded-full text-xs font-bold">
                      {dev.years}
                    </div>
                  </div>

                  <div className="h-px w-full bg-gray-100 mb-5"></div>

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
            ))}
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