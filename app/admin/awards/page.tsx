import { redirect } from 'next/navigation';
import { getAdminRole } from '@/lib/admin-auth';
import { getAllAwards } from '@/lib/awards-store';
import AwardsManager from '@/components/admin/AwardsManager';

export const dynamic = 'force-dynamic';

export default async function AwardsAdminPage() {
  // Middleware already blocks employees, but guard here too (defense in depth).
  const role = await getAdminRole();
  if (role !== 'admin') redirect('/admin');

  const items = await getAllAwards();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Awards &amp; Recognition</h1>
        <p className="text-gray-600 mt-1">
          Manage the framed awards shown on the home page and the <code>/awards</code> page.
          Upload a photo or certificate for each award. Changes go live immediately.
        </p>
      </div>

      <AwardsManager initialItems={items} />
    </div>
  );
}
