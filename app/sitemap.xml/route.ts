// app/sitemap.xml/route.ts
// Sitemap index → /sitemaps/{static,projects,blogs,locations,developers}.xml
import { sitemapIndexItems, sitemapIndexXml } from '@/lib/seo/sitemap';

export const revalidate = 600;

export async function GET() {
  const xml = sitemapIndexXml(await sitemapIndexItems());
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=600, stale-while-revalidate=3600',
    },
  });
}
