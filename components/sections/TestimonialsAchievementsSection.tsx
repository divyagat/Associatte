'use client';

import { Star, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface TestimonialsAchievementsSectionProps {
  city: 'Pune' | 'Mumbai' | 'KDMC';
}

export default function TestimonialsAchievementsSection({ city }: TestimonialsAchievementsSectionProps) {
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
        <div key={star} className="relative w-5 h-5 sm:w-6 sm:h-6">
          {/* Empty star background */}
          <Star className="w-full h-full text-gray-200 fill-gray-200" />
          {/* Filled portion */}
          <div 
            className="absolute top-0 left-0 overflow-hidden"
            style={{ width: `${fillPercentage}%` }}
          >
            <Star className="w-full h-full text-[#F8C21C] fill-[#F8C21C]" />
          </div>
        </div>
      );
    });
  };

  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* ✅ Premium Google Review Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center"
        >
          {/* Card Container */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5 sm:px-8 sm:py-6 hover:shadow-md hover:border-[#005E60]/20 transition-all duration-300 group">
            
            {/* Google Header */}
            <div className="flex items-center justify-center gap-2.5 mb-3">
              {/* Google "G" Logo */}
              <div className="relative w-7 h-7 sm:w-8 sm:h-8">
                <div className="absolute inset-0 bg-gradient-to-br from-[#4285F4] via-[#34A853] to-[#FBBC05] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm sm:text-base">G</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-white rounded-full border-2 border-gray-100 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-[#EA4335] rounded-full" />
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900 leading-none">Google</span>
                <span className="text-[10px] text-gray-500 leading-none mt-0.5">Reviews</span>
              </div>
            </div>

            {/* Stars */}
            <div className="flex items-center justify-center gap-0.5 mb-3">
              {renderStars()}
            </div>

            {/* Rating Number */}
            <div className="flex items-baseline justify-center gap-1 mb-1">
              <span className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                {googleRating.score}
              </span>
              <span className="text-gray-400 text-lg sm:text-xl">/ 5</span>
            </div>

            {/* Review Count */}
            <p className="text-center text-sm text-gray-500 mb-4">
              Based on <span className="font-medium text-gray-700">{googleRating.totalReviews}</span> verified reviews
            </p>

            {/* CTA Button */}
            <a
              href={googleRating.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#005E60] text-sm font-medium hover:text-[#004a4d] transition-colors group/link"
            >
              Read all reviews
              <ExternalLink size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Subtle decorative element */}
          <div className="mt-4 flex items-center gap-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#005E60]/20" />
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Trusted by homeowners</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#005E60]/20" />
          </div>
          
        </motion.div>
        
      </div>
    </section>
  );
}