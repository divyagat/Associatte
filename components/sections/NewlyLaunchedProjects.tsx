'use client';

import { ChevronLeft, ChevronRight, MapPin, Bed, Square, Tag, Filter } from 'lucide-react';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import type { SearchFilters } from '../Home/Hero';

interface Project {
  id: number;
  name: string;
  location: string;
  bhk: string;
  sqft: string;
  price: string;
  image: string;
  city?: 'pune' | 'mumbai' | 'kdmc';
  priceNumeric?: number;
  builder?: string;
  propertyType?: string;
}

const PUNE_PROJECTS: Project[] = [
  {
    id: 1,
    name: 'Shapoorji Everra at Tree Cloud',
    location: 'Hadapsar, Pune',
    bhk: '3 & 4 BHK',
    sqft: '1270 - 1858 SQ.FT.',
    price: '₹1.48 Crore',
    image: '/projects/shapoorji-tree-cloud.webp',
    city: 'pune',
    priceNumeric: 14800000,
    builder: 'Shapoorji Pallonji',
    propertyType: 'Apartment',
  },
  {
    id: 2,
    name: 'Flamingo Park At Riverview City',
    location: 'Loni Kalbhor, Pune',
    bhk: '2, 2.5 & 3 BHK',
    sqft: '755 - 1190 SQ.FT.',
    price: '₹73.85 Lakh',
    image: '/projects/magarpatta-rvc-flamingo.webp',
    city: 'pune',
    priceNumeric: 7385000,
    builder: 'Paradise Group',
    propertyType: 'Apartment',
  },
  {
    id: 3,
    name: 'Tribeca Everett',
    location: 'Lulla Nagar, Pune',
    bhk: '3, 4 &5 BHK',
    sqft: '1859 - 3314 SQ.FT.',
    price: '₹3.96 Crore',
    image: '/projects/shapoorji-tree-cloud.webp',
    city: 'pune',
    priceNumeric: 39600000,
    builder: 'Tribeca',
    propertyType: 'Apartment',
  },
  {
    id: 4,
    name: 'Tribeca Trump world Center ',
    location: 'Koregaon Park, Pune',
    bhk: 'Premium Offices ',
    sqft: '3000 - 18000 SQ.FT.',
    price: '₹8.10 Crore',
    image: '/projects/tribeca-trump-tower.webp',
    city: 'pune',
    priceNumeric: 81000000,
    builder: 'Tribeca',
    propertyType: 'Office Space',
  },
  {
    id: 5,
    name: '57Avenue Panchshil ',
    location: 'Mundhwa, Pune',
    bhk: '3.5 & 4.5 BHK',
    sqft: '758 -1185 SQ.FT.',
    price: '₹4 Crore',
    image: '/projects/panchshil-57avenue.webp',
    city: 'pune',
    priceNumeric: 40000000,
    builder: 'Panchshil Realty',
    propertyType: 'Apartment',
  },
];

const MUMBAI_PROJECTS: Project[] = [
  {
    id: 101,
    name: 'Lodha Belmondo',
    location: 'Kharghar, Navi Mumbai',
    bhk: '2 & 3 BHK',
    sqft: '945 - 1450 SQ.FT.',
    price: '₹1.85 Crore',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80',
    city: 'mumbai',
    priceNumeric: 18500000,
    builder: 'Lodha Group',
    propertyType: 'Apartment',
  },
  {
    id: 102,
    name: 'Runwal Gardens',
    location: 'Dombivli East, Mumbai',
    bhk: '1, 2 & 3 BHK',
    sqft: '450 - 1100 SQ.FT.',
    price: '₹65 Lakh',
    image: '/projects/runwal-gardens.webp',
    city: 'mumbai',
    priceNumeric: 6500000,
    builder: 'Runwal',
    propertyType: 'Apartment',
  },
  {
    id: 103,
    name: 'Shapoorji Pallonji Joyville',
    location: 'Virar West, Mumbai',
    bhk: '1 & 2 BHK',
    sqft: '415 - 675 SQ.FT.',
    price: '₹42 Lakh',
    image: '/projects/shapoorji-tree-topia.webp',
    city: 'mumbai',
    priceNumeric: 4200000,
    builder: 'Shapoorji Pallonji',
    propertyType: 'Apartment',
  },
  {
    id: 104,
    name: 'Lodha Fiore',
    location: 'Thane West, Mumbai',
    bhk: '2 & 3 BHK',
    sqft: '750 - 1200 SQ.FT.',
    price: '₹1.25 Crore',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80',
    city: 'mumbai',
    priceNumeric: 12500000,
    builder: 'Lodha Group',
    propertyType: 'Apartment',
  },
  {
    id: 105,
    name: 'Birla Aerya',
    location: 'Andheri East, Mumbai',
    bhk: '3 & 4 BHK',
    sqft: '1100 - 2100 SQ.FT.',
    price: '₹3.2 Crore',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80',
    city: 'mumbai',
    priceNumeric: 32000000,
    builder: 'Birla Estates',
    propertyType: 'Apartment',
  },
];

