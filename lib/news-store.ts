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

/** Narrow arbitrary/stored input into a plain object we can safely index. */
function toRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === 'object' ? (v as Record<string, unknown>) : {};
}

function sanitizeItem(raw: unknown, i: number): NewsItem {
  const rec = toRecord(raw);
  const city: NewsItem['city'] = CITIES.includes(rec.city as NewsItem['city']) ? (rec.city as NewsItem['city']) : 'National';
  const item: NewsItem = {
    id: str(rec.id, 80) || `news_${Date.now()}_${i}`,
    title: str(rec.title, 200),
    excerpt: str(rec.excerpt, 600),
    image: str(rec.image, 1000),
    category: str(rec.category, 60) || 'News',
    city,
    source: str(rec.source, 120) || 'Associatte',
    date: str(rec.date, 40),
    url: str(rec.url, 1000) || undefined,
  };
  const content = str(rec.content, 20000);
  if (content) item.content = content;
  const readTime = str(rec.readTime, 40);
  if (readTime) item.readTime = readTime;
  return item;
}

/** Coerce arbitrary/stored input into a clean NewsItem[] (drops incomplete rows). */
export function sanitizeNewsList(raw: unknown): NewsItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map(sanitizeItem)
    .filter((n) => n.title && n.image)
    .slice(0, 200);
}

/** Full news list. Falls back to the seed defaults until an admin saves. */
export async function getAllNews(): Promise<NewsItem[]> {
  const data = await readJson<unknown>(NEWS_FILE, null);
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
export async function saveAllNews(list: unknown): Promise<NewsItem[]> {
  const clean = sanitizeNewsList(list);
  await writeJson(NEWS_FILE, clean);
  return clean;
}

export type { NewsItem } from './news-data';
