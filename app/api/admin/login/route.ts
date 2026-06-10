import { NextRequest, NextResponse } from 'next/server';

// Admin credentials. Change these here (or move to env vars) when needed.
const ADMIN_EMAIL = 'divyagate123@gmail.com';
const ADMIN_PASSWORD = 'divya123';

const ADMIN_COOKIE = 'associatte_admin';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const emailOk = typeof email === 'string' && email.trim().toLowerCase() === ADMIN_EMAIL;
    const passwordOk = password === ADMIN_PASSWORD;

    if (!emailOk || !passwordOk) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_COOKIE, 'authenticated', {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours
      secure: process.env.NODE_ENV === 'production',
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
