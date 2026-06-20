import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Name of the admin session cookie (set in /api/admin/login). Its value is the
// signed-in role: `admin`, `employee`, or legacy `authenticated` (== admin).
export const ADMIN_COOKIE = 'associatte_admin';

function roleFromCookie(value: string | undefined): 'admin' | 'employee' | null {
  if (value === 'admin' || value === 'authenticated') return 'admin';
  if (value === 'employee') return 'employee';
  return null;
}

// Routes only the main admin may reach. Employees are redirected to /admin.
const ADMIN_ONLY = ['/admin/employees', '/admin/blogs'];

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

  // Employees can't reach admin-only sections.
  if (role === 'employee' && ADMIN_ONLY.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
