import { getSiteConfig } from '@/lib/data-store';
import { getAdminRole } from '@/lib/admin-auth';
import CategoryVisibilityManager from '@/components/admin/CategoryVisibilityManager';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const [role, config] = await Promise.all([getAdminRole(), getSiteConfig()]);

  // Category visibility is a main-admin control only.
  if (role !== 'admin') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-500">Only the main admin can manage site settings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Site Settings</h1>
        <p className="text-gray-600 mt-1">Control which categories appear on the public website.</p>
      </div>

      <CategoryVisibilityManager
        initialHiddenTypes={config.hiddenTypes}
        initialHiddenDeals={config.hiddenDeals}
      />
    </div>
  );
}
