// app/page.tsx
'use client';

import { useState, useCallback, useMemo } from 'react';
import Head from 'next/head';
import { useSearchParams } from 'next/navigation';

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

// 📦 Project Data (if using JSON)
// import projectsData from '@/data/properties.json';

// 🗺️ Location Configuration - UPDATED with KDMC
const LOCATION_CONFIG = {
  pune: {
    name: 'Pune',
    slug: 'pune',
    heroTitle: 'Find Your Dream Home in Pune',
    heroSubtitle: 'Explore premium projects in Wakad, Hinjewadi, Baner & Sus',
    metaTitle: 'Properties in Pune | 2, 3 BHK Flats Starting ₹75L | Associatte PropTech',
    metaDescription: 'Find verified 2, 3, 4 BHK properties in Pune. Browse projects in Wakad, Hinjewadi, Sus by Mantra, Lodha & more. RERA registered.',
    metaKeywords: 'properties in Pune, flats in Wakad, 3 BHK Hinjewadi, Mantra Codename Paradise, Sus real estate, Associatte PropTech',
    featuredLocalities: ['Wakad', 'Hinjewadi', 'Baner', 'Sus', 'Kharadi'],
    priceRange: { min: '₹75L', max: '₹4.5Cr' },
  },
  mumbai: {
    name: 'Mumbai',
    slug: 'mumbai',
    heroTitle: 'Find Your Dream Home in Mumbai',
    heroSubtitle: 'Explore premium projects in Kharghar, Panvel, Thane & Navi Mumbai',
    metaTitle: 'Properties in Mumbai | 1, 2, 3 BHK Flats Starting ₹75L | Associatte PropTech',
    metaDescription: 'Find verified 1, 2, 3 BHK properties in Mumbai & Navi Mumbai. Browse projects in Kharghar, Panvel by Paradise Group, Today Global & more. RERA registered.',
    metaKeywords: 'properties in Mumbai, flats in Kharghar, 3 BHK Panvel, Sai World Empire, Navi Mumbai real estate, Associatte PropTech',
    featuredLocalities: ['Kharghar', 'Panvel', 'Thane', 'Andheri', 'Navi Mumbai'],
    priceRange: { min: '₹75L', max: '₹4.5Cr' },
  },
  // ✅ ADD KDMC HERE:
  kdmc: {
    name: 'KDMC',
    slug: 'kdmc',
    heroTitle: 'Find Your Dream Home in Kalyan-Dombivli',
    heroSubtitle: 'Explore affordable & premium projects in Kalyan, Dombivli, Badlapur & Ulhasnagar',
    metaTitle: 'Properties in KDMC | 2, 3 BHK Flats Starting ₹40L | Associatte PropTech',
    metaDescription: 'Find verified 2, 3 BHK properties in Kalyan-Dombivli (KDMC). Browse projects by Paradise Group, Today Global & more. RERA registered, transparent pricing.',
    metaKeywords: 'properties in KDMC, flats in Kalyan, 2 BHK Dombivli, affordable homes Kalyan-Dombivli, Paradise Sai World Empire, Associatte PropTech',
    featuredLocalities: ['Kalyan', 'Dombivli', 'Ulhasnagar', 'Badlapur', 'Ambarnath'],
    priceRange: { min: '₹40L', max: '₹1.5Cr' },
  },
} as const;

type CitySlug = keyof typeof LOCATION_CONFIG;

// 🎯 Dynamic SEO Component
const HomePageSEO = ({ city }: { city: CitySlug }) => {
  const config = LOCATION_CONFIG[city];
  
  return (
    <Head>
      <title>{config.metaTitle}</title>
      <meta name="description" content={config.metaDescription} />
      <meta name="keywords" content={config.metaKeywords} />
      <meta name="author" content="Associatte PropTech Pvt Ltd" />
      <meta name="robots" content="index, follow" />
      <meta property="og:title" content={config.metaTitle} />
      <meta property="og:description" content={config.metaDescription} />
      <meta property="og:image" content="https://propfinder.in/og-image.jpg" />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:url" content={`https://propfinder.in?city=${city}`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={config.metaTitle} />
      <meta name="twitter:description" content={config.metaDescription} />
      <link rel="canonical" href={`https://propfinder.in?city=${city}`} />
    </Head>
  );
};

