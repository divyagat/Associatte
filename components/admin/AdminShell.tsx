'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Building2, FileText, Users, Home, Menu, X,
} from 'lucide-react';
import LogoutButton from './LogoutButton';

type Role = 'admin' | 'employee';

/** Which section links to show — for employees this reflects their granted access. */
export interface NavAccess {
  properties: boolean;
  blogs: boolean;
}

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  show: (role: Role, access: NavAccess) => boolean;
}

const NAV: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, show: () => true },
  { href: '/admin/properties', label: 'Properties', icon: Building2, show: (_r, a) => a.properties },
   { href: '/admin/projects', label: 'Projects', icon: Building2, show: (_r, a) => a.properties },
  // { href: '/admin/blogs', label: 'Blogs', icon: FileText, show: (_r, a) => a.blogs },
  { href: '/admin/employees', label: 'Employees', icon: Users, show: (role) => role === 'admin' },
];

export default function AdminShell({
  role,
  access,
  children,
}: {
  role: Role;
  access: NavAccess;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const items = NAV.filter((item) => item.show(role, access));

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  const SidebarContent = (
    <>
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-[#005E60]">Associatte Admin</h1>
        <p className="text-xs text-gray-500 mt-1">Associatte PropTech Pvt Ltd</p>
        <span
          className={`inline-block mt-3 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
            role === 'admin'
              ? 'bg-[#005E60]/10 text-[#005E60]'
              : 'bg-[#F8C21C]/15 text-[#8a6d00]'
          }`}
        >
          {role === 'admin' ? 'Main Admin' : 'Employee'}
        </span>
      </div>

      <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
        {items.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive(href)
                ? 'bg-[#005E60]/10 text-[#005E60] font-semibold'
                : 'text-gray-700 hover:bg-[#005E60]/5 hover:text-[#005E60] font-medium'
            }`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        ))}

        <div className="pt-4 mt-4 border-t border-gray-200 space-y-1.5">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-[#005E60]/5 hover:text-[#005E60] transition-colors font-medium"
          >
            <Home size={20} />
            <span>View Site</span>
          </Link>
          <LogoutButton />
        </div>
      </nav>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-50 flex items-center justify-between bg-white border-b border-gray-200 px-4 h-14">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-[#005E60]">Associatte Admin</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="p-2 -mr-2 text-gray-700 hover:text-[#005E60]"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 fixed h-full z-40 shadow-sm flex-col">
        {SidebarContent}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute left-0 top-0 h-full w-72 max-w-[85%] bg-white shadow-xl flex flex-col animate-[slideIn_0.2s_ease-out]">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-4 p-2 text-gray-500 hover:text-gray-800 z-10"
            >
              <X size={22} />
            </button>
            {SidebarContent}
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="md:ml-64 p-4 sm:p-6 lg:p-8">{children}</main>

      <style>{`@keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }`}</style>
    </div>
  );
}
