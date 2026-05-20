// client/app/property/[slug]/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';
import properties from '../../../data/properties.json';
import EnquiryPopup from '@/components/common/EnquiryPopup';

// 🎨 Strategic Color Palette (YOUR EXACT COLORS)
const COLORS = {
  primary: '#005E60',
  accent: '#F8C21C',
  alert: '#8B0000',
  bgLight: '#f8fafc',
  textDark: '#1e293b',
  textMuted: '#64748b',
};

// 🔁 Helper: Transform JSON project to match your propertyData structure
function transformProject(project) {
  if (!project) return null;
  
  return {
    title: project.name,
    slug: project.slug,
    rera: !!project.reraNumber,
    priceRange: project.priceDetails?.range || project.price,
    pricePerSqft: project.priceDetails?.perSqft,
    developer: project.developer?.name,
    image: project.image,
    location: {
      area: project.fullLocation?.area || project.location,
      city: project.fullLocation?.city || (project.location === 'pune' ? 'Pune' : project.location === 'mumbai' ? 'Navi Mumbai' : 'Kalyan')
    },
    configurations: project.priceDetails?.configurations?.map(config => ({
      type: config.type,
      details: config.description || `${config.area} carpet area`,
      area: config.area,
      price: config.price
    })) || [],
    floorPlans: project.floorPlans?.map(plan => ({
      type: plan.type,
      area: plan.area
    })) || [],
    about: project.about,
    amenities: (project.amenities || []).map(name => {
      const iconMap = {
        'Children\'s Play Area': 'playground',
        'Kids Play Area': 'playground',
        'Jogging Track': 'jogging',
        'Yoga / Meditation': 'yoga',
        'Yoga Deck': 'yoga',
        'Swimming Pool': 'pool',
        'Infinity Pool': 'pool',
        'Clubhouse': 'playground',
        'Gym': 'jogging',
        '24/7 Security': 'playground',
        'Power Backup': 'playground',
        'Landscaped Gardens': 'playground',
      };
      return { name, icon: iconMap[name] || 'playground' };
    }),
    projectDetails: {
      location: `${project.fullLocation?.area || project.location}, ${project.fullLocation?.city || ''}`,
      possessionDate: project.possessionDate || 'TBA',
      developer: project.developer?.name,
      products: project.priceDetails?.configurations?.map(c => c.type).join(', ') || 'TBA',
      emi: project.emi?.startingFrom || 'TBA',
      downPayment: project.emi?.downPayment || 'TBA',
      interestRate: project.emi?.interestRate || 'TBA',
      tenure: project.emi?.tenure || 'TBA'
    },
    developerInfo: {
      name: project.developer?.name,
      establishmentYear: project.developer?.established,
      listedProjects: project.developer?.projectsCount?.toString(),
      description: project.developer?.description
    },
    reraNumber: project.reraNumber,
    otherProjectsNaviMumbai: properties
      .filter(p => p.slug !== project.slug && p.location === project.location)
      .slice(0, 3)
      .map(p => ({
        title: p.name.length > 20 ? p.name.substring(0, 17) + '...' : p.name,
        location: `${p.fullLocation?.area || p.location}, ${p.fullLocation?.city || ''}`,
        bhk: p.priceDetails?.configurations?.map(c => c.type).join(', ') || 'TBA',
        area: p.priceDetails?.configurations?.[0]?.area || 'TBA',
        price: p.priceDetails?.range?.split(' - ')[0] || p.price
      })),
    otherProjectsTodayGlobal: properties
      .filter(p => p.slug !== project.slug && p.developer?.name === project.developer?.name)
      .slice(0, 3)
      .map(p => ({
        title: p.name.length > 20 ? p.name.substring(0, 17) + '...' : p.name,
        location: `${p.fullLocation?.area || p.location}, ${p.fullLocation?.city || ''}`,
        bhk: p.priceDetails?.configurations?.map(c => c.type).join(', ') || 'TBA',
        area: p.priceDetails?.configurations?.[0]?.area || 'TBA',
        price: p.priceDetails?.range?.split(' - ')[0] || p.price
      }))
  };
}

