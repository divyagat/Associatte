// client/app/city/[city]/page.tsx
'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Head from 'next/head';
import properties from "../../../data/properties.json";
import Image from "next/image";
import Link from "next/link";
import { 
  MapPin, Home, Bed, Square, ArrowRight, Filter, SlidersHorizontal, 
  Heart, GitCompare, Grid3X3, List, ChevronDown, Star, Sparkles, Phone, Building2, Eye, X, Maximize2
} from "lucide-react";
import EnquiryPopup from '@/components/common/EnquiryPopup';

// Google Maps
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';

// Types
interface PriceConfig {
  type: string;
  area: string;
  price?: string;
}

interface PriceDetails {
  configurations: PriceConfig[];
  perSqft?: string;
}

interface LocationInfo {
  area?: string;
  landmark?: string;
}

interface Developer {
  name: string;
}

interface MapCoords {
  lat: number;
  lng: number;
}

interface Project {
  slug: string;
  name: string;
  image: string;
  about: string;
  price: string;
  location: string;
  possessionDate?: string;
  reraNumber?: string;
  developer?: Developer;
  fullLocation?: LocationInfo;
  priceDetails?: PriceDetails;
  amenities?: string[];
  mapCoords?: MapCoords;
  createdAt?: string;
}

interface CityData {
  lat: number;
  lng: number;
  zoom: number;
  title: string;
  description: string;
  keywords: string[];
}

interface Highlight {
  label: string;
  color: string;
}

// Helpers
const formatPrice = (price: string): string => price.includes('₹') ? price : `₹${price}`;

const parsePrice = (price: string): number => {
  const cleaned = price?.replace(/[^0-9]/g, '');
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? 0 : num;
};

const getBHKInfo = (project: Project): string => {
  const configs = project.priceDetails?.configurations || [];
  const bhkTypes = configs
    .map((c: PriceConfig) => c.type)
    .filter((t: string): boolean => t?.includes('BHK'));
  return bhkTypes.length > 0 ? bhkTypes.join(', ') : 'TBA';
};

const getAreaRange = (project: Project): string => {
  const configs = project.priceDetails?.configurations || [];
  const areas = configs
    .map((c: PriceConfig) => parseInt(c.area, 10))
    .filter((a: number): boolean => !isNaN(a) && a > 0);
  
  if (areas.length === 0) return '';
  const min = Math.min(...areas);
  const max = Math.max(...areas);
  return min === max ? `${min} sq.ft` : `${min} - ${max} sq.ft`;
};

const getHighlights = (project: Project): Highlight[] => {
  const h: Highlight[] = [];
  if (project.reraNumber) h.push({ label: 'RERA', color: 'bg-[#005E60]' });
  if (project.possessionDate?.toLowerCase().includes('ready')) {
    h.push({ label: 'Ready', color: 'bg-[#F8C21C] text-[#8B0000]' });
  }
  if (project.fullLocation?.landmark?.toLowerCase().includes('metro')) {
    h.push({ label: 'Near Metro', color: 'bg-blue-600' });
  }
  return h.slice(0, 2);
};

// 🗺️ Map configuration
const MAP_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: false,
  styles: [
    { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] }
  ]
};

