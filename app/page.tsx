'use client';

import React from 'react';
import Hero from '../components/Home/Hero';
import Advantages from '../components/Home/Advantages';
import PropertyCarousel from '../components/Home/PropertyCarousel';
import { Property } from '../components/Home/PropertyCard';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import TopDevelopersCarousel from '@/components/sections/TopDevelopersCarousel';
import AwardsSection from '@/components/sections/AwardsSection';
import BlogSection from '@/components/sections/BlogSection';
import PropertyTypesSection from '@/components/sections/PropertyTypesSection';

const sampleProperties: Property[] = [
  {
    name: "Godrej Varanya",
    builder: "Godrej Properties",
    location: "Kharghar",
    priceMin: "2.46",
    priceMax: "4.66",
    sizeMin: "725",
    sizeMax: "1211",
    launchDate: "Dec 2030",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    configs: [
      { type: "2BHK", sqft: "725", price: "2.46" },
      { type: "2BHK", sqft: "775", price: "2.62" }
    ]
  },
  {
    name: "Raymond The Address",
    builder: "Raymond Realty",
    location: "Wadala East",
    priceMin: "2.36",
    priceMax: "4.48",
    sizeMin: "696",
    sizeMax: "1315",
    launchDate: "Dec 2030",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    configs: [
      { type: "2BHK", sqft: "696", price: "2.36" },
      { type: "2BHK", sqft: "704", price: "2.40" }
    ]
  },
  {
    name: "Purva Estrella",
    builder: "Puravankara Group",
    location: "Andheri West",
    priceMin: "3.60",
    priceMax: "7.86",
    sizeMin: "750",
    sizeMax: "1638",
    launchDate: "Jul 2032",
    image: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&q=80",
    configs: [
      { type: "2BHK", sqft: "750", price: "3.60" },
      { type: "2BHK", sqft: "795", price: "3.81" }
    ]
  }
];

export default function HomePage() {
  const carousel = useSelector((state: RootState) => state.carousel);
  console.log('✅ Redux connected:', carousel);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Spacer to prevent content overlap with absolutely positioned search */}
      <div className="h-64 md:h-80 lg:h-96"></div>

      {/* Featured Properties Carousel */}
      <PropertyCarousel 
        properties={sampleProperties} 
        onViewMore={() => console.log('View more clicked')} 
      />

    

      {/* Advantages Section */}
     <TopDevelopersCarousel/>
       {/* How It Works Section */}

<PropertyTypesSection/>



     <section><AwardsSection/></section>
     {/* <AwardsSection/> */}
     <BlogSection/>
    </main>
  );
}