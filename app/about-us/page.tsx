'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useInView, type Variants, type EasingFunction } from 'framer-motion';
import { 
  Users, Building2, MapPin, Star, ShieldCheck, Heart, 
  ArrowRight, Check, Home, Key, TrendingUp, Clock,
  Globe, Mail, Phone, Award, Target, Share2,
} from 'lucide-react';
import EnquiryPopup from '@/components/common/EnquiryPopup';

// ✅ Brand Colors - Solid individual colors (no mixed gradients)
const COLORS = {
  red: 'var(--color-secondary)',
  green: 'var(--color-primary)',
  yellow: 'var(--color-gold)',
  
  // Opacity variants
  greenBg: 'color-mix(in srgb, var(--color-primary) 8%, transparent)',
  greenBorder: 'color-mix(in srgb, var(--color-primary) 18%, transparent)',
  redBg: 'color-mix(in srgb, var(--color-secondary) 8%, transparent)',
  redBorder: 'color-mix(in srgb, var(--color-secondary) 18%, transparent)',
  yellowBg: 'color-mix(in srgb, var(--color-gold) 15%, transparent)',
  yellowBorder: 'color-mix(in srgb, var(--color-gold) 30%, transparent)',
};

const easeOut: EasingFunction = [0.22, 1, 0.36, 1] as unknown as EasingFunction;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } }
};

const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } }
};

