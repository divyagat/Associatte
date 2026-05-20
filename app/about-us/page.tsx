// @/app/about-us/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useInView, useTransform, type Variants } from 'framer-motion';
import { 
  Users, Building2, MapPin, Star, ShieldCheck, Heart, 
  ArrowRight, Check, Home, Key, TrendingUp, Clock,
  Globe, Mail, Phone, Award, Target, Share2,
} from 'lucide-react';

// ✅ Brand Colors
const COLORS = {
  red: '#8B0000',
  green: '#005E60',
  yellow: '#F8C21C',
  redGreen: 'linear-gradient(135deg, #8B0000, #005E60)',
  yellowAccent: '#F8C21C',
};

const easeOut = [0.22, 1, 0.36, 1];
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } }
};

const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } }
};

export default function AboutUs() {
  const { scrollYProgress } = useScroll();
  
  const statsRef = typeof document !== 'undefined' ? { current: null as HTMLElement | null } : { current: null as HTMLElement | null };
  const servicesRef = typeof document !== 'undefined' ? { current: null as HTMLElement | null } : { current: null as HTMLElement | null };
  const valuesRef = typeof document !== 'undefined' ? { current: null as HTMLElement | null } : { current: null as HTMLElement | null };
  const teamRef = typeof document !== 'undefined' ? { current: null as HTMLElement | null } : { current: null as HTMLElement | null };

  const statsInView = useInView({ current: statsRef.current }, { once: true, margin: "-10%" });
  const servicesInView = useInView({ current: servicesRef.current }, { once: true, margin: "-10%" });
  const valuesInView = useInView({ current: valuesRef.current }, { once: true, margin: "-10%" });
  const teamInView = useInView({ current: teamRef.current }, { once: true, margin: "-10%" });

  const stats = [
    { value: '25K+', label: 'Happy Homeowners', icon: Users, gradient: COLORS.redGreen },
    { value: '₹500Cr+', label: 'Property Value Listed', icon: Building2, gradient: COLORS.redGreen },
    { value: '4.9/5', label: 'Customer Rating', icon: Star, gradient: COLORS.redGreen },
    { value: '24/7', label: 'Expert Support', icon: Clock, gradient: COLORS.redGreen },
  ];

  const specializations = [
    { title: 'Residential Properties', desc: 'Apartments, villas & plotted developments across Pune, Mumbai & more', icon: Home },
    { title: 'Commercial Spaces', desc: 'Office spaces, retail shops & warehouses for your business needs', icon: Building2 },
    { title: 'Home Loan Assistance', desc: 'Connect with top banks & NBFCs for best home loan deals', icon: Key },
    { title: 'Property Verification', desc: '100% verified listings with real photos, documents & legal checks', icon: ShieldCheck },
  ];

  const values = [
    { icon: ShieldCheck, title: 'Trusted & Transparent', desc: 'Every property verified with real documents. Zero hidden charges.' },
    { icon: Heart, title: 'Customer First', desc: 'Personalized solutions that match your budget & lifestyle.' },
    { icon: Target, title: 'Results Focused', desc: 'We don\'t just list — we match you with your perfect home.' },
    { icon: Globe, title: 'Pan India Reach', desc: '12+ cities covered with local expertise in every market.' },
  ];

  // 👤 Founder/Owner
  const founder = {
    name: 'Priya Sharma',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400&q=80',
    bio: '12+ years in real estate & PropTech. Passionate about making homeownership accessible and transparent for every Indian family.',
    social: { linkedin: '#', twitter: '#', email: 'priya@associatte.com' },
  };

  // 👥 Teams - 4 members each
  const teams = [
    {
      location: 'Pune',
      description: 'Serving Baner, Wakad, Hinjewadi & surrounding areas',
      members: [
        { name: 'Rahul Mehta', role: 'Head of Technology', img: 'https://i.pravatar.cc/150?img=11', social: { linkedin: '#', twitter: '#' } },
        { name: 'Sneha Deshmukh', role: 'Senior Property Advisor', img: 'https://i.pravatar.cc/150?img=32', social: { linkedin: '#', twitter: '#' } },
        { name: 'Amit Patil', role: 'Sales Operations', img: 'https://i.pravatar.cc/150?img=13', social: { linkedin: '#', twitter: '#' } },
        { name: 'Pooja Joshi', role: 'Customer Success', img: 'https://i.pravatar.cc/150?img=47', social: { linkedin: '#', twitter: '#' } },
      ],
    },
    {
      location: 'Mumbai',
      description: 'Serving Kharghar, Panvel, Taloja & Navi Mumbai',
      members: [
        { name: 'Vikram Singh', role: 'Regional Head', img: 'https://i.pravatar.cc/150?img=14', social: { linkedin: '#', twitter: '#' } },
        { name: 'Ananya Patel', role: 'Property Consultant', img: 'https://i.pravatar.cc/150?img=33', social: { linkedin: '#', twitter: '#' } },
        { name: 'Rajesh Kumar', role: 'Market Analyst', img: 'https://i.pravatar.cc/150?img=15', social: { linkedin: '#', twitter: '#' } },
        { name: 'Kavita Reddy', role: 'Client Relations', img: 'https://i.pravatar.cc/150?img=48', social: { linkedin: '#', twitter: '#' } },
      ],
    },
    {
      location: 'Digital & Tech',
      description: 'Building the future of PropTech innovation',
      members: [
        { name: 'Arjun Kapoor', role: 'Lead Developer', img: 'https://i.pravatar.cc/150?img=16', social: { linkedin: '#', twitter: '#' } },
        { name: 'Meera Iyer', role: 'UX/UI Designer', img: 'https://i.pravatar.cc/150?img=34', social: { linkedin: '#', twitter: '#' } },
        { name: 'Karan Malhotra', role: 'AI/ML Engineer', img: 'https://i.pravatar.cc/150?img=17', social: { linkedin: '#', twitter: '#' } },
        { name: 'Divya Nair', role: 'Product Manager', img: 'https://i.pravatar.cc/150?img=49', social: { linkedin: '#', twitter: '#' } },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      
      {/* Scroll Progress */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 z-50 origin-left"
        style={{ 
          scaleX: scrollYProgress,
          background: COLORS.redGreen
        }}
      />

      {/* Hero Section */}
      <section className="relative py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,94,96,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,94,96,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
            
            <div className="relative z-10">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 p-6 sm:p-8 lg:p-12">
                
                {/* Left Content */}
                <div className="flex flex-col justify-center">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 w-fit"
                    style={{ backgroundColor: '#005E60/10', border: '1px solid #005E60/20' }}
                  >
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#005E60' }} />
                    <span className="text-sm font-semibold" style={{ color: '#005E60' }}>Who We Are</span>
                  </motion.div>

                  <motion.h1 
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-5"
                  >
                    <span className="bg-clip-text text-transparent" style={{ backgroundImage: COLORS.redGreen }}>
                      ABOUT ASSOCIATTE
                    </span>
                  </motion.h1>

                  <motion.p 
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6"
                  >
                    Associatte is a PropTech platform that helps customers find and secure their dream properties.{' '}
                    <span className="font-semibold" style={{ color: '#005E60' }}>
                      We act as a channel partner with top builders & banks and provide end-to-end property assistance.
                    </span>
                  </motion.p>

                  <motion.div 
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="mb-8"
                  >
                    <p className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">We specialize in:</p>
                    <ul className="space-y-2.5">
                      {['Residential Properties (Apartments, Villas, Plots)', 'Commercial Spaces (Offices, Shops, Warehouses)', 'Home Loan Assistance (Banks & NBFCs)', 'Property Verification & Legal Support'].map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <div className="mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#005E60' }} />
                          <span className="text-slate-600 text-sm sm:text-base">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap gap-3"
                  >
                    <motion.button 
                      whileHover={{ scale: 1.03, boxShadow: "0 10px 30px -10px rgba(139,0,0,0.3)" }} 
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 text-white font-semibold rounded-xl shadow-lg flex items-center gap-2 text-sm"
                      style={{ background: COLORS.redGreen }}
                    >
                      <Check className="w-4.5 h-4.5" />
                      Fast Approval
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.03 }} 
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 text-white font-semibold rounded-xl shadow-lg flex items-center gap-2 text-sm"
                      style={{ background: `linear-gradient(135deg, #005E60, #8B0000)` }}
                    >
                      <ShieldCheck className="w-4.5 h-4.5" />
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
                  <div className="relative w-full max-w-md mx-auto">
                    <div className="absolute inset-0 rounded-3xl blur-2xl scale-105 opacity-40" style={{ background: COLORS.redGreen }} />
                    
                    <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl overflow-hidden shadow-2xl border border-slate-200/50">
                      <div className="aspect-[4/3] flex items-center justify-center p-6 sm:p-8">
                        <div className="relative w-full h-full flex items-center justify-center">
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute w-40 sm:w-48 h-40 sm:h-48 rounded-full border-2 border-dashed opacity-30"
                            style={{ borderColor: '#8B0000' }}
                          />
                          <motion.div 
                            animate={{ rotate: -360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute w-32 sm:w-36 h-32 sm:h-36 rounded-full border-2 border-dashed opacity-30"
                            style={{ borderColor: '#005E60' }}
                          />
                          
                          <div className="relative z-10 text-center">
                            <motion.div 
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 3, repeat: Infinity }}
                              className="relative inline-block mb-4"
                            >
                              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full flex items-center justify-center shadow-xl" style={{ background: COLORS.redGreen }}>
                                <Home className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                              </div>
                              <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0"
                              >
                                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full" style={{ backgroundColor: '#F8C21C' }} />
                              </motion.div>
                            </motion.div>
                            
                            <h3 className="text-2xl sm:text-3xl font-bold mb-2 bg-clip-text text-transparent" style={{ backgroundImage: COLORS.redGreen }}>
                              Mission
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium">Making Property Dreams Reality</p>
                          </div>

                          <div className="absolute top-1/2 left-3 sm:left-4 w-6 sm:w-8 border-t-2 border-dotted opacity-40" style={{ borderColor: '#8B0000' }} />
                          <div className="absolute top-1/2 right-3 sm:right-4 w-6 sm:w-8 border-t-2 border-dotted opacity-40" style={{ borderColor: '#005E60' }} />
                        </div>
                      </div>
                      
                      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-white/80 backdrop-blur-sm border-t border-slate-200/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#005E60/10' }}>
                              <Award className="w-4 h-4" style={{ color: '#005E60' }} />
                            </div>
                            <span className="text-xs font-semibold text-slate-600">Trusted Since 2020</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F8C21C/20' }}>
                              <Star className="w-4 h-4" style={{ color: '#F8C21C' }} />
                            </div>
                            <span className="text-xs font-semibold text-slate-600">4.9 Rating</span>
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
      <section ref={statsRef as any} className="pb-16 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div 
                  key={stat.label}
                  variants={fadeUp}
                  whileHover={{ y: -4, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)" }}
                  className="relative bg-white rounded-2xl p-5 sm:p-8 text-center border border-slate-100 shadow-sm transition-all duration-300 group"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="inline-flex p-3 sm:p-4 rounded-xl shadow-lg mb-4 mx-auto group-hover:scale-110 transition-transform duration-300"
                    style={{ background: stat.gradient }}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </motion.div>
                  <motion.p className="text-2xl sm:text-4xl font-extrabold text-slate-900 mb-1">{stat.value}</motion.p>
                  <p className="text-xs sm:text-sm font-medium text-slate-500">{stat.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section ref={servicesRef as any} className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-12 lg:mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5" style={{ backgroundColor: '#005E60/10', border: '1px solid #005E60/20' }}>
              <Target className="w-4 h-4" style={{ color: '#005E60' }} />
              <span className="text-sm font-semibold" style={{ color: '#005E60' }}>Our Services</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">
              What We{' '}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: COLORS.redGreen }}>
                Offer
              </span>
            </h2>
            <p className="text-base lg:text-lg text-slate-500">End-to-end property solutions designed for your success.</p>
          </motion.div>

          <motion.div 
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
          >
            {specializations.map((service) => {
              const Icon = service.icon;
              return (
                <motion.div 
                  key={service.title}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  className="group relative bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="inline-flex p-3 sm:p-4 rounded-xl shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300" style={{ background: COLORS.redGreen }}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">{service.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{service.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section ref={valuesRef as any} className="py-16 lg:py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-12 lg:mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5" style={{ backgroundColor: '#8B0000/10', border: '1px solid #8B0000/20' }}>
              <Heart className="w-4 h-4" style={{ color: '#8B0000' }} />
              <span className="text-sm font-semibold" style={{ color: '#8B0000' }}>Our Values</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">
              Why Choose{' '}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: COLORS.redGreen }}>
                Associatte
              </span>
            </h2>
          </motion.div>

          <motion.div 
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <motion.div 
                  key={value.title}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  className="group relative bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 hover:shadow-xl transition-all duration-300 text-center"
                >
                  <div className="inline-flex p-3 sm:p-4 rounded-xl mb-4 mx-auto transition-all duration-300" style={{ backgroundColor: '#005E60/10' }}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300" style={{ color: '#005E60' }} />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">{value.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{value.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Team Section - Owner + 3 Teams */}
      <section ref={teamRef as any} className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-12 lg:mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5" style={{ backgroundColor: '#F8C21C/20', border: '1px solid #F8C21C/40' }}>
              <Users className="w-4 h-4" style={{ color: '#8B0000' }} />
              <span className="text-sm font-semibold" style={{ color: '#8B0000' }}>Our Team</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">
              Meet The{' '}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: COLORS.redGreen }}>
                People Behind Success
              </span>
            </h2>
            <p className="text-base lg:text-lg text-slate-500">Passionate experts united by a shared mission.</p>
          </motion.div>

          {/* Founder/Owner Card */}
          <motion.div 
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 lg:mb-16"
          >
            <div className="max-w-4xl mx-auto">
              <div className="relative group">
                <div className="relative bg-gradient-to-br from-slate-50 to-white rounded-3xl border-2 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300" style={{ borderColor: '#005E60/20' }}>
                  <div className="absolute top-0 left-0 right-0 h-2" style={{ background: COLORS.redGreen }} />
                  
                  <div className="p-6 sm:p-8 lg:p-10">
                    <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                      <div className="relative">
                        <div className="w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 shadow-xl" style={{ borderColor: '#005E60' }}>
                          <img src={founder.image} alt={founder.name} className="w-full h-full object-cover" />
                        </div>
                        <motion.div 
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute -bottom-2 -right-2 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shadow-lg border-4 border-white"
                          style={{ background: COLORS.redGreen }}
                        >
                          <Award className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white" />
                        </motion.div>
                      </div>
                      
                      <div className="flex-1 text-center sm:text-left">
                        <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full mb-3 sm:mb-4" style={{ backgroundColor: '#F8C21C/20', border: '1px solid #F8C21C/40' }}>
                          <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: '#8B0000' }} />
                          <span className="text-xs font-bold" style={{ color: '#8B0000' }}>Founder & CEO</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 mb-2">{founder.name}</h3>
                        <p className="text-sm sm:text-base text-slate-600 mb-5 sm:mb-6 leading-relaxed">{founder.bio}</p>
                        
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
                              className="p-2.5 sm:p-3 rounded-xl transition-colors border focus:outline-none focus:ring-2"
                              style={{ backgroundColor: '#005E60/10', borderColor: '#005E60/20', color: '#005E60' }}
                              aria-label={label}
                            >
                              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
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

          {/* Teams - 3 Rows */}
          <div className="space-y-10 lg:space-y-14">
            {teams.map((team, ti) => (
              <motion.div 
                key={team.location}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: ti * 0.1 }}
              >
                {/* Team Header */}
                <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                  <div className="inline-flex p-2.5 sm:p-3 rounded-xl shadow-lg" style={{ background: COLORS.redGreen }}>
                    <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-extrabold bg-clip-text text-transparent" style={{ backgroundImage: COLORS.redGreen }}>
                      {team.location} Team
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm mt-0.5">{team.description}</p>
                    <div className="w-full h-1 rounded-full mt-2 opacity-60" style={{ background: COLORS.redGreen }} />
                  </div>
                </div>

                {/* Team Members Grid - 4 per row */}
                <motion.div 
                  variants={stagger}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5"
                >
                  {team.members.map((member) => (
                    <motion.div 
                      key={member.name}
                      variants={fadeUp}
                      whileHover={{ y: -6 }}
                      className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                      <div className="relative aspect-square overflow-hidden bg-slate-50">
                        <img 
                          src={member.img} 
                          alt={member.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(to top, ${COLORS.redGreen}, transparent)` }} />
                        
                        <motion.div 
                          initial={{ opacity: 0, y: 16 }}
                          whileHover={{ opacity: 1, y: 0 }}
                          className="absolute bottom-3 sm:bottom-4 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                        >
                          {[
                            { icon: Globe, href: member.social.linkedin, label: 'LinkedIn' },
                            { icon: Share2, href: member.social.twitter, label: 'Twitter' },
                          ].map(({ icon: Icon, href, label }, i) => (
                            <motion.a 
                              key={i} 
                              href={href}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 bg-white/95 backdrop-blur-sm rounded-lg text-slate-700 shadow-lg transition-colors"
                              aria-label={label}
                            >
                              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </motion.a>
                          ))}
                        </motion.div>
                      </div>
                      
                      <div className="p-3 sm:p-4">
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-1 truncate">{member.name}</h4>
                        <p className="text-xs sm:text-sm font-medium bg-clip-text text-transparent" style={{ backgroundImage: COLORS.redGreen }}>
                          {member.role}
                        </p>
                        <div className="w-8 sm:w-10 h-0.5 rounded-full mt-2 sm:mt-3 opacity-60" style={{ background: COLORS.redGreen }} />
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
      <section className="py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl p-8 sm:p-10 lg:p-14 text-center overflow-hidden"
            style={{ background: COLORS.redGreen, boxShadow: '0 25px 80px -20px rgba(0,0,0,0.3)' }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:30px_30px]" />
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -top-20 -right-20 w-52 h-52 sm:w-60 sm:h-60 bg-white/20 rounded-full blur-2xl"
            />
            <motion.div 
              animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.15, 0.1] }}
              transition={{ duration: 6, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-20 -left-20 w-52 h-52 sm:w-60 sm:h-60 bg-white/15 rounded-full blur-2xl"
            />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-5 sm:mb-6">
                <Star className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#F8C21C' }} />
                <span className="text-xs sm:text-sm font-semibold text-white">Start Your Property Journey</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-4">
                Ready to Find Your Dream Property?
              </h2>
              <p className="text-base sm:text-lg text-white/80 mb-6 sm:mb-8 max-w-xl mx-auto">
                Join 25,000+ happy homeowners who trusted Associatte. Your perfect home is just a call away.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <motion.button 
                  whileHover={{ scale: 1.04, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 sm:px-8 py-3 sm:py-4 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                  style={{ backgroundColor: '#F8C21C', color: '#8B0000' }}
                >
                  <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                  Search Properties
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                  +91 87435 63546
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <p>© 2026 Associatte PropTech Pvt Ltd. All rights reserved.</p>
            <div className="flex items-center gap-5 sm:gap-6">
              <a href="mailto:hello@associatte.com" className="flex items-center gap-2 hover:text-[#005E60] transition-colors">
                <Mail className="w-4 h-4" /> hello@associatte.com
              </a>
              <a href="tel:+918743563546" className="flex items-center gap-2 hover:text-[#8B0000] transition-colors">
                <Phone className="w-4 h-4" /> +91 87435 63546
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}