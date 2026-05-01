'use client';

import { ArrowRight, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const blogPosts = [
  {
    id: 1,
    title: 'Ready-to-Move-in vs Under-Construction Projects in Navi Mumbai',
    category: 'Navi Mumbai',
    date: 'Apr 2026',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
    author: 'Pushkar Dake',
    overlayText: 'READY-TO-MOVE VS UNDER-CONSTRUCTION HOMES IN NAVI MUMBAI',
  },
  {
    id: 2,
    title: 'Buying Property in Panvel: 2026 Homebuyer Guide',
    category: 'Panvel',
    date: 'Apr 2026',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&q=80',
    author: 'Shruti B',
    overlayText: 'Your Guide to Smart Buying in PANVEL',
  },
  {
    id: 3,
    title: 'Why Families Are Preferring Kamothe: Livability, Education & More',
    category: 'Kamothe',
    date: 'Apr 2026',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80',
    author: 'Charmi Thakker',
    overlayText: 'WHY FAMILIES ARE PREFERRING KAMOTHE',
  },
  {
    id: 4,
    title: 'Investment Opportunities in Kharghar 2026',
    category: 'Kharghar',
    date: 'Apr 2026',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    author: 'Rajesh Kumar',
    overlayText: 'TOP INVESTMENT PICKS IN KHARGHAR',
  },
];

export default function BlogSection() {
  const [scrollPosition, setScrollPosition] = useState(0);

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

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* 🎯 Header with Tabs */}
        <div className="flex items-center gap-8 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#D97941]">
            Recent Articles
          </h2>
          <div className="h-6 w-px bg-gray-300" />
          <span className="text-lg text-gray-700 font-medium">
            Knowledge centre
          </span>
        </div>

        {/* 📰 Carousel Container */}
        <div className="relative">
          {/* Cards Container */}
          <div 
            id="blog-carousel"
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {blogPosts.map((post) => (
              <article 
                key={post.id}
                className="group flex-shrink-0 w-[320px] bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              >
                {/* Image Section with Overlays */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                  
                  {/* Brand Watermark */}
                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] font-bold text-white/90 bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
                      Homebazaar.com
                    </span>
                  </div>
                  
                  {/* Author Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="text-xs font-semibold text-white flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-white rounded-full" />
                      By {post.author}
                    </span>
                  </div>
                  
                  {/* Location Tag */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2">
                    <span className="text-sm font-semibold text-white/90">
                      {post.category}
                    </span>
                  </div>
                  
                  {/* Bottom Overlay Text */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-[10px] font-bold text-white uppercase tracking-wide leading-tight">
                      {post.overlayText}
                    </p>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4">
                  {/* Title */}
                  <h3 className="text-base font-bold text-gray-900 leading-snug mb-2 group-hover:text-[#D97941] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  {/* Date */}
                  <p className="text-xs text-gray-500">
                    Last updated on {post.date}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* Navigation Arrows */}
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
        </div>

        {/* View All Link */}
        <div className="text-center mt-8">
          <a 
            href="/blog" 
            className="inline-flex items-center gap-2 text-[#D97941] font-semibold hover:text-[#b86435] transition-colors group"
          >
            View All Articles
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

      </div>
    </section>
  );
}