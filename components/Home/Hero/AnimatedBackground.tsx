'use client';

import { memo, useRef } from 'react';

interface AnimatedBackgroundProps {
  mouseRef: React.RefObject<{ x: number; y: number }>;
}

// Memoized background component - only re-renders if props change
export const AnimatedBackground = memo(({ mouseRef }: AnimatedBackgroundProps) => {
  // Use CSS variables set by parent hook - no state, no re-renders
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient - static */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950" />
      
      {/* Animated orbs using CSS variables - GPU accelerated */}
      <div 
        className="absolute top-[-10%] right-[-10%] w-[700px] h-[700px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          transform: 'translate(calc((var(--mouse-x-pct, 50%) - 50%) * 0.16), calc((var(--mouse-y-pct, 50%) - 50%) * 0.08))',
          willChange: 'transform',
        }}
      />
      <div 
        className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
          transform: 'translate(calc((var(--mouse-x-pct, 50%) - 50%) * 0.096), calc((50% - var(--mouse-y-pct, 50%)) * 0.04))',
          willChange: 'transform',
        }}
      />
      
      {/* Static noise overlay */}
      <div className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
      
      {/* Static grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.3" opacity="0.4"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent" />
    </div>
  );
}, () => true); // Never re-render based on props - CSS variables handle updates

AnimatedBackground.displayName = 'AnimatedBackground';