// @/components/sections/ServicesSection.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Handshake, FileText, Scale, ClipboardList, TrendingUp,
  ArrowRight 
} from 'lucide-react';

// 🎨 Associatte Brand Colors
const BRAND = {
  green: '#005E60',
  red: '#8B0000',
  yellow: '#F8C21C',
};

// 🔹 Services mapped to /services page sections
const services = [
  {
    id: 'consultation',
    icon: Handshake,
    title: 'Property Consultation',
    shortDesc: 'Expert guidance to find your perfect property',
    color: BRAND.green,
    gradient: 'from-[#005E60] to-[#004a4d]',
    href: '/services#consultation',
  },
  {
    id: 'home-loans',
    icon: FileText,
    title: 'Home Loans',
    shortDesc: 'Best loan deals with minimal paperwork',
    color: BRAND.yellow,
    gradient: 'from-[#F8C21C] to-[#d4a017]',
    href: '/services#home-loans',
  },
  {
    id: 'legal',
    icon: Scale,
    title: 'Legal Assistance',
    shortDesc: 'Hassle-free transactions with legal experts',
    color: BRAND.red,
    gradient: 'from-[#8B0000] to-[#6a0000]',
    href: '/services#legal',
  },
  {
    id: 'management',
    icon: ClipboardList,
    title: 'Property Management',
    shortDesc: 'Professional management while you relax',
    color: BRAND.yellow,
    gradient: 'from-[#F8C21C] to-[#d4a017]',
    href: '/services#management',
  },
  {
    id: 'investment',
    icon: TrendingUp,
    title: 'Investment Advisory',
    shortDesc: 'Data-driven strategies for maximum ROI',
    color: BRAND.red,
    gradient: 'from-[#8B0000] to-[#6a0000]',
    href: '/services#investment',
  },
];

export default function ServicesSection() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 🔹 Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12 lg:mb-16"
        >
          <span className="inline-block px-3 py-1 bg-[#005E60]/10 text-[#005E60] text-sm font-semibold rounded-full mb-4">
            What We Offer
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            End-to-End Real Estate Services
          </h2>
          <p className="text-lg text-gray-600">
            From finding your dream home to managing investments, we provide comprehensive solutions across Pune, Mumbai & KDMC.
          </p>
        </motion.div>

        {/* 🔹 Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Link 
                  href={service.href}
                  className="group block h-full bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-[#005E60]/30 transition-all duration-300 overflow-hidden"
                >
                  {/* Gradient Top Border */}
                  <div className={`h-1 bg-gradient-to-r ${service.gradient}`} />
                  
                  <div className="p-5 lg:p-6 flex flex-col h-full">
                    {/* Icon */}
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 bg-gradient-to-br ${service.gradient}`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </motion.div>
                    
                    {/* Content */}
                    <div className="flex-1 text-center">
                      <h3 className="font-bold text-gray-900 group-hover:text-[#005E60] transition-colors mb-2 line-clamp-1">
                        {service.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {service.shortDesc}
                      </p>
                    </div>
                    
                    {/* CTA Arrow */}
                    <div className="mt-4 flex items-center justify-center gap-1 text-[#005E60] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Learn More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  
                  {/* Hover Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* 🔹 View All Services CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-10 lg:mt-12"
        >
          <Link 
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#005E60] text-white font-semibold rounded-xl hover:bg-[#004a4d] transition-colors shadow-lg shadow-[#005E60]/20"
          >
            View All Services <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-sm text-gray-500 mt-3">
            Or <a href="tel:+918668695995" className="text-[#005E60] hover:underline">call us</a> for a free consultation
          </p>
        </motion.div>
        
      </div>
    </section>
  );
}