'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Home } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import properties from '@/data/properties.json';
import { isPubliclyVisible } from '@/lib/visibility';

// ✅ ADD city PROP
interface FeaturedProjectsSectionProps {
  city: 'Pune' | 'Mumbai' | 'KDMC';
}

interface FeaturedProject {
  slug: string;
  name: string;
  location: string;
  price: string;
  bhk: string;
  image: string;
  badge: string;
  badgeColor: string;
}

function mapProjectToFeatured(project: any): FeaturedProject {
  const getBadge = (p: any) => {
    const possession = p.possessionDate?.toLowerCase() || '';
    if (possession.includes('ready') || possession.includes('dec 2024') || possession.includes('jan 2025')) {
      return { text: 'Ready to Move', color: 'bg-[#005E60]' };
    }
    if (possession.includes('2026') || possession.includes('2027') || possession.includes('2028')) {
      return { text: 'Under Construction', color: 'bg-[#F8C21C] text-[#005E60]' };
    }
    return { text: 'New Launch', color: 'bg-[#8B0000]' };
  };

  const { text: badgeText, color: badgeColor } = getBadge(project);
  const bhkTypes = project.priceDetails?.configurations?.map((c: any) => c.type) || [];
  const uniqueBhk = Array.from(new Set(bhkTypes.map((t: any) => String(t || '').trim()))).filter(Boolean).join(', ') || 'TBA';

  return {
    slug: project.slug,
    name: project.name,
    location: `${project.fullLocation?.area || project.location}, ${project.fullLocation?.city || ''}`.trim(),
    price: project.priceDetails?.range || project.price,
    bhk: uniqueBhk,
    image: project.image,
    badge: badgeText,
    badgeColor: badgeColor,
  };
}

const MAX_FEATURED_PROJECTS = 8;
const VISIBLE_CARDS = 6;

// Fallback image for broken links
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80';

export default function FeaturedProjectsSection({ city }: FeaturedProjectsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const featuredProjects = useMemo(() => {
    return properties
      .filter((p: any) => p.image && p.priceDetails?.range && isPubliclyVisible(p))
      .slice(0, MAX_FEATURED_PROJECTS)
      .map(mapProjectToFeatured);
  }, []);

  const maxIndex = Math.max(0, featuredProjects.length - VISIBLE_CARDS);

  const slideNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const slidePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  const resetInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!isPaused && featuredProjects.length > VISIBLE_CARDS) {
      intervalRef.current = setInterval(() => slideNext(), 5000);
    }
  }, [isPaused, slideNext, featuredProjects.length]);

  useEffect(() => {
    resetInterval();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [resetInterval]);

  const handleNext = () => { slideNext(); resetInterval(); };
  const handlePrev = () => { slidePrev(); resetInterval(); };
  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    resetInterval();
  };

  const handleImageError = (slug: string) => {
    setImageErrors(prev => ({ ...prev, [slug]: true }));
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0 }),
  };

  const COLORS = { primary: '#005E60', accent: '#F8C21C', alert: '#8B0000' };

  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="section-title text-gray-900">
              Featured <span style={{ color: COLORS.primary }}>Projects in {city}</span>
            </h2>
            <p className="text-gray-600 mt-1">Handpicked premium properties for you</p>
          </div>
          <Link href="/properties" className="group flex items-center gap-2 font-semibold transition-colors" style={{ color: COLORS.primary }}>
            Explore All Projects <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {featuredProjects.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500">No featured projects available at the moment.</p>
          </div>
        ) : (
          <div className="relative" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
            {featuredProjects.length > VISIBLE_CARDS && (
              <>
                <button onClick={handlePrev} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center transition-all hover:scale-110" style={{ color: COLORS.primary }} aria-label="Previous projects">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={handleNext} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center transition-all hover:scale-110" style={{ color: COLORS.primary }} aria-label="Next projects">
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            <div className="overflow-hidden">
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.3 } }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
                >
                  {featuredProjects.slice(currentIndex, currentIndex + VISIBLE_CARDS).map((project) => (
                    <motion.div
                      key={project.slug}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="group bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                    >
                      {/* ✅ FIXED IMAGE CONTAINER - Consistent aspect ratio 4:3 */}
                      <div className="relative w-full aspect-[4/3] overflow-hidden flex-shrink-0 bg-gray-100">
                        <Image
                          src={imageErrors[project.slug] ? FALLBACK_IMAGE : (project.image || FALLBACK_IMAGE)}
                          alt={project.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 16vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={() => handleImageError(project.slug)}
                          priority={currentIndex === 0}
                        />
                        
                        {/* Badge */}
                        <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold text-white z-10 ${project.badgeColor}`}>
                          {project.badge}
                        </div>
                        
                        {/* Favorite Button */}
                        <button className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 z-10">
                          <svg className="w-4 h-4 text-gray-600 hover:text-[#8B0000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Content */}
                      <div className="p-3 flex flex-col flex-grow">
                        <h3 className="font-bold text-sm text-gray-900 mb-0.5 group-hover:text-[#005E60] transition-colors line-clamp-1">
                          {project.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                          <MapPin size={12} style={{ color: COLORS.alert }} />
                          <span className="line-clamp-1">{project.location}</span>
                        </div>
                        <p className="font-bold text-sm mb-0.5" style={{ color: COLORS.alert }}>
                          {project.price}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                          <Home size={12} />
                          <span className="line-clamp-1">{project.bhk}</span>
                        </div>
                        <Link 
                          href={`/property/${project.slug}`} 
                          className="w-full py-1.5 rounded-lg font-semibold text-xs transition-all duration-300 text-center mt-auto hover:opacity-90"
                          style={{ backgroundColor: COLORS.primary, color: 'white' }}
                        >
                          View Details
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {featuredProjects.length > VISIBLE_CARDS && (
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'w-6' : 'w-2 bg-gray-300 hover:bg-gray-400'}`}
                    style={{ backgroundColor: index === currentIndex ? COLORS.primary : undefined }}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}