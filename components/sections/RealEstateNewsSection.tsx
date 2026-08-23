'use client';

import Link from 'next/link';
import { ArrowRight, CalendarDays, ArrowUpRight } from 'lucide-react';
import Reveal from '@/components/common/Reveal';
import SafeImage from '@/components/common/SafeImage';
import { getNewsByCity, type NewsItem } from '@/lib/news-data';

interface RealEstateNewsSectionProps {
  city: 'Pune' | 'Mumbai' | 'KDMC';
}

export default function RealEstateNewsSection({ city }: RealEstateNewsSectionProps) {
  const newsItems = getNewsByCity(city, 3);

  if (newsItems.length === 0) return null;

  return (
    <section className="py-10 md:py-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-[#101C2E] mb-1">
                Latest in {city === 'KDMC' ? 'Kalyan-Dombivli' : city}
              </h2>
              <p className="text-gray-600 text-sm max-w-xl">
                Infrastructure developments, policy changes, and market trends.
              </p>
            </div>
            <Link 
              href={`/news?filter=${city}`} 
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#005E60] hover:text-[#005E60]/80 transition-colors"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {newsItems.map((item, index) => {
            const isExternal = Boolean(item.url);
            const href = item.url ?? `/news/${item.id}`;
            
            return (
              <Reveal key={item.id} delay={index * 100}>
                <Link
                  href={href}
                  {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex flex-col bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:border-[#005E60]/30 transition-all duration-300 h-full"
                >
                  {/* Ultra-compact image height (112px) */}
                  <div className="relative h-28 overflow-hidden rounded-t-lg bg-gray-100">
                    <SafeImage
                      src={item.image}
                      alt={item.title}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-1.5 left-1.5">
                      <span className="bg-white/90 backdrop-blur-sm text-[#005E60] px-1.5 py-0.5 rounded text-[9px] font-bold shadow-sm uppercase tracking-wide">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Tight padding and spacing */}
                  <div className="p-3 flex-1 flex flex-col">
                    <h3 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-[#005E60] transition-colors line-clamp-2 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-gray-600 mb-2 line-clamp-2 flex-1 leading-snug">
                      {item.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[10px] text-gray-500">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-2.5 h-2.5" /> {item.date}
                      </span>
                      <span className="flex items-center gap-1 text-[#005E60] font-semibold">
                        {item.source}
                        {isExternal && <ArrowUpRight className="w-2.5 h-2.5" />}
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}