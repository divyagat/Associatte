'use client';

import { Star, Award, Users, TrendingUp } from 'lucide-react';

// ✅ ADD city PROP
interface TestimonialsAchievementsSectionProps {
  city: 'Pune' | 'Mumbai' | 'KDMC';
}

const STATS = {
  Pune: { buyers: '8,500+', projects: '450+', satisfaction: '98%' },
  Mumbai: { buyers: '12,000+', projects: '680+', satisfaction: '97%' },
  KDMC: { buyers: '3,200+', projects: '180+', satisfaction: '96%' },
};

const TESTIMONIALS = [
  { name: 'Rahul S.', location: 'Pune', text: 'Found my dream 3BHK in Wakad within budget. Zero brokerage was a bonus!', rating: 5 },
  { name: 'Priya M.', location: 'Mumbai', text: 'The team helped me get the best deal in Kharghar. Highly recommended!', rating: 5 },
  { name: 'Amit K.', location: 'KDMC', text: 'Transparent process and great support throughout. Bought my first home!', rating: 5 },
];

export default function TestimonialsAchievementsSection({ city }: TestimonialsAchievementsSectionProps) {
  const stats = STATS[city] || STATS.Pune;

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="text-center p-4 bg-white rounded-xl border border-gray-100">
            <div className="text-3xl font-bold text-[#005E60] mb-1">{stats.buyers}</div>
            <div className="text-sm text-gray-600">Happy Buyers</div>
          </div>
          <div className="text-center p-4 bg-white rounded-xl border border-gray-100">
            <div className="text-3xl font-bold text-[#005E60] mb-1">{stats.projects}</div>
            <div className="text-sm text-gray-600">Verified Projects</div>
          </div>
          <div className="text-center p-4 bg-white rounded-xl border border-gray-100">
            <div className="text-3xl font-bold text-[#005E60] mb-1">{stats.satisfaction}</div>
            <div className="text-sm text-gray-600">Satisfaction Rate</div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            What Our Clients Say in {city}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="p-6 bg-white rounded-2xl border border-gray-100">
              <div className="flex gap-1 mb-3">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} size={16} className="fill-[#F8C21C] text-[#F8C21C]" />
                ))}
              </div>
              <p className="text-gray-700 text-sm mb-4">"{t.text}"</p>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#005E60]/10 flex items-center justify-center">
                  <span className="text-[#005E60] font-semibold text-sm">{t.name[0]}</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}