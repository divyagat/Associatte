// @/components/sections/TrustRatingSection.tsx
'use client';

import { motion } from 'framer-motion';
import { Star, CheckCircle2, ArrowRight, Shield, Building2, Users } from 'lucide-react';

export default function TrustRatingSection() {
  // Realistic rating distribution for 4.4/5 average
  const ratingBreakdown = [
    { stars: 5, percent: 68, color: 'bg-amber-400' },
    { stars: 4, percent: 22, color: 'bg-amber-300' },
    { stars: 3, percent: 6, color: 'bg-slate-300' },
    { stars: 2, percent: 2, color: 'bg-slate-200' },
    { stars: 1, percent: 2, color: 'bg-slate-100' },
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden">
      {/* Subtle Background Accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-amber-100/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-4">
            <Shield className="w-3.5 h-3.5" /> Verified & Trusted
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
            Trusted by Thousands of Homebuyers
          </h2>
          <p className="mt-3 text-slate-500 max-w-2xl mx-auto text-sm lg:text-base">
            Real feedback from verified clients across Pune, Mumbai & NCR
          </p>
        </motion.div>

        {/* Main Rating Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
        >
          <div className="grid lg:grid-cols-5 gap-0">
            {/* Left Column: Rating & CTA */}
            <div className="lg:col-span-2 p-8 lg:p-10 bg-slate-50/60 flex flex-col justify-center items-center text-center lg:text-left border-b lg:border-b-0 lg:border-r border-slate-100">
              <div className="flex items-center gap-3 mb-5">
                {/* Official Google Logo */}
                <svg viewBox="0 0 48 48" className="w-8 h-8">
                  <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                <span className="text-sm font-medium text-slate-500">Google Reviews</span>
              </div>

              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tighter">4.4</span>
                <span className="text-lg text-slate-400 font-medium">/ 5</span>
              </div>

              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${i < 4 ? 'fill-amber-400 text-amber-400' : 'fill-amber-400/50 text-amber-400'}`}
                  />
                ))}
              </div>

              <p className="text-sm text-slate-500 font-medium mb-6">Based on 500+ verified reviews</p>

              <a
                href="https://g.page/your-business-link"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-lg font-medium hover:bg-slate-800 transition-all active:scale-95 shadow-lg hover:shadow-xl"
              >
                Read All Reviews 
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            {/* Right Column: Distribution & Trust Badges */}
            <div className="lg:col-span-3 p-8 lg:p-10 flex flex-col justify-center">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Rating Distribution</h3>
              
              <div className="space-y-3 mb-8">
                {ratingBreakdown.map((item) => (
                  <div key={item.stars} className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-600 w-8">{item.stars}★</span>
                    <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.percent}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        className={`h-full rounded-full ${item.color}`}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-400 w-10 text-right">{item.percent}%</span>
                  </div>
                ))}
              </div>

              {/* Trust Indicators */}
              <div className="mt-auto pt-6 border-t border-slate-100 grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center text-center group cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-2 group-hover:bg-blue-100 transition-colors">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">RERA Registered</span>
                </div>
                <div className="flex flex-col items-center text-center group cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center mb-2 group-hover:bg-teal-100 transition-colors">
                    <Users className="w-5 h-5 text-teal-600" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">5000+ Families</span>
                </div>
                <div className="flex flex-col items-center text-center group cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-2 group-hover:bg-amber-100 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">Transparent</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}