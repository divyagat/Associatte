// components/BlogSection.tsx
'use client';

import { ArrowRight, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getBlogsByCity, type BlogPost } from '@/lib/blog-data';

interface BlogSectionProps {
  city: 'Pune' | 'Mumbai' | 'KDMC';
}

export default function BlogSection({ city }: BlogSectionProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const posts = getBlogsByCity(city);
    setBlogPosts(posts);
  }, [city]);

  const scrollLeft = () => {
    const container = document.getElementById('blog-carousel');
    if (container) {
      container.scrollBy({ left: -340, behavior: 'smooth' });
      setScrollPosition(scrollPosition - 340);
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('blog-carousel');
    if (container) {
      container.scrollBy({ left: 340, behavior: 'smooth' });
      setScrollPosition(scrollPosition + 340);
    }
  };

  if (blogPosts.length === 0) {
    return null;
  }

  return (
    <section className="py-10 md:py-14 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-8 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#D97941]">Recent Articles in {city}</h2>
          <div className="h-6 w-px bg-gray-300" />
          <span className="text-lg text-gray-700 font-medium">Knowledge centre</span>
        </div>

        <div className="relative">
          <div 
            id="blog-carousel" 
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4" 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {blogPosts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.id}>
                <article className="group flex-shrink-0 w-[320px] bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      loading="lazy" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-bold text-white/90 bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
                        Homebazaar.com
                      </span>
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="text-xs font-semibold text-white flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-white rounded-full" /> By {post.author.name}
                      </span>
                    </div>
                    <div className="absolute top-3 left-1/2 -translate-x-1/2">
                      <span className="text-sm font-semibold text-white/90">{post.category}</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-[10px] font-bold text-white uppercase tracking-wide leading-tight">
                        {post.overlayText}
                      </p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-bold text-gray-900 leading-snug mb-2 group-hover:text-[#D97941] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-500">Last updated on {post.date}</p>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {blogPosts.length > 1 && (
            <>
              <button 
                onClick={scrollLeft} 
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10 group" 
                aria-label="Scroll left"
              >
                <ChevronRight size={20} className="text-gray-700 rotate-180 group-hover:text-[#D97941] transition-colors" />
              </button>
              <button 
                onClick={scrollRight} 
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10 group" 
                aria-label="Scroll right"
              >
                <ChevronRight size={20} className="text-gray-700 group-hover:text-[#D97941] transition-colors" />
              </button>
            </>
          )}
        </div>

        <div className="text-center mt-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-[#D97941] font-semibold hover:text-[#b86435] transition-colors group">
            View All Articles <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}