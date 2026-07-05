'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProjectForm from '@/components/admin/ProjectForm';

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        router.push('/admin/projects');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create project');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
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
      <ProjectForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}