// client/components/builder-page/BuilderProjects.tsx
'use client';

import ProjectCard from './ProjectCard';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface BuilderProjectsProps {
  slug: string;
  projects: any[];
}

export default function BuilderProjects({ slug, projects }: BuilderProjectsProps) {
  if (!projects?.length) return null;

  // Show first 6 projects, hide rest behind "View More"
  const displayProjects = projects.slice(0, 6);
  const hasMore = projects.length > 6;

  // 🔗 CORRECT ROUTE: Filter your existing /properties page by builder
  // If your page uses query params: /properties?builder=mantra
  // If your page uses path: /properties/developer/mantra
  const viewMoreUrl = `/properties?builder=${slug}`;

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {projects.length} Project{projects.length > 1 ? 's' : ''} Available
          </h2>
          {hasMore && (
            <Link 
              href={viewMoreUrl}
              className="hidden sm:flex items-center gap-2 text-[#005E60] font-semibold hover:underline"
            >
              View All Projects <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProjects.map((project) => (
            <ProjectCard key={project.slug || project.id} project={project} />
          ))}
        </div>

        {/* View More Button (Mobile/Desktop) */}
        {hasMore && (
          <div className="mt-10 text-center">
            <Link 
              href={viewMoreUrl}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#005E60] text-white font-semibold rounded-xl hover:bg-[#004a4d] transition-colors shadow-lg shadow-[#005E60]/20"
            >
              View All {projects.length} Projects <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="mt-3 text-sm text-gray-500">
              Click to see all projects from this builder on our main listings page
            </p>
          </div>
        )}
        
      </div>
    </section>
  );
}