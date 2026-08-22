// @/components/sections/AwardsSection.tsx
'use client';

<<<<<<< HEAD
import { motion } from "framer-motion";
import { Trophy, Sparkles, BadgeCheck, ArrowRight } from "lucide-react";
import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { AWARDS } from "@/lib/awards-data";

export default function AwardsSection() {
  // Show only first 3-4 awards on home page
  const featuredAwards = AWARDS.slice(0, 4);
=======
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Award, TrendingUp, Star, Building, Users, Trophy, Medal, Crown, Sparkles,
  ChevronRight, BadgeCheck, ShieldCheck, ArrowRight,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SafeImage from "@/components/common/SafeImage";
import { AWARDS, AWARD_STATS, type AwardItem, type AwardIconName } from "@/lib/awards-data";

// Map the icon names stored in lib/awards-data.ts to lucide components.
const ICON: Record<AwardIconName, React.ComponentType<{ className?: string; size?: number; strokeWidth?: number; style?: React.CSSProperties }>> = {
  TrendingUp, Star, Award, Building, Trophy, Medal, Users, Crown, ShieldCheck,
};

const stats = AWARD_STATS;

// --- Hook for Animated Numbers ---
function useCountUp(targetValue: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView && startOnView) {
      let startTime: number;
      let animationFrame: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeOutQuart * targetValue));
        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        } else {
          setCount(targetValue);
        }
      };
      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [isInView, targetValue, duration, startOnView]);

  return { count, ref };
}

// Simple useInView fallback if not imported
function useInView(ref: any, options: any) {
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        if (options?.once) observer.disconnect();
      }
    }, { threshold: 0.1, ...options });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options]);
  return isInView;
}

interface AwardsSectionProps {
  /** Show a "View All Awards" button linking to /awards (used on the home page). */
  showViewAllLink?: boolean;
}

