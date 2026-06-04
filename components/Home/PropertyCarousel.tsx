'use client';

// components/Home/PropertyCarousel.tsx
'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
// ✅ Relative imports
import { nextSlide, prevSlide, setTotalSlides, togglePause } from '../../store/carouselSlice';
import type { CarouselState } from '../../store/carouselSlice';
import PropertyCard, { type Property } from './PropertyCard';

// ... rest of component (same as before)

interface PropertyCarouselProps {
  properties: Property[];
  onViewMore?: () => void;
}

const CARD_WIDTH = 320;
const GAP_WIDTH = 24;
const SLIDE_STEP = CARD_WIDTH + GAP_WIDTH;

const PropertyCarousel: React.FC<PropertyCarouselProps> = ({ properties, onViewMore }) => {
  const dispatch = useDispatch();
  const { currentIndex, isPaused } = useSelector((state: { carousel: CarouselState }) => state.carousel);

  useEffect(() => {
    dispatch(setTotalSlides(properties.length));
  }, [properties, dispatch]);

  // Auto-scroll (very slow: 5 seconds)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      dispatch(nextSlide());
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, dispatch]);

  const handleViewMore = () => {
    if (onViewMore) onViewMore();
  };

  return (
    <section className="py-12 bg-white">
      <div className="w-full lg:max-w-[1280px] mx-auto px-4 lg:w-[85%]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="section-title text-[#005E60]">
              Top New Launches In Mumbai
            </h2>
            <p className="text-gray-500 mt-1 text-sm">Discover the Latest Real Estate Projects in Mumbai</p>
          </div>
          <button 
            onClick={handleViewMore}
            className="flex items-center gap-2 text-[#005E60] font-medium hover:text-[#8B0000] transition"
          >
            View More <ExternalLink size={16} />
          </button>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative"
          onMouseEnter={() => dispatch(togglePause(true))}
          onMouseLeave={() => dispatch(togglePause(false))}
        >
          <div className="overflow-hidden rounded-xl">
            <div 
              className="flex gap-6 transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${currentIndex * SLIDE_STEP}px)` }}
            >
              {properties.map((prop, idx) => (
                <PropertyCard key={idx} property={prop} />
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button 
            onClick={() => dispatch(prevSlide())}
            className="absolute right-16 top-1/2 -translate-y-1/2 bg-white/90 shadow-md p-2 rounded-full hover:bg-[#F8C21C] hover:text-[#8B0000] transition border border-gray-200 z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => dispatch(nextSlide())}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 shadow-md p-2 rounded-full hover:bg-[#F8C21C] hover:text-[#8B0000] transition border border-gray-200 z-10"
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PropertyCarousel;