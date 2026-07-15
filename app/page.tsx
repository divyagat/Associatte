// app/page.tsx
'use client';

import { useState, useCallback, useMemo, useEffect, Suspense } from 'react';
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
import FloatingVideoPlayer from '@/components/FloatingVideoPlayer';

// 🗺️ Location Configuration (FULL DATA PRESERVED)
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

// NOTE: This is a Client Component, so it cannot use the App Router Metadata API
// (generateMetadata) or `next/head` — `next/head` is a no-op in the App Router and
// was silently dropping all of these tags. The page-level title/description/OG tags
// are provided by the static metadata in `app/layout.tsx`. Here we emit valid
// JSON-LD structured data, which Google reads from anywhere in the document and
// which meaningfully improves rich-result eligibility.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.associatte.com';

const HomePageSEO: React.FC<HomePageSEOProps> = ({ city }) => {
  const config = LOCATION_CONFIG[city];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Associatte PropTech Pvt Ltd',
    url: `${SITE_URL}/?city=${config.slug}`,
    description: config.metaDescription,
    areaServed: { '@type': 'City', name: config.name, address: { '@type': 'PostalAddress', addressRegion: 'Maharashtra', addressCountry: 'IN' } },
    priceRange: `${config.priceRange.min} - ${config.priceRange.max}`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

// 🏠 Main HomePage Component
function HomePageContent() {
  const searchParams = useSearchParams();

  const cityParam = (searchParams?.get('city') || 'pune') as CitySlug;
  const city: CitySlug = (Object.keys(LOCATION_CONFIG) as CitySlug[]).includes(cityParam) ? cityParam : 'pune';
  const config = LOCATION_CONFIG[city];

  const [heroFilters, setHeroFilters] = useState<{ city: string; filters: SearchFilters }>({
    city: config.slug,
    filters: {}
  });

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

        {/* Hero Section */}
        <Hero
          initialCity={config.name}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />

        <section aria-labelledby="newly-launched-heading">
          <NewlyLaunchedProjects
            selectedCity={newlyLaunchedProps.selectedCity}
            filters={newlyLaunchedProps.filters}
          />
        </section>

        <section aria-labelledby="top-selling-heading">
          <TopSellingProjects
            city={config.name}
            filters={heroFilters.filters}
            limit={8}
          />
        </section>

        <section aria-labelledby="developers-heading">
          <TopDevelopersCarousel city={config.name} />
        </section>

        {/* ✅ Trust Section - Button opens popup */}
        <section aria-labelledby="trust-heading">
          <TrustFeaturesSection
            city={config.name}
            onConsultationClick={() => setIsPopupOpen(true)}
          />
        </section>

        <section aria-labelledby="types-heading">
          <PropertyTypesSection city={config.name} />
        </section>

        <section aria-labelledby="categories-heading">
          <CategorySection
            city={config.name}
            featuredLocalities={config.featuredLocalities}
          />
        </section>

        <section aria-labelledby="services-heading">
          <ServicesSection city={config.name} />
        </section>

        <section aria-labelledby="featured-heading">
          <FeaturedProjectsSection city={config.name} />
        </section>

        {/* <section aria-labelledby="testimonials-heading">
          <TestimonialsAchievementsSection city={config.name} />
        </section> */}

        {/* ✅ Investment CTA Section - Button opens popup */}
        <section aria-labelledby="investment-heading">
          <InvestmentCtaSection
            city={config.name}
            onConsultationClick={() => setIsPopupOpen(true)}
          />
        </section>

        <section aria-labelledby="contact-heading">
          <CtaFormSection
            city={config.name}
            title={`Get Personalized Property Recommendations in ${config.name}`}
            subtitle={`Tell us your requirements and our ${config.name} experts will find the perfect match. Free consultation, no obligation.`}
            buttonText="Request Free Callback"
            formId={`cta-form-${city}`}
          />
        </section>

        <section aria-labelledby="blog-heading">
          <BlogSection city={config.name} />
        </section>

        <FloatingVideoPlayer
          videoId="U03yryIhSE0"
          title="Mantra 1 Residences Tour"
          position="bottom-right"
        />

        {/* ✅ Enquiry Popup */}
        <EnquiryPopup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          projectName={`Properties in ${config.name}`}
          projectTagline="Get exclusive details & pricing"
          onSubmit={handleEnquirySubmit}
          trackingData={{
            source: 'homepage',
            campaign: 'free_consultation',
            medium: 'website'
          }}
        />

      </main>
    </>
  );
}

// ✅ Wrap in Suspense because HomePageContent uses useSearchParams().
// Without this, the page fails to prerender during `next build`.
export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <HomePageContent />
    </Suspense>
  );
}