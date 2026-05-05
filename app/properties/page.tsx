// app/properties/page.tsx
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, Home, Building2, Filter, SlidersHorizontal, 
  Grid3X3, List, ChevronDown, X, ArrowUpDown, Loader2,
  Heart, Share2, Phone, MessageCircle, CheckCircle2
} from 'lucide-react';
import Image from 'next/image';

// Types
interface Property {
  id: string;
  title: string;
  location: string;
  locality: string;
  city: string;
  price: number;
  pricePerSqft?: number;
  bhk: string;
  area: number;
  propertyType: 'Apartment' | 'Villa' | 'Plot' | 'Studio' | 'Penthouse' | 'Office Space' | 'Shop';
  builder: string;
  status: 'under-construction' | 'ready-to-move' | 'pre-launch';
  possession?: string;
  images: string[];
  amenities: string[];
  rating: number;
  reviews: number;
  isVerified: boolean;
  featured?: boolean;
}

interface SearchFilters {
  bhk?: string[];
  priceRange?: { min: number; max: number };
  builder?: string[];
  propertyType?: string[];
  possession?: string;
  amenities?: string[];
  locality?: string;
}

// Mock data - Replace with API call in production
const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Luxury 3 BHK Apartment',
    location: 'Kharghar, Navi Mumbai',
    locality: 'Kharghar',
    city: 'Mumbai',
    price: 12500000,
    pricePerSqft: 12500,
    bhk: '3 BHK',
    area: 1000,
    propertyType: 'Apartment',
    builder: 'Lodha Group',
    status: 'ready-to-move',
    possession: 'Ready to Move',
    images: ['/images/property1.jpg', '/images/property2.jpg'],
    amenities: ['Swimming Pool', 'Gym', 'Parking', 'Security'],
    rating: 4.5,
    reviews: 128,
    isVerified: true,
    featured: true
  },
  {
    id: '2',
    title: 'Premium Villa with Garden',
    location: 'Baner, Pune',
    locality: 'Baner',
    city: 'Pune',
    price: 25000000,
    pricePerSqft: 15000,
    bhk: '4 BHK',
    area: 1667,
    propertyType: 'Villa',
    builder: 'Godrej Properties',
    status: 'under-construction',
    possession: 'Dec 2025',
    images: ['/images/property3.jpg', '/images/property4.jpg'],
    amenities: ['Garden', 'Club House', 'Parking', 'Power Backup'],
    rating: 4.8,
    reviews: 89,
    isVerified: true
  },
  {
    id: '3',
    title: 'Modern Studio Apartment',
    location: 'Whitefield, Bangalore',
    locality: 'Whitefield',
    city: 'Bangalore',
    price: 4500000,
    pricePerSqft: 9000,
    bhk: 'Studio',
    area: 500,
    propertyType: 'Studio',
    builder: 'Prestige Group',
    status: 'ready-to-move',
    possession: 'Ready to Move',
    images: ['/images/property5.jpg'],
    amenities: ['Gym', 'WiFi', 'Laundry', 'Security'],
    rating: 4.2,
    reviews: 56,
    isVerified: true
  },
  {
    id: '4',
    title: 'Spacious 2 BHK with Balcony',
    location: 'Andheri East, Mumbai',
    locality: 'Andheri',
    city: 'Mumbai',
    price: 8500000,
    pricePerSqft: 11000,
    bhk: '2 BHK',
    area: 773,
    propertyType: 'Apartment',
    builder: 'Oberoi Realty',
    status: 'ready-to-move',
    possession: 'Ready to Move',
    images: ['/images/property6.jpg'],
    amenities: ['Balcony', 'Parking', 'Security', 'Lift'],
    rating: 4.4,
    reviews: 203,
    isVerified: true,
    featured: true
  },
  {
    id: '5',
    title: 'Commercial Office Space',
    location: 'BKC, Mumbai',
    locality: 'Bandra Kurla Complex',
    city: 'Mumbai',
    price: 45000000,
    pricePerSqft: 18000,
    bhk: 'Office Space',
    area: 2500,
    propertyType: 'Office Space',
    builder: 'Tata Housing',
    status: 'ready-to-move',
    possession: 'Ready to Move',
    images: ['/images/property7.jpg'],
    amenities: ['Conference Room', 'Cafeteria', 'Parking', '24/7 Security'],
    rating: 4.7,
    reviews: 45,
    isVerified: true
  },
  {
    id: '6',
    title: 'Affordable 1 BHK',
    location: 'Thane West, Mumbai',
    locality: 'Thane',
    city: 'Mumbai',
    price: 5500000,
    pricePerSqft: 8500,
    bhk: '1 BHK',
    area: 647,
    propertyType: 'Apartment',
    builder: 'DLF',
    status: 'under-construction',
    possession: 'Jun 2026',
    images: ['/images/property8.jpg'],
    amenities: ['Parking', 'Lift', 'Security'],
    rating: 4.0,
    reviews: 78,
    isVerified: true
  }
];

