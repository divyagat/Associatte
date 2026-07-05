// client/app/property/[slug]/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';
import EnquiryPopup from '@/components/common/EnquiryPopup';
import { getBuilderLogo, getBuilderSlug } from '../../../lib/builder-slugs';

// 🎨 Strategic Color Palette
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

  // Get unique BHK types for display
  const bhkTypes = project.priceDetails?.configurations?.map(c => c.type) || [];
  const uniqueBhk = [...new Set(bhkTypes)].filter(Boolean).join(', ');

  // Get builder logo and slug
  const developerName = project.developer?.name || '';
  const developerLogo = getBuilderLogo(developerName);
  const developerSlug = getBuilderSlug(developerName);

  return {
    title: project.name,
    slug: project.slug,
    rera: !!project.reraNumber,
    priceRange: project.priceDetails?.range || project.price,
    pricePerSqft: project.priceDetails?.perSqft,
    developer: project.developer?.name,
    developerLogo: developerLogo,
    developerSlug: developerSlug,
    image: project.image,
    bhk: uniqueBhk,

    gallery: project.gallery || [],
    masterPlan: project.masterPlan || null,
    locationMap: project.locationMap || null,

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
      area: plan.area,
      image: plan.image
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
      description: project.developer?.description,
      logo: developerLogo,
      slug: developerSlug
    },
    reraNumber: project.reraNumber,
    _originalProject: project
  };
}

// ==================== 🚀 SEO SCHEMA GENERATORS ====================

// Generate Property JSON-LD Schema for Rich Snippets
function generatePropertySchema(propertyData, canonicalUrl) {
  if (!propertyData) return null;
  
  // Extract numeric values from strings
  const priceMatch = propertyData.priceRange?.match(/(\d+(?:\.\d+)?)/);
  const priceValue = priceMatch ? priceMatch[1] : null;
  
  const areaMatch = propertyData.configurations?.[0]?.area?.match(/(\d+)/);
  const areaValue = areaMatch ? areaMatch[1] : null;
  
  const bedroomMatch = propertyData.configurations?.[0]?.type?.match(/(\d+)/);
  const bedroomCount = bedroomMatch ? bedroomMatch[1] : null;
  
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": propertyData.title,
    "description": propertyData.about?.substring(0, 200),
    "url": canonicalUrl,
    "image": propertyData.image || propertyData.gallery?.[0],
    "datePosted": new Date().toISOString(),
    "offers": {
      "@type": "Offer",
      "price": priceValue,
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString()
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": propertyData.location?.area,
      "addressLocality": propertyData.location?.city,
      "addressRegion": "Maharashtra",
      "addressCountry": "IN"
    },
    "numberOfRooms": bedroomCount,
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": areaValue,
      "unitCode": "SQM",
      "unitText": "square feet"
    },
    "seller": {
      "@type": "RealEstateAgent",
      "name": propertyData.developer
    }
  };
}

// Generate RERA Schema
function generateReraSchema(propertyData) {
  if (!propertyData?.reraNumber) return null;
  
  return {
    "@context": "https://schema.org",
    "@type": "GovernmentPermit",
    "name": "RERA Registration",
    "identifier": propertyData.reraNumber,
    "issuedBy": {
      "@type": "GovernmentOrganization",
      "name": "Maharashtra Real Estate Regulatory Authority",
      "url": "https://maharera.mahaonline.gov.in"
    },
    "issuedFor": {
      "@type": "RealEstateListing",
      "name": propertyData.title
    },
    "validFrom": new Date().toISOString()
  };
}

