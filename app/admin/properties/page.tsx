import Link from 'next/link';
import { getAllProperties } from '@/lib/data-store';
import { Plus, Edit, MapPin } from 'lucide-react';
import DeleteButton from '@/components/admin/DeleteButton';

export const dynamic = 'force-dynamic';

export default async function PropertiesListPage() {
  const properties = await getAllProperties();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600 mt-1">Manage all property listings</p>
        </div>
        <Link 
          href="/admin/properties/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#005E60] text-white rounded-lg hover:bg-[#004a4d] transition-colors"
        >
          <Plus size={20} />
          Add Property
        </Link>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
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
                    <img 
                      src={property.image} 
                      alt={property.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{property.name}</div>
                      <div className="text-sm text-gray-500">{property.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin size={14} />
                    {property.fullLocation.area}, {property.fullLocation.city}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-[#8B0000]">
                  {property.priceDetails.range}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {property.developer.name}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/properties/${property.slug}/edit`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                    </Link>
                    <DeleteButton slug={property.slug} type="properties" label="this property" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {properties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No properties found. Create your first property!</p>
          </div>
        )}
      </div>
    </div>
  );
}