// components/sections/InvestmentCtaSection.tsx
'use client';

import { CheckCircle, ChevronRight } from 'lucide-react';

export type PopupConfig = {
  projectName?: string;
  projectImage?: string;
  projectTagline?: string;
  prefillData?: { name?: string; phone?: string; email?: string };
  trackingData?: { source?: string; campaign?: string; medium?: string };
};

interface InvestmentCtaSectionProps {
  city: 'Pune' | 'Mumbai' | 'KDMC';
  onConsultationClick?: (config?: PopupConfig) => void; // ✅ FIXED: Match parent prop name
}

export default function InvestmentCtaSection({ city, onConsultationClick }: InvestmentCtaSectionProps) {
  const benefits = [
    'High appreciation zones',
    'Rental income properties',
    'Pre-launch deals',
    'Early bird pricing',
  ];

  const handleButtonClick = () => {
    onConsultationClick?.({ // ✅ FIXED: Use correct prop name
      projectName: `Investment Consultation - ${city}`,
      projectTagline: 'Get exclusive investment opportunities & personalized advice',
      projectImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80',
      trackingData: {
        source: 'investment-cta',
        campaign: `city-${city.toLowerCase()}`,
        medium: 'organic',
      },
    });
  };

  return (
    <section className="py-10 md:py-14 relative overflow-hidden">
      {/* Background Image + Overlay */}
      <div className="absolute inset-0">
        <img 
          src={`https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80&city=${city.toLowerCase()}`} 
          alt={`${city} Skyline`} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#8B0000]/95 to-[#8B0000]/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="section-title text-white mb-6 leading-tight">
            Looking to Invest in {city} Real Estate?
          </h2>
          
          <ul className="space-y-3 sm:space-y-4 mb-8">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-center gap-3 text-white/95">
                <CheckCircle className="w-5 h-5 text-[#F8C21C] flex-shrink-0" />
                <span className="text-base sm:text-lg">{benefit}</span>
              </li>
            ))}
          </ul>
          
          {/* ✅ CTA Button - Your Exact Style + Brand Colors */}
          <button 
            onClick={handleButtonClick}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#F8C21C] to-[#e6b418] text-[#8B0000] font-semibold rounded-xl hover:from-[#e6b418] hover:to-[#d9a812] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#F8C21C]/25 focus:outline-none focus:ring-2 focus:ring-[#F8C21C] focus:ring-offset-2 focus:ring-offset-[#8B0000]"
            aria-label={`Get investment consultation for properties in ${city}`}
          >
            <span>Get Investment Consultation</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          {/* Trust Badge */}
          <p className="mt-4 text-sm text-white/70 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#F8C21C]" />
            <span>Free consultation • No obligation • Expert advice</span>
          </p>
        </div>
      </div>
    </section>
  );
}