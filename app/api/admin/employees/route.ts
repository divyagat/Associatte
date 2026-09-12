import { NextRequest, NextResponse } from 'next/server';
import { getEmployees, createEmployee } from '@/lib/admin-users';
import { getRoleFromRequest } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  if (getRoleFromRequest(request) !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const employees = await getEmployees();
    return NextResponse.json(employees);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load employees';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

interface CreateEmployeeBody {
  name: string;
  email: string;
  password: string;
  permissions?: unknown;
}

export async function POST(request: NextRequest) {
  if (getRoleFromRequest(request) !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const body: CreateEmployeeBody = await request.json();
    const employee = await createEmployee(body);
    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create employee';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
