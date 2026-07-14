import { ReactNode } from 'react';
import { getAdminRole, getPermissions } from '@/lib/admin-auth';
import { hasSectionAccess } from '@/lib/admin-permissions';
import AdminShell from '@/components/admin/AdminShell';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const [role, permissions] = await Promise.all([getAdminRole(), getPermissions()]);

  // When signed out, middleware only allows the /admin/login page through.
  // Render it without the dashboard chrome (sidebar).
  if (!role) {
    return <>{children}</>;
  }

  const access = {
    properties: hasSectionAccess(permissions, 'properties'),
    projects: hasSectionAccess(permissions, 'projects'),
    blogs: hasSectionAccess(permissions, 'blogs'),
  };

  return <AdminShell role={role} access={access}>{children}</AdminShell>;
}
