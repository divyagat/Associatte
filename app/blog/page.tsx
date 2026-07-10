'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Building2, MapPin, Award, Users, 
  Star
} from 'lucide-react';
import { getAllBlogs, type BlogPost } from '@/lib/blog-data';
import EnquiryPopup from '../../components/common/EnquiryPopup';

// ✅ BULLETPROOF IMAGE COMPONENT
const SafeImage = ({ src, alt, fill, sizes, className, width, height }: any) => {
  const [imgError, setImgError] = useState(false);

  if (!src || typeof src !== 'string' || imgError) {
    return (
      <div className={`bg-gradient-to-br from-[#005E60] to-[#101C2E] flex items-center justify-center ${fill ? 'absolute inset-0' : ''} ${className || ''}`}>
        <Building2 className="text-white/40" size={fill ? 48 : 32} />
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      sizes={sizes}
      width={width}
      height={height}
      className={`${fill ? 'absolute inset-0 w-full h-full' : ''} object-cover ${className || ''}`}
      onError={() => setImgError(true)}
    />
  );
};

// ✅ BULLETPROOF AVATAR COMPONENT
const AuthorAvatar = ({ author }: { author: any }) => {
  const [imgError, setImgError] = useState(false);
  const name = typeof author === 'string' ? author : (author?.name || 'Admin');
  const avatar = typeof author === 'object' && author !== null ? author?.avatar : null;

  if (!avatar || typeof avatar !== 'string' || imgError) {
    return (
      <div className="w-6 h-6 rounded-full bg-[#005E60] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
        {name.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img 
      src={avatar} 
      alt={name} 
      width={24} 
      height={24} 
      className="w-6 h-6 rounded-full object-cover flex-shrink-0"
      onError={() => setImgError(true)}
    />
  );
};

// ✅ MAIN CONTENT - All your existing code
function BlogListingContent() {
  const [allBlogs, setAllBlogs] = useState<BlogPost[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const staticBlogs = getAllBlogs();
    setAllBlogs(staticBlogs);

    fetch('/api/blogs')
      .then((res) => (res.ok ? res.json() : []))
      .then((dbBlogs: any[]) => {
        if (!Array.isArray(dbBlogs)) return;
        const mapped: BlogPost[] = dbBlogs.map((b) => ({
          ...b,
          id: b._id?.toString?.() || b._id || b.slug,
          tags: b.tags || [],
          relatedSlugs: b.relatedSlugs || [],
        }));
        
        const bySlug = new Map<string, BlogPost>();
        staticBlogs.forEach((b) => bySlug.set(b.slug, b));
        mapped.forEach((b) => bySlug.set(b.slug, b));
        setAllBlogs(Array.from(bySlug.values()));
      })
      .catch(() => {});
  }, []);

  const featuredBlogs = allBlogs.slice(0, 2);
  const authorName = (author: any) => typeof author === 'string' ? author : (author?.name || 'Admin');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-[#101C2E] overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F8C21C]/10 rounded-full blur-3xl" />
        <div className="relative container mx-auto px-4 py-16 md:py-20 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[#F8C21C] text-[#8B0000] px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Building2 size={16} />
              <span>Channel Partner Exclusive</span>
            </div>
            <h1 className="page-title text-white mb-4">
              Explore <span className="accent">Premium</span> Real Estate Projects
            </h1>
            <p className="text-lg text-white/90">
              Expert reviews, investment insights, and exclusive offers across Pune, Mumbai & KDMC
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border-b-4 border-[#8B0000]">
            <div className="text-2xl font-bold text-[#8B0000]">{allBlogs.length}+</div>
            <div className="text-sm text-gray-600">Expert Articles</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border-b-4 border-[#005E60]">
            <div className="text-2xl font-bold text-[#005E60]">3</div>
            <div className="text-sm text-gray-600">Prime Locations</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border-b-4 border-[#F8C21C]">
            <div className="text-2xl font-bold text-[#8B0000]">5min</div>
            <div className="text-sm text-gray-600">Avg Read Time</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border-b-4 border-[#8B0000]">
            <div className="text-2xl font-bold text-[#005E60]">1000+</div>
            <div className="text-sm text-gray-600">Happy Readers</div>
          </div>
        </div>

        {/* Featured Articles */}
        {featuredBlogs.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-8">
              <Award size={24} className="text-[#F8C21C]" />
              <h2 className="text-2xl font-bold text-gray-900">Featured Articles</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredBlogs.map((blog) => (
                <Link href={`/blog/${blog.slug}`} key={blog.id} className="group">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="relative h-64 overflow-hidden">
                      <SafeImage src={blog.image} alt={blog.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-[#F8C21C] text-[#8B0000] px-3 py-1 rounded-full text-xs font-semibold">
                            <Star size={12} className="inline mr-1" /> Featured
                          </span>
                          {blog.category && (
                            <span className="bg-[#005E60]/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs">
                              {blog.category}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-white group-hover:text-[#F8C21C] transition-colors">
                          {blog.title}
                        </h3>
                        <div className="flex items-center gap-4 text-white/80 text-sm mt-2">
                          {blog.city && (
                            <div className="flex items-center gap-1">
                              <MapPin size={14} />
                              <span>{blog.city}</span>
                            </div>
                          )}
                          {blog.readTime && <div>{blog.readTime}</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Articles Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">All Articles</h2>
            <div className="text-sm text-gray-500">
              {allBlogs.length} articles
            </div>
          </div>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allBlogs.map((blog) => (
              <Link href={`/blog/${blog.slug}`} key={blog.id} className="group">
                <article className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <SafeImage
                      src={blog.image}
                      alt={blog.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      {blog.category && (
                        <span className="bg-[#8B0000] text-white px-2 py-1 rounded text-xs font-semibold">
                          {blog.category}
                        </span>
                      )}
                    </div>
                    <div className="absolute top-3 right-3">
                      {blog.city && (
                        <span className="bg-[#005E60]/90 backdrop-blur-sm text-white px-2 py-1 rounded text-xs">
                          {blog.city}
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-3 left-3">
                      {blog.readTime && (
                        <span className="bg-[#F8C21C] text-[#8B0000] px-2 py-1 rounded text-xs font-semibold">
                          {blog.readTime}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#8B0000] transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2 text-sm">
                      {blog.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(blog.tags || []).slice(0, 2).map((tag) => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto pt-3 border-t">
                      <div className="flex items-center gap-2">
                        <AuthorAvatar author={blog.author} />
                        <span className="text-xs text-gray-600">{authorName(blog.author)}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {blog.date}
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>

        {/* Channel Partner CTA */}
        <div className="mt-16 bg-gradient-to-r from-[#8B0000] to-[#005E60] rounded-2xl p-8 md:p-12 text-center text-white">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#F8C21C] text-[#8B0000] px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Users size={16} />
              <span>Exclusive Channel Partner</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Get Personalized Property Guidance</h3>
            <p className="text-white/90 mb-6">
              Connect with our experts for project recommendations, price negotiations, and exclusive deals.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button 
                onClick={() => setIsPopupOpen(true)}
                className="bg-[#F8C21C] text-[#8B0000] px-6 py-3 rounded-lg font-semibold hover:bg-[#e6b018] transition-colors"
              >
                Request a Callback
              </button>
              <Link href="/contact-us" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                Contact Expert
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Enquiry Popup */}
      <EnquiryPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        projectName="Premium Real Estate Projects"
        projectTagline="Get expert advice on Pune, Mumbai & KDMC properties"
        theme="gradient"
        showLegalLinks={true}
        formName="Blog Listing Enquiry"
      />
    </div>
  );
}

// ✅ DEFAULT EXPORT - Wraps everything in Suspense
export default function BlogListingClient() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005E60]"></div></div>}>
      <BlogListingContent />
    </Suspense>
  );
}