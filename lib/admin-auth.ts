import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import {
  Permissions,
  PERMS_COOKIE,
  ADMIN_PERMISSIONS,
  DEFAULT_EMPLOYEE_PERMISSIONS,
  decodePermissions,
} from './admin-permissions';

/**
 * Admin session helpers.
 *
 * Auth is cookie-based (see middleware.ts + /api/admin/login). The cookie VALUE
 * is the signed-in role: `admin` (full access) or `employee` (limited access).
 * Older sessions stored the literal string `authenticated` — we treat that as
 * `admin` for backwards compatibility so existing logins aren't kicked out.
 */
export const ADMIN_COOKIE = 'associatte_admin';

export type AdminRole = 'admin' | 'employee';

function normalize(value: string | undefined): AdminRole | null {
  if (value === 'admin' || value === 'authenticated') return 'admin';
  if (value === 'employee') return 'employee';
  return null;
}

/** Read the current role inside a Server Component / Route Handler. */
export async function getAdminRole(): Promise<AdminRole | null> {
  const store = await cookies();
  return normalize(store.get(ADMIN_COOKIE)?.value);
}

/** Read the role from a NextRequest (middleware / API routes). */
export function getRoleFromRequest(req: NextRequest): AdminRole | null {
  return normalize(req.cookies.get(ADMIN_COOKIE)?.value);
}

function permissionsFor(role: AdminRole | null, permsCookie: string | undefined): Permissions | null {
  if (role === 'admin') return ADMIN_PERMISSIONS;
  if (role === 'employee') return decodePermissions(permsCookie) ?? DEFAULT_EMPLOYEE_PERMISSIONS;
  return null;
}

/** Read the current account's permissions inside a Server Component / Route Handler. */
export async function getPermissions(): Promise<Permissions | null> {
  const store = await cookies();
  const role = normalize(store.get(ADMIN_COOKIE)?.value);
  return permissionsFor(role, store.get(PERMS_COOKIE)?.value);
}

/** Read the current account's permissions from a NextRequest (middleware / API routes). */
export function getPermissionsFromRequest(req: NextRequest): Permissions | null {
  const role = normalize(req.cookies.get(ADMIN_COOKIE)?.value);
  return permissionsFor(role, req.cookies.get(PERMS_COOKIE)?.value);
}
