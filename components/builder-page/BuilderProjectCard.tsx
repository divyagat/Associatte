'use client';

import Image from 'next/image';
import Link from 'next/link';

type Property = {
  slug: string;
  name: string;
  location: string;
  price: string;
  image: string;
  fullLocation: { area: string; city: string };
  priceDetails: { range: string; configurations: Array<{ type: string; area: string; price: string }> };
  developer: { name: string };
  about: string;
};

export default function BuilderProjectCard({ project }: { project: Property }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Image Section */}
        <div className="lg:w-80 relative h-64 lg:h-auto">
          <Image
            src={project.image}
            alt={project.name}
            fill
            className="object-cover"
          />
          <div className="absolute top-4 left-4 bg-[#8B0000] text-white px-3 py-1.5 rounded text-sm font-semibold">
            Zero Brokerage
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{project.name}</h3>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{project.fullLocation.area}, {project.fullLocation.city}</span>
              <span className="text-gray-400">•</span>
              <span className="text-[#005E60] font-medium">{project.developer.name}</span>
            </div>
          </div>

          {/* Configurations */}
          <div className="mb-5">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Configuration</h4>
            <div className="flex flex-wrap gap-3">
              {project.priceDetails.configurations.slice(0, 4).map((config, idx) => (
                <div 
                  key={idx}
                  className="bg-gray-50 border-2 border-gray-200 rounded-lg p-3 min-w-[130px] hover:border-[#F8C21C] hover:bg-[#F8C21C]/5 transition-all cursor-pointer"
                >
                  <div className="font-bold text-gray-900">{config.type}</div>
                  <div className="text-sm text-gray-600 mt-0.5">{config.area}</div>
                  <div className="text-[#8B0000] font-bold mt-1">{config.price}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-5 line-clamp-2">{project.about}</p>

          {/* Actions */}
          <div className="flex gap-3">
            <Link 
              href={`/projects/${project.slug}`}
              className="flex-1 bg-white border-2 border-[#8B0000] text-[#8B0000] py-2.5 px-4 rounded font-semibold hover:bg-[#8B0000] hover:text-white transition-all text-center"
            >
              View Details
            </Link>
            <button className="flex-1 bg-[#F8C21C] text-[#8B0000] py-2.5 px-4 rounded font-bold hover:bg-[#F8C21C]/90 transition-all">
              Enquire Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}