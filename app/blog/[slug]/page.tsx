// app/blog/[slug]/page.tsx
//
// Loads the article on the server so the H1, body, FAQs and links are in the
// initial HTML (the interactive UI lives in BlogDetailClient). Unknown slugs
// return a real 404 instead of a 200 "Article not found" screen.

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { findBlog, getPublicBlogs, type PublicBlog } from '@/lib/seo/blogs';
import { CITY_PAGES, areaName, bhkSummary, getPublicListings, listingPath } from '@/lib/seo/listings';
import BlogDetailClient from './BlogDetailClient';

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getPublicBlogs()).map((b) => ({ slug: b.slug }));
}

function pickRelated(post: PublicBlog, all: PublicBlog[]): PublicBlog[] {
  const others = all.filter((b) => b.slug !== post.slug);
  const explicit = (post.relatedSlugs || [])
    .map((s) => others.find((b) => b.slug === s))
    .filter((b): b is PublicBlog => Boolean(b));
  const sameTopic = others.filter(
    (b) =>
      !explicit.includes(b) &&
      ((post.category && b.category === post.category) || (post.city && b.city === post.city)),
  );
  return [...explicit, ...sameTopic, ...others.filter((b) => !explicit.includes(b) && !sameTopic.includes(b))].slice(0, 3);
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await findBlog(slug);
  if (!post) notFound();

  const [blogs, listings] = await Promise.all([getPublicBlogs(), getPublicListings()]);
  const related = pickRelated(post, blogs);
  const recent = blogs.filter((b) => b.slug !== post.slug).slice(0, 4);

  // Projects in the city the article is about (e.g. "Pune" → /locations/pune).
  const cityKey = Object.keys(CITY_PAGES).find(
    (k) => k === String(post.city || '').toLowerCase().trim(),
  );
  const cityProjects = cityKey ? listings.filter((p) => String(p.location).toLowerCase() === cityKey).slice(0, 4) : [];

  return (
    <>
      <BlogDetailClient initialPost={post} initialRelated={related} initialRecent={recent} />

      {cityKey && cityProjects.length > 0 && (
        <section aria-labelledby="blog-projects-heading" className="container-site pb-16">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
            <h2 id="blog-projects-heading" className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Explore projects in {CITY_PAGES[cityKey].name}
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cityProjects.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={listingPath(p)}
                    className="block rounded-xl border border-gray-200 p-4 hover:border-[#005E60] hover:shadow-md transition-all"
                  >
                    <span className="block font-semibold text-gray-900">{p.name}</span>
                    <span className="block text-sm text-gray-600">
                      {[bhkSummary(p), areaName(p)].filter(Boolean).join(' · ')}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href={`/locations/${cityKey}`} className="inline-block mt-4 text-[#005E60] font-semibold hover:underline">
              All properties in {CITY_PAGES[cityKey].name} →
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
