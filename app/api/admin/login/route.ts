import { NextRequest, NextResponse } from 'next/server';
import { findEmployeeByCredentials } from '@/lib/admin-users';
import { ADMIN_COOKIE } from '@/lib/admin-auth';

// Main admin credentials. Change these here (or move to env vars) when needed.
const ADMIN_EMAIL = 'divyagate123@gmail.com';
const ADMIN_PASSWORD = 'divya123';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // 1) Main admin (full access).
    const isMainAdmin =
      email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD;

    // 2) Otherwise, an employee account (limited access).
    const employee = isMainAdmin ? null : await findEmployeeByCredentials(email, password);

    if (!isMainAdmin && !employee) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const role = isMainAdmin ? 'admin' : 'employee';

    const response = NextResponse.json({ success: true, role });
    response.cookies.set(ADMIN_COOKIE, role, {
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