// 📍 City coordinates + SEO metadata
const CITY_METADATA: Record<string, CityData> = {
  pune: { 
    lat: 18.5204, 
    lng: 73.8567, 
    zoom: 11,
    title: "Properties in Pune | 2, 3, 4 BHK Flats & Apartments",
    description: "Find verified 2, 3, 4 BHK properties in Pune. Browse new launches & ready-to-move projects by top builders. Starting ₹75L. PropFinder by Associatte PropTech.",
    keywords: ["properties in Pune", "flats in Pune", "3 BHK Pune", "new launch Pune", "ready to move Pune", "PropFinder", "Associatte PropTech"]
  },
  mumbai: { 
    lat: 19.0760, 
    lng: 72.8777, 
    zoom: 11,
    title: "Properties in Mumbai | 2, 3, 4 BHK Flats & Apartments",
    description: "Discover premium 2, 3, 4 BHK properties in Mumbai. Verified listings, transparent pricing, RERA registered projects. Starting ₹75L. PropFinder by Associatte PropTech.",
    keywords: ["properties in Mumbai", "flats in Mumbai", "3 BHK Mumbai", "new launch Mumbai", "ready to move Mumbai", "PropFinder", "Associatte PropTech"]
  },
  kharghar: { 
    lat: 19.0433, 
    lng: 73.0636, 
    zoom: 13,
    title: "Properties in Kharghar | 3 BHK Flats Under 1 Crore",
    description: "Find affordable 2, 3, 4 BHK properties in Kharghar, Navi Mumbai. Ready to move & under construction projects. Starting ₹75L. PropFinder by Associatte PropTech.",
    keywords: ["properties in Kharghar", "3 BHK Kharghar", "flats under 1 crore Kharghar", "Navi Mumbai properties", "PropFinder", "Associatte PropTech", "Paradise Sai World Empire", "Mantra 1 Residences"]
  },
  "sus-pune": {
    lat: 18.5912,
    lng: 73.7389,
    zoom: 13,
    title: "Properties in Sus, Pune | New Launch Projects",
    description: "Explore new launch & under construction projects in Sus, Pune. 2, 3, 4 BHK homes by trusted builders. PropFinder by Associatte PropTech.",
    keywords: ["properties in Sus Pune", "new launch Sus", "Mantra Codename Paradise", "flats in Sus", "PropFinder", "Associatte PropTech"]
  },
  kdmc: { 
    lat: 19.2183, 
    lng: 73.0789, 
    zoom: 12,
    title: "Properties in Kalyan-Dombivli | Affordable 2, 3 BHK Flats",
    description: "Find affordable 2, 3 BHK properties in Kalyan-Dombivli. RERA registered projects, transparent pricing. Starting ₹40L. PropFinder by Associatte PropTech.",
    keywords: ["properties in Kalyan", "flats in Dombivli", "affordable homes KDMC", "2 BHK Kalyan", "PropFinder", "Associatte PropTech"]
  },
  default: { 
    lat: 19.0760, 
    lng: 72.8777, 
    zoom: 10,
    title: "Properties in Maharashtra | Find Your Dream Home",
    description: "Browse verified real estate projects across Maharashtra. 2, 3, 4 BHK homes in Mumbai, Pune, Navi Mumbai & more. PropFinder by Associatte PropTech.",
    keywords: ["properties in Maharashtra", "real estate Maharashtra", "flats in Maharashtra", "PropFinder", "Associatte PropTech"]
  }
};

