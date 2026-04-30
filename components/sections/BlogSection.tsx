'use client';

import { ArrowRight, Calendar, Clock, Bookmark, Share2, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const blogPosts = [
  {
    id: 1,
    title: 'Top 10 Real Estate Trends in 2024',
    excerpt: 'Discover the latest trends shaping the Indian real estate market this year, from sustainable living to smart home integration.',
    category: 'Market Insights',
    date: 'Apr 15, 2024',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80',
    author: 'Rajesh Kumar',
    authorAvatar: 'https://i.pravatar.cc/150?u=rajesh',
    isFeatured: true,
  },
  {
    id: 2,
    title: 'How to Choose the Perfect Home',
    excerpt: 'A comprehensive guide to finding your dream property in Mumbai.',
    category: 'Home Buying',
    date: 'Apr 10, 2024',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1600596542815-27b88e35eabd?w=800&q=80',
    author: 'Priya Sharma',
    authorAvatar: 'https://i.pravatar.cc/150?u=priya',
  },
  {
    id: 3,
    title: 'Investment Opportunities in Navi Mumbai',
    excerpt: 'Why Navi Mumbai is becoming the preferred destination for property investors.',
    category: 'Investment',
    date: 'Apr 5, 2024',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    author: 'Amit Patel',
    authorAvatar: 'https://i.pravatar.cc/150?u=amit',
  },
];

export default function BlogSection() {
  const [savedPosts, setSavedPosts] = useState<number[]>([]);

  const toggleSave = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setSavedPosts(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const featuredPost = blogPosts.find(p => p.isFeatured) || blogPosts[0];
  const regularPosts = blogPosts.filter(p => !p.isFeatured);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* 🎯 Elegant Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-[#8B0000]" />
              <span className="text-[#8B0000] font-semibold text-sm tracking-[0.2em] uppercase">
                Editorial
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Insights & <br />
              <span className="text-[#005E60]">Perspectives</span>
            </h2>
          </div>
          
          <a 
            href="/blog" 
            className="group inline-flex items-center gap-2 text-gray-600 hover:text-[#8B0000] transition-colors"
          >
            <span className="font-medium">View Archive</span>
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* 🌟 Featured Post - Magazine Hero */}
        {featuredPost && (
          <article className="group mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Image */}
              <div className="relative aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-5 left-5">
                  <span className="px-4 py-2 bg-white/95 backdrop-blur text-[#8B0000] text-xs font-bold uppercase tracking-widest rounded-sm">
                    {featuredPost.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="lg:pl-4">
                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-5">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-[#005E60]" />
                    {featuredPost.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} className="text-[#005E60]" />
                    {featuredPost.readTime}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-[#005E60] transition-colors">
                  {featuredPost.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 text-lg leading-relaxed mb-6 line-clamp-3">
                  {featuredPost.excerpt}
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 mb-8">
                  <img 
                    src={featuredPost.authorAvatar} 
                    alt={featuredPost.author}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{featuredPost.author}</p>
                    <p className="text-sm text-gray-500">Senior Analyst</p>
                  </div>
                </div>

                {/* CTA */}
                <a 
                  href={`/blog/${featuredPost.id}`}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-[#005E60] text-white font-semibold rounded-none hover:bg-[#004a4c] transition-colors"
                >
                  Read Full Story
                  <ArrowRight size={18} />
                </a>
              </div>
            </div>
          </article>
        )}

        {/* 📰 Regular Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularPosts.map((post) => {
            const isSaved = savedPosts.includes(post.id);
            
            return (
              <article 
                key={post.id}
                className="group cursor-pointer"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-4">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Save Button */}
                  <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSave(e, post.id); }}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:shadow transition-all opacity-0 group-hover:opacity-100"
                    aria-label={isSaved ? "Remove from saved" : "Save post"}
                  >
                    <Bookmark 
                      size={16} 
                      className={isSaved ? "text-[#8B0000] fill-[#8B0000]" : "text-gray-400"} 
                    />
                  </button>
                </div>

                {/* Content */}
                <div>
                  {/* Category */}
                  <span className="text-[10px] font-bold text-[#005E60] uppercase tracking-wider mb-2 block">
                    {post.category}
                  </span>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#005E60] transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <img 
                        src={post.authorAvatar} 
                        alt={post.author}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <span className="text-sm text-gray-600">{post.author}</span>
                    </div>
                    <span className="text-xs text-gray-400">{post.readTime}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* 🔗 View All - Minimal */}
        <div className="text-center mt-16">
          <a 
            href="/blog" 
            className="inline-flex items-center gap-2 text-[#005E60] font-semibold border-b-2 border-[#005E60] pb-1 hover:text-[#8B0000] hover:border-[#8B0000] transition-colors"
          >
            Explore All Articles
            <ArrowRight size={16} />
          </a>
        </div>

      </div>
    </section>
  );
}