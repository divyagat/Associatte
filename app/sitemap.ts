import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.associatte.com';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  // Fetch dynamic content (with fallbacks).
  // Coerce to an array: the API may be down (rejects), or may return an
  // object/error payload instead of an array — either way we must not .map() it.
  const toArray = (value: unknown): any[] => {
    if (Array.isArray(value)) return value;
    if (value && typeof value === 'object') {
      const obj = value as Record<string, unknown>;
      if (Array.isArray(obj.data)) return obj.data;
      if (Array.isArray(obj.properties)) return obj.properties;
      if (Array.isArray(obj.projects)) return obj.projects;
    }
    return [];
  };

  const [propertiesRaw, projectsRaw] = await Promise.all([
    fetch(`${apiUrl}/properties`).then(res => res.json()).catch(() => []),
    fetch(`${apiUrl}/projects`).then(res => res.json()).catch(() => [])
  ]);

  const properties = toArray(propertiesRaw);
  const projects = toArray(projectsRaw);

  const locations = ['mumbai', 'pune', 'kharghar', 'navi-mumbai', 'sus-pune'];

  return [
    // 🏠 Static pages
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/builders`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    
    // 🏢 Dynamic property pages (your core SEO pages!)
    ...properties.map((property: any) => ({
      url: `${baseUrl}/property/${property.slug}`,
      lastModified: property.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    
    // 🏗️ Dynamic project pages
    ...projects.map((project: any) => ({
      url: `${baseUrl}/project/${project.slug}`,
      lastModified: project.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    
    // 📍 Location landing pages
    ...locations.map((location) => ({
      url: `${baseUrl}/locations/${location}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    })),
  ];
}