// client/lib/projects.ts
import propertiesData from '@/data/properties.json';

export type Project = typeof propertiesData[0];

// ✅ Get all projects
export function getAllProjects(): Project[] {
  return propertiesData;
}

// ✅ Get project by slug
export function getProjectBySlug(slug: string): Project | undefined {
  return propertiesData.find((p: Project) => p.slug === slug);
}

// ✅ Get projects by city/location
export function getProjectsByLocation(location: string): Project[] {
  return propertiesData.filter((p: Project) => 
    p.location.toLowerCase() === location.toLowerCase()
  );
}

// ✅ Get featured projects (has detailed data + image)
export function getFeaturedProjects(limit = 8): Project[] {
  return propertiesData
    .filter((p: Project) => p.image && p.priceDetails?.range)
    .slice(0, limit);
}

// ✅ Get unique cities
export function getAllCities(): string[] {
  return [...new Set(propertiesData.map((p: Project) => p.location))].sort();
}

// ✅ Search projects by query
export function searchProjects(query: string): Project[] {
  const q = query.toLowerCase();
  return propertiesData.filter((p: Project) => 
    p.name.toLowerCase().includes(q) ||
    p.fullLocation?.area?.toLowerCase().includes(q) ||
    p.fullLocation?.city?.toLowerCase().includes(q) ||
    p.developer?.name?.toLowerCase().includes(q)
  );
}