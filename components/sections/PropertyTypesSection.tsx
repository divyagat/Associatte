// @/components/sections/PropertyTypesSection.tsx
'use client';

import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

// --- Cities Data ---
// ✅ UPDATED: Bangalore removed, slugs match your JSON location values
const cities = [
  { 
    name: "Mumbai", 
    slug: "mumbai",  // ← Matches JSON: "location": "mumbai"
    projects: 48, 
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&q=80" 
  },
  { 
    name: "Pune", 
    slug: "pune",  // ← Matches JSON: "location": "pune"
    projects: 31, 
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&q=80" 
  },
  // ❌ Bangalore removed as requested
  { 
    name: "KDMC", 
    slug: "kdmc",  // ← Matches JSON: "location": "kdmc"
    projects: 24, 
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&q=80" 
  },
  { 
    name: "Thane", 
    slug: "thane", 
    projects: 12, 
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=80" 
  },
  { 
    name: "Navi Mumbai", 
    slug: "mumbai",  // ← Navi Mumbai projects are in "mumbai" location in your JSON
    projects: 37, 
    image: "https://images.unsplash.com/photo-1564013799919-ab39cf56b4c1?w=400&q=80" 
  }
];

export default function PropertyTypesSection() {
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
    // ================= SECTION: Popular Cities =================
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
            href="/locations"
            className="group inline-flex items-center gap-2 text-[#005E60] font-semibold hover:text-[#8B0000] transition-colors"
          >
            View All Cities
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* City Cards Grid - Now 5 cards instead of 6 */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"  // ✅ Updated: lg:grid-cols-5 (was 6)
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
                <Link href={`/locations/${city.slug}`}>
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
  );
}