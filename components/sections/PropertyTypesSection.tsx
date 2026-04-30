// @/components/sections/PropertyTypesSection.tsx
'use client';

import { motion } from "framer-motion";
import { Building2, Home, Map, Store, MapPin, ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

// --- Property Types Data ---
const propertyTypes = [
  {
    id: 1,
    title: "Office Space",
    description: "Premium workspaces in prime business districts",
    icon: Building2,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
    color: "from-[#005E60] to-[#008B8B]",
    href: "/properties?type=office",
    count: "120+ Properties"
  },
  {
    id: 2,
    title: "Residential",
    description: "Luxury apartments & homes for every lifestyle",
    icon: Home,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
    color: "from-[#8B0000] to-[#A52A2A]",
    href: "/properties?type=residential",
    count: "340+ Properties"
  },
  {
    id: 3,
    title: "Land & Plots",
    description: "Invest in premium plots with clear titles",
    icon: Map,
    image: "https://images.unsplash.com/photo-1500382017468-9049fed18f3e?w=600&q=80",
    color: "from-[#2E7D32] to-[#388E3C]",
    href: "/properties?type=land",
    count: "85+ Properties"
  },
  {
    id: 4,
    title: "Commercial",
    description: "Shops, showrooms & retail spaces for growth",
    icon: Store,
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=80",
    color: "from-[#5D4037] to-[#795548]",
    href: "/properties?type=commercial",
    count: "95+ Properties"
  }
];

// --- Cities Data ---
const cities = [
  { name: "Mumbai", projects: 48, image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&q=80" },
  { name: "Pune", projects: 31, image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&q=80" },
  { name: "Bangalore", projects: 14, image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&q=80" },
  { name: "KDMC", projects: 24, image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&q=80" },
  { name: "Thane", projects: 12, image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=80" },
  { name: "Navi Mumbai", projects: 37, image: "https://images.unsplash.com/photo-1564013799919-ab39cf56b4c1?w=400&q=80" }
];

export default function PropertyTypesSection() {
  const [activeProperty, setActiveProperty] = useState<number | null>(null);
  const [activeCity, setActiveCity] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <>
      {/* ================= SECTION 1: Property Types ================= */}
      <section className="py-24 bg-gradient-to-b from-white to-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* 🎯 Premium Header */}
          <div className="text-center max-w-4xl mx-auto mb-16 relative">
            {/* Soft Background Glow */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-72 bg-gradient-to-br from-[#005E60]/5 to-[#8B0000]/5 rounded-full blur-3xl pointer-events-none" />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm mb-6"
            >
              <span className="w-2 h-2 bg-[#005E60] rounded-full animate-pulse" />
              <span className="text-[#005E60] text-xs font-bold uppercase tracking-[0.25em]">
                Discover Categories
              </span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative text-4xl md:text-6xl font-bold text-gray-900 font-montserrat leading-[1.15]"
            >
              <span className="block">Find Your Perfect</span>
              <span className="block mt-2 relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#005E60] via-[#007a7c] to-[#8B0000]">
                  Property Type
                </span>
                {/* Elegant Underline */}
                <span className="absolute -bottom-3 left-0 w-full h-1.5 bg-gradient-to-r from-[#F8C21C] to-transparent rounded-full opacity-60" />
              </span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-8 text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto"
            >
              Browse curated categories for every need and aspiration — 
              <span className="text-gray-900 font-medium"> from luxury homes to prime commercial spaces</span>.
            </motion.p>

            {/* Quick Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="mt-10 flex items-center justify-center gap-8 text-sm"
            >
              <div className="text-center">
                <p className="text-2xl font-bold text-[#005E60]">640+</p>
                <p className="text-gray-500">Properties</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <p className="text-2xl font-bold text-[#8B0000]">4</p>
                <p className="text-gray-500">Categories</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <p className="text-2xl font-bold text-[#F8C21C]">6</p>
                <p className="text-gray-500">Cities</p>
              </div>
            </motion.div>
          </div>

          {/* 📐 Property Type Cards */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {propertyTypes.map((property, index) => {
              const isActive = activeProperty === property.id;
              const Icon = property.icon;
              
              return (
                <motion.div
                  key={property.id}
                  variants={itemVariants}
                  transition={{ delay: index * 0.05 }}
                  onMouseEnter={() => setActiveProperty(property.id)}
                  onMouseLeave={() => setActiveProperty(null)}
                  className="group cursor-pointer"
                >
                  <Link href={property.href}>
                    <div className={`
                      relative aspect-[3/4] rounded-2xl overflow-hidden
                      border-2 transition-all duration-300
                      ${isActive 
                        ? 'border-[#005E60] shadow-lg scale-[1.03]' 
                        : 'border-transparent shadow-sm hover:shadow-md hover:border-gray-200'
                      }
                    `}>
                      {/* Background Image */}
                      <img 
                        src={property.image} 
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t ${property.color} opacity-85`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      
                      {/* Icon Badge */}
                      <div className="absolute top-4 left-4">
                        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                        </div>
                      </div>
                      
                      {/* Property Count Badge */}
                      <div className="absolute top-4 right-4">
                        <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-[#005E60] text-[10px] font-bold rounded-full">
                          {property.count}
                        </span>
                      </div>
                      
                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#F8C21C] transition-colors">
                          {property.title}
                        </h3>
                        <p className="text-white/85 text-xs leading-relaxed">
                          {property.description}
                        </p>
                      </div>

                      {/* Hover Arrow Indicator */}
                      <div className={`
                        absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm
                        flex items-center justify-center transition-all duration-300
                        ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100'}
                      `}>
                        <ArrowRight size={16} className="text-[#005E60]" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ================= SECTION 2: Popular Cities ================= */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Cities Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
          >
            <div>
              <span className="inline-block px-4 py-1.5 bg-[#8B0000]/10 text-[#8B0000] text-xs font-bold uppercase tracking-[0.2em] rounded-full mb-4">
                Locations
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-montserrat">
                Popular Cities
              </h2>
            </div>
            <Link 
              href="/cities"
              className="group inline-flex items-center gap-2 text-[#005E60] font-semibold hover:text-[#8B0000] transition-colors"
            >
              View All Cities
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* City Cards Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {cities.map((city, index) => {
              const isActive = activeCity === city.name;
              
              return (
                <motion.div
                  key={city.name}
                  variants={itemVariants}
                  transition={{ delay: index * 0.05 }}
                  onMouseEnter={() => setActiveCity(city.name)}
                  onMouseLeave={() => setActiveCity(null)}
                  className="group cursor-pointer"
                >
                  <Link href={`/properties?city=${city.name.toLowerCase().replace(' ', '-')}`}>
                    <div className={`
                      relative aspect-[3/4] rounded-2xl overflow-hidden
                      border-2 transition-all duration-300
                      ${isActive 
                        ? 'border-[#005E60] shadow-lg scale-[1.03]' 
                        : 'border-transparent shadow-sm hover:shadow-md hover:border-gray-200'
                      }
                    `}>
                      {/* City Image */}
                      <img 
                        src={city.image} 
                        alt={city.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      
                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin size={14} className="text-[#F8C21C]" />
                          <span className="text-white/80 text-xs font-medium">{city.projects} Projects</span>
                        </div>
                        <h3 className="text-lg font-bold text-white group-hover:text-[#F8C21C] transition-colors">
                          {city.name}
                        </h3>
                      </div>

                      {/* Hover Indicator */}
                      <div className={`
                        absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm
                        flex items-center justify-center transition-all duration-300
                        ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100'}
                      `}>
                        <ArrowRight size={16} className="text-[#005E60]" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Helper Text */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-gray-500">
              Can't find your city? <Link href="/contact" className="text-[#005E60] font-medium hover:underline">Contact us</Link> and we'll help you explore more locations.
            </p>
          </motion.div>

        </div>
      </section>
    </>
  );
}