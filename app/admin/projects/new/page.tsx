'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProjectForm from '@/components/admin/ProjectForm';

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    
    try {
      // Validate required fields
      if (!data.name?.trim()) {
        throw new Error('Project name is required');
      }
      if (!data.slug?.trim()) {
        throw new Error('Project slug is required');
      }
      if (!data.location) {
        throw new Error('Location is required');
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Failed to create project (Status: ${response.status})`);
      }

      // Success - redirect to projects list
      router.push('/admin/projects');
      router.refresh(); // Refresh the page to show new project
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      console.error('❌ Error creating project:', errorMessage);
      setError(errorMessage);
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Project</h1>
        <p className="text-gray-600 mt-1">Create a new project</p>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-800 font-medium">{error}</p>
          </div>
        </div>
      )}
      
      <ProjectForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}