const formatPrice = (price: number): string => {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  }
  return `₹${(price / 100000).toFixed(2)} L`;
};

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'relevance' | 'price-low' | 'price-high' | 'newest'>('relevance');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  // Parse search params
  const searchQuery = useMemo(() => searchParams?.get('q') || '', [searchParams]);
  const selectedCity = useMemo(() => searchParams?.get('city') || 'Mumbai', [searchParams]);
  const activeTab = useMemo(() => searchParams?.get('tab') || 'residential', [searchParams]);
  
  const filters = useMemo((): SearchFilters => {
    const f: SearchFilters = {};
    if (searchParams?.get('bhk')) f.bhk = searchParams.get('bhk')?.split(',');
    if (searchParams?.get('builder')) f.builder = searchParams.get('builder')?.split(',');
    if (searchParams?.get('type')) f.propertyType = searchParams.get('type')?.split(',');
    const minPrice = searchParams?.get('minPrice');
    const maxPrice = searchParams?.get('maxPrice');
    if (minPrice || maxPrice) {
      f.priceRange = {
        min: minPrice ? parseInt(minPrice) : 0,
        max: maxPrice === '999999999' ? Infinity : maxPrice ? parseInt(maxPrice) : Infinity
      };
    }
    if (searchParams?.get('locality')) f.locality = searchParams.get('locality') || undefined;
    return f;
  }, [searchParams]);

  // Load properties - Simulate API call
  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Filter mock data based on search params
        let filtered = [...mockProperties];
        
        // City filter
        if (selectedCity) {
          filtered = filtered.filter(p => 
            p.city.toLowerCase().includes(selectedCity.toLowerCase())
          );
        }
        
        // Search query filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(p => 
            p.title.toLowerCase().includes(query) ||
            p.location.toLowerCase().includes(query) ||
            p.locality.toLowerCase().includes(query) ||
            p.builder.toLowerCase().includes(query)
          );
        }
        
        // BHK filter
        if (filters.bhk?.length) {
          filtered = filtered.filter(p => filters.bhk?.includes(p.bhk));
        }
        
        // Property type filter
        if (filters.propertyType?.length) {
          filtered = filtered.filter(p => 
            filters.propertyType?.includes(p.propertyType)
          );
        }
        
        // Builder filter
        if (filters.builder?.length) {
          filtered = filtered.filter(p => 
            filters.builder?.includes(p.builder)
          );
        }
        
        // Price range filter
        if (filters.priceRange) {
          filtered = filtered.filter(p => 
            p.price >= filters.priceRange!.min && 
            p.price <= (filters.priceRange!.max === Infinity ? Number.MAX_SAFE_INTEGER : filters.priceRange!.max)
          );
        }
        
        // Sort
        switch (sortBy) {
          case 'price-low':
            filtered.sort((a, b) => a.price - b.price);
            break;
          case 'price-high':
            filtered.sort((a, b) => b.price - a.price);
            break;
          case 'newest':
            filtered.sort((a, b) => b.id.localeCompare(a.id));
            break;
          default:
            // Relevance: featured first, then by rating
            filtered.sort((a, b) => {
              if (a.featured && !b.featured) return -1;
              if (!a.featured && b.featured) return 1;
              return b.rating - a.rating;
            });
        }
        
        setProperties(filtered);
      } catch (error) {
        console.error('Failed to load properties:', error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadProperties();
  }, [searchQuery, selectedCity, filters, sortBy]);

  const handleFilterChange = useCallback((newFilters: SearchFilters) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    
    if (newFilters.bhk?.length) {
      params.set('bhk', newFilters.bhk.join(','));
    } else {
      params.delete('bhk');
    }
    
    if (newFilters.builder?.length) {
      params.set('builder', newFilters.builder.join(','));
    } else {
      params.delete('builder');
    }
    
    if (newFilters.propertyType?.length) {
      params.set('type', newFilters.propertyType.join(','));
    } else {
      params.delete('type');
    }
    
    if (newFilters.priceRange) {
      params.set('minPrice', newFilters.priceRange.min.toString());
      params.set('maxPrice', newFilters.priceRange.max === Infinity ? '999999999' : newFilters.priceRange.max.toString());
    } else {
      params.delete('minPrice');
      params.delete('maxPrice');
    }
    
    if (newFilters.locality) {
      params.set('locality', newFilters.locality);
    } else {
      params.delete('locality');
    }
    
    router.push(`/properties?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.delete('bhk');
    params.delete('builder');
    params.delete('type');
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('locality');
    router.push(`/properties?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  // Property Card Component
  const PropertyCard = useCallback(({ property, isListView = false }: { property: Property; isListView?: boolean }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 ${
        isListView ? 'flex flex-col sm:flex-row' : ''
      }`}
    >
      {/* Image Section */}
      <div className={`relative ${isListView ? 'sm:w-72 sm:flex-shrink-0' : 'aspect-[4/3]'}`}>
        <Image
          src={property.images[0] || '/images/placeholder-property.jpg'}
          alt={property.title}
          fill
          className="object-cover"
          sizes={isListView ? "(max-width: 640px) 100vw, 288px" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {property.isVerified && (
            <span className="px-2 py-1 bg-emerald-500/90 text-white text-xs font-medium rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Verified
            </span>
          )}
          {property.featured && (
            <span className="px-2 py-1 bg-amber-500/90 text-white text-xs font-medium rounded-full">
              Featured
            </span>
          )}
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            property.status === 'ready-to-move' 
              ? 'bg-emerald-100 text-emerald-700' 
              : property.status === 'under-construction'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-purple-100 text-purple-700'
          }`}>
            {property.status === 'ready-to-move' ? 'Ready' : property.status === 'under-construction' ? 'Under Construction' : 'Pre-Launch'}
          </span>
        </div>
        
        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm">
            <Heart className="w-4 h-4 text-slate-600 hover:text-red-500" />
          </button>
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm">
            <Share2 className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>
      
      {/* Content Section */}
      <div className={`p-4 ${isListView ? 'flex-1 flex flex-col justify-between' : ''}`}>
        <div>
          {/* Price */}
          <div className="flex items-baseline justify-between mb-2">
            <h3 className="text-lg font-bold text-slate-800">{formatPrice(property.price)}</h3>
            {property.pricePerSqft && (
              <span className="text-xs text-slate-500">₹{property.pricePerSqft.toLocaleString()}/sqft</span>
            )}
          </div>
          
          {/* Title */}
          <h4 className="font-semibold text-slate-700 mb-1 line-clamp-1">{property.title}</h4>
          
          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-slate-500 mb-3">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>
          
          {/* Details */}
          <div className="flex flex-wrap gap-3 text-sm text-slate-600 mb-3">
            <span className="flex items-center gap-1">
              <Home className="w-4 h-4" />
              {property.bhk}
            </span>
            <span>{property.area} sqft</span>
            <span>{property.propertyType}</span>
          </div>
          
          {/* Builder */}
          <div className="text-sm text-slate-500 mb-3">
            By <span className="font-medium text-slate-700">{property.builder}</span>
          </div>
          
          {/* Amenities (show first 3 in list view) */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {property.amenities.slice(0, isListView ? 3 : 4).map((amenity, i) => (
              <span key={i} className="px-2 py-1 bg-slate-50 text-slate-600 text-xs rounded-md">
                {amenity}
              </span>
            ))}
            {property.amenities.length > (isListView ? 3 : 4) && (
              <span className="px-2 py-1 text-slate-400 text-xs">+{property.amenities.length - (isListView ? 3 : 4)} more</span>
            )}
          </div>
        </div>
        
        {/* Rating & Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1">
            <span className="text-amber-400">★</span>
            <span className="font-medium text-slate-700">{property.rating}</span>
            <span className="text-slate-400 text-sm">({property.reviews})</span>
          </div>
          
          <div className="flex gap-2">
            <button className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <Phone className="w-4 h-4" />
            </button>
            <button className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <MessageCircle className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setSelectedProperty(property)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  ), []);

  // Filter Sidebar Component
  const FilterSidebar = useCallback(() => (
    <div className="space-y-6">
      {/* Active Filters */}
      {(filters.bhk?.length || filters.builder?.length || filters.propertyType?.length || filters.priceRange) && (
        <div className="bg-slate-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-slate-700">Active Filters</h4>
            <button 
              onClick={clearFilters}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.bhk?.map(bhk => (
              <span key={bhk} className="px-2.5 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full flex items-center gap-1">
                {bhk}
                <button onClick={() => handleFilterChange({ ...filters, bhk: filters.bhk?.filter(b => b !== bhk) })}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.propertyType?.map(type => (
              <span key={type} className="px-2.5 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full flex items-center gap-1">
                {type}
                <button onClick={() => handleFilterChange({ ...filters, propertyType: filters.propertyType?.filter(t => t !== type) })}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.priceRange && (
              <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full flex items-center gap-1">
                {formatPrice(filters.priceRange.min)} - {filters.priceRange.max === Infinity ? 'Above' : formatPrice(filters.priceRange.max)}
                <button onClick={() => handleFilterChange({ ...filters, priceRange: undefined })}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
      
      {/* BHK Filter */}
      <div>
        <h4 className="font-semibold text-slate-700 mb-3">BHK Type</h4>
        <div className="space-y-2">
          {['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '4+ BHK'].map(bhk => (
            <label key={bhk} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.bhk?.includes(bhk)}
                onChange={(e) => {
                  const current = filters.bhk || [];
                  const updated = e.target.checked 
                    ? [...current, bhk]
                    : current.filter(b => b !== bhk);
                  handleFilterChange({ ...filters, bhk: updated.length ? updated : undefined });
                }}
                className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-800">{bhk}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Price Range */}
      <div>
        <h4 className="font-semibold text-slate-700 mb-3">Budget</h4>
        <div className="space-y-2">
          {[
            { label: 'Under ₹50L', min: 0, max: 5000000 },
            { label: '₹50L - ₹1Cr', min: 5000000, max: 10000000 },
            { label: '₹1Cr - ₹2Cr', min: 10000000, max: 20000000 },
            { label: '₹2Cr - ₹5Cr', min: 20000000, max: 50000000 },
            { label: 'Above ₹5Cr', min: 50000000, max: Infinity },
          ].map(range => (
            <label key={range.label} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="priceRange"
                checked={filters.priceRange?.min === range.min && filters.priceRange?.max === range.max}
                onChange={() => handleFilterChange({ ...filters, priceRange: { min: range.min, max: range.max } })}
                className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-800">{range.label}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Property Type */}
      <div>
        <h4 className="font-semibold text-slate-700 mb-3">Property Type</h4>
        <div className="flex flex-wrap gap-2">
          {['Apartment', 'Villa', 'Plot', 'Studio', 'Penthouse', 'Office Space'].map(type => (
            <button
              key={type}
              onClick={() => {
                const current = filters.propertyType || [];
                const updated = current.includes(type) 
                  ? current.filter(t => t !== type)
                  : [...current, type];
                handleFilterChange({ ...filters, propertyType: updated.length ? updated : undefined });
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filters.propertyType?.includes(type)
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  ), [filters, handleFilterChange, clearFilters]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-800">Properties in {selectedCity}</h1>
              {searchQuery && (
                <p className="text-sm text-slate-500">Search: "{searchQuery}"</p>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex items-center bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'
                  }`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 pr-8 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="relevance">Sort by: Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium text-sm"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar />
            </div>
          </aside>
          
          {/* Properties Grid */}
          <main className="flex-1">
            {/* Results Count */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-slate-600">
                {loading ? 'Loading...' : `${properties.length} properties found`}
              </p>
            </div>
            
            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-pulse">
                    <div className="aspect-[4/3] bg-slate-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-5 bg-slate-200 rounded w-1/3" />
                      <div className="h-4 bg-slate-200 rounded w-2/3" />
                      <div className="h-4 bg-slate-200 rounded w-1/2" />
                      <div className="flex gap-2">
                        <div className="h-6 bg-slate-200 rounded w-16" />
                        <div className="h-6 bg-slate-200 rounded w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : properties.length === 0 ? (
              /* Empty State */
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No properties found</h3>
                <p className="text-slate-500 mb-6">Try adjusting your filters or search query</p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              /* Properties List */
              <AnimatePresence mode="popLayout">
                <motion.div 
                  layout
                  className={viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 gap-6' 
                    : 'space-y-4'
                  }
                >
                  {properties.map(property => (
                    <PropertyCard 
                      key={property.id} 
                      property={property} 
                      isListView={viewMode === 'list'} 
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </main>
        </div>
      </div>
      
      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto lg:hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-800">Filters</h3>
                  <button 
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
                <FilterSidebar />
                <div className="flex gap-3 pt-4 border-t border-slate-100 sticky bottom-0 bg-white pb-4">
                  <button
                    onClick={() => { clearFilters(); setShowMobileFilters(false); }}
                    className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold"
                  >
                    Show Results
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Property Detail Modal */}
      <AnimatePresence>
        {selectedProperty && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProperty(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="relative aspect-video">
                  <Image
                    src={selectedProperty.images[0] || '/images/placeholder-property.jpg'}
                    alt={selectedProperty.title}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => setSelectedProperty(null)}
                    className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">{selectedProperty.title}</h2>
                      <div className="flex items-center gap-2 text-slate-500 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedProperty.location}</span>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-indigo-600">{formatPrice(selectedProperty.price)}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-slate-50 rounded-xl">
                      <Home className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                      <div className="font-semibold text-slate-700">{selectedProperty.bhk}</div>
                      <div className="text-xs text-slate-500">Configuration</div>
                    </div>
                    <div className="text-center p-3 bg-slate-50 rounded-xl">
                      <Building2 className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                      <div className="font-semibold text-slate-700">{selectedProperty.area} sqft</div>
                      <div className="text-xs text-slate-500">Area</div>
                    </div>
                    <div className="text-center p-3 bg-slate-50 rounded-xl">
                      <CheckCircle2 className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                      <div className="font-semibold text-slate-700">{selectedProperty.possession}</div>
                      <div className="text-xs text-slate-500">Possession</div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-slate-700 mb-3">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProperty.amenities.map((amenity, i) => (
                        <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-sm rounded-lg">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                      <Phone className="w-4 h-4" />
                      Contact Builder
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      Schedule Visit
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}