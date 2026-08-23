// lib/news-store.ts
//
// Server-only persistence for Real Estate News. Persists the admin-managed list
// to `data/news.json` via the shared blob-store (committed seed → filesystem →
// MongoDB after the first write), mirroring lib/awards-store.ts. Public pages
// read it through /api/news; /admin/news replaces the whole list with a PUT.
//
// NOTE: imports `fs` (via blob-store) → never import this from a client
// component. Client code uses the seed/types in lib/news-data.ts + /api/news.

import { readJson, writeJson } from './blob-store';
import { INITIAL_NEWS_ITEMS, type NewsItem } from './news-data';

const NEWS_FILE = 'data/news.json';

const CITIES: NewsItem['city'][] = ['Pune', 'Mumbai', 'KDMC', 'National'];

function str(v: unknown, max: number): string {
  return String(v ?? '').trim().slice(0, max);
}

function sanitizeItem(raw: any, i: number): NewsItem {
  const city: NewsItem['city'] = CITIES.includes(raw?.city) ? raw.city : 'National';
  const item: NewsItem = {
    id: str(raw?.id, 80) || `news_${Date.now()}_${i}`,
    title: str(raw?.title, 200),
    excerpt: str(raw?.excerpt, 600),
    image: str(raw?.image, 1000),
    category: str(raw?.category, 60) || 'News',
    city,
    source: str(raw?.source, 120) || 'Associatte',
    date: str(raw?.date, 40),
    url: str(raw?.url, 1000) || undefined,
  };
  const content = str(raw?.content, 20000);
  if (content) item.content = content;
  const readTime = str(raw?.readTime, 40);
  if (readTime) item.readTime = readTime;
  return item;
}

/** Coerce arbitrary/stored input into a clean NewsItem[] (drops incomplete rows). */
export function sanitizeNewsList(raw: any): NewsItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map(sanitizeItem)
    .filter((n) => n.title && n.image)
    .slice(0, 200);
}

/** Full news list. Falls back to the seed defaults until an admin saves. */
export async function getAllNews(): Promise<NewsItem[]> {
  const data = await readJson<any>(NEWS_FILE, null);
  const list = sanitizeNewsList(data);
  return list.length ? list : INITIAL_NEWS_ITEMS;
}

/** News for a city, including 'National' items that apply everywhere. */
export async function getNewsByCity(city: string, limit?: number): Promise<NewsItem[]> {
  const all = await getAllNews();
  const filtered = all.filter((n) => n.city === city || n.city === 'National');
  return typeof limit === 'number' ? filtered.slice(0, limit) : filtered;
}

/** Replace the entire news list (admin panel save). */
export async function saveAllNews(list: any): Promise<NewsItem[]> {
  const clean = sanitizeNewsList(list);
  await writeJson(NEWS_FILE, clean);
  return clean;
}

export type { NewsItem } from './news-data';
