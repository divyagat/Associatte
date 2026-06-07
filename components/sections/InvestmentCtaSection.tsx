// components/sections/InvestmentCtaSection.tsx
'use client';

import { CheckCircle, ChevronRight, Star, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export type PopupConfig = {
  projectName?: string;
  projectImage?: string;
  projectTagline?: string;
  prefillData?: { name?: string; phone?: string; email?: string };
  trackingData?: { source?: string; campaign?: string; medium?: string };
};

interface InvestmentCtaSectionProps {
  city: 'Pune' | 'Mumbai' | 'KDMC';
  onConsultationClick?: (config?: PopupConfig) => void;
}

export default function InvestmentCtaSection({ city, onConsultationClick }: InvestmentCtaSectionProps) {
  const benefits = [
    'High appreciation zones',
    'Rental income properties',
    'Pre-launch deals',
    'Early bird pricing',
  ];

  // Google rating data
  const googleRating = {
    score: 4.4,
    totalReviews: 328,
    url: 'https://g.page/associatte-proptech/review',
  };

  // Render stars with proper 4.4 visualization
  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => {
      const fillPercentage = Math.max(0, Math.min(100, (googleRating.score - (star - 1)) * 100));
      
      return (
        <div key={star} className="relative w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6">
          {/* Empty star background */}
          <Star className="w-full h-full text-gray-200 fill-gray-200" />
          {/* Filled portion */}
          <div 
            className="absolute top-0 left-0 overflow-hidden"
            style={{ width: `${fillPercentage}%` }}
          >
            <Star className="w-full h-full text-[var(--color-gold)] fill-[var(--color-gold)]" />
          </div>
        </div>
      );
    });
  };

  const handleButtonClick = () => {
    onConsultationClick?.({
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
    <section className="pt-4 md:pt-6 pb-8 md:pb-14 relative overflow-hidden">
      {/* Background Image + Overlay */}
      <div className="absolute inset-0">
        <img 
          src={`https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80&city=${city.toLowerCase()}`} 
          alt={`${city} Skyline`} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-secondary)]/95 to-[var(--color-secondary)]/70" />
      </div>

      {/* Content */}
      <div className="container-site relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-center">
          
          {/* Left Side - CTA Content */}
          <div className="lg:col-span-7 xl:col-span-8 text-center lg:text-left">
            <h2 className="section-title text-white mb-4 md:mb-6 leading-tight text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
              Looking to Invest in <span className="text-[var(--color-gold)]">{city}</span> Real Estate?
            </h2>
            
            <ul className="space-y-2 sm:space-y-3 md:space-y-4 mb-6 md:mb-8">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2 sm:gap-3 text-white/95 justify-center lg:justify-start">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-gold)] flex-shrink-0" />
                  <span className="text-sm sm:text-base md:text-lg">{benefit}</span>
                </li>
              ))}
            </ul>
            
            {/* CTA Button */}
            <button 
              onClick={handleButtonClick}
              className="group inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-6 md:px-8 py-3 sm:py-4 bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold)]/90 text-[var(--color-secondary)] font-semibold rounded-xl hover:from-[var(--color-gold)]/90 hover:to-[var(--color-gold)]/80 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[var(--color-gold)]/25 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:ring-offset-2 focus:ring-offset-[var(--color-secondary)] text-sm sm:text-base"
              aria-label={`Get investment consultation for properties in ${city}`}
            >
              <span>Get Investment Consultation</span>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            {/* Trust Badge */}
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-white/70 flex items-center gap-1.5 sm:gap-2 justify-center lg:justify-start">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--color-gold)]" />
              <span>Free consultation • No obligation • Expert advice</span>
            </p>
          </div>

          {/* Right Side - Google Review Badge */}
          <div className="lg:col-span-5 xl:col-span-4 flex justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-none"
            >
              {/* Card Container */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 hover:shadow-xl hover:border-[var(--color-primary)]/20 transition-all duration-300 group">
                
                {/* Google Header */}
                <div className="flex items-center justify-center gap-2 sm:gap-2.5 mb-2 sm:mb-3">
                  {/* Google "G" Logo */}
                  <div className="relative w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#4285F4] via-[#34A853] to-[#FBBC05] rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xs sm:text-sm md:text-base">G</span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full border-2 border-gray-100 flex items-center justify-center">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[#EA4335] rounded-full" />
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-semibold text-[var(--color-text)] leading-none">Google</span>
                    <span className="text-[9px] sm:text-[10px] text-[var(--color-text-light)] leading-none mt-0.5">Reviews</span>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center justify-center gap-0.5 mb-2 sm:mb-3">
                  {renderStars()}
                </div>

                {/* Rating Number */}
                <div className="flex items-baseline justify-center gap-1 mb-1">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-black text-[var(--color-text)] tracking-tight">
                    {googleRating.score}
                  </span>
                  <span className="text-[var(--color-text-light)] text-base sm:text-lg md:text-xl">/ 5</span>
                </div>

                {/* Review Count */}
                <p className="text-center text-xs sm:text-sm text-[var(--color-text-light)] mb-3 sm:mb-4">
                  Based on <span className="font-medium text-[var(--color-text)]">{googleRating.totalReviews}</span> verified reviews
                </p>

                {/* CTA Button */}
                <a
                  href={googleRating.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 sm:gap-1.5 text-[var(--color-primary)] text-xs sm:text-sm font-medium hover:text-[var(--color-primary-dark)] transition-colors group/link"
                >
                  Read all reviews
                  <ExternalLink size={12} className="sm:w-3.5 sm:h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                </a>
              </div>

              {/* Subtle decorative element */}
              <div className="mt-3 sm:mt-4 flex items-center gap-2">
                <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-white/30" />
                <span className="text-[9px] sm:text-[10px] text-white/70 uppercase tracking-wider">Trusted by homeowners</span>
                <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-white/30" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}