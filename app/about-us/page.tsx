// @/app/about-us/page.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Users, Award, TrendingUp, Heart, Target, Lightbulb,
  Building2, MapPin, Phone, Mail, ArrowRight, CheckCircle2,
  Sparkles, ShieldCheck, Info,
  ChevronRight, ArrowUpRight, Globe, ExternalLink, Star
} from 'lucide-react';

// ==================== Team Row Component (Dynamic Grid) ====================
const TeamRow = ({ title, location, accentColor, members, icon: Icon }: {
  title: string;
  location: string;
  accentColor: '#8B0000' | '#005E60' | '#F8C21C';
  members: Array<{ name: string; role: string; image: string; social?: { linkedin?: string; twitter?: string } }>;
  icon: any;
}) => {
  const getStyles = (color: string) => {
    switch(color) {
      case '#8B0000':
        return {
          badge: 'bg-[#8B0000]/10 text-[#8B0000] border-[#8B0000]/20',
          iconBg: 'bg-[#8B0000]/10 text-[#8B0000]',
          accent: 'border-[#8B0000]/20 hover:border-[#8B0000]/40',
        };
      case '#005E60':
        return {
          badge: 'bg-[#005E60]/10 text-[#005E60] border-[#005E60]/20',
          iconBg: 'bg-[#005E60]/10 text-[#005E60]',
          accent: 'border-[#005E60]/20 hover:border-[#005E60]/40',
        };
      case '#F8C21C':
        return {
          badge: 'bg-[#F8C21C]/20 text-[#8B0000] border-[#F8C21C]/30',
          iconBg: 'bg-[#F8C21C]/20 text-[#8B0000]',
          accent: 'border-[#F8C21C]/30 hover:border-[#F8C21C]/50',
        };
      default:
        return {
          badge: 'bg-gray-100 text-gray-700 border-gray-200',
          iconBg: 'bg-gray-100 text-gray-600',
          accent: 'border-gray-200 hover:border-gray-300',
        };
    }
  };
  const c = getStyles(accentColor);

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${c.iconBg}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
            <p className="text-gray-500 text-sm">{location}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${c.badge}`}>
          {members.length} Members <ChevronRight className="w-4 h-4" />
        </span>
      </div>

      {/* ✅ DYNAMIC GRID: Automatically adapts to any number of employees */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {members.map((member, idx) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            className={`group relative bg-gray-50 rounded-2xl p-5 border border-gray-100 ${c.accent} hover:shadow-md transition-all`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-sm"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">{member.name}</h4>
                <p className="text-sm text-gray-500 truncate">{member.role}</p>
              </div>
            </div>
            
            {/* Social Links */}
            {member.social && (
              <div className="flex items-center gap-2 pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                {member.social.linkedin && (
                  <a 
                    href={member.social.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-white rounded-lg hover:bg-[#8B0000]/10 text-gray-400 hover:text-[#8B0000] transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
                {member.social.twitter && (
                  <a 
                    href={member.social.twitter}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-white rounded-lg hover:bg-[#8B0000]/10 text-gray-400 hover:text-[#8B0000] transition-colors"
                    aria-label="Twitter"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <a 
                  href={`mailto:${member.name.toLowerCase().replace(/\s+/g, '.')}@associatte.co.in`} 
                  className="p-2 bg-white rounded-lg hover:bg-[#8B0000]/10 text-gray-400 hover:text-[#8B0000] transition-colors ml-auto"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ==================== Main Component ====================
export default function AboutUs() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 30]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  // Data
  const stats = [
    { number: '50K+', label: 'Happy Customers', icon: Users },
    { number: '10K+', label: 'Properties Listed', icon: Building2 },
    { number: '15+', label: 'Cities Covered', icon: MapPin },
    { number: '98%', label: 'Success Rate', icon: TrendingUp },
  ];

  const values = [
    { icon: ShieldCheck, title: 'Verified & Trusted', description: 'Every property verified with real photos, documents, and owner details.' },
    { icon: Heart, title: 'Customer First', description: 'Your dream home is our mission. Personalized solutions for every need.' },
    { icon: Lightbulb, title: 'Innovation Driven', description: 'AI-powered search, 3D tours, and smart filters for effortless discovery.' },
  ];

  // Team Data
  const owner = {
    name: "Priya Sharma",
    role: "Founder & CEO",
    image: "/team/owner.webp",
    bio: "15+ years in real estate. Passionate about making homeownership accessible to every Indian family.",
    social: { linkedin: '#', twitter: '#' }
  };

  const puneTeam = [
    { name: "Rahul Mehta", role: "Head of Technology", image: "/team/pune-1.webp", social: { linkedin: '#', twitter: '#' } },
    { name: "Sneha Deshmukh", role: "Senior Property Consultant", image: "/team/pune-2.webp", social: { linkedin: '#', twitter: '#' } },
    { name: "Amit Patil", role: "Sales Manager", image: "/team/pune-3.webp", social: { linkedin: '#', twitter: '#' } },
  ];

  const mumbaiTeam = [
    { name: "Vikram Singh", role: "Market Expansion Head", image: "/team/mumbai-1.webp", social: { linkedin: '#', twitter: '#' } },
    { name: "Ananya Patel", role: "Customer Success Manager", image: "/team/mumbai-2.webp", social: { linkedin: '#', twitter: '#' } },
    { name: "Rajesh Kumar", role: "Property Analyst", image: "/team/mumbai-3.webp", social: { linkedin: '#', twitter: '#' } },
    { name: "Kavita Reddy", role: "Business Development", image: "/team/mumbai-4.webp", social: { linkedin: '#', twitter: '#' } },
  ];

  const digitalTeam = [
    { name: "Arjun Kapoor", role: "Lead Developer", image: "/team/digital-1.webp", social: { linkedin: '#', twitter: '#' } },
    { name: "Meera Iyer", role: "UX Designer", image: "/team/digital-2.webp", social: { linkedin: '#', twitter: '#' } },
    { name: "Karan Malhotra", role: "Digital Marketing Head", image: "/team/digital-3.webp", social: { linkedin: '#', twitter: '#' } },
  ];

  const contactInfo = [
    { icon: Phone, label: 'Call Us', value: '+91 88 8118 8181', href: 'tel:+918881188181', subtext: 'Mon-Sat: 9AM to 7PM' },
    { icon: Mail, label: 'Email Us', value: 'info@associatte.co.in', href: 'mailto:info@associatte.co.in', subtext: 'Response within 24 hours' },
    { icon: MapPin, label: 'Visit Us', value: 'Pune & Mumbai, India', href: '#', subtext: 'By appointment only' },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <motion.section 
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 bg-white overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-[#8B0000]/15 to-[#005E60]/15 rounded-full blur-3xl" />
          <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-[#F8C21C]/20 to-[#8B0000]/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(139,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,0,0,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 bg-[#F8C21C]/20 rounded-full border border-[#F8C21C]/30 mb-6">
                <Sparkles className="w-4 h-4 text-[#8B0000]" />
                <span className="text-sm font-medium text-[#8B0000]">Trusted Property Platform Since 2019</span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-[1.1]">
                Find Your Perfect Home with{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-[#8B0000] to-[#005E60] bg-clip-text text-transparent">Confidence</span>
                  <motion.span className="absolute -bottom-2 left-0 right-0 h-3 rounded-full opacity-40" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }} style={{ background: 'linear-gradient(90deg, #F8C21C, #D4A514)' }} />
                </span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
                We're your trusted partner in finding the perfect property across India. Verified listings, expert guidance, and a seamless experience from search to keys.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                <button className="group px-8 py-4 bg-gradient-to-r from-[#8B0000] to-[#005E60] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
                  Browse Properties <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                {/* ✅ UPDATED: Contact Us button now redirects to /contact-us */}
                <Link href="/contact-us" className="group px-8 py-4 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-[#005E60] hover:shadow-md transition-all flex items-center justify-center gap-2">
                  Contact Us <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex flex-wrap justify-center lg:justify-start gap-5 text-sm">
                {[{ icon: CheckCircle2, text: '100% Verified Listings', color: 'text-[#005E60]' }, { icon: ShieldCheck, text: 'Zero Hidden Fees', color: 'text-[#005E60]' }, { icon: Heart, text: '24/7 Expert Support', color: 'text-[#005E60]' }].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                    <span className="text-gray-600">{item.text}</span>
                  </div>
                ))}
              </motion.div>
            </div>
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6 }} className="relative hidden lg:block">
              <div className="relative aspect-square rounded-3xl overflow-hidden border border-gray-100 shadow-2xl">
                <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&h=800&q=80" alt="Happy family" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="absolute bottom-6 left-6 right-6 p-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {[11, 12, 13, 14].map((i) => (<img key={i} src={`https://i.pravatar.cc/100?img=${i}`} alt="" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />))}
                      <div className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-r from-[#8B0000] to-[#005E60] flex items-center justify-center text-white text-xs font-bold shadow-sm">+2K</div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">50,000+ Happy Families</p>
                      <p className="text-xs text-gray-500">Found their dream homes with us</p>
                    </div>
                  </div>
                </motion.div>
              </div>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute -top-6 -right-6 w-24 h-24 border-2 border-dashed border-[#8B0000]/20 rounded-full" />
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 1 }} className="absolute -bottom-8 -left-8 w-32 h-32 border-2 border-dashed border-[#F8C21C]/30 rounded-full" />
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8, type: "spring", stiffness: 200 }} className="absolute -top-4 -left-4 px-4 py-2 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#F8C21C]" />
                <span className="text-sm font-medium text-gray-700">Award Winning</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-white rounded-2xl p-6 text-center border border-gray-100 hover:border-[#005E60]/30 hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#8B0000] to-[#005E60] rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 lg:p-12 border border-gray-100 shadow-sm mb-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#005E60]/10 rounded-full border border-[#005E60]/20 mb-6">
                  <Info className="w-4 h-4 text-[#005E60]" />
                  <span className="text-sm font-medium text-[#005E60]">About Us</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Making Property Search Simple, Transparent & Joyful</h2>
                <p className="text-gray-600 leading-relaxed mb-6">Founded in 2019, Associatte is a PropTech platform connecting buyers, sellers, and renters with verified properties across India. <span className="font-semibold text-[#8B0000]"> We believe finding a home should be empowering, not stressful.</span></p>
                <div className="mb-8 space-y-3">
                  {['100% verified listings with real photos & documents', 'AI-powered recommendations based on your preferences', 'End-to-end support from search to possession', 'Transparent pricing with zero hidden costs'].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#005E60] mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4">
                  <button className="px-6 py-3 bg-gradient-to-r from-[#8B0000] to-[#005E60] text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center gap-2">Explore Now <ArrowRight className="w-4 h-4" /></button>
                  <button className="px-6 py-3 bg-gray-50 text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-[#005E60] transition-colors">Learn More</button>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-lg">
                  <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&h=800&q=80" alt="Team" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-lg border max-w-xs hidden lg:block">
                  <p className="font-semibold text-gray-900">50,000+ Happy Families</p>
                  <p className="text-sm text-gray-500">Found their dream homes with us</p>
                </div>
              </div>
            </div>
          </div>

          {/* Services & Why Choose */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#005E60]/10 rounded-full border border-[#005E60]/20 mb-6">
                <Building2 className="w-4 h-4 text-[#005E60]" />
                <span className="text-sm font-medium text-[#005E60]">Our Services</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">What We Offer</h3>
              <div className="grid gap-3">
                {['🏠 Residential Properties', '🏢 Commercial Spaces', '🏘️ Plots & Land', '🔑 Rental Properties', '🏗️ Under Construction', '✨ Luxury Homes', '💼 Investment Properties'].map((service, idx) => (
                  <a key={idx} href="#" className="group flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-[#8B0000]/5 border border-transparent hover:border-[#8B0000]/20 transition-all">
                    <span className="text-2xl">{service.split(' ')[0]}</span>
                    <span className="font-medium text-gray-700 group-hover:text-[#8B0000] transition-colors">{service.split(' ').slice(1).join(' ')}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#8B0000] ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                  </a>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F8C21C]/20 rounded-full border border-[#F8C21C]/30 mb-6">
                <Award className="w-4 h-4 text-[#8B0000]" />
                <span className="text-sm font-medium text-[#8B0000]">Why Us</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Associatte</h3>
              <div className="space-y-5">
                {[{ icon: '🔍', title: 'Verified Listings', desc: 'Every property undergoes rigorous verification with real photos, legal documents, and owner validation.' }, { icon: '🤝', title: 'Expert Guidance', desc: 'Our property consultants provide personalized assistance from search to possession and beyond.' }, { icon: '⚡', title: 'Fast & Easy', desc: 'AI-powered search, virtual tours, and digital documentation make your journey seamless.' }].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#F8C21C]/20 rounded-lg flex items-center justify-center flex-shrink-0"><span className="text-lg">{item.icon}</span></div>
                    <div>
                      <p className="font-semibold text-gray-800 mb-1">{item.title}</p>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className="bg-white rounded-3xl p-8 lg:p-12 border border-gray-100 shadow-sm mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">These principles guide every decision we make.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div key={value.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors">
                    <div className="w-14 h-14 bg-[#005E60]/10 border border-[#005E60]/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-[#005E60]" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* ==================== TEAM SECTIONS ==================== */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F8C21C]/20 rounded-full border border-[#F8C21C]/30 mb-4">
                <Users className="w-4 h-4 text-[#8B0000]" />
                <span className="text-sm font-medium text-[#8B0000]">Our Team</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900">Meet the People Behind Our Success</h3>
              <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Passionate experts from diverse backgrounds, united by a shared mission.</p>
            </div>

            {/* Owner */}
            <div className="bg-gradient-to-br from-[#8B0000]/5 via-white to-[#F8C21C]/5 rounded-3xl p-8 lg:p-10 border border-[#8B0000]/20 mb-8">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-[#8B0000] to-[#F8C21C] rounded-full blur opacity-20" />
                  <img src={owner.image} alt={owner.name} className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-white shadow-xl" />
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-[#F8C21C] to-[#8B0000] rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <Star className="w-5 h-5 text-white fill-white" />
                  </div>
                </div>
                <div className="text-center lg:text-left flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F8C21C]/20 rounded-full border border-[#F8C21C]/30 mb-3">
                    <Award className="w-4 h-4 text-[#8B0000]" />
                    <span className="text-sm font-medium text-[#8B0000]">Founder & CEO</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{owner.name}</h3>
                  <p className="text-gray-600 mb-4 max-w-lg">{owner.bio}</p>
                  <div className="flex items-center gap-3 justify-center lg:justify-start">
                    {owner.social.linkedin && (<a href={owner.social.linkedin} className="p-2.5 bg-white rounded-lg hover:bg-[#8B0000]/10 text-gray-400 hover:text-[#8B0000] border border-gray-100 transition-colors"><Globe className="w-4 h-4" /></a>)}
                    {owner.social.twitter && (<a href={owner.social.twitter} className="p-2.5 bg-white rounded-lg hover:bg-[#8B0000]/10 text-gray-400 hover:text-[#8B0000] border border-gray-100 transition-colors"><ExternalLink className="w-4 h-4" /></a>)}
                    <a href={`mailto:${owner.name.toLowerCase().replace(/\s+/g, '.')}@associatte.co.in`} className="p-2.5 bg-white rounded-lg hover:bg-[#8B0000]/10 text-gray-400 hover:text-[#8B0000] border border-gray-100 transition-colors"><Mail className="w-4 h-4" /></a>
                  </div>
                </div>
              </div>
            </div>

            {/* Pune Team */}
            <TeamRow title="Pune Team" location="Pune, Maharashtra" accentColor="#8B0000" icon={Building2} members={puneTeam} />
            {/* Mumbai Team */}
            <TeamRow title="Mumbai Team" location="Mumbai, Maharashtra" accentColor="#005E60" icon={MapPin} members={mumbaiTeam} />
            {/* Digital Team */}
            <TeamRow title="Digital Team" location="Remote • India" accentColor="#F8C21C" icon={Lightbulb} members={digitalTeam} />
          </div>

          {/* Contact */}
          <div className="mb-16">
            <div className="text-center mb-8"><h3 className="text-2xl font-bold text-gray-900">Get In Touch</h3></div>
            <div className="grid md:grid-cols-3 gap-6">
              {contactInfo.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <a key={idx} href={item.href} className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 hover:border-[#005E60]/30 hover:shadow-md transition-all group">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#8B0000] to-[#005E60] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:shadow-lg transition-shadow"><Icon className="w-5 h-5 text-white" /></div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{item.label}</h4>
                      <p className="text-[#8B0000] font-medium text-sm">{item.value}</p>
                      <p className="text-xs text-gray-500">{item.subtext}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#8B0000] to-[#005E60] text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full mb-6"><Sparkles className="w-4 h-4 text-[#F8C21C]" /><span className="text-sm font-medium">Ready to Find Your Home?</span></div>
              <h2 className="text-3xl font-bold mb-4">Start Your Property Journey Today</h2>
              <p className="text-white/90 mb-8 max-w-xl mx-auto">Join 50,000+ happy customers who found their perfect property with Associatte.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="px-8 py-4 bg-[#F8C21C] text-[#8B0000] font-semibold rounded-xl hover:shadow-lg transition-shadow flex items-center justify-center gap-2">Browse Properties <ArrowRight className="w-4 h-4" /></button>
                {/* ✅ Optional: You can also link this to /contact-us if preferred */}
                <Link href="/contact-us" className="px-8 py-4 bg-white/20 backdrop-blur border border-white/30 text-white font-semibold rounded-xl hover:bg-white/30 transition-colors">
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>© 2026 Associatte PropTech Pvt Ltd. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="mailto:info@associatte.co.in" className="hover:text-[#005E60] transition-colors">info@associatte.co.in</a>
              <a href="tel:+918881188181" className="hover:text-[#8B0000] transition-colors">+91 88 8118 8181</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}