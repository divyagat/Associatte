'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';
import { ExternalLink } from 'lucide-react';
import Reveal from '@/components/common/Reveal';

const INSTAGRAM_PROFILE = 'https://www.instagram.com/vikramm.associatte?igsh=MXM5aXhmNmZsYThicg==';
const YOUTUBE_CHANNEL = 'https://www.youtube.com/@Associatte';
const LINKEDIN_PROFILE = 'https://www.linkedin.com/company/associatteindia/posts/?feedView=all';

const REELS: string[] = [
  'https://www.instagram.com/reel/Daw2TM-vkhX/?igsi=aXhncXpmenQwOXg2',
  'https://www.instagram.com/reel/DbpveVuucht/?igsi=MXRnc2E1bjB6NGxrdQ==',
  'https://www.instagram.com/reel/DakiAmVv4zg/?igsi=MWlxdHRzbzYycXdlZA==',
];

const YOUTUBE_VIDEOS: string[] = [
  'MXVODMprZsg',
  'nNCEGMPUbbI',
  's3ZET3WdOgQ',
];

const LINKEDIN_POSTS: { url: string; title: string; snippet: string }[] = [
  {
    url: 'https://www.linkedin.com/posts/associatte_realestate-pune-activity-123456789',
    title: 'New Project Launch in Pune',
    snippet: 'We are thrilled to announce the launch of our newest premium residential project in the heart of Pune...',
  },
  {
    url: 'https://www.linkedin.com/posts/associatte_marketupdate-mumbai-activity-987654321',
    title: 'Q3 Market Update: Mumbai Real Estate',
    snippet: 'Our latest research shows a 15% surge in demand for premium housing in South Mumbai...',
  },
  {
    url: 'https://www.linkedin.com/posts/associatte_teamassociatte-activity-112233445',
    title: 'Meet the Team Behind Your Dream Home',
    snippet: 'At Associatte, we believe that finding the right property is about trust...',
  },
];

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

interface VideoGallerySectionProps {
  city: 'Pune' | 'Mumbai' | 'KDMC';
}

type Platform = 'instagram' | 'youtube' | 'linkedin';

