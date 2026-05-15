'use client';

import { Star, ChevronRight, ShieldCheck, Clock, MapPin } from 'lucide-react';
import { memo, useMemo } from 'react';

// 📦 Types & Interfaces
export interface ReviewSectionData {
  rating: number;
  googleUrl: string;
  city: 'Pune' | 'Mumbai' | 'KDMC';
}

interface TestimonialsSectionProps {
  data?: ReviewSectionData;
  className?: string;
}

// ⚡ Optimized Star Rating Component
const StarRating = memo(({ rating, size = 20 }: { rating: number; size?: number }) => {
  const stars = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => {
      const fill = Math.min(100, Math.max(0, (rating - i) * 100));
      return { key: i, fill };
    });
  }, [rating]);

  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {stars.map(({ key, fill }) => (
        <div key={key} className="relative" style={{ width: size, height: size }}>
          <Star size={size} className="text-gray-200" aria-hidden="true" />
          <div className="absolute inset-0 overflow-hidden" style={{ width: `${fill}%` }} aria-hidden="true">
            <Star size={size} className="fill-[#F8C21C] text-[#F8C21C]" />
          </div>
        </div>
      ))}
    </div>
  );
});

StarRating.displayName = 'StarRating';

// 🗺️ City display names & service areas
const CITY_CONFIG = {
  Pune: { displayName: 'Pune', areas: ['Wakad', 'Hinjewadi', 'Baner', 'Kharadi'] },
  Mumbai: { displayName: 'Mumbai', areas: ['Kharghar', 'Panvel', 'Navi Mumbai', 'Thane'] },
  KDMC: { displayName: 'Kalyan-Dombivli', areas: ['Kalyan', 'Dombivli', 'Ulhasnagar'] },
} as const;

const SERVICE_CITIES = ['Pune', 'Mumbai', 'KDMC'] as const;

// 🛡️ Default fallback data
const DEFAULT_DATA: ReviewSectionData = {
  rating: 4.4,
  googleUrl: 'https://www.google.com/search?q=Associatte+PropTech+Pvt+Ltd+google+reviews',
  city: 'Pune',
};

// 🏗️ Main Component
export default function TestimonialsAchievementsSection({ 
  data = DEFAULT_DATA,
  className = '' 
}: TestimonialsSectionProps) {
  
  const safeData = data ?? DEFAULT_DATA;
  const cityConfig = CITY_CONFIG[safeData.city];
  
  const formattedRating = useMemo(
    () => safeData.rating.toFixed(1), 
    [safeData.rating]
  );

  return (
    <section className={`py-12 md:py-16 ${className}`} aria-labelledby="reviews-heading">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Trust Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#005E60]/10 rounded-full mb-4">
          <ShieldCheck size={14} className="text-[#005E60]" aria-hidden="true" />
          <span className="text-xs font-medium text-[#005E60]">Google Verified</span>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
          
          {/* Google Header */}
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
              <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm font-semibold text-gray-700">Google Reviews</span>
            </div>
          </div>

          <h2 id="reviews-heading" className="sr-only">
            Google Reviews for Associatte PropTech
          </h2>

          {/* Rating + Stars */}
          <div className="flex flex-col items-center gap-3 mb-6">
            <div className="flex items-baseline gap-3 flex-wrap justify-center">
              <span className="text-4xl md:text-5xl font-bold text-gray-900">{formattedRating}</span>
              <div className="flex flex-col items-start">
                <StarRating rating={safeData.rating} />
                <span className="text-sm text-gray-500">out of 5.0</span>
              </div>
            </div>
          </div>

          {/* Multi-City Description */}
          <p className="text-gray-600 text-sm md:text-base mb-6 max-w-lg mx-auto">
            Find your dream home with <span className="font-semibold text-[#005E60]">Associatte PropTech</span>. 
            We serve homebuyers across{' '}
            <span className="font-medium text-gray-800">
              {SERVICE_CITIES.map((c, i) => (
                <span key={c}>
                  {CITY_CONFIG[c].displayName}
                  {i < SERVICE_CITIES.length - 1 ? ', ' : ''}
                </span>
              ))}
            </span>
            {safeData.city && (
              <>
                {' '}with focused expertise in <span className="font-semibold text-[#005E60]">{cityConfig.displayName}</span>
              </>
            )}
            .
          </p>

          {/* ✅ CTA Button - Updated Text */}
        {/* ✅ CTA Button */}
<a
  href={safeData.googleUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#005E60] hover:bg-[#004a4c] text-white font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-[#005E60] focus:ring-offset-2"
  aria-label="View all Google reviews for Associatte PropTech"
>
  View all Google reviews
  <ChevronRight size={16} aria-hidden="true" />
</a>

          {/* Service Areas Footer */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 mb-3">
              <MapPin size={12} className="text-[#005E60]" aria-hidden="true" />
              <span>Serving key localities in {cityConfig.displayName}:</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {cityConfig.areas.map((area) => (
                <span 
                  key={area}
                  className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs rounded-full border border-gray-100"
                >
                  {area}
                </span>
              ))}
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <Clock size={12} aria-hidden="true" /> Updated weekly
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={12} aria-hidden="true" /> Verified clients
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}