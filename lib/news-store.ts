// lib/news-store.ts
// This file re-exports everything from news-data.ts so your API route works.

export { 
  getAllNews, 
  getNewsByCity, 
  saveAllNews 
} from './news-data';

export type { NewsItem } from './news-data';