export default function AboutUs() {
  const { scrollYProgress } = useScroll();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  const statsRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const valuesRef = useRef<HTMLElement>(null);
  const teamRef = useRef<HTMLElement>(null);

  useInView(statsRef, { once: true, margin: "-10%" });
  useInView(servicesRef, { once: true, margin: "-10%" });
  useInView(valuesRef, { once: true, margin: "-10%" });
  useInView(teamRef, { once: true, margin: "-10%" });

  const stats = [
    { value: '25K+', label: 'Happy Homeowners', icon: Users, color: COLORS.green },
    { value: '₹500Cr+', label: 'Property Value Listed', icon: Building2, color: COLORS.red },
    { value: '4.9/5', label: 'Customer Rating', icon: Star, color: COLORS.yellow },
    { value: '24/7', label: 'Expert Support', icon: Clock, color: COLORS.green },
  ];

  const specializations = [
    { title: 'Residential Properties', desc: 'Apartments, villas & plotted developments across Pune, Mumbai & more', icon: Home, color: COLORS.green },
    { title: 'Commercial Spaces', desc: 'Office spaces, retail shops & warehouses for your business needs', icon: Building2, color: COLORS.red },
    { title: 'Home Loan Assistance', desc: 'Connect with top banks & NBFCs for best home loan deals', icon: Key, color: COLORS.green },
    { title: 'Property Verification', desc: '100% verified listings with real photos, documents & legal checks', icon: ShieldCheck, color: COLORS.red },
  ];

  const values = [
    { icon: ShieldCheck, title: 'Trusted & Transparent', desc: 'Every property verified with real documents. Zero hidden charges.', color: COLORS.green },
    { icon: Heart, title: 'Customer First', desc: 'Personalized solutions that match your budget & lifestyle.', color: COLORS.red },
    { icon: Target, title: 'Results Focused', desc: "We don't just list — we match you with your perfect home.", color: COLORS.green },
    { icon: Globe, title: 'Pan India Reach', desc: '2+ cities covered with local expertise in every market.', color: COLORS.red },
  ];

  const founder = {
    name: 'Vikram Malik',
    role: 'Founder & CEO',
    image: '/Team/Sir.webp',
    bio: "With 25+ years in India's real estate sector, Vikram founded Associatte to bring transparency, trust, and customer-first solutions to property buying. He's driven by a single mission: making quality homeownership accessible, stress-free, and completely brokerage-free for every family.",
    social: { linkedin: '#', twitter: '#', email: 'info@associatte.com' },
  };

const teams = [
  {
    location: 'Pune',
    description: 'Serving Magarpatta, surrounding areas',
    color: COLORS.green,
    members: [
      { name: 'Sonal Gaikwad', role: 'General Manager', img: '/Team/Pune/Sonal.webp', social: { linkedin: '#', twitter: '#' } },
      { name: 'Neha Bhattacharya', role: 'Sales Executive', img: '/Team/Pune/Neha.webp', social: { linkedin: '#', twitter: '#' } },// ← Removed space
      { name: 'Rekha Rathod', role: 'Sales Executive', img: '/Team/Pune/Rekha.webp', social: { linkedin: '#', twitter: '#' } },
    ],
  },
  {
    location: 'Mumbai',
    description: 'Serving Mumbai',
    color: COLORS.red,
    members: [
      { name: 'Pratiksha Pandey', role: 'Area Manager', img: '/Team/Mumbai/Pratiksha.webp', social: { linkedin: '#', twitter: '#' } },
     { name: 'Simran Das', role: 'Sales Manager', img: '/Team/Mumbai/SimranDas.webp', social: { linkedin: '#', twitter: '#' } }, // ← Fixed capitalization
      { name: 'Sanjay Mane', role: 'Team Leader', img: '/Team/Mumbai/Sanjay.webp', social: { linkedin: '#', twitter: '#' } },
      { name: 'Sharvari Ambre', role: 'Sales Executive KDMC', img: '/Team/Mumbai/Sharvari.webp', social: { linkedin: '#', twitter: '#' } },
    ],
  },
  {
    location: 'Digital & Tech',
    description: 'Building the future of Associatte innovation',
    color: COLORS.green,
    members: [
      { name: 'Divya Gate', role: 'Web Developer', img: '/Team/Digital/DivyaGate.webp', social: { linkedin: '#', twitter: '#' } }, // ← Removed space
      { name: 'Krima Kothari', role: 'Social Media Manager', img: '/Team/Digital/Krima.webp', social: { linkedin: '#', twitter: '#' } },
    ],
  },
];

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150"%3E%3Crect fill="%23f1f5f9" width="150" height="150"/%3E%3Ctext fill="%2394a3b8" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
  };

  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => setIsPopupOpen(false);
  const handleFormSubmit = (payload: any) => {
    console.log('Enquiry submitted:', payload);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      
      {/* Scroll Progress */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 z-50 origin-left"
        style={{ 
          scaleX: scrollYProgress,
          background: COLORS.green
        }}
      />

      {/* Hero Section */}
      <section className="relative py-10 sm:py-14 lg:py-20 bg-[#101C2E]">
        <div className="container-site">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,94,96,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,94,96,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
            
            <div className="relative z-10">
              <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 p-5 sm:p-8 lg:p-12">
                
                {/* Left Content */}
                <div className="flex flex-col justify-center">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-5 sm:mb-6 w-fit"
                    style={{ backgroundColor: COLORS.greenBg, border: `1px solid ${COLORS.greenBorder}` }}
                  >
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: COLORS.green }} />
                    <span className="text-xs sm:text-sm font-semibold" style={{ color: COLORS.green }}>Who We Are</span>
                  </motion.div>

                  <motion.h1 
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="page-title font-extrabold mb-4 sm:mb-5"
                    style={{ color: COLORS.green }}
                  >
                    ABOUT ASSOCIATTE
                  </motion.h1>

                  <motion.p 
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed mb-5 sm:mb-6"
                  >
                    Associatte is a platform that helps customers find and secure their dream properties.{' '}
                    <span className="font-semibold" style={{ color: COLORS.green }}>
                      We act as a channel partner with top builders & banks and provide end-to-end property assistance.
                    </span>
                  </motion.p>

                  <motion.div 
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="mb-6 sm:mb-8"
                  >
                    <p className="text-xs sm:text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">We specialize in:</p>
                    <ul className="space-y-2 sm:space-y-2.5">
                      {['Residential Properties (Apartments, Villas, Plots)', 'Commercial Spaces (Offices, Shops, Warehouses)', 'Home Loan Assistance (Banks & NBFCs)', 'Property Verification & Legal Support'].map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <div className="mt-1.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS.green }} />
                          <span className="text-slate-600 text-xs sm:text-sm lg:text-base">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap gap-2 sm:gap-3"
                  >
                    <motion.button 
                      whileHover={{ scale: 1.03, boxShadow: "0 10px 30px -10px rgba(0,94,96,0.4)" }} 
                      whileTap={{ scale: 0.98 }}
                      className="px-4 sm:px-6 py-2.5 sm:py-3 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg flex items-center gap-2 text-xs sm:text-sm"
                      style={{ backgroundColor: COLORS.green }}
                    >
                      <Check className="w-4 h-4" />
                      Fast Approval
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.03 }} 
                      whileTap={{ scale: 0.98 }}
                      className="px-4 sm:px-6 py-2.5 sm:py-3 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg flex items-center gap-2 text-xs sm:text-sm"
                      style={{ backgroundColor: COLORS.red }}
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Transparent Process
                    </motion.button>
                  </motion.div>
                </div>

                {/* Right Visual */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative flex items-center justify-center"
                >
                  <div className="relative w-full max-w-sm sm:max-w-md mx-auto">
                    <div className="absolute inset-0 rounded-2xl sm:rounded-3xl blur-2xl scale-105 opacity-30" style={{ background: COLORS.green }} />
                    
                    <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-slate-200/50">
                      <div className="aspect-[4/3] flex items-center justify-center p-4 sm:p-6 lg:p-8">
                        <div className="relative w-full h-full flex items-center justify-center">
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute w-32 sm:w-40 lg:w-48 h-32 sm:h-40 lg:h-48 rounded-full border-2 border-dashed opacity-30"
                            style={{ borderColor: COLORS.red }}
                          />
                          <motion.div 
                            animate={{ rotate: -360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute w-24 sm:w-32 lg:w-36 h-24 sm:h-32 lg:h-36 rounded-full border-2 border-dashed opacity-30"
                            style={{ borderColor: COLORS.green }}
                          />
                          
                          <div className="relative z-10 text-center">
                            <motion.div 
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 3, repeat: Infinity }}
                              className="relative inline-block mb-3 sm:mb-4"
                            >
                              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto rounded-full flex items-center justify-center shadow-xl" style={{ backgroundColor: COLORS.green }}>
                                <Home className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
                              </div>
                              <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0"
                              >
                                <div className="absolute -top-1 sm:-top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: COLORS.yellow }} />
                              </motion.div>
                            </motion.div>
                            
                            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2" style={{ color: COLORS.green }}>
                              Mission
                            </h3>
                            <p className="text-[10px] sm:text-xs lg:text-sm text-slate-500 font-medium">Making Property Dreams Reality</p>
                          </div>

                          <div className="absolute top-1/2 left-2 sm:left-3 lg:left-4 w-4 sm:w-6 lg:w-8 border-t-2 border-dotted opacity-40" style={{ borderColor: COLORS.red }} />
                          <div className="absolute top-1/2 right-2 sm:right-3 lg:right-4 w-4 sm:w-6 lg:w-8 border-t-2 border-dotted opacity-40" style={{ borderColor: COLORS.green }} />
                        </div>
                      </div>
                      
                      <div className="px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4 bg-white/80 backdrop-blur-sm border-t border-slate-200/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-md sm:rounded-lg flex items-center justify-center" style={{ backgroundColor: COLORS.greenBg }}>
                              <Award className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: COLORS.green }} />
                            </div>
                            <span className="text-[10px] sm:text-xs font-semibold text-slate-600">Trusted Since 2020</span>
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-md sm:rounded-lg flex items-center justify-center" style={{ backgroundColor: COLORS.yellowBg }}>
                              <Star className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: COLORS.yellow }} />
                            </div>
                            <span className="text-[10px] sm:text-xs font-semibold text-slate-600">4.9 Rating</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-12 sm:py-16 lg:py-20">
        <div className="container-site">
          <motion.div 
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
          >
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div 
                  key={stat.label}
                  variants={fadeUp}
                  whileHover={{ y: -4, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)" }}
                  className="relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-center border border-slate-100 shadow-sm transition-all duration-300 group"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="inline-flex p-2.5 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl shadow-lg mb-3 sm:mb-4 mx-auto group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: stat.color }}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                  </motion.div>
                  <motion.p className="text-xl sm:text-2xl lg:text-4xl font-extrabold text-slate-900 mb-1">{stat.value}</motion.p>
                  <p className="text-[10px] sm:text-xs lg:text-sm font-medium text-slate-500">{stat.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section ref={servicesRef} className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container-site">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 lg:mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-5" style={{ backgroundColor: COLORS.greenBg, border: `1px solid ${COLORS.greenBorder}` }}>
              <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: COLORS.green }} />
              <span className="text-xs sm:text-sm font-semibold" style={{ color: COLORS.green }}>Our Services</span>
            </div>
            <h2 className="section-title text-slate-900 mb-3 sm:mb-4">
              What We <span style={{ color: COLORS.green }}>Offer</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-slate-500">End-to-end property solutions designed for your success.</p>
          </motion.div>

          <motion.div 
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6"
          >
            {specializations.map((service) => {
              const Icon = service.icon;
              return (
                <motion.div 
                  key={service.title}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  className="group relative bg-slate-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-slate-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="inline-flex p-2.5 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl shadow-lg mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: service.color }}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900 mb-2">{service.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{service.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section ref={valuesRef} className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container-site">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 lg:mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-5" style={{ backgroundColor: COLORS.redBg, border: `1px solid ${COLORS.redBorder}` }}>
              <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: COLORS.red }} />
              <span className="text-xs sm:text-sm font-semibold" style={{ color: COLORS.red }}>Our Values</span>
            </div>
            <h2 className="section-title text-slate-900 mb-3 sm:mb-4">
              Why Choose <span style={{ color: COLORS.red }}>Associatte</span>
            </h2>
          </motion.div>

          <motion.div 
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
          >
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <motion.div 
                  key={value.title}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  className="group relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-slate-100 hover:shadow-xl transition-all duration-300 text-center"
                >
                  <div className="inline-flex p-2.5 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl mb-3 sm:mb-4 mx-auto transition-all duration-300" style={{ backgroundColor: value.color === COLORS.green ? COLORS.greenBg : COLORS.redBg }}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 transition-colors duration-300" style={{ color: value.color }} />
                  </div>
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900 mb-2">{value.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{value.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section ref={teamRef} className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container-site">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 lg:mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-5" style={{ backgroundColor: COLORS.yellowBg, border: `1px solid ${COLORS.yellowBorder}` }}>
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: COLORS.red }} />
              <span className="text-xs sm:text-sm font-semibold" style={{ color: COLORS.red }}>Our Team</span>
            </div>
            <h2 className="section-title text-slate-900 mb-3 sm:mb-4">
              Meet The <span style={{ color: COLORS.red }}>People Behind Success</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-slate-500">Passionate experts united by a shared mission.</p>
          </motion.div>

          {/* Founder Card */}
          <motion.div 
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10 sm:mb-12 lg:mb-16"
          >
            <div className="max-w-4xl mx-auto">
              <div className="relative group">
                <div className="relative bg-gradient-to-br from-slate-50 to-white rounded-2xl sm:rounded-3xl border-2 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300" style={{ borderColor: COLORS.greenBorder }}>
                  <div className="absolute top-0 left-0 right-0 h-1.5 sm:h-2" style={{ backgroundColor: COLORS.green }} />
                  
                  <div className="p-5 sm:p-6 lg:p-10">
                    <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 lg:gap-8">
                      <div className="relative flex-shrink-0">
                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 shadow-xl" style={{ borderColor: COLORS.green }}>
                          <Image
                            src={founder.image}
                            alt={founder.name}
                            fill
                            sizes="160px"
                            className="object-cover"
                            onError={handleImageError}
                          />
                        </div>
                        <motion.div 
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute -bottom-1.5 -right-1.5 sm:-bottom-2 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full flex items-center justify-center shadow-lg border-4 border-white"
                          style={{ backgroundColor: COLORS.red }}
                        >
                          <Award className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5 text-white" />
                        </motion.div>
                      </div>
                      
                      <div className="flex-1 text-center sm:text-left">
                        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 lg:px-3.5 py-1 sm:py-1.5 rounded-full mb-2.5 sm:mb-3 lg:mb-4" style={{ backgroundColor: COLORS.yellowBg, border: `1px solid ${COLORS.yellowBorder}` }}>
                          <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" style={{ color: COLORS.red }} />
                          <span className="text-[10px] sm:text-xs font-bold" style={{ color: COLORS.red }}>Founder & CEO</span>
                        </div>
                        <h3 className="text-lg sm:text-xl lg:text-3xl font-extrabold text-slate-900 mb-2">{founder.name}</h3>
                        <p className="text-xs sm:text-sm lg:text-base text-slate-600 mb-4 sm:mb-5 lg:mb-6 leading-relaxed">{founder.bio}</p>
                        
                        <div className="flex justify-center sm:justify-start gap-2 sm:gap-3">
                          {[
                            { icon: Globe, href: founder.social.linkedin, label: 'LinkedIn' },
                            { icon: Share2, href: founder.social.twitter, label: 'Twitter' },
                            { icon: Mail, href: `mailto:${founder.social.email}`, label: 'Email' },
                          ].map(({ icon: Icon, href, label }, i) => (
                            <motion.a 
                              key={i} 
                              href={href}
                              whileHover={{ scale: 1.15, y: -4 }} 
                              whileTap={{ scale: 0.95 }}
                              className="p-2 sm:p-2.5 lg:p-3 rounded-lg sm:rounded-xl transition-colors border focus:outline-none focus:ring-2"
                              style={{ backgroundColor: COLORS.greenBg, borderColor: COLORS.greenBorder, color: COLORS.green }}
                              aria-label={label}
                            >
                              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                            </motion.a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Teams */}
          <div className="space-y-8 sm:space-y-10 lg:space-y-14">
            {teams.map((team, ti) => (
              <motion.div 
                key={team.location}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: ti * 0.1 }}
              >
                {/* Team Header */}
                <div className="flex items-center gap-2.5 sm:gap-3 lg:gap-4 mb-4 sm:mb-5 lg:mb-6">
                  <div className="inline-flex p-2 sm:p-2.5 lg:p-3 rounded-lg sm:rounded-xl shadow-lg" style={{ backgroundColor: team.color }}>
                    <Building2 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-extrabold" style={{ color: team.color }}>
                      {team.location} Team
                    </h3>
                    <p className="text-slate-500 text-[10px] sm:text-xs lg:text-sm mt-0.5">{team.description}</p>
                    <div className="w-full h-0.5 sm:h-1 rounded-full mt-1.5 sm:mt-2 opacity-60" style={{ backgroundColor: team.color }} />
                  </div>
                </div>

                {/* Team Members Grid */}
                <motion.div 
                  variants={stagger}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5"
                >
                  {team.members.map((member) => (
                    <motion.div 
                      key={member.name}
                      variants={fadeUp}
                      whileHover={{ y: -6 }}
                      className="group relative bg-white rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                      <div className="relative aspect-square overflow-hidden bg-slate-50">
                        <Image
                          src={member.img}
                          alt={member.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={handleImageError}
                        />
                      </div>
                      
                      <div className="p-2.5 sm:p-3 lg:p-4">
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm lg:text-base mb-0.5 sm:mb-1 truncate">{member.name}</h4>
                        <p className="text-[10px] sm:text-xs lg:text-sm font-medium" style={{ color: team.color }}>
                          {member.role}
                        </p>
                        <div className="w-6 sm:w-8 lg:w-10 h-0.5 rounded-full mt-1.5 sm:mt-2 lg:mt-3 opacity-60" style={{ backgroundColor: team.color }} />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container-site">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-14 text-center overflow-hidden"
            style={{ backgroundColor: COLORS.green, boxShadow: '0 25px 80px -20px rgba(0,0,0,0.3)' }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:30px_30px]" />
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -top-20 -right-20 w-40 h-40 sm:w-52 sm:h-52 lg:w-60 lg:h-60 bg-white/20 rounded-full blur-2xl"
            />
            <motion.div 
              animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.15, 0.1] }}
              transition={{ duration: 6, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-20 -left-20 w-40 h-40 sm:w-52 sm:h-52 lg:w-60 lg:h-60 bg-white/15 rounded-full blur-2xl"
            />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-4 sm:mb-5 lg:mb-6">
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" style={{ color: COLORS.yellow }} />
                <span className="text-[10px] sm:text-xs lg:text-sm font-semibold text-white">Start Your Property Journey</span>
              </div>
              
              <h2 className="section-title text-white mb-3 sm:mb-4">
                Ready to Find Your Dream Property?
              </h2>
              <p className="text-xs sm:text-base lg:text-lg text-white/80 mb-5 sm:mb-6 lg:mb-8 max-w-xl mx-auto">
                Join 25,000+ happy homeowners who trusted Associatte. Your perfect home is just a call away.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-2.5 sm:gap-3 lg:gap-4">
                <motion.button 
                  whileHover={{ scale: 1.04, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleOpenPopup}
                  className="px-5 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 font-bold rounded-lg sm:rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm lg:text-base"
                  style={{ backgroundColor: COLORS.yellow, color: COLORS.red }}
                >
                  <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                  Search Properties
                </motion.button>
                <motion.a
                  href="tel:+918881188181"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-5 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold rounded-lg sm:rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm lg:text-base"
                >
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                  +91 88 8118 8181
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 border-t border-slate-100">
        <div className="container-site">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-slate-500">
            <p>© 2026 Associatte PropTech Pvt Ltd. All rights reserved.</p>
            <div className="flex items-center gap-4 sm:gap-5 lg:gap-6">
              <a href="mailto:info@associatte.com" className="flex items-center gap-1.5 sm:gap-2 hover:text-[var(--color-primary)] transition-colors">
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> info@associatte.com
              </a>
              <a href="tel:+918743563546" className="flex items-center gap-1.5 sm:gap-2 hover:text-[var(--color-secondary)] transition-colors">
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> +91 88 8118 8181
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Enquiry Popup */}
      <EnquiryPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        projectName="Properties at Associatte"
        projectTagline="Get personalized property recommendations from our experts"
        theme="gradient"
        onSubmit={handleFormSubmit}
        trackingData={{
          source: 'about_us_page',
          campaign: 'about_us_enquiry',
          medium: 'organic',
          city: 'national'
        }}
      />
    </main>
  );
}