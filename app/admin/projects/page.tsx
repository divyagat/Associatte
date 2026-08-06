import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getAllProjects, getSiteConfig } from '@/lib/data-store';
import { getPermissions, getAdminRole } from '@/lib/admin-auth';
import { can } from '@/lib/admin-permissions';
import { projectTypesOf } from '@/lib/categories';
import ProjectsListClient from '@/components/admin/ProjectsListClient';
import AddCategoryInline from '@/components/admin/AddCategoryInline';

export const dynamic = 'force-dynamic';

export default async function ProjectsListPage() {
  const [projects, permissions, role, siteConfig] = await Promise.all([
    getAllProjects(),
    getPermissions(),
    getAdminRole(),
    getSiteConfig(),
  ]);

  const canAdd = can(permissions, 'projects', 'add');
  const canEdit = can(permissions, 'projects', 'edit');
  const canDelete = can(permissions, 'projects', 'delete');
  // Main admin OR a manager granted the `approve` right may act on approvals.
  const isAdmin = role === 'admin';
  const canApprove = isAdmin || can(permissions, 'projects', 'approve');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Manage your real estate projects</p>
        </div>
        {canAdd && (
          <div className="flex flex-wrap items-center gap-2">
            {isAdmin && <AddCategoryInline allTypes={siteConfig.propertyTypes} section="projects" />}
            <Link
              href="/admin/projects/new"
              className="flex items-center gap-2 px-4 py-2 bg-[#005E60] text-white rounded-lg hover:bg-[#004a4d] transition-colors"
            >
              <Plus size={18} /> Add New Project
            </Link>
          </div>
        )}
      </div>

      <ProjectsListClient
        initialProjects={projects}
        categories={projectTypesOf(siteConfig.propertyTypes)}
        canEdit={canEdit}
        canDelete={canDelete}
        canApprove={canApprove}
        isAdmin={isAdmin}
      />
    </div>
  );
}
