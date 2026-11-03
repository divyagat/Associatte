// app/news/[id]/layout.tsx
// Per-item news metadata. In a layout (not the page) so that when the page calls
// notFound(), the 404 still gets noindex and no inherited /news canonical.
import type { Metadata } from 'next';
import { getAllNews } from '@/lib/news-store';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const item = (await getAllNews()).find((n) => n.id === id);
  if (!item) {
    return { title: 'News not found', robots: { index: false, follow: false }, alternates: { canonical: null } };
  }

  // Items that are only a short excerpt (no article body) are kept for users but
  // not indexed — they are too thin to deserve their own search result.
  const words = String(item.content || '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  const indexable = words >= 150;

  return {
    title: `${item.title} | Real Estate News`,
    description: item.excerpt,
    alternates: { canonical: `/news/${item.id}` },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: true },
  };
}

export default function NewsItemLayout({ children }: { children: React.ReactNode }) {
  return children;
}
