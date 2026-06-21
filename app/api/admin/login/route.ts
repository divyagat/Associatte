import { NextRequest, NextResponse } from 'next/server';
import { findEmployeeByCredentials } from '@/lib/admin-users';
import { ADMIN_COOKIE } from '@/lib/admin-auth';
import {
  PERMS_COOKIE,
  ADMIN_PERMISSIONS,
  encodePermissions,
} from '@/lib/admin-permissions';

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

    // Snapshot the account's permissions into the session cookie so middleware
    // (edge — no file access) and API routes can authorize without re-reading
    // the store. Permission changes take effect on the employee's next login.
    const permissions = isMainAdmin ? ADMIN_PERMISSIONS : employee!.permissions;

    const cookieOpts = {
      httpOnly: true,
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours
      secure: process.env.NODE_ENV === 'production',
    };

    const response = NextResponse.json({ success: true, role });
    response.cookies.set(ADMIN_COOKIE, role, cookieOpts);
    response.cookies.set(PERMS_COOKIE, encodePermissions(permissions), cookieOpts);
    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
