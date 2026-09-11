// components/sections/MappingSection.tsx
'use client';

import { useState } from 'react';
import { ExternalLink, MapPin, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const MAPPING_URL = 'https://mappingg.com/';

export default function MappingSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <section aria-labelledby="mapping-heading" className="py-8 md:py-14 bg-slate-50">
      <div className="container-site">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-2xl mx-auto mb-6 md:mb-8"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-primary)]/10 text-[var(--color-primary)] mb-3">
            <MapPin className="w-3.5 h-3.5" />
            Explore on the Map
          </span>
          <h2 id="mapping-heading" className="section-title text-[var(--color-text)] text-2xl sm:text-3xl md:text-4xl leading-tight">
            Discover Properties with <span className="text-[var(--color-primary)]">Mappingg</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[var(--color-text-light)]">
            Browse locations, projects and neighbourhoods on an interactive map — right here.
          </p>
        </motion.div>

        {/* Browser-style embed frame */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-white"
        >
          {/* Browser chrome bar */}
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-slate-100 border-b border-gray-200">
            <div className="flex gap-1.5 flex-shrink-0">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 flex items-center gap-2 min-w-0 mx-2 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs text-[var(--color-text-light)] truncate">
              <span className="text-green-600 flex-shrink-0">🔒</span>
              <span className="truncate">mappingg.com</span>
            </div>
            <a
              href={MAPPING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity"
            >
              Visit Website
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Live embed — preserves the real website view. Shorter on mobile so
              the whole frame fits neatly on small screens. */}
          <div className="relative w-full h-[180px] sm:h-[280px] md:h-[400px] bg-white">
            {!isLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[var(--color-text-light)]">
                <Loader2 className="w-6 h-6 animate-spin text-[var(--color-primary)]" />
                <span className="text-sm">Loading map…</span>
              </div>
            )}
            <iframe
              src={MAPPING_URL}
              title="Mappingg — interactive property map"
              loading="lazy"
              onLoad={() => setIsLoaded(true)}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </motion.div>

        {/* Mobile-friendly visit button */}
        <div className="text-center mt-5 sm:hidden">
          <a
            href={MAPPING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity"
          >
            Open Mappingg
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
