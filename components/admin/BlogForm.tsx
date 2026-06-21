'use client';
/* eslint-disable @next/next/no-img-element -- previews render just-uploaded blob:/data: URLs that next/image can't optimize */

import { useState } from 'react';
import { Upload, X, Plus, Trash2 } from 'lucide-react';

interface BlogFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
}

export default function BlogForm({ initialData, onSubmit, loading }: BlogFormProps) {
  const [formData, setFormData] = useState(initialData || {
    slug: '',
    title: '',
    excerpt: '',
    content: '',
    image: '',
    image2: '',
    category: '',
    city: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    readTime: '',
    tags: [] as string[],
    author: {
      name: '',
      role: '',
      avatar: '',
      bio: ''
    },
    courtesy: '',
    faqs: [] as any[],
    relatedSlugs: [] as string[],
    recentPostSlugs: [] as string[],
    overlayText: ''
  });

  const [currentTag, setCurrentTag] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    
    setFormData((prev: any) => {
      const updated = { ...prev };
      let current: any = updated;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });
      const data = await response.json();
      setFormData((prev: any) => ({ ...prev, [field]: data.url }));
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const addTag = () => {
    if (currentTag.trim()) {
      setFormData((prev: any) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      tags: prev.tags.filter((_: any, i: number) => i !== index)
    }));
  };

  const addFAQ = () => {
    setFormData((prev: any) => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }));
  };

  const removeFAQ = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      faqs: prev.faqs.filter((_: any, i: number) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Basic Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              placeholder="e.g., factors-drive-property-appreciation"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt *</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={3}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Read Time *</label>
              <input
                type="text"
                name="readTime"
                value={formData.readTime}
                onChange={handleChange}
                placeholder="5 min read"
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Overlay Text</label>
              <input
                type="text"
                name="overlayText"
                value={formData.overlayText}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Images</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Main Image *</label>
            {formData.image && (
              <img src={formData.image} alt="Main" className="w-full h-48 object-cover rounded-lg mb-3" />
            )}
            <label className="cursor-pointer block">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#005E60] transition-colors">
                <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                <p className="text-sm text-gray-600">Upload main image</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'image')}
                  className="hidden"
                />
              </div>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Image</label>
            {formData.image2 && (
              <img src={formData.image2} alt="Secondary" className="w-full h-48 object-cover rounded-lg mb-3" />
            )}
            <label className="cursor-pointer block">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#005E60] transition-colors">
                <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                <p className="text-sm text-gray-600">Upload secondary image</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'image2')}
                  className="hidden"
                />
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Author */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Author Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
            <input
              type="text"
              name="author.name"
              value={formData.author.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
            <input
              type="text"
              name="author.role"
              value={formData.author.role}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Avatar URL</label>
            <input
              type="text"
              name="author.avatar"
              value={formData.author.avatar}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Courtesy</label>
            <input
              type="text"
              name="courtesy"
              value={formData.courtesy}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              name="author.bio"
              value={formData.author.bio}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Content (HTML) *</h2>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={15}
          required
          placeholder="<h2>Heading</h2><p>Content...</p>"
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60] font-mono text-sm"
        />
      </div>

      {/* Tags */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Tags</h2>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            placeholder="Add tag"
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-[#005E60] text-white rounded-lg hover:bg-[#004a4d] transition-colors"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag: string, index: number) => (
            <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-[#005E60]/10 text-[#005E60] rounded-lg">
              <span className="text-sm">#{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="hover:text-red-600 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">FAQs</h2>
          <button
            type="button"
            onClick={addFAQ}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#005E60] text-white rounded-lg hover:bg-[#004a4d] transition-colors text-sm"
          >
            <Plus size={16} />
            Add FAQ
          </button>
        </div>
        <div className="space-y-3">
          {formData.faqs.map((faq: any, index: number) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    placeholder="Question"
                    value={faq.question}
                    onChange={(e) => {
                      const updated = [...formData.faqs];
                      updated[index].question = e.target.value;
                      setFormData((prev: any) => ({ ...prev, faqs: updated }));
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
                  />
                  <textarea
                    placeholder="Answer"
                    value={faq.answer}
                    onChange={(e) => {
                      const updated = [...formData.faqs];
                      updated[index].answer = e.target.value;
                      setFormData((prev: any) => ({ ...prev, faqs: updated }));
                    }}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFAQ(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-[#005E60] text-white rounded-lg hover:bg-[#004a4d] transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : initialData ? 'Update Blog' : 'Create Blog'}
        </button>
      </div>
    </form>
  );
}