// Generate Breadcrumb Schema
function generateBreadcrumbSchema(propertyData, canonicalUrl) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://propfinder.in';
  const cityName = propertyData?.location?.city?.toLowerCase() || 'pune';
  
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": `${propertyData?.location?.city} Properties`,
        "item": `${baseUrl}/locations/${cityName}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": propertyData?.title,
        "item": canonicalUrl
      }
    ]
  };
}

// ==================== ICONS COMPONENTS ====================

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
  ChevronRight: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>,
  ArrowRight: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>,
};

// ==================== GALLERY MODAL ====================
function GalleryModal({ images, initialIndex, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [currentIndex]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white bg-black/50 rounded-full transition-colors">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
        {currentIndex + 1} / {images.length}
      </div>

      <div className="w-full h-full flex items-center justify-center p-4 cursor-pointer" onClick={(e) => e.stopPropagation()}>
        <img src={images[currentIndex]} alt={`Gallery image ${currentIndex + 1}`} className="max-w-full max-h-full object-contain select-none" />
      </div>

      {images.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); goToPrevious(); }} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={(e) => { e.stopPropagation(); goToNext(); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

// ==================== EMI CALCULATOR ====================
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
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden" onClick={e => e.stopPropagation()}>
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

// ==================== MAIN COMPONENT ====================
export default function PropertyPage() {
  const [propertyData, setPropertyData] = useState(null);
  const [similarProjects, setSimilarProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [showEmiPopup, setShowEmiPopup] = useState(false);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);

  const router = useRouter();
  const params = useParams();
  const slug = params?.slug;

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const fetchProjectData = async () => {
      try {
        // ✅ Fetch from BOTH API routes to get Properties AND Admin Projects
        const [propsRes, projectsRes] = await Promise.all([
          fetch('/api/properties'),
          fetch('/api/projects')
        ]);
        
        const propsData = await propsRes.json();
        const projectsData = await projectsRes.json();
        
        // ✅ Merge both arrays so admin-added projects work here too
        const allItems = [
          ...(Array.isArray(propsData) ? propsData : []),
          ...(Array.isArray(projectsData) ? projectsData : [])
        ];

        const project = allItems.find((p) => p.slug === slug);

        if (project) {
          const transformed = transformProject(project);
          setPropertyData(transformed);

          const cityName = project.fullLocation?.city?.toLowerCase() ||
            (project.location === 'pune' ? 'pune' :
              project.location === 'mumbai' ? 'navi mumbai' : 'kalyan');

          // ✅ Use the merged allItems array for similar projects too
          const similar = allItems
            .filter(p => p.slug !== slug)
            .filter(p => {
              const pCity = p.fullLocation?.city?.toLowerCase() ||
                (p.location === 'pune' ? 'pune' :
                  p.location === 'mumbai' ? 'navi mumbai' : 'kalyan');
              return pCity === cityName;
            })
            .slice(0, 3)
            .map(p => ({
              slug: p.slug,
              title: p.name,
              location: `${p.fullLocation?.area || p.location}, ${p.fullLocation?.city || ''}`,
              bhk: p.priceDetails?.configurations?.map(c => c.type).join(', ') || 'TBA',
              area: p.priceDetails?.configurations?.[0]?.area || 'TBA',
              price: p.priceDetails?.range?.split(' - ')[0] || p.price,
              image: p.image
            }));

          setSimilarProjects(similar);
        } else {
          // ✅ Changed to console.warn - it's normal for invalid URLs
          console.warn(`ℹ️ Project not found for slug: "${slug}". Showing 404 UI.`);
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [slug]);

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
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

 const handleEnquirySubmit = async (payload) => {
  try {
    const response = await fetch('/api/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        remark: payload.message || payload.remark || '',
        project: propertyData?.title || 'General Enquiry',
        projectImage: propertyData?.image,
        projectLocation: propertyData?.location,
        projectPrice: propertyData?.priceRange,
        developer: propertyData?.developer,
        source: 'property_page',
        campaign: 'property_enquiry',
        city: propertyData?.location?.city,
      }),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Submission failed');
    }
    
    console.log('✅ Enquiry submitted to CRM:', result);
    alert('Thank you! Our team will contact you shortly.');
    return result;
  } catch (error) {
    console.error('❌ CRM Error:', error);
    alert('Sorry, there was an error. Please try again.');
    throw error;
  }
};

  const openGallery = (index) => {
    if (propertyData?.gallery && propertyData.gallery.length > 0) {
      setGalleryStartIndex(index);
      setGalleryModalOpen(true);
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

  // ==================== SEO VARIABLES ====================
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://propfinder.in';
  const canonicalUrl = `${baseUrl}/property/${propertyData.slug}`;
  
  const seoTitle = `${propertyData.title} - ${propertyData.configurations?.[0]?.type || ''} in ${propertyData.location.area}, ${propertyData.location.city} | Associatte PropTech`;
  const seoDescription = `${propertyData.title} by ${propertyData.developer}. ${propertyData.configurations?.[0]?.type} starting from ${propertyData.priceRange}. ${propertyData.about?.substring(0, 150)}...`;
  
  // Generate all schemas
  const propertySchema = generatePropertySchema(propertyData, canonicalUrl);
  const reraSchema = generateReraSchema(propertyData);
  const breadcrumbSchema = generateBreadcrumbSchema(propertyData, canonicalUrl);

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={`${propertyData.title}, ${propertyData.bhk} ${propertyData.location.area}, ${propertyData.developer}, property in ${propertyData.location.city}, real estate ${propertyData.location.city}, PropFinder, Associatte PropTech`} />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Alternate URLs */}
        <link rel="alternate" href={canonicalUrl} hrefLang="en-in" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={propertyData.image || `${baseUrl}/og-image.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Associatte PropTech" />
        <meta property="og:locale" content="en_IN" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={propertyData.image || `${baseUrl}/og-image.jpg`} />
        <meta name="twitter:site" content="@associatte" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="author" content="Associatte PropTech" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="1 days" />
        <meta name="language" content="English" />
        
        {/* JSON-LD Structured Data for Rich Snippets */}
        {propertySchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(propertySchema) }}
          />
        )}
        
        {reraSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(reraSchema) }}
          />
        )}
        
        {breadcrumbSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
          />
        )}
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <nav className="flex items-center text-sm text-gray-500 mb-3" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#F8C21C] transition-colors">Home</Link>
              <Icons.ChevronRight />
              <Link href={`/locations/${propertyData.location.city.toLowerCase()}`} className="hover:text-[#F8C21C] transition-colors capitalize">
                {propertyData.location.city}
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
                <p className="text-gray-600 mt-1">
                  By{' '}
                  <Link
                    href={`/projects?builder=${encodeURIComponent(propertyData.developer)}`}
                    className="font-semibold text-[#005E60] hover:underline transition-colors"
                  >
                    {propertyData.developer}
                  </Link>
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl lg:text-3xl font-bold" style={{ color: COLORS.alert }}>{propertyData.priceRange}</div>
                <div className="text-sm text-gray-500">{propertyData.pricePerSqft}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 cursor-pointer" onClick={() => openGallery(0)}>
                <div className="relative aspect-video bg-gradient-to-br from-[#005E60] to-[#003d40] rounded-2xl overflow-hidden group">
                  <img src={propertyData.image} alt={propertyData.title} className="absolute inset-0 w-full h-full object-cover" loading="eager" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-4 py-2 bg-[#F8C21C] text-[#005E60] font-bold rounded-lg shadow-lg">
                      {propertyData.location.area}
                    </span>
                    <span className="px-3 py-1.5 bg-white/90 text-gray-700 text-sm font-medium rounded-lg">
                      {propertyData.gallery?.length || 0} Photos
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 h-full">
                {propertyData.gallery?.slice(0, 4).map((src, i) => (
                  <div key={i} className={`relative w-full h-full min-h-[150px] rounded-xl overflow-hidden cursor-pointer transition-all hover:ring-2 hover:ring-[#F8C21C] ${i === 0 ? 'ring-2 ring-[#005E60]' : ''}`} onClick={() => openGallery(i)}>
                    <img src={src} alt={`${propertyData.title} ${i + 1}`} className="absolute inset-0 w-full h-full min-h-[230px] object-cover" loading="lazy" />
                    {i === 3 && propertyData.gallery?.length > 4 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-medium text-sm z-10">
                        +{propertyData.gallery.length - 4} More
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <nav className="bg-white border-b border-gray-200 sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
              <button onClick={() => scrollToSection('overview')} className="px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all bg-[#005E60] text-white shadow-sm">Overview</button>
              <button onClick={() => scrollToSection('configurations')} className="px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all text-gray-600 hover:text-[#005E60] hover:bg-gray-100">Configurations</button>
              <button onClick={() => scrollToSection('floor-plans')} className="px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all text-gray-600 hover:text-[#005E60] hover:bg-gray-100">Floor Plans</button>
              <button onClick={() => scrollToSection('amenities')} className="px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all text-gray-600 hover:text-[#005E60] hover:bg-gray-100">Amenities</button>
              <button onClick={() => scrollToSection('location')} className="px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all text-gray-600 hover:text-[#005E60] hover:bg-gray-100">Location</button>
              <button onClick={() => scrollToSection('developer')} className="px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all text-gray-600 hover:text-[#005E60] hover:bg-gray-100">Developer</button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
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
                          <button onClick={() => setShowPopup(true)} className="mt-2 px-4 py-1.5 text-sm font-medium text-[#005E60] border border-[#005E60] rounded-lg hover:bg-[#005E60] hover:text-white transition-colors">Get Quote</button>
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
                    {propertyData.floorPlans?.map((plan, index) => (
                      <div key={index} className={`p-4 rounded-xl border-2 text-left transition-all ${index === 0 ? 'border-[#F8C21C] bg-[#F8C21C]/10' : 'border-gray-200 hover:border-[#005E60]/50 hover:bg-gray-50'}`}>
                        {plan.image && (
                          <img src={plan.image} alt={`${propertyData.title} ${plan.type} Floor Plan`} className="w-full h-48 object-contain mb-3 rounded-lg bg-gray-50" loading="lazy" />
                        )}
                        <div className={`font-semibold ${index === 0 ? 'text-[#005E60]' : 'text-gray-900'}`}>{plan.type}</div>
                        <div className="text-sm text-gray-600">{plan.area}</div>
                      </div>
                    ))}
                  </div>
                  {propertyData.masterPlan && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Master Plan</h3>
                      <div className="aspect-video bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                        <img src={propertyData.masterPlan} alt={`${propertyData.title} Master Plan`} className="w-full h-full object-contain" loading="lazy" />
                      </div>
                    </div>
                  )}
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
                {propertyData.locationMap ? (
                  <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden mb-4 border border-gray-200">
                    <img src={propertyData.locationMap} alt={`${propertyData.title} Location Map`} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-200 rounded-xl flex items-center justify-center mb-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-[#005E60]/10 rounded-full flex items-center justify-center mx-auto mb-3" style={{ color: COLORS.primary }}><Icons.Location /></div>
                      <p className="text-gray-600">Location map coming soon</p>
                    </div>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {['Schools', 'Hospitals', 'Malls', 'Metro', 'Airport'].map((tag) => (
                    <span key={tag} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-[#005E60] hover:text-white transition-colors cursor-pointer">
                      {tag}
                    </span>
                  ))}
                </div>
              </section>

              <section id="developer" className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 scroll-mt-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><span className="w-1.5 h-6 bg-[#F8C21C] rounded-full"></span>About {propertyData.developerInfo.name}</h2>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-24 h-24 bg-white rounded-2xl border border-gray-200 flex items-center justify-center shadow-sm p-2 flex-shrink-0">
                    {propertyData.developerLogo ? (
                      <img
                        src={propertyData.developerLogo}
                        alt={propertyData.developer}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-[#005E60] to-[#003d40] rounded-xl flex items-center justify-center text-white font-bold text-lg">${propertyData.developerInfo.name?.substring(0, 2).toUpperCase()}</div>`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#005E60] to-[#003d40] rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        {propertyData.developerInfo.name?.substring(0, 2).toUpperCase() || 'B'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-[#005E60]">{propertyData.developerInfo.establishmentYear || '2000'}</div>
                        <div className="text-xs text-gray-600">Est. Year</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-[#005E60]">{propertyData.developerInfo.listedProjects || '10+'}</div>
                        <div className="text-xs text-gray-600">Projects</div>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-4">{propertyData.developerInfo.description || `${propertyData.developerInfo.name} is a trusted name in real estate with decades of experience delivering quality homes.`}</p>
                    <Link
                      href={`/projects?builder=${encodeURIComponent(propertyData.developer)}`}
                      className="inline-flex items-center gap-1 text-[#005E60] font-semibold text-sm hover:gap-2 transition-all duration-300"
                    >
                      View All Projects by {propertyData.developerInfo.name?.split(' ')[0]}
                      <Icons.ArrowRight />
                    </Link>
                  </div>
                </div>
              </section>

              <section id="brochure" className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 scroll-mt-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><span className="w-1.5 h-6 bg-[#F8C21C] rounded-full"></span>RERA Details</h2>
                <div className="bg-[#005E60]/5 border border-[#005E60]/20 rounded-xl p-4">
                  <div className="font-mono font-semibold text-gray-900">{propertyData.reraNumber || 'P51800012345'}</div>
                  <div className="text-sm text-gray-600 mt-1">Registered with MahaRERA</div>
                </div>
              </section>
            </div>

            {/* Right Sidebar */}
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
                  <button onClick={() => setShowEmiPopup(true)} className="w-full py-3 bg-[#F8C21C] text-[#005E60] font-bold rounded-xl hover:bg-[#e6b418] transition-colors shadow-lg mb-3">
                    Calculate EMI
                  </button>
                  <button onClick={() => setShowPopup(true)} className="w-full py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20">
                    Request Brochure
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

        {/* Similar Projects Section */}
        {similarProjects.length > 0 && (
          <section className="bg-white border-t border-gray-200 py-12">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#F8C21C] rounded-full"></span>
                Similar Projects in {propertyData.location.city}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {similarProjects.map((project, index) => (
                  <Link href={`/property/${project.slug}`} key={index} className="group">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="aspect-video bg-gradient-to-br from-[#005E60] to-[#003d40] relative overflow-hidden">
                        {project.image ? (
                          <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/50">
                            <Icons.Building />
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 bg-[#F8C21C] text-[#005E60] text-xs font-bold rounded">Similar</span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-gray-900 group-hover:text-[#005E60] transition-colors line-clamp-1">{project.title}</h3>
                        <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                          <Icons.Location /> {project.location}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <div>
                            <div className="text-xs text-gray-500">{project.bhk}</div>
                            <div className="text-xs text-gray-400">{project.area}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-[#8B0000]">{project.price}</div>
                            <div className="text-xs text-[#005E60] font-medium group-hover:underline">View Details →</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Footer Notice */}
        <footer className="bg-gray-100 border-t border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2"><span className="text-[#8B0000]">*</span> Important Notice</h4>
              <p className="text-sm text-gray-600 leading-relaxed">All information is indicative and subject to change. Prices, availability, and specifications are not guaranteed. Please verify all details with the builder before making any decision. RERA registration does not guarantee project completion.</p>
            </div>
          </div>
        </footer>
      </div>

      {/* Modals */}
      {galleryModalOpen && propertyData.gallery && propertyData.gallery.length > 0 && (
        <GalleryModal images={propertyData.gallery} initialIndex={galleryStartIndex} onClose={() => setGalleryModalOpen(false)} />
      )}

      <EnquiryPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        projectName={propertyData?.title || "Properties"}
        projectTagline={`Get detailed information about ${propertyData?.title}`}
        formName={`Property Enquiry - ${propertyData?.title}`}
        trackingData={{
          source: 'property_page',
          campaign: 'property_enquiry',
          medium: 'organic',
          city: propertyData?.location?.city
        }}
        showLegalLinks={true}
      />

      {showEmiPopup && <EmiCalculatorPopup onClose={() => setShowEmiPopup(false)} />}
    </>
  );
}