const KDMC_PROJECTS: Project[] = [
  {
    id: 201,
    name: 'Paradise Sai World City',
    location: 'Kalyan East, KDMC',
    bhk: '1 & 2 BHK',
    sqft: '425 - 685 SQ.FT.',
    price: '₹42 Lakh',
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&q=80',
    city: 'kdmc',
    priceNumeric: 4200000,
    builder: 'Paradise Group',
    propertyType: 'Apartment',
  },
  {
    id: 202,
    name: 'Today Global Anantam',
    location: 'Dombivli East, KDMC',
    bhk: '1, 2 & 3 BHK',
    sqft: '380 - 920 SQ.FT.',
    price: '₹38 Lakh',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80',
    city: 'kdmc',
    priceNumeric: 3800000,
    builder: 'Today Global',
    propertyType: 'Apartment',
  },
  {
    id: 203,
    name: 'Runwal Bliss',
    location: 'Badlapur West, KDMC',
    bhk: '1 & 2 BHK',
    sqft: '410 - 650 SQ.FT.',
    price: '₹35 Lakh',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
    city: 'kdmc',
    priceNumeric: 3500000,
    builder: 'Runwal',
    propertyType: 'Apartment',
  },
  {
    id: 204,
    name: 'Lodha Codename Hidden Treasure',
    location: 'Kalyan West, KDMC',
    bhk: '2 & 3 BHK',
    sqft: '650 - 1050 SQ.FT.',
    price: '₹58 Lakh',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80',
    city: 'kdmc',
    priceNumeric: 5800000,
    builder: 'Lodha Group',
    propertyType: 'Apartment',
  },
  {
    id: 205,
    name: 'Shapoorji Pallonji Joyville Hadapsar',
    location: 'Ulhasnagar, KDMC',
    bhk: '1 & 2 BHK',
    sqft: '395 - 620 SQ.FT.',
    price: '₹32 Lakh',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80',
    city: 'kdmc',
    priceNumeric: 3200000,
    builder: 'Shapoorji Pallonji',
    propertyType: 'Apartment',
  },
];

const PROJECT_SLUG_MAP: Record<string, string> = {
  'Shapoorji Everra at Tree Cloud': 'shapoorji-tree-cloud',
  'Flamingo Park At Riverview City': 'magarpatta-city-rvc-flamingo',
  'Tribeca Everett': 'tribeca-lulla-nagar',
  'Tribeca Trump world Center ': 'tribeca-trump-tower',
  '57Avenue Panchshil ': 'panchshil-57avenue',
  'Lodha Belmondo': 'lodha-belmondo-kharghar',
  'Runwal Gardens': 'runwal-gardens-dombivli',
  'Shapoorji Pallonji Joyville': 'joyville-virar',
  'Lodha Fiore': 'lodha-fiore-thane',
  'Birla Aerya': 'birla-aerya-andheri',
  'Paradise Sai World City': 'paradise-sai-world-city-kalyan',
  'Today Global Anantam': 'today-global-anantam-dombivli',
  'Runwal Bliss': 'runwal-bliss-badlapur',
  'Lodha Codename Hidden Treasure': 'lodha-hidden-treasure-kalyan',
  'Shapoorji Pallonji Joyville Hadapsar': 'joyville-ulhasnagar',
};

interface NewlyLaunchedProjectsProps {
  selectedCity: 'pune' | 'mumbai' | 'kdmc';
  filters?: SearchFilters;
}

const FALLBACK_IMAGE = '/images/placeholder-property.webp';

