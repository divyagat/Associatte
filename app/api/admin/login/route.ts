import { NextRequest, NextResponse } from 'next/server';
import { findEmployeeByCredentials } from '@/lib/admin-users';
import { ADMIN_COOKIE } from '@/lib/admin-auth';
import {
  PERMS_COOKIE,
  ADMIN_PERMISSIONS,
  encodePermissions,
} from '@/lib/admin-permissions';

// Main admins (full access). Both accounts get identical, complete rights.
// Change credentials here, or override any of them via env vars in `.env`.
const MAIN_ADMINS: { email: string; password: string }[] = [
  // Divya Gate
  {
    email: (process.env.ADMIN_DIVYA_EMAIL || 'divyagate123@gmail.com').toLowerCase(),
    password: process.env.ADMIN_DIVYA_PASSWORD || 'divya123',
  },
  // Vikram sir  — TODO: confirm/change these to Vikram's real credentials.
  {
    email: (process.env.ADMIN_VIKRAM_EMAIL || 'vikram@associatte.com').toLowerCase(),
    password: process.env.ADMIN_VIKRAM_PASSWORD || 'vikram123',
  },
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // 1) Main admin (full access) — matches any account in MAIN_ADMINS.
    const normalizedEmail = email.trim().toLowerCase();
    const isMainAdmin = MAIN_ADMINS.some(
      (a) => a.email === normalizedEmail && a.password === password,
    );

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
