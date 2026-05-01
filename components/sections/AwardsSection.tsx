// @/components/sections/AwardsSection.tsx
'use client';

import { motion, useScroll, useTransform } from "framer-motion";
import { Award, TrendingUp, Star, Building, Users, Trophy, Medal, Crown, Sparkles, ChevronRight, Ribbon, BadgeCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  }, [isInView, targetValue, duration]);

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

// --- Data Configuration ---
const awards = [
  { 
    id: 1, 
    title: "Best Performance", 
    subtitle: "Sales Excellence Award", 
    description: "Recognized for outstanding sales achievement in Q4 2024 across all luxury segments.",
    icon: TrendingUp,
    metric: "Top 1%",
    year: "2024",
    gradient: "from-[#005E60] via-[#008B8B] to-[#00A8A8]",
    glow: "shadow-[#005E60]/30",
    ribbon: "bg-gradient-to-r from-[#F8C21C] to-[#DAA520]"
  },
  { 
    id: 2, 
    title: "Game Changer", 
    subtitle: "Innovation Award", 
    description: "Revolutionary approach to customer service that redefined industry standards.",
    icon: Star,
    metric: "Winner",
    year: "2022",
    gradient: "from-[#F8C21C] via-[#FFD700] to-[#DAA520]",
    glow: "shadow-[#F8C21C]/40",
    ribbon: "bg-gradient-to-r from-[#8B0000] to-[#A52A2A]"
  },
  { 
    id: 3, 
    title: "Platinum Star", 
    subtitle: "Luxury Segment Leader", 
    description: "Premium property sales excellence recognition for consecutive years.",
    icon: Award,
    metric: "Platinum",
    year: "2023",
    gradient: "from-[#8B0000] via-[#A52A2A] to-[#B22222]",
    glow: "shadow-[#8B0000]/30",
    ribbon: "bg-gradient-to-r from-[#005E60] to-[#008B8B]"
  },
  { 
    id: 4, 
    title: "Top Performer", 
    subtitle: "Residential Category", 
    description: "Leading residential property consultant with highest client satisfaction ratings.",
    icon: Building,
    metric: "#1 Ranked",
    year: "2024",
    gradient: "from-[#005E60] via-[#008B8B] to-[#00A8A8]",
    glow: "shadow-[#005E60]/30",
    ribbon: "bg-gradient-to-r from-[#F8C21C] to-[#DAA520]"
  }
];

const stats = [
  { label: "Years of Excellence", value: 15, suffix: "+", icon: Trophy, accent: "#005E60", delay: 0 },
  { label: "Awards Won", value: 50, suffix: "+", icon: Medal, accent: "#F8C21C", delay: 0.1 },
  { label: "Happy Clients", value: 5000, suffix: "+", icon: Users, accent: "#8B0000", delay: 0.2 },
  { label: "Projects Completed", value: 200, suffix: "+", icon: Building, accent: "#005E60", delay: 0.3 }
];

