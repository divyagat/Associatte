// client/app/services/page.tsx
'use client';

import Link from 'next/link';
import { 
  Handshake, FileText, Scale, ClipboardList, TrendingUp, 
  CheckCircle2, ArrowRight, Phone, Sparkles, Shield, 
  Award, Clock, Users, Building2, MapPin, Star,
  ChevronRight, Calendar, Briefcase, Home, DollarSign,
  Gem, Crown, Rocket, Zap, Heart, ThumbsUp, Globe,
  Headphones, ShieldCheck, BadgeCheck, Target, BarChart3,
  Play, Video, ChevronDown, Search, Filter, Quote
} from 'lucide-react';

// 🎨 Brand Colors
const BRAND = {
  green: '#005E60',
  red: '#8B0000',
  yellow: '#F8C21C',
  darkGreen: '#003d40',
  lightGreen: '#e8f3f2',
  lightRed: '#fff0f0',
  lightYellow: '#fff8e8',
};

// 🔹 Service Configuration
const SERVICES = [
  {
    id: 'consultation',
    title: 'Property Consultation',
    shortTitle: 'Expert Guidance',
    tagline: 'Find Your Dream Home',
    icon: Handshake,
    color: BRAND.green,
    bgColor: BRAND.lightGreen,
    description: 'Get personalized guidance from our expert consultants to find the perfect property that matches your needs, budget & lifestyle.',
    features: [
      'One-on-one consultation with property experts',
      'Personalized shortlists based on your criteria',
      'Site visits & virtual tours arranged',
      'Negotiation support & price analysis',
      'Post-purchase assistance',
    ],
    stats: { value: '25+', label: 'Years Experience', icon: Award },
    cta: 'Book Free Consultation',
    ctaHref: '/contact-us?service=consultation',
  },
  {
    id: 'home-loans',
    title: 'Home Loans',
    shortTitle: 'Best Financing',
    tagline: 'Smart Financing Solutions',
    icon: FileText,
    color: BRAND.yellow,
    bgColor: BRAND.lightYellow,
    description: 'Connect with our partner banks & NBFCs to get the best home loan deals with competitive interest rates & minimal paperwork.',
    features: [
      'Pre-approved loan eligibility check',
      'Comparison of 15+ bank offers',
      'Documentation support & application assistance',
      'Fast-track processing for Associatte customers',
      'Balance transfer guidance',
    ],
    stats: { value: '15+', label: 'Bank Partners', icon: Building2 },
    cta: 'Check Loan Eligibility',
    ctaHref: '/contact-us?service=home-loans',
  },
  {
    id: 'legal',
    title: 'Legal Assistance',
    shortTitle: 'Hassle-Free Legal',
    tagline: 'Complete Legal Protection',
    icon: Scale,
    color: BRAND.red,
    bgColor: BRAND.lightRed,
    description: 'Ensure hassle-free property transactions with our empanelled legal experts handling documentation, verification & registration.',
    features: [
      'Title verification & due diligence',
      'Agreement drafting & review',
      'RERA compliance check',
      'Registration & stamp duty guidance',
      'Dispute resolution support',
    ],
    stats: { value: '100%', label: 'Compliance', icon: ShieldCheck },
    cta: 'Consult Legal Expert',
    ctaHref: '/contact-us?service=legal',
  },
  {
    id: 'management',
    title: 'Property Management',
    shortTitle: 'Stress-Free Ownership',
    tagline: 'We Manage, You Earn',
    icon: ClipboardList,
    color: BRAND.yellow,
    bgColor: BRAND.lightYellow,
    description: 'Let us manage your property while you relax. From tenant screening to maintenance, we handle everything professionally.',
    features: [
      'Tenant screening & background checks',
      'Rent collection & financial reporting',
      'Maintenance & repair coordination',
      'Legal notice handling for defaults',
      'Periodic property inspections',
    ],
    stats: { value: '500+', label: 'Properties Managed', icon: Home },
    cta: 'Manage My Property',
    ctaHref: '/contact-us?service=management',
  },
  {
    id: 'investment',
    title: 'Investment Advisory',
    shortTitle: 'Smart Investing',
    tagline: 'Maximize Your Returns',
    icon: TrendingUp,
    color: BRAND.red,
    bgColor: BRAND.lightRed,
    description: 'Make informed investment decisions with our data-driven market analysis, ROI projections & portfolio diversification strategies.',
    features: [
      'Market trend analysis & reports',
      'ROI & rental yield calculations',
      'Portfolio diversification strategies',
      'Pre-launch & early-bird opportunity alerts',
      'Exit strategy planning',
    ],
    stats: { value: '₹500Cr+', label: 'Transaction Value', icon: Target },
    cta: 'Get Investment Plan',
    ctaHref: '/contact-us?service=investment',
  },
];

