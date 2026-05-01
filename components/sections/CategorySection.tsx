// @/components/sections/CategorySection.tsx
'use client';

import { motion } from 'framer-motion';
import { Building2, Map, Home, TrendingUp } from 'lucide-react';

const categories = [
  {
    title: 'Apartments in Pune',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80',
    icon: Building2,
  },
  {
    title: 'Plots & Land',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed18f3e?w=400&q=80',
    icon: Map,
  },
  {
    title: 'Second Homes',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&q=80',
    icon: Home,
  },
  {
    title: 'Investment Projects',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80',
    icon: TrendingUp,
  },
];

export default function CategorySection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Explore by Category</h2>
          <div className="w-16 h-1 bg-red-800 mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-lg shadow-lg h-64">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-14 h-14 rounded-full bg-red-800 flex items-center justify-center shadow-lg">
                    <category.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <h3 className="text-white font-bold text-lg">{category.title}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button className="bg-yellow-500 text-gray-900 px-8 py-3 rounded-md font-semibold hover:bg-yellow-600 transition-colors">
            View All Properties
          </button>
        </div>
      </div>
    </section>
  );
}