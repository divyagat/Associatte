'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, LayoutGrid } from 'lucide-react';

// ✅ Helper to safely extract developer name
const getDeveloperName = (developer: any): string => {
  if (!developer) return '';
  if (typeof developer === 'string') return developer;
  if (typeof developer === 'object' && developer.name) return developer.name;
  return '';
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => { setProjects(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    await fetch(`/api/projects/${slug}`, { method: 'DELETE' });
    setProjects(projects.filter(p => p.slug !== slug));
  };

  if (loading) return <div className="text-center py-12">Loading projects...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Manage your real estate projects</p>
        </div>
        <Link href="/admin/projects/new" className="flex items-center gap-2 px-4 py-2 bg-[#005E60] text-white rounded-lg hover:bg-[#004a4d] transition-colors">
          <Plus size={18} /> Add New Project
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Developer</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {projects.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">No projects yet. Create your first project!</td>
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
                  
                  {/* ✅ FIXED: Extract developer name safely */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getDeveloperName(project.developer)}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/projects/${project.slug}/edit`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit size={16} />
                      </Link>
                      <button onClick={() => handleDelete(project.slug)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}