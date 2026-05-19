'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import Head from 'next/head';
import { useSearchParams, useRouter } from 'next/navigation';

// 🧩 Component Imports
import Hero, { SearchFilters } from '@/components/Home/Hero';
import NewlyLaunchedProjects from '@/components/sections/NewlyLaunchedProjects';
import TopSellingProjects from '@/components/sections/TopSellingProjects';
import TrustFeaturesSection from '@/components/sections/TrustFeaturesSection';
import TopDevelopersCarousel from '@/components/sections/TopDevelopersCarousel';
import PropertyTypesSection from '@/components/sections/PropertyTypesSection';
import CategorySection from '@/components/sections/CategorySection';
import ServicesSection from '@/components/sections/ServicesSection';
import FeaturedProjectsSection from '@/components/sections/FeaturedProjectsSection';
import TestimonialsAchievementsSection from '@/components/sections/TestimonialsAchievementsSection';
import InvestmentCtaSection from '@/components/sections/InvestmentCtaSection';
import CtaFormSection from '@/components/sections/CtaFormSection';
import BlogSection from '@/components/sections/BlogSection';

// 🗺️ Location Configuration - Type-safe with as const
const LOCATION_CONFIG = {
  pune: {
    name: 'Pune' as const,
    slug: 'pune' as const,
    heroTitle: 'Find Your Dream Home in Pune',
    heroSubtitle: 'Explore premium projects in Wakad, Hinjewadi, Baner & Sus',
    metaTitle: 'Properties in Pune | 2, 3 BHK Flats Starting ₹75L | Associatte PropTech',
    metaDescription: 'Find verified 2, 3, 4 BHK properties in Pune. Browse projects in Wakad, Hinjewadi, Sus by Mantra, Lodha & more. RERA registered.',
    metaKeywords: 'properties in Pune, flats in Wakad, 3 BHK Hinjewadi, Mantra Codename Paradise, Sus real estate, Associatte PropTech',
    featuredLocalities: ['Wakad', 'Hinjewadi', 'Baner', 'Sus', 'Kharadi'] as const,
    priceRange: { min: '₹75L', max: '₹4.5Cr' },
  },
  mumbai: {
    name: 'Mumbai' as const,
    slug: 'mumbai' as const,
    heroTitle: 'Find Your Dream Home in Mumbai',
    heroSubtitle: 'Explore premium projects in Kharghar, Panvel, Thane & Navi Mumbai',
    metaTitle: 'Properties in Mumbai | 1, 2, 3 BHK Flats Starting ₹75L | Associatte PropTech',
    metaDescription: 'Find verified 1, 2, 3 BHK properties in Mumbai & Navi Mumbai. Browse projects in Kharghar, Panvel by Paradise Group, Today Global & more. RERA registered.',
    metaKeywords: 'properties in Mumbai, flats in Kharghar, 3 BHK Panvel, Sai World Empire, Navi Mumbai real estate, Associatte PropTech',
    featuredLocalities: ['Kharghar', 'Panvel', 'Thane', 'Andheri', 'Navi Mumbai'] as const,
    priceRange: { min: '₹75L', max: '₹4.5Cr' },
  },
  kdmc: {
    name: 'KDMC' as const,
    slug: 'kdmc' as const,
    heroTitle: 'Find Your Dream Home in Kalyan-Dombivli',
    heroSubtitle: 'Explore affordable & premium projects in Kalyan, Dombivli, Badlapur & Ulhasnagar',
    metaTitle: 'Properties in KDMC | 2, 3 BHK Flats Starting ₹40L | Associatte PropTech',
    metaDescription: 'Find verified 2, 3 BHK properties in Kalyan-Dombivli (KDMC). Browse projects by Paradise Group, Today Global & more. RERA registered, transparent pricing.',
    metaKeywords: 'properties in KDMC, flats in Kalyan, 2 BHK Dombivli, affordable homes Kalyan-Dombivli, Paradise Sai World Empire, Associatte PropTech',
    featuredLocalities: ['Kalyan', 'Dombivli', 'Ulhasnagar', 'Badlapur', 'Ambarnath'] as const,
    priceRange: { min: '₹40L', max: '₹1.5Cr' },
  },
} as const;

// ✅ Derived types from LOCATION_CONFIG
type CitySlug = keyof typeof LOCATION_CONFIG;
type CityName = typeof LOCATION_CONFIG[CitySlug]['name'];

// 🎯 Dynamic SEO Component with full metadata
interface HomePageSEOProps {
  city: CitySlug;
}

const HomePageSEO: React.FC<HomePageSEOProps> = ({ city }) => {
  const config = LOCATION_CONFIG[city];
  const canonicalUrl = `https://propfinder.in?city=${city}`;
  
  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{config.metaTitle}</title>
      <meta name="description" content={config.metaDescription} />
      <meta name="keywords" content={config.metaKeywords} />
      <meta name="author" content="Associatte PropTech Pvt Ltd" />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={config.metaTitle} />
      <meta property="og:description" content={config.metaDescription} />
      <meta property="og:image" content="https://propfinder.in/og-image.jpg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:site_name" content="PropFinder by Associatte" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={config.metaTitle} />
      <meta name="twitter:description" content={config.metaDescription} />
      <meta name="twitter:image" content="https://propfinder.in/og-image.jpg" />
      <meta name="twitter:creator" content="@AssociatteProp" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Additional SEO */}
      <meta name="geo.region" content="IN-MH" />
      <meta name="geo.placename" content={config.name} />
      <link rel="alternate" hrefLang="en-in" href={canonicalUrl} />
    </Head>
  );
};

