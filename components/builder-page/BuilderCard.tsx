// client/components/builder-page/BuilderCard.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Building2, ArrowRight } from 'lucide-react';

// ✅ Define expected builder summary interface
export interface Builder {
  id: string;
  name: string;
  slug: string;  // ✅ Required for href
  years: string;
  logo: string;
  totalProjects: number;
  locations: string[];
}

interface BuilderCardProps {
  builder: Builder; // ✅ Enforce type
}

export default function BuilderCard({ builder }: BuilderCardProps) {
  // ✅ Defensive: return null if required props missing
  if (!builder?.slug || !builder?.name) {
    console.warn('BuilderCard: Missing required props', builder);
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true, margin: "-50px" }} 
      transition={{ duration: 0.3 }} 
      whileHover={{ y: -4 }} 
      className="group"
    >
      <Link 
        href={`/builders/${builder.slug}`}  // ✅ Now safe
        className="block bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-[#005E60]/30 transition-all duration-300 overflow-hidden"
      >
        <div className="p-5 border-b border-gray-100 flex items-start justify-between">
          <div className="h-14 w-24 bg-gray-50 rounded-lg flex items-center justify-center p-2 border border-gray-100">
            <img 
              src={builder.logo || '/logos/placeholder.png'} 
              alt={`${builder.name} logo`} 
              className="max-h-10 w-auto object-contain" 
              onError={e => (e.target as HTMLImageElement).src = '/logos/placeholder.png'} 
            />
          </div>
          <span className="px-3 py-1 bg-[#005E60]/10 text-[#005E60] text-xs font-bold rounded-full">
            {builder.years}
          </span>
        </div>
        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#8B0000] transition-colors line-clamp-1">
            {builder.name}
          </h3>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {builder.locations?.slice(0, 3).map(loc => (
              <span key={loc} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                <MapPin className="w-3 h-3" />{loc}
              </span>
            ))}
            {builder.locations?.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
                +{builder.locations.length - 3}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building2 className="w-4 h-4 text-[#005E60]" />
              <span>{builder.totalProjects} Projects</span>
            </div>
            <span className="flex items-center gap-1 text-[#005E60] text-sm font-medium group-hover:gap-2 transition-all">
              View <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-[#005E60] to-[#F8C21C] w-0 group-hover:w-full transition-all duration-400" />
      </Link>
    </motion.div>
  );
}