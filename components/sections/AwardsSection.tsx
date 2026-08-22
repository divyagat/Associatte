'use client';

import { motion } from "framer-motion";
import { Trophy, ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AWARDS } from "@/lib/awards-data";

export default function AwardsSection() {
  // Show only first 4 awards on home page
  const featuredAwards = AWARDS.slice(0, 4);

  return (
    <section className="py-10 md:py-14 bg-white relative overflow-hidden">
      {/* Background Effects - Scaled down */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#005E60]/5 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#F8C21C]/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header - Compact & Tight Spacing */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-6 md:mb-8"
        >
          <div className="inline-flex items-center gap-1.5 bg-[#F8C21C]/15 text-[#8B0000] px-3 py-1 rounded-full text-xs font-bold mb-3">
            <Trophy size={14} />
            <span>Awards & Recognition</span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 tracking-tight">
            Celebrating a Legacy of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#005E60] to-[#8B0000]">
              Excellence
            </span>
          </h2>
          
          <p className="text-sm md:text-base text-gray-600 px-2">
            Industry recognition reflecting our commitment to sales excellence and customer satisfaction.
          </p>
        </motion.div>

        {/* Awards Grid - 2 cols on mobile, 4 on desktop, tight gaps */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
          {featuredAwards.map((award, index) => (
            <AwardCard key={award.id} award={award} index={index} />
          ))}
        </div>

        {/* View All Link - Compact */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            href="/awards"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#005E60] text-white text-sm font-semibold rounded-lg hover:bg-[#004a4d] transition-all duration-300 shadow-md hover:shadow-lg group"
          >
            <span>View All Awards</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function AwardCard({ award, index }: { award: any; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-default"
    >
      <div className={`
        relative bg-white rounded-lg p-3 h-full flex flex-col
        border border-gray-100
        transition-all duration-300
        ${isHovered ? 'shadow-lg shadow-[#005E60]/10 -translate-y-0.5' : 'shadow-sm'}
      `}>
        {/* Image Frame - Shorter aspect ratio (16:9) */}
        <div className="relative mb-2 overflow-hidden rounded-md bg-gray-50 border border-gray-200">
          <div className="aspect-video relative">
            <Image
              src={award.image}
              alt={award.title}
              fill
              className="object-contain p-1.5 transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 25vw"
            />
          </div>
          {/* Year Badge - Smaller */}
          <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-[#005E60] text-white text-[10px] font-bold rounded shadow-sm">
            {award.year}
          </div>
        </div>

        {/* Content - Tight typography */}
        <div className="flex-1 flex flex-col">
          <h3 className="text-sm font-bold text-gray-900 mb-0.5 group-hover:text-[#005E60] transition-colors line-clamp-2 leading-tight">
            {award.title}
          </h3>
          <p className="text-[11px] font-semibold text-[#8B0000] mb-1.5 line-clamp-1">
            {award.subtitle}
          </p>
          
          {/* Accent Line - Pushed to bottom for uniform height */}
          <div className="h-0.5 w-full bg-gradient-to-r from-[#005E60] to-[#F8C21C] mt-auto rounded-full" />
        </div>
      </div>
    </motion.div>
  );
}