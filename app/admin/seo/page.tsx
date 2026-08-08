import { getAdminRole, getPermissions } from '@/lib/admin-auth';
import { can } from '@/lib/admin-permissions';
import { SEO_PAGES } from '@/lib/seo-pages';
import { getAllSeoOverrides } from '@/lib/seo-store';
import { getAllProjects, getAllBlogs as getAdminBlogs } from '@/lib/data-store';
import { getAllBlogs as getStaticBlogs } from '@/lib/blog-data';
import { CITY_METADATA } from '../../locations/[city]/cityMetadata';
import SeoManager, { type SeoDetailGroup } from '@/components/admin/SeoManager';

export const dynamic = 'force-dynamic';

export default async function AdminSeoPage() {
  const [role, permissions] = await Promise.all([getAdminRole(), getPermissions()]);

  // Only a main admin or an employee granted the `seo` edit permission may enter.
  const allowed = role === 'admin' || can(permissions, 'seo', 'edit');
  if (!allowed) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">SEO</h1>
        <p className="text-gray-500">You don&apos;t have permission to manage SEO.</p>
      </div>
    );
  }

  const [overrides, projects, adminBlogs] = await Promise.all([
    getAllSeoOverrides(),
    getAllProjects().catch(() => []),
    getAdminBlogs().catch(() => []),
  ]);

  // Merge static + admin blogs (de-duped by slug) for the blog detail list.
  const blogMap = new Map<string, string>();
  for (const b of getStaticBlogs()) if (b?.slug) blogMap.set(b.slug, b.title || b.slug);
  for (const b of adminBlogs as any[]) if (b?.slug) blogMap.set(b.slug, b.title || b.slug);

  const detailGroups: SeoDetailGroup[] = [
    {
      key: 'projects',
      label: 'Projects / Properties',
      items: (projects as any[])
        .filter((p) => p?.slug)
        .map((p) => ({ label: p.name || p.slug, path: `/property/${p.slug}` })),
    },
    {
      key: 'blogs',
      label: 'Blog posts',
      items: Array.from(blogMap.entries()).map(([slug, title]) => ({
        label: title,
        path: `/blog/${slug}`,
      })),
    },
    {
      key: 'locations',
      label: 'Location pages',
      items: Object.entries(CITY_METADATA)
        .filter(([city]) => city !== 'default')
        .map(([city, data]) => ({ label: (data as any)?.title || city, path: `/locations/${city}` })),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">SEO Manager</h1>
        <p className="text-gray-600 mt-1">
          Set the meta title, description &amp; keywords for any page. Leave a field blank to use the
          page&apos;s built-in default. Changes go live immediately.
        </p>
      </div>

      <SeoManager staticPages={SEO_PAGES} detailGroups={detailGroups} initialOverrides={overrides} />
    </div>
  );
}
