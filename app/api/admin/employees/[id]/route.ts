import { NextRequest, NextResponse } from 'next/server';
import { deleteEmployee, updateEmployee } from '@/lib/admin-users';
import { getRoleFromRequest } from '@/lib/admin-auth';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  if (getRoleFromRequest(request) !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const { id } = await context.params;
    const body = await request.json();
    const employee = await updateEmployee(id, {
      name: body.name,
      permissions: body.permissions,
    });
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }
    return NextResponse.json(employee);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update employee' }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  if (getRoleFromRequest(request) !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const { id } = await context.params;
    const ok = await deleteEmployee(id);
    if (!ok) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete employee' }, { status: 500 });
  }
}
