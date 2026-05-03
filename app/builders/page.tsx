// app/builders/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Find Professional Builders | Builder Directory',
  description: 'Browse verified builders, contractors, and construction professionals. Filter by specialty, location, and rating.',
  openGraph: {
    title: 'Professional Builder Directory',
    description: 'Connect with top-rated builders for residential, commercial, and specialty projects.',
  },
};

// Types
export interface Builder {
  id: string;
  name: string;
  specialty: 'Residential' | 'Commercial' | 'Renovation' | 'Landscape' | 'Custom';
  location: string;
  rating: number;
  projectsCompleted: number;
  imageUrl: string;
  verified: boolean;
}

// Simulated data fetcher (replace with your DB/API call)
async function getBuilders(): Promise<Builder[]> {
  // Example: const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/builders`, { cache: 'no-store' });
  // const builders = await res.json();
  
  await new Promise((resolve) => setTimeout(resolve, 600)); // Simulate network delay
  
  return [
    {
      id: 'b1',
      name: 'Apex Construction Co.',
      specialty: 'Commercial',
      location: 'Austin, TX',
      rating: 4.9,
      projectsCompleted: 87,
      imageUrl: 'https://placehold.co/600x400/e2e8f0/475569?text=Apex+Construction',
      verified: true,
    },
    {
      id: 'b2',
      name: 'GreenLeaf Builders',
      specialty: 'Landscape',
      location: 'Portland, OR',
      rating: 4.7,
      projectsCompleted: 134,
      imageUrl: 'https://placehold.co/600x400/e2e8f0/475569?text=GreenLeaf+Builders',
      verified: true,
    },
    {
      id: 'b3',
      name: 'Modern Homes LLC',
      specialty: 'Residential',
      location: 'Denver, CO',
      rating: 4.5,
      projectsCompleted: 56,
      imageUrl: 'https://placehold.co/600x400/e2e8f0/475569?text=Modern+Homes',
      verified: false,
    },
    {
      id: 'b4',
      name: 'Heritage Renovations',
      specialty: 'Renovation',
      location: 'Boston, MA',
      rating: 4.8,
      projectsCompleted: 210,
      imageUrl: 'https://placehold.co/600x400/e2e8f0/475569?text=Heritage+Renovations',
      verified: true,
    },
  ];
}

export default async function BuildersPage() {
  const builders = await getBuilders();

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Find Professional Builders
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Connect with verified contractors for residential, commercial, and specialty projects.
          </p>
        </header>

        {/* Search/Filter Placeholder (Add client interactivity as needed) */}
        <div className="mb-8 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by name, specialty, or location..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
          <select className="px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
            <option value="">All Specialties</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Renovation">Renovation</option>
            <option value="Landscape">Landscape</option>
          </select>
        </div>

        {/* Builder Grid */}
        {builders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No builders found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {builders.map((builder) => (
              <BuilderCard key={builder.id} builder={builder} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

// Reusable Builder Card Component
function BuilderCard({ builder }: { builder: Builder }) {
  return (
    <article className="group bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 overflow-hidden transition-all duration-200">
      <div className="relative h-48 bg-gray-200">
        <Image
          src={builder.imageUrl}
          alt={builder.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {builder.verified && (
          <span className="absolute top-3 right-3 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
            ✓ Verified
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-900">{builder.name}</h3>
        <p className="text-blue-600 font-medium mt-1">{builder.specialty}</p>
        <p className="text-gray-500 text-sm mt-1">📍 {builder.location}</p>

        <div className="flex items-center mt-3 gap-2">
          <span className="text-yellow-400" aria-label="Rating stars">★★★★★</span>
          <span className="text-gray-700 font-medium">{builder.rating}</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-500">{builder.projectsCompleted} projects</span>
        </div>

        <Link
          href={`/builders/${builder.id}`}
          className="mt-5 inline-flex w-full justify-center items-center px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          View Profile
        </Link>
      </div>
    </article>
  );
}