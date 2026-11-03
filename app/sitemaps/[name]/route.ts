// app/sitemaps/[name]/route.ts
// One sitemap per content type: /sitemaps/projects.xml, /sitemaps/blogs.xml, …
// Large types split into /sitemaps/projects-2.xml etc. (see lib/seo/sitemap).
import { MAX_URLS_PER_SITEMAP, parseSitemapName, sitemapEntries, urlsetXml } from '@/lib/seo/sitemap';

export const revalidate = 600;

export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const parsed = parseSitemapName(name);
  if (!parsed) return new Response('Not found', { status: 404, headers: { 'X-Robots-Tag': 'noindex' } });

  const all = await sitemapEntries(parsed.type);
  const entries = all.slice((parsed.page - 1) * MAX_URLS_PER_SITEMAP, parsed.page * MAX_URLS_PER_SITEMAP);
  if (!entries.length) return new Response('Not found', { status: 404, headers: { 'X-Robots-Tag': 'noindex' } });

  return new Response(urlsetXml(entries), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=600, stale-while-revalidate=3600',
    },
  });
}
