'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { MapPin, Bed, Square, Tag, ArrowRight, Building2 } from 'lucide-react';

interface Project {
  slug: string;
  name: string;
  location: string;
  price: string;
  image: string;
  developer?: { name: string };
  bhk?: string[];
  sqft?: string;
  propertyType?: string;
  configurations?: Array<{ type: string; area?: string }>;
  [key: string]: any;
}

interface BuilderProjectCardProps {
  project: Project;
}

const FALLBACK_IMAGE = '/images/placeholder-property.webp';

export default function BuilderProjectCard({ project }: BuilderProjectCardProps) {
  // ✅ Defensive checks
  if (!project?.slug || !project?.name) {
    console.warn('BuilderProjectCard: Missing required props', project);
    return null;
  }

  // ✅ Safe data extraction with fallbacks
  const displayName = project.name;
  const displayLocation = project.fullLocation?.area || project.location || 'Location not specified';
  const displayPrice = project.priceDetails?.range || project.price || 'Contact for Price';
  const displayImage = project.images?.[0] || project.image || FALLBACK_IMAGE;
  
  // ✅ Extract BHK from configurations OR bhk array
  const configBHKs = project.priceDetails?.configurations
    ?.map((c: any) => c.type?.match(/\d+\s*[RB]HK/i)?.[0])
    .filter(Boolean)
    .map((b: string) => b.toUpperCase()) || [];
  
  const displayBHK = project.bhk?.length ? project.bhk : configBHKs;
  
  // ✅ Extract area/sqft
  const areas = project.priceDetails?.configurations
    ?.map((c: any) => c.area)
    .filter((a: any) => a && !isNaN(a));
  
  const displaySqft = areas?.length 
    ? `${Math.min(...areas)} - ${Math.max(...areas)} SQ.FT.`
    : project.sqft || project.priceDetails?.configurations?.[0]?.area || null;

  const displayBuilder = project.developer?.name || null;
  // ✅ FIX: Change null to undefined to match getBadgeColors parameter type
  const displayType = project.propertyType || undefined;

  // ✅ Badge colors based on property type
  const getBadgeColors = (type?: string) => {
    if (!type) return { bg: '#005E60', text: 'white' };
    const t = type.toLowerCase();
    if (t.includes('commercial') || t.includes('office')) return { bg: '#8B0000', text: 'white' };
    if (t.includes('plot') || t.includes('land') || t.includes('pre-launch')) return { bg: '#F8C21C', text: '#8B0000' };
    return { bg: '#005E60', text: 'white' };
  };
  const badgeColors = getBadgeColors(displayType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="group h-full"
    >
      <Link
        href={`/property/${project.slug}`}
        className="block h-full bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-[#005E60]/30 transition-all duration-300 overflow-hidden"
      >
        {/* ✅ Image: Consistent 4:3 ratio, no cropping important content */}
        <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
          <Image
            src={displayImage}
            alt={displayName}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={false}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== FALLBACK_IMAGE) target.src = FALLBACK_IMAGE;
            }}
          />
          
          {/* Property Type Badge */}
          {displayType && (
            <span 
              className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded-md shadow-sm whitespace-nowrap"
              style={{ backgroundColor: badgeColors.bg, color: badgeColors.text }}
            >
              {displayType}
            </span>
          )}
          
          {/* Price Badge */}
          <span className="absolute bottom-3 left-3 px-3 py-1.5 bg-[#005E60] text-white text-sm font-semibold rounded-lg shadow-md whitespace-nowrap">
            {displayPrice}
          </span>
        </div>

        {/* ✅ Content: Flexible height, NO content cut */}
        <div className="p-4 flex flex-col">
          
          {/* Project Name: NO line-clamp, wraps naturally */}
          <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-[#8B0000] transition-colors leading-snug break-words">
            {displayName}
          </h3>

          {/* Location: Wraps if long, no truncation */}
          <div className="flex items-start gap-1.5 text-sm text-gray-600 mb-3">
            <MapPin className="w-4 h-4 text-[#005E60] flex-shrink-0 mt-0.5" />
            <span className="break-words capitalize">{displayLocation}</span>
          </div>

          {/* ✅ BHK Tags: Wrap gracefully, show all (or scroll if many) */}
          {displayBHK && displayBHK.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {displayBHK.map((type: string, idx: number) => (
                <span 
                  key={`${type}-${idx}`} 
                  className="px-2.5 py-1 bg-[#005E60]/10 text-[#005E60] text-xs rounded-md font-medium flex items-center gap-1 whitespace-nowrap"
                >
                  <Bed className="w-3 h-3 flex-shrink-0" />
                  {type}
                </span>
              ))}
            </div>
          )}

          {/* ✅ SQFT: Separate line, no crowding */}
          {displaySqft && (
            <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-3">
              <Square className="w-4 h-4 text-[#8B0000] flex-shrink-0" />
              <span className="break-words">{displaySqft}</span>
            </div>
          )}

          {/* Builder: Full name visible */}
          {displayBuilder && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
              <Building2 className="w-3.5 h-3.5 text-[#005E60] flex-shrink-0" />
              <span className="break-words">by <span className="text-gray-700 font-medium">{displayBuilder}</span></span>
            </div>
          )}

          {/* ✅ Zero Brokerage + CTA: Always visible at bottom */}
          <div className="mt-auto pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Tag className="w-3.5 h-3.5 text-[#005E60] flex-shrink-0" />
                <span className="whitespace-nowrap">Zero Brokerage</span>
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-[#005E60] group-hover:gap-2 transition-all whitespace-nowrap">
                View Details 
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
              </span>
            </div>
          </div>
          
        </div>
      </Link>
    </motion.div>
  );
}