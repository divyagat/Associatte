// app/blog/[slug]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Calendar, Clock, Share2, Bookmark, Copy, 
  Eye, Heart, ChevronRight, Mail, MapPin, Building2, 
  Tag, PhoneCall, Star, Sparkles, MessageCircle, Shield, 
  Award, CheckCircle, ArrowUp, List
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import EnquiryPopup from '../../../components/common/EnquiryPopup';

// Premium Social Media Icons
const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

interface Author {
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  city: string;
  location: string;
  date: string;
  readTime: string;
  tags: string[];
  author: Author;
  relatedSlugs: string[];
}

const getBlogBySlug = (slug: string): BlogPost | null => {
  return {
    id: '1',
    slug: slug,
    title: '10 Essential Tips for First-Time Home Buyers in 2024',
    excerpt: 'Navigate the complex world of real estate with confidence. Our comprehensive guide covers everything from financial preparation to closing the deal on your dream home.',
    content: `
      <p class="lead">Buying your first home is one of life's most significant milestones — a journey that transforms not just your financial portfolio, but your entire sense of belonging. In today's dynamic real estate market, being well-informed isn't just an advantage; it's a necessity.</p>
      
      <p>The path to homeownership can feel overwhelming, filled with unfamiliar terminology, complex financial calculations, and high-stakes decisions. But with the right preparation and expert guidance, you can navigate this journey with confidence and clarity.</p>

      <h2 id="finances">1. Assess Your Financial Foundation</h2>
      <p>Before you start browsing listings, take a hard look at your financial health. Your credit score, debt-to-income ratio, and savings will determine not just whether you can buy, but what you can afford.</p>
      
      <blockquote>
        <p>"The best investment in real estate begins with investing in your financial literacy. Understand your numbers before you understand the market."</p>
      </blockquote>
      
      <p>Start by pulling your credit reports from all three major bureaus. Look for errors, dispute inaccuracies, and understand the factors affecting your score. A difference of just 50 points can translate to tens of thousands in interest over the life of a mortgage.</p>

      <h3>Key Financial Metrics to Review:</h3>
      <ul>
        <li><strong>Credit Score:</strong> Aim for 740+ for the best mortgage rates</li>
        <li><strong>Debt-to-Income Ratio:</strong> Keep below 43% for conventional loans</li>
        <li><strong>Emergency Fund:</strong> Maintain 3-6 months of expenses separate from down payment</li>
        <li><strong>Down Payment:</strong> While 20% avoids PMI, many programs accept 3-5%</li>
      </ul>

      <!-- ✨ PREMIUM MID-ARTICLE IMAGE ✨ -->
      <figure class="my-10">
        <img 
          src="https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=1200&q=85" 
          alt="Modern home interior representing successful home buying" 
          class="w-full h-[400px] object-cover rounded-2xl shadow-xl border border-gray-100"
        />
        <figcaption class="text-center text-sm text-gray-500 mt-3 italic">
          A thorough financial foundation is the key to unlocking your dream home.
        </figcaption>
      </figure>

      <h2 id="pre-approval">2. Get Pre-Approved, Not Just Pre-Qualified</h2>
      <p>There's a crucial difference between pre-qualification and pre-approval. Pre-qualification is an estimate based on self-reported information. Pre-approval involves a lender verifying your financial documents and committing to a specific loan amount.</p>
      
      <p>In competitive markets, sellers often won't even consider offers without a pre-approval letter. It demonstrates that you're a serious buyer who can actually close the deal.</p>

      <h2 id="neighborhoods">3. Research Beyond the Listing</h2>
      <p>The house you buy is only half the equation — the neighborhood is the other half. Visit areas at different times of day, talk to potential neighbors, and research future development plans that could affect property values.</p>

      <h2 id="agent">4. Choose Your Real Estate Partner Wisely</h2>
      <p>A great real estate agent does far more than open doors. They negotiate on your behalf, identify potential issues, connect you with trusted professionals, and guide you through the emotional rollercoaster of buying a home.</p>

      <h2 id="inspection">5. Never Skip the Inspection</h2>
      <p>A thorough home inspection is your insurance policy against expensive surprises. Beyond the standard inspection, consider specialized inspections for pest damage, radon, sewer lines, and structural integrity, especially in older homes.</p>
    `,
    // HIGH-RESOLUTION IMAGE: w=1600&q=90 ensures it is crystal clear and not blurry
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=90',
    category: 'Buying Tips',
    city: 'Mumbai',
    location: 'Mumbai, Maharashtra',
    date: 'Dec 15, 2024',
    readTime: '6 min read',
    tags: ['homebuying', 'realestate', 'tips', 'mortgage', 'firsttimebuyer', 'investment'],
    author: {
      name: 'Priya Sharma',
      role: 'Senior Real Estate Consultant',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      bio: 'Priya has over 12 years of experience helping families find their perfect homes. She specializes in luxury residential properties and first-time buyer programs across Mumbai and Pune.'
    },
    relatedSlugs: []
  };
};

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
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
    const blogPost = getBlogBySlug(slug);
    if (!blogPost) {
      router.push('/404');
      return;
    }
    setPost(blogPost);
    setLikesCount(Math.floor(Math.random() * 200) + 50);
    
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setIsBookmarked(bookmarks.includes(slug));
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
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#8B0000] to-[#F8C21C] rounded-full flex items-center justify-center shadow-2xl">
            <Building2 size={48} className="text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">404</h1>
          <p className="text-gray-600 text-lg mb-8">Article not found</p>
          <Link href="/blog" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#8B0000] to-[#6d0000] text-white px-8 py-3.5 rounded-full font-semibold hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
            <ArrowLeft size={20} /> Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Premium Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-gray-200/50 z-[60] backdrop-blur-sm">
        <div 
          className="h-full bg-gradient-to-r from-[#8B0000] via-[#C41E3A] to-[#F8C21C] transition-all duration-150 ease-out shadow-[0_0_10px_rgba(248,194,28,0.5)]"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Premium Sticky Header */}
      <header className={`fixed top-[3px] left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100' 
          : 'bg-white/95 backdrop-blur-xl border-b border-gray-100'
      }`}>
        <div className="container mx-auto px-4 md:px-6 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-all duration-300">
                <ArrowLeft size={18} />
              </Link>
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                <Link href="/" className="hover:text-[#8B0000] transition">Home</Link>
                <ChevronRight size={12} />
                <Link href="/blog" className="hover:text-[#8B0000] transition">Blog</Link>
                <ChevronRight size={12} />
                <span className="font-medium text-gray-900 truncate max-w-[250px]">{post.title}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsPopupOpen(true)}
                className="hidden md:flex items-center gap-2 bg-gradient-to-r from-[#8B0000] to-[#6d0000] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-red-900/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                <PhoneCall size={14} />
                <span>Get Expert Advice</span>
              </button>
              <button 
                onClick={() => {
                  const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
                  const newBookmarks = isBookmarked ? bookmarks.filter((b: string) => b !== slug) : [...bookmarks, slug];
                  localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
                  setIsBookmarked(!isBookmarked);
                }}
                className="p-2.5 rounded-full hover:bg-gray-100 text-gray-700 transition-all duration-300"
              >
                <Bookmark size={18} className={isBookmarked ? "fill-[#F8C21C] text-[#F8C21C]" : ""} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ✨ COMPACT PREMIUM HERO BANNER (Restored & Optimized for Clarity) ✨ */}
      <section className="relative w-full max-w-7xl mx-auto px-4 md:px-6 pt-20 md:pt-24 pb-8">
        <div className="relative w-full h-[350px] sm:h-[400px] md:h-[450px] lg:h-[480px] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5 group bg-gray-900">
          
          {/* High-Resolution Background Image - No blurring, crisp rendering */}
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            loading="eager"
          />
          
          {/* Lighter Gradient Overlays: Ensures text is readable while keeping the image bright, vibrant, and clearly visible */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
          
          {/* Content Container */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-12">
            <div className="max-w-4xl mx-auto md:mx-0 space-y-4 animate-fade-in-up">
              
              {/* Category & Meta Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-[#F8C21C] text-[#8B0000] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                  <Sparkles size={12} />
                  {post.category}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-medium border border-white/20">
                  <Clock size={12} />
                  {post.readTime}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-medium border border-white/20">
                  <Calendar size={12} />
                  {post.date}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.15] tracking-tight drop-shadow-lg">
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="text-white/90 text-base md:text-lg max-w-2xl leading-relaxed font-light line-clamp-2 md:line-clamp-none drop-shadow-md">
                {post.excerpt}
              </p>

              {/* Author & Actions Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-2.5">
                  <img 
                    src={post.author.avatar} 
                    alt={post.author.name}
                    className="w-9 h-9 rounded-full border-2 border-[#F8C21C] object-cover"
                  />
                  <div className="text-left">
                    <p className="font-semibold text-white text-sm leading-tight">{post.author.name}</p>
                    <p className="text-[11px] text-white/70 leading-tight">{post.author.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
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
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 text-sm font-medium backdrop-blur-md border ${
                      liked 
                        ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                        : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                    }`}
                  >
                    <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
                    <span>{likesCount}</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
                      const newBookmarks = isBookmarked ? bookmarks.filter((b: string) => b !== slug) : [...bookmarks, slug];
                      localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
                      setIsBookmarked(!isBookmarked);
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 text-sm font-medium backdrop-blur-md border ${
                      isBookmarked
                        ? 'bg-[#F8C21C]/20 text-[#F8C21C] border-[#F8C21C]/30'
                        : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                    }`}
                  >
                    <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
                    <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <div className="container mx-auto px-4 md:px-6 pb-12 md:pb-16 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Sidebar - Table of Contents */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="lg:sticky lg:top-28 space-y-6">
              {headings.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/80">
                  <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#8B0000] to-[#6d0000] rounded-lg flex items-center justify-center">
                      <List size={14} className="text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Contents</h3>
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
                            ? 'bg-gradient-to-r from-[#8B0000]/10 to-transparent text-[#8B0000] font-semibold border-l-2 border-[#8B0000]'
                            : 'text-gray-600 hover:text-[#8B0000] hover:bg-gray-50'
                        }`}
                      >
                        {heading.text}
                      </button>
                    ))}
                  </nav>
                </div>
              )}

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/80">
                <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-4">Share Article</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all duration-300 text-xs font-medium">
                    <FacebookIcon /> Facebook
                  </button>
                  <button className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-black/5 text-black hover:bg-black hover:text-white transition-all duration-300 text-xs font-medium">
                    <TwitterIcon /> Twitter
                  </button>
                  <button className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#0077b5]/10 text-[#0077b5] hover:bg-[#0077b5] hover:text-white transition-all duration-300 text-xs font-medium">
                    <LinkedInIcon /> LinkedIn
                  </button>
                  <button className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all duration-300 text-xs font-medium">
                    <WhatsAppIcon /> WhatsApp
                  </button>
                </div>
                <button 
                  onClick={handleCopyLink}
                  className="mt-3 w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all text-xs font-medium text-gray-700"
                >
                  <Copy size={12} />
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>
          </aside>

          {/* Article Content */}
          <article className="lg:col-span-6 order-1" ref={contentRef}>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100/80 overflow-hidden">
              <div className="sticky top-[67px] z-30 bg-white/95 backdrop-blur-xl border-b border-gray-100 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
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
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium ${
                      liked 
                        ? 'bg-gradient-to-r from-red-50 to-red-100 text-[#8B0000] shadow-sm ring-1 ring-red-200' 
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Heart size={16} fill={liked ? 'currentColor' : 'none'} className={`transition-transform ${liked ? 'scale-110' : ''}`} />
                    <span>{likesCount}</span>
                  </button>
                  
                  <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 text-gray-700 hover:bg-gray-100 transition-all text-sm font-medium">
                    <MessageCircle size={16} />
                    <span>24</span>
                  </button>
                </div>
                
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span>Reading • {Math.round(readingProgress)}%</span>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-10 lg:p-12">
                <div 
                  className="prose prose-lg max-w-none
                    prose-headings:text-gray-900 prose-headings:font-bold prose-headings:tracking-tight
                    prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                    prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b prose-h2:border-gray-100
                    prose-p:text-gray-700 prose-p:leading-[1.85] prose-p:text-[17px] prose-p:mb-6
                    prose-a:text-[#8B0000] prose-a:no-underline prose-a:font-medium hover:prose-a:underline prose-a:border-b prose-a:border-[#8B0000]/30 hover:prose-a:border-[#8B0000]
                    prose-strong:text-[#005E60] prose-strong:font-semibold
                    prose-li:text-gray-700 prose-li:leading-relaxed prose-li:my-2
                    prose-li:marker:text-[#8B0000] prose-li:marker:font-bold
                    prose-img:rounded-2xl prose-img:shadow-lg
                    prose-blockquote:not-italic prose-blockquote:border-0 prose-blockquote:bg-gradient-to-br from-[#8B0000]/5 to-[#F8C21C]/5 prose-blockquote:p-8 prose-blockquote:rounded-2xl prose-blockquote:relative prose-blockquote:my-10
                    before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-gradient-to-b before:from-[#8B0000] before:to-[#F8C21C] before:rounded-full"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                <div className="mt-12 pt-8 border-t border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <Tag size={16} className="text-[#8B0000]" />
                    <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Topics</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link 
                        key={tag} 
                        href={`/blog?tag=${tag}`}
                        className="group bg-gray-50 hover:bg-gradient-to-r hover:from-[#8B0000] hover:to-[#6d0000] text-gray-700 hover:text-white px-4 py-2 rounded-full text-sm transition-all duration-300 font-medium border border-gray-200 hover:border-transparent hover:shadow-lg hover:shadow-red-900/20 hover:-translate-y-0.5"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-white px-6 md:px-12 py-8 border-t border-gray-100">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{likesCount}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Likes</div>
                    </div>
                    <div className="w-px h-10 bg-gray-200" />
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">24</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Comments</div>
                    </div>
                    <div className="w-px h-10 bg-gray-200" />
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">2.8K</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Views</div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setIsPopupOpen(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#8B0000] to-[#6d0000] text-white px-6 py-3 rounded-full font-semibold hover:shadow-xl hover:shadow-red-900/30 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <Sparkles size={16} />
                    <span>Get Expert Advice</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 relative overflow-hidden bg-gradient-to-br from-white via-white to-[#F8C21C]/5 rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#8B0000]/5 to-transparent rounded-full blur-3xl" />
              <div className="relative flex flex-col md:flex-row items-start gap-6">
                <div className="relative shrink-0">
                  <img 
                    src={post.author.avatar} 
                    alt={post.author.name}
                    className="w-24 h-24 rounded-2xl object-cover shadow-lg ring-4 ring-white"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-[#F8C21C] to-[#e6b018] rounded-lg flex items-center justify-center shadow-lg">
                    <Award size={14} className="text-[#8B0000]" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#8B0000] uppercase tracking-wider">Written by</span>
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map((i) => <Star key={i} size={10} className="text-[#F8C21C] fill-[#F8C21C]" />)}
                    </div>
                  </div>
                  <h4 className="font-bold text-2xl text-gray-900 mb-1">{post.author.name}</h4>
                  <p className="text-[#005E60] font-medium text-sm mb-3">{post.author.role}</p>
                  <p className="text-gray-600 mb-4 leading-relaxed">{post.author.bio}</p>
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => setIsPopupOpen(true)}
                      className="inline-flex items-center gap-2 bg-[#005E60] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#004a4d] transition-all duration-300 hover:shadow-lg"
                    >
                      <Sparkles size={14} /> Connect Now
                    </button>
                    <button className="inline-flex items-center gap-2 bg-white text-gray-700 px-5 py-2.5 rounded-full text-sm font-semibold border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-300">
                      View all articles <ArrowLeft size={14} className="rotate-180" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 relative overflow-hidden bg-gradient-to-br from-[#005E60] via-[#004a4d] to-[#003838] rounded-3xl p-8 md:p-12 shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#F8C21C]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#8B0000]/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full mb-4">
                    <Mail size={12} className="text-[#F8C21C]" />
                    <span className="text-xs font-semibold text-white uppercase tracking-wider">Newsletter</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">Stay Ahead in Real Estate</h3>
                  <p className="text-white/80 leading-relaxed">Get weekly insights, market trends, and exclusive property opportunities delivered to your inbox.</p>
                </div>
                <div>
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                    <div className="space-y-3">
                      <input 
                        type="email" 
                        placeholder="Enter your email address"
                        className="w-full px-5 py-3.5 rounded-xl bg-white/95 backdrop-blur-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F8C21C] transition-all text-sm"
                      />
                      <button className="w-full bg-gradient-to-r from-[#F8C21C] to-[#e6b018] text-[#8B0000] py-3.5 rounded-xl font-bold hover:shadow-xl hover:shadow-yellow-500/20 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2">
                        Subscribe Now
                        <ArrowLeft size={16} className="rotate-180" />
                      </button>
                    </div>
                    <p className="text-xs text-white/60 mt-3 text-center">Join 10,000+ property enthusiasts. No spam, unsubscribe anytime.</p>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Right Sidebar */}
          <aside className="lg:col-span-3 order-3">
            <div className="lg:sticky lg:top-28 space-y-6">
              <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100/80">
                <div className="h-24 bg-gradient-to-br from-[#8B0000] via-[#6d0000] to-[#005E60] relative"></div>
                <div className="px-6 pb-6 -mt-12 relative">
                  <img 
                    src={post.author.avatar} 
                    alt={post.author.name}
                    className="w-20 h-20 rounded-2xl mx-auto mb-4 object-cover border-4 border-white shadow-xl"
                  />
                  <div className="text-center">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{post.author.name}</h3>
                    <p className="text-xs text-[#005E60] font-semibold mb-3">{post.author.role}</p>
                    <p className="text-xs text-gray-600 mb-4 leading-relaxed">{post.author.bio}</p>
                    
                    <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-y border-gray-100">
                      <div>
                        <div className="text-lg font-bold text-gray-900">12+</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider">Years</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">500+</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider">Clients</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">4.9</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider">Rating</div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setIsPopupOpen(true)}
                      className="w-full bg-gradient-to-r from-[#8B0000] to-[#6d0000] text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-red-900/30 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm"
                    >
                      <Sparkles size={14} /> Connect Now
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden bg-gradient-to-br from-[#8B0000] via-[#6d0000] to-[#4a0000] rounded-2xl shadow-xl">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#F8C21C]/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#F8C21C]/10 rounded-full blur-2xl" />
                
                <div className="relative p-6 text-white">
                  <div className="w-14 h-14 bg-[#F8C21C] rounded-2xl flex items-center justify-center mb-4 shadow-lg rotate-3">
                    <PhoneCall size={24} className="text-[#8B0000]" />
                  </div>
                  <h4 className="font-bold text-xl mb-2">Free Consultation</h4>
                  <p className="text-white/80 text-sm mb-5 leading-relaxed">Speak with our expert consultants for personalized property guidance.</p>
                  <button 
                    onClick={() => setIsPopupOpen(true)}
                    className="w-full bg-[#F8C21C] text-[#8B0000] py-3.5 rounded-xl font-bold hover:bg-[#e6b018] transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/30 hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm"
                  >
                    Request Callback
                    <ArrowLeft size={14} className="rotate-180" />
                  </button>
                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-white/70">
                    <CheckCircle size={12} className="text-[#F8C21C]" />
                    <span>100% Free • No Obligation</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-100/80 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#005E60] to-[#004a4d] rounded-xl flex items-center justify-center shadow-md">
                    <Shield size={18} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Trusted Platform</h4>
                    <p className="text-xs text-gray-500">Verified by 10,000+ buyers</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[1,2,3,4,5].map((i) => <Star key={i} size={16} className="text-[#F8C21C] fill-[#F8C21C]" />)}
                  <span className="text-sm font-bold text-gray-900 ml-1">4.9/5</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">Rated excellent by property buyers across India</p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 bg-gradient-to-br from-[#8B0000] to-[#6d0000] text-white w-12 h-12 rounded-full shadow-2xl hover:shadow-red-900/50 transition-all duration-500 z-50 flex items-center justify-center group ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <ArrowUp size={18} className="group-hover:-translate-y-0.5 transition-transform" />
      </button>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 p-3 z-40">
        <div className="flex gap-2">
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
            className={`p-3 rounded-xl transition-all ${
              liked ? 'bg-red-50 text-[#8B0000]' : 'bg-gray-100 text-gray-700'
            }`}
          >
            <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
          </button>
          <button 
            onClick={() => setShowShare(!showShare)}
            className="p-3 rounded-xl bg-gray-100 text-gray-700"
          >
            <Share2 size={20} />
          </button>
          <button 
            onClick={() => setIsPopupOpen(true)}
            className="flex-1 bg-gradient-to-r from-[#8B0000] to-[#6d0000] text-white rounded-xl font-semibold flex items-center justify-center gap-2"
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
      `}</style>
    </div>
  );
}