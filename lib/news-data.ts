// lib/news-data.ts
// Real-estate news shown on the home page (RealEstateNewsSection) and the
// dedicated /news page. Edit the NEWS_ITEMS array below to add/update stories.
// Keep `id` unique and newest items first (they render in array order).

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  /** 'Pune' | 'Mumbai' | 'KDMC' | 'National' — 'National' shows for every city. */
  city: 'Pune' | 'Mumbai' | 'KDMC' | 'National';
  source: string;
  date: string;
  /** Optional external article link. When omitted the card links to /news. */
  url?: string;
}

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: 'n1',
    title: 'Pune Ring Road Phase 1 nears completion, boosting peripheral realty',
    excerpt:
      'The eastern arc of the Pune Ring Road is expected to open next year, unlocking fresh residential demand in Wagholi, Manjari and the Sus–Mhalunge belt.',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
    category: 'Infrastructure',
    city: 'Pune',
    source: 'Associatte Research',
    date: 'Aug 18, 2026',
  },
  {
    id: 'n2',
    title: 'Navi Mumbai International Airport drives record housing launches',
    excerpt:
      'Developers around Ulwe, Panvel and Kharghar report a surge in new launches as the airport ramps up operations, with prices up 20% year-on-year.',
    image: 'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=1200&q=80',
    category: 'Market Trends',
    city: 'Mumbai',
    source: 'Associatte Research',
    date: 'Aug 14, 2026',
  },
  {
    id: 'n3',
    title: 'RBI holds repo rate, keeping home-loan EMIs steady for buyers',
    excerpt:
      'The central bank’s status-quo on rates is expected to sustain festive-season demand across affordable and mid-income housing segments nationwide.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80',
    category: 'Home Loans',
    city: 'National',
    source: 'Associatte Research',
    date: 'Aug 10, 2026',
  },
  {
    id: 'n4',
    title: 'KDMC clears redevelopment policy for ageing Kalyan-Dombivli housing',
    excerpt:
      'A streamlined cluster-redevelopment framework promises faster approvals and better amenities for thousands of older buildings across the KDMC belt.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
    category: 'Policy',
    city: 'KDMC',
    source: 'Associatte Research',
    date: 'Aug 06, 2026',
  },
  {
    id: 'n5',
    title: 'Hinjewadi–Shivajinagar Metro line to reshape Pune office & home demand',
    excerpt:
      'The upcoming metro corridor is set to cut commute times for IT professionals, strengthening rental yields in Wakad, Baner and Hinjewadi.',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&q=80',
    category: 'Infrastructure',
    city: 'Pune',
    source: 'Associatte Research',
    date: 'Aug 02, 2026',
  },
  {
    id: 'n6',
    title: 'Maharashtra RERA tightens timelines to protect homebuyers',
    excerpt:
      'New compliance norms require developers to update project progress quarterly, improving transparency for buyers across Pune and Mumbai.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80',
    category: 'Policy',
    city: 'National',
    source: 'Associatte Research',
    date: 'Jul 28, 2026',
  },
];

// Helpers ---------------------------------------------------------------------

export function getAllNews(): NewsItem[] {
  return NEWS_ITEMS;
}

/** News for a city, always including 'National' stories, in array (newest-first) order. */
export function getNewsByCity(city: string, limit?: number): NewsItem[] {
  const filtered = NEWS_ITEMS.filter(
    (n) => n.city === city || n.city === 'National',
  );
  return typeof limit === 'number' ? filtered.slice(0, limit) : filtered;
}
