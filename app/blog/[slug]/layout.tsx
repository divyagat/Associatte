// app/blog/[slug]/layout.tsx
//
// Per-article metadata + JSON-LD, derived from the same post the page renders
// (static posts in lib/blog-data, admin posts in the data store). Admin SEO
// panel overrides win, then the post's own SEO fields, then sensible defaults.
// New posts get all of this automatically the moment they're saved.

import type { Metadata } from 'next';
import { getSeoOverride, keywordsToArray } from '@/lib/seo-store';
import {
  blogCanonicalPath,
  blogAuthorName,
  blogDates,
  blogDescription,
  blogEligibility,
  blogImage,
  blogJsonLd,
  blogPath,
  findBlog,
} from '@/lib/seo/blogs';
import { JsonLd, breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { SITE_NAME } from '@/lib/seo/site';

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await findBlog(slug);
  if (!post) {
    return { title: 'Article not found', robots: { index: false, follow: false }, alternates: { canonical: null } };
  }

  const override = await getSeoOverride(blogPath(slug));
  const title = override?.title?.trim() || post.metaTitle?.trim() || `${post.title} | ${SITE_NAME}`;
  const description = override?.description?.trim() || blogDescription(post);
  const canonical = blogCanonicalPath(post);
  const image = blogImage(post);
  const keywords =
    keywordsToArray(override?.keywords) ||
    keywordsToArray(post.metaKeywords) ||
    (Array.isArray(post.tags) && post.tags.length ? post.tags : undefined);
  const { published, modified } = blogDates(post);
  const author = blogAuthorName(post);
  const { indexable } = blogEligibility(post);

  return {
    title: { absolute: title },
    description,
    ...(keywords ? { keywords } : {}),
    ...(author ? { authors: [{ name: author }] } : {}),
    alternates: { canonical },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      type: 'article',
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: 'en_IN',
      images: image ? [{ url: image, alt: post.title }] : undefined,
      publishedTime: published,
      modifiedTime: modified,
      ...(author ? { authors: [author] } : {}),
      ...(post.category ? { section: post.category } : {}),
      ...(Array.isArray(post.tags) && post.tags.length ? { tags: post.tags } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function BlogLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await findBlog(slug);

  if (!post) return children;

  const { article, faq } = blogJsonLd(post);
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Blog', path: '/blog' },
    { name: post.title, path: blogCanonicalPath(post) },
  ]);

  return (
    <>
      <JsonLd data={faq ? [article, faq, breadcrumb] : [article, breadcrumb]} />
      {children}
    </>
  );
}
