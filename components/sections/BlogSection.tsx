'use client';

import { ArrowRight, Calendar, Clock, User } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: 'Top 10 Real Estate Trends in 2024',
    excerpt: 'Discover the latest trends shaping the Indian real estate market this year.',
    category: 'Market Insights',
    date: 'Apr 15, 2024',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
    author: 'Rajesh Kumar',
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
  },
];

export default function BlogSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 bg-[#8B0000]/10 text-[#8B0000] text-sm font-semibold uppercase tracking-wider rounded-full mb-3">
              Latest Updates
            </span>
            <h2 className="text-4xl font-bold text-[#8B0000] font-montserrat">
              From Our Blog
            </h2>
          </div>
          
          <a 
            href="/blog" 
            className="hidden md:flex items-center gap-2 text-[#005E60] font-semibold hover:text-[#8B0000] transition-colors group"
          >
            View All Posts
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article 
              key={post.id}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 bg-[#005E60] text-white text-xs font-bold uppercase tracking-wider rounded-full">
                    {post.category}
                  </span>
                </div>
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Meta Info */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-[#005E60]" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-[#005E60]" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#8B0000] transition-colors line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Author & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#005E60] to-[#8B0000] flex items-center justify-center text-white text-xs font-bold">
                      {post.author.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{post.author}</span>
                  </div>
                  <button className="text-[#005E60] font-semibold text-sm hover:text-[#8B0000] transition-colors flex items-center gap-1 group/btn">
                    Read
                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-10 text-center md:hidden">
          <a 
            href="/blog" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#005E60] text-white font-semibold rounded-full hover:bg-[#004a4c] transition-colors"
          >
            View All Posts
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}