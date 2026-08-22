'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Newspaper, CalendarDays, ArrowUpRight, ArrowRight, Building2 } from 'lucide-react';
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
    return allNews.filter((n) => n.city === filter || n.city === 'National');
  }, [allNews, filter]);

  return (
    <main className="min-h-screen bg-white">
      <div className="relative bg-[#101C2E] overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F8C21C]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#005E60]/20 rounded-full blur-3xl" />
        <div className="relative container mx-auto px-4 py-12 md:py-16 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[#F8C21C] text-[#8B0000] px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
              <Newspaper size={14} />
              <span>Real Estate News</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Property News &amp; <span className="text-[#F8C21C]">Market Updates</span>
            </h1>
            <p className="text-sm md:text-base text-white/80">
              Infrastructure, policy and market trends shaping real estate across Pune, Mumbai &amp; KDMC.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filter === f.id
                  ? 'bg-[#005E60] text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-[#005E60]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <Building2 className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="text-sm font-medium">No news in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => {
              const isExternal = Boolean(item.url);
              const href = item.url ?? `/news/${item.id}`;
              return (
                <Link
                  key={item.id}
                  href={href}
                  {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#005E60]/30 transition-all duration-300 h-full"
                >
                  <div className="relative h-36 overflow-hidden rounded-t-xl bg-gray-100">
                    <SafeImage
                      src={item.image}
                      alt={item.title}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="bg-white/90 backdrop-blur-sm text-[#005E60] px-2 py-0.5 rounded text-[10px] font-bold shadow-sm">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h2 className="text-sm font-bold text-gray-900 mb-1.5 group-hover:text-[#005E60] transition-colors line-clamp-2 leading-tight">
                      {item.title}
                    </h2>
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2 flex-1 leading-relaxed">
                      {item.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 text-[11px] text-gray-500">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" /> {item.date}
                      </span>
                      <span className="flex items-center gap-1 text-[#005E60] font-semibold">
                        {item.source}
                        {isExternal && <ArrowUpRight className="w-3 h-3" />}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-12 bg-[#005E60] rounded-xl p-6 md:p-8 text-center text-white">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl md:text-2xl font-bold mb-2">Need expert guidance on your next move?</h3>
            <p className="text-white/80 mb-5 text-sm">Our advisors turn market trends into the right property decision for you.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/contact-us" className="bg-[#F8C21C] text-[#8B0000] px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#e6b018] transition-colors inline-flex items-center gap-2">
                Talk to an Expert <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link href="/blog" className="border border-white/30 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-white/10 transition-colors">
                Read Articles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}