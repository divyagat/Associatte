'use client';

import { Building2, Map, Home, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import Reveal from '@/components/common/Reveal';

interface CategorySectionProps {
  city?: 'Pune' | 'Mumbai' | 'KDMC';
  featuredLocalities?: readonly string[];
}

const categories = [
  { type: 'residential', title: 'Apartments', image: '/Explore By Category/Apartments.webp', icon: Building2 },
  { type: 'plots', title: 'Plots & Land', image: '/Explore By Category/PlotLand.webp', icon: Map },
  { type: 'ready', title: 'Ready To Move', image: '/Explore By Category/ReadytoMoveIn.webp', icon: Home },
  { type: 'pre-launch', title: 'Investment Projects', image: '/Explore By Category/Investment.webp', icon: TrendingUp },
];

export default function CategorySection({ city, featuredLocalities }: CategorySectionProps) {
  const searchParams = useSearchParams();
  const currentLocation = searchParams.get('location') || '';
  const currentBuilder = searchParams.get('builder') || '';
  const currentBhk = searchParams.get('bhk') || '';

  const buildCategoryLink = (type: string) => {
    const params = new URLSearchParams();
    params.set('type', type);
    if (currentLocation) params.set('location', currentLocation);
    if (currentBuilder) params.set('builder', currentBuilder);
    if (currentBhk) params.set('bhk', currentBhk);
    return `/properties?${params.toString()}`;
  };

  return (
    <section className="pt-6 md:pt-8 pb-10 md:pb-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="section-title text-gray-900">
            Explore by Category {city && `in ${city}`}
          </h2>
          <div className="w-16 h-1 bg-[#8B0000] mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Reveal
              key={category.type}
              delay={index * 100}
              className="group cursor-pointer"
            >
              <Link href={buildCategoryLink(category.type)}>
                <div className="relative overflow-hidden rounded-lg shadow-lg h-56 sm:h-64">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#8B0000] flex items-center justify-center shadow-lg">
                      <category.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    <h3 className="text-white font-bold text-base sm:text-lg">{category.title}</h3>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}