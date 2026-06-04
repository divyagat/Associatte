// components/builder-page/BuilderHeader.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';

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
    <div className="bg-[#101C2E] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Builder Logo */}
          <div className="w-32 h-32 bg-white rounded-2xl p-6 shadow-xl flex items-center justify-center flex-shrink-0">
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
              <div className="w-full h-full rounded-xl bg-[#005E60] flex items-center justify-center">
                <span className="text-white text-4xl font-bold">{initial}</span>
              </div>
            )}
          </div>

          {/* Builder Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="page-title mb-3 capitalize">{builderName}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
              <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <svg className="w-5 h-5 text-[#F8C21C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {years} Experience
              </span>
              <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <svg className="w-5 h-5 text-[#F8C21C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {projects.length} Projects
              </span>
            </div>
          </div>
        </div>
        
        {/* Optional Banner */}
        {banner && (
          <div className="mt-8 rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={banner}
              alt={`${builderName} banner`}
              width={1200}
              height={400}
              className="w-full h-48 md:h-64 object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}