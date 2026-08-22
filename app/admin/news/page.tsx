import { redirect } from 'next/navigation';
import { getAdminRole } from '@/lib/admin-auth';
import { getAllNews } from '@/lib/news-store';
import NewsManager from '@/components/admin/NewsManager';

export const dynamic = 'force-dynamic';

export default async function NewsAdminPage() {
  // Middleware already blocks employees, but guard here too (defense in depth).
  const role = await getAdminRole();
  if (role !== 'admin') redirect('/admin');

  const items = await getAllNews();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Real Estate News</h1>
        <p className="text-gray-600 mt-1">
          Manage the news stories shown on the home page and the <code>/news</code> page.
          Changes go live on the website immediately.
        </p>
      </div>

      <NewsManager initialItems={items} />
    </div>
  );
}
