// app/locations/page.tsx
'use client';

import { motion } from "framer-motion";
import { MapPin, ArrowRight, Star, Building2, Home, TrendingUp, Search, Phone, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import EnquiryPopup from "../../components/common/EnquiryPopup";

interface LocationData {
  name: string;
  slug: string;
  projects: number;
  image: string;
  popular: boolean;
  description: string;
  priceRange: string;
  tags: string[];
}

const locations: LocationData[] = [
  { 
    name: "Mumbai", 
    slug: "mumbai", 
    projects: 48, 
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80", 
    popular: true,
    description: "India's financial capital with premium residential properties",
    priceRange: "₹75L - ₹5Cr+",
    tags: ["Luxury Homes", "Premium Apartments", "Sea View"]
  },
  { 
    name: "Pune", 
    slug: "pune", 
    projects: 31, 
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80", 
    popular: true,
    description: "IT hub with excellent education and lifestyle options",
    priceRange: "₹50L - ₹2.5Cr",
    tags: ["IT Corridor", "Family Homes", "Affordable Luxury"]
  },
  { 
    name: "KDMC", 
    slug: "kdmc", 
    projects: 24, 
    image: "/popular cities/KDMC.webp", 
    popular: true,
    description: "Affordable housing with excellent connectivity",
    priceRange: "₹40L - ₹1.2Cr",
    tags: ["Budget Homes", "First Time Buyers", "Good Connectivity"]
  },
  { 
    name: "Thane", 
    slug: "thane", 
    projects: 12, 
    image: "/popular cities/thane-img.webp", 
    popular: false,
    description: "Well-connected suburb with lakeside living",
    priceRange: "₹60L - ₹2Cr",
    tags: ["Lakeside Properties", "Well-Connected", "Family Friendly"]
  },
  { 
    name: "Navi Mumbai", 
    slug: "navi-mumbai", 
    projects: 37, 
    image: "/popular cities/Navi-mumbai.webp", 
    popular: true,
    description: "Planned city with modern infrastructure",
    priceRange: "₹55L - ₹3Cr",
    tags: ["Modern Infrastructure", "Airport Impact", "Green City"]
  }
];

// Stats for the page
const stats = [
  { value: "150+", label: "Premium Projects", icon: Building2 },
  { value: "25+", label: "Trusted Builders", icon: Home },
  { value: "5000+", label: "Happy Customers", icon: TrendingUp },
  { value: "12+", label: "Cities Covered", icon: MapPin },
];

export default function LocationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showPopularOnly, setShowPopularOnly] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } 
    }
  };

  // Filter locations based on search and popular filter
  const filteredLocations = locations.filter(loc => {
    const matchesSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          loc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          loc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPopular = showPopularOnly ? loc.popular : true;
    return matchesSearch && matchesPopular;
  });

  // Sort: Popular first, then by name
  const sortedLocations = [...filteredLocations].sort((a, b) => {
    if (a.popular && !b.popular) return -1;
    if (!a.popular && b.popular) return 1;
    return a.name.localeCompare(b.name);
  });

  const handlePopupSubmit = (payload: any) => {
    console.log('📩 Enquiry Submitted from Locations Page:', payload);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-[#101C2E] text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F8C21C]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#F8C21C]/10 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 py-16 md:py-20 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[#F8C21C] text-[#8B0000] px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <MapPin size={16} />
              <span>Explore Locations</span>
            </div>
            <h1 className="page-title mb-4">
              Find Your <span className="accent">Dream Home</span> Across Maharashtra
            </h1>
            <p className="text-lg text-white/90 mb-8">
              Discover premium properties in Mumbai, Pune, Navi Mumbai, and more. 
              Explore verified projects from trusted builders.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by city name, location, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F8C21C] shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-[#8B0000]/10 to-[#005E60]/10 mb-3">
                    <Icon className="w-6 h-6 text-[#005E60]" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPopularOnly(false)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  !showPopularOnly 
                    ? 'bg-[#005E60] text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Locations
              </button>
              <button
                onClick={() => setShowPopularOnly(true)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  showPopularOnly 
                    ? 'bg-[#F8C21C] text-[#8B0000] shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Star size={16} className={showPopularOnly ? 'fill-[#8B0000]' : ''} />
                Popular Only
              </button>
            </div>
            <div className="text-sm text-gray-500">
              {sortedLocations.length} locations found
            </div>
          </div>

          {/* Locations Grid */}
          {sortedLocations.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No locations found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setShowPopularOnly(false);
                }}
                className="mt-4 text-[#005E60] font-medium hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {sortedLocations.map((location) => (
                <motion.div
                  key={location.slug}
                  variants={itemVariants}
                  className="group"
                >
                  <Link href={`/locations/${location.slug}`}>
                    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                      {/* Image Section */}
                      <div className="relative h-56 overflow-hidden">
                        <Image
                          src={location.image}
                          alt={location.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        
                        {/* Popular Badge */}
                        {location.popular && (
                          <div className="absolute top-4 left-4">
                            <div className="flex items-center gap-1 bg-[#F8C21C] px-3 py-1 rounded-full">
                              <Star size={12} className="text-[#8B0000] fill-[#8B0000]" />
                              <span className="text-[#8B0000] text-xs font-bold">POPULAR</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Project Count */}
                        <div className="absolute bottom-4 left-4">
                          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                            <Building2 size={14} className="text-[#F8C21C]" />
                            <span className="text-white text-sm font-medium">{location.projects}+ Projects</span>
                          </div>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#005E60] transition-colors">
                            {location.name}
                          </h3>
                          <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {location.description}
                        </p>
                        
                        <div className="mb-3">
                          <span className="text-[#8B0000] font-bold">{location.priceRange}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {location.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <span className="text-sm text-gray-500">
                            {location.projects} properties available
                          </span>
                          <span className="inline-flex items-center gap-1 text-[#005E60] font-medium text-sm group-hover:gap-2 transition-all">
                            Explore <ArrowRight size={14} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#8B0000] to-[#005E60]">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6">
            <Phone size={14} className="text-[#F8C21C]" />
            <span className="text-white">Need Expert Advice?</span>
          </div>
          <h2 className="section-title text-white mb-4">
            Can't Find Your Preferred Location?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Our property experts have access to projects across all major cities. 
            Get personalized recommendations based on your budget and preferences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setIsPopupOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#F8C21C] text-[#8B0000] font-bold rounded-lg hover:bg-[#e6b018] transition-colors"
            >
              <Phone size={18} /> Talk to an Expert
            </button>
            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/30 transition-colors border border-white/30"
            >
              <Mail size={18} /> Send an Enquiry
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="section-title text-gray-900 mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Everything you need to know about buying property in Maharashtra
            </p>
          </div>
          
          <div className="space-y-4">
            {[
              {
                q: "Which city has the best investment potential?",
                a: "Mumbai offers premium appreciation while Pune provides balanced growth with IT sector demand. Navi Mumbai is emerging due to the new airport. Your choice depends on budget and investment horizon."
              },
              {
                q: "What is the average property price in these locations?",
                a: "Prices vary significantly: Mumbai (₹75L - ₹5Cr+), Pune (₹50L - ₹2.5Cr), Navi Mumbai (₹55L - ₹3Cr), Thane (₹60L - ₹2Cr), and KDMC (₹40L - ₹1.2Cr)."
              },
              {
                q: "Are these properties RERA registered?",
                a: "Yes, all projects listed on PropFinder are RERA registered. You can find RERA numbers on individual property pages."
              },
              {
                q: "Can I get home loan assistance?",
                a: "Absolutely! As a channel partner, we connect you with leading banks and NBFCs for the best home loan deals."
              }
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
              >
                <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry Popup */}
      <EnquiryPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        projectName="Locations across Maharashtra"
        projectTagline="Get personalized property recommendations for your preferred city"
        theme="gradient"
        showLegalLinks={true}
        formName="Locations Page Enquiry"
        onSubmit={handlePopupSubmit}
        trackingData={{
          source: 'locations_page',
          campaign: 'locations_enquiry',
          medium: 'organic',
          city: 'national'
        }}
      />
    </div>
  );
}