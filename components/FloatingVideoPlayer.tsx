// components/FloatingVideoPlayer.tsx
'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';

interface FloatingVideoPlayerProps {
  /** Self-hosted video file (e.g. "/videos/reel.mp4") — plays small + autoplaying. */
  videoSrc?: string;
  /** Instagram reel/post URL — embedded (scaled) inside the small box. */
  instagramUrl?: string;
  /** YouTube video id (final fallback). */
  videoId?: string;
  title?: string;
  position?: 'bottom-right' | 'bottom-left';
}

// Turn any reel/post URL (with or without query params) into its embed form:
//   https://www.instagram.com/reel/ABC/?stkn=… → https://www.instagram.com/reel/ABC/embed
function toInstagramEmbed(url: string): string {
  const clean = url.split('?')[0].replace(/\/+$/, '');
  return `${clean}/embed`;
}

export default function FloatingVideoPlayer({
  videoSrc,
  instagramUrl,
  videoId,
  title = 'Watch Video',
  position = 'bottom-right',
}: FloatingVideoPlayerProps) {
  const [isVisible, setIsVisible] = useState(true);
  // Defer loading the embed until the page is idle, so it never competes with the
  // initial mobile paint/LCP. A lightweight placeholder shows until then.
  const [showEmbed, setShowEmbed] = useState(false);
  // If the self-hosted video file is missing/fails, fall back to the Instagram
  // embed so the reel still shows.
  const [fileFailed, setFileFailed] = useState(false);

  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (typeof w.requestIdleCallback === 'function') {
      const id = w.requestIdleCallback(() => setShowEmbed(true), { timeout: 3500 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = setTimeout(() => setShowEmbed(true), 2500);
    return () => clearTimeout(t);
  }, []);

  const mode: 'file' | 'instagram' | 'youtube' =
    videoSrc && !fileFailed ? 'file' : instagramUrl ? 'instagram' : 'youtube';

  // On mobile the sticky bottom action dock occupies the very bottom edge, so the
  // floating video is raised above it; on md+ (no dock) it hugs the corner.
  const positionClasses =
    position === 'bottom-right'
      ? 'bottom-24 right-4 md:bottom-12 md:right-12 lg:bottom-16 lg:right-16'
      : 'bottom-24 left-4 md:bottom-12 md:left-12 lg:bottom-16 lg:left-16';

  const youtubeUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&rel=0&modestbranding=1`;
  const reelUrl = instagramUrl ? toInstagramEmbed(instagramUrl) : '';

  // If the video is closed, don't render anything (no red button)
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed ${positionClasses} z-50`}
      style={{ animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
    >
      {/* Brand gradient glow (Teal to Burgundy) */}
      <div className="absolute -inset-1.5 bg-gradient-to-br from-[#005E60] to-[#8B0000] rounded-xl blur opacity-40" />

      {/* Compact 9:16 video container (original size) */}
      <div className="relative w-20 sm:w-28 md:w-36 lg:w-40 aspect-[9/16] bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/20">

        {/* Close Button with internal gap */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
          <button
            onClick={() => setIsVisible(false)}
            className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full bg-black/70 hover:bg-black text-white backdrop-blur-sm transition-all hover:scale-110"
            aria-label="Close video"
          >
            <X size={14} />
          </button>
        </div>

        {/* Platform badge */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/70 backdrop-blur-sm pointer-events-none">
          {mode === 'youtube' ? (
            <>
              <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#FF0000]" fill="currentColor">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
              <span className="text-[7px] sm:text-[8px] font-semibold text-white">Shorts</span>
            </>
          ) : (
            <>
              <FaInstagram className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#E1306C]" />
              <span className="text-[7px] sm:text-[8px] font-semibold text-white">Reel</span>
            </>
          )}
        </div>

        {/* Media — mounts only after the page is idle to keep the first paint
            fast; a subtle placeholder fills the frame until then. */}
        {!showEmbed ? (
          <div className="absolute inset-0 bg-gradient-to-br from-[#005E60] to-[#8B0000] animate-pulse" />
        ) : mode === 'file' ? (
          <video
            src={videoSrc}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={title}
            onError={() => setFileFailed(true)}
          />
        ) : mode === 'instagram' ? (
          // Instagram embeds have a minimum sensible width, so we render the reel
          // at a fixed 320px design size and scale it down to perfectly fill the
          // small box at every breakpoint (320*scale == box width; 568*scale ==
          // box height, keeping the 9:16 ratio). Box size stays unchanged.
          <iframe
            src={reelUrl}
            title={title}
            loading="lazy"
            scrolling="no"
            className="absolute top-0 left-0 origin-top-left border-0 bg-white w-[320px] h-[568px] scale-[0.25] sm:scale-[0.35] md:scale-[0.45] lg:scale-[0.5]"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <iframe
            src={youtubeUrl}
            title={title}
            loading="lazy"
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
}
