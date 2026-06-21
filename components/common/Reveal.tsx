'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface RevealProps {
  children: ReactNode;
  /** Entrance direction for the initial offset. */
  direction?: Direction;
  /** Stagger delay in ms (use the item index * step). */
  delay?: number;
  /** Render as a different element (e.g. 'li', 'span'). Defaults to 'div'. */
  as?: ElementType;
  className?: string;
  /** Trigger margin — start the animation slightly before the element is fully in view. */
  rootMargin?: string;
}

const OFFSETS: Record<Direction, string> = {
  up: 'translateY(24px)',
  down: 'translateY(-24px)',
  left: 'translateX(24px)',
  right: 'translateX(-24px)',
  none: 'none',
};

/**
 * Lightweight scroll-reveal. Replaces framer-motion `whileInView` entrances with
 * a single IntersectionObserver + a GPU-friendly opacity/transform transition.
 * Animates once, then disconnects. Honors `prefers-reduced-motion` (handled in
 * globals.css, which forces the final state).
 */
export default function Reveal({
  children,
  direction = 'up',
  delay = 0,
  as: Tag = 'div',
  className = '',
  rootMargin = '0px 0px -10% 0px',
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // If IO is unavailable, just show immediately.
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <Tag
      ref={ref}
      data-reveal
      data-visible={visible ? 'true' : 'false'}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : OFFSETS[direction],
        transition: `opacity 0.5s ease-out ${delay}ms, transform 0.5s ease-out ${delay}ms`,
        willChange: visible ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </Tag>
  );
}
