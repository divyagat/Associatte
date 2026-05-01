// @/components/sections/InvestmentCtaSection.tsx
'use client';

import { CheckCircle, ChevronRight } from 'lucide-react';

export default function InvestmentCtaSection() {
  const benefits = [
    'High appreciation zones',
    'Rental income properties',
    'Pre-launch deals',
    'Early bird pricing',
  ];

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80"
          alt="City Skyline"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/95 to-red-900/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold text-white mb-6">
            Looking to Invest in Real Estate?
          </h2>
          <ul className="space-y-3 mb-8">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-center gap-3 text-white">
                <CheckCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
          <button className="bg-yellow-500 text-gray-900 px-8 py-3 rounded-md font-semibold hover:bg-yellow-600 transition-colors flex items-center gap-2">
            Get Investment Consultation
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}