export default function AwardsSection({ showViewAllLink = false }: AwardsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
>>>>>>> 59b71951adc8805b4e39d1cc53c97d9f007f8dbb

  // Start from the built-in defaults (instant SSR/first paint), then swap in the
  // admin-managed list from /api/awards once it loads.
  const [awards, setAwards] = useState<AwardItem[]>(AWARDS);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/awards')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setAwards(data);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return (
<<<<<<< HEAD
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
=======
    <section
      ref={sectionRef}
      className="py-20 md:py-28 bg-white relative overflow-hidden"
    >
      {/* ✨ Luxury Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div style={{ y: yBackground }} className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#005E60]/5 via-transparent to-transparent" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#8B0000]/5 via-transparent to-transparent" />
        </motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* 🏆 Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#005E60]/10 text-[#005E60] text-sm font-semibold rounded-full mb-5">
            <Trophy className="w-4 h-4" /> Awards &amp; Recognition
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 font-montserrat leading-[1.1]">
            <span className="block relative">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#005E60] via-[#007a7c] to-[#8B0000] bg-[length:200%_auto] animate-gradient">
                Achievements
              </span>
              <Sparkles className="absolute -bottom-1 -right-2 w-4 h-4 text-[#F8C21C] animate-pulse" />
            </span>
          </h2>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
            className="mt-10 flex items-center justify-center gap-4"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#005E60]/40 to-transparent" />
            <BadgeCheck className="w-6 h-6 text-[#F8C21C]" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent via-[#8B0000]/40 to-transparent" />
          </motion.div>
        </motion.div>

        {/* 🖼️ Framed Awards — a "wall of frames" */}
        {awards.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-24">
            {awards.map((item, index) => (
              <FramedAward key={item.id} item={item} index={index} />
            ))}
          </div>
        )}

        {/* 📊 Stats */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative mb-20"
        >
          <div className="relative bg-gradient-to-br from-white/90 via-white/70 to-white/90 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-2xl shadow-[#005E60]/5 overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#F8C21C]/10 to-transparent rounded-br-full" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#005E60]/10 to-transparent rounded-tl-full" />
            <div className="relative p-8 md:p-14">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#005E60]/10 rounded-full mb-4">
                  <Trophy className="w-4 h-4 text-[#005E60]" />
                  <span className="text-[#005E60] text-xs font-bold uppercase tracking-wider">By The Numbers</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Trusted by Results</h3>
                <p className="mt-2 text-gray-500">Milestones that speak louder than words</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
                {stats.map((stat, index) => (
                  <StatCard key={index} {...stat} delay={index * 0.1} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
>>>>>>> 59b71951adc8805b4e39d1cc53c97d9f007f8dbb
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
<<<<<<< HEAD
          <Link
            href="/awards"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#005E60] text-white font-semibold rounded-full hover:bg-[#004a4d] transition-all duration-300 shadow-xl hover:shadow-2xl group"
          >
            <span>View All Awards</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
=======
          {showViewAllLink && (
            <Link
              href="/awards"
              className="relative inline-flex items-center gap-2 px-8 py-4 bg-[#005E60] text-white font-semibold rounded-full hover:bg-[#004a4d] transition-all duration-300 shadow-xl hover:shadow-2xl group/all"
            >
              <span>View All Awards</span>
              <ArrowRight size={18} className="group-hover/all:translate-x-1 transition-transform" />
            </Link>
          )}

          <span className="relative inline-flex group">
            <span className="absolute -inset-1 bg-gradient-to-r from-[#005E60] via-[#F8C21C] to-[#8B0000] rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity" />
            <a
              href="/about-us"
              className="relative inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-all duration-300 shadow-xl hover:shadow-2xl group/btn"
            >
              <span>Discover Our Story</span>
              <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
              <Sparkles className="w-4 h-4 text-[#F8C21C] animate-pulse" />
            </a>
          </span>
>>>>>>> 59b71951adc8805b4e39d1cc53c97d9f007f8dbb
        </motion.div>
      </div>
    </section>
  );
}

<<<<<<< HEAD
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
=======
// --- Framed Award (photo-frame look) ---
function FramedAward({ item, index }: { item: AwardItem; index: number }) {
  const Icon = ICON[item.icon] || Trophy;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      {/* Hanging hook */}
      <div className="flex flex-col items-center">
        <span className="w-2.5 h-2.5 rounded-full bg-gray-400 shadow-inner ring-2 ring-gray-200" />
        <span className="w-px h-4 bg-gray-300" />
>>>>>>> 59b71951adc8805b4e39d1cc53c97d9f007f8dbb
      </div>

      {/* Ornate gold frame */}
      <div className="relative rounded-md bg-gradient-to-b from-[#e8c877] via-[#c8992f] to-[#8a6d1b] p-3 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.35)] transition-all duration-500 group-hover:-translate-y-2 group-hover:rotate-[0.6deg]">
        {/* Inner bevel */}
        <div className="rounded-sm bg-gradient-to-b from-[#5c4522] to-[#3d2e14] p-[3px]">
          {/* Cream matte */}
          <div className="bg-[#faf7ef] p-2 shadow-inner">
            <div className="relative aspect-[3/4] overflow-hidden border border-black/10">
              <SafeImage
                src={item.image}
                alt={item.title}
                className="group-hover:scale-105 transition-transform duration-700"
                fallback={
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                    <Icon className="text-white/70" size={44} />
                  </div>
                }
              />
              {/* Glass glare */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/25 pointer-events-none" />
              {/* Metric ribbon + year */}
              {item.metric && (
                <div className={`absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-0.5 rounded bg-gradient-to-r ${item.gradient} shadow`}>
                  {item.metric}
                </div>
              )}
              {item.year && (
                <div className="absolute bottom-2 right-2 bg-gray-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                  {item.year}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Brass nameplate */}
        <div className="mt-3 mx-auto w-[88%] rounded-sm bg-gradient-to-b from-[#3a3a3a] to-[#191919] px-3 py-2 text-center shadow-md border border-black/40">
          <p className="text-[#F8C21C] font-bold text-sm flex items-center justify-center gap-1.5 leading-tight">
            <Icon size={14} /> {item.title}
          </p>
          {item.subtitle && <p className="text-white/70 text-[11px] mt-0.5">{item.subtitle}</p>}
        </div>
      </div>

      {item.description && (
        <p className="mt-4 text-center text-sm text-gray-600 leading-relaxed px-2">
          {item.description}
        </p>
      )}
    </motion.div>
  );
<<<<<<< HEAD
}
=======
}

// --- Premium Stat Card with Animation ---
function StatCard({ label, value, suffix, icon, accent, delay }: any) {
  const Icon = ICON[icon as AwardIconName] || Trophy;
  const { count, ref } = useCountUp(value, 2200);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="text-center group cursor-default"
    >
      <div className="relative flex justify-center mb-6">
        <motion.div
          className="absolute inset-0 rounded-2xl blur-xl opacity-0"
          style={{ backgroundColor: accent }}
          animate={{ opacity: isHovered ? 0.3 : 0 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="relative w-16 h-16 rounded-2xl flex items-center justify-center bg-white shadow-lg border transition-colors duration-300"
          style={{ borderColor: isHovered ? accent : '#f3f4f6' }}
          animate={{
            scale: isHovered ? 1.12 : 1,
            boxShadow: isHovered
              ? `0 0 0 4px ${accent}15, 0 20px 40px -10px ${accent}30`
              : '0 10px 15px -3px rgba(0,0,0,0.1)',
          }}
          transition={{ duration: 0.3 }}
        >
          <Icon className="w-8 h-8" style={{ color: isHovered ? accent : '#005E60' }} />
        </motion.div>
      </div>

      <div className="text-4xl md:text-5xl font-bold mb-2 font-montserrat">
        <span className="text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-600">{count}</span>
        <span className="text-2xl md:text-3xl text-gray-400 ml-0.5">{suffix}</span>
      </div>

      <div className="text-sm md:text-base font-medium text-gray-600">{label}</div>
    </motion.div>
  );
}
>>>>>>> 59b71951adc8805b4e39d1cc53c97d9f007f8dbb
