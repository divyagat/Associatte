'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
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
import EnquiryPopup from '@/components/common/EnquiryPopup';

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

// 🎯 SEO Component
interface HomePageSEOProps {
  city: CitySlug;
}

const HomePageSEO: React.FC<HomePageSEOProps> = ({ city }) => {
  const config = LOCATION_CONFIG[city];
  const canonicalUrl = `https://propfinder.in?city=${city}`;
  
  return (
    <Head>
      <title>{config.metaTitle}</title>
      <meta name="description" content={config.metaDescription} />
      <meta name="keywords" content={config.metaKeywords} />
      <meta name="author" content="Associatte PropTech Pvt Ltd" />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={config.metaTitle} />
      <meta property="og:description" content={config.metaDescription} />
      <meta property="og:image" content="https://propfinder.in/og-image.jpg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:site_name" content="PropFinder by Associatte" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={config.metaTitle} />
      <meta name="twitter:description" content={config.metaDescription} />
      <meta name="twitter:image" content="https://propfinder.in/og-image.jpg" />
      <meta name="twitter:creator" content="@AssociatteProp" />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="geo.region" content="IN-MH" />
      <meta name="geo.placename" content={config.name} />
      <link rel="alternate" hrefLang="en-in" href={canonicalUrl} />
    </Head>
  );
};

// 🏠 Main HomePage Component
export default function HomePage() {
  const searchParams = useSearchParams();
  
  const cityParam = (searchParams?.get('city') || 'pune') as CitySlug;
  const city: CitySlug = (Object.keys(LOCATION_CONFIG) as CitySlug[]).includes(cityParam) ? cityParam : 'pune';
  const config = LOCATION_CONFIG[city];
  
  const [heroFilters, setHeroFilters] = useState<{ city: string; filters: SearchFilters }>({
    city: config.slug,
    filters: {}
  });

  // ✅ Popup state - controls both buttons
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleFilterChange = useCallback((data: { city: string; filters: SearchFilters }) => {
    setHeroFilters(data);
  }, []);

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
    const newUrl = `?${queryParams.toString()}`;
    if (window.location.search !== newUrl) {
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  const newlyLaunchedProps = useMemo(() => ({
    selectedCity: heroFilters.city as 'pune' | 'mumbai' | 'kdmc',
    filters: heroFilters.filters
  }), [heroFilters.city, heroFilters.filters]);

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

  const handleEnquirySubmit = useCallback((payload: any) => {
    console.log('📩 Enquiry submitted:', payload);
    // TODO: Connect to your backend API here
  }, []);

  return (
    <>
      <HomePageSEO city={city} />
      
      <main className="min-h-screen bg-slate-50">
        
        <Hero 
          initialCity={config.name}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />
        
        <section className="py-12 md:py-16" aria-labelledby="newly-launched-heading">
          <NewlyLaunchedProjects 
            selectedCity={newlyLaunchedProps.selectedCity}
            filters={newlyLaunchedProps.filters}
          />
        </section>
        
        <section className="py-12 md:py-16 bg-white" aria-labelledby="top-selling-heading">
          <TopSellingProjects 
            city={config.name} 
            filters={heroFilters.filters}
            limit={8}
          />
        </section>
        
        <section className="py-12 md:py-16" aria-labelledby="developers-heading">
          <TopDevelopersCarousel city={config.name} />
        </section>
        
        {/* ✅ Trust Section - Button opens popup */}
        <section className="py-12 md:py-16 bg-white" aria-labelledby="trust-heading">
          <TrustFeaturesSection 
            city={config.name} 
            onConsultationClick={() => setIsPopupOpen(true)} 
          />
        </section>
        
        <section className="py-12 md:py-16" aria-labelledby="types-heading">
          <PropertyTypesSection city={config.name} />
        </section>
        
        <section className="py-12 md:py-16 bg-white" aria-labelledby="categories-heading">
          <CategorySection 
            city={config.name}
            featuredLocalities={config.featuredLocalities}
          />
        </section>
        
        <section className="py-12 md:py-16" aria-labelledby="services-heading">
          <ServicesSection city={config.name} />
        </section>
        
        <section className="py-12 md:py-16 bg-white" aria-labelledby="featured-heading">
          <FeaturedProjectsSection city={config.name} />
        </section>
        
        <section className="py-12 md:py-16" aria-labelledby="testimonials-heading">
          <TestimonialsAchievementsSection city={config.name} />
        </section>
        
        {/* ✅ Investment CTA Section - Button opens popup */}
        <section 
          className="py-12 md:py-16 bg-gradient-to-br from-[#005E60] via-[#004a4d] to-[#00383a]" 
          aria-labelledby="investment-heading"
        >
          <InvestmentCtaSection 
            city={config.name} 
            onConsultationClick={() => setIsPopupOpen(true)} 
          />
        </section>
        
        <section className="py-12 md:py-16 bg-white" aria-labelledby="contact-heading">
          <CtaFormSection 
            city={config.name}
            title={`Get Personalized Property Recommendations in ${config.name}`}
            subtitle={`Tell us your requirements and our ${config.name} experts will find the perfect match. Free consultation, no obligation.`}
            buttonText="Request Free Callback"
            formId={`cta-form-${city}`}
          />
        </section>
        
        <section className="py-12 md:py-16" aria-labelledby="blog-heading">
          <BlogSection city={config.name} />
        </section>

        {/* ✅ Enquiry Popup - Renders when isPopupOpen is true */}
        <EnquiryPopup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          projectName={`Properties in ${config.name}`}
          projectTagline="Get exclusive details & pricing"
          onSubmit={handleEnquirySubmit}
          trackingData={{
            source: 'homepage',
            campaign: 'free_consultation',
            medium: 'website',
            city: config.name
          }}
        />
        
      </main>
    </>
  );
}