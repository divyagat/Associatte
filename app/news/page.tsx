'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Newspaper, CalendarDays, ArrowUpRight, ArrowRight, Building2,
} from 'lucide-react';
import SafeImage from '@/components/common/SafeImage';
import { getAllNews, type NewsItem } from '@/lib/news-data';

type CityFilter = 'All' | 'Pune' | 'Mumbai' | 'KDMC' | 'National';

const FILTERS: { id: CityFilter; label: string }[] = [
  { id: 'All', label: 'All News' },
  { id: 'Pune', label: 'Pune' },
  { id: 'Mumbai', label: 'Mumbai' },
  { id: 'KDMC', label: 'KDMC' },
  { id: 'National', label: 'National' },
];

export default function NewsPage() {
  const [filter, setFilter] = useState<CityFilter>('All');
  // Static defaults render instantly; the admin-managed list from /api/news
  // swaps in once it loads.
  const [allNews, setAllNews] = useState<NewsItem[]>(() => getAllNews());

  useEffect(() => {
    let cancelled = false;
    fetch('/api/news')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setAllNews(data);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const items = useMemo<NewsItem[]>(() => {
    if (filter === 'All') return allNews;
    return allNews.filter((n) => n.city === filter);
  }, [allNews, filter]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <div className="relative bg-[#101C2E] overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F8C21C]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#005E60]/20 rounded-full blur-3xl" />
        <div className="relative container mx-auto px-4 py-16 md:py-20 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[#F8C21C] text-[#8B0000] px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Newspaper size={16} />
              <span>Real Estate News</span>
            </div>
            <h1 className="page-title text-white mb-4">
              Property News &amp; <span className="accent">Market Updates</span>
            </h1>
            <p className="text-lg text-white/90">
              Infrastructure, policy and market trends shaping real estate across
              Pune, Mumbai &amp; KDMC.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* City filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                filter === f.id
                  ? 'bg-[#005E60] text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#005E60]/40 hover:text-[#005E60]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            No news in this category yet. Check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => {
              const isExternal = Boolean(item.url);
              const href = item.url ?? '#';
              return (
                <Link
                  key={item.id}
                  href={href}
                  {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full"
                >
                  <div className="relative h-48 overflow-hidden">
                    <SafeImage
                      src={item.image}
                      alt={item.title}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-[#8B0000] text-white px-2 py-1 rounded text-xs font-semibold">
                        {item.category}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 z-10">
                      <span className="bg-[#005E60]/90 backdrop-blur-sm text-white px-2 py-1 rounded text-xs">
                        {item.city === 'National' ? 'India' : item.city}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#8B0000] transition-colors line-clamp-2">
                      {item.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                      {item.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 text-xs text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5" /> {item.date}
                      </span>
                      <span className="flex items-center gap-1 text-[#005E60] font-medium">
                        {item.source}
                        {isExternal && <ArrowUpRight className="w-3.5 h-3.5" />}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-[#005E60] to-[#8B0000] rounded-2xl p-8 md:p-12 text-center text-white">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Want expert guidance on your next move?
            </h3>
            <p className="text-white/90 mb-6">
              Our advisors turn market trends into the right property decision for you.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact-us"
                className="bg-[#F8C21C] text-[#8B0000] px-6 py-3 rounded-lg font-semibold hover:bg-[#e6b018] transition-colors inline-flex items-center gap-2"
              >
                Talk to an Expert <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/blog"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Read Our Articles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