// 🏠 Main HomePage Component
export default function HomePage() {
  const searchParams = useSearchParams();
  const cityParam = (searchParams?.get('city') || 'pune') as CitySlug;
  const city: CitySlug = LOCATION_CONFIG[cityParam] ? cityParam : 'pune';
  const config = LOCATION_CONFIG[city];
  
  // ✅ State to hold filters from Hero
  const [heroFilters, setHeroFilters] = useState<{ city: string; filters: SearchFilters }>({
    city: 'pune',
    filters: {}
  });

  // ✅ Callback to receive filter updates from Hero
  const handleFilterChange = useCallback((data: { city: string; filters: SearchFilters }) => {
    setHeroFilters(data);
  }, []);

  // ✅ Memoize props for NewlyLaunchedProjects
  const newlyLaunchedProps = useMemo(() => ({
    selectedCity: heroFilters.city as 'pune' | 'mumbai',
    filters: heroFilters.filters
  }), [heroFilters.city, heroFilters.filters]);

  return (
    <>
      {/* ✅ Dynamic SEO Metadata */}
      <HomePageSEO city={city} />
      
      <main className="min-h-screen bg-slate-50">
        
        {/* 🌟 Hero Section - Passes filter updates via onFilterChange */}
        <Hero 
          initialCity={config.name}
          onFilterChange={handleFilterChange}
          onSearch={(params) => {
            const queryParams = new URLSearchParams(window.location.search);
            queryParams.set('city', params.city.toLowerCase());
            if (params.query) queryParams.set('q', params.query);
            if (params.filters?.bhk?.length) queryParams.set('bhk', params.filters.bhk.join(','));
            window.history.replaceState({}, '', `?${queryParams.toString()}`);
          }}
        />
        
        {/* 🚀 Newly Launched Projects - STANDALONE SECTION with filters */}
        <section className="py-12 md:py-16" aria-labelledby="newly-launched-heading">
          <NewlyLaunchedProjects 
            selectedCity={newlyLaunchedProps.selectedCity}
            filters={newlyLaunchedProps.filters}
          />
        </section>
        
        {/* 🔥 Top Selling Projects */}
        <section className="py-12 md:py-16 bg-white" aria-labelledby="top-selling-heading">
          <TopSellingProjects city={config.name} />
        </section>
        
        {/* 🏢 Trusted Developers */}
        <section className="py-12 md:py-16" aria-labelledby="developers-heading">
          <TopDevelopersCarousel city={config.name} />
        </section>
        
        {/* ✅ Trust Signals */}
        <section className="py-12 md:py-16 bg-white" aria-labelledby="trust-heading">
          <TrustFeaturesSection city={config.name} />
        </section>
        
        {/* 🔍 Property Types */}
        <section className="py-12 md:py-16" aria-labelledby="types-heading">
          <PropertyTypesSection city={config.name} />
        </section>
        
        {/* 📂 Categories */}
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
        
        {/* 🏆 Featured Projects */}
        <section className="py-12 md:py-16 bg-white" aria-labelledby="featured-heading">
          <FeaturedProjectsSection city={config.name} />
        </section>
        
        {/* 💬 Testimonials */}
        <section className="py-12 md:py-16" aria-labelledby="testimonials-heading">
          <TestimonialsAchievementsSection city={config.name} />
        </section>
        
        {/* 📈 Investment CTA */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-[#005E60] to-[#004a4d]" aria-labelledby="investment-heading">
          <InvestmentCtaSection city={config.name} />
        </section>
        
        {/* 📝 Lead Capture */}
        <section className="py-12 md:py-16 bg-white" aria-labelledby="contact-heading">
          <CtaFormSection 
            city={config.name}
            title={`Get Personalized Property Recommendations in ${config.name}`}
            subtitle={`Tell us your requirements and our ${config.name} experts will find the perfect match`}
            buttonText="Request Callback"
          />
        </section>
        
        {/* 📰 Blog */}
        <section className="py-12 md:py-16" aria-labelledby="blog-heading">
          <BlogSection city={config.name} />
        </section>
        
      </main>
    </>
  );
}