import { projects } from "@/data/projects";

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getProjectsByCity(city: string) {
  return projects.filter((p) => p.city === city);
}