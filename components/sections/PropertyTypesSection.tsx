// @/components/sections/PropertyTypesSection.tsx
'use client';

import { motion } from "framer-motion";
import { 
  Building2, 
  Home, 
  Map, 
  Store, 
  MapPin,
  ArrowRight 
} from "lucide-react";
import { useState } from "react";

// --- Property Types Data ---
const propertyTypes = [
  {
    id: 1,
    title: "Office Space",
    description: "Give Your Business a Presence in Prime Location, Witness the most luxurious working atmosphere.",
    icon: Building2
  },
  {
    id: 2,
    title: "Residential Apartment",
    description: "Find verified listings of luxury residential apartments for sale / Rent posted from verified owner.",
    icon: Home
  },
  {
    id: 3,
    title: "Land",
    description: "Buy, rent or sale of residential and commercial in your location.",
    icon: Map
  },
  {
    id: 4,
    title: "Commercial",
    description: "Get details of all the Commercial property For Sale in prime location, Office Space, Shops, Showrooms etc.",
    icon: Store
  }
];

// --- Cities Data ---
const cities = [
  { name: "Mumbai", projects: 48 },
  { name: "Pune", projects: 31 },
  { name: "Bangaluru", projects: 14 },
  { name: "KDMC", projects: 24 },
  { name: "Thane", projects: 12 },
  { name: "Navi Mumbai", projects: 37 }
];

export default function PropertyTypesSection() {
  const [hoveredProperty, setHoveredProperty] = useState<number | null>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  return (
    <>
      {/* ================= SECTION 1: What are you looking for? ================= */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#005E60] font-montserrat">
              What are you looking for?
            </h2>
            <div className="w-20 h-1 bg-[#F8C21C] mx-auto mt-4 rounded-full"></div>
          </motion.div>

          {/* Property Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {propertyTypes.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                onMouseEnter={() => setHoveredProperty(property.id)}
                onMouseLeave={() => setHoveredProperty(null)}
                className="group cursor-pointer"
              >
                <div className={`
                  bg-white rounded-xl p-8 text-center h-full
                  border border-gray-100 
                  transition-all duration-300 ease-out
                  ${hoveredProperty === property.id 
                    ? 'shadow-lg border-[#005E60]/20 -translate-y-2' 
                    : 'shadow-sm hover:shadow-md'
                  }
                `}>
                  
                  {/* Icon Container */}
                  <div className={`
                    w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center
                    transition-all duration-300
                    ${hoveredProperty === property.id 
                      ? 'bg-[#005E60] text-white scale-110' 
                      : 'bg-[#005E60]/10 text-[#005E60]'
                    }
                  `}>
                    <property.icon className="w-8 h-8" strokeWidth={1.5} />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
                    {property.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {property.description}
                  </p>

                  {/* Hover Arrow */}
                  <div className={`
                    mt-4 flex items-center justify-center gap-2 text-[#005E60] text-sm font-semibold
                    transition-all duration-300
                    ${hoveredProperty === property.id ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
                  `}>
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: Choose Your City ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#005E60] font-montserrat">
              Choose Your City
            </h2>
            <div className="w-20 h-1 bg-[#F8C21C] mx-auto mt-4 rounded-full"></div>
          </motion.div>

          {/* Cities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cities.map((city, index) => (
              <motion.div
                key={city.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                viewport={{ once: true }}
                onMouseEnter={() => setHoveredCity(city.name)}
                onMouseLeave={() => setHoveredCity(null)}
                className="group cursor-pointer"
              >
                <div className={`
                  bg-white rounded-xl p-5 flex items-center gap-4
                  border border-gray-100 
                  transition-all duration-300 ease-out
                  ${hoveredCity === city.name 
                    ? 'shadow-lg border-[#8B0000]/20 -translate-x-2' 
                    : 'shadow-sm hover:shadow-md'
                  }
                `}>
                  
                  {/* City Icon */}
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0
                    transition-all duration-300
                    ${hoveredCity === city.name 
                      ? 'bg-[#8B0000] text-white scale-110' 
                      : 'bg-[#8B0000]/10 text-[#8B0000]'
                    }
                  `}>
                    <MapPin className="w-6 h-6" />
                  </div>

                  {/* City Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#005E60] group-hover:text-[#8B0000] transition-colors">
                      {city.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {city.projects} Projects
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className={`
                    text-[#8B0000] transition-all duration-300
                    ${hoveredCity === city.name ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}
                  `}>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}