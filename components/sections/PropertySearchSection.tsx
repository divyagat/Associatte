// @/components/sections/PropertySearchSection.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Home, Map, Store, MapPin, ArrowRight, Check, Sparkles } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store/store';
import { setSelectedPropertyType, setSelectedCity, setHoveredPropertyType, setHoveredCity } from '@/store/propertySlice';

// --- Data ---
const propertyTypes = [
  { id: 'office', title: 'Office Space', desc: 'Premium corporate spaces in prime business locations', icon: Building2 },
  { id: 'residential', title: 'Residential', desc: 'Luxury apartments and homes for modern living', icon: Home },
  { id: 'land', title: 'Land & Plots', desc: 'Prime land parcels in emerging growth corridors', icon: Map },
  { id: 'commercial', title: 'Commercial', desc: 'Retail and commercial spaces with high visibility', icon: Store }
];

const cities = [
  { name: 'Mumbai', projects: 48 },
  { name: 'Pune', projects: 31 },
  { name: 'Bangaluru', projects: 14 },
  { name: 'KDMC', projects: 24 },
  { name: 'Thane', projects: 12 },
  { name: 'Navi Mumbai', projects: 37 }
];

// --- Property Card ---
function PropertyCard({ item }: { item: typeof propertyTypes[0] }) {
  const dispatch = useDispatch();
  const propertyState = useSelector((s: RootState) => s.property);
  const selected = propertyState?.selectedPropertyType === item.id;
  const hovered = propertyState?.hoveredPropertyType === item.id;
  const Icon = item.icon;

  return (
    <motion.button
      onClick={() => dispatch(setSelectedPropertyType(selected ? null : item.id))}
      onMouseEnter={() => dispatch(setHoveredPropertyType(item.id))}
      onMouseLeave={() => dispatch(setHoveredPropertyType(null))}
      className={`
        group relative w-full text-left p-6 rounded-2xl border-2 transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-[#005E60]/40 focus:ring-offset-2
        ${selected 
          ? 'bg-gradient-to-br from-[#005E60] to-[#004a4c] border-[#005E60] text-white shadow-xl shadow-[#005E60]/20' 
          : 'bg-white border-gray-100 hover:border-[#005E60]/40 hover:shadow-xl hover:shadow-[#005E60]/10'
        }
      `}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      role="checkbox"
      aria-checked={selected}
    >
      {/* Decorative Top Pattern */}
      <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl transition-opacity duration-300 ${
        selected ? 'bg-white/20' : 'bg-gradient-to-r from-[#F8C21C] via-[#005E60] to-[#F8C21C] opacity-0 group-hover:opacity-100'
      }`}></div>

      {/* Selection Badge */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute -top-2 -right-2"
          >
            <div className="flex items-center gap-1 px-2.5 py-1 bg-[#F8C21C] text-[#1B365D] text-xs font-bold rounded-full shadow-lg">
              <Check className="w-3 h-3" />
              <span>Selected</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icon Container */}
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 ${
        selected 
          ? 'bg-white/15 shadow-inner' 
          : 'bg-gradient-to-br from-[#005E60]/10 to-[#005E60]/5 group-hover:from-[#005E60]/20 group-hover:to-[#005E60]/10'
      }`}>
        <Icon className={`w-7 h-7 transition-colors duration-300 ${
          selected ? 'text-white' : 'text-[#005E60]'
        }`} strokeWidth={1.5} />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 className={`font-bold text-lg leading-tight transition-colors duration-300 ${
          selected ? 'text-white' : 'text-gray-900 group-hover:text-[#005E60]'
        }`}>
          {item.title}
        </h3>
        <p className={`text-sm leading-relaxed transition-colors duration-300 ${
          selected ? 'text-white/85' : 'text-gray-500 group-hover:text-gray-600'
        }`}>
          {item.desc}
        </p>
      </div>

      {/* CTA */}
      <motion.div
        className={`mt-5 flex items-center gap-2 text-sm font-semibold transition-colors duration-300 ${
          selected ? 'text-white/90' : 'text-[#005E60]'
        }`}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: hovered || selected ? 1 : 0, x: hovered || selected ? 0 : -8 }}
        transition={{ duration: 0.2 }}
      >
        <span>View Listings</span>
        <motion.div
          animate={{ x: [0, 3, 0] }}
          transition={{ repeat: hovered || selected ? Infinity : 0, duration: 1.2, ease: "easeInOut" }}
        >
          <ArrowRight className="w-4 h-4" />
        </motion.div>
      </motion.div>

      {/* Bottom Accent Line */}
      <div className={`absolute bottom-0 left-6 right-6 h-px transition-all duration-300 ${
        selected ? 'bg-white/30' : 'bg-gradient-to-r from-transparent via-[#F8C21C]/60 to-transparent opacity-0 group-hover:opacity-100'
      }`}></div>
    </motion.button>
  );
}

