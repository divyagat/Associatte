// @/components/Home/AnimatedBackground.tsx
'use client';

import { memo } from 'react';
import { RefObject } from 'react';

export interface AnimatedBackgroundProps {
  mouseRef: RefObject<{ x: number; y: number }>;
  variant?: 'light' | 'medium' | 'dark';
}

export const AnimatedBackground = memo(({ 
  mouseRef,
  variant = 'medium' 
}: AnimatedBackgroundProps) => {
  
  const PRIMARY = '#005E60';
  const ACCENT = '#F8C21C';
  const BASE = '#101C2E';

  const variants = {
    light: { bgOpacity: '15' },
    medium: { bgOpacity: '1F' },
    dark: { bgOpacity: '29' },
  };
  
  const { bgOpacity } = variants[variant];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Static Gradient Background */}
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 20% 10%, ${PRIMARY}${bgOpacity} 0%, transparent 55%), radial-gradient(ellipse at 85% 90%, ${ACCENT}${bgOpacity} 0%, transparent 55%), linear-gradient(180deg, ${BASE} 0%, ${BASE} 100%)` }} />

      {/* Subtle Noise Texture */}
      <div className="absolute inset-0 opacity-[0.01]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
      
      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 md:h-40" style={{ background: `linear-gradient(to top, ${BASE} 0%, transparent 100%)` }} />
    </div>
  );
});

AnimatedBackground.displayName = 'AnimatedBackground';