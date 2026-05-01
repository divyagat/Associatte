// @/components/sections/TopSellingProjects.tsx
'use client';

import { useState, useEffect } from 'react';
import { MapPin, Heart, ChevronRight, ChevronLeft, Star, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

interface Project {
  id: number;
  name: string;
  location: string;
  city: string;
  price: string;
  area: string;
  type: string;
  image: string;
  rating: number;
}

const cities = ['All', 'Mumbai', 'Pune', 'Bangalore', 'Chennai', 'Noida', 'Gurgaon', 'Hyderabad'];

const projects: Project[] = [
  {
    id: 1,
    name: 'Lodha Signet',
    location: 'Matunga, Mumbai',
    city: 'Mumbai',
    price: '1.95 Cr - 8.85 Cr',
    area: '300 to 1,415 SqFt',
    type: 'Commercial Offices',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
    rating: 5,
  },
  {
    id: 2,
    name: 'Piramal Avyan',
    location: 'Byculla, Mumbai',
    city: 'Mumbai',
    price: '5.95 Cr - 13.6 Cr',
    area: '1,080 to 2,850 SqFt',
    type: '3,4 BHK',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',
    rating: 5,
  },
  {
    id: 3,
    name: 'Lodha Malabar',
    location: 'Malabar Hill, Mumbai',
    city: 'Mumbai',
    price: 'Price On Request',
    area: 'Area On Request',
    type: '4,5 BHK',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
    rating: 5,
  },
  {
    id: 4,
    name: 'Godrej Woods',
    location: 'Kanakpura, Bangalore',
    city: 'Bangalore',
    price: '1.25 Cr - 2.85 Cr',
    area: '1,150 to 2,350 SqFt',
    type: '2,3 BHK',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
    rating: 5,
  },
  {
    id: 5,
    name: 'Oberoi Realty',
    location: 'Goregaon, Mumbai',
    city: 'Mumbai',
    price: '3.50 Cr - 7.20 Cr',
    area: '950 to 1,850 SqFt',
    type: '2,3 BHK',
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&q=80',
    rating: 5,
  },
  {
    id: 6,
    name: 'Runwal Gardens',
    location: 'Mulund, Mumbai',
    city: 'Mumbai',
    price: '1.80 Cr - 3.50 Cr',
    area: '720 to 1,450 SqFt',
    type: '2,3 BHK',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80',
    rating: 5,
  },
];

export default function TopSellingProjects() {
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const filteredProjects = selectedCity === 'All' 
    ? projects 
    : projects.filter(p => p.city === selectedCity);

  const maxSlide = Math.max(0, filteredProjects.length - 3);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const scrollLeft = () => setCurrentSlide(prev => Math.max(0, prev - 1));
  const scrollRight = () => setCurrentSlide(prev => Math.min(maxSlide, prev + 1));

  useEffect(() => {
    setCurrentSlide(0);
  }, [selectedCity]);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Top Selling <span className="text-[#005E60]">Recommended Projects</span>
          </h2>
          <p className="text-gray-600">Projects in high demand</p>
        </div>

        {/* City Filter */}
        <div className="flex justify-center gap-1.5 mb-10 flex-wrap">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                selectedCity === city
                  ? 'bg-[#005E60] text-white shadow-lg shadow-teal-500/30'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={scrollLeft}
            disabled={currentSlide === 0}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 ${
              currentSlide === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'
            }`}
          >
            <ChevronLeft size={20} className="text-gray-700" />
          </button>

          <button
            onClick={scrollRight}
            disabled={currentSlide >= maxSlide}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 ${
              currentSlide >= maxSlide ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'
            }`}
          >
            <ChevronRight size={20} className="text-gray-700" />
          </button>

          {/* Cards Container */}
          <div className="overflow-hidden">
            <motion.div 
              className="flex gap-4"
              animate={{ x: `-${currentSlide * (100 / 3 + 1.33)}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex-shrink-0 w-[calc(33.333%-10.67px)] bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 group"
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    {/* Rating */}
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-white/95 backdrop-blur rounded-full">
                      <Star size={12} className="fill-[#F8C21C] text-[#F8C21C]" />
                      <span className="text-xs font-bold text-gray-900">{project.rating}.0</span>
                    </div>

                    {/* Favorite */}
                    <button
                      onClick={() => toggleFavorite(project.id)}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/95 backdrop-blur rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <Heart 
                        size={14} 
                        className={`transition-colors ${
                          favorites.includes(project.id) ? 'fill-[#8B0000] text-[#8B0000]' : 'text-gray-600'
                        }`} 
                      />
                    </button>

                    {/* Price */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="bg-[#F8C21C] px-3 py-1.5 rounded-md">
                        <p className="text-gray-900 font-bold text-sm">{project.price}</p>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-base font-bold text-gray-900 mb-1.5 group-hover:text-[#005E60] transition-colors line-clamp-1">
                      {project.name}
                    </h3>
                    
                    <div className="flex items-center gap-1.5 text-gray-600 mb-3">
                      <MapPin size={14} className="text-[#8B0000]" />
                      <span className="text-xs">{project.location}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-600 mb-4 pb-4 border-b border-gray-100">
                      <span className="line-clamp-1">{project.area}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span className="line-clamp-1">{project.type}</span>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 border border-gray-200 text-gray-700 rounded-lg text-xs font-semibold hover:border-[#005E60] hover:text-[#005E60] transition-colors">
                        View Details
                      </button>
                      <button className="flex-1 py-2 bg-[#005E60] text-white rounded-lg text-xs font-semibold hover:bg-[#004a4d] transition-colors flex items-center justify-center gap-1">
                        <Phone size={14} />
                        Call
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-1.5 mt-6">
            {Array.from({ length: maxSlide + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'w-6 bg-[#005E60]' : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}