// 🏠 Main HomePage Component
export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // ✅ Get city from URL params with fallback
  const cityParam = (searchParams?.get('city') || 'pune') as CitySlug;
  const city: CitySlug = Object.keys(LOCATION_CONFIG).includes(cityParam) ? cityParam : 'pune';
  const config = LOCATION_CONFIG[city];
  
  // ✅ State to hold filters from Hero section
  const [heroFilters, setHeroFilters] = useState<{ city: string; filters: SearchFilters }>({
    city: config.slug,
    filters: {}
  });

  // ✅ Callback to receive filter updates from Hero
  const handleFilterChange = useCallback((data: { city: string; filters: SearchFilters }) => {
    setHeroFilters(data);
  }, []);

  // ✅ Update URL when search is performed
  const handleSearch = useCallback((params: { city: string; query?: string; filters?: SearchFilters }) => {
    const queryParams = new URLSearchParams();
    queryParams.set('city', params.city.toLowerCase());
    
    if (params.query?.trim()) {
      queryParams.set('q', params.query.trim());
    }
    
    if (params.filters?.bhk?.length) {
      queryParams.set('bhk', params.filters.bhk.join(','));
    }
    if (params.filters?.priceRange) {
      queryParams.set('minPrice', String(params.filters.priceRange.min));
      if (params.filters.priceRange.max !== Infinity) {
        queryParams.set('maxPrice', String(params.filters.priceRange.max));
      }
    }
    if (params.filters?.builder?.length) {
      queryParams.set('builder', params.filters.builder.join(','));
    }
    if (params.filters?.propertyType?.length) {
      queryParams.set('type', params.filters.propertyType.join(','));
    }
    if (params.filters?.locality) {
      queryParams.set('locality', params.filters.locality);
    }
    
    // Update URL without page reload
    const newUrl = `?${queryParams.toString()}`;
    if (window.location.search !== newUrl) {
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  // ✅ Memoize props for NewlyLaunchedProjects
  const newlyLaunchedProps = useMemo(() => ({
    selectedCity: heroFilters.city as 'pune' | 'mumbai' | 'kdmc',
    filters: heroFilters.filters
  }), [heroFilters.city, heroFilters.filters]);

  // ✅ Track page view for analytics
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_title: `Properties in ${config.name}`,
        page_location: window.location.href,
        page_path: window.location.pathname,
        city: config.name
      });
    }
  }, [city, config.name]);

  return (
    <>
      {/* ✅ Dynamic SEO Metadata */}
      <HomePageSEO city={city} />
      
      <main className="min-h-screen bg-slate-50">
        
        {/* 🌟 Hero Section - ONLY PASS VALID PROPS */}
        <Hero 
          initialCity={config.name}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />
        
        {/* 🚀 Newly Launched Projects */}
        <section className="py-12 md:py-16" aria-labelledby="newly-launched-heading">
          <NewlyLaunchedProjects 
            selectedCity={newlyLaunchedProps.selectedCity}
            filters={newlyLaunchedProps.filters}
          />
        </section>
        
        {/* 🔥 Top Selling Projects - WITH city PROP */}
        <section className="py-12 md:py-16 bg-white" aria-labelledby="top-selling-heading">
          <TopSellingProjects 
            city={config.name} 
            filters={heroFilters.filters}
            limit={8}
          />
        </section>
        
        {/* 🏢 Trusted Developers */}
        <section className="py-12 md:py-16" aria-labelledby="developers-heading">
          <TopDevelopersCarousel city={config.name} />
        </section>
        
        {/* ✅ Trust Signals */}
        <section className="py-12 md:py-16 bg-white" aria-labelledby="trust-heading">
          <TrustFeaturesSection city={config.name} />
        </section>
        
        {/* 🔍 Property Types - WITH city PROP */}
        <section className="py-12 md:py-16" aria-labelledby="types-heading">
          <PropertyTypesSection city={config.name} />
        </section>
        
        {/* 📂 Categories with Featured Localities */}
        <section className="py-12 md:py-16 bg-white" aria-labelledby="categories-heading">
          <CategorySection 
            city={config.name}
            featuredLocalities={config.featuredLocalities}
          />
        </section>
        
        {/* 💼 Services */}
        <section className="py-12 md:py-16" aria-labelledby="services-heading">
          <ServicesSection city={config.name} />
        </section>
        
        {/* 🏆 Featured Projects - WITH city PROP */}
        <section className="py-12 md:py-16 bg-white" aria-labelledby="featured-heading">
          <FeaturedProjectsSection city={config.name} />
        </section>
        
        {/* 💬 Testimonials & Achievements - WITH city PROP */}
        <section className="py-12 md:py-16" aria-labelledby="testimonials-heading">
          <TestimonialsAchievementsSection city={config.name} />
        </section>
        
        {/* 📈 Investment CTA */}
        <section 
          className="py-12 md:py-16 bg-gradient-to-br from-[#005E60] via-[#004a4d] to-[#00383a]" 
          aria-labelledby="investment-heading"
        >
          <InvestmentCtaSection city={config.name} />
        </section>
        
        {/* 📝 Lead Capture Form */}
        <section className="py-12 md:py-16 bg-white" aria-labelledby="contact-heading">
          <CtaFormSection 
            city={config.name}
            title={`Get Personalized Property Recommendations in ${config.name}`}
            subtitle={`Tell us your requirements and our ${config.name} experts will find the perfect match. Free consultation, no obligation.`}
            buttonText="Request Free Callback"
            formId={`cta-form-${city}`}
          />
        </section>
        
        {/* 📰 Blog Section */}
        <section className="py-12 md:py-16" aria-labelledby="blog-heading">
          <BlogSection city={config.name} />
        </section>
        
      </main>
    </>
  );
}