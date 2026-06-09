'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Calendar, Clock, Share2, Copy, 
  Eye, ChevronRight, Mail, MapPin, Building2, 
  Tag, PhoneCall, Star, Sparkles, MessageCircle, Shield, 
  Award, CheckCircle, ArrowUp, List, ChevronDown, ChevronUp
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import EnquiryPopup from '../../../components/common/EnquiryPopup';
import { getBlogBySlug, getRelatedPosts, getRecentPosts, type BlogPost } from '@/lib/blog-data';

// Social Media Icons
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const LinkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
  </svg>
);

// FAQ Accordion Component
const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-3 transition-all hover:shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-[var(--color-text)] pr-4 text-sm sm:text-base">{question}</span>
        {isOpen ? (
          <ChevronUp size={20} className="text-[var(--color-secondary)] flex-shrink-0" />
        ) : (
          <ChevronDown size={20} className="text-gray-400 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 bg-gray-50 border-t border-gray-100">
          <p className="text-gray-700 leading-relaxed pt-4 text-sm sm:text-base">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadingProgress(progress);
      setShowScrollTop(scrollTop > 500);
      setIsScrolled(scrollTop > 100);

      const headingElements = document.querySelectorAll('article h2[id], article h3[id]');
      let current = '';
      headingElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 150) {
          current = el.id;
        }
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let active = true;

    const applyPost = (blogPost: BlogPost) => {
      if (!active) return;
      setPost(blogPost);
      setLikesCount(Math.floor(Math.random() * 200) + 50);

      if (blogPost.relatedSlugs && blogPost.relatedSlugs.length > 0) {
        setRelatedPosts(getRelatedPosts(blogPost.relatedSlugs, 3));
      }
      setRecentPosts(getRecentPosts(slug, 4));

      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      setIsBookmarked(bookmarks.includes(slug));
    };

    const load = async () => {
      // Static blogs first (instant), then fall back to DB blogs from the admin panel.
      const staticPost = getBlogBySlug(slug);
      if (staticPost) {
        applyPost(staticPost);
        return;
      }

      try {
        const res = await fetch(`/api/blogs/${slug}`);
        if (res.ok) {
          const b = await res.json();
          applyPost({
            ...b,
            id: b._id?.toString?.() || b._id || b.slug,
            tags: b.tags || [],
            relatedSlugs: b.relatedSlugs || [],
          });
          return;
        }
      } catch {
        // ignore and fall through to 404
      }

      if (active) router.push('/404');
    };

    load();
    return () => {
      active = false;
    };
  }, [slug, router]);

  useEffect(() => {
    if (contentRef.current) {
      const headingElements = contentRef.current.querySelectorAll('h2[id], h3[id]');
      const extracted = Array.from(headingElements).map((el) => ({
        id: el.id,
        text: el.textContent || '',
        level: el.tagName === 'H2' ? 2 : 3,
      }));
      setHeadings(extracted);
    }
  }, [post]);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setShowShare(false);
  };

  // ✅ SHARE FUNCTIONS
  const shareToFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(post?.title || 'Check out this article');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
  };

  const shareToLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post?.title || 'Check out this article');
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}`, '_blank', 'width=600,height=400');
  };

  const shareToWhatsApp = () => {   
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${post?.title || 'Check out this article'}\n\n`);
    window.open(`https://wa.me/?text=${text}${url}`, '_blank');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center px-4">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-gold)] rounded-full flex items-center justify-center shadow-2xl">
            <Building2 size={48} className="text-white" />
          </div>
          <h1 className="text-5xl font-bold text-[var(--color-text)] mb-4 tracking-tight">404</h1>
          <p className="text-[var(--color-text-light)] text-lg mb-8">Article not found</p>
          <Link href="/blog" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft size={20} /> Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bgColor)]">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-gray-200/50 z-[60] backdrop-blur-sm">
        <div 
          className="h-full bg-gradient-to-r from-[var(--color-secondary)] via-[#C41E3A] to-[var(--color-gold)] transition-all duration-150 ease-out shadow-[0_0_10px_rgba(248,194,28,0.5)]"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Hero Banner (Image 1) */}
      <section className="relative w-full max-w-7xl mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-8">
        <div className="relative w-full h-[350px] sm:h-[400px] md:h-[450px] lg:h-[480px] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5 group bg-gray-900">
          
          {/* Backward Arrow Button */}
          <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20">
            <Link href="/blog" className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-black/40 backdrop-blur-md text-white rounded-full border border-white/30 hover:bg-black/60 transition-all shadow-lg">
              <ArrowLeft size={18} className="md:w-5 md:h-5" />
            </Link>
          </div>

          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
          
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-10 lg:p-12">
            <div className="max-w-4xl mx-auto md:mx-0 space-y-3 sm:space-y-4 animate-fade-in-up">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-[var(--color-gold)] text-[var(--color-secondary)] px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-lg">
                  <Sparkles size={12} />
                  {post.category}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-white px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium border border-white/20">
                  <Clock size={12} />
                  {post.readTime}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-medium border border-white/20">
                  <Calendar size={12} />
                  {post.date}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-[1.15] tracking-tight drop-shadow-lg">
                {post.title}
              </h1>

              <p className="text-white/90 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed font-light line-clamp-2 md:line-clamp-none drop-shadow-md">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 text-white/90 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Calendar size={14} />
                  <span>{post.date}</span>
                </div>
                {post.courtesy && (
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Building2 size={14} />
                    <span>{post.courtesy}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span>By {post.author.name}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 pt-2">
                <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5">
                  <img 
                    src={post.author.avatar} 
                    alt={post.author.name}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-[var(--color-gold)] object-cover"
                  />
                  <div className="text-left">
                    <p className="font-semibold text-white text-xs sm:text-sm leading-tight">{post.author.name}</p>
                    <p className="text-[10px] sm:text-[11px] text-white/70 leading-tight">{post.author.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-site pb-24 md:pb-16">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="lg:sticky lg:top-28 space-y-6">
              {headings.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/80">
                  <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
                    <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-secondary)] to-[#6d0000] rounded-lg flex items-center justify-center">
                      <List size={14} className="text-white" />
                    </div>
                    <h3 className="font-bold text-[var(--color-text)] text-sm uppercase tracking-wider">Table of Contents</h3>
                  </div>
                  <nav className="space-y-1">
                    {headings.map((heading) => (
                      <button
                        key={heading.id}
                        onClick={() => scrollToSection(heading.id)}
                        className={`block w-full text-left text-sm py-2 px-3 rounded-lg transition-all duration-300 ${
                          heading.level === 3 ? 'pl-6 text-xs' : ''
                        } ${
                          activeSection === heading.id
                            ? 'bg-gradient-to-r from-[var(--color-secondary)]/10 to-transparent text-[var(--color-secondary)] font-semibold border-l-2 border-[var(--color-secondary)]'
                            : 'text-[var(--color-text-light)] hover:text-[var(--color-secondary)] hover:bg-gray-50'
                        }`}
                      >
                        {heading.text}
                      </button>
                    ))}
                  </nav>
                </div>
              )}

              {/* Share Section */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/80">
                <h3 className="font-bold text-[var(--color-text)] text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Share2 size={14} />
                  Share
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={shareToFacebook}
                    className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all duration-300 text-xs font-medium cursor-pointer"
                  >
                    <FacebookIcon /> Facebook
                  </button>
                  <button 
                    onClick={shareToTwitter}
                    className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-black/5 text-black hover:bg-black hover:text-white transition-all duration-300 text-xs font-medium cursor-pointer"
                  >
                    <TwitterIcon /> Twitter
                  </button>
                  <button 
                    onClick={shareToLinkedIn}
                    className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#0077b5]/10 text-[#0077b5] hover:bg-[#0077b5] hover:text-white transition-all duration-300 text-xs font-medium cursor-pointer"
                  >
                    <LinkedInIcon /> LinkedIn
                  </button>
                  <button 
                    onClick={shareToWhatsApp}
                    className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all duration-300 text-xs font-medium cursor-pointer"
                  >
                    <WhatsAppIcon /> WhatsApp
                  </button>
                </div>
                <button 
                  onClick={handleCopyLink}
                  className="mt-3 w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all text-xs font-medium text-gray-700 cursor-pointer"
                >
                  <LinkIcon />
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>

              {/* Recent Posts */}
              {recentPosts.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/80">
                  <h3 className="font-bold text-[var(--color-text)] text-sm uppercase tracking-wider mb-4">Recent Posts</h3>
                  <div className="space-y-4">
                    {recentPosts.map((recentPost) => (
                      <Link 
                        key={recentPost.slug} 
                        href={`/blog/${recentPost.slug}`}
                        className="group flex gap-3"
                      >
                        <img 
                          src={recentPost.image} 
                          alt={recentPost.title}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-secondary)] transition-colors line-clamp-2">
                            {recentPost.title}
                          </h4>
                          <p className="text-xs text-[var(--color-text-light)] mt-1">{recentPost.date}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Article Content */}
          <article className="lg:col-span-6 order-1" ref={contentRef}>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100/80 overflow-hidden">
              <div className="sticky top-3 z-30 bg-white/95 backdrop-blur-xl border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full bg-gray-50 text-gray-700 hover:bg-gray-100 transition-all text-xs sm:text-sm font-medium">
                    <MessageCircle size={14} className="sm:w-4 sm:h-4" />
                    <span>24</span>
                  </button>
                </div>
                
                <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-[var(--color-text-light)]">
                  <div className="flex items-center gap-1 sm:gap-1.5 bg-gray-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span>Reading • {Math.round(readingProgress)}%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 md:p-10 lg:p-12">
                {/* SECONDARY IMAGE (Image 2) */}
                {post.image2 && (
                  <div className="mb-8 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                    <img 
                      src={post.image2} 
                      alt={`${post.title} - Secondary`}
                      className="w-full aspect-video object-cover"
                    />
                  </div>
                )}

                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags */}
                <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <Tag size={16} className="text-[var(--color-secondary)]" />
                    <h4 className="font-bold text-[var(--color-text)] text-sm uppercase tracking-wider">Topics</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link 
                        key={tag} 
                        href={`/blog?tag=${tag}`}
                        className="group bg-gray-50 hover:bg-gradient-to-r hover:from-[var(--color-secondary)] hover:to-[#6d0000] text-[var(--color-text)] hover:text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm transition-all duration-300 font-medium border border-gray-200 hover:border-transparent hover:shadow-lg hover:shadow-red-900/20 hover:-translate-y-0.5"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 md:px-12 py-6 sm:py-8 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-[var(--color-text)]">24</div>
                      <div className="text-[10px] sm:text-xs text-[var(--color-text-light)] uppercase tracking-wider">Comments</div>
                    </div>
                    <div className="w-px h-10 bg-gray-200" />
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-[var(--color-text)]">2.8K</div>
                      <div className="text-[10px] sm:text-xs text-[var(--color-text-light)] uppercase tracking-wider">Views</div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setIsPopupOpen(true)}
                    className="btn-primary w-full sm:w-auto"
                  >
                    <Sparkles size={16} />
                    <span>Get Expert Advice</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Author Bio */}
            <div className="mt-8 relative overflow-hidden bg-gradient-to-br from-white via-white to-[var(--color-gold)]/5 rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--color-secondary)]/5 to-transparent rounded-full blur-3xl" />
              <div className="relative flex flex-col md:flex-row items-start gap-4 sm:gap-6">
                <div className="relative shrink-0">
                  <img 
                    src={post.author.avatar} 
                    alt={post.author.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-lg ring-4 ring-white"
                  />
                  <div className="absolute -bottom-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-[var(--color-gold)] to-[#e6b018] rounded-lg flex items-center justify-center shadow-lg">
                    <Award size={12} className="sm:w-[14px] sm:h-[14px] text-[var(--color-secondary)]" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] sm:text-xs font-bold text-[var(--color-secondary)] uppercase tracking-wider">Written by</span>
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map((i) => <Star key={i} size={10} className="text-[var(--color-gold)] fill-[var(--color-gold)]" />)}
                    </div>
                  </div>
                  <h4 className="font-bold text-xl sm:text-2xl text-[var(--color-text)] mb-1">{post.author.name}</h4>
                  <p className="text-[var(--color-primary)] font-medium text-xs sm:text-sm mb-3">{post.author.role}</p>
                  <p className="text-[var(--color-text-light)] mb-4 leading-relaxed text-sm sm:text-base">{post.author.bio}</p>
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => setIsPopupOpen(true)}
                      className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-all duration-300 hover:shadow-lg"
                    >
                      <Sparkles size={14} /> Connect Now
                    </button>
                    <Link href="/blog" className="btn-outline inline-flex items-center gap-2">
                      View all articles <ArrowLeft size={14} className="rotate-180" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQs Section */}
            {post.faqs && post.faqs.length > 0 && (
              <div className="mt-8 bg-white rounded-3xl shadow-sm border border-gray-100/80 p-4 sm:p-6 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-[var(--color-secondary)] to-[#6d0000] rounded-xl flex items-center justify-center">
                    <MessageCircle size={16} className="sm:w-[18px] sm:h-[18px] text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text)]">FAQs</h2>
                </div>
                <div>
                  {post.faqs.map((faq, index) => (
                    <FAQItem key={index} question={faq.question} answer={faq.answer} />
                  ))}
                </div>
              </div>
            )}

            {/* Read Next Section */}
            {relatedPosts.length > 0 && (
              <div className="mt-8 bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-dark)] to-[#003838] rounded-3xl p-4 sm:p-6 md:p-10 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <ArrowLeft size={18} className="sm:w-5 sm:h-5 text-[var(--color-gold)] rotate-180" />
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Read Next</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {relatedPosts.map((relatedPost) => (
                    <Link 
                      key={relatedPost.slug}
                      href={`/blog/${relatedPost.slug}`}
                      className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-3 sm:p-4 hover:bg-white/20 transition-all duration-300"
                    >
                      <div className="flex gap-3">
                        <img 
                          src={relatedPost.image} 
                          alt={relatedPost.title}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white group-hover:text-[var(--color-gold)] transition-colors line-clamp-2 text-xs sm:text-sm">
                            {relatedPost.title}
                          </h3>
                          <p className="text-white/60 text-[10px] sm:text-xs mt-2">{relatedPost.date}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Right Sidebar */}
          <aside className="lg:col-span-3 order-3">
            <div className="lg:sticky lg:top-28 space-y-6">
              <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100/80">
                <div className="h-24 bg-gradient-to-br from-[var(--color-secondary)] via-[#6d0000] to-[var(--color-primary)] relative"></div>
                <div className="px-4 sm:px-6 pb-6 -mt-12 relative">
                  <img 
                    src={post.author.avatar} 
                    alt={post.author.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl mx-auto mb-4 object-cover border-4 border-white shadow-xl"
                  />
                  <div className="text-center">
                    <h3 className="font-bold text-base sm:text-lg text-[var(--color-text)] mb-1">{post.author.name}</h3>
                    <p className="text-[10px] sm:text-xs text-[var(--color-primary)] font-semibold mb-3">{post.author.role}</p>
                    <p className="text-[11px] sm:text-xs text-[var(--color-text-light)] mb-4 leading-relaxed">{post.author.bio}</p>
                    
                    <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-y border-gray-100">
                      <div>
                        <div className="text-base sm:text-lg font-bold text-[var(--color-text)]">12+</div>
                        <div className="text-[9px] sm:text-[10px] text-[var(--color-text-light)] uppercase tracking-wider">Years</div>
                      </div>
                      <div>
                        <div className="text-base sm:text-lg font-bold text-[var(--color-text)]">500+</div>
                        <div className="text-[9px] sm:text-[10px] text-[var(--color-text-light)] uppercase tracking-wider">Clients</div>
                      </div>
                      <div>
                        <div className="text-base sm:text-lg font-bold text-[var(--color-text)]">4.9</div>
                        <div className="text-[9px] sm:text-[10px] text-[var(--color-text-light)] uppercase tracking-wider">Rating</div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setIsPopupOpen(true)}
                      className="btn-primary w-full"
                    >
                      <Sparkles size={14} /> Connect Now
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden bg-gradient-to-br from-[var(--color-secondary)] via-[#6d0000] to-[#4a0000] rounded-2xl shadow-xl">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--color-gold)]/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[var(--color-gold)]/10 rounded-full blur-2xl" />
                
                <div className="relative p-4 sm:p-6 text-white">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[var(--color-gold)] rounded-2xl flex items-center justify-center mb-4 shadow-lg rotate-3">
                    <PhoneCall size={20} className="sm:w-6 sm:h-6 text-[var(--color-secondary)]" />
                  </div>
                  <h4 className="font-bold text-lg sm:text-xl mb-2">Free Consultation</h4>
                  <p className="text-white/80 text-xs sm:text-sm mb-5 leading-relaxed">Speak with our expert consultants for personalized property guidance.</p>
                  <button 
                    onClick={() => setIsPopupOpen(true)}
                    className="w-full bg-[var(--color-gold)] text-[var(--color-secondary)] py-3 sm:py-3.5 rounded-xl font-bold hover:bg-[#e6b018] transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/30 hover:-translate-y-0.5 flex items-center justify-center gap-2 text-xs sm:text-sm"
                  >
                    Request Callback
                    <ArrowLeft size={14} className="rotate-180" />
                  </button>
                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-[10px] sm:text-xs text-white/70">
                    <CheckCircle size={12} className="text-[var(--color-gold)]" />
                    <span>100% Free • No Obligation</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 sm:p-6 border border-gray-100/80 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-xl flex items-center justify-center shadow-md">
                    <Shield size={16} className="sm:w-[18px] sm:h-[18px] text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--color-text)] text-xs sm:text-sm">Trusted Platform</h4>
                    <p className="text-[10px] sm:text-xs text-[var(--color-text-light)]">Verified by 10,000+ buyers</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[1,2,3,4,5].map((i) => <Star key={i} size={14} className="sm:w-4 sm:h-4 text-[var(--color-gold)] fill-[var(--color-gold)]" />)}
                  <span className="text-xs sm:text-sm font-bold text-[var(--color-text)] ml-1">4.9/5</span>
                </div>
                <p className="text-[10px] sm:text-xs text-[var(--color-text-light)] leading-relaxed">Rated excellent by property buyers across India</p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-20 md:bottom-6 right-4 md:right-6 bg-gradient-to-br from-[var(--color-secondary)] to-[#6d0000] text-white w-11 h-11 md:w-12 md:h-12 rounded-full shadow-2xl hover:shadow-red-900/50 transition-all duration-500 z-50 flex items-center justify-center group ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <ArrowUp size={18} className="group-hover:-translate-y-0.5 transition-transform" />
      </button>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 p-3 z-40">
        <div className="flex gap-2">
          <button 
            onClick={() => setShowShare(!showShare)}
            className="p-3 rounded-xl bg-gray-100 text-gray-700"
          >
            <Share2 size={20} />
          </button>
          <button 
            onClick={() => setIsPopupOpen(true)}
            className="btn-primary flex-1"
          >
            <PhoneCall size={16} />
            Get Expert Advice
          </button>
        </div>
      </div>

      <EnquiryPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        projectName={post.title}
        projectTagline="Get expert advice on this property"
        theme="gradient"
        showLegalLinks={true}
        formName={`Blog Detail: ${post.title}`}
      />

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        /* 🌟 PREMIUM BLOCKQUOTE STYLING 🌟 */
        .prose blockquote {
          position: relative;
          background: linear-gradient(135deg, rgba(139, 0, 0, 0.04), rgba(248, 194, 28, 0.04));
          border-left: 4px solid var(--color-secondary);
          border-radius: 1rem;
          padding: 2rem 2rem 2rem 3rem;
          margin: 2.5rem 0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          border-top: none;
          border-right: none;
          border-bottom: none;
        }

        .prose blockquote::before {
          content: '"';
          position: absolute;
          top: -15px;
          left: 20px;
          font-size: 6rem;
          font-family: Georgia, serif;
          color: rgba(139, 0, 0, 0.15);
          line-height: 1;
          pointer-events: none;
        }

        .prose blockquote p {
          font-size: 1.125rem !important;
          line-height: 1.75 !important;
          color: var(--color-text) !important;
          font-weight: 500 !important;
          margin: 0 !important;
          font-style: normal !important;
        }

        .prose blockquote cite {
          display: block;
          margin-top: 1.25rem !important;
          font-size: 0.8rem !important;
          font-weight: 700 !important;
          color: var(--color-secondary) !important;
          font-style: normal !important;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          opacity: 0.9;
        }

        .prose blockquote cite::before {
          content: '— ';
        }

        /* Mobile adjustments for blockquote */
        @media (max-width: 640px) {
          .prose blockquote {
            padding: 1.5rem 1.5rem 1.5rem 2.5rem;
            margin: 2rem 0;
          }
          .prose blockquote::before {
            font-size: 4.5rem;
            top: -10px;
            left: 15px;
          }
          .prose blockquote p {
            font-size: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}