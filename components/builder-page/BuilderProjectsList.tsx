'use client';

import BuilderProjectCard from './BuilderProjectCard';
import HelpSidebar from './HelpSidebar';

type Property = {
  slug: string;
  name: string;
  location: string;
  price: string;
  image: string;
  fullLocation: { area: string; city: string; state: string; pincode: string; landmark: string };
  priceDetails: { range: string; perSqft: string; configurations: Array<{ type: string; area: string; price: string; description: string }> };
  developer: { name: string; established: string; projectsCount: number; description: string };
  about: string;
  amenities: string[];
  floorPlans: Array<{ type: string; area: string; image: string; downloadUrl: string }>;
  possessionDate: string;
  reraNumber: string;
  gallery: string[];
  mapCoords: { lat: number; lng: number };
  nearbyPlaces: Array<{ type: string; name: string; distance: string }>;
  emi: { startingFrom: string; downPayment: string; interestRate: string; tenure: string };
};

export default function BuilderProjectsList({ 
  initialSlug, 
  initialProjects 
}: { 
  initialSlug: string; 
  initialProjects: Property[] 
}) {
  const builderName = initialProjects[0]?.developer.name || initialSlug;
  const locationDisplay = initialSlug === 'pune' ? 'Pune' : initialSlug === 'mumbai' ? 'Mumbai' : initialSlug === 'kdmc' ? 'Kalyan-Dombivli' : initialSlug;
  
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-[#F8C21C] text-[#8B0000] px-3 py-1 rounded text-sm font-bold">
              {initialProjects.length} Properties
            </span>
            <span className="bg-[#005E60] text-white px-3 py-1 rounded text-sm font-semibold">
              {locationDisplay}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 capitalize mb-1">
            {builderName} Projects
          </h1>
          <p className="text-gray-600">
            Find your dream home in {locationDisplay}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            {initialProjects.map((project) => (
              <BuilderProjectCard key={project.slug} project={project} />
            ))}
          </div>

          <div className="lg:w-80">
            <HelpSidebar />
          </div>
        </div>
      </div>
    </main>
  );
}