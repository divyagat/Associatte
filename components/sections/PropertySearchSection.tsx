'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Home, Map, Store, MapPin, ArrowRight, CheckCircle2 
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store/store';
import { 
  setSelectedPropertyType, 
  setSelectedCity, 
  setHoveredPropertyType, 
  setHoveredCity 
} from '@/store/propertySlice';
import { useState, useEffect } from 'react';

// --- Data ---
const propertyTypes = [
  { id: 'office', title: 'Office Space', desc: 'Give Your Business a Presence in Prime Location, Witness the most luxurious working atmosphere.', icon: Building2 },
  { id: 'residential', title: 'Residential Apartment', desc: 'Find verified listings of luxury residential apartments for sale / Rent posted from verified owner.', icon: Home },
  { id: 'land', title: 'Land', desc: 'Buy, rent or sale of residential and commercial in your location.', icon: Map },
  { id: 'commercial', title: 'Commercial', desc: 'Get details of all the Commercial property For Sale in prime location, Office Space, Shops, Showrooms etc.', icon: Store }
];

const cities = [
  { name: 'Mumbai', projects: 48 },
  { name: 'Pune', projects: 31 },
  { name: 'Bangaluru', projects: 14 },
  { name: 'KDMC', projects: 24 },
  { name: 'Thane', projects: 12 },
  { name: 'Navi Mumbai', projects: 37 }
];

// --- Animated Counter Hook ---
function useAnimatedCount(target: number, trigger: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const duration = 1500;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, trigger]);
  return count;
}

// --- Property Card ---
function PropertyCard({ item }: { item: typeof propertyTypes[0] }) {
  const dispatch = useDispatch();
  const { selectedPropertyType, hoveredPropertyType } = useSelector((s: RootState) => s.property);
  const isSelected = selectedPropertyType === item.id;
  const isHovered = hoveredPropertyType === item.id;
  const Icon = item.icon;

  return (
    <motion.div
      layout
      whileHover={{ y: -6 }}
      onClick={() => dispatch(setSelectedPropertyType(isSelected ? null : item.id))}
      onMouseEnter={() => dispatch(setHoveredPropertyType(item.id))}
      onMouseLeave={() => dispatch(setHoveredPropertyType(null))}
      className={`
        relative cursor-pointer rounded-2xl p-6 text-center
        border transition-all duration-300 overflow-hidden group
        ${isSelected 
          ? 'bg-[#005E60]/5 border-[#005E60] shadow-lg shadow-[#005E60]/10' 
          : 'bg-white border-gray-100 hover:border-[#005E60]/30 hover:shadow-xl'
        }
      `}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
    >
      {/* Selection Indicator */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute top-3 right-3 text-[#005E60]"
          >
            <CheckCircle2 className="w-5 h-5" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icon Container */}
      <div className={`
        w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center
        transition-all duration-300
        ${isSelected ? 'bg-[#005E60] text-white' : 'bg-gray-50 text-[#005E60] group-hover:bg-[#005E60] group-hover:text-white'}
      `}>
        <Icon className="w-7 h-7" strokeWidth={1.5} />
      </div>

      {/* Content */}
      <h3 className="text-lg font-bold text-gray-900 mb-2 tracking-tight">
        {item.title.toUpperCase()}
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
        {item.desc}
      </p>

      {/* Hover Arrow */}
      <motion.div
        className="mt-4 flex items-center justify-center gap-1 text-[#005E60] text-sm font-semibold"
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 8 }}
      >
        <span>Explore</span>
        <ArrowRight className="w-4 h-4" />
      </motion.div>
    </motion.div>
  );
}

// --- City Card ---
function CityCard({ city }: { city: typeof cities[0] }) {
  const dispatch = useDispatch();
  const { selectedCity, hoveredCity } = useSelector((s: RootState) => s.property);
  const isSelected = selectedCity === city.name;
  const isHovered = hoveredCity === city.name;
  const animatedProjects = useAnimatedCount(city.projects, isHovered || isSelected);

  return (
    <motion.div
      layout
      whileHover={{ x: 4 }}
      onClick={() => dispatch(setSelectedCity(isSelected ? null : city.name))}
      onMouseEnter={() => dispatch(setHoveredCity(city.name))}
      onMouseLeave={() => dispatch(setHoveredCity(null))}
      className={`
        cursor-pointer rounded-xl p-4 flex items-center gap-4
        border transition-all duration-300 group
        ${isSelected 
          ? 'bg-[#8B0000]/5 border-[#8B0000]/40 shadow-md' 
          : 'bg-white border-gray-100 hover:border-[#8B0000]/20 hover:shadow-lg'
        }
      `}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
    >
      {/* City Icon */}
      <div className={`
        w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0
        transition-all duration-300
        ${isSelected ? 'bg-[#8B0000] text-white' : 'bg-[#8B0000]/10 text-[#8B0000] group-hover:bg-[#8B0000] group-hover:text-white'}
      `}>
        <MapPin className="w-5 h-5" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className={`font-bold text-base transition-colors ${isSelected ? 'text-[#8B0000]' : 'text-[#005E60] group-hover:text-[#8B0000]'}`}>
          {city.name}
        </h4>
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-700">{animatedProjects}</span> Projects
        </p>
      </div>

      {/* Arrow */}
      <motion.div
        className="text-[#8B0000]"
        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -4 }}
      >
        <ArrowRight className="w-4 h-4" />
      </motion.div>
    </motion.div>
  );
}

// --- Main Section ---
export default function PropertySearchSection() {
  const { selectedPropertyType, selectedCity } = useSelector((s: RootState) => s.property);

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 space-y-20">
        
        {/* ===== SECTION 1: Property Types ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#005E60] font-montserrat mb-2">
            What are you looking for?
          </h2>
          <div className="w-16 h-1 bg-[#F8C21C] mx-auto rounded-full mb-10"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {propertyTypes.map((type) => (
              <PropertyCard key={type.id} item={type} />
            ))}
          </div>

          {/* Selection Feedback */}
          <AnimatePresence>
            {selectedPropertyType && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-[#005E60]/10 text-[#005E60] rounded-full text-sm font-medium"
              >
                <CheckCircle2 className="w-4 h-4" />
                Selected: {propertyTypes.find(t => t.id === selectedPropertyType)?.title}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ===== SECTION 2: Cities ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#005E60] font-montserrat mb-2">
            Choose Your City
          </h2>
          <div className="w-16 h-1 bg-[#F8C21C] mx-auto rounded-full mb-10"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {cities.map((city) => (
              <CityCard key={city.name} city={city} />
            ))}
          </div>

          {/* Selection Feedback */}
          <AnimatePresence>
            {selectedCity && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-[#8B0000]/10 text-[#8B0000] rounded-full text-sm font-medium"
              >
                <MapPin className="w-4 h-4" />
                Selected: {selectedCity}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}