// Icons (YOUR EXACT ICONS - keep as-is)
const Icons = {
  Location: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Calendar: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Building: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  Home: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Playground: () => <svg className="w-10 h-10 mx-auto mb-2" style={{ color: COLORS.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21h18M5 21v-8l7-5 7 5v8M9 10V7a3 3 0 016 0v3" /></svg>,
  Jogging: () => <svg className="w-10 h-10 mx-auto mb-2" style={{ color: COLORS.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  Yoga: () => <svg className="w-10 h-10 mx-auto mb-2" style={{ color: COLORS.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Pool: () => <svg className="w-10 h-10 mx-auto mb-2" style={{ color: COLORS.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
  Heart: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  ExternalLink: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>,
  ChevronRight: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>,
  Phone: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  MessageCircle: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
};

// 🏠 Property Schema Component (JSON-LD)
function PropertySchema({ property }) {
  if (!property) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": property.title,
    "image": property.image ? [property.image] : [],
    "description": property.about,
    "brand": {
      "@type": "Brand",
      "name": property.developer
    },
    "provider": {
      "@type": "Organization",
      "name": "Associatte PropTech Pvt Ltd",
      "url": "https://propfinder.in",
      "logo": "https://propfinder.in/logo.png"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": property.priceRange?.replace(/[^\d.]/g, '') * 10000000 || 0,
      "availability": property.projectDetails?.possessionDate === 'Ready to Move' 
        ? "https://schema.org/InStock" 
        : "https://schema.org/PreOrder",
      "url": `https://propfinder.in/property/${property.slug}`
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": property.location.area,
      "addressLocality": property.location.city,
      "addressRegion": "Maharashtra",
      "addressCountry": "IN"
    },
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": property.configurations?.[0]?.area?.replace(/[^\d]/g, '') || 0,
      "unitCode": "FTK"
    },
    "numberOfRooms": property.configurations?.[0]?.type?.match(/\d+/)?.[0] || 0,
    "amenityFeature": property.amenities?.map(amenity => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity.name,
      "value": true
    })) || []
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function PropertyPage() {
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [showEmiPopup, setShowEmiPopup] = useState(false);
  const router = useRouter();
  
  const params = useParams();
  const slug = params?.slug;

  useEffect(() => {
    console.log('🔍 PropertyPage - slug from useParams:', slug);
    
    if (!slug) {
      console.error('❌ No slug found in route params');
      setLoading(false);
      return;
    }

    const project = properties.find((p) => p.slug === slug);
    
    if (project) {
      console.log('✅ Found project:', project.name);
      setPropertyData(transformProject(project));
    } else {
      console.error('❌ Project not found for slug:', slug);
      console.log('📋 Available slugs (first 5):', properties.slice(0, 5).map(p => p.slug));
    }
    
    setLoading(false);
  }, [slug, router]);

  const getIcon = (iconName) => {
    const iconMap = { 
      playground: <Icons.Playground />, 
      jogging: <Icons.Jogging />, 
      yoga: <Icons.Yoga />, 
      pool: <Icons.Pool /> 
    };
    return iconMap[iconName] || <Icons.Playground />;
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleEnquirySubmit = async (payload) => {
    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          projectId: propertyData?.slug,
          projectImage: propertyData?.image,
        }),
      });
      
      if (!response.ok) throw new Error('Submission failed');
      console.log('✅ Enquiry submitted for:', propertyData?.title);
    } catch (error) {
      console.error('❌ Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#005E60] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!propertyData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h1>
          <p className="text-gray-600 mb-4">The project you're looking for doesn't exist.</p>
          <Link href="/" className="text-[#005E60] font-medium hover:underline flex items-center justify-center gap-1">
            <Icons.ChevronRight className="rotate-180" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // 🔹 Generate SEO metadata
  const seoTitle = `${propertyData.title} - ${propertyData.configurations?.[0]?.type || ''} in ${propertyData.location.area}, ${propertyData.location.city} | PropFinder`;
  const seoDescription = `${propertyData.title} by ${propertyData.developer}. ${propertyData.configurations?.[0]?.type} starting ₹${propertyData.priceRange}. ${propertyData.about?.substring(0, 150)}...`;
  const canonicalUrl = `https://propfinder.in/property/${propertyData.slug}`;

  return (
    <>
      {/* 🎯 ENHANCED SEO HEAD SECTION */}
      <Head>
        {/* Primary Meta Tags */}
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={`${propertyData.title}, ${propertyData.bhk} BHK ${propertyData.location.area}, ${propertyData.developer}, property in ${propertyData.location.city}, PropFinder, Associatte PropTech`} />
        <meta name="author" content="Associatte PropTech Pvt Ltd" />
        <meta name="robots" content="index, follow" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={propertyData.image || 'https://propfinder.in/og-image.jpg'} />
        <meta property="og:site_name" content="PropFinder" />
        <meta property="og:locale" content="en_IN" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content={seoTitle} />
        <meta property="twitter:description" content={seoDescription} />
        <meta property="twitter:image" content={propertyData.image || 'https://propfinder.in/og-image.jpg'} />
        
        {/* Additional SEO Tags */}
        <meta name="geo.region" content="IN-MH" />
        <meta name="geo.placename" content={`${propertyData.location.area}, ${propertyData.location.city}`} />
        
        {/* Property Schema (JSON-LD) */}
        <PropertySchema property={propertyData} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        
        {/* 🔝 Header Section */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-3">
            {/* ✅ Breadcrumbs for SEO */}
            <nav className="flex items-center text-sm text-gray-500 mb-3" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#F8C21C] transition-colors">Home</Link>
              <Icons.ChevronRight />
              <Link href={`/locations/${propertyData.location.city.toLowerCase()}`} className="hover:text-[#F8C21C] transition-colors capitalize">
                {propertyData.location.city}
              </Link>
              <Icons.ChevronRight />
              <Link href={`/locations/${propertyData.location.city.toLowerCase()}/${propertyData.location.area.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-[#F8C21C] transition-colors">
                {propertyData.location.area}
              </Link>
              <Icons.ChevronRight />
              <span className="text-gray-900 font-medium truncate" aria-current="page">{propertyData.title}</span>
            </nav>
            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{propertyData.title}</h1>
                  {propertyData.rera && (
                    <span className="px-2.5 py-1 text-xs font-semibold bg-[#005E60] text-white rounded-full">RERA Verified</span>
                  )}
                </div>
                <p className="text-gray-600 mt-1">By <span className="font-semibold text-[#005E60]">{propertyData.developer}</span></p>
              </div>
              <div className="text-right">
                <div className="text-2xl lg:text-3xl font-bold" style={{ color: COLORS.alert }}>{propertyData.priceRange}</div>
                <div className="text-sm text-gray-500">{propertyData.pricePerSqft}</div>
              </div>
            </div>
          </div>
        </header>

        {/* 🖼️ Hero Section */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="relative aspect-video bg-gradient-to-br from-[#005E60] to-[#003d40] rounded-2xl overflow-hidden group">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform">
                      <svg className="w-8 h-8 text-[#005E60] ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.841z" />
                      </svg>
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-4 py-2 bg-[#F8C21C] text-[#005E60] font-bold rounded-lg shadow-lg">{propertyData.location.area}</span>
                    <span className="px-3 py-1.5 bg-white/90 text-gray-700 text-sm font-medium rounded-lg">4 Photos • 1 Video</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className={`aspect-square rounded-xl overflow-hidden cursor-pointer transition-all hover:ring-2 hover:ring-[#F8C21C] ${item === 1 ? 'ring-2 ring-[#005E60]' : ''}`}>
                    <div className={`w-full h-full ${item === 1 ? 'bg-gradient-to-br from-[#005E60] to-[#003d40]' : 'bg-gray-200'} flex items-center justify-center`}>
                      {item === 4 && <span className="text-white font-medium text-sm">+12 More</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 📋 Navigation Tabs */}
        <nav className="bg-white border-b border-gray-200 sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
              <button onClick={() => scrollToSection('overview')} className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all bg-[#005E60] text-white shadow-sm`}>Overview</button>
              <button onClick={() => scrollToSection('configurations')} className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all text-gray-600 hover:text-[#005E60] hover:bg-gray-100`}>Configurations</button>
              <button onClick={() => scrollToSection('floor-plans')} className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all text-gray-600 hover:text-[#005E60] hover:bg-gray-100`}>Floor Plans</button>
              <button onClick={() => scrollToSection('amenities')} className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all text-gray-600 hover:text-[#005E60] hover:bg-gray-100`}>Amenities</button>
              <button onClick={() => scrollToSection('location')} className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all text-gray-600 hover:text-[#005E60] hover:bg-gray-100`}>Location</button>
              <button onClick={() => scrollToSection('developer')} className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all text-gray-600 hover:text-[#005E60] hover:bg-gray-100`}>Developer</button>
              <button onClick={() => scrollToSection('brochure')} className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all text-gray-600 hover:text-[#005E60] hover:bg-gray-100`}>Brochure</button>
            </div>
          </div>
        </nav>

        {/* 📦 Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <section id="configurations" className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden scroll-mt-24">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><span className="w-1.5 h-6 bg-[#F8C21C] rounded-full"></span>Available Configurations</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {propertyData.configurations.map((config, index) => (
                    <div key={index} className="p-5 hover:bg-[#005E60]/5 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-[#005E60]/10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ color: COLORS.primary }}><Icons.Home /></div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">{config.type}</h3>
                            <p className="text-sm text-gray-600 mt-0.5">{config.details}</p>
                            <p className="text-sm text-gray-500 mt-1">{config.area}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold" style={{ color: COLORS.alert }}>{config.price}</div>
                          <button className="mt-2 px-4 py-1.5 text-sm font-medium text-[#005E60] border border-[#005E60] rounded-lg hover:bg-[#005E60] hover:text-white transition-colors">View Details</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section id="floor-plans" className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden scroll-mt-24">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><span className="w-1.5 h-6 bg-[#F8C21C] rounded-full"></span>Floor Plans</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {propertyData.floorPlans.map((plan, index) => (
                      <button key={index} className={`p-4 rounded-xl border-2 text-left transition-all ${index === 0 ? 'border-[#F8C21C] bg-[#F8C21C]/10' : 'border-gray-200 hover:border-[#005E60]/50 hover:bg-gray-50'}`}>
                        <div className={`font-semibold ${index === 0 ? 'text-[#005E60]' : 'text-gray-900'}`}>{plan.type}</div>
                        <div className="text-sm text-gray-600">{plan.area}</div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-6 aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                    <button className="px-6 py-3 bg-[#F8C21C] text-[#005E60] font-semibold rounded-xl hover:bg-[#e6b418] transition-colors shadow-lg">Login to Download Floor Plan</button>
                  </div>
                </div>
              </section>

              <section id="overview" className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 scroll-mt-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><span className="w-1.5 h-6 bg-[#F8C21C] rounded-full"></span>About {propertyData.title}</h2>
                <p className="text-gray-700 leading-relaxed">{propertyData.about}</p>
              </section>

              <section id="amenities" className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden scroll-mt-24">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><span className="w-1.5 h-6 bg-[#F8C21C] rounded-full"></span>Premium Amenities</h2>
                </div>
                <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                  {propertyData.amenities.map((amenity, index) => (
                    <div key={index} className="text-center p-4 rounded-xl hover:bg-[#005E60]/5 transition-colors group">
                      <div className="w-14 h-14 mx-auto mb-3 bg-[#005E60]/10 rounded-full flex items-center justify-center group-hover:bg-[#005E60] group-hover:text-white transition-colors" style={{ color: COLORS.primary }}>{getIcon(amenity.icon)}</div>
                      <div className="text-sm font-medium text-gray-800">{amenity.name}</div>
                    </div>
                  ))}
                </div>
              </section>

              <section id="location" className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 scroll-mt-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><span className="w-1.5 h-6 bg-[#F8C21C] rounded-full"></span>Location & Connectivity</h2>
                <div className="aspect-video bg-gray-200 rounded-xl flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#005E60]/10 rounded-full flex items-center justify-center mx-auto mb-3" style={{ color: COLORS.primary }}><Icons.Location /></div>
                    <p className="text-gray-600">Interactive map loading...</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Schools', 'Hospitals', 'Malls', 'Metro', 'Airport'].map((tag) => (
                    <span key={tag} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-[#005E60] hover:text-white transition-colors cursor-pointer">{tag}</span>
                  ))}
                </div>
              </section>

              <section id="developer" className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 scroll-mt-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><span className="w-1.5 h-6 bg-[#F8C21C] rounded-full"></span>About {propertyData.developerInfo.name}</h2>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#005E60] to-[#003d40] rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
                    {propertyData.developerInfo.name?.substring(0, 5).toUpperCase() || 'BUILDER'}
                  </div>
                  <div className="flex-1">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-[#005E60]">{propertyData.developerInfo.establishmentYear}</div>
                        <div className="text-xs text-gray-600">Est. Year</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-[#005E60]">{propertyData.developerInfo.listedProjects}</div>
                        <div className="text-xs text-gray-600">Projects</div>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-4">{propertyData.developerInfo.description}</p>
                    <button className="text-[#005E60] font-semibold text-sm hover:underline">View All Projects →</button>
                  </div>
                </div>
              </section>

              <section id="brochure" className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 scroll-mt-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><span className="w-1.5 h-6 bg-[#F8C21C] rounded-full"></span>RERA Details</h2>
                <div className="bg-[#005E60]/5 border border-[#005E60]/20 rounded-xl p-4">
                  <div className="font-mono font-semibold text-gray-900">{propertyData.reraNumber}</div>
                  <div className="text-sm text-gray-600 mt-1">Registered with MahaRERA</div>
                </div>
              </section>
            </div>

            {/* → Right Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-32 space-y-6">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                  <h3 className="font-semibold text-gray-900 mb-4">Project Highlights</h3>
                  <div className="space-y-3">
                    {[
                      { icon: Icons.Location, label: "Location", value: propertyData.projectDetails.location },
                      { icon: Icons.Calendar, label: "Possession", value: propertyData.projectDetails.possessionDate },
                      { icon: Icons.Building, label: "Builder", value: propertyData.projectDetails.developer },
                      { icon: Icons.Home, label: "Configurations", value: propertyData.projectDetails.products }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[#005E60]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ color: COLORS.primary }}><item.icon /></div>
                        <div>
                          <div className="text-xs text-gray-500">{item.label}</div>
                          <div className="text-sm font-medium text-gray-900">{item.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 💰 EMI Calculator Card */}
                <div className="bg-gradient-to-br from-[#005E60] to-[#003d40] rounded-2xl shadow-lg p-6 text-white">
                  <div className="mb-4">
                    <div className="text-sm text-white/80">Starting EMI from</div>
                    <div className="text-3xl font-bold">{propertyData.projectDetails.emi}</div>
                    <div className="text-sm text-white/70">per month</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-5">
                    <div className="bg-white/10 rounded-lg p-2 text-center">
                      <div className="font-semibold">{propertyData.projectDetails.downPayment}</div>
                      <div className="text-xs text-white/70">Down Payment</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 text-center">
                      <div className="font-semibold">{propertyData.projectDetails.interestRate}</div>
                      <div className="text-xs text-white/70">Interest Rate</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 text-center">
                      <div className="font-semibold">{propertyData.projectDetails.tenure}</div>
                      <div className="text-xs text-white/70">Tenure</div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setShowEmiPopup(true)}
                    className="w-full py-3 bg-[#F8C21C] text-[#005E60] font-bold rounded-xl hover:bg-[#e6b418] transition-colors shadow-lg mb-3"
                  >
                    Calculate EMI
                  </button>
                  
                  <button 
                    onClick={() => setShowPopup(true)}
                    className="w-full py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20"
                  >
                    Download Brochure
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">Save for Later</div>
                      <div className="text-sm text-gray-600">Get price alerts & updates</div>
                    </div>
                    <button className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-400 hover:border-[#8B0000] hover:text-[#8B0000] transition-colors"><Icons.Heart /></button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border-2 border-[#F8C21C] shadow-lg p-5">
                  <div className="text-center mb-4">
                    <div className="text-sm text-gray-600">Interested?</div>
                    <div className="text-lg font-bold text-gray-900">Get a Callback</div>
                  </div>
                  <button onClick={() => setShowPopup(true)} className="w-full py-3 bg-[#F8C21C] text-[#005E60] font-bold rounded-xl hover:bg-[#e6b418] transition-colors shadow-md">Request Callback</button>
                  <p className="text-xs text-gray-500 text-center mt-3">We'll connect you with a relationship manager</p>
                </div>
              </div>
            </aside>
          </div>
        </main>

        {/* 🔻 Other Projects Section */}
        <section className="bg-white border-t border-gray-200 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2"><span className="w-1.5 h-6 bg-[#F8C21C] rounded-full"></span>Similar Projects in {propertyData.location.city}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {propertyData.otherProjectsNaviMumbai.map((project, index) => (
                <div key={index} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="aspect-video bg-gradient-to-br from-[#005E60] to-[#003d40] relative">
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#F8C21C] text-[#005E60] text-xs font-bold rounded">New Launch</div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 group-hover:text-[#005E60] transition-colors">{project.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-1"><Icons.Location /> {project.location}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div><div className="text-sm text-gray-600">{project.bhk}</div><div className="text-xs text-gray-500">{project.area}</div></div>
                      <div className="text-right"><div className="font-bold" style={{ color: COLORS.alert }}>{project.price}</div><button className="text-xs text-[#005E60] font-medium hover:underline">View →</button></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="bg-gray-100 border-t border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2"><span className="text-[#8B0000]">*</span> Important Notice</h4>
              <p className="text-sm text-gray-600 leading-relaxed">All information is indicative and subject to change. Prices, availability, and specifications are not guaranteed. Please verify all details with the builder before making any decision. RERA registration does not guarantee project completion.</p>
            </div>
          </div>
        </footer>
      </div>

      {/* ✅ Dynamic Enquiry Popup */}
      <EnquiryPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        projectName={propertyData.title}
        projectImage={propertyData.image}
        projectTagline={`Get pricing & floor plans for ${propertyData.title}`}
        theme="gradient"
        trackingData={{ source: 'property_detail', campaign: propertyData.slug || 'unknown', medium: 'organic' }}
        onSubmit={handleEnquirySubmit}
      />

      {/* 🧮 EMI Calculator Popup */}
      {showEmiPopup && <EmiCalculatorPopup onClose={() => setShowEmiPopup(false)} />}
    </>
  );
}

// 🧮 EMI Calculator Popup Component
function EmiCalculatorPopup({ onClose }) {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const calculateEMI = () => {
    const principal = loanAmount;
    const monthlyRate = rate / 12 / 100;
    const months = tenure * 12;
    
    if (monthlyRate === 0) return principal / months;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return emi;
  };

  const emi = calculateEMI();
  const totalPayment = emi * tenure * 12;
  const totalInterest = totalPayment - loanAmount;

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-gray-200/50" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-[#005E60] to-[#004a4d] text-white px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">EMI Calculator</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Loan Amount</label>
              <span className="text-sm font-semibold text-[#005E60]">{formatCurrency(loanAmount)}</span>
            </div>
            <input type="range" min="1000000" max="20000000" step="100000" value={loanAmount} onChange={e => setLoanAmount(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#005E60]" />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Interest Rate (% p.a)</label>
              <span className="text-sm font-semibold text-[#005E60]">{rate}%</span>
            </div>
            <input type="range" min="5" max="15" step="0.1" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#005E60]" />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Tenure (Years)</label>
              <span className="text-sm font-semibold text-[#005E60]">{tenure} Yr</span>
            </div>
            <input type="range" min="1" max="30" step="1" value={tenure} onChange={e => setTenure(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#005E60]" />
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600 mb-1">Monthly EMI</p>
              <p className="text-3xl font-bold text-[#005E60]">{formatCurrency(emi)}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white p-3 rounded-xl shadow-sm">
                <p className="text-xs text-gray-500">Total Interest</p>
                <p className="font-semibold text-gray-900">{formatCurrency(totalInterest)}</p>
              </div>
              <div className="bg-white p-3 rounded-xl shadow-sm">
                <p className="text-xs text-gray-500">Total Payment</p>
                <p className="font-semibold text-gray-900">{formatCurrency(totalPayment)}</p>
              </div>
            </div>
          </div>

          <button onClick={onClose} className="w-full py-3 bg-[#F8C21C] text-[#8B0000] font-bold rounded-xl hover:bg-[#e6b418] transition-colors shadow-lg">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
