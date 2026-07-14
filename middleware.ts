import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  AdminSection,
  AdminAction,
  Permissions,
  PERMS_COOKIE,
  DEFAULT_EMPLOYEE_PERMISSIONS,
  decodePermissions,
  can,
  hasSectionAccess,
} from '@/lib/admin-permissions';

// Name of the admin session cookie (set in /api/admin/login). Its value is the
// signed-in role: `admin`, `employee`, or legacy `authenticated` (== admin).
export const ADMIN_COOKIE = 'associatte_admin';

function roleFromCookie(value: string | undefined): 'admin' | 'employee' | null {
  if (value === 'admin' || value === 'authenticated') return 'admin';
  if (value === 'employee') return 'employee';
  return null;
}

// Routes only the main admin may ever reach.
const ADMIN_ONLY = ['/admin/employees'];

/**
 * Map a pathname to the permission it requires. `action: null` means "any
 * access to the section" (e.g. viewing a list page). Returns null when the
 * route has no section-specific requirement (e.g. the dashboard).
 */
function requirementFor(
  pathname: string,
): { section: AdminSection; action: AdminAction | null } | null {
  const map: { prefix: string; section: AdminSection }[] = [
    { prefix: '/admin/properties', section: 'properties' },
    { prefix: '/admin/projects', section: 'projects' },
    { prefix: '/admin/blogs', section: 'blogs' },
  ];
  for (const { prefix, section } of map) {
    if (pathname === prefix || pathname.startsWith(prefix + '/')) {
      if (pathname.endsWith('/new')) return { section, action: 'add' };
      if (pathname.endsWith('/edit')) return { section, action: 'edit' };
      return { section, action: null };
    }
  }
  return null;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const role = roleFromCookie(req.cookies.get(ADMIN_COOKIE)?.value);
  const isAuthed = role !== null;

  // The login page is the only /admin route reachable while signed out.
  if (pathname === '/admin/login') {
    if (isAuthed) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return NextResponse.next();
  }

  // Guard everything else under /admin.
  if (!isAuthed) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  // The main admin can reach everything.
  if (role === 'admin') return NextResponse.next();

  // Employees can't reach admin-only sections.
  if (ADMIN_ONLY.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  // Gate section pages by the employee's granted permissions.
  const req_ = requirementFor(pathname);
  if (req_) {
    const perms: Permissions =
      decodePermissions(req.cookies.get(PERMS_COOKIE)?.value) ?? DEFAULT_EMPLOYEE_PERMISSIONS;
    const allowed =
      req_.action === null
        ? hasSectionAccess(perms, req_.section)
        : can(perms, req_.section, req_.action);
    if (!allowed) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
