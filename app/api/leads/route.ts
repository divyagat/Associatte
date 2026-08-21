import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // your prisma / drizzle / mongoose instance

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, source, intent, capturedAt } = body;

    if (!phone || typeof phone !== 'string') {
      return NextResponse.json({ error: 'Invalid phone' }, { status: 400 });
    }

    // ✅ Save to your leads table — visible on Dashboard
    await db.lead.create({
      data: {
        phone,
        source: source ?? 'website',
        intent: intent ?? 'general',
        capturedAt: capturedAt ? new Date(capturedAt) : new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Lead capture failed:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}