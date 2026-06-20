import { redirect } from 'next/navigation';
import { getEmployees } from '@/lib/admin-users';
import { getAdminRole } from '@/lib/admin-auth';
import EmployeeManager from '@/components/admin/EmployeeManager';

export const dynamic = 'force-dynamic';

export default async function EmployeesPage() {
  // Middleware already blocks employees, but guard here too (defense in depth).
  const role = await getAdminRole();
  if (role !== 'admin') redirect('/admin');

  const employees = await getEmployees();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Employees</h1>
        <p className="text-gray-600 mt-1">Create and manage limited-access staff logins</p>
      </div>

      <EmployeeManager initialEmployees={employees} />
    </div>
  );
}
