/**
 * Per-employee permission model.
 *
 * Each employee can be granted, per section (`properties`, `projects`), the right
 * to Add, Edit and/or Delete. The main admin always has every permission.
 */

export type AdminSection = 'properties' | 'projects'; // 'blogs' commented out
export type AdminAction = 'add' | 'edit' | 'delete';

export interface SectionPermissions {
  add: boolean;
  edit: boolean;
  delete: boolean;
}

export interface Permissions {
  properties: SectionPermissions;
  projects: SectionPermissions;
  // blogs: SectionPermissions;
}

/** Cookie holding the signed-in employee's encoded permissions. */
export const PERMS_COOKIE = 'associatte_perms';

export const ADMIN_SECTIONS: AdminSection[] = ['properties', 'projects'];
export const ADMIN_ACTIONS: AdminAction[] = ['add', 'edit', 'delete'];

const NONE: SectionPermissions = { add: false, edit: false, delete: false };
const ALL: SectionPermissions = { add: true, edit: true, delete: true };

/** The main admin has full access to everything. */
export const ADMIN_PERMISSIONS: Permissions = {
  properties: { ...ALL },
  projects: { ...ALL },
  // blogs: { ...ALL },
};

/** Default pre-checked state for a brand new employee */
export const DEFAULT_EMPLOYEE_PERMISSIONS: Permissions = {
  properties: { add: true, edit: true, delete: false },
  projects: { ...NONE },
  // blogs: { ...NONE },
};

export function emptyPermissions(): Permissions {
  return { 
    properties: { ...NONE }, 
    projects: { ...NONE }
  };
}

/** Coerce arbitrary/untrusted input into a valid Permissions object (booleans only). */
export function sanitizePermissions(input: unknown): Permissions {
  const obj = (input ?? {}) as Record<string, unknown>;
  const section = (raw: unknown): SectionPermissions => {
    const s = (raw ?? {}) as Record<string, unknown>;
    return { add: !!s.add, edit: !!s.edit, delete: !!s.delete };
  };
  return { 
    properties: section(obj.properties), 
    projects: section(obj.projects)
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
  return !!s && (s.add || s.edit || s.delete);
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