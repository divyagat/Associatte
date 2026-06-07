// components/FloatingVideoPlayer.tsx
'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface FloatingVideoPlayerProps {
  videoId: string;
  title?: string;
  position?: 'bottom-right' | 'bottom-left';
}

export default function FloatingVideoPlayer({
  videoId,
  title = 'Watch Video',
  position = 'bottom-right',
}: FloatingVideoPlayerProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Explicitly increased gaps for mobile (bottom-8/right-8 = 32px) 
  // and scaled up progressively for larger screens
  const positionClasses =
    position === 'bottom-right'
      ? 'bottom-8 right-8 sm:bottom-10 sm:right-10 md:bottom-12 md:right-12 lg:bottom-16 lg:right-16'
      : 'bottom-8 left-8 sm:bottom-10 sm:left-10 md:bottom-12 md:left-12 lg:bottom-16 lg:left-16';

  // Auto-play, muted, and loop parameters
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&rel=0&modestbranding=1`;

  // If the video is closed, don't render anything (no red button)
  if (!isVisible) {
    return null;
  }

  // Show the floating video
  return (
    <div 
      className={`fixed ${positionClasses} z-50`}
      style={{ animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
    >
      {/* Brand gradient glow (Teal to Burgundy) */}
      <div className="absolute -inset-1.5 bg-gradient-to-br from-[#005E60] to-[#8B0000] rounded-xl blur opacity-40" />
      
      {/* Fully responsive video container */}
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

        {/* YouTube Badge with matching internal left gap */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/70 backdrop-blur-sm">
          <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#FF0000]" fill="currentColor">
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
          </svg>
          <span className="text-[7px] sm:text-[8px] font-semibold text-white">Shorts</span>
        </div>

        {/* Video iframe */}
        <iframe
          src={embedUrl}
          title={title}
          className="absolute inset-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  );
}