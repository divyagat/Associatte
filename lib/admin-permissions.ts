/**
 * Per-employee permission model.
 *
 * Each employee can be granted, per section (`properties`, `projects`, `blogs`), the right
 * to Add, Edit and/or Delete. The main admin always has every permission.
 */

export type AdminSection = 'properties' | 'projects' | 'blogs' | 'seo';
// `approve` = a "manager" right: publish/hide listings & approve pending
// submissions from other employees. Only meaningful for properties & projects
// (blogs have no approval queue). `seo` only uses `edit` (a single access flag).
export type AdminAction = 'add' | 'edit' | 'delete' | 'approve';

export interface SectionPermissions {
  add: boolean;
  edit: boolean;
  delete: boolean;
  approve: boolean;
}

/**
 * Actions offered per section in the permission matrix. Blogs skip `approve`;
 * SEO is a single `edit` capability (edit any page's meta tags).
 */
export function actionsForSection(section: AdminSection): AdminAction[] {
  if (section === 'seo') return ['edit'];
  return section === 'blogs' ? ['add', 'edit', 'delete'] : ['add', 'edit', 'delete', 'approve'];
}

export interface Permissions {
  properties: SectionPermissions;
  projects: SectionPermissions;
  blogs: SectionPermissions;
  seo: SectionPermissions;
}

/** Cookie holding the signed-in employee's encoded permissions. */
export const PERMS_COOKIE = 'associatte_perms';

export const ADMIN_SECTIONS: AdminSection[] = ['properties', 'projects', 'blogs', 'seo'];

// ✅ UPDATED: Added 'blogs' back so it renders in the UI and navigation
export const VISIBLE_ADMIN_SECTIONS: AdminSection[] = ['properties', 'projects', 'blogs', 'seo'];

export const ADMIN_ACTIONS: AdminAction[] = ['add', 'edit', 'delete', 'approve'];

const NONE: SectionPermissions = { add: false, edit: false, delete: false, approve: false };
const ALL: SectionPermissions = { add: true, edit: true, delete: true, approve: true };

/** The main admin has full access to everything. */
export const ADMIN_PERMISSIONS: Permissions = {
  properties: { ...ALL },
  projects: { ...ALL },
  blogs: { ...ALL },
  seo: { ...ALL },
};

/** Default pre-checked state for a brand new employee (submits, but can't approve). */
export const DEFAULT_EMPLOYEE_PERMISSIONS: Permissions = {
  properties: { add: true, edit: true, delete: true, approve: false },
  projects: { ...NONE },
  blogs: { ...NONE }, // Starts with no access, admin can grant it
  seo: { ...NONE },   // Starts with no SEO access, admin can grant it
};

export function emptyPermissions(): Permissions {
  return {
    properties: { ...NONE },
    projects: { ...NONE },
    blogs: { ...NONE },
    seo: { ...NONE }
  };
}

/** Coerce arbitrary/untrusted input into a valid Permissions object (booleans only). */
export function sanitizePermissions(input: unknown): Permissions {
  const obj = (input ?? {}) as Record<string, unknown>;
  const section = (raw: unknown): SectionPermissions => {
    const s = (raw ?? {}) as Record<string, unknown>;
    return { add: !!s.add, edit: !!s.edit, delete: !!s.delete, approve: !!s.approve };
  };
  return {
    properties: section(obj.properties),
    projects: section(obj.projects),
    blogs: section(obj.blogs), // ✅ Already safely handling blogs
    seo: section(obj.seo)
  };
}

/** Whether `perms` allows `action` in `section`. */
export function can(
  perms: Permissions | null | undefined,
  section: AdminSection,
  action: AdminAction,
): boolean {
  return !!perms?.[section]?.[action];
}

/** Whether `perms` grants ANY access to `section` (used to show/hide nav + pages). */
export function hasSectionAccess(
  perms: Permissions | null | undefined,
  section: AdminSection,
): boolean {
  const s = perms?.[section];
  return !!s && (s.add || s.edit || s.delete || s.approve);
}

/** Encode permissions for storage in a cookie. */
export function encodePermissions(perms: Permissions): string {
  return btoa(JSON.stringify(perms));
}

/** Decode a cookie value back into permissions, or null if missing/invalid. */
export function decodePermissions(value: string | undefined | null): Permissions | null {
  if (!value) return null;
  try {
    return sanitizePermissions(JSON.parse(atob(value)));
  } catch {
    return null;
  }
}