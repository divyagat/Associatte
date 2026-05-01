'use client';

import { ChevronLeft, ChevronRight, MapPin, Bed, Square, Tag } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface Project {
  id: number;
  name: string;
  location: string;
  bhk: string;
  sqft: string;
  price: string;
  image: string;
}

const projects: Project[] = [
  {
    id: 1,
    name: 'Kalpataru Jade Sky...',
    location: 'Baner',
    bhk: '3 BHK',
    sqft: '1189 SQ.FT.',
    price: '₹1.80 Crore',
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&q=80',
  },
  {
    id: 2,
    name: 'VTP MONARQUE PHASE...',
    location: 'Hinjewadi',
    bhk: '5 BHK',
    sqft: '805 -2093 SQ.FT.',
    price: '₹94.0 Lakh',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80',
  },
  {
    id: 3,
    name: 'Dream Elegance',
    location: 'Balewadi',
    bhk: '4 BHK',
    sqft: '1080 -1585 SQ.FT.',
    price: '₹1.73 Crore',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
  },
  {
    id: 4,
    name: 'Holystico Astrana',
    location: 'Hadapsar',
    bhk: '4 BHK',
    sqft: '803 -1950 SQ.FT.',
    price: '₹1.07 Crore',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80',
  },
  {
    id: 5,
    name: 'Rohan Nidita',
    location: 'Hinjewadi',
    bhk: '3 BHK',
    sqft: '758 -1185 SQ.FT.',
    price: '₹83.0 Lakh',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80',
  },
];

export default function NewlyLaunchedProjects() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
      return () => {
        container.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -420, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 420, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Newly Launched Projects
          </h2>
          <p className="text-gray-600">
            Just now launched in the <span className="font-semibold text-gray-900">Pune</span>
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          
          {/* Left Arrow */}
          {canScrollLeft && (
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 z-20 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 hover:scale-110 transition-all duration-300 border border-gray-200"
              aria-label="Previous projects"
            >
              <ChevronLeft size={20} className="text-gray-700" />
            </button>
          )}

          {/* Projects Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {projects.map((project) => (
              <article
                key={project.id}
                className="group flex-shrink-0 w-[420px] bg-white rounded-xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer relative"
              >
                {/* NEW LAUNCH Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-block px-3 py-1 bg-[#FFE699] text-gray-800 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm">
                    NEW LAUNCH
                  </span>
                </div>

                {/* Content */}
                <div className="flex gap-3 mt-6">
                  {/* Circular Image */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-[#D97941] transition-colors duration-300 shadow-md">
                      <img
                        src={project.image}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80';
                        }}
                      />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    {/* Project Name */}
                    <h3 className="text-lg font-bold text-[#D97941] mb-1 group-hover:text-[#b86435] transition-colors truncate">
                      {project.name}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-1 text-xs text-gray-600 mb-1.5">
                      <MapPin size={12} className="text-gray-400 flex-shrink-0" />
                      <span className="truncate">{project.location}</span>
                    </div>

                    {/* BHK & SQFT */}
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Bed size={12} className="text-gray-400 flex-shrink-0" />
                        <span>{project.bhk}</span>
                      </div>
                      <span className="text-gray-300">|</span>
                      <div className="flex items-center gap-1">
                        <Square size={12} className="text-gray-400 flex-shrink-0" />
                        <span className="truncate">{project.sqft}</span>
                      </div>
                    </div>

                    {/* Price Badge */}
                    <div className="inline-block px-3 py-1 bg-[#FFE8D6] text-[#D97941] text-xs font-bold rounded-full">
                      {project.price}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="my-3 border-t border-gray-100" />

                {/* Bottom Text */}
                <div className="flex items-center gap-1.5 text-xs">
                  <Tag size={12} className="text-[#D97941] flex-shrink-0" />
                  <span className="text-gray-700">
                    Get preferred options <span className="font-bold text-gray-900">@ZERO Brokerage</span>
                  </span>
                </div>
              </article>
            ))}
          </div>

          {/* Right Arrow */}
          {canScrollRight && (
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 z-20 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 hover:scale-110 transition-all duration-300 border border-gray-200"
              aria-label="Next projects"
            >
              <ChevronRight size={20} className="text-gray-700" />
            </button>
          )}
        </div>

      </div>
    </section>
  );
}