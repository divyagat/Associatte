'use client';

import { ArrowRight, Building2, CalendarClock, LayoutGrid } from 'lucide-react';
import { useMemo } from 'react';
import Image from 'next/image';
import properties from '../../data/properties.json';
import { getBuilderSlug, getBuilderLogo } from '@/lib/builder-slugs';

const toSlug = (str: string) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

interface Developer {
  id: string;
  name: string;
  slug: string;
  logoSrc: string;
  logoType: 'image' | 'text';
  established?: string;
  projectsCount?: number;
}

interface TopDevelopersCarouselProps {
  city: 'Pune' | 'Mumbai' | 'KDMC';
}

export default function TopDevelopersCarousel({ city }: TopDevelopersCarouselProps) {
  const developers: Developer[] = useMemo(() => {
    const devMap = new Map<string, Developer>();

    properties.forEach((p: any) => {
      const name = p.developer?.name;
      if (!name) return;

      const navSlug = getBuilderSlug(name);
      const internalId = toSlug(name);
      const logoConfig = getBuilderLogo(name);

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
          logoSrc,
          logoType,
          established: p.developer?.established,
          projectsCount: p.developer?.projectsCount,
        });
      }
    });

    return Array.from(devMap.values()).filter(d => d.name && d.slug);
  }, []);

  // ✅ Ensure we have enough items for a smooth, seamless loop without looking empty
  const minItems = 8;
  let baseList = [...developers];
  while (baseList.length < minItems && baseList.length > 0) {
    baseList = [...baseList, ...developers];
  }
  const seamlessList = [...baseList, ...baseList];

  if (!developers?.length) return null;

  const currentYear = new Date().getFullYear();

  const renderCard = (dev: Developer, index: number) => {
    const establishedYear = dev.established ? parseInt(dev.established, 10) : null;
    const experience =
      establishedYear && !Number.isNaN(establishedYear)
        ? currentYear - establishedYear
        : null;

    return (
    <div
      key={`${dev.id}-${index}`}
      className="flex-shrink-0 w-[170px] sm:w-[210px] md:w-[240px] px-2 sm:px-3 group"
    >
      <a
        href={`/builders/${dev.slug}`}
        className="block bg-white rounded-2xl border border-[var(--color-accent)] p-3.5 sm:p-4 md:p-5 transition-all duration-300 hover:border-[var(--color-primary)] hover:shadow-xl hover:-translate-y-1.5 h-full flex flex-col"
      >
        {/* Logo Container */}
        <div className="h-14 sm:h-16 md:h-20 w-full flex items-center justify-center mb-3 bg-[var(--color-accent)]/40 rounded-xl p-2 transition-colors group-hover:bg-[var(--color-accent)]/60">
          {dev.slug === 'lodha' ? (
            <span
              className="font-heading font-black text-[var(--color-foreground)] tracking-tight leading-none"
              style={{ fontSize: 'clamp(18px, 4vw, 24px)' }}
            >
              Lodha
            </span>
          ) : dev.logoSrc ? (
            <Image
              src={dev.logoSrc}
              alt="Developer Logo"
              width={120}
              height={60}
              className="object-contain max-h-full w-auto transition-transform duration-300 group-hover:scale-105"
              style={{ maxHeight: '80px', width: 'auto' }}
              unoptimized
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  const fallback = document.createElement('div');
                  fallback.className = 'w-12 h-12 rounded-full bg-[var(--color-primary)] flex items-center justify-center';
                  fallback.innerHTML = `<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>`;
                  parent.appendChild(fallback);
                }
              }}
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          )}
        </div>

        {/* Experience & Projects badges */}
        <div className="mt-auto flex items-center justify-center gap-1.5 flex-wrap">
          {experience && experience > 0 && (
            <span className="inline-flex items-center gap-1 text-[10px] md:text-[11px] font-semibold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-1 rounded-full whitespace-nowrap">
              <CalendarClock className="w-3 h-3" />
              {experience}+ Yrs
            </span>
          )}
          {dev.projectsCount && dev.projectsCount > 0 && (
            <span className="inline-flex items-center gap-1 text-[10px] md:text-[11px] font-semibold text-[var(--color-secondary)] bg-[var(--color-secondary)]/10 px-2 py-1 rounded-full whitespace-nowrap">
              <LayoutGrid className="w-3 h-3" />
              {dev.projectsCount} Projects
            </span>
          )}
        </div>
      </a>
    </div>
    );
  };

  return (
    <section className="pt-0 md:pt-10 pb-12 md:pb-20 bg-[var(--bgColor)] overflow-hidden">
      <div className="container-site">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-10">
          <h2 className="section-title text-[var(--color-primary)] mb-3">
            Trusted Developers
             {/* in {city} */}
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Partnering with India's most reputed and trusted real estate brands
          </p>
        </div>
      </div>

      {/* Continuous Marquee Container */}
      <div className="relative">
        <div className="flex overflow-hidden">
          <div className="associatte-marquee-left">
            {seamlessList.map((dev, idx) => renderCard(dev, idx))}
          </div>
        </div>
        
        {/* Fade Edges for smooth blending into page margins */}
        <div className="absolute inset-y-0 left-0 w-12 md:w-24 bg-gradient-to-r from-[var(--bgColor)] to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-12 md:w-24 bg-gradient-to-l from-[var(--bgColor)] to-transparent pointer-events-none z-10" />
      </div>

      {/* View All Button */}
      <div className="container-site text-center mt-6 md:mt-8">
        <a href="/builders" className="btn-primary group">
          <span>View All Developers</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </a>
      </div>

      {/* Custom Keyframes for Seamless Infinite Scroll */}
      <style>{`
        @keyframes associatte-scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .associatte-marquee-left {
          display: flex;
          animation: associatte-scroll-left 50s linear infinite;
        }
        .associatte-marquee-left:hover {
          animation-play-state: paused;
        }
        
        /* Slightly faster scroll on mobile to compensate for smaller screen width */
        @media (max-width: 768px) {
          .associatte-marquee-left {
            animation-duration: 35s;
          }
        }
      `}</style>
    </section>
  );
}