'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { FaInstagram } from 'react-icons/fa';
import Reveal from '@/components/common/Reveal';

const BRAND = {
  green: '#005E60',
};

const INSTAGRAM_PROFILE =
  'https://www.instagram.com/vikramm.associatte?igsh=MXM5aXhmNmZsYThicg==';

/**
 * Instagram Reel permalinks to feature on the home page.
 *
 * ➜ To add / change reels: open the reel on instagram.com, copy its URL
 *   (looks like https://www.instagram.com/reel/XXXXXXXXXXX/) and paste it below.
 *   The official Instagram embed script renders each one; no API key needed.
 */
const REELS: string[] = [
  'https://www.instagram.com/reel/C8Qb1v3Iy0p/',
  'https://www.instagram.com/reel/C7hVv2yIq3n/',
  'https://www.instagram.com/reel/C6mYp0dIk2r/',
];

// Instagram exposes this global once embed.js has loaded.
declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

interface InstagramReelsSectionProps {
  city: 'Pune' | 'Mumbai' | 'KDMC';
}

export default function InstagramReelsSection({ city }: InstagramReelsSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Re-run Instagram's embed processing whenever the script is ready or the
  // reels change, so the blockquotes get upgraded into real embeds.
  const processEmbeds = () => {
    if (typeof window !== 'undefined' && window.instgrm) {
      window.instgrm.Embeds.process();
    }
  };

  useEffect(() => {
    processEmbeds();
  }, []);

  if (REELS.length === 0) return null;

  return (
    <section className="py-10 md:py-14 bg-gradient-to-b from-white to-gray-50">
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
        onLoad={processEmbeds}
        onReady={processEmbeds}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-3xl mx-auto mb-10 lg:mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#005E60]/10 text-[#005E60] text-sm font-semibold rounded-full mb-4">
            <FaInstagram className="w-4 h-4" /> On Instagram
          </span>
          <h2 className="section-title text-gray-900 mb-4">
            Reels &amp; Reels — Life at Associatte in {city}
          </h2>
          <p className="text-lg text-gray-600">
            Site visits, project walkthroughs and market updates. Watch our latest
            reels and follow along for daily property insights.
          </p>
        </Reveal>

        <div
          ref={containerRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center"
        >
          {REELS.map((url, index) => (
            <Reveal
              key={url}
              delay={index * 100}
              className="w-full max-w-[340px]"
            >
              <blockquote
                className="instagram-media w-full"
                data-instgrm-permalink={url}
                data-instgrm-version="14"
                style={{
                  background: '#FFF',
                  border: 0,
                  borderRadius: '12px',
                  boxShadow:
                    '0 1px 3px rgba(0,0,0,0.08), 0 10px 25px rgba(0,0,0,0.06)',
                  margin: 0,
                  maxWidth: '100%',
                  minWidth: '260px',
                  padding: 0,
                  width: '100%',
                }}
              >
                <a href={url} target="_blank" rel="noopener noreferrer">
                  View this reel on Instagram
                </a>
              </blockquote>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="text-center mt-10 lg:mt-12">
          <a
            href={INSTAGRAM_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#005E60] text-white font-semibold rounded-xl hover:bg-[#004a4d] transition-colors shadow-lg shadow-[#005E60]/20"
          >
            <FaInstagram className="w-5 h-5" /> Follow @vikramm.associatte
          </a>
        </Reveal>
      </div>
    </section>
  );
}
