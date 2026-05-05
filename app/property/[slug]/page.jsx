// app/property/[slug]/page.jsx
'use client';

import Head from 'next/head';
import Link from 'next/link';

// 🎨 Strategic Color Palette
const COLORS = {
  primary: '#005E60',    // Dark teal - headers, primary buttons, borders
  accent: '#F8C21C',     // Golden yellow - highlights, badges, hover states  
  alert: '#8B0000',      // Dark red - prices, urgent info, sale tags
  bgLight: '#f8fafc',    // Light background
  textDark: '#1e293b',   // Dark text for readability
  textMuted: '#64748b',  // Muted text
};

// Property Data
const propertyData = {
  title: "Codename Cloud City",
  rera: true,
  priceRange: "₹66.00 Lakh - ₹1.54 Cr",
  pricePerSqft: "₹15.3K - 16.8K/sq.ft",
  developer: "Today Global",
  location: { area: "Kharghar", city: "Navi Mumbai" },
  configurations: [
    { type: "1 BHK", details: "1 living room, kitchen, 1 bedrooms, 1 bathrooms", area: "429 sq. ft.", price: "₹66.00 L" },
    { type: "2 BHK", details: "1 living room, kitchen, 2 bedrooms, 2 bathrooms", area: "600 sq. ft.", price: "₹94.50 L" },
    { type: "2 BHK", details: "1 living room, kitchen, 2 bedrooms, 2 bathrooms", area: "882 sq. ft.", price: "₹1.35 Cr" },
    { type: "3 BHK", details: "1 living room, kitchen, 3 bedrooms, 3 bathrooms", area: "915 sq. ft.", price: "₹1.54 Cr" }
  ],
  floorPlans: [
    { type: "1 BHK", area: "429 sq. ft." },
    { type: "2 BHK", area: "600 sq. ft." },
    { type: "2 BHK", area: "882 sq. ft." }
  ],
  about: "Discover Codename Cloud City, a magnificent township in Kharghar, Navi Mumbai, offering luxurious 1, 2, and 3 BHK apartments. Enjoy a future-ready location with excellent connectivity and a plethora of lifestyle amenities.",
  amenities: [
    { name: "Children's Play Area", icon: "playground" },
    { name: "Jogging Track", icon: "jogging" },
    { name: "Yoga / Meditation", icon: "yoga" },
    { name: "Swimming Pool", icon: "pool" }
  ],
  projectDetails: {
    location: "Kharghar, Navi Mumbai",
    possessionDate: "Dec, 2027",
    developer: "Today Global",
    products: "1, 2, & 3 BHK",
    emi: "₹36.7k/month",
    downPayment: "30%",
    interestRate: "8.35%",
    tenure: "25 Yr"
  },
  developerInfo: {
    name: "Today Global",
    establishmentYear: "2004",
    listedProjects: "4",
    description: "Today Global Group, established in 2004 has become a name to be reckoned with as one of the leading developers in Navi Mumbai."
  },
  reraNumber: "P52000048037",
  otherProjectsNaviMumbai: [
    { title: "Paradise Sai W...", location: "Kharghar, Navi Mumbai", bhk: "2, 3, 4 BHK", area: "790 - 2095 SQ.FT", price: "₹1.17 Cr" },
    { title: "Today Royal Ai...", location: "Kharghar, Navi Mumbai", bhk: "1, 2 BHK", area: "363 - 590 SQ.FT", price: "₹42.48 Lakh" },
    { title: "Today Global M...", location: "Kharghar, Navi Mumbai", bhk: "1, 2 BHK", area: "340.03 - 523.36 SQ.FT", price: "₹39.95 Lakh" }
  ],
  otherProjectsTodayGlobal: [
    { title: "Today Global M...", location: "Shilphata, Navi Mumbai", bhk: "1, 2 BHK", area: "340.03 - 523.36 SQ.FT", price: "₹39.95 Lakh" },
    { title: "Today Anandam ...", location: "Old Panvel, Navi Mumbai", bhk: "2 BHK", area: "429 - 1200 SQ.FT", price: "₹90.00 Lakh" },
    { title: "Today Codename...", location: "Kharghar, Navi Mumbai", bhk: "1, 2, 3, 4, 5 BHK", area: "429 - 1376 SQ.FT", price: "₹60.09 Lakh" }
  ]
};

