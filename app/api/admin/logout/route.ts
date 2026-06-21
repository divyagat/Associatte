import { NextResponse } from 'next/server';

const ADMIN_COOKIE = 'associatte_admin';
const PERMS_COOKIE = 'associatte_perms';

export async function POST() {
  const response = NextResponse.json({ success: true });
  // Expire the session cookies immediately.
  const expire = { httpOnly: true, sameSite: 'lax' as const, path: '/', maxAge: 0 };
  response.cookies.set(ADMIN_COOKIE, '', expire);
  response.cookies.set(PERMS_COOKIE, '', expire);
  return response;
}
