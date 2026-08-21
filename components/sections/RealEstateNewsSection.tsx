'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Newspaper, ArrowRight, ArrowUpRight, CalendarDays } from 'lucide-react';
import Reveal from '@/components/common/Reveal';
import SafeImage from '@/components/common/SafeImage';
import { getNewsByCity, type NewsItem } from '@/lib/news-data';

interface RealEstateNewsSectionProps {
  city: 'Pune' | 'Mumbai' | 'KDMC';
}

function forCity(list: NewsItem[], city: string): NewsItem[] {
  return list.filter((n) => n.city === city || n.city === 'National').slice(0, 3);
}

export default function RealEstateNewsSection({ city }: RealEstateNewsSectionProps) {
  // Static defaults render instantly (SSR); the admin-managed list from
  // /api/news swaps in once it loads.
  const [items, setItems] = useState<NewsItem[]>(() => getNewsByCity(city, 3));

  useEffect(() => {
    let cancelled = false;
    fetch('/api/news')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setItems(forCity(data, city));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [city]);

  if (items.length === 0) return null;

  return (
    <section className="py-10 md:py-14 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-3xl mx-auto mb-10 lg:mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#005E60]/10 text-[#005E60] text-sm font-semibold rounded-full mb-4">
            <Newspaper className="w-4 h-4" /> Real Estate News
          </span>
          <h2 className="section-title text-gray-900 mb-4">
            Latest Property News in {city}
          </h2>
          <p className="text-lg text-gray-600">
            Stay ahead with the latest market trends, infrastructure updates and
            policy changes shaping real estate in Pune, Mumbai &amp; KDMC.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, index) => {
            const isExternal = Boolean(item.url);
            const href = item.url ?? '/news';
            return (
              <Reveal key={item.id} delay={index * 100} className="h-full">
                <Link
                  href={href}
                  {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex flex-col h-full bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-[#005E60]/30 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <SafeImage
                      src={item.image}
                      alt={item.title}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 z-10">
                      <span className="text-xs font-semibold text-white bg-[#005E60]/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
                        {item.category}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 z-10">
                      <span className="text-[10px] font-semibold text-[#8B0000] bg-[#F8C21C] px-2 py-1 rounded-full">
                        {item.city === 'National' ? 'India' : item.city}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-base font-bold text-gray-900 leading-snug mb-2 group-hover:text-[#005E60] transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                      {item.excerpt}
                    </p>
                    <div className="mt-auto flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5" /> {item.date}
                      </span>
                      <span className="flex items-center gap-1 text-[#005E60] font-medium">
                        Read {isExternal ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />}
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={200} className="text-center mt-10 lg:mt-12">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#005E60] text-white font-semibold rounded-xl hover:bg-[#004a4d] transition-colors shadow-lg shadow-[#005E60]/20"
          >
            View All News <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
