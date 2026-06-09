'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import BlogForm from '@/components/admin/BlogForm';

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blogs/${params.slug}`);
        const data = await response.json();
        setBlog(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlog();
  }, [params.slug]);

  const handleSubmit = async (data: any) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/blogs/${params.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        router.push('/admin/blogs');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update blog');
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

  if (!blog) {
    return <div className="text-center py-12">Blog not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Blog</h1>
        <p className="text-gray-600 mt-1">Update blog article</p>
      </div>
      
      <BlogForm 
        initialData={blog}
        onSubmit={handleSubmit} 
        loading={saving} 
      />
    </div>
  );
}