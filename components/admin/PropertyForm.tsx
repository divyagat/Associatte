'use client';
/* eslint-disable @next/next/no-img-element -- previews render just-uploaded blob:/data: URLs that next/image can't optimize */

import { useState, useEffect } from 'react';
import { Upload, X, Plus, Trash2 } from 'lucide-react';

interface PropertyFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
}

export default function PropertyForm({ initialData, onSubmit, loading }: PropertyFormProps) {
  const [formData, setFormData] = useState(initialData || {
    slug: '',
    name: '',
    category: 'residential',
    project: '',
    projectSlug: '',
    location: 'pune',
    price: '',
    image: '',
    masterPlan: '',
    locationMap: '',
    fullLocation: { area: '', city: '', state: 'Maharashtra', pincode: '', landmark: '' },
    priceDetails: {
      range: '',
      perSqft: '',
      configurations: [{ type: '', area: '', price: '', description: '' }]
    },
    developer: {
      name: '',
      established: '',
      projectsCount: 0,
      description: ''
    },
    about: '',
    amenities: [] as string[],
    floorPlans: [] as any[],
    possessionDate: '',
    reraNumber: '',
    gallery: [] as string[],
    mapCoords: { lat: 0, lng: 0 },
    nearbyPlaces: [] as any[],
    emi: {
      startingFrom: '',
      downPayment: '',
      interestRate: '',
      tenure: ''
    },
    soldOut: false
  });

  const [currentAmenity, setCurrentAmenity] = useState('');
  const [projects, setProjects] = useState<any[]>([]);

  // Fetch projects to populate the dropdown
  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error('Failed to fetch projects:', err));
  }, []);

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
      
      if (field === 'gallery') {
        setFormData((prev: any) => ({
          ...prev,
          gallery: [...prev.gallery, data.url]
        }));
      } else {
        setFormData((prev: any) => ({ ...prev, [field]: data.url }));
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const addConfiguration = () => {
    setFormData((prev: any) => ({
      ...prev,
      priceDetails: {
        ...prev.priceDetails,
        configurations: [...prev.priceDetails.configurations, { type: '', area: '', price: '', description: '' }]
      }
    }));
  };

  const removeConfiguration = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      priceDetails: {
        ...prev.priceDetails,
        configurations: prev.priceDetails.configurations.filter((_: any, i: number) => i !== index)
      }
    }));
  };

  const addAmenity = () => {
    if (currentAmenity.trim()) {
      setFormData((prev: any) => ({
        ...prev,
        amenities: [...prev.amenities, currentAmenity.trim()]
      }));
      setCurrentAmenity('');
    }
  };

  const removeAmenity = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      amenities: prev.amenities.filter((_: any, i: number) => i !== index)
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Property Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
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
              placeholder="e.g., mantra-one-residency"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="pre-launch">Pre-Launch</option>
              <option value="ready">Ready</option>
              <option value="rent">Rent</option>
              <option value="plots">Plots</option>
              <option value="resale">Resale</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
            >
              <option value="pune">Pune</option>
              <option value="mumbai">Mumbai</option>
              <option value="kdmc">KDMC</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price Range *</label>
            <input
              type="text"
              name="priceDetails.range"
              value={formData.priceDetails.range}
              onChange={handleChange}
              placeholder="₹80 Lakh - ₹1.15 Cr"
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">RERA Number *</label>
            <input
              type="text"
              name="reraNumber"
              value={formData.reraNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Possession Date *</label>
            <input
              type="text"
              name="possessionDate"
              value={formData.possessionDate}
              onChange={handleChange}
              placeholder="Dec 2026"
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assign to Project</label>
            <select
              name="projectSlug"
              value={formData.projectSlug || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
            >
              <option value="">-- Select a Project (Optional) --</option>
              {projects.map((p) => (
                <option key={p.slug} value={p.slug}>{p.name}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Link this property to an existing project.</p>
          </div>
          <div className="md:col-span-2">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700">Mark as Sold Out</label>
                <p className="text-xs text-gray-500">This property will be marked as unavailable on the website.</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData((prev: any) => ({ ...prev, soldOut: !prev.soldOut }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#005E60] focus:ring-offset-2 ${
                  formData.soldOut ? 'bg-red-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.soldOut ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Location Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Area *</label>
            <input
              type="text"
              name="fullLocation.area"
              value={formData.fullLocation.area}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
            <input
              type="text"
              name="fullLocation.city"
              value={formData.fullLocation.city}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <input
              type="text"
              name="fullLocation.state"
              value={formData.fullLocation.state}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
            <input
              type="text"
              name="fullLocation.pincode"
              value={formData.fullLocation.pincode}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Landmark</label>
            <input
              type="text"
              name="fullLocation.landmark"
              value={formData.fullLocation.landmark}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
            />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Images</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Main Image *</label>
            <div className="flex items-center gap-4">
              {formData.image && (
                <img src={formData.image} alt="Main" className="w-32 h-32 object-cover rounded-lg" />
              )}
              <label className="flex-1 cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#005E60] transition-colors">
                  <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                  <p className="text-sm text-gray-600">Click to upload main image</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'image')}
                    className="hidden"
                  />
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images</label>
            <div className="grid grid-cols-4 gap-3 mb-3">
              {formData.gallery.map((img: string, index: number) => (
                <div key={index} className="relative group">
                  <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev: any) => ({
                        ...prev,
                        gallery: prev.gallery.filter((_: any, i: number) => i !== index)
                      }));
                    }}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <label className="cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#005E60] transition-colors">
                <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                <p className="text-sm text-gray-600">Add to gallery</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'gallery')}
                  className="hidden"
                />
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Developer */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Developer Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Developer Name *</label>
            <input
              type="text"
              name="developer.name"
              value={formData.developer.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Established Year</label>
            <input
              type="text"
              name="developer.established"
              value={formData.developer.established}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Projects Count</label>
            <input
              type="number"
              name="developer.projectsCount"
              value={formData.developer.projectsCount}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="developer.description"
              value={formData.developer.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
            />
          </div>
        </div>
      </div>

      {/* Configurations */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Configurations</h2>
          <button
            type="button"
            onClick={addConfiguration}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#005E60] text-white rounded-lg hover:bg-[#004a4d] transition-colors text-sm"
          >
            <Plus size={16} />
            Add Configuration
          </button>
        </div>
        <div className="space-y-3">
          {formData.priceDetails.configurations.map((config: any, index: number) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 bg-gray-50 rounded-lg">
              <input
                type="text"
                placeholder="Type (e.g., 2 BHK)"
                value={config.type}
                onChange={(e) => {
                  const updated = [...formData.priceDetails.configurations];
                  updated[index].type = e.target.value;
                  setFormData((prev: any) => ({
                    ...prev,
                    priceDetails: { ...prev.priceDetails, configurations: updated }
                  }));
                }}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
              />
              <input
                type="text"
                placeholder="Area"
                value={config.area}
                onChange={(e) => {
                  const updated = [...formData.priceDetails.configurations];
                  updated[index].area = e.target.value;
                  setFormData((prev: any) => ({
                    ...prev,
                    priceDetails: { ...prev.priceDetails, configurations: updated }
                  }));
                }}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
              />
              <input
                type="text"
                placeholder="Price"
                value={config.price}
                onChange={(e) => {
                  const updated = [...formData.priceDetails.configurations];
                  updated[index].price = e.target.value;
                  setFormData((prev: any) => ({
                    ...prev,
                    priceDetails: { ...prev.priceDetails, configurations: updated }
                  }));
                }}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
              />
              <input
                type="text"
                placeholder="Description"
                value={config.description}
                onChange={(e) => {
                  const updated = [...formData.priceDetails.configurations];
                  updated[index].description = e.target.value;
                  setFormData((prev: any) => ({
                    ...prev,
                    priceDetails: { ...prev.priceDetails, configurations: updated }
                  }));
                }}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
              />
              <button
                type="button"
                onClick={() => removeConfiguration(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Amenities</h2>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={currentAmenity}
            onChange={(e) => setCurrentAmenity(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
            placeholder="Add amenity (e.g., Swimming Pool)"
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
          />
          <button
            type="button"
            onClick={addAmenity}
            className="px-4 py-2 bg-[#005E60] text-white rounded-lg hover:bg-[#004a4d] transition-colors"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.amenities.map((amenity: string, index: number) => (
            <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-[#005E60]/10 text-[#005E60] rounded-lg">
              <span className="text-sm">{amenity}</span>
              <button
                type="button"
                onClick={() => removeAmenity(index)}
                className="hover:text-red-600 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">About Property *</h2>
        <textarea
          name="about"
          value={formData.about}
          onChange={handleChange}
          rows={6}
          required
          placeholder="Write detailed description about the property..."
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]"
        />
      </div>

      {/* Submit Button */}
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
          {loading ? 'Saving...' : initialData ? 'Update Property' : 'Create Property'}
        </button>
      </div>
    </form>
  );
}