export default function AwardsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section 
      ref={sectionRef}
      className="py-24 md:py-32 bg-white relative overflow-hidden"
    >
      {/* ✨ Luxury Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated gradient mesh */}
        <motion.div 
          style={{ y: yBackground }}
          className="absolute inset-0 opacity-30"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#005E60]/5 via-transparent to-transparent" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#8B0000]/5 via-transparent to-transparent" />
        </motion.div>
        
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#F8C21C]/40 rounded-full"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* 🏆 Ultra-Premium Header */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-4xl mx-auto mb-24"
        >
        
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 font-montserrat leading-[1.1]"
          >
            {/* <span className="block text-gray-400 text-2xl md:text-3xl font-normal tracking-[0.2em] uppercase mb-2">
              Celebrating
            </span>
            <span className="block">
              Brick by Brick
            </span> */}
            <span className="block  relative">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#005E60] via-[#007a7c] to-[#8B0000] bg-[length:200%_auto] animate-gradient">
                Achievements
              </span>
              {/* Elegant underline with sparkle */}
              <svg 
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-6 text-[#F8C21C]/60"
                viewBox="0 0 200 24" 
                fill="none"
              >
                <path 
                  d="M4 20Q30 4, 60 12T120 10T196 20" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                  strokeDasharray="200"
                  strokeDashoffset="200"
                  className="animate-draw"
                />
              </svg>
              <Sparkles className="absolute -bottom-1 -right-2 w-4 h-4 text-[#F8C21C] animate-pulse" />
            </span>
          </motion.h2>

          {/* Description */}
          {/* <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-8 text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto"
          >
            Industry recognition that validates our unwavering commitment to 
            <span className="text-gray-900 font-semibold border-b-2 border-[#F8C21C]/40">excellence</span> and 
            <span className="text-gray-900 font-semibold border-b-2 border-[#005E60]/40">customer satisfaction</span>.
          </motion.p> */}

          {/* Decorative Divider with Icons */}
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
            className="mt-12 flex items-center justify-center gap-4"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#005E60]/40 to-transparent" />
            <BadgeCheck className="w-6 h-6 text-[#F8C21C]" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent via-[#8B0000]/40 to-transparent" />
          </motion.div>
        </motion.div>

        {/* 🏅 Awards Grid - Luxury Trophy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-28">
          {awards.map((item, index) => (
            <AwardCard key={item.id} item={item} index={index} />
          ))}
        </div>

        {/* 📊 Premium Stats Section - Floating Glass Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative mb-24"
        >
          {/* Glass Panel with Depth */}
          <div className="relative bg-gradient-to-br from-white/90 via-white/70 to-white/90 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-2xl shadow-[#005E60]/5 overflow-hidden">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#005E60]/2 via-transparent to-[#8B0000]/2 pointer-events-none" />
            
            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#F8C21C]/10 to-transparent rounded-br-full" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#005E60]/10 to-transparent rounded-tl-full" />
            
            <div className="relative p-8 md:p-14">
              {/* Section Title */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#005E60]/10 rounded-full mb-4">
                  <Trophy className="w-4 h-4 text-[#005E60]" />
                  <span className="text-[#005E60] text-xs font-bold uppercase tracking-wider">By The Numbers</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Trusted by Results
                </h3>
                <p className="mt-2 text-gray-500">
                  Milestones that speak louder than words
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
                {stats.map((stat, index) => (
                  <StatCard key={index} {...stat} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ✨ Optional CTA with Ribbon */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="relative inline-flex mx-auto group"
        >
          {/* Decorative ribbon */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#005E60] via-[#F8C21C] to-[#8B0000] rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity" />
          
          <a 
            href="/about"
            className="relative inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-all duration-300 shadow-xl hover:shadow-2xl group/btn"
          >
            <span>Discover Our Story</span>
            <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
            <Sparkles className="w-4 h-4 text-[#F8C21C] animate-pulse" />
          </a>
        </motion.div>

      </div>
    </section>
  );
}

// --- Luxury Award Card Component ---
function AwardCard({ item, index }: { item: any; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: -10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ 
        delay: index * 0.12, 
        duration: 0.6, 
        ease: [0.16, 1, 0.3, 1],
        type: "spring",
        stiffness: 80
      }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-default perspective-1000"
    >
      <div 
        ref={cardRef}
        className={`
          relative bg-white rounded-3xl p-7 h-full
          border border-gray-100/80
          transition-all duration-500 ease-out
          ${isHovered ? 'shadow-2xl shadow-[#005E60]/15 -translate-y-3 border-transparent' : 'shadow-xl'}
          overflow-hidden
        `}
      >
        {/* Animated gradient background on hover */}
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0`}
          animate={{ opacity: isHovered ? 0.04 : 0 }}
          transition={{ duration: 0.4 }}
        />

        {/* Decorative ribbon corner */}
        <div className={`
          absolute -top-3 -right-3 w-20 h-20 
          ${item.ribbon} opacity-0 group-hover:opacity-100
          rounded-full blur-xl transition-opacity duration-500
        `} />

        {/* Trophy icon with 3D effect */}
        <div className="relative mb-6">
          <motion.div 
            className={`
              relative w-16 h-16 rounded-2xl flex items-center justify-center
              bg-gradient-to-br ${item.gradient}
              shadow-lg ${item.glow}
            `}
            animate={isHovered ? { 
              scale: 1.08, 
              rotate: [0, -3, 3, -2, 2, 0],
              boxShadow: `0 20px 40px -10px ${item.glow.replace('shadow-', '').replace('/30', '/50')}`
            } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Icon className="w-8 h-8 text-white drop-shadow-sm" strokeWidth={1.5} />
            
            {/* Animated sparkle */}
            <motion.div
              className="absolute -top-1.5 -right-1.5"
              animate={{ 
                scale: [1, 1.4, 1],
                opacity: [0.7, 1, 0.7],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-4 h-4 text-[#F8C21C] drop-shadow" />
            </motion.div>
          </motion.div>

          {/* Year badge */}
          <div className="absolute -bottom-2 -right-2 px-2.5 py-1 bg-gray-900 text-white text-[10px] font-bold rounded-full shadow-lg">
            {item.year}
          </div>
        </div>

        {/* Metric badge with gradient */}
        <motion.div 
          className={`
            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-4
            bg-gradient-to-r ${item.gradient} text-white text-xs font-bold shadow-md
          `}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 + index * 0.1 }}
        >
          <Ribbon className="w-3 h-3" />
          {item.metric}
        </motion.div>

        {/* Content */}
        <div className="relative space-y-3">
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#005E60] transition-colors">
              {item.title}
            </h4>
            <p className="text-sm font-semibold text-gray-500">
              {item.subtitle}
            </p>
          </div>
          
          <p className="text-sm text-gray-600 leading-relaxed">
            {item.description}
          </p>

          {/* Animated progress bar accent */}
          <motion.div 
            className={`h-1.5 rounded-full bg-gradient-to-r ${item.gradient} mt-4`}
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: "100%", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.8, ease: "easeOut" }}
          />
        </div>

        {/* Hover border glow */}
        <motion.div 
          className={`
            absolute inset-0 rounded-3xl pointer-events-none
            border-2 border-transparent
          `}
          animate={{
            borderColor: isHovered ? `${item.glow.replace('shadow-', '').replace('/30', '/40')}` : 'transparent',
            boxShadow: isHovered ? `0 0 0 1px ${item.glow.replace('shadow-', '').replace('/30', '/10')}` : 'none'
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
}

// --- Premium Stat Card with Animation ---
function StatCard({ label, value, suffix, icon: Icon, accent, delay }: any) {
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
      {/* Animated Icon Container with depth */}
      <div className="relative flex justify-center mb-6">
        {/* Glow effect */}
        <motion.div 
          className={`absolute inset-0 rounded-2xl blur-xl opacity-0`}
          style={{ backgroundColor: accent }}
          animate={{ opacity: isHovered ? 0.3 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        <motion.div 
          className={`
            relative w-18 h-18 rounded-2xl flex items-center justify-center
            bg-white shadow-lg border border-gray-100
            transition-all duration-300
          `}
          animate={isHovered ? { 
            scale: 1.12, 
            borderColor: accent,
            boxShadow: `0 0 0 4px ${accent}15, 0 20px 40px -10px ${accent}30`
          } : {}}
        >
          <motion.div
            animate={isHovered ? { rotate: [0, -5, 5, -3, 3, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            <Icon 
              className="w-8 h-8 transition-colors duration-300" 
              style={{ color: isHovered ? accent : '#005E60' }} 
            />
          </motion.div>
        </motion.div>
        
        {/* Floating sparkle */}
        <motion.div
          className="absolute -top-1 -right-1 text-[#F8C21C]"
          animate={isHovered ? { 
            y: [-3, 3, -3], 
            rotate: [0, 180, 360],
            scale: [1, 1.3, 1]
          } : {}}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles size={16} className="drop-shadow" />
        </motion.div>
      </div>
      
      {/* Animated Number with gradient */}
      <motion.div 
        className="text-4xl md:text-5xl font-bold mb-2 font-montserrat"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: delay + 0.2 }}
      >
        <span className="text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-600">
          {count}
        </span>
        <motion.span 
          className="text-2xl md:text-3xl text-gray-400 ml-0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.5 }}
        >
          {suffix}
        </motion.span>
      </motion.div>
      
      {/* Label */}
      <motion.div 
        className="text-sm md:text-base font-medium text-gray-600"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: delay + 0.3 }}
      >
        {label}
      </motion.div>

      {/* Animated underline on hover */}
      <motion.div 
        className="h-0.5 mx-auto mt-4 rounded-full"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
        initial={{ width: 0, opacity: 0 }}
        whileHover={{ width: "70%", opacity: 1 }}
        transition={{ duration: 0.4 }}
      />
    </motion.div>
  );
}