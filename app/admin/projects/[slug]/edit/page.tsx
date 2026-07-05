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

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${params.slug}`);
        const data = await response.json();
        // ✅ Normalize the data before setting state
        setProject(normalizeProject(data));
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [params.slug]);

  const handleSubmit = async (data: any) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/projects/${params.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        router.push('/admin/projects');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update project');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!project) return <div className="text-center py-12">Project not found</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Project</h1>
        <p className="text-gray-600 mt-1">Update project details</p>
      </div>
      <ProjectForm initialData={project} onSubmit={handleSubmit} loading={saving} />
    </div>
  );
}