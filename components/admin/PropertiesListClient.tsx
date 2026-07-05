'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Edit, MapPin, LayoutGrid, Search } from 'lucide-react';
import DeleteButton from '@/components/admin/DeleteButton';

// Categories matching your frontend Header
const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'pre-launch', label: 'Pre-Launch' },
  { value: 'ready', label: 'Ready' },
  { value: 'rent', label: 'Rent' },
  { value: 'plots', label: 'Plots' },
  { value: 'resale', label: 'Resale' },
];

export default function PropertiesListClient({ properties, projects, canEdit, canDelete }: any) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Map project slugs to names for display
  const projectMap = useMemo(() => {
    const map: Record<string, string> = {};
    projects.forEach((p: any) => { map[p.slug] = p.name; });
    return map;
  }, [projects]);

  // Filter properties based on category and search
  const filteredProperties = useMemo(() => {
    return properties.filter((p: any) => {
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
      const projectName = p.project || projectMap[p.projectSlug] || '';
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.fullLocation?.area?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [properties, activeCategory, searchQuery, projectMap]);

  // Color coding for category badges
  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'residential': return 'bg-green-100 text-green-800';
      case 'commercial': return 'bg-blue-100 text-blue-800';
      case 'pre-launch': return 'bg-yellow-100 text-yellow-800';
      case 'ready': return 'bg-emerald-100 text-emerald-800';
      case 'rent': return 'bg-purple-100 text-purple-800';
      case 'plots': return 'bg-orange-100 text-orange-800';
      case 'resale': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      {/* Filters & Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, project, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
          {CATEGORIES.map((cat) => {
            const count = cat.value === 'all' 
              ? properties.length 
              : properties.filter((p: any) => p.category === cat.value).length;
            
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === cat.value
                    ? 'bg-[#005E60] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.label}
                <span className="ml-2 text-xs opacity-75">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {filteredProperties.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 text-center py-12">
          <p className="text-gray-500">No properties found for this category.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProperties.map((property: any) => {
                    const projectName = property.project || projectMap[property.projectSlug] || 'Unassigned';
                    return (
                      <tr key={property.slug} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={property.image} alt={property.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                            <div className="min-w-0">
                              <div className="font-medium text-gray-900 truncate">{property.name}</div>
                              <div className="text-sm text-gray-500 truncate">{property.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <LayoutGrid size={14} className="text-purple-500 flex-shrink-0" />
                            <span className="truncate max-w-[150px]">{projectName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-lg ${getCategoryBadgeColor(property.category)}`}>
                            {property.category ? property.category.replace('-', ' ') : 'Uncategorized'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <MapPin size={14} className="flex-shrink-0" />
                            <span className="truncate max-w-[120px]">{property.fullLocation?.area}, {property.fullLocation?.city}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-[#8B0000] whitespace-nowrap">
                          {property.priceDetails?.range}
                        </td>
                        <td className="px-6 py-4">
                          {property.soldOut ? (
                            <span className="px-2.5 py-1 inline-flex text-xs font-bold rounded-lg bg-red-100 text-red-800 uppercase">
                              Sold Out
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 inline-flex text-xs font-bold rounded-lg bg-green-100 text-green-800 uppercase">
                              Available
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {canEdit && (
                              <Link
                                href={`/admin/properties/${property.slug}/edit`}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                aria-label="Edit"
                              >
                                <Edit size={18} />
                              </Link>
                            )}
                            {canDelete && (
                              <DeleteButton slug={property.slug} type="properties" label="this property" />
                            )}
                            {!canEdit && !canDelete && (
                              <span className="text-xs text-gray-400">View only</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filteredProperties.map((property: any) => {
              const projectName = property.project || projectMap[property.projectSlug] || 'Unassigned';
              return (
                <div key={property.slug} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-start gap-3">
                    <img src={property.image} alt={property.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{property.name}</h3>
                        {property.soldOut ? (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-red-100 text-red-800 uppercase flex-shrink-0">Sold Out</span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-green-100 text-green-800 uppercase flex-shrink-0">Available</span>
                        )}
                      </div>
                      <p className="text-xs text-purple-600 flex items-center gap-1 truncate">
                        <LayoutGrid size={12} /> {projectName}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin size={12} className="flex-shrink-0" />
                        <span className="truncate">{property.fullLocation?.area}, {property.fullLocation?.city}</span>
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm font-semibold text-[#8B0000]">{property.priceDetails?.range}</p>
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded ${getCategoryBadgeColor(property.category)}`}>
                          {property.category ? property.category.replace('-', ' ') : 'Uncategorized'}
                        </span>
                      </div>
                    </div>
                  </div>
                  {(canEdit || canDelete) && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                      {canEdit && (
                        <Link
                          href={`/admin/properties/${property.slug}/edit`}
                          className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <Edit size={16} /> Edit
                        </Link>
                      )}
                      {canDelete && (
                        <DeleteButton slug={property.slug} type="properties" label="this property" />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}