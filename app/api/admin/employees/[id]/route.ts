import { NextRequest, NextResponse } from 'next/server';
import { deleteEmployee } from '@/lib/admin-users';
import { getRoleFromRequest } from '@/lib/admin-auth';

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
