'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Developer {
  id: number;
  years: string;
  name: string;
  projects: number;
  logo: string;
}

const developers: Developer[] = [
  { id: 1, years: '14y +', name: 'L&T Realty', projects: 15, logo: '/logos/lt.png' },
  { id: 2, years: '47y +', name: 'Hiranandani', projects: 9, logo: '/logos/hiranandani.png' },
  { id: 3, years: '55y +', name: 'Shapoorji Pallonji', projects: 11, logo: '/logos/sp.png' },
  { id: 4, years: '8y +', name: 'Birla Estates', projects: 2, logo: '/logos/birla.png' },
  { id: 5, years: '42y +', name: 'Oberoi Realty', projects: 5, logo: '/logos/oberoi.png' },
  { id: 6, years: '30y +', name: 'Godrej Properties', projects: 8, logo: '/logos/godrej.png' },
];

export default function TopDevelopersCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const CARD_WIDTH = 280;
  const GAP = 24;
  const STEP = CARD_WIDTH + GAP;

  // Auto-scroll every 5 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % developers.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const next = () => setCurrentIndex((p) => (p + 1) % developers.length);
  const prev = () => setCurrentIndex((p) => (p - 1 + developers.length) % developers.length);

  return (
    <section 
      className="py-20 bg-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-[#005E60] text-sm font-semibold uppercase tracking-widest block mb-1">
              Industry Leaders
            </span>
            <h2 className="text-3xl font-bold text-[#8B0000] font-montserrat tracking-tight">
              Top Developers Projects
            </h2>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center gap-3">
            <button 
              onClick={prev}
              className="w-10 h-10 rounded-lg border border-gray-200 text-gray-500 flex items-center justify-center hover:border-[#005E60] hover:text-[#005E60] hover:bg-[#005E60]/5 transition-all"
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={next}
              className="w-10 h-10 rounded-lg border border-gray-200 text-gray-500 flex items-center justify-center hover:border-[#005E60] hover:text-[#005E60] hover:bg-[#005E60]/5 transition-all"
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Carousel Track */}
        <div className="overflow-hidden">
          <div 
            className="flex gap-6 transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * STEP}px)` }}
          >
            {developers.map((dev) => (
              <div 
                key={dev.id} 
                className="min-w-[280px] w-[280px] bg-white rounded-xl border-l-4 border-[#005E60] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
              >
                {/* Card Content */}
                <div className="p-6 flex flex-col h-full">
                  {/* Top: Logo + Years Badge */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="h-12 w-24 bg-[#F8FAFC] rounded-lg flex items-center justify-center px-3 border border-gray-100 group-hover:border-[#005E60]/20 transition-colors">
                      <img 
                        src={dev.logo} 
                        alt={`${dev.name} logo`} 
                        className="max-h-8 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <div className="bg-[#005E60]/10 text-[#005E60] px-3 py-1 rounded-full text-sm font-bold tracking-tight">
                      {dev.years}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px w-full bg-gray-100 mb-6"></div>

                  {/* Bottom: Name + Projects */}
                  <div className="flex-grow flex flex-col justify-end">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 font-montserrat group-hover:text-[#8B0000] transition-colors">
                      {dev.name}
                    </h3>
                    <div className="flex items-end justify-between">
                      <span className="text-sm text-gray-500 font-medium">Active Projects</span>
                      <span className="text-2xl font-bold text-[#005E60] tracking-tight">
                        {dev.projects}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hover Progress Bar (Yellow Accent) */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#F8C21C] group-hover:w-full transition-all duration-500 ease-out"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {developers.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex 
                  ? 'w-8 bg-[#005E60]' 
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}