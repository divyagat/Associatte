// app/api/news/route.ts
import { NextRequest, NextResponse } from 'next/server';
// import { getRoleFromRequest } from '@/lib/admin-auth';

// 👇 THIS LINE MUST SAY '@/lib/news-data', NOT '@/lib/news-store'
import { getAllNews, saveAllNews, type NewsItem } from '@/lib/news-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const news = getAllNews();
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (Array.isArray(body)) {
      saveAllNews(body);
    } else {
      const currentNews = getAllNews();
      const index = currentNews.findIndex((n) => n.id === body.id);
      
      if (index !== -1) {
        currentNews[index] = { ...currentNews[index], ...body };
      } else {
        currentNews.push(body as NewsItem);
      }
      saveAllNews(currentNews);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save news' }, { status: 500 });
  }
}