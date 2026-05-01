// @/components/sections/TestimonialsAchievementsSection.tsx
'use client';

import { motion } from 'framer-motion';
import { Star, Trophy, Award, Users } from 'lucide-react';

const testimonials = [
  {
    name: 'Rohan Mehta',
    location: 'Pune',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    text: 'Associatte made my home buying journey so smooth. Highly professional team!',
    rating: 5,
  },
  {
    name: 'Sneha Kulkarni',
    location: 'Mumbai',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    text: 'Excellent support from site visit to possession. Truly recommended!',
    rating: 5,
  },
  {
    name: 'Amit Sharma',
    location: 'Pune',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    text: 'Got the best deal possible with their expert guidance.',
    rating: 5,
  },
];

const achievements = [
  {
    icon: Trophy,
    title: 'Top Channel Partner 2024',
  },
  {
    icon: Award,
    title: 'Excellence in Real Estate Consulting',
  },
  {
    icon: Users,
    title: '5000+ Families Served',
  },
];

export default function TestimonialsAchievementsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Testimonials */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              What Our Clients Say
            </h2>
            <div className="space-y-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                          <p className="text-sm text-gray-600">{testimonial.location}</p>
                        </div>
                        <div className="flex gap-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">"{testimonial.text}"</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Our Achievements
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6"
                >
                  <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
                    <achievement.icon className="w-10 h-10 text-yellow-600" />
                  </div>
                  <h3 className="font-bold text-gray-900">{achievement.title}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}