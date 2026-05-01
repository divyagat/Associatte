// @/components/sections/TrustFeaturesSection.tsx
'use client';

import { motion } from 'framer-motion';
import { Shield, Users, Headphones, Handshake } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Verified Projects Only',
    description: 'Every project is builder-verified and legally checked.',
    color: 'bg-red-800',
  },
  {
    icon: Users,
    title: 'Expert Property Advisors',
    description: 'Dedicated relationship manager for every client.',
    color: 'bg-teal-800',
  },
  {
    icon: Headphones,
    title: 'Zero Brokerage Support',
    description: 'We help you get the best builder deals & offers.',
    color: 'bg-yellow-600',
  },
  {
    icon: Handshake,
    title: 'End-to-End Assistance',
    description: 'Site visit → Negotiation → Loan → Registration.',
    color: 'bg-red-800',
  },
];

export default function TrustFeaturesSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 text-center lg:text-left mb-8">
              Why Homebuyers Trust Associatte
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6"
                >
                  <div className={`w-16 h-16 rounded-full ${feature.color} flex items-center justify-center mx-auto mb-4`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
              alt="Luxury Interior"
              className="rounded-lg shadow-xl"
            />
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
              <button className="bg-teal-800 text-white px-6 py-3 rounded-md font-medium hover:bg-teal-900 transition-colors shadow-lg">
                Talk to an Expert
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}