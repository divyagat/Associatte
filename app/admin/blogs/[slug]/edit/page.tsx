'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import BlogForm from '@/components/admin/BlogForm';
import { ArrowLeft } from 'lucide-react';

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setError(null);
        setLoading(true);
        
        if (!params.slug) {
          throw new Error('Invalid blog slug');
        }

        console.log(`🔍 Fetching blog: ${params.slug}`);
        const response = await fetch(`/api/blogs/${params.slug}`);

        console.log(`📡 Response status: ${response.status}`);

        if (!response.ok) {
          let errorMessage = 'Failed to fetch blog';
          
          if (response.status === 404) {
            errorMessage = `Blog "${params.slug}" not found. It may have been deleted or the URL is incorrect.`;
          } else if (response.status === 403) {
            errorMessage = 'You do not have permission to edit this blog.';
          } else if (response.status === 401) {
            errorMessage = 'You must be logged in to edit blogs.';
          } else {
            const errorData = await response.json().catch(() => ({}));
            errorMessage = errorData.error || `Failed to fetch blog (Status: ${response.status})`;
          }
          
          throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log(`✅ Blog data received:`, data);

        if (!data || !data.slug) {
          throw new Error('Invalid blog data received from server');
        }

        setBlog(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load blog';
        console.error('❌ Error fetching blog:', errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [params.slug]);

  const handleSubmit = async (data: any) => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      if (!data.title?.trim()) {
        throw new Error('Blog title is required');
      }
      if (!data.slug?.trim()) {
        throw new Error('Blog slug is required');
      }

      console.log(`📝 Submitting update for blog: ${params.slug}`);
      console.log(`📝 Update data:`, data);

      const response = await fetch(`/api/blogs/${params.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      console.log(`📡 Update response status: ${response.status}`);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Failed to update blog (Status: ${response.status})`);
      }

      console.log(`✅ Blog updated successfully`);
      setSuccess(true);

      setTimeout(() => {
        router.push('/admin/blogs');
        router.refresh();
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      console.error('❌ Error updating blog:', errorMessage);
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#005E60] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (error && !blog) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 border border-red-200 rounded-xl max-w-md">
          <svg
            className="w-12 h-12 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-xl font-bold text-red-900 mb-2">Error Loading Blog</h2>
          <p className="text-red-700 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/admin/blogs"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Back to Blogs
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Blog not found</p>
        <Link
          href="/admin/blogs"
          className="inline-flex items-center gap-2 mt-4 text-[#005E60] hover:text-[#004a4d]"
        >
          <ArrowLeft size={16} />
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/blogs"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Blog</h1>
          <p className="text-gray-600 mt-1">Update blog article</p>
        </div>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-fade-in">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-green-800 font-medium">
              Blog updated successfully! Redirecting...
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-fade-in">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-red-800 font-medium">{error}</p>
          </div>
        </div>
      )}

      <BlogForm initialData={blog} onSubmit={handleSubmit} loading={saving} />

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}