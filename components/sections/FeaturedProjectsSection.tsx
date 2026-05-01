// @/components/sections/FeaturedProjectsSection.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Project {
  id: number;
  badge: string;
  badgeColor: string;
  name: string;
  location: string;
  price: string;
  bhk: string;
  image: string;
}

const projects: Project[] = [
  {
    id: 1,
    badge: 'New Launch',
    badgeColor: 'bg-red-800',
    name: 'VTP Volare',
    location: 'Hinjewadi, Pune',
    price: '₹ 68 L - 1.05 Cr',
    bhk: '2 & 3 BHK Apartments',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80',
  },
  {
    id: 2,
    badge: 'Ready Possession',
    badgeColor: 'bg-teal-800',
    name: 'Godrej Green Cove',
    location: 'Mahalunge, Pune',
    price: '₹ 74 L - 1.15 Cr',
    bhk: '2 & 3 BHK Apartments',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80',
  },
  {
    id: 3,
    badge: 'New Launch',
    badgeColor: 'bg-red-800',
    name: 'Lodha Panache',
    location: 'Hinjewadi, Pune',
    price: '₹ 1.10 Cr - 1.60 Cr',
    bhk: '3 & 4 BHK Apartments',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&q=80',
  },
  {
    id: 4,
    badge: 'Investment',
    badgeColor: 'bg-teal-800',
    name: 'Rohan Harita',
    location: 'Tathawade, Pune',
    price: '₹ 55 L - 85 L',
    bhk: '1 & 2 BHK Apartments',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=80',
  },
  {
    id: 5,
    badge: 'New Launch',
    badgeColor: 'bg-red-800',
    name: 'Mantra Sky Homes',
    location: 'Moshi, Pune',
    price: '₹ 45 L - 70 L',
    bhk: '1 & 2 BHK Apartments',
    image: 'https://images.unsplash.com/photo-1564013799919-ab39cf56b4c1?w=400&q=80',
  },
  {
    id: 6,
    badge: 'Ready Possession',
    badgeColor: 'bg-teal-800',
    name: 'Kolte Patil Life',
    location: 'Hinjewadi, Pune',
    price: '₹ 75 L - 1.20 Cr',
    bhk: '2 & 3 BHK Apartments',
    image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=400&q=80',
  },
];

export default function FeaturedProjectsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const visibleCards = 6;
  const maxIndex = Math.max(0, projects.length - visibleCards);

  const slideNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const slidePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Clear existing interval and set new one
  const resetInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        slideNext();
      }, 5000);
    }
  }, [isPaused, slideNext]);

  // Auto-scroll effect
  useEffect(() => {
    resetInterval();
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [resetInterval]);

  // Handle manual navigation with reset
  const handleNext = () => {
    slideNext();
    resetInterval();
  };

  const handlePrev = () => {
    slidePrev();
    resetInterval();
  };

  // Handle dot navigation
  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    resetInterval();
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Featured Projects</h2>
          <Link 
            href="/projects" 
            className="group flex items-center gap-2 text-red-800 font-semibold hover:text-red-900 transition-colors"
          >
            Explore All Projects
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
            aria-label="Previous projects"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
            aria-label="Next projects"
          >
            <ChevronRight size={20} />
          </button>

          {/* Cards Container */}
          <div className="overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 },
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
              >
                {projects.slice(currentIndex, currentIndex + visibleCards).map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="group bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                  >
                    {/* Image Container - Reduced Height */}
                    <div className="relative h-32 overflow-hidden flex-shrink-0">
                      <img
                        src={project.image}
                        alt={project.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* Badge */}
                      <div className={`absolute top-2 left-2 ${project.badgeColor} text-white px-2 py-0.5 rounded text-[10px] font-semibold`}>
                        {project.badge}
                      </div>
                    </div>

                    {/* Content - Reduced Padding and Spacing */}
                    <div className="p-3 flex flex-col flex-grow">
                      <h3 className="font-bold text-base text-gray-900 mb-0.5 group-hover:text-red-800 transition-colors line-clamp-1">
                        {project.name}
                      </h3>
                      <p className="text-xs text-gray-600 mb-1 line-clamp-1">{project.location}</p>
                      <p className="text-red-800 font-bold text-sm mb-0.5">{project.price}</p>
                      <p className="text-xs text-gray-500 mb-2">{project.bhk}</p>
                      <button className="w-full py-1.5 rounded-md font-semibold text-xs transition-all duration-300 bg-red-800 text-white hover:bg-red-900 mt-auto">
                        View Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-red-800 w-6' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}