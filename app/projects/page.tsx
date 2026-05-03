// app/projects/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Project Portfolio | Case Studies & Completed Work',
  description: 'Explore our portfolio of residential, commercial, and infrastructure projects. View timelines, specifications, and outcomes.',
  openGraph: {
    title: 'Project Portfolio',
    description: 'Browse completed and ongoing construction projects with detailed case studies.',
    type: 'website',
  },
};

// Types
export type ProjectStatus = 'Completed' | 'In Progress' | 'Planning';
export type ProjectCategory = 'Residential' | 'Commercial' | 'Infrastructure' | 'Renovation';

export interface Project {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  location: string;
  year: number;
  imageUrl: string;
  tags: string[];
  client?: string;
}

// Simulated data fetcher (replace with Prisma/Drizzle/REST/GraphQL)
async function getProjects(): Promise<Project[]> {
  // Example: const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, { cache: 'force-cache' });
  // return res.json();

  await new Promise((resolve) => setTimeout(resolve, 400)); // Simulate network delay

  return [
    {
      id: 'p1',
      title: 'Skyline Tower Complex',
      description: 'A 30-story mixed-use development featuring sustainable design, smart building integration, and premium commercial spaces.',
      category: 'Commercial',
      status: 'Completed',
      location: 'Chicago, IL',
      year: 2024,
      imageUrl: 'https://placehold.co/800x500/e2e8f0/475569?text=Skyline+Tower',
      tags: ['High-rise', 'LEED Certified', 'Mixed-Use'],
      client: 'Metro Development Group',
    },
    {
      id: 'p2',
      title: 'Lakeside Family Residence',
      description: 'Custom luxury home designed for energy efficiency, featuring open-concept living, smart home automation, and natural stone finishes.',
      category: 'Residential',
      status: 'Completed',
      location: 'Austin, TX',
      year: 2025,
      imageUrl: 'https://placehold.co/800x500/e2e8f0/475569?text=Lakeside+Home',
      tags: ['Custom Build', 'Net-Zero', 'Luxury'],
    },
    {
      id: 'p3',
      title: 'Downtown Transit Hub',
      description: 'Modernization of regional transit infrastructure with expanded platforms, accessibility upgrades, and solar canopy roofing.',
      category: 'Infrastructure',
      status: 'In Progress',
      location: 'Seattle, WA',
      year: 2026,
      imageUrl: 'https://placehold.co/800x500/e2e8f0/475569?text=Transit+Hub',
      tags: ['Public Works', 'Accessibility', 'Solar'],
    },
    {
      id: 'p4',
      title: 'Heritage Loft Conversion',
      description: 'Adaptive reuse of a 1920s warehouse into modern loft apartments while preserving original brickwork and timber beams.',
      category: 'Renovation',
      status: 'Planning',
      location: 'Brooklyn, NY',
      year: 2024,
      imageUrl: 'https://placehold.co/800x500/e2e8f0/475569?text=Heritage+Lofts',
      tags: ['Historic Preservation', 'Adaptive Reuse'],
      client: 'Urban Revival LLC',
    },
  ];
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Project Portfolio
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Browse our latest work across residential, commercial, and specialized builds.
          </p>
        </header>

        {/* Filters & Search Placeholder */}
        <div className="mb-8 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search projects by title, location, or tag..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
          <select className="px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
            <option value="">All Categories</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Renovation">Renovation</option>
          </select>
          <select className="px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
            <option value="">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Planning">Planning</option>
          </select>
        </div>

        {/* Project Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No projects found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

// Reusable Project Card Component
function ProjectCard({ project }: { project: Project }) {
  const statusStyles: Record<ProjectStatus, string> = {
    Completed: 'bg-green-100 text-green-700 border-green-200',
    'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
    Planning: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  return (
    <article className="group bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-200 overflow-hidden transition-all duration-300">
      <div className="relative h-56 bg-gray-200">
        <Image
          src={project.imageUrl}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span
          className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold rounded-full border ${statusStyles[project.status]}`}
        >
          {project.status}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
            {project.category}
          </span>
          <span className="text-xs text-gray-400">• {project.year}</span>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {project.title}
        </h3>
        <p className="mt-1 text-gray-500 text-sm line-clamp-2">{project.description}</p>

        {project.client && (
          <p className="mt-2 text-xs text-gray-400">Client: {project.client}</p>
        )}

        <div className="flex flex-wrap gap-1.5 mt-3">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500">📍 {project.location}</span>
          <Link
            href={`/projects/${project.id}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
          >
            View Details →
          </Link>
        </div>
      </div>
    </article>
  );
}