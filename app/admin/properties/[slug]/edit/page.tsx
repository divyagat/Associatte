'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PropertyForm from '@/components/admin/PropertyForm';

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${params.slug}`);
        const data = await response.json();
        setProperty(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperty();
  }, [params.slug]);

  const handleSubmit = async (data: any) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/properties/${params.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        router.push('/admin/properties');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update property');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!property) {
    return <div className="text-center py-12">Property not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Property</h1>
        <p className="text-gray-600 mt-1">Update property details</p>
      </div>
      
      <PropertyForm 
        initialData={property}
        onSubmit={handleSubmit} 
        loading={saving} 
      />
    </div>
  );
}