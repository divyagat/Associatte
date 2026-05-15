// components/sections/InvestmentCtaSection.tsx
'use client';

import { useState } from 'react';
import { CheckCircle, ChevronRight } from 'lucide-react';
// ✅ FIXED: Use relative path (adjust if your structure differs)
import EnquiryPopup from '../common/EnquiryPopup';

interface InvestmentCtaSectionProps {
  city: 'Pune' | 'Mumbai' | 'KDMC';
}

export default function InvestmentCtaSection({ city }: InvestmentCtaSectionProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  const benefits = [
    'High appreciation zones',
    'Rental income properties',
    'Pre-launch deals',
    'Early bird pricing',
  ];

  return (
    <>
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80" 
            alt="City Skyline" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#8B0000]/95 to-[#8B0000]/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
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
            
            {/* ✅ CTA Button - Opens Popup Form */}
            <button 
              onClick={() => setIsPopupOpen(true)}
              className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[#F8C21C] text-[#8B0000] font-semibold rounded-xl hover:bg-[#e6b418] active:bg-[#d4a017] transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#F8C21C] focus:ring-offset-2 focus:ring-offset-[#8B0000]"
              aria-label="Get investment consultation"
            >
              <span>Get Investment Consultation</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <p className="mt-4 text-sm text-white/70">
              ✓ Free expert advice &nbsp; • &nbsp; ✓ No obligation
            </p>
          </div>
        </div>
      </section>

      {/* ✅ Enquiry Popup - Renders when isPopupOpen is true */}
      <EnquiryPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        projectName={`Investment Opportunities in ${city}`}
        projectTagline="Get exclusive pre-launch deals & ROI analysis"
        projectImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80"
        onSubmit={(payload) => {
          console.log('Investment enquiry submitted:', payload);
          // Optional: Send to your backend
          // fetch('/api/enquiry', { method: 'POST', body: JSON.stringify(payload) })
        }}
        theme="gradient"
        trackingData={{
          source: 'investment_cta',
          campaign: `city_${city.toLowerCase()}_investment`,
          medium: 'website'
        }}
      />
    </>
  );
}