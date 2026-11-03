// app/robots.ts
import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/site';

// Crawl everything public. Private areas are blocked; /_next/ is NOT blocked
// because Google needs the CSS/JS there to render pages. Test/utility pages
// are kept out of the index with a noindex meta tag instead of a Disallow
// (a Disallow would stop Google from ever seeing the noindex).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      // Admin-uploaded images are served from /api/images/<id>; keep them crawlable.
      allow: ['/', '/api/images/'],
      disallow: ['/admin', '/admin/', '/api/', '/user/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
