/* eslint-disable @next/next/no-img-element -- admin previews render arbitrary uploaded image URLs (incl. blob:) that next/image can't optimize */
import Link from 'next/link';
import { getAllProperties } from '@/lib/data-store';
import { getPermissions } from '@/lib/admin-auth';
import { can } from '@/lib/admin-permissions';
import { Plus, Edit, MapPin } from 'lucide-react';
import DeleteButton from '@/components/admin/DeleteButton';

export const dynamic = 'force-dynamic';

export default async function PropertiesListPage() {
  const [properties, permissions] = await Promise.all([getAllProperties(), getPermissions()]);
  const canAdd = can(permissions, 'properties', 'add');
  const canEdit = can(permissions, 'properties', 'edit');
  const canDelete = can(permissions, 'properties', 'delete');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600 mt-1">Manage all property listings</p>
        </div>
        {canAdd && (
          <Link
            href="/admin/properties/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#005E60] text-white rounded-lg hover:bg-[#004a4d] transition-colors font-medium"
          >
            <Plus size={20} />
            Add Property
          </Link>
        )}
      </div>

      {properties.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 text-center py-12">
          <p className="text-gray-500">No properties found. Create your first property!</p>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Builder</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {properties.map((property) => (
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
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin size={14} className="flex-shrink-0" />
                          {property.fullLocation?.area}, {property.fullLocation?.city}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#8B0000] whitespace-nowrap">
                        {property.priceDetails?.range}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{property.developer?.name}</td>
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {properties.map((property) => (
              <div key={property.slug} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-start gap-3">
                  <img src={property.image} alt={property.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{property.name}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin size={12} className="flex-shrink-0" />
                      <span className="truncate">{property.fullLocation?.area}, {property.fullLocation?.city}</span>
                    </p>
                    <p className="text-sm font-semibold text-[#8B0000] mt-1">{property.priceDetails?.range}</p>
                    <p className="text-xs text-gray-500 truncate">{property.developer?.name}</p>
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
            ))}
          </div>
        </>
      )}
    </div>
  );
}
