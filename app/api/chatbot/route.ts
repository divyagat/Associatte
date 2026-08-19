// app/api/chatbot/route.ts
//
// Public GET → the live chatbot config the widget uses to greet visitors and
// answer their questions. Admin-only PUT → save the config from the admin panel.

import { NextRequest, NextResponse } from 'next/server';
import { getRoleFromRequest } from '@/lib/admin-auth';
import { getChatbotConfig, saveChatbotConfig } from '@/lib/chatbot-store';
import { DEFAULT_CHATBOT_CONFIG } from '@/lib/chatbot-match';

// Always reflect the current data store — no build-time caching.
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json(await getChatbotConfig());
  } catch (error) {
    console.error('❌ Error in GET /api/chatbot:', error);
    // Never break the widget — fall back to the built-in defaults.
    return NextResponse.json(DEFAULT_CHATBOT_CONFIG, { status: 200 });
  }
}

export async function PUT(request: NextRequest) {
  // Managing the assistant is a main-admin capability (like Settings/Employees).
  if (getRoleFromRequest(request) !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const body = await request.json();
    const saved = await saveChatbotConfig(body);
    return NextResponse.json(saved);
  } catch (error: any) {
    console.error('❌ Error in PUT /api/chatbot:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to save chatbot config' },
      { status: 400 },
    );
  }
}
