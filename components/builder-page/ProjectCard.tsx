'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Home, ArrowRight } from 'lucide-react';

interface Project {
  slug: string;
  name: string;
  location: string;
  price: string;
  image: string;
  developer?: { name: string };
  bhk?: string[];
  [key: string]: any;
}

interface BuilderProjectCardProps {
  project: Project;
}

export default function BuilderProjectCard({ project }: BuilderProjectCardProps) {
  // ✅ Defensive: handle missing required fields
  if (!project?.slug || !project?.name) {
    console.warn('BuilderProjectCard: Missing required props', project);
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link
        href={`/properties/${project.slug}`}
        className="block bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl overflow-hidden"
      >
        {/* Image */}
        <div className="relative h-48 bg-gray-100">
          <img
            src={project.image || '/projects/placeholder.jpg'}
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={e => (e.target as HTMLImageElement).src = '/projects/placeholder.jpg'}
          />
          {/* Price Badge */}
          <span className="absolute bottom-3 left-3 px-3 py-1 bg-[#005E60] text-white text-sm font-semibold rounded-lg">
            {project.price}
          </span>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#8B0000] transition-colors line-clamp-1">
            {project.name}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-3">
            <MapPin className="w-4 h-4 text-[#005E60]" />
            <span className="capitalize">{project.location}</span>
          </div>

          {/* BHK Tags - ✅ FIXED: Add null check */}
          {project.bhk && project.bhk.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.bhk.slice(0, 3).map((type: string) => (
                <span key={type} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium">
                  {type}
                </span>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <span className="text-sm text-[#005E60] font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
              View Details <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}