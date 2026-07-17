import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getAllProjects } from '@/lib/data-store';
import { getPermissions, getAdminRole } from '@/lib/admin-auth';
import { can } from '@/lib/admin-permissions';
import ProjectsListClient from '@/components/admin/ProjectsListClient';

export const dynamic = 'force-dynamic';

export default async function ProjectsListPage() {
  const [projects, permissions, role] = await Promise.all([
    getAllProjects(),
    getPermissions(),
    getAdminRole(),
  ]);

  const canAdd = can(permissions, 'projects', 'add');
  const canEdit = can(permissions, 'projects', 'edit');
  const canDelete = can(permissions, 'projects', 'delete');
  const isAdmin = role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Manage your real estate projects</p>
        </div>
        {canAdd && (
          <Link
            href="/admin/projects/new"
            className="flex items-center gap-2 px-4 py-2 bg-[#005E60] text-white rounded-lg hover:bg-[#004a4d] transition-colors"
          >
            <Plus size={18} /> Add New Project
          </Link>
        )}
      </div>

      <ProjectsListClient
        initialProjects={projects}
        canEdit={canEdit}
        canDelete={canDelete}
        isAdmin={isAdmin}
      />
    </div>
  );
}
