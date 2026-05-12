// app/page.tsx
'use client';

import React, { memo, useMemo } from 'react';
import Head from 'next/head';
import { useSearchParams } from 'next/navigation'; // ✅ Read URL params
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

// 🧩 Section Imports
import Hero from '../components/Home/Hero';
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

// 📦 Your Project Data
import projectsData from '../data/properties.json';
import type { Property } from '../types';

// 🗺️ Location Configuration
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
    // Projects of interest for Pune
    featuredSlugs: ['mantra-codename-paradise', 'mantra-one-residency', 'lodha-mundhwa', 'shapoorji-tree-cloud'],
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
    // Projects of interest for Mumbai
    featuredSlugs: ['sai-world-empire', 'sai-world-one', 'today-kharghar', 'today-nova-vista-nerul'],
  },
} as const;

type CitySlug = keyof typeof LOCATION_CONFIG;

// 🔍 Filter helpers
const filterByCity = (projects: Property[], city: CitySlug) => {
  const cityMap: Record<CitySlug, string[]> = {
    pune: ['pune'],
    mumbai: ['mumbai'], // Your data uses 'mumbai' for Navi Mumbai projects
  };
  return projects.filter(p => cityMap[city].includes(p.location.toLowerCase()));
};

const getNewlyLaunched = (projects: Property[]) => 
  projects.filter(p => {
    const year = parseInt(p.possessionDate?.split(' ')[1] || '2030');
    return year >= 2026;
  }).slice(0, 6);

const getTopSelling = (projects: Property[]) => {
  const premiumBuilders = ['Lodha Group', 'Shapoorji Pallonji', 'Panchshil Realty', 'Tribeca Developers', 'Paradise Group', 'Today Global'];
  return projects
    .filter(p => 
      premiumBuilders.includes(p.developer.name) || 
      p.priceDetails.range.includes('1.5 Cr') ||
      p.priceDetails.range.includes('2 Cr') ||
      p.priceDetails.range.includes('3 Cr')
    )
    .slice(0, 6);
};

const getFeaturedProjects = (projects: Property[], city: CitySlug) => {
  const config = LOCATION_CONFIG[city];
  const featured = projects.filter(p => config.featuredSlugs.includes(p.slug));
  const remaining = projects
    .filter(p => !config.featuredSlugs.includes(p.slug))
    .slice(0, Math.max(0, 4 - featured.length));
  
  return [...featured, ...remaining].slice(0, 4);
};

const getUniqueBuilders = (projects: Property[]) => {
  const builders = new Map<string, { name: string; projects: number; image: string }>();
  projects.forEach(p => {
    if (!builders.has(p.developer.name)) {
      builders.set(p.developer.name, {
        name: p.developer.name,
        projects: p.developer.projectsCount,
        image: `/builders/${p.developer.name.toLowerCase().replace(/\s+/g, '-')}.jpg`
      });
    }
  });
  return Array.from(builders.values()).slice(0, 8);
};

