import { NextResponse } from 'next/server';

const ADMIN_COOKIE = 'associatte_admin';

export async function POST() {
  const response = NextResponse.json({ success: true });
  // Expire the session cookie immediately.
  response.cookies.set(ADMIN_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}
