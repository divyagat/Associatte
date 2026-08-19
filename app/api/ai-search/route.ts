// app/api/ai-search/route.ts
//
// The single AI search endpoint shared by the AI search bar and the chatbot.
// It understands a natural-language requirement (merged with conversation
// context), then filters the SAME published property + project data the rest of
// the site reads. Never fabricates listings — results are real DB records.

import { NextRequest, NextResponse } from 'next/server';
import { getAllProperties, getAllProjects } from '@/lib/data-store';
import { getChatbotConfig } from '@/lib/chatbot-store';
import { isPubliclyVisible } from '@/lib/visibility';
import { assist, type SearchCriteria } from '@/lib/ai-search';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const cfg = await getChatbotConfig();
    if (!cfg.ai?.searchEnabled) {
      return NextResponse.json({ error: 'AI search is disabled', enabled: false }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const text = String(body?.text || '');
    const context = (body?.context && typeof body.context === 'object' ? body.context : {}) as SearchCriteria;

    const [properties, projects] = await Promise.all([getAllProperties(), getAllProjects()]);
    // Merge both listing types, keep only published, de-dupe by slug.
    const seen = new Set<string>();
    const listings = [...properties, ...projects]
      .filter(isPubliclyVisible)
      .filter((it: any) => {
        const key = String(it?.slug || it?._id || '');
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      });

    const result = assist(listings, text, context, { maxResults: cfg.ai.maxResults });
    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ Error in POST /api/ai-search:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
