import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CalendarDays, MapPin, Tag, ArrowRight, ExternalLink, Clock } from 'lucide-react';
import SafeImage from '@/components/common/SafeImage';
import { getAllNews } from '@/lib/news-data';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const item = getAllNews().find((n) => n.id === id);
  if (!item) return { title: 'News Not Found' };

  return {
    title: `${item.title} | Real Estate News`,
    description: item.excerpt,
  };
}

export default async function NewsDetailsPage({ params }: Props) {
  const { id } = await params;
  const allNews = getAllNews();
  const item = allNews.find((n) => n.id === id);

  if (!item) notFound();

  const related = allNews
    .filter((n) => n.id !== item.id && (n.city === item.city || n.category === item.category))
    .slice(0, 3);

  const isExternal = Boolean(item.url);

  return (
    <main className="min-h-screen bg-white">
      {/* Clean Header */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <Link 
            href="/news" 
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#005E60] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to News
          </Link>
        </div>
      </div>

      <article className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        {/* Meta Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 bg-[#005E60]/10 text-[#005E60] px-3 py-1 rounded-full text-xs font-semibold">
            <Tag className="w-3 h-3" />
            {item.category}
          </span>
          <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
            <MapPin className="w-3 h-3" />
            {item.city}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#101C2E] leading-tight mb-6 tracking-tight">
          {item.title}
        </h1>

        {/* Excerpt */}
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-6 font-light">
          {item.excerpt}
        </p>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 pb-6 mb-8 border-b border-gray-200 text-sm text-gray-600">
          <span className="font-semibold text-[#101C2E]">{item.source}</span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4" />
            {item.date}
          </span>
          {item.readTime && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {item.readTime}
            </span>
          )}
        </div>

        {/* Featured Image */}
        {item.image && (
          <div className="relative rounded-2xl overflow-hidden mb-10 bg-gray-100 aspect-[16/9]">
            <SafeImage 
              src={item.image} 
              alt={item.title} 
              fill 
              priority 
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover" 
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-lg prose-gray max-w-none
          prose-headings:text-[#101C2E] prose-headings:font-bold prose-headings:tracking-tight
          prose-h2:text-2xl md:text-3xl prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-xl md:text-2xl prose-h3:mt-8 prose-h3:mb-3
          prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-5
          prose-a:text-[#005E60] prose-a:font-semibold hover:prose-a:underline
          prose-strong:text-[#101C2E]
          prose-blockquote:border-l-4 prose-blockquote:border-[#005E60]
          prose-blockquote:bg-gray-50 prose-blockquote:py-3 prose-blockquote:px-6
          prose-blockquote:rounded-r-lg prose-blockquote:not-italic
          prose-img:rounded-xl
          mb-12">
          {item.content ? (
            <div dangerouslySetInnerHTML={{ __html: item.content }} />
          ) : (
            <p>{item.excerpt}</p>
          )}
        </div>

        {/* External Source */}
        {isExternal && (
          <a 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl p-5 mb-12 transition-colors group"
          >
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Read the full story on</p>
              <p className="text-sm font-bold text-[#101C2E] group-hover:text-[#005E60] transition-colors">{item.source}</p>
            </div>
            <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-[#005E60] transition-colors" />
          </a>
        )}

        {/* Related News */}
        {related.length > 0 && (
          <section className="border-t border-gray-200 pt-10 mb-12">
            <h2 className="text-2xl font-bold text-[#101C2E] mb-6 tracking-tight">Related News</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link 
                  key={r.id} 
                  href={`/news/${r.id}`} 
                  className="group block"
                >
                  <div className="relative h-44 rounded-xl overflow-hidden bg-gray-100 mb-3">
                    <SafeImage 
                      src={r.image} 
                      alt={r.title} 
                      fill 
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  <h3 className="text-sm font-bold text-[#101C2E] group-hover:text-[#005E60] transition-colors line-clamp-2 leading-snug mb-2">
                    {r.title}
                  </h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" /> {r.date}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="bg-[#005E60] rounded-2xl p-8 md:p-10 text-center text-white">
          <h3 className="text-xl md:text-2xl font-bold mb-3 tracking-tight">
            Need expert guidance on your next move?
          </h3>
          <p className="text-white/80 mb-6 text-sm md:text-base max-w-lg mx-auto">
            Our advisors turn market trends into the right property decision for you.
          </p>
          <Link 
            href="/contact-us" 
            className="inline-flex items-center gap-2 bg-white text-[#005E60] px-6 py-3 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors"
          >
            Talk to an Expert <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </article>
    </main>
  );
}