'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProjectForm from '@/components/admin/ProjectForm';

// ✅ Normalize project data to ensure consistent structure
const normalizeProject = (p: any) => {
  if (!p) return null;

  // Handle developer field - ensure it's always an object
  let developer = p.developer;
  if (typeof developer === 'string') {
    developer = { name: developer, established: '', projectsCount: 0, description: '' };
  } else if (!developer || typeof developer !== 'object') {
    developer = { name: '', established: '', projectsCount: 0, description: '' };
  }

  return {
    ...p,
    developer,
    soldOut: p.soldOut || false,
    amenities: p.amenities || [],
    floorPlans: p.floorPlans || [],
    nearbyPlaces: p.nearbyPlaces || [],
    emi: p.emi || {
      startingFrom: '',
      downPayment: '',
      interestRate: '',
      tenure: ''
    },
    masterPlan: p.masterPlan || '',
    locationMap: p.locationMap || '',
    fullLocation: p.fullLocation || {
      area: '',
      city: '',
      state: 'Maharashtra',
      pincode: '',
      landmark: ''
    },
    priceDetails: p.priceDetails || {
      range: '',
      perSqft: '',
      configurations: [{ type: '', area: '', price: '', description: '' }]
    },
    gallery: p.gallery || [],
    mapCoords: p.mapCoords || { lat: 0, lng: 0 }
  };
};

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setError(null);
        // ✅ Use encodeURIComponent for the slug
        const response = await fetch(`/api/projects/${encodeURIComponent(params.slug as string)}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Project not found');
          }
          throw new Error(`Failed to fetch project (Status: ${response.status})`);
        }
        
        const data = await response.json();
        
        if (!data || !data.slug) {
          throw new Error('Invalid project data received');
        }
        
        // ✅ Normalize the data before setting state
        setProject(normalizeProject(data));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load project';
        console.error('❌ Error fetching project:', errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    if (params.slug) {
      fetchProject();
    } else {
      setError('Invalid project slug');
      setLoading(false);
    }
  }, [params.slug]);

  const handleSubmit = async (data: any) => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    
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

      // ✅ Use encodeURIComponent for the slug
      const response = await fetch(`/api/projects/${encodeURIComponent(params.slug as string)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Failed to update project (Status: ${response.status})`);
      }

      // Success - show success message and redirect
      setSuccess(true);
      
      // Small delay to show success state before redirecting
      setTimeout(() => {
        router.push('/admin/projects');
        router.refresh(); // Refresh the page to show updated project
      }, 1000);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      console.error('❌ Error updating project:', errorMessage);
      setError(errorMessage);
      alert(`Error: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#005E60] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 border border-red-200 rounded-xl max-w-md">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-red-900 mb-2">Error Loading Project</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => router.push('/admin/projects')}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Project not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Project</h1>
        <p className="text-gray-600 mt-1">Update project details</p>
      </div>
      
      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-green-800 font-medium">Project updated successfully! Redirecting...</p>
          </div>
        </div>
      )}
      
      {/* Error Message */}
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
      
      <ProjectForm initialData={project} onSubmit={handleSubmit} loading={saving} />
    </div>
  );
}