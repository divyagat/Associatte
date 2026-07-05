/* eslint-disable @next/next/no-img-element */
import { notFound } from 'next/navigation';
import { getProjectBySlug, getAllProperties } from '@/lib/data-store';
import { MapPin, Building2, Calendar, IndianRupee, Ruler, Sparkles, Phone, CheckCircle2, Navigation } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

// ✅ Helper function to normalize developer field
const normalizeDeveloper = (developer: any) => {
  if (!developer) return { name: 'Unknown Developer', established: '', projectsCount: 0, description: '' };
  if (typeof developer === 'string') {
    return { name: developer, established: '', projectsCount: 0, description: '' };
  }
  return {
    name: developer.name || 'Unknown Developer',
    established: developer.established || '',
    projectsCount: developer.projectsCount || 0,
    description: developer.description || ''
  };
};

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let project = await getProjectBySlug(slug);
  
  if (!project) {
    const properties = await getAllProperties();
    project = properties.find((p: any) => p.slug === slug) || null;
  }

  if (!project) notFound();

  // ✅ Normalize all fields
  const normalizedProject = {
    ...project,
    developer: normalizeDeveloper(project.developer),
    soldOut: project.soldOut || false,
    amenities: project.amenities || [],
    floorPlans: project.floorPlans || [],
    nearbyPlaces: project.nearbyPlaces || [],
    emi: project.emi || {},
    masterPlan: project.masterPlan || '',
    locationMap: project.locationMap || '',
    priceDetails: project.priceDetails || {
      range: '',
      perSqft: '',
      configurations: []
    }
  };

  const developerName = normalizedProject.developer.name;
  const priceRange = normalizedProject.priceDetails.range || normalizedProject.price || 'Price on Request';
  const location = normalizedProject.fullLocation?.area 
    ? `${normalizedProject.fullLocation.area}, ${normalizedProject.fullLocation.city || ''} ${normalizedProject.fullLocation.state || ''} ${normalizedProject.fullLocation.pincode || ''}`.trim()
    : normalizedProject.location || '';

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] bg-gray-900">
        {normalizedProject.image && (
          <img src={normalizedProject.image} alt={normalizedProject.name} className="w-full h-full object-cover opacity-80" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {normalizedProject.soldOut && (
          <div className="absolute top-6 right-6 bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-lg shadow-lg uppercase tracking-wide z-10">
            Sold Out
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-12">
          <div className="max-w-7xl mx-auto">
            <p className="text-[#F8C21C] text-sm font-semibold uppercase tracking-wide mb-2">
              By {developerName}
            </p>
            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-3">{normalizedProject.name}</h1>
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {normalizedProject.soldOut && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">✕</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-red-900 mb-1">This Project is Sold Out</h3>
                    <p className="text-sm text-red-700">
                      All units in this project have been sold. Please contact us for similar available projects or to be notified about new launches.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Price & Key Info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Price Range</p>
                  <p className="text-lg font-bold text-[#8B0000] flex items-center gap-1">
                    <IndianRupee className="w-4 h-4" /> {priceRange}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Possession</p>
                  <p className="text-lg font-bold text-gray-900 flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> {normalizedProject.possessionDate || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">RERA</p>
                  <p className="text-sm font-semibold text-gray-900">{normalizedProject.reraNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Location</p>
                  <p className="text-sm font-semibold text-gray-900 capitalize">{normalizedProject.location}</p>
                </div>
              </div>
            </div>

            {/* About */}
            {normalizedProject.about && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About This Project</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{normalizedProject.about}</p>
              </div>
            )}

            {/* Configurations */}
            {normalizedProject.priceDetails.configurations?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Configurations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {normalizedProject.priceDetails.configurations.map((config: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-[#005E60]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="text-[#005E60]" size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{config.type}</p>
                        <p className="text-sm text-gray-500">
                          {config.area && `${config.area} sq.ft`}
                          {config.price && ` • ${config.price}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {normalizedProject.amenities?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {normalizedProject.amenities.map((amenity: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 p-3 bg-[#005E60]/5 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-[#005E60] flex-shrink-0" />
                      <span className="text-sm text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Floor Plans */}
            {normalizedProject.floorPlans?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Floor Plans</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {normalizedProject.floorPlans.map((plan: any, idx: number) => (
                    <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                      {plan.image && (
                        <img src={plan.image} alt={`${plan.type} Floor Plan`} className="w-full h-48 object-cover" />
                      )}
                      <div className="p-4">
                        <p className="font-semibold text-gray-900">{plan.type}</p>
                        {plan.area && <p className="text-sm text-gray-500">{plan.area} sq.ft</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Master Plan & Location Map */}
            {(normalizedProject.masterPlan || normalizedProject.locationMap) && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Plans & Maps</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {normalizedProject.masterPlan && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Master Plan</p>
                      <img src={normalizedProject.masterPlan} alt="Master Plan" className="w-full rounded-xl border border-gray-200" />
                    </div>
                  )}
                  {normalizedProject.locationMap && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Location Map</p>
                      <img src={normalizedProject.locationMap} alt="Location Map" className="w-full rounded-xl border border-gray-200" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Nearby Places */}
            {normalizedProject.nearbyPlaces?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Nearby Places</h2>
                <div className="space-y-2">
                  {normalizedProject.nearbyPlaces.map((place: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Navigation className="w-4 h-4 text-[#005E60]" />
                        <div>
                          <p className="font-medium text-gray-900">{place.name}</p>
                          <p className="text-xs text-gray-500">{place.type}</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-[#005E60]">{place.distance}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {normalizedProject.soldOut ? 'Looking for similar projects?' : 'Interested in this project?'}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {normalizedProject.soldOut 
                  ? 'Contact us to explore other available options' 
                  : 'Get exclusive offers and site visit details'}
              </p>
              
              <a
                href="tel:+918881188181"
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#8B0000] text-white font-semibold rounded-xl hover:bg-[#6d0000] transition-colors mb-3"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </a>
              
              <Link
                href="/contact-us"
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#005E60] text-white font-semibold rounded-xl hover:bg-[#004a4d] transition-colors"
              >
                Send Enquiry
              </Link>

              {normalizedProject.emi?.startingFrom && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-3">EMI Starts From</p>
                  <p className="text-2xl font-bold text-[#005E60]">{normalizedProject.emi.startingFrom}</p>
                  {normalizedProject.emi.downPayment && <p className="text-sm text-gray-600 mt-1">Down Payment: {normalizedProject.emi.downPayment}</p>}
                  {normalizedProject.emi.interestRate && <p className="text-sm text-gray-600">Interest: {normalizedProject.emi.interestRate}</p>}
                  {normalizedProject.emi.tenure && <p className="text-sm text-gray-600">Tenure: {normalizedProject.emi.tenure}</p>}
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-3">About Developer</p>
                <p className="font-semibold text-gray-900">{developerName}</p>
                {normalizedProject.developer.established && (
                  <p className="text-sm text-gray-600">Established: {normalizedProject.developer.established}</p>
                )}
                {normalizedProject.developer.projectsCount > 0 && (
                  <p className="text-sm text-gray-600">{normalizedProject.developer.projectsCount} Projects Delivered</p>
                )}
                {normalizedProject.developer.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">{normalizedProject.developer.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}