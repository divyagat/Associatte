export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  image: string;
  category: string;
  city: 'Pune' | 'Mumbai' | 'KDMC' | 'National';
  source: string;
  date: string;
  url?: string;
  readTime?: string;
}

const INITIAL_NEWS_ITEMS: NewsItem[] = [
  {
    id: 'n1',
    title: 'Pune Ring Road Phase 1 nears completion, boosting peripheral realty',
    excerpt: 'The eastern arc of the Pune Ring Road is expected to open next year, unlocking fresh residential demand in Wagholi, Manjari and the Sus–Mhalunge belt.',
    content: '<p>The eastern arc of the Pune Ring Road is expected to open next year.</p>',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
    category: 'Infrastructure',
    city: 'Pune',
    source: 'Associatte Research',
    date: 'Aug 18, 2026',
    readTime: '3 min read'
  },
  {
    id: 'n2',
    title: 'Navi Mumbai International Airport drives record housing launches',
    excerpt: 'Developers around Ulwe, Panvel and Kharghar report a surge in new launches as the airport ramps up operations.',
    image: 'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=1200&q=80',
    category: 'Market Trends',
    city: 'Mumbai',
    source: 'Associatte Research',
    date: 'Aug 14, 2026',
    readTime: '4 min read'
  },
  {
    id: 'n3',
    title: 'RBI holds repo rate, keeping home-loan EMIs steady for buyers',
    excerpt: 'The central bank’s status-quo on rates is expected to sustain festive-season demand across affordable and mid-income housing segments nationwide.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80',
    category: 'Home Loans',
    city: 'National',
    source: 'Associatte Research',
    date: 'Aug 10, 2026',
    readTime: '2 min read'
  },
  {
    id: 'n4',
    title: 'KDMC clears redevelopment policy for ageing Kalyan-Dombivli housing',
    excerpt: 'A streamlined cluster-redevelopment framework promises faster approvals and better amenities for thousands of older buildings across the KDMC belt.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
    category: 'Policy',
    city: 'KDMC',
    source: 'Associatte Research',
    date: 'Aug 06, 2026',
    readTime: '3 min read'
  }
];

let newsStore: NewsItem[] = [...INITIAL_NEWS_ITEMS];

export function getAllNews(): NewsItem[] {
  return newsStore;
}

export function getNewsByCity(city: string, limit?: number): NewsItem[] {
  const filtered = newsStore.filter(
    (n) => n.city === city || n.city === 'National',
  );
  return typeof limit === 'number' ? filtered.slice(0, limit) : filtered;
}

// 👇 THIS IS THE EXACT EXPORT THE ERROR IS ASKING FOR
export function saveAllNews(newItems: NewsItem[]): void {
  newsStore = newItems;
}