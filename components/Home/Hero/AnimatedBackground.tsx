'use client';

import { memo } from 'react';

interface AnimatedBackgroundProps {
  /** Enable subtle animation (default: true) */
  animate?: boolean;
  /** Background intensity: 'light' | 'medium' | 'dark' (default: 'medium') */
  variant?: 'light' | 'medium' | 'dark';
}

export const AnimatedBackground = memo(({ 
  animate = true, 
  variant = 'medium' 
}: AnimatedBackgroundProps) => {
  
  // 🎨 Associatte Brand Colors
  const PRIMARY = '#005E60'; // Teal
  const ACCENT = '#F8C21C';  // Gold
  const BASE = '#0f172a';    // Slate 950 (dark base)

  // Variant settings for opacity/blur
  const variants = {
    light: { bgOpacity: '15', blur: 'blur-[80px]', orbOpacity: '14' }, // hex opacity
    medium: { bgOpacity: '1F', blur: 'blur-[100px]', orbOpacity: '1F' },
    dark: { bgOpacity: '29', blur: 'blur-[120px]', orbOpacity: '2E' },
  };
  
  const { bgOpacity, blur, orbOpacity } = variants[variant];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      
      {/* 🎨 Base: Smooth Associatte brand gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 10%, ${PRIMARY}${bgOpacity} 0%, transparent 55%),
            radial-gradient(ellipse at 85% 90%, ${ACCENT}${bgOpacity} 0%, transparent 55%),
            linear-gradient(180deg, ${BASE} 0%, ${BASE} 100%)
          `,
        }}
      />

      {/* ✨ Subtle floating orbs — pure CSS, zero JS */}
      {animate && (
        <>
          {/* Primary orb (top-right) — brand teal */}
          <div 
            className={`absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full ${blur}`}
            style={{
              background: `radial-gradient(circle, ${PRIMARY}${orbOpacity} 0%, transparent 75%)`,
              animation: 'float-slow 22s ease-in-out infinite',
            }}
          />
          
          {/* Accent orb (bottom-left) — brand gold */}
          <div 
            className={`absolute bottom-[-8%] left-[-10%] w-[450px] h-[450px] rounded-full ${blur}`}
            style={{
              background: `radial-gradient(circle, ${ACCENT}${orbOpacity} 0%, transparent 75%)`,
              animation: 'float-slower 28s ease-in-out infinite reverse',
            }}
          />
        </>
      )}

      {/* 🌫️ Ultra-subtle noise texture for depth (barely visible) */}
      <div 
        className="absolute inset-0 opacity-[0.01]"
        style={{
          backgroundImage: `url("image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 🌓 Bottom fade — smooth blend into content */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 md:h-40"
        style={{
          background: `linear-gradient(to top, ${BASE} 0%, transparent 100%)`,
        }}
      />

      {/* 🎭 CSS Keyframes — respects reduced motion */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(1.5%, 1%) scale(1.015); }
          66% { transform: translate(-1%, 1.5%) scale(0.99); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-1.5%, -1%) scale(1.01); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="animation"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
});

AnimatedBackground.displayName = 'AnimatedBackground';