// --- City Card ---
function CityCard({ city }: { city: typeof cities[0] }) {
  const dispatch = useDispatch();
  const propertyState = useSelector((s: RootState) => s.property);
  const selected = propertyState?.selectedCity === city.name;
  const hovered = propertyState?.hoveredCity === city.name;

  return (
    <motion.button
      onClick={() => dispatch(setSelectedCity(selected ? null : city.name))}
      onMouseEnter={() => dispatch(setHoveredCity(city.name))}
      onMouseLeave={() => dispatch(setHoveredCity(null))}
      className={`
        group w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-[#8B0000]/40 focus:ring-offset-2
        ${selected 
          ? 'bg-gradient-to-r from-[#8B0000]/10 to-[#8B0000]/5 border-[#8B0000]/50 shadow-md' 
          : 'bg-white border-gray-100 hover:border-[#8B0000]/30 hover:shadow-lg'
        }
      `}
      whileHover={{ x: 6 }}
      whileTap={{ scale: 0.99 }}
      role="checkbox"
      aria-checked={selected}
    >
      {/* Icon Container */}
      <div className={`relative w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
        selected 
          ? 'bg-[#8B0000] text-white shadow-lg shadow-[#8B0000]/30' 
          : 'bg-gradient-to-br from-[#8B0000]/10 to-[#8B0000]/5 text-[#8B0000] group-hover:from-[#8B0000] group-hover:to-[#6b0000] group-hover:text-white'
      }`}>
        <MapPin className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
        
        {/* Animated Ring */}
        {selected && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[#8B0000]/30"
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 text-left min-w-0">
        <h4 className={`font-bold text-base mb-0.5 transition-colors duration-300 ${
          selected ? 'text-[#8B0000]' : 'text-gray-900 group-hover:text-[#8B0000]'
        }`}>
          {city.name}
        </h4>
        <p className="text-sm text-gray-500">
          <span className={`font-bold ${selected ? 'text-[#8B0000]' : 'text-gray-700'}`}>
            {city.projects}
          </span>
          <span className="text-gray-400 ml-1">projects</span>
        </p>
      </div>

      {/* Arrow */}
      <motion.div
        className={`flex-shrink-0 transition-colors duration-300 ${
          selected ? 'text-[#8B0000]' : 'text-[#8B0000]/60 group-hover:text-[#8B0000]'
        }`}
        animate={{ 
          opacity: hovered || selected ? 1 : 0, 
          x: hovered || selected ? 0 : -6 
        }}
        transition={{ duration: 0.2 }}
      >
        <ArrowRight className="w-5 h-5" />
      </motion.div>

      {/* Selection Dot */}
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-2.5 h-2.5 bg-[#8B0000] rounded-full border-2 border-white shadow-sm"
        />
      )}
    </motion.button>
  );
}

// --- Section Header ---
function SectionHeader({ badge, title, accentColor }: { badge: string; title: string; accentColor: string }) {
  return (
    <div className="text-center mb-12">
      <motion.span 
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#F8C21C]/15 text-[#1B365D] text-xs font-bold uppercase tracking-wide rounded-full mb-4 border border-[#F8C21C]/30"
      >
        <Sparkles className="w-3.5 h-3.5" />
        {badge}
      </motion.span>
      
      <h2 className="text-3xl md:text-4xl font-bold text-[#1B365D] font-montserrat tracking-tight">
        {title}
      </h2>
      
      <div className="flex items-center justify-center gap-2 mt-5">
        <div className="w-10 h-0.5 bg-gradient-to-r from-transparent to-[#F8C21C]"></div>
        <div className="w-2.5 h-2.5 bg-[#F8C21C] rotate-45 shadow-sm"></div>
        <div className="w-10 h-0.5 bg-gradient-to-l from-transparent to-[#F8C21C]"></div>
      </div>
    </div>
  );
}

// --- Main Section ---
export default function PropertySearchSection() {
  const propertyState = useSelector((s: RootState) => s.property);
  const selectedType = propertyState?.selectedPropertyType ?? null;
  const selectedCity = propertyState?.selectedCity ?? null;

  return (
    <section className="py-24 bg-gradient-to-b from-white via-[#FDFBFA] to-gray-50">
      <div className="max-w-7xl mx-auto px-6 space-y-24">
        
        {/* ===== Property Types ===== */}
        <div>
          <SectionHeader badge="Explore Properties" title="What are you looking for?" accentColor="#005E60" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {propertyTypes.map((type, i) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <PropertyCard item={type} />
              </motion.div>
            ))}
          </div>

          {/* Selection Feedback */}
          <AnimatePresence mode="wait">
            {selectedType && (
              <motion.div
                key={selectedType}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="mt-8 flex justify-center"
              >
                <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-gradient-to-r from-[#005E60] to-[#004a4c] text-white rounded-full text-sm font-medium shadow-lg shadow-[#005E60]/25">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                    <Check className="w-4 h-4" />
                  </motion.div>
                  <span>Selected:</span>
                  <span className="font-bold text-[#F8C21C]">
                    {propertyTypes.find(t => t.id === selectedType)?.title}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ===== Cities ===== */}
        <div>
          <SectionHeader badge="Prime Locations" title="Choose Your City" accentColor="#8B0000" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {cities.map((city, i) => (
              <motion.div
                key={city.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                viewport={{ once: true }}
              >
                <CityCard city={city} />
              </motion.div>
            ))}
          </div>

          {/* Selection Feedback */}
          <AnimatePresence mode="wait">
            {selectedCity && (
              <motion.div
                key={selectedCity}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="mt-8 flex justify-center"
              >
                <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-gradient-to-r from-[#8B0000] to-[#6b0000] text-white rounded-full text-sm font-medium shadow-lg shadow-[#8B0000]/25">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <MapPin className="w-4 h-4" />
                  </motion.div>
                  <span>Selected:</span>
                  <span className="font-bold text-[#F8C21C]">{selectedCity}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}