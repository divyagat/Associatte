// @/components/sections/AwardsSection.tsx
'use client';

import { motion } from "framer-motion";
import { Trophy, Sparkles, BadgeCheck, ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AWARDS } from "@/lib/awards-data";

export default function AwardsSection() {
  // Show only first 3-4 awards on home page
  const featuredAwards = AWARDS.slice(0, 4);

  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#005E60]/5 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F8C21C]/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#F8C21C] text-[#8B0000] px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Trophy size={16} />
            <span>Awards & Recognition</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Celebrating a Legacy of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#005E60] to-[#8B0000]">
              Excellence
            </span>
          </h2>
          
          <p className="text-lg text-gray-600">
            Industry recognition that reflects our commitment to sales excellence,
            innovation and unmatched customer satisfaction.
          </p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#005E60]/40 to-transparent" />
            <BadgeCheck className="w-6 h-6 text-[#F8C21C]" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent via-[#8B0000]/40 to-transparent" />
          </div>
        </motion.div>

        {/* Awards Grid - Featured */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredAwards.map((award, index) => (
            <AwardCard key={award.id} award={award} index={index} />
          ))}
        </div>

        {/* View All Link */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            href="/awards"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#005E60] text-white font-semibold rounded-full hover:bg-[#004a4d] transition-all duration-300 shadow-xl hover:shadow-2xl group"
          >
            <span>View All Awards</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-default"
    >
      <div className={`
        relative bg-white rounded-xl p-4 h-full
        border border-gray-100
        transition-all duration-300
        ${isHovered ? 'shadow-xl shadow-[#005E60]/10 -translate-y-1' : 'shadow-md'}
      `}>
        {/* Image Frame */}
        <div className="relative mb-4 overflow-hidden rounded-lg bg-gray-50 border-2 border-gray-200">
          <div className="aspect-[4/3] relative">
            <Image
              src={award.image}
              alt={award.title}
              fill
              className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </div>
          {/* Year Badge */}
          <div className="absolute top-2 right-2 px-2 py-1 bg-[#005E60] text-white text-xs font-bold rounded-md shadow-md">
            {award.year}
          </div>
        </div>

        {/* Content */}
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-[#005E60] transition-colors">
            {award.title}
          </h3>
          <p className="text-xs font-semibold text-[#8B0000] mb-2">
            {award.subtitle}
          </p>
        </div>

        {/* Accent Line */}
        <div className="h-0.5 w-full bg-gradient-to-r from-[#005E60] to-[#F8C21C] mt-3 rounded-full" />
      </div>
    </motion.div>
  );
}