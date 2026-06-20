import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

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
