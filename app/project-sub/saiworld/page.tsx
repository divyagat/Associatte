// app/property/[slug]/page.jsx
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

// Property Data
const propertyData = {
  title: "Codename Cloud City",
  rera: true,
  priceRange: "₹66.00 Lakh - ₹1.54 Cr",
  pricePerSqft: "₹15.3K - 16.8K/sq.ft",
  developer: "Today Global",
  location: {
    area: "Kharghar",
    city: "Navi Mumbai"
  },
  configurations: [
    {
      type: "1 BHK",
      details: "1 living room, kitchen, 1 bedrooms, 1 bathrooms",
      area: "429 sq. ft.",
      price: "₹66.00 L"
    },
    {
      type: "2 BHK",
      details: "1 living room, kitchen, 2 bedrooms, 2 bathrooms",
      area: "600 sq. ft.",
      price: "₹94.50 L"
    },
    {
      type: "2 BHK",
      details: "1 living room, kitchen, 2 bedrooms, 2 bathrooms",
      area: "882 sq. ft.",
      price: "₹1.35 Cr"
    },
    {
      type: "3 BHK",
      details: "1 living room, kitchen, 3 bedrooms, 3 bathrooms",
      area: "915 sq. ft.",
      price: "₹1.54 Cr"
    }
  ],
  floorPlans: [
    { type: "1 BHK", area: "429 sq. ft." },
    { type: "2 BHK", area: "600 sq. ft." },
    { type: "2 BHK", area: "882 sq. ft." }
  ],
  about: "Discover Codename Cloud City, a magnificent township in Kharghar, Navi Mumbai, offering luxurious 1, 2, and 3 BHK apartments. Enjoy a future-ready location with excellent connectivity and a plethora of lifestyle amenities. Perfect for families and professionals seeking a blend of comfort and convenience.",
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
    description: "Today Global Group, established in 2004 has become a name to be reckoned with as one of the leading developers in Navi Mumbai. At Today Global Group, we are proud of the reputation we have built. It is our commitment to the highest levels of customer service, practicing due diligence and transparency that has seen us grow in short span of 15 years. We strive to be different to others in our market and go the extra mile when it comes to quality and customer service. We believe that professionalism and innovation are the stepping-stones for success."
  },
  reraNumber: "P52000048037",
  otherProjectsNaviMumbai: [
    {
      title: "Paradise Sai W...",
      location: "Kharghar, Navi Mumbai",
      bhk: "2, 3, 4 BHK",
      area: "790 - 2095 SQ.FT",
      price: "₹1.17 Cr"
    },
    {
      title: "Today Royal Ai...",
      location: "Kharghar, Navi Mumbai",
      bhk: "1, 2 BHK",
      area: "363 - 590 SQ.FT",
      price: "₹42.48 Lakh"
    },
    {
      title: "Today Global M...",
      location: "Kharghar, Navi Mumbai",
      bhk: "1, 2 BHK",
      area: "340.03 - 523.36 SQ.FT",
      price: "₹39.95 Lakh"
    }
  ],
  otherProjectsTodayGlobal: [
    {
      title: "Today Global M...",
      location: "Shilphata, Navi Mumbai",
      bhk: "1, 2 BHK",
      area: "340.03 - 523.36 SQ.FT",
      price: "₹39.95 Lakh"
    },
    {
      title: "Today Anandam ...",
      location: "Old Panvel, Navi Mumbai",
      bhk: "2 BHK",
      area: "429 - 1200 SQ.FT",
      price: "₹90.00 Lakh"
    },
    {
      title: "Today Codename...",
      location: "Kharghar, Navi Mumbai",
      bhk: "1, 2, 3, 4, 5 BHK",
      area: "429 - 1376 SQ.FT",
      price: "₹60.09 Lakh"
    }
  ]
};

// Icons Components
const Icons = {
  Location: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Building: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  Home: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Playground: () => (
    <svg className="w-12 h-12 mx-auto mb-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21h18M5 21v-8l7-5 7 5v8M9 10V7a3 3 0 016 0v3" />
    </svg>
  ),
  Jogging: () => (
    <svg className="w-12 h-12 mx-auto mb-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  Yoga: () => (
    <svg className="w-12 h-12 mx-auto mb-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Pool: () => (
    <svg className="w-12 h-12 mx-auto mb-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  ),
  Info: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Heart: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  ExternalLink: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  )
};