// Trust badges
const TRUST_BADGES = [
  { icon: Award, label: '20+ Years', description: 'Industry Experience', gradient: 'from-amber-400 to-orange-500' },
  { icon: Users, label: '1000+', description: 'Happy Clients', gradient: 'from-green-400 to-emerald-500' },
  { icon: Building2, label: '500+', description: 'Properties Sold', gradient: 'from-blue-400 to-indigo-500' },
  { icon: Shield, label: '100%', description: 'Verified Properties', gradient: 'from-purple-400 to-pink-500' },
];

// Why Choose Us
const WHY_CHOOSE = [
  { icon: Headphones, title: '24/7 Support', description: 'Round-the-clock assistance for all your queries', color: BRAND.green },
  { icon: ThumbsUp, title: '100% Transparency', description: 'No hidden charges, complete clarity', color: BRAND.yellow },
  { icon: Rocket, title: 'Fast Processing', description: 'Quick turnaround on all services', color: BRAND.red },
  { icon: BadgeCheck, title: 'RERA Certified', description: 'Government registered & compliant', color: BRAND.green },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      
      {/* 🔹 Modern Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-[#101C2E]" />
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        {/* Animated Circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#F8C21C]/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#005E60]/20 rounded-full blur-3xl animate-pulse delay-500" />
        
        {/* Floating Shapes */}
        <div className="absolute top-32 left-[10%] animate-float">
          <div className="w-12 h-12 bg-white/10 rounded-2xl rotate-12 backdrop-blur-sm" />
        </div>
        <div className="absolute bottom-32 right-[10%] animate-float-delayed">
          <div className="w-16 h-16 bg-[#F8C21C]/10 rounded-full backdrop-blur-sm" />
        </div>
        <div className="absolute top-1/2 left-[5%] animate-float">
          <Gem className="w-8 h-8 text-white/20" />
        </div>
        <div className="absolute bottom-1/2 right-[8%] animate-float-delayed">
          <Crown className="w-10 h-10 text-white/20" />
        </div>
        
        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20 animate-fade-in-up">
              <Sparkles className="w-4 h-4 text-[#F8C21C] animate-pulse" />
              <span className="text-sm font-medium tracking-wide text-white">Trusted by 1000+ Happy Clients</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="page-title mb-6 animate-fade-in-up">
              <span className="text-white">Your One-Stop Solution for</span>
              <span className="block text-[#F8C21C] mt-3 relative inline-block">
                All Property Needs
                <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 200 10" preserveAspectRatio="none">
                  <path d="M0,5 Q25,0 50,5 T100,5 T150,5 T200,5" stroke="#F8C21C" fill="none" strokeWidth="3" strokeLinecap="round">
                    <animate attributeName="stroke-dashoffset" from="200" to="0" dur="2s" repeatCount="indefinite" />
                  </path>
                </svg>
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-lg lg:text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
              End-to-end real estate services for buyers, sellers, investors & landlords in Pune, Mumbai & KDMC. 
              Experience seamless property transactions with our expert team.
            </p>
            
            {/* Stats Row */}
            <div className="flex flex-wrap justify-center gap-8 mb-12 animate-fade-in-up animation-delay-300">
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-[#F8C21C]">20+</div>
                <div className="text-xs text-white/70">Years Experience</div>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-[#F8C21C]">1000+</div>
                <div className="text-xs text-white/70">Happy Clients</div>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-[#F8C21C]">500+</div>
                <div className="text-xs text-white/70">Properties Sold</div>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-[#F8C21C]">₹500Cr+</div>
                <div className="text-xs text-white/70">Transaction Value</div>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in-up animation-delay-400">
              <Link
                href="/contact-us"
                className="group btn-primary hover:scale-105 shadow-xl"
              >
                <span>Get Free Consultation</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a 
                href="tel:+918881188181"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:scale-105"
              >
                <Phone className="w-5 h-5" />
                <span>Call: +91 8881188181</span>
              </a>
            </div>
            
            {/* Service Quick Links */}
            <div className="flex flex-wrap justify-center gap-3 animate-fade-in-up animation-delay-500">
              {SERVICES.map((service) => {
                const Icon = service.icon;
                return (
                  <a
                    key={service.id}
                    href={`#${service.id}`}
                    className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/10"
                  >
                    <Icon className="w-4 h-4 group-hover:rotate-12 transition-transform" style={{ color: service.color === BRAND.yellow ? BRAND.yellow : 'white' }} />
                    <span className="text-white/90">{service.shortTitle}</span>
                  </a>
                );
              })}
            </div>
            
            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
              <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center">
                <div className="w-1 h-2 bg-white/50 rounded-full mt-2 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none" fill="currentColor">
            <path d="M0,0 C150,40 250,80 400,80 C550,80 650,20 800,20 C950,20 1050,60 1200,60 L1200,120 L0,120 Z" />
            <path d="M0,60 C150,100 250,40 400,40 C550,40 650,100 800,100 C950,100 1050,40 1200,40 L1200,120 L0,120 Z" fill="rgba(255,255,255,0.3)" />
          </svg>
        </div>
      </section>

      {/* 🔹 Trust Badges with Hover Effects */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#005E60]/10 rounded-full mb-4">
              <Shield className="w-4 h-4 text-[#005E60]" />
              <span className="text-sm font-semibold text-[#005E60]">Our Credentials</span>
            </div>
            <h2 className="section-title text-gray-900 mt-2">Trusted by Thousands of Property Owners</h2>
            <p className="text-gray-500 mt-2">We take pride in our track record of excellence</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_BADGES.map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <div key={idx} className="group text-center bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-gradient-to-br ${badge.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="font-bold text-2xl text-gray-900">{badge.label}</div>
                  <div className="text-sm text-gray-500">{badge.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 🔹 Services Sections */}
      {SERVICES.map((service, index) => {
        const Icon = service.icon;
        const isEven = index % 2 === 0;
        
        return (
          <section 
            key={service.id} 
            id={service.id}
            className={`py-20 lg:py-28 scroll-mt-20 transition-all duration-500 ${
              isEven ? 'bg-white' : 'bg-gradient-to-br from-gray-50 to-white'
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${!isEven ? 'lg:flex-row-reverse' : ''}`}>
                
                {/* Content */}
                <div className={`${!isEven ? 'lg:order-2' : ''} space-y-6`}>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: `${service.color}15` }}>
                    <Icon className="w-4 h-4" style={{ color: service.color }} />
                    <span className="text-sm font-semibold" style={{ color: service.color }}>{service.tagline}</span>
                  </div>
                  
                  <h2 className="section-title text-gray-900 leading-tight">
                    {service.title}
                    <div className="w-16 h-1 mt-2 rounded-full" style={{ backgroundColor: service.color }} />
                  </h2>
                  
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                    {service.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 group">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: `${service.color}15` }}>
                          <CheckCircle2 className="w-3.5 h-3.5" style={{ color: service.color }} />
                        </div>
                        <span className="text-gray-700 text-sm group-hover:text-gray-900 transition-colors">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-6 pt-6">
                    <div className="flex items-center gap-3 px-4 py-2 rounded-xl" style={{ backgroundColor: `${service.color}10` }}>
                      <service.stats.icon className="w-5 h-5" style={{ color: service.color }} />
                      <div>
                        <div className="text-xl font-bold" style={{ color: service.color }}>{service.stats.value}</div>
                        <div className="text-xs text-gray-500">{service.stats.label}</div>
                      </div>
                    </div>
                    <Link 
                      href={service.ctaHref}
                      className="inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group"
                      style={{ backgroundColor: service.color, color: 'white' }}
                    >
                      {service.cta}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
                
                {/* Visual Card */}
                <div className={`relative ${!isEven ? 'lg:order-1' : ''}`}>
                  <div className="relative group">
                    <div className="absolute -top-8 -left-8 w-40 h-40 rounded-full opacity-20 blur-3xl animate-pulse" style={{ backgroundColor: service.color }} />
                    <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full opacity-20 blur-3xl animate-pulse delay-700" style={{ backgroundColor: service.color }} />
                    
                    <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
                      <div className="h-2" style={{ backgroundColor: service.color }} />
                      <div className="p-8 text-center">
                        <div className="relative">
                          <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: service.color }} />
                          <div className="w-28 h-28 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 relative" style={{ backgroundColor: `${service.color}10` }}>
                            <Icon className="w-14 h-14" style={{ color: service.color }} />
                          </div>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                        <p className="text-gray-500 text-sm mb-6">{service.description.substring(0, 120)}...</p>
                        
                        <div className="flex flex-wrap justify-center gap-2 mb-6">
                          {service.features.slice(0, 3).map((feature, i) => (
                            <span key={i} className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ backgroundColor: `${service.color}10`, color: service.color }}>
                              {feature.length > 25 ? feature.substring(0, 25) + '...' : feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </section>
        );
      })}

      {/* 🔹 Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-br from-[#005E60] to-[#003537] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F8C21C] rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-4">
              <Heart className="w-4 h-4 text-[#F8C21C]" />
              <span className="text-sm font-medium">Why Choose Us</span>
            </div>
            <h2 className="section-title">The Associatte Advantage</h2>
            <p className="text-white/80 mt-3 max-w-2xl mx-auto">Setting new standards in real estate services</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {WHY_CHOOSE.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="text-center group">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Icon className="w-10 h-10" style={{ color: BRAND.yellow }} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-white/70 text-sm">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 🔹 CTA Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#8B0000] to-[#6b0000]" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6 animate-pulse">
            <Zap className="w-4 h-4 text-[#F8C21C]" />
            <span className="text-sm font-medium">Limited Time Offer</span>
          </div>
          <h2 className="section-title text-white mb-4">
            Ready to Start Your Property Journey?
          </h2>
          <p className="text-white/90 mb-8 text-lg">
            Get a free consultation with our experts. No obligation, just honest advice.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/contact-us"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#F8C21C] text-[#8B0000] font-semibold rounded-xl hover:bg-[#e6b010] transition-all duration-300 hover:scale-105 shadow-lg group"
            >
              Book Free Consultation
              <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </Link>
            <a 
              href="tel:+918881188181"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:scale-105"
            >
              <Phone className="w-5 h-5" />
              Call: +91 8881188181
            </a>
          </div>
          <p className="text-white/50 text-sm mt-6">*Free consultation available for limited period</p>
        </div>
      </section>

      {/* 🔹 FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#005E60]/10 rounded-full mb-4">
              <Globe className="w-4 h-4 text-[#005E60]" />
              <span className="text-sm font-semibold text-[#005E60]">FAQ</span>
            </div>
            <h2 className="section-title text-gray-900">Frequently Asked Questions</h2>
            <p className="text-gray-500 mt-3">Everything you need to know about our services</p>
          </div>
          
          <div className="space-y-4">
            {[
              { q: 'Is the property consultation free?', a: 'Yes! Our initial consultation is completely free with no obligation. We believe in providing value first and building long-term relationships with our clients.' },
              { q: 'Which banks do you partner with for home loans?', a: 'We partner with 15+ leading banks & NBFCs including SBI, HDFC, ICICI, Axis, Kotak Mahindra, Bajaj Finance, LIC Housing Finance, and many more.' },
              { q: 'Do you handle legal work for properties outside Pune/Mumbai?', a: 'Yes, we provide legal assistance across Maharashtra with empanelled local experts in every major city including Nashik, Nagpur, Aurangabad, and Kolhapur.' },
              { q: 'What is your property management fee?', a: 'Our management fee ranges from 5-8% of monthly rent, depending on services selected. We offer customized packages for single property and portfolio owners.' },
              { q: 'How do I get started with investment advisory?', a: 'Simply fill out our contact form or call us directly. Our investment advisor will schedule a free consultation to understand your financial goals and risk appetite.' },
            ].map((faq, i) => (
              <details key={i} className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                <summary className="font-semibold text-gray-900 flex items-center justify-between p-5 cursor-pointer list-none">
                  <span className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-[#005E60]/10 flex items-center justify-center text-sm text-[#005E60] font-bold">{i + 1}</span>
                    {faq.q}
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform duration-300" />
                </summary>
                <p className="px-5 pb-5 text-gray-600 border-t border-gray-100 pt-3 ml-10">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animate-bounce-in {
          animation: bounceIn 0.6s ease-out;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
      `}</style>
    </main>
  );
}