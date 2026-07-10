// client/components/builder-page/BuilderProjectsList.tsx
'use client';

import { Suspense } from 'react';
import BuilderProjects from './BuilderProjects';

interface BuilderProjectsListProps {
  initialSlug: string;
  initialProjects?: any[];
}

// ✅ Renamed to Content component
function BuilderProjectsListContent({ 
  initialSlug, 
  initialProjects = [] 
}: BuilderProjectsListProps) {
  
  const projects = Array.isArray(initialProjects) ? initialProjects : [];
  
  if (projects.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-lg mb-4">No projects found.</p>
        <a href="/builders" className="text-[#005E60] hover:underline">← Back to builders</a>
      </div>
    );
  }
  
  // ✅ Just show the projects - BuilderHeader already handles the hero section
  return <BuilderProjects slug={initialSlug} projects={projects} />;
}

// ✅ Default export wraps in Suspense to handle useSearchParams()
export default function BuilderProjectsList(props: BuilderProjectsListProps) {
  return (
    <Suspense 
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#005E60]"></div>
          <p className="text-gray-500 text-lg mt-4">Loading projects...</p>
        </div>
      }
    >
      <BuilderProjectsListContent {...props} />
    </Suspense>
  );
}