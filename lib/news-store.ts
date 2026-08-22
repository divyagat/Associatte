// lib/news-store.ts
//
// Persists the admin-managed Real Estate News list to `data/news.json` via the
// same blob-store as the rest of the data layer (committed seed file → MongoDB
// after the first write). Public pages read it through /api/news; the admin
// panel (/admin/news) replaces the whole list with a single PUT.

import { readJson, writeJson } from './blob-store';
import type { NewsItem } from './news-data';

const NEWS_FILE = 'data/news.json';

const CITIES: NewsItem['city'][] = ['Pune', 'Mumbai', 'KDMC', 'National'];

function str(v: unknown, max: number): string {
  return String(v ?? '').trim().slice(0, max);
}

function sanitizeItem(raw: any, i: number): NewsItem {
  const city = (CITIES as string[]).includes(raw?.city) ? raw.city : 'National';
  const url = str(raw?.url, 1000);
  return {
    id: str(raw?.id, 60) || `news_${Date.now()}_${i}`,
    title: str(raw?.title, 200),
    excerpt: str(raw?.excerpt, 600),
    image: str(raw?.image, 1000),
    category: str(raw?.category, 60) || 'News',
    city: city as NewsItem['city'],
    source: str(raw?.source, 80) || 'Associatte',
    date: str(raw?.date, 40),
    url: url || undefined,
  };
}

/** Coerce arbitrary/stored input into a clean NewsItem[] (drops incomplete rows). */
export function sanitizeNewsList(raw: any): NewsItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map(sanitizeItem)
    .filter((n) => n.title && n.image)
    .slice(0, 200);
}

export async function getAllNews(): Promise<NewsItem[]> {
  const data = await readJson<any>(NEWS_FILE, []);
  return sanitizeNewsList(data);
}

/** Replace the entire news list (admin panel save). */
export async function saveAllNews(list: any): Promise<NewsItem[]> {
  const clean = sanitizeNewsList(list);
  await writeJson(NEWS_FILE, clean);
  return clean;
}
