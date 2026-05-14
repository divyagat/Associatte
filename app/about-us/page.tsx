// @/app/about-us/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useInView, useTransform, type Variants } from 'framer-motion';
import { 
  Target, Heart, Users, Award, ShieldCheck, Lightbulb, 
  Building2, MapPin, Phone, Mail, ArrowRight, CheckCircle2, 
  Sparkles, TrendingUp, Clock, Star, 
  Link as LinkedInIcon,
  Share2 as TwitterIcon,
  Building, Monitor,
} from 'lucide-react';

// ✅ Single, clean variant definitions - NO duplicates
const customEase = [0.22, 1, 0.36, 1] as const;

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: customEase as any }
  }
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.5, ease: customEase as any }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.15, delayChildren: 0.2 } 
  }
};

export default function AboutUs() {
  const [scrolled, setScrolled] = useState(false);
  const [activeStat, setActiveStat] = useState<number | null>(null);
  
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
  
  const missionRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  
  const missionInView = useInView(missionRef, { once: true, margin: "-100px" });
  const valuesInView = useInView(valuesRef, { once: true, margin: "-100px" });
  const timelineInView = useInView(timelineRef, { once: true, margin: "-100px" });
  const teamInView = useInView(teamRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { value: '50K+', label: 'Happy Customers', icon: Users, gradient: 'from-[#8B0000] to-[#005E60]' },
    { value: '10K+', label: 'Properties Listed', icon: Building2, gradient: 'from-[#F8C21C] to-[#E0A800]' },
    { value: '15+', label: 'Cities Covered', icon: MapPin, gradient: 'from-[#005E60] to-[#004447]' },
    { value: '98%', label: 'Success Rate', icon: TrendingUp, gradient: 'from-[#8B0000] to-[#A52A2A]' },
  ];

  const values = [
    {
      icon: ShieldCheck,
      title: 'Trusted & Transparent',
      description: 'Every property is verified with real photos, documents, and owner details. Zero hidden charges, complete transparency.',
      gradient: 'from-[#005E60] to-[#003D3E]',
      bg: 'bg-[#005E60]/10',
      border: 'border-[#005E60]/20',
      text: 'text-[#005E60]',
    },
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Your dream home is our mission. We listen deeply, understand your needs, and deliver personalized solutions.',
      gradient: 'from-[#8B0000] to-[#6B0000]',
      bg: 'bg-[#8B0000]/10',
      border: 'border-[#8B0000]/20',
      text: 'text-[#8B0000]',
    },
    {
      icon: Lightbulb,
      title: 'Innovation Driven',
      description: 'AI-powered recommendations, 3D virtual tours, and smart filters make your property search effortless.',
      gradient: 'from-[#F8C21C] to-[#D4A514]',
      bg: 'bg-[#F8C21C]/10',
      border: 'border-[#F8C21C]/20',
      text: 'text-[#D4A514]',
    },
    {
      icon: Target,
      title: 'Results Focused',
      description: "We don't just list properties – we match you with the perfect home that fits your life, budget, and dreams.",
      gradient: 'from-[#005E60] to-[#004447]',
      bg: 'bg-[#005E60]/10',
      border: 'border-[#005E60]/20',
      text: 'text-[#005E60]',
    },
  ];

  const timeline = [
    { year: '2019', title: 'Founded', description: 'Started in Mumbai with a simple vision: make property hunting joyful.', icon: Sparkles },
    { year: '2021', title: 'Expanded', description: 'Grew to 5 major Indian cities with 1,000+ verified listings.', icon: TrendingUp },
    { year: '2023', title: 'Innovation', description: 'Launched AI-powered recommendations & immersive virtual property tours.', icon: Lightbulb },
    { year: '2026', title: 'Today', description: 'Trusted by 50,000+ customers across 15+ Indian cities, still growing.', icon: Award },
  ];

  const owner = {
    name: 'Priya Sharma',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&h=600&q=80',
    bio: '15+ years in real estate. Passionate about making homeownership accessible to every Indian family.',
    social: { linkedin: '#', twitter: '#' },
  };

  const teamsByLocation = {
    pune: {
      title: 'Pune Team',
      icon: Building,
      color: '#8B0000',
      members: [
        { name: 'Rahul Mehta', role: 'Head of Technology', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80', social: { linkedin: '#', twitter: '#' } },
        { name: 'Sneha Deshmukh', role: 'Senior Property Consultant', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&h=400&q=80', social: { linkedin: '#', twitter: '#' } },
        { name: 'Amit Patil', role: 'Sales Manager', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=400&q=80', social: { linkedin: '#', twitter: '#' } },
        { name: 'Pooja Joshi', role: 'Customer Relations', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&h=400&q=80', social: { linkedin: '#', twitter: '#' } },
      ],
    },
    mumbai: {
      title: 'Mumbai Team',
      icon: Building2,
      color: '#005E60',
      members: [
        { name: 'Vikram Singh', role: 'Market Expansion Head', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=80', social: { linkedin: '#', twitter: '#' } },
        { name: 'Ananya Patel', role: 'Customer Success Manager', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80', social: { linkedin: '#', twitter: '#' } },
        { name: 'Rajesh Kumar', role: 'Property Analyst', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&h=400&q=80', social: { linkedin: '#', twitter: '#' } },
        { name: 'Kavita Reddy', role: 'Business Development', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&h=400&q=80', social: { linkedin: '#', twitter: '#' } },
      ],
    },
    digital: {
      title: 'Digital Team',
      icon: Monitor,
      color: '#F8C21C',
      members: [
        { name: 'Arjun Kapoor', role: 'Lead Developer', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80', social: { linkedin: '#', twitter: '#' } },
        { name: 'Meera Iyer', role: 'UX Designer', image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&h=400&q=80', social: { linkedin: '#', twitter: '#' } },
        { name: 'Karan Malhotra', role: 'Digital Marketing Head', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=400&q=80', social: { linkedin: '#', twitter: '#' } },
        { name: 'Divya Nair', role: 'Content Strategist', image: 'https://images.unsplash.com/photo-1554151228-14d9def656ec?auto=format&fit=crop&w=400&h=400&q=80', social: { linkedin: '#', twitter: '#' } },
      ],
    },
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50/50 to-white">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 origin-left z-50"
        style={{ scaleX: scrollYProgress, background: 'linear-gradient(90deg, #8B0000, #005E60)' }}
      />

      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ y: [0, -40, 0], x: [0, 30, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl"
          style={{ background: 'linear-gradient(135deg, rgba(139,0,0,0.15), rgba(0,94,96,0.15))' }}
        />
        <motion.div
          animate={{ y: [0, 50, 0], x: [0, -40, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ background: 'linear-gradient(225deg, rgba(248,194,28,0.15), rgba(139,0,0,0.15))' }}
        />
      </div>

      {/* Hero Section */}
      <motion.section style={{ opacity: heroOpacity }} className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#8B0000]/5 via-white to-[#005E60]/5" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,94,96,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,94,96,0.04)_1px,transparent_1px)] bg-[size:50px_50px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-white/80 backdrop-blur-xl rounded-full border border-gray-200/60 shadow-lg mb-7"
            >
              <div className="relative">
                <Sparkles className="w-4.5 h-4.5" style={{ color: '#F8C21C' }} />
                <motion.div className="absolute inset-0" animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Sparkles className="w-4.5 h-4.5" style={{ color: '#F8C21C' }} />
                </motion.div>
              </div>
              <span className="text-sm font-semibold text-gray-700">Our Story Since 2019</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
              Building Dreams,{' '}
              <span className="relative inline-block">
                <span className="relative z-10" style={{ background: 'linear-gradient(90deg, #8B0000, #005E60)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>One Home</span>
                <motion.span className="absolute -bottom-3 left-0 right-0 h-3.5 rounded-full opacity-60" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.5, duration: 1, ease: "easeOut" }} style={{ background: 'linear-gradient(90deg, #F8C21C, #E0A800)' }} />
              </span>
              <br className="hidden sm:block" /> at a Time
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }} className="mt-7 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              We&apos;re not just a property platform – we&apos;re your trusted partner in finding the perfect space to live, work, and thrive across India.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="mt-10 flex flex-wrap justify-center gap-4">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="group px-7 py-4 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2.5" style={{ background: 'linear-gradient(90deg, #8B0000, #005E60)' }}>
                Explore Properties <ArrowRight className="w-4.5 h-4.5 transition-transform group-hover:translate-x-1" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="px-7 py-4 bg-white/80 backdrop-blur-xl border border-gray-200/60 text-gray-700 font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:border-[#005E60]/50 transition-all duration-300">
                Contact Us
              </motion.button>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }} className="mt-12 flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4.5 h-4.5" style={{ color: '#005E60' }} /><span>100% Verified Listings</span></div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4.5 h-4.5" style={{ color: '#005E60' }} /><span>Zero Hidden Charges</span></div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4.5 h-4.5" style={{ color: '#005E60' }} /><span>24/7 Support</span></div>
            </motion.div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.8 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 text-gray-400">
          <span className="text-xs font-medium">Scroll to explore</span>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.8, repeat: Infinity }} className="w-6 h-10 rounded-full border-2 border-gray-300 flex justify-center pt-2">
            <motion.div className="w-1.5 h-2.5 bg-gray-400 rounded-full" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-16 border-y border-gray-100/60 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div key={stat.label} variants={fadeInUp} onHoverStart={() => setActiveStat(index)} onHoverEnd={() => setActiveStat(null)} whileHover={{ y: -6, transition: { duration: 0.2 } }} className="relative group p-6 bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100/60 shadow-sm hover:shadow-2xl transition-all duration-300 text-center overflow-hidden">
                  <motion.div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  <div className={`relative inline-flex p-3.5 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg mb-4`}>
                    <Icon className="w-6.5 h-6.5 text-white" />
                    <motion.div className="absolute inset-0 rounded-2xl bg-white/20" animate={{ opacity: [0.15, 0.3, 0.15] }} transition={{ duration: 2.5, repeat: Infinity }} />
                  </div>
                  <motion.p className="text-3.5xl font-extrabold text-gray-900 mb-1" animate={{ scale: activeStat === index ? 1.05 : 1 }} transition={{ duration: 0.2 }}>{stat.value}</motion.p>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r ${stat.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section ref={missionRef} className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={missionInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7 }}>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={missionInView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#005E60]/10 rounded-full border border-[#005E60]/20 mb-6">
                <Target className="w-4.5 h-4.5" style={{ color: '#005E60' }} />
                <span className="text-xs font-semibold" style={{ color: '#005E60' }}>Our Mission</span>
              </motion.div>
              
              <h2 className="text-3.5xl sm:text-4.5xl font-bold text-gray-900 mb-7 leading-tight">
                Empowering Your Property Journey with{' '}
                <span style={{ background: 'linear-gradient(90deg, #8B0000, #005E60)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>Trust & Technology</span>
              </h2>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">Founded in 2019, we set out to transform how India discovers and acquires properties. We believe finding a home should be joyful, transparent, and empowering – not stressful.</p>
              
              <motion.div variants={staggerContainer} initial="hidden" animate={missionInView ? "visible" : "hidden"} className="space-y-4.5">
                {[
                  { text: '100% verified listings with real photos, videos & documents', delay: 0 },
                  { text: 'AI-powered recommendations based on your lifestyle & budget', delay: 0.1 },
                  { text: 'End-to-end support: from search to possession & beyond', delay: 0.2 },
                  { text: 'Transparent pricing with zero hidden costs or surprises', delay: 0.3 },
                ].map((item, i) => (
                  <motion.div key={item.text} variants={fadeInUp} custom={item.delay} className="flex items-start gap-3.5 group">
                    <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="flex-shrink-0 mt-1 p-2 bg-[#005E60]/10 rounded-xl border border-[#005E60]/20 group-hover:bg-[#005E60]/20 transition-colors">
                      <CheckCircle2 className="w-5 h-5" style={{ color: '#005E60' }} />
                    </motion.div>
                    <span className="text-gray-700 font-medium leading-relaxed">{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} animate={missionInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.2 }} className="relative">
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl border border-gray-100/60">
                <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&h=800&q=80" alt="Our team helping customers find their dream homes" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" width={800} height={800} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                
                <motion.div initial={{ opacity: 0, y: 30 }} animate={missionInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 }} className="absolute bottom-6 left-6 right-6 p-5 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                      {[11, 12, 13, 14].map((i) => (
                        <div key={i} className="w-11 h-11 rounded-full border-3 border-white bg-gray-200 overflow-hidden shadow-lg">
                          <img src={`https://i.pravatar.cc/100?img=${i}`} alt="" className="w-full h-full object-cover" width={44} height={44} />
                        </div>
                      ))}
                      <div className="w-11 h-11 rounded-full border-3 border-white flex items-center justify-center text-white text-xs font-bold shadow-lg" style={{ background: 'linear-gradient(135deg, #F8C21C, #E0A800)' }}>+2K</div>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">50,000+ Happy Families</p>
                      <p className="text-xs text-gray-500">Found their dream homes with us</p>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute -top-8 -right-8 w-28 h-28 border-2 border-dashed rounded-full" style={{ borderColor: 'rgba(139,0,0,0.3)' }} />
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear", delay: 1 }} className="absolute -bottom-10 -left-10 w-36 h-36 border-2 border-dashed rounded-full" style={{ borderColor: 'rgba(248,194,28,0.3)' }} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section ref={valuesRef} className="py-24 bg-gradient-to-b from-white to-[#005E60]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={valuesInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto mb-18">
            <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#005E60]/10 rounded-full border border-[#005E60]/20 mb-5">
              <Heart className="w-4.5 h-4.5" style={{ color: '#005E60' }} />
              <span className="text-xs font-semibold" style={{ color: '#005E60' }}>Our Values</span>
            </div>
            <h2 className="text-3.5xl sm:text-4.5xl font-bold text-gray-900 mb-5">What Drives Us Forward</h2>
            <p className="text-lg text-gray-600 leading-relaxed">Every decision we make, every feature we build, and every customer interaction is guided by these core principles.</p>
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" animate={valuesInView ? "visible" : "hidden"} viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div key={value.title} variants={fadeInUp} whileHover={{ y: -8, transition: { duration: 0.25 } }} className="group relative p-7 bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100/60 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${value.gradient} rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  <div className={`inline-flex p-4 rounded-2xl ${value.bg} ${value.border} border mb-5 group-hover:scale-105 transition-transform duration-300`}>
                    <Icon className={`w-7 h-7 ${value.text}`} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  <motion.div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity" initial={{ x: -10 }} whileHover={{ x: 0 }}>
                    <ArrowRight className={`w-4.5 h-4.5 ${value.text}`} />
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section ref={timelineRef} className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={timelineInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto mb-18">
            <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#F8C21C]/10 rounded-full border border-[#F8C21C]/20 mb-5">
              <Clock className="w-4.5 h-4.5" style={{ color: '#F8C21C' }} />
              <span className="text-xs font-semibold" style={{ color: '#F8C21C' }}>Our Journey</span>
            </div>
            <h2 className="text-3.5xl sm:text-4.5xl font-bold text-gray-900 mb-5">Growing With Purpose</h2>
            <p className="text-lg text-gray-600">Milestones that shaped who we are today and where we&apos;re headed tomorrow.</p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#8B0000]/30 via-[#005E60]/30 to-[#F8C21C]/30" />
            <div className="space-y-14">
              {timeline.map((item, index) => {
                const Icon = item.icon;
                const isEven = index % 2 === 0;
                return (
                  <motion.div key={item.year} initial={{ opacity: 0, x: isEven ? -50 : 50 }} animate={timelineInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: index * 0.15 }} className={`relative flex items-center gap-10 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className={`flex-1 ${isEven ? 'md:text-right' : ''} pl-14 md:pl-0`}>
                      <motion.div whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.15)" }} className={`inline-block p-6 bg-white/90 backdrop-blur-xl rounded-3xl border border-gray-100/60 shadow-lg ${isEven ? 'md:ml-auto' : ''}`}>
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-4" style={{ background: 'linear-gradient(90deg, rgba(0,94,96,0.1), rgba(248,194,28,0.1))', color: '#005E60' }}>
                          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#8B0000' }} />
                          {item.year}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900 mb-2.5">{item.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{item.description}</p>
                      </motion.div>
                    </div>
                    <motion.div whileHover={{ scale: 1.15 }} className="absolute left-5 md:left-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-white border-4 shadow-xl flex items-center justify-center z-10 cursor-pointer" style={{ borderColor: '#005E60' }}>
                      <Icon className="w-5 h-5" style={{ color: '#005E60' }} />
                      <motion.div className="absolute inset-0 rounded-full border-2 animate-ping" style={{ borderColor: 'rgba(0,94,96,0.3)' }} animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }} transition={{ duration: 2, repeat: Infinity }} />
                    </motion.div>
                    <div className="flex-1 hidden md:block" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section ref={teamRef} className="py-24 bg-gradient-to-b from-[#005E60]/5 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={teamInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#F8C21C]/10 rounded-full border border-[#F8C21C]/20 mb-5">
              <Users className="w-4.5 h-4.5" style={{ color: '#F8C21C' }} />
              <span className="text-xs font-semibold" style={{ color: '#F8C21C' }}>Our Team</span>
            </div>
            <h2 className="text-3.5xl sm:text-4.5xl font-bold text-gray-900 mb-5">Meet The People Behind Our Success</h2>
            <p className="text-lg text-gray-600">Passionate experts from diverse backgrounds, united by a shared mission to make homeownership accessible to all.</p>
          </motion.div>

          {/* Owner Section */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={teamInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="mb-20">
            <div className="max-w-2xl mx-auto">
              <div className="relative group">
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-[#F8C21C]/40 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                  <div className="absolute top-0 left-0 right-0 h-2" style={{ background: 'linear-gradient(90deg, #F8C21C, #8B0000)' }} />
                  <div className="p-8 sm:p-10">
                    <div className="flex flex-col sm:flex-row items-center gap-8">
                      <div className="relative">
                        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 shadow-xl" style={{ borderColor: '#F8C21C' }}>
                          <img src={owner.image} alt={owner.name} className="w-full h-full object-cover" width={160} height={160} />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-4 border-white" style={{ background: 'linear-gradient(135deg, #F8C21C, #E0A800)' }}>
                          <Award className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F8C21C]/20 rounded-full border border-[#F8C21C]/40 mb-3">
                          <Star className="w-3.5 h-3.5" style={{ color: '#8B0000' }} />
                          <span className="text-xs font-bold" style={{ color: '#8B0000' }}>Founder & CEO</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{owner.name}</h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">{owner.bio}</p>
                        <div className="flex justify-center sm:justify-start gap-3">
                          {[
                            { icon: LinkedInIcon, href: owner.social.linkedin },
                            { icon: TwitterIcon, href: owner.social.twitter },
                            { icon: Mail, href: `mailto:${owner.name.toLowerCase().replace(' ', '.')}@associatte.com` },
                          ].map(({ icon: Icon, href }, i) => (
                            <motion.a key={i} href={href} whileHover={{ scale: 1.15, y: -3 }} whileTap={{ scale: 0.95 }} className="p-2.5 bg-[#F8C21C]/20 rounded-xl transition-colors border border-[#F8C21C]/40" style={{ color: '#8B0000' }}>
                              <Icon className="w-4.5 h-4.5" />
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

          {/* Teams by Location */}
          <div className="space-y-16">
            {Object.entries(teamsByLocation).map(([locationKey, locationData], locationIndex) => {
              const Icon = locationData.icon;
              const c = locationData.color;
              return (
                <motion.div key={locationKey} initial={{ opacity: 0, y: 40 }} animate={teamInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: locationIndex * 0.2 }}>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="inline-flex p-3 rounded-2xl border" style={{ backgroundColor: `${c}15`, borderColor: `${c}30` }}>
                      <Icon className="w-6 h-6" style={{ color: c }} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold" style={{ color: c }}>{locationData.title}</h3>
                      <div className="w-full h-1 rounded-full mt-2" style={{ background: `linear-gradient(90deg, ${c}, ${c}80)` }} />
                    </div>
                  </div>

                  <motion.div variants={staggerContainer} initial="hidden" animate={teamInView ? "visible" : "hidden"} viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {locationData.members.map((member) => (
                      <motion.div key={member.name} variants={scaleIn} whileHover={{ y: -6 }} className="group relative bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100/60 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300">
                        <div className="relative aspect-square overflow-hidden">
                          <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" width={400} height={400} />
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(to top, ${c}AA, transparent)` }} />
                          <motion.div initial={{ opacity: 0, y: 20 }} whileHover={{ opacity: 1, y: 0 }} className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            {[{ icon: LinkedInIcon, href: member.social.linkedin }, { icon: TwitterIcon, href: member.social.twitter }].map(({ icon: I, href }, i) => (
                              <motion.a key={i} href={href} whileHover={{ scale: 1.15, y: -2 }} whileTap={{ scale: 0.95 }} className="p-2.5 bg-white/95 backdrop-blur-sm rounded-lg text-gray-700 hover:text-blue-600 shadow-lg transition-colors">
                                <I className="w-4 h-4" />
                              </motion.a>
                            ))}
                          </motion.div>
                        </div>
                        <div className="p-5">
                          <h4 className="font-bold text-gray-900 text-base mb-1">{member.name}</h4>
                          <p className="text-sm font-medium mb-2" style={{ color: c }}>{member.role}</p>
                          <div className="w-10 h-0.5 rounded-full" style={{ backgroundColor: `${c}40` }} />
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative p-10 sm:p-14 rounded-3xl shadow-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #8B0000, #005E60)' }}>
            <div className="absolute inset-0 overflow-hidden">
              <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-2xl" />
              <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} className="absolute -bottom-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-2xl" />
            </div>
            <div className="relative z-10">
              <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2.5 px-4.5 py-2.5 bg-white/20 backdrop-blur-xl rounded-full border border-white/30 mb-7">
                <Star className="w-4.5 h-4.5 text-[#F8C21C]" />
                <span className="text-sm font-semibold text-white">Ready to Start Your Journey?</span>
              </motion.div>
              <h2 className="text-3.5xl sm:text-4.5xl font-bold text-white mb-6 leading-tight">Let&apos;s Find Your Perfect Property Together</h2>
              <p className="text-lg mb-10 max-w-2xl mx-auto leading-relaxed text-white/90">Join thousands of happy customers who trusted us with their property journey. Your dream home is just a search away – let&apos;s make it happen.</p>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="flex flex-col sm:flex-row justify-center gap-5">
                <motion.button whileHover={{ scale: 1.04, boxShadow: "0 25px 50px -12px rgba(248,194,28,0.3)" }} whileTap={{ scale: 0.98 }} className="group px-9 py-4.5 font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3" style={{ color: '#8B0000', backgroundColor: '#F8C21C' }}>
                  Browse Properties <ArrowRight className="w-4.5 h-4.5 transition-transform group-hover:translate-x-1" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }} className="px-9 py-4.5 bg-white/20 backdrop-blur-xl border border-white/30 text-white font-bold rounded-2xl hover:bg-white/30 transition-all duration-300">
                  Schedule a Free Consultation
                </motion.button>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.6 }} className="mt-10 flex flex-wrap justify-center items-center gap-6 text-sm text-white/90">
                <div className="flex items-center gap-2"><ShieldCheck className="w-4.5 h-4.5 text-[#F8C21C]" /><span>Secure & Verified</span></div>
                <div className="flex items-center gap-2"><Heart className="w-4.5 h-4.5 text-[#F8C21C]" /><span>Customer First</span></div>
                <div className="flex items-center gap-2"><Award className="w-4.5 h-4.5 text-[#F8C21C]" /><span>Award Winning</span></div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Bar */}
      <section className="py-10 border-t border-gray-100/60 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            <p className="text-sm text-gray-600">© 2026 Associatte PropTech Pvt Ltd. All rights reserved.</p>
            <div className="flex items-center gap-7">
              <a href="mailto:hello@associatte.com" className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-[#005E60] transition-colors group">
                <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-[#005E60]/10 transition-colors"><Mail className="w-4 h-4" /></div>
                hello@associatte.com
              </a>
              <a href="tel:+918743563546" className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-[#8B0000] transition-colors group">
                <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-[#8B0000]/10 transition-colors"><Phone className="w-4 h-4" /></div>
                +91 87435 63546
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}