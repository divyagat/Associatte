import React from 'react';
import Image from 'next/image';
import { Heart, Play, Video } from 'lucide-react';

export interface PropertyConfig {
  type: string;
  sqft: string;
  price: string;
}

export interface Property {
  name: string;
  builder: string;
  location: string;
  priceMin: string;
  priceMax: string;
  sizeMin: string;
  sizeMax: string;
  launchDate: string;
  image: string;
  configs: PropertyConfig[];
}

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <div className="min-w-[320px] w-[320px] bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 snap-center">
      {/* Image Section */}
      <div className="relative h-48 bg-gradient-to-br from-[#ECF1F8] to-gray-200">
        <Image
          src={property.image}
          alt={property.name}
          fill
          sizes="320px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/10" />
        
        {/* Overlay Icons */}
        <button className="absolute top-3 right-3 bg-white/80 p-1.5 rounded-full hover:bg-white transition">
          <Heart size={16} className="text-[#8B0000]" />
        </button>
        <div className="absolute bottom-3 right-3 flex gap-2">
          <button className="bg-white/90 p-1.5 rounded-full hover:bg-white transition">
            <Video size={14} className="text-[#005E60]" />
          </button>
          <button className="bg-[#005E60] p-1.5 rounded-full hover:bg-[#004d4f] transition">
            <Play size={14} className="text-white" />
          </button>
        </div>
        
        {/* Watermark */}
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/30 font-bold text-xl tracking-widest pointer-events-none select-none">
          Housiey.com
        </span>
      </div>

      {/* Details Section */}
      <div className="p-4">
        <h3 className="font-bold text-[#005E60] text-lg">{property.name}</h3>
        <p className="text-xs text-gray-500 mt-1">by <span className="text-[#005E60] underline">{property.builder}</span></p>
        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
          📍 {property.location}
        </p>

        {/* Price & Meta */}
        <div className="flex justify-between items-center mt-3">
          <p className="text-[#005E60] font-bold text-lg">
            ₹{property.priceMin} Cr - {property.priceMax} Cr
            <span className="text-xs font-normal text-gray-500 ml-1">(All inc)</span>
          </p>
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>📐 {property.sizeMin} - {property.sizeMax} sqft</span>
          <span className="bg-[#F8C21C]/20 text-[#8B0000] px-2 py-0.5 rounded font-medium">
            📅 {property.launchDate}
          </span>
        </div>

        {/* Configuration Table */}
        <div className="mt-3 bg-[#ECF1F8] rounded-lg p-2 text-xs">
          {property.configs.map((cfg, idx) => (
            <div key={idx} className="flex justify-between py-1 border-b border-gray-200 last:border-0">
              <span className="font-medium text-[#005E60]">{cfg.type}</span>
              <span className="text-gray-600">{cfg.sqft} sqft</span>
              <span className="font-semibold text-[#005E60]">₹{cfg.price} Cr</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button className="flex-1 bg-[#005E60] text-white py-2 rounded-md text-sm font-medium hover:bg-[#004d4f] transition flex items-center justify-center gap-1">
            ️ Tour
          </button>
          <button className="flex-1 bg-[#8B0000] text-white py-2 rounded-md text-sm font-medium hover:bg-[#6b0000] transition flex items-center justify-center gap-1">
            💬 Live Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;