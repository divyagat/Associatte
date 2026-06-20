import { ReactNode } from 'react';
import { getAdminRole } from '@/lib/admin-auth';
import AdminShell from '@/components/admin/AdminShell';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const role = await getAdminRole();

  // When signed out, middleware only allows the /admin/login page through.
  // Render it without the dashboard chrome (sidebar).
  if (!role) {
    return <>{children}</>;
  }

  return <AdminShell role={role}>{children}</AdminShell>;
}
