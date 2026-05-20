'use client';

import { motion } from 'framer-motion';
import { Shield, Users, Headphones, Handshake, ArrowRight, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

// ✅ ADD city PROP
interface TrustFeaturesSectionProps {
  city: 'Pune' | 'Mumbai' | 'KDMC';
}

const FEATURES: Record<'Pune' | 'Mumbai' | 'KDMC', Array<{
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  iconColor: string;
}>> = {
  Pune: [
    { icon: Shield, title: 'Verified Projects Only', description: 'Every project is builder-verified and legally checked with RERA compliance.', color: 'from-[#8B0000] to-[#6b0000]', bgColor: 'bg-[#8B0000]/10', iconColor: 'text-[#8B0000]' },
    { icon: Users, title: 'Expert Property Advisors', description: 'Dedicated relationship manager with 10+ years market experience.', color: 'from-[#005E60] to-[#004a4d]', bgColor: 'bg-[#005E60]/10', iconColor: 'text-[#005E60]' },
    { icon: Headphones, title: 'Zero Brokerage Support', description: 'We help you get the best builder deals & exclusive offers.', color: 'from-[#F8C21C] to-[#e6b418]', bgColor: 'bg-[#F8C21C]/10', iconColor: 'text-[#F8C21C]' },
    { icon: Handshake, title: 'End-to-End Assistance', description: 'Site visit → Negotiation → Loan → Registration. We handle it all.', color: 'from-[#8B0000] to-[#6b0000]', bgColor: 'bg-[#8B0000]/10', iconColor: 'text-[#8B0000]' },
  ],
  Mumbai: [
    { icon: Shield, title: 'Verified Projects Only', description: 'Every project is builder-verified and legally checked with RERA compliance.', color: 'from-[#8B0000] to-[#6b0000]', bgColor: 'bg-[#8B0000]/10', iconColor: 'text-[#8B0000]' },
    { icon: Users, title: 'Expert Property Advisors', description: 'Dedicated relationship manager with 10+ years market experience.', color: 'from-[#005E60] to-[#004a4d]', bgColor: 'bg-[#005E60]/10', iconColor: 'text-[#005E60]' },
    { icon: Headphones, title: 'Zero Brokerage Support', description: 'We help you get the best builder deals & exclusive offers.', color: 'from-[#F8C21C] to-[#e6b418]', bgColor: 'bg-[#F8C21C]/10', iconColor: 'text-[#F8C21C]' },
    { icon: Handshake, title: 'End-to-End Assistance', description: 'Site visit → Negotiation → Loan → Registration. We handle it all.', color: 'from-[#8B0000] to-[#6b0000]', bgColor: 'bg-[#8B0000]/10', iconColor: 'text-[#8B0000]' },
  ],
  KDMC: [
    { icon: Shield, title: 'Verified Projects Only', description: 'Every project is builder-verified and legally checked with RERA compliance.', color: 'from-[#8B0000] to-[#6b0000]', bgColor: 'bg-[#8B0000]/10', iconColor: 'text-[#8B0000]' },
    { icon: Users, title: 'Expert Property Advisors', description: 'Dedicated relationship manager with 10+ years market experience.', color: 'from-[#005E60] to-[#004a4d]', bgColor: 'bg-[#005E60]/10', iconColor: 'text-[#005E60]' },
    { icon: Headphones, title: 'Zero Brokerage Support', description: 'We help you get the best builder deals & exclusive offers.', color: 'from-[#F8C21C] to-[#e6b418]', bgColor: 'bg-[#F8C21C]/10', iconColor: 'text-[#F8C21C]' },
    { icon: Handshake, title: 'End-to-End Assistance', description: 'Site visit → Negotiation → Loan → Registration. We handle it all.', color: 'from-[#8B0000] to-[#6b0000]', bgColor: 'bg-[#8B0000]/10', iconColor: 'text-[#8B0000]' },
  ],
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

// ✅ FIX: Use proper Framer Motion types with 'as const'
const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function TrustFeaturesSection({ city }: TrustFeaturesSectionProps) {
  const features = FEATURES[city];

  return (
    <section className="relative py-20 lg:py-28 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#005E60]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#F8C21C]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[#8B0000]/3 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="order-2 lg:order-1"
          >
            <div className="mb-10">
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#005E60]/10 text-[#005E60] text-sm font-semibold rounded-full mb-4"
              >
                <CheckCircle2 className="w-4 h-4" />
                Trusted by 5000+ Homebuyers
              </motion.span>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Why Homebuyers{' '}
                <span className="relative">
                  <span className="relative z-10 text-[#005E60]">Trust</span>
                  <span className="absolute bottom-2 left-0 w-full h-3 bg-[#F8C21C]/40 -z-0 rounded" />
                </span>{' '}
                Associatte
              </h2>
              
              <p className="mt-4 text-lg text-gray-600 leading-relaxed max-w-xl">
                We combine technology, expertise, and transparency to make your home buying journey seamless, secure, and stress-free.
              </p>
            </div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="group relative p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#005E60]/30 transition-all duration-300 cursor-default"
                >
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  <div className="relative flex items-start gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${feature.bgColor} ${feature.iconColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-base leading-tight group-hover:text-[#005E60] transition-colors">
                        {feature.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`absolute bottom-0 left-5 right-5 h-0.5 bg-gradient-to-r ${feature.color} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-10"
            >
              <button className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#005E60] to-[#004a4d] text-white font-semibold rounded-xl hover:from-[#004a4d] hover:to-[#003537] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#005E60]/25">
                <span>Get Free Consultation</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="mt-3 text-sm text-gray-500">
                ✓ No obligation &nbsp; • &nbsp; ✓ Response within 2 hours
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <div className="relative aspect-[4/5] lg:aspect-square">
                <Image
                  src="/Home/Trust associatte.webp"
                  alt="Luxury Interior - Happy Homebuyers"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-white/20"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#F8C21C] to-[#e6b418] rounded-xl flex items-center justify-center">
                    <Users className="w-7 h-7 text-[#8B0000]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">5,000+</div>
                    <div className="text-sm text-gray-600">Happy Homebuyers</div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-2xl font-bold text-[#005E60]">98%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
                className="absolute top-6 right-6"
              >
                <div className="flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-gray-100">
                  <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-gray-700">Live Support</span>
                </div>
              </motion.div>
            </div>

            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#F8C21C]/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#005E60]/20 rounded-full blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}