// 🏙️ Location Schema Component (JSON-LD)
function LocationSchema({ city, projects }: { city: string; projects: Project[] }) {
  const cityData = CITY_METADATA[city.toLowerCase()] || CITY_METADATA.default;
  const startingPrice = projects.length > 0 
    ? Math.min(...projects.map(p => parsePrice(p.price) || Infinity)) 
    : 7500000;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": projects.slice(0, 10).map((project: Project, index: number) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": project.name,
        "image": project.image,
        "description": project.about,
        "offers": {
          "@type": "Offer",
          "priceCurrency": "INR",
          "price": parsePrice(project.price), // Price is already in rupees
          "availability": project.possessionDate?.toLowerCase().includes('ready') 
            ? "https://schema.org/InStock" 
            : "https://schema.org/PreOrder"
        },
        "address": {
          "@type": "PostalAddress",
          "addressLocality": cityData.title.split('|')[0].replace('Properties in ', '').trim(),
          "addressRegion": "Maharashtra",
          "addressCountry": "IN"
        }
      }
    })),
    "provider": {
      "@type": "Organization",
      "name": "Associatte PropTech Pvt Ltd",
      "url": "https://propfinder.in",
      "logo": "https://propfinder.in/logo.png"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// 🗺️ Place Schema for Local SEO
function PlaceSchema({ city }: { city: string }) {
  const cityData = CITY_METADATA[city.toLowerCase()] || CITY_METADATA.default;
  const cityName = cityData.title.split('|')[0].replace('Properties in ', '').trim();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": cityName,
    "address": {
      "@type": "PostalAddress",
      "addressRegion": "Maharashtra",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": cityData.lat,
      "longitude": cityData.lng
    },
    "isPartOf": {
      "@type": "AdministrativeArea",
      "name": "Maharashtra, India"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function CityPage() {
  const { city } = useParams<{ city: string }>();
  const cityName = city?.toLowerCase() || '';
  const cityDisplayName = cityName.charAt(0).toUpperCase() + cityName.slice(1).replace('-', ' ');
  
  // Get city-specific metadata
  const cityData = CITY_METADATA[cityName] || CITY_METADATA.default;

  // Load Google Maps
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  // State
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'newest'>('price-asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  
  // Filter State
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(50000000);
  const [selectedBhk, setSelectedBhk] = useState<string[]>([]);
  const [readyOnly, setReadyOnly] = useState(false);

  // Map State
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: cityData.lat, lng: cityData.lng, zoom: cityData.zoom });

  // Filter & Sort Logic
  const filteredProjects = useMemo(() => {
    let projects = (properties as Project[]).filter((p) => p.location.toLowerCase() === cityName);

    // Apply Price Filter
    projects = projects.filter(p => {
      const price = parsePrice(p.price);
      return price >= priceMin && price <= priceMax;
    });

    // Apply BHK Filter
    if (selectedBhk.length > 0) {
      projects = projects.filter(p => {
        const bhk = getBHKInfo(p);
        return selectedBhk.some(b => bhk.includes(b));
      });
    }

    // Apply Ready to Move Filter
    if (readyOnly) {
      projects = projects.filter(p => p.possessionDate?.toLowerCase().includes('ready'));
    }

    // Apply Sorting
    if (sortBy === 'price-asc') {
      projects.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (sortBy === 'price-desc') {
      // FIXED: Was parsePrice(b.price) - parsePrice(b.price) - now correctly compares a and b
      projects.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    } else if (sortBy === 'newest') {
      projects.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    }

    return projects;
  }, [cityName, sortBy, priceMin, priceMax, selectedBhk, readyOnly]);

  const totalProjects = filteredProjects.length;
  const uniqueBuilders = new Set(filteredProjects.map(p => p.developer?.name).filter(Boolean)).size;
  const startingPrice = totalProjects > 0 
    ? Math.min(...filteredProjects.map(p => parsePrice(p.price) || Infinity)) 
    : 0;

  // Toggle BHK filter
  const toggleBhk = (bhk: string) => {
    setSelectedBhk(prev => prev.includes(bhk) ? prev.filter(b => b !== bhk) : [...prev, bhk]);
  };

  // Clear all filters
  const clearFilters = () => {
    setPriceMin(0);
    setPriceMax(50000000);
    setSelectedBhk([]);
    setReadyOnly(false);
    setSortBy('price-asc');
  };

  const hasActiveFilters = priceMin > 0 || priceMax < 50000000 || selectedBhk.length > 0 || readyOnly;

  // Handle Form Submission
  const handlePopupSubmit = (payload: any) => {
    console.log('📩 Enquiry Submitted:', payload);
  };

  // Map handlers
  const onMarkerClick = useCallback((project: Project) => {
    setSelectedProject(project);
    if (project.mapCoords) {
      setMapCenter({ lat: project.mapCoords.lat, lng: project.mapCoords.lng, zoom: 14 });
    }
  }, []);

  const onMapClick = useCallback(() => {
    setSelectedProject(null);
  }, []);

  // Update map center when city changes
  useEffect(() => {
    const coords = CITY_METADATA[cityName] || CITY_METADATA.default;
    setMapCenter(coords);
  }, [cityName]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    // Optional: Add custom logic when map loads
  }, []);

  if (loadError) {
    console.error('Map load error:', loadError);
  }

  // 🔹 Generate SEO metadata
  const seoTitle = cityData.title;
  const seoDescription = cityData.description;
  const canonicalUrl = `https://propfinder.in/city/${cityName}`;
  const locationKeywords = [...cityData.keywords, `${cityDisplayName} real estate`, `buy property in ${cityDisplayName}`];

  return (
    <>
      {/* 🎯 ENHANCED SEO HEAD FOR LOCATION PAGE */}
      <Head>
        {/* Primary Meta Tags */}
        <title>{seoTitle} | PropFinder</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={locationKeywords.join(', ')} />
        <meta name="author" content="Associatte PropTech Pvt Ltd" />
        <meta name="robots" content="index, follow" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={`${seoTitle} | PropFinder`} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content="https://propfinder.in/og-image.jpg" />
        <meta property="og:site_name" content="PropFinder" />
        <meta property="og:locale" content="en_IN" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content={`${seoTitle} | PropFinder`} />
        <meta property="twitter:description" content={seoDescription} />
        <meta property="twitter:image" content="https://propfinder.in/og-image.jpg" />
        
        {/* Geo Tags for Local SEO */}
        <meta name="geo.region" content="IN-MH" />
        <meta name="geo.placename" content={cityDisplayName} />
        <meta name="geo.position" content={`${cityData.lat};${cityData.lng}`} />
        <meta name="ICBM" content={`${cityData.lat}, ${cityData.lng}`} />
        
        {/* Location Schema (JSON-LD) */}
        <PlaceSchema city={cityName} />
        <LocationSchema city={cityName} projects={filteredProjects} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        
        {/* 🏙️ Hero Section */}
        <section className="relative bg-gradient-to-br from-[#005E60] via-[#004a4d] to-[#003537] text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#F8C21C] rounded-full blur-3xl" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-6 py-12 md:py-16">
            {/* ✅ Breadcrumbs for SEO */}
            <nav className="flex items-center text-sm text-white/80 mb-4" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#F8C21C] transition-colors">Home</Link>
              <ChevronDown className="w-3 h-3 mx-2 rotate-[-90deg]" />
              <span className="text-white font-medium" aria-current="page">{cityDisplayName}</span>
            </nav>
            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 text-white/80 text-sm mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{cityDisplayName}, Maharashtra</span>
                  <span className="w-1 h-1 bg-white/50 rounded-full" />
                  <span>India</span>
                </div>
                
                {/* ✅ H1 with location keyword */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  Discover Premium Properties in <span className="text-[#F8C21C]">{cityDisplayName}</span>
                </h1>
                
                <p className="text-white/80 mt-4 text-lg leading-relaxed max-w-xl">
                  Explore {totalProjects} handpicked projects from trusted builders. 
                  Find your perfect home with verified listings, transparent pricing, and expert guidance.
                </p>
                
                <div className="flex flex-wrap gap-4 mt-6">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                    <Home className="w-4 h-4 text-[#F8C21C]" />
                    <span className="font-semibold">{totalProjects}</span>
                    <span className="text-white/70 text-sm">Projects</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                    <Building2 className="w-4 h-4 text-[#F8C21C]" />
                    <span className="font-semibold">{uniqueBuilders}</span>
                    <span className="text-white/70 text-sm">Builders</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                    <span className="font-semibold text-[#F8C21C]">₹{(startingPrice/100000).toFixed(1)}L+</span>
                    <span className="text-white/70 text-sm">Starting</span>
                  </div>
                </div>
              </div>
              
              <div className="lg:text-right">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                  <p className="text-sm text-white/80 mb-2">Looking for something specific?</p>
                  
                  <button
                    onClick={() => setShowPopup(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#F8C21C] text-[#8B0000] font-bold rounded-xl hover:bg-[#e6b418] transition-all shadow-lg hover:shadow-xl group"
                  >
                    <Sparkles className="w-4 h-4" /> Get Personalized Help
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <p className="text-xs text-white/60 mt-3">Free consultation • No obligation</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
            <svg viewBox="0 0 1440 80" fill="none" className="w-full">
              <path d="M0 32L60 37.3C120 43 240 53 360 58.7C480 64 600 64 720 61.3C840 59 960 53 1080 48C1200 43 1320 37 1380 34.7L1440 32V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0V32Z" fill="#f8fafc"/>
            </svg>
          </div>
        </section>

        {/* 🔍 Filter & Sort Bar */}
        <section className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Filter className="w-4 h-4" />
                  <span className="text-sm font-medium">{totalProjects} properties found in {cityDisplayName}</span>
                  {hasActiveFilters && <span className="px-2 py-0.5 bg-[#005E60]/10 text-[#005E60] text-xs font-bold rounded-full">Active</span>}
                </div>
                
                {/* ✅ View Mode Toggle: Grid / List / Map */}
                <div className="hidden sm:flex items-center bg-gray-100 rounded-lg p-1">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#005E60]' : 'text-gray-500 hover:text-gray-700'}`}
                    title="Grid View"
                    aria-label="Grid View"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition ${viewMode === 'list' ? 'bg-white shadow-sm text-[#005E60]' : 'text-gray-500 hover:text-gray-700'}`}
                    title="List View"
                    aria-label="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setViewMode('map')}
                    className={`p-2 rounded-md transition ${viewMode === 'map' ? 'bg-white shadow-sm text-[#005E60]' : 'text-gray-500 hover:text-gray-700'}`}
                    title="Map View"
                    aria-label="Map View"
                  >
                    <MapPin className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'price-asc' | 'price-desc' | 'newest')}
                    className="appearance-none text-sm border border-gray-200 rounded-lg pl-3 pr-8 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#005E60]/20 focus:border-[#005E60] cursor-pointer"
                    aria-label="Sort by"
                  >
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${showFilters ? 'bg-[#005E60] text-white border-[#005E60]' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                  aria-expanded={showFilters}
                  aria-controls="filter-panel"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  {showFilters ? 'Hide Filters' : 'Filters'}
                </button>
              </div>
            </div>

            {/* ✅ Expandable Filter Panel */}
            {showFilters && (
              <div id="filter-panel" className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 animate-in slide-in-from-top-2 duration-200">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Price Range */}
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Price Range (₹)</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="range" 
                        min="0" 
                        max="50000000" 
                        step="500000" 
                        value={priceMin} 
                        onChange={e => setPriceMin(Number(e.target.value))} 
                        className="flex-1 accent-[#005E60]"
                        aria-label="Minimum price"
                      />
                      <span className="text-sm font-semibold text-[#005E60] w-16 text-right">{(priceMin/100000).toFixed(0)}L</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <input 
                        type="range" 
                        min="0" 
                        max="50000000" 
                        step="500000" 
                        value={priceMax} 
                        onChange={e => setPriceMax(Number(e.target.value))} 
                        className="flex-1 accent-[#005E60]"
                        aria-label="Maximum price"
                      />
                      <span className="text-sm font-semibold text-[#005E60] w-16 text-right">{(priceMax/100000).toFixed(0)}L</span>
                    </div>
                  </div>

                  {/* BHK Filter */}
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Configuration</label>
                    <div className="flex flex-wrap gap-2">
                      {['1 BHK', '2 BHK', '3 BHK', '4 BHK'].map(bhk => (
                        <button 
                          key={bhk} 
                          onClick={() => toggleBhk(bhk)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${selectedBhk.includes(bhk) ? 'bg-[#005E60] text-white border-[#005E60]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#005E60]'}`}
                          aria-pressed={selectedBhk.includes(bhk)}
                        >
                          {bhk}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Possession */}
                  <div className="flex flex-col justify-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={readyOnly} 
                        onChange={e => setReadyOnly(e.target.checked)} 
                        className="w-4 h-4 accent-[#005E60] rounded border-gray-300"
                      />
                      <span className="text-sm font-medium text-gray-700">Ready to Move Only</span>
                    </label>
                  </div>

                  <div className="flex items-center justify-center md:justify-end">
                    <button onClick={clearFilters} className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1">
                      <X className="w-3.5 h-3.5" /> Clear All
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 🗺️ Map View */}
        {viewMode === 'map' && (
          <section className="max-w-7xl mx-auto px-4 md:px-6 py-6">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              {/* Map Header */}
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#005E60]" />
                  <span className="text-sm font-medium text-gray-700">{totalProjects} properties in {cityDisplayName}</span>
                </div>
                <button 
                  onClick={() => setMapCenter({ lat: cityData.lat, lng: cityData.lng, zoom: cityData.zoom })}
                  className="text-xs text-[#005E60] hover:underline flex items-center gap-1"
                >
                  <Maximize2 className="w-3 h-3" /> Reset View
                </button>
              </div>
              
              {/* Google Map */}
              <div className="h-[60vh] md:h-[70vh] w-full relative">
                {!isLoaded ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-[#005E60] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                      <p className="text-sm text-gray-600">Loading map...</p>
                    </div>
                  </div>
                ) : loadError ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <p className="text-sm text-red-600">Map failed to load</p>
                  </div>
                ) : (
                  <GoogleMap
                    mapContainerClassName="w-full h-full"
                    center={{ lat: mapCenter.lat, lng: mapCenter.lng }}
                    zoom={mapCenter.zoom}
                    options={MAP_OPTIONS}
                    onLoad={onMapLoad}
                    onClick={onMapClick}
                  >
                    {/* Property Markers */}
                    {filteredProjects.map((project: Project) => {
                      if (!project.mapCoords) return null;
                      
                      const isSelected = selectedProject?.slug === project.slug;
                      const highlights = getHighlights(project); // ✅ Defined in scope
                      
                      return (
                        <Marker
                          key={project.slug}
                          position={{ lat: project.mapCoords.lat, lng: project.mapCoords.lng }}
                          onClick={() => onMarkerClick(project)}
                          icon={{
                            url: isSelected 
                              ? 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F8C21C" stroke="#8B0000" stroke-width="2">
                                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                                  <circle cx="12" cy="9" r="2.5" fill="#8B0000"/>
                                </svg>
                              `)
                              : 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#005E60" stroke="white" stroke-width="2">
                                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                                  <circle cx="12" cy="9" r="2.5" fill="white"/>
                                </svg>
                              `),
                            scaledSize: new google.maps.Size(32, 40),
                            anchor: new google.maps.Point(16, 40)
                          }}
                        />
                      );
                    })}

                    {/* Info Window for Selected Project */}
                    {selectedProject && selectedProject.mapCoords && (
                      <InfoWindow
                        position={{ lat: selectedProject.mapCoords.lat, lng: selectedProject.mapCoords.lng }}
                        onCloseClick={() => setSelectedProject(null)}
                        options={{ pixelOffset: new google.maps.Size(0, -40) }}
                      >
                        <div className="w-64 p-3">
                          <Link href={`/property/${selectedProject.slug}`} onClick={() => setSelectedProject(null)}>
                            <div className="flex gap-3">
                              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                <Image
                                  src={selectedProject.image || '/placeholder-property.jpg'}
                                  alt={selectedProject.name}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{selectedProject.name}</h4>
                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{selectedProject.developer?.name}</p>
                                <p className="text-sm font-bold text-[#8B0000] mt-1">{formatPrice(selectedProject.price)}</p>
                                <div className="flex gap-1 mt-2">
                                  {getHighlights(selectedProject).map((badge: Highlight, i: number) => (
                                    <span key={i} className={`px-1.5 py-0.5 ${badge.color} text-white text-[10px] font-bold rounded`}>
                                      {badge.label}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </Link>
                          <Link 
                            href={`/property/${selectedProject.slug}`}
                            className="mt-3 block w-full text-center px-3 py-1.5 bg-[#005E60] text-white text-xs font-medium rounded-lg hover:bg-[#004a4d] transition-colors"
                            onClick={() => setSelectedProject(null)}
                          >
                            View Details
                          </Link>
                        </div>
                      </InfoWindow>
                    )}
                  </GoogleMap>
                )}
              </div>
              
              {/* Mobile: Show selected project details below map */}
              {selectedProject && (
                <div className="md:hidden p-4 border-t border-gray-200 bg-gray-50">
                  <Link href={`/property/${selectedProject.slug}`} className="block">
                    <div className="flex gap-3">
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        <Image
                          src={selectedProject.image || '/placeholder-property.jpg'}
                          alt={selectedProject.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 line-clamp-1">{selectedProject.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{selectedProject.developer?.name}</p>
                        <p className="text-lg font-bold text-[#8B0000] mt-1">{formatPrice(selectedProject.price)}</p>
                        <div className="flex gap-1 mt-2">
                          {getHighlights(selectedProject).map((badge: Highlight, i: number) => (
                            <span key={i} className={`px-2 py-0.5 ${badge.color} text-white text-[10px] font-bold rounded`}>
                              {badge.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 📋 Projects Grid/List (Only show if not in map view) */}
        {viewMode !== 'map' && (
          <main className="max-w-7xl mx-auto px-6 py-8">
            {totalProjects === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gradient-to-br from-[#005E60]/10 to-[#F8C21C]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Home className="w-12 h-12 text-[#005E60]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No projects match your filters in {cityDisplayName}</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">Try adjusting your price range or configuration filters to see more results.</p>
                <button onClick={clearFilters} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#005E60] text-white font-medium rounded-xl hover:bg-[#004a4d] transition-colors">
                  Clear Filters <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1 max-w-4xl'}`}>
                {filteredProjects.map((project: Project, index: number) => {
                  const highlights = getHighlights(project);
                  const bhkInfo = getBHKInfo(project);
                  const areaRange = getAreaRange(project);
                  
                  return (
                    <Link key={project.slug} href={`/property/${project.slug}`} className="group block">
                      <article className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:border-[#005E60]/40 transition-all duration-300 hover:-translate-y-1">
                        <div className={`relative ${viewMode === 'grid' ? 'h-52' : 'h-48'} bg-gray-100 overflow-hidden`}>
                          <Image
                            src={project.image || '/placeholder-property.jpg'}
                            alt={`${project.name} in ${cityDisplayName}`}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            sizes={viewMode === 'grid' ? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' : '100vw'}
                            priority={index < 3}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                            {highlights.map((badge: Highlight, i: number) => (
                              <span key={i} className={`px-2.5 py-1 ${badge.color} text-white text-xs font-bold rounded-full shadow-sm whitespace-nowrap`}>
                                {badge.label}
                              </span>
                            ))}
                          </div>
                          
                          <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                            <button 
                              className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-[#8B0000] hover:bg-white transition-all shadow-sm" 
                              onClick={e => e.preventDefault()} 
                              aria-label="Save property"
                            >
                              <Heart className="w-4 h-4" />
                            </button>
                            <button 
                              className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-[#005E60] hover:bg-white transition-all shadow-sm" 
                              onClick={e => e.preventDefault()} 
                              aria-label="Compare property"
                            >
                              <GitCompare className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <button 
                            className="absolute bottom-4 left-1/2 -translate-x-1/2 px-5 py-2 bg-white/95 backdrop-blur-sm text-[#005E60] text-sm font-bold rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:bg-white hover:scale-105 flex items-center gap-2" 
                            onClick={e => e.preventDefault()}
                          >
                            <Eye className="w-4 h-4" /> Quick View
                          </button>
                        </div>

                        <div className="p-5">
                          <div className="mb-4">
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#005E60] transition-colors line-clamp-1">{project.name}</h3>
                              {project.reraNumber && <span className="flex-shrink-0 px-2 py-1 bg-[#005E60]/10 text-[#005E60] text-[10px] font-bold rounded uppercase tracking-wide">RERA</span>}
                            </div>
                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="line-clamp-1">{project.developer?.name || 'Builder'}</span>
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                              <MapPin className="w-3 h-3 flex-shrink-0" />
                              {project.fullLocation?.area}, {cityDisplayName}
                            </p>
                          </div>

                          <div className="mb-4 p-3 bg-gradient-to-r from-[#8B0000]/5 to-transparent rounded-xl border border-[#8B0000]/10">
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-bold text-[#8B0000]">{formatPrice(project.price)}</span>
                              {project.priceDetails?.perSqft && <span className="text-sm text-gray-500">• {project.priceDetails.perSqft}</span>}
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-gray-100 mb-4">
                            <div className="text-center">
                              <Bed className="w-4 h-4 mx-auto text-gray-400 mb-1" />
                              <div className="text-[11px] text-gray-500 uppercase">Config</div>
                              <div className="text-xs font-semibold text-gray-900">{bhkInfo}</div>
                            </div>
                            <div className="text-center border-l border-gray-100">
                              <Square className="w-4 h-4 mx-auto text-gray-400 mb-1" />
                              <div className="text-[11px] text-gray-500 uppercase">Area</div>
                              <div className="text-xs font-semibold text-gray-900">{areaRange || 'TBA'}</div>
                            </div>
                            <div className="text-center border-l border-gray-100">
                              <MapPin className="w-4 h-4 mx-auto text-gray-400 mb-1" />
                              <div className="text-[11px] text-gray-500 uppercase">Locality</div>
                              <div className="text-xs font-semibold text-gray-900">{project.fullLocation?.area?.split(' ')[0] || 'TBA'}</div>
                            </div>
                          </div>

                          {project.amenities?.length > 0 && (
                            <div className="mb-4">
                              <div className="flex flex-wrap gap-1.5">
                                {project.amenities.slice(0, 4).map((amenity: string, i: number) => (
                                  <span key={i} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-[11px] font-medium rounded-md hover:bg-[#005E60] hover:text-white transition-colors cursor-default">
                                    {amenity}
                                  </span>
                                ))}
                                {project.amenities.length > 4 && <span className="px-2.5 py-1 text-gray-400 text-[11px]">+{project.amenities.length - 4} more</span>}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <span className="w-1.5 h-1.5 bg-[#F8C21C] rounded-full animate-pulse" />
                              Possession: <span className="font-medium text-gray-700">{project.possessionDate || 'TBA'}</span>
                            </div>
                            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#005E60] group-hover:gap-2 transition-all">View Details <ArrowRight className="w-4 h-4" /></span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            )}
            
            {totalProjects > 6 && viewMode !== 'map' && (
              <div className="mt-12 text-center">
                <button className="px-8 py-3 bg-white border-2 border-[#005E60] text-[#005E60] font-bold rounded-xl hover:bg-[#005E60] hover:text-white transition-all shadow-sm hover:shadow-lg">
                  Load More Projects
                </button>
                <p className="text-xs text-gray-500 mt-3">Showing 1-{Math.min(6, totalProjects)} of {totalProjects} projects in {cityDisplayName}</p>
              </div>
            )}
          </main>
        )}

        {/* 📢 Premium CTA Section */}
        {totalProjects > 0 && viewMode !== 'map' && (
          <section className="relative bg-gradient-to-r from-[#005E60] via-[#004a4d] to-[#003537] text-white py-16 mt-16 overflow-hidden">
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#F8C21C] rounded-full blur-3xl" />
            </div>
            <div className="relative max-w-4xl mx-auto px-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm mb-6">
                <Sparkles className="w-4 h-4 text-[#F8C21C]" /> <span>Personalized Property Matching</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Can't find your perfect home in {cityDisplayName}?</h3>
              <p className="text-white/80 mb-8 max-w-2xl mx-auto text-lg">Our property experts have access to off-market listings and upcoming launches. Get personalized recommendations based on your budget, preferences, and timeline.</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => setShowPopup(true)}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#F8C21C] text-[#8B0000] font-bold rounded-xl hover:bg-[#e6b418] transition-all shadow-xl hover:shadow-2xl group"
                >
                  <Phone className="w-5 h-5" /> Talk to an Expert
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <Link href="/properties" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20">
                  <Filter className="w-4 h-4" /> Refine Search
                </Link>
              </div>
              <p className="text-xs text-white/60 mt-6">✓ Free consultation &nbsp; • &nbsp; ✓ No obligation &nbsp; • &nbsp; ✓ 24h response time</p>
            </div>
          </section>
        )}

        {/* 🗺️ Map Preview (Only show in grid/list mode) */}
        {viewMode !== 'map' && (
          <section className="max-w-7xl mx-auto px-6 py-12">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Properties in {cityDisplayName}</h3>
                  <p className="text-gray-600 mt-1">See all projects on an interactive map</p>
                </div>
                <button 
                  onClick={() => setViewMode('map')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#005E60] text-white font-medium rounded-xl hover:bg-[#004a4d] transition-colors"
                >
                  <MapPin className="w-4 h-4" /> View on Map
                </button>
              </div>
              <div className="relative h-64 md:h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden border border-gray-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">Click "View on Map" to see interactive map</p>
                    <p className="text-sm text-gray-400 mt-1">Powered by Google Maps</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ✅ Dynamic Enquiry Popup */}
        <EnquiryPopup
          isOpen={showPopup}
          onClose={() => setShowPopup(false)}
          projectName={`Properties in ${cityDisplayName}`}
          projectTagline="Get personalized property recommendations"
          theme="gradient"
          trackingData={{
            source: 'city_page',
            campaign: cityDisplayName,
            medium: 'organic'
          }}
          onSubmit={handlePopupSubmit}
        />
      </div>
    </>
  );
}