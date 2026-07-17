import { MetadataRoute } from 'next'
import { getAllProperties, getAllProjects, getAllBlogs } from '@/lib/data-store'
import { isPubliclyVisible } from '@/lib/visibility'

// Regenerate the sitemap periodically so newly added properties/blogs get indexed.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.associatte.com';

  // Read straight from the local JSON data store (the real source of truth) rather
  // than an external API. The previous version fetched http://localhost:4000, which
  // never resolves in production — so every property/project/blog page was silently
  // dropped from the sitemap.
  const [properties, projects, blogs] = await Promise.all([
    getAllProperties().catch(() => []),
    getAllProjects().catch(() => []),
    getAllBlogs().catch(() => []),
  ]);

  const lastModified = (value: unknown): Date => {
    if (typeof value === 'string' || typeof value === 'number') {
      const d = new Date(value);
      if (!isNaN(d.getTime())) return d;
    }
    return new Date();
  };

  // Only the cities the /locations/[city] route actually supports.
  const locations = ['pune', 'mumbai', 'kdmc'];

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/properties`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/projects`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/buy`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/builders`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/about-us`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact-us`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];

  const propertyPages: MetadataRoute.Sitemap = properties
    .filter((p: any) => p?.slug && isPubliclyVisible(p))
    .map((p: any) => ({
      url: `${baseUrl}/property/${p.slug}`,
      lastModified: lastModified(p.updatedAt),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

  const projectPages: MetadataRoute.Sitemap = projects
    .filter((p: any) => p?.slug && isPubliclyVisible(p))
    .map((p: any) => ({
      // Route is /projects/[slug] (plural) — the old sitemap used /project/ and 404'd.
      url: `${baseUrl}/projects/${p.slug}`,
      lastModified: lastModified(p.updatedAt),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

  const blogPages: MetadataRoute.Sitemap = blogs
    .filter((b: any) => b?.slug)
    .map((b: any) => ({
      url: `${baseUrl}/blog/${b.slug}`,
      lastModified: lastModified(b.updatedAt || b.date || b.publishedAt),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

  const locationPages: MetadataRoute.Sitemap = locations.map((location) => ({
    url: `${baseUrl}/locations/${location}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  return [
    ...staticPages,
    ...propertyPages,
    ...projectPages,
    ...blogPages,
    ...locationPages,
  ];
}
