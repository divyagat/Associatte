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
  // Fetches max 3 items for the specific city (automatically includes 'National' per your helper logic)
  const newsItems = getNewsByCity(city, 3);

  if (newsItems.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#101C2E] mb-2">
                Latest in {city === 'KDMC' ? 'Kalyan-Dombivli' : city}
              </h2>
              <p className="text-gray-600 text-sm md:text-base max-w-xl">
                Stay updated with the newest infrastructure developments, policy changes, and market trends.
              </p>
            </div>
            <Link 
              href={`/news?filter=${city}`} 
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#005E60] hover:text-[#005E60]/80 transition-colors"
            >
              View all news <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.map((item, index) => {
            const isExternal = Boolean(item.url);
            const href = item.url ?? `/news/${item.id}`;
            
            return (
              <Reveal key={item.id} delay={index * 100}>
                <Link
                  href={href}
                  {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#005E60]/30 transition-all duration-300 h-full"
                >
                  <div className="relative h-48 overflow-hidden rounded-t-xl bg-gray-100">
                    <SafeImage
                      src={item.image}
                      alt={item.title}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 backdrop-blur-sm text-[#005E60] px-2.5 py-1 rounded text-[11px] font-bold shadow-sm">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-[#005E60] transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1 leading-relaxed">
                      {item.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5" /> {item.date}
                      </span>
                      <span className="flex items-center gap-1 text-[#005E60] font-semibold">
                        {item.source}
                        {isExternal && <ArrowUpRight className="w-3.5 h-3.5" />}
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