'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Edit, Trash2, LayoutGrid, Loader2 } from 'lucide-react';
import ApprovalControls from '@/components/admin/ApprovalControls';

// ✅ Helper to safely extract developer name
const getDeveloperName = (developer: any): string => {
  if (!developer) return '';
  if (typeof developer === 'string') return developer;
  if (typeof developer === 'object' && developer.name) return developer.name;
  return '';
};

export default function ProjectsListClient({ initialProjects, canEdit, canDelete, isAdmin }: any) {
  const [projects, setProjects] = useState<any[]>(initialProjects || []);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    setDeletingSlug(slug);
    try {
      // ✅ Use encodeURIComponent to handle special characters in slug
      const response = await fetch(`/api/projects/${encodeURIComponent(slug)}`, {
        method: 'DELETE',
      });

      // ✅ CRITICAL: Check if the backend actually succeeded before updating UI
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Failed to delete project (Status: ${response.status})`);
      }

      // Only update UI if deletion was successful
      setProjects((prev) => prev.filter((p) => p.slug !== slug));
    } catch (error) {
      console.error('❌ Error deleting project:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete project. Please check the console for details.');
    } finally {
      setDeletingSlug(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Developer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approval</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {projects.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-gray-500">No projects yet. Create your first project!</td>
            </tr>
          ) : (
            projects.map((project) => (
              <tr key={project.slug} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <LayoutGrid className="text-purple-600" size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{project.name}</div>
                      <div className="text-sm text-gray-500">{project.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{project.location}</td>

                {/* ✅ Extract developer name safely */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getDeveloperName(project.developer)}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <ApprovalControls slug={project.slug} type="projects" status={project.status} isAdmin={isAdmin} />
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    {canEdit && (
                      <Link
                        href={`/admin/projects/${encodeURIComponent(project.slug)}/edit`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        aria-label="Edit"
                      >
                        <Edit size={16} />
                      </Link>
                    )}
                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => handleDelete(project.slug)}
                        disabled={deletingSlug === project.slug}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        aria-label="Delete"
                      >
                        {deletingSlug === project.slug ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                      </button>
                    )}
                    {!canEdit && !canDelete && (
                      <span className="text-xs text-gray-400">View only</span>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