export default function NewlyLaunchedProjects({ 
  selectedCity = 'pune', 
  filters = {} 
}: NewlyLaunchedProjectsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const filteredProjects = useMemo(() => {
    let projects: Project[] = [];
    if (selectedCity === 'pune') {
      projects = [...PUNE_PROJECTS];
    } else if (selectedCity === 'mumbai') {
      projects = [...MUMBAI_PROJECTS];
    } else {
      projects = [...KDMC_PROJECTS];
    }

    if (filters.bhk?.length) {
      projects = projects.filter(p => 
        filters.bhk!.some(bhk => 
          p.bhk.toUpperCase().includes(bhk.toUpperCase().trim())
        )
      );
    }

    if (filters.priceRange) {
      const { min, max } = filters.priceRange;
      projects = projects.filter(p => {
        const price = p.priceNumeric || 0;
        return price >= min && price <= (max === Infinity ? Number.MAX_SAFE_INTEGER : max);
      });
    }

    if (filters.builder?.length) {
      projects = projects.filter(p => 
        filters.builder!.some(builder => 
          (p.builder || '').toLowerCase().includes(builder.toLowerCase().trim())
        )
      );
    }

    if (filters.propertyType?.length) {
      projects = projects.filter(p => 
        filters.propertyType!.some(type => 
          (p.propertyType || '').toLowerCase().includes(type.toLowerCase().trim())
        )
      );
    }

    if (filters.locality) {
      projects = projects.filter(p => 
        p.location.toLowerCase().includes(filters.locality!.toLowerCase().trim())
      );
    }

    return projects;
  }, [selectedCity, filters]);

  const checkScrollButtons = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
      return () => {
        container.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, [checkScrollButtons]);

  useEffect(() => {
    checkScrollButtons();
  }, [filteredProjects, checkScrollButtons]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -420, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 420, behavior: 'smooth' });
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    if (img.src !== FALLBACK_IMAGE) {
      img.src = FALLBACK_IMAGE;
    }
  };

  return (
    <section className="py-10 md:py-14 bg-[#f7f7f7]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="section-title text-[#1f2937] mb-2">
              Newly Launched Projects
            </h2>
            <p className="section-subtitle">
              Just now launched in the <span className="font-semibold text-[#1f2937] capitalize">{selectedCity}</span>
            </p>
          </div>
          
          {Object.keys(filters).length > 0 && (
            <div className="flex items-center gap-2 text-sm text-[#6b7280]">
              <Filter size={16} className="text-[#005E60]" />
              <span>{Object.keys(filters).length} filter{Object.keys(filters).length > 1 ? 's' : ''} applied</span>
            </div>
          )}
        </div>

        {/* No results message */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <p className="text-[#6b7280] text-lg">No projects match your filters in {selectedCity}</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or explore other categories</p>
          </div>
        ) : (
          /* Carousel Container */
          <div className="relative group">
            
            {/* Left Arrow */}
            {canScrollLeft && (
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 z-20 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 hover:scale-110 transition-all duration-300 border border-gray-200"
                aria-label="Previous projects"
              >
                <ChevronLeft size={20} className="text-[#1f2937]" />
              </button>
            )}

            {/* Projects Container */}
            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {filteredProjects.map((project) => {
                const slug = PROJECT_SLUG_MAP[project.name] || '#';
                
                return (
                  <Link 
                    key={project.id}
                    href={slug !== '#' ? `/property/${slug}` : '#'}
                    className="group block"
                    onClick={(e) => {
                      if (slug === '#') {
                        e.preventDefault();
                        console.warn(`No slug mapping found: ${project.name}`);
                      }
                    }}
                  >
                    <article
                      className="group flex-shrink-0 w-[420px] bg-white rounded-xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer relative"
                    >
                      {/* NEW LAUNCH Badge - Brand Gold */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="inline-block px-3 py-1 bg-[#F8C21C] text-[#1f2937] text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm">
                          NEW LAUNCH
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex gap-3 mt-6">
                        {/* Circular Image */}
                        <div className="flex-shrink-0">
                          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-[#005E60] transition-colors duration-300 shadow-md relative">
                            <Image
                              src={project.image}
                              alt={project.name}
                              fill
                              className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                              sizes="96px"
                              priority={false}
                              onError={handleImageError}
                            />
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-[#005E60] mb-1 group-hover:text-[#004a4b] transition-colors truncate">
                            {project.name}
                          </h3>

                          <div className="flex items-center gap-1 text-xs text-[#6b7280] mb-1.5">
                            <MapPin size={12} className="text-[#8B0000] flex-shrink-0" />
                            <span className="truncate">{project.location}</span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-[#6b7280] mb-2">
                            <div className="flex items-center gap-1">
                              <Bed size={12} className="text-[#8B0000] flex-shrink-0" />
                              <span>{project.bhk}</span>
                            </div>
                            <span className="text-gray-300">|</span>
                            <div className="flex items-center gap-1">
                              <Square size={12} className="text-[#8B0000] flex-shrink-0" />
                              <span className="truncate">{project.sqft}</span>
                            </div>
                          </div>

                          <div className="inline-block px-3 py-1 bg-[#ECF1F8] text-[#005E60] text-xs font-bold rounded-full">
                            {project.price}
                          </div>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="my-3 border-t border-gray-100" />

                      {/* Bottom Text */}
                      <div className="flex items-center gap-1.5 text-xs">
                        <Tag size={12} className="text-[#8B0000] flex-shrink-0" />
                        <span className="text-[#1f2937]">
                          Get preferred options <span className="font-bold text-[#8B0000]">@ZERO Brokerage</span>
                        </span>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>

            {/* Right Arrow */}
            {canScrollRight && (
              <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 z-20 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 hover:scale-110 transition-all duration-300 border border-gray-200"
                aria-label="Next projects"
              >
                <ChevronRight size={20} className="text-[#1f2937]" />
              </button>
            )}
          </div>
        )}

      </div>
    </section>
  );
}