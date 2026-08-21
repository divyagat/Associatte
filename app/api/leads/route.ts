import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createLead, deleteLead } from '@/lib/data-store';
import { getRoleFromRequest } from '@/lib/admin-auth';

// Capture a phone lead (e.g. the "Instant Property Alert" form on /calculator).
// Stored via the file/JSON data store and shown in the admin panel (/admin/leads).
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, source, intent, capturedAt } = body;

    if (!phone || typeof phone !== 'string') {
      return NextResponse.json({ error: 'Invalid phone' }, { status: 400 });
    }

    // Keep only digits and require a valid 10-digit Indian mobile number.
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 10) {
      return NextResponse.json({ error: 'Invalid phone' }, { status: 400 });
    }

    await createLead({
      phone: cleaned,
      source: source ?? 'website',
      intent: intent ?? 'general',
      capturedAt: capturedAt ?? new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Lead capture failed:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// Delete a lead (admin only). Called from the admin leads table.
export async function DELETE(req: NextRequest) {
  if (getRoleFromRequest(req) !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const id = new URL(req.url).searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }
  const ok = await deleteLead(id);
  if (!ok) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
