// components/builder-page/BuilderHeader.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

interface BuilderHeaderProps {
  slug: string;
  projects: any[];
  builderName: string;
  logo: string;
  banner?: string | null;
  years: string;
}

export default function BuilderHeader({
  slug,
  projects,
  builderName,
  logo,
  banner,
  years,
}: BuilderHeaderProps) {
  const [hasError, setHasError] = useState(false);
  const initial = builderName.charAt(0).toUpperCase();

  return (
    <div className="relative bg-[#101C2E] text-white overflow-hidden">
      {/* Decorative gradient orbs using global brand colors */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-primary)]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--color-secondary)]/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          
          {/* Builder Logo with Premium Glow */}
          <div className="relative flex-shrink-0">
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-primary)] rounded-2xl blur opacity-40 animate-pulse-slow"></div>
            <div className="relative w-28 h-28 md:w-32 md:h-32 bg-white rounded-2xl p-5 shadow-2xl flex items-center justify-center">
              {!hasError && logo ? (
                <Image
                  src={logo}
                  alt={`${builderName} logo`}
                  width={128}
                  height={128}
                  className="object-contain w-full h-full"
                  onError={() => setHasError(true)}
                />
              ) : (
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center shadow-inner">
                  <span className="text-white text-4xl md:text-5xl font-bold">{initial}</span>
                </div>
              )}
            </div>
          </div>

          {/* Builder Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="page-title mb-3 capitalize text-white">
              {builderName}
            </h1>
            
            <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto md:mx-0 mb-6 leading-relaxed">
              Discover premium properties and ongoing projects by one of the most <span className="accent font-semibold">trusted developers</span> in the region.
            </p>

            {/* Modern Glassmorphism Badges using global .glass-dark utility */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <div className="glass-dark flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 hover:bg-white/10">
                <div className="p-2 bg-[var(--color-gold)]/10 rounded-lg">
                  <svg className="w-5 h-5 text-[var(--color-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[10px] uppercase tracking-wider text-white/60 font-semibold">Experience</span>
                  <span className="text-sm font-bold text-white">{years}</span>
                </div>
              </div>

              <div className="glass-dark flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 hover:bg-white/10">
                <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg">
                  <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[10px] uppercase tracking-wider text-white/60 font-semibold">Projects</span>
                  <span className="text-sm font-bold text-white">{projects.length} Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Optional Banner with Seamless Blend and Global Shadow */}
        {banner && (
          <div className="mt-10 relative rounded-2xl overflow-hidden shadow-glow-lg border border-white/10 group">
            <div className="absolute inset-0 bg-gradient-to-t from-[#101C2E] via-transparent to-transparent z-10 opacity-70"></div>
            <Image
              src={banner}
              alt={`${builderName} banner`}
              width={1200}
              height={400}
              className="w-full h-48 md:h-64 object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        )}
      </div>
    </div>
  );
}