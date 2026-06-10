import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Name + expected value of the admin session cookie (set in /api/admin/login).
export const ADMIN_COOKIE = 'associatte_admin';
const AUTH_VALUE = 'authenticated';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAuthed = req.cookies.get(ADMIN_COOKIE)?.value === AUTH_VALUE;

  // The login page is the only /admin route reachable while signed out.
  if (pathname === '/admin/login') {
    if (isAuthed) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return NextResponse.next();
  }

  // Guard everything else under /admin.
  if (!isAuthed) {
    const loginUrl = new URL('/admin/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
