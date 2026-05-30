// app/blog/[slug]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Calendar, Clock, Share2, Bookmark, Copy, 
  Eye, Heart, ChevronRight, TrendingUp,
  Mail, MapPin, Building2, User, Tag, 
  CheckCircle, XCircle, PhoneCall, Star
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { getBlogBySlug, getRelatedPosts, getAllBlogs, type BlogPost } from '@/lib/blog-data';
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

  useEffect(() => {
    const blogPost = getBlogBySlug(slug);
    if (!blogPost) {
      router.push('/404');
      return;
    }
    setPost(blogPost);
    setLikesCount(Math.floor(Math.random() * 200) + 50);
    
    // Get related posts
    const related = getRelatedPosts(blogPost.relatedSlugs, 3);
    setRelatedPosts(related);
    
    // Check bookmarks
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setIsBookmarked(bookmarks.includes(slug));
  }, [slug, router]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-[#8B0000]/10 rounded-full flex items-center justify-center">
            <Building2 size={48} className="text-[#8B0000]" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-gray-600 mb-8">Article not found</p>
          <Link href="/blog" className="inline-flex items-center gap-2 bg-[#8B0000] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#6d0000] transition-colors">
            ← Back to Articles
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
      {/* Breadcrumb */}
      <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 py-3 max-w-7xl">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#8B0000] transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href="/blog" className="hover:text-[#8B0000] transition-colors">Articles</Link>
            <ChevronRight size={14} />
            <span className="text-[#8B0000] font-medium line-clamp-1">{post.title}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#8B0000] to-[#005E60] text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F8C21C]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#F8C21C]/10 rounded-full blur-3xl" />
        
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-96 order-2 lg:order-1">
            <div className="sticky top-24 space-y-6">
              {/* Author Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                <img 
                  src={post.author.avatar} 
                  alt={post.author.name}
                  className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                />
                <h3 className="font-bold text-lg text-gray-900">{post.author.name}</h3>
                <p className="text-sm text-[#005E60] mb-2">{post.author.role}</p>
                <p className="text-xs text-gray-500 mb-4">{post.author.bio}</p>
                <button 
                  onClick={() => setIsPopupOpen(true)}
                  className="w-full bg-[#F8C21C] text-[#8B0000] py-2 rounded-lg font-semibold hover:bg-[#e6b018] transition-colors"
                >
                  Connect with {post.author.name.split(' ')[0]}
                </button>
              </div>

              {/* Article Info */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-[#8B0000]" />
                  Article Info
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-gray-600">Published</span>
                    <span className="font-medium text-gray-900">{post.date}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-gray-600">Read Time</span>
                    <span className="font-medium text-[#005E60]">{post.readTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category</span>
                    <span className="font-medium text-[#8B0000]">{post.category}</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <Tag size={18} className="text-[#F8C21C]" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs hover:bg-[#F8C21C] hover:text-[#8B0000] transition-colors cursor-pointer">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Expert */}
              <div className="bg-gradient-to-br from-[#8B0000] to-[#005E60] rounded-xl p-6 text-white text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#F8C21C]/10 rounded-full blur-2xl" />
                <PhoneCall size={40} className="mx-auto mb-3 text-[#F8C21C]" />
                <h4 className="font-bold text-lg mb-2">Get Expert Advice</h4>
                <p className="text-sm text-white/90 mb-4">Need help finding the right property?</p>
                <button 
                  onClick={() => setIsPopupOpen(true)}
                  className="w-full bg-[#F8C21C] text-[#8B0000] py-2.5 rounded-lg font-semibold hover:bg-[#e6b018] transition-colors"
                >
                  Request Callback
                </button>
              </div>
            </div>
          </aside>

          {/* Article Content */}
          <article className="flex-1 order-1 lg:order-2">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Action Bar */}
              <div className="flex flex-wrap justify-between items-center gap-4 p-6 border-b bg-gray-50/50">
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      if (!liked) {
                        setLikesCount(likesCount + 1);
                        setLiked(true);
                      } else {
                        setLikesCount(likesCount - 1);
                        setLiked(false);
                      }
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      liked ? 'bg-red-50 text-red-500' : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
                    <span>{likesCount}</span>
                  </button>
                  
                  <div className="relative">
                    <button 
                      onClick={() => setShowShare(!showShare)}
                      className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Share2 size={18} /> Share
                    </button>
                    
                    {showShare && (
                      <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border p-3 z-30 min-w-[220px]">
                        <p className="text-xs text-gray-500 mb-2 text-center">Share this article</p>
                        <div className="flex gap-3 justify-center mb-3">
                          <button 
                            onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`, '_blank')}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                          >
                            <LinkedInIcon size={20} className="text-gray-600 group-hover:text-[#0077b5]" />
                          </button>
                          <button 
                            onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${window.location.href}`, '_blank')}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                          >
                            <TwitterIcon size={20} className="text-gray-600 group-hover:text-[#1DA1F2]" />
                          </button>
                          <button 
                            onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                          >
                            <FacebookIcon size={20} className="text-gray-600 group-hover:text-[#1877F2]" />
                          </button>
                          <button 
                            onClick={() => window.location.href = `mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(window.location.href)}`}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                          >
                            <Mail size={20} className="text-gray-600 group-hover:text-[#005E60]" />
                          </button>
                        </div>
                        <button 
                          onClick={handleCopyLink}
                          className="flex items-center justify-center gap-2 w-full px-3 py-2 text-sm bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                        >
                          <Copy size={14} />
                          <span>{copied ? 'Copied!' : 'Copy article link'}</span>
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
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      isBookmarked ? 'bg-[#8B0000] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
                    {isBookmarked ? 'Saved' : 'Save'}
                  </button>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} className="text-[#8B0000]" /> 
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} className="text-[#F8C21C]" /> 
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="p-6 md:p-8 prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

              {/* Tags at bottom */}
              <div className="px-6 md:px-8 pb-8">
                <div className="flex flex-wrap gap-2 pt-6 border-t">
                  {post.tags.map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-[#F8C21C] hover:text-[#8B0000] transition-colors cursor-pointer">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Related Articles */}
            {relatedPosts.length > 0 && (
              <div className="mt-12">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <TrendingUp size={24} className="text-[#F8C21C]" />
                    Related Articles You Might Like
                  </h3>
                  <Link href="/blog" className="text-[#8B0000] hover:text-[#6d0000] font-semibold inline-flex items-center gap-1">
                    View All <ChevronRight size={16} />
                  </Link>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedPosts.map(related => (
                    <Link href={`/blog/${related.slug}`} key={related.id} className="group">
                      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="h-40 overflow-hidden">
                          <img src={related.image} alt={related.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-gray-900 mb-1 group-hover:text-[#8B0000] transition-colors line-clamp-2">
                            {related.title}
                          </h4>
                          <p className="text-sm text-gray-500">{related.date}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>
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