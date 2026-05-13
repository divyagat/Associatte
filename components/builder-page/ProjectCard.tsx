// client/components/builder-page/ProjectCard.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Home } from 'lucide-react';

interface ProjectCardProps {
  project: {
    slug: string;
    name: string;
    price: string;
    image: string;
    fullLocation?: { area: string };
    location: string;
    [key: string]: any;
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  // ✅ Defensive: prevent undefined errors
  if (!project?.slug || !project?.name) {
    console.warn('ProjectCard: Missing required project data', project);
    return null;
  }

  // 🔗 Link to your existing property detail page
  const projectRoute = `/property/${project.slug}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Link 
        href={projectRoute}
        className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-[#005E60]/30 transition-all duration-300"
      >
        {/* Image + Price Badge */}
        <div className="relative h-44 bg-gray-100">
          <img 
            src={project.image || '/projects/placeholder.jpg'} 
            alt={project.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => (e.target as HTMLImageElement).src = '/projects/placeholder.jpg'}
          />
          <span className="absolute bottom-3 left-3 px-3 py-1.5 bg-[#005E60] text-white text-sm font-bold rounded-lg shadow-sm">
            {project.price}
          </span>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-[#8B0000] transition-colors">
            {project.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-[#005E60]" />
            <span>{project.fullLocation?.area || project.location}</span>
          </div>
          
          {/* Subtle hover indicator */}
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-sm">
            <span className="text-gray-500">View Details</span>
            <Home className="w-4 h-4 text-[#005E60] opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-4px] group-hover:translate-x-0" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}