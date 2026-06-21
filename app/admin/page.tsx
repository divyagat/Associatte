/* eslint-disable @next/next/no-img-element -- admin previews render arbitrary uploaded image URLs (incl. blob:) that next/image can't optimize */
import { getAllProperties, getAllBlogs } from '@/lib/data-store';
import { getAdminRole, getPermissions } from '@/lib/admin-auth';
import { hasSectionAccess } from '@/lib/admin-permissions';
import { Building2, FileText, MapPin } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [role, permissions] = await Promise.all([getAdminRole(), getPermissions()]);
  // Only show blog stats to accounts that can manage blogs.
  const showBlogs = hasSectionAccess(permissions, 'blogs');

  const [properties, blogs] = await Promise.all([
    getAllProperties(),
    showBlogs ? getAllBlogs() : Promise.resolve([]),
  ]);

  const puneCount = properties.filter(p => p.location === 'pune').length;
  const mumbaiCount = properties.filter(p => p.location === 'mumbai').length;

  const stats = [
    {
      title: 'Total Properties',
      value: properties.length,
      icon: Building2,
      color: 'bg-[#005E60]',
      change: '+12%'
    },
    ...(showBlogs ? [{
      title: 'Total Blogs',
      value: blogs.length,
      icon: FileText,
      color: 'bg-[#F8C21C]',
      change: '+8%'
    }] : []),
    {
      title: 'Pune Properties',
      value: puneCount,
      icon: MapPin,
      color: 'bg-blue-500',
      change: '+5%'
    },
    {
      title: 'Mumbai Properties',
      value: mumbaiCount,
      icon: MapPin,
      color: 'bg-green-500',
      change: '+3%'
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Associatte Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome to Associatte PropTech Admin Panel{role === 'employee' ? ' — Employee access' : ''}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="text-white" size={24} />
              </div>
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-sm text-gray-600 mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className={`grid grid-cols-1 ${showBlogs ? 'lg:grid-cols-2' : ''} gap-6`}>
        {/* Recent Properties */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Properties</h2>
          <div className="space-y-3">
            {properties.slice(0, 5).map((property) => (
              <div key={property.slug} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <img 
                  src={property.image} 
                  alt={property.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{property.name}</h3>
                  <p className="text-sm text-gray-500">{property.fullLocation.area}, {property.fullLocation.city}</p>
                </div>
                <span className="text-sm font-semibold text-[#005E60]">{property.priceDetails.range}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Blogs — only for accounts with blog access */}
        {showBlogs && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Blogs</h2>
          <div className="space-y-3">
            {blogs.slice(0, 5).map((blog) => (
              <div key={blog.slug} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <img 
                  src={blog.image} 
                  alt={blog.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{blog.title}</h3>
                  <p className="text-sm text-gray-500">{blog.category} • {blog.readTime}</p>
                </div>
                <span className="text-xs text-gray-500">{blog.date}</span>
              </div>
            ))}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}