export default function PropertyPage() {
  const getIcon = (iconName) => {
    const iconMap = {
      playground: <Icons.Playground />,
      jogging: <Icons.Jogging />,
      yoga: <Icons.Yoga />,
      pool: <Icons.Pool />
    };
    return iconMap[iconName] || <Icons.Playground />;
  };

  return (
    <>
      <Head>
        <title>{propertyData.title} - {propertyData.location.area}, {propertyData.location.city}</title>
        <meta name="description" content={propertyData.about} />
      </Head>

      <div className="min-h-screen bg-gray-100">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <nav className="flex text-sm text-gray-600">
              <Link href="/" className="hover:text-orange-500">Home</Link>
              <span className="mx-2">›</span>
              <Link href="/navi-mumbai" className="hover:text-orange-500">Navi Mumbai</Link>
              <span className="mx-2">›</span>
              <Link href="/kharghar" className="hover:text-orange-500">Kharghar</Link>
              <span className="mx-2">›</span>
              <span className="text-gray-900 font-medium">{propertyData.title}</span>
            </nav>
          </div>
        </div>

        {/* Main Header */}
        <div className="bg-white">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  {propertyData.title}
                  {propertyData.rera && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">
                      RERA
                    </span>
                  )}
                </h1>
                <p className="text-gray-600 mt-1">By <span className="font-semibold text-gray-900">{propertyData.developer}</span></p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{propertyData.priceRange}</div>
                <div className="text-sm text-gray-600">{propertyData.pricePerSqft}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Main Video/Image */}
              <div className="md:col-span-2 relative">
                <div className="relative h-64 md:h-80 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 cursor-pointer hover:bg-white/30 transition">
                        <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.841z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium">Watch on YouTube</p>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-red-600 text-white px-3 py-1 rounded font-bold text-lg">
                    {propertyData.location.area.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Gallery */}
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className={`relative bg-gray-200 rounded-lg overflow-hidden ${item === 4 ? 'flex items-center justify-center bg-blue-600 text-white font-medium cursor-pointer hover:bg-blue-700 transition' : 'h-32'}`}>
                    {item === 4 ? 'See More' : (
                      <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex gap-6 overflow-x-auto">
              {['Configurations', 'Floor Plans', 'About', 'Amenities', 'Nearby Places', 'Developer', 'Project Brochure', 'RERA', 'Other Projects'].map((tab, index) => (
                <button
                  key={tab}
                  className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${index === 0 ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Configurations & Price */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Configurations & Price</h2>
                <div className="space-y-4">
                  {propertyData.configurations.map((config, index) => (
                    <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${index !== propertyData.configurations.length - 1 ? 'border-b' : ''}`}>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                          <Icons.Home />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{config.type}</h3>
                          <p className="text-sm text-gray-600">{config.details}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">{config.area}</div>
                        <div className="font-bold text-orange-600">{config.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floor Plan */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Floor Plan</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    {propertyData.floorPlans.map((plan, index) => (
                      <button
                        key={index}
                        className={`w-full text-left p-4 rounded-lg border ${index === 0 ? 'border-orange-500 bg-orange-50' : 'hover:bg-gray-50'}`}
                      >
                        <div className={`font-bold ${index === 0 ? 'text-orange-600' : 'text-gray-900'}`}>{plan.type}</div>
                        <div className="text-sm text-gray-600">{plan.area}</div>
                      </button>
                    ))}
                  </div>
                  <div className="relative bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg" />
                    <button className="relative bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition">
                      Login To View Floor Plan
                    </button>
                  </div>
                </div>
              </div>

              {/* About */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About {propertyData.title}</h2>
                <p className="text-gray-700 leading-relaxed">{propertyData.about}</p>
              </div>

              {/* Amenities */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Project Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {propertyData.amenities.map((amenity, index) => (
                    <div key={index} className="text-center">
                      {getIcon(amenity.icon)}
                      <div className="text-sm text-gray-700">{amenity.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nearby Places */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Places near by {propertyData.title}</h2>
                <div className="relative bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center">
                    <div className="bg-white p-4 rounded-lg shadow-md max-w-sm">
                      <p className="text-sm text-gray-700 mb-3">This page can't load Google Maps correctly.</p>
                      <button className="text-xs bg-gray-100 px-3 py-1 rounded">OK</button>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 flex-wrap">
                  {['Schools', 'Hospitals', 'Restaurants', 'Shopping'].map((tag) => (
                    <button key={tag} className="px-4 py-2 border rounded-full text-sm hover:bg-gray-50 transition flex items-center gap-2">
                      {tag === 'Schools' && <span className="text-orange-500">🏫</span>}
                      {tag === 'Hospitals' && <span>🏥</span>}
                      {tag === 'Restaurants' && <span>🍽️</span>}
                      {tag === 'Shopping' && <span>🛍️</span>}
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* About Developer */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">About Developer</h2>
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-red-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
                      TODAY
                    </div>
                    <div>
                      <div className="font-bold text-lg">{propertyData.developerInfo.name}</div>
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border-l">
                      <div className="text-sm text-gray-600">Establishment Year</div>
                      <div className="text-2xl font-bold text-gray-900">{propertyData.developerInfo.establishmentYear}</div>
                    </div>
                    <div className="text-center p-4 border-l">
                      <div className="text-sm text-gray-600">Listed Projects</div>
                      <div className="text-2xl font-bold text-gray-900">{propertyData.developerInfo.listedProjects}</div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-3">{propertyData.developerInfo.description}</p>
                <button className="text-orange-600 font-semibold text-sm hover:underline">Read More</button>
              </div>

              {/* Brochure */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{propertyData.title} Brochure</h2>
                <div className="relative bg-gradient-to-br from-purple-200 to-blue-200 rounded-lg h-48 flex items-center justify-center">
                  <button className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Login To View
                  </button>
                </div>
              </div>

              {/* RERA */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">RERA NUMBERS</h2>
                <div className="border-t pt-4">
                  <div className="font-mono font-bold text-gray-900">{propertyData.reraNumber}</div>
                  <div className="text-sm text-gray-600">Registered with MahaRERA</div>
                </div>
              </div>

              {/* Other Projects in Navi Mumbai */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Projects in Navi Mumbai</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {propertyData.otherProjectsNaviMumbai.map((project, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition">
                      <div className="h-40 bg-gradient-to-br from-blue-400 to-blue-600" />
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-1">{project.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{project.location}</p>
                        <div className="text-sm text-gray-700 mb-1">{project.bhk}</div>
                        <div className="text-sm text-gray-600 mb-3">{project.area}</div>
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-gray-900">{project.price}</div>
                          <button className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white hover:bg-gray-800">
                            <Icons.ExternalLink />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Other Projects by Today Global */}
              <div className="mt-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Projects by {propertyData.developer}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {propertyData.otherProjectsTodayGlobal.map((project, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition">
                      <div className="h-40 bg-gradient-to-br from-green-400 to-blue-500" />
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-1">{project.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{project.location}</p>
                        <div className="text-sm text-gray-700 mb-1">{project.bhk}</div>
                        <div className="text-sm text-gray-600 mb-3">{project.area}</div>
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-gray-900">{project.price}</div>
                          <button className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white hover:bg-gray-800">
                            <Icons.ExternalLink />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-white rounded-lg shadow-sm border p-6 text-sm text-gray-600">
                <h3 className="font-bold text-gray-900 mb-2">*Disclaimer</h3>
                <p className="leading-relaxed">
                  Disclaimer: Brickbola (RERA Registration No. A5200009843) acts merely as an intermediary platform for posting property-related information as provided by sellers, developers, or us. While Brickbola endeavors to verify the requirement of RERA registration for listed properties, the advertiser may claim that such registration is not applicable. Users are advised to exercise discretion and verify independently. The property data and other content displayed on the website have not been physically verified by Brickbola, and no representation or warranty is made as to their accuracy, completeness, or reliability. Users must conduct their own due diligence, including legal, financial, and site inspections, before making any investment or purchase decisions. Nothing contained on this platform shall be construed as legal advice, solicitation, or an offer to invest or purchase property. Brickbola shall not be held responsible for any loss or damage arising out of reliance on the content provided herein.
                </p>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Project Details Card */}
              <div className="bg-orange-50 rounded-lg border border-orange-200 p-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="text-orange-600 mt-0.5"><Icons.Location /></div>
                    <div>
                      <div className="text-xs text-gray-600">Project Location</div>
                      <div className="font-semibold text-gray-900">{propertyData.projectDetails.location}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-orange-600 mt-0.5"><Icons.Calendar /></div>
                    <div>
                      <div className="text-xs text-gray-600">Possession Date</div>
                      <div className="font-semibold text-gray-900">{propertyData.projectDetails.possessionDate}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-orange-600 mt-0.5"><Icons.Building /></div>
                    <div>
                      <div className="text-xs text-gray-600">Developer</div>
                      <div className="font-semibold text-gray-900">{propertyData.projectDetails.developer}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-orange-600 mt-0.5"><Icons.Home /></div>
                    <div>
                      <div className="text-xs text-gray-600">Products</div>
                      <div className="font-semibold text-gray-900">{propertyData.projectDetails.products}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* EMI Calculator */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="mb-4">
                  <div className="text-sm text-gray-600">Own this property from just</div>
                  <div className="text-2xl font-bold text-orange-600">{propertyData.projectDetails.emi}<span className="text-sm text-gray-600 font-normal">/month</span></div>
                  <button className="text-xs border border-orange-500 text-orange-600 px-2 py-1 rounded mt-2 hover:bg-orange-50">
                    Calculate Now
                  </button>
                </div>
                <div className="text-xs text-gray-500 mb-4">Note: This is an estimate, actual amount may vary.</div>
                <div className="grid grid-cols-3 gap-2 text-center mb-4">
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="font-bold text-gray-900">{propertyData.projectDetails.downPayment}</div>
                    <div className="text-xs text-gray-600">Down payment</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="font-bold text-gray-900">{propertyData.projectDetails.interestRate}</div>
                    <div className="text-xs text-gray-600">Interest Rates</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="font-bold text-gray-900">{propertyData.projectDetails.tenure}</div>
                    <div className="text-xs text-gray-600">Tenure (Years)</div>
                  </div>
                </div>
                <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition mb-4">
                  ENQUIRE NOW
                </button>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <div className="font-semibold text-gray-900">Still deciding?</div>
                    <div className="text-sm text-gray-600">Shortlist this property for now & easily come back to it later.</div>
                  </div>
                  <button className="text-gray-400 hover:text-red-500 transition">
                    <Icons.Heart />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}