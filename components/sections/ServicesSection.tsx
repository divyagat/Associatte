// @/components/sections/ServicesSection.tsx
'use client';

import { motion } from 'framer-motion';
import { Home, TrendingUp, Building2, Shield, MapPin } from 'lucide-react';

const services = [
  {
    icon: Home,
    title: 'Property Buying Assistance',
  },
  {
    icon: TrendingUp,
    title: 'Investment Advisory',
  },
  {
    icon: Building2,
    title: 'Home Loan Assistance',
  },
  {
    icon: Shield,
    title: 'Legal & Documentation',
  },
  {
    icon: MapPin,
    title: 'Free Site Visit Planning',
  },
];

export default function ServicesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Our Services</h2>
          <div className="w-16 h-1 bg-red-800 mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="border-2 border-gray-100 rounded-lg p-6 text-center hover:border-teal-800 hover:shadow-lg transition-all group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-800 transition-colors">
                <service.icon className="w-8 h-8 text-yellow-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-medium text-gray-900">{service.title}</h3>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button className="bg-teal-800 text-white px-8 py-3 rounded-md font-semibold hover:bg-teal-900 transition-colors">
            Book Free Consultation
          </button>
        </div>
      </div>
    </section>
  );
}