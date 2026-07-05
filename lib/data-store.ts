import { promises as fs } from 'fs';
import path from 'path';
import type { IProperty } from './models/Property';
import type { IBlog } from './models/Blog';

/**
 * File-based data store.
 *
 * Properties are persisted to `data/properties.json` — the SAME file the public
 * pages (/projects, /properties, property detail, locations, builders, etc.)
 * already read. So anything added through the admin panel shows up on the site.
 *
 * Projects are persisted to `data/projects.json`.
 *
 * Blogs are persisted to `data/blogs.json`. The blog listing/detail pages merge
 * these on top of the static blogs in `lib/blog-data.ts`, so existing blogs are
 * untouched and admin blogs appear alongside them.
 *
 * No database / network is required — this works fully offline and removes the
 * MongoDB Atlas connection that was failing (IP whitelist / placeholder URI).
 */

const DATA_DIR = path.join(process.cwd(), 'data');
const PROPERTIES_FILE = path.join(DATA_DIR, 'properties.json');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json'); // 👈 ADDED
const BLOGS_FILE = path.join(DATA_DIR, 'blogs.json');

// ==================== LOW-LEVEL FILE HELPERS ====================
async function readArray<T = any>(file: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(file, 'utf-8');
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    if (error?.code === 'ENOENT') return []; // file doesn't exist yet
    console.error(`❌ Failed to read ${path.basename(file)}:`, error.message);
    return [];
  }
}

async function writeArray<T = any>(file: string, data: T[]): Promise<void> {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf-8');
}

// Ensure every record has a stable id (admin/blog UIs use `_id`).
function withId<T extends { slug?: string; _id?: string }>(record: T): T {
  return { ...record, _id: record._id || record.slug } as T;
}

// ==================== PROPERTIES ====================
export async function getAllProperties(): Promise<IProperty[]> {
  const properties = await readArray(PROPERTIES_FILE);
  return properties.map(withId) as any;
}

export async function getPropertyBySlug(slug: string): Promise<IProperty | null> {
  const properties = await readArray(PROPERTIES_FILE);
  const property = properties.find((p: any) => p.slug === slug);
  return property ? (withId(property) as any) : null;
}

export async function createProperty(propertyData: Partial<IProperty>): Promise<IProperty> {
  const properties = await readArray(PROPERTIES_FILE);

  if (properties.some((p: any) => p.slug === propertyData.slug)) {
    throw new Error('Property with this slug already exists');
  }

  const now = new Date().toISOString();
  const property = withId({
    ...propertyData,
    createdAt: now,
    updatedAt: now,
  } as any);

  // Newest first so it surfaces at the top of the projects grid.
  properties.unshift(property);
  await writeArray(PROPERTIES_FILE, properties);
  return property as any;
}

export async function updateProperty(slug: string, updates: Partial<IProperty>): Promise<IProperty | null> {
  const properties = await readArray(PROPERTIES_FILE);
  const index = properties.findIndex((p: any) => p.slug === slug);
  if (index === -1) return null;

  const updated = withId({
    ...properties[index],
    ...updates,
    slug: properties[index].slug, // slug is the identifier, keep it stable
    updatedAt: new Date().toISOString(),
  });
  properties[index] = updated;
  await writeArray(PROPERTIES_FILE, properties);
  return updated as any;
}

export async function deleteProperty(slug: string): Promise<boolean> {
  const properties = await readArray(PROPERTIES_FILE);
  const next = properties.filter((p: any) => p.slug !== slug);
  if (next.length === properties.length) return false;
  await writeArray(PROPERTIES_FILE, next);
  return true;
}

// ==================== PROJECTS ==================== 👈 ADDED ENTIRE SECTION
export async function getAllProjects(): Promise<any[]> {
  const projects = await readArray(PROJECTS_FILE);
  return projects.map(withId) as any;
}

export async function getProjectBySlug(slug: string): Promise<any | null> {
  const projects = await readArray(PROJECTS_FILE);
  const project = projects.find((p: any) => p.slug === slug);
  return project ? (withId(project) as any) : null;
}

export async function createProject(projectData: any): Promise<any> {
  const projects = await readArray(PROJECTS_FILE);

  if (projects.some((p: any) => p.slug === projectData.slug)) {
    throw new Error('Project with this slug already exists');
  }

  const now = new Date().toISOString();
  const project = withId({
    ...projectData,
    createdAt: now,
    updatedAt: now,
  } as any);

  // Newest first
  projects.unshift(project);
  await writeArray(PROJECTS_FILE, projects);
  return project as any;
}

export async function updateProject(slug: string, updates: any): Promise<any | null> {
  const projects = await readArray(PROJECTS_FILE);
  const index = projects.findIndex((p: any) => p.slug === slug);
  if (index === -1) return null;

  const updated = withId({
    ...projects[index],
    ...updates,
    slug: projects[index].slug, // slug is the identifier, keep it stable
    updatedAt: new Date().toISOString(),
  });
  projects[index] = updated;
  await writeArray(PROJECTS_FILE, projects);
  return updated as any;
}

export async function deleteProject(slug: string): Promise<boolean> {
  const projects = await readArray(PROJECTS_FILE);
  const next = projects.filter((p: any) => p.slug !== slug);
  if (next.length === projects.length) return false;
  await writeArray(PROJECTS_FILE, next);
  return true;
}

// ==================== BLOGS ====================
export async function getAllBlogs(): Promise<IBlog[]> {
  const blogs = await readArray(BLOGS_FILE);
  return blogs.map(withId) as any;
}

export async function getBlogBySlug(slug: string): Promise<IBlog | null> {
  const blogs = await readArray(BLOGS_FILE);
  const blog = blogs.find((b: any) => b.slug === slug);
  return blog ? (withId(blog) as any) : null;
}

export async function createBlog(blogData: Partial<IBlog>): Promise<IBlog> {
  const blogs = await readArray(BLOGS_FILE);

  if (blogs.some((b: any) => b.slug === blogData.slug)) {
    throw new Error('Blog with this slug already exists');
  }

  const now = new Date().toISOString();
  const blog = withId({
    ...blogData,
    tags: blogData.tags || [],
    relatedSlugs: blogData.relatedSlugs || [],
    createdAt: now,
    updatedAt: now,
  } as any);

  blogs.unshift(blog);
  await writeArray(BLOGS_FILE, blogs);
  return blog as any;
}

export async function updateBlog(slug: string, updates: Partial<IBlog>): Promise<IBlog | null> {
  const blogs = await readArray(BLOGS_FILE);
  const index = blogs.findIndex((b: any) => b.slug === slug);
  if (index === -1) return null;

  const updated = withId({
    ...blogs[index],
    ...updates,
    slug: blogs[index].slug,
    updatedAt: new Date().toISOString(),
  });
  blogs[index] = updated;
  await writeArray(BLOGS_FILE, blogs);
  return updated as any;
}

export async function deleteBlog(slug: string): Promise<boolean> {
  const blogs = await readArray(BLOGS_FILE);
  const next = blogs.filter((b: any) => b.slug !== slug);
  if (next.length === blogs.length) return false;
  await writeArray(BLOGS_FILE, next);
  return true;
}

// ==================== HELPER FUNCTIONS ====================
export async function getPropertiesByLocation(location: string): Promise<IProperty[]> {
  const properties = await getAllProperties();
  return properties.filter((p: any) => p.location === location) as any;
}

export async function getBlogsByCategory(category: string): Promise<IBlog[]> {
  const blogs = await getAllBlogs();
  return blogs.filter((b: any) => b.category === category) as any;
}

export async function searchProperties(query: string): Promise<IProperty[]> {
  const q = query.toLowerCase();
  const properties = await getAllProperties();
  return properties.filter((p: any) =>
    p.name?.toLowerCase().includes(q) ||
    p.fullLocation?.area?.toLowerCase().includes(q) ||
    p.developer?.name?.toLowerCase().includes(q)
  ) as any;
}

export async function searchBlogs(query: string): Promise<IBlog[]> {
  const q = query.toLowerCase();
  const blogs = await getAllBlogs();
  return blogs.filter((b: any) =>
    b.title?.toLowerCase().includes(q) ||
    b.excerpt?.toLowerCase().includes(q) ||
    b.category?.toLowerCase().includes(q) ||
    (Array.isArray(b.tags) && b.tags.some((t: string) => t.toLowerCase().includes(q)))
  ) as any;
}