// Icons
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
  ChevronRight: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
};

export default function PropertyPage() {
  const getIcon = (iconName) => {
    const iconMap = { playground: <Icons.Playground />, jogging: <Icons.Jogging />, yoga: <Icons.Yoga />, pool: <Icons.Pool /> };
    return iconMap[iconName] || <Icons.Playground />;
  };

  return (
    <>
      <Head>
        <title>{propertyData.title} - {propertyData.location.area}, {propertyData.location.city}</title>
        <meta name="description" content={propertyData.about} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        
        {/* 🔝 Header Section - Clean & Professional */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-3">
            {/* Breadcrumb */}
            <nav className="flex items-center text-sm text-gray-500 mb-3">
              <Link href="/" className="hover:text-[#F8C21C] transition-colors">Home</Link>
              <Icons.ChevronRight />
              <Link href="/navi-mumbai" className="hover:text-[#F8C21C] transition-colors">Navi Mumbai</Link>
              <Icons.ChevronRight />
              <Link href="/kharghar" className="hover:text-[#F8C21C] transition-colors">Kharghar</Link>
              <Icons.ChevronRight />
              <span className="text-gray-900 font-medium truncate">{propertyData.title}</span>
            </nav>
            
            {/* Title & Price Row */}
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

        {/* 🖼️ Hero Section - Modern Card Layout */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Image/Video */}
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
              
              {/* Thumbnail Gallery */}
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

        {/* 📋 Navigation Tabs - Clean & Sticky */}
        <nav className="bg-white border-b border-gray-200 sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
              {['Overview', 'Configurations', 'Floor Plans', 'Amenities', 'Location', 'Developer', 'Brochure'].map((tab, index) => (
                <button
                  key={tab}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    index === 0 
                      ? 'bg-[#005E60] text-white shadow-sm' 
                      : 'text-gray-600 hover:text-[#005E60] hover:bg-gray-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* 📦 Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* ← Left Column (Main Content) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* 🏠 Configurations */}
              <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-[#F8C21C] rounded-full"></span>
                    Available Configurations
                  </h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {propertyData.configurations.map((config, index) => (
                    <div key={index} className="p-5 hover:bg-[#005E60]/5 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-[#005E60]/10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ color: COLORS.primary }}>
                            <Icons.Home />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">{config.type}</h3>
                            <p className="text-sm text-gray-600 mt-0.5">{config.details}</p>
                            <p className="text-sm text-gray-500 mt-1">{config.area}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold" style={{ color: COLORS.alert }}>{config.price}</div>
                          <button className="mt-2 px-4 py-1.5 text-sm font-medium text-[#005E60] border border-[#005E60] rounded-lg hover:bg-[#005E60] hover:text-white transition-colors">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 📐 Floor Plans */}
              <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-[#F8C21C] rounded-full"></span>
                    Floor Plans
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {propertyData.floorPlans.map((plan, index) => (
                      <button
                        key={index}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          index === 0 
                            ? 'border-[#F8C21C] bg-[#F8C21C]/10' 
                            : 'border-gray-200 hover:border-[#005E60]/50 hover:bg-gray-50'
                        }`}
                      >
                        <div className={`font-semibold ${index === 0 ? 'text-[#005E60]' : 'text-gray-900'}`}>{plan.type}</div>
                        <div className="text-sm text-gray-600">{plan.area}</div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-6 aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                    <button className="px-6 py-3 bg-[#F8C21C] text-[#005E60] font-semibold rounded-xl hover:bg-[#e6b418] transition-colors shadow-lg">
                      Login to Download Floor Plan
                    </button>
                  </div>
                </div>
              </section>

              {/* ℹ️ About Project */}
              <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[#F8C21C] rounded-full"></span>
                  About {propertyData.title}
                </h2>
                <p className="text-gray-700 leading-relaxed">{propertyData.about}</p>
              </section>

              {/* 🎯 Amenities */}
              <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-[#F8C21C] rounded-full"></span>
                    Premium Amenities
                  </h2>
                </div>
                <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                  {propertyData.amenities.map((amenity, index) => (
                    <div key={index} className="text-center p-4 rounded-xl hover:bg-[#005E60]/5 transition-colors group">
                      <div className="w-14 h-14 mx-auto mb-3 bg-[#005E60]/10 rounded-full flex items-center justify-center group-hover:bg-[#005E60] group-hover:text-white transition-colors" style={{ color: COLORS.primary }}>
                        {getIcon(amenity.icon)}
                      </div>
                      <div className="text-sm font-medium text-gray-800">{amenity.name}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 🗺️ Location */}
              <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[#F8C21C] rounded-full"></span>
                  Location & Connectivity
                </h2>
                <div className="aspect-video bg-gray-200 rounded-xl flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#005E60]/10 rounded-full flex items-center justify-center mx-auto mb-3" style={{ color: COLORS.primary }}>
                      <Icons.Location />
                    </div>
                    <p className="text-gray-600">Interactive map loading...</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Schools', 'Hospitals', 'Malls', 'Metro', 'Airport'].map((tag) => (
                    <span key={tag} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-[#005E60] hover:text-white transition-colors cursor-pointer">
                      {tag}
                    </span>
                  ))}
                </div>
              </section>

              {/* 👨‍💼 Developer Info */}
              <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[#F8C21C] rounded-full"></span>
                  About {propertyData.developerInfo.name}
                </h2>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#005E60] to-[#003d40] rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
                    TODAY
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

              {/* 📄 RERA Info */}
              <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[#F8C21C] rounded-full"></span>
                  RERA Details
                </h2>
                <div className="bg-[#005E60]/5 border border-[#005E60]/20 rounded-xl p-4">
                  <div className="font-mono font-semibold text-gray-900">{propertyData.reraNumber}</div>
                  <div className="text-sm text-gray-600 mt-1">Registered with MahaRERA</div>
                </div>
              </section>
            </div>

            {/* → Right Sidebar (Sticky) */}
            <aside className="lg:col-span-1">
              <div className="sticky top-32 space-y-6">
                
                {/* 📊 Quick Facts Card */}
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
                        <div className="w-8 h-8 bg-[#005E60]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ color: COLORS.primary }}>
                          <item.icon />
                        </div>
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
                  
                  <button className="w-full py-3 bg-[#F8C21C] text-[#005E60] font-bold rounded-xl hover:bg-[#e6b418] transition-colors shadow-lg mb-3">
                    Calculate EMI
                  </button>
                  <button className="w-full py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20">
                    Download Brochure
                  </button>
                </div>

                {/* ❤️ Save Property */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">Save for Later</div>
                      <div className="text-sm text-gray-600">Get price alerts & updates</div>
                    </div>
                    <button className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-400 hover:border-[#8B0000] hover:text-[#8B0000] transition-colors">
                      <Icons.Heart />
                    </button>
                  </div>
                </div>

                {/* 📞 Contact Card */}
                <div className="bg-white rounded-2xl border-2 border-[#F8C21C] shadow-lg p-5">
                  <div className="text-center mb-4">
                    <div className="text-sm text-gray-600">Interested?</div>
                    <div className="text-lg font-bold text-gray-900">Get a Callback</div>
                  </div>
                  <button className="w-full py-3 bg-[#F8C21C] text-[#005E60] font-bold rounded-xl hover:bg-[#e6b418] transition-colors shadow-md">
                    Request Callback
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-3">We'll connect you with a relationship manager</p>
                </div>

              </div>
            </aside>
          </div>
        </main>

        {/* 🔻 Other Projects Section */}
        <section className="bg-white border-t border-gray-200 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#F8C21C] rounded-full"></span>
              Similar Projects in {propertyData.location.city}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {propertyData.otherProjectsNaviMumbai.map((project, index) => (
                <div key={index} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="aspect-video bg-gradient-to-br from-[#005E60] to-[#003d40] relative">
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#F8C21C] text-[#005E60] text-xs font-bold rounded">
                      New Launch
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 group-hover:text-[#005E60] transition-colors">{project.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                      <Icons.Location /> {project.location}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-600">{project.bhk}</div>
                        <div className="text-xs text-gray-500">{project.area}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold" style={{ color: COLORS.alert }}>{project.price}</div>
                        <button className="text-xs text-[#005E60] font-medium hover:underline">View →</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ⚠️ Disclaimer */}
        <footer className="bg-gray-100 border-t border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span className="text-[#8B0000]">*</span> Important Notice
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                All information is indicative and subject to change. Prices, availability, and specifications are not guaranteed. 
                Please verify all details with the builder before making any decision. RERA registration does not guarantee project completion.
              </p>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}