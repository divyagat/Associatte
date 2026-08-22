'use client';

/* eslint-disable @next/next/no-img-element -- intentionally a plain <img>: these
   render arbitrary remote/admin-uploaded URLs, and we want to bypass the Next
   image optimizer (which times out on slow upstreams) and fall back gracefully. */

import { useState, type ReactNode } from 'react';
import { Building2 } from 'lucide-react';

interface SafeImageProps {
  src?: string;
  alt: string;
  /** Extra classes for the <img> itself (it always fills its relative parent). */
  className?: string;
  /** Custom fallback rendered when there's no src or the image fails to load. */
  fallback?: ReactNode;
  sizes?: string;
}

/**
 * Fills its (relatively-positioned) parent with an object-cover image. On error
 * or missing src it shows a branded gradient placeholder instead of a broken
 * image — so the layout always looks intentional. Same approach the blog list
 * already uses, extracted for reuse.
 */
export default function SafeImage({ src, alt, className = '', fallback, sizes }: SafeImageProps) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <>
        {fallback ?? (
          <div className="absolute inset-0 bg-gradient-to-br from-[#005E60] to-[#101C2E] flex items-center justify-center">
            <Building2 className="text-white/40" size={40} />
          </div>
        )}
      </>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      sizes={sizes}
      loading="lazy"
      onError={() => setErrored(true)}
      className={`absolute inset-0 w-full h-full object-cover ${className}`}
    />
  );
}
