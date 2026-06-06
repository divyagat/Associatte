'use client';

import { ArrowRight } from 'lucide-react';
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

  const renderCard = (dev: Developer, index: number) => (
    <div
      key={`${dev.id}-${index}`}
      className="flex-shrink-0 w-[160px] sm:w-[200px] md:w-[240px] px-3 group"
    >
      <a
        href={`/builders/${dev.slug}`}
        className="block bg-white rounded-2xl border border-[var(--color-accent)] p-4 md:p-5 transition-all duration-300 hover:border-[var(--color-primary)] hover:shadow-xl hover:-translate-y-1.5 h-full flex flex-col items-center justify-center"
      >
        {/* Logo Container */}
        <div className="h-16 md:h-20 w-full flex items-center justify-center mb-4 bg-[var(--color-accent)]/40 rounded-xl p-2 transition-colors group-hover:bg-[var(--color-accent)]/60">
          {(dev.logoType === 'text' || dev.slug === 'lodha') ? (
            <div className="text-center">
              <span
                className="font-heading font-black text-[var(--color-foreground)] tracking-tight leading-none block"
                style={{ fontSize: 'clamp(18px, 4vw, 24px)' }}
              >
                {dev.name.split(' ')[0]}
              </span>
              {dev.name.includes('Group') && (
                <span className="text-[var(--color-text-light)] text-[9px] font-medium mt-1 block tracking-widest">
                  GROUP
                </span>
              )}
            </div>
          ) : dev.logoSrc ? (
            <Image
              src={dev.logoSrc}
              alt={dev.name}
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
                  fallback.innerHTML = `<span class="text-white text-lg font-bold">${dev.name.charAt(0).toUpperCase()}</span>`;
                  parent.appendChild(fallback);
                }
              }}
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
              <span className="text-white text-lg font-bold">
                {dev.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        
        {/* Developer Name */}
        <h3 className="font-heading text-sm md:text-base font-semibold text-[var(--color-foreground)] text-center line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors">
          {dev.name}
        </h3>
      </a>
    </div>
  );

  return (
    <section className="py-12 md:py-20 bg-[var(--bgColor)] overflow-hidden">
      <div className="container-site">
        {/* Header Section */}
        <div className="text-center mb-10 md:mb-14">
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
      <div className="container-site text-center mt-10 md:mt-12">
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