export default function VideoGallerySection({ city }: VideoGallerySectionProps) {
  const [activePlatform, setActivePlatform] = useState<Platform>('instagram');
  const containerRef = useRef<HTMLDivElement>(null);

  const processEmbeds = () => {
    if (typeof window !== 'undefined' && window.instgrm) {
      window.instgrm.Embeds.process();
    }
  };

  useEffect(() => {
    if (activePlatform === 'instagram') {
      setTimeout(processEmbeds, 100);
    }
  }, [activePlatform]);

  if (REELS.length === 0 && YOUTUBE_VIDEOS.length === 0 && LINKEDIN_POSTS.length === 0) return null;

  return (
    <section className="py-10 md:py-16 bg-gradient-to-b from-white to-gray-50">
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
        onLoad={processEmbeds}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal className="text-center max-w-3xl mx-auto mb-6 md:mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#005E60]/10 text-[#005E60] text-xs font-semibold rounded-full mb-3">
            {activePlatform === 'instagram' && <FaInstagram className="w-3.5 h-3.5" />}
            {activePlatform === 'youtube' && <FaYoutube className="w-3.5 h-3.5 text-red-600" />}
            {activePlatform === 'linkedin' && <FaLinkedin className="w-3.5 h-3.5 text-[#0A66C2]" />}
            <span>Media & Updates</span>
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            Experience Associatte in {city}
          </h2>
          <p className="text-sm md:text-base text-gray-600 px-2">
            Site visits, project walkthroughs, and market updates.
          </p>
        </Reveal>

        {/* Platform Toggle Buttons - Fully Responsive */}
        <Reveal className="flex justify-center mb-6 md:mb-10">
          <div className="inline-flex bg-gray-100 p-1.5 rounded-xl w-full max-w-md flex-wrap sm:flex-nowrap justify-center gap-1.5 sm:gap-0">
            <button
              onClick={() => setActivePlatform('instagram')}
              className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex-1 sm:flex-none ${
                activePlatform === 'instagram'
                  ? 'bg-white text-[#005E60] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FaInstagram className="w-4 h-4 flex-shrink-0" /> 
              <span className="hidden sm:inline">Instagram</span>
              <span className="sm:hidden">Reels</span>
              {REELS.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-[#005E60]/10 text-[#005E60] text-[10px] font-bold rounded-full flex-shrink-0">
                  {REELS.length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setActivePlatform('youtube')}
              className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex-1 sm:flex-none ${
                activePlatform === 'youtube'
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FaYoutube className="w-4 h-4 flex-shrink-0" /> 
              <span className="hidden sm:inline">YouTube</span>
              <span className="sm:hidden">Videos</span>
              {YOUTUBE_VIDEOS.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-red-600/10 text-red-600 text-[10px] font-bold rounded-full flex-shrink-0">
                  {YOUTUBE_VIDEOS.length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setActivePlatform('linkedin')}
              className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex-1 sm:flex-none ${
                activePlatform === 'linkedin'
                  ? 'bg-white text-[#0A66C2] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FaLinkedin className="w-4 h-4 flex-shrink-0" /> 
              <span className="hidden sm:inline">LinkedIn</span>
              <span className="sm:hidden">Posts</span>
              {LINKEDIN_POSTS.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-[#0A66C2]/10 text-[#0A66C2] text-[10px] font-bold rounded-full flex-shrink-0">
                  {LINKEDIN_POSTS.length}
                </span>
              )}
            </button>
          </div>
        </Reveal>

        {/* Content Grid - Fluid and Responsive */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 justify-items-center"
        >
          {/* INSTAGRAM TAB - Ultra Compact Height */}
          {activePlatform === 'instagram' && REELS.map((url, index) => (
            <Reveal key={url} delay={index * 80} className="w-full">
              {/* 👇 Changed to h-[320px] (h-80) for a much shorter, compact reel display */}
              <div className="w-full max-w-sm mx-auto h-[320px] overflow-hidden rounded-xl border border-gray-100 shadow-sm bg-white">
                <blockquote
                  className="instagram-media w-full"
                  data-instgrm-permalink={url}
                  data-instgrm-version="14"
                  style={{
                    background: '#FFF',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: 'none',
                    margin: '0 auto',
                    maxWidth: '100%',
                    minWidth: '100%',
                    padding: 0,
                  }}
                >
                  <a href={url} target="_blank" rel="noopener noreferrer" className="block text-center py-10 text-sm text-gray-400">
                    View this reel on Instagram
                  </a>
                </blockquote>
              </div>
            </Reveal>
          ))}

          {/* YOUTUBE TAB */}
          {activePlatform === 'youtube' && YOUTUBE_VIDEOS.map((videoId, index) => (
            <Reveal key={videoId} delay={index * 80} className="w-full">
              <div className="w-full max-w-sm mx-auto bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <div className="relative aspect-video bg-gray-900">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </div>
            </Reveal>
          ))}

          {/* LINKEDIN TAB */}
          {activePlatform === 'linkedin' && LINKEDIN_POSTS.map((post, index) => (
            <Reveal key={post.url} delay={index * 80} className="w-full">
              <a 
                href={post.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group block h-full w-full max-w-sm mx-auto bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-[#0A66C2]/30 transition-all duration-300 p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#0A66C2]/10 flex items-center justify-center text-[#0A66C2] flex-shrink-0">
                    <FaLinkedin className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">Associatte PropTech</p>
                    <p className="text-[11px] text-gray-500">Featured Update</p>
                  </div>
                </div>
                
                <h3 className="text-sm font-bold text-gray-900 mb-1.5 group-hover:text-[#0A66C2] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-3 line-clamp-2">
                  {post.snippet}
                </p>

                <div className="flex items-center gap-1 text-xs font-semibold text-[#0A66C2] mt-auto pt-2 border-t border-gray-50">
                  Read full post <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        {/* CTA Buttons - Responsive Layout */}
        <Reveal delay={200} className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 md:mt-10 w-full sm:w-auto px-4 sm:px-0">
          <a
            href={INSTAGRAM_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#005E60] text-white text-sm font-semibold rounded-lg hover:bg-[#004a4d] transition-colors shadow-md shadow-[#005E60]/20 w-full sm:w-auto"
          >
            <FaInstagram className="w-4 h-4" /> Follow on Instagram
          </a>
          <a
            href={YOUTUBE_CHANNEL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-md shadow-red-600/20 w-full sm:w-auto"
          >
            <FaYoutube className="w-4 h-4" /> Subscribe on YouTube
          </a>
          <a
            href={LINKEDIN_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0A66C2] text-white text-sm font-semibold rounded-lg hover:bg-[#004182] transition-colors shadow-md shadow-[#0A66C2]/20 w-full sm:w-auto"
          >
            <FaLinkedin className="w-4 h-4" /> Connect on LinkedIn
          </a>
        </Reveal>
      </div>
    </section>
  );
}