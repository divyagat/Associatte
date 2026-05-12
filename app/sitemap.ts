import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://propfinder.in';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  // Fetch dynamic content (with fallbacks)
  const [properties, projects] = await Promise.all([
    fetch(`${apiUrl}/properties`).then(res => res.json()).catch(() => []),
    fetch(`${apiUrl}/projects`).then(res => res.json()).catch(() => [])
  ]);

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
      changeFrequency: 'weekly',
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
      changeFrequency: 'weekly',
      priority: 0.8,
    })),
    
    // 🏗️ Dynamic project pages
    ...projects.map((project: any) => ({
      url: `${baseUrl}/project/${project.slug}`,
      lastModified: project.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })),
    
    // 📍 Location landing pages
    ...locations.map((location) => ({
      url: `${baseUrl}/locations/${location}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.75,
    })),
  ];
}