import { ReactNode } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, Building2, FileText, 
  LogOut, Settings, Users
} from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-40 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-[#005E60]">Associatte Admin</h1>
          <p className="text-xs text-gray-500 mt-1">Associatte PropTech Pvt Ltd</p>
        </div>
        
        <nav className="p-4 space-y-2">
          <Link 
            href="/admin" 
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-[#005E60]/5 hover:text-[#005E60] transition-colors"
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </Link>
          
          <Link 
            href="/admin/properties" 
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-[#005E60]/5 hover:text-[#005E60] transition-colors"
          >
            <Building2 size={20} />
            <span className="font-medium">Properties</span>
          </Link>
          
          <Link 
            href="/admin/blogs" 
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-[#005E60]/5 hover:text-[#005E60] transition-colors"
          >
            <FileText size={20} />
            <span className="font-medium">Blogs</span>
          </Link>
          
          <div className="pt-4 mt-4 border-t border-gray-200">
            <Link 
              href="/" 
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Exit Admin</span>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}