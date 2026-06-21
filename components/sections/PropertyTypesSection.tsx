'use client';

import { motion } from "framer-motion";
import { MapPin, ArrowRight, Star } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// ✅ ADD city PROP
interface PropertyTypesSectionProps {
  city: 'Pune' | 'Mumbai' | 'KDMC';
}

const cities = [
  { name: "Mumbai", slug: "mumbai", projects: 48, image: "/popular cities/MUMBAI.webp", popular: true },
  { name: "Pune", slug: "pune", projects: 31, image: "/popular cities/PUNE.webp", popular: false },
  { name: "KDMC", slug: "kdmc", projects: 24, image: "/popular cities/KDMC.webp", popular: true },
  { name: "Thane", slug: "thane", projects: 12, image: "/popular cities/THANE.webp", popular: false },
  { name: "Navi Mumbai", slug: "navi-mumbai", projects: 37, image: "/popular cities/NAVIMUMBAI.webp", popular: true }
];

export default function PropertyTypesSection({ city }: PropertyTypesSectionProps) {
  const [activeCity, setActiveCity] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  // ✅ FIX: Use proper ease type with 'as const'
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.4, 
        ease: [0.22, 1, 0.36, 1] as const 
      } 
    }
  };

  // Sort cities to show popular ones first
  const sortedCities = [...cities].sort((a, b) => {
    if (a.popular && !b.popular) return -1;
    if (!a.popular && b.popular) return 1;
    return 0;
  });

  return (
    <section className="pt-6 md:pt-8 pb-10 md:pb-14 bg-white">
      <div className="max-w-7xl mx-auto px-6">
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
            <h2 className="section-title text-gray-900">
              Popular Cities
            </h2>
            <p className="text-gray-500 mt-3 max-w-2xl">
              Discover the most sought-after real estate destinations with the best investment opportunities
            </p>
          </div>
          <Link 
            href="/locations"
            className="group inline-flex items-center gap-2 text-[#005E60] font-semibold hover:text-[#8B0000] transition-colors"
          >
            View All Cities
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {sortedCities.map((cityItem, index) => {
            const isActive = activeCity === cityItem.name;
            
            return (
              <motion.div
                key={cityItem.name}
                variants={itemVariants}
                transition={{ delay: index * 0.05 }}
                onMouseEnter={() => setActiveCity(cityItem.name)}
                onMouseLeave={() => setActiveCity(null)}
                className="group cursor-pointer"
              >
                <Link href={`/locations/${cityItem.slug}`}>
                  <div className={`
                    relative aspect-[3/4] rounded-2xl overflow-hidden
                    border-2 transition-all duration-300
                    ${isActive 
                      ? 'border-[#005E60] shadow-lg scale-[1.03]' 
                      : 'border-transparent shadow-sm hover:shadow-md hover:border-gray-200'
                    }
                    ${cityItem.popular ? 'ring-2 ring-[#F8C21C]/50 ring-offset-2' : ''}
                  `}>
                    <Image
                      src={cityItem.image}
                      alt={cityItem.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 220px"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    
                    {/* Popular Badge */}
                    {cityItem.popular && (
                      <div className="absolute top-3 right-3">
                        <div className="flex items-center gap-1 bg-[#F8C21C]/90 backdrop-blur-sm px-2 py-1 rounded-full">
                          <Star size={12} className="text-[#8B0000] fill-[#8B0000]" />
                          <span className="text-[#8B0000] text-xs font-bold">POPULAR</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin size={14} className="text-[#F8C21C]" />
                        <span className="text-white/80 text-xs font-medium">{cityItem.projects} Projects</span>
                      </div>
                      <h3 className="text-lg font-bold text-white group-hover:text-[#F8C21C] transition-colors">
                        {cityItem.name}
                      </h3>
                    </div>
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

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-500">
            Can&apos;t find your city? <Link href="/contact" className="text-[#005E60] font-medium hover:underline">Contact us</Link> and we&apos;ll help you explore more locations.
          </p>
        </motion.div>
      </div>
    </section>
  );
}