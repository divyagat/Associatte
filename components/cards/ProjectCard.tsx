// components/cards/ProjectCard.tsx
import Image from 'next/image';
import { MapPin, Bed, Bath, Square } from 'lucide-react';

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    builder: string;
    location: string;
    city: string;
    price: string;
    startingPrice: number;
    image: string;
    images: string[];
    bhk: string[];
    area: string;
    status: 'under-construction' | 'ready' | 'pre-launch';
    slug: string;
    type: 'buy' | 'rent' | 'commercial'; // Filter by tab
  };
  variant?: 'default' | 'compact' | 'featured';
}

export default function ProjectCard({ project, variant = 'default' }: ProjectCardProps) {
  const isCompact = variant === 'compact';
  
  return (
    <article className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 ${
      isCompact ? 'flex flex-row' : 'flex flex-col'
    }`}>
      {/* Image Section */}
      <div className={`relative ${isCompact ? 'w-48 h-32 flex-shrink-0' : 'aspect-[4/3]'}`}>
        <Image
          src={project.image}
          alt={project.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes={isCompact ? "(max-width: 768px) 192px, 192px" : "(max-width: 768px) 100vw, 400px"}
        />
        {/* Status Badge */}
        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${
          project.status === 'ready' ? 'bg-green-500 text-white' :
          project.status === 'under-construction' ? 'bg-amber-500 text-white' :
          'bg-purple-500 text-white'
        }`}>
          {project.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </span>
      </div>

      {/* Content Section */}
      <div className={`p-4 ${isCompact ? 'flex-1' : ''}`}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-purple-600 transition-colors">
            {project.name}
          </h3>
        </div>
        
        <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          {project.location}, {project.city}
        </p>

        {/* Specs */}
        <div className="flex flex-wrap gap-3 mb-4 text-xs text-gray-600">
          {project.bhk.map((unit) => (
            <span key={unit} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
              <Bed className="w-3 h-3" /> {unit} BHK
            </span>
          ))}
          <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
            <Square className="w-3 h-3" /> {project.area}
          </span>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-purple-600">{project.price}</p>
            <p className="text-xs text-gray-400">Starting from</p>
          </div>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors">
            View Details
          </button>
        </div>
      </div>
    </article>
  );
}