// 🎯 Dynamic SEO Component
const HomePageSEO = memo(({ city }: { city: CitySlug }) => {
  const config = LOCATION_CONFIG[city];
  
  return (
    <Head>
      <title>{config.metaTitle}</title>
      <meta name="description" content={config.metaDescription} />
      <meta name="keywords" content={config.metaKeywords} />
      <meta name="author" content="Associatte PropTech Pvt Ltd" />
      <meta name="robots" content="index, follow" />
      
      {/* Open Graph */}
      <meta property="og:title" content={config.metaTitle} />
      <meta property="og:description" content={config.metaDescription} />
      <meta property="og:image" content="https://propfinder.in/og-image.jpg" />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:url" content={`https://propfinder.in?city=${city}`} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={config.metaTitle} />
      <meta name="twitter:description" content={config.metaDescription} />
      
      {/* Canonical */}
      <link rel="canonical" href={`https://propfinder.in?city=${city}`} />
      
      {/* Structured Data - Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            "name": "Associatte PropTech Pvt Ltd",
            "url": "https://propfinder.in",
            "logo": "https://propfinder.in/logo.png",
            "description": config.metaDescription,
            "address": { "@type": "PostalAddress", "addressCountry": "IN", "addressRegion": "Maharashtra" },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91-8743563546",
              "contactType": "customer service",
              "areaServed": "IN"
            }
          })
        }}
      />
    </Head>
  );
});
HomePageSEO.displayName = 'HomePageSEO';

// 🏠 Main HomePage Component
const HomePage = memo(() => {
  const searchParams = useSearchParams(); // ✅ Read ?city= param
  const cityParam = (searchParams?.get('city') || 'pune') as CitySlug;
  const city: CitySlug = LOCATION_CONFIG[cityParam] ? cityParam : 'pune';
  const config = LOCATION_CONFIG[city];
  
  // ✅ Redux (if needed)
  const carouselData = useSelector((state: RootState) => state.carousel);
  
  // 🎯 Process data with useMemo (re-compute only when city changes)
  const {
    cityProjects,
    newlyLaunched,
    topSelling,
    featured,
    builders,
    stats
  } = useMemo(() => {
    const filtered = filterByCity(projectsData, city);
    
    return {
      cityProjects: filtered,
      newlyLaunched: getNewlyLaunched(filtered),
      topSelling: getTopSelling(filtered),
      featured: getFeaturedProjects(filtered, city),
      builders: getUniqueBuilders(filtered),
      stats: {
        total: filtered.length,
        minPrice: filtered.length ? Math.min(...filtered.map(p => 
          parseFloat(p.priceDetails.range.split(' - ')[0].replace(/[^\d.]/g, ''))
        )) : 75,
        builders: new Set(filtered.map(p => p.developer.name)).size,
        localities: new Set(filtered.map(p => p.fullLocation.area)).size,
      }
    };
  }, [city]); // ✅ Re-compute only when city changes

  return (
    <>
      {/* ✅ Dynamic SEO Metadata */}
      <HomePageSEO city={city} />
      
      <main className="min-h-screen bg-slate-50">
        
        {/* 🌟 Hero Section - Dynamic Content */}
        <Hero 
          initialCity={config.name}
          cityConfig={config}
          stats={stats}
          onSearch={(params) => {
            // Update URL with filters
            const queryParams = new URLSearchParams(window.location.search);
            queryParams.set('city', city);
            if (params.query) queryParams.set('q', params.query);
            if (params.filters?.bhk?.length) queryParams.set('bhk', params.filters.bhk.join(','));
            window.history.replaceState({}, '', `?${queryParams.toString()}`);
          }}
        />
        
        {/* 🚀 Newly Launched - Location Specific */}
        <section className="py-12 md:py-16" aria-labelledby="newly-launched-heading">
          <NewlyLaunchedProjects 
            projects={newlyLaunched}
            city={config.name}
            onViewMore={() => console.log('View newly launched in', config.name)}
          />
        </section>
        
        {/* 🔥 Top Selling - Location Specific */}
        <section className="py-12 md:py-16 bg-white" aria-labelledby="top-selling-heading">
          <TopSellingProjects 
            projects={topSelling}
            city={config.name}
            onViewMore={() => console.log('View top selling in', config.name)}
          />
        </section>
        
        {/* 🏢 Trusted Developers - Location Specific */}
        <section className="py-12 md:py-16" aria-labelledby="developers-heading">
          <TopDevelopersCarousel 
            builders={builders.filter(b => 
              cityProjects.some(p => p.developer.name === b.name)
            )}
            city={config.name}
            onViewAll={() => console.log('View all builders in', config.name)}
          />
        </section>
        
        {/* ✅ Trust Signals */}
        <section className="py-12 md:py-16 bg-white" aria-labelledby="trust-heading">
          <TrustFeaturesSection city={config.name} />
        </section>
        
        {/* 🔍 Property Discovery - Location Specific */}
        <section className="py-12 md:py-16" aria-labelledby="types-heading">
          <PropertyTypesSection 
            city={config.name}
            types={[
              { id: '2bhk', label: '2 BHK', count: cityProjects.filter(p => p.priceDetails.configurations.some(c => c.type.includes('2 BHK'))).length },
              { id: '3bhk', label: '3 BHK', count: cityProjects.filter(p => p.priceDetails.configurations.some(c => c.type.includes('3 BHK'))).length },
              { id: 'ready', label: 'Ready to Move', count: cityProjects.filter(p => p.possessionDate.toLowerCase().includes('ready')).length },
              { id: 'under', label: 'Under Construction', count: cityProjects.filter(p => !p.possessionDate.toLowerCase().includes('ready')).length }
            ]}
          />
        </section>
        
        <section className="py-12 md:py-16 bg-white" aria-labelledby="categories-heading">
          <CategorySection 
            city={config.name}
            categories={[
              { id: config.slug, label: config.name, projects: cityProjects.length },
              { id: 'localities', label: 'Localities', projects: stats.localities },
              { id: 'builders', label: 'Builders', projects: stats.builders },
            ]}
            featuredLocalities={config.featuredLocalities}
          />
        </section>
        
        {/* 💼 Services */}
        <section className="py-12 md:py-16" aria-labelledby="services-heading">
          <ServicesSection city={config.name} />
        </section>
        
        {/* 🏆 Featured Projects - Your Interests + Location */}
        <section className="py-12 md:py-16 bg-white" aria-labelledby="featured-heading">
          <FeaturedProjectsSection 
            projects={featured}
            city={config.name}
            onViewMore={() => console.log('View featured in', config.name)}
          />
        </section>
        
        {/* 💬 Social Proof */}
        <section className="py-12 md:py-16" aria-labelledby="testimonials-heading">
          <TestimonialsAchievementsSection city={config.name} />
        </section>
        
        {/* 📈 Investment CTA - Brand Gradient + Location */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-[#005E60] to-[#004a4d]" aria-labelledby="investment-heading">
          <InvestmentCtaSection 
            city={config.name}
            stats={{
              projects: stats.total,
              builders: stats.builders,
              cities: 2,
              satisfied: '500+'
            }}
          />
        </section>
        
        {/* 📝 Lead Capture - Location Specific */}
        <section className="py-12 md:py-16 bg-white" aria-labelledby="contact-heading">
          <CtaFormSection 
            city={config.name}
            title={`Get Personalized Property Recommendations in ${config.name}`}
            subtitle={`Tell us your requirements and our ${config.name} experts will find the perfect match`}
            buttonText="Request Callback"
          />
        </section>
        
        {/* 📰 Blog / Insights - Location Specific */}
        <section className="py-12 md:py-16" aria-labelledby="blog-heading">
          <BlogSection 
            city={config.name}
            posts={config.slug === 'pune' ? [
              {
                title: "Why Wakad is the Next Hotspot for Property Investment",
                excerpt: "With IT park expansion and metro connectivity, Wakad offers excellent growth potential...",
                image: "/blog/wakad-investment.jpg",
                date: "May 2024",
                slug: "wakad-investment-guide",
                city: 'pune'
              },
              {
                title: "Mantra Codename Paradise: Complete Review",
                excerpt: "Everything you need to know about Mantra's new project in Sus, Pune...",
                image: "/blog/mantra-codename-review.jpg",
                date: "Apr 2024",
                slug: "mantra-codename-paradise-review",
                city: 'pune'
              }
            ] : [
              {
                title: "Why Kharghar is the Next Hotspot for Property Investment",
                excerpt: "With the upcoming Navi Mumbai Airport and metro connectivity, Kharghar offers excellent growth potential...",
                image: "/blog/kharghar-investment.jpg",
                date: "May 2024",
                slug: "kharghar-investment-guide",
                city: 'mumbai'
              },
              {
                title: "Sai World Empire Kharghar: Complete Review",
                excerpt: "Everything you need to know about Paradise Group's premium project in Kharghar...",
                image: "/blog/sai-world-empire-review.jpg",
                date: "Apr 2024",
                slug: "sai-world-empire-review",
                city: 'mumbai'
              }
            ]}
          />
        </section>
        
      </main>
    </>
  );
});

HomePage.displayName = 'HomePage';

export default HomePage;