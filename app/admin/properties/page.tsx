/* eslint-disable @next/next/no-img-element -- admin previews render arbitrary uploaded image URLs (incl. blob:) that next/image can't optimize */
import Link from 'next/link';
import { getAllProperties, getAllProjects } from '@/lib/data-store';
import { getPermissions } from '@/lib/admin-auth';
import { can } from '@/lib/admin-permissions';
import { Plus } from 'lucide-react';
import PropertiesListClient from '@/components/admin/PropertiesListClient';

export const dynamic = 'force-dynamic';

export default async function PropertiesListPage() {
  // Fetch projects alongside properties to map project names
  const [properties, projects, permissions] = await Promise.all([
    getAllProperties(), 
    getAllProjects(),
    getPermissions()
  ]);
  
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

      {/* Pass data to the Client Component for interactive filtering */}
      <PropertiesListClient 
        properties={properties} 
        projects={projects} 
        canEdit={canEdit} 
        canDelete={canDelete} 
      />
    </div>
  );
}