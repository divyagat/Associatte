// app/blog/[slug]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Calendar, Clock, Share2, Bookmark, Copy, 
  Heart, ChevronRight, TrendingUp, Mail, MapPin, 
  Building2, Tag, PhoneCall, Star, Check
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { getBlogBySlug, getRelatedPosts, type BlogPost } from '@/lib/blog-data';
import EnquiryPopup from '../../../components/common/EnquiryPopup';

// Custom Social Media Icons
const FacebookIcon = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterIcon = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.337-5.273c1.4-3.035 2.133-6.335 2.133-9.688 0-.148-.003-.295-.01-.442a9.6 9.6 0 002.402-2.498z"/>
  </svg>
);

const LinkedInIcon = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  const shareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const blogPost = getBlogBySlug(slug);
    if (!blogPost) {
      router.push('/404');
      return;
    }
    setPost(blogPost);
    setLikesCount(Math.floor(Math.random() * 200) + 50);
    setRelatedPosts(getRelatedPosts(blogPost.relatedSlugs, 3));
    
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setIsBookmarked(bookmarks.includes(slug));
  }, [slug, router]);

  // Close share dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(event.target as Node)) {
        setShowShare(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-[#8B0000]/5 rounded-2xl flex items-center justify-center border border-[#8B0000]/10">
            <Building2 size={48} className="text-[#8B0000]" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Article Not Found</h1>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">The real estate insight you are looking for might have been moved or doesn't exist.</p>
          <Link href="/blog" className="inline-flex items-center gap-2 bg-[#8B0000] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#6d0000] transition-all duration-300 hover:shadow-lg hover:shadow-[#8B0000]/20">
            <ArrowLeft size={18} /> Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setShowShare(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sleek Sticky Breadcrumb */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200/60">
        <div className="container mx-auto px-4 py-3 max-w-7xl">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#8B0000] transition-colors font-medium">Home</Link>
            <ChevronRight size={14} className="text-gray-400" />
            <Link href="/blog" className="hover:text-[#8B0000] transition-colors font-medium">Insights</Link>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-[#8B0000] font-semibold line-clamp-1">{post.title}</span>
          </div>
        </div>
      </div>

      {/* Cinematic Hero Section */}
      <div className="relative bg-[#101C2E] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#101C2E] via-[#101C2E] to-[#0a0a0a] opacity-90" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#F8C21C]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              <span className="bg-[#F8C21C] text-[#8B0000] px-3 py-1 rounded-full text-sm font-semibold">
                {post.category}
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                {post.city}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              {post.title}
            </h1>
            {post.location && (
              <div className="flex items-center justify-center gap-2 text-white/80">
                <MapPin size={18} />
                <span>{post.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Main Article Content */}
          <article className="flex-1 order-2 lg:order-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              
              {/* Action Bar */}
              <div className="flex flex-wrap justify-between items-center gap-4 p-5 md:p-6 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      setLiked(!liked);
                      setLikesCount(prev => liked ? prev - 1 : prev + 1);
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border ${
                      liked 
                        ? 'bg-red-50 text-red-600 border-red-100' 
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Heart size={18} fill={liked ? 'currentColor' : 'none'} className={liked ? 'animate-pulse' : ''} />
                    <span>{likesCount}</span>
                  </button>
                  
                  <div className="relative" ref={shareRef}>
                    <button 
                      onClick={() => setShowShare(!showShare)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border ${
                        showShare 
                          ? 'bg-[#005E60] text-white border-[#005E60]' 
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Share2 size={18} /> <span className="hidden sm:inline">Share</span>
                    </button>
                    
                    {showShare && (
                      <div className="absolute top-full left-0 mt-3 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-30 min-w-[240px] animate-in fade-in slide-in-from-top-2 duration-200">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 text-center">Share this insight</p>
                        <div className="flex gap-3 justify-center mb-4">
                          <button onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`, '_blank')} className="p-2.5 bg-gray-50 hover:bg-[#0077b5] hover:text-white rounded-lg transition-all duration-300 text-gray-600"><LinkedInIcon size={18} /></button>
                          <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${window.location.href}`, '_blank')} className="p-2.5 bg-gray-50 hover:bg-[#1DA1F2] hover:text-white rounded-lg transition-all duration-300 text-gray-600"><TwitterIcon size={18} /></button>
                          <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')} className="p-2.5 bg-gray-50 hover:bg-[#1877F2] hover:text-white rounded-lg transition-all duration-300 text-gray-600"><FacebookIcon size={18} /></button>
                          <button onClick={() => window.location.href = `mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(window.location.href)}`} className="p-2.5 bg-gray-50 hover:bg-[#005E60] hover:text-white rounded-lg transition-all duration-300 text-gray-600"><Mail size={18} /></button>
                        </div>
                        <button 
                          onClick={handleCopyLink}
                          className="flex items-center justify-center gap-2 w-full px-3 py-2.5 text-sm font-medium bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 border border-gray-200"
                        >
                          {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                          <span>{copied ? 'Link Copied!' : 'Copy article link'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => {
                      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
                      const newBookmarks = isBookmarked ? bookmarks.filter((b: string) => b !== slug) : [...bookmarks, slug];
                      localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
                      setIsBookmarked(!isBookmarked);
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border ${
                      isBookmarked 
                        ? 'bg-[#8B0000] text-white border-[#8B0000]' 
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
                    <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
                  </button>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                  <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
                    <Calendar size={14} className="text-[#8B0000]" /> 
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
                    <Clock size={14} className="text-[#005E60]" /> 
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>

              {/* Article Body with Enhanced Prose */}
              <div className="p-6 md:p-10 prose prose-lg prose-slate max-w-none 
                prose-headings:font-bold prose-headings:text-gray-900 prose-headings:tracking-tight
                prose-a:text-[#8B0000] prose-a:no-underline hover:prose-a:underline prose-a:font-semibold
                prose-blockquote:border-l-4 prose-blockquote:border-[#F8C21C] prose-blockquote:bg-[#F8C21C]/5 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-gray-700
                prose-img:rounded-xl prose-img:shadow-md
                prose-strong:text-gray-900
                prose-li:marker:text-[#005E60]">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>

              {/* Bottom Tags */}
              <div className="px-6 md:px-10 pb-8">
                <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-100">
                  {post.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-[#F8C21C] hover:text-[#8B0000] transition-all duration-300 cursor-pointer border border-gray-100 hover:border-[#F8C21C]">
                      <Tag size={12} /> #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Related Articles */}
            {relatedPosts.length > 0 && (
              <div className="mt-16">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-[#F8C21C]/10 rounded-lg">
                      <TrendingUp size={24} className="text-[#F8C21C]" />
                    </div>
                    Related Insights
                  </h3>
                  <Link href="/blog" className="text-[#8B0000] hover:text-[#6d0000] font-semibold inline-flex items-center gap-1 group">
                    View All Articles 
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedPosts.map(related => (
                    <Link href={`/blog/${related.slug}`} key={related.id} className="group h-full">
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col overflow-hidden">
                        <div className="aspect-[4/3] overflow-hidden">
                          <img src={related.image} alt={related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                            <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                              <MapPin size={12} className="text-[#005E60]" /> {related.city}
                            </span>
                          </div>
                          <h4 className="font-bold text-gray-900 mb-2 group-hover:text-[#8B0000] transition-colors line-clamp-2 leading-snug">
                            {related.title}
                          </h4>
                          <p className="text-sm text-gray-500 mt-auto pt-3 border-t border-gray-50 flex items-center gap-1.5">
                            <Calendar size={12} /> {related.date}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sticky Sidebar */}
          <aside className="lg:w-96 order-1 lg:order-2">
            <div className="sticky top-24 space-y-6">
              
              {/* Author Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-br from-[#8B0000] to-[#005E60]" />
                <div className="relative z-10">
                  <img 
                    src={post.author.avatar} 
                    alt={post.author.name}
                    className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-4 border-white shadow-md"
                  />
                  <h3 className="font-bold text-lg text-gray-900">{post.author.name}</h3>
                  <p className="text-sm font-medium text-[#005E60] mb-3">{post.author.role}</p>
                  <p className="text-xs text-gray-500 mb-5 leading-relaxed px-2">{post.author.bio}</p>
                  <button 
                    onClick={() => setIsPopupOpen(true)}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#F8C21C] text-[#8B0000] py-3 rounded-xl font-bold hover:bg-[#e6b018] transition-all duration-300 hover:shadow-lg hover:shadow-[#F8C21C]/20"
                  >
                    <Mail size={16} /> Connect with {post.author.name.split(' ')[0]}
                  </button>
                </div>
              </div>

              {/* Article Meta Info */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                  <Clock size={18} className="text-[#8B0000]" />
                  Article Details
                </h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                    <span className="text-gray-500 font-medium">Published</span>
                    <span className="font-semibold text-gray-900">{post.date}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                    <span className="text-gray-500 font-medium">Read Time</span>
                    <span className="font-semibold text-[#005E60]">{post.readTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Category</span>
                    <span className="font-semibold text-[#8B0000] bg-[#8B0000]/5 px-2 py-1 rounded-md">{post.category}</span>
                  </div>
                </div>
              </div>

              {/* Tags Cloud */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                  <Tag size={18} className="text-[#005E60]" />
                  Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span key={tag} className="bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-100 hover:bg-[#005E60] hover:text-white hover:border-[#005E60] transition-all duration-300 cursor-pointer">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Expert CTA */}
              <div className="relative bg-[#0a0a0a] rounded-2xl p-6 text-white text-center overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-[#8B0000] to-[#005E60] opacity-90" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#F8C21C]/20 rounded-full blur-2xl" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 mx-auto mb-4 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                    <PhoneCall size={24} className="text-[#F8C21C]" />
                  </div>
                  <h4 className="font-bold text-xl mb-2">Get Expert Advice</h4>
                  <p className="text-sm text-white/80 mb-6 leading-relaxed">Looking for the perfect property? Let our experts guide you.</p>
                  <button 
                    onClick={() => setIsPopupOpen(true)}
                    className="w-full bg-[#F8C21C] text-[#8B0000] py-3 rounded-xl font-bold hover:bg-[#e6b018] transition-all duration-300 hover:shadow-lg hover:shadow-[#F8C21C]/20 flex items-center justify-center gap-2"
                  >
                    Request a Callback <ArrowLeft size={16} className="rotate-180" />
                  </button>
                </div>
              </div>

            </div>
          </aside>
        </div>
      </div>

      {/* Enquiry Popup */}
      <EnquiryPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        projectName={post.title}
        projectTagline="Get expert advice on this property"
        theme="gradient"
        showLegalLinks={true}
        formName={`Blog Detail: ${post.title}`}
      />
    </div>
  );
}