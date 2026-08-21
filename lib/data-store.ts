// lib/data-store.ts

import type { IProperty } from './models/Property';
import type { IBlog } from './models/Blog';
import { readJson, writeJson } from './blob-store';
import { DEFAULT_PROPERTY_TYPES, type PropertyType, type CategorySection } from './categories';
import { MAIN_NAV_SECTION_IDS } from './nav-sections';

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
 * Persistence is handled by lib/blob-store, which stores each of these JSON
 * documents in MongoDB. This works on any host (Vercel, VPS, etc.) — only the
 * MongoDB connection is required, no writable filesystem or host-specific store.
 */

// Storage keys (relative to the project root). These map to committed seed
// files locally and to Vercel Blob objects in production — see lib/blob-store.
const PROPERTIES_FILE = 'data/properties.json';
const PROJECTS_FILE = 'data/projects.json';
const BLOGS_FILE = 'data/blogs.json';
const SITE_CONFIG_FILE = 'data/site-config.json';
const LEADS_FILE = 'data/leads.json';

// ==================== LOW-LEVEL FILE HELPERS ====================
async function readArray<T = any>(file: string): Promise<T[]> {
  const data = await readJson<T[]>(file, []);
  return Array.isArray(data) ? data : [];
}

async function writeArray<T = any>(file: string, data: T[]): Promise<void> {
  await writeJson(file, data);
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

// ==================== PROJECTS ====================
export async function getAllProjects(): Promise<any[]> {
  const projects = await readArray(PROJECTS_FILE);
  console.log(`📊 getAllProjects: Found ${projects.length} projects`);
  return projects.map(withId) as any;
}

export async function getProjectBySlug(slug: string): Promise<any | null> {
  console.log('🔍 getProjectBySlug called with slug:', slug);
  console.log('🔍 Slug type:', typeof slug);
  console.log('🔍 Slug length:', slug?.length);
  
  // Decode the slug (handles URL encoding)
  const decodedSlug = decodeURIComponent(slug).trim();
  console.log('📝 Decoded slug:', decodedSlug);
  
  const projects = await readArray(PROJECTS_FILE);
  console.log(`📦 Total projects in file: ${projects.length}`);
  
  if (projects.length === 0) {
    console.log('⚠️ No projects found in the file');
    return null;
  }
  
  console.log('📋 Available projects:', projects.map((p: any) => ({ 
    slug: p.slug, 
    name: p.name,
    id: p._id || p.id 
  })));
  
  // Try multiple matching strategies
  let project = null;
  
  // 1. Direct match (exact)
  project = projects.find((p: any) => p.slug === decodedSlug);
  if (project) {
    console.log('✅ Found project with direct match');
  }
  
  // 2. Case-insensitive match
  if (!project) {
    project = projects.find((p: any) => 
      p.slug?.toLowerCase() === decodedSlug.toLowerCase()
    );
    if (project) {
      console.log('✅ Found project with case-insensitive match');
    }
  }
  
  // 3. Try matching by ID (if slug looks like an ID)
  if (!project) {
    project = projects.find((p: any) => 
      p._id === decodedSlug || p.id === decodedSlug
    );
    if (project) {
      console.log('✅ Found project by ID');
    }
  }
  
  // 4. Try matching by name (if slug is actually a name)
  if (!project) {
    project = projects.find((p: any) => 
      p.name?.toLowerCase() === decodedSlug.toLowerCase()
    );
    if (project) {
      console.log('✅ Found project by name');
    }
  }
  
  // 5. Try partial match (if slug contains part of the name)
  if (!project) {
    project = projects.find((p: any) => 
      p.name?.toLowerCase().includes(decodedSlug.toLowerCase()) ||
      decodedSlug.toLowerCase().includes(p.name?.toLowerCase())
    );
    if (project) {
      console.log('✅ Found project by partial name match');
    }
  }
  
  if (project) {
    console.log('✅ Project found:', project.name, 'with slug:', project.slug);
    return withId(project) as any;
  } else {
    console.log('❌ No project found with slug:', decodedSlug);
    console.log('💡 Available slugs:', projects.map((p: any) => p.slug).join(', '));
    return null;
  }
}

export async function createProject(projectData: any): Promise<any> {
  // ✅ FIX: Clean the slug before saving to ensure consistency with getProjectBySlug
  if (projectData.slug) {
    projectData.slug = decodeURIComponent(projectData.slug).trim();
  }

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
  console.log('✅ Created new project:', project.name, 'with slug:', project.slug);
  return project as any;
}

export async function updateProject(slug: string, updates: any): Promise<any | null> {
  // ✅ FIX: Decode and trim the slug to match getProjectBySlug behavior
  const decodedSlug = decodeURIComponent(slug).trim();
  console.log('🔄 updateProject called with slug:', decodedSlug);
  
  const projects = await readArray(PROJECTS_FILE);
  
  // ✅ FIX: Use case-insensitive match just in case
  const index = projects.findIndex((p: any) => 
    p.slug === decodedSlug || p.slug?.toLowerCase() === decodedSlug.toLowerCase()
  );
  
  if (index === -1) {
    console.log('❌ Project not found for update with slug:', decodedSlug);
    console.log('💡 Available slugs:', projects.map((p: any) => p.slug).join(', '));
    return null;
  }

  const updated = withId({
    ...projects[index],
    ...updates,
    slug: projects[index].slug, // slug is the identifier, keep it stable
    updatedAt: new Date().toISOString(),
  });
  projects[index] = updated;
  await writeArray(PROJECTS_FILE, projects);
  console.log('✅ Updated project:', updated.name);
  return updated as any;
}

export async function deleteProject(slug: string): Promise<boolean> {
  // ✅ FIX: Decode and trim the slug to match getProjectBySlug behavior
  const decodedSlug = decodeURIComponent(slug).trim();
  console.log('🗑️ deleteProject called with slug:', decodedSlug);
  
  const projects = await readArray(PROJECTS_FILE);
  
  // ✅ FIX: Use case-insensitive match to ensure it actually deletes
  const next = projects.filter((p: any) => 
    p.slug !== decodedSlug && p.slug?.toLowerCase() !== decodedSlug.toLowerCase()
  );
  
  if (next.length === projects.length) {
    console.log('❌ Project not found for deletion with slug:', decodedSlug);
    console.log('💡 Available slugs:', projects.map((p: any) => p.slug).join(', '));
    return false;
  }
  await writeArray(PROJECTS_FILE, next);
  console.log('✅ Deleted project with slug:', decodedSlug);
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

// ==================== LEADS ====================
// Phone leads captured from the site (e.g. the "Instant Property Alert" form on
// the /calculator page). Persisted to `data/leads.json` and surfaced in the
// admin panel under /admin/leads. Newest first.
export interface ILead {
  _id: string;
  phone: string;
  source: string;
  intent: string;
  capturedAt: string;
  createdAt: string;
}

export async function getAllLeads(): Promise<ILead[]> {
  const leads = await readArray<ILead>(LEADS_FILE);
  // Defensive: always newest first regardless of stored order.
  return [...leads].sort(
    (a, b) => new Date(b.capturedAt || b.createdAt).getTime() - new Date(a.capturedAt || a.createdAt).getTime(),
  );
}

export async function createLead(data: Partial<ILead>): Promise<ILead> {
  const leads = await readArray<ILead>(LEADS_FILE);
  const now = new Date().toISOString();
  const lead: ILead = {
    _id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    phone: String(data.phone ?? ''),
    source: data.source || 'website',
    intent: data.intent || 'general',
    capturedAt: data.capturedAt || now,
    createdAt: now,
  };
  leads.unshift(lead);
  await writeArray(LEADS_FILE, leads);
  return lead;
}

export async function deleteLead(id: string): Promise<boolean> {
  const leads = await readArray<ILead>(LEADS_FILE);
  const next = leads.filter((l) => l._id !== id);
  if (next.length === leads.length) return false;
  await writeArray(LEADS_FILE, next);
  return true;
}

// ==================== SITE CONFIG ====================
// Admin-controlled category settings.
//   • `propertyTypes` is the editable master list of property TYPES (each tagged
//     with the nav section it appears under). Admins add/rename/delete these.
//   • `hiddenTypes` are project-type ids hidden from the Projects nav.
//   • `hiddenDeals` are Properties-tab ids (deal or type) hidden from that nav.
export interface SiteConfig {
  hiddenTypes: string[];
  hiddenDeals: string[];
  propertyTypes: PropertyType[];
  // Top-level public nav sections hidden from the header (ids in MAIN_NAV_SECTIONS).
  hiddenSections: string[];
}

const DEFAULT_SITE_CONFIG: SiteConfig = {
  hiddenTypes: [],
  hiddenDeals: [],
  propertyTypes: DEFAULT_PROPERTY_TYPES,
  hiddenSections: [],
};

// Coerce persisted data into a clean PropertyType[]; falls back to defaults when
// nothing valid is stored (so a fresh/empty config still behaves as before).
function normalizePropertyTypes(raw: any): PropertyType[] {
  if (!Array.isArray(raw)) return DEFAULT_PROPERTY_TYPES;
  const cleaned = raw
    .map((t: any) => {
      const id = String(t?.id || '').toLowerCase().trim();
      if (!id) return null;
      const section: CategorySection = t?.section === 'properties' ? 'properties' : 'projects';
      return {
        id,
        label: String(t?.label || id),
        color: String(t?.color || '#005E60'),
        section,
      } as PropertyType;
    })
    .filter(Boolean) as PropertyType[];
  // De-dupe by id, keep first occurrence.
  const seen = new Set<string>();
  const unique = cleaned.filter((t) => (seen.has(t.id) ? false : (seen.add(t.id), true)));
  return unique.length ? unique : DEFAULT_PROPERTY_TYPES;
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const data = await readJson<any>(SITE_CONFIG_FILE, { ...DEFAULT_SITE_CONFIG });
  return {
    hiddenTypes: Array.isArray(data?.hiddenTypes) ? data.hiddenTypes.map(String) : [],
    hiddenDeals: Array.isArray(data?.hiddenDeals) ? data.hiddenDeals.map(String) : [],
    propertyTypes: normalizePropertyTypes(data?.propertyTypes),
    hiddenSections: Array.isArray(data?.hiddenSections)
      ? data.hiddenSections.map(String).filter((id: string) => MAIN_NAV_SECTION_IDS.includes(id))
      : [],
  };
}

export async function updateSiteConfig(patch: Partial<SiteConfig>): Promise<SiteConfig> {
  const current = await getSiteConfig();
  const propertyTypes = patch.propertyTypes !== undefined
    ? normalizePropertyTypes(patch.propertyTypes)
    : current.propertyTypes;
  // Valid ids for hidden filtering = the (possibly new) type ids + deal ids.
  const validHiddenTypeIds = new Set(propertyTypes.filter((t) => t.section === 'projects').map((t) => t.id));
  const validHiddenDealIds = new Set([
    'sale', 'rent',
    ...propertyTypes.filter((t) => t.section === 'properties').map((t) => t.id),
  ]);
  const next: SiteConfig = {
    propertyTypes,
    hiddenTypes: (Array.isArray(patch.hiddenTypes) ? patch.hiddenTypes.map(String) : current.hiddenTypes)
      .filter((id) => validHiddenTypeIds.has(id)),
    hiddenDeals: (Array.isArray(patch.hiddenDeals) ? patch.hiddenDeals.map(String) : current.hiddenDeals)
      .filter((id) => validHiddenDealIds.has(id)),
    hiddenSections: (Array.isArray(patch.hiddenSections) ? patch.hiddenSections.map(String) : current.hiddenSections)
      .filter((id) => MAIN_NAV_SECTION_IDS.includes(id)),
  };
  await writeJson(SITE_CONFIG_FILE, next);
  return next;
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