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
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to load employees' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (getRoleFromRequest(request) !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const body = await request.json();
    const employee = await createEmployee(body);
    return NextResponse.json(employee, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create employee' }